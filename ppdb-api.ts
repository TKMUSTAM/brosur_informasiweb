import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { attachDatabasePool } from "@neon/functions";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { Hono } from "hono";
import { Pool, type PoolClient } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_API_KEY = process.env.PPDB_ADMIN_API_KEY;

if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!ADMIN_API_KEY) throw new Error("PPDB_ADMIN_API_KEY is required");

const pool = new Pool({ connectionString: DATABASE_URL, max: 5 });
attachDatabasePool(pool);

const s3 = new S3Client({ forcePathStyle: true });
const expectedAdminKey = Buffer.from(ADMIN_API_KEY);
const allowedOrigins = new Set([
  "https://yayasanmustam.id",
  "https://www.yayasanmustam.id",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

type RegistrationInput = {
  name?: unknown;
  nik?: unknown;
  birthPlace?: unknown;
  birthDate?: unknown;
  gender?: unknown;
  address?: unknown;
  previousSchool?: unknown;
  program?: unknown;
  track?: unknown;
  parentFather?: unknown;
  parentMother?: unknown;
  whatsapp?: unknown;
  email?: unknown;
  guardianAddress?: unknown;
};

type NormalizedRegistration = {
  name: string;
  nik: string | null;
  birthPlace: string | null;
  birthDate: string;
  gender: "L" | "P";
  address: string | null;
  previousSchool: string | null;
  program: string;
  track: "Reguler" | "Beasiswa Yatim & Dhuafa";
  parentFather: string | null;
  parentMother: string | null;
  guardianName: string;
  whatsapp: string;
  email: string | null;
  guardianAddress: string | null;
};

const app = new Hono();

app.use("*", async (c, next) => {
  const origin = c.req.header("origin");
  const isAllowedOrigin = origin ? allowedOrigins.has(origin) : false;

  if (c.req.method === "OPTIONS") {
    if (!origin || !isAllowedOrigin) return c.body(null, 204);
    return c.body(null, 204, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    });
  }

  await next();

  if (isAllowedOrigin) {
    c.header("Access-Control-Allow-Origin", origin);
    c.header("Vary", "Origin");
  }
});

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeRegistration(input: RegistrationInput): NormalizedRegistration {
  const name = cleanText(input.name, 150);
  const birthDate = cleanText(input.birthDate, 10);
  const rawGender = cleanText(input.gender, 30).toLowerCase();
  const program = cleanText(input.program, 100);
  const rawTrack = cleanText(input.track, 80);
  const parentFather = cleanText(input.parentFather, 150) || null;
  const parentMother = cleanText(input.parentMother, 150) || null;
  const whatsapp = cleanText(input.whatsapp, 30).replace(/[^+\d]/g, "");
  const email = cleanText(input.email, 255).toLowerCase() || null;

  if (name.length < 2) throw new Error("Nama calon siswa wajib diisi.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) throw new Error("Tanggal lahir tidak valid.");
  if (!program) throw new Error("Program tujuan wajib dipilih.");
  if (!parentFather && !parentMother) throw new Error("Nama orang tua atau wali wajib diisi.");
  if (whatsapp.replace(/\D/g, "").length < 9) throw new Error("Nomor WhatsApp tidak valid.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Alamat email tidak valid.");

  return {
    name,
    nik: cleanText(input.nik, 32) || null,
    birthPlace: cleanText(input.birthPlace, 100) || null,
    birthDate,
    gender: rawGender.startsWith("p") ? "P" : "L",
    address: cleanText(input.address, 1000) || null,
    previousSchool: cleanText(input.previousSchool, 180) || null,
    program,
    track: rawTrack === "Beasiswa Yatim & Dhuafa" ? rawTrack : "Reguler",
    parentFather,
    parentMother,
    guardianName: parentFather ?? parentMother!,
    whatsapp,
    email,
    guardianAddress: cleanText(input.guardianAddress, 1000) || null,
  };
}

function hasAdminAccess(request: Request): boolean {
  const header = request.headers.get("x-admin-key");
  if (!header) return false;
  const provided = Buffer.from(header);
  if (provided.byteLength !== expectedAdminKey.byteLength) return false;
  return timingSafeEqual(provided, expectedAdminKey);
}

function applicationNumber(program: string): string {
  const programCode = program.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() || "TK";
  return `PPDB-MSTM-${new Date().getFullYear()}-${programCode}-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

const applicationSelect = `
  SELECT
    a.id::text AS id,
    a.application_number AS "noPendaftaran",
    a.candidate_name AS nama,
    COALESCE(a.candidate_gender, 'L') AS gender,
    COALESCE(to_char(a.candidate_birth_date, 'YYYY-MM-DD'), '') AS "tanggalLahir",
    a.candidate_birth_place AS "tempatLahir",
    a.candidate_nik AS nik,
    a.candidate_address AS alamat,
    g.full_name AS "namaWali",
    COALESCE(g.phone, '') AS "teleponWali",
    g.father_name AS "namaAyah",
    g.mother_name AS "namaIbu",
    CASE WHEN a.admission_track = 'Beasiswa Yatim & Dhuafa'
      THEN 'Beasiswa Yatim 100%' ELSE 'Reguler' END AS jalur,
    CASE
      WHEN a.status IN ('ACCEPTED', 'COMPLETED') THEN 'Lulus'
      WHEN a.status = 'REJECTED' THEN 'Tidak Lulus'
      ELSE 'Menunggu Seleksi'
    END AS "statusSeleksi",
    to_char(a.created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS "tanggalDaftar",
    COALESCE(a.application_metadata->>'nisn', '') AS nisn,
    COALESCE(a.application_metadata->>'nitkm', '') AS nitkm,
    COALESCE(a.application_metadata->>'className', '') AS "kelasTujuan",
    COALESCE(a.decision_note, 'Formulir pendaftaran daring diterima') AS keterangan,
    a.status AS "databaseStatus",
    a.target_program AS program,
    a.previous_school AS "previousSchool",
    g.email AS email
  FROM admission_applications a
  JOIN guardians g ON g.id = a.primary_guardian_id
`;

async function findApplication(client: PoolClient | typeof pool, id: string) {
  const result = await client.query(`${applicationSelect} WHERE a.id = $1`, [id]);
  return result.rows[0] ?? null;
}

app.get("/", (c) => c.json({ service: "TK Al-Mustam PPDB API", status: "ok" }));

app.get("/health", async (c) => {
  const postgres = await pool.query("SELECT 1 AS ok").then(() => "ok").catch(() => "error");

  const objectStorage = process.env.AWS_ENDPOINT_URL_S3
    ? await s3.send(new ListObjectsV2Command({ Bucket: "ppdb-documents", MaxKeys: 1 })).then(() => "ok").catch(() => "error")
    : "not_configured";

  const gatewayBaseUrl = process.env.NEON_AI_GATEWAY_BASE_URL;
  const gatewayToken = process.env.NEON_AI_GATEWAY_TOKEN;
  const aiGateway = gatewayBaseUrl && gatewayToken
    ? await fetch(`${gatewayBaseUrl}/v1/models`, {
        headers: { Authorization: `Bearer ${gatewayToken}` },
      }).then(async (response) => {
        if (!response.ok) return "error";
        const payload = await response.json() as { data?: Array<{ enabled?: boolean }> };
        return payload.data?.some((model) => model.enabled) ? "ok" : "no_enabled_models";
      }).catch(() => "error")
    : "not_configured";

  const ok = postgres === "ok" && objectStorage === "ok" && aiGateway === "ok";
  return c.json({ ok, services: { postgres, objectStorage, aiGateway } }, ok ? 200 : 503);
});

app.post("/registrations", async (c) => {
  const contentLength = Number(c.req.header("content-length") ?? "0");
  if (contentLength > 64 * 1024) return c.json({ error: "Payload terlalu besar." }, 413);

  let registration: NormalizedRegistration;
  try {
    registration = normalizeRegistration(await c.req.json<RegistrationInput>());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Data pendaftaran tidak valid.";
    return c.json({ error: message }, 400);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const duplicate = await client.query(
      `SELECT a.application_number
       FROM admission_applications a
       JOIN guardians g ON g.id = a.primary_guardian_id
       WHERE lower(a.candidate_name) = lower($1)
         AND g.phone = $2
         AND a.created_at > NOW() - INTERVAL '10 minutes'
       ORDER BY a.created_at DESC
       LIMIT 1`,
      [registration.name, registration.whatsapp],
    );
    if (duplicate.rows[0]) {
      await client.query("ROLLBACK");
      return c.json({
        applicationNumber: duplicate.rows[0].application_number,
        duplicate: true,
      }, 200);
    }

    const period = await client.query(
      `SELECT id
       FROM admission_periods
       WHERE status = 'OPEN'
         AND NOW() BETWEEN registration_start AND registration_end
       ORDER BY registration_start DESC
       LIMIT 1`,
    );
    if (!period.rows[0]) {
      await client.query("ROLLBACK");
      return c.json({ error: "Periode pendaftaran belum dibuka." }, 503);
    }

    const guardian = await client.query(
      `INSERT INTO guardians (
         full_name, phone, email, address, father_name, mother_name
       ) VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        registration.guardianName,
        registration.whatsapp,
        registration.email,
        registration.guardianAddress,
        registration.parentFather,
        registration.parentMother,
      ],
    );

    const number = applicationNumber(registration.program);
    const application = await client.query(
      `INSERT INTO admission_applications (
         admission_period_id,
         primary_guardian_id,
         application_number,
         candidate_name,
         candidate_gender,
         candidate_birth_place,
         candidate_birth_date,
         candidate_address,
         candidate_nik,
         previous_school,
         target_program,
         admission_track,
         status,
         submitted_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'SUBMITTED', NOW())
       RETURNING id, created_at`,
      [
        period.rows[0].id,
        guardian.rows[0].id,
        number,
        registration.name,
        registration.gender,
        registration.birthPlace,
        registration.birthDate,
        registration.address ?? registration.guardianAddress,
        registration.nik,
        registration.previousSchool,
        registration.program,
        registration.track,
      ],
    );

    await client.query(
      `INSERT INTO admission_status_histories (application_id, previous_status, new_status, note)
       VALUES ($1, NULL, 'SUBMITTED', 'Dikirim dari formulir PPDB web informasi')`,
      [application.rows[0].id],
    );

    await client.query("COMMIT");
    return c.json({
      id: application.rows[0].id,
      applicationNumber: number,
      submittedAt: application.rows[0].created_at,
    }, 201);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[ppdb:create]", error);
    return c.json({ error: "Pendaftaran belum dapat disimpan. Silakan coba lagi." }, 500);
  } finally {
    client.release();
  }
});

