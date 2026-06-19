import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  ArrowLeft,
  Store,
  Package,
  DollarSign,
  TrendingUp,
  Shield,
  Crown,
  XCircle,
  Edit,
  MapPin,
  Star,
  Users,
  ShoppingCart,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockBrand = {
  id: 1,
  name: 'Zara Vietnam',
  logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  email: 'contact@zara.vn',
  phone: '+84 901 234 567',
  address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
  website: 'https://zara.vn',
  description:
    'Zara is a Spanish fast fashion retailer. We offer trendy clothing and accessories for men, women, and children.',
  descriptionVi:
    'Zara là nhà bán lẻ thời trang nhanh của Tây Ban Nha. Chúng tôi cung cấp quần áo và phụ kiện thời thượng cho nam, nữ và trẻ em.',
  status: 'active',
  verified: true,
  subscriptionTier: 'premium',
  joinDate: '2023-06-15',
  stats: {
    stores: 12,
    products: 1234,
    totalRevenue: 2500000000,
    monthlyRevenue: 450000000,
    totalOrders: 5678,
    monthlyOrders: 892,
    rating: 4.8,
    reviews: 2341,
    customers: 12456,
  },
  revenueData: [
    { month: 'Jan', revenue: 380 },
    { month: 'Feb', revenue: 420 },
    { month: 'Mar', revenue: 390 },
    { month: 'Apr', revenue: 450 },
    { month: 'May', revenue: 410 },
    { month: 'Jun', revenue: 480 },
  ],
  ordersData: [
    { month: 'Jan', orders: 780 },
    { month: 'Feb', orders: 850 },
    { month: 'Mar', orders: 820 },
    { month: 'Apr', orders: 920 },
    { month: 'May', orders: 870 },
    { month: 'Jun', orders: 950 },
  ],
};

const mockStores = [
  {
    id: 1,
    name: 'Zara District 1',
    address: '123 Nguyen Hue, District 1, HCMC',
    phone: '+84 901 111 111',
    status: 'active',
  },
  {
    id: 2,
    name: 'Zara District 3',
    address: '456 Le Van Sy, District 3, HCMC',
    phone: '+84 901 222 222',
    status: 'active',
  },
  {
    id: 3,
    name: 'Zara Hanoi',
    address: '789 Ba Trieu, Hoan Kiem, Hanoi',
    phone: '+84 901 333 333',
    status: 'active',
  },
];

const mockTopProducts = [
  {
    id: 1,
    name: 'Áo Sơ Mi Trắng Classic',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200',
    sales: 456,
    revenue: 205200000,
  },
  {
    id: 2,
    name: 'Quần Jean Skinny',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200',
    sales: 389,
    revenue: 253350000,
  },
  {
    id: 3,
    name: 'Áo Khoác Denim',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200',
    sales: 312,
    revenue: 390000000,
  },
];

