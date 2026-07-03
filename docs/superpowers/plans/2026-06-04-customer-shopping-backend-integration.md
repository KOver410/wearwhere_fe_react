# Customer Shopping Backend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the existing customer storefront in `D:\CHRIS\WW\frontend-app` to the supported customer-shopping APIs in `D:\CHRIS\WW\backend-services` without redesigning the current UI or falling back to mock data after API failures.

**Architecture:** Add a typed shared FE API client with token persistence and one-flight refresh, then expose feature-owned auth, shop, and account API modules. Integrate the existing pages one customer-journey slice at a time. Add configurable Gin CORS and normalize order errors in BE before connecting checkout and order screens.

**Tech Stack:** React 18, React Router 7, TypeScript, Vite 6, Vitest, React Testing Library, jsdom, Go, Gin, PostgreSQL, Redis.

**Design reference:** `D:\CHRIS\WW\frontend-app\docs\superpowers\specs\2026-06-04-customer-shopping-backend-integration-design.md`

---

## Execution Rules

- Run FE commands from `D:\CHRIS\WW\frontend-app`.
- Run BE commands from `D:\CHRIS\WW\backend-services`.
- Use `npm` because the FE has `package-lock.json`.
- The FE directory is not currently a Git repository. Do not run FE commit commands; use the plan checkboxes as FE checkpoints until Git is initialized or attached.
- The BE is a Git repository. Commit only the scoped BE changes after their tests pass.
- Do not delete `src/shared/data/mockData.ts` or `src/shared/data/accountMockData.ts`; unrelated prototype pages still consume them. Remove imports only from pages integrated in this milestone.
- Do not connect admin, brand, returns, OOTD, wardrobe, vouchers, stored cards, PayPal, or social login.
- Keep unsupported controls visible where they already exist, but disable them and show `Chưa hỗ trợ`.
- Before starting implementation, claim the existing BE issue:

```powershell
bd update wearwhere_be-xi4 --claim
```

Expected: issue `wearwhere_be-xi4` is assigned/claimed. It remains open after this customer milestone because its current acceptance criteria also include admin and brand integration.

## Contract Decisions

- FE base URL: `import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'`.
- Auth token persistence:
  - `rememberMe=true`: store both tokens in `localStorage`.
  - `rememberMe=false` and registration: store both tokens in `sessionStorage`.
  - Writing one mode clears the other mode.
- Authenticated FE role for this milestone: `customer` only.
- Product/order/address IDs are backend UUID strings. Order detail routes use backend `order_no`.
- Money is rendered with `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`.
- FE never computes checkout totals. It renders cart summary and checkout preview totals returned by BE.
- API failures render loading/empty/error states or toasts; they never substitute mock objects.
- Order success route: `/order/success?orderNo=WW-...`.
- PayOS mock checkout does not redirect to FE. E2E verification simulates the webhook and then opens the order success/detail route manually.

## Shared Backend Error Shape

All FE API modules consume this shape:

```ts
export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};
```

The BE order handler must use the same shape before checkout/order FE work begins.

---

### Task 1: Establish Baselines And FE Test Harness

**Files:**
- Modify: `D:\CHRIS\WW\frontend-app\package.json`
- Modify: `D:\CHRIS\WW\frontend-app\package-lock.json`
- Modify: `D:\CHRIS\WW\frontend-app\vite.config.ts`
- Create: `D:\CHRIS\WW\frontend-app\.env.example`
- Create: `D:\CHRIS\WW\frontend-app\src\test\setup.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\shared\utils\currency.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\shared\utils\currency.test.ts`

- [ ] **Step 1: Confirm both projects start from known-good baselines**

Run:

```powershell
npm run build
```

Expected: Vite build exits `0`; existing large-chunk warnings are allowed.

Run from BE:

```powershell
& 'C:\Program Files\Go\bin\go.exe' test ./...
```

Expected: all BE unit packages pass.

- [ ] **Step 2: Install the minimum FE test dependencies**

Run:

```powershell
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: `package.json` and `package-lock.json` include the five dev dependencies.

- [ ] **Step 3: Add test scripts and Vitest configuration**

Add these scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Extend `vite.config.ts`:

```ts
/// <reference types="vitest/config" />

test: {
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  clearMocks: true,
},
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
```

- [ ] **Step 4: Add a failing VND formatting test**

Create `src/shared/utils/currency.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatVND } from './currency';

describe('formatVND', () => {
  it('formats backend VND values without a decimal fraction', () => {
    expect(formatVND(125000)).toMatch(/125[.\s]000/);
    expect(formatVND(125000)).toContain('₫');
  });
});
```

Run:

```powershell
npm test -- src/shared/utils/currency.test.ts
```

Expected: FAIL because `currency.ts` does not exist.

- [ ] **Step 5: Implement the currency helper**

Create `src/shared/utils/currency.ts`:

```ts
export function formatVND(value: number | string): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value));
}
```

Create `.env.example`:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

- [ ] **Step 6: Verify the harness**

Run:

```powershell
npm test -- src/shared/utils/currency.test.ts
npm run build
```

Expected: both commands exit `0`.

**FE checkpoint:** test harness, API environment example, and VND formatter are complete. No FE commit is possible in the current workspace.

---

### Task 2: Add Configurable Backend CORS

**Files:**
- Modify: `D:\CHRIS\WW\backend-services\internal\config\config.go`
- Create: `D:\CHRIS\WW\backend-services\internal\config\config_test.go`
- Modify: `D:\CHRIS\WW\backend-services\cmd\api\main.go`
- Modify: `D:\CHRIS\WW\backend-services\.env.example`
- Create: `D:\CHRIS\WW\backend-services\internal\shared\cors\middleware.go`
- Create: `D:\CHRIS\WW\backend-services\internal\shared\cors\middleware_test.go`

- [ ] **Step 1: Add failing middleware tests**

Create tests covering:

```go
func TestMiddlewareAllowsConfiguredPreflight(t *testing.T)
func TestMiddlewareRejectsUnknownPreflightOrigin(t *testing.T)
func TestMiddlewareAddsHeadersToNormalAllowedRequest(t *testing.T)
func TestMiddlewareDoesNotAddHeadersToNormalUnknownOrigin(t *testing.T)
```

Assert the allowed preflight from `http://localhost:5173` returns `204` and includes:

