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
  "https://brosur-informasiweb-ikhwandas-projects.vercel.app",
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
  waveId?: unknown;
  customFields?: unknown;
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
  waveId: string | null;
  customFields: Record<string, string | boolean>;
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

function normalizeCustomFields(raw: unknown): Record<string, string | boolean> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result: Record<string, string | boolean> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    const cleanKey = key.trim().slice(0, 60);
    if (!cleanKey) continue;
    if (typeof val === "boolean") {
      result[cleanKey] = val;
    } else if (typeof val === "number" && Number.isFinite(val)) {
      result[cleanKey] = String(val);
    } else if (typeof val === "string") {
      const trimmed = val.trim().slice(0, 500);
      if (trimmed) result[cleanKey] = trimmed;
    }
  }
  return result;
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
  const rawWaveId = cleanText(input.waveId, 60);
  const waveId = /^[0-9a-f-]{36}$/i.test(rawWaveId) ? rawWaveId : null;

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
    waveId,
    customFields: normalizeCustomFields(input.customFields),
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
    a.nomor_pendaftaran AS "noPendaftaran",
    a.nama_lengkap AS nama,
    COALESCE(a.jenis_kelamin, 'L') AS gender,
    COALESCE(to_char(a.tanggal_lahir, 'YYYY-MM-DD'), '') AS "tanggalLahir",
    a.tempat_lahir AS "tempatLahir",
    a.nik_calon_siswa AS nik,
    a.alamat AS alamat,
    g.nama_lengkap AS "namaWali",
    COALESCE(g.nomor_hp, '') AS "teleponWali",
    g.nama_ayah AS "namaAyah",
    g.nama_ibu AS "namaIbu",
    g.nomor_kk AS "noKk",
    g.nik_ayah AS "nikAyah",
    g.nik_ibu AS "nikIbu",
    a.catatan_kesehatan AS "catatanMedis",
    CASE WHEN a.jalur_pendaftaran = 'Beasiswa Yatim & Dhuafa'
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
    to_char(a.dibuat_pada AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS "tanggalDaftar",
    COALESCE(a.data_tambahan->>'nisn', '') AS nisn,
    COALESCE(a.data_tambahan->>'nitkm', '') AS nitkm,
    COALESCE(a.data_tambahan->>'className', '') AS "kelasTujuan",
    COALESCE(a.data_tambahan->'customFields', '{}'::jsonb) AS "customFields",
    gel.nama AS "gelombangNama",
    COALESCE(a.catatan_keputusan, 'Formulir pendaftaran daring diterima') AS keterangan,
    a.catatan_verifikasi AS "verificationNote",
    COALESCE(a.dokumen_kurang, '[]'::jsonb) AS "missingDocuments",
    a.status AS "databaseStatus",
    a.program_tujuan AS program,
    a.asal_sekolah AS "previousSchool",
    g.email AS email,
    i.jadwal_wawancara AS "interviewScheduledAt",
    i.lokasi AS "interviewLocation",
    i.status AS "interviewStatus",
    i.catatan_observasi AS "observationNotes",
    i.rekomendasi AS "interviewRecommendation",
    assessment.total_nilai AS "interviewTotalScore",
    COALESCE((
      SELECT jsonb_object_agg(criterion.kode, detail.nilai)
      FROM detail_penilaian_ppdb detail
      JOIN kriteria_penilaian_ppdb criterion ON criterion.id = detail.kriteria_penilaian_ppdb_id
      WHERE detail.penilaian_ppdb_id = assessment.id
    ), '{}'::jsonb) AS "interviewScores",
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', d.id::text,
        'type', d.kode_jenis_dokumen,
        'fileName', d.nama_file,
        'status', d.status_verifikasi,
        'note', d.catatan_verifikasi
      ) ORDER BY d.diunggah_pada)
      FROM dokumen_pendaftaran_ppdb d
      WHERE d.pendaftaran_ppdb_id = a.id
    ), '[]'::jsonb) AS documents
  FROM pendaftaran_ppdb a
  JOIN wali_siswa g ON g.id = a.wali_utama_id
  LEFT JOIN gelombang_ppdb gel ON gel.id = a.gelombang_ppdb_id
  LEFT JOIN wawancara_ppdb i ON i.pendaftaran_ppdb_id = a.id
  LEFT JOIN penilaian_ppdb assessment ON assessment.pendaftaran_ppdb_id = a.id
