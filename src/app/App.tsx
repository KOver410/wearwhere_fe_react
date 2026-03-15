import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { useLayoutEffect } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { HomePage } from '@/app/pages/HomePage';
import { AboutPage } from '@/app/pages/AboutPage';
import { HowItWorksPage } from '@/app/pages/HowItWorksPage';
import { PartnerPage } from '@/app/pages/PartnerPage';
import { CartCheckoutPage } from '@/app/pages/CartCheckoutPage';
import { ProductDetailPage } from '@/app/pages/ProductDetailPage';
import { ShopPage } from '@/app/pages/ShopPage';
import { SearchResultsPage } from '@/app/pages/SearchResultsPage';
import { StylePage } from '@/app/pages/StylePage';
import { AllBrandsPage } from '@/app/pages/AllBrandsPage';
import { BrandStorefrontPage } from '@/app/pages/BrandStorefrontPage';
import { WishlistPage } from '@/app/pages/WishlistPage';
import { OrderSuccessPage } from '@/app/pages/OrderSuccessPage';
import { VouchersPage } from '@/app/pages/VouchersPage';
import { ProfilePage } from '@/app/pages/account/ProfilePage';
import { MyOrdersPage } from '@/app/pages/account/MyOrdersPage';
import { OrderDetailPage } from '@/app/pages/account/OrderDetailPage';
import { ReturnRequestPage } from '@/app/pages/account/ReturnRequestPage';
import { MyReturnsPage } from '@/app/pages/account/MyReturnsPage';
import { AddressBookPage } from '@/app/pages/account/AddressBookPage';
import { PaymentMethodsPage } from '@/app/pages/account/PaymentMethodsPage';
import { SettingsPage } from '@/app/pages/account/SettingsPage';
import { NotificationsPage } from '@/app/pages/NotificationsPage';
import { MyOOTDsPage } from '@/app/pages/account/MyOOTDsPage';
import { OOTDFeedPage } from '@/app/pages/ootd/OOTDFeedPage';
import { OOTDDetailPage } from '@/app/pages/ootd/OOTDDetailPage';
import { OOTDCreatePage } from '@/app/pages/ootd/OOTDCreatePage';
import { UserPublicProfilePage } from '@/app/pages/ootd/UserPublicProfilePage';
import { MyWardrobePage } from '@/app/pages/wardrobe/MyWardrobePage';
import { WardrobeAddPage } from '@/app/pages/wardrobe/WardrobeAddPage';
import { OutfitBuilderPage } from '@/app/pages/wardrobe/OutfitBuilderPage';
import { StyleSuggestionsPage } from '@/app/pages/wardrobe/StyleSuggestionsPage';
import { StoreLocatorPage } from '@/app/pages/stores/StoreLocatorPage';
import { StoreDetailPage } from '@/app/pages/stores/StoreDetailPage';
import { LoginPage } from '@/app/pages/auth/LoginPage';
import { RegisterPage } from '@/app/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/app/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/app/pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '@/app/pages/auth/VerifyEmailPage';
import { EmailVerifiedPage } from '@/app/pages/auth/EmailVerifiedPage';
import { OnboardingStylePage } from '@/app/pages/onboarding/OnboardingStylePage';
import { OnboardingPricePage } from '@/app/pages/onboarding/OnboardingPricePage';
import { OnboardingSizeLocationPage } from '@/app/pages/onboarding/OnboardingSizeLocationPage';
import { OnboardingCompletePage } from '@/app/pages/onboarding/OnboardingCompletePage';
import { BrandLayout } from '@/app/pages/brand/BrandLayout';
import { BrandDashboardPage } from '@/app/pages/brand/BrandDashboardPage';
import { BrandSalesPage } from '@/app/pages/brand/BrandSalesPage';
import { BrandTrafficPage } from '@/app/pages/brand/BrandTrafficPage';

