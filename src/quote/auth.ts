const SESSION_KEY = "tf-admin-session";

export const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD?.trim() || "techflows";

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function loginAdmin(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  sessionStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}
