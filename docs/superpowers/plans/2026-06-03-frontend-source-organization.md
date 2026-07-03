# Frontend Source Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the Figma-imported React frontend into app, feature, and shared source boundaries without changing UI or runtime behavior.

**Architecture:** Keep `src/app` focused on composition, layout, providers, and routes. Move route-owned pages into `src/features/<domain>/pages`, and move reused components, UI primitives, data, contexts, i18n, and utilities into `src/shared`. Keep `src/assets`, `src/imports`, and existing page internals unchanged except for import paths.

**Tech Stack:** Vite 6, React 18, React Router 7, Tailwind 4, Radix/shadcn-style UI components, PowerShell on Windows.

---

## File Structure

Create:

- `src/app/providers/AppProviders.tsx`: wraps app-level providers and global components in the existing order.
- `src/app/layouts/PublicLayout.tsx`: owns the existing header/footer visibility and public background behavior.
- `src/app/routes/AppRoutes.tsx`: owns all route declarations moved from `src/app/App.tsx`.

Modify:

- `src/app/App.tsx`: reduce to router composition.
- All moved `.tsx` and `.ts` files under `src/features` and `src/shared`: update imports only.

Move:

- `src/app/components/ui/*` -> `src/shared/ui/*`
- `src/app/components/figma/*` -> `src/shared/components/figma/*`
- `src/app/components/auth/*` -> `src/shared/components/auth/*`
- `src/app/components/*.tsx` -> `src/shared/components/*.tsx`
- `src/app/contexts/*` -> `src/shared/contexts/*`
- `src/app/i18n/*` -> `src/shared/i18n/*`
- `src/app/data/*` -> `src/shared/data/*`
- `src/app/utils/*` -> `src/shared/utils/*`
- `src/app/pages/account/*` -> `src/features/account/pages/*`
- `src/app/pages/admin/*` -> `src/features/admin/pages/*`
- `src/app/pages/auth/*` -> `src/features/auth/pages/*`
- `src/app/pages/brand/*` -> `src/features/brand/pages/*`
- `src/app/pages/onboarding/*` -> `src/features/onboarding/pages/*`
- `src/app/pages/ootd/*` -> `src/features/ootd/pages/*`
- `src/app/pages/stores/*` -> `src/features/stores/pages/*`
- `src/app/pages/wardrobe/*` -> `src/features/wardrobe/pages/*`
- Top-level commerce/content pages in `src/app/pages/*.tsx` -> `src/features/shop/pages/*`

Leave unchanged:

- `src/assets/*`
- `src/imports/*`
- `src/styles/*`
- `src/main.tsx`
- `vite.config.ts`
- `package.json`

Because `D:\CHRIS\WW\frontend-app` is not currently a git repository, commit steps are not available. Use build and search checkpoints instead.

---

### Task 1: Create App Shell Files

**Files:**

- Create: `src/app/providers/AppProviders.tsx`
- Create: `src/app/layouts/PublicLayout.tsx`
- Create: `src/app/routes/AppRoutes.tsx`
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Create `AppProviders.tsx`**

Use this exact provider order:

```tsx
import { type ReactNode } from 'react';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { LanguageProvider } from '@/shared/i18n/LanguageContext';
import { LoginPromptModal } from '@/shared/components/LoginPromptModal';
import { Toaster } from '@/shared/ui/sonner';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <AuthProvider>
        {children}
        <Toaster />
        <LoginPromptModal />
      </AuthProvider>
    </LanguageProvider>
  );
}
```

- [ ] **Step 2: Create `PublicLayout.tsx`**

Move the current `Layout` function from `src/app/App.tsx` into this file, keeping the boolean logic and inline styles unchanged:

