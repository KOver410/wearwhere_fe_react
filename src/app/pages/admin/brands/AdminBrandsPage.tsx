import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Search,
  Store,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  TrendingUp,
  Package,
  DollarSign,
  Eye,
  MoreHorizontal,
  Shield,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { toast } from 'sonner';

// Mock data
const mockBrands = [
  {
    id: 1,
    name: 'Zara Vietnam',
    email: 'contact@zara.vn',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    status: 'active',
    verified: true,
    subscriptionTier: 'premium',
    joinDate: '2023-06-15',
    stores: 12,
    products: 1234,
    totalRevenue: 2500000000,
    monthlyRevenue: 450000000,
    rating: 4.8,
    orders: 5678,
  },
  {
    id: 2,
    name: 'H&M Fashion',
    email: 'business@hm.com',
    logo: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    status: 'active',
    verified: true,
    subscriptionTier: 'business',
    joinDate: '2023-08-20',
    stores: 8,
    products: 987,
    totalRevenue: 1800000000,
    monthlyRevenue: 320000000,
    rating: 4.6,
    orders: 4321,
  },
  {
    id: 3,
    name: 'Mango Store',
    email: 'info@mango.vn',
    logo: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    status: 'pending',
    verified: false,
    subscriptionTier: 'starter',
    joinDate: '2024-02-10',
    stores: 3,
    products: 234,
    totalRevenue: 450000000,
    monthlyRevenue: 85000000,
    rating: 4.5,
    orders: 1245,
  },
  {
    id: 4,
    name: 'Local Boutique',
    email: 'hello@localboutique.vn',
    logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    status: 'suspended',
    verified: false,
    subscriptionTier: 'starter',
    joinDate: '2023-11-05',
    stores: 2,
    products: 156,
    totalRevenue: 120000000,
    monthlyRevenue: 15000000,
    rating: 4.2,
    orders: 567,
  },
  {
    id: 5,
    name: 'Nike Official',
    email: 'vietnam@nike.com',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    status: 'active',
    verified: true,
    subscriptionTier: 'premium',
    joinDate: '2023-05-01',
    stores: 15,
    products: 2341,
    totalRevenue: 5600000000,
    monthlyRevenue: 890000000,
    rating: 4.9,
    orders: 12456,
  },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-[#10B981]/10 text-[#10B981]', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-[#F54900]/10 text-[#F54900]', icon: AlertCircle },
  suspended: { label: 'Suspended', color: 'bg-[#E7000B]/10 text-[#E7000B]', icon: XCircle },
};

const tierConfig = {
  starter: { label: 'Starter', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
  business: { label: 'Business', color: 'bg-[#10B981]/10 text-[#10B981]' },
  premium: { label: 'Premium', color: 'bg-[#F54900]/10 text-[#F54900]' },
};

export default function AdminBrandsPage() {
  const { v } = useLanguage();
  const statusLabel = (status: keyof typeof statusConfig) =>
    ({
      active: v('Active', 'Hoạt động'),
      pending: v('Pending', 'Đang chờ'),
      suspended: v('Suspended', 'Tạm khóa'),
    })[status];
  const tierLabel = (tier: keyof typeof tierConfig) =>
    ({
      starter: v('Starter', 'Khởi đầu'),
      business: v('Business', 'Doanh nghiệp'),
      premium: v('Premium', 'Cao cấp'),
    })[tier];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter brands
  const filteredBrands = mockBrands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || brand.status === statusFilter;
    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && brand.verified) ||
      (verifiedFilter === 'unverified' && !brand.verified);
    const matchesTier = tierFilter === 'all' || brand.subscriptionTier === tierFilter;
    return matchesSearch && matchesStatus && matchesVerified && matchesTier;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: mockBrands.length,
    active: mockBrands.filter((b) => b.status === 'active').length,
    verified: mockBrands.filter((b) => b.verified).length,
    totalRevenue: mockBrands.reduce((sum, b) => sum + b.monthlyRevenue, 0),
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-[#0A0A0A]"
            style={{
              fontSize: '36px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              marginBottom: '8px',
            }}
          >
            {v('Brand Management', 'Quản lý thương hiệu')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Manage all brands on the platform', 'Quản lý tất cả brands trên nền tảng')}
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/brands/applications">
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
              <AlertCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Applications', 'Đơn đăng ký')}
            </Button>
          </Link>
          <Link to="/admin/brands/subscriptions">
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
              <Crown style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Subscriptions', 'Gói đăng ký')}
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
              className="flex items-center justify-center bg-[#3B82F6]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Store className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Brands', 'Tổng thương hiệu')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.total}
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
              <CheckCircle className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
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
              {v('Active Brands', 'Thương hiệu hoạt động')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.active}
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
              <Shield className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              {v('Verified Brands', 'Thương hiệu đã xác minh')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.verified}
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
              {v('Monthly Revenue', 'Doanh thu hàng tháng')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(stats.totalRevenue / 1000000000).toFixed(1)}B
            </h3>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="grid grid-cols-4" style={{ gap: '16px' }}>
          {/* Search */}
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                style={{ width: '16px', height: '16px' }}
              />
              <Input
                placeholder={v('Search brands...', 'Tìm kiếm thương hiệu...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Status', 'Trạng thái')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Status', 'Tất cả trạng thái')}</SelectItem>
                <SelectItem value="active">{v('Active', 'Hoạt động')}</SelectItem>
                <SelectItem value="pending">{v('Pending', 'Đang chờ')}</SelectItem>
                <SelectItem value="suspended">{v('Suspended', 'Tạm khóa')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Verified Filter */}
          <div>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Verification', 'Xác minh')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Brands', 'Tất cả thương hiệu')}</SelectItem>
                <SelectItem value="verified">{v('Verified', 'Đã xác minh')}</SelectItem>
                <SelectItem value="unverified">{v('Unverified', 'Chưa xác minh')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tier Filter */}
          <div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Subscription Tier', 'Gói đăng ký')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Tiers', 'Tất cả gói')}</SelectItem>
                <SelectItem value="starter">{v('Starter', 'Khởi đầu')}</SelectItem>
                <SelectItem value="business">{v('Business', 'Doanh nghiệp')}</SelectItem>
                <SelectItem value="premium">{v('Premium', 'Cao cấp')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Brands Table */}
      <Card
        className="bg-white"
        style={{
          padding: '0',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Brand', 'Thương hiệu')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Subscription', 'Gói đăng ký')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Stores & Products', 'Cửa hàng & Sản phẩm')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Performance', 'Hiệu suất')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Revenue', 'Doanh thu')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Status', 'Trạng thái')}
                </th>
                <th
                  className="text-right text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Actions', 'Thao tác')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.map((brand) => {
                const StatusIcon = statusConfig[brand.status as keyof typeof statusConfig].icon;
                return (
                  <tr key={brand.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center" style={{ gap: '12px' }}>
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="bg-[#F3F4F6]"
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <div className="flex items-center" style={{ gap: '6px' }}>
                            <p
                              className="text-[#0A0A0A]"
                              style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                fontFamily: 'Arimo, sans-serif',
                              }}
                            >
                              {brand.name}
                            </p>
                            {brand.verified && (
                              <Shield
                                className="text-[#10B981]"
                                style={{ width: '14px', height: '14px' }}
                              />
                            )}
                          </div>
                          <p
                            className="text-[#6A7282]"
                            style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                          >
                            {brand.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <Badge
                        className={tierConfig[brand.subscriptionTier as keyof typeof tierConfig].color}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 12px',
                        }}
                      >
                        {tierLabel(brand.subscriptionTier as keyof typeof tierConfig)}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex flex-col" style={{ gap: '4px' }}>
                        <p
                          className="text-[#0A0A0A]"
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          🏪 {brand.stores} {v('stores', 'cửa hàng')}
                        </p>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          📦 {brand.products.toLocaleString('vi-VN')} {v('products', 'sản phẩm')}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex flex-col" style={{ gap: '4px' }}>
                        <p
                          className="text-[#0A0A0A]"
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          ⭐ {brand.rating}
                        </p>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          📈 {brand.orders.toLocaleString('vi-VN')} {v('orders', 'đơn hàng')}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex flex-col" style={{ gap: '4px' }}>
                        <p
                          className="text-[#0A0A0A]"
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          {(brand.monthlyRevenue / 1000000).toFixed(0)}M/mo
                        </p>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {v('Total', 'Tổng')}: {(brand.totalRevenue / 1000000000).toFixed(1)}B
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <Badge
                        className={statusConfig[brand.status as keyof typeof statusConfig].color}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '6px 12px',
                          gap: '4px',
                        }}
                      >
                        <StatusIcon style={{ width: '14px', height: '14px' }} />
                        {statusLabel(brand.status as keyof typeof statusConfig)}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center justify-end" style={{ gap: '8px' }}>
                        <Link to={`/admin/brands/${brand.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{
                                padding: '8px',
                                borderRadius: '8px',
                              }}
                            >
                              <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Shield
                                style={{ width: '14px', height: '14px', marginRight: '8px' }}
                              />
                              {brand.verified ? v('Remove Verification', 'Gỡ xác minh') : v('Verify Brand', 'Xác minh thương hiệu')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Crown
                                style={{ width: '14px', height: '14px', marginRight: '8px' }}
                              />
                              {v('Change Subscription', 'Đổi gói đăng ký')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[#E7000B]">
                              <XCircle
                                style={{ width: '14px', height: '14px', marginRight: '8px' }}
                              />
                              {v('Suspend Brand', 'Tạm khóa thương hiệu')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between bg-[#F9FAFB] border-t border-[#E5E7EB]"
          style={{ padding: '16px 24px' }}
        >
          <p
            className="text-[#6A7282]"
            style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Showing', 'Hiển thị')} {(currentPage - 1) * itemsPerPage + 1} {v('to', 'đến')}{' '}
            {Math.min(currentPage * itemsPerPage, filteredBrands.length)} {v('of', 'trong')}{' '}
            {filteredBrands.length} {v('brands', 'thương hiệu')}
          </p>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                height: '36px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              {v('Previous', 'Trước')}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? 'bg-[#0A0A0A] text-white'
                    : 'border-[#D1D5DC] text-[#0A0A0A]'
                }
                style={{
                  height: '36px',
                  width: '36px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '0',
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                height: '36px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              {v('Next', 'Sau')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}