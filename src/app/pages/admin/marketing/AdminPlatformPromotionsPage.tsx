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
} from '@/app/components/ui/dialog';
import {
  Search,
  Plus,
  Percent,
  Tag,
  TrendingUp,
  Users,
  Calendar,
  Edit3,
  Trash2,
  Copy,
  Play,
  Pause,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockPromotions = [
  { id: 'PROMO-001', name: 'Summer Sale 2024', nameVi: 'Khuyến mãi Hè 2024', type: 'sitewide', discount: 20, discountType: 'percentage', status: 'active', startDate: '2024-06-01', endDate: '2024-08-31', usageCount: 1250, usageLimit: null, minPurchase: 500000 },
  { id: 'PROMO-002', name: 'New User Welcome', nameVi: 'Chào mừng người dùng mới', type: 'voucher', discount: 100000, discountType: 'fixed', status: 'active', startDate: '2024-01-01', endDate: '2024-12-31', usageCount: 456, usageLimit: null, minPurchase: 300000 },
  { id: 'PROMO-003', name: 'Flash Sale Friday', nameVi: 'Flash Sale thứ Sáu', type: 'sitewide', discount: 30, discountType: 'percentage', status: 'scheduled', startDate: '2024-02-23', endDate: '2024-02-23', usageCount: 0, usageLimit: 1000, minPurchase: 0 },
  { id: 'PROMO-004', name: 'VIP Member Bonus', nameVi: 'Ưu đãi thành viên VIP', type: 'voucher', discount: 200000, discountType: 'fixed', status: 'active', startDate: '2024-02-01', endDate: '2024-02-29', usageCount: 89, usageLimit: 500, minPurchase: 1000000 },
  { id: 'PROMO-005', name: 'Free Shipping February', nameVi: 'Miễn phí vận chuyển tháng Hai', type: 'sitewide', discount: 0, discountType: 'free_shipping', status: 'active', startDate: '2024-02-01', endDate: '2024-02-29', usageCount: 2340, usageLimit: null, minPurchase: 200000 },
  { id: 'PROMO-006', name: 'Birthday Special', nameVi: 'Ưu đãi sinh nhật', type: 'voucher', discount: 15, discountType: 'percentage', status: 'paused', startDate: '2024-01-01', endDate: '2024-12-31', usageCount: 234, usageLimit: null, minPurchase: 0 },
  { id: 'PROMO-007', name: 'Valentine Sale', nameVi: 'Khuyến mãi Valentine', type: 'sitewide', discount: 25, discountType: 'percentage', status: 'expired', startDate: '2024-02-10', endDate: '2024-02-14', usageCount: 890, usageLimit: null, minPurchase: 400000 },
  { id: 'PROMO-008', name: 'First Purchase 50K Off', nameVi: 'Giảm 50K cho đơn đầu tiên', type: 'voucher', discount: 50000, discountType: 'fixed', status: 'active', startDate: '2024-01-15', endDate: '2024-12-31', usageCount: 567, usageLimit: null, minPurchase: 250000 },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-[#10B981]/10 text-[#10B981]', icon: Play },
  scheduled: { label: 'Scheduled', color: 'bg-[#3B82F6]/10 text-[#3B82F6]', icon: Calendar },
  paused: { label: 'Paused', color: 'bg-[#F59E0B]/10 text-[#F59E0B]', icon: Pause },
  expired: { label: 'Expired', color: 'bg-[#6A7282]/10 text-[#6A7282]', icon: Calendar },
};

const typeConfig = {
  sitewide: { label: 'Sitewide Sale', color: 'bg-[#F54900]/10 text-[#F54900]', icon: TrendingUp },
  voucher: { label: 'Voucher', color: 'bg-[#3B82F6]/10 text-[#3B82F6]', icon: Tag },
};

export default function AdminPlatformPromotionsPage() {
  const { v, lang } = useLanguage();
  const [promotions, setPromotions] = useState(mockPromotions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter promotions
  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || promo.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || promo.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.status === 'active').length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
    scheduled: promotions.filter((p) => p.status === 'scheduled').length,
  };

  const handlePause = (id: string) => {
    setPromotions(promotions.map((p) => (p.id === id ? { ...p, status: 'paused' } : p)));
    toast.success(v('Promotion paused', 'Đã tạm dừng khuyến mãi'));
  };

  const handleResume = (id: string) => {
    setPromotions(promotions.map((p) => (p.id === id ? { ...p, status: 'active' } : p)));
    toast.success(v('Promotion resumed', 'Đã tiếp tục khuyến mãi'));
  };

  const handleDelete = () => {
    setPromotions(promotions.filter((p) => p.id !== selectedPromo?.id));
    setDeleteModalOpen(false);
    setSelectedPromo(null);
    toast.success(v('Promotion deleted', 'Đã xóa khuyến mãi'));
  };

  const handleDuplicate = (promo: any) => {
    const newPromo = {
      ...promo,
      id: `PROMO-${String(promotions.length + 1).padStart(3, '0')}`,
      name: `${promo.name} ${v('(Copy)', '(Bản sao)')}`,
      nameVi: promo.nameVi ? `${promo.nameVi} ${v('(Copy)', '(Bản sao)')}` : undefined,
      usageCount: 0,
      status: 'scheduled',
    };
    setPromotions([newPromo, ...promotions]);
    toast.success(v('Promotion duplicated', 'Đã nhân bản khuyến mãi'));
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
            {v('Platform Promotions', 'Khuyến mãi nền tảng')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Manage promotions and vouchers across the platform', 'Quản lý promotions và vouchers toàn platform')}
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/marketing/push-notifications">
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
              {v('Push Notifications', 'Thông báo đẩy')}
            </Button>
          </Link>
          <Link to="/admin/marketing/email-campaigns">
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
              {v('Email Campaigns', 'Chiến dịch email')}
            </Button>
          </Link>
          <Link to="/admin/marketing/vouchers/create">
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
              <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Create Promotion', 'Tạo khuyến mãi')}
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
              <Percent className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Promotions', 'Tổng khuyến mãi')}
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
              <Play className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
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
              {v('Active Now', 'Đang hoạt động')}
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
              <Users className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Usage', 'Tổng lượt sử dụng')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(stats.totalUsage / 1000).toFixed(1)}K
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#3B82F6]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Calendar className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
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
              {v('Scheduled', 'Đã lên lịch')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.scheduled}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="grid grid-cols-3" style={{ gap: '16px' }}>
          {/* Search */}
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                style={{ width: '16px', height: '16px' }}
              />
              <Input
                placeholder={v('Search promotions...', 'Tìm kiếm khuyến mãi...')}
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

          {/* Type Filter */}
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Type', 'Loại')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Types', 'Tất cả loại')}</SelectItem>
                <SelectItem value="sitewide">{v('Sitewide Sale', 'Giảm giá toàn trang')}</SelectItem>
                <SelectItem value="voucher">{v('Voucher', 'Voucher')}</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="active">{v('Active', 'Đang hoạt động')}</SelectItem>
                <SelectItem value="scheduled">{v('Scheduled', 'Đã lên lịch')}</SelectItem>
                <SelectItem value="paused">{v('Paused', 'Tạm dừng')}</SelectItem>
                <SelectItem value="expired">{v('Expired', 'Đã hết hạn')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Promotions List */}
      <div className="flex flex-col" style={{ gap: '16px' }}>
        {paginatedPromotions.map((promo) => (
          <Card
            key={promo.id}
            className="bg-white hover:shadow-lg transition-shadow"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center" style={{ gap: '12px', marginBottom: '12px' }}>
                  <h3
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {lang === 'vi' && (promo as any).nameVi ? (promo as any).nameVi : promo.name}
                  </h3>
                  <Badge
                    className={typeConfig[promo.type as keyof typeof typeConfig].color}
                    style={{
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '6px 12px',
                    }}
                  >
                    {promo.type === 'sitewide'
                      ? v('Sitewide Sale', 'Giảm giá toàn trang')
                      : v('Voucher', 'Voucher')}
                  </Badge>
                  <Badge
                    className={statusConfig[promo.status as keyof typeof statusConfig].color}
                    style={{
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '6px 12px',
                    }}
                  >
                    {promo.status === 'active'
                      ? v('Active', 'Đang hoạt động')
                      : promo.status === 'scheduled'
                      ? v('Scheduled', 'Đã lên lịch')
                      : promo.status === 'paused'
                      ? v('Paused', 'Tạm dừng')
                      : v('Expired', 'Đã hết hạn')}
                  </Badge>
                </div>

                <div className="grid grid-cols-5" style={{ gap: '24px', marginBottom: '16px' }}>
                  <div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {v('Code', 'Mã')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {promo.id}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {v('Discount', 'Giảm giá')}
                    </p>
                    <p
                      className="text-[#F54900]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {promo.discountType === 'percentage'
                        ? `${promo.discount}%`
                        : promo.discountType === 'fixed'
                        ? `${promo.discount.toLocaleString('vi-VN')}đ`
                        : v('Free Shipping', 'Miễn phí vận chuyển')}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {v('Usage', 'Lượt sử dụng')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {promo.usageCount}
                      {promo.usageLimit && ` / ${promo.usageLimit}`}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {v('Start Date', 'Ngày bắt đầu')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {new Date(promo.startDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {v('End Date', 'Ngày kết thúc')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                {promo.minPurchase > 0 && (
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Min. purchase:', 'Đơn tối thiểu:')} {promo.minPurchase.toLocaleString('vi-VN')}đ
                  </p>
                )}
              </div>

              <div className="flex items-center" style={{ gap: '8px' }}>
                <Button
                  onClick={() => handleDuplicate(promo)}
                  variant="ghost"
                  size="sm"
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                  }}
                >
                  <Copy className="text-[#0A0A0A]" style={{ width: '16px', height: '16px' }} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                  }}
                >
                  <Edit3 className="text-[#0A0A0A]" style={{ width: '16px', height: '16px' }} />
                </Button>
                {promo.status === 'active' && (
                  <Button
                    onClick={() => handlePause(promo.id)}
                    variant="ghost"
                    size="sm"
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                    }}
                  >
                    <Pause className="text-[#F59E0B]" style={{ width: '16px', height: '16px' }} />
                  </Button>
                )}
                {promo.status === 'paused' && (
                  <Button
                    onClick={() => handleResume(promo.id)}
                    variant="ghost"
                    size="sm"
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                    }}
                  >
                    <Play className="text-[#10B981]" style={{ width: '16px', height: '16px' }} />
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setSelectedPromo(promo);
                    setDeleteModalOpen(true);
                  }}
                  variant="ghost"
                  size="sm"
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                  }}
                >
                  <Trash2 className="text-[#E7000B]" style={{ width: '16px', height: '16px' }} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center" style={{ gap: '8px' }}>
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
      )}

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent style={{ maxWidth: '500px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              {v('Delete Promotion', 'Xóa khuyến mãi')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Are you sure you want to delete', 'Bạn có chắc chắn muốn xóa')} "{selectedPromo?.name}"? {v('This action cannot be undone.', 'Hành động này không thể hoàn tác.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedPromo(null);
              }}
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
              onClick={handleDelete}
              className="bg-[#E7000B] text-white hover:bg-[#E7000B]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <Trash2 style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Delete', 'Xóa')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
