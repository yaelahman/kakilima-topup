/** Format role value for display (e.g. superadmin → Superadmin, member → Member). */
export function roleLabel(role: string | number | undefined | null): string {
  if (role == null || role === "") return "—";
  const s = String(role).toLowerCase();
  if (s === "superadmin") return "Superadmin";
  if (s === "member") return "Member";
  return String(role).charAt(0).toUpperCase() + String(role).slice(1).toLowerCase();
}
