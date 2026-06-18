import { Play, Store, User, Search, MapPin, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import { Button } from "@/app/components/ui/button";
import { useLanguage } from '@/app/i18n/LanguageContext';

interface HowItWorksProps {
  onNavigate?: (page: any) => void;
}

export function HowItWorks({}: HowItWorksProps) {
  const navigate = useNavigate();
  const { lang, v } = useLanguage();

  const isVi = lang === 'vi';

  const userSteps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: isVi ? 'Khám phá phong cách' : 'Discover Styles',
      description: isVi
        ? 'Duyệt hàng ngàn sản phẩm độc đáo từ các cửa hàng local brand và seller độc lập.'
        : 'Browse thousands of unique items from local boutiques and independent sellers.',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: isVi ? 'Tìm cửa hàng' : 'Locate Shops',
      description: isVi
        ? 'Tìm cửa hàng gần nhất để thử đồ hoặc nhận hàng ngay lập tức.'
        : 'Find the nearest store to try on items or pick them up instantly.',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: isVi ? 'Giao hàng nhanh' : 'Fast Delivery',
      description: isVi
        ? 'Nhận hàng tận nơi với dịch vụ giao hàng nhanh của chúng tôi.'
        : 'Get your items delivered to your doorstep with our express shipping.',
    },
  ];

  const brandSteps = [
    {
      icon: <Store className="w-6 h-6" />,
      title: isVi ? 'Tạo cửa hàng' : 'Create Your Store',
      description: isVi
        ? 'Thiết lập cửa hàng trực tuyến trong vài phút và giới thiệu bộ sưu tập của bạn.'
        : 'Set up your digital storefront in minutes and showcase your collection.',
    },
    {
      icon: <User className="w-6 h-6" />,
      title: isVi ? 'Kết nối khách hàng' : 'Connect with Shoppers',
      description: isVi
        ? 'Tiếp cận cộng đồng tín đồ thời trang đang tìm kiếm sản phẩm độc đáo.'
        : 'Reach a community of fashion enthusiasts looking for unique pieces.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: isVi ? 'Thanh toán an toàn' : 'Secure Payments',
      description: isVi
        ? 'Nhận thanh toán an toàn và quản lý thu nhập dễ dàng.'
        : 'Receive payments securely and manage your earnings with ease.',
    },
  ];

  const faqs = [
    {
      question: isVi ? 'Wear Where có miễn phí không?' : 'Is Wear Where free to use?',
      answer: isVi
        ? 'Có, việc duyệt và tìm cửa hàng hoàn toàn miễn phí cho người dùng. Chúng tôi thu một khoản hoa hồng nhỏ trên doanh số bán hàng cho các thương hiệu.'
        : "Yes, browsing and finding stores is completely free for users. We charge a small commission on sales for brands.",
    },
    {
      question: isVi ? 'Làm thế nào để đổi trả hàng?' : 'How do I return an item?',
      answer: isVi
        ? 'Đổi trả được xử lý bởi từng cửa hàng. Kiểm tra chính sách của cửa hàng trên trang sản phẩm trước khi mua.'
        : "Returns are handled by individual boutiques. Check the store's policy on the product page before purchasing.",
    },
    {
      question: isVi ? 'Tôi có thể bán quần áo của mình không?' : 'Can I sell my own clothes?',
      answer: isVi
        ? 'Hiện tại chúng tôi hợp tác với các boutique và thương hiệu đã xác minh. Tính năng bán hàng cá nhân sẽ sớm ra mắt!'
        : 'Currently, we partner with verified boutiques and brands. Individual selling features are coming soon!',
    },
    {
      question: isVi ? 'Có giao hàng quốc tế không?' : 'Is international shipping available?',
      answer: isVi
        ? 'Tùy thuộc vào từng thương hiệu cụ thể. Bạn có thể lc sản phẩm theo khả năng giao hàng trong cài đặt tìm kiếm.'
        : 'It depends on the specific brand. You can filter items by shipping availability in the search settings.',
    },
  ];

  return (
    <div className="w-full" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Hero */}
      <section className="relative py-10 px-4 sm:px-4 lg:px-6 overflow-hidden" style={{ backgroundColor: '#fff9f2' }}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 tracking-tight"
            style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}
          >
            {isVi ? 'Cách Wear Where hoạt động' : 'How Wear Where Works'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
            style={{ fontSize: '18px', color: '#4a4a4a', lineHeight: '1.8' }}
          >
            {isVi
              ? 'Cầu nối đến thời trang địa phương. Chúng tôi kết nối người yêu phong cách với các boutique và thương hiệu độc lập tốt nhất.'
              : 'Your bridge to local fashion. We connect style seekers with the best boutiques and independent brands in town.'}
          </motion.p>
        </div>
      </section>

      {/* Steps for Users */}
      <section className="py-10 px-4 lg:px-6 mx-auto" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden aspect-[4/3]"
            style={{ borderRadius: '10px' }}
          >
            <img
              src="https://images.unsplash.com/photo-1567182617421-5b55d6bc42e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvcHBpbmclMjB1c2VyJTIwcGhvbmV8ZW58MXx8fHwxNzcwMDkxMzg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt={v('User Shopping', 'Người dùng mua sắm')}
              className="object-cover w-full h-full"
            />
          </motion.div>
          <div>
            <h2 className="mb-8" style={{ fontSize: '30px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{isVi ? 'Dành cho người mua' : 'For Shoppers'}</h2>
            <div className="space-y-8">
              {userSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,28,28,0.1)', color: '#d41c1c' }}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="mb-2" style={{ fontSize: '20px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>{step.title}</h3>
                    <p style={{ color: '#4a4a4a', fontSize: '15px', lineHeight: '1.7' }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button className="bg-[#d41c1c] text-white hover:bg-[#b01818]" style={{ borderRadius: '10px', border: '2px solid #d41c1c' }} onClick={() => navigate('/')}>
                {isVi ? 'Bắt đầu mua sắm' : 'Start Shopping'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps for Brands */}
      <section className="py-10 px-4 sm:px-4 lg:px-6" style={{ backgroundColor: '#fff9f2' }}>
        <div className="mx-auto grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse" style={{ maxWidth: 'calc(75% + 320px)' }}>
          <div className="md:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden aspect-[4/3]"
              style={{ borderRadius: '10px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1684259498917-b0cde0133e14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjB3b3JraW5nJTIwY2xvdGhlc3xlbnwxfHx8fDE3NzAwOTEzOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt={v('Brand Owner', 'Chủ thương hiệu')}
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
          <div className="md:order-1">
            <h2 className="mb-8" style={{ fontSize: '30px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{isVi ? 'Dành cho thương hiệu' : 'For Brands'}</h2>
            <div className="space-y-8">
              {brandSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(226,185,59,0.15)', color: '#e2b93b' }}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="mb-2" style={{ fontSize: '20px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>{step.title}</h3>
                    <p style={{ color: '#4a4a4a', fontSize: '15px', lineHeight: '1.7' }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button onClick={() => navigate('/partner')} variant="outline" className="border-[#d41c1c] text-[#d41c1c] hover:bg-[#f3f0eb]" style={{ borderRadius: '10px', borderWidth: '2px' }}>
                {isVi ? 'Hợp tác với chúng tôi' : 'Partner With Us'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo */}
      <section className="py-10 px-4 lg:px-6 mx-auto text-center" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <h2 className="mb-8" style={{ fontSize: '30px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{isVi ? 'Xem demo' : 'See It In Action'}</h2>
        <div className="relative aspect-video max-w-4xl mx-auto overflow-hidden shadow-xl group cursor-pointer" style={{ borderRadius: '10px', backgroundColor: '#0d0d0d' }}>
          <img
            src="https://images.unsplash.com/photo-1733322992706-1210ca79f4df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwdmlkZW8lMjB0aHVtYm5haWx8ZW58MXx8fHwxNzcwMDkxMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt={v('Video Thumbnail', 'Ảnh thu nhỏ video')}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 px-4 sm:px-4 lg:px-6 max-w-3xl mx-auto" style={{ backgroundColor: '#fff9f2' }}>
        <h2 className="mb-8 text-center" style={{ fontSize: '30px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{isVi ? 'Câu hỏi thường gặp' : 'Frequently Asked Questions'}</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left" style={{ fontSize: '18px', color: '#0d0d0d' }}>{faq.question}</AccordionTrigger>
              <AccordionContent style={{ color: '#4a4a4a', fontSize: '15px', lineHeight: '1.7' }}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}