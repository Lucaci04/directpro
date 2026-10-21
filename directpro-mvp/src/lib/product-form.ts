import { saveUpload, type Product } from './products';

export interface FormValues {
  name: string;
  sku: string;
  price: string;
  regularPrice: string;
  inStock: boolean;
}

export type FormErrors = Partial<Record<keyof FormValues | 'image', string>>;

export const emptyValues: FormValues = { name: '', sku: '', price: '', regularPrice: '', inStock: true };

export const valuesFrom = (p: Product): FormValues => ({
  name: p.name,
  sku: p.sku ?? '',
  price: String(p.price),
  regularPrice: p.regularPrice ? String(p.regularPrice) : '',
  inStock: p.inStock,
});

const parsePrice = (raw: string) => Number(raw.replace(/\s|\./g, '').replace(',', '.'));

// Validează formularul și, dacă e valid, salvează imaginea încărcată.
export async function readProductForm(data: FormData, requireImage: boolean) {
  const values: FormValues = {
    name: String(data.get('name') ?? '').trim(),
    sku: String(data.get('sku') ?? '').trim(),
    price: String(data.get('price') ?? '').trim(),
    regularPrice: String(data.get('regularPrice') ?? '').trim(),
    inStock: data.get('inStock') === 'on',
  };
  const errors: FormErrors = {};
  const price = parsePrice(values.price);
  const regular = values.regularPrice ? parsePrice(values.regularPrice) : null;

  if (values.name.length < 3 || values.name.length > 120) errors.name = 'Numele trebuie să aibă între 3 și 120 de caractere.';
  if (values.sku.length > 40) errors.sku = 'Codul are maximum 40 de caractere.';
  if (!Number.isFinite(price) || price <= 0 || price > 100000) errors.price = 'Scrie un preț între 1 și 100.000 lei.';
  if (regular !== null && (!Number.isFinite(regular) || regular <= price))
    errors.regularPrice = 'Prețul inițial trebuie să fie mai mare decât prețul curent (sau lasă câmpul gol).';

  const file = data.get('image');
  const hasFile = file instanceof File && file.size > 0;
  if (requireImage && !hasFile) errors.image = 'Alege o imagine pentru produs.';

  let image: string | undefined;
  if (Object.keys(errors).length === 0 && hasFile) {
    const saved = await saveUpload(file);
    if ('error' in saved) errors.image = saved.error;
    else image = saved.path;
  }

  return {
    values,
    errors,
    product:
      Object.keys(errors).length === 0
        ? { name: values.name, sku: values.sku || null, price, regularPrice: regular, inStock: values.inStock, image }
        : null,
  };
}