import { BrandProfilePage } from '@/app/pages/brand/BrandProfilePage';
import { BrandLocationsPage } from '@/app/pages/brand/BrandLocationsPage';
import { BrandLocationFormPage } from '@/app/pages/brand/BrandLocationFormPage';
import BrandProductsPage from '@/app/pages/brand/products/BrandProductsPage';
import BrandProductFormPage from '@/app/pages/brand/products/BrandProductFormPage';
import BrandCategoriesPage from '@/app/pages/brand/products/BrandCategoriesPage';
import BrandOrdersPage from '@/app/pages/brand/orders/BrandOrdersPage';
import BrandOrderDetailPage from '@/app/pages/brand/orders/BrandOrderDetailPage';
import BrandReturnsPage from '@/app/pages/brand/returns/BrandReturnsPage';
import BrandReturnDetailPage from '@/app/pages/brand/returns/BrandReturnDetailPage';
import BrandSettingsPage from '@/app/pages/brand/settings/BrandSettingsPage';
import AdminLayout from '@/app/pages/admin/AdminLayout';
import AdminDashboardPage from '@/app/pages/admin/AdminDashboardPage';
import AdminMonitorPage from '@/app/pages/admin/AdminMonitorPage';
import AdminUsersPage from '@/app/pages/admin/users/AdminUsersPage';
import AdminUserDetailPage from '@/app/pages/admin/users/AdminUserDetailPage';
import AdminDeletedAccountsPage from '@/app/pages/admin/users/AdminDeletedAccountsPage';
import AdminProductsPage from '@/app/pages/admin/products/AdminProductsPage';
import AdminReportedProductsPage from '@/app/pages/admin/products/AdminReportedProductsPage';
import AdminCategoriesPage from '@/app/pages/admin/products/AdminCategoriesPage';
import AdminStyleTagsPage from '@/app/pages/admin/products/AdminStyleTagsPage';
import AdminBrandsPage from '@/app/pages/admin/brands/AdminBrandsPage';
import AdminBrandApplicationsPage from '@/app/pages/admin/brands/AdminBrandApplicationsPage';
import AdminReviewApplicationPage from '@/app/pages/admin/brands/AdminReviewApplicationPage';
import AdminBrandDetailPage from '@/app/pages/admin/brands/AdminBrandDetailPage';
import AdminBrandSubscriptionsPage from '@/app/pages/admin/brands/AdminBrandSubscriptionsPage';
import AdminVerifyBrandPage from '@/app/pages/admin/brands/AdminVerifyBrandPage';
import AdminSuspendBrandPage from '@/app/pages/admin/brands/AdminSuspendBrandPage';
import AdminModerationQueuePage from '@/app/pages/admin/moderation/AdminModerationQueuePage';
import AdminReviewReportedOOTDPage from '@/app/pages/admin/moderation/AdminReviewReportedOOTDPage';
import AdminAutoFilterSettingsPage from '@/app/pages/admin/moderation/AdminAutoFilterSettingsPage';
import AdminKeywordBlacklistPage from '@/app/pages/admin/moderation/AdminKeywordBlacklistPage';
import AdminAllOrdersPage from '@/app/pages/admin/orders/AdminAllOrdersPage';
import AdminOrderDetailPage from '@/app/pages/admin/orders/AdminOrderDetailPage';
import AdminDisputesPage from '@/app/pages/admin/orders/AdminDisputesPage';
import AdminResolveDisputePage from '@/app/pages/admin/orders/AdminResolveDisputePage';
import AdminRefundManagementPage from '@/app/pages/admin/orders/AdminRefundManagementPage';
import AdminPlatformPromotionsPage from '@/app/pages/admin/marketing/AdminPlatformPromotionsPage';
import AdminCreateVoucherPage from '@/app/pages/admin/marketing/AdminCreateVoucherPage';
import AdminPushNotificationsPage from '@/app/pages/admin/marketing/AdminPushNotificationsPage';
import AdminEmailCampaignsPage from '@/app/pages/admin/marketing/AdminEmailCampaignsPage';
import { Toaster } from '@/app/components/ui/sonner';
import { LanguageProvider } from '@/app/i18n/LanguageContext';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { LoginPromptModal } from '@/app/components/LoginPromptModal';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  const location = useLocation();
  // Hide main Header/Footer on auth and onboarding pages
  const isAuthOrOnboarding = location.pathname.startsWith('/login') || 
                            location.pathname.startsWith('/register') || 
                            location.pathname.startsWith('/forgot-password') || 
                            location.pathname.startsWith('/reset-password') || 
                            location.pathname.startsWith('/verify-email') || 
                            location.pathname.startsWith('/email-verified') || 
                            location.pathname.startsWith('/onboarding') ||
                            (location.pathname.startsWith('/brand/') || location.pathname === '/brand') ||
                            location.pathname.startsWith('/admin');

  const isBrandOrAdmin = (location.pathname.startsWith('/brand/') || location.pathname === '/brand') ||
                          location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col ${isBrandOrAdmin ? 'bg-white' : ''}`} style={!isBrandOrAdmin ? { backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" } : {}}>
      {!isAuthOrOnboarding && <Header />}
      <main className="flex-1">
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

             {/* Brand Pages */}
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
      </main>
      {!isAuthOrOnboarding && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Layout />
          <Toaster />
          <LoginPromptModal />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}