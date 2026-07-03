import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import bannerImage from '@/assets/2d33a3fa59292fa56814a7e501cfcd2b0c4dbedb.png';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export function NewsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const slides = [
    {
      id: 1,
      title: t('slider.slide1Title'),
      description: t('slider.slide1Desc'),
      buttonText: t('hero.shopNow'),
      image: bannerImage,
      accent: 'I',
    },
    {
      id: 2,
      title: t('slider.slide2Title'),
      description: t('slider.slide2Desc'),
      buttonText: t('hero.shopNow'),
      image: 'https://images.unsplash.com/photo-1714046298190-7c33737ddc94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY29sbGVjdGlvbiUyMGxvb2tib29rfGVufDF8fHx8MTc3MDA0MzY2M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      accent: 'II',
    },
    {
      id: 3,
      title: t('slider.slide3Title'),
      description: t('slider.slide3Desc'),
      buttonText: t('hero.shopNow'),
      image: 'https://images.unsplash.com/photo-1511742667815-af572199b23a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwY2xvdGhpbmclMjBzdHlsZXxlbnwxfHx8fDE3NzAwMjA4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      accent: 'III',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="py-0" style={{ backgroundColor: '#0d0d0d', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="relative overflow-hidden">
          <div className="grid md:grid-cols-5 min-h-[420px] md:min-h-[480px]">
            {/* Left - Text panel */}
            <div className="md:col-span-2 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative" style={{ backgroundColor: '#0d0d0d' }}>
              {/* Decorative corner — bold graphic style */}
              <div className="absolute top-6 left-6 w-10 h-10 hidden md:block" style={{ borderTop: '2px solid #d41c1c', borderLeft: '2px solid #d41c1c' }} />
              <div className="absolute bottom-6 right-6 w-10 h-10 hidden md:block" style={{ borderBottom: '2px solid #d41c1c', borderRight: '2px solid #d41c1c' }} />

              {/* Slide number */}
              <div className="flex items-center gap-3 mb-6">
                <span style={{ fontSize: '48px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: 'rgba(212,28,28,0.25)', lineHeight: 1, textTransform: 'uppercase' }}>
                  {slide.accent}
                </span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, #d41c1c, transparent)', maxWidth: '60px' }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block mb-3" style={{ fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d41c1c', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>
                    Editorial
                  </span>
                  <h3 className="text-white mb-4" style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, lineHeight: 1.1, textTransform: 'uppercase' }}>
                    {slide.title}
                  </h3>
                  <p className="mb-8" style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    {slide.description}
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-3 text-white transition-all group hover:gap-5"
                    style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}
                  >
                    <span>{slide.buttonText}</span>
                    <div className="w-6 h-px bg-[#d41c1c] group-hover:w-10 transition-all duration-300" />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Slide navigation */}
              <div className="flex items-center gap-4 mt-10">
                <button onClick={prevSlide} className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white/10" style={{ border: '2px solid rgba(212,28,28,0.4)', borderRadius: '50%' }}>
                  <ChevronLeft className="w-4 h-4" style={{ color: '#d41c1c' }} />
                </button>
                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className="transition-all duration-500"
                      style={{
                        width: index === currentSlide ? '28px' : '6px',
                        height: '2px',
                        backgroundColor: index === currentSlide ? '#d41c1c' : 'rgba(255,255,255,0.2)',
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button onClick={nextSlide} className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white/10" style={{ border: '2px solid rgba(212,28,28,0.4)', borderRadius: '50%' }}>
                  <ChevronRight className="w-4 h-4" style={{ color: '#d41c1c' }} />
                </button>
              </div>
            </div>

            {/* Right - Image */}
            <div className="md:col-span-3 relative h-64 md:h-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <ImageWithFallback
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              {/* Red accent line on left edge */}
              <div className="absolute top-0 left-0 bottom-0 w-[2px] hidden md:block" style={{ backgroundColor: '#d41c1c' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}