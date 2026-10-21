// Protecții simple pentru endpoint-urile publice: aceeași origine + limită per IP (în memorie).
const hits = new Map<string, { count: number; until: number }>();

export function sameOrigin(request: Request, url: URL) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    // Comparăm cu host-ul cererii (în spatele unui proxy, url.origin poate diferi).
    return new URL(origin).host === (request.headers.get('host') ?? url.host);
  } catch {
    return false;
  }
}

export function allow(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.until < now) {
    hits.set(key, { count: 1, until: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= max;
}

export function clientIp(getter: () => string) {
  try {
    return getter();
  } catch {
    return 'unknown';
  }
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
