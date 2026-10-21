import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { getProducts } from './products';

// Date demo păstrate local în data/*.json. Fără cookie-uri, fără IP-uri salvate.
const dataDir = path.resolve(process.cwd(), 'data');
const file = (name: string) => path.join(dataDir, name);

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file(name), 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(name: string, value: unknown) {
  const target = file(name);
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + '\n');
  await fs.rename(tmp, target);
}

// Scrierile pe același fișier se fac pe rând, ca să nu se piardă înregistrări.
const queues = new Map<string, Promise<unknown>>();
function serial<T>(name: string, task: () => Promise<T>): Promise<T> {
  const next = (queues.get(name) ?? Promise.resolve()).then(task, task);
  queues.set(name, next.catch(() => {}));
  return next;
}

const today = () => new Date().toISOString().slice(0, 10);

/* ---------- Vizite ---------- */

type Visits = Record<string, Record<string, number>>; // zi -> pagină -> număr
let pending: Visits = {};
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const trackable = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/;

export function recordVisit(rawPath: string) {
  const p = rawPath.replace(/\/$/, '') || '/';
  if (p.length > 120 || !trackable.test(p) || p.startsWith('/admin')) return false;
  const day = today();
  pending[day] ??= {};
  pending[day][p] = (pending[day][p] ?? 0) + 1;
  flushTimer ??= setTimeout(flushVisits, 5000);
  return true;
}

export function flushVisits() {
  flushTimer = null;
  const batch = pending;
  pending = {};
  return serial('visits.json', async () => {
    const visits = await readJson<Visits>('visits.json', {});
    for (const [day, pages] of Object.entries(batch)) {
      visits[day] ??= {};
      for (const [p, n] of Object.entries(pages)) visits[day][p] = (visits[day][p] ?? 0) + n;
    }
    // Păstrăm doar ultimele 120 de zile.
    const keep = Object.keys(visits).sort().slice(-120);
    await writeJson('visits.json', Object.fromEntries(keep.map((d) => [d, visits[d]])));
  });
}

/* ---------- Comenzi și mesaje demo ---------- */

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  delivery: 'atelier' | 'curier';
  address: string;
  car: string;
  items: { id: string; name: string; price: number; qty: number }[];
  total: number;
}

export interface Message {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  topic: string;
  text: string;
}

export const getOrders = () => readJson<Order[]>('orders.json', []);
export const getMessages = () => readJson<Message[]>('messages.json', []);

const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const phoneOk = (v: string) => /^(\+?40|0)\d{9}$/.test(v.replace(/[\s.-]/g, ''));

export async function addOrder(input: Record<string, unknown>) {
  const name = clean(input.nume, 80);
  const phone = clean(input.telefon, 20);
  const email = clean(input.email, 120);
  const delivery = input.livrare === 'curier' ? 'curier' : 'atelier';
  const address = clean(input.adresa, 240);
  const car = clean(input.masina, 120);
  if (name.length < 3 || !phoneOk(phone)) return { error: 'Date de contact invalide.' };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Email invalid.' };
  if (delivery === 'curier' && address.length < 8) return { error: 'Adresa lipsește.' };
  if (input.acord !== true) return { error: 'Lipsește acordul.' };

  // Prețurile se iau din catalog, nu din ce trimite browserul.
  const products = await getProducts();
  const raw = Array.isArray(input.items) ? input.items.slice(0, 20) : [];
  const items = raw
    .map((i: { id?: unknown; qty?: unknown }) => {
      const p = products.find((x) => x.id === i?.id && x.inStock);
      const qty = Math.min(10, Math.max(1, Math.floor(Number(i?.qty) || 0)));
      return p ? { id: p.id, name: p.name, price: p.price, qty } : null;
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);
  if (items.length === 0) return { error: 'Coșul e gol.' };

  const order: Order = {
    id: crypto.randomUUID().slice(0, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    name,
    phone,
    email,
    delivery,
    address,
    car,
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
  };
  await serial('orders.json', async () => {
    const orders = await getOrders();
    orders.push(order);
    await writeJson('orders.json', orders.slice(-1000));
  });
  return { order };
}

export async function addMessage(input: Record<string, unknown>) {
  const message: Message = {
    id: crypto.randomUUID().slice(0, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    name: clean(input.nume, 80),
    phone: clean(input.telefon, 20),
    topic: clean(input.serviciu, 80) || 'Nespecificat',
    text: String(input.mesaj ?? '').trim().slice(0, 2000),
  };
  if (message.name.length < 2 || !phoneOk(message.phone) || message.text.length < 5) return { error: 'Date invalide.' };
  if (input.acord !== true) return { error: 'Lipsește acordul.' };
  await serial('messages.json', async () => {
    const messages = await getMessages();
    messages.push(message);
    await writeJson('messages.json', messages.slice(-1000));
  });
  return { message };
}

/* ---------- Agregări pentru panou ---------- */

export function lastDays(n: number) {
  const days: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setUTCDate(d.getUTCDate() - i);
    days.push(x.toISOString().slice(0, 10));
  }
  return days;
}

export async function getDashboard(range = 30) {
  await flushVisits();
  const [visits, orders, messages, products] = await Promise.all([
    readJson<Visits>('visits.json', {}),
    getOrders(),
    getMessages(),
    getProducts(),
  ]);
  const days = lastDays(range);
  const since = days[0];
  const perDay = days.map((day) => ({ day, value: Object.values(visits[day] ?? {}).reduce((s, n) => s + n, 0) }));

  const pageTotals = new Map<string, number>();
  for (const day of days) for (const [p, n] of Object.entries(visits[day] ?? {})) pageTotals.set(p, (pageTotals.get(p) ?? 0) + n);
  const topPages = [...pageTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }));

  const recentOrders = orders.filter((o) => o.createdAt.slice(0, 10) >= since);
  const recentMessages = messages.filter((m) => m.createdAt.slice(0, 10) >= since);

  const ordered = new Map<string, { label: string; value: number }>();
  for (const o of recentOrders)
    for (const i of o.items) {
      const e = ordered.get(i.id) ?? { label: i.name, value: 0 };
      e.value += i.qty;
      ordered.set(i.id, e);
    }

  const topics = new Map<string, number>();
  for (const m of recentMessages) topics.set(m.topic, (topics.get(m.topic) ?? 0) + 1);

  return {
    days,
    perDay,
    totalVisits: perDay.reduce((s, d) => s + d.value, 0),
    topPages,
    orders: recentOrders,
    ordersValue: recentOrders.reduce((s, o) => s + o.total, 0),
    topProducts: [...ordered.values()].sort((a, b) => b.value - a.value).slice(0, 6),
    messages: recentMessages,
    topics: [...topics.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    catalog: { total: products.length, inStock: products.filter((p) => p.inStock).length },
    latestOrders: [...orders].reverse().slice(0, 8),
    latestMessages: [...messages].reverse().slice(0, 8),
  };
}
