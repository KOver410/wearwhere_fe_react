// Mock data for Phase 5 — Smart Wardrobe & Store Locator

export interface WardrobeItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'bags' | 'accessories' | 'dresses';
  color: string;
  size: string;
  brand: string;
  style: string;
  addedAt: string;
  wornCount: number;
  lastWorn?: string;
  isFavorite: boolean;
}

export interface OutfitCombo {
  id: number;
  name: string;
  style: string;
  occasion: string;
  matchScore: number;
  items: WardrobeItem[];
  image: string;
  createdAt: string;
  isSaved: boolean;
}

export interface StyleSuggestion {
  id: number;
  title: string;
  description: string;
  matchScore: number;
  style: string;
  occasion: string;
  image: string;
  items: { id: number; name: string; image: string; brand: string; price: number; owned: boolean }[];
  weather?: string;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  brandSlug: string;
  image: string;
  images: string[];
  address: string;
  district: string;
  city: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  distance: number;
  rating: number;
  reviewCount: number;
  hours: { day: string; open: string; close: string }[];
  categories: string[];
  description: string;
  features: string[];
  isOpen: boolean;
  featuredProducts: { id: number; name: string; image: string; price: number }[];
}

export const wardrobeItems: WardrobeItem[] = [
  {
    id: 1, productId: 1,
    name: 'Vintage Brown Leather Jacket',
    image: 'https://images.unsplash.com/photo-1728241965139-cf300d490f7e?w=400',
    category: 'outerwear', color: 'Brown', size: 'M', brand: 'RETRO VAULT', style: 'vintage',
    addedAt: '2026-02-15', wornCount: 3, lastWorn: '2026-02-20', isFavorite: true,
  },
  {
    id: 2, productId: 2,
    name: 'Classic White Sneakers',
    image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?w=400',
    category: 'shoes', color: 'White', size: '42', brand: 'MINIMAL ATELIER', style: 'minimalist',
    addedAt: '2026-02-15', wornCount: 8, lastWorn: '2026-02-22', isFavorite: true,
  },
  {
    id: 3, productId: 3,
    name: 'Vintage Denim Jacket',
    image: 'https://images.unsplash.com/photo-1556041068-5874261f23e5?w=400',
    category: 'outerwear', color: 'Blue', size: 'S', brand: 'RETRO VAULT', style: 'vintage',
    addedAt: '2026-02-10', wornCount: 2, lastWorn: '2026-02-18', isFavorite: false,
  },
  {
    id: 4, productId: 8,
    name: 'Graphic Print T-Shirt',
    image: 'https://images.unsplash.com/photo-1768489038502-795fce66002e?w=400',
    category: 'tops', color: 'Black', size: 'L', brand: 'URBAN STUDIO', style: 'streetwear',
    addedAt: '2026-01-20', wornCount: 12, lastWorn: '2026-02-21', isFavorite: false,
  },
  {
    id: 5, productId: 9,
    name: 'Oversized Striped Sweater',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
    category: 'tops', color: 'White', size: 'M', brand: 'SEOUL VIBES', style: 'korean',
    addedAt: '2026-01-15', wornCount: 6, lastWorn: '2026-02-14', isFavorite: true,
  },
  {
    id: 6, productId: 11,
    name: 'Mini Crossbody Bag',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'bags', color: 'Brown', size: 'One Size', brand: 'MINIMAL ATELIER', style: 'minimalist',
    addedAt: '2026-01-15', wornCount: 15, lastWorn: '2026-02-22', isFavorite: true,
  },
  {
    id: 7, productId: 13,
    name: 'Eco Cotton Tee',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'tops', color: 'White', size: 'M', brand: 'ECO THREAD', style: 'minimalist',
    addedAt: '2026-01-10', wornCount: 20, lastWorn: '2026-02-22', isFavorite: false,
  },
  {
    id: 8, productId: 14,
    name: 'Korean Oversized Blazer',
    image: 'https://images.unsplash.com/photo-1598033067000-6a57d614b183?w=400',
    category: 'outerwear', color: 'Black', size: 'L', brand: 'SEOUL VIBES', style: 'korean',
    addedAt: '2026-01-08', wornCount: 4, lastWorn: '2026-02-10', isFavorite: false,
  },
  {
    id: 9, productId: 6,
    name: 'Vintage Round Sunglasses',
    image: 'https://images.unsplash.com/photo-1766928102358-86e329eef03b?w=400',
    category: 'accessories', color: 'Black', size: 'One Size', brand: 'RETRO VAULT', style: 'vintage',
    addedAt: '2025-12-25', wornCount: 10, lastWorn: '2026-02-19', isFavorite: true,
  },
  {
    id: 10, productId: 7,
    name: 'Classic Leather Boots',
    image: 'https://images.unsplash.com/photo-1652474590303-b4d72bf9f61a?w=400',
    category: 'shoes', color: 'Brown', size: 'L', brand: 'LUXE COLLECTIVE', style: 'classic',
    addedAt: '2025-12-20', wornCount: 7, lastWorn: '2026-02-16', isFavorite: false,
  },
  {
    id: 11, productId: 5,
    name: 'Floral Summer Dress',
    image: 'https://images.unsplash.com/photo-1602303894456-398ce544d90b?w=400',
    category: 'dresses', color: 'Pink', size: 'S', brand: 'ECO THREAD', style: 'bohemian',
    addedAt: '2025-12-15', wornCount: 3, lastWorn: '2026-01-28', isFavorite: false,
  },
  {
    id: 12, productId: 4,
    name: 'Designer Leather Handbag',
    image: 'https://images.unsplash.com/photo-1601924928357-22d3b3abfcfb?w=400',
    category: 'bags', color: 'Brown', size: 'One Size', brand: 'LUXE COLLECTIVE', style: 'classic',
    addedAt: '2026-02-05', wornCount: 5, lastWorn: '2026-02-20', isFavorite: true,
  },
  {
    id: 13, productId: 10,
    name: 'Streetwear Cargo Pants',
    image: 'https://images.unsplash.com/photo-1766028018233-dcec52e86ad5?w=400',
    category: 'bottoms', color: 'Black', size: 'M', brand: 'URBAN STUDIO', style: 'streetwear',
    addedAt: '2026-01-25', wornCount: 9, lastWorn: '2026-02-21', isFavorite: false,
  },
  {
    id: 14, productId: 15,
    name: 'Slim Fit Chino Pants',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    category: 'bottoms', color: 'Beige', size: 'L', brand: 'MINIMAL ATELIER', style: 'minimalist',
    addedAt: '2026-01-12', wornCount: 14, lastWorn: '2026-02-22', isFavorite: true,
  },
  {
    id: 15, productId: 17,
    name: 'High-Waist Wide Leg Jeans',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    category: 'bottoms', color: 'Blue', size: 'S', brand: 'RETRO VAULT', style: 'vintage',
    addedAt: '2025-12-28', wornCount: 6, lastWorn: '2026-02-17', isFavorite: false,
  },
];