```text
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Vary: Origin
```

Assert unknown-origin preflight returns `403`; a normal unknown-origin request continues without `Access-Control-Allow-Origin`.

Run:

```powershell
& 'C:\Program Files\Go\bin\go.exe' test ./internal/shared/cors
```

Expected: FAIL because the middleware package does not exist.

- [ ] **Step 2: Implement the middleware**

Expose:

```go
func Middleware(allowedOrigins []string) gin.HandlerFunc
```

Implementation rules:

- Build an exact-match origin set once when creating the middleware.
- For configured origins, set the four headers asserted above.
- Do not set `Access-Control-Allow-Credentials`.
- For `OPTIONS`, abort with `204` when allowed and `403` when not allowed.
- For non-`OPTIONS` requests, continue the chain even when the origin is absent or not configured.

- [ ] **Step 3: Add CORS config**

Add:

```go
type CORSConfig struct {
    AllowedOrigins []string
}
```

Add `CORS CORSConfig` to `config.Config`. Load `CORS_ALLOWED_ORIGINS` as a trimmed comma-separated list. Use this default only when `APP_ENV` is not `production`:

```text
http://localhost:5173,http://127.0.0.1:5173
```

When `APP_ENV=production` and `CORS_ALLOWED_ORIGINS` is empty, the allowed-origin list must be empty so production origins are always explicit.

In the same config change, replace PayOS defaults:

```go
ReturnURL: getEnv("PAYOS_RETURN_URL", "http://localhost:5173/order/success"),
CancelURL: getEnv("PAYOS_CANCEL_URL", "http://localhost:5173/cart"),
```

Mount it in `cmd/api/main.go` immediately after recovery/logger middleware and before routes:

```go
r.Use(cors.Middleware(cfg.CORS.AllowedOrigins))
```

- [ ] **Step 4: Add config behavior tests**

In `internal/config/config_test.go`, set required `DATABASE_URL` and `JWT_SECRET` values, then assert:

- Development with no CORS env returns the two local Vite origins.
- Production with no CORS env returns an empty origin list.
- A configured comma-separated value is trimmed and preserved exactly.

Run:

```powershell
& 'C:\Program Files\Go\bin\go.exe' test ./internal/config
```

Expected: pass after the config implementation.

- [ ] **Step 5: Document CORS and FE PayOS URLs**

Add to `.env.example`:

```text
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PAYOS_RETURN_URL=http://localhost:5173/order/success
PAYOS_CANCEL_URL=http://localhost:5173/cart
```

Replace the existing `localhost:3000` PayOS examples.

- [ ] **Step 6: Verify and commit BE CORS**

Run:

```powershell
& 'C:\Program Files\Go\bin\go.exe' test ./internal/shared/cors ./internal/config ./cmd/api
& 'C:\Program Files\Go\bin\go.exe' test ./...
```

Expected: all tests pass.

Commit:

```powershell
git add internal/config/config.go internal/config/config_test.go internal/shared/cors/middleware.go internal/shared/cors/middleware_test.go cmd/api/main.go .env.example
git commit -m "feat: add configurable cors middleware"
```

---

### Task 3: Build Shared FE Contracts, Token Storage, And API Client

**Files:**
- Create: `D:\CHRIS\WW\frontend-app\src\shared\api\contracts.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\shared\api\tokenStorage.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\shared\api\tokenStorage.test.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\shared\api\apiClient.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\shared\api\apiClient.test.ts`

- [ ] **Step 1: Define shared contracts**

Create these exported shapes:

```ts
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_more: boolean;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: string;
};

export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}
```

- [ ] **Step 2: Add failing token-storage tests**

Cover these cases in `tokenStorage.test.ts`:

- `saveTokens(tokens, true)` writes local storage and clears session storage.
- `saveTokens(tokens, false)` writes session storage and clears local storage.
- `readTokens()` reads local first, then session.
- `clearTokens()` clears both locations.

Use one JSON key in each storage:

```text
wearwhere.auth.tokens
```

Run:

```powershell
npm test -- src/shared/api/tokenStorage.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement token storage**

Export:

```ts
export function saveTokens(tokens: AuthTokens, rememberMe: boolean): void
export function readTokens(): AuthTokens | null
export function clearTokens(): void
```

Guard malformed stored JSON by clearing both stores and returning `null`.

- [ ] **Step 4: Add failing API-client tests**

In `apiClient.test.ts`, mock `global.fetch` and cover:

- Base URL and JSON `Content-Type`.
- Bearer header from stored access token.
- A `204` response returns `undefined`.
- Backend error envelope becomes `ApiError(status, code, message, details)`.
- One `401` calls `POST /auth/refresh`, saves returned `{ tokens }`, and retries the original request once.
- Two concurrent `401` responses share one refresh request.
- Refresh failure clears tokens and invokes the registered unauthorized callback once.
- `/auth/login`, `/auth/register`, and `/auth/refresh` are never recursively refreshed.

Run:

```powershell
npm test -- src/shared/api/apiClient.test.ts
```

Expected: FAIL because the client does not exist.

- [ ] **Step 5: Implement the API client**

Expose:

```ts
export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

