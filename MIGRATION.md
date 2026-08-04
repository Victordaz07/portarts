# Migration: Firebase → Vercel stack

This repo was migrated off Firebase entirely. This document records what changed
and how to move existing data.

## What changed

| Concern | Before (Firebase) | After (Vercel stack) |
|---------|-------------------|----------------------|
| Database | Firestore | **Neon Postgres** + Drizzle ORM (`src/lib/db`) |
| Auth | Firebase Auth (GitHub/Google) | **Auth.js / NextAuth v5** (`src/auth.ts`) |
| Admin gate | `config/portfolio.allowedAdmins` (UIDs in Firestore) + custom claims | `ADMIN_EMAILS` env var (comma-separated emails) |
| File storage | Firebase Storage | **Vercel Blob** (`/api/admin/upload`) |
| Hosting | Firebase Hosting (`firebase deploy`) | **Vercel** (native Next.js) |

### Removed
- `src/lib/firebase.ts`, `src/lib/firebase-admin-server.ts`, `src/lib/firestore*.ts`, `src/lib/auth.ts`
- `src/app/api/admin/sync-admin-claims/` (custom claims are no longer needed)
- `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`, `storage.rules`
- `scripts/sync-admin-claims.ts`, `scripts/seed-projects.ts`, `scripts/add-diario-misional.ts`
- `firebase`, `firebase-admin` npm dependencies

### Added
- `src/lib/db/` — Drizzle schema + Neon client
- `src/lib/data-server.ts` / `src/lib/data-client.ts` — data layers (same function names as the old Firestore modules, so components were untouched)
- `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/context/AuthContext.tsx` (shim over `useSession`)
- `src/app/api/admin/*` — session-protected CRUD/upload routes
- `drizzle.config.ts`, `scripts/seed.ts`

## Data model mapping

Firestore was document-oriented, so each collection maps to a table that keeps
the queryable/sortable fields as real columns and stores the rest of the document
in a `data` JSONB column:

- `projects/{id}` → `projects` table (`id, slug, published, order, featured, name` + `data` JSONB)
- `config/portfolio` → `portfolio_config` table (single row, `id = 'portfolio'`)
- `analytics_daily/{yyyy-mm-dd}` → `analytics_daily` table

## Moving existing Firestore data (optional)

If you have live data in Firestore you want to keep:

1. Export it: `firebase firestore:export gs://<bucket>/backup` (or read each doc with a script using the Admin SDK).
2. For each project document, insert a row: promote `slug/published/order/featured/name`
   to columns and put the remaining fields in `data` (see `scripts/seed.ts` `toRow()` for the exact shape).
3. Insert the `config/portfolio` document as the single `portfolio_config` row.
4. Re-upload any images that lived in Firebase Storage to Vercel Blob and update the
   stored URLs on each project (`coverImage`, `logoUrl`, `gallery[].url`, `ogImage`).

If you're starting fresh, just run `npm run db:push && npm run seed` — the seed
contains the real project content and portfolio config.

## Admin access

Add your email to `ADMIN_EMAILS` (comma-separated) in the environment. Any
authenticated user whose email is on that list can access `/admin`; everyone else
sees the Unauthorized screen.
