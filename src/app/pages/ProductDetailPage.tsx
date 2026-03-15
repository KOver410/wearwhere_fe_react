import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, ShoppingCart, Ruler, Truck, Package, Star, ChevronLeft, ChevronRight, Check, Zap } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Button } from '@/app/components/ui/button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import * as Tabs from '@radix-ui/react-tabs';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useAuth } from '@/app/contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  colors: { name: string; value: string; image: string }[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  inStock: boolean;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { isLoggedIn, promptLogin } = useAuth();
  
  // Mock product data
  const product: Product = {
    id: 1,
    name: 'Vintage Oversized Denim Jacket',
    price: 189.99,
    salePrice: 149.99,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
    ],
    colors: [
      { name: 'Classic Blue', value: '#4A6FA5', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800' },
      { name: 'Black Wash', value: '#2C2C2C', image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800' },
      { name: 'Light Blue', value: '#8BB8E8', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviewCount: 127,
    description: 'A timeless vintage-inspired denim jacket with an oversized fit. Perfect for layering over any outfit. Features classic button closure, chest pockets, and side pockets. Made from premium quality denim with a comfortable, lived-in feel.',
    details: [
      '100% Premium Cotton Denim',
      'Oversized relaxed fit',
      'Classic button closure',
      'Two chest pockets with flaps',
      'Two side pockets',
      'Vintage wash finish',
      'Machine washable',
      'Imported',
    ],
    inStock: true,
  };

  const reviews: Review[] = [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: 'Jan 28, 2026',
      comment: 'Absolutely love this jacket! The fit is perfect and the quality is amazing. Highly recommend!',
      verified: true,
    },
    {
      id: 2,
      author: 'Emma K.',
      rating: 4,
      date: 'Jan 25, 2026',
      comment: 'Great jacket, fits oversized as described. The denim is thick and feels durable.',
      verified: true,
    },
    {
      id: 3,
      author: 'Michael R.',
      rating: 5,
      date: 'Jan 20, 2026',
      comment: 'Best denim jacket I\'ve owned. Worth every penny!',
      verified: false,
    },
  ];

  const relatedProducts = [
    { id: 2, name: 'White Cotton T-Shirt', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 3, name: 'Black Leather Boots', price: 199.99, image: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=400' },
    { id: 4, name: 'Slim Fit Jeans', price: 89.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { id: 5, name: 'Canvas Tote Bag', price: 49.99, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400' },
  ];

  const recentlyViewed = [
    { id: 6, name: 'Striped Sweater', price: 79.99, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
    { id: 7, name: 'Leather Jacket', price: 299.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
    { id: 8, name: 'Casual Sneakers', price: 129.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  ];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const currentPrice = product.salePrice || product.price;
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      promptLogin('/cart');
      return;
    }
    if (!selectedSize) {
      alert(v('Please select a size', 'Vui lòng chọn kích cỡ'));
      return;
    }
    alert(v(`Added ${quantity}x ${product.name} (Size: ${selectedSize}) to cart!`, `Đã thêm ${quantity}x ${product.name} (Size: ${selectedSize}) vào giỏ hàng!`));
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      promptLogin('/cart');
      return;
    }
    if (!selectedSize) {
      alert(v('Please select a size', 'Vui lòng chọn kích cỡ'));
      return;
    }
    navigate('/cart');
  };

  const handleColorChange = (index: number) => {
    setSelectedColor(index);
    setSelectedImage(0);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-4 lg:px-6 py-4" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm" style={{ color: '#888' }}>
            <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
            <span>/</span>
            <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Women', 'Nữ')}</Link>
            <span>/</span>
            <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Jackets', 'Áo khoác')}</Link>
            <span>/</span>
            <span style={{ color: '#0d0d0d' }}>{product.name}</span>
          </nav>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div className="relative overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
              <Zoom>
                <ImageWithFallback
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </Zoom>
              {discount > 0 && (
                <div
                  className="absolute top-4 right-4 px-3 py-1"
                  style={{
                    backgroundColor: '#d41c1c',
                    color: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-2 ring-[#d41c1c]' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '12px' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-[#e2b93b] text-[#e2b93b]' : 'text-[#e0d8cf]'}`}
                  />
                ))}
              </div>
              <span style={{ fontSize: '14px', color: '#888' }}>
                {product.rating} ({product.reviewCount} {v('reviews', 'đánh giá')})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#0d0d0d' }}>
                ${currentPrice.toFixed(2)}
              </span>
              {product.salePrice && (
                <span
                  className="line-through"
                  style={{ fontSize: '24px', fontWeight: 400, color: '#888' }}
                >
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                  Color: <span style={{ fontWeight: 400, color: '#4a4a4a' }}>{product.colors[selectedColor].name}</span>
                </label>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(index)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === index ? 'border-[#d41c1c] scale-110' : 'border-[#e0d8cf] hover:border-[#e2b93b]'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                  Size: {selectedSize && <span style={{ fontWeight: 400, color: '#4a4a4a' }}>{selectedSize}</span>}
                </label>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="flex items-center gap-1 hover:underline"
                  style={{ fontSize: '14px', fontWeight: 400, color: '#0d0d0d' }}
                >
                  <Ruler className="w-4 h-4" />
                  {v('Size Guide', 'Bảng size')}
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border-2 transition-all ${
                      selectedSize === size
                        ? 'border-[#d41c1c] bg-[#d41c1c] text-white'
                        : 'border-[#e0d8cf] hover:border-[#d41c1c]'
                    }`}
                    style={{
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: selectedSize === size ? '#FFFFFF' : '#0d0d0d',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Chart Modal */}
            {showSizeChart && (
              <div className="mb-6 p-4" style={{ borderRadius: '10px', backgroundColor: '#fff9f2' }}>
                <h3 style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Size Chart (inches)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left" style={{ fontSize: '14px' }}>
                    <thead>
                      <tr className="border-b border-[#e0d8cf]">
                        <th className="pb-2" style={{ color: '#0d0d0d', fontWeight: 600 }}>{v('Size', 'Cỡ')}</th>
                        <th className="pb-2" style={{ color: '#0d0d0d', fontWeight: 600 }}>{v('Chest', 'Ngực')}</th>
                        <th className="pb-2" style={{ color: '#0d0d0d', fontWeight: 600 }}>{v('Length', 'Dài')}</th>
                        <th className="pb-2" style={{ color: '#0d0d0d', fontWeight: 600 }}>{v('Sleeve', 'Tay')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size, idx) => (
                        <tr key={size} className="" style={{ borderBottom: '1px solid #e0d8cf' }}>
                          <td className="py-2" style={{ fontWeight: 600 }}>{size}</td>
                          <td className="py-2" style={{ color: '#4a4a4a' }}>{36 + idx * 2}</td>
                          <td className="py-2" style={{ color: '#4a4a4a' }}>{26 + idx}</td>
                          <td className="py-2" style={{ color: '#4a4a4a' }}>{24 + idx}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px', display: 'block' }}>
                {v('Quantity', 'Số lượng')}
              </label>
              <div className="flex items-center border-2 border-[#e0d8cf] w-fit" style={{ borderRadius: '10px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-[#fff9f2] transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}
                >
                  -
                </button>
                <span className="px-6 py-3 border-l border-r border-[#e0d8cf]" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-[#fff9f2] transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'transparent',
                  color: '#d41c1c',
                  borderRadius: '10px',
                  height: '52px',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  border: '2px solid #d41c1c',
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {v('Add to Cart', 'Thêm vào giỏ')}
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#0d0d0d',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  height: '52px',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                <Zap className="w-5 h-5" />
                {v('Buy Now', 'Mua ngay')}
              </Button>
              <Button
                onClick={() => {
                  if (!isLoggedIn) { promptLogin('/wishlist'); return; }
                  setIsWishlisted(!isWishlisted);
                }}
                style={{
                  backgroundColor: isWishlisted ? '#d41c1c' : 'transparent',
                  color: isWishlisted ? '#FFFFFF' : '#d41c1c',
                  borderRadius: '10px',
                  height: '52px',
                  width: '52px',
                  border: isWishlisted ? 'none' : '2px solid #d41c1c',
                }}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <Check className="w-5 h-5" style={{ color: '#e2b93b' }} />
              <span style={{ fontSize: '14px', fontWeight: 400, color: '#0d0d0d' }}>
                {v('In Stock - Ships within 2-3 business days', 'Còn hàng - Giao trong 2-3 ngày làm việc')}
              </span>
            </div>

            {/* Quick Info */}
            <div className="space-y-3 p-4" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 mt-0.5" style={{ color: '#e2b93b' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Free Shipping', 'Miễn phí vận chuyển')}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{v('On orders over $100', 'Cho đơn hàng trên $100')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 mt-0.5" style={{ color: '#e2b93b' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Free Returns', 'Đổi trả miễn phí')}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{v('30-day return policy', 'Chính sách đổi trả 30 ngày')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <Tabs.Root defaultValue="description">
            <Tabs.List className="flex mb-8" style={{ borderBottom: '2px solid #e0d8cf' }}>
              {[
                { value: 'description', label: v('Description', 'Mô tả') },
                { value: 'details', label: v('Details', 'Chi tiết') },
                { value: 'size-guide', label: v('Size Guide', 'Bảng size') },
                { value: 'shipping', label: v('Shipping', 'Vận chuyển') },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="px-6 py-4 border-b-2 transition-colors data-[state=active]:border-[#d41c1c] data-[state=inactive]:border-transparent data-[state=active]:text-[#d41c1c] data-[state=inactive]:text-[#888]"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="description">
              <div className="max-w-3xl">
                <p style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '1.8' }}>
                  {product.description}
                </p>
              </div>
            </Tabs.Content>

            <Tabs.Content value="details">
              <div className="max-w-3xl">
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#d41c1c' }} />
                      <span style={{ fontSize: '16px', color: '#4a4a4a' }}>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Tabs.Content>

            <Tabs.Content value="size-guide">
              <div className="max-w-3xl">
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0d0d', marginBottom: '16px' }}>
                  How to Measure
                </h3>
                <div className="space-y-3 mb-6">
                  <p style={{ fontSize: '14px', color: '#4a4a4a' }}>
                    <strong>{v('Chest:', 'Ngực:')}</strong> {v('Measure around the fullest part of your chest, keeping the tape horizontal.', 'Đo quanh phần rộng nhất của ngực, giữ thước ngang.')}
                  </p>
                  <p style={{ fontSize: '14px', color: '#4a4a4a' }}>
                    <strong>{v('Length:', 'Dài:')}</strong> {v('Measure from the highest point of the shoulder to the bottom hem.', 'Đo từ điểm cao nhất của vai đến gấu áo.')}
                  </p>
                  <p style={{ fontSize: '14px', color: '#4a4a4a' }}>
                    <strong>{v('Sleeve:', 'Tay:')}</strong> {v('Measure from the center back neck to the wrist.', 'Đo từ giữa sau cổ đến cổ tay.')}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-[#e0d8cf]" style={{ fontSize: '14px', borderRadius: '4px' }}>
                    <thead style={{ backgroundColor: '#fff9f2' }}>
                      <tr>
                        <th className="p-3 border-b border-[#e0d8cf]" style={{ fontWeight: 600 }}>{v('Size', 'Cỡ')}</th>
                        <th className="p-3 border-b border-[#e0d8cf]" style={{ fontWeight: 600 }}>{v('Chest (in)', 'Ngực (in)')}</th>
                        <th className="p-3 border-b border-[#e0d8cf]" style={{ fontWeight: 600 }}>{v('Length (in)', 'Dài (in)')}</th>
                        <th className="p-3 border-b border-[#e0d8cf]" style={{ fontWeight: 600 }}>{v('Sleeve (in)', 'Tay (in)')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size, idx) => (
                        <tr key={size} className="border-b border-[#e0d8cf] last:border-b-0">
                          <td className="p-3" style={{ fontWeight: 600 }}>{size}</td>
                          <td className="p-3" style={{ color: '#4a4a4a' }}>{36 + idx * 2}"</td>
                          <td className="p-3" style={{ color: '#4a4a4a' }}>{26 + idx}"</td>
                          <td className="p-3" style={{ color: '#4a4a4a' }}>{24 + idx}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="shipping">
              <div className="max-w-3xl space-y-4">
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0d0d', marginBottom: '8px' }}>
                    Shipping Information
                  </h3>
                  <p style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: '1.6' }}>
                    {v('We offer free standard shipping on all orders over $100. Orders are processed within 1-2 business days and typically arrive within 5-7 business days.', 'Chúng tôi miễn phí vận chuyển tiêu chuẩn cho đơn hàng trên $100. Đơn hàng được xử lý trong 1-2 ngày làm việc và thường giao trong 5-7 ngày làm việc.')}
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0d0d', marginBottom: '8px' }}>
                    Returns & Exchanges
                  </h3>
                  <p style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: '1.6' }}>
                    {v('We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Return shipping is free for exchanges.', 'Chúng tôi chấp nhận đổi trả trong 30 ngày kể từ ngày giao. Sản phẩm phải chưa sử dụng, chưa giặt, còn nguyên tem mác. Miễn phí vận chuyển đổi hàng.')}
                  </p>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {v('Customer Reviews', 'Đánh giá')}
            </h2>
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{
                backgroundColor: '#d41c1c',
                color: '#FFFFFF',
                borderRadius: '10px',
                height: '48px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              {v('Write a Review', 'Viết đánh giá')}
            </Button>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-8 mb-8 p-6" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <div className="text-center">
              <div style={{ fontSize: '60px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>{product.rating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-[#e2b93b] text-[#e2b93b]' : 'text-[#e0d8cf]'}`}
                  />
                ))}
              </div>
              <p style={{ fontSize: '14px', color: '#888' }}>{v('Based on', 'Dựa trên')} {product.reviewCount} {v('reviews', 'đánh giá')}</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span style={{ fontSize: '14px', color: '#4a4a4a', width: '60px' }}>{stars} {v('stars', 'sao')}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f0ebe4' }}>
                    <div
                      className="h-full"
                      style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%`, backgroundColor: '#d41c1c' }}
                    />
                  </div>
                  <span style={{ fontSize: '14px', color: '#888', width: '40px', textAlign: 'right' }}>
                    {stars === 5 ? 70 : stars === 4 ? 20 : 10}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 last:border-b-0" style={{ borderBottom: '1px solid #e0d8cf' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0d0d0d' }}>
                        {review.author}
                      </span>
                      {review.verified && (
                        <span
                          className="px-2 py-0.5"
                          style={{
                            backgroundColor: '#f3f0eb',
                            color: '#4a4a4a',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-[#e2b93b] text-[#e2b93b]' : 'text-[#e0d8cf]'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', color: '#888' }}>{review.date}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: '1.6' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-16">
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '24px' }}>
            {v('You May Also Like', 'Bạn cũng có thể thích')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="group">
                <div
                  className="relative bg-[#f3f0eb] overflow-hidden mb-3"
                  style={{ borderRadius: '4px' }}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '4px' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#d41c1c' }}>
                  ${item.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '24px' }}>
            {v('Recently Viewed', 'Đã xem gần đây')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {recentlyViewed.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="group">
                <div
                  className="relative bg-[#f3f0eb] overflow-hidden mb-3"
                  style={{ borderRadius: '4px' }}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '4px' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#d41c1c' }}>
                  ${item.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}