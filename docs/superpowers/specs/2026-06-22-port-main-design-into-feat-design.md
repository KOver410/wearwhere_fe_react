# Design: Port main's design/UX refinements into feat/frontend-app

- **Date:** 2026-06-22
- **Status:** Approved (design); pending implementation plan
- **Branch:** feat/frontend-app

## Background

`origin/main` (92a3d9c) and `feat/frontend-app` (7acc14f) are two **unrelated** git
histories of the same WearWhere app — `git merge-base` is empty (no common ancestor).
`feat/frontend-app` is the go-forward, re-architected line: feature-folder structure
(`src/features/<domain>`, `src/app` shell, `src/shared`), a real API layer
(`api/` + `contracts.ts`) + hooks, auth/brand/admin portals, Vitest tests, and a
dynamic cart badge. `origin/main` carries a set of design/UX + localization
refinements that the feat line never received.

This spec ports those 5 refinements from main into feat **without losing feat's
engineering**. The actual git integration of feat → main (the unrelated-histories
problem) is a separate decision and is out of scope here.

## Goals

Port these 5 items, each verified by `npm run build` + `npm test`:

1. Deep VI/EN localization parity (main has ~2424 `v()` bilingual calls vs feat ~723).
2. Nav rename **STYLE → OOTD**.
3. HomePage: promote the Smart Wardrobe section, add the trending-post link, localize labels.
4. Voucher amount overflow fix.
5. Local bundled product images.

## Non-goals

- Merging feat into main / resolving the unrelated-histories integration.
- Backend / API / contract changes.
- New features or visual redesign beyond matching main.

## Guiding principles

- **Surgical, in-place edits** on feat files. Never overwrite a feat file wholesale
  with main's version — main lacks feat's API wiring / dynamic data / tests.
- **Preserve feat-only behavior:** the `BRAND` nav entry, dynamic `{cartQty}` badge,
  `RequireRole`, the `api/` + `contracts.ts` layer, and all existing tests.
- **Reuse feat's existing primitives:** `t(key)` / `v(en, vi)` from
  `@/shared/i18n/LanguageContext`; `formatVnd` from `@/shared/utils/currency`.
- **No new dependencies.** Keep the feature-folder structure and the `@/` import alias.
- **Use main's EXACT Vietnamese strings;** do not invent translations.

## Approach (C — hybrid, phased)

Phase 1 = the 4 bounded items, one commit each. Phase 2 = localization parity in 5
feature-group batches, each built + tested + committed.

## Phase 1

### Item 2 — Nav STYLE → OOTD  (`src/shared/components/Header.tsx`)

- Desktop primary-nav array (~line 107): `/ootd` label `'STYLE'` → `'OOTD'`.
  Localize siblings: `'HOME'` → `v('HOME','TRANG CHỦ')`, `'SHOP'` → `v('SHOP','CỬA HÀNG')`,
  `'BRAND'` → `v('BRAND','THƯƠNG HIỆU')`. **Keep** the BRAND entry (feat-only).
- Mobile-nav array (~line 221): `/ootd` label `v('Style','Phong Cách')` → `'OOTD'`.

### Item 3 — HomePage  (`src/features/shop/pages/HomePage.tsx`)

- Destructure `v` from `useLanguage()` (currently only `lang`).
- Heading `TRENDING` → `v('TRENDING','THỊNH HÀNH')`.
- Carousel scroll aria-labels → `v('Scroll left','Cuộn sang trái')` /
  `v('Scroll right','Cuộn sang phải')`.
- Wrap each trending post in `<Link to={`/ootd/${((post.id - 1) % 8) + 1}`}>` so a
  trending post navigates to its OOTD detail (main's navigation fix).
- Move the `{isLoggedIn && <SmartWardrobe />}` block up to main's position (right
  after the hero / trending area, not near the bottom). Exact placement is determined
  by reading the file during implementation.

### Item 4 — Voucher overflow  (`src/features/account/pages/VouchersPage.tsx`)

