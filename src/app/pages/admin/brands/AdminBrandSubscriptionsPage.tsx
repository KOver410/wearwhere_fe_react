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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Search,
  Crown,
  Store,
  Package,
  TrendingUp,
  ArrowRight,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockBrands = [
  {
    id: 1,
    name: 'Zara Vietnam',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    currentTier: 'premium',
    revenue: 450000000,
    products: 1234,
    joinDate: '2023-06-15',
  },
  {
    id: 2,
    name: 'H&M Fashion',
    logo: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200',
    currentTier: 'business',
    revenue: 320000000,
    products: 987,
    joinDate: '2023-08-20',
  },
  {
    id: 3,
    name: 'Mango Store',
    logo: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200',
    currentTier: 'starter',
    revenue: 85000000,
    products: 234,
    joinDate: '2024-02-10',
  },
  {
    id: 4,
    name: 'Nike Official',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
    currentTier: 'premium',
    revenue: 890000000,
    products: 2341,
    joinDate: '2023-05-01',
  },
];

const subscriptionTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    features: [
      'Up to 50 products',
      '1 store location',
      'Basic analytics',
      '5% commission',
    ],
    color: 'bg-[#6A7282]/10 text-[#6A7282]',
  },
  {
    id: 'business',
    name: 'Business',
    price: '2,000,000 VND/month',
    features: [
      'Up to 500 products',
      '5 store locations',
      'Advanced analytics',
      '3% commission',
      'Priority support',
    ],
    color: 'bg-[#10B981]/10 text-[#10B981]',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '5,000,000 VND/month',
    features: [
      'Unlimited products',
      'Unlimited stores',
      'Full analytics suite',
      '2% commission',
      '24/7 priority support',
      'Verified badge',
      'Featured placement',
    ],
    color: 'bg-[#F54900]/10 text-[#F54900]',
  },
];

