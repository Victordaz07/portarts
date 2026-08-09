/**
 * Admin gate. Access is granted to any authenticated user whose email is listed
 * in the `ADMIN_EMAILS` env var (comma-separated). Env-based gating is safer than
 * a DB-editable list for auth, and keeps the check available at the edge.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const list = getAdminEmails();
  if (list.length === 0) return false;
  return list.includes(email.trim().toLowerCase());
}
