import type { APIRoute } from 'astro';
import { addMessage } from '../../lib/stats';
import { allow, clientIp, json, sameOrigin } from '../../lib/guard';

export const prerender = false;

export const POST: APIRoute = async ({ request, url, clientAddress }) => {
  if (!sameOrigin(request, url)) return json({ error: 'Cerere respinsă.' }, 403);
  if (!allow(`m:${clientIp(() => clientAddress)}`, 10, 10 * 60_000)) return json({ error: 'Prea multe mesaje. Încearcă mai târziu.' }, 429);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Cerere invalidă.' }, 400);
  }
  const result = await addMessage(body);
  if ('error' in result) return json({ error: result.error }, 422);
  return json({ id: result.message.id }, 201);
};
