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
import { VouchersPage } from '@/features/account/pages/VouchersPage';
import { ProfilePage } from '@/features/account/pages/ProfilePage';
import { MyOrdersPage } from '@/features/account/pages/MyOrdersPage';
import { OrderDetailPage } from '@/features/account/pages/OrderDetailPage';
import { ReturnRequestPage } from '@/features/account/pages/ReturnRequestPage';
import { MyReturnsPage } from '@/features/account/pages/MyReturnsPage';
import { AddressBookPage } from '@/features/account/pages/AddressBookPage';
import { PaymentMethodsPage } from '@/features/account/pages/PaymentMethodsPage';
import { SettingsPage } from '@/features/account/pages/SettingsPage';
import { NotificationsPage } from '@/features/account/pages/NotificationsPage';
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
import { BrandLoginPage } from '@/features/brand/pages/BrandLoginPage';
import { RequireRole } from '@/shared/components/RequireRole';
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
      {/* Main Pages */}
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

      {/* Account Pages (Phase 3) */}
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

      {/* OOTD / Social Pages (Phase 4) */}
      <Route path="/ootd" element={<OOTDFeedPage />} />
      <Route path="/ootd/create" element={<ProtectedRoute><OOTDCreatePage /></ProtectedRoute>} />
      <Route path="/ootd/:id" element={<OOTDDetailPage />} />
      <Route path="/user/:username" element={<UserPublicProfilePage />} />

      {/* Wardrobe & Store Locator Pages (Phase 5) */}
      <Route path="/account/wardrobe" element={<ProtectedRoute><MyWardrobePage /></ProtectedRoute>} />
      <Route path="/account/wardrobe/add" element={<ProtectedRoute><WardrobeAddPage /></ProtectedRoute>} />
      <Route path="/account/wardrobe/outfit-builder" element={<ProtectedRoute><OutfitBuilderPage /></ProtectedRoute>} />
      <Route path="/account/wardrobe/suggestions" element={<ProtectedRoute><StyleSuggestionsPage /></ProtectedRoute>} />
      <Route path="/stores" element={<StoreLocatorPage />} />
      <Route path="/stores/:slug" element={<StoreDetailPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/email-verified" element={<EmailVerifiedPage />} />

      {/* Onboarding Pages */}
      <Route path="/onboarding/style" element={<OnboardingStylePage />} />
      <Route path="/onboarding/price" element={<OnboardingPricePage />} />
      <Route path="/onboarding/size-location" element={<OnboardingSizeLocationPage />} />
      <Route path="/onboarding/complete" element={<OnboardingCompletePage />} />

      {/* Portal Login Pages */}
      <Route path="/brand/login" element={<BrandLoginPage />} />

      {/* Brand Pages */}
      <Route path="/brand" element={<RequireRole role="brand" loginPath="/brand/login"><BrandLayout /></RequireRole>}>
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

      {/* Admin Pages */}
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
