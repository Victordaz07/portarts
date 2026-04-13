# PortArts — Project brief

**Last updated:** April 2026  
**Version:** 0.1.0 (see `package.json`)  
**Firebase project:** portarts  
**Team / personal workspace (Notion):** [Portarts hub](https://www.notion.so/Portarts-336ea9f315d880a0b2e3fe078f5dc239) — use for priorities and decisions; keep this file aligned when the product changes.

---

## 1. Executive summary

**PortArts** is an interactive developer portfolio built with **Next.js 16** and **Firebase**. It showcases projects with live previews (mobile / tablet / desktop), pulls in GitHub repositories and READMEs, and manages all content through an authenticated admin experience.

---

## 2. Technology stack

| Technology | Version | Role |
|------------|---------|------|
| **Next.js** | 16.1.6 | App Router, SSR, API routes |
| **React** | 19.2.3 | UI |
| **TypeScript** | ^5 | Static typing |
| **Tailwind CSS** | ^4 | Styling |
| **Firebase** | ^12.10.0 | Auth, Firestore, Storage |
| **@dnd-kit** | ^6.3.1 / ^10.0.0 | Drag-and-drop (ordering lists) |
| **react-markdown** | ^10.1.0 | GitHub README rendering |
| **lucide-react** | ^0.576.0 | Icons |
| **framer-motion** | ^12.x | UI motion |
| **recharts** | ^3.x | Admin charts |
| **@vercel/analytics** | ^2.x | Web analytics (optional) |

---

## 3. Architecture

### 3.1 Repository layout

```
src/
├── app/
│   ├── page.tsx             # Public home
│   ├── layout.tsx           # Root layout, dynamic metadata
│   ├── admin/               # Admin (protected)
│   │   ├── layout.tsx       # Auth guard, login, sidebar
│   │   ├── page.tsx         # Admin dashboard
│   │   ├── projects/        # Project CRUD
│   │   └── settings/        # Portfolio settings
│   ├── project/[slug]/      # Public project detail
│   └── api/github/          # GitHub proxy (repos, README)
├── components/
│   ├── home/
│   ├── project/
│   ├── admin/
│   ├── layout/
│   └── ui/
├── context/
│   └── AuthContext.tsx
└── lib/
    ├── firebase.ts
    ├── firestore.ts
    ├── auth.ts
    └── types.ts
```

### 3.2 Data flow

- **Public:** Next.js Server Components read Firestore (`getPortfolioConfig`, `getPublishedProjects`, `getProjectBySlug`) — Admin SDK when configured.
- **Admin:** Firebase Auth (GitHub / Google). UID must appear in `config/portfolio.allowedAdmins`.
- **Images:** Uploaded to Firebase Storage under `projects/{id}/…`; URLs stored in Firestore.
- **GitHub:** `/api/github` proxies the GitHub API (avoids CORS; optional token for rate limits).

### 3.3 Public landing page (`/`)

| Piece | Role |
|--------|------|
| `src/app/page.tsx` | Orchestrates `HomeHeroAsync`, `HomeProjectsAsync`, `HomeLowerAsync` inside `HomeScrollReveal` + `Suspense` fallbacks. |
| `HomeHeroAsync` | Server-loads `getPortfolioConfig()` → `Hero` (marquee, H1 from `heroHeadline` / defaults, subtitle, stats, mini-bio, intro blocks). |
| `HomeProjectsAsync` | `getPublishedProjects()` → `ProjectGrid` / `ProjectCard` → links to `/project/[slug]`. |
| `HomeLowerAsync` | `GitHubRepos`, `AboutSection`, `CTASection` — all driven by `config/portfolio`. |
| `AppShell` | Public: `Navbar`, max-width main, `Footer`, Vercel Analytics, `PortfolioSessionTracker`. Admin: full-width dark shell, no marketing nav. |
| `layout.tsx` | `generateMetadata` from Firestore config; JSON-LD `Person`; Geist fonts. |

### 3.4 Public project page (`/project/[slug]`)

Server Component resolves the project by slug (`getProjectBySlug`). Typical blocks: **`ProjectHero`** (cover / branding), **`DevicePreview`** / **`PreviewLinkBanner`** (multi-slot previews, embed rules), **demo credentials**, Markdown body, **feature grid**, **tech badges**, **timeline**, **README** from GitHub if `githubRepo` set, **gallery**, **ProjectLinks**. Metadata (OG/Twitter) uses project title, description, and cover/gallery image. `notFound()` if unpublished or missing.

### 3.5 Admin entry and layout

| Step | Behavior |
|------|----------|
| Not signed in | `AdminLoginPage` (GitHub / Google). |
| Signed in, not in `allowedAdmins` | `UnauthorizedPage` with UID copy + Firestore read-only check. |
| Authorized | `AdminShell` + `AdminSidebar` + `children` (Dashboard, Projects, Settings). |

### 3.6 Admin — projects

| Route | Behavior |
|-------|----------|
| `/admin` | Dashboard: project counts, analytics snapshots, shortcuts. |
| `/admin/projects` | Grid of **all** projects with publish toggle, delete, edit; uses `ProjectCard` **admin** variant. |
| `/admin/projects/new` | `ProjectForm` submit → `createProject` → redirect to edit. |
| `/admin/projects/[id]/edit` | Load project; `ProjectForm` with **autosave** (`updateProject`) and manual save. |

**`ProjectForm`** (see `src/components/admin/ProjectForm.tsx`) groups **collapsible sections** covering: core fields, theme and card visuals, up to **three** live preview URLs (device type + embed flag), value props, KPIs (JSON), features / timeline / gallery (**sortable**), metadata, links, GitHub, publishing. Images via **`ImageUploader`** → Storage `projects/{id}/…`.

### 3.7 Admin — portfolio settings (`/admin/settings`)

Single-document editor for **`config/portfolio`**: identity & SEO, hero copy, GitHub username, contact & socials, about + stats (**sortable**), tech + AI tool strings, `allowedAdmins`, **HomePreview** miniature of the hero/about, **sync admin claims** for Storage. **Autosave** ~2s debounce after edits (`updatePortfolioConfig`).

---

## 4. Firestore

### 4.1 Collections

| Collection | Document | Description |
|------------|----------|-------------|
| **config** | `portfolio` | Global portfolio settings |
| **projects** | auto-id | Individual projects |
| **analytics_daily** | `{dayId}` | Aggregated metrics (admin read; writes from backend only) |

### 4.2 `config/portfolio` schema

| Field | Type | Description |
|-------|------|-------------|
| name | string | Author name |
| title | string | Site / browser title base |
| heroHeadline | string (optional) | Hero H1 (fallbacks in `lib/hero-defaults.ts`) |
| subtitle | string | Hero subtitle |
| email | string | Contact email |
| githubUsername | string | GitHub user for repo listing |
| about | string[] | “About” paragraphs |
| stats | array | `{ value, label }` for stat cards |
| techStack | string[] | Frontend marquee chips |
| aiTools | string[] (optional) | AI / workflow marquee; inferred if omitted |
| socialLinks | map | github, linkedin, twitter, website |
| allowedAdmins | string[] | Firebase Auth UIDs allowed in admin |
| metaDescription | string | SEO meta description |
| ogImage | string | Open Graph image URL |
| miniBio | object (optional) | `{ headline, body }` between hero and projects |
| introTestimonial | object (optional) | Intro block under hero (`quote`, `enabled`, etc.) |

### 4.3 `projects` schema

| Field | Type | Description |
|-------|------|-------------|
| slug | string | URL-friendly unique slug |
| name | string | Project name |
| tagline | string | Short tagline |
| description | string | Short description |
| fullDescription | string | Long description (Markdown) |
| featured | boolean | Featured flag |
| published | boolean | Visible on public site |
| order | number | Sort order |
| status | map | `{ text, color }` |
| tags | string[] | Tags |
| theme | string | fleet, family, focus, gospel, default, custom |
| themeColor | string | Color when theme is custom |
| preview | map | Legacy single preview; `previews[]` preferred |
| previews | array | Multi-slot: url, type, label, embed |
| coverImage | string | Card / hero imagery |
| logoUrl | string | Brand mark on cards |
| showTitleOnCard | boolean | Show title on card (default true) |
| valueProps | map | problem, role, outcome |
| kpis | array | `{ value, label, prefix?, suffix? }` for cards |
| workflow | map | Optional Agile/AI workflow narrative |
| demoCredentials | map | url, email, password, disclaimer |
| githubRepo | string | owner/repo |
| githubUrl | string | GitHub URL |
| metadata | map | Free-form key-value |
| features | array | `{ title, description, icon }` |
| techStack | string[] | Project tech |
| timeline | array | `{ date, title, description }` |
| gallery | array | `{ url, caption }` |
| links | map | live, github, figma, appStore, playStore |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### 4.4 Composite indexes

- `projects`: `published` + `order` (published list)
- `projects`: `slug` + `published` (lookup by slug)

---

## 5. Security

### 5.1 Firestore rules

- **config:** Public read; write only if `uid` is in `allowedAdmins` and document id is `portfolio`.
- **projects:** Public read only when `published` is public; admins have full CRUD.

### 5.2 Storage rules

- **`projects/{projectId}/`** — Public read; writes tied to auth + custom claims (see `storage.rules` and `sync-admin-claims`).

### 5.3 Authentication

- **GitHub** and **Google** via Firebase Auth.
- Admin: `isAdmin(uid)` checks `config/portfolio.allowedAdmins`; Storage may use `portfolioAdmin` claim.

---

## 6. Feature summary

### 6.1 Public home

- Hero, project grid, tech marquee, GitHub repos section, about + stats, CTA with email and social links.

### 6.2 Project detail

- Device preview, Markdown body, metadata, features, timeline, tech stack, gallery, external links, optional embedded GitHub README.

### 6.3 Admin

- **Projects:** list (drafts + published), create, edit, autosave on edit, publish/unpublish, delete. Project `order` set on create; `reorderProjects()` exists in `lib/firestore.ts` for future or scripted ordering.
- **Settings:** full `config/portfolio` editor with autosave, **`HomePreview`**, sortable stats/about lists, SEO and admin UIDs, Storage claim sync.

---

## 7. Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web app configuration |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Service account JSON (server-side reads / admin APIs) |
| `GITHUB_TOKEN` | Optional — higher GitHub API rate limits |
| `NEXT_PUBLIC_RESUME_URL` | Optional — public URL for resume PDF |

---

## 8. Deployment

```bash
npm run dev       # Local development
npm run build     # Production build
npm run start     # Local production server
npm run deploy    # Build + firebase deploy
```

Firebase Hosting uses the Web Frameworks integration; Firestore and Storage rules live in `firestore.rules`, `firestore.indexes.json`, and `storage.rules`.

---

## 9. Current status

| Area | Status |
|------|--------|
| Public home | Complete |
| Project detail | Complete |
| Admin panel | Complete |
| Project CRUD | Complete |
| Portfolio settings | Complete |
| Authentication | Complete |
| SEO | Dynamic metadata |
| Storage | Image uploads |

---

## 10. Follow-ups (optional hardening)

1. Tighten Storage write rules to admins-only if policy requires it.
2. Set `GITHUB_TOKEN` in production to avoid public API rate limits.
3. Add unit / e2e tests for critical flows.
4. Expand analytics if needed (Firebase Analytics or similar).

---

## 11. Repository

- **GitHub:** https://github.com/Victordaz07/portarts

---

## 12. Notion hub

The [Portarts Notion page](https://www.notion.so/Portarts-336ea9f315d880a0b2e3fe078f5dc239) is kept in sync with **`README.md`** (product tour: landing + admin). Update Notion when those sections change.

---

*Internal / handoff document — keep in sync with code changes.*
