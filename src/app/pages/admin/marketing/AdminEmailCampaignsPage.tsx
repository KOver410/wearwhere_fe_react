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
  Mail,
  Search,
  Plus,
  Send,
  Users,
  TrendingUp,
  Edit3,
  Trash2,
  Copy,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockCampaigns = [
  { id: 'CAMP-001', name: 'Welcome Series', subject: 'Welcome to WearWhere!', audience: 'New Users', sent: 1234, opened: 892, clicked: 456, revenue: 45600000, status: 'active', sentAt: '2024-02-14 10:00', type: 'automated' },
  { id: 'CAMP-002', name: 'Flash Sale February', subject: 'Flash Sale: 30% Off Everything!', audience: 'All Users', sent: 15234, opened: 9542, clicked: 4321, revenue: 234500000, status: 'sent', sentAt: '2024-02-13 09:00', type: 'promotional' },
  { id: 'CAMP-003', name: 'Cart Abandonment', subject: 'You left something behind...', audience: 'Cart Abandoners', sent: 890, opened: 567, clicked: 234, revenue: 12300000, status: 'active', sentAt: '2024-02-12 14:30', type: 'automated' },
  { id: 'CAMP-004', name: 'VIP Exclusive Offer', subject: 'Special offer just for you', audience: 'VIP Members', sent: 2340, opened: 1876, clicked: 982, revenue: 89400000, status: 'sent', sentAt: '2024-02-10 11:00', type: 'promotional' },
  { id: 'CAMP-005', name: 'Product Recommendations', subject: 'Styles we think you\'ll love', audience: 'Active Users', sent: 8765, opened: 5234, clicked: 2345, revenue: 67800000, status: 'active', sentAt: '2024-02-09 16:00', type: 'automated' },
  { id: 'CAMP-006', name: 'Weekend Sale Preview', subject: 'Get ready for weekend deals!', audience: 'All Users', sent: 0, opened: 0, clicked: 0, revenue: 0, status: 'scheduled', sentAt: '2024-02-17 08:00', type: 'promotional' },
  { id: 'CAMP-007', name: 'Brand Spotlight: Zara', subject: 'New arrivals from Zara', audience: 'Fashion Enthusiasts', sent: 0, opened: 0, clicked: 0, revenue: 0, status: 'draft', sentAt: null, type: 'promotional' },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-[#10B981]/10 text-[#10B981]' },
  sent: { label: 'Sent', color: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
  scheduled: { label: 'Scheduled', color: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  draft: { label: 'Draft', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
  paused: { label: 'Paused', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
};

const typeConfig = {
  automated: { label: 'Automated', color: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
  promotional: { label: 'Promotional', color: 'bg-[#F54900]/10 text-[#F54900]' },
};

export default function AdminEmailCampaignsPage() {
  const { v } = useLanguage();
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusLabels: Record<string, string> = {
    active: v('Active', 'Đang hoạt động'),
    sent: v('Sent', 'Đã gửi'),
    scheduled: v('Scheduled', 'Đã lên lịch'),
    draft: v('Draft', 'Bản nháp'),
    paused: v('Paused', 'Tạm dừng'),
  };

  const typeLabels: Record<string, string> = {
    automated: v('Automated', 'Tự động'),
    promotional: v('Promotional', 'Khuyến mãi'),
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const sentCampaigns = campaigns.filter((c) => c.status === 'sent' || c.status === 'active');
  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    avgOpenRate: sentCampaigns.length > 0
      ? (sentCampaigns.reduce((sum, c) => sum + (c.sent > 0 ? (c.opened / c.sent) * 100 : 0), 0) / sentCampaigns.length).toFixed(1)
      : 0,
    totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
  };

  const handleDelete = () => {
    setCampaigns(campaigns.filter((c) => c.id !== selectedCampaign?.id));
    setDeleteModalOpen(false);
    setSelectedCampaign(null);
    toast.success(v('Campaign deleted', 'Đã xóa chiến dịch'));
  };

  const handleDuplicate = (campaign: any) => {
    const newCampaign = {
      ...campaign,
      id: `CAMP-${String(campaigns.length + 1).padStart(3, '0')}`,
      name: `${campaign.name} (Copy)`,
      sent: 0,
      opened: 0,
      clicked: 0,
      revenue: 0,
      status: 'draft',
      sentAt: null,
    };
    setCampaigns([newCampaign, ...campaigns]);
    toast.success(v('Campaign duplicated', 'Đã nhân bản chiến dịch'));
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
            {v('Email Campaigns', 'Chiến dịch Email')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Quản lý email marketing campaigns
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/marketing/promotions">
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
              {v('Back to Marketing', 'Quay lại Marketing')}
            </Button>
          </Link>
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
            {v('Create Campaign', 'Tạo chiến dịch')}
          </Button>
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
              <Mail className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Campaigns', 'Tổng chiến dịch')}
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
              <Send className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
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
              {v('Active Campaigns', 'Chiến dịch đang hoạt động')}
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
              className="flex items-center justify-center bg-[#3B82F6]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Eye className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
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
              {v('Avg. Open Rate', 'Tỷ lệ mở trung bình')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.avgOpenRate}%
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
              <TrendingUp className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Revenue', 'Tổng doanh thu')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(stats.totalRevenue / 1000000).toFixed(0)}M
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
                placeholder={v('Search campaigns...', 'Tìm kiếm chiến dịch...')}
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
                <SelectItem value="automated">{v('Automated', 'Tự động')}</SelectItem>
                <SelectItem value="promotional">{v('Promotional', 'Khuyến mãi')}</SelectItem>
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
                <SelectItem value="sent">{v('Sent', 'Đã gửi')}</SelectItem>
                <SelectItem value="scheduled">{v('Scheduled', 'Đã lên lịch')}</SelectItem>
                <SelectItem value="draft">{v('Draft', 'Bản nháp')}</SelectItem>
                <SelectItem value="paused">{v('Paused', 'Tạm dừng')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Campaigns List */}
      <div className="flex flex-col" style={{ gap: '16px' }}>
        {paginatedCampaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="bg-white hover:shadow-lg transition-shadow"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
                  <h3
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {campaign.name}
                  </h3>
                  <Badge
                    className={typeConfig[campaign.type as keyof typeof typeConfig].color}
                    style={{
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '6px 12px',
                    }}
                  >
                    {typeLabels[campaign.type]}
                  </Badge>
                  <Badge
                    className={statusConfig[campaign.status as keyof typeof statusConfig].color}
                    style={{
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '6px 12px',
                    }}
                  >
                    {statusLabels[campaign.status]}
                  </Badge>
                </div>

                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '16px',
                  }}
                >
                  {v('Subject:', 'Tiêu đề:')} {campaign.subject}
                </p>

                <div className="grid grid-cols-6" style={{ gap: '24px' }}>
                  <div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {v('Audience', 'Đối tượng')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {campaign.audience}
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
                      {v('Sent', 'Đã gửi')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {campaign.sent.toLocaleString()}
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
                      {v('Opened', 'Đã mở')}
                    </p>
                    <p
                      className="text-[#3B82F6]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0}%
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
                      {v('Clicked', 'Đã nhấp')}
                    </p>
                    <p
                      className="text-[#F54900]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(1) : 0}%
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
                      {v('Revenue', 'Doanh thu')}
                    </p>
                    <p
                      className="text-[#10B981]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {(campaign.revenue / 1000000).toFixed(1)}M
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
                      {campaign.status === 'scheduled' ? v('Scheduled', 'Đã lên lịch') : campaign.status === 'draft' ? v('Created', 'Đã tạo') : v('Sent At', 'Gửi lúc')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {campaign.sentAt || '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center" style={{ gap: '8px' }}>
                <Button
                  onClick={() => handleDuplicate(campaign)}
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
                <Button
                  onClick={() => {
                    setSelectedCampaign(campaign);
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
            {v('Next', 'Tiếp')}
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
              {v('Delete Campaign', 'Xóa chiến dịch')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Are you sure you want to delete', 'Bạn có chắc chắn muốn xóa')} "{selectedCampaign?.name}"? {v('This action cannot be undone.', 'Hành động này không thể hoàn tác.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedCampaign(null);
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
