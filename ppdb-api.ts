import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
  fatherNik?: unknown;
  motherNik?: unknown;
  familyCardNumber?: unknown;
  medicalNotes?: unknown;
  whatsapp?: unknown;
  email?: unknown;
  guardianAddress?: unknown;
};

type NormalizedRegistration = {
  name: string;
  nik: string;
  birthPlace: string | null;
  birthDate: string;
  gender: "L" | "P";
  address: string | null;
  previousSchool: string | null;
  program: string;
  track: "Reguler" | "Beasiswa Yatim & Dhuafa";
  parentFather: string | null;
  parentMother: string | null;
  fatherNik: string | null;
  motherNik: string | null;
  guardianNik: string | null;
  familyCardNumber: string | null;
  medicalNotes: string | null;
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

function canonicalPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0062")) return `0${digits.slice(4)}`;
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  if (digits.startsWith("8")) return `0${digits}`;
  return digits;
}

function normalizeRegistration(input: RegistrationInput): NormalizedRegistration {
  const name = cleanText(input.name, 150);
  const birthDate = cleanText(input.birthDate, 10);
  const rawGender = cleanText(input.gender, 30).toLowerCase();
  const program = cleanText(input.program, 100);
  const rawTrack = cleanText(input.track, 80);
  const parentFather = cleanText(input.parentFather, 150) || null;
  const parentMother = cleanText(input.parentMother, 150) || null;
  const nik = cleanText(input.nik, 32).replace(/\D/g, "");
  const fatherNik = cleanText(input.fatherNik, 32).replace(/\D/g, "") || null;
  const motherNik = cleanText(input.motherNik, 32).replace(/\D/g, "") || null;
  const familyCardNumber = cleanText(input.familyCardNumber, 32).replace(/\D/g, "") || null;
  const whatsapp = cleanText(input.whatsapp, 30).replace(/[^+\d]/g, "");
  const email = cleanText(input.email, 255).toLowerCase() || null;

  if (name.length < 2) throw new Error("Nama calon siswa wajib diisi.");
  if (!/^\d{16}$/.test(nik)) throw new Error("NIK calon siswa wajib terdiri dari 16 digit.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) throw new Error("Tanggal lahir tidak valid.");
  if (!program) throw new Error("Program tujuan wajib dipilih.");
  if (!parentFather && !parentMother) throw new Error("Nama orang tua atau wali wajib diisi.");
  if (fatherNik && !/^\d{16}$/.test(fatherNik)) throw new Error("NIK ayah wajib terdiri dari 16 digit.");
  if (motherNik && !/^\d{16}$/.test(motherNik)) throw new Error("NIK ibu wajib terdiri dari 16 digit.");
  if (familyCardNumber && !/^\d{16}$/.test(familyCardNumber)) throw new Error("Nomor KK wajib terdiri dari 16 digit.");
  if (whatsapp.replace(/\D/g, "").length < 9) throw new Error("Nomor WhatsApp tidak valid.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Alamat email tidak valid.");

  return {
    name,
    nik,
    birthPlace: cleanText(input.birthPlace, 100) || null,
    birthDate,
    gender: rawGender.startsWith("p") ? "P" : "L",
    address: cleanText(input.address, 1000) || null,
    previousSchool: cleanText(input.previousSchool, 180) || null,
    program,
    track: rawTrack === "Beasiswa Yatim & Dhuafa" ? rawTrack : "Reguler",
    parentFather,
    parentMother,
    fatherNik,
    motherNik,
    guardianNik: parentFather ? fatherNik : motherNik,
    familyCardNumber,
    medicalNotes: cleanText(input.medicalNotes, 2000) || null,
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

function actorId(request: Request): string | null {
  const value = request.headers.get("x-app-user-id");
  return value && /^[0-9a-f-]{36}$/i.test(value) ? value : null;
}

function applicationNumber(program: string): string {
  const programCode = program.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() || "TK";
  return `PPDB-MSTM-${new Date().getFullYear()}-${programCode}-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function educationLevelCode(program: string): "PLAYGROUP" | "TK_A" | "TK_B" {
  const value = program.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (value.includes("TKA")) return "TK_A";
  if (value.includes("TKB")) return "TK_B";
  return "PLAYGROUP";
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
    g.family_card_number AS "noKk",
    g.father_nik AS "nikAyah",
    g.mother_nik AS "nikIbu",
    a.medical_notes AS "catatanMedis",
    CASE WHEN a.admission_track = 'Beasiswa Yatim & Dhuafa'
      THEN 'Beasiswa Yatim 100%' ELSE 'Reguler' END AS jalur,
    CASE
      WHEN a.status IN ('ACCEPTED', 'COMPLETED') THEN 'Lulus'
      WHEN a.status = 'REJECTED' THEN 'Tidak Lulus'
      WHEN a.status = 'SUBMITTED' THEN 'Menunggu Verifikasi'
      WHEN a.status = 'NEEDS_REVISION' THEN 'Perlu Perbaikan'
      WHEN a.status = 'UNDER_REVIEW' THEN 'Menunggu Jadwal Wawancara'
      WHEN a.status = 'INTERVIEW_SCHEDULED' THEN 'Wawancara Terjadwal'
      WHEN a.status = 'INTERVIEW_COMPLETED' THEN 'Menunggu Penetapan'
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
    g.email AS email,
    i.scheduled_at AS "interviewScheduledAt",
    i.location AS "interviewLocation",
    i.interview_status AS "interviewStatus",
    i.observation_notes AS "observationNotes",
    i.recommendation AS "interviewRecommendation",
    assessment.total_score AS "interviewTotalScore",
    COALESCE((
      SELECT jsonb_object_agg(criterion.criterion_code, detail.score)
      FROM admission_assessment_details detail
      JOIN admission_evaluation_criteria criterion ON criterion.id = detail.criterion_id
      WHERE detail.assessment_id = assessment.id
    ), '{}'::jsonb) AS "interviewScores",
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', d.id::text,
        'type', d.document_type,
        'fileName', d.file_name,
        'status', d.verification_status,
        'note', d.verification_note
      ) ORDER BY d.uploaded_at)
      FROM admission_documents d
      WHERE d.application_id = a.id
    ), '[]'::jsonb) AS documents
  FROM admission_applications a
  JOIN guardians g ON g.id = a.primary_guardian_id
  LEFT JOIN admission_interviews i ON i.application_id = a.id
  LEFT JOIN admission_assessments assessment ON assessment.application_id = a.id
`;

async function findApplication(client: PoolClient | typeof pool, id: string) {
  const result = await client.query(`${applicationSelect} WHERE a.id = $1`, [id]);
  return result.rows[0] ?? null;
}

app.get("/", (c) => c.json({ service: "TK Al-Mustam PPDB API", status: "ok" }));

app.get("/ppdb/meta", async (c) => {
  try {
    const [periods, classes, documentTypes] = await Promise.all([
      pool.query(`
        SELECT
          p.id::text,
          p.period_name AS name,
          p.registration_start::text AS "registrationStart",
          p.registration_end::text AS "registrationEnd",
          p.status,
          ay.year_name AS "academicYear"
        FROM admission_periods p
        JOIN academic_years ay ON ay.id = p.academic_year_id
        WHERE p.status IN ('OPEN', 'DRAFT')
        ORDER BY p.registration_start ASC
      `),
      pool.query(`
        SELECT
          c.id::text,
          c.class_name AS "className",
          c.class_level AS "classLevel",
          c.capacity,
          el.level_code AS "levelCode",
          el.level_name AS "levelName",
          COUNT(ce.id) FILTER (WHERE ce.status = 'ACTIVE')::int AS "enrolledCount"
        FROM classes c
        LEFT JOIN education_levels el ON el.id = c.education_level_id
        LEFT JOIN class_enrollments ce ON ce.class_id = c.id
        WHERE c.status = 'ACTIVE'
        GROUP BY c.id, el.level_code, el.level_name
        ORDER BY c.class_name ASC
      `),
      pool.query(`
        SELECT
          document_code AS code,
          document_name AS name,
          is_required AS "isRequired",
          description
        FROM admission_document_types
        WHERE status = 'ACTIVE'
        ORDER BY is_required DESC, document_code ASC
      `),
    ]);

    return c.json({
      periods: periods.rows,
      classes: classes.rows,
      documentTypes: documentTypes.rows,
    });
  } catch (error) {
    console.error("[ppdb:meta]", error);
    return c.json({ error: "Informasi PPDB belum dapat dimuat." }, 503);
  }
});

app.get("/cms/public", async (c) => {
  try {
    const [sections, news, programs, facilities, gallery, pages, periods] = await Promise.all([
      pool.query(`
        SELECT section_key AS "sectionKey", title, content, updated_at AS "updatedAt"
        FROM cms_sections
        WHERE publication_status = 'PUBLISHED'
        ORDER BY display_order, section_key
      `),
      pool.query(`
        SELECT
          n.id::text,
          n.title,
          n.slug,
          n.excerpt,
          n.content,
          n.cover_image_path AS "image",
          COALESCE(to_char(n.published_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD'), to_char(n.created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')) AS "date",
          COALESCE(u.display_name, 'Admin Sekolah') AS author
        FROM news_posts n
        LEFT JOIN users u ON u.id = n.author_id
        WHERE n.status = 'PUBLISHED'
        ORDER BY n.published_at DESC NULLS LAST, n.created_at DESC
      `),
      pool.query(`
        SELECT
          id::text,
          program_name AS name,
          description,
          image_path AS image,
          display_order AS "displayOrder"
        FROM school_programs
        WHERE status = 'ACTIVE'
        ORDER BY display_order ASC, program_name ASC
      `),
      pool.query(`
        SELECT
          id::text,
          facility_name AS name,
          description,
          image_path AS image,
          display_order AS "displayOrder"
        FROM school_facilities
        WHERE status = 'ACTIVE'
        ORDER BY display_order ASC, facility_name ASC
      `),
      pool.query(`
        SELECT
          gi.id::text,
          ga.album_name AS category,
          ga.event_date::text AS "eventDate",
          gi.image_path AS src,
          gi.caption,
          gi.display_order AS "displayOrder"
        FROM gallery_items gi
        JOIN gallery_albums ga ON ga.id = gi.album_id
        WHERE ga.status = 'ACTIVE'
        ORDER BY gi.display_order ASC, gi.created_at DESC
      `),
      pool.query(`
        SELECT slug, title, content, published_at::text AS "publishedAt"
        FROM cms_pages
        WHERE publication_status = 'PUBLISHED'
        ORDER BY title ASC
      `),
      pool.query(`
        SELECT
          p.id::text,
          p.period_name AS name,
          p.registration_start::text AS "registrationStart",
          p.registration_end::text AS "registrationEnd",
          p.status,
          ay.year_name AS "academicYear"
        FROM admission_periods p
        JOIN academic_years ay ON ay.id = p.academic_year_id
        ORDER BY p.registration_start ASC
      `),
    ]);
    return c.json({
      sections: sections.rows,
      news: news.rows,
      programs: programs.rows,
      facilities: facilities.rows,
      gallery: gallery.rows,
      pages: pages.rows,
      periods: periods.rows,
    });
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
      `SELECT a.id, a.application_number, g.phone
       FROM admission_applications a
       JOIN guardians g ON g.id = a.primary_guardian_id
       WHERE a.candidate_nik = $1
       ORDER BY a.created_at DESC
       LIMIT 1`,
      [registration.nik],
    );
    if (duplicate.rows[0]) {
      await client.query("ROLLBACK");
      if (canonicalPhone(String(duplicate.rows[0].phone ?? "")) !== canonicalPhone(registration.whatsapp)) {
        return c.json({ error: "NIK calon siswa sudah terdaftar. Hubungi Admin PPDB jika data perlu diperbaiki." }, 409);
      }
      return c.json({
        id: duplicate.rows[0].id,
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
         full_name, nik, phone, email, address, father_name, mother_name,
         family_card_number, father_nik, mother_nik
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (nik) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         phone = EXCLUDED.phone,
         email = COALESCE(EXCLUDED.email, guardians.email),
         address = COALESCE(EXCLUDED.address, guardians.address),
         father_name = COALESCE(EXCLUDED.father_name, guardians.father_name),
         mother_name = COALESCE(EXCLUDED.mother_name, guardians.mother_name),
         family_card_number = COALESCE(EXCLUDED.family_card_number, guardians.family_card_number),
         father_nik = COALESCE(EXCLUDED.father_nik, guardians.father_nik),
         mother_nik = COALESCE(EXCLUDED.mother_nik, guardians.mother_nik),
         updated_at = NOW()
       RETURNING id`,
      [
        registration.guardianName,
        registration.guardianNik,
        registration.whatsapp,
        registration.email,
        registration.guardianAddress,
        registration.parentFather,
        registration.parentMother,
        registration.familyCardNumber,
        registration.fatherNik,
        registration.motherNik,
      ],
    );

    const educationLevel = await client.query(
      "SELECT id FROM education_levels WHERE level_code = $1 AND status = 'ACTIVE' LIMIT 1",
      [educationLevelCode(registration.program)],
    );
    if (!educationLevel.rows[0]) {
      await client.query("ROLLBACK");
      return c.json({ error: "Jenjang pendidikan belum tersedia pada master data." }, 409);
    }

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
         medical_notes,
         education_level_id,
         family_card_number,
         status,
         submitted_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'SUBMITTED', NOW())
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
        registration.medicalNotes,
        educationLevel.rows[0].id,
        registration.familyCardNumber,
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

const documentTypes = new Set([
  "KARTU_KELUARGA",
  "AKTA_KELAHIRAN",
  "KTP_WALI",
  "RIWAYAT_KESEHATAN",
  "PAS_FOTO",
]);
const documentMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const cmsMediaMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
]);

async function storeApplicationDocument(params: {
  applicationId: string;
  applicationNumber: string;
  currentStatus: string;
  documentType: string;
  file: File;
  isRevisionUpload: boolean;
}) {
  const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "document";
  const objectKey = `registrations/${params.applicationId}/${params.documentType}/${randomUUID()}-${safeName}`;
  const previous = await pool.query(
    "SELECT file_path FROM admission_documents WHERE application_id = $1 AND document_type = $2",
    [params.applicationId, params.documentType],
  );

  try {
    await s3.send(new PutObjectCommand({
      Bucket: "ppdb-documents",
      Key: objectKey,
      Body: new Uint8Array(await params.file.arrayBuffer()),
      ContentType: params.file.type,
      Metadata: { applicationId: params.applicationId, documentType: params.documentType },
    }));
    const saved = await pool.query(
      `INSERT INTO admission_documents (
         application_id, document_type, file_name, file_path, verification_status,
         mime_type, file_size_bytes
       ) VALUES ($1, $2, $3, $4, 'PENDING', $5, $6)
       ON CONFLICT (application_id, document_type) DO UPDATE SET
         file_name = EXCLUDED.file_name,
         file_path = EXCLUDED.file_path,
         verification_status = 'PENDING',
         verification_note = NULL,
         verified_by = NULL,
         verified_at = NULL,
         mime_type = EXCLUDED.mime_type,
         file_size_bytes = EXCLUDED.file_size_bytes,
         uploaded_at = NOW()
       RETURNING id::text AS id, document_type AS type, file_name AS "fileName",
                 verification_status AS status, verification_note AS note`,
      [params.applicationId, params.documentType, safeName, objectKey, params.file.type, params.file.size],
    );
    if (params.isRevisionUpload) {
      await pool.query(
        `UPDATE admission_applications
         SET updated_at = NOW()
         WHERE id = $1`,
        [params.applicationId],
      );
      await pool.query(
        `INSERT INTO admission_status_histories (application_id, previous_status, new_status, note)
         VALUES ($1, $2, $2, $3)`,
        [
          params.applicationId,
          params.currentStatus,
          `Wali murid mengunggah ulang berkas ${params.documentType.replaceAll("_", " ")}.`,
        ],
      );
    }
    const oldKey = previous.rows[0]?.file_path as string | undefined;
    if (oldKey && oldKey !== objectKey) {
      await s3.send(new DeleteObjectCommand({ Bucket: "ppdb-documents", Key: oldKey })).catch((error) => {
        console.error("[ppdb:document-cleanup]", error);
      });
    }
    return { document: saved.rows[0] };
  } catch (error) {
    console.error("[ppdb:document-upload]", error);
    await s3.send(new DeleteObjectCommand({ Bucket: "ppdb-documents", Key: objectKey })).catch(() => undefined);
    throw error;
  }
}

app.post("/registrations/:id/documents", async (c) => {
  if (!process.env.AWS_ENDPOINT_URL_S3) return c.json({ error: "Penyimpanan berkas belum tersedia." }, 503);
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "ID pendaftaran tidak valid." }, 400);
  const contentLength = Number(c.req.header("content-length") ?? "0");
  if (contentLength > 6 * 1024 * 1024) return c.json({ error: "Ukuran berkas maksimal 5 MB." }, 413);

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ error: "Form berkas tidak valid." }, 400);
  }

  const applicationNumberValue = cleanText(form.get("applicationNumber"), 80);
  const phone = cleanText(form.get("phone"), 30);
  const phoneCanon = canonicalPhone(phone);
  const documentType = cleanText(form.get("documentType"), 50).toUpperCase();
  const file = form.get("file");
  if (!applicationNumberValue || phoneCanon.length < 9) {
    return c.json({ error: "Nomor pendaftaran dan WhatsApp wajib diisi." }, 400);
  }
  if (!documentTypes.has(documentType)) return c.json({ error: "Jenis berkas tidak dikenal." }, 400);
  if (!(file instanceof File) || file.size === 0) return c.json({ error: "Berkas wajib dipilih." }, 400);
  if (file.size > 5 * 1024 * 1024) return c.json({ error: "Ukuran berkas maksimal 5 MB." }, 413);
  if (!documentMimeTypes.has(file.type)) return c.json({ error: "Format berkas harus PDF, JPG, PNG, atau WebP." }, 415);

  const candidates = await pool.query(
    `SELECT a.id, a.status, g.phone
     FROM admission_applications a
     JOIN guardians g ON g.id = a.primary_guardian_id
     WHERE a.id = $1 AND a.application_number = $2`,
    [id, applicationNumberValue],
  );
  const matched = candidates.rows.find((row) => canonicalPhone(String(row.phone ?? "")) === phoneCanon);
  if (!matched) return c.json({ error: "Pendaftaran tidak ditemukan." }, 404);

  try {
    const result = await storeApplicationDocument({
      applicationId: id,
      applicationNumber: applicationNumberValue,
      currentStatus: String(matched.status),
      documentType,
      file,
      isRevisionUpload: false,
    });
    return c.json(result, 201);
  } catch {
    return c.json({ error: "Berkas belum dapat disimpan. Silakan coba lagi." }, 500);
  }
});

app.post("/status/:applicationNumber/documents", async (c) => {
  if (!process.env.AWS_ENDPOINT_URL_S3) return c.json({ error: "Penyimpanan berkas belum tersedia." }, 503);
  const applicationNumberValue = cleanText(c.req.param("applicationNumber"), 80);
  const contentLength = Number(c.req.header("content-length") ?? "0");
  if (contentLength > 6 * 1024 * 1024) return c.json({ error: "Ukuran berkas maksimal 5 MB." }, 413);

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ error: "Form berkas tidak valid." }, 400);
  }

  const phone = cleanText(form.get("phone"), 30);
  const phoneCanon = canonicalPhone(phone);
  const documentType = cleanText(form.get("documentType"), 50).toUpperCase();
  const file = form.get("file");

  if (!applicationNumberValue || phoneCanon.length < 9) {
    return c.json({ error: "Nomor pendaftaran dan WhatsApp wajib diisi." }, 400);
  }
  if (!documentTypes.has(documentType)) return c.json({ error: "Jenis berkas tidak dikenal." }, 400);
  if (!(file instanceof File) || file.size === 0) return c.json({ error: "Berkas wajib dipilih." }, 400);
  if (file.size > 5 * 1024 * 1024) return c.json({ error: "Ukuran berkas maksimal 5 MB." }, 413);
  if (!documentMimeTypes.has(file.type)) return c.json({ error: "Format berkas harus PDF, JPG, PNG, atau WebP." }, 415);

  const candidates = await pool.query(
    `SELECT a.id::text, a.status, g.phone
     FROM admission_applications a
     JOIN guardians g ON g.id = a.primary_guardian_id
     WHERE a.application_number = $1`,
    [applicationNumberValue],
  );
  const matched = candidates.rows.find((row) => canonicalPhone(String(row.phone ?? "")) === phoneCanon);
  if (!matched) return c.json({ error: "Data pendaftaran tidak ditemukan." }, 404);
  if (!["SUBMITTED", "NEEDS_REVISION"].includes(String(matched.status))) {
    return c.json({ error: "Berkas hanya dapat diunggah ulang saat status Menunggu Verifikasi atau Perlu Perbaikan." }, 409);
  }

  try {
    const result = await storeApplicationDocument({
      applicationId: String(matched.id),
      applicationNumber: applicationNumberValue,
      currentStatus: String(matched.status),
      documentType,
      file,
      isRevisionUpload: true,
    });
    return c.json(result, 201);
  } catch {
    return c.json({ error: "Berkas belum dapat diunggah ulang. Silakan coba lagi." }, 500);
  }
});

app.get("/registrations/:id/documents/:documentId", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  const documentId = c.req.param("documentId");
  if (![id, documentId].every((value) => /^[0-9a-f-]{36}$/i.test(value))) {
    return c.json({ error: "ID berkas tidak valid." }, 400);
  }
  const result = await pool.query(
    `SELECT file_path, file_name FROM admission_documents
     WHERE id = $1 AND application_id = $2`,
    [documentId, id],
  );
  if (!result.rows[0]) return c.json({ error: "Berkas tidak ditemukan." }, 404);
  try {
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: "ppdb-documents",
        Key: result.rows[0].file_path,
        ResponseContentDisposition: `inline; filename="${String(result.rows[0].file_name).replace(/["\\]/g, "-")}"`,
      }),
      { expiresIn: 300 },
    );
    return c.json({ url, expiresIn: 300 });
  } catch (error) {
    console.error("[ppdb:document-url]", error);
    return c.json({ error: "Berkas belum dapat dibuka." }, 500);
  }
});

