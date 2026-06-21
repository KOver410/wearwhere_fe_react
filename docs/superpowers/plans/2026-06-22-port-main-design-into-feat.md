# Port main's design/UX refinements into feat/frontend-app — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring main's 5 design/UX refinements (VI/EN localization parity, STYLE→OOTD nav, HomePage wardrobe promotion + trending link, voucher overflow fix, local product images) into `feat/frontend-app` without losing feat's engineering.

**Architecture:** Surgical, in-place edits on existing feat files — never overwrite a feat file wholesale with main's version (main lacks feat's API wiring, dynamic data, and tests). Phase 1 = 4 bounded items (one commit each). Phase 2 = localization parity in 5 feature-group batches (one commit each).

**Tech Stack:** Vite 6 + React 18 + TypeScript SPA; react-router v7; Tailwind v4 + shadcn/Radix; Vitest + Testing Library + jsdom. Spec: `docs/superpowers/specs/2026-06-22-port-main-design-into-feat-design.md`.

## Global Constraints

- Use the `@/` import alias (= `src/`). No new dependencies.
- Reuse existing helpers: `t(key)` / `v(en, vi)` from `@/shared/i18n/LanguageContext`; `formatVnd` from `@/shared/utils/currency`.
- Preserve feat-only behavior: the `BRAND` nav entry, the dynamic `{cartQty}` cart badge, `RequireRole`, the `api/` + `contracts.ts` layer, and all existing tests must stay green.
- Use main's **exact** Vietnamese strings; never invent translations.
- File naming: Pages/components `PascalCase.tsx`; feature utils `camelCase.ts`; shadcn primitives `kebab-case.tsx`.
- Every task ends green: `npm run build` and `npm test` (vitest) must both pass.
- All work happens on branch `feat/frontend-app`. No merge from `origin/main`.

---

## Phase 1 — Bounded items

### Task 1: Item 2 — Nav STYLE → OOTD (Header)

**Files:**
- Modify: `src/shared/components/Header.tsx` (desktop nav ~107-110; mobile nav ~219-222)
- Test: `src/shared/components/Header.test.tsx` (create)

**Interfaces:**
- Consumes: `Header` (default-props component), `LanguageProvider` from `@/shared/i18n/LanguageContext`.
- Produces: nothing new (UI parity only).

- [ ] **Step 1: Write the failing test** — create `src/shared/components/Header.test.tsx`:

```tsx
import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import { Header } from './Header'

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: false, promptLogin: vi.fn() }),
}))

vi.mock('@/features/account/api/cartApi', () => ({
  getCart: vi.fn().mockResolvedValue({ summary: { total_qty: 0 } }),
}))

function renderHeader() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('Header primary navigation', () => {
  it('shows the OOTD nav entry and no STYLE entry', () => {
    localStorage.setItem('ww-lang', 'en')
    renderHeader()
    expect(screen.getAllByText('OOTD').length).toBeGreaterThan(0)
    expect(screen.queryByText('STYLE')).toBeNull()
    expect(screen.queryByText('Style')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `npm test -- src/shared/components/Header.test.tsx`
Expected: FAIL — `STYLE` is still present (assertion `queryByText('STYLE')` finds the node).

- [ ] **Step 3: Edit the desktop nav array** in `src/shared/components/Header.tsx`. Replace:

```tsx
                  { to: '/', label: 'HOME', active: currentPath === '/' },
                  { to: '/shop', label: 'SHOP', active: isActive('/shop') },
                  { to: '/ootd', label: 'STYLE', active: isActive('/ootd') || isActive('/style') },
                  { to: '/brands', label: 'BRAND', active: isActive('/brands') },
```

with:

```tsx
                  { to: '/', label: v('HOME', 'TRANG CHỦ'), active: currentPath === '/' },
                  { to: '/shop', label: v('SHOP', 'CỬA HÀNG'), active: isActive('/shop') },
                  { to: '/ootd', label: 'OOTD', active: isActive('/ootd') || isActive('/style') },
                  { to: '/brands', label: v('BRAND', 'THƯƠNG HIỆU'), active: isActive('/brands') },
```

- [ ] **Step 4: Edit the mobile nav array** in the same file. Replace:

```tsx
              { to: '/ootd', label: v('Style', 'Phong Cách') },
```

with:

```tsx
              { to: '/ootd', label: 'OOTD' },