```tsx
import { useLocation } from 'react-router';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { AppRoutes } from '@/app/routes/AppRoutes';

export function PublicLayout() {
  const location = useLocation();
  const isAuthOrOnboarding =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/forgot-password') ||
    location.pathname.startsWith('/reset-password') ||
    location.pathname.startsWith('/verify-email') ||
    location.pathname.startsWith('/email-verified') ||
    location.pathname.startsWith('/onboarding') ||
    (location.pathname.startsWith('/brand/') || location.pathname === '/brand') ||
    location.pathname.startsWith('/admin');

  const isBrandOrAdmin =
    (location.pathname.startsWith('/brand/') || location.pathname === '/brand') ||
    location.pathname.startsWith('/admin');

  return (
    <div
      className={`min-h-screen flex flex-col ${isBrandOrAdmin ? 'bg-white' : ''}`}
      style={!isBrandOrAdmin ? { backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" } : {}}
    >
      {!isAuthOrOnboarding && <Header />}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!isAuthOrOnboarding && <Footer />}
    </div>
  );
}
```

- [ ] **Step 3: Create `AppRoutes.tsx`**

Move the existing `<Routes>` block from `src/app/App.tsx` into this component. Import pages from their future feature paths and shared components from their future shared paths:

```tsx
import { Routes, Route } from 'react-router';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { HomePage } from '@/features/shop/pages/HomePage';
import { AboutPage } from '@/features/shop/pages/AboutPage';
import { HowItWorksPage } from '@/features/shop/pages/HowItWorksPage';
import { PartnerPage } from '@/features/shop/pages/PartnerPage';
import { CartCheckoutPage } from '@/features/shop/pages/CartCheckoutPage';
import { ProductDetailPage } from '@/features/shop/pages/ProductDetailPage';
import { ShopPage } from '@/features/shop/pages/ShopPage';
import { SearchResultsPage } from '@/features/shop/pages/SearchResultsPage';
import { StylePage } from '@/features/shop/pages/StylePage';
import { AllBrandsPage } from '@/features/shop/pages/AllBrandsPage';
import { BrandStorefrontPage } from '@/features/shop/pages/BrandStorefrontPage';
import { WishlistPage } from '@/features/shop/pages/WishlistPage';
import { OrderSuccessPage } from '@/features/shop/pages/OrderSuccessPage';
import { VouchersPage } from '@/features/shop/pages/VouchersPage';
import { NotificationsPage } from '@/features/shop/pages/NotificationsPage';
import { ProfilePage } from '@/features/account/pages/ProfilePage';
import { MyOrdersPage } from '@/features/account/pages/MyOrdersPage';
import { OrderDetailPage } from '@/features/account/pages/OrderDetailPage';
import { ReturnRequestPage } from '@/features/account/pages/ReturnRequestPage';
import { MyReturnsPage } from '@/features/account/pages/MyReturnsPage';
import { AddressBookPage } from '@/features/account/pages/AddressBookPage';
import { PaymentMethodsPage } from '@/features/account/pages/PaymentMethodsPage';
import { SettingsPage } from '@/features/account/pages/SettingsPage';
import { MyOOTDsPage } from '@/features/account/pages/MyOOTDsPage';
import { OOTDFeedPage } from '@/features/ootd/pages/OOTDFeedPage';
import { OOTDDetailPage } from '@/features/ootd/pages/OOTDDetailPage';
import { OOTDCreatePage } from '@/features/ootd/pages/OOTDCreatePage';
import { UserPublicProfilePage } from '@/features/ootd/pages/UserPublicProfilePage';
import { MyWardrobePage } from '@/features/wardrobe/pages/MyWardrobePage';
import { WardrobeAddPage } from '@/features/wardrobe/pages/WardrobeAddPage';
import { OutfitBuilderPage } from '@/features/wardrobe/pages/OutfitBuilderPage';
import { StyleSuggestionsPage } from '@/features/wardrobe/pages/StyleSuggestionsPage';
import { StoreLocatorPage } from '@/features/stores/pages/StoreLocatorPage';
import { StoreDetailPage } from '@/features/stores/pages/StoreDetailPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { EmailVerifiedPage } from '@/features/auth/pages/EmailVerifiedPage';
import { OnboardingStylePage } from '@/features/onboarding/pages/OnboardingStylePage';
import { OnboardingPricePage } from '@/features/onboarding/pages/OnboardingPricePage';
import { OnboardingSizeLocationPage } from '@/features/onboarding/pages/OnboardingSizeLocationPage';
import { OnboardingCompletePage } from '@/features/onboarding/pages/OnboardingCompletePage';
import { BrandLayout } from '@/features/brand/pages/BrandLayout';
import { BrandDashboardPage } from '@/features/brand/pages/BrandDashboardPage';
import { BrandSalesPage } from '@/features/brand/pages/BrandSalesPage';
import { BrandTrafficPage } from '@/features/brand/pages/BrandTrafficPage';
import { BrandProfilePage } from '@/features/brand/pages/BrandProfilePage';
import { BrandLocationsPage } from '@/features/brand/pages/BrandLocationsPage';
import { BrandLocationFormPage } from '@/features/brand/pages/BrandLocationFormPage';
import BrandProductsPage from '@/features/brand/pages/products/BrandProductsPage';
import BrandProductFormPage from '@/features/brand/pages/products/BrandProductFormPage';
import BrandCategoriesPage from '@/features/brand/pages/products/BrandCategoriesPage';
import BrandOrdersPage from '@/features/brand/pages/orders/BrandOrdersPage';
import BrandOrderDetailPage from '@/features/brand/pages/orders/BrandOrderDetailPage';
import BrandReturnsPage from '@/features/brand/pages/returns/BrandReturnsPage';
import BrandReturnDetailPage from '@/features/brand/pages/returns/BrandReturnDetailPage';
import BrandSettingsPage from '@/features/brand/pages/settings/BrandSettingsPage';
import AdminLayout from '@/features/admin/pages/AdminLayout';
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import AdminMonitorPage from '@/features/admin/pages/AdminMonitorPage';
import AdminUsersPage from '@/features/admin/pages/users/AdminUsersPage';
import AdminUserDetailPage from '@/features/admin/pages/users/AdminUserDetailPage';
import AdminDeletedAccountsPage from '@/features/admin/pages/users/AdminDeletedAccountsPage';
import AdminProductsPage from '@/features/admin/pages/products/AdminProductsPage';
import AdminReportedProductsPage from '@/features/admin/pages/products/AdminReportedProductsPage';
import AdminCategoriesPage from '@/features/admin/pages/products/AdminCategoriesPage';
import AdminStyleTagsPage from '@/features/admin/pages/products/AdminStyleTagsPage';
import AdminBrandsPage from '@/features/admin/pages/brands/AdminBrandsPage';
import AdminBrandApplicationsPage from '@/features/admin/pages/brands/AdminBrandApplicationsPage';
import AdminReviewApplicationPage from '@/features/admin/pages/brands/AdminReviewApplicationPage';
import AdminBrandDetailPage from '@/features/admin/pages/brands/AdminBrandDetailPage';
import AdminBrandSubscriptionsPage from '@/features/admin/pages/brands/AdminBrandSubscriptionsPage';
import AdminVerifyBrandPage from '@/features/admin/pages/brands/AdminVerifyBrandPage';
import AdminSuspendBrandPage from '@/features/admin/pages/brands/AdminSuspendBrandPage';
import AdminModerationQueuePage from '@/features/admin/pages/moderation/AdminModerationQueuePage';
import AdminReviewReportedOOTDPage from '@/features/admin/pages/moderation/AdminReviewReportedOOTDPage';
import AdminAutoFilterSettingsPage from '@/features/admin/pages/moderation/AdminAutoFilterSettingsPage';
import AdminKeywordBlacklistPage from '@/features/admin/pages/moderation/AdminKeywordBlacklistPage';
import AdminAllOrdersPage from '@/features/admin/pages/orders/AdminAllOrdersPage';
import AdminOrderDetailPage from '@/features/admin/pages/orders/AdminOrderDetailPage';
import AdminDisputesPage from '@/features/admin/pages/orders/AdminDisputesPage';
import AdminResolveDisputePage from '@/features/admin/pages/orders/AdminResolveDisputePage';
import AdminRefundManagementPage from '@/features/admin/pages/orders/AdminRefundManagementPage';
import AdminPlatformPromotionsPage from '@/features/admin/pages/marketing/AdminPlatformPromotionsPage';
import AdminCreateVoucherPage from '@/features/admin/pages/marketing/AdminCreateVoucherPage';
import AdminPushNotificationsPage from '@/features/admin/pages/marketing/AdminPushNotificationsPage';
import AdminEmailCampaignsPage from '@/features/admin/pages/marketing/AdminEmailCampaignsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/partner" element={<PartnerPage />} />
      <Route path="/cart" element={<ProtectedRoute><CartCheckoutPage /></ProtectedRoute>} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/style/:slug" element={<StylePage />} />
      <Route path="/brands" element={<AllBrandsPage />} />
      <Route path="/brands/:slug" element={<BrandStorefrontPage />} />
      <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
      <Route path="/order/success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
      <Route path="/account/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/account/orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
      <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
      <Route path="/account/orders/:id/return" element={<ProtectedRoute><ReturnRequestPage /></ProtectedRoute>} />
      <Route path="/account/returns" element={<ProtectedRoute><MyReturnsPage /></ProtectedRoute>} />
      <Route path="/account/vouchers" element={<ProtectedRoute><VouchersPage /></ProtectedRoute>} />
      <Route path="/account/addresses" element={<ProtectedRoute><AddressBookPage /></ProtectedRoute>} />
      <Route path="/account/payments" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
      <Route path="/account/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/account/ootd" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/ootd" element={<OOTDFeedPage />} />
      <Route path="/ootd/create" element={<ProtectedRoute><OOTDCreatePage /></ProtectedRoute>} />
      <Route path="/ootd/:id" element={<OOTDDetailPage />} />
      <Route path="/user/:username" element={<UserPublicProfilePage />} />
      <Route path="/account/wardrobe" element={<ProtectedRoute><MyWardrobePage /></ProtectedRoute>} />
      <Route path="/account/wardrobe/add" element={<ProtectedRoute><WardrobeAddPage /></ProtectedRoute>} />
      <Route path="/account/wardrobe/outfit-builder" element={<ProtectedRoute><OutfitBuilderPage /></ProtectedRoute>} />
      <Route path="/account/wardrobe/suggestions" element={<ProtectedRoute><StyleSuggestionsPage /></ProtectedRoute>} />
      <Route path="/stores" element={<StoreLocatorPage />} />
      <Route path="/stores/:slug" element={<StoreDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/email-verified" element={<EmailVerifiedPage />} />
      <Route path="/onboarding/style" element={<OnboardingStylePage />} />
      <Route path="/onboarding/price" element={<OnboardingPricePage />} />
      <Route path="/onboarding/size-location" element={<OnboardingSizeLocationPage />} />
      <Route path="/onboarding/complete" element={<OnboardingCompletePage />} />
      <Route path="/brand" element={<BrandLayout />}>
        <Route path="dashboard" element={<BrandDashboardPage />} />
        <Route path="sales" element={<BrandSalesPage />} />
        <Route path="traffic" element={<BrandTrafficPage />} />
        <Route path="profile" element={<BrandProfilePage />} />
        <Route path="locations" element={<BrandLocationsPage />} />
        <Route path="locations/new" element={<BrandLocationFormPage />} />
        <Route path="locations/:id" element={<BrandLocationFormPage />} />
        <Route path="products" element={<BrandProductsPage />} />
        <Route path="products/new" element={<BrandProductFormPage />} />
        <Route path="products/:id/edit" element={<BrandProductFormPage />} />
        <Route path="products/categories" element={<BrandCategoriesPage />} />
        <Route path="orders" element={<BrandOrdersPage />} />
        <Route path="orders/:id" element={<BrandOrderDetailPage />} />
        <Route path="returns" element={<BrandReturnsPage />} />
        <Route path="returns/:id" element={<BrandReturnDetailPage />} />
        <Route path="settings" element={<BrandSettingsPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="monitor" element={<AdminMonitorPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:id" element={<AdminUserDetailPage />} />
        <Route path="users/deleted" element={<AdminDeletedAccountsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/reported" element={<AdminReportedProductsPage />} />
        <Route path="products/categories" element={<AdminCategoriesPage />} />
        <Route path="products/style-tags" element={<AdminStyleTagsPage />} />
        <Route path="brands" element={<AdminBrandsPage />} />
        <Route path="brands/applications" element={<AdminBrandApplicationsPage />} />
        <Route path="brands/applications/:id" element={<AdminReviewApplicationPage />} />
        <Route path="brands/subscriptions" element={<AdminBrandSubscriptionsPage />} />
        <Route path="brands/:id" element={<AdminBrandDetailPage />} />
        <Route path="brands/:id/verify" element={<AdminVerifyBrandPage />} />
        <Route path="brands/:id/suspend" element={<AdminSuspendBrandPage />} />
        <Route path="moderation" element={<AdminModerationQueuePage />} />
        <Route path="moderation/ootd/:id" element={<AdminReviewReportedOOTDPage />} />
        <Route path="moderation/settings" element={<AdminAutoFilterSettingsPage />} />
        <Route path="moderation/keywords" element={<AdminKeywordBlacklistPage />} />
        <Route path="moderation/keyword-blacklist" element={<AdminKeywordBlacklistPage />} />
        <Route path="orders" element={<AdminAllOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="orders/disputes" element={<AdminDisputesPage />} />
        <Route path="orders/disputes/:id" element={<AdminResolveDisputePage />} />
        <Route path="orders/refunds" element={<AdminRefundManagementPage />} />
        <Route path="marketing" element={<AdminPlatformPromotionsPage />} />
        <Route path="marketing/promotions" element={<AdminPlatformPromotionsPage />} />
        <Route path="marketing/vouchers/create" element={<AdminCreateVoucherPage />} />
        <Route path="marketing/push-notifications" element={<AdminPushNotificationsPage />} />
        <Route path="marketing/email-campaigns" element={<AdminEmailCampaignsPage />} />
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 4: Replace `App.tsx`**

Use this exact shell:

```tsx
import { BrowserRouter, useLocation } from 'react-router';
import { useLayoutEffect } from 'react';
import { AppProviders } from '@/app/providers/AppProviders';
import { PublicLayout } from '@/app/layouts/PublicLayout';

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <PublicLayout />
      </BrowserRouter>
    </AppProviders>
  );
}
```

- [ ] **Step 5: Check app shell imports**

Run:

```powershell
rg "@/app/(components|pages|data|contexts|i18n|utils)" src/app
```

Expected at this point: matches may still exist in files that have not moved yet, but `src/app/App.tsx`, `src/app/layouts/PublicLayout.tsx`, `src/app/providers/AppProviders.tsx`, and `src/app/routes/AppRoutes.tsx` should not import from old shared/page paths.

---

### Task 2: Move Shared Modules

**Files:**

- Move: `src/app/components` to `src/shared/components` except `ui` becomes `src/shared/ui`
- Move: `src/app/contexts` to `src/shared/contexts`
- Move: `src/app/i18n` to `src/shared/i18n`
- Move: `src/app/data` to `src/shared/data`
- Move: `src/app/utils` to `src/shared/utils`

- [ ] **Step 1: Create shared directories**

Run:

```powershell
New-Item -ItemType Directory -Force `
  src\shared\components, `
  src\shared\components\auth, `
  src\shared\components\figma, `
  src\shared\ui, `
  src\shared\contexts, `
  src\shared\i18n, `
  src\shared\data, `
  src\shared\utils
