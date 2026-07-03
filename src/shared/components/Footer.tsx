import { Link } from 'react-router';
import logoImage from '@/assets/80e96fc2cdc554ebf44dc26a8edeb9829e3445b2.png';
import { useLanguage } from '@/shared/i18n/LanguageContext';

interface FooterProps {
  onNavigate?: (page: any) => void;
}

export function Footer({}: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Top border */}
      <div className="h-[3px]" style={{ backgroundColor: '#d41c1c' }} />

      <div style={{ backgroundColor: '#0d0d0d' }}>
        <div className="mx-auto px-4 lg:px-6 py-8" style={{ maxWidth: 'calc(75% + 320px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <img src={logoImage} alt="Wear Where" className="h-10 w-auto mb-5 brightness-0 invert" />
              <p className="leading-relaxed mb-5" style={{ fontSize: '14px', fontWeight: 400, color: '#888' }}>
                {t('footer.description')}
              </p>
              <div className="flex gap-3">
                {['facebook', 'instagram', 'twitter'].map((social) => (
                  <a key={social} href="#" className="w-8 h-8 flex items-center justify-center transition-all hover:bg-[#d41c1c]"
                    style={{ border: '1px solid #333' }}>
                    <svg className="w-3.5 h-3.5 text-[#888]" fill="currentColor" viewBox="0 0 24 24">
                      {social === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />}
                      {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                      {social === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Shopping */}
            <div>
              <h4 className="mb-5" style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', color: '#d41c1c', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {t('footer.shopping')}
              </h4>
              <ul className="space-y-3" style={{ fontSize: '13px', fontWeight: 500 }}>
                <li><Link to="/shop?category=women" className="transition-colors hover:text-[#d41c1c]" style={{ color: '#888' }}>{t('nav.women')}</Link></li>
                <li><Link to="/shop?category=men" className="transition-colors hover:text-[#d41c1c]" style={{ color: '#888' }}>{t('nav.men')}</Link></li>
                <li><Link to="/brands" className="transition-colors hover:text-[#d41c1c]" style={{ color: '#888' }}>{t('nav.brands')}</Link></li>
                <li><Link to="/ootd" className="transition-colors hover:text-[#d41c1c]" style={{ color: '#888' }}>OOTD Community</Link></li>
                <li><Link to="/stores" className="transition-colors hover:text-[#d41c1c]" style={{ color: '#888' }}>{t('mobile.storeLocator')}</Link></li>
                <li><Link to="/account/vouchers" className="transition-colors hover:text-[#d41c1c]" style={{ color: '#888' }}>{t('nav.vouchers')}</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-5" style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', color: '#e2b93b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {t('footer.support')}
              </h4>
              <ul className="space-y-3" style={{ fontSize: '13px', fontWeight: 500 }}>
                <li><Link to="/account/orders" className="transition-colors hover:text-[#e2b93b]" style={{ color: '#888' }}>{t('footer.trackOrder')}</Link></li>
                <li><Link to="/account/returns" className="transition-colors hover:text-[#e2b93b]" style={{ color: '#888' }}>{t('footer.returns')}</Link></li>
                <li><Link to="/account/wardrobe" className="transition-colors hover:text-[#e2b93b]" style={{ color: '#888' }}>{t('mobile.smartWardrobe')}</Link></li>
                <li><Link to="/account/settings" className="transition-colors hover:text-[#e2b93b]" style={{ color: '#888' }}>{t('footer.accountSettings')}</Link></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="mb-5" style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', color: '#6f7d4e', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {t('footer.aboutAndPartner')}
              </h4>
              <ul className="space-y-3" style={{ fontSize: '13px', fontWeight: 500 }}>
                <li><Link to="/about" className="transition-colors hover:text-[#6f7d4e]" style={{ color: '#888' }}>{t('footer.aboutWearWhere')}</Link></li>
                <li><Link to="/how-it-works" className="transition-colors hover:text-[#6f7d4e]" style={{ color: '#888' }}>{t('footer.howItWorksFooter')}</Link></li>
                <li><Link to="/partner" className="transition-colors hover:text-[#6f7d4e]" style={{ color: '#888' }}>{t('footer.registerToSell')}</Link></li>
                <li><Link to="/partner" className="transition-colors hover:text-[#6f7d4e]" style={{ color: '#888' }}>{t('footer.sellerCenter')}</Link></li>
                <li><Link to="/about" className="transition-colors hover:text-[#6f7d4e]" style={{ color: '#888' }}>{t('footer.contact')}</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8" style={{ borderTop: '1px solid #222' }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div style={{ fontSize: '12px', color: '#555' }}>&copy; 2026 Wear Where. {t('footer.rights')}</div>
              <div className="flex gap-6" style={{ fontSize: '12px' }}>
                <Link to="/about" className="transition-colors hover:text-white" style={{ color: '#555' }}>{t('footer.termsOfService')}</Link>
                <Link to="/about" className="transition-colors hover:text-white" style={{ color: '#555' }}>{t('footer.privacyPolicy')}</Link>
                <Link to="/about" className="transition-colors hover:text-white" style={{ color: '#555' }}>{t('footer.operatingRegulations')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}