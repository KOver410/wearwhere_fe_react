# Project Instructions — WearWhere Frontend

Fashion e-commerce + social (OOTD) + smart-wardrobe SPA. Talks to a separate Go
backend (`backend-services`) over a REST API at `/api/v1`.

## Tech Stack
- **Vite 6 + React 18 + TypeScript** SPA — NOT Next.js (ignore any auto-detection
  that says otherwise). No SSR.
- Routing: `react-router` v7 (`BrowserRouter`, central route table).
- Styling: Tailwind CSS v4 + shadcn/Radix UI primitives. MUI/Emotion also present.
- State: jotai + React Context. Forms: react-hook-form.
- Testing: Vitest + Testing Library + jsdom.
- No `tsconfig.json`, no lint config, no CI in this repo.

## Build & Run
- Dev: `npm run dev` (http://localhost:5173 — copy `.env.example` → `.env.local` first)
- Test: `npm test` (`vitest run`); watch: `npm run test:watch`
- Build: `npm run build` (→ `dist/`)
- Requires the Go backend on `:8080` (Postgres + Redis) for integrated flows — see `README.md`.

## Project Structure
- `src/app/` — shell: `App.tsx`, `providers/`, `layouts/`, `routes/AppRoutes.tsx` (the single route table).
- `src/features/<domain>/` — `shop`, `account`, `auth`, `ootd`, `wardrobe`, `stores`,
  `onboarding`, `brand`, `admin`. Each has `pages/` and, when it calls the backend, `api/` + `hooks/`.
- `src/shared/` — `ui/` (shadcn components), `components/`, `api/` (HTTP client),
  `contexts/` (Auth), `i18n/`, `data/` (mocks), `utils/`.
- `guidelines/Guidelines.md` — the WearWhere design style guide.

## Code Style
- Use the `@/` import alias (= `src/`); avoid deep relative paths.
- File naming by layer:
  - Pages/components → `PascalCase.tsx` (`HomePage.tsx`, `ProductCard.tsx`)
  - Feature api/hooks/utils → `camelCase.ts` (`authApi.ts`, `useWishlistToggle.ts`)
  - shadcn primitives in `shared/ui/` → `kebab-case.tsx` (`button.tsx`)
- Follow existing patterns over introducing new libraries.

## Backend / API Conventions
- All HTTP goes through `apiRequest<T>(path, opts)` in `src/shared/api/apiClient.ts`.
  It attaches the JWT, auto-refreshes on 401, and retries once. Do not bypass it with raw `fetch`.
- Each `features/<x>/api/` folder pairs `xApi.ts` (functions) with `contracts.ts`
  (types + hand-rolled `assert*`/`is*` validators — **no zod**). Mirror this for new endpoints.
- Validate every response with a contract assertion; surface failures as `ApiError`.

## Adding a Page
1. Create `features/<domain>/pages/XxxPage.tsx`.
2. Register the `<Route>` in `src/app/routes/AppRoutes.tsx`.
3. Wrap authenticated routes in `<ProtectedRoute>`.

## Testing
- Colocate tests as `*.test.ts(x)` next to source.
- Integration tests: `features/*/pages/*Integration.test.tsx`. Global setup: `src/test/setup.ts`.
- Run the full suite with `npm test` before claiming a change works.

## Design
- Follow `guidelines/Guidelines.md`: minimal black/white, Arimo font, 10px button
  radius, subtle shadows, no gradients. Reuse `shared/ui/` components.
