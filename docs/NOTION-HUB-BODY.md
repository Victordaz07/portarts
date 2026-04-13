# PortArts — Product walkthrough

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · Firebase (Auth, Firestore, Storage) · Firebase Hosting · optional Vercel Analytics.

**Repo:** [github.com/Victordaz07/portarts](https://github.com/Victordaz07/portarts)

**Docs in repo:** `README.md` (this story), `PROJECT-BRIEF.md` (schemas & security), `SETUP-PORTARTS.md` (Firebase setup).

---

## 1. How the public landing works (`/`)

The home page is **server-rendered** and **force-dynamic**. It is split into **three async sections**, each in `Suspense`, so the page shell appears while Firestore-backed sections stream in:

### Hero (`HomeHeroAsync`)

- Loads **`config/portfolio`** from Firestore (`getPortfolioConfig`).
- **`Hero`** combines:
  - **Scrolling tech marquees** — frontend stack from `techStack` and optional **AI / workflow** tools (`aiTools` or inferred defaults).
  - **Headline** — `heroHeadline` with fallbacks (`lib/hero-defaults.ts`).
  - **Subtitle**, optional **mini-bio**, **intro / testimonial** block.
  - **Animated stat chips** and Framer Motion (respects **reduced motion**).
- Result: **CMS text + graphic motion** in one fold.

### Projects (`HomeProjectsAsync`)

- **`getPublishedProjects()`** — only **`published: true`** documents, ordered for display.
- **`ProjectGrid`** → **`ProjectCard`** → links to **`/project/[slug]`**. Drafts never show.

### Lower sections (`HomeLowerAsync`)

- **GitHub** — public repos for **`githubUsername`** via **`/api/github`** (server proxy; optional `GITHUB_TOKEN`).
- **About** — paragraphs + stat cards from config.
- **Contact** — email + **social links**.

### Shell & analytics

- **`AppShell`**: public routes get **Navbar**, centered **max-width** content, **Footer**, **Vercel Analytics**, and **`PortfolioSessionTracker`** (feeds admin analytics). **`/admin`** uses a **full-width dark** layout without marketing nav.
- **`HomeScrollReveal`** — scroll-triggered reveals.

### SEO

- Root **`generateMetadata`** uses **`config/portfolio`** for title, description, **Open Graph**, Twitter cards, and optional **OG image**. JSON-LD **`Person`** for richer indexing.

---

## 2. How the public project page works (`/project/[slug]`)

- Server loads the project by **slug**. Unpublished → **404**.
- Typical sections: **hero** (cover / branding), **device previews** (up to **three** URLs: phone / tablet / desktop; **iframe** or **link banner** if embedding is blocked), **demo credentials**, Markdown **body**, **features**, **tech**, **timeline**, **README** from GitHub if configured, **gallery**, **external links**.
- **Metadata** uses project title, description, and cover/gallery for **OG/Twitter**.

---

## 3. How the admin CMS works (`/admin`)

### Access

- **Firebase Auth** (GitHub or Google).
- Admin if UID ∈ **`config/portfolio.allowedAdmins`**.
- Otherwise: **Unauthorized** page with **copyable UID** + Firestore check.

### Navigation

- **Dashboard** · **Projects** · **Settings** · link to **public site** · **sign out**.

### Dashboard

- Counts **all** vs **published** projects.
- **Analytics** snapshots (`analytics_daily`) + link to Vercel Analytics docs.

### Projects

| Action | Detail |
|--------|--------|
| **List** | Same **card UI** as the public site (admin variant): **Publish/Unpublish**, **Delete**, **Edit**. |
| **New** | **`ProjectForm`** → create in Firestore → redirect to **edit**. |
| **Edit** | **Autosave** to Firestore + manual save. |

**Project editor (graphic + content together)**

- **Identity:** name, **slug** (live uniqueness), tagline, short/long copy, featured, status, tags.
- **Visuals:** **theme** presets or **custom color**; **cover** & **logo**; show/hide **title on card**.
- **Live demos:** up to **three** preview slots — URL, **device frame**, optional **no-embed** (link banner).
- **Device preview** in admin mirrors the public **`DevicePreview`**.
- **Lists (drag reorder):** features, timeline, gallery.
- **Extras:** metadata, KPI JSON, value props, workflow, GitHub repo (README), app store links, demo credentials.
- **Images:** **Firebase Storage** under `projects/{id}/…`.
- **Publishing:** only **`published: true`** appears on the **home** grid.

### Portfolio settings (edit the landing itself)

- Single document **`config/portfolio`** — same data the **landing** reads.
- **Autosave** (~2s debounce after edits).
- Fields: **SEO**, **hero** copy, **GitHub username**, contact, **socials**, **about** + **stats** (sortable), **tech** + **AI** marquees, **mini-bio** / intro blocks, **`allowedAdmins`**.
- **`HomePreview`** — scaled live preview of headline + about + stats (**graphic + textual** at once).
- **Sync Storage permissions** — sets **`portfolioAdmin`** claim via **`/api/admin/sync-admin-claims`** (needs Admin SDK on server).

---

## 4. Recruiters — how to verify

1. Read **`README.md`** and **`PROJECT-BRIEF.md`** in the repo.
2. Clone, `npm install`, `.env.local` from **`.env.example`**, Firebase project with **`config/portfolio`** seeded.
3. Optional: add your **production URL** and **resume PDF URL** below.

**Production URL:** *(add yours)*

**Resume (`NEXT_PUBLIC_RESUME_URL`):** *(optional)*

---

*Synced from the PortArts repository — update this page when `README` / `PROJECT-BRIEF` change.*
