# PortArts — Interactive Developer Portfolio

Production-ready portfolio for developers: live app previews in device frames, GitHub integration, and a secure admin CMS. Runs entirely on the **Vercel** stack — **Neon Postgres**, **Auth.js**, and **Vercel Blob**.

**Live site & repo:** use your deployed URL and [GitHub](https://github.com/Victordaz07/portarts) when sharing with recruiters.

---

## Highlights

- **Interactive previews** — Embed demos in phone, tablet, or desktop mockups with optional fullscreen.
- **GitHub** — Lists public repos and renders READMEs via a server-side proxy (optional `GITHUB_TOKEN` for higher API limits).
- **Admin panel** — Autosaving project and portfolio settings; drag-and-drop lists inside forms; image uploads to **Vercel Blob**.
- **Auth** — Sign in with GitHub or Google (**Auth.js / NextAuth v5**); admin access is controlled by the `ADMIN_EMAILS` env var.
- **SEO** — Dynamic metadata and Open Graph configuration from the CMS.

---

## Architecture

| Concern | Implementation |
|---------|----------------|
| Framework | **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** |
| Styling | **Tailwind CSS v4** |
| Database | **Neon Postgres** via **Drizzle ORM** (`src/lib/db`) |
| Auth | **Auth.js (NextAuth v5)** — GitHub + Google, JWT sessions (`src/auth.ts`) |
| File storage | **Vercel Blob** (image uploads, `src/app/api/admin/upload`) |
| Deploy | **Vercel** (native Next.js) |
| Analytics | First-party session analytics in Postgres + optional **Vercel Analytics** |

**Data layers**
- `src/lib/data-server.ts` — server-only Drizzle queries (public reads + admin CRUD + analytics). Imported by Server Components and the `/api/admin/*` routes.
- `src/lib/data-client.ts` — client wrappers that call the session-protected `/api/admin/*` routes (the browser never talks to Postgres directly).
- `src/lib/db/schema.ts` — Postgres schema. Firestore documents map 1:1 onto rows: queryable columns (`slug`, `published`, `order`, …) plus a `data` JSONB blob for the rest of the document.

---

## Quick start (local)

1. **Clone and install**
   ```bash
   git clone https://github.com/Victordaz07/portarts.git
   cd portarts
   npm install
   ```
2. **Environment** — Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL` — a Neon (or any Postgres) connection string.
   - `AUTH_SECRET` — run `npx auth secret`.
   - `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` and/or `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — OAuth app credentials.
   - `ADMIN_EMAILS` — comma-separated emails allowed into `/admin`.
   - `BLOB_READ_WRITE_TOKEN` — from a Vercel Blob store (only needed for image uploads).
3. **Create the schema**
   ```bash
   npm run db:push
   ```
4. **Seed real content** (Victor's projects + portfolio config)
   ```bash
   npm run seed
   ```
5. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Sign in at `/admin` with an account whose email is in `ADMIN_EMAILS`.

---

## Deploy to Vercel

1. **Import the repo** into Vercel (New Project → import `portarts`). Framework preset: **Next.js**.
2. **Add a database** — Project → **Storage → Neon** (Postgres). Vercel injects `DATABASE_URL` automatically.
3. **Add a Blob store** — Project → **Storage → Blob**. Vercel injects `BLOB_READ_WRITE_TOKEN` automatically.
4. **Set env vars** — `AUTH_SECRET`, `AUTH_GITHUB_ID/SECRET`, `AUTH_GOOGLE_ID/SECRET`, `ADMIN_EMAILS`, optional `GITHUB_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_RESUME_URL`.
5. **OAuth callback URLs** — in your GitHub/Google OAuth apps, add:
   - `https://<your-domain>/api/auth/callback/github`
   - `https://<your-domain>/api/auth/callback/google`
6. **Create the schema on the remote DB** — from your machine, with the production `DATABASE_URL` in `.env.local`, run `npm run db:push` (and `npm run seed` once to load content). Alternatively run these as a one-off against the Neon branch.
7. **Deploy.** Vercel builds and hosts automatically on every push.

> Migrating from an earlier Firebase deployment? See [`MIGRATION.md`](./MIGRATION.md) for what changed and how to move data.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run db:push` | Create/update Postgres tables from the Drizzle schema |
| `npm run db:generate` | Generate SQL migration files |
| `npm run db:studio` | Open Drizzle Studio (browse/edit the DB) |
| `npm run seed` | Load the real projects + portfolio config into Postgres (idempotent) |

---

## Documentation

| File | Contents |
|------|----------|
| `MIGRATION.md` | Firebase → Vercel migration notes (data model, auth, storage) |
| `PROJECT-BRIEF.md` | Product story and feature depth (historical planning doc) |
| `PORTFOLIO-PRD-CURSOR.md` | Original product / implementation spec (historical) |
| `docs/resume-upload.md` | Hosting a resume PDF and linking it via `NEXT_PUBLIC_RESUME_URL` |

---

## License

MIT
