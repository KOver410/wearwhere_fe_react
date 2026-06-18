# Frontend Source Organization Design

Date: 2026-06-03
Project: WearWhere frontend app
Stack: Vite, React, React Router

## Goal

Reorganize the frontend source code imported from Figma into a maintainable application structure while preserving the current UI and behavior.

The refactor must not intentionally change rendered screens, route paths, mock data values, visual styling, or interaction behavior.

## Current State

- The app uses Vite and React.
- `src/app/App.tsx` owns providers, layout decisions, route declarations, and all page imports.
- Pages are partially grouped by domain under `src/app/pages`, but top-level pages and shared components are still mixed.
- Shared components, UI primitives, Figma fallback utilities, contexts, mock data, and utilities live under `src/app`.
- Figma-generated assets remain in `src/assets` with hash-like filenames.
- The workspace is not currently a git repository, so design/spec commits cannot be created in this environment.

## Chosen Approach

Use a feature/domain organization while keeping page internals and UI behavior unchanged.

The refactor will move ownership boundaries, route definitions, providers, and shared modules into clearer folders. It will not redesign components or rewrite page JSX beyond import path updates required by file moves.

## Target Structure

```text
src/
  app/
    App.tsx
    layouts/
      PublicLayout.tsx
    providers/
      AppProviders.tsx
    routes/
      AppRoutes.tsx
  features/
    account/
      pages/
    admin/
      pages/
    auth/
      pages/
    brand/
      pages/
    marketing/
      pages/
    onboarding/
      pages/
    ootd/
      pages/
    shop/
      pages/
    stores/
      pages/
    wardrobe/
      pages/
  shared/
    components/
    contexts/
    data/
    i18n/
    ui/
    utils/
  assets/
  imports/
  styles/
```

Notes:

- `src/assets` and `src/imports` stay in place to avoid breaking Figma-generated image and SVG references.
- Existing UI primitives from `src/app/components/ui` move to `src/shared/ui`.
- Broadly reused app components such as `Header`, `Footer`, `ProtectedRoute`, `ProductCard`, and `AccountLayout` move to `src/shared/components`.
- Contexts and i18n move to `src/shared/contexts` and `src/shared/i18n`.
- Mock data moves to `src/shared/data`.
- Utilities move to `src/shared/utils`.

## Routing Design

`src/app/App.tsx` becomes the application composition entry point.

Responsibilities:

- Render `AppProviders`.
- Render `BrowserRouter`.
- Render `ScrollToTop`.
- Render the top-level public layout and route tree.

`src/app/routes/AppRoutes.tsx` owns all route declarations currently inside `App.tsx`.

Route paths and protection behavior must remain unchanged:

- Public routes stay public.
- Routes currently wrapped in `ProtectedRoute` remain wrapped.
- Brand and admin nested layouts remain nested routes.
- Auth, onboarding, brand, and admin pages continue to hide the public `Header` and `Footer`.

## Layout Design

`src/app/layouts/PublicLayout.tsx` owns the existing layout behavior from `Layout` in `App.tsx`.

It preserves:

- Current `Header` and `Footer` visibility logic.
- Existing background style for public pages.
- Existing `main` layout.
- Existing brand/admin white background behavior.

## Provider Design

`src/app/providers/AppProviders.tsx` wraps application-level providers and global components:

- `LanguageProvider`
- `AuthProvider`
- `Toaster`
- `LoginPromptModal`

The provider order remains the same as the current implementation.

## Import Strategy

Use the existing Vite alias `@` that points to `src`.

New imports should prefer:

- `@/features/...`
- `@/shared/components/...`
- `@/shared/ui/...`
- `@/shared/data/...`
- `@/shared/i18n/...`
- `@/shared/contexts/...`
- `@/shared/utils/...`

Compatibility barrel files may be added only if needed to reduce churn, but the preferred outcome is direct imports from the new structure.

## Non-Goals

- No UI redesign.
- No route path changes.
- No mock data content changes.
- No asset renaming in this pass.
- No dependency changes unless required to make the existing build work.
- No conversion to Next.js, Redux, or a new state-management pattern.
- No test framework setup unless the repo already has one available.

## Verification

After implementation:

1. Install dependencies if `node_modules` is missing.
2. Run `npm run build`.
3. Fix import/path errors introduced by the refactor.
4. If the build fails due to a pre-existing unrelated issue, document the exact error and stop without changing unrelated behavior.

Optional visual verification can be done by running `npm run dev` and manually checking representative routes:

- `/`
- `/shop`
- `/login`
- `/account/profile`
- `/brand/dashboard`
- `/admin/dashboard`

## Risks

- Large file moves can introduce broken imports.
- Case-sensitive import mismatches may be hidden on Windows but fail in CI on Linux.
- Some Figma-generated files may rely on unusual relative paths.

Mitigation:

- Move files by domain in controlled batches.
- Update imports with search-based checks.
- Run the production build before completion.
