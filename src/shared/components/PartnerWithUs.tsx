import { motion } from 'motion/react';
import { useRef } from 'react';
import { Check, TrendingUp, Globe, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { Button } from "@/shared/ui/button";
import { useLanguage } from '@/shared/i18n/LanguageContext';

export function PartnerWithUs() {
  const formRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBenefits = () => {
    benefitsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    { icon: <Globe className="w-8 h-8 text-[#d41c1c]" />, title: t('partner.expandReach'), description: t('partner.expandReachDesc') },
    { icon: <BarChart3 className="w-8 h-8 text-[#d41c1c]" />, title: t('partner.analytics'), description: t('partner.analyticsDesc') },
    { icon: <Shield className="w-8 h-8 text-[#d41c1c]" />, title: t('partner.securePayments'), description: t('partner.securePaymentsDesc') },
    { icon: <TrendingUp className="w-8 h-8 text-[#d41c1c]" />, title: t('partner.marketing'), description: t('partner.marketingDesc') },
  ];

  return (
    <div className="w-full" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1765009433753-c7462637d21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RvcmUlMjBpbnRlcmlvciUyMG1vZGVybnxlbnwxfHx8fDE3NzAwOTE3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Fashion Store Interior"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-6 tracking-wider text-white border border-white/30 rounded-full backdrop-blur-sm"
            style={{ fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            {t('partner.badge')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white mb-6 tracking-tight leading-tight"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}
          >
            {t('partner.heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 max-w-2xl mx-auto"
            style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}
          >
            {t('partner.heroSubtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-[#d41c1c] text-white hover:bg-[#b01818] px-8 h-14" style={{ fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '10px', border: '2px solid #d41c1c' }} onClick={scrollToForm}>
              {t('partner.applyNow')}
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 h-14" style={{ fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '10px' }} onClick={scrollToBenefits}>
              {t('partner.learnMore')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 lg:px-12 mx-auto" style={{ maxWidth: 'calc(75% + 320px)' }} ref={benefitsRef}>
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ fontSize: '36px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{t('partner.whyPartner')}</h2>
          <p style={{ color: '#4a4a4a', fontSize: '16px', lineHeight: '1.7' }} className="max-w-2xl mx-auto">{t('partner.whyPartnerSub')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 hover:shadow-md transition-all"
              style={{ backgroundColor: '#f3f0eb', borderRadius: '10px' }}
            >
              <div className="w-14 h-14 bg-white shadow-sm flex items-center justify-center mb-6" style={{ borderRadius: '10px' }}>
                {benefit.icon}
              </div>
              <h3 className="mb-3" style={{ fontSize: '20px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>{benefit.title}</h3>
              <p style={{ color: '#4a4a4a', fontSize: '15px', lineHeight: '1.7' }}>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-white" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-6" style={{ fontSize: '36px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{t('partner.pricingTitle')}</h2>
              <p className="mb-8 leading-relaxed" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>{t('partner.pricingDesc')}</p>
              <ul className="space-y-4 mb-10">
                {[t('partner.noSetupFees'), t('partner.noSubscription'), t('partner.freeTools'), t('partner.dedicatedSupport')].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,28,28,0.15)' }}>
                      <Check className="w-4 h-4 text-[#d41c1c]" />
                    </div>
                    <span style={{ fontSize: '16px' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-[#d41c1c] text-white hover:bg-[#b01818] px-8 h-12" style={{ fontSize: '14px', borderRadius: '10px', border: '2px solid #d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }} onClick={scrollToForm}>
                {t('partner.seeTerms')}
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#d41c1c] blur-2xl opacity-20 transform rotate-3" style={{ borderRadius: '10px' }}></div>
              <div className="relative border p-10 text-center" style={{ backgroundColor: '#1a1a1a', borderColor: '#4a4a4a', borderRadius: '10px' }}>
                <h3 className="mb-2" style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase' as const }}>{t('partner.commission')}</h3>
                <div className="flex items-center justify-center gap-2 my-6">
                  <span style={{ fontSize: '60px', fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>15%</span>
                  <span className="self-end mb-2" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>{t('partner.perSale')}</span>
                </div>
                <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>{t('partner.commissionDesc')}</p>
                <div className="w-full h-px mb-8" style={{ backgroundColor: '#4a4a4a' }}></div>
                <div className="flex justify-between items-center" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                  <span>{t('partner.listingItems')}</span>
                  <span className="text-white">{t('partner.free')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f3f0eb' }} ref={formRef}>
        <div className="max-w-4xl mx-auto bg-white p-12 shadow-xl text-center relative overflow-hidden" style={{ borderRadius: '10px' }}>
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#d41c1c' }}></div>
          <h2 className="mb-6" style={{ fontSize: '36px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{t('partner.ctaTitle')}</h2>
          <p className="mb-10 max-w-2xl mx-auto" style={{ color: '#4a4a4a', fontSize: '16px', lineHeight: '1.7' }}>{t('partner.ctaDesc')}</p>

          <form className="max-w-md mx-auto space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1" style={{ fontSize: '14px', color: '#4a4a4a' }}>{t('partner.firstName')}</label>
                <input type="text" className="w-full px-4 py-2 border border-[#e0d8cf] focus:ring-2 focus:ring-[#d41c1c] focus:outline-none" style={{ borderRadius: '10px' }} placeholder="John" />
              </div>
              <div>
                <label className="block mb-1" style={{ fontSize: '14px', color: '#4a4a4a' }}>{t('partner.lastName')}</label>
                <input type="text" className="w-full px-4 py-2 border border-[#e0d8cf] focus:ring-2 focus:ring-[#d41c1c] focus:outline-none" style={{ borderRadius: '10px' }} placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block mb-1" style={{ fontSize: '14px', color: '#4a4a4a' }}>{t('partner.brandName')}</label>
              <input type="text" className="w-full px-4 py-2 border border-[#e0d8cf] focus:ring-2 focus:ring-[#d41c1c] focus:outline-none" style={{ borderRadius: '10px' }} placeholder="Your Brand" />
            </div>
            <div>
              <label className="block mb-1" style={{ fontSize: '14px', color: '#4a4a4a' }}>{t('partner.emailAddress')}</label>
              <input type="email" className="w-full px-4 py-2 border border-[#e0d8cf] focus:ring-2 focus:ring-[#d41c1c] focus:outline-none" style={{ borderRadius: '10px' }} placeholder="john@example.com" />
            </div>
            <Button type="button" className="w-full h-12 bg-[#d41c1c] hover:bg-[#b01818] mt-4" style={{ fontSize: '14px', borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #d41c1c' }} onClick={() => alert(t('partner.formSuccess'))}>
              {t('partner.createAccount')} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          <p className="mt-6" style={{ fontSize: '13px', color: '#4a4a4a' }}>
            {t('partner.agreeTo')} <a href="#" className="underline">{t('footer.termsOfService')}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}