app.get("/registrations", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  try {
    const result = await pool.query(`${applicationSelect} ORDER BY a.created_at DESC`);
    return c.json({ applications: result.rows });
  } catch (error) {
    console.error("[ppdb:list]", error);
    return c.json({ error: "Data pendaftaran belum dapat dimuat." }, 500);
  }
});

app.patch("/registrations/:id", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "ID pendaftaran tidak valid." }, 400);

  const body = await c.req.json<{
    status?: string;
    decisionNote?: string;
    metadata?: Record<string, unknown>;
  }>();
  const allowedStatuses = new Set(["UNDER_REVIEW", "ACCEPTED", "REJECTED", "WAITLISTED", "NEEDS_REVISION"]);
  if (!body.status || !allowedStatuses.has(body.status)) return c.json({ error: "Status tidak valid." }, 400);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const current = await client.query(
      "SELECT status FROM admission_applications WHERE id = $1 FOR UPDATE",
      [id],
    );
    if (!current.rows[0]) {
      await client.query("ROLLBACK");
      return c.json({ error: "Pendaftaran tidak ditemukan." }, 404);
    }

    const note = cleanText(body.decisionNote, 1000) || null;
    const metadata = JSON.stringify(body.metadata ?? {});
    await client.query(
      `UPDATE admission_applications
       SET status = $2::varchar(30),
           decision_at = CASE WHEN $2::varchar(30) IN ('ACCEPTED', 'REJECTED') THEN NOW() ELSE decision_at END,
           decision_note = COALESCE($3, decision_note),
           application_metadata = application_metadata || $4::jsonb,
           updated_at = NOW()
       WHERE id = $1`,
      [id, body.status, note, metadata],
    );
    await client.query(
      `INSERT INTO admission_status_histories (application_id, previous_status, new_status, note)
       VALUES ($1, $2, $3, $4)`,
      [id, current.rows[0].status, body.status, note],
    );
    const application = await findApplication(client, id);
    await client.query("COMMIT");
    return c.json({ application });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[ppdb:update]", error);
    return c.json({ error: "Status pendaftaran belum dapat diperbarui." }, 500);
  } finally {
    client.release();
  }
});

app.delete("/registrations/:id", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "ID pendaftaran tidak valid." }, 400);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const application = await client.query(
      "SELECT primary_guardian_id FROM admission_applications WHERE id = $1 FOR UPDATE",
      [id],
    );
    if (!application.rows[0]) {
      await client.query("ROLLBACK");
      return c.json({ error: "Pendaftaran tidak ditemukan." }, 404);
    }
    await client.query("DELETE FROM admission_status_histories WHERE application_id = $1", [id]);
    await client.query("DELETE FROM admission_documents WHERE application_id = $1", [id]);
    await client.query("DELETE FROM admission_applications WHERE id = $1", [id]);
    await client.query("DELETE FROM guardians WHERE id = $1", [application.rows[0].primary_guardian_id]);
    await client.query("COMMIT");
    return c.body(null, 204);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[ppdb:delete]", error);
    return c.json({ error: "Data pendaftaran belum dapat dihapus." }, 500);
  } finally {
    client.release();
  }
});

export default app;
