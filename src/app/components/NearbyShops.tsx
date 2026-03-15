import { Link } from 'react-router';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function NearbyShops() {
  const { t, lang } = useLanguage();

  const formatPrice = (price: number) => {
    if (lang === 'vi') return `${price.toLocaleString('vi-VN')}d`;
    return `$${(price / 25000).toFixed(0)}`;
  };

  const nearbyShops = [
    {
      id: 1, name: 'Tiệm Vải Cũ', distance: '0.5 km',
      description: lang === 'vi' ? 'Vintage & local brand từ những nghệ nhân Sài Gòn' : 'Vintage & local brands from Saigon artisans',
      shopImage: 'https://images.unsplash.com/photo-1769107805465-bfd41863f1a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMHN0b3JlJTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzcwMDQ1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      featuredItems: [
        { id: 1, image: 'https://images.unsplash.com/photo-1699945617393-896e022e14f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGJyYW5kJTIwdHNoaXJ0JTIwd2hpdGV8ZW58MXx8fHwxNzcwMDQ1ODUwfDA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.basicTee'), price: 320000 },
        { id: 2, image: 'https://images.unsplash.com/photo-1647768617268-06697e8a91d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBwcm9kdWN0JTIwcGhvdG98ZW58MXx8fHwxNzcwMDQ1ODUwfDA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.oversizedHoodieProduct'), price: 680000 },
        { id: 3, image: 'https://images.unsplash.com/photo-1625860191460-10a66c7384fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHByb2R1Y3QlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzY5OTkyMDIxfDA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.classicSneaker'), price: 1200000 },
        { id: 4, image: 'https://images.unsplash.com/photo-1606799609191-11b0dfb75be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwY2FudmFzJTIwcHJvZHVjdCUyMHBob3RvfGVufDF8fHx8MTc3MjExMDc2Mnww&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.toteBag') || 'Tote Bag', price: 450000 },
        { id: 5, image: 'https://images.unsplash.com/photo-1721134619759-223b27177bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5lbiUyMHBhbnRzJTIwZmFzaGlvbiUyMHByb2R1Y3QlMjBiZWlnZXxlbnwxfHx8fDE3NzIxMTA3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.linenPants') || 'Linen Pants', price: 590000 },
        { id: 6, image: 'https://images.unsplash.com/photo-1765248628055-ca8f89795fbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWNrZXQlMjBoYXQlMjBmYXNoaW9uJTIwYWNjZXNzb3J5JTIwcHJvZHVjdHxlbnwxfHx8fDE3NzIxMTAzODN8MA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.bucketHat') || 'Bucket Hat', price: 280000 },
      ],
    },
    {
      id: 2, name: 'Heritage Boutique', distance: '1.2 km',
      description: lang === 'vi' ? 'Thời trang di sản — áo dài cách tân & phụ kiện thủ công' : 'Heritage fashion — modern ao dai & handcrafted accessories',
      shopImage: 'https://images.unsplash.com/photo-1680362667647-c2a8c6994742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmclMjBzaG9wfGVufDF8fHx8MTc3MDAyNzY3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      featuredItems: [
        { id: 1, image: 'https://images.unsplash.com/photo-1577660002965-04865592fc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldCUyMHByb2R1Y3R8ZW58MXx8fHwxNzcwMDQ1ODUxfDA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.denimJacket'), price: 890000 },
        { id: 2, image: 'https://images.unsplash.com/photo-1699945617393-896e022e14f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGJyYW5kJTIwdHNoaXJ0JTIwd2hpdGV8ZW58MXx8fHwxNzcwMDQ1ODUwfDA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.basicTee'), price: 320000 },
        { id: 3, image: 'https://images.unsplash.com/photo-1647768617268-06697e8a91d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBwcm9kdWN0JTIwcGhvdG98ZW58MXx8fHwxNzcwMDQ1ODUwfDA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.oversizedHoodieProduct'), price: 680000 },
        { id: 4, image: 'https://images.unsplash.com/photo-1625860191460-10a66c7384fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHByb2R1Y3QlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzY5OTkyMDIxfDA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.classicSneaker'), price: 1200000 },
        { id: 5, image: 'https://images.unsplash.com/photo-1606799609191-11b0dfb75be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwY2FudmFzJTIwcHJvZHVjdCUyMHBob3RvfGVufDF8fHx8MTc3MjExMDc2Mnww&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.toteBag') || 'Tote Bag', price: 450000 },
        { id: 6, image: 'https://images.unsplash.com/photo-1721134619759-223b27177bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5lbiUyMHBhbnRzJTIwZmFzaGlvbiUyMHByb2R1Y3QlMjBiZWlnZXxlbnwxfHx8fDE3NzIxMTA3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080', name: t('item.linenPants') || 'Linen Pants', price: 590000 },
      ],
    },
  ];

  return (
    <div className="py-12 md:py-20" style={{ backgroundColor: '#fff9f2' }}>
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.3em', color: '#d41c1c' }}>
              <Navigation className="w-3.5 h-3.5 inline-block mr-2 -mt-0.5" />NEAR YOU
            </span>
            <h2 className="mt-2" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(40px, 6vw, 64px)', color: '#0d0d0d', lineHeight: 0.95 }}>
              {t('nearbyShops.title')}
            </h2>
          </div>
          <Link to="/stores" className="group inline-flex items-center gap-3"
            style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0d0d0d' }}>
            {t('nearbyShops.viewAll')}
            <div className="w-6 h-[2px] bg-[#d41c1c] group-hover:w-10 transition-all" />
          </Link>
        </motion.div>

        <div className="space-y-6">
          {nearbyShops.map((shop, index) => (
            <motion.div key={shop.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ delay: index * 0.1 }}>
              <Link to="/stores" className="group block">
                <div className="grid md:grid-cols-12 gap-0 overflow-hidden bg-white transition-shadow hover:shadow-lg"
                  style={{ border: '2px solid #0d0d0d' }}>
                  <div className="md:col-span-4 relative overflow-hidden" style={{ minHeight: '220px' }}>
                    <ImageWithFallback src={shop.shopImage} alt={shop.name}
                      className="w-full h-full object-cover absolute inset-0 group-hover:scale-[1.04] transition-transform duration-700" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5"
                      style={{ backgroundColor: '#d41c1c', color: '#fff9f2' }}>
                      <MapPin className="w-3 h-3" />
                      <span style={{ fontSize: '11px', fontWeight: 800 }}>{shop.distance}</span>
                    </div>
                  </div>
                  <div className="md:col-span-3 p-5 md:p-6 flex flex-col justify-center md:border-r-2" style={{ borderColor: '#e0d8cf' }}>
                    <h3 className="group-hover:text-[#d41c1c] transition-colors"
                      style={{ fontFamily: "'Oswald', sans-serif", fontSize: '22px', color: '#0d0d0d', letterSpacing: '0.05em' }}>
                      {shop.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{shop.description}</p>
                    <div className="mt-3 inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ fontSize: '11px', fontWeight: 800, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {lang === 'vi' ? 'GHÉ THĂM' : 'VISIT'} <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="md:col-span-5 p-4 md:p-5 flex items-center border-t-2 md:border-t-0" style={{ borderColor: '#e0d8cf' }}>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      {shop.featuredItems.slice(0, 6).map((item) => (
                        <div key={item.id}>
                          <div className="overflow-hidden aspect-square" style={{ backgroundColor: '#f5f0ea' }}>
                            <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="mt-1 truncate" style={{ fontSize: '10px', color: '#666', fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: '#d41c1c', fontWeight: 800 }}>{formatPrice(item.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}