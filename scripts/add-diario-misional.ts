import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as path from "path";
import * as fs from "fs";

function initAdmin() {
  if (getApps().length > 0) return;

  const serviceAccountPath = path.resolve(process.cwd(), "serviceAccountKey.json");
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("serviceAccountKey.json not found in project root.");
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
  initializeApp({ credential: cert(serviceAccount) });
}

initAdmin();
const db = getFirestore();

/** Keep in sync with scripts/seed-projects.ts — Mission Diary (slug: diario-misional). */
const project = {
  slug: "diario-misional",
  name: "Mission Diary",
  tagline: "Your missionary journey, organized in one app.",
  description:
    "Full-stack web app for missionaries: personal journal, transfers, resources, a family portal, and sponsorship with integrated payments.",
  fullDescription:
    "Mission Diary is a production web platform built to support the full missionary lifecycle—from start to finish. It includes a personal journal, transfer management, a photo gallery, mission resources, stage-based progress tracking, and a secure read-only family portal.\n\nThe stack uses Firebase authentication, internationalized UI (Spanish, English, and Portuguese), a PWA experience, and a Stripe-powered sponsorship module for real payments. It is implemented as a modern full-stack Next.js + TypeScript codebase with a focus on product clarity, security, and performance.",
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
};

async function run() {
  const now = Timestamp.now();
  const ref = db.collection("projects").doc(project.slug);
  const current = await ref.get();

  await ref.set(
    {
      ...project,
      createdAt: current.exists ? current.get("createdAt") ?? now : now,
      updatedAt: now,
    },
    { merge: true }
  );

  console.log(`✅ projects/${project.slug} upserted`);
  console.log(`🌐 Live: ${project.links.live}`);
  console.log(`🐙 Repo: ${project.links.github}`);
}

run().catch((err) => {
  console.error("❌ Failed to upsert Mission Diary:", err);
  process.exit(1);
});
