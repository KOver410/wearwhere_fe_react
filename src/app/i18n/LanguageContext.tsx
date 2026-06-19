import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'en' | 'vi';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  v: (en: string, vi: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// ---------- translations ----------
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header - utility bar
    'header.aboutUs': 'About Us',
    'header.howItWorks': 'How It Works',
    'header.becomeASeller': 'Become a Seller',
    'header.searchPlaceholder': "Search for 'black josie top'",
    'header.searchPlaceholderMobile': 'Search for items...',
    // Header - nav
    'nav.women': 'Women',
    'nav.men': 'Men',
    'nav.kids': 'Kids',
    'nav.brands': 'Brands',
    'nav.wardrobe': 'Wardrobe',
    'nav.stores': 'Stores',
    'nav.trending': 'Trending',
    'nav.vouchers': 'Vouchers',
    'nav.sale': 'Sale',
    // Header - mobile menu sections
    'mobile.shop': 'Shop',
    'mobile.features': 'Features',
    'mobile.information': 'Information',
    'mobile.ootdCommunity': 'OOTD Community',
    'mobile.smartWardrobe': 'Smart Wardrobe',
    'mobile.storeLocator': 'Store Locator',

    // Hero Section
    'hero.shopNow': 'Shop now',
    'hero.sellNow': 'Sell now',
    'hero.tagline': 'Buy for less. Pay no selling fee*. Keep fashion circular.',
    'hero.feeNote': '*agreement concerning fees and sourcing have our apply. For more info, visit',
    'hero.here': 'here',

    // News Slider
    'slider.slide1Title': 'Score style points',
    'slider.slide1Desc': 'Discover vintage jerseys under 750.000₫',
    'slider.slide2Title': 'Fresh arrivals',
    'slider.slide2Desc': 'New styles added daily from our community',
    'slider.slide3Title': 'Streetwear essentials',
    'slider.slide3Desc': 'The latest drops from top sellers',

    // Nearby Shops
    'nearbyShops.title': 'Shops near you',
    'nearbyShops.subtitle': 'Discover local brand stores near your location',
    'nearbyShops.viewAll': 'View all stores',

    // Trending Items
    'trending.title': 'Trending Items',
    'trending.subtitle': 'The hottest products with the most interest this week',
    'trending.viewMore': 'View more trending',
    'trending.from': 'FROM',
    'trending.views': 'views',

    // Smart Wardrobe
    'smartWardrobe.title': 'Smart Wardrobe Recommendations',
    'smartWardrobe.owned': 'owned',
    'smartWardrobe.viewMore': 'View more suggestions',

    // Shop by Style
    'shopByStyle.title': 'Shop by style',
    'shopByStyle.localTees': 'Local tees',
    'shopByStyle.vintageJerseys': 'Vintage jerseys',
    'shopByStyle.sneakers': 'Sneakers',
    'shopByStyle.hoodies': 'Hoodies & Sweatshirts',
    'shopByStyle.bags': 'Bags & Accessories',
    'shopByStyle.streetwear': 'Streetwear VN',

    // Footer
    'footer.description': 'The platform connecting fashion lovers with Vietnamese local brands.',
    'footer.shopping': 'Shopping',
    'footer.support': 'Support',
    'footer.aboutAndPartner': 'About & Partners',
    'footer.trackOrder': 'Track order',
    'footer.returns': 'Returns & Exchanges',
    'footer.accountSettings': 'Account settings',
    'footer.aboutWearWhere': 'About Wear Where',
    'footer.howItWorksFooter': 'How it works',
    'footer.registerToSell': 'Register to sell',
    'footer.sellerCenter': 'Seller Center',
    'footer.contact': 'Contact',
    'footer.termsOfService': 'Terms of Service',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.operatingRegulations': 'Operating Regulations',
    'footer.rights': 'All rights reserved.',

    // Partner Page
    'partner.badge': 'BECOME A PARTNER',
    'partner.heroTitle': 'Grow Your Fashion Business with Us',
    'partner.heroSubtitle': 'Join the fastest-growing community of independent boutiques and brands. We help you reach more customers while you focus on creating style.',
    'partner.applyNow': 'Apply Now',
    'partner.learnMore': 'Learn More',
    'partner.whyPartner': 'Why Partner With Wear Where?',
    'partner.whyPartnerSub': 'We provide the tools and exposure you need to take your brand to the next level.',
    'partner.expandReach': 'Expand Your Reach',
    'partner.expandReachDesc': 'Access a global community of fashion enthusiasts. Get discovered by customers who value unique, high-quality pieces.',
    'partner.analytics': 'Powerful Analytics',
    'partner.analyticsDesc': 'Gain insights into your performance. Track views, sales, and customer preferences to optimize your inventory.',
    'partner.securePayments': 'Secure Payments',
    'partner.securePaymentsDesc': 'We handle all payment processing and fraud protection, so you can focus on what you do best: curating style.',
    'partner.marketing': 'Marketing Support',
    'partner.marketingDesc': 'Benefit from our platform-wide marketing campaigns, featured collections, and social media promotion.',
    'partner.pricingTitle': 'Simple, Transparent Pricing',
    'partner.pricingDesc': "We believe in growing together. That's why we don't charge any upfront fees or monthly subscriptions. We only make money when you do.",
    'partner.noSetupFees': 'No setup fees',
    'partner.noSubscription': 'No monthly subscription',
    'partner.freeTools': 'Free marketing tools',
    'partner.dedicatedSupport': 'Dedicated support manager',
    'partner.seeTerms': 'See Detailed Terms',
    'partner.commission': 'Standard Commission',
    'partner.perSale': '/ sale',
    'partner.commissionDesc': 'Includes payment processing fees, platform maintenance, and customer support handling.',
    'partner.listingItems': 'Listing items',
    'partner.free': 'Free',
    'partner.successStories': 'Success Stories',
    'partner.ctaTitle': 'Ready to Start Your Journey?',
    'partner.ctaDesc': 'Join thousands of successful brands on Wear Where. Registration takes less than 5 minutes.',
    'partner.firstName': 'First Name',
    'partner.lastName': 'Last Name',
    'partner.brandName': 'Brand Name',
    'partner.emailAddress': 'Email Address',
    'partner.createAccount': 'Create Partner Account',
    'partner.agreeTo': 'By clicking "Create Partner Account", you agree to our',
    'partner.formSuccess': 'Partner application submitted! We will review your information and contact you within 24-48 hours.',

    // Product item names (SmartWardrobe)
    'item.localBrandTee': 'Local Brand Tee',
    'item.slimFitJeans': 'Slim fit jeans',
    'item.whiteSneakers': 'White sneakers',
    'item.oversizedHoodie': 'Oversized hoodie',
    'item.blackCargoPants': 'Black cargo pants',
    'item.blackSneakers': 'Black sneakers',
    'item.whiteShirt': 'White shirt',
    'item.slimTrousers': 'Slim trousers',
    'item.leatherLoafers': 'Leather loafers',
    'item.localPolo': 'Local polo',
    'item.khakiShorts': 'Khaki shorts',
    'item.slipOnShoes': 'Slip-on shoes',

    // NearbyShops item names
    'item.basicTee': 'Basic Tee',
    'item.oversizedHoodieProduct': 'Oversized Hoodie',
    'item.classicSneaker': 'Classic Sneaker',
    'item.denimJacket': 'Denim Jacket',
    'item.vintageTee': 'Vintage Tee',
    'item.retroSneakers': 'Retro Sneakers',
    'item.localHoodie': 'Local Hoodie',
    'item.graphicTee': 'Graphic Tee',
    'item.bomberJacket': 'Bomber Jacket',
    'item.limitedSneakers': 'Limited Sneakers',
    'item.premiumHoodie': 'Premium Hoodie',
    'item.designerTee': 'Designer Tee',
  },
  vi: {
    // Header - utility bar
    'header.aboutUs': 'Giới thiệu',
    'header.howItWorks': 'Cách hoạt động',
    'header.becomeASeller': 'Trở thành người bán',
    'header.searchPlaceholder': "Tìm kiếm 'áo thun đen'",
    'header.searchPlaceholderMobile': 'Tìm kiếm sản phẩm...',
    // Header - nav
    'nav.women': 'Nữ',
    'nav.men': 'Nam',
    'nav.kids': 'Trẻ em',
    'nav.brands': 'Thương hiệu',
    'nav.wardrobe': 'Tủ đồ',
    'nav.stores': 'Cửa hàng',
    'nav.trending': 'Xu hướng',
    'nav.vouchers': 'Voucher',
    'nav.sale': 'Giảm giá',
    // Header - mobile menu sections
    'mobile.shop': 'Mua sắm',
    'mobile.features': 'Tính năng',
    'mobile.information': 'Thông tin',
    'mobile.ootdCommunity': 'Cộng đồng OOTD',
    'mobile.smartWardrobe': 'Tủ đồ thông minh',
    'mobile.storeLocator': 'Tìm cửa hàng',

    // Hero Section
    'hero.shopNow': 'Mua ngay',
    'hero.sellNow': 'Bán ngay',
    'hero.tagline': 'Mua rẻ hơn. Không phí bán hàng*. Thời trang tuần hoàn.',
    'hero.feeNote': '*các điều khoản về phí và nguồn hàng được áp dụng. Xem thêm tại',
    'hero.here': 'đây',

    // News Slider
    'slider.slide1Title': 'Ghi điểm phong cách',
    'slider.slide1Desc': 'Khám phá áo jersey vintage dưới 750.000₫',
    'slider.slide2Title': 'Hàng mới về',
    'slider.slide2Desc': 'Mẫu mới được thêm hàng ngày từ cộng đồng',
    'slider.slide3Title': 'Streetwear must-have',
    'slider.slide3Desc': 'Sản phẩm mới nhất từ các seller hàng đầu',

    // Nearby Shops
    'nearbyShops.title': 'Cửa hàng gần bạn',
    'nearbyShops.subtitle': 'Khám phá các cửa hàng local brand gần bạn',
    'nearbyShops.viewAll': 'Xem tất cả cửa hàng',

    // Trending Items
    'trending.title': 'Sản phẩm nổi bật',
    'trending.subtitle': 'Sản phẩm hot nhất được quan tâm nhiều nhất tuần này',
    'trending.viewMore': 'Xem thêm sản phẩm',
    'trending.from': 'TỪ',
    'trending.views': 'lượt xem',

    // Smart Wardrobe
    'smartWardrobe.title': 'Gợi ý tủ đồ thông minh',
    'smartWardrobe.owned': 'đã có',
    'smartWardrobe.viewMore': 'Xem thêm gợi ý',

    // Shop by Style
    'shopByStyle.title': 'Mua theo phong cách',
    'shopByStyle.localTees': 'Áo thun local',
    'shopByStyle.vintageJerseys': 'Jersey cổ điển',
    'shopByStyle.sneakers': 'Giày sneakers',
    'shopByStyle.hoodies': 'Hoodies & Áo nỉ',
    'shopByStyle.bags': 'Túi & Phụ kiện',
    'shopByStyle.streetwear': 'Streetwear VN',

    // Footer
    'footer.description': 'Nền tảng kết nối người yêu thời trang với các local brand Việt Nam.',
    'footer.shopping': 'Mua Sắm',
    'footer.support': 'Hỗ Trợ',
    'footer.aboutAndPartner': 'Giới Thiệu & Hợp Tác',
    'footer.trackOrder': 'Theo dõi đơn hàng',
    'footer.returns': 'Đổi trả hàng',
    'footer.accountSettings': 'Cài đặt tài khoản',
    'footer.aboutWearWhere': 'Về Wear Where',
    'footer.howItWorksFooter': 'Cách hoạt động',
    'footer.registerToSell': 'Đăng ký bán hàng',
    'footer.sellerCenter': 'Seller Center',
    'footer.contact': 'Liên hệ',
    'footer.termsOfService': 'Điều khoản sử dụng',
    'footer.privacyPolicy': 'Chính sách bảo mật',
    'footer.operatingRegulations': 'Quy chế hoạt động',
    'footer.rights': 'Đã đăng ký bản quyền.',

    // Partner Page
    'partner.badge': 'TRỞ THÀNH ĐỐI TÁC',
    'partner.heroTitle': 'Phát triển thương hiệu thời trang cùng chúng tôi',
    'partner.heroSubtitle': 'Tham gia cộng đồng các boutique và thương hiệu độc lập phát triển nhanh nhất. Chúng tôi giúp bạn tiếp cận nhiều khách hàng hơn trong khi bạn tập trung sáng tạo phong cách.',
    'partner.applyNow': 'Đăng ký ngay',
    'partner.learnMore': 'Tìm hiểu thêm',
    'partner.whyPartner': 'Tại sao nên hợp tác với Wear Where?',
    'partner.whyPartnerSub': 'Chúng tôi cung cấp công cụ và khả năng tiếp cận để đưa thương hiệu lên tầm cao mới.',
    'partner.expandReach': 'Mở rộng phạm vi',
    'partner.expandReachDesc': 'Tiếp cận cộng đồng yêu thời trang toàn cầu. Được khám phá bởi khách hàng trân trọng sản phẩm độc đáo, chất lượng cao.',
    'partner.analytics': 'Phân tích mạnh mẽ',
    'partner.analyticsDesc': 'Nắm bắt thông tin hiệu suất. Theo dõi lượt xem, doanh số và sở thích khách hàng để tối ưu kho hàng.',
    'partner.securePayments': 'Thanh toán an toàn',
    'partner.securePaymentsDesc': 'Chúng tôi xử lý toàn bộ thanh toán và chống gian lận, để bạn tập trung vào điều bạn giỏi nhất: tuyển chọn phong cách.',
    'partner.marketing': 'Hỗ trợ marketing',
    'partner.marketingDesc': 'Hưởng lợi từ các chiến dịch marketing toàn nền tảng, bộ sưu tập nổi bật và quảng bá trên mạng xã hội.',
    'partner.pricingTitle': 'Bảng giá đơn giản, minh bạch',
    'partner.pricingDesc': 'Chúng tôi tin vào sự phát triển cùng nhau. Vì vậy chúng tôi không thu phí trả trước hay thuê bao hàng tháng. Chúng tôi chỉ kiếm tiền khi bạn kiếm tiền.',
    'partner.noSetupFees': 'Không phí thiết lập',
    'partner.noSubscription': 'Không thuê bao hàng tháng',
    'partner.freeTools': 'Công cụ marketing miễn phí',
    'partner.dedicatedSupport': 'Quản lý hỗ trợ riêng',
    'partner.seeTerms': 'Xem điều khoản chi tiết',
    'partner.commission': 'Hoa hồng tiêu chuẩn',
    'partner.perSale': '/ đơn hàng',
    'partner.commissionDesc': 'Bao gồm phí xử lý thanh toán, duy trì nền tảng và hỗ trợ khách hàng.',
    'partner.listingItems': 'Đăng sản phẩm',
    'partner.free': 'Miễn phí',
    'partner.successStories': 'Câu chuyện thành công',
    'partner.ctaTitle': 'Sẵn sàng bắt đầu hành trình?',
    'partner.ctaDesc': 'Tham gia cùng hàng ngàn thương hiệu thành công trên Wear Where. Đăng ký chỉ mất dưới 5 phút.',
    'partner.firstName': 'Tên',
    'partner.lastName': 'Họ',
    'partner.brandName': 'Tên thương hiệu',
    'partner.emailAddress': 'Địa chỉ email',
    'partner.createAccount': 'Tạo tài khoản đối tác',
    'partner.agreeTo': 'Bằng cách nhấn "Tạo tài khoản đối tác", bạn đồng ý với',
    'partner.formSuccess': 'Đã gửi đơn đăng ký đối tác! Chúng tôi sẽ xem xét thông tin và liên hệ bạn trong 24-48 giờ.',

    // Product item names (SmartWardrobe)
    'item.localBrandTee': 'Áo thun Local Brand',
    'item.slimFitJeans': 'Quần jean slim fit',
    'item.whiteSneakers': 'Giày sneaker trắng',
    'item.oversizedHoodie': 'Hoodie oversized',
    'item.blackCargoPants': 'Quần cargo đen',
    'item.blackSneakers': 'Giày sneaker đen',
    'item.whiteShirt': 'Áo sơ mi trắng',
    'item.slimTrousers': 'Quần tây slim',
    'item.leatherLoafers': 'Giày da loafer',
    'item.localPolo': 'Áo polo local',
    'item.khakiShorts': 'Quần short kaki',
    'item.slipOnShoes': 'Giày slip-on',

    // NearbyShops item names
    'item.basicTee': 'Áo thun Basic',
    'item.oversizedHoodieProduct': 'Hoodie Oversized',
    'item.classicSneaker': 'Sneaker Classic',
    'item.denimJacket': 'Áo khoác Denim',
    'item.vintageTee': 'Vintage Tee',
    'item.retroSneakers': 'Retro Sneakers',
    'item.localHoodie': 'Hoodie Local',
    'item.graphicTee': 'Graphic Tee',
    'item.bomberJacket': 'Áo khoác Bomber',
    'item.limitedSneakers': 'Limited Sneakers',
    'item.premiumHoodie': 'Premium Hoodie',
    'item.designerTee': 'Designer Tee',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('ww-lang') as Language) || 'vi';
    }
    return 'vi';
  });

  const handleSetLang = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('ww-lang', newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang][key] ?? key;
    },
    [lang],
  );

  const v = useCallback(
    (en: string, vi: string): string => {
      return lang === 'en' ? en : vi;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t, v }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback for HMR / rendering outside provider — return safe defaults
    return {
      lang: 'vi' as Language,
      setLang: () => {},
      t: (key: string) => key,
      v: (en: string, _vi: string) => en,
    };
  }
  return ctx;
}