```

Expected: directories exist under `src\shared`.

- [ ] **Step 2: Move UI primitives**

Run:

```powershell
Move-Item -LiteralPath src\app\components\ui\* -Destination src\shared\ui
Remove-Item -LiteralPath src\app\components\ui -Force
```

Expected: files such as `button.tsx`, `card.tsx`, `sonner.tsx`, and `utils.ts` exist under `src\shared\ui`.

- [ ] **Step 3: Move nested shared component folders**

Run:

```powershell
Move-Item -LiteralPath src\app\components\auth\* -Destination src\shared\components\auth
Move-Item -LiteralPath src\app\components\figma\* -Destination src\shared\components\figma
Remove-Item -LiteralPath src\app\components\auth -Force
Remove-Item -LiteralPath src\app\components\figma -Force
```

Expected: `AuthLayout.tsx` exists under `src\shared\components\auth`, and `ImageWithFallback.tsx` exists under `src\shared\components\figma`.

- [ ] **Step 4: Move top-level shared components**

Run:

```powershell
Move-Item -LiteralPath src\app\components\*.tsx -Destination src\shared\components
Remove-Item -LiteralPath src\app\components -Force
```

Expected: `Header.tsx`, `Footer.tsx`, `ProtectedRoute.tsx`, `ProductCard.tsx`, and related shared components exist under `src\shared\components`.

- [ ] **Step 5: Move shared app services**

Run:

```powershell
Move-Item -LiteralPath src\app\contexts\* -Destination src\shared\contexts
Move-Item -LiteralPath src\app\i18n\* -Destination src\shared\i18n
Move-Item -LiteralPath src\app\data\* -Destination src\shared\data
Move-Item -LiteralPath src\app\utils\* -Destination src\shared\utils
Remove-Item -LiteralPath src\app\contexts,src\app\i18n,src\app\data,src\app\utils -Force
```

Expected: `AuthContext.tsx`, `LanguageContext.tsx`, mock data files, and `clipboard.ts` exist under `src\shared`.

- [ ] **Step 6: Update shared import prefixes**

Apply mechanical replacements across `src`:

```text
@/app/components/ui/       -> @/shared/ui/
@/app/components/figma/    -> @/shared/components/figma/
@/app/components/auth/     -> @/shared/components/auth/
@/app/components/          -> @/shared/components/
@/app/contexts/            -> @/shared/contexts/
@/app/i18n/                -> @/shared/i18n/
@/app/data/                -> @/shared/data/
@/app/utils/               -> @/shared/utils/
```

Run:

```powershell
rg "@/app/(components|data|contexts|i18n|utils)" src
```

Expected: no matches for old shared paths.

---

### Task 3: Move Feature Pages

**Files:**

- Move: all page files from `src/app/pages` into `src/features/<domain>/pages`
- Modify: imports that point at `@/app/pages/...`

- [ ] **Step 1: Create feature page directories**

Run:

```powershell
New-Item -ItemType Directory -Force `
  src\features\account\pages, `
  src\features\admin\pages, `
  src\features\auth\pages, `
  src\features\brand\pages, `
  src\features\onboarding\pages, `
  src\features\ootd\pages, `
  src\features\shop\pages, `
  src\features\stores\pages, `
  src\features\wardrobe\pages
```

