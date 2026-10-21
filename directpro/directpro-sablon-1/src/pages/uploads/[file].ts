import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadsDir } from '../../lib/products';

export const prerender = false;

const types: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

// Servește imaginile încărcate din admin. Numele sunt UUID-uri generate de noi.
export const GET: APIRoute = async ({ params }) => {
  const file = params.file ?? '';
  const match = /^[0-9a-f-]{36}\.(jpg|png|webp)$/.exec(file);
  if (!match) return new Response('Not found', { status: 404 });
  try {
    const body = await fs.readFile(path.join(uploadsDir, file));
    return new Response(body, {
      headers: {
        'Content-Type': types[match[1]],
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
