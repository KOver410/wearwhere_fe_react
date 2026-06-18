import { Heart } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '@/app/i18n/LanguageContext';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: number;
  seller: {
    name: string;
    avatar: string;
  };
  likes: number;
}

export function ProductCard({ id, image, title, price, seller, likes }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { v } = useLanguage();

  return (
    <div className="group cursor-pointer" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden aspect-[3/4] mb-3" style={{ backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 p-2 transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#4a4a4a]'}`}
            />
          </button>
          {/* Bold border on hover */}
          <div className="absolute inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ border: '2px solid rgba(13,13,13,0.15)' }} />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', borderRadius: '2px' }}>
            <ImageWithFallback
              src={seller.avatar}
              alt={seller.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span style={{ fontSize: '12px', color: '#4a4a4a', fontWeight: 500 }}>{seller.name}</span>
          </div>
        </div>
      </Link>
      <div className="space-y-1">
        <p className="line-clamp-2" style={{ fontSize: '14px', color: '#0d0d0d', fontWeight: 500 }}>{title}</p>
        <div className="flex items-center justify-between">
          <p style={{ fontSize: '17px', color: '#d41c1c', fontFamily: "'Oswald', sans-serif", fontWeight: 600 }}>${price}</p>
          <p style={{ fontSize: '12px', color: '#888' }}>{likes} {v('likes', 'lượt thích')}</p>
        </div>
      </div>
    </div>
  );
}