`;

async function findApplication(client: PoolClient | typeof pool, id: string) {
  const result = await client.query(`${applicationSelect} WHERE a.id = $1`, [id]);
  return result.rows[0] ?? null;
}

app.get("/", (c) => c.json({ service: "TK Al-Mustam PPDB API", status: "ok" }));

app.get("/ppdb/meta", async (c) => {
  try {
    const [periods, waves, classes, documentTypes, formFields, criteria] = await Promise.all([
      pool.query(`
        SELECT
          p.id::text,
          p.nama AS name,
          p.tanggal_mulai::text AS "registrationStart",
          p.tanggal_selesai::text AS "registrationEnd",
          p.status,
          ta.nama AS "academicYear"
        FROM periode_ppdb p
        JOIN tahun_ajaran ta ON ta.id = p.tahun_ajaran_id
        WHERE p.status IN ('OPEN', 'DRAFT')
        ORDER BY p.tanggal_mulai ASC
      `),
      pool.query(`
        SELECT
          g.id::text,
          g.periode_ppdb_id::text AS "periodId",
          g.kode AS code,
          g.nama AS name,
          g.periode_label AS period,
          g.tanggal_mulai::text AS "startDate",
          g.tanggal_selesai::text AS "endDate",
          g.kuota AS capacity,
          g.kuota_label AS quota,
          g.status,
          COALESCE(g.keterangan, '') AS description,
          g.urutan AS "sortOrder"
        FROM gelombang_ppdb g
        ORDER BY g.urutan ASC, g.dibuat_pada ASC
      `),
      pool.query(`
        SELECT
          k.id::text,
          k.nama AS "className",
          k.jenjang AS "classLevel",
          k.kapasitas AS capacity,
          tp.kode AS "levelCode",
          tp.nama AS "levelName",
          COUNT(sk.id) FILTER (WHERE sk.status = 'ACTIVE')::int AS "enrolledCount"
        FROM kelas k
        LEFT JOIN tingkat_pendidikan tp ON tp.id = k.tingkat_pendidikan_id
        LEFT JOIN siswa_kelas sk ON sk.kelas_id = k.id
        WHERE k.status = 'ACTIVE'
        GROUP BY k.id, tp.kode, tp.nama
        ORDER BY k.nama ASC
      `),
      pool.query(`
        SELECT
          id::text,
          kode AS code,
          nama AS name,
          wajib AS "isRequired",
          deskripsi AS description,
          urutan AS "sortOrder"
        FROM jenis_dokumen_ppdb
        WHERE status = 'ACTIVE' AND status_aktif = TRUE
        ORDER BY urutan ASC, wajib DESC, kode ASC
      `),
      pool.query(`
        SELECT
          id::text,
          kode AS code,
          label,
          tipe_field AS "fieldType",
          placeholder,
          opsi AS options,
          wajib AS "isRequired",
          bagian AS section,
          urutan AS "sortOrder"
        FROM bidang_formulir_ppdb
        WHERE status_aktif = TRUE
        ORDER BY urutan ASC, dibuat_pada ASC
      `),
      pool.query(`
        SELECT
          id::text,
          kode AS code,
          nama AS name,
          bobot::float AS weight,
          urutan AS "sortOrder",
          tipe_nilai AS "valueType",
          nilai_min::float AS "minValue",
          nilai_max::float AS "maxValue"
        FROM kriteria_penilaian_ppdb
        WHERE status = 'ACTIVE' AND status_aktif = TRUE
        ORDER BY urutan ASC, kode ASC
      `),
    ]);

    return c.json({
      periods: periods.rows,
      waves: waves.rows,
      classes: classes.rows,
      documentTypes: documentTypes.rows,
      formFields: formFields.rows,
      criteria: criteria.rows,
    });
  } catch (error) {
    console.error("[ppdb:meta]", error);
    return c.json({ error: "Informasi PPDB belum dapat dimuat." }, 503);
  }
});

app.get("/cms/public", async (c) => {
  try {
    const [sections, news, programs, facilities, gallery, pages, periods, waves, documentTypes, formFields] = await Promise.all([
      pool.query(`
        SELECT kunci_bagian AS "sectionKey", judul AS title, konten AS content, diperbarui_pada AS "updatedAt"
        FROM bagian_cms
        WHERE status = 'PUBLISHED'
        ORDER BY urutan, kunci_bagian
      `),
      pool.query(`
        SELECT
          b.id::text,
          b.judul AS title,
          b.slug,
          b.ringkasan AS excerpt,
          b.isi AS content,
          b.gambar_sampul_url AS "image",
          COALESCE(to_char(b.diterbitkan_pada AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD'), to_char(b.dibuat_pada AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')) AS "date",
          COALESCE(u.nama_lengkap, 'Admin Sekolah') AS author
        FROM berita b
        LEFT JOIN pengguna u ON u.id = b.penulis_id
        WHERE b.status = 'PUBLISHED'
        ORDER BY b.diterbitkan_pada DESC NULLS LAST, b.dibuat_pada DESC
      `),
      pool.query(`
        SELECT
          id::text,
          nama AS name,
          deskripsi AS description,
          gambar_url AS image,
          urutan AS "displayOrder"
        FROM program_sekolah
        WHERE status = 'ACTIVE'
        ORDER BY urutan ASC, nama ASC
      `),
      pool.query(`
        SELECT
          id::text,
          nama AS name,
          deskripsi AS description,
          gambar_url AS image,
          urutan AS "displayOrder"
        FROM fasilitas_sekolah
        WHERE status = 'ACTIVE'
        ORDER BY urutan ASC, nama ASC
      `),
      pool.query(`
        SELECT
          g.id::text,
          ag.nama AS category,
          ag.tanggal_kegiatan::text AS "eventDate",
          g.gambar_url AS src,
          g.deskripsi AS caption,
          g.urutan AS "displayOrder"
        FROM galeri g
        JOIN album_galeri ag ON ag.id = g.album_galeri_id
        WHERE ag.status = 'ACTIVE'
        ORDER BY g.urutan ASC, g.dibuat_pada DESC
      `),
      pool.query(`
        SELECT slug, judul AS title, isi AS content, diterbitkan_pada::text AS "publishedAt"
        FROM halaman_cms
        WHERE status = 'PUBLISHED'
        ORDER BY judul ASC
      `),
      pool.query(`
        SELECT
          p.id::text,
          p.nama AS name,
          p.tanggal_mulai::text AS "registrationStart",
          p.tanggal_selesai::text AS "registrationEnd",
          p.status,
          ta.nama AS "academicYear"
        FROM periode_ppdb p
        JOIN tahun_ajaran ta ON ta.id = p.tahun_ajaran_id
        ORDER BY p.tanggal_mulai ASC
      `),
      pool.query(`
        SELECT
          id::text,
          periode_ppdb_id::text AS "periodId",
          kode AS code,
          nama AS name,
          periode_label AS period,
          tanggal_mulai::text AS "startDate",
          tanggal_selesai::text AS "endDate",
          kuota AS capacity,
          kuota_label AS quota,
          status,
          COALESCE(keterangan, '') AS description,
          urutan AS "sortOrder"
        FROM gelombang_ppdb
        ORDER BY urutan ASC, dibuat_pada ASC
      `),
      pool.query(`
        SELECT
          id::text,
          kode AS code,
          nama AS name,
          wajib AS "isRequired",
          deskripsi AS description,
          urutan AS "sortOrder"
        FROM jenis_dokumen_ppdb
        WHERE status = 'ACTIVE' AND status_aktif = TRUE
        ORDER BY urutan ASC, wajib DESC, kode ASC
      `),
      pool.query(`
        SELECT
          id::text,
          kode AS code,
          label,
          tipe_field AS "fieldType",
          placeholder,
          opsi AS options,
          wajib AS "isRequired",
          bagian AS section,
          urutan AS "sortOrder"
        FROM bidang_formulir_ppdb
        WHERE status_aktif = TRUE
        ORDER BY urutan ASC, dibuat_pada ASC
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
      waves: waves.rows,
      documentTypes: documentTypes.rows,
      formFields: formFields.rows,
    });
  } catch (error) {
    console.error("[cms:public]", error);
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
      `SELECT a.id, a.nomor_pendaftaran, g.nomor_hp
       FROM pendaftaran_ppdb a
       JOIN wali_siswa g ON g.id = a.wali_utama_id
       WHERE a.nik_calon_siswa = $1
       ORDER BY a.dibuat_pada DESC
       LIMIT 1`,
      [registration.nik],
    );
    if (duplicate.rows[0]) {
      await client.query("ROLLBACK");
      if (canonicalPhone(String(duplicate.rows[0].nomor_hp ?? "")) !== canonicalPhone(registration.whatsapp)) {
        return c.json({ error: "NIK calon siswa sudah terdaftar. Hubungi Admin PPDB jika data perlu diperbaiki." }, 409);
      }
      return c.json({
        id: duplicate.rows[0].id,
        applicationNumber: duplicate.rows[0].nomor_pendaftaran,
        duplicate: true,
      }, 200);
    }

    const period = await client.query(
      `SELECT id
       FROM periode_ppdb
       WHERE status = 'OPEN'
         AND NOW() BETWEEN tanggal_mulai AND tanggal_selesai
       ORDER BY tanggal_mulai DESC
       LIMIT 1`,
    );
    if (!period.rows[0]) {
      await client.query("ROLLBACK");
      return c.json({ error: "Periode pendaftaran belum dibuka." }, 503);
    }

    let resolvedWaveId: string | null = registration.waveId;
    if (!resolvedWaveId) {
      const openWave = await client.query(
        `SELECT id FROM gelombang_ppdb
         WHERE periode_ppdb_id = $1 AND status = 'OPEN'
         ORDER BY urutan ASC LIMIT 1`,
        [period.rows[0].id],
      );
      resolvedWaveId = openWave.rows[0]?.id ?? null;
    }

    const guardian = await client.query(
      `INSERT INTO wali_siswa (
         nama_lengkap, nik, nomor_hp, email, alamat, nama_ayah, nama_ibu,
         nomor_kk, nik_ayah, nik_ibu
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (nik) DO UPDATE SET
         nama_lengkap = EXCLUDED.nama_lengkap,
         nomor_hp = EXCLUDED.nomor_hp,
         email = COALESCE(EXCLUDED.email, wali_siswa.email),
         alamat = COALESCE(EXCLUDED.alamat, wali_siswa.alamat),
         nama_ayah = COALESCE(EXCLUDED.nama_ayah, wali_siswa.nama_ayah),
         nama_ibu = COALESCE(EXCLUDED.nama_ibu, wali_siswa.nama_ibu),
         nomor_kk = COALESCE(EXCLUDED.nomor_kk, wali_siswa.nomor_kk),
         nik_ayah = COALESCE(EXCLUDED.nik_ayah, wali_siswa.nik_ayah),
         nik_ibu = COALESCE(EXCLUDED.nik_ibu, wali_siswa.nik_ibu),
         diperbarui_pada = NOW()
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
      "SELECT id FROM tingkat_pendidikan WHERE kode = $1 AND status = 'ACTIVE' LIMIT 1",
      [educationLevelCode(registration.program)],
    );
    if (!educationLevel.rows[0]) {
      await client.query("ROLLBACK");
      return c.json({ error: "Jenjang pendidikan belum tersedia pada master data." }, 409);
    }

    const initialMetadata = Object.keys(registration.customFields).length > 0
      ? JSON.stringify({ customFields: registration.customFields })
      : "{}";

    const number = applicationNumber(registration.program);
    const application = await client.query(
      `INSERT INTO pendaftaran_ppdb (
         periode_ppdb_id,
         gelombang_ppdb_id,
         wali_utama_id,
         nomor_pendaftaran,
         nama_lengkap,
         jenis_kelamin,
         tempat_lahir,
         tanggal_lahir,
         alamat,
         nik_calon_siswa,
         asal_sekolah,
         program_tujuan,
         jalur_pendaftaran,
         catatan_kesehatan,
         tingkat_pendidikan_id,
         nomor_kk,
         data_tambahan,
         status,
         tanggal_daftar
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, 'SUBMITTED', NOW())
       RETURNING id, dibuat_pada`,
      [
        period.rows[0].id,
        resolvedWaveId,
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
        initialMetadata,
      ],
    );

    await client.query(
      `INSERT INTO riwayat_status_ppdb (pendaftaran_ppdb_id, status_sebelumnya, status, catatan)
       VALUES ($1, NULL, 'SUBMITTED', 'Dikirim dari formulir PPDB web informasi')`,
      [application.rows[0].id],
    );

    await client.query("COMMIT");
    return c.json({
      id: application.rows[0].id,
      applicationNumber: number,
      submittedAt: application.rows[0].dibuat_pada,
    }, 201);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[ppdb:create]", error);
    return c.json({ error: "Pendaftaran belum dapat disimpan. Silakan coba lagi." }, 500);
  } finally {
    client.release();
  }
});

const documentMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const cmsMediaMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
]);

async function resolveDocumentTypeId(documentTypeCode: string): Promise<string | null> {
  const res = await pool.query(
    `SELECT id::text FROM jenis_dokumen_ppdb WHERE kode = $1 AND status = 'ACTIVE' AND status_aktif = TRUE LIMIT 1`,
    [documentTypeCode],
  );
  return (res.rows[0]?.id as string | undefined) ?? null;
}

async function storeApplicationDocument(params: {
  applicationId: string;
  applicationNumber: string;
  currentStatus: string;
  documentType: string;
  documentTypeId: string;
  file: File;
  isRevisionUpload: boolean;
}) {
  const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "document";
  const objectKey = `registrations/${params.applicationId}/${params.documentType}/${randomUUID()}-${safeName}`;
  const previous = await pool.query(
    "SELECT file_url FROM dokumen_pendaftaran_ppdb WHERE pendaftaran_ppdb_id = $1 AND kode_jenis_dokumen = $2",
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
      `INSERT INTO dokumen_pendaftaran_ppdb (
         pendaftaran_ppdb_id, jenis_dokumen_id, kode_jenis_dokumen, nama_file, file_url,
         status_verifikasi, mime_type, ukuran_byte
       ) VALUES ($1, $2, $3, $4, $5, 'PENDING', $6, $7)
       ON CONFLICT (pendaftaran_ppdb_id, kode_jenis_dokumen) DO UPDATE SET
         jenis_dokumen_id = EXCLUDED.jenis_dokumen_id,
         nama_file = EXCLUDED.nama_file,
         file_url = EXCLUDED.file_url,
         status_verifikasi = 'PENDING',
         catatan_verifikasi = NULL,
         diverifikasi_oleh = NULL,
         diverifikasi_pada = NULL,
         mime_type = EXCLUDED.mime_type,
         ukuran_byte = EXCLUDED.ukuran_byte,
         diunggah_pada = NOW()
       RETURNING id::text AS id, kode_jenis_dokumen AS type, nama_file AS "fileName",
                 status_verifikasi AS status, catatan_verifikasi AS note`,
      [
        params.applicationId,
        params.documentTypeId,
        params.documentType,
        safeName,
        objectKey,
        params.file.type,
        params.file.size,
      ],
    );
    if (params.isRevisionUpload) {
      await pool.query(
        `UPDATE pendaftaran_ppdb
         SET diperbarui_pada = NOW()
         WHERE id = $1`,
        [params.applicationId],
      );
      await pool.query(
        `INSERT INTO riwayat_status_ppdb (pendaftaran_ppdb_id, status_sebelumnya, status, catatan)
         VALUES ($1, $2, $2, $3)`,
        [
          params.applicationId,
          params.currentStatus,
          `Wali murid mengunggah ulang berkas ${params.documentType.replaceAll("_", " ")}.`,
        ],
      );
    }
    const oldKey = previous.rows[0]?.file_url as string | undefined;
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
  const documentTypeId = await resolveDocumentTypeId(documentType);
  if (!documentTypeId) return c.json({ error: "Jenis berkas tidak dikenal atau nonaktif." }, 400);
  if (!(file instanceof File) || file.size === 0) return c.json({ error: "Berkas wajib dipilih." }, 400);
  if (file.size > 5 * 1024 * 1024) return c.json({ error: "Ukuran berkas maksimal 5 MB." }, 413);
  if (!documentMimeTypes.has(file.type)) return c.json({ error: "Format berkas harus PDF, JPG, PNG, atau WebP." }, 415);

  const candidates = await pool.query(
    `SELECT a.id, a.status, g.nomor_hp
     FROM pendaftaran_ppdb a
     JOIN wali_siswa g ON g.id = a.wali_utama_id
     WHERE a.id = $1 AND a.nomor_pendaftaran = $2`,
    [id, applicationNumberValue],
  );
  const matched = candidates.rows.find((row) => canonicalPhone(String(row.nomor_hp ?? "")) === phoneCanon);
  if (!matched) return c.json({ error: "Pendaftaran tidak ditemukan." }, 404);

  try {
    const result = await storeApplicationDocument({
      applicationId: id,
      applicationNumber: applicationNumberValue,
      currentStatus: String(matched.status),
      documentType,
      documentTypeId,
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
  const documentTypeId = await resolveDocumentTypeId(documentType);
  if (!documentTypeId) return c.json({ error: "Jenis berkas tidak dikenal atau nonaktif." }, 400);
  if (!(file instanceof File) || file.size === 0) return c.json({ error: "Berkas wajib dipilih." }, 400);
  if (file.size > 5 * 1024 * 1024) return c.json({ error: "Ukuran berkas maksimal 5 MB." }, 413);
  if (!documentMimeTypes.has(file.type)) return c.json({ error: "Format berkas harus PDF, JPG, PNG, atau WebP." }, 415);

  const candidates = await pool.query(
    `SELECT a.id::text, a.status, g.nomor_hp
     FROM pendaftaran_ppdb a
     JOIN wali_siswa g ON g.id = a.wali_utama_id
     WHERE a.nomor_pendaftaran = $1`,
    [applicationNumberValue],
  );
  const matched = candidates.rows.find((row) => canonicalPhone(String(row.nomor_hp ?? "")) === phoneCanon);
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
      documentTypeId,
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
    `SELECT file_url, nama_file FROM dokumen_pendaftaran_ppdb
     WHERE id = $1 AND pendaftaran_ppdb_id = $2`,
    [documentId, id],
  );
  if (!result.rows[0]) return c.json({ error: "Berkas tidak ditemukan." }, 404);
  try {
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: "ppdb-documents",
        Key: result.rows[0].file_url,
        ResponseContentDisposition: `inline; filename="${String(result.rows[0].nama_file).replace(/["\\]/g, "-")}"`,
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
    `UPDATE dokumen_pendaftaran_ppdb
     SET status_verifikasi = $3, catatan_verifikasi = $4,
         diverifikasi_oleh = $5, diverifikasi_pada = NOW()
     WHERE id = $1 AND pendaftaran_ppdb_id = $2
     RETURNING id::text AS id, kode_jenis_dokumen AS type, nama_file AS "fileName",
               status_verifikasi AS status, catatan_verifikasi AS note`,
    [documentId, id, status, cleanText(body?.note, 1000) || null, actorId(c.req.raw)],
  );
  if (!result.rows[0]) return c.json({ error: "Berkas tidak ditemukan." }, 404);
  return c.json({ document: result.rows[0] });
});

