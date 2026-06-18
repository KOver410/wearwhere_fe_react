import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Search,
  AlertTriangle,
  Clock,
  Eye,
  Image,
  MessageSquare,
  Star,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockReportedOOTDs = [
  {
    id: 1,
    type: 'ootd',
    content: 'Summer vibes! Love this new dress from Zara ☀️👗',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    author: {
      id: 1,
      name: 'Nguyễn Lan Anh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    reportCount: 5,
    priority: 'high',
    reportedAt: '2024-02-15T10:30:00',
    reasons: ['Spam', 'Inappropriate Content'],
    status: 'pending',
    claimedBy: null,
  },
  {
    id: 2,
    type: 'ootd',
    content: 'Check out my new outfit! 🔥',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400',
    author: {
      id: 2,
      name: 'Trần Minh Châu',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
    reportCount: 3,
    priority: 'medium',
    reportedAt: '2024-02-15T09:15:00',
    reasons: ['Misleading'],
    status: 'pending',
    claimedBy: null,
  },
  {
    id: 3,
    type: 'ootd',
    content: 'Love my new shoes! Best purchase ever 👟',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    author: {
      id: 3,
      name: 'Lê Thu Hà',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    },
    reportCount: 8,
    priority: 'high',
    reportedAt: '2024-02-15T08:45:00',
    reasons: ['Spam', 'Advertisement'],
    status: 'claimed',
    claimedBy: 'Admin John',
  },
];

const mockReportedComments = [
  {
    id: 1,
    type: 'comment',
    content: 'This is fake! Don\'t buy from this brand!',
    post: {
      id: 1,
      title: 'Summer vibes outfit',
      type: 'ootd',
    },
    author: {
      id: 4,
      name: 'Phạm Văn Nam',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    reportCount: 4,
    priority: 'medium',
    reportedAt: '2024-02-15T11:00:00',
    reasons: ['Harassment', 'False Information'],
    status: 'pending',
    claimedBy: null,
  },
  {
    id: 2,
    type: 'comment',
    content: 'Spam spam spam spam',
    post: {
      id: 2,
      title: 'New dress review',
      type: 'ootd',
    },
    author: {
      id: 5,
      name: 'Hoàng Thị Mai',
      avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100',
    },
    reportCount: 6,
    priority: 'high',
    reportedAt: '2024-02-15T10:45:00',
    reasons: ['Spam'],
    status: 'pending',
    claimedBy: null,
  },
];

const mockReportedReviews = [
  {
    id: 1,
    type: 'review',
    content: 'Terrible quality! Waste of money. This brand is a scam!',
    rating: 1,
    product: {
      id: 1,
      name: 'Áo Sơ Mi Trắng Classic',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200',
      brand: 'Zara Vietnam',
    },
    author: {
      id: 6,
      name: 'Đỗ Quang Huy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    },
    reportCount: 3,
    priority: 'medium',
    reportedAt: '2024-02-15T09:30:00',
    reasons: ['False Information', 'Harassment'],
    status: 'pending',
    claimedBy: null,
  },
];

const priorityConfig = {
  high: { label: 'High', color: 'bg-[#E7000B]/10 text-[#E7000B]', sortOrder: 1 },
  medium: { label: 'Medium', color: 'bg-[#F54900]/10 text-[#F54900]', sortOrder: 2 },
  low: { label: 'Low', color: 'bg-[#6A7282]/10 text-[#6A7282]', sortOrder: 3 },
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-[#F54900]/10 text-[#F54900]', icon: Clock },
  claimed: { label: 'Claimed', color: 'bg-[#0A0A0A]/10 text-[#0A0A0A]', icon: Eye },
  resolved: { label: 'Resolved', color: 'bg-[#10B981]/10 text-[#10B981]', icon: Eye },
};

const priorityLabelVi: Record<string, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const statusLabelVi: Record<string, string> = {
  pending: 'Đang chờ',
  claimed: 'Đã nhận',
  resolved: 'Đã xử lý',
};

const reasonLabelVi: Record<string, string> = {
  Spam: 'Spam',
  'Inappropriate Content': 'Nội dung không phù hợp',
  Misleading: 'Gây hiểu lầm',
  Advertisement: 'Quảng cáo',
  Harassment: 'Quấy rối',
  'False Information': 'Thông tin sai lệch',
};

export default function AdminModerationQueuePage() {
  const { v } = useLanguage();
  const [activeTab, setActiveTab] = useState('ootd');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'ootd':
        return mockReportedOOTDs;
      case 'comments':
        return mockReportedComments;
      case 'reviews':
        return mockReportedReviews;
      default:
        return [];
    }
  };

  // Filter and sort data
  const filteredData = getCurrentData()
    .filter((item) => {
      const matchesSearch =
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return (
          priorityConfig[a.priority as keyof typeof priorityConfig].sortOrder -
          priorityConfig[b.priority as keyof typeof priorityConfig].sortOrder
        );
      } else if (sortBy === 'reports') {
        return b.reportCount - a.reportCount;
      } else {
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }
    });

  // Stats
  const stats = {
    totalPending: [...mockReportedOOTDs, ...mockReportedComments, ...mockReportedReviews].filter(
      (i) => i.status === 'pending'
    ).length,
    ootdPending: mockReportedOOTDs.filter((i) => i.status === 'pending').length,
    commentsPending: mockReportedComments.filter((i) => i.status === 'pending').length,
    reviewsPending: mockReportedReviews.filter((i) => i.status === 'pending').length,
  };

  const handleClaimReport = (reportId: number) => {
    // Navigate to review page
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
            <h1
              className="text-[#0A0A0A]"
              style={{
                fontSize: '36px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              {v('Moderation Queue', 'Hàng đợi kiểm duyệt')}
            </h1>
            <Badge
              className="bg-[#E7000B]/10 text-[#E7000B]"
              style={{
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '6px 16px',
              }}
            >
              {stats.totalPending} {v('Pending', 'Đang chờ')}
            </Badge>
          </div>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Review reported content và take action', 'Xem xét nội dung bị báo cáo và xử lý')}
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/moderation/settings">
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
              <Filter style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Auto-filter Settings', 'Cài đặt bộ lọc tự động')}
            </Button>
          </Link>
          <Link to="/admin/moderation/history">
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
              <Clock style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('History', 'Lịch sử')}
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
              className="flex items-center justify-center bg-[#E7000B]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <AlertTriangle className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Pending', 'Tổng đang chờ')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.totalPending}
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
              <Image className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('OOTD Posts', 'Bài đăng OOTD')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.ootdPending}
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
              <MessageSquare className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('Comments', 'Bình luận')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.commentsPending}
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
              <Star className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('Reviews', 'Đánh giá')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.reviewsPending}
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
                placeholder={v('Search content...', 'Tìm kiếm nội dung...')}
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

          {/* Priority Filter */}
          <div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Priority', 'Mức ưu tiên')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Priority', 'Tất cả mức ưu tiên')}</SelectItem>
                <SelectItem value="high">{v('High Priority', 'Ưu tiên cao')}</SelectItem>
                <SelectItem value="medium">{v('Medium Priority', 'Ưu tiên trung bình')}</SelectItem>
                <SelectItem value="low">{v('Low Priority', 'Ưu tiên thấp')}</SelectItem>
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
                <SelectItem value="pending">{v('Pending', 'Đang chờ')}</SelectItem>
                <SelectItem value="claimed">{v('Claimed', 'Đã nhận')}</SelectItem>
                <SelectItem value="resolved">{v('Resolved', 'Đã xử lý')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <Select value={sortBy} onValueChange={setSortBy}>
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
                <SelectItem value="priority">{v('Sort by Priority', 'Sắp xếp theo mức ưu tiên')}</SelectItem>
                <SelectItem value="reports">{v('Sort by Report Count', 'Sắp xếp theo số lượt báo cáo')}</SelectItem>
                <SelectItem value="date">{v('Sort by Date', 'Sắp xếp theo ngày')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className="bg-white border-b border-[#E5E7EB]"
          style={{ padding: '0', height: 'auto', borderRadius: '0' }}
        >
          <TabsTrigger
            value="ootd"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0A0A0A]"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
              borderRadius: '0',
            }}
          >
            <Image style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('OOTD Posts', 'Bài đăng OOTD')} ({stats.ootdPending})
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0A0A0A]"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
              borderRadius: '0',
            }}
          >
            <MessageSquare style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Comments', 'Bình luận')} ({stats.commentsPending})
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#0A0A0A]"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
              borderRadius: '0',
            }}
          >
            <Star style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Reviews', 'Đánh giá')} ({stats.reviewsPending})
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <TabsContent value={activeTab} style={{ marginTop: '24px' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            {filteredData.length === 0 ? (
              <Card
                className="bg-white"
                style={{ padding: '48px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
              >
                <div className="text-center">
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('No reports found', 'Không tìm thấy báo cáo nào')}
                  </p>
                </div>
              </Card>
            ) : (
              filteredData.map((item: any) => (
                <Card
                  key={item.id}
                  className="bg-white"
                  style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
                >
                  <div className="flex" style={{ gap: '20px' }}>
                    {/* Content Preview */}
                    <div style={{ flex: 1 }}>
                      {/* Header */}
                      <div
                        className="flex items-start justify-between"
                        style={{ marginBottom: '16px' }}
                      >
                        <div className="flex items-center" style={{ gap: '12px' }}>
                          <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="bg-[#F3F4F6]"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '9999px',
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
                              {item.author.name}
                            </p>
                            <p
                              className="text-[#6A7282]"
                              style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                            >
                              {v('Reported', 'Đã báo cáo')} {new Date(item.reportedAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                          <Badge
                            className={
                              priorityConfig[item.priority as keyof typeof priorityConfig].color
                            }
                            style={{
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '700',
                              fontFamily: 'Arimo, sans-serif',
                              padding: '6px 12px',
                            }}
                          >
                            <TrendingUp
                              style={{ width: '12px', height: '12px', marginRight: '4px' }}
                            />
                            {v(
                              priorityConfig[item.priority as keyof typeof priorityConfig].label,
                              priorityLabelVi[item.priority] ?? priorityConfig[item.priority as keyof typeof priorityConfig].label
                            )}
                          </Badge>
                          <Badge
                            className={statusConfig[item.status as keyof typeof statusConfig].color}
                            style={{
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '700',
                              fontFamily: 'Arimo, sans-serif',
                              padding: '6px 12px',
                            }}
                          >
                            {v(
                              statusConfig[item.status as keyof typeof statusConfig].label,
                              statusLabelVi[item.status] ?? statusConfig[item.status as keyof typeof statusConfig].label
                            )}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex" style={{ gap: '16px', marginBottom: '16px' }}>
                        {item.type === 'ootd' && item.image && (
                          <img
                            src={item.image}
                            alt="OOTD"
                            className="bg-[#F3F4F6]"
                            style={{
                              width: '120px',
                              height: '120px',
                              borderRadius: '10px',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        {item.type === 'review' && item.product && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="bg-[#F3F4F6]"
                            style={{
                              width: '120px',
                              height: '120px',
                              borderRadius: '10px',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          {item.type === 'review' && (
                            <div style={{ marginBottom: '8px' }}>
                              <p
                                className="text-[#6A7282]"
                                style={{
                                  fontSize: '12px',
                                  fontFamily: 'Arimo, sans-serif',
                                  marginBottom: '4px',
                                }}
                              >
                                {v('Product', 'Sản phẩm')}
                              </p>
                              <p
                                className="text-[#0A0A0A]"
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  fontFamily: 'Arimo, sans-serif',
                                }}
                              >
                                {item.product.name}
                              </p>
                              <div className="flex items-center" style={{ marginTop: '4px' }}>
                                {Array.from({ length: item.rating }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="text-[#F54900]"
                                    style={{ width: '14px', height: '14px' }}
                                    fill="#F54900"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {item.type === 'comment' && item.post && (
                            <div style={{ marginBottom: '8px' }}>
                              <p
                                className="text-[#6A7282]"
                                style={{
                                  fontSize: '12px',
                                  fontFamily: 'Arimo, sans-serif',
                                  marginBottom: '4px',
                                }}
                              >
                                {v('Comment on', 'Bình luận về')}
                              </p>
                              <p
                                className="text-[#0A0A0A]"
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  fontFamily: 'Arimo, sans-serif',
                                }}
                              >
                                {item.post.title}
                              </p>
                            </div>
                          )}
                          <p
                            className="text-[#0A0A0A]"
                            style={{
                              fontSize: '14px',
                              fontFamily: 'Arimo, sans-serif',
                              lineHeight: '1.5',
                            }}
                          >
                            {item.content}
                          </p>
                        </div>
                      </div>

                      {/* Report Info */}
                      <div
                        className="flex items-center bg-[#F9FAFB]"
                        style={{ padding: '12px', borderRadius: '8px', gap: '16px' }}
                      >
                        <div className="flex items-center" style={{ gap: '6px' }}>
                          <AlertTriangle
                            className="text-[#E7000B]"
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span
                            className="text-[#0A0A0A]"
                            style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              fontFamily: 'Arimo, sans-serif',
                            }}
                          >
                            {item.reportCount} {v('reports', 'báo cáo')}
                          </span>
                        </div>
                        <div className="flex items-center" style={{ gap: '6px', flexWrap: 'wrap' }}>
                          {item.reasons.map((reason: string, idx: number) => (
                            <Badge
                              key={idx}
                              className="bg-[#E7000B]/10 text-[#E7000B]"
                              style={{
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontFamily: 'Arimo, sans-serif',
                                padding: '4px 10px',
                              }}
                            >
                              {v(reason, reasonLabelVi[reason] ?? reason)}
                            </Badge>
                          ))}
                        </div>
                        {item.claimedBy && (
                          <span
                            className="text-[#6A7282]"
                            style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                          >
                            {v('Claimed by', 'Nhận bởi')} {item.claimedBy}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col" style={{ gap: '8px', minWidth: '160px' }}>
                      <Link
                        to={`/admin/moderation/${item.type === 'ootd' ? 'ootd' : item.type === 'comment' ? 'comment' : 'review'}/${item.id}`}
                      >
                        <Button
                          className="w-full bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                          style={{
                            height: '40px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          <Eye style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                          {v('Review', 'Xem xét')}
                        </Button>
                      </Link>
                      {item.status === 'pending' && (
                        <Button
                          onClick={() => handleClaimReport(item.id)}
                          variant="outline"
                          className="w-full border-[#D1D5DC]"
                          style={{
                            height: '40px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          {v('Claim', 'Nhận xử lý')}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
