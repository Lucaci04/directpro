import type { APIRoute } from 'astro';
import { recordVisit } from '../../lib/stats';
import { allow, clientIp, sameOrigin } from '../../lib/guard';

export const prerender = false;

export const POST: APIRoute = async ({ request, url, clientAddress }) => {
  if (!sameOrigin(request, url)) return new Response(null, { status: 403 });
  if (!allow(`v:${clientIp(() => clientAddress)}`, 120, 60_000)) return new Response(null, { status: 429 });
  const body = (await request.text()).slice(0, 200);
  recordVisit(body);
  return new Response(null, { status: 204 });
};