```

- [ ] **Step 5: Run the test, verify it passes**

Run: `npm test -- src/shared/components/Header.test.tsx`
Expected: PASS.

- [ ] **Step 6: Run the full suite + build**

Run: `npm test` then `npm run build`
Expected: both green.

- [ ] **Step 7: Commit**

```bash
git add src/shared/components/Header.tsx src/shared/components/Header.test.tsx
git commit -m "feat(nav): rename STYLE nav to OOTD and localize primary nav (port from main)"
```

---

### Task 2: Item 4 — Voucher amount overflow + VND (VouchersPage)

**Files:**
- Modify: `src/features/account/pages/VouchersPage.tsx` (imports line 1-8; discount column ~149-159; min/max ~199-206)

**Interfaces:**
- Consumes: `formatVnd` from `@/shared/utils/currency`; existing `v` from `useLanguage()`.
- Produces: nothing new (UI parity only).

This is a visual/styling fix; it is verified by `npm run build` + the full suite + a manual dev check (no new unit test — a DOM test for adaptive font-size / word-break would be brittle and low-value).

- [ ] **Step 1: Add the `formatVnd` import.** In `src/features/account/pages/VouchersPage.tsx`, after the existing line `import { copyToClipboard } from '@/shared/utils/clipboard';` add:

```tsx
import { formatVnd } from '@/shared/utils/currency';
```

- [ ] **Step 2: Fix the discount column.** Replace:

```tsx
                  <div
                    className="w-24 flex-shrink-0 flex flex-col items-center justify-center p-4"
                    style={{ backgroundColor: voucher.status === 'active' ? '#d41c1c' : '#4a4a4a', color: '#FFFFFF' }}
                  >
                    <span style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>
                      {voucher.discountType === 'percentage' ? `${voucher.discount}%` : `$${voucher.discount}`}
                    </span>