export function setUnauthorizedHandler(handler: (() => void) | null): void
export async function apiRequest<T>(path: string, options?: ApiRequestOptions): Promise<T>
```

Implementation requirements:

- Join the base URL and paths without duplicate slashes.
- Serialize non-`undefined` bodies as JSON.
- Parse JSON only when the response contains a body.
- Keep `let refreshPromise: Promise<AuthTokens> | null = null` at module scope.
- Refresh with the stored refresh token at `/auth/refresh`.
- Save refreshed tokens in the same persistence mode as the existing tokens. Add `readTokenPersistence(): 'local' | 'session' | null` to `tokenStorage.ts` for this.
- Retry each original request no more than once.
- Hide raw non-envelope server bodies behind `ApiError(status, 'HTTP_ERROR', response.statusText)`.

- [ ] **Step 6: Verify shared API foundation**

Run:

```powershell
npm test -- src/shared/api/tokenStorage.test.ts src/shared/api/apiClient.test.ts
npm run build
```

Expected: all tests and build pass.

**FE checkpoint:** shared API foundation is complete.

---

### Task 4: Connect Customer Authentication And Session Restoration

**Files:**
- Create: `D:\CHRIS\WW\frontend-app\src\features\auth\api\contracts.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\features\auth\api\authApi.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\features\auth\api\authApi.test.ts`
- Modify: `D:\CHRIS\WW\frontend-app\src\shared\contexts\AuthContext.tsx`
- Create: `D:\CHRIS\WW\frontend-app\src\shared\contexts\AuthContext.test.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\app\App.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\shared\components\ProtectedRoute.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\shared\components\LoginPromptModal.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\auth\pages\LoginPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\auth\pages\RegisterPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\auth\pages\VerifyEmailPage.tsx`
- Create: `D:\CHRIS\WW\frontend-app\src\features\auth\pages\AuthPages.test.tsx`

- [ ] **Step 1: Define auth contracts and failing API tests**

Define exact FE request/response types for:

```ts
registerCustomer({ name, email, password }): Promise<AuthResponse>
loginCustomer({ email, password }): Promise<AuthResponse>
refreshSession(refresh_token): Promise<{ tokens: AuthTokens }>
logoutCustomer(refresh_token): Promise<void>
getMe(): Promise<{ user: AuthUser }>
sendVerifyEmailOtp(email): Promise<{ message: string }>
verifyEmailOtp(email, otp): Promise<{ message: string }>
```

`AuthUser` must include `id`, optional `email`/`phone`, `name`, `role`, `status`, verification flags, and timestamps returned by BE.

Assert OTP bodies are:

```ts
{ email, purpose: 'verify_email' }
{ email, otp, purpose: 'verify_email' }
```

Run:

```powershell
npm test -- src/features/auth/api/authApi.test.ts
```

Expected: FAIL before implementation, then pass after all functions delegate to `apiRequest`.

- [ ] **Step 2: Add failing AuthContext tests**

Cover:

- No stored tokens: restoration ends with `isLoading=false`, `isLoggedIn=false`.
- Stored tokens: calls `/me` and exposes the customer user.
- Failed restoration: clears tokens and becomes logged out.
- Login stores according to Remember Me and rejects non-customer roles by clearing tokens.
- Registration stores in session storage and exposes the returned user.
- Logout calls BE with refresh token, then clears FE state even when BE logout fails.
- Registered unauthorized callback clears auth state.

Run:

```powershell
npm test -- src/shared/contexts/AuthContext.test.tsx
```

Expected: FAIL with the current boolean-only context.

- [ ] **Step 3: Replace boolean auth state with real session state**

Expose from `AuthContext`:

```ts
user: AuthUser | null
role: string | null
isLoggedIn: boolean
isLoading: boolean
login(input: LoginRequest, rememberMe: boolean): Promise<AuthUser>
register(input: RegisterRequest): Promise<AuthUser>
logout(): Promise<void>
restoreSession(): Promise<void>
showLoginPrompt: boolean
promptLogin(redirectPath?: string): void
dismissPrompt(): void
pendingRedirect: string | null
```

Call `restoreSession()` once when `AuthProvider` mounts. Register `setUnauthorizedHandler` on mount and remove it on unmount.

Update `ProtectedRoute` so it renders a neutral loading container while `isLoading=true`; prompt only after restoration completes and the user is logged out.

- [ ] **Step 4: Add failing auth-page behavior tests**

Cover:

- Login submits email/password/Remember Me and navigates to the validated `redirect` query value or `/`.
- Brand/admin choices remain visible but are disabled and labeled `Chưa hỗ trợ`.
- Demo credentials block is removed.
- Google/Facebook controls remain visible but disabled and labeled `Chưa hỗ trợ`.
- Registration enforces backend password rule: at least 8 characters, one number, and one special character.
- Registration calls context `register`, then navigates to `/verify-email` with the registered email in route state.
- Verification page accepts six digits, verifies, resends, and shows request errors without leaving the page.
- Protected-route prompts open without a router-context error, and the Sign In link carries the original internal route in a `redirect` query parameter.
- Login accepts only redirect values beginning with one `/` and rejects protocol-relative or external redirect values.

- [ ] **Step 5: Integrate the auth pages**

Preserve current page structure and styling. Replace fake login/register handlers with awaited context calls, disable submit during requests, and show `ApiError.message` with `toast.error`.

Verification email source order:

1. `location.state.email`
2. `AuthContext.user.email`

If neither exists, render a message and a link back to `/login`; do not send an empty OTP request.

- [ ] **Step 6: Put global providers inside BrowserRouter and preserve safe redirects**

Change `App.tsx` so `BrowserRouter` wraps `AppProviders`. This places `LoginPromptModal`, its `Link` controls, and all children under the router context.

Update `ProtectedRoute` to call:

```ts
promptLogin(location.pathname + location.search);
```

Update `LoginPromptModal` so its Sign In link points to `/login?redirect=...` when `pendingRedirect` exists. `LoginPage` reads that query value after successful login and navigates only when it matches:

```ts
redirect.startsWith('/') && !redirect.startsWith('//')
```

Otherwise it navigates to `/`.

- [ ] **Step 7: Verify auth slice**

Run:

```powershell
npm test -- src/features/auth/api/authApi.test.ts src/shared/contexts/AuthContext.test.tsx src/features/auth/pages/AuthPages.test.tsx
npm run build
```

Expected: all pass.

**FE checkpoint:** customer auth, OTP, refresh, logout, and protected-route restoration are connected.

---

### Task 5: Create Public Catalog API Contracts And Query Mapping

**Files:**
- Create: `D:\CHRIS\WW\frontend-app\src\features\shop\api\contracts.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\features\shop\api\catalogApi.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\features\shop\api\catalogApi.test.ts`

- [ ] **Step 1: Add failing catalog API tests**

Cover:

- `listProducts` serializes `q`, `category`, `brand`, repeated `style`, repeated `size`, repeated `color`, `price_min`, `price_max`, `sort`, `page`, and `limit`.
- Undefined/empty values are omitted.
- `getProductById` calls `/products/by-id/{id}`.
- `listCategories` and `listStyleTags` consume `{ items }`.
- `listBrands` serializes `q`, `sort`, `page`, `limit`.
- `getBrand` consumes `{ brand, addresses }`.

Run:

```powershell
npm test -- src/features/shop/api/catalogApi.test.ts
```

Expected: FAIL before implementation.

- [ ] **Step 2: Define backend-accurate catalog contracts**

Include:

```ts
ProductSummary
ProductDetail
ProductVariant
ProductImage
CategoryRef
StyleTagRef
BrandSummary
BrandAddress
ProductListResponse
BrandListResponse
BrandDetailResponse
```

Important mappings:

- Product IDs and variant IDs are `string`.
- `primary_image`, `description`, logos, banners, and addresses may be absent.
- Product summary prices are `number`; cart price strings are defined later in account contracts.
- Product detail uses `variants`, `images`, `category`, and `style_tags`.
- Brand response does not contain ratings, followers, founded year, styles, or categories.

- [ ] **Step 3: Implement catalog functions**

Export:

```ts
listProducts(query: ProductListQuery): Promise<ProductListResponse>
getProductById(id: string): Promise<{ product: ProductDetail }>
listCategories(): Promise<{ items: CategoryRef[] }>
listStyleTags(): Promise<{ items: StyleTagRef[] }>
listBrands(query: BrandListQuery): Promise<BrandListResponse>
getBrand(slug: string): Promise<BrandDetailResponse>
```

- [ ] **Step 4: Verify catalog API**

Run:

```powershell
npm test -- src/features/shop/api/catalogApi.test.ts
npm run build
```

Expected: all pass.

**FE checkpoint:** public catalog API contracts are ready for page integration.

---

### Task 6: Replace Catalog Page Mock Data

**Files:**
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\ShopPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\SearchResultsPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\StylePage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\AllBrandsPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\BrandStorefrontPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\ProductDetailPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\shared\components\Header.tsx`
- Create: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\CatalogPages.test.tsx`

- [ ] **Step 1: Add focused failing page tests**

Mock `catalogApi` and verify:

- Shop renders API products, VND prices, loading, empty, and retryable error states.
- Shop loads category/style filter options from BE, sends the active category/style/size/color/price/sort/page filters, and uses returned pagination.
- Search reads `q` from `useSearchParams` and renders backend suggestions when present.
- Style sends the route `slug` as `style: [slug]`.
- Brand list renders backend brands without fabricated metrics.
- Brand storefront loads brand detail and products using `brand: slug`.
- Product detail loads route UUID, displays backend images/description/variants, and disables unavailable variants.

- [ ] **Step 2: Integrate Shop, Search, And Style pages**

Replace mock imports with `catalogApi`. Preserve current cards and filters, with these exact mappings:

| Existing UI concept | Backend value |
|---|---|
| Product link | `/product/${product.id}` |
| Product image | `product.primary_image` or existing image fallback component |
| Price | `formatVND(product.min_price)`; show a range when `max_price > min_price` |
| Stock | disable product action when `in_stock=false` |
| Category filter | category slug |
| Style filter | repeated style slug |
| Sort | only `relevance`, `newest`, `popular`, `price_asc`, `price_desc` |
| Pagination | `response.pagination` |

Across Shop, Search, Style, and Brand Storefront cards, render only fields present in `ProductSummary`: image, name, brand, price/range, and stock state. Remove fabricated ratings, like counts, sale percentages, color swatches, seller metrics, and review counts.

Replace the imported mock price ranges with VND query ranges:

```ts
[
  { label: 'Dưới 1.250.000₫', min: 0, max: 1250000 },
  { label: '1.250.000₫ - 2.500.000₫', min: 1250000, max: 2500000 },
  { label: '2.500.000₫ - 5.000.000₫', min: 2500000, max: 5000000 },
  { label: '5.000.000₫ - 12.500.000₫', min: 5000000, max: 12500000 },
  { label: 'Trên 12.500.000₫', min: 12500000, max: undefined },
]
```

Map existing sort controls exactly:

```text
newest -> newest
popular -> popular
price-low -> price_asc
price-high -> price_desc
rating -> disabled, Chưa hỗ trợ
```

Remove unsupported `sale=true` behavior from data requests. In `Header.tsx`, keep the Sale navigation control visible but make it a disabled button marked `Chưa hỗ trợ`, because BE has no sale query.

- [ ] **Step 3: Integrate brand pages**

AllBrands:

- Use `/brands`.
- Search maps to `q`.
- Brand sort sends only `a-z` or `newest`.
- Remove or disable verified/rating/follower filters because the public brand response does not provide those fields.

BrandStorefront:

- Load detail from `/brands/:slug`.
- Load products from `/products?brand=:slug`.
- Render story/logo/banner/website/public addresses only when present.
- Hide fabricated rating/follower/founded/style/category metrics.
- Keep unsupported follow control visible but disabled with `Chưa hỗ trợ`.

- [ ] **Step 4: Integrate product detail**

Use `getProductById(id)`. Replace numeric/mock assumptions:

- Gallery uses sorted backend `images`.
- Price comes from the selected active variant, or the active-variant min/max range before selection.
- Render color and size controls from active variants.
- A selectable combination maps to one backend variant UUID.
- Disable combinations with `stock_qty=0`.
- Clamp quantity to `1..min(10, selectedVariant.stock_qty)`.
- Hide mock ratings/reviews/recommendations or label them unsupported; do not render fabricated values.
- Leave wishlist/cart mutation handlers ready for Tasks 8 and 9, but do not fake success.

- [ ] **Step 5: Verify catalog pages**

Run:

```powershell
npm test -- src/features/shop/pages/CatalogPages.test.tsx
npm run build
```

Expected: all pass and the six integrated pages no longer import `mockData`.

Run:

```powershell
rg -n "shared/data/mockData|\$|USD" src/features/shop/pages/ShopPage.tsx src/features/shop/pages/SearchResultsPage.tsx src/features/shop/pages/StylePage.tsx src/features/shop/pages/AllBrandsPage.tsx src/features/shop/pages/BrandStorefrontPage.tsx src/features/shop/pages/ProductDetailPage.tsx
```

Expected: no mock-data imports and no USD rendering in integrated catalog content.

**FE checkpoint:** public catalog pages consume BE data.

---

### Task 7: Connect Wishlist And Product Wishlist Controls

**Files:**
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\api\wishlistApi.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\api\wishlistApi.test.ts`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\WishlistPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\ShopPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\SearchResultsPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\StylePage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\BrandStorefrontPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\ProductDetailPage.tsx`
- Create: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\WishlistIntegration.test.tsx`