app.patch("/registrations/:id/documents/:documentId", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  const documentId = c.req.param("documentId");
  if (![id, documentId].every((value) => /^[0-9a-f-]{36}$/i.test(value))) {
    return c.json({ error: "ID berkas tidak valid." }, 400);
  }
  const body = await c.req.json<{ status?: unknown; note?: unknown }>().catch(() => null);
  const status = cleanText(body?.status, 30).toUpperCase();
  if (!new Set(["VERIFIED", "REJECTED", "NEEDS_REVISION"]).has(status)) {
    return c.json({ error: "Status verifikasi berkas tidak valid." }, 400);
  }
  const result = await pool.query(
    `UPDATE admission_documents
     SET verification_status = $3, verification_note = $4,
         verified_by = $5, verified_at = NOW()
     WHERE id = $1 AND application_id = $2
     RETURNING id::text AS id, document_type AS type, file_name AS "fileName",
               verification_status AS status, verification_note AS note`,
    [documentId, id, status, cleanText(body?.note, 1000) || null, actorId(c.req.raw)],
  );
  if (!result.rows[0]) return c.json({ error: "Berkas tidak ditemukan." }, 404);
  return c.json({ document: result.rows[0] });
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
  const phone = cleanText(c.req.query("phone"), 30);
  const phoneCanon = canonicalPhone(phone);
  if (!applicationNumber || phoneCanon.length < 9) {
    return c.json({ error: "Nomor pendaftaran dan WhatsApp wajib diisi." }, 400);
  }
  const result = await pool.query(
    `${applicationSelect} WHERE a.application_number = $1`,
    [applicationNumber],
  );
  const row = result.rows.find((candidate) => canonicalPhone(String(candidate.teleponWali ?? "")) === phoneCanon);
  if (!row) return c.json({ error: "Data pendaftaran tidak ditemukan." }, 404);
  return c.json({
    id: row.id,
    applicationNumber: row.noPendaftaran,
    candidateName: row.nama,
    program: row.program || null,
    jalur: row.jalur,
    nisn: row.nisn || null,
    nitkm: row.nitkm || null,
    status: row.statusSeleksi,
    databaseStatus: row.databaseStatus,
    verificationNote: row.verificationNote,
    missingDocuments: row.missingDocuments,
    decisionNote: row.keterangan,
    className: row.kelasTujuan || null,
    interviewScheduledAt: row.interviewScheduledAt || null,
    interviewLocation: row.interviewLocation || null,
    documents: row.documents ?? [],
    updatedAt: row.tanggalDaftar,
  });
});