export default function AdminBrandDetailPage() {
  const { v, lang } = useLanguage();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: '16px' }}>
          <Link to="/admin/brands">
            <Button
              variant="ghost"
              size="sm"
              style={{
                padding: '8px',
                borderRadius: '8px',
              }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
            </Button>
          </Link>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <img
              src={mockBrand.logo}
              alt={mockBrand.name}
              className="bg-[#F3F4F6]"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                objectFit: 'cover',
              }}
            />
            <div>
              <div className="flex items-center" style={{ gap: '12px', marginBottom: '4px' }}>
                <h1
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockBrand.name}
                </h1>
                {mockBrand.verified && (
                  <Shield className="text-[#10B981]" style={{ width: '28px', height: '28px' }} />
                )}
                <Badge
                  className="bg-[#10B981]/10 text-[#10B981]"
                  style={{
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '6px 16px',
                  }}
                >
                  {v('Active', 'Hoạt động')}
                </Badge>
              </div>
              <p
                className="text-[#4A5565]"
                style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
              >
                {v('Member since', 'Thành viên từ')} {new Date(mockBrand.joinDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to={`/admin/brands/${id}/verify`}>
            <Button
              variant="outline"
              className="border-[#D1D5DC]"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <Shield style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Verify Badge', 'Cấp huy hiệu xác minh')}
            </Button>
          </Link>
          <Link to={`/admin/brands/${id}/suspend`}>
            <Button
              variant="outline"
              className="border-[#E7000B] text-[#E7000B]"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Suspend Brand', 'Tạm khóa thương hiệu')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ gap: '24px' }}>
        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#F3F4F6]"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Store className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Stores', 'Cửa hàng')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {mockBrand.stats.stores}
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#F3F4F6]"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Package className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Products', 'Sản phẩm')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {mockBrand.stats.products.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#10B981]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <DollarSign className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Monthly Revenue', 'Doanh thu tháng')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(mockBrand.stats.monthlyRevenue / 1000000).toFixed(0)}M
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#F54900]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Star className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Rating', 'Đánh giá')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {mockBrand.stats.rating}
            </h3>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className="bg-white border-b border-[#E5E7EB]"
          style={{ padding: '0', height: 'auto', borderRadius: '0' }}
        >
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0A0A0A]"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
              borderRadius: '0',
            }}
          >
            {v('Overview', 'Tổng quan')}
          </TabsTrigger>
          <TabsTrigger
            value="stores"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0A0A0A]"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
              borderRadius: '0',
            }}
          >
            {v('Stores', 'Cửa hàng')}
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0A0A0A]"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
              borderRadius: '0',
            }}
          >
            {v('Performance', 'Hiệu suất')}
          </TabsTrigger>
          <TabsTrigger
            value="subscription"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0A0A0A]"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
              borderRadius: '0',
            }}
          >
            {v('Subscription', 'Gói đăng ký')}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" style={{ marginTop: '24px' }}>
          <div className="grid grid-cols-3" style={{ gap: '24px' }}>
            <div className="col-span-2 flex flex-col" style={{ gap: '24px' }}>
              {/* Brand Information */}
              <Card
                className="bg-white"
                style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
              >
                <h3
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '20px',
                  }}
                >
                  {v('Brand Information', 'Thông tin thương hiệu')}
                </h3>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                  }}
                >
                  {lang === 'vi' ? mockBrand.descriptionVi : mockBrand.description}
                </p>
                <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                  <div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '6px',
                      }}
                    >
                      {v('Email', 'Email')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {mockBrand.email}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '6px',
                      }}
                    >
                      {v('Phone', 'Số điện thoại')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {mockBrand.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '6px',
                      }}
                    >
                      {v('Address', 'Địa chỉ')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {mockBrand.address}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '6px',
                      }}
                    >
                      {v('Website', 'Website')}
                    </p>
                    <a
                      href={mockBrand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        textDecoration: 'underline',
                      }}
                    >
                      {mockBrand.website}
                    </a>
                  </div>
                </div>
              </Card>

              {/* Top Products */}
              <Card
                className="bg-white"
                style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
              >
                <h3
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '20px',
                  }}
                >
                  {v('Top Products', 'Sản phẩm bán chạy')}
                </h3>
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  {mockTopProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-[#F9FAFB]"
                      style={{ padding: '16px', borderRadius: '10px' }}
                    >
                      <div className="flex items-center" style={{ gap: '12px' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="bg-[#F3F4F6]"
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <p
                            className="text-[#0A0A0A]"
                            style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              fontFamily: 'Arimo, sans-serif',
                            }}
                          >
                            {product.name}
                          </p>
                          <p
                            className="text-[#6A7282]"
                            style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                          >
                            {product.sales} {v('sales', 'lượt bán')}
                          </p>
                        </div>
                      </div>
                      <p
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        {(product.revenue / 1000000).toFixed(0)}M
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Quick Stats */}
            <div className="col-span-1 flex flex-col" style={{ gap: '24px' }}>
              <Card
                className="bg-white"
                style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
              >
                <h3
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '20px',
                  }}
                >
                  {v('Quick Stats', 'Thống kê nhanh')}
                </h3>
                <div className="flex flex-col" style={{ gap: '16px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <ShoppingCart
                        className="text-[#6A7282]"
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('Total Orders', 'Tổng đơn hàng')}
                      </span>
                    </div>
                    <span
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {mockBrand.stats.totalOrders.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Users className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                      <span
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('Customers', 'Khách hàng')}
                      </span>
                    </div>
                    <span
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {mockBrand.stats.customers.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Star className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                      <span
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('Reviews', 'Đánh giá')}
                      </span>
                    </div>
                    <span
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {mockBrand.stats.reviews.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <DollarSign
                        className="text-[#6A7282]"
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('Total Revenue', 'Tổng doanh thu')}
                      </span>
                    </div>
                    <span
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {(mockBrand.stats.totalRevenue / 1000000000).toFixed(1)}B
                    </span>
                  </div>
                </div>
              </Card>

              <Card
                className="bg-white"
                style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
              >
                <h3
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '20px',
                  }}
                >
                  {v('Subscription', 'Gói đăng ký')}
                </h3>
                <Badge
                  className="bg-[#F54900]/10 text-[#F54900]"
                  style={{
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '8px 16px',
                    marginBottom: '16px',
                  }}
                >
                  <Crown style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                  {v('Premium', 'Cao cấp')}
                </Badge>
                <Link to={`/admin/brands/${id}/subscription`}>
                  <Button
                    variant="outline"
                    className="w-full border-[#D1D5DC]"
                    style={{
                      height: '40px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    <Edit style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                    {v('Change Tier', 'Đổi gói')}
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores" style={{ marginTop: '24px' }}>
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '20px',
              }}
            >
              {v('Store Locations', 'Địa điểm cửa hàng')}
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {mockStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-start justify-between bg-[#F9FAFB]"
                  style={{ padding: '20px', borderRadius: '10px' }}
                >
                  <div className="flex items-start" style={{ gap: '16px' }}>
                    <div
                      className="flex items-center justify-center bg-white"
                      style={{ width: '48px', height: '48px', borderRadius: '10px' }}
                    >
                      <Store className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
                    </div>
                    <div>
                      <h4
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          marginBottom: '8px',
                        }}
                      >
                        {store.name}
                      </h4>
                      <div className="flex items-start" style={{ gap: '6px', marginBottom: '6px' }}>
                        <MapPin
                          className="text-[#6A7282]"
                          style={{ width: '14px', height: '14px', marginTop: '2px' }}
                        />
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {store.address}
                        </p>
                      </div>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        📞 {store.phone}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className="bg-[#10B981]/10 text-[#10B981]"
                    style={{
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '6px 12px',
                    }}
                  >
                    {v('Active', 'Hoạt động')}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" style={{ marginTop: '24px' }}>
          <div className="grid grid-cols-2" style={{ gap: '24px' }}>
            <Card
              className="bg-white"
              style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
            >
              <h3
                className="text-[#0A0A0A]"
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '20px',
                }}
              >
                {v('Revenue Trend (6 months)', 'Xu hướng doanh thu (6 tháng)')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockBrand.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Arimo' }} />
                  <YAxis style={{ fontSize: '12px', fontFamily: 'Arimo' }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card
              className="bg-white"
              style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
            >
              <h3
                className="text-[#0A0A0A]"
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '20px',
                }}
              >
                {v('Orders Trend (6 months)', 'Xu hướng đơn hàng (6 tháng)')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockBrand.ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Arimo' }} />
                  <YAxis style={{ fontSize: '12px', fontFamily: 'Arimo' }} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#F54900" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" style={{ marginTop: '24px' }}>
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '20px',
              }}
            >
              {v('Current Subscription', 'Gói đăng ký hiện tại')}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: '16px' }}>
                <div
                  className="flex items-center justify-center bg-[#F54900]/10"
                  style={{ width: '64px', height: '64px', borderRadius: '14px' }}
                >
                  <Crown className="text-[#F54900]" style={{ width: '32px', height: '32px' }} />
                </div>
                <div>
                  <h4
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    {v('Premium Tier', 'Gói Cao cấp')}
                  </h4>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Full access to all features', 'Toàn quyền truy cập mọi tính năng')}
                  </p>
                </div>
              </div>
              <Link to={`/admin/brands/${id}/subscription`}>
                <Button
                  className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '0 24px',
                  }}
                >
                  <Edit style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  {v('Change Subscription', 'Đổi gói đăng ký')}
                </Button>
              </Link>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