- [ ] **Step 1: Add failing wishlist API tests**

Export and test:

```ts
listWishlist(page: number, limit: number): Promise<WishlistListResponse>
getWishlistContains(productIds: string[]): Promise<{ in_wishlist: Record<string, boolean> }>
addWishlistProduct(productId: string): Promise<void>
removeWishlistProduct(productId: string): Promise<void>
```

Assert `getWishlistContains` sends repeated `product_ids`.

- [ ] **Step 2: Implement wishlist API**

Use:

```text
GET    /me/wishlist
GET    /me/wishlist/contains
POST   /me/wishlist/:product_id
DELETE /me/wishlist/:product_id
```

Define wishlist item fields exactly as returned by BE: product UUID/name/slug/image/min price/brand/added timestamp.

- [ ] **Step 3: Replace WishlistPage mock state**

Render BE items and pagination. Product links use `/product/${product_id}`. Render `min_price` as VND. On removal:

1. Save the prior item list.
2. Optimistically remove the item.
3. Call BE.
4. Restore the prior list and toast the API error if the request fails.

- [ ] **Step 4: Connect visible product heart controls**

For authenticated customers, query `contains` for only the currently visible product UUIDs. On toggle, perform optimistic update with rollback. For logged-out users, call `promptLogin(location.pathname + location.search)` instead of sending a request.

