# Customer Shopping Backend Integration Design

Date: 2026-06-04
Projects:
- Frontend: `D:\CHRIS\WW\frontend-app`
- Backend: `D:\CHRIS\WW\backend-services`

## Goal

Integrate the existing customer shopping frontend with the real WearWhere backend APIs while preserving the current page layouts and styling.

The milestone covers authentication, catalog browsing, wishlist, cart, customer addresses, checkout, and customer orders. API failures must be visible; the frontend must not fall back to mock behavior.

## Current State

### Frontend

- Vite, React, React Router, and feature-oriented source folders.
- Customer pages currently use mock data and local component state.
- There is no shared API client, configurable API base URL, or backend contract layer.
- Authentication only toggles in-memory state or local storage flags.
- Checkout uses numeric IDs, USD values, and unsupported card/PayPal options.

### Backend

- Go and Gin API under `/api/v1`.
- Supports auth, public catalog, brands, wishlist, cart, customer addresses, checkout, and customer orders.
- Uses UUID identifiers and VND amounts.
- Supports COD and PayOS payments.
- Returns access and refresh tokens in JSON.
- Does not currently handle browser CORS preflight requests.

## Scope

### Included

- Customer email registration, login, session restoration, refresh, and logout.
- Email verification OTP flow after registration.
- Public product, category, style tag, and brand browsing.
- Product detail.
- Customer wishlist.
- Customer cart.
- Customer address book.
- Checkout preview and order placement using COD or PayOS.
- Customer order list, detail, and cancellation.
- Configurable backend CORS policy.
- Loading, empty, validation, authorization, and network error states.

### Excluded

- Admin portal integration.
- Brand portal integration.
- Returns.
- OOTD and social features.
- Wardrobe features.
- Analytics.
- Voucher application.
- Stored payment cards and PayPal.
- UI redesign.

Unsupported customer features remain visible where already present, but their controls are disabled and labeled as not yet supported.

## Chosen Approach

Implement vertical slices following the customer journey:

1. Shared API foundation and authentication.
2. Public catalog and product detail.
3. Wishlist and cart.
4. Customer addresses and checkout.
5. Customer orders.

Each slice includes API contracts, frontend integration, loading and error handling, and focused verification before moving to the next slice.

This approach exposes usable progress early and limits the number of unverified contracts introduced at once.

## Frontend Architecture

### Shared API Layer

Create `src/shared/api` with:

- `apiClient.ts`
  - Builds requests from a configurable API base URL.
  - Sends and receives JSON for the customer-shopping endpoints in this milestone.
  - Attaches the current Bearer access token.
  - Parses backend error envelopes.
  - On an eligible `401`, performs one refresh attempt and retries the original request once.
  - Uses one shared in-flight refresh promise so concurrent `401` responses do not rotate the refresh token multiple times.
  - Clears the session when refresh fails.

- `tokenStorage.ts`
  - Stores access and refresh tokens in `localStorage` when "Remember me" is selected.
  - Stores tokens in `sessionStorage` otherwise.
  - Ensures only one storage location is active.
  - Exposes read, write, and clear operations without leaking storage details to consumers.

- `contracts.ts`
  - Defines shared backend error and pagination shapes.
  - Defines an `ApiError` representation suitable for form and toast handling.

The frontend reads the API base URL from `VITE_API_BASE_URL`, with a documented local default of `http://localhost:8080/api/v1`.

### Feature-Owned API Modules

API functions and feature-specific contracts live with their owning feature:

- `src/features/auth/api`
- `src/features/shop/api`
- `src/features/account/api`

Page components consume these feature APIs instead of calling `fetch` directly.

No generic endpoint registry or unused API functions are built ahead of the slice that needs them.

### Authentication State

`AuthContext` becomes the source of truth for the authenticated customer:

- `user`
- `role`
- `isLoggedIn`
- `isLoading`
- `login`
- `register`
- `logout`
- `restoreSession`

At app startup:

1. Read stored tokens.
2. If no access token exists, finish unauthenticated.
3. Call `GET /api/v1/me`.
4. If the access token is expired, allow the API client to refresh once.
5. If restoration fails, clear the stored session.

