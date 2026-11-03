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
  "https://brosur-informasiweb-green.vercel.app",
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
      WHEN a.status = 'SUBMITTED' THEN 'Menunggu Verifikasi'
      WHEN a.status = 'NEEDS_REVISION' THEN 'Perlu Perbaikan'
      WHEN a.status = 'UNDER_REVIEW' THEN 'Menunggu Penetapan'
      WHEN a.status = 'WAITLISTED' THEN 'Daftar Tunggu'
      ELSE 'Menunggu Verifikasi'
    END AS "statusSeleksi",
    to_char(a.created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS "tanggalDaftar",
    COALESCE(a.application_metadata->>'nisn', '') AS nisn,
    COALESCE(a.application_metadata->>'nitkm', '') AS nitkm,
    COALESCE(a.application_metadata->>'className', '') AS "kelasTujuan",
    COALESCE(a.decision_note, 'Formulir pendaftaran daring diterima') AS keterangan,
    a.verification_note AS "verificationNote",
    COALESCE(a.missing_documents, '[]'::jsonb) AS "missingDocuments",
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

app.get("/cms/public", async (c) => {
  try {
    const result = await pool.query(`
      SELECT section_key AS "sectionKey", title, content, updated_at AS "updatedAt"
      FROM cms_sections
      WHERE publication_status = 'PUBLISHED'
      ORDER BY display_order, section_key
    `);
    return c.json({ sections: result.rows });
  } catch {
    return c.json({ error: "Konten website belum dapat dimuat." }, 503);
  }
});

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

  const ok = postgres === "ok" && objectStorage === "ok";
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

app.get("/status/:applicationNumber", async (c) => {
  const applicationNumber = cleanText(c.req.param("applicationNumber"), 80);
  const phone = cleanText(c.req.query("phone"), 30).replace(/[^+\d]/g, "");
  if (!applicationNumber || phone.replace(/\D/g, "").length < 9) {
    return c.json({ error: "Nomor pendaftaran dan WhatsApp wajib diisi." }, 400);
  }
  const result = await pool.query(
    `${applicationSelect} WHERE a.application_number = $1 AND g.phone = $2`,
    [applicationNumber, phone],
  );
  if (!result.rows[0]) return c.json({ error: "Data pendaftaran tidak ditemukan." }, 404);
  const row = result.rows[0];
  return c.json({
    applicationNumber: row.noPendaftaran,
    candidateName: row.nama,
    status: row.statusSeleksi,
    databaseStatus: row.databaseStatus,
    verificationNote: row.verificationNote,
    missingDocuments: row.missingDocuments,
    decisionNote: row.keterangan,
    className: row.kelasTujuan || null,
    updatedAt: row.tanggalDaftar,
  });
});

app.patch("/registrations/:id", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "ID pendaftaran tidak valid." }, 400);

  const body = await c.req.json<{
    action?: "VERIFY" | "DECIDE" | "PLACE";
    status?: string;
    decisionNote?: string;
    metadata?: Record<string, unknown>;
    missingDocuments?: string[];
  }>();
  const allowedStatuses = new Set(["UNDER_REVIEW", "ACCEPTED", "REJECTED", "WAITLISTED", "NEEDS_REVISION"]);
  if (!body.action || !body.status || !allowedStatuses.has(body.status)) return c.json({ error: "Aksi dan status tidak valid." }, 400);

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

    const previousStatus = current.rows[0].status as string;
    if (body.action === "VERIFY" && !["SUBMITTED", "NEEDS_REVISION"].includes(previousStatus)) {
      await client.query("ROLLBACK"); return c.json({ error: "Data ini sudah diverifikasi." }, 409);
    }
    if (body.action === "DECIDE" && previousStatus !== "UNDER_REVIEW") {
      await client.query("ROLLBACK"); return c.json({ error: "Calon siswa belum menunggu penetapan." }, 409);
    }
    if (body.action === "PLACE" && previousStatus !== "ACCEPTED") {
      await client.query("ROLLBACK"); return c.json({ error: "Penempatan hanya untuk calon yang lulus." }, 409);
    }
    if (body.action === "VERIFY" && body.status === "NEEDS_REVISION" && !body.missingDocuments?.length) {
      await client.query("ROLLBACK"); return c.json({ error: "Daftar kekurangan berkas wajib diisi." }, 400);
    }
    const note = cleanText(body.decisionNote, 1000) || null;
    const metadata = JSON.stringify(body.metadata ?? {});
    if (body.action === "PLACE") {
      const className = cleanText(body.metadata?.className, 80);
      const classSlug = cleanText(body.metadata?.classSlug, 80);
      const nisn = cleanText(body.metadata?.nisn, 40);
      const nitkm = cleanText(body.metadata?.nitkm, 40);
      if (!className || !nitkm) {
        await client.query("ROLLBACK");
        return c.json({ error: "Kelas dan nomor induk wajib diisi untuk penempatan." }, 400);
      }
      const details = await client.query(
        `SELECT a.candidate_name, a.candidate_gender, a.candidate_birth_place, a.candidate_birth_date,
                a.candidate_address, a.candidate_nik, a.primary_guardian_id, g.full_name, g.phone,
                c.id AS class_id
         FROM admission_applications a
         JOIN guardians g ON g.id = a.primary_guardian_id
         LEFT JOIN classes c ON c.class_name = $2 OR c.class_name = $3
         WHERE a.id = $1 LIMIT 1`,
        [id, className, classSlug],
      );
      if (!details.rows[0]?.class_id) {
        await client.query("ROLLBACK");
        return c.json({ error: "Kelas tujuan belum tersedia di master data." }, 409);
      }
      const student = await client.query(
        `INSERT INTO students (student_number, source_application_id, full_name, gender, birth_place, birth_date, address, admission_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, $8)
         ON CONFLICT (source_application_id) DO UPDATE SET student_number = EXCLUDED.student_number, updated_at = NOW()
         RETURNING id`,
        [nitkm, id, details.rows[0].candidate_name, details.rows[0].candidate_gender, details.rows[0].candidate_birth_place,
          details.rows[0].candidate_birth_date, details.rows[0].candidate_address, `NISN: ${nisn || "-"}`],
      );
      await client.query(
        `INSERT INTO student_guardians (student_id, guardian_id, relationship, is_primary_contact)
         VALUES ($1, $2, 'WALI', TRUE)
         ON CONFLICT (student_id, guardian_id) DO UPDATE SET is_primary_contact = TRUE`,
        [student.rows[0].id, details.rows[0].primary_guardian_id],
      );
      await client.query(
        `INSERT INTO class_enrollments (student_id, class_id, enrolled_at, status)
         VALUES ($1, $2, CURRENT_DATE, 'ACTIVE')
         ON CONFLICT DO NOTHING`,
        [student.rows[0].id, details.rows[0].class_id],
      );
      await client.query(
        `UPDATE admission_applications SET application_metadata = application_metadata || $2::jsonb, updated_at = NOW(), decision_note = COALESCE($3, decision_note) WHERE id = $1`,
        [id, metadata, note],
      );
    } else {
    await client.query(
      `UPDATE admission_applications
       SET status = $2::varchar(30),
           decision_at = CASE WHEN $2::varchar(30) IN ('ACCEPTED', 'REJECTED') THEN NOW() ELSE decision_at END,
           verified_at = CASE WHEN $5 = 'VERIFY' THEN NOW() ELSE verified_at END,
           verification_note = CASE WHEN $5 = 'VERIFY' THEN $3 ELSE verification_note END,
           missing_documents = CASE WHEN $5 = 'VERIFY' THEN $6::jsonb ELSE missing_documents END,
           decision_note = COALESCE($3, decision_note),
           application_metadata = application_metadata || $4::jsonb,
           updated_at = NOW()
       WHERE id = $1`,
      [id, body.status, note, metadata, body.action, JSON.stringify(body.missingDocuments ?? [])],
    );
    }
    await client.query(
      `INSERT INTO admission_status_histories (application_id, previous_status, new_status, note)
       VALUES ($1, $2, $3, $4)`,
      [id, previousStatus, body.action === "PLACE" ? previousStatus : body.status, note || (body.action === "PLACE" ? "Penempatan kelas dan nomor induk ditetapkan admin." : null)],
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
    const placedStudent = await client.query(
      "SELECT id FROM students WHERE source_application_id = $1",
      [id],
    );
    for (const student of placedStudent.rows) {
      await client.query("DELETE FROM class_enrollments WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM student_guardians WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM attendance_records WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM student_assessments WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM report_cards WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM bills WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM student_documents WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM students WHERE id = $1", [student.id]);
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