- [ ] **Step 5: Verify wishlist slice**

Run:

```powershell
npm test -- src/features/account/api/wishlistApi.test.ts src/features/shop/pages/WishlistIntegration.test.tsx
npm run build
```

Expected: all pass; `WishlistPage.tsx` no longer imports mock data.

**FE checkpoint:** wishlist list and toggles use BE.

---

### Task 8: Connect Cart And Add-To-Cart

**Files:**
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\api\cartApi.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\api\cartApi.test.ts`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\ProductDetailPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\CartCheckoutPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\shared\components\Header.tsx`
- Create: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\CartIntegration.test.tsx`

- [ ] **Step 1: Add failing cart API tests**

Export and test:

```ts
getCart(): Promise<CartResponse>
addCartItem(variantId: string, qty: number): Promise<{ id: string; qty: number }>
updateCartItem(itemId: string, qty: number): Promise<{ id: string; qty: number }>
removeCartItem(itemId: string): Promise<void>
clearCart(): Promise<void>
```

Assert request bodies use `variant_id` and `qty`.

- [ ] **Step 2: Define and implement cart contracts**

Mirror BE `CartResponse`, including:

- String price fields.
- `price_changed`.
- `unavailable` and optional reason.
- Nested variant, product, and brand.
- Summary item/quantity counts, current totals, and availability flags.

- [ ] **Step 3: Connect ProductDetail add-to-cart**

Require an authenticated customer and a selected available variant UUID. Call `addCartItem(selectedVariant.id, quantity)`. Disable the button during the request. On success, show a toast and allow navigation to `/cart`; on failure, show the backend error and do not mutate local fake state.

- [ ] **Step 4: Replace the cart step in CartCheckoutPage**

Remove hard-coded cart items and local total calculations. On load, call `getCart()`. Render:

- Item image/name/brand/variant label.
- `current_price`, `subtotal_current`, and summary `total_current` using `formatVND`.
- Price-change and unavailable warnings from BE.
- Quantity controls clamped to `1..10` and variant stock.
- Update/remove/clear operations followed by `getCart()` to refresh authoritative totals.

Keep shipping/payment steps in place for Task 12, but do not allow progressing when the cart is empty or has unavailable items.

- [ ] **Step 5: Replace the hard-coded header cart badge**

When logged in, load `getCart()` and display `summary.total_qty`. Hide the badge when zero. Refresh it after login, route changes to/from `/cart`, and a `wearwhere:cart-updated` browser event.

Dispatch that event after successful add/update/remove/clear operations:

```ts
window.dispatchEvent(new Event('wearwhere:cart-updated'));
```

Do not introduce a global cart store in this milestone.

- [ ] **Step 6: Verify cart slice**

Run:

```powershell
npm test -- src/features/account/api/cartApi.test.ts src/features/shop/pages/CartIntegration.test.tsx
npm run build
```

Expected: all pass; cart page has no numeric mock IDs, USD totals, or fake cart alerts.

**FE checkpoint:** product add-to-cart and cart management use BE.

---

### Task 9: Connect Customer Address CRUD

**Files:**
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\api\addressApi.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\api\addressApi.test.ts`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\account\pages\AddressBookPage.tsx`
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\pages\AddressBookPage.test.tsx`

