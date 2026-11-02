import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: false,
  aiGateway: true,
  functions: {
    ppdbapi: {
      name: "TK Al-Mustam PPDB API",
      source: "./ppdb-api.ts",
      env: {
        PPDB_ADMIN_API_KEY: process.env.PPDB_ADMIN_API_KEY!,
      },
    },
  },
  buckets: {
    "ppdb-documents": { access: "private" },
  },
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    if (!branch.exists) {
      return { ttl: "7d" };
    }
    return {};
  },
});
