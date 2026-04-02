/**
 * PORTARTS — SEED DE PROYECTOS REALES
 * =====================================
 * Cómo ejecutar:
 *   npx tsx scripts/seed-projects.ts
 *
 * Requiere:
 *   - .env.local con las credenciales de Firebase
 *   - npm install tsx dotenv (si no los tienes)
 *
 * IMPORTANTE: Este script usa el Admin SDK.
 * Necesitas GOOGLE_APPLICATION_CREDENTIALS o
 * poner tu serviceAccountKey.json en la raíz.
 *
 * ALTERNATIVA FÁCIL: Usa el Admin Panel del portafolio
 * en /admin/projects/new y pega los datos de cada
 * proyecto que están abajo como objetos JSON.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ─── INIT FIREBASE ADMIN ──────────────────────────────────────────────────────
function initAdmin() {
  if (getApps().length > 0) return;

  const serviceAccountPath = path.resolve(process.cwd(), "serviceAccountKey.json");

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    // Fallback: usa variables de entorno (Vercel/CI)
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

initAdmin();
const db = getFirestore();

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
        label: "Landing Page",
        allowFullscreen: true,
      },
      {
        url: "https://familydash.net/login",
        type: "phone",
        label: "Live App",
        allowFullscreen: true,
      },
    ],
    demoCredentials: {
      url: "https://familydash.net/login",
      email: "demo@familydash.net",
      password: "Demo2026!",
      disclaimer: "Demo account — data resets periodically",
    },
    githubRepo: "FamilyDash",
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
];

// ─── PORTFOLIO CONFIG ─────────────────────────────────────────────────────────

const portfolioConfig = {
  name: "Victor Ruiz",
  title: "Full-Stack Developer",
  heroHeadline: "Frontend Developer building products people actually use",
  subtitle:
    "9+ years in operations and logistics taught me how real systems fail. Now I build the interfaces that make them work.",
  email: "das.graphic1306@gmail.com", // ← CAMBIA ESTO
  githubUsername: "Victordaz07",
  about: [
    "Frontend Developer with 9+ years in operations and logistics. I build interfaces that solve real problems — not demos, not tutorials. Products my own family uses daily.",
    "I work primarily with React, Next.js, and TypeScript. My focus is component architecture, performance, and the details that make an interface feel right. I ship clean, documented, production-ready code.",
    "I run every project on an Agile workflow — sprint planning, version control discipline, documented decisions, and iterative delivery. Whether solo or in a team, the process is the same.",
    "AI is part of my engineering stack, not a replacement for it. I use Cursor for architecture and refactoring at scale, Claude and GPT for logic audits and documentation, Gemini for research. Work that takes a month ships in three focused sessions — reviewed, tested, and owned by me end to end.",
  ],
  miniBio: {
    headline:
      "From running warehouse operations to shipping production apps.",
    body:
      "9+ years managing teams and systems taught me that good software isn't about code — it's about solving the right problem. I bring that ops mindset to every interface I build.",
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
    "Cursor",
    "Claude",
    "GPT",
    "Gemini",
  ],
  socialLinks: {
    github: "https://github.com/Victordaz07",
    linkedin: "", // ← AGREGA SI TIENES
  },
  allowedAdmins: [], // ← AGREGA TU UID DE FIREBASE AQUÍ
  metaDescription:
    "Victor Ruiz — Frontend developer building real products with React, Next.js, TypeScript, Tailwind CSS, and Firebase.",
};

// ─── SEED ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Starting seed...\n");

  // Portfolio config
  console.log("📋 Writing portfolio config...");
  await db.collection("config").doc("portfolio").set(portfolioConfig, { merge: true });
  console.log("   ✅ config/portfolio written\n");

  // Projects
  console.log("📦 Writing projects...");
  for (const project of projects) {
    const { slug, preview, ...rest } = project;

    // Skip preview if no URL (XtheGospel)
    const previewData =
      preview.url ? preview : { ...preview, url: "" };

    const data = {
      ...rest,
      slug,
      preview: previewData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Use slug as document ID for easy lookup
    await db.collection("projects").doc(slug).set(data);
    console.log(`   ✅ projects/${slug} → ${project.name}`);
  }

  console.log("\n🎉 Seed complete!");
  console.log("\n⚠️  NEXT STEPS:");
  console.log("   1. Update portfolioConfig.email with your real email");
  console.log("   2. Update portfolioConfig.allowedAdmins with your Firebase UID");
  console.log("   3. Add screenshots to each project via the Admin Panel");
  console.log("   4. Run: npx tsx scripts/seed-projects.ts");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
