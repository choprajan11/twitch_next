export function getSessionEmail(): string | null {
  try {
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith("user_email="));
    if (!match) return null;

    return decodeURIComponent(match.split("=")[1]) || null;
  } catch {
    return null;
  }
}