- [ ] **Step 1: Add failing address API tests**

Export and test:

```ts
listAddresses(): Promise<{ items: CustomerAddress[] }>
createAddress(input: CreateAddressRequest): Promise<CustomerAddress>
updateAddress(id: string, input: UpdateAddressRequest): Promise<CustomerAddress>
deleteAddress(id: string): Promise<void>
```

Assert create sends:

```ts
{
  label,
  recipient_name,
  recipient_phone,
  address_line,
  ward,
  district,
  city,
  country,
  postal_code,
  note,
  is_default,
}
```

- [ ] **Step 2: Replace AddressBookPage mock state**

Preserve the cards/dialog styling. Add or relabel fields needed by BE:

- Label.
- Recipient name.
- E.164 recipient phone, with a visible example such as `+84901234567`.
- Address line.
- Ward.
- District.
- City.
- Two-letter country code, default `VN`.
- Optional postal code and note.
- Default-address checkbox.

Load, create, update, and delete via `addressApi`; refresh the list after mutations. Render loading, empty, and retryable error states. Show backend validation errors without creating local fake addresses.

- [ ] **Step 3: Verify address slice**

Run:

```powershell
npm test -- src/features/account/api/addressApi.test.ts src/features/account/pages/AddressBookPage.test.tsx
npm run build
```

Expected: all pass; `AddressBookPage.tsx` no longer imports `accountMockData`.

**FE checkpoint:** customer address CRUD uses BE.

---

### Task 10: Normalize Backend Checkout And Order Errors

**Files:**
- Modify: `D:\CHRIS\WW\backend-services\internal\order\handler\handler.go`
- Create: `D:\CHRIS\WW\backend-services\internal\order\handler\errors.go`
- Create: `D:\CHRIS\WW\backend-services\internal\order\handler\errors_test.go`

- [ ] **Step 1: Add failing pure error-mapping tests**

Create a package-private helper:

```go
func writeOrderError(c *gin.Context, err error)
```

Test its JSON status/code/details mapping for:

| Domain error | HTTP | Code | Details |
|---|---:|---|---|
| `ErrCartEmpty` | 400 | `CART_EMPTY` | none |
| `ErrMinOrderValue` | 400 | `MIN_ORDER_VALUE` | `min_value_vnd` |
| `ErrAddressNotFound` | 404 | `ADDRESS_NOT_FOUND` | none |
| `ErrInsufficientStock` | 409 | `INSUFFICIENT_STOCK` | `reason: "Refresh cart and retry"` |
| `ErrVariantUnavailable` | 422 | `VARIANT_UNAVAILABLE` | `reason: "Refresh cart and retry"` |
| `ErrInvalidPaymentMethod` | 400 | `INVALID_PAYMENT_METHOD` | none |
| `ErrPayosLinkCreate` | 502 | `PAYOS_UNAVAILABLE` | none |
| `ErrOrderNotFound` | 404 | `ORDER_NOT_FOUND` | none |
| cancellation errors | 409 | `CANCEL_NOT_ALLOWED` | `subcode` |
| unknown error | 500 | `INTERNAL_ERROR` | none |

Assert unknown/internal responses do not expose `err.Error()`.

Run:

```powershell
& 'C:\Program Files\Go\bin\go.exe' test ./internal/order/handler
```

Expected: FAIL before helper implementation.

- [ ] **Step 2: Implement error mapping with `pkg/httpx`**

Use `httpx.Error` and `httpx.ErrorWithDetails`. Update handler-local validation/auth failures:

```text
UNAUTHORIZED
INVALID_ADDRESS_ID
INVALID_BODY
```

Replace every flat `gin.H{"error": ...}` order response with the shared envelope. Route service errors through `writeOrderError`.

- [ ] **Step 3: Verify and commit BE order errors**

Run:

```powershell
& 'C:\Program Files\Go\bin\go.exe' test ./internal/order/handler
& 'C:\Program Files\Go\bin\go.exe' test ./...
```

Expected: all pass.

Commit:

```powershell
git add internal/order/handler/handler.go internal/order/handler/errors.go internal/order/handler/errors_test.go
git commit -m "fix: normalize customer order api errors"
```

---

### Task 11: Create Checkout And Order FE APIs

**Files:**
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\api\orderApi.ts`
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\api\orderApi.test.ts`

- [ ] **Step 1: Add failing order API tests**

Export and test:

```ts
previewCheckout(addressId: string): Promise<CheckoutPreview>
placeOrder(input: PlaceOrderRequest): Promise<PlaceOrderResponse>
listOrders(query: OrderListQuery): Promise<OrderListResponse>
getOrder(orderNo: string): Promise<Order>
cancelOrder(orderNo: string, reason: string): Promise<Order>
```

Assert:

- Preview sends `address_id`.
- Placement supports only `payment_method: 'cod' | 'payos'`.
- List serializes `status`, `from`, `to`, `page`, and `page_size`.
- Detail/cancel use `order_no`, not UUID.

- [ ] **Step 2: Define BE-accurate checkout/order contracts**

Mirror:

