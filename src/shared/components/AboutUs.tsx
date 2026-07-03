import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/shared/i18n/LanguageContext';

const heroImages = [
  'https://images.unsplash.com/photo-1764568361920-ac95912cf03c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwc3RyZWV0JTIwZmFzaGlvbiUyMHlvdW5nJTIwcGVvcGxlfGVufDF8fHx8MTc3MzA2MjI4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1684259498917-b0cde0133e14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjBzZXdpbmclMjBhdGVsaWVyJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczMDYyMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1758613655322-8dc7822353f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9zaG9vdCUyMGNyZWF0aXZlJTIwc3R1ZGlvfGVufDF8fHx8MTc3MzA2MjI4NHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1771074153219-b28a1841dfd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwbWFya2V0JTIwY29sb3JmdWwlMjB0ZXh0aWxlJTIwZmFicmljfGVufDF8fHx8MTc3MzA2MjI4NHww&ixlib=rb-4.1.0&q=80&w=1080',
];

export function AboutUs() {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';

  return (
    <div style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Hero Banner — Photo Collage */}
      <div className="w-full overflow-hidden" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 h-[220px] md:h-[320px]">
          {heroImages.map((img, i) => (
            <div key={i} className="relative overflow-hidden">
              <ImageWithFallback
                src={img}
                alt={`Hero ${i + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div className="max-w-[900px] mx-auto px-4 py-16 md:py-24 text-center">
        <h1
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: '#0d0d0d',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          {isVi
            ? 'Chúng tôi ở đây để kết nối thời trang Việt Nam'
            : "We're here to connect Vietnamese fashion"}
        </h1>
        <div className="w-16 h-1 bg-[#d41c1c] mx-auto mt-6" />
      </div>

      {/* Stats Bar */}
      {/* Stats section removed */}

      {/* Section 1: Our Story — image left, text right */}
      <div className="mx-auto px-4 lg:px-6 mb-20 md:mb-32" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-stretch">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden h-full" style={{ borderRadius: '4px' }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761957375235-46acb4862151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwZmFzaGlvbiUyMGNvbW11bml0eSUyMGdyb3VwJTIwZnJpZW5kc3xlbnwxfHx8fDE3NzMwNjIyODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Text */}
          <div className="w-full md:w-1/2 flex">
            <div className="flex flex-col justify-center">
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: '36px',
                color: '#0d0d0d',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              {isVi ? 'Câu chuyện của chúng tôi' : 'Our story'}
            </h2>
            <p className="mb-5" style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Wear Where là sàn thương mại điện tử thời trang nơi mọi người có thể mua, bán và khám phá thời trang từ các local brand Việt Nam. Sứ mệnh của chúng tôi đơn giản: làm cho thời trang local brand trở nên hấp dẫn và dễ tiếp cận như các thương hiệu quốc tế.'
                : 'Wear Where is a fashion e-commerce platform where anyone can buy, sell and discover fashion from Vietnamese local brands. Our mission is simple: make local brand fashion as exciting and accessible as international brands.'}
            </p>
            <p className="mb-5" style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Được thành lập vào cuối năm 2022, Wear Where đã giúp đưa thời trang Việt Nam lên một tầm cao mới. Mua sắm local brand không còn là lựa chọn thay thế — mà đã trở thành lựa chọn đầu tiên. Ngày nay, hơn 50,000 người dùng đăng ký đến với Wear Where để tìm kiếm giá trị, thể hiện phong cách cá nhân và ủng hộ các thương hiệu Việt.'
                : 'Founded in late 2022, Wear Where has helped bring Vietnamese fashion to new heights. Shopping local brands is no longer an alternative — it has become the first choice. Today, more than 50,000 registered users come to Wear Where to find great value, express their personal style and support Vietnamese brands.'}
            </p>
            <p style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Từ streetwear đến vintage, từ minimalist đến bohemian, Wear Where quy tụ đa dạng phong cách trong một nền tảng. Đây là marketplace nơi mọi người có thể khám phá, kết nối và thể hiện chính mình qua thời trang — theo cách bền vững hơn.'
                : 'From streetwear to vintage, from minimalist to bohemian, Wear Where brings together a wide range of styles in one place. It\'s a marketplace where anyone can discover, connect and express themselves through fashion — in a more sustainable way.'}
            </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: What Makes Us Different — text left, image right */}
      <div className="mx-auto px-4 lg:px-6 mb-20 md:mb-32" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-16 items-stretch">
          {/* Text */}
          <div className="w-full md:w-1/2 flex">
            <div className="flex flex-col justify-center">
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: '36px',
                color: '#0d0d0d',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              {isVi ? 'Điều khác biệt của chúng tôi' : 'What makes us different'}
            </h2>
            <p className="mb-5" style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Wear Where mang đến sự đa dạng và chiều sâu của thời trang local brand cho mọi phong cách cá nhân. Phản ánh thị hiếu, xu hướng và cảm hứng đa dạng của cộng đồng, bất kỳ ai cũng có thể đến Wear Where và tìm được thứ phù hợp với mình.'
                : 'Wear Where offers a breadth and depth of desirable fashion for everyone\'s unique personal style. Reflecting a huge range of our community\'s tastes, trends and inspirations, everyone can come to Wear Where and find something for them.'}
            </p>
            <p className="mb-5" style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Chúng tôi giúp việc kết nối giữa người mua và local brand trở nên dễ dàng. Người bán có thể đăng sản phẩm nhanh chóng, còn người mua khám phá phong cách qua người khác — với công nghệ AI giúp gợi ý những món đồ phù hợp nhất. Sự kết hợp giữa con người và công nghệ chính là điều làm Wear Where khác biệt.'
                : 'We make it easy to connect buyers with local brands. Sellers can list items quickly, while buyers discover style through others, with AI technology helping to match them with pieces they\'ll love. That combination of people and technology is what sets Wear Where apart.'}
            </p>
            <p style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Bất kể gu thời trang hay phong cách nào, đều có một chỗ cho nó trên Wear Where. Bằng cách kết nối cộng đồng xoay quanh thời trang theo cách riêng, Wear Where hỗ trợ một cách mua sắm phải chăng hơn, bền vững hơn — nơi giá trị đến từ việc khám phá những điều đã có sẵn.'
                : 'No matter someone\'s taste or style, there\'s a place for it on Wear Where. By bringing people together around fashion on their own terms, Wear Where supports a more affordable, more sustainable way to shop — where value comes from finding what already exists.'}
            </p>
            </div>
          </div>
          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden h-full" style={{ borderRadius: '4px' }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1768145488772-db787036bb13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGJyYW5kJTIwY2xvdGhpbmclMjBib3V0aXF1ZSUyMHN0b3JlfGVufDF8fHx8MTc3MzA2MjI4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="What makes us different"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Our History — image left, text right */}
      <div className="mx-auto px-4 lg:px-6 mb-20 md:mb-32" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-stretch">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden h-full" style={{ borderRadius: '4px' }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1684259498917-b0cde0133e14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjBzZXdpbmclMjBhdGVsaWVyJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczMDYyMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Our History"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Text */}
          <div className="w-full md:w-1/2 flex">
            <div className="flex flex-col justify-center">
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: '36px',
                color: '#0d0d0d',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              {isVi ? 'Lịch sử của chúng tôi' : 'Our history'}
            </h2>
            <p className="mb-5" style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Wear Where được thành lập như một ứng dụng mua sắm xã hội nơi những người yêu thời trang và văn hóa local brand có thể khám phá và mua sản phẩm từ các nhà thiết kế Việt Nam. Ngày nay, chúng tôi là nền tảng marketplace nơi hàng nghìn người mua và người bán đến để khám phá phong cách cá nhân.'
                : 'Wear Where was founded as a social shopping platform where lovers of fashion and local brand culture could discover and buy items from Vietnamese designers. Today, we\'re a marketplace where thousands of buyers and sellers come to explore their personal style.'}
            </p>
            <p className="mb-5" style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Với đội ngũ hơn 30 người, công ty của chúng tôi có trụ sở tại Thành phố Hồ Chí Minh, với kế hoạch mở rộng ra Hà Nội và Đà Nẵng. Năm 2024, Wear Where tích hợp AI Smart Wardrobe — tính năng đột phá giúp cá nhân hóa trải nghiệm mua sắm cho từng người dùng.'
                : 'Powered by a team of over 30 people, our company is headquartered in Ho Chi Minh City, with plans to expand to Hanoi and Da Nang. In 2024, Wear Where integrated AI Smart Wardrobe — a breakthrough feature that personalizes the shopping experience for each user.'}
            </p>
            <p style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              {isVi
                ? 'Từ 50 local brand ban đầu, Wear Where hiện quy tụ hơn 1,000 thương hiệu và tiếp tục phát triển như một nền tảng độc lập — sứ mệnh đưa thời trang Việt Nam vươn tầm khu vực.'
                : 'From 50 initial local brands, Wear Where now hosts over 1,000 brands and continues to grow as an independent platform — on a mission to bring Vietnamese fashion to the regional stage.'}
            </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="mx-auto px-4 lg:px-6 py-16 md:py-24 text-center relative z-10" style={{ maxWidth: 'calc(75% + 320px)' }}>
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              lineHeight: 1.15,
            }}
          >
            {isVi ? 'Hãy cùng chúng tôi viết nên tương lai thời trang Việt Nam' : "Let's write the future of Vietnamese fashion together"}
          </h2>
          <p className="max-w-2xl mx-auto mb-8" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            {isVi
              ? 'Khám phá các local brand, kết nối cộng đồng và tìm kiếm phong cách của riêng bạn.'
              : 'Discover local brands, connect with the community and find your own style.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              {isVi ? 'Khám phá ngay' : 'Start exploring'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/ootd"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white hover:border-white/60 transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              {isVi ? 'Tham gia cộng đồng' : 'Join the community'}
            </Link>
          </div>
        </div>
        {/* Subtle decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#d41c1c]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#d41c1c]/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
    </div>
  );
}