import { ProductCard } from './ProductCard';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { productImage } from '@/app/data/productImages';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1728241965139-cf300d490f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjB2aW50YWdlfGVufDF8fHx8MTc3MDA0MzE5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Vintage Brown Leather Jacket',
    price: 89,
    seller: {
      name: 'Sophie',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    likes: 234,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzY5OTY2MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Classic White Sneakers',
    price: 65,
    seller: {
      name: 'Marcus',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    likes: 189,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556041068-5874261f23e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwamFja2V0JTIwZGVuaW18ZW58MXx8fHwxNzcwMDQzMTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Vintage Denim Jacket',
    price: 45,
    seller: {
      name: 'Emma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    likes: 312,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1601924928357-22d3b3abfcfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGhhbmRiYWd8ZW58MXx8fHwxNzcwMDEyNzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Designer Leather Handbag',
    price: 120,
    seller: {
      name: 'Olivia',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    },
    likes: 456,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1602303894456-398ce544d90b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzY5OTkxNDA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Floral Summer Dress',
    price: 38,
    seller: {
      name: 'Lily',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    },
    likes: 278,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1766928102358-86e329eef03b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzcwMDQwNTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Vintage Round Sunglasses',
    price: 25,
    seller: {
      name: 'Alex',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    likes: 145,
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1652474590303-b4d72bf9f61a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYm9vdHMlMjBmYXNoaW9ufGVufDF8fHx8MTc3MDAyNTIyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Classic Leather Boots',
    price: 95,
    seller: {
      name: 'James',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    },
    likes: 198,
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1768489038502-795fce66002e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdHNoaXJ0JTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAwNDMxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Graphic Print T-Shirt',
    price: 28,
    seller: {
      name: 'Maya',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    },
    likes: 167,
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1728241965139-cf300d490f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjB2aW50YWdlfGVufDF8fHx8MTc3MDA0MzE5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Vintage Striped Sweater',
    price: 42,
    seller: {
      name: 'Noah',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop',
    },
    likes: 221,
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1556041068-5874261f23e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwamFja2V0JTIwZGVuaW18ZW58MXx8fHwxNzcwMDQzMTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Oversized Denim Shirt',
    price: 35,
    seller: {
      name: 'Zoe',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop',
    },
    likes: 189,
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1601924928357-22d3b3abfcfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGhhbmRiYWd8ZW58MXx8fHwxNzcwMDEyNzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Mini Crossbody Bag',
    price: 55,
    seller: {
      name: 'Isabella',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    },
    likes: 334,
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzY5OTY2MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'High-Top Canvas Shoes',
    price: 48,
    seller: {
      name: 'Ethan',
      avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop',
    },
    likes: 156,
  },
];

export function ProductGrid() {
  const { v } = useLanguage();
  return (
    <div className="mx-auto px-4 lg:px-6 py-5" style={{ maxWidth: 'calc(75% + 320px)', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mb-8 text-center">
        <p className="mb-3" style={{ fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d41c1c', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>Collection</p>
        <h3 style={{ fontSize: '32px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Explore unique items', 'Khám phá sản phẩm độc đáo')}</h3>
        <p className="mt-2" style={{ fontSize: '15px', color: '#4a4a4a' }}>{v('Curated by our community of sellers', 'Được tuyển chọn bởi cộng đồng người bán của chúng tôi')}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product, i) => (
          <ProductCard key={product.id} {...product} image={productImage(i)} />
        ))}
      </div>
    </div>
  );
}