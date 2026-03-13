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
  // 4. DIARIO MISIONAL
  // ──────────────────────────────────────────────────────────────────
  {
    slug: "diario-misional",
    name: "Diario Misional",
    tagline: "Tu experiencia misionera, organizada en una sola app.",
    description:
      "Aplicación web completa para misioneros con diario personal, traslados, recursos, portal familiar y sistema de patrocinio con pagos integrados.",
    fullDescription:
      "Diario Misional es una plataforma web profesional enfocada en acompañar toda la experiencia misionera de principio a fin. Incluye diario personal, gestión de traslados, galería de fotos, recursos misionales, seguimiento por etapas y un portal familiar seguro.\n\nEl sistema incorpora autenticación con Firebase, soporte multilenguaje (Español, Inglés y Portugués), experiencia PWA y un módulo de patrocinio con Stripe para pagos reales. Fue construido con arquitectura full-stack moderna sobre Next.js + TypeScript, priorizando claridad de producto, seguridad y rendimiento.",
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
      i18n: "ES / EN / PT",
      Status: "Production",
    },
    features: [
      {
        title: "Diario personal completo",
        description:
          "Entradas diarias con organización y seguimiento para documentar la experiencia misionera.",
        icon: "BookOpen",
      },
      {
        title: "Gestión de traslados y etapas",
        description:
          "Historial de áreas y compañeros, con progreso estructurado por etapas.",
        icon: "MapPinned",
      },
      {
        title: "Portal familiar seguro",
        description:
          "Acceso de solo lectura para familiares con contenido compartido y controlado.",
        icon: "Users",
      },
      {
        title: "Patrocinio con Stripe",
        description:
          "Planes de patrocinio y gestión de suscripciones con pagos reales.",
        icon: "CreditCard",
      },
      {
        title: "Multilenguaje",
        description:
          "Interfaz internacionalizada con soporte para Español, Inglés y Portugués.",
        icon: "Languages",
      },
      {
        title: "PWA lista para móvil",
        description:
          "Instalable y optimizada para uso diario en dispositivos móviles.",
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
        title: "Base del producto",
        description:
          "Se construyen los módulos núcleo: autenticación, diario y estructura principal.",
      },
      {
        date: "2025",
        title: "Expansión de funcionalidades",
        description:
          "Se agregan portal familiar, internacionalización y mejoras de arquitectura.",
      },
      {
        date: "2026",
        title: "Producción y despliegue",
        description:
          "Sistema de patrocinio con Stripe y despliegue estable en Vercel.",
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
  subtitle: "Building real products for real problems.",
  email: "das.graphic1306@gmail.com", // ← CAMBIA ESTO
  githubUsername: "Victordaz07",
  about: [
    "I'm a full-stack developer with 13 years of operational and logistics experience — including managing 4 distribution facilities for Honda R&D with 130+ people.",
    "I build products that solve real problems: a family management app my family uses daily, a B2B distribution platform for a real catering business, a faith-based discipleship app built on ethical design principles.",
    "I work across the full stack: React, Next.js, React Native, Firebase, Supabase, Prisma. I use AI-assisted development tools (Claude, Cursor) to ship faster without sacrificing quality.",
  ],
  stats: [
    { value: "13+", label: "Years in operations" },
    { value: "3+", label: "Production apps" },
    { value: "130+", label: "People managed" },
    { value: "Full", label: "Stack developer" },
  ],
  techStack: [
    "React",
    "Next.js",
    "React Native",
    "TypeScript",
    "Firebase",
    "Supabase",
    "Prisma",
    "PostgreSQL",
    "Tailwind CSS",
    "Stripe",
    "Node.js",
    "Figma",
  ],
  socialLinks: {
    github: "https://github.com/Victordaz07",
    linkedin: "", // ← AGREGA SI TIENES
  },
  allowedAdmins: [], // ← AGREGA TU UID DE FIREBASE AQUÍ
  metaDescription:
    "Victor Ruiz — Full-stack developer building real products with React, Next.js, Firebase, and Supabase.",
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
