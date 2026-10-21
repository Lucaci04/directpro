import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';

// Autentificare minimă pentru demo: o singură parolă din ADMIN_PASSWORD,
// sesiune semnată HMAC cu ADMIN_SECRET într-un cookie httpOnly.
const COOKIE = 'directpro_admin';
const SESSION_HOURS = 8;

const env = (key: string) => process.env[key] ?? import.meta.env[key];

export function authConfigured() {
  const password = env('ADMIN_PASSWORD');
  const secret = env('ADMIN_SECRET');
  return Boolean(password && secret && secret.length >= 32);
}

const sign = (payload: string) =>
  crypto.createHmac('sha256', env('ADMIN_SECRET')!).update(payload).digest('base64url');

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkPassword(candidate: string) {
  return authConfigured() && safeEqual(candidate, env('ADMIN_PASSWORD')!);
}

export function startSession(cookies: AstroCookies, secure: boolean) {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const payload = `${expires}.${crypto.randomBytes(16).toString('base64url')}`;
  cookies.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });
}

export function endSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}

export function isAuthenticated(cookies: AstroCookies) {
  if (!authConfigured()) return false;
  const value = cookies.get(COOKIE)?.value;
  if (!value) return false;
  const i = value.lastIndexOf('.');
  const payload = value.slice(0, i);
  const signature = value.slice(i + 1);
  if (!payload || !safeEqual(signature, sign(payload))) return false;
  return Number(payload.split('.')[0]) > Date.now();
}

// Limitare simplă a încercărilor de login, per IP, în memorie.
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60_000;

export function loginBlocked(ip: string) {
  const entry = attempts.get(ip);
  return Boolean(entry && entry.count >= MAX_ATTEMPTS && entry.until > Date.now());
}

export function recordFailedLogin(ip: string) {
  const entry = attempts.get(ip);
  if (!entry || entry.until < Date.now()) attempts.set(ip, { count: 1, until: Date.now() + WINDOW_MS });
  else entry.count++;
}

export function clearFailedLogins(ip: string) {
  attempts.delete(ip);
}