export const styleSuggestions: StyleSuggestion[] = [
  {
    id: 1,
    title: 'Casual Street Look',
    description: 'Perfect for weekend outings and coffee dates. Pair your graphic tee with the denim jacket for an effortless street vibe.',
    matchScore: 95,
    style: 'streetwear',
    occasion: 'Casual',
    image: 'https://images.unsplash.com/photo-1665650401573-8b33ca641315?w=600',
    weather: 'Warm',
    items: [
      { id: 4, name: 'Graphic Print T-Shirt', image: 'https://images.unsplash.com/photo-1768489038502-795fce66002e?w=200', brand: 'URBAN STUDIO', price: 38, owned: true },
      { id: 3, name: 'Vintage Denim Jacket', image: 'https://images.unsplash.com/photo-1556041068-5874261f23e5?w=200', brand: 'RETRO VAULT', price: 75, owned: true },
      { id: 2, name: 'Classic White Sneakers', image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?w=200', brand: 'MINIMAL ATELIER', price: 129, owned: true },
    ],
  },
  {
    id: 2,
    title: 'Smart Casual Date Night',
    description: 'Make a statement with the Korean blazer, eco cotton tee, and classic boots. Refined yet relaxed for evening occasions.',
    matchScore: 92,
    style: 'korean',
    occasion: 'Date Night',
    image: 'https://images.unsplash.com/photo-1763256433396-e088d31cabd4?w=600',
    weather: 'Cool',
    items: [
      { id: 7, name: 'Eco Cotton Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200', brand: 'ECO THREAD', price: 42, owned: true },
      { id: 8, name: 'Korean Oversized Blazer', image: 'https://images.unsplash.com/photo-1598033067000-6a57d614b183?w=200', brand: 'SEOUL VIBES', price: 135, owned: true },
      { id: 10, name: 'Classic Leather Boots', image: 'https://images.unsplash.com/photo-1652474590303-b4d72bf9f61a?w=200', brand: 'LUXE COLLECTIVE', price: 225, owned: true },
    ],
  },
  {
    id: 3,
    title: 'Boho Weekend Brunch',
    description: 'Embrace your free spirit with the floral dress, crossbody bag, and vintage sunglasses. Perfect for sunny brunch outings.',
    matchScore: 88,
    style: 'bohemian',
    occasion: 'Brunch',
    image: 'https://images.unsplash.com/photo-1611218379105-afcc7483b5dd?w=600',
    weather: 'Sunny',
    items: [
      { id: 11, name: 'Floral Summer Dress', image: 'https://images.unsplash.com/photo-1602303894456-398ce544d90b?w=200', brand: 'ECO THREAD', price: 58, owned: true },
      { id: 6, name: 'Mini Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', brand: 'MINIMAL ATELIER', price: 119, owned: true },
      { id: 9, name: 'Vintage Round Sunglasses', image: 'https://images.unsplash.com/photo-1766928102358-86e329eef03b?w=200', brand: 'RETRO VAULT', price: 45, owned: true },
    ],
  },
  {
    id: 4,
    title: 'Vintage Explorer',
    description: 'Channel vintage cool with the leather jacket, round sunglasses, and leather boots. Great for exploring the city.',
    matchScore: 90,
    style: 'vintage',
    occasion: 'City Walk',
    image: 'https://images.unsplash.com/photo-1610336460518-c12d51f06f61?w=600',
    weather: 'Mild',
    items: [
      { id: 1, name: 'Vintage Brown Leather Jacket', image: 'https://images.unsplash.com/photo-1728241965139-cf300d490f7e?w=200', brand: 'RETRO VAULT', price: 149, owned: true },
      { id: 9, name: 'Vintage Round Sunglasses', image: 'https://images.unsplash.com/photo-1766928102358-86e329eef03b?w=200', brand: 'RETRO VAULT', price: 45, owned: true },
      { id: 10, name: 'Classic Leather Boots', image: 'https://images.unsplash.com/photo-1652474590303-b4d72bf9f61a?w=200', brand: 'LUXE COLLECTIVE', price: 225, owned: true },
      { id: 20, name: 'Slim Fit Chino Pants', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200', brand: 'MINIMAL ATELIER', price: 75, owned: false },
    ],
  },
  {
    id: 5,
    title: 'Korean Cozy Day',
    description: 'Comfort meets style with the oversized striped sweater and white sneakers. Add the designer handbag for a touch of luxury.',
    matchScore: 86,
    style: 'korean',
    occasion: 'Shopping',
    image: 'https://images.unsplash.com/photo-1765337210176-1bb643f4776b?w=600',
    weather: 'Cool',
    items: [
      { id: 5, name: 'Oversized Striped Sweater', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200', brand: 'SEOUL VIBES', price: 72, owned: true },
      { id: 2, name: 'Classic White Sneakers', image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?w=200', brand: 'MINIMAL ATELIER', price: 129, owned: true },
      { id: 12, name: 'Designer Leather Handbag', image: 'https://images.unsplash.com/photo-1601924928357-22d3b3abfcfb?w=200', brand: 'LUXE COLLECTIVE', price: 320, owned: true },
    ],
  },
  {
    id: 6,
    title: 'Minimalist Office',
    description: 'Clean, professional look with the eco cotton tee under the Korean blazer. Pair with the crossbody for a polished commute.',
    matchScore: 84,
    style: 'minimalist',
    occasion: 'Work',
    image: 'https://images.unsplash.com/photo-1763256433396-e088d31cabd4?w=600',
    weather: 'Any',
    items: [
      { id: 7, name: 'Eco Cotton Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200', brand: 'ECO THREAD', price: 42, owned: true },
      { id: 8, name: 'Korean Oversized Blazer', image: 'https://images.unsplash.com/photo-1598033067000-6a57d614b183?w=200', brand: 'SEOUL VIBES', price: 135, owned: true },
      { id: 6, name: 'Mini Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', brand: 'MINIMAL ATELIER', price: 119, owned: true },
      { id: 18, name: 'Tailored Wool Trousers', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200', brand: 'MINIMAL ATELIER', price: 95, owned: false },
    ],
  },
];

export const stores: Store[] = [
  {
    id: 1, name: 'Urban Studio Flagship', slug: 'urban-studio-flagship',
    brandName: 'URBAN STUDIO', brandSlug: 'urban-studio',
    image: 'https://images.unsplash.com/photo-1769107805412-90d9191d53e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYm91dGlxdWUlMjBzdG9yZSUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc3MTc0NzQyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1769107805412-90d9191d53e9?w=800',
      'https://images.unsplash.com/photo-1769107805465-bfd41863f1a0?w=800',
    ],
    address: '123 Nguyen Hue Street', district: 'District 1', city: 'Ho Chi Minh City',
    phone: '+84 28 3822 1234', email: 'flagship@urbanstudio.vn',
    lat: 10.7731, lng: 106.7030, distance: 0.5,
    rating: 4.8, reviewCount: 234,
    hours: [
      { day: 'Mon-Fri', open: '09:00', close: '21:00' },
      { day: 'Sat-Sun', open: '10:00', close: '22:00' },
    ],
    categories: ['Streetwear', 'T-Shirts', 'Hoodies', 'Sneakers'],
    description: 'Our flagship store in the heart of District 1. Two floors of the latest streetwear collections, exclusive drops, and a custom printing station.',
    features: ['Fitting rooms', 'Custom printing', 'Free Wi-Fi', 'In-store events'],
    isOpen: true,
    featuredProducts: [
      { id: 8, name: 'Graphic Print T-Shirt', image: 'https://images.unsplash.com/photo-1768489038502-795fce66002e?w=200', price: 38 },
      { id: 16, name: 'Running Performance Shoes', image: 'https://images.unsplash.com/photo-1762943107238-a87f6f7bf6a9?w=200', price: 129 },
      { id: 10, name: 'Streetwear Cargo Pants', image: 'https://images.unsplash.com/photo-1766028018233-dcec52e86ad5?w=200', price: 65 },
    ],
  },
  {
    id: 2, name: 'Minimal Atelier Boutique', slug: 'minimal-atelier-boutique',
    brandName: 'MINIMAL ATELIER', brandSlug: 'minimal-atelier',
    image: 'https://images.unsplash.com/photo-1759050486852-fdfe2fdc7bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXB0JTIwc3RvcmUlMjBkZXNpZ24lMjBpbnRlcmlvciUyMG1pbmltYWx8ZW58MXx8fHwxNzcxNzQ3NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1759050486852-fdfe2fdc7bea?w=800',
    ],
    address: '45 Le Loi Boulevard', district: 'District 1', city: 'Ho Chi Minh City',
    phone: '+84 28 3822 5678', email: 'boutique@minimalatelier.vn',
    lat: 10.7726, lng: 106.6980, distance: 1.2,
    rating: 4.9, reviewCount: 189,
    hours: [
      { day: 'Mon-Fri', open: '10:00', close: '20:00' },
      { day: 'Sat-Sun', open: '10:00', close: '21:00' },
    ],
    categories: ['Minimalist', 'Basics', 'Shoes', 'Bags'],
    description: 'A serene space designed for mindful shopping. Discover clean-cut essentials crafted from premium, sustainable materials.',
    features: ['Personal styling', 'Coffee corner', 'Gift wrapping', 'Alteration service'],
    isOpen: true,
    featuredProducts: [
      { id: 2, name: 'Classic White Sneakers', image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?w=200', price: 129 },
      { id: 11, name: 'Mini Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', price: 119 },
    ],
  },
  {
    id: 3, name: 'Retro Vault Store', slug: 'retro-vault-store',
    brandName: 'RETRO VAULT', brandSlug: 'retro-vault',
    image: 'https://images.unsplash.com/photo-1770064728838-6c729fdfd89c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdGhyaWZ0JTIwc3RvcmUlMjByYWNrcyUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MTc0NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1770064728838-6c729fdfd89c?w=800',
    ],
    address: '789 Tran Hung Dao Street', district: 'District 5', city: 'Ho Chi Minh City',
    phone: '+84 28 3838 9999', email: 'store@retrovault.vn',
    lat: 10.7540, lng: 106.6782, distance: 2.8,
    rating: 4.7, reviewCount: 156,
    hours: [
      { day: 'Mon-Fri', open: '11:00', close: '20:00' },
      { day: 'Sat-Sun', open: '10:00', close: '21:00' },
    ],
    categories: ['Vintage', 'Jackets', 'Accessories', 'Denim'],
    description: 'Step back in time with our curated collection of vintage fashion from the 70s to 90s. Every piece tells a story.',
    features: ['Vintage finds', 'Restoration service', 'Photo corner', 'Weekly new arrivals'],
    isOpen: true,
    featuredProducts: [
      { id: 1, name: 'Vintage Brown Leather Jacket', image: 'https://images.unsplash.com/photo-1728241965139-cf300d490f7e?w=200', price: 149 },
      { id: 3, name: 'Vintage Denim Jacket', image: 'https://images.unsplash.com/photo-1556041068-5874261f23e5?w=200', price: 75 },
      { id: 6, name: 'Vintage Round Sunglasses', image: 'https://images.unsplash.com/photo-1766928102358-86e329eef03b?w=200', price: 45 },
    ],
  },
  {
    id: 4, name: 'Luxe Collective Gallery', slug: 'luxe-collective-gallery',
    brandName: 'LUXE COLLECTIVE', brandSlug: 'luxe-collective',
    image: 'https://images.unsplash.com/photo-1769766408016-38b111720e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXRhaWwlMjBzaG9wJTIwZGlzcGxheSUyMHdpbmRvd3xlbnwxfHx8fDE3NzE3NDc0MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1769766408016-38b111720e3d?w=800',
    ],
    address: '10 Dong Khoi Street', district: 'District 1', city: 'Ho Chi Minh City',
    phone: '+84 28 3824 0000', email: 'gallery@luxecollective.vn',
    lat: 10.7767, lng: 106.7035, distance: 0.8,
    rating: 4.9, reviewCount: 312,
    hours: [
      { day: 'Mon-Sun', open: '10:00', close: '22:00' },
    ],
    categories: ['Luxury', 'Bags', 'Accessories', 'Shoes'],
    description: 'An art gallery meets luxury retail. Experience premium craftsmanship in an immersive environment featuring rotating art installations.',
    features: ['VIP lounge', 'Personal shopping', 'Champagne bar', 'Monogramming'],
    isOpen: true,
    featuredProducts: [
      { id: 4, name: 'Designer Leather Handbag', image: 'https://images.unsplash.com/photo-1601924928357-22d3b3abfcfb?w=200', price: 320 },
      { id: 7, name: 'Classic Leather Boots', image: 'https://images.unsplash.com/photo-1652474590303-b4d72bf9f61a?w=200', price: 225 },
    ],
  },
  {
    id: 5, name: 'Seoul Vibes K-Town', slug: 'seoul-vibes-ktown',
    brandName: 'SEOUL VIBES', brandSlug: 'seoul-vibes',
    image: 'https://images.unsplash.com/photo-1672706436113-b88452b16260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMHNob3AlMjBzdG9yZWZyb250JTIwdXJiYW4lMjBjaXR5fGVufDF8fHx8MTc3MTc0NzQzMHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1672706436113-b88452b16260?w=800',
    ],
    address: '56 Pham Ngu Lao Street', district: 'District 1', city: 'Ho Chi Minh City',
    phone: '+84 28 3836 5555', email: 'ktown@seoulvibes.vn',
    lat: 10.7688, lng: 106.6938, distance: 1.5,
    rating: 4.7, reviewCount: 278,
    hours: [
      { day: 'Mon-Thu', open: '10:00', close: '21:00' },
      { day: 'Fri-Sun', open: '10:00', close: '22:00' },
    ],
    categories: ['K-Fashion', 'Y2K', 'Sweaters', 'Blazers'],
    description: 'Your one-stop shop for Korean-inspired fashion. From cute to edgy, find the perfect K-style outfit for every mood.',
    features: ['K-pop playlist', 'Photo booth', 'Style consultation', 'New drops every Friday'],
    isOpen: false,
    featuredProducts: [
      { id: 14, name: 'Korean Oversized Blazer', image: 'https://images.unsplash.com/photo-1598033067000-6a57d614b183?w=200', price: 135 },
      { id: 9, name: 'Oversized Striped Sweater', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200', price: 72 },
    ],
  },
  {
    id: 6, name: 'Eco Thread Garden', slug: 'eco-thread-garden',
    brandName: 'ECO THREAD', brandSlug: 'eco-thread',
    image: 'https://images.unsplash.com/photo-1767532857468-78145d499786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd2FyZHJvYmUlMjBjbG9zZXQlMjBvcmdhbml6ZWQlMjBjbG90aGVzfGVufDF8fHx8MTc3MTc0NzQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1767532857468-78145d499786?w=800',
    ],
    address: '88 Xuan Thuy Street', district: 'Thu Duc City', city: 'Ho Chi Minh City',
    phone: '+84 28 3720 8888', email: 'garden@ecothread.vn',
    lat: 10.8020, lng: 106.7220, distance: 5.2,
    rating: 4.6, reviewCount: 145,
    hours: [
      { day: 'Mon-Sun', open: '09:00', close: '20:00' },
    ],
    categories: ['Sustainable', 'Organic', 'Basics', 'Linen'],
    description: 'Nestled in a garden setting, our eco-conscious store uses recycled materials throughout. Enjoy sustainable fashion surrounded by greenery.',
    features: ['Garden café', 'Recycling station', 'Workshops', 'Organic cotton samples'],
    isOpen: true,
    featuredProducts: [
      { id: 13, name: 'Eco Cotton Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200', price: 42 },
      { id: 5, name: 'Floral Summer Dress', image: 'https://images.unsplash.com/photo-1602303894456-398ce544d90b?w=200', price: 58 },
    ],
  },
];