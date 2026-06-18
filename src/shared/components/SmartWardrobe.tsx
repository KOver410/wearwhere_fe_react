import { Link } from 'react-router';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { Sparkles, Check, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export function SmartWardrobe() {
  const { t, lang } = useLanguage();

  const formatPrice = (price: number) => {
    if (lang === 'vi') return `${price.toLocaleString('vi-VN')}d`;
    return `$${(price / 25000).toFixed(0)}`;
  };

  const outfitRecommendations = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1665650401573-8b33ca641315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBvdXRmaXQlMjBtZW58ZW58MXx8fHwxNzcwMDQ1MzE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: lang === 'vi' ? 'DẠO PHỐ CUỐI TUẦN' : 'WEEKEND STREET LOOK',
      occasion: lang === 'vi' ? 'Casual · Hàng ngày' : 'Casual · Everyday',
      matchScore: 95,
      items: [
        { name: t('item.localBrandTee'), owned: true, price: null, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMHByb2R1Y3QlMjBwaG90b3xlbnwxfHx8fDE3NzAwNDY0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
        { name: t('item.slimFitJeans'), owned: true, price: null, image: 'https://images.unsplash.com/photo-1758018230837-89188346c36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGplYW5zJTIwcHJvZHVjdCUyMHBob3RvfGVufDF8fHx8MTc3MDA0NjQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
        { name: t('item.whiteSneakers'), owned: false, price: 850000, image: 'https://images.unsplash.com/photo-1631482665588-d3a6f88e65f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwcHJvZHVjdHxlbnwxfHx8fDE3Njk5NTM4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      ],
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1763256433396-e088d31cabd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uYWJsZSUyMG91dGZpdCUyMGZ1bGwlMjBib2R5fGVufDF8fHx8MTc3MDA0NTMxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: lang === 'vi' ? 'SMART CASUAL' : 'REFINED SMART CASUAL',
      occasion: lang === 'vi' ? 'Công sở · Hẹn hò' : 'Office · Date night',
      matchScore: 92,
      items: [
        { name: t('item.whiteShirt'), owned: true, price: null, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMHByb2R1Y3QlMjBwaG90b3xlbnwxfHx8fDE3NzAwNDY0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
        { name: t('item.slimTrousers'), owned: true, price: null, image: 'https://images.unsplash.com/photo-1758018230837-89188346c36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGplYW5zJTIwcHJvZHVjdCUyMHBob3RvfGVufDF8fHx8MTc3MDA0NjQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
        { name: t('item.leatherLoafers'), owned: false, price: 1200000, image: 'https://images.unsplash.com/photo-1631482665588-d3a6f88e65f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwcHJvZHVjdHxlbnwxfHx8fDE3Njk5NTM4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      ],
    },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.3em', color: '#d41c1c' }}>
            <Sparkles className="w-3.5 h-3.5 inline-block mr-2 -mt-0.5" />AI-POWERED STYLING
          </span>
          <h2 className="mt-2" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(40px, 6vw, 64px)', color: '#fff9f2', lineHeight: 0.95 }}>
            {t('smartWardrobe.title')}
          </h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ fontSize: '14px', color: 'rgba(255,249,242,0.4)', lineHeight: 1.7 }}>
            {lang === 'vi' ? 'AI phân tích tủ đồ của bạn và gợi ý outfit hoàn hảo.' : 'AI analyzes your wardrobe and suggests perfect outfits.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {outfitRecommendations.map((outfit, index) => {
            const ownedCount = outfit.items.filter((i) => i.owned).length;
            return (
              <motion.div key={outfit.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="group"
                style={{ border: '2px solid rgba(255,249,242,0.1)' }}>
                <div className="relative overflow-hidden aspect-[16/10]">
                  <ImageWithFallback src={outfit.image} alt={outfit.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d0d0d 0%, transparent 50%)' }} />
                  <div className="absolute top-4 right-4 px-3 py-1.5" style={{ backgroundColor: '#d41c1c' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff9f2', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em' }}>
                      {outfit.matchScore}% MATCH
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff9f2', letterSpacing: '0.1em' }}>
                      {ownedCount}/{outfit.items.length} {t('smartWardrobe.owned')}
                    </span>
                  </div>
                </div>
                <div className="p-5" style={{ backgroundColor: '#0d0d0d' }}>
                  <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '22px', color: '#fff9f2', letterSpacing: '0.05em' }}>
                    {outfit.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#d41c1c', fontWeight: 700 }}>{outfit.occasion}</span>
                  <div className="mt-4 space-y-2">
                    {outfit.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2" style={{ backgroundColor: 'rgba(255,249,242,0.04)' }}>
                        <div className="w-10 h-10 overflow-hidden flex-shrink-0" style={{ backgroundColor: '#222' }}>
                          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white/80 truncate block" style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</span>
                          {item.owned ? (
                            <span className="flex items-center gap-1" style={{ fontSize: '11px', color: '#6f7d4e', fontWeight: 700 }}>
                              <Check className="w-3 h-3" /> {lang === 'vi' ? 'Đã có' : 'Owned'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#d41c1c', fontWeight: 800 }}>{formatPrice(item.price!)}</span>
                          )}
                        </div>
                        {!item.owned && (
                          <Link to="/shop" className="p-1.5 hover:bg-[#d41c1c] transition-colors" style={{ border: '1px solid #d41c1c' }}>
                            <ShoppingBag className="w-3.5 h-3.5 text-[#d41c1c] hover:text-white" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                  <Link to="/wardrobe" className="mt-5 block text-center py-3 transition-all hover:bg-[#fff9f2] hover:text-[#0d0d0d]"
                    style={{ border: '2px solid #fff9f2', color: '#fff9f2', fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {lang === 'vi' ? 'TỦ ĐỒ THÔNG MINH' : 'SMART WARDROBE'} →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}