```text
CheckoutPreviewResp
CheckoutPreviewSubOrder
CheckoutPreviewItem
PlaceOrderResp
PaymentResp
OrderListResp
OrderListItem
OrderResp
SubOrderResp
OrderItemResp
ShippingAddress
```

Use root order statuses:

```ts
'pending_payment' | 'processing' | 'cancelled' | 'completed'
```

Use sub-order statuses:

```ts
'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
```

- [ ] **Step 3: Implement and verify order API**

Run:

```powershell
npm test -- src/features/account/api/orderApi.test.ts
npm run build
```

Expected: all pass.

**FE checkpoint:** checkout and order APIs are ready for pages.

---

### Task 12: Connect Checkout Preview And Order Placement

**Files:**
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\CartCheckoutPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\app\routes\AppRoutes.tsx`
- Create: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\CheckoutIntegration.test.tsx`

- [ ] **Step 1: Add failing checkout page tests**

Cover:

- Shipping step loads existing addresses and selects the default address first.
- Continuing with no address is blocked with a link to `/account/addresses`.
- Selecting an address calls `previewCheckout(address.id)`.
- Preview renders backend sub-orders, warnings, shipping, and grand total.
- Card, PayPal, and voucher controls remain visible but disabled with `Chưa hỗ trợ`.
- COD placement navigates to `/order/success?orderNo={order_no}`.
- PayOS placement assigns `window.location.href` to `payment.checkout_url`.
- Missing PayOS checkout URL shows an error and does not navigate.
- Duplicate placement is prevented while submitting.

- [ ] **Step 2: Replace local shipping form and computed totals**

Use `addressApi.listAddresses()` rather than collecting a second temporary checkout address. Keep the shipping-step layout, but render selectable saved address cards and an Add/Edit Address link.

After selecting an address, call `previewCheckout`. Render only:

- `preview.sub_orders`.
- `preview.subtotal_vnd`.
- `preview.shipping_total_vnd`.
- `preview.grand_total_vnd`.
- `preview.warnings`.
- `preview.meets_min_order`.

Disable order placement when `cart_empty`, `!meets_min_order`, or `warnings.length > 0`. The current BE warnings are emitted only for unavailable or low-stock variants.

- [ ] **Step 3: Restrict payments and place orders**

Supported controls:

```text
COD
PayOS
```

Unsupported controls remain visible and disabled:

```text
Card - Chưa hỗ trợ
PayPal - Chưa hỗ trợ
Voucher - Chưa hỗ trợ
```

Place:

```ts
await placeOrder({
  address_id: selectedAddressId,
  payment_method: selectedPaymentMethod,
  notes,
});
```

On COD, navigate with `order.order_no`. On PayOS, redirect to `payment.checkout_url`.

- [ ] **Step 4: Confirm route semantics**

Keep `/order/success` protected. No new checkout-cancel route is required; PayOS cancel returns to `/cart`.

- [ ] **Step 5: Verify checkout slice**

Run:

```powershell
npm test -- src/features/shop/pages/CheckoutIntegration.test.tsx
npm run build
```

Expected: all pass and `CartCheckoutPage.tsx` has no USD, fake voucher, or card validation flow.

Run:

```powershell
rg -n "SAVE10|paymentMethod: 'card'|PayPal|\\$" src/features/shop/pages/CartCheckoutPage.tsx
```

Expected: PayPal may appear only in disabled unsupported UI; the fake voucher and USD calculations are absent.

**FE checkpoint:** address selection, preview, COD, and PayOS placement use BE.

---

### Task 13: Connect Customer Order List, Detail, Success, And Cancellation

**Files:**
- Modify: `D:\CHRIS\WW\frontend-app\src\features\account\pages\MyOrdersPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\account\pages\OrderDetailPage.tsx`
- Modify: `D:\CHRIS\WW\frontend-app\src\features\shop\pages\OrderSuccessPage.tsx`
- Create: `D:\CHRIS\WW\frontend-app\src\features\account\pages\OrdersIntegration.test.tsx`

- [ ] **Step 1: Add failing order-page tests**

Cover:

- Order list loads backend `data`, renders VND, and uses `order_no` in links.
- Status tabs send only BE root statuses.
- Pagination comes from `page`, `page_size`, `total`, and `total_pages`.
- Order detail loads route `:id` as `order_no`.
- Detail flattens `sub_orders[].items` for the existing item section while preserving brand/sub-order status labels.
- Cancellation submits a reason, refreshes the order, and handles `CANCEL_NOT_ALLOWED`.
- Order success reads `orderNo` from query parameters and loads the real order.
- Missing `orderNo` renders a clear error and links to `/account/orders`.
- Return and Buy Again controls remain visible but disabled with `Chưa hỗ trợ`.

- [ ] **Step 2: Replace MyOrdersPage mock data**

Use `listOrders`. Map tabs:

```text
All -> no status query
Pending payment -> pending_payment
Processing -> processing
Completed -> completed
Cancelled -> cancelled
```

Render BE summary fields and `formatVND(grand_total_vnd)`. Do not render fabricated per-item data because list response contains only first item summary/counts.

- [ ] **Step 3: Replace OrderDetailPage mock data**

Use `getOrder(orderNo)`. Render:

- Root order and payment statuses.
- Shipping address snapshot.
- Each sub-order with brand, status, tracking number, items, shipping fee, and total.
- Root totals and timestamps.

Show cancellation only when the root status is neither `cancelled` nor `completed`, every sub-order status is `pending`, and the order is not a paid PayOS order. Submit an optional reason through `cancelOrder`, then reload detail. BE remains authoritative and may still return `CANCEL_NOT_ALLOWED`.

Disable return and buy-again controls; those APIs are outside scope.

- [ ] **Step 4: Replace OrderSuccessPage mock data**

Read:

```ts
const orderNo = new URLSearchParams(location.search).get('orderNo');
```