export default function AdminBrandSubscriptionsPage() {
  const { v } = useLanguage();
  const tierName = (id: string) =>
    ({
      starter: v('Starter', 'Khởi đầu'),
      business: v('Business', 'Doanh nghiệp'),
      premium: v('Premium', 'Cao cấp'),
    }[id] ?? id);
  const tierPrice = (id: string, fallback: string) =>
    ({
      starter: v('Free', 'Miễn phí'),
      business: v('2,000,000 VND/month', '2.000.000 VNĐ/tháng'),
      premium: v('5,000,000 VND/month', '5.000.000 VNĐ/tháng'),
    }[id] ?? fallback);
  const featureLabel = (feature: string) =>
    ({
      'Up to 50 products': v('Up to 50 products', 'Tối đa 50 sản phẩm'),
      '1 store location': v('1 store location', '1 địa điểm cửa hàng'),
      'Basic analytics': v('Basic analytics', 'Phân tích cơ bản'),
      '5% commission': v('5% commission', 'Hoa hồng 5%'),
      'Up to 500 products': v('Up to 500 products', 'Tối đa 500 sản phẩm'),
      '5 store locations': v('5 store locations', '5 địa điểm cửa hàng'),
      'Advanced analytics': v('Advanced analytics', 'Phân tích nâng cao'),
      '3% commission': v('3% commission', 'Hoa hồng 3%'),
      'Priority support': v('Priority support', 'Hỗ trợ ưu tiên'),
      'Unlimited products': v('Unlimited products', 'Sản phẩm không giới hạn'),
      'Unlimited stores': v('Unlimited stores', 'Cửa hàng không giới hạn'),
      'Full analytics suite': v('Full analytics suite', 'Bộ phân tích đầy đủ'),
      '2% commission': v('2% commission', 'Hoa hồng 2%'),
      '24/7 priority support': v('24/7 priority support', 'Hỗ trợ ưu tiên 24/7'),
      'Verified badge': v('Verified badge', 'Huy hiệu xác minh'),
      'Featured placement': v('Featured placement', 'Vị trí nổi bật'),
    }[feature] ?? feature);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [newTier, setNewTier] = useState('business');
  const [changeNote, setChangeNote] = useState('');

  // Filter brands
  const filteredBrands = mockBrands.filter((brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || brand.currentTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Stats
  const stats = {
    starter: mockBrands.filter((b) => b.currentTier === 'starter').length,
    business: mockBrands.filter((b) => b.currentTier === 'business').length,
    premium: mockBrands.filter((b) => b.currentTier === 'premium').length,
  };

  const handleChangeTier = () => {
    if (!changeNote.trim()) {
      toast.error(v('Please add a note for the tier change', 'Vui lòng thêm ghi chú cho việc đổi gói'));
      return;
    }
    toast.success(
      v(
        `Subscription changed to ${tierName(newTier)} successfully`,
        `Đã đổi gói đăng ký sang ${tierName(newTier)} thành công`
      )
    );
    setChangeModalOpen(false);
    setSelectedBrand(null);
    setChangeNote('');
  };

  const openChangeModal = (brand: any) => {
    setSelectedBrand(brand);
    setNewTier(brand.currentTier);
    setChangeModalOpen(true);
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
            {v('Brand Subscription Management', 'Quản lý gói đăng ký thương hiệu')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Manage subscription tiers of brands', 'Quản lý các gói đăng ký của thương hiệu')}
          </p>
        </div>
        <Link to="/admin/brands">
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
            {v('Back to Brands', 'Quay lại Thương hiệu')}
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#6A7282]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Crown className="text-[#6A7282]" style={{ width: '24px', height: '24px' }} />
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
              {v('Starter Tier', 'Gói Khởi đầu')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.starter}
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
              <Crown className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
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
              {v('Business Tier', 'Gói Doanh nghiệp')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.business}
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
              <Crown className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              {v('Premium Tier', 'Gói Cao cấp')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.premium}
            </h3>
          </div>
        </Card>
      </div>

      {/* Subscription Tiers Overview */}
      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {subscriptionTiers.map((tier) => (
          <Card
            key={tier.id}
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <Badge
              className={tier.color}
              style={{
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '6px 12px',
                marginBottom: '16px',
              }}
            >
              <Crown style={{ width: '14px', height: '14px', marginRight: '6px' }} />
              {tierName(tier.id)}
            </Badge>
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {tierPrice(tier.id, tier.price)}
            </h3>
            <div
              className="border-t border-[#E5E7EB]"
              style={{ marginTop: '20px', paddingTop: '20px' }}
            >
              <ul className="flex flex-col" style={{ gap: '12px' }}>
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start" style={{ gap: '8px' }}>
                    <Check
                      className="text-[#10B981]"
                      style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }}
                    />
                    <span
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {featureLabel(feature)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="grid grid-cols-2" style={{ gap: '16px' }}>
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
                <SelectValue placeholder={v('Tier', 'Gói')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Tiers', 'Tất cả các gói')}</SelectItem>
                <SelectItem value="starter">{v('Starter', 'Khởi đầu')}</SelectItem>
                <SelectItem value="business">{v('Business', 'Doanh nghiệp')}</SelectItem>
                <SelectItem value="premium">{v('Premium', 'Cao cấp')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Brands List */}
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
                  {v('Current Tier', 'Gói hiện tại')}
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
                  {v('Monthly Revenue', 'Doanh thu tháng')}
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
                  {v('Products', 'Sản phẩm')}
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
                  {v('Member Since', 'Thành viên từ')}
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
                  {v('Actions', 'Hành động')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand) => {
                const tierConfig = subscriptionTiers.find((t) => t.id === brand.currentTier);
                return (
                  <tr key={brand.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center" style={{ gap: '12px' }}>
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="bg-[#F3F4F6]"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                          }}
                        />
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
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <Badge
                        className={tierConfig?.color}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '6px 12px',
                        }}
                      >
                        <Crown style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                        {tierConfig ? tierName(tierConfig.id) : ''}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        {(brand.revenue / 1000000).toFixed(0)}M
                      </p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        {brand.products.toLocaleString('vi-VN')}
                      </p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {new Date(brand.joinDate).toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center justify-end">
                        <Button
                          size="sm"
                          onClick={() => openChangeModal(brand)}
                          className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                          style={{
                            height: '36px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          {v('Change Tier', 'Đổi gói')}
                          <ArrowRight
                            style={{ width: '14px', height: '14px', marginLeft: '6px' }}
                          />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Change Tier Modal */}
      <Dialog open={changeModalOpen} onOpenChange={setChangeModalOpen}>
        <DialogContent style={{ maxWidth: '600px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              {v('Change Subscription Tier', 'Đổi gói đăng ký')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Update subscription tier for', 'Cập nhật gói đăng ký cho')} {selectedBrand?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedBrand && (
            <div className="flex flex-col" style={{ gap: '24px', marginTop: '24px' }}>
              {/* Brand Info */}
              <div className="flex items-center" style={{ gap: '12px' }}>
                <img
                  src={selectedBrand.logo}
                  alt={selectedBrand.name}
                  className="bg-[#F3F4F6]"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <h4
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedBrand.name}
                  </h4>
                  <Badge
                    className={
                      subscriptionTiers.find((t) => t.id === selectedBrand.currentTier)?.color
                    }
                    style={{
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '4px 10px',
                    }}
                  >
                    {v('Current', 'Hiện tại')}: {tierName(selectedBrand.currentTier)}
                  </Badge>
                </div>
              </div>

              {/* New Tier Selection */}
              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '12px',
                    display: 'block',
                  }}
                >
                  {v('New Subscription Tier', 'Gói đăng ký mới')}
                </Label>
                <Select value={newTier} onValueChange={setNewTier}>
                  <SelectTrigger
                    className="border-[#D1D5DC]"
                    style={{
                      height: '48px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">{v('Starter - Free', 'Khởi đầu - Miễn phí')}</SelectItem>
                    <SelectItem value="business">{v('Business - 2,000,000 VND/month', 'Doanh nghiệp - 2.000.000 VNĐ/tháng')}</SelectItem>
                    <SelectItem value="premium">{v('Premium - 5,000,000 VND/month', 'Cao cấp - 5.000.000 VNĐ/tháng')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Change Note */}
              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '12px',
                    display: 'block',
                  }}
                >
                  {v('Change Note', 'Ghi chú thay đổi')}
                </Label>
                <Textarea
                  placeholder={v('Add a note explaining the tier change...', 'Thêm ghi chú giải thích việc đổi gói...')}
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  className="border-[#D1D5DC]"
                  style={{
                    minHeight: '100px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => setChangeModalOpen(false)}
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              {v('Cancel', 'Hủy')}
            </Button>
            <Button
              onClick={handleChangeTier}
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
              <Crown style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Change Tier', 'Đổi gói')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