Protected customer routes wait for restoration before deciding whether to prompt for login.

## Backend CORS Design

Add a configurable Gin CORS middleware before API routes.

Configuration uses an environment variable containing an explicit comma-separated allowlist, for example:

```text
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

The middleware:

- Handles `OPTIONS` preflight requests.
- Allows configured origins only.
- Allows `Authorization` and `Content-Type` headers.
- Allows methods required by the API: `GET`, `POST`, `PATCH`, `DELETE`, and `OPTIONS`.
- Does not enable credentialed cookie requests because authentication uses Bearer tokens.

Production origins must be explicitly configured; wildcard origins are not used.

## Customer Data Flows

### Registration and Verification

1. Submit `name`, email, and password to `/auth/register`.
2. Store returned tokens using the selected persistence mode.
3. Set the returned user in `AuthContext`.
4. Navigate to the existing verification page.
5. Verification page accepts a six-digit OTP and submits `/auth/otp/verify` with purpose `verify_email`.
6. The customer remains authenticated and may use the application before verification completes.

Resend uses `/auth/otp/send` with purpose `verify_email`.

### Login and Logout

- Customer login uses `/auth/login`.
- This milestone does not integrate brand or admin login.
- Existing brand and admin role options on the shared login page remain visible but disabled and labeled "Chưa hỗ trợ".
- Successful login stores tokens and user data.
- Logout calls `/auth/logout` with the refresh token, then clears local session state even if the network call fails.

### Catalog

- Shop page loads products from `/products`.
- Category and style filters load from `/categories` and `/style-tags`.
- Brand listing and storefront load from `/brands` and `/brands/:brand_slug`.
- Product detail uses `/products/by-id/:id` or the brand/product slug endpoint where appropriate.
- Existing UI filter values are translated into backend query parameters.
- Server pagination is the source of truth.

When the API returns no results, the existing layout displays an empty state rather than mock products.

### Wishlist

- Load from `/me/wishlist`.
- Add with `POST /me/wishlist/:product_id`.
- Remove with `DELETE /me/wishlist/:product_id`.
- Product listing pages may use `/me/wishlist/contains` to initialize wishlist state for visible products.

Wishlist operations require a valid customer session. Failed mutations restore the previous visible state and display an error.

### Cart

- Load from `/me/cart`.
- Add using a selected backend variant UUID.
- Update quantities with `PATCH /me/cart/items/:item_id`.
- Remove items with `DELETE /me/cart/items/:item_id`.
- Clear with `DELETE /me/cart`.

Backend totals, current prices, availability, and price-change flags are authoritative. FE does not calculate final totals independently.

### Addresses

- Address book loads and mutates `/me/addresses`.
- Forms map to the backend fields: recipient name, E.164 phone, address line, ward, district, city, country code, postal code, note, and default status.
- Existing UI remains, with fields added or relabeled only where required to satisfy the backend contract.

### Checkout

1. Customer selects an existing address.
2. FE requests `/me/checkout/preview?address_id=<uuid>`.
3. Preview response supplies sub-orders, warnings, shipping, and VND totals.
4. FE displays only the backend-calculated totals.
5. Customer submits `/me/orders` with address UUID, `cod` or `payos`, and optional notes.
6. COD success navigates to the order success/detail flow.
7. PayOS success redirects to the returned `checkout_url`.

Existing card, PayPal, and voucher controls remain visible but disabled and labeled "Chưa hỗ trợ".

### Orders

- Order list loads from `/me/orders`.
- Detail loads from `/me/orders/:order_no`.
- Cancellation posts to `/me/orders/:order_no/cancel`.
- List filters map to backend-supported status, date, and pagination query parameters.
- Order numbers, statuses, totals, sub-orders, and timelines are rendered from backend data.

Return-related controls remain disabled because returns are outside this milestone.

## Error Handling

### Request States

Every data-driven page distinguishes:

- Initial loading.
- Loaded with data.
- Loaded empty.
- Recoverable API error.

Mutating controls are disabled while their request is in progress to prevent duplicate submissions.

### Error Rules

- Backend validation errors are displayed near the relevant form when a field mapping is available.
- Network and unexpected server errors use a toast with a retry action where practical.
- `401` triggers one refresh attempt. A repeated `401` clears the session and prompts login.
- `403` displays an insufficient-permission message.
- `404` uses an appropriate missing-resource state.
- Failed optimistic wishlist or cart mutations restore prior visible state.
- No request failure substitutes mock data.

## UI Preservation

- Existing routes, layouts, typography, colors, and page composition remain unchanged.
- Mock datasets are removed only when the corresponding page is connected to a real API.
- Necessary loading, empty, error, disabled, and unsupported states reuse existing UI primitives.
- UI adjustments are limited to fields or labels required by backend contracts.

## Testing Strategy

### Frontend Focused Tests

Add Vitest, React Testing Library, and `jsdom` as the frontend test setup for API, context, and focused page behavior.

Cover:

- Token storage persistence selection and cleanup.
- API client Bearer headers, error parsing, refresh retry, and refresh failure.
- Auth registration, login, restoration, and logout.
- Catalog loading, filters, pagination, empty state, and product detail.
- Wishlist add/remove rollback behavior.
- Cart loading and mutations.
- Address form contract mapping.
- Checkout preview and COD/PayOS placement.
- Order list, detail, and cancellation.

### Backend Tests

Add focused middleware tests covering:

- Allowed-origin preflight.
- Rejected origin.
- Allowed headers and methods.
- Normal API response includes CORS headers for an allowed origin.

Existing backend unit and integration tests remain required.

### End-to-End Verification

With PostgreSQL, Redis, BE, and FE running:

1. Register a customer.
2. Enter or resend verification OTP.
3. Reload and confirm session restoration.
4. Browse catalog and open a product.
5. Add a variant to wishlist and cart.
6. Create an address.
7. Preview checkout and place a COD order.
8. Place or simulate a PayOS order in mock mode.
9. View order list and detail.
10. Cancel an eligible order.
11. Log out and confirm protected routes prompt for login.

## Delivery Sequence

### Slice 1: API Foundation and Auth

- Configurable API URL.
- Token storage.
- Shared API client and error handling.
- BE CORS.
- Register, OTP verification/resend, login, restore, refresh, logout.
- Protected customer route behavior.

### Slice 2: Catalog

- Products, categories, style tags, brands, storefront, and product detail.
- Server filters and pagination.

### Slice 3: Wishlist and Cart

- Wishlist list and mutations.
- Cart list and mutations.
- Variant selection and backend totals.

### Slice 4: Addresses and Checkout

- Address CRUD.
- Checkout preview.
- COD and PayOS order placement.
- Unsupported payment/voucher states.

### Slice 5: Orders

- List, detail, filters, and cancellation.
- Disable unsupported returns actions.

## Acceptance Criteria

- Browser requests from configured FE origins pass CORS preflight.
- FE has a configurable backend API base URL.
- Customer auth uses real backend tokens and survives reload according to "Remember me".
- Access token expiration refreshes once without duplicating concurrent refresh work.
- Customer catalog, wishlist, cart, addresses, checkout, and orders use backend data.
- Checkout uses UUIDs, VND totals, and only COD or PayOS.
- API failures are visible and never replaced by mock data.
- Unsupported customer features remain visible but cannot submit.
- Current customer shopping layouts and styling remain materially unchanged.
- FE production build passes.
- BE unit and integration tests pass.
- The documented end-to-end customer journey succeeds against the running backend.

## Risks and Mitigations

- **Large mock-to-API transition:** deliver and verify one vertical slice at a time.
- **Token refresh races:** use a single shared in-flight refresh promise.
- **Existing pages assume incompatible data shapes:** isolate mapping functions inside feature API modules.
- **Backend has limited catalog seed data:** preserve correct empty states and use controlled development seeds for E2E checks.
- **Frontend currently lacks a test framework:** add only the minimum test tooling required for this milestone.
- **Frontend workspace is not a Git repository:** write and verify the spec locally; no frontend spec commit is possible until Git is initialized or the workspace is attached to a repository.
