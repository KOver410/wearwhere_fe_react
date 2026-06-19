import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { Trash2, ArrowLeft, Heart, CreditCard, Lock, Tag, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { formatVnd } from '@/app/utils/currency';

interface CartItem {
  id: number;
  name: string;
  nameVi: string;
  image: string;
  size: string;
  color: string;
  colorVi: string;
  price: number;
  quantity: number;
}

interface CheckoutFormData {
  // Shipping Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Payment Information
  paymentMethod: 'card' | 'paypal' | 'cod';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

export function CartCheckoutPage() {
  const navigate = useNavigate();
  const { v } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Vintage Denim Jacket',
      nameVi: 'Áo khoác denim vintage',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      size: 'M',
      color: 'Blue',
      colorVi: 'Xanh dương',
      price: 89.99,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Classic White Sneakers',
      nameVi: 'Giày sneaker trắng cổ điển',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      size: '42',
      color: 'White',
      colorVi: 'Trắng',
      price: 129.99,
      quantity: 1,
    },
    {
      id: 3,
      name: 'Leather Crossbody Bag',
      nameVi: 'Túi đeo chéo da',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
      size: 'One Size',
      color: 'Brown',
      colorVi: 'Nâu',
      price: 159.99,
      quantity: 2,
    },
  ]);

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: 'card',
      country: 'Việt Nam',
    },
  });

  const paymentMethod = watch('paymentMethod');

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === 'SAVE10') {
      setAppliedVoucher({ code: 'SAVE10', discount: 10 });
    } else {
      alert(v('Invalid voucher code', 'Mã voucher không hợp lệ'));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedVoucher ? (subtotal * appliedVoucher.discount) / 100 : 0;
  const shipping = 15.0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Order data:', data);
    alert(v('Order placed successfully! Total: ', 'Đặt hàng thành công! Tổng cộng: ') + formatVnd(total));
    navigate('/');
  };

  const handleContinueToShipping = () => {
    if (cartItems.length === 0) {
      alert(v('Your cart is empty!', 'Giỏ hàng của bạn trống!'));
      return;
    }
    setCurrentStep('shipping');
  };

  const handleContinueToPayment = () => {
    setCurrentStep('payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3f0eb' }}>
              <ShoppingBag className="w-12 h-12" style={{ color: '#888' }} />
            </div>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', lineHeight: 1.05 }}>
            {v('Your cart is empty', 'Giỏ hàng trống')}
          </h2>
          <p style={{ fontSize: '16px', color: '#4a4a4a', marginBottom: '32px' }}>
            {v("Looks like you haven't added anything to your cart yet", 'Có vẻ bạn chưa thêm sản phẩm nào vào giỏ hàng')}
          </p>
          <Link to="/">
            <Button
              style={{
                backgroundColor: '#0d0d0d',
                color: '#FFFFFF',
                borderRadius: '10px',
                height: '48px',
                paddingLeft: '32px',
                paddingRight: '32px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              {v('Start Shopping', 'Bắt đầu mua sắm')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-4 lg:px-6 py-4" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-4 hover:gap-3 transition-all"
            style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            <ArrowLeft className="w-5 h-5" />
            {v('Continue Shopping', 'Tiếp tục mua sắm')}
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '8px' }}>
            {v('Cart & Checkout', 'Giỏ hàng & Thanh toán')}
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'cart' ? 'bg-[#d41c1c] text-white' : 'bg-[#4a4a4a] text-white'
                }`}
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                1
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: currentStep === 'cart' ? '#0d0d0d' : '#4a4a4a' }}>
                {v('Cart', 'Giỏ hàng')}
              </span>
            </div>
            <div className="h-px flex-1" style={{ backgroundColor: '#e0d8cf' }} />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'shipping' ? 'bg-[#d41c1c] text-white' : currentStep === 'payment' ? 'bg-[#4a4a4a] text-white' : 'text-[#888]'
                }`}
                style={{ fontSize: '14px', fontWeight: 600, backgroundColor: currentStep !== 'shipping' && currentStep !== 'payment' ? '#f0ebe4' : undefined }}
              >
                2
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: currentStep === 'shipping' ? '#0d0d0d' : currentStep === 'payment' ? '#4a4a4a' : '#888' }}>
                {v('Shipping', 'Giao hàng')}
              </span>
            </div>
            <div className="h-px flex-1" style={{ backgroundColor: '#e0d8cf' }} />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'payment' ? 'bg-[#d41c1c] text-white' : 'text-[#888]'
                }`}
                style={{ fontSize: '14px', fontWeight: 600, backgroundColor: currentStep !== 'payment' ? '#f0ebe4' : undefined }}
              >
                3
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: currentStep === 'payment' ? '#0d0d0d' : '#888' }}>
                {v('Payment', 'Thanh toán')}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT SIDE - Cart Items */}
            <div className="lg:col-span-7">
              <div
                className="bg-white p-6"
                style={{
                  borderRadius: '10px',
                  border: '2px solid #e0d8cf',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '24px' }}>
                  {v('Your Items', 'Sản phẩm')} ({cartItems.length})
                </h2>

                {/* Cart Items List */}
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 pb-4 last:border-b-0"
                        style={{ borderBottom: '1px solid #e0d8cf' }}
                      >
                        {/* Product Image */}
                        <div
                          className="w-24 h-24 flex-shrink-0 overflow-hidden"
                          style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d', marginBottom: '4px' }}>
                            {v(item.name, item.nameVi)}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>
                            {v('Size', 'Cỡ')}: {item.size} | {v('Color', 'Màu')}: {v(item.color, item.colorVi)}
                          </p>
                          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0d0d0d' }}>
                            {formatVnd(item.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center border-2 border-[#e0d8cf]" style={{ borderRadius: '10px' }}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1 hover:bg-[#fff9f2] transition-colors"
                                style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}
                              >
                                -
                              </button>
                              <span className="px-4 py-1" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-[#fff9f2] transition-colors"
                                style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="flex items-center gap-1 text-[#d41c1c] hover:text-[#b01818] transition-colors"
                              style={{ fontSize: '14px', fontWeight: 400 }}
                            >
                              <Trash2 className="w-4 h-4" />
                              {v('Remove', 'Xóa')}
                            </button>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0A0A0A' }}>
                            {formatVnd(item.price * item.quantity)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Voucher Code */}
                <div className="mt-6 pt-6" style={{ borderTop: '2px solid #e0d8cf' }}>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
                      <Input
                        placeholder={v('Enter voucher code (try SAVE10)', 'Nhập mã voucher (thử SAVE10)')}
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="pl-10"
                        style={{
                          borderRadius: '4px',
                          height: '48px',
                          fontSize: '14px',
                          backgroundColor: '#fefcfa',
                          border: '2px solid #e0d8cf',
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={applyVoucher}
                      disabled={!voucherCode || !!appliedVoucher}
                      style={{
                        backgroundColor: appliedVoucher ? '#4a4a4a' : '#0d0d0d',
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
                      {appliedVoucher ? v('Applied', 'Đã áp dụng') : v('Apply', 'Áp dụng')}
                    </Button>
                  </div>
                  {appliedVoucher && (
                    <p style={{ fontSize: '14px', color: '#e2b93b', marginTop: '8px' }}>
                      ✓ {v('Voucher', 'Voucher')} "{appliedVoucher.code}" {v('applied!', 'đã được áp dụng!')} {appliedVoucher.discount}% {v('discount', 'giảm giá')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Shipping & Payment Form */}
            <div className="lg:col-span-5">
              {/* Step 1: Cart Review (Show Order Summary) */}
              {currentStep === 'cart' && (
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #e0d8cf',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '24px' }}>
                    {v('Order Summary', 'Tóm tắt đơn hàng')}
                  </h2>

                  <div className="space-y-3 mb-6 pb-6" style={{ borderBottom: '2px solid #e0d8cf' }}>
                    <div className="flex justify-between">
                      <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Subtotal', 'Tạm tính')}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                        {formatVnd(subtotal)}
                      </span>
                    </div>
                    {appliedVoucher && (
                      <div className="flex justify-between">
                        <span style={{ fontSize: '14px', color: '#e2b93b' }}>{v('Discount', 'Giảm giá')} ({appliedVoucher.discount}%)</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#e2b93b' }}>
                          -{formatVnd(discount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Shipping', 'Vận chuyển')}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                        {formatVnd(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Tax (8%)', 'Thuế (8%)')}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                        {formatVnd(tax)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Total', 'Tổng cộng')}</span>
                    <span style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>
                      {formatVnd(total)}
                    </span>
                  </div>

                  <Button
                    type="button"
                    onClick={handleContinueToShipping}
                    className="w-full"
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
                    {v('Continue to Shipping', 'Tiếp tục đến giao hàng')}
                  </Button>

                  <p style={{ fontSize: '12px', color: '#888', marginTop: '12px', textAlign: 'center' }}>
                    {v('Secure checkout powered by encryption', 'Thanh toán bảo mật bằng mã hóa')}
                  </p>
                </div>
              )}

              {/* Step 2: Shipping Information */}
              {currentStep === 'shipping' && (
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: '4px',
                    border: '2px solid #e0d8cf',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '24px' }}>
                    {v('Shipping Information', 'Thông tin giao hàng')}
                  </h2>

                  <div className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          {v('First Name *', 'Tên *')}
                        </Label>
                        <Input
                          id="firstName"
                          {...register('firstName', { required: 'Required' })}
                          style={{
                            borderRadius: '10px',
                            height: '48px',
                            fontSize: '14px',
                            backgroundColor: '#fefcfa',
                            border: errors.firstName ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                          }}
                        />
                        {errors.firstName && (
                          <p style={{ fontSize: '12px', color: '#E7000B', marginTop: '4px' }}>
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          {v('Last Name *', 'Họ *')}
                        </Label>
                        <Input
                          id="lastName"
                          {...register('lastName', { required: 'Required' })}
                          style={{
                            borderRadius: '10px',
                            height: '48px',
                            fontSize: '14px',
                            backgroundColor: '#fefcfa',
                            border: errors.lastName ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                          }}
                        />
                        {errors.lastName && (
                          <p style={{ fontSize: '12px', color: '#E7000B', marginTop: '4px' }}>
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        {v('Email *', 'Email *')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email', { 
                          required: 'Required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email'
                          }
                        })}
                        style={{
                          borderRadius: '10px',
                          height: '48px',
                          fontSize: '14px',
                          backgroundColor: '#fefcfa',
                          border: errors.email ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                        }}
                      />
                      {errors.email && (
                        <p style={{ fontSize: '12px', color: '#E7000B', marginTop: '4px' }}>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        {v('Phone *', 'Điện thoại *')}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone', { required: 'Required' })}
                        style={{
                          borderRadius: '10px',
                          height: '48px',
                          fontSize: '14px',
                          backgroundColor: '#fefcfa',
                          border: errors.phone ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                        }}
                      />
                      {errors.phone && (
                        <p style={{ fontSize: '12px', color: '#E7000B', marginTop: '4px' }}>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <Label htmlFor="address" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        {v('Street Address *', 'Địa chỉ *')}
                      </Label>
                      <Input
                        id="address"
                        {...register('address', { required: 'Required' })}
                        style={{
                          borderRadius: '10px',
                          height: '48px',
                          fontSize: '14px',
                          backgroundColor: '#fefcfa',
                          border: errors.address ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                        }}
                      />
                      {errors.address && (
                        <p style={{ fontSize: '12px', color: '#E7000B', marginTop: '4px' }}>
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    {/* City, State, Zip */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="city" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          {v('City *', 'Thành phố *')}
                        </Label>
                        <Input
                          id="city"
                          {...register('city', { required: 'Required' })}
                          style={{
                            borderRadius: '10px',
                            height: '48px',
                            fontSize: '14px',
                            backgroundColor: '#fefcfa',
                            border: errors.city ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          {v('State *', 'Tỉnh/TP *')}
                        </Label>
                        <Input
                          id="state"
                          {...register('state', { required: 'Required' })}
                          style={{
                            borderRadius: '10px',
                            height: '48px',
                            fontSize: '14px',
                            backgroundColor: '#fefcfa',
                            border: errors.state ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          {v('Zip *', 'Mã bưu điện *')}
                        </Label>
                        <Input
                          id="zipCode"
                          {...register('zipCode', { required: 'Required' })}
                          style={{
                            borderRadius: '10px',
                            height: '48px',
                            fontSize: '14px',
                            backgroundColor: '#fefcfa',
                            border: errors.zipCode ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                          }}
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <Label htmlFor="country" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        {v('Country *', 'Quốc gia *')}
                      </Label>
                      <Input
                        id="country"
                        {...register('country', { required: 'Required' })}
                        style={{
                          borderRadius: '10px',
                          height: '48px',
                          fontSize: '14px',
                          backgroundColor: '#fefcfa',
                          border: errors.country ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('cart')}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#d41c1c',
                        borderRadius: '10px',
                        height: '52px',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '2px solid #d41c1c',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      {v('Back', 'Quay lại')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleContinueToPayment}
                      className="flex-1"
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
                      {v('Continue to Payment', 'Tiếp tục thanh toán')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 'payment' && (
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #e0d8cf',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '24px' }}>
                    {v('Payment Method', 'Phương thức thanh toán')}
                  </h2>

                  {/* Payment Method Selection */}
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3 mb-6">
                        <div
                          className="flex items-center space-x-3 p-3 bg-white border-2 border-[#e0d8cf] hover:border-[#d41c1c] cursor-pointer transition-colors"
                          style={{ borderRadius: '10px' }}
                        >
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                            <CreditCard className="w-4 h-4" />
                            {v('Credit / Debit Card', 'Thẻ tín dụng / Ghi nợ')}
                          </Label>
                        </div>
                        
                        <div
                          className="flex items-center space-x-3 p-3 bg-white border-2 border-[#e0d8cf] hover:border-[#d41c1c] cursor-pointer transition-colors"
                          style={{ borderRadius: '10px' }}
                        >
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="cursor-pointer flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                            PayPal
                          </Label>
                        </div>
                        
                        <div
                          className="flex items-center space-x-3 p-3 bg-white border-2 border-[#e0d8cf] hover:border-[#d41c1c] cursor-pointer transition-colors"
                          style={{ borderRadius: '10px' }}
                        >
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="cursor-pointer flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                            {v('Cash on Delivery', 'Thanh toán khi nhận hàng')}
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {/* Card Details */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <Label htmlFor="cardNumber" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          {v('Card Number *', 'Số thẻ *')}
                        </Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          {...register('cardNumber', { required: paymentMethod === 'card' ? 'Required' : false })}
                          style={{
                            borderRadius: '10px',
                            height: '48px',
                            fontSize: '14px',
                            backgroundColor: '#fefcfa',
                            border: errors.cardNumber ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardName" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          {v('Cardholder Name *', 'Tên chủ thẻ *')}
                        </Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          {...register('cardName', { required: paymentMethod === 'card' ? 'Required' : false })}
                          style={{
                            borderRadius: '10px',
                            height: '48px',
                            fontSize: '14px',
                            backgroundColor: '#fefcfa',
                            border: errors.cardName ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiryDate" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                            {v('Expiry *', 'Hạn *')}
                          </Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            {...register('expiryDate', { required: paymentMethod === 'card' ? 'Required' : false })}
                            style={{
                              borderRadius: '10px',
                              height: '48px',
                              fontSize: '14px',
                              backgroundColor: '#fefcfa',
                              border: errors.expiryDate ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                            CVV *
                          </Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            maxLength={3}
                            {...register('cvv', { required: paymentMethod === 'card' ? 'Required' : false })}
                            style={{
                              borderRadius: '10px',
                              height: '48px',
                              fontSize: '14px',
                              backgroundColor: '#fefcfa',
                              border: errors.cvv ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="p-4 mb-6" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Subtotal', 'Tạm tính')}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                          {formatVnd(subtotal)}
                        </span>
                      </div>
                      {appliedVoucher && (
                        <div className="flex justify-between">
                          <span style={{ fontSize: '14px', color: '#e2b93b' }}>{v('Discount', 'Giảm giá')}</span>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#e2b93b' }}>
                            -{formatVnd(discount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Shipping', 'Vận chuyển')}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                          {formatVnd(shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Tax', 'Thuế')}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                          {formatVnd(tax)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2" style={{ borderTop: '2px solid #e0d8cf' }}>
                        <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Total', 'Tổng cộng')}</span>
                        <span style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>
                          {formatVnd(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#d41c1c',
                        borderRadius: '10px',
                        height: '52px',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '2px solid #d41c1c',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      {v('Back', 'Quay lại')}
                    </Button>
                    <Button
                      type="submit"
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
                      <Lock className="w-5 h-5" />
                      {v('Place Order', 'Đặt hàng')}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Lock className="w-4 h-4 text-[#888]" />
                    <p style={{ fontSize: '12px', color: '#888' }}>
                      {v('Secure checkout with SSL encryption', 'Thanh toán bảo mật với mã hóa SSL')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}