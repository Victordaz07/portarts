/**
 * PORTARTS — Postgres seed (Neon + Drizzle).
 * Loads Victor's real projects + portfolio config into the database.
 *
 * Usage:
 *   1. Set DATABASE_URL in .env.local (or .env)
 *   2. npm run db:push      # create tables
 *   3. npm run seed         # load this data (idempotent, upserts by slug)
 */
import { config as loadEnv } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  projects as projectsTable,
  portfolioConfig as portfolioConfigTable,
} from "../src/lib/db/schema";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL (set it in .env.local or .env).");
  process.exit(1);
}

const db = drizzle(neon(DATABASE_URL));

// ─── PROYECTOS ────────────────────────────────────────────────────────────────
const projects = [
  // ──────────────────────────────────────────────────────────────────
  // 1. FAMILYDASH
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "familydash",
    name: "FamilyDash",
    tagline: "The family operating system.",
    description:
      "A private, ad-free web app that keeps families organized — tasks, schedules, shared lists, and communication in one place. Built for real daily use.",
    fullDescription:
      "FamilyDash started as a personal problem: too many group chats, missed tasks, and scattered schedules across a family of multiple members. Instead of patching it with consumer apps full of ads and tracking, I built the solution from scratch.\n\nIt's a Progressive Web App that works on any device, loads fast, and keeps all data private. Features include shared task management with assignments, family calendar, grocery and shopping lists, and a family feed for quick updates. My own family uses it daily.",
    valueProps: {
      problem: "Families lack structure and coordination.",
      role: "Product design and full-stack development.",
      outcome: "A centralized system for tasks, communication, and family management.",
    },
    workflow: {
      tools: ["Cursor", "Claude", "GPT", "Gemini"],
      summary:
        "Built with an AI-augmented Agile workflow. Cursor for component architecture and refactoring, Claude and GPT for logic audits and documentation, Gemini for API research. Sprints of focused work — reviewed, tested, owned by me.",
    },
    kpis: [
      { value: "4", label: "Active families" },
      { value: "2h", label: "Saved per week", prefix: "~" },
      { value: "3", label: "Core modules shipped" },
    ],
    featured: true,
    order: 1,
    published: true,
    category: "web-app",
    status: {
      text: "Live",
      color: "green",
    },
    tags: ["React", "Firebase", "PWA", "Tailwind", "TypeScript"],
    theme: "family",
    preview: {
      url: "https://familydash.net",
      type: "desktop",
      allowFullscreen: true,
    },
    previews: [
      {
        url: "https://familydash.net",
        type: "desktop",
        label: "Marketing site",
        embed: false,
        allowFullscreen: true,
      },
      {
        url: "https://familydash.net/login",
        type: "phone",
        label: "Live app",
        allowFullscreen: true,
      },
    ],
    demoCredentials: {
      url: "https://familydash.net/login",
      email: "demo@familydash.net",
      password: "Demo2026!",
      disclaimer: "Demo account — data resets periodically",
    },
    githubRepo: "Victordaz07/FamilyDash",
    githubUrl: "https://github.com/Victordaz07/FamilyDash",
    metadata: {
      Platform: "Web (PWA)",
      Stack: "React + Firebase",
      "Auth Methods": "Email / Google",
      Status: "Production",
      Users: "Private (family)",
    },
    features: [
      {
        title: "Shared Task Management",
        description:
          "Create, assign, and track tasks across all family members with real-time sync.",
        icon: "CheckSquare",
      },
      {
        title: "Family Calendar",
        description:
          "Shared events and schedules visible to everyone, updated instantly.",
        icon: "Calendar",
      },
      {
        title: "Smart Lists",
        description:
          "Grocery, shopping, and custom lists that sync in real time across devices.",
        icon: "List",
      },
      {
        title: "Private & Ad-Free",
        description:
          "No ads, no tracking, no third-party data sharing. Your family's data stays private.",
        icon: "Shield",
      },
      {
        title: "Works Offline",
        description:
          "PWA with service worker — keeps working even without internet connection.",
        icon: "Wifi",
      },
      {
        title: "Multi-device",
        description:
          "Installable on phone, tablet, and desktop. One app, all screens.",
        icon: "Monitor",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "Firebase Auth",
      "Firestore",
      "Tailwind CSS",
      "PWA / Service Worker",
      "Vercel",
    ],
    timeline: [
      {
        date: "2024 Q3",
        title: "Problem identified",
        description:
          "Decided to stop patching the problem with consumer apps and build a proper solution.",
      },
      {
        date: "2024 Q4",
        title: "First version",
        description:
          "Core features live: tasks, lists, and calendar. Family started using it daily.",
      },
      {
        date: "2025 Q1",
        title: "Security audit",
        description:
          "Full audit of Firebase rules, Cloud Functions, and TypeScript types. Critical vulnerabilities fixed.",
      },
      {
        date: "2025 Q2",
        title: "V2.0 stable",
        description:
          "Refactored architecture, improved performance, and launched familydash.net.",
      },
    ],
    links: {
      live: "https://familydash.net",
      github: "https://github.com/Victordaz07/FamilyDash",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 2. SUPER CROWN CATERING
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "super-crown-catering",
    name: "Super Crown Catering",
    tagline: "End-to-end B2B food distribution management.",
    description:
      "A full-stack multi-role platform for a real food distribution business — managing clients, quotes, orders, delivery routes, invoicing, and online payments.",
    fullDescription:
      "What started as a simple website redesign turned into a complete business management system for a 15-year-old B2B food distribution company.\n\nThe platform handles the entire order lifecycle: from client quote requests to delivery confirmation and invoice payment via Stripe. Five distinct roles (Master, Admin, Sales, Delivery, Client) each have their own dashboard and permissions. Built a formal state machine for order transitions, automatic email notifications at every step, price locking to protect margin integrity, and an adjustment governance system for post-delivery discrepancies.\n\nThis is a real production system built for a real business, solving real operational problems.",
    valueProps: {
      problem: "The business managed orders, quotes, and deliveries with fragmented manual processes.",
      role: "Full-stack architecture and implementation across roles, workflows, and payment integration.",
      outcome: "A single operational platform that improves control, reduces errors, and speeds up fulfillment.",
    },
    workflow: {
      tools: ["Cursor", "Claude", "GPT", "Gemini"],
      summary:
        "Designed and built on an Agile process with AI tooling — Cursor for full-stack scaffolding, Claude and GPT for system architecture audits and edge-case documentation, Gemini for business logic research. All decisions and tradeoffs mine.",
    },
    kpis: [
      { value: "100%", label: "Orders digitized" },
      { value: "3", label: "User roles built" },
      { value: "0", label: "Manual errors", suffix: " errors" },
    ],
    featured: true,
    order: 2,
    published: true,
    category: "web-app",
    status: {
      text: "In Development",
      color: "yellow",
    },
    tags: ["Next.js", "Prisma", "Stripe", "PostgreSQL", "TypeScript"],
    theme: "fleet",
    preview: {
      url: "https://supercrown-catering-final.vercel.app/",
      type: "desktop",
      allowFullscreen: true,
    },
    githubRepo: "supercrown-catering",
    githubUrl: "https://github.com/Victordaz07/supercrown-catering",
    metadata: {
      Platform: "Web (Next.js App Router)",
      Stack: "Next.js + Prisma + PostgreSQL",
      Auth: "NextAuth.js",
      Payments: "Stripe",
      Emails: "Resend",
      Roles: "5 (Master, Admin, Sales, Delivery, Client)",
    },
    features: [
      {
        title: "Multi-Role Dashboard",
        description:
          "Five distinct roles with separate dashboards: Master, Admin, Sales, Delivery Driver, and Client.",
        icon: "Users",
      },
      {
        title: "Quote → Order Lifecycle",
        description:
          "Formal quote system with revisions, client approval via link, and atomic conversion to order with price lock.",
        icon: "FileText",
      },
      {
        title: "Formal State Machine",
        description:
          "14-state order state machine with validated transitions, preconditions, and full audit trail.",
        icon: "GitBranch",
      },
      {
        title: "Stripe Payments",
        description:
          "Online invoice payment via Stripe Elements. Automatic order closure on payment confirmation via webhook.",
        icon: "CreditCard",
      },
      {
        title: "Automatic Notifications",
        description:
          "Email notifications to clients at every order stage change, powered by Resend.",
        icon: "Bell",
      },
      {
        title: "Adjustment Governance",
        description:
          "Post-delivery discrepancy system with approval tiers based on adjustment amount.",
        icon: "Scale",
      },
    ],
    techStack: [
      "Next.js 15 (App Router)",
      "TypeScript",
      "Prisma ORM",
      "PostgreSQL",
      "NextAuth.js",
      "Stripe",
      "Resend",
      "Tailwind CSS",
      "Vercel",
    ],
    timeline: [
      {
        date: "2025 Q4",
        title: "Project kickoff",
        description:
          "Started as a simple website redesign for a catering client. Quickly grew into a full platform.",
      },
      {
        date: "2026 Q1",
        title: "Core system built",
        description:
          "Multi-role auth, quote lifecycle, order management, and delivery workflow completed.",
      },
      {
        date: "2026 Q2",
        title: "Payments & notifications",
        description:
          "Stripe integration, automatic email notifications, and adjustment governance system added.",
      },
      {
        date: "2026 Q3",
        title: "Production launch",
        description: "Go-live with real business data and active clients.",
      },
    ],
    links: {
      live: "https://supercrown-catering-final.vercel.app/",
      github: "https://github.com/Victordaz07/supercrown-catering",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 3. XTHEGOSPEL
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "xthegospel",
    name: "XtheGospel",
    tagline: "Faith-based discipleship, built with ethical design.",
    description:
      "A local-first PWA for religious discipleship — structured learning stages, community features, and a strict ethical design manifesto: no surveillance, no gamification, no manipulation.",
    fullDescription:
      "XtheGospel is a discipleship platform built with a clear ethical commitment: technology should serve community, not exploit it.\n\nThe app is local-first, meaning it works fully offline and doesn't require constant connectivity. Content is structured into four learning stages, each with a clear progression. The leadership module was intentionally removed after an ethical audit revealed it contained KPIs and surveillance systems that violated the project's own manifesto.\n\nEvery design decision goes through a question: does this serve the person, or does it serve engagement metrics? No gamification badges, no notification pressure, no dark patterns.",
    valueProps: {
      problem: "Discipleship tools often prioritize engagement metrics over people and community care.",
      role: "Product direction, ethical UX decisions, and full-stack implementation with local-first architecture.",
      outcome: "A faith-centered app that supports formation while preserving privacy, dignity, and trust.",
    },
    workflow: {
      tools: ["Cursor", "Claude", "GPT"],
      summary:
        "Built on a deliberate Agile workflow with focused AI tooling — Cursor for local-first PWA architecture, Claude and GPT for ethical design audits and documentation. No Gemini — the ethical constraints required tighter tooling decisions.",
    },
    kpis: [
      { value: "4", label: "Learning stages" },
      { value: "0", label: "Gamification", suffix: " dark patterns" },
      { value: "100%", label: "Local-first" },
    ],
    featured: false,
    order: 3,
    published: true,
    category: "web-app",
    status: {
      text: "In Progress",
      color: "blue",
    },
    tags: ["PWA", "React", "Firebase", "Local-First", "TypeScript"],
    theme: "gospel",
    preview: {
      url: "",
      type: "phone",
      allowFullscreen: false,
    },
    githubRepo: "XtheGospel",
    githubUrl: "https://github.com/Victordaz07/XtheGospel",
    metadata: {
      Platform: "PWA (Mobile-first)",
      Stack: "React + Firebase",
      Architecture: "Local-first / Offline",
      "Design Principle": "No surveillance, no gamification",
      Status: "In development",
    },
    features: [
      {
        title: "Local-First Architecture",
        description:
          "Full offline support. All content available without internet. Sync happens in the background.",
        icon: "Database",
      },
      {
        title: "4 Learning Stages",
        description:
          "Structured discipleship content organized into four clear progression stages.",
        icon: "BookOpen",
      },
      {
        title: "Ethical Design Manifesto",
        description:
          "No KPIs on people, no engagement pressure, no surveillance. Technology serving community.",
        icon: "Heart",
      },
      {
        title: "Community Features",
        description:
          "Group tools built around trust and transparency, not metrics and leaderboards.",
        icon: "Users",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "Firebase",
      "PWA / Service Worker",
      "Tailwind CSS",
    ],
    timeline: [
      {
        date: "2025 Q2",
        title: "Concept & manifesto",
        description:
          "Defined the ethical principles that would guide every design and technical decision.",
      },
      {
        date: "2025 Q3",
        title: "Core architecture",
        description:
          "Local-first data layer, authentication, and lesson content structure.",
      },
      {
        date: "2025 Q4",
        title: "Ethical audit",
        description:
          "Removed leadership surveillance module. Began cleanup of gamification elements.",
      },
      {
        date: "2026",
        title: "Active development",
        description: "Four learning stages in progress. Launch TBD.",
      },
    ],
    links: {
      github: "https://github.com/Victordaz07/XtheGospel",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 4. MISSION DIARY (slug: diario-misional — stable public URL)
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "diario-misional",
    name: "Missionary Journal",
    tagline: "Your missionary journey, organized in one app.",
    description:
      "A full-stack web app for missionaries — personal journal, transfer tracking, resource library, family portal, and an integrated sponsorship system with payments.",
    fullDescription:
      "Missionary Journal is a production web platform for the full missionary lifecycle — from start to finish. It includes a personal journal, transfer management, a photo gallery, mission resources, stage-based progress tracking, and a secure read-only family portal.\n\nThe stack uses Firebase authentication, internationalized UI (Spanish, English, and Portuguese), a PWA experience, and a Stripe-powered sponsorship module for real payments. It is implemented as a modern full-stack Next.js + TypeScript codebase focused on product clarity, security, and performance.",
    valueProps: {
      problem: "Missionaries lack a centralized, structured way to document experiences, track progress, and preserve their mission journey.",
      role: "Product design, concept development, and full-stack implementation.",
      outcome: "A personal digital journal that allows missionaries to record experiences, organize transfers, store memories, and create a lasting mission record.",
    },
    workflow: {
      tools: ["Cursor", "Claude", "GPT", "Gemini"],
      summary:
        "Agile process with AI-augmented development — Cursor for full-stack implementation, Claude and GPT for architecture reviews and documentation, Gemini for research on missionary workflows and sponsorship systems.",
    },
    kpis: [
      { value: "5", label: "Core sections" },
      { value: "100%", label: "PWA ready" },
      { value: "1", label: "Unified platform" },
    ],
    featured: true,
    order: 4,
    published: true,
    category: "web-app",
    status: {
      text: "Live",
      color: "green",
    },
    tags: ["Next.js", "TypeScript", "Firebase", "Stripe", "PWA"],
    theme: "gospel",
    preview: {
      url: "https://diario-misional.vercel.app/login",
      type: "desktop",
      allowFullscreen: true,
    },
    githubRepo: "Diario-Misional-Web",
    githubUrl: "https://github.com/Victordaz07/Diario-Misional-Web",
    metadata: {
      Platform: "Web App (PWA)",
      Stack: "Next.js + TypeScript + Firebase",
      Auth: "Email, Google, Apple ID",
      Payments: "Stripe",
      i18n: "Spanish / English / Portuguese",
      Status: "Production",
    },
    features: [
      {
        title: "Full personal journal",
        description:
          "Daily entries with structure and tracking to document the missionary experience.",
        icon: "BookOpen",
      },
      {
        title: "Transfers and stages",
        description:
          "History of areas and companions with structured progress across mission stages.",
        icon: "MapPinned",
      },
      {
        title: "Secure family portal",
        description:
          "Read-only access for family members with shared, permissioned content.",
        icon: "Users",
      },
      {
        title: "Stripe sponsorship",
        description:
          "Sponsorship plans and subscription management with real payments.",
        icon: "CreditCard",
      },
      {
        title: "Multilingual UI",
        description:
          "Internationalized interface with Spanish, English, and Portuguese support.",
        icon: "Languages",
      },
      {
        title: "Mobile-ready PWA",
        description:
          "Installable and tuned for everyday use on phones and tablets.",
        icon: "Smartphone",
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Firebase Auth",
      "Firestore",
      "Firebase Storage",
      "Stripe",
      "Tailwind CSS",
      "Vercel",
      "PWA / Service Worker",
    ],
    timeline: [
      {
        date: "2024",
        title: "Product foundation",
        description:
          "Core modules shipped: authentication, journal, and main app structure.",
      },
      {
        date: "2025",
        title: "Feature expansion",
        description:
          "Family portal, internationalization, and architecture improvements.",
      },
      {
        date: "2026",
        title: "Production and launch",
        description:
          "Stripe sponsorship flow and stable deployment on Vercel.",
      },
    ],
    links: {
      live: "https://diario-misional.vercel.app/login",
      github: "https://github.com/Victordaz07/Diario-Misional-Web",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 5. FREELANCEHUB (PowerfulCrm) — web app
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "freelancehub",
    name: "FreelanceHub",
    tagline: "Multi-tenant CRM for freelancers.",
    description:
      "A multi-tenant CRM that unifies projects, calendar, and invoicing for independent freelancers — with per-tenant data isolation and online payments.",
    fullDescription:
      "FreelanceHub is a comprehensive platform that brings a freelancer's whole operation into one place: client and project management, a calendar, and invoicing with online checkout.\n\nIt is built multi-tenant from the ground up, with row-level security isolating each account's data, background jobs for async work, and file storage for attachments. Core flows (calendar, invoicing) are live; form builders, a drag-and-drop kanban, and full checkout are on the roadmap.",
    valueProps: {
      problem: "Freelancers juggle clients, schedules, and invoices across disconnected tools.",
      role: "Full-stack architecture and implementation, including multi-tenant security.",
      outcome: "A single workspace for projects, scheduling, and getting paid.",
    },
    workflow: {
      tools: ["Cursor", "Claude", "GPT"],
      summary:
        "Built on an Agile, AI-augmented workflow — architecture and multi-tenant RLS reviewed and owned end to end.",
    },
    kpis: [
      { value: "Multi", label: "tenant (RLS)" },
      { value: "64", label: "commits" },
      { value: "3", label: "core modules live" },
    ],
    featured: true,
    order: 5,
    published: true,
    category: "web-app",
    status: { text: "In Development", color: "yellow" },
    tags: ["Next.js", "Prisma", "PostgreSQL", "Stripe", "SaaS"],
    theme: "fleet",
    preview: {
      url: "https://powerful-crm.vercel.app",
      type: "desktop",
      allowFullscreen: true,
    },
    githubRepo: "Victordaz07/PowerfulCrm",
    githubUrl: "https://github.com/Victordaz07/PowerfulCrm",
    metadata: {
      Platform: "Web (Next.js App Router)",
      Stack: "Next.js 14 + Prisma + PostgreSQL",
      Auth: "Clerk (multi-tenant)",
      Payments: "Stripe / Mercado Pago",
      Jobs: "Inngest",
    },
    techStack: [
      "Next.js 14",
      "TypeScript",
      "Prisma",
      "PostgreSQL (Neon)",
      "Clerk",
      "Stripe",
      "Vercel Blob",
      "Inngest",
    ],
    links: {
      live: "https://powerful-crm.vercel.app",
      github: "https://github.com/Victordaz07/PowerfulCrm",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 6. SGM MUSIC LAB (Generador-de-canciones) — web app / AI
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "sgm-music-lab",
    name: "SGM Music Lab",
    tagline: "AI song generation, end to end.",
    description:
      "Generates complete songs — lyrics, audio (via Suno), and cover art — from a single interface, orchestrating multiple AI services behind server-side proxies.",
    fullDescription:
      "SGM Music Lab turns a single prompt into a finished song: it writes the lyrics, composes and polls for the audio, and generates cover art with the title and logo composited via Canvas.\n\nAll third-party AI calls are proxied server-side through Route Handlers, with passwordless auth and client-side state. It's an end-to-end showcase of practical AI integration — not a toy demo.",
    valueProps: {
      problem: "Producing a song means stitching together lyrics, audio, and artwork across separate tools.",
      role: "Product and full-stack build, including AI orchestration and Canvas compositing.",
      outcome: "A one-screen pipeline from idea to a shareable song with cover art.",
    },
    workflow: {
      tools: ["Cursor", "Claude", "GPT"],
      summary:
        "AI-augmented build; the app itself integrates the Claude API and Suno behind server proxies.",
    },
    kpis: [
      { value: "3", label: "AI services orchestrated" },
      { value: "1", label: "screen, end-to-end" },
    ],
    featured: true,
    order: 6,
    published: true,
    category: "web-app",
    status: { text: "Live", color: "green" },
    tags: ["Next.js", "AI", "Claude API", "TypeScript"],
    theme: "focus",
    preview: {
      url: "https://generador-de-canciones.vercel.app",
      type: "desktop",
      allowFullscreen: true,
    },
    githubRepo: "Victordaz07/Generador-de-canciones",
    githubUrl: "https://github.com/Victordaz07/Generador-de-canciones",
    metadata: {
      Platform: "Web (Next.js App Router)",
      Stack: "Next.js + TypeScript",
      AI: "Claude API + Suno + image gen",
      Rendering: "Canvas (cover compositing)",
    },
    techStack: [
      "Next.js",
      "TypeScript",
      "Claude API",
      "Suno",
      "Canvas",
      "Tailwind CSS",
      "Vercel",
    ],
    links: {
      live: "https://generador-de-canciones.vercel.app",
      github: "https://github.com/Victordaz07/Generador-de-canciones",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 7. CRISLIA — UGC PORTFOLIO (portafolio-cristal) — portfolio
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "portafolio-crislia",
    name: "Crislia — UGC Portfolio",
    tagline: "A content creator's portfolio with its own CMS.",
    description:
      "A bilingual portfolio for a UGC creator: media kit, content feed, testimonials, and services — all editable from a no-code admin panel.",
    fullDescription:
      "Crislia's portfolio is a client project: a polished, bilingual (ES/EN) site that doubles as a media kit for brand deals — content feed, testimonials, and services.\n\nEvery section is database-driven and editable from a protected admin dashboard, with image and video uploads, so the creator can update everything without touching code.",
    valueProps: {
      problem: "Creators need a professional media kit they can update themselves.",
      role: "Design and full-stack build, including the CMS and media pipeline.",
      outcome: "A self-serve, always-current portfolio that wins brand collaborations.",
    },
    workflow: {
      tools: ["Cursor", "Claude"],
      summary:
        "Client engagement delivered Agile — scoped, reviewed, and shipped to production.",
    },
    kpis: [
      { value: "ES/EN", label: "bilingual" },
      { value: "100%", label: "no-code editable" },
    ],
    featured: true,
    order: 7,
    published: true,
    category: "portfolio",
    status: { text: "Live", color: "green" },
    tags: ["Next.js", "Prisma", "CMS", "Client work"],
    theme: "family",
    preview: {
      url: "https://portafolio-cristal.vercel.app",
      type: "desktop",
      allowFullscreen: true,
    },
    githubRepo: "Victordaz07/portafolio-cristal",
    githubUrl: "https://github.com/Victordaz07/portafolio-cristal",
    metadata: {
      Platform: "Web (Next.js App Router)",
      Stack: "Next.js 14 + Prisma + PostgreSQL",
      Media: "Vercel Blob (image/video)",
      Type: "Client project",
    },
    techStack: [
      "Next.js 14",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Vercel Blob",
      "Tailwind CSS",
    ],
    links: {
      live: "https://portafolio-cristal.vercel.app",
      github: "https://github.com/Victordaz07/portafolio-cristal",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 8. VEHIKITÉ BARBERSHOP (Barbershop-William) — business website
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "vehikite-barbershop",
    name: "Vehikité Barbershop",
    tagline: "Booking platform for a Tongatapu barbershop.",
    description:
      "A bilingual (EN/Tongan) booking site with real-time scheduling, a moderated reviews system, and an admin panel for managing appointments.",
    fullDescription:
      "A client website for Vehikité, a barbershop in Tongatapu: customers book appointments against a real-time schedule, leave reviews (moderated before publishing), and the owner manages everything from an admin panel.\n\nBuilt bilingual (English/Tongan) with Firestore security rules and continuous deployment via GitHub Actions.",
    valueProps: {
      problem: "A local barbershop needed online booking instead of phone-and-paper scheduling.",
      role: "Design, full-stack build, auth, and deployment.",
      outcome: "A bilingual booking site with an admin panel the owner runs day to day.",
    },
    workflow: {
      tools: ["Cursor", "Claude"],
      summary: "Client build shipped with CI/CD to Firebase Hosting.",
    },
    kpis: [
      { value: "EN/TO", label: "bilingual" },
      { value: "Realtime", label: "scheduling" },
    ],
    featured: false,
    order: 8,
    published: true,
    category: "website",
    status: { text: "Live", color: "green" },
    tags: ["React", "Vite", "Firebase", "Booking"],
    theme: "gospel",
    preview: {
      url: "https://barbershop-william.web.app",
      type: "desktop",
      allowFullscreen: true,
    },
    githubRepo: "Victordaz07/Barbershop-William",
    githubUrl: "https://github.com/Victordaz07/Barbershop-William",
    metadata: {
      Platform: "Web (React SPA)",
      Stack: "React 19 + Vite + Firebase",
      Languages: "English / Tongan",
      Deploy: "Firebase Hosting (GitHub Actions)",
      Type: "Client project",
    },
    techStack: [
      "React 19",
      "Vite",
      "TypeScript",
      "Firebase (Firestore + Auth)",
      "Tailwind CSS",
    ],
    links: {
      live: "https://barbershop-william.web.app",
      github: "https://github.com/Victordaz07/Barbershop-William",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 9. BAUTIZAPP — single-file HTML tool (system)
  //    NOTE: update `live` if your Vercel project name differs from "bautizapp".
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "bautizapp",
    name: "BautizApp",
    tagline: "Baptism programs & WhatsApp invites in one tool.",
    description:
      "An offline-first tool to create baptism programs and shareable WhatsApp invitations — a guided 4-step wizard with 5 languages, design customization, and PDF export.",
    fullDescription:
      "BautizApp is a single-file, offline-first web app that turns a few inputs into a finished baptism program and a ready-to-share WhatsApp invitation.\n\nIt runs entirely in the browser (no backend): a 4-step wizard, five languages, live design customization, PDF generation via jsPDF, and image export via html2canvas, all persisted to local storage. Built for real use by members of The Church of Jesus Christ of Latter-day Saints.",
    valueProps: {
      problem: "Preparing baptism programs and invitations by hand is slow and inconsistent.",
      role: "Product design and full front-end implementation (single-file, offline).",
      outcome: "A guided tool that outputs a polished program and invitation in minutes.",
    },
    kpis: [
      { value: "4", label: "step wizard" },
      { value: "5", label: "languages" },
      { value: "0", label: "backend", suffix: " · offline" },
    ],
    featured: false,
    order: 9,
    published: true,
    category: "system",
    status: { text: "Live", color: "green" },
    tags: ["HTML", "Vanilla JS", "jsPDF", "Offline-first"],
    theme: "gospel",
    preview: {
      url: "https://bautizapp.vercel.app",
      type: "desktop",
      allowFullscreen: true,
    },
    previews: [
      {
        url: "https://bautizapp.vercel.app",
        type: "desktop",
        label: "Live tool",
        embed: false,
        allowFullscreen: true,
      },
    ],
    githubRepo: "Victordaz07/Bautizapp",
    githubUrl: "https://github.com/Victordaz07/Bautizapp",
    metadata: {
      Platform: "Web (single-file, offline-first)",
      Stack: "HTML5 + CSS3 + Vanilla JS",
      Libraries: "jsPDF + html2canvas",
      Languages: "5",
    },
    techStack: ["HTML5", "CSS3", "JavaScript", "jsPDF", "html2canvas"],
    links: {
      live: "https://bautizapp.vercel.app",
      github: "https://github.com/Victordaz07/Bautizapp",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 10. SHOMERCARE — single-file HTML tool (system)
  //     NOTE: update `live` if your Vercel project name differs from "shomercare-demo".
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "shomercare",
    name: "ShomerCare",
    tagline: "Shift scheduling & comms for operations teams.",
    description:
      "An offline-first scheduling and communication tool for custodial and operations teams — zones, shift assignments, days-off tracking, WhatsApp integration, and cross-device sync via QR.",
    fullDescription:
      "ShomerCare coordinates custodial and operations teams across zones and time windows, entirely in a single offline-first web page.\n\nIt handles team management, shift assignments, and days-off tracking, pushes updates through WhatsApp, and syncs state across devices with QR codes — no backend required. It's actively used to run real operations.",
    valueProps: {
      problem: "Coordinating cleaning/ops shifts across zones and people is error-prone on paper.",
      role: "Product design and full front-end implementation (single-file, offline).",
      outcome: "A lightweight system that keeps a real operations team organized and in sync.",
    },
    kpis: [
      { value: "QR", label: "cross-device sync" },
      { value: "0", label: "backend", suffix: " · offline" },
      { value: "Real", label: "operations use" },
    ],
    featured: false,
    order: 10,
    published: true,
    category: "system",
    status: { text: "Live", color: "green" },
    tags: ["HTML", "Vanilla JS", "Offline-first", "PWA"],
    theme: "fleet",
    preview: {
      url: "https://shomercare-demo.vercel.app",
      type: "desktop",
      allowFullscreen: true,
    },
    previews: [
      {
        url: "https://shomercare-demo.vercel.app",
        type: "desktop",
        label: "Live tool",
        embed: false,
        allowFullscreen: true,
      },
    ],
    githubRepo: "Victordaz07/shomercare-demo",
    githubUrl: "https://github.com/Victordaz07/shomercare-demo",
    metadata: {
      Platform: "Web (single-file, offline-first)",
      Stack: "HTML + CSS + Vanilla JS",
      Sync: "QR codes (cross-device)",
      Comms: "WhatsApp",
    },
    techStack: ["HTML", "CSS", "JavaScript", "Offline-first"],
    links: {
      live: "https://shomercare-demo.vercel.app",
      github: "https://github.com/Victordaz07/shomercare-demo",
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 11. SEEKER GOSPEL — deep gospel study platform
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "seeker-gospel",
    name: "Seeker Gospel",
    tagline: "Deep gospel study, structured for serious learners.",
    description:
      "A multilingual gospel study platform with 300+ structured lessons, doctrinal modules, notes, quizzes, games, and optional cloud progress sync.",
    fullDescription:
      "Seeker Gospel turns a large library of gospel material into a focused, progressive study experience. Learners can explore doctrine, scripture characters, priesthood, leadership, restoration history, and difficult theological questions through structured modules.\n\nThe platform includes more than 300 lessons, personal notes, quizzes, Scripture Quest, offline/PWA support, and optional Firebase-backed accounts for syncing progress across devices.",
    valueProps: {
      problem: "Deep gospel study resources are often scattered and difficult to follow as a coherent learning path.",
      role: "Product strategy, content architecture, UX design, and full-stack implementation.",
      outcome: "A single study platform that guides learners from foundational principles to advanced doctrine.",
    },
    kpis: [
      { value: "309+", label: "structured lessons" },
      { value: "10", label: "study modules" },
      { value: "PWA", label: "offline-ready" },
    ],
    featured: true,
    order: 11,
    published: true,
    category: "web-app",
    status: { text: "Live", color: "green" },
    tags: ["React", "TypeScript", "Firebase", "PWA"],
    theme: "gospel",
    preview: {
      url: "https://seekergospel.com",
      type: "desktop",
      allowFullscreen: true,
    },
    previews: [
      {
        url: "https://seekergospel.com",
        type: "desktop",
        label: "Live platform",
        embed: false,
        allowFullscreen: true,
      },
    ],
    githubRepo: "Victordaz07/lineuponline",
    githubUrl: "https://github.com/Victordaz07/lineuponline",
    metadata: {
      Platform: "Web + PWA",
      Stack: "React + TypeScript + Vite",
      Backend: "Firebase",
      Content: "309+ lessons",
    },
    techStack: ["React", "TypeScript", "Vite", "Firebase", "PWA"],
    links: {
      live: "https://seekergospel.com",
      github: "https://github.com/Victordaz07/lineuponline",
    },
  },
];

// ─── PORTFOLIO CONFIG ─────────────────────────────────────────────────────────

const portfolioConfig = {
  name: "Victor Ruiz",
  title: "Full-Stack Developer",
  heroHeadline: "Frontend Developer building products people actually use",
  subtitle:
    "Agile ways of working — iterative value, collaboration with stakeholders, and adapting when priorities shift — alongside Git-first version control and production UIs. Grounded in 9+ years running real operations.",
  email: "das.graphic1306@gmail.com", // ← CAMBIA ESTO
  githubUsername: "Victordaz07",
  about: [
    "Frontend Developer with 9+ years in operations and logistics. I build interfaces that solve real problems — not demos, not tutorials. Products my own family uses daily.",
    "I work primarily with React, Next.js, and TypeScript. My focus is component architecture, performance, and the details that make an interface feel right. I ship clean, documented, production-ready code.",
    "I run every project with Agile principles — iterative planning, collaboration with stakeholders, version control discipline, and adapting the plan when we learn more. Whether solo or in a team, value and flexibility beat a rigid roadmap.",
    "AI is part of my engineering stack, not a replacement for it. I use Cursor for architecture and refactoring at scale, Claude and GPT for logic audits and documentation, Gemini for research. Work that takes a month ships in three focused sessions — reviewed, tested, and owned by me end to end.",
  ],
  miniBio: {
    headline: "From warehouse ops to shipping production apps.",
    body:
      "I work with an Agile mindset: clear priorities, tight feedback loops with stakeholders, and adjusting the plan when we learn more — not chasing a fixed spec. Git is the source of truth — branches, reviews, releases. I build interfaces that solve the problem, not demos.",
  },
  introTestimonial: {
    quote:
      "I own customer-facing UI from backlog to production — scoped work, collaborative review, and releases I stand behind. I use AI to support refactors and technical writing; Git, tests, and design review stay non-negotiable. That’s my bar when the goal is production, not demos.",
    enabled: true,
  },
  stats: [
    { value: "9+", label: "Years in operations" },
    { value: "3+", label: "Production apps" },
    { value: "13+", label: "People managed" },
    { value: "AI+", label: "Augmented workflow" },
  ],
  techStack: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Firebase",
    "Figma",
    "Framer Motion",
  ],
  aiTools: ["Cursor", "Claude", "GPT", "Gemini"],
  socialLinks: {
    github: "https://github.com/Victordaz07",
    linkedin: "", // ← AGREGA SI TIENES
  },
  allowedAdmins: [], // ← AGREGA TU UID DE FIREBASE AQUÍ
  metaDescription:
    "Victor Ruiz — Frontend developer building real products with React, Next.js, TypeScript, Tailwind CSS, and Firebase.",
};

// ─── SEED (Postgres) ───────────────────────────────────────────────────────────

const PROMOTED = new Set([
  "id",
  "slug",
  "published",
  "order",
  "featured",
  "name",
  "createdAt",
  "updatedAt",
]);

function toRow(p: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(p)) {
    if (!PROMOTED.has(k)) data[k] = v;
  }
  return {
    id: String(p.slug),
    slug: String(p.slug),
    published: Boolean(p.published),
    order: Number(p.order) || 0,
    featured: Boolean(p.featured),
    name: String(p.name ?? ""),
    data,
  };
}

async function seed() {
  console.log("🌱 Seeding Postgres...\n");

  // Portfolio config (drop the legacy allowedAdmins field — admins are via ADMIN_EMAILS now).
  const cfg: Record<string, unknown> = { ...(portfolioConfig as Record<string, unknown>) };
  delete cfg.allowedAdmins;
  await db
    .insert(portfolioConfigTable)
    .values({ id: "portfolio", data: cfg as never })
    .onConflictDoUpdate({
      target: portfolioConfigTable.id,
      set: { data: cfg as never, updatedAt: new Date() },
    });
  console.log("   ✅ portfolio config");

  for (const p of projects as Array<Record<string, unknown>>) {
    const row = toRow(p);
    await db
      .insert(projectsTable)
      .values(row as never)
      .onConflictDoUpdate({
        target: projectsTable.slug,
        set: {
          published: row.published,
          order: row.order,
          featured: row.featured,
          name: row.name,
          data: row.data as never,
          updatedAt: new Date(),
        },
      });
    console.log(`   ✅ ${row.slug} → ${row.name}`);
  }

  console.log("\n🎉 Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });

