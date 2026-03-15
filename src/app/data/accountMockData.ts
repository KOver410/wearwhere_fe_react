// Mock data for Phase 3 (User Account) & Phase 4 (Social/OOTD)

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  ootdCount: number;
  location: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  brand: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reason: string;
  items: OrderItem[];
  refundAmount: number;
  refundMethod: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'momo' | 'zalopay';
  last4: string;
  expiryDate: string;
  holderName: string;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  type: 'order' | 'promo' | 'social' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
  image?: string;
}

export interface OOTDPost {
  id: number;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    verified: boolean;
  };
  image: string;
  caption: string;
  tags: string[];
  products: { id: number; name: string; brand: string; price: number; image: string }[];
  likes: number;
  comments: OOTDComment[];
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  style: string;
  location?: string;
}

export interface OOTDComment {
  id: number;
  user: { username: string; avatar: string };
  text: string;
  date: string;
  likes: number;
}

export const currentUser: UserProfile = {
  id: 'u1',
  username: 'fashionista_vn',
  fullName: 'Nguyễn Minh Anh',
  email: 'minhanh@gmail.com',
  phone: '+84 901 234 567',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  bio: 'Fashion lover | Streetwear enthusiast | Saigon based 🇻🇳',
  joinDate: '2025-06-15',
  followers: 1240,
  following: 380,
  ootdCount: 24,
  location: 'Ho Chi Minh City',
};

export const orders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'WW-2026021501',
    date: '2026-02-15',
    status: 'delivered',
    items: [
      { id: 1, name: 'Vintage Brown Leather Jacket', image: 'https://images.unsplash.com/photo-1728241965139-cf300d490f7e?w=400', size: 'M', color: 'Brown', price: 149, quantity: 1, brand: 'RETRO VAULT' },
      { id: 2, name: 'Classic White Sneakers', image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?w=400', size: '42', color: 'White', price: 129, quantity: 1, brand: 'MINIMAL ATELIER' },
    ],
    subtotal: 278,
    shipping: 0,
    discount: 27.8,
    tax: 20.02,
    total: 270.22,
    shippingAddress: { id: 'a1', label: 'Home', fullName: 'Nguyễn Minh Anh', phone: '+84 901 234 567', street: '123 Nguyen Hue Street', city: 'District 1', state: 'HCMC', zipCode: '70000', country: 'Vietnam', isDefault: true },
    paymentMethod: 'Visa •••• 4242',
    trackingNumber: 'VN123456789',
    estimatedDelivery: 'Feb 20, 2026',
  },
  {
    id: 'ord-2',
    orderNumber: 'WW-2026021001',
    date: '2026-02-10',
    status: 'shipped',
    items: [
      { id: 3, name: 'Vintage Denim Jacket', image: 'https://images.unsplash.com/photo-1556041068-5874261f23e5?w=400', size: 'S', color: 'Blue', price: 75, quantity: 1, brand: 'RETRO VAULT' },
    ],
    subtotal: 75,
    shipping: 5,
    discount: 0,
    tax: 6,
    total: 86,
    shippingAddress: { id: 'a1', label: 'Home', fullName: 'Nguyễn Minh Anh', phone: '+84 901 234 567', street: '123 Nguyen Hue Street', city: 'District 1', state: 'HCMC', zipCode: '70000', country: 'Vietnam', isDefault: true },
    paymentMethod: 'MoMo',
    trackingNumber: 'VN987654321',
    estimatedDelivery: 'Feb 18, 2026',
  },
  {
    id: 'ord-3',
    orderNumber: 'WW-2026020501',
    date: '2026-02-05',
    status: 'processing',
    items: [
      { id: 4, name: 'Designer Leather Handbag', image: 'https://images.unsplash.com/photo-1601924928357-22d3b3abfcfb?w=400', size: 'One Size', color: 'Brown', price: 320, quantity: 1, brand: 'LUXE COLLECTIVE' },
      { id: 15, name: 'Gold Chain Necklace', image: 'https://images.unsplash.com/photo-1724896728499-2e7ecef652a8?w=400', size: 'One Size', color: 'Gold', price: 89, quantity: 1, brand: 'LUXE COLLECTIVE' },
    ],
    subtotal: 409,
    shipping: 0,
    discount: 50,
    tax: 28.72,
    total: 387.72,
    shippingAddress: { id: 'a2', label: 'Office', fullName: 'Nguyễn Minh Anh', phone: '+84 901 234 567', street: '456 Le Loi Blvd', city: 'District 1', state: 'HCMC', zipCode: '70000', country: 'Vietnam', isDefault: false },
    paymentMethod: 'Visa •••• 4242',
  },
  {
    id: 'ord-4',
    orderNumber: 'WW-2026012001',
    date: '2026-01-20',
    status: 'cancelled',
    items: [
      { id: 8, name: 'Graphic Print T-Shirt', image: 'https://images.unsplash.com/photo-1768489038502-795fce66002e?w=400', size: 'L', color: 'Black', price: 38, quantity: 2, brand: 'URBAN STUDIO' },
    ],
    subtotal: 76,
    shipping: 5,
    discount: 0,
    tax: 6.08,
    total: 87.08,
    shippingAddress: { id: 'a1', label: 'Home', fullName: 'Nguyễn Minh Anh', phone: '+84 901 234 567', street: '123 Nguyen Hue Street', city: 'District 1', state: 'HCMC', zipCode: '70000', country: 'Vietnam', isDefault: true },
    paymentMethod: 'ZaloPay',
  },
  {
    id: 'ord-5',
    orderNumber: 'WW-2026011501',
    date: '2026-01-15',
    status: 'delivered',
    items: [
      { id: 11, name: 'Mini Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', size: 'One Size', color: 'Brown', price: 119, quantity: 1, brand: 'MINIMAL ATELIER' },
      { id: 9, name: 'Oversized Striped Sweater', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', size: 'M', color: 'White', price: 72, quantity: 1, brand: 'SEOUL VIBES' },
    ],
    subtotal: 191,
    shipping: 0,
    discount: 19.1,
    tax: 13.75,
    total: 185.65,
    shippingAddress: { id: 'a1', label: 'Home', fullName: 'Nguyễn Minh Anh', phone: '+84 901 234 567', street: '123 Nguyen Hue Street', city: 'District 1', state: 'HCMC', zipCode: '70000', country: 'Vietnam', isDefault: true },
    paymentMethod: 'Visa •••• 4242',
    trackingNumber: 'VN111222333',
  },
];

export const returns: ReturnRequest[] = [
  {
    id: 'ret-1',
    orderId: 'ord-5',
    orderNumber: 'WW-2026011501',
    date: '2026-01-22',
    status: 'completed',
    reason: 'Size too small, need to exchange for a larger size',
    items: [
      { id: 9, name: 'Oversized Striped Sweater', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', size: 'M', color: 'White', price: 72, quantity: 1, brand: 'SEOUL VIBES' },
    ],
    refundAmount: 72,
    refundMethod: 'Original payment method',
  },
  {
    id: 'ret-2',
    orderId: 'ord-1',
    orderNumber: 'WW-2026021501',
    date: '2026-02-20',
    status: 'pending',
    reason: 'Product quality not as expected',
    items: [
      { id: 2, name: 'Classic White Sneakers', image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?w=400', size: '42', color: 'White', price: 129, quantity: 1, brand: 'MINIMAL ATELIER' },
    ],
    refundAmount: 129,
    refundMethod: 'Store credit',
  },
];

export const addresses: Address[] = [
  { id: 'a1', label: 'Home', fullName: 'Nguyễn Minh Anh', phone: '+84 901 234 567', street: '123 Nguyen Hue Street', city: 'District 1', state: 'HCMC', zipCode: '70000', country: 'Vietnam', isDefault: true },
  { id: 'a2', label: 'Office', fullName: 'Nguyễn Minh Anh', phone: '+84 901 234 567', street: '456 Le Loi Blvd, Floor 5', city: 'District 1', state: 'HCMC', zipCode: '70000', country: 'Vietnam', isDefault: false },
  { id: 'a3', label: 'Parents', fullName: 'Nguyễn Văn Bình', phone: '+84 912 345 678', street: '789 Tran Hung Dao', city: 'District 5', state: 'HCMC', zipCode: '70000', country: 'Vietnam', isDefault: false },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'pm1', type: 'visa', last4: '4242', expiryDate: '12/27', holderName: 'NGUYEN MINH ANH', isDefault: true },
  { id: 'pm2', type: 'mastercard', last4: '8888', expiryDate: '06/28', holderName: 'NGUYEN MINH ANH', isDefault: false },
  { id: 'pm3', type: 'momo', last4: '4567', expiryDate: '', holderName: 'Nguyễn Minh Anh', isDefault: false },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'order', title: 'Order Shipped', message: 'Your order WW-2026021001 has been shipped! Track your package.', date: '2026-02-12', read: false, link: '/account/orders/ord-2', image: 'https://images.unsplash.com/photo-1556041068-5874261f23e5?w=100' },
  { id: 'n2', type: 'promo', title: 'Flash Sale 30% OFF', message: 'Don\'t miss our flash sale! 30% off on all streetwear items. Limited time only.', date: '2026-02-11', read: false },
  { id: 'n3', type: 'social', title: 'New Follower', message: '@style_queen started following you!', date: '2026-02-10', read: true, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: 'n4', type: 'order', title: 'Order Delivered', message: 'Your order WW-2026021501 has been delivered. Rate your purchase!', date: '2026-02-08', read: true, link: '/account/orders/ord-1' },
  { id: 'n5', type: 'social', title: 'OOTD Liked', message: 'Your OOTD post received 50 new likes! 🔥', date: '2026-02-07', read: true, link: '/ootd/1' },
  { id: 'n6', type: 'promo', title: 'New Voucher Available', message: 'You received a $50 OFF voucher from LUXE COLLECTIVE. Use code LUXE50.', date: '2026-02-05', read: true, link: '/vouchers' },
  { id: 'n7', type: 'system', title: 'Password Changed', message: 'Your password was successfully changed. If you didn\'t make this change, contact support.', date: '2026-02-01', read: true },
  { id: 'n8', type: 'order', title: 'Return Approved', message: 'Your return request for order WW-2026011501 has been approved.', date: '2026-01-25', read: true, link: '/account/returns' },
];

export const ootdPosts: OOTDPost[] = [
  {
    id: 1,
    user: { id: 'u1', username: 'fashionista_vn', fullName: 'Nguyễn Minh Anh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', verified: false },
    image: 'https://images.unsplash.com/photo-1768221677512-896e1d816eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvb3RkJTIwb3V0Zml0JTIwbWlycm9yJTIwc2VsZmllJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE3NDY0MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Weekend vibes ✨ Loving this oversized jacket combo. Perfect for coffee dates!',
    tags: ['streetwear', 'weekend', 'ootd', 'jacket'],
    products: [
      { id: 1, name: 'Vintage Brown Leather Jacket', brand: 'RETRO VAULT', price: 149, image: 'https://images.unsplash.com/photo-1728241965139-cf300d490f7e?w=200' },
      { id: 2, name: 'Classic White Sneakers', brand: 'MINIMAL ATELIER', price: 129, image: 'https://images.unsplash.com/photo-1723776964688-8d2eb30327c7?w=200' },
    ],
    likes: 234,
    comments: [
      { id: 1, user: { username: 'style_queen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }, text: 'Love this look! 😍', date: '2h ago', likes: 12 },
      { id: 2, user: { username: 'urban_guy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }, text: 'Where did you get the jacket?', date: '1h ago', likes: 3 },
    ],
    createdAt: '2026-02-22T10:30:00',
    isLiked: false,
    isSaved: false,
    style: 'streetwear',
    location: 'Saigon, Vietnam',
  },
  {
    id: 2,
    user: { id: 'u2', username: 'style_queen', fullName: 'Trần Thị Bảo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', verified: true },
    image: 'https://images.unsplash.com/photo-1700832161047-e4bf2fddaa9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzdHlsZSUyMGZhc2hpb24lMjBwaG90byUyMHVyYmFufGVufDF8fHx8MTc3MTc0NjQwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Street style day 🖤 Mixing vintage with modern pieces. This denim jacket is everything!',
    tags: ['vintage', 'denim', 'streetstyle', 'ootd'],
    products: [
      { id: 3, name: 'Vintage Denim Jacket', brand: 'RETRO VAULT', price: 75, image: 'https://images.unsplash.com/photo-1556041068-5874261f23e5?w=200' },
    ],
    likes: 456,
    comments: [
      { id: 3, user: { username: 'fashionista_vn', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }, text: 'Stunning as always! 🔥', date: '3h ago', likes: 8 },
    ],
    createdAt: '2026-02-21T14:00:00',
    isLiked: true,
    isSaved: false,
    style: 'vintage',
    location: 'Hanoi, Vietnam',
  },
  {
    id: 3,
    user: { id: 'u3', username: 'urban_guy', fullName: 'Lê Hoàng Nam', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', verified: false },
    image: 'https://images.unsplash.com/photo-1765872433035-b71e6aa2734b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBvdXRmaXQlMjBjb2ZmZWUlMjBzaG9wJTIwYWVzdGhldGljfGVufDF8fHx8MTc3MTc0NjQwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Cafe hopping outfit ☕ Minimal is my vibe. This eco cotton tee is so comfortable.',
    tags: ['minimalist', 'casual', 'cafe', 'eco'],
    products: [
      { id: 13, name: 'Eco Cotton Tee', brand: 'ECO THREAD', price: 42, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
      { id: 20, name: 'Slim Fit Chino Pants', brand: 'MINIMAL ATELIER', price: 75, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
    ],
    likes: 189,
    comments: [],
    createdAt: '2026-02-20T09:15:00',
    isLiked: false,
    isSaved: true,
    style: 'minimalist',
    location: 'Da Nang, Vietnam',
  },
  {
    id: 4,
    user: { id: 'u4', username: 'kfashion_luna', fullName: 'Phạm Thùy Linh', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', verified: true },
    image: 'https://images.unsplash.com/photo-1770657249870-626b05295f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBvdXRmaXQlMjBiZWFjaCUyMHZhY2F0aW9uJTIwc3R5bGV8ZW58MXx8fHwxNzcxNzQ2NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Beach day fit 🌊 Summer collection from Seoul Vibes is a must-have!',
    tags: ['korean', 'summer', 'beach', 'y2k'],
    products: [
      { id: 19, name: 'Y2K Crop Top', brand: 'SEOUL VIBES', price: 32, image: 'https://images.unsplash.com/photo-1763559008868-f5d0f308253b?w=200' },
    ],
    likes: 321,
    comments: [
      { id: 4, user: { username: 'style_queen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }, text: 'Beach vibes! 🏖️', date: '5h ago', likes: 15 },
      { id: 5, user: { username: 'urban_guy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }, text: 'Perfect summer look', date: '4h ago', likes: 7 },
    ],
    createdAt: '2026-02-19T16:30:00',
    isLiked: true,
    isSaved: true,
    style: 'korean',
    location: 'Nha Trang, Vietnam',
  },
  {
    id: 5,
    user: { id: 'u5', username: 'dapper_dan', fullName: 'Võ Đức Anh', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', verified: false },
    image: 'https://images.unsplash.com/photo-1600002554191-2dd6945302f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwb3NlJTIwb3V0ZG9vciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTc0NjQwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Blazer game strong 💪 Korean oversized blazer for the win. Smart casual done right.',
    tags: ['korean', 'blazer', 'smartcasual', 'men'],
    products: [
      { id: 14, name: 'Korean Oversized Blazer', brand: 'SEOUL VIBES', price: 135, image: 'https://images.unsplash.com/photo-1598033067000-6a57d614b183?w=200' },
    ],
    likes: 267,
    comments: [
      { id: 6, user: { username: 'fashionista_vn', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }, text: 'So dapper! 🤵', date: '1d ago', likes: 20 },
    ],
    createdAt: '2026-02-18T11:00:00',
    isLiked: false,
    isSaved: false,
    style: 'korean',
  },
  {
    id: 6,
    user: { id: 'u1', username: 'fashionista_vn', fullName: 'Nguyễn Minh Anh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', verified: false },
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb3V0Zml0JTIwZmxhdCUyMGxheSUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MTc0NjQwOHww&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Flat lay Friday 📸 All my essentials for a minimalist wardrobe.',
    tags: ['minimalist', 'flatlay', 'wardrobe', 'essentials'],
    products: [
      { id: 13, name: 'Eco Cotton Tee', brand: 'ECO THREAD', price: 42, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
      { id: 17, name: 'Linen Wide Leg Pants', brand: 'ECO THREAD', price: 68, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200' },
    ],
    likes: 178,
    comments: [],
    createdAt: '2026-02-17T08:00:00',
    isLiked: false,
    isSaved: false,
    style: 'minimalist',
  },
  {
    id: 7,
    user: { id: 'u6', username: 'sporty_mai', fullName: 'Đặng Mai Chi', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop', verified: false },
    image: 'https://images.unsplash.com/photo-1768929096134-f45af7839e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHklMjBhdGhsZWlzdXJlJTIwZ3ltJTIwb3V0Zml0JTIwd29tYW58ZW58MXx8fHwxNzcxNzQ2NDA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Gym fit check 💪 These running shoes are absolutely amazing for training sessions!',
    tags: ['sporty', 'gym', 'athleisure', 'running'],
    products: [
      { id: 16, name: 'Running Performance Shoes', brand: 'URBAN STUDIO', price: 129, image: 'https://images.unsplash.com/photo-1762943107238-a87f6f7bf6a9?w=200' },
    ],
    likes: 145,
    comments: [
      { id: 7, user: { username: 'urban_guy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }, text: 'Need those shoes! 👟', date: '2d ago', likes: 5 },
    ],
    createdAt: '2026-02-16T07:30:00',
    isLiked: false,
    isSaved: false,
    style: 'sporty',
  },
  {
    id: 8,
    user: { id: 'u2', username: 'style_queen', fullName: 'Trần Thị Bảo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', verified: true },
    image: 'https://images.unsplash.com/photo-1765337210176-1bb643f4776b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwa25pdCUyMHN3ZWF0ZXIlMjBhdXR1bW4lMjBmYXNoaW9ufGVufDF8fHx8MTc3MTc0NjQwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Cozy vibes for cooler days 🧶 This sweater is a dream!',
    tags: ['cozy', 'sweater', 'autumn', 'korean'],
    products: [
      { id: 9, name: 'Oversized Striped Sweater', brand: 'SEOUL VIBES', price: 72, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200' },
    ],
    likes: 398,
    comments: [
      { id: 8, user: { username: 'kfashion_luna', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }, text: 'So cozy! Need this sweater 💕', date: '3d ago', likes: 25 },
    ],
    createdAt: '2026-02-15T13:45:00',
    isLiked: true,
    isSaved: true,
    style: 'korean',
    location: 'Dalat, Vietnam',
  },
];
