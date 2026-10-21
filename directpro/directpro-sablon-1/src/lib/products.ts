import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export interface Product {
  id: string;
  sku: string | null;
  name: string;
  price: number;
  regularPrice: number | null;
  image: string;
  inStock: boolean;
  source?: string;
}

// Fișierele de date stau lângă proiect, nu în build, ca să poată fi modificate din admin la rulare.
const dataDir = path.resolve(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'products.json');
export const uploadsDir = path.join(dataDir, 'uploads');

export async function getProducts(): Promise<Product[]> {
  return JSON.parse(await fs.readFile(dataFile, 'utf8'));
}

export async function getProduct(id: string) {
  return (await getProducts()).find((p) => p.id === id);
}

// Scriere atomică: fișier temporar + rename, ca să nu rămână JSON pe jumătate scris.
async function save(products: Product[]) {
  const tmp = `${dataFile}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(products, null, 2) + '\n');
  await fs.rename(tmp, dataFile);
}

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function addProduct(input: Omit<Product, 'id'>) {
  const products = await getProducts();
  let id = slugify(input.name) || crypto.randomUUID();
  while (products.some((p) => p.id === id)) id = `${id}-${crypto.randomInt(100, 999)}`;
  products.push({ id, ...input });
  products.sort((a, b) => a.name.localeCompare(b.name, 'ro'));
  await save(products);
  return id;
}

export async function updateProduct(id: string, changes: Partial<Omit<Product, 'id'>>) {
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return false;
  Object.assign(product, changes);
  await save(products);
  return true;
}

export async function deleteProduct(id: string) {
  const products = await getProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await save(next);
  const removed = products.find((p) => p.id === id);
  if (removed?.image.startsWith('/uploads/')) {
    await fs.rm(path.join(uploadsDir, path.basename(removed.image)), { force: true });
  }
  return true;
}

const imageTypes: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const maxUploadBytes = 3 * 1024 * 1024;

// Returnează calea publică a imaginii sau un mesaj de eroare.
export async function saveUpload(file: File): Promise<{ path: string } | { error: string }> {
  const ext = imageTypes[file.type];
  if (!ext) return { error: 'Imaginea trebuie să fie JPG, PNG sau WebP.' };
  if (file.size > maxUploadBytes) return { error: 'Imaginea depășește 3 MB.' };
  const bytes = Buffer.from(await file.arrayBuffer());
  // Verificăm și semnătura fișierului, nu doar tipul declarat de browser.
  const magic = bytes.subarray(0, 12);
  const ok =
    (ext === 'jpg' && magic[0] === 0xff && magic[1] === 0xd8) ||
    (ext === 'png' && magic.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) ||
    (ext === 'webp' && magic.subarray(0, 4).toString() === 'RIFF' && magic.subarray(8, 12).toString() === 'WEBP');
  if (!ok) return { error: 'Fișierul nu pare a fi o imagine validă.' };
  const name = `${crypto.randomUUID()}.${ext}`;
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, name), bytes);
  return { path: `/uploads/${name}` };
}

export const brands = (products: Product[]) =>
  [...new Set(products.map((p) => brandOf(p.name)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ro'));

export function brandOf(name: string) {
  const known = ['Audi', 'BMW', 'Citroen', 'Dacia', 'Fiat', 'Ford', 'Mercedes-Benz', 'Opel', 'Renault', 'Seat', 'Skoda', 'Volkswagen'];
  const normalized = name.replace(/\bVW\b/, 'Volkswagen');
  return known.find((b) => normalized.includes(b)) ?? 'Altele';
}

const priceFormat = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0, useGrouping: 'always' });
export const formatPrice = (value: number) => `${priceFormat.format(value)} lei`;
