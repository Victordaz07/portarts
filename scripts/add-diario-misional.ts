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

const project = {
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
        "Entradas diarias con organizacion y seguimiento para documentar la experiencia misional.",
      icon: "BookOpen",
    },
    {
      title: "Gestion de traslados y etapas",
      description:
        "Historial de areas y companeros, con progreso estructurado por etapas.",
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
        "Planes de patrocinio y gestion de suscripciones con pagos reales.",
      icon: "CreditCard",
    },
    {
      title: "Multilenguaje",
      description:
        "Interfaz internacionalizada con soporte para Espanol, Ingles y Portugues.",
      icon: "Languages",
    },
    {
      title: "PWA lista para movil",
      description:
        "Instalable y optimizada para uso diario en dispositivos moviles.",
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
        "Se construyen los modulos nucleo: autenticacion, diario y estructura principal.",
    },
    {
      date: "2025",
      title: "Expansion de funcionalidades",
      description:
        "Se agregan portal familiar, internacionalizacion y mejoras de arquitectura.",
    },
    {
      date: "2026",
      title: "Produccion y despliegue",
      description:
        "Sistema de patrocinio con Stripe y despliegue estable en Vercel.",
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
  console.error("❌ Failed to upsert Diario Misional:", err);
  process.exit(1);
});
