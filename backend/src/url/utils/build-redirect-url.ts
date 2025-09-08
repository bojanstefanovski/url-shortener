export function buildRedirectUrl(
  storedUrl: string,
  incoming: Record<string, string | undefined>
): string {
  const u = new URL(storedUrl);

  for (const [k, v] of Object.entries(incoming)) {
    if (!v) continue;
    if (!k.toLowerCase().startsWith("utm_")) continue;
    if (!u.searchParams.has(k)) u.searchParams.set(k, v);
  }
  return u.toString();
}