Expected: all listed `src\features\<domain>\pages` directories exist.

- [ ] **Step 2: Move nested page domains**

Run:

```powershell
Move-Item -LiteralPath src\app\pages\account\* -Destination src\features\account\pages
Move-Item -LiteralPath src\app\pages\admin\* -Destination src\features\admin\pages
Move-Item -LiteralPath src\app\pages\auth\* -Destination src\features\auth\pages
Move-Item -LiteralPath src\app\pages\brand\* -Destination src\features\brand\pages
Move-Item -LiteralPath src\app\pages\onboarding\* -Destination src\features\onboarding\pages
Move-Item -LiteralPath src\app\pages\ootd\* -Destination src\features\ootd\pages
Move-Item -LiteralPath src\app\pages\stores\* -Destination src\features\stores\pages
Move-Item -LiteralPath src\app\pages\wardrobe\* -Destination src\features\wardrobe\pages
```

Expected: nested folders such as `products`, `orders`, `brands`, and `marketing` remain under their feature page directory.

- [ ] **Step 3: Move top-level shop/content pages**

Run:

```powershell
Move-Item -LiteralPath src\app\pages\*.tsx -Destination src\features\shop\pages
Remove-Item -LiteralPath src\app\pages -Force
```

Expected: `HomePage.tsx`, `ShopPage.tsx`, `ProductDetailPage.tsx`, `WishlistPage.tsx`, and the other previous top-level page files exist under `src\features\shop\pages`.

