import type { APIRoute } from 'astro';
import { addOrder } from '../../lib/stats';
import { allow, clientIp, json, sameOrigin } from '../../lib/guard';

export const prerender = false;

export const POST: APIRoute = async ({ request, url, clientAddress }) => {
  if (!sameOrigin(request, url)) return json({ error: 'Cerere respinsă.' }, 403);
  if (!allow(`o:${clientIp(() => clientAddress)}`, 10, 10 * 60_000)) return json({ error: 'Prea multe comenzi. Încearcă mai târziu.' }, 429);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Cerere invalidă.' }, 400);
  }
  const result = await addOrder(body);
  if ('error' in result) return json({ error: result.error }, 422);
  return json({ id: result.order.id, total: result.order.total }, 201);
};
