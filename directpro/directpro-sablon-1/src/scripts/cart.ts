// Coș demo, păstrat în localStorage. Nu trimite nimic nicăieri.
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

const KEY = 'directpro-cart';

export function readCart(): CartItem[] {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event('cart:change'));
}

export function addToCart(item: Omit<CartItem, 'qty'>) {
  const items = readCart();
  const existing = items.find((i) => i.id === item.id);
  if (existing) existing.qty = Math.min(existing.qty + 1, 10);
  else items.push({ ...item, qty: 1 });
  writeCart(items);
}

const fmt = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0, useGrouping: 'always' as never });
export const formatPrice = (n: number) => `${fmt.format(n)} lei`;
