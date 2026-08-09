import "server-only";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Neon serverless Postgres client (HTTP driver) — ideal for Vercel serverless
 * functions and edge/node runtimes. Reads the connection string from the env
 * var Vercel's Neon integration provides (`DATABASE_URL`, falling back to the
 * `POSTGRES_*` names some integrations set).
 */
function resolveConnectionString(): string {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) {
    throw new Error(
      "[db] Missing DATABASE_URL. Add the Neon (Postgres) integration on Vercel, or set DATABASE_URL locally."
    );
  }
  return url;
}

let cached: ReturnType<typeof createClient> | undefined;

function createClient() {
  const sql = neon(resolveConnectionString());
  return drizzle(sql, { schema });
}

/** Lazily-initialized singleton so importing this module never throws at build time. */
export function getDb() {
  if (!cached) cached = createClient();
  return cached;
}

/** True when a Postgres connection string is configured (used to degrade gracefully). */
export function isDbConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING
  );
}

export { schema };