- [ ] **Step 4: Update page import prefixes**

Apply these mechanical replacements across `src`:

```text
@/app/pages/account/      -> @/features/account/pages/
@/app/pages/admin/        -> @/features/admin/pages/
@/app/pages/auth/         -> @/features/auth/pages/
@/app/pages/brand/        -> @/features/brand/pages/
@/app/pages/onboarding/   -> @/features/onboarding/pages/
@/app/pages/ootd/         -> @/features/ootd/pages/
@/app/pages/stores/       -> @/features/stores/pages/
@/app/pages/wardrobe/     -> @/features/wardrobe/pages/
@/app/pages/              -> @/features/shop/pages/
```

Run:

```powershell
rg "@/app/pages" src
```

Expected: no matches.

---

### Task 4: Repair Internal Imports After Moves

**Files:**

- Modify: moved files under `src/features` and `src/shared`

- [ ] **Step 1: Check all old app import paths**

Run:

```powershell
rg "@/app/(components|pages|data|contexts|i18n|utils)" src
```

Expected: no matches. Any match should be replaced with the corresponding `@/shared/...` or `@/features/...` path from Tasks 2 and 3.

- [ ] **Step 2: Check relative imports that may have broken due to moves**

Run:

```powershell
rg "from ['\"]\\.\\.?/" src\features src\shared
```