```

with:

```tsx
                  <div
                    className="w-28 flex-shrink-0 flex flex-col items-center justify-center p-3 text-center"
                    style={{ backgroundColor: voucher.status === 'active' ? '#d41c1c' : '#4a4a4a', color: '#FFFFFF' }}
                  >
                    <span style={{ fontSize: voucher.discountType === 'percentage' ? '28px' : '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, lineHeight: 1.1, width: '100%', wordBreak: 'break-word' }}>
                      {voucher.discountType === 'percentage' ? `${voucher.discount}%` : formatVnd(voucher.discount)}
                    </span>
```

- [ ] **Step 3: Convert min order / max discount to VND.** Replace:

```tsx
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {v('Min. order', 'Đơn tối thiểu')}: ${voucher.minOrder}
                        </span>
                        {voucher.maxDiscount && (
                          <span style={{ fontSize: '12px', color: '#888' }}>
                            Max: ${voucher.maxDiscount}
                          </span>
                        )}
```

with:

```tsx
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {v('Min. order', 'Đơn tối thiểu')}: {formatVnd(voucher.minOrder)}
                        </span>
                        {voucher.maxDiscount && (
                          <span style={{ fontSize: '12px', color: '#888' }}>
                            {v('Max', 'Tối đa')}: {formatVnd(voucher.maxDiscount)}
                          </span>
                        )}
```

- [ ] **Step 4: Build + full suite**

Run: `npm run build` then `npm test`
Expected: both green.

- [ ] **Step 5: Manual check**

Run: `npm run dev`, open http://localhost:5173/account/vouchers. Confirm fixed-amount vouchers show a `₫` amount that wraps inside the red badge without overflowing; percentage vouchers still show `NN%`.

- [ ] **Step 6: Commit**

```bash
git add src/features/account/pages/VouchersPage.tsx
git commit -m "fix(vouchers): prevent VND amount overflow and format amounts in đồng (port from main)"
```

---

### Task 3: Item 5 — Local bundled product images

**Files:**
- Create: `src/assets/products/*.jpg` (50 files, copied from `origin/main`)
- Create: `src/shared/data/productImages.ts`
- Create: `src/shared/data/productImages.test.ts`
- Modify: `src/shared/components/ProductGrid.tsx` (map ~149-151)
- Modify: `src/shared/data/mockData.ts` (import; rename `products`→`productsRaw` line 228; add map override after line 983)

**Interfaces:**
- Produces: `PRODUCT_IMAGES: string[]` and `productImage(index: number): string` from `@/shared/data/productImages`.

- [ ] **Step 1: Copy the 50 product image assets from main**

```bash
git checkout origin/main -- src/assets/products/
ls src/assets/products/*.jpg | wc -l   # expect 50
```

- [ ] **Step 2: Write the failing test** — create `src/shared/data/productImages.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

import { PRODUCT_IMAGES, productImage } from './productImages'

describe('productImage', () => {
  it('exposes a non-empty image pool', () => {
    expect(PRODUCT_IMAGES.length).toBeGreaterThan(0)
  })

  it('returns the image at the given index', () => {
    expect(productImage(0)).toBe(PRODUCT_IMAGES[0])
  })

  it('cycles through the pool when the index exceeds its length', () => {
    expect(productImage(PRODUCT_IMAGES.length)).toBe(PRODUCT_IMAGES[0])
    expect(productImage(PRODUCT_IMAGES.length + 1)).toBe(PRODUCT_IMAGES[1])
  })
})
```

- [ ] **Step 3: Run the test, verify it fails**

Run: `npm test -- src/shared/data/productImages.test.ts`
Expected: FAIL — cannot resolve `./productImages` (module does not exist yet).

- [ ] **Step 4: Create `src/shared/data/productImages.ts`**:

```ts
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
```

- [ ] **Step 5: Run the test, verify it passes**

Run: `npm test -- src/shared/data/productImages.test.ts`
Expected: PASS (50 images in the pool).

- [ ] **Step 6: Wire `ProductGrid.tsx`.** Add the import below the existing `import { useLanguage } ...` line:

```tsx
import { productImage } from '@/shared/data/productImages';
```

Then replace:

```tsx
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
```

with:

```tsx
        {products.map((product, i) => (
          <ProductCard key={product.id} {...product} image={productImage(i)} />
        ))}
```

- [ ] **Step 7: Wire `mockData.ts`.** Add the import after the top comment — replace:

```ts
// Shared mock data for WearWhere platform

export interface Product {
```

with:

```ts
// Shared mock data for WearWhere platform
import { productImage } from './productImages';

export interface Product {
```

Rename the products array declaration (line 228) — replace `export const products: Product[] = [` with `const productsRaw: Product[] = [`.

Then add the override after the array close. Replace:

```ts
];

export const vouchers: Voucher[] = [
```

with:

```ts
];

// Every product draws a distinct local image from the bundled pool, assigned by
// index (mirrors origin/main). Overrides the Unsplash URLs above at module load.
export const products: Product[] = productsRaw.map((p, i) => {
  const img = productImage(i);
  return { ...p, image: img, images: [img] };
});

export const vouchers: Voucher[] = [
```

- [ ] **Step 8: Build + full suite**

Run: `npm run build` then `npm test`
Expected: both green.

- [ ] **Step 9: Commit**

```bash
git add src/assets/products src/shared/data/productImages.ts src/shared/data/productImages.test.ts src/shared/components/ProductGrid.tsx src/shared/data/mockData.ts
git commit -m "feat(images): bundle local product images and assign by index (port from main)"
```

---

### Task 4: Item 3 — HomePage wardrobe promotion + trending link + localized labels

**Files:**
- Modify: `src/features/shop/pages/HomePage.tsx` (import Link; `useLanguage` ~54; eyebrow ~199; trending card wrap ~223/257; scroll aria ~272/289; component order ~306-314)

**Interfaces:**
- Consumes: `Link` from `react-router`; existing `v` from `useLanguage()`.

Layout/structure parity; verified by `npm run build` + full suite + manual dev check (no new unit test — order/markup DOM assertions on the full HomePage would require mocking every child section and be brittle).

- [ ] **Step 1: Import `Link`.** At the top of `src/features/shop/pages/HomePage.tsx`, after `import { ChevronLeft, ChevronRight } from 'lucide-react';` add:

```tsx
import { Link } from 'react-router';
```

- [ ] **Step 2: Destructure `v`.** In `TrendingPosts`, replace `const { lang } = useLanguage();` with:

```tsx
  const { lang, v } = useLanguage();
```

- [ ] **Step 3: Localize the TRENDING eyebrow.** Replace the line that reads `            TRENDING` (inside the `<span ...>` at ~199) with:

```tsx
            {v('TRENDING', 'THỊNH HÀNH')}
```

- [ ] **Step 4: Wrap each trending card in a Link.** The card body sits between the `<motion.div ...>` opening tag and its `</motion.div>`. Insert the opening `<Link ...>` immediately before the `{/* Image */}` comment, and the closing `</Link>` immediately after the hover-effect `</div>` (right before `</motion.div>`):

Insert before `                {/* Image */}`:

```tsx
                <Link to={`/ootd/${((post.id - 1) % 8) + 1}`} className="block w-full h-full">
```

Insert after the hover-effect closing `</div>` (the one with `backgroundColor: 'rgba(212,28,28,0.15)'`) and before `              </motion.div>`:

```tsx
                </Link>
```

- [ ] **Step 5: Localize the scroll aria-labels.** Replace `aria-label="Scroll left"` with:

```tsx
              aria-label={v('Scroll left', 'Cuộn sang trái')}
```

and replace `aria-label="Scroll right"` with:

```tsx
              aria-label={v('Scroll right', 'Cuộn sang phải')}
```

- [ ] **Step 6: Promote Smart Wardrobe in the page order.** Replace the `HomePage` return block:

```tsx
    <>
      <HeroSection />
      <EditorialMarquee />
      <TrendingPosts />
      <EditorialCollections />
      <OutfitSuggestions />
      <FeaturedArtisans />
      {isLoggedIn && <NearbyShops />}
      {isLoggedIn && <SmartWardrobe />}
      <HeritageCTA />
    </>
```

with (Smart Wardrobe moves up to right after the marquee, matching main):

```tsx
    <>
      <HeroSection />
      <EditorialMarquee />
      {isLoggedIn && <SmartWardrobe />}
      <TrendingPosts />
      <EditorialCollections />
      <OutfitSuggestions />
      <FeaturedArtisans />
      {isLoggedIn && <NearbyShops />}
      <HeritageCTA />
    </>
```

- [ ] **Step 7: Build + full suite**

Run: `npm run build` then `npm test`
Expected: both green.

- [ ] **Step 8: Manual check**

Run: `npm run dev`, open http://localhost:5173/ logged in. Confirm: the Smart Wardrobe section appears right under the editorial marquee (above Trending); the TRENDING eyebrow reads "THỊNH HÀNH" in VI; clicking a trending post navigates to an `/ootd/<n>` detail page.

- [ ] **Step 9: Commit**

```bash
git add src/features/shop/pages/HomePage.tsx
git commit -m "feat(home): promote wardrobe section, link trending posts, localize labels (port from main)"
```

---

## Phase 2 — Item 1: localization parity (5 batches)

Phase 2 closes the bilingual gap (main ~2424 `v()` calls vs feat ~723). It is mechanical and repeated per file. Each batch is one commit.

### Shared procedure (apply to every file in a batch)

1. **Discover the gap** for a file by diffing feat against its same-named main file, ignoring import lines:

```bash
diff <(git show feat/frontend-app:<FEAT_PATH> | grep -vE "^import|from '@/") \
     <(git show origin/main:<MAIN_PATH> | grep -vE "^import|from '@/")
```

2. For every line where **main** wraps a user-visible string in `v('EN','VI')` or `t('key')` and **feat** hardcodes the English, edit the feat file to use the **identical** `v()` / `t()` call with main's **exact** VI text. Do not touch strings feat already localizes, and do not change non-user-visible strings (class names, style values, keys).
3. If main references a `t('key')` whose entry is missing from feat's `src/shared/i18n/LanguageContext.tsx`, add that key to **both** the `en` and `vi` maps using main's exact values.
4. Preserve feat-only code (dynamic data, API calls, BRAND nav, tests).

**Worked example (pattern):** a finder line like
`<` `>{v('Subscribe', 'Đăng ký')}</button>` (main) vs
`>` `>Subscribe</button>` (feat)
→ in the feat file, change `>Subscribe</button>` to `>{v('Subscribe', 'Đăng ký')}</button>`.

**Per-batch verification:** `npm run build` → `npm test` → commit. Existing tests must stay green; if a test asserts an English string that is now wrapped (still returns English under `ww-lang='en'`), it should keep passing — investigate any failure rather than loosening the test.

### Task 5: Batch 1 — shop pages + shared display components

**Files (feat path → main path):**
- `src/features/shop/pages/{ProductDetailPage,ShopPage,CartCheckoutPage,WishlistPage,SearchResultsPage,AllBrandsPage,BrandStorefrontPage,AboutPage,PartnerPage,HowItWorksPage,OrderSuccessPage,StylePage}.tsx` → `src/app/pages/<same>.tsx`
- `src/shared/components/{Footer,HeroSection,EditorialCollections,FeaturedArtisans,NearbyShops,HeritageCTA,OutfitSuggestions,ShopByStyle,TrendingItems,NewsSlider,AboutUs,PartnerWithUs,HowItWorks,LoginPromptModal}.tsx` → `src/app/components/<same>.tsx`
- `src/shared/i18n/LanguageContext.tsx` → `src/app/i18n/LanguageContext.tsx` (add any missing keys)

- [ ] **Step 1:** For each file above, run the discovery diff and apply the shared procedure.
- [ ] **Step 2:** Run `npm run build` — expect green (catches any unbalanced JSX / missing import).
- [ ] **Step 3:** Run `npm test` — expect green.
- [ ] **Step 4:** Manual spot-check via `npm run dev`: toggle EN↔VI (globe in header) on Home, Shop, Product Detail, Cart — confirm previously-English copy now switches to Vietnamese.
- [ ] **Step 5: Commit**

```bash
git add src/features/shop src/shared/components src/shared/i18n
git commit -m "i18n(shop): localize shop pages and shared display components (parity with main)"
```

### Task 6: Batch 2 — account

**Files:** `src/features/account/pages/{ProfilePage,SettingsPage,MyOrdersPage,OrderDetailPage,MyReturnsPage,ReturnRequestPage,AddressBookPage,PaymentMethodsPage,VouchersPage,NotificationsPage,MyOOTDsPage}.tsx` + `src/shared/components/AccountLayout.tsx` → matching `src/app/pages/account/*` and `src/app/components/AccountLayout.tsx`.

- [ ] **Step 1:** Apply the shared procedure to each file.
- [ ] **Step 2:** `npm run build` — green.
- [ ] **Step 3:** `npm test` — green (note: `SettingsPage.test.tsx`, `ProfilePage.test.tsx`, `AddressBookPage.test.tsx` assert English copy under `ww-lang='en'`; they must still pass).
- [ ] **Step 4: Commit**

```bash
git add src/features/account src/shared/components/AccountLayout.tsx
git commit -m "i18n(account): localize account pages (parity with main)"
```

### Task 7: Batch 3 — ootd + wardrobe + stores + onboarding + auth

**Files:** `src/features/ootd/pages/*`, `src/features/wardrobe/pages/*`, `src/features/stores/pages/*`, `src/features/onboarding/pages/*`, `src/features/auth/pages/*` → matching `src/app/pages/{ootd,wardrobe,stores,onboarding,auth}/*`.

- [ ] **Step 1:** Apply the shared procedure to each file.
- [ ] **Step 2:** `npm run build` — green.
- [ ] **Step 3:** `npm test` — green (auth tests, e.g. PortalLoginForm, must stay green).
- [ ] **Step 4: Commit**

```bash
git add src/features/ootd src/features/wardrobe src/features/stores src/features/onboarding src/features/auth
git commit -m "i18n(ootd/wardrobe/stores/onboarding/auth): localize remaining customer pages (parity with main)"
```

### Task 8: Batch 4 — brand portal

**Files:** `src/features/brand/pages/**/*.tsx` → matching `src/app/pages/brand/**/*.tsx` (BrandLoginPage is feat-only — localize it in the same style but it has no main counterpart).

- [ ] **Step 1:** Apply the shared procedure to each brand page.
- [ ] **Step 2:** `npm run build` — green.
- [ ] **Step 3:** `npm test` — green.
- [ ] **Step 4: Commit**

```bash
git add src/features/brand
git commit -m "i18n(brand): localize brand portal pages (parity with main)"
```

### Task 9: Batch 5 — admin portal

**Files:** `src/features/admin/pages/**/*.tsx` → matching `src/app/pages/admin/**/*.tsx` (AdminLoginPage is feat-only).

- [ ] **Step 1:** Apply the shared procedure to each admin page.
- [ ] **Step 2:** `npm run build` — green.
- [ ] **Step 3:** `npm test` — green.
- [ ] **Step 4: Commit**

```bash
git add src/features/admin
git commit -m "i18n(admin): localize admin portal pages (parity with main)"
```

---

## Self-review notes

- **Spec coverage:** Item 2 → Task 1; Item 4 → Task 2; Item 5 → Task 3; Item 3 → Task 4; Item 1 → Tasks 5-9. All 5 spec items covered.
- **Type consistency:** `productImage(index: number): string` and `PRODUCT_IMAGES: string[]` are defined in Task 3 Step 4 and consumed identically in Steps 6-7.
- **Phase 2 nature:** Tasks 5-9 are procedure-driven (the exact per-string edits are generated by the discovery diff at execution time, not pre-written) because the content is the feat↔main string delta across ~100 files. The procedure, discovery command, and acceptance checks are fully specified.