app.patch("/registrations/:id", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "ID pendaftaran tidak valid." }, 400);

  const body = await c.req.json<{
    action?: "VERIFY" | "SCHEDULE_INTERVIEW" | "COMPLETE_INTERVIEW" | "DECIDE" | "PLACE";
    status?: string;
    decisionNote?: string;
    metadata?: Record<string, unknown>;
    missingDocuments?: string[];
  }>();
  const allowedStatuses = new Set([
    "UNDER_REVIEW",
    "NEEDS_REVISION",
    "INTERVIEW_SCHEDULED",
    "INTERVIEW_COMPLETED",
    "ACCEPTED",
    "REJECTED",
    "WAITLISTED",
  ]);
  if (!body.action || !body.status || !allowedStatuses.has(body.status)) {
    return c.json({ error: "Aksi dan status tidak valid." }, 400);
  }

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
    if (body.action === "VERIFY" && !["UNDER_REVIEW", "NEEDS_REVISION"].includes(body.status)) {
      await client.query("ROLLBACK"); return c.json({ error: "Hasil verifikasi tidak valid." }, 400);
    }
    if (body.action === "SCHEDULE_INTERVIEW" && previousStatus !== "UNDER_REVIEW") {
      await client.query("ROLLBACK"); return c.json({ error: "Wawancara hanya dapat dijadwalkan setelah berkas lengkap." }, 409);
    }
    if (body.action === "COMPLETE_INTERVIEW" && previousStatus !== "INTERVIEW_SCHEDULED") {
      await client.query("ROLLBACK"); return c.json({ error: "Hasil observasi hanya dapat dicatat setelah jadwal ditetapkan." }, 409);
    }
    if (body.action === "DECIDE" && previousStatus !== "INTERVIEW_COMPLETED") {
      await client.query("ROLLBACK"); return c.json({ error: "Calon siswa belum menunggu penetapan." }, 409);
    }
    if (body.action === "DECIDE" && !["ACCEPTED", "REJECTED", "WAITLISTED"].includes(body.status)) {
      await client.query("ROLLBACK"); return c.json({ error: "Hasil penetapan tidak valid." }, 400);
    }
    if (body.action === "PLACE" && previousStatus !== "ACCEPTED") {
      await client.query("ROLLBACK"); return c.json({ error: "Penempatan hanya untuk calon yang lulus." }, 409);
    }
    if (body.action === "VERIFY" && body.status === "NEEDS_REVISION" && !body.missingDocuments?.length) {
      await client.query("ROLLBACK"); return c.json({ error: "Daftar kekurangan berkas wajib diisi." }, 400);
    }
    const actor = actorId(c.req.raw);
    const note = cleanText(body.decisionNote, 1000) || null;
    const metadata = JSON.stringify(body.metadata ?? {});
    let nextStatus = body.status;

    if (body.action === "SCHEDULE_INTERVIEW") {
      const scheduledAt = cleanText(body.metadata?.scheduledAt, 60);
      const location = cleanText(body.metadata?.location, 180);
      if (!scheduledAt || Number.isNaN(Date.parse(scheduledAt)) || !location) {
        await client.query("ROLLBACK");
        return c.json({ error: "Tanggal, waktu, dan lokasi wawancara wajib diisi." }, 400);
      }
      nextStatus = "INTERVIEW_SCHEDULED";
      await client.query(
        `INSERT INTO admission_interviews (
           application_id, scheduled_at, location, interviewer_id, interview_status
         ) VALUES ($1, $2::timestamptz, $3, $4, 'SCHEDULED')
         ON CONFLICT (application_id) DO UPDATE SET
           scheduled_at = EXCLUDED.scheduled_at,
           location = EXCLUDED.location,
           interviewer_id = EXCLUDED.interviewer_id,
           interview_status = 'SCHEDULED',
           observation_notes = NULL,
           recommendation = NULL,
           completed_at = NULL,
           updated_at = NOW()`,
        [id, scheduledAt, location, actor],
      );
      await client.query(
        `UPDATE admission_applications
         SET status = $2,
             decision_note = COALESCE($4, decision_note),
             application_metadata = application_metadata || $3::jsonb,
             updated_at = NOW()
         WHERE id = $1`,
        [id, nextStatus, metadata, note],
      );
    } else if (body.action === "COMPLETE_INTERVIEW") {
      const observationNotes = cleanText(body.metadata?.observationNotes, 4000);
      const recommendation = cleanText(body.metadata?.recommendation, 20).toUpperCase();
      const rawScores = body.metadata?.scores;
      const criteriaCodes = ["JASMANI_ROHANI", "JARAK", "MOTORIK", "KOGNITIF"] as const;
      const scores = Object.fromEntries(criteriaCodes.map((code) => [
        code,
        typeof rawScores === "object" && rawScores !== null
          ? Number((rawScores as Record<string, unknown>)[code])
          : Number.NaN,
      ])) as Record<(typeof criteriaCodes)[number], number>;
      const scoresAreValid = criteriaCodes.every((code) => Number.isFinite(scores[code]) && scores[code] >= 0 && scores[code] <= 100);
      if (!observationNotes || !["ACCEPT", "WAITLIST", "REJECT"].includes(recommendation) || !scoresAreValid) {
        await client.query("ROLLBACK");
        return c.json({ error: "Empat nilai observasi, catatan, dan rekomendasi wajib diisi." }, 400);
      }
      nextStatus = "INTERVIEW_COMPLETED";
      const interview = await client.query(
        `UPDATE admission_interviews
         SET interview_status = 'COMPLETED', observation_notes = $2,
             recommendation = $3, completed_at = NOW(),
             interviewer_id = COALESCE($4, interviewer_id), updated_at = NOW()
         WHERE application_id = $1
         RETURNING id`,
        [id, observationNotes, recommendation, actor],
      );
      if (!interview.rows[0]) {
        await client.query("ROLLBACK");
        return c.json({ error: "Jadwal wawancara tidak ditemukan." }, 409);
      }
      const totalScore = Number((
        scores.JASMANI_ROHANI * 0.25
        + scores.JARAK * 0.15
        + scores.MOTORIK * 0.30
        + scores.KOGNITIF * 0.30
      ).toFixed(2));
      const assessment = await client.query(
        `INSERT INTO admission_assessments (
           application_id, assessed_by, assessed_at, total_score, recommendation, note
         ) VALUES ($1, $2, NOW(), $3, $4, $5)
         ON CONFLICT (application_id) DO UPDATE SET
           assessed_by = EXCLUDED.assessed_by,
           assessed_at = NOW(),
           total_score = EXCLUDED.total_score,
           recommendation = EXCLUDED.recommendation,
           note = EXCLUDED.note,
           updated_at = NOW()
         RETURNING id`,
        [id, actor, totalScore, recommendation, observationNotes],
      );
      for (const criterionCode of criteriaCodes) {
        await client.query(
          `INSERT INTO admission_assessment_details (assessment_id, criterion_id, score)
           SELECT $1, c.id, $3
           FROM admission_evaluation_criteria c
           WHERE c.criterion_code = $2
           ON CONFLICT (assessment_id, criterion_id) DO UPDATE SET score = EXCLUDED.score`,
          [assessment.rows[0].id, criterionCode, scores[criterionCode]],
        );
      }
      await client.query(
        `UPDATE admission_applications
         SET status = $2,
             decision_note = COALESCE($4, decision_note),
             application_metadata = application_metadata || $3::jsonb,
             updated_at = NOW()
         WHERE id = $1`,
        [id, nextStatus, metadata, note],
      );
    } else if (body.action === "PLACE") {
      const classId = cleanText(body.metadata?.classId, 60);
      const className = cleanText(body.metadata?.className, 80);
      const classSlug = cleanText(body.metadata?.classSlug, 80);
      const nisn = cleanText(body.metadata?.nisn, 40);
      const nitkm = cleanText(body.metadata?.nitkm, 40);
      if ((!classId && !className) || !nitkm) {
        await client.query("ROLLBACK");
        return c.json({ error: "Kelas dan nomor induk wajib diisi untuk penempatan." }, 400);
      }
      const details = await client.query(
        `SELECT a.application_number, a.candidate_name, a.candidate_nickname, a.candidate_gender, a.candidate_birth_place, a.candidate_birth_date,
                a.candidate_address, a.candidate_nik, a.candidate_religion, a.family_card_number,
                a.child_order, a.sibling_count, a.primary_guardian_id, g.full_name, g.phone,
                c.id AS class_id, c.class_name AS resolved_class_name, c.capacity AS class_capacity
         FROM admission_applications a
         JOIN guardians g ON g.id = a.primary_guardian_id
         LEFT JOIN classes c ON c.status = 'ACTIVE'
           AND (($4 <> '' AND c.id::text = $4) OR c.class_name = $2 OR c.class_name = $3)
         WHERE a.id = $1 LIMIT 1`,
        [id, className, classSlug, classId],
      );
      if (!details.rows[0]?.class_id) {
        await client.query("ROLLBACK");
        return c.json({ error: "Kelas tujuan belum tersedia di master data." }, 409);
      }
      const resolvedClassId = String(details.rows[0].class_id);
      const resolvedClassName = String(details.rows[0].resolved_class_name);
      const classCapacity = Number(details.rows[0].class_capacity ?? 0);
      if (classCapacity > 0) {
        const capCheck = await client.query(
          `SELECT COUNT(*)::int AS active_count
           FROM class_enrollments ce
           LEFT JOIN students s ON s.id = ce.student_id
           WHERE ce.class_id = $1
             AND ce.status = 'ACTIVE'
             AND COALESCE(s.source_application_id::text, '') <> $2`,
          [resolvedClassId, id],
        );
        if (Number(capCheck.rows[0]?.active_count ?? 0) >= classCapacity) {
          await client.query("ROLLBACK");
          return c.json({ error: `Kapasitas kelas ${resolvedClassName} sudah penuh (${classCapacity} santri).` }, 409);
        }
      }
      const student = await client.query(
        `INSERT INTO students (
           student_number, nisn, source_application_id, full_name, nickname, gender,
           birth_place, birth_date, religion, address, family_card_number,
           child_order, sibling_count, admission_date, notes, nik
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_DATE, $14, $15)
         ON CONFLICT (source_application_id) DO UPDATE SET
           student_number = EXCLUDED.student_number,
           nisn = COALESCE(EXCLUDED.nisn, students.nisn),
           nik = COALESCE(EXCLUDED.nik, students.nik),
           updated_at = NOW()
         RETURNING id`,
        [
          nitkm, nisn || null, id, details.rows[0].candidate_name, details.rows[0].candidate_nickname,
          details.rows[0].candidate_gender, details.rows[0].candidate_birth_place,
          details.rows[0].candidate_birth_date, details.rows[0].candidate_religion,
          details.rows[0].candidate_address, details.rows[0].family_card_number,
          details.rows[0].child_order, details.rows[0].sibling_count, `Sumber data: ${details.rows[0].application_number}`,
          details.rows[0].candidate_nik,
        ],
      );
      await client.query(
        `INSERT INTO student_guardians (student_id, guardian_id, relationship, is_primary_contact)
         VALUES ($1, $2, 'WALI', TRUE)
         ON CONFLICT (student_id, guardian_id) DO UPDATE SET is_primary_contact = TRUE`,
        [student.rows[0].id, details.rows[0].primary_guardian_id],
      );
      await client.query(
        `UPDATE class_enrollments
         SET status = 'TRANSFERRED', released_at = CURRENT_DATE, updated_at = NOW()
         WHERE student_id = $1 AND class_id <> $2 AND status = 'ACTIVE'`,
        [student.rows[0].id, resolvedClassId],
      );
      await client.query(
        `INSERT INTO class_enrollments (student_id, class_id, enrolled_at, status)
         VALUES ($1, $2, CURRENT_DATE, 'ACTIVE')
         ON CONFLICT (student_id, class_id) DO UPDATE SET
           status = 'ACTIVE',
           enrolled_at = CURRENT_DATE,
           released_at = NULL,
           updated_at = NOW()`,
        [student.rows[0].id, resolvedClassId],
      );
      const placeMetadata = JSON.stringify({
        ...(body.metadata ?? {}),
        classId: resolvedClassId,
        className: resolvedClassName,
      });
      await client.query(
        `UPDATE admission_applications
         SET status = 'COMPLETED', application_metadata = application_metadata || $2::jsonb,
             updated_at = NOW(), decision_note = COALESCE($3, decision_note)
         WHERE id = $1`,
        [id, placeMetadata, note],
      );
      nextStatus = "COMPLETED";
    } else {
      await client.query(
        `UPDATE admission_applications
         SET status = $2::varchar(30),
             decision_at = CASE WHEN $2::varchar(30) IN ('ACCEPTED', 'REJECTED', 'WAITLISTED') THEN NOW() ELSE decision_at END,
             decision_by = CASE WHEN $2::varchar(30) IN ('ACCEPTED', 'REJECTED', 'WAITLISTED') THEN $7 ELSE decision_by END,
             verified_at = CASE WHEN $5 = 'VERIFY' THEN NOW() ELSE verified_at END,
             verified_by = CASE WHEN $5 = 'VERIFY' THEN $7 ELSE verified_by END,
             verification_note = CASE WHEN $5 = 'VERIFY' THEN $3 ELSE verification_note END,
             missing_documents = CASE WHEN $5 = 'VERIFY' THEN $6::jsonb ELSE missing_documents END,
             decision_note = CASE WHEN $5 = 'DECIDE' THEN $3 ELSE decision_note END,
             application_metadata = application_metadata || $4::jsonb,
             updated_at = NOW()
         WHERE id = $1`,
        [id, nextStatus, note, metadata, body.action, JSON.stringify(body.missingDocuments ?? []), actor],
      );
    }
    if (body.action === "VERIFY") {
      await client.query(
        `INSERT INTO admission_verifications (
           application_id, verification_status, note, verified_by, verified_at
         ) VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (application_id) DO UPDATE SET
           verification_status = EXCLUDED.verification_status,
           note = EXCLUDED.note,
           verified_by = EXCLUDED.verified_by,
           verified_at = NOW(),
           updated_at = NOW()`,
        [id, nextStatus === "UNDER_REVIEW" ? "VALID" : "NEEDS_REVISION", note, actor],
      );
    }
    if (body.action === "DECIDE") {
      await client.query(
        `INSERT INTO admission_decisions (
           application_id, decision_status, reason, decided_by, decided_at
         ) VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (application_id) DO UPDATE SET
           decision_status = EXCLUDED.decision_status,
           reason = EXCLUDED.reason,
           decided_by = EXCLUDED.decided_by,
           decided_at = NOW()`,
        [id, nextStatus, note, actor],
      );
    }
    await client.query(
      `INSERT INTO admission_status_histories (application_id, previous_status, new_status, note, changed_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        id,
        previousStatus,
        nextStatus,
        note || (body.action === "PLACE" ? "Penempatan kelas dan nomor induk ditetapkan admin." : null),
        actor,
      ],
    );
    const application = await findApplication(client, id);
    await client.query("COMMIT");
    return c.json({ application });
  } catch (error) {
    await client.query("ROLLBACK");
    const pgCode = (error as { code?: string }).code;
    if (pgCode === "23505") {
      return c.json({ error: "Nomor Induk, NISN, atau NIK sudah digunakan oleh santri lain." }, 409);
    }
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
    const storedObjects = await client.query(
      "SELECT file_path FROM admission_documents WHERE application_id = $1 AND file_path IS NOT NULL",
      [id],
    );
    const placedStudent = await client.query(
      "SELECT id FROM students WHERE source_application_id = $1",
      [id],
    );
    for (const student of placedStudent.rows) {
      await client.query("DELETE FROM class_enrollments WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM student_guardians WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM attendance_records WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM student_assessments WHERE student_id = $1", [student.id]);
      await client.query("DELETE FROM student_daily_notes WHERE student_id = $1", [student.id]);
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
    const objectKeys = storedObjects.rows.map((row) => row.file_path as string);
    await Promise.all(objectKeys.map((objectKey) => (
      s3.send(new DeleteObjectCommand({ Bucket: "ppdb-documents", Key: objectKey })).catch((error) => {
        console.error("[ppdb:delete-object]", error);
      })
    )));
    return c.body(null, 204);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[ppdb:delete]", error);
    return c.json({ error: "Data pendaftaran belum dapat dihapus." }, 500);
  } finally {
    client.release();
  }
});

app.get("/cms/media", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  try {
    const result = await pool.query(`
      SELECT
        id::text,
        object_key AS "objectKey",
        original_name AS "originalName",
        mime_type AS "mimeType",
        file_size_bytes::int AS "fileSizeBytes",
        alt_text AS "altText",
        visibility,
        created_at::text AS "createdAt"
      FROM media_files
      ORDER BY created_at DESC
      LIMIT 60
    `);
    return c.json({ files: result.rows });
  } catch (error) {
    console.error("[cms:media-list]", error);
    return c.json({ error: "Daftar media gagal dimuat." }, 500);
  }
});

app.post("/cms/media", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  if (!process.env.AWS_ENDPOINT_URL_S3) return c.json({ error: "Penyimpanan media belum tersedia." }, 503);
  const contentLength = Number(c.req.header("content-length") ?? "0");
  if (contentLength > 6 * 1024 * 1024) return c.json({ error: "Ukuran media maksimal 5 MB." }, 413);

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ error: "Form unggahan media tidak valid." }, 400);
  }

  const file = form.get("file");
  const altText = cleanText(form.get("altText"), 250) || null;
  const rawVis = cleanText(form.get("visibility") || "PUBLIC", 20).toUpperCase();
  const visibility = rawVis === "PRIVATE" ? "PRIVATE" : "PUBLIC";

  if (!(file instanceof File) || file.size === 0) return c.json({ error: "Berkas media wajib dipilih." }, 400);
  if (file.size > 5 * 1024 * 1024) return c.json({ error: "Ukuran media maksimal 5 MB." }, 413);
  if (!cmsMediaMimeTypes.has(file.type)) {
    return c.json({ error: "Format media harus JPG, PNG, WebP, SVG, atau PDF." }, 415);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "media";
  const objectKey = `cms/${randomUUID()}-${safeName}`;

  try {
    await s3.send(new PutObjectCommand({
      Bucket: "ppdb-documents",
      Key: objectKey,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type,
    }));
    const saved = await pool.query(
      `INSERT INTO media_files (
         object_key, original_name, mime_type, file_size_bytes, alt_text, visibility, uploaded_by
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
         id::text,
         object_key AS "objectKey",
         original_name AS "originalName",
         mime_type AS "mimeType",
         file_size_bytes::int AS "fileSizeBytes",
         alt_text AS "altText",
         visibility,
         created_at::text AS "createdAt"`,
      [objectKey, safeName, file.type, file.size, altText, visibility, actorId(c.req.raw)],
    );
    return c.json({ file: saved.rows[0] }, 201);
  } catch (error) {
    console.error("[cms:media-upload]", error);
    await s3.send(new DeleteObjectCommand({ Bucket: "ppdb-documents", Key: objectKey })).catch(() => undefined);
    return c.json({ error: "Media gagal diunggah." }, 500);
  }
});

app.delete("/cms/media/:id", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "ID media tidak valid." }, 400);
  const deleted = await pool.query(
    "DELETE FROM media_files WHERE id = $1 RETURNING object_key",
    [id],
  );
  if (!deleted.rows[0]) return c.json({ error: "Media tidak ditemukan." }, 404);
  const key = String(deleted.rows[0].object_key);
  await s3.send(new DeleteObjectCommand({ Bucket: "ppdb-documents", Key: key })).catch((err) => {
    console.error("[cms:media-delete-object]", err);
  });
  return c.body(null, 204);
});

app.get("/media/:id", async (c) => {
  if (!process.env.AWS_ENDPOINT_URL_S3) return c.json({ error: "Penyimpanan media belum tersedia." }, 503);
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "Media tidak ditemukan." }, 404);
  const result = await pool.query(
    "SELECT object_key, mime_type, original_name FROM media_files WHERE id = $1 AND visibility = 'PUBLIC'",
    [id],
  );
  if (!result.rows[0]) return c.json({ error: "Media tidak ditemukan." }, 404);
  try {
    const obj = await s3.send(new GetObjectCommand({
      Bucket: "ppdb-documents",
      Key: String(result.rows[0].object_key),
    }));
    const bytes = await obj.Body?.transformToByteArray();
    if (!bytes) return c.json({ error: "Berkas kosong." }, 404);
    return c.body(bytes, 200, {
      "Content-Type": String(result.rows[0].mime_type || "application/octet-stream"),
      "Cache-Control": "public, max-age=3600",
    });
  } catch (error) {
    console.error("[cms:media-serve]", error);
    return c.json({ error: "Media gagal dimuat." }, 500);
  }
});

export default app;