Expected: review each match. Keep relative imports that still point to files in the same folder tree. Replace relative imports that cross feature/shared boundaries with `@/...` aliases.

- [ ] **Step 3: Check references to UI utility path**

Run:

```powershell
rg "@/shared/components/ui|@/app/components/ui|@/shared/ui/utils|@/app/components/ui/utils" src
```

Expected: all UI primitive imports use `@/shared/ui/<component>`. `cn` imports use `@/shared/ui/utils`.

- [ ] **Step 4: Preserve asset and import references**

Run:

```powershell
rg "@/assets|@/imports|\\.\\./\\.\\./assets|\\.\\./imports" src
```

Expected: asset/import references still resolve. Do not rename files under `src\assets` or `src\imports`.

---

### Task 5: Build Verification

**Files:**

- Modify only files needed to fix refactor-introduced import errors.

- [ ] **Step 1: Install dependencies if needed**

Run:

```powershell
if (-not (Test-Path node_modules)) { npm install }
```

Expected: dependencies are present. If install fails due to registry/network issues, capture the exact npm error.

- [ ] **Step 2: Run production build**

Run:

```powershell
npm run build
```

Expected: Vite build completes successfully.

- [ ] **Step 3: Fix refactor import errors**

If build reports a missing module caused by old paths, update the import to the correct path:

```text
Old app shared path  -> @/shared/...
Old app page path    -> @/features/<domain>/pages/...
UI primitive path    -> @/shared/ui/...
```

Run `npm run build` again after each fix batch.

- [ ] **Step 4: Confirm no old folders remain**

Run:

```powershell
Test-Path src\app\components
Test-Path src\app\pages
Test-Path src\app\data
Test-Path src\app\contexts
Test-Path src\app\i18n
Test-Path src\app\utils
```

Expected: all output values are `False`.

- [ ] **Step 5: Confirm target folders exist**

Run:

```powershell
Test-Path src\app\routes
Test-Path src\app\layouts
Test-Path src\app\providers
Test-Path src\features\shop\pages
Test-Path src\features\admin\pages
Test-Path src\features\brand\pages
Test-Path src\shared\components
Test-Path src\shared\ui
Test-Path src\shared\data
```

Expected: all output values are `True`.

---

### Task 6: Optional Dev Server Smoke Check

**Files:**

- No planned file modifications.

- [ ] **Step 1: Start dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 2: Manually smoke-check representative routes**

Open these routes in the browser:

```text
/
/shop
/login
/account/profile
/brand/dashboard
/admin/dashboard
```

Expected: pages render with the same layouts as before the refactor. Auth-protected routes may show the existing login prompt or redirect behavior; do not alter that behavior during this refactor.

---

## Self-Review

Spec coverage:

- Preserves UI and behavior by limiting changes to file moves and import path updates.
- Moves app composition into `src/app` files.
- Moves pages into `src/features/<domain>/pages`.
- Moves shared modules into `src/shared`.
- Leaves Figma assets and imports unchanged.
- Uses build verification as the required acceptance check.

Open item scan:

- The plan contains concrete file responsibilities, move commands, import mappings, route declarations, and verification commands.

Type/path consistency:

- `AppProviders`, `PublicLayout`, and `AppRoutes` imports align with the approved target structure.
- React Router imports remain from `react-router`, matching the current codebase.
