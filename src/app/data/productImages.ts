// Local mock product images.
// Images live in src/assets/products/ and are bundled + hashed by Vite at build
// time (via import.meta.glob), so paths resolve correctly in dev and on Vercel.
const modules = import.meta.glob('../../assets/products/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Sorted by filename for a stable, deterministic order.
export const PRODUCT_IMAGES: string[] = Object.keys(modules)
  .sort()
  .map((key) => modules[key]);

// Pick an image by index, cycling through the pool if there are more items than images.
export function productImage(index: number): string {
  return PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];
}