app.get("/registrations", async (c) => {
  if (!hasAdminAccess(c.req.raw)) return c.json({ error: "Unauthorized" }, 401);
  try {
    const result = await pool.query(`${applicationSelect} ORDER BY a.dibuat_pada DESC`);
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
    `${applicationSelect} WHERE a.nomor_pendaftaran = $1`,
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
      "SELECT status FROM pendaftaran_ppdb WHERE id = $1 FOR UPDATE",
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
        `INSERT INTO wawancara_ppdb (
           pendaftaran_ppdb_id, jadwal_wawancara, lokasi, pewawancara_id, status
         ) VALUES ($1, $2::timestamptz, $3, $4, 'SCHEDULED')
         ON CONFLICT (pendaftaran_ppdb_id) DO UPDATE SET
           jadwal_wawancara = EXCLUDED.jadwal_wawancara,
           lokasi = EXCLUDED.lokasi,
           pewawancara_id = EXCLUDED.pewawancara_id,
           status = 'SCHEDULED',
           catatan_observasi = NULL,
           rekomendasi = NULL,
           selesai_pada = NULL,
           diperbarui_pada = NOW()`,
        [id, scheduledAt, location, actor],
      );
      await client.query(
        `UPDATE pendaftaran_ppdb
         SET status = $2,
             catatan_keputusan = COALESCE($4, catatan_keputusan),
             data_tambahan = data_tambahan || $3::jsonb,
             diperbarui_pada = NOW()
         WHERE id = $1`,
        [id, nextStatus, metadata, note],
      );
    } else if (body.action === "COMPLETE_INTERVIEW") {
      const observationNotes = cleanText(body.metadata?.observationNotes, 4000);
      const recommendation = cleanText(body.metadata?.recommendation, 20).toUpperCase();
      const rawScores = body.metadata?.scores;

      const activeCriteria = await client.query(
        `SELECT id::text, kode, bobot::float AS bobot
         FROM kriteria_penilaian_ppdb
         WHERE status = 'ACTIVE' AND status_aktif = TRUE
         ORDER BY urutan ASC, kode ASC`,
      );
      const criteriaList = activeCriteria.rows as Array<{ id: string; kode: string; bobot: number }>;
      const scores: Record<string, number> = {};
      for (const crit of criteriaList) {
        const val = typeof rawScores === "object" && rawScores !== null
          ? Number((rawScores as Record<string, unknown>)[crit.kode])
          : Number.NaN;
        scores[crit.kode] = val;
      }
      const scoresAreValid = criteriaList.length > 0 && criteriaList.every(
        (crit) => Number.isFinite(scores[crit.kode]) && scores[crit.kode] >= 0 && scores[crit.kode] <= 100,
      );
      if (!observationNotes || !["ACCEPT", "WAITLIST", "REJECT"].includes(recommendation) || !scoresAreValid) {
        await client.query("ROLLBACK");
        return c.json({ error: "Seluruh nilai observasi aktif, catatan, dan rekomendasi wajib diisi." }, 400);
      }
      nextStatus = "INTERVIEW_COMPLETED";
      const interview = await client.query(
        `UPDATE wawancara_ppdb
         SET status = 'COMPLETED', catatan_observasi = $2,
             rekomendasi = $3, selesai_pada = NOW(),
             pewawancara_id = COALESCE($4, pewawancara_id), diperbarui_pada = NOW()
         WHERE pendaftaran_ppdb_id = $1
         RETURNING id`,
        [id, observationNotes, recommendation, actor],
      );
      if (!interview.rows[0]) {
        await client.query("ROLLBACK");
        return c.json({ error: "Jadwal wawancara tidak ditemukan." }, 409);
      }
      const totalWeight = criteriaList.reduce((acc, item) => acc + item.bobot, 0) || 100;
      const weightedSum = criteriaList.reduce((acc, item) => acc + scores[item.kode] * (item.bobot / totalWeight), 0);
      const totalScore = Number(weightedSum.toFixed(2));
      const assessment = await client.query(
        `INSERT INTO penilaian_ppdb (
           pendaftaran_ppdb_id, dinilai_oleh, tanggal_penilaian, total_nilai, rekomendasi, catatan
         ) VALUES ($1, $2, NOW(), $3, $4, $5)
         ON CONFLICT (pendaftaran_ppdb_id) DO UPDATE SET
           dinilai_oleh = EXCLUDED.dinilai_oleh,
           tanggal_penilaian = NOW(),
           total_nilai = EXCLUDED.total_nilai,
           rekomendasi = EXCLUDED.rekomendasi,
           catatan = EXCLUDED.catatan,
           diperbarui_pada = NOW()
         RETURNING id`,
        [id, actor, totalScore, recommendation, observationNotes],
      );
      for (const crit of criteriaList) {
        await client.query(
          `INSERT INTO detail_penilaian_ppdb (penilaian_ppdb_id, kriteria_penilaian_ppdb_id, nilai)
           VALUES ($1, $2::uuid, $3)
           ON CONFLICT (penilaian_ppdb_id, kriteria_penilaian_ppdb_id) DO UPDATE SET nilai = EXCLUDED.nilai`,
          [assessment.rows[0].id, crit.id, scores[crit.kode]],
        );
      }
      await client.query(
        `UPDATE pendaftaran_ppdb
         SET status = $2,
             catatan_keputusan = COALESCE($4, catatan_keputusan),
             data_tambahan = data_tambahan || $3::jsonb,
             diperbarui_pada = NOW()
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
        `SELECT a.nomor_pendaftaran, a.nama_lengkap, a.nama_panggilan, a.jenis_kelamin, a.tempat_lahir, a.tanggal_lahir,
                a.alamat, a.nik_calon_siswa, a.agama, a.nomor_kk,
                a.anak_ke, a.jumlah_saudara, a.wali_utama_id, g.nama_lengkap AS nama_wali, g.nomor_hp,
                k.id AS class_id, k.nama AS resolved_class_name, k.kapasitas AS class_capacity
         FROM pendaftaran_ppdb a
         JOIN wali_siswa g ON g.id = a.wali_utama_id
         LEFT JOIN kelas k ON k.status = 'ACTIVE'
           AND (($4 <> '' AND k.id::text = $4) OR k.nama = $2 OR k.nama = $3)
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
           FROM siswa_kelas sk
           LEFT JOIN siswa s ON s.id = sk.siswa_id
           WHERE sk.kelas_id = $1
             AND sk.status = 'ACTIVE'
             AND COALESCE(s.pendaftaran_ppdb_id::text, '') <> $2`,
          [resolvedClassId, id],
        );
        if (Number(capCheck.rows[0]?.active_count ?? 0) >= classCapacity) {
          await client.query("ROLLBACK");
          return c.json({ error: `Kapasitas kelas ${resolvedClassName} sudah penuh (${classCapacity} santri).` }, 409);
        }
      }
      const student = await client.query(
        `INSERT INTO siswa (
           nis, nisn, pendaftaran_ppdb_id, nama_lengkap, nama_panggilan, jenis_kelamin,
           tempat_lahir, tanggal_lahir, agama, alamat, nomor_kk,
           anak_ke, jumlah_saudara, tanggal_masuk, catatan, nik
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_DATE, $14, $15)
         ON CONFLICT (pendaftaran_ppdb_id) DO UPDATE SET
           nis = EXCLUDED.nis,
           nisn = COALESCE(EXCLUDED.nisn, siswa.nisn),
           nik = COALESCE(EXCLUDED.nik, siswa.nik),
           diperbarui_pada = NOW()
         RETURNING id`,
        [
          nitkm, nisn || null, id, details.rows[0].nama_lengkap, details.rows[0].nama_panggilan,
          details.rows[0].jenis_kelamin, details.rows[0].tempat_lahir,
          details.rows[0].tanggal_lahir, details.rows[0].agama,
          details.rows[0].alamat, details.rows[0].nomor_kk,
          details.rows[0].anak_ke, details.rows[0].jumlah_saudara, `Sumber data: ${details.rows[0].nomor_pendaftaran}`,
          details.rows[0].nik_calon_siswa,
        ],
      );
      await client.query(
        `INSERT INTO siswa_wali (siswa_id, wali_siswa_id, hubungan, wali_utama)
         VALUES ($1, $2, 'WALI', TRUE)
         ON CONFLICT (siswa_id, wali_siswa_id) DO UPDATE SET wali_utama = TRUE`,
        [student.rows[0].id, details.rows[0].wali_utama_id],
      );
      await client.query(
        `UPDATE siswa_kelas
         SET status = 'TRANSFERRED', tanggal_keluar_kelas = CURRENT_DATE, diperbarui_pada = NOW()
         WHERE siswa_id = $1 AND kelas_id <> $2 AND status = 'ACTIVE'`,
        [student.rows[0].id, resolvedClassId],
      );
      await client.query(
        `INSERT INTO siswa_kelas (siswa_id, kelas_id, tanggal_masuk_kelas, status)
         VALUES ($1, $2, CURRENT_DATE, 'ACTIVE')
         ON CONFLICT (siswa_id, kelas_id) DO UPDATE SET
           status = 'ACTIVE',
           tanggal_masuk_kelas = CURRENT_DATE,
           tanggal_keluar_kelas = NULL,
           diperbarui_pada = NOW()`,
        [student.rows[0].id, resolvedClassId],
      );
      const placeMetadata = JSON.stringify({
        ...(body.metadata ?? {}),
        classId: resolvedClassId,
        className: resolvedClassName,
      });
      await client.query(
        `UPDATE pendaftaran_ppdb
         SET status = 'COMPLETED', data_tambahan = data_tambahan || $2::jsonb,
             diperbarui_pada = NOW(), catatan_keputusan = COALESCE($3, catatan_keputusan)
         WHERE id = $1`,
        [id, placeMetadata, note],
      );
      nextStatus = "COMPLETED";
    } else {
      await client.query(
        `UPDATE pendaftaran_ppdb
         SET status = $2::varchar(30),
             diputuskan_pada = CASE WHEN $2::varchar(30) IN ('ACCEPTED', 'REJECTED', 'WAITLISTED') THEN NOW() ELSE diputuskan_pada END,
             diputuskan_oleh = CASE WHEN $2::varchar(30) IN ('ACCEPTED', 'REJECTED', 'WAITLISTED') THEN $7 ELSE diputuskan_oleh END,
             diverifikasi_pada = CASE WHEN $5 = 'VERIFY' THEN NOW() ELSE diverifikasi_pada END,
             diverifikasi_oleh = CASE WHEN $5 = 'VERIFY' THEN $7 ELSE diverifikasi_oleh END,
             catatan_verifikasi = CASE WHEN $5 = 'VERIFY' THEN $3 ELSE catatan_verifikasi END,
             dokumen_kurang = CASE WHEN $5 = 'VERIFY' THEN $6::jsonb ELSE dokumen_kurang END,
             catatan_keputusan = CASE WHEN $5 = 'DECIDE' THEN $3 ELSE catatan_keputusan END,
             data_tambahan = data_tambahan || $4::jsonb,
             diperbarui_pada = NOW()
         WHERE id = $1`,
        [id, nextStatus, note, metadata, body.action, JSON.stringify(body.missingDocuments ?? []), actor],
      );
    }
    if (body.action === "VERIFY") {
      await client.query(
        `INSERT INTO verifikasi_ppdb (
           pendaftaran_ppdb_id, status, catatan, diverifikasi_oleh, diverifikasi_pada
         ) VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (pendaftaran_ppdb_id) DO UPDATE SET
           status = EXCLUDED.status,
           catatan = EXCLUDED.catatan,
           diverifikasi_oleh = EXCLUDED.diverifikasi_oleh,
           diverifikasi_pada = NOW(),
           diperbarui_pada = NOW()`,
        [id, nextStatus === "UNDER_REVIEW" ? "VALID" : "NEEDS_REVISION", note, actor],
      );
    }
    if (body.action === "DECIDE") {
      await client.query(
        `INSERT INTO keputusan_ppdb (
           pendaftaran_ppdb_id, status_keputusan, alasan, diputuskan_oleh, diputuskan_pada
         ) VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (pendaftaran_ppdb_id) DO UPDATE SET
           status_keputusan = EXCLUDED.status_keputusan,
           alasan = EXCLUDED.alasan,
           diputuskan_oleh = EXCLUDED.diputuskan_oleh,
           diputuskan_pada = NOW()`,
        [id, nextStatus, note, actor],
      );
    }
    await client.query(
      `INSERT INTO riwayat_status_ppdb (pendaftaran_ppdb_id, status_sebelumnya, status, catatan, diubah_oleh)
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
      "SELECT wali_utama_id FROM pendaftaran_ppdb WHERE id = $1 FOR UPDATE",
      [id],
    );
    if (!application.rows[0]) {
      await client.query("ROLLBACK");
      return c.json({ error: "Pendaftaran tidak ditemukan." }, 404);
    }
    const storedObjects = await client.query(
      "SELECT file_url FROM dokumen_pendaftaran_ppdb WHERE pendaftaran_ppdb_id = $1 AND file_url IS NOT NULL",
      [id],
    );
    const placedStudent = await client.query(
      "SELECT id FROM siswa WHERE pendaftaran_ppdb_id = $1",
      [id],
    );
    for (const student of placedStudent.rows) {
      await client.query("DELETE FROM siswa_kelas WHERE siswa_id = $1", [student.id]);
      await client.query("DELETE FROM siswa_wali WHERE siswa_id = $1", [student.id]);
      await client.query("DELETE FROM absensi_siswa WHERE siswa_id = $1", [student.id]);
      await client.query("DELETE FROM penilaian_siswa WHERE siswa_id = $1", [student.id]);
      await client.query("DELETE FROM catatan_harian_siswa WHERE siswa_id = $1", [student.id]);
      await client.query("DELETE FROM rapor WHERE siswa_id = $1", [student.id]);
      await client.query("DELETE FROM tagihan WHERE siswa_id = $1", [student.id]);
      await client.query("DELETE FROM dokumen_siswa WHERE siswa_id = $1", [student.id]);
      await client.query("DELETE FROM siswa WHERE id = $1", [student.id]);
    }
    await client.query("DELETE FROM riwayat_status_ppdb WHERE pendaftaran_ppdb_id = $1", [id]);
    await client.query("DELETE FROM dokumen_pendaftaran_ppdb WHERE pendaftaran_ppdb_id = $1", [id]);
    await client.query("DELETE FROM pendaftaran_ppdb WHERE id = $1", [id]);
    await client.query("DELETE FROM wali_siswa WHERE id = $1", [application.rows[0].wali_utama_id]);
    await client.query("COMMIT");
    const objectKeys = storedObjects.rows.map((row) => row.file_url as string);
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
        nama_file AS "originalName",
        tipe_file AS "mimeType",
        ukuran_file::int AS "fileSizeBytes",
        teks_alternatif AS "altText",
        visibilitas AS visibility,
        dibuat_pada::text AS "createdAt"
      FROM media
      ORDER BY dibuat_pada DESC
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
      `INSERT INTO media (
         object_key, nama_file, tipe_file, ukuran_file, teks_alternatif, visibilitas, diunggah_oleh
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
         id::text,
         object_key AS "objectKey",
         nama_file AS "originalName",
         tipe_file AS "mimeType",
         ukuran_file::int AS "fileSizeBytes",
         teks_alternatif AS "altText",
         visibilitas AS visibility,
         dibuat_pada::text AS "createdAt"`,
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
    "DELETE FROM media WHERE id = $1 RETURNING object_key",
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
    "SELECT object_key, tipe_file, nama_file FROM media WHERE id = $1 AND visibilitas = 'PUBLIC'",
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
      "Content-Type": String(result.rows[0].tipe_file || "application/octet-stream"),
      "Cache-Control": "public, max-age=3600",
    });
  } catch (error) {
    console.error("[cms:media-serve]", error);
    return c.json({ error: "Media gagal dimuat." }, 500);
  }
});

export default app;
