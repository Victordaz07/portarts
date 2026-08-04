import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { isAdminEmail } from "@/lib/admin";

/**
 * Auth.js (NextAuth v5) — replaces Firebase Auth.
 * Providers read `AUTH_GITHUB_ID/SECRET` and `AUTH_GOOGLE_ID/SECRET` automatically.
 * Sessions are JWT-based (no DB adapter needed); admin status is derived from
 * `ADMIN_EMAILS` and carried on the token so the client can gate the /admin UI.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      token.isAdmin = isAdminEmail(token.email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string | undefined) ?? session.user.id;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
});

/** Server helper: current session user if they are an admin, else null. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) return null;
  return session.user;
}