- Discount column: `w-24` → `w-28 flex-shrink-0`.
- Discount-value span: adaptive font-size (28px for `%`, 16px for a VND amount),
  `wordBreak: 'break-word'`, `width: '100%'`, `lineHeight: 1.1`,
  `fontFamily: "'Oswald', sans-serif"`.
- Render VND amounts via `formatVnd(...)` (import from `@/shared/utils/currency`).

### Item 5 — Local product images

- Add `src/assets/products/*.jpg` (50 files copied from `origin/main`).
- Create `src/shared/data/productImages.ts` (ported from main):
  - `import.meta.glob('../../assets/products/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })`
  - export `PRODUCT_IMAGES: string[]` (sorted by filename) and
    `productImage(index): string` (cycles through the pool).
- Wire usage at the same two sites main uses:
  - `src/shared/components/ProductGrid.tsx`: `<ProductCard ... image={productImage(i)} />`.
  - `src/shared/data/mockData.ts`: import `productImage`; rename the static
    `export const products: Product[] = [ ... ]` literal (≈ line 228) to
    `const productsRaw: Product[] = [ ... ]`, then add
    `export const products: Product[] = productsRaw.map((p, i) => { const img = productImage(i); return { ...p, image: img, images: [img] }; });`
    so every product draws a distinct local image by index. (feat's `Product` type
    already has both `image` and `images`.)
- Add `src/shared/data/productImages.test.ts`: assert `PRODUCT_IMAGES` is non-empty
  and `productImage` cycles by index.

## Phase 2 — Item 1: localization parity

Method, per page/component:

1. Diff feat's file against main's same-named file (ignoring import paths).
2. Wherever main wraps a user-visible string in `v('EN','VI')` or `t(key)` and feat
   hardcodes English, apply the identical `v()` / `t()` using main's exact VI text.
3. Add any dictionary keys main's `LanguageContext` has that feat's lacks into
   `src/shared/i18n/LanguageContext.tsx` (both the `en` and `vi` maps).

Batches (each: edit → `npm run build` → `npm test` → commit):

- **Batch 1 — shop:** pages ProductDetail, Shop, CartCheckout, Wishlist,
  SearchResults, AllBrands, BrandStorefront, About, Partner, HowItWorks, OrderSuccess,
  Style + shared display components Footer, HeroSection, EditorialCollections,
  FeaturedArtisans, NearbyShops, HeritageCTA, OutfitSuggestions, ShopByStyle,
  TrendingItems, NewsSlider, AboutUs, PartnerWithUs, HowItWorks, LoginPromptModal.
- **Batch 2 — account:** Profile, Settings, MyOrders, OrderDetail, MyReturns,
  ReturnRequest, AddressBook, PaymentMethods, Vouchers, Notifications, MyOOTDs +
  AccountLayout.
- **Batch 3 — ootd + wardrobe + stores + onboarding + auth** pages.
- **Batch 4 — brand portal** pages.
- **Batch 5 — admin portal** pages.

## Data flow / interfaces

- No API / contract changes. Localization flows through the existing `LanguageContext`
  provider (`t`, `v`, `lang`, `setLang`).
- Product images resolve at build time via Vite `import.meta.glob` → hashed URLs,
  reliable in dev and on Vercel.

## Testing

- After each Phase-1 item and each Phase-2 batch: `npm test` (vitest) and
  `npm run build` must be green; existing tests (PortalLoginForm, auth, account API,
  etc.) must not regress.
- New: `productImages.test.ts`.
- Manual spot-check via `npm run dev`: Header nav, Home (wardrobe position + trending
  links), Vouchers (long VND amounts), and the EN↔VI language toggle.

## Risks & mitigations

- **Phase-2 volume** → batch + verify per batch; commit per batch for easy rollback.
- **Translation drift** → copy main's exact VI strings; never invent.
- **Regressing feat's dynamic data** → keep the `{...product}` spread; only override `image`.
- **Unrelated-histories confusion** → all work is in-place on feat; no merge from main.

## Sequencing

Phase 1 items are independent files and can be done in any order. Recommended:
Item 2 → 4 → 5 → 3, then Phase 2 batches 1 → 5. Each is its own commit.
