import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load local env for `drizzle-kit push`/`generate` (Vercel provides these at runtime).
config({ path: ".env.local" });
config({ path: ".env" });

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: url ?? "postgres://user:pass@localhost:5432/portarts",
  },
  strict: true,
  verbose: true,
});
