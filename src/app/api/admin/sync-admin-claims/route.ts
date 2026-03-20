import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase-admin-server";

const CLAIM = "portfolioAdmin";

/**
 * Sets custom claim `portfolioAdmin: true` on every UID listed in config/portfolio.allowedAdmins.
 * Storage rules use this claim (works on Spark). Caller must be authenticated and already in allowedAdmins.
 */
export async function POST(request: Request) {
  const app = getFirebaseAdminApp();
  if (!app) {
    return NextResponse.json(
      {
        error:
          "Servidor sin credenciales Admin. En local: npx tsx scripts/sync-admin-claims.ts o define FIREBASE_SERVICE_ACCOUNT_JSON.",
      },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) {
    return NextResponse.json({ error: "Falta Authorization: Bearer <idToken>" }, { status: 401 });
  }

  let callerUid: string;
  try {
    const decoded = await getAuth(app).verifyIdToken(match[1]);
    callerUid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const db = getFirestore(app);
  const snap = await db.doc("config/portfolio").get();
  if (!snap.exists) {
    return NextResponse.json({ error: "No existe config/portfolio" }, { status: 404 });
  }

  const allowedAdmins = snap.data()?.allowedAdmins;
  if (!Array.isArray(allowedAdmins) || !allowedAdmins.includes(callerUid)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const auth = getAuth(app);
  const results: { uid: string; ok: boolean; error?: string }[] = [];

  for (const uid of allowedAdmins) {
    if (typeof uid !== "string" || !uid.trim()) continue;
    try {
      await auth.setCustomUserClaims(uid.trim(), { [CLAIM]: true });
      results.push({ uid: uid.trim(), ok: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown";
      results.push({ uid: uid.trim(), ok: false, error: msg });
    }
  }

  return NextResponse.json({ ok: true, results });
}
