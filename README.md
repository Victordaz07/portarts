# PortArts — Interactive Developer Portfolio

Production-ready portfolio for developers: live app previews in device frames, GitHub integration, and a secure admin CMS backed by Firebase.

**Live site & repo:** use your deployed URL and [GitHub](https://github.com/Victordaz07/portarts) when sharing with recruiters.

---

## Highlights

- **Interactive previews** — Embed demos in phone, tablet, or desktop mockups with optional fullscreen.
- **GitHub** — Lists public repos and renders READMEs via a server-side proxy (optional `GITHUB_TOKEN` for higher API limits).
- **Admin panel** — Autosaving project and portfolio settings; drag-and-drop lists inside forms; image uploads to Firebase Storage.
- **Auth** — Sign in with GitHub or Google; admin access is controlled by Firestore (`config/portfolio.allowedAdmins`) and optional custom claims for Storage.
- **SEO** — Dynamic metadata and Open Graph configuration from the CMS.

---

## How the public site works (landing)

The home route (`src/app/page.tsx`) is a **server-rendered** page (`dynamic = "force-dynamic"`) split into three **async sections**, each wrapped in `Suspense` so the shell loads immediately while data streams in:

1. **`HomeHeroAsync`** — Loads `config/portfolio` from Firestore (via `getPortfolioConfig` in `lib/firestore-server`) and renders **`Hero`**. The hero combines **motion** (Framer Motion, respects reduced motion), a **scrolling tech marquee** (frontend stack + optional AI workflow tools resolved from config), the **headline** (`heroHeadline` or sensible defaults), **subtitle**, optional **mini-bio** and **intro** blocks, and **stat chips**. Content is therefore a mix of **CMS-driven copy** and **defaults** in `lib/hero-defaults.ts` / `lib/tech-stack.ts`.

2. **`HomeProjectsAsync`** — Fetches **published** projects with `getPublishedProjects()`, ordered for the grid. **`ProjectGrid`** renders **`ProjectCard`** entries linking to `/project/[slug]`. Drafts never appear here.

3. **`HomeLowerAsync`** — Again reads portfolio config and renders:
   - **GitHub** (`GitHubRepos`) — Public repos for `githubUsername` from config, via the **`/api/github`** proxy (no CORS issues; optional `GITHUB_TOKEN`).
   - **About** — Paragraphs and stats from config (`AboutSection`).
   - **Contact / CTA** — Email and `socialLinks` (`CTASection`).

**Shell & analytics** — `AppShell` (`src/components/layout/AppShell.tsx`) wraps non-admin routes with **`Navbar`**, a centered **max-width column**, **`Footer`**, **Vercel Analytics**, and **`PortfolioSessionTracker`** (session analytics written for the admin dashboard). Admin routes (`/admin/*`) skip the marketing chrome and use a full-width dark layout.

**SEO & metadata** — `src/app/layout.tsx` **`generateMetadata`** builds title, description, Open Graph, and Twitter cards from **`config/portfolio`** (`metaDescription`, `ogImage`, etc.), with fallbacks. JSON-LD for the person is included for rich results.

**Scroll polish** — `HomeScrollReveal` adds staged reveal behavior as users scroll the landing sections.

---

## How the admin CMS works

**Access** — `/admin` requires **Firebase Auth** (GitHub or Google). The client checks **`config/portfolio.allowedAdmins`** (Firestore UIDs). If your UID is missing, you get an **Unauthorized** screen with copyable UID and a read-only check against Firestore (`src/app/admin/layout.tsx`).

**Navigation** — **`AdminSidebar`**: **Dashboard**, **Projects**, **Settings**; link back to the public site; sign out.

### Dashboard (`/admin`)

- Loads **all projects** (drafts + published) and **analytics aggregates** (`analytics_daily`) for charts/insights.
- Quick counts: total vs **published**.
- Links to create a project, browse all projects, and Vercel Analytics docs.

### Projects (`/admin/projects` & editor)

- **List** — Same **`ProjectCard`** visual language as the public site (with admin actions): **Publish / Unpublish** toggles `published` in Firestore, **Delete** removes the project, **Edit** opens the full form. Opening the public **`/project/[slug]`** from the card is supported where implemented.
- **New** (`/admin/projects/new`) — **`ProjectForm`** validates a unique **slug**, creates a document with an **`order`** value, then redirects to **`/admin/projects/[id]/edit`**.
- **Edit** — **`ProjectForm`** supports **autosave** (debounced writes to Firestore) plus explicit save. The form merges **visual branding** and **content**:
  - **Identity:** name, slug (live uniqueness check), tagline, short/long description (Markdown on the public page), featured flag, status pill, tags.
  - **Visual theme:** preset **themes** (Fleet, Family, Focus, Gospel, Default) or **custom** color; **cover image** and optional **logo** on cards; control whether the **title** prints on the card.
  - **Live demos:** up to **three preview slots** — URL, **device type** (phone / tablet / desktop), label, and **embed vs link banner** when a site blocks iframes. **`DevicePreview`** mirrors what visitors see on `/project/[slug]`.
  - **Value narrative:** problem / role / outcome, optional KPI JSON, workflow block.
  - **Structured content (drag-and-reorder lists):** features, timeline, gallery; free-form **metadata** key/value; tech stack; **GitHub** repo for README embedding; external **links** (live app, GitHub, Figma, stores); optional **demo credentials** block.
  - **Publishing:** **`published`** — only `true` projects appear on the home grid.

Images upload to **Firebase Storage** under the project id; URLs are stored on the project document.

### Portfolio settings (`/admin/settings`)

This is the **site-wide** editor for the **landing**: it edits the same **`config/portfolio`** document the public home consumes.

- **Autosave** — Changes debounce (~2s) and persist with **`updatePortfolioConfig`**; status shows saved / saving / unsaved.
- **Copy + visuals together** — Fields include site **title**, **hero headline**, **subtitle**, **SEO** (meta description, OG image URL), **GitHub username** for the repo section, **email**, **social links**, **about** paragraphs and **stats** (with **sortable** lists), **tech stack** and optional **AI tools** lists (powering hero marquees), optional **mini-bio** and **intro** testimonial-style block.
- **`HomePreview`** — A scaled-down live preview of headline + about + stats so you can **see layout and copy** without leaving the admin.
- **Admins & Storage** — Edit **`allowedAdmins`** (UID list). **Sync Storage permissions** calls **`/api/admin/sync-admin-claims`** to set the **`portfolioAdmin`** custom claim for Storage rules (requires Admin SDK on the server, e.g. `FIREBASE_SERVICE_ACCOUNT_JSON` on Vercel).

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | **Next.js 16** (App Router) + **React 19** + **TypeScript** |
| Styling | **Tailwind CSS v4** |
| Backend / data | **Firebase** — Authentication, Firestore, Storage |
| Deploy | **Firebase Hosting** (`npm run deploy`) — see `firebase.json` |
| Analytics | **Vercel Analytics** (optional) |

---

## Quick start

1. **Clone and install**
   ```bash
   git clone https://github.com/Victordaz07/portarts.git
   cd portarts
   npm install
   ```
2. **Environment** — Copy `.env.example` to `.env.local` and fill in Firebase web app keys from the [Firebase Console](https://console.firebase.google.com/).
3. **Firebase project** — Enable **Authentication** (GitHub + Google), **Firestore**, and **Storage**. Add your local and production domains under Authentication → Settings → **Authorized domains**.
4. **Seed config** — Create Firestore document `config/portfolio` with at least `allowedAdmins: ["<your-firebase-auth-uid>"]`. Full field list: `PROJECT-BRIEF.md`.
5. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

For a step-by-step Firebase and CLI walkthrough, see **`SETUP-PORTARTS.md`**. For architecture, data model, and security: **`PROJECT-BRIEF.md`**.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run deploy` | `next build` + `firebase deploy` |
| `npm run sync-admin-claims` | Sync `portfolioAdmin` custom claims from `allowedAdmins` (requires service account locally) |

---

## Documentation

| File | Contents |
|------|----------|
| `PROJECT-BRIEF.md` | Same product story in more technical depth (schemas, security, file map) — **pair with this README** |
| `SETUP-PORTARTS.md` | Detailed Firebase + deploy setup |
| `PORTFOLIO-PRD-CURSOR.md` | Original product / implementation spec |
| `docs/firebase-resume-upload.md` | Hosting a resume PDF and linking it via `NEXT_PUBLIC_RESUME_URL` |
| `docs/NOTION-HUB-BODY.md` | Canonical long-form copy for the [Notion hub](https://www.notion.so/336ea9f315d880a0b2e3fe078f5dc239) (keep in sync with `README` product sections) |

---

## License

MIT