Load `getOrder(orderNo)`, then render the same backend order summary and links to order detail/list. Remove mock recommendations from this page because they are unrelated to order success and currently depend on mock products.

- [ ] **Step 5: Verify order pages**

Run:

```powershell
npm test -- src/features/account/pages/OrdersIntegration.test.tsx
npm run build
```

Expected: all pass.

Run:

```powershell
rg -n "shared/data/accountMockData|shared/data/mockData|\\$|USD" src/features/account/pages/MyOrdersPage.tsx src/features/account/pages/OrderDetailPage.tsx src/features/shop/pages/OrderSuccessPage.tsx
```

Expected: no mock imports or USD rendering.

**FE checkpoint:** order list/detail/success/cancel use BE.

---

### Task 14: Run Full Verification And Update The Integration Issue

**Files:**
- Modify only when verification exposes a scoped defect.
- Update: `D:\CHRIS\WW\frontend-app\README.md`
- Update: `D:\CHRIS\WW\backend-services\README.md` only if its local run instructions do not already cover required services/environment.

- [ ] **Step 1: Document local integration startup**

Add FE instructions:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Document BE requirements:

```text
PostgreSQL and Redis running
CORS_ALLOWED_ORIGINS includes the actual Vite origin
PAYOS_RETURN_URL=http://localhost:5173/order/success
PAYOS_CANCEL_URL=http://localhost:5173/cart
```

- [ ] **Step 2: Run all FE automated checks**

Run:

```powershell
npm test
npm run build
```

Expected: all FE tests pass and production build exits `0`.

- [ ] **Step 3: Run all BE automated checks**

Run:

```powershell
& 'C:\Program Files\Go\bin\go.exe' test ./...
$env:TEST_DATABASE_URL='postgres://wearwhere:wearwhere@localhost:5432/wearwhere_test?sslmode=disable'
& 'C:\Program Files\Go\bin\go.exe' test -p 1 ./... -tags=integration
```

Expected: all BE unit and integration-tag tests pass.

Do not claim race-test coverage on this machine while CGO is disabled.

- [ ] **Step 4: Verify browser CORS preflight**

With BE running on port `8080`, run:

```powershell
$headers = @{
  Origin = 'http://localhost:5173'
  'Access-Control-Request-Method' = 'POST'
  'Access-Control-Request-Headers' = 'authorization,content-type'
}
Invoke-WebRequest -Method Options -Uri 'http://localhost:8080/api/v1/auth/login' -Headers $headers
```

Expected: status `204` and `Access-Control-Allow-Origin` equals `http://localhost:5173`.

- [ ] **Step 5: Run the complete manual customer journey**

Start BE and FE, then verify in this order:

1. Register an email customer with a strong password.
2. Submit or resend a six-digit verification OTP.
3. Reload and confirm session restoration.
4. Browse Shop, Search, Style, Brands, Brand Storefront, and Product Detail.
5. Add/remove wishlist items.
6. Select an available product variant and add it to cart.
7. Update quantity and remove/re-add a cart item.
8. Create/edit a valid `VN` customer address with an E.164 phone.
9. Preview checkout and place a COD order.
10. Open success, list, and detail pages for the COD order.
11. Place a PayOS mock order, open the returned mock checkout URL, simulate the webhook, copy the returned `order.order_no`, and open `/order/success` with that value in the `orderNo` query parameter.
12. Cancel an eligible order and confirm the refreshed status.
13. Log out and confirm protected routes prompt for login.
14. Force an API failure and confirm the page shows an error rather than mock data.

- [ ] **Step 6: Check integrated pages for remaining fake behavior**

Run:

```powershell
rg -n "shared/data/mockData|shared/data/accountMockData|adminAuth|brandAuth|SAVE10|Order placed successfully|Added .* to cart|\\$|USD" src/features/auth src/features/shop/pages/ShopPage.tsx src/features/shop/pages/SearchResultsPage.tsx src/features/shop/pages/StylePage.tsx src/features/shop/pages/AllBrandsPage.tsx src/features/shop/pages/BrandStorefrontPage.tsx src/features/shop/pages/ProductDetailPage.tsx src/features/shop/pages/WishlistPage.tsx src/features/shop/pages/CartCheckoutPage.tsx src/features/shop/pages/OrderSuccessPage.tsx src/features/account/pages/AddressBookPage.tsx src/features/account/pages/MyOrdersPage.tsx src/features/account/pages/OrderDetailPage.tsx
```

Expected: no mock imports, fake auth flags, fake voucher/order/cart success, or USD rendering in integrated flows. Any matches must be disabled unsupported labels or unrelated static copy reviewed explicitly.

- [ ] **Step 7: Review BE status and update the issue**

Run from BE:

```powershell
git status --short
bd update wearwhere_be-xi4 --notes "Customer shopping milestone verified end to end. Admin and brand FE integration remain outside the approved customer milestone."
bd sync
```

Expected:

- Only intended BE changes are present or already committed.
- Issue `wearwhere_be-xi4` remains open while its existing admin/brand acceptance criteria are unmet. Close it only after those criteria are removed through an approved scope change or implemented in a separate milestone.

## Final Acceptance Checklist

- [ ] Configured FE origins pass BE preflight.
- [ ] FE API base URL is configurable.
- [ ] Customer register/login/OTP/restore/refresh/logout use BE.
- [ ] Concurrent `401` responses perform one refresh request.
- [ ] Catalog, brand, wishlist, cart, address, checkout, and order pages use BE data.
- [ ] Integrated pages use UUIDs and VND.
- [ ] Checkout uses only COD or PayOS.
- [ ] Card, PayPal, voucher, returns, follow, social login, brand login, and admin login cannot submit.
- [ ] API failures never substitute mock data.
- [ ] FE tests and production build pass.
- [ ] BE unit and integration-tag tests pass.
- [ ] Complete manual customer journey passes.
