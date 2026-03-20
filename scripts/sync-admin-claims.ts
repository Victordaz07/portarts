/**
 * Sincroniza el custom claim `portfolioAdmin` con config/portfolio.allowedAdmins.
 * Necesario para subir imágenes a Storage en plan Spark (sin firestore.get en storage.rules).
 *
 *   npx tsx scripts/sync-admin-claims.ts
 *
 * Credenciales: serviceAccountKey.json en la raíz o variables como en seed-projects.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const CLAIM = "portfolioAdmin";

function initAdmin() {
  if (getApps().length > 0) return;
  const serviceAccountPath = path.resolve(process.cwd(), "serviceAccountKey.json");
  if (fs.existsSync(serviceAccountPath)) {
    const sa = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
    initializeApp({ credential: cert(sa) });
  } else {
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

async function main() {
  initAdmin();
  const db = getFirestore();
  const snap = await db.doc("config/portfolio").get();
  if (!snap.exists) {
    console.error("No existe config/portfolio en Firestore.");
    process.exit(1);
  }
  const allowed = snap.data()?.allowedAdmins;
  if (!Array.isArray(allowed) || allowed.length === 0) {
    console.error("allowedAdmins está vacío o no es un array. Añade UIDs en Firestore o en Admin → Settings.");
    process.exit(1);
  }
  const auth = getAuth();
  for (const uid of allowed) {
    if (typeof uid !== "string" || !uid.trim()) continue;
    try {
      await auth.setCustomUserClaims(uid.trim(), { [CLAIM]: true });
      console.log("OK", uid.trim());
    } catch (e) {
      console.error("FAIL", uid, e);
    }
  }
  console.log("\nCierra sesión en el admin y vuelve a entrar (o recarga el token) para que Firebase Storage vea el claim.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
