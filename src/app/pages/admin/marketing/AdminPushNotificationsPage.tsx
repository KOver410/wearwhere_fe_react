import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Bell,
  Send,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data for sent notifications
const mockNotifications = [
  { id: 'NOTIF-001', title: 'Flash Sale Alert!', message: 'Get 30% off on selected items. Limited time only!', audience: 'All Users', sent: 15234, opened: 8542, clicked: 3421, sentAt: '2024-02-14 10:00', status: 'sent' },
  { id: 'NOTIF-002', title: 'New Arrivals', message: 'Check out the latest fashion trends from top brands', audience: 'VIP Members', sent: 2340, opened: 1456, clicked: 892, sentAt: '2024-02-13 15:30', status: 'sent' },
  { id: 'NOTIF-003', title: 'Your Order is Shipped', message: 'Track your order ORD-2024-123', audience: 'Custom', sent: 1, opened: 1, clicked: 1, sentAt: '2024-02-12 09:15', status: 'sent' },
  { id: 'NOTIF-004', title: 'Weekend Sale Coming', message: 'Get ready for amazing deals this weekend!', audience: 'All Users', sent: 0, opened: 0, clicked: 0, sentAt: '2024-02-17 08:00', status: 'scheduled' },
];

const statusConfig = {
  sent: { label: 'Sent', color: 'bg-[#10B981]/10 text-[#10B981]' },
  scheduled: { label: 'Scheduled', color: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
  draft: { label: 'Draft', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
};

export default function AdminPushNotificationsPage() {
  const { v } = useLanguage();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);

  // Composer state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'all',
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: '',
    actionUrl: '',
    iconUrl: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSend = () => {
    if (formData.scheduleType === 'now') {
      toast.success(v('Push notification sent successfully!', 'Đã gửi thông báo đẩy thành công!'));
    } else {
      toast.success(v('Push notification scheduled!', 'Đã lên lịch thông báo đẩy!'));
    }
    setShowComposer(false);
    setFormData({
      title: '',
      message: '',
      audience: 'all',
      scheduleType: 'now',
      scheduleDate: '',
      scheduleTime: '',
      actionUrl: '',
      iconUrl: '',
    });
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) =>
    notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    total: notifications.filter((n) => n.status === 'sent').length,
    totalSent: notifications.filter((n) => n.status === 'sent').reduce((sum, n) => sum + n.sent, 0),
    avgOpenRate: notifications.filter((n) => n.status === 'sent').length > 0
      ? (notifications.filter((n) => n.status === 'sent').reduce((sum, n) => sum + (n.sent > 0 ? (n.opened / n.sent) * 100 : 0), 0) / notifications.filter((n) => n.status === 'sent').length).toFixed(1)
      : 0,
    avgClickRate: notifications.filter((n) => n.status === 'sent').length > 0
      ? (notifications.filter((n) => n.status === 'sent').reduce((sum, n) => sum + (n.sent > 0 ? (n.clicked / n.sent) * 100 : 0), 0) / notifications.filter((n) => n.status === 'sent').length).toFixed(1)
      : 0,
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
            {v('Push Notifications', 'Thông báo đẩy')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Gửi push notifications đến users
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
            onClick={() => setShowComposer(!showComposer)}
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
            <Send style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {showComposer ? v('Hide Composer', 'Ẩn trình soạn') : v('Compose Notification', 'Soạn thông báo')}
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
              <Bell className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Sent', 'Tổng đã gửi')}
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
              className="flex items-center justify-center bg-[#3B82F6]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Users className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
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
              {v('Users Reached', 'Người dùng tiếp cận')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(stats.totalSent / 1000).toFixed(1)}K
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
              {v('Avg. Open Rate', 'Tỷ lệ mở TB')}
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
              {v('Avg. Click Rate', 'Tỷ lệ nhấp TB')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.avgClickRate}%
            </h3>
          </div>
        </Card>
      </div>

      {/* Composer */}
      {showComposer && (
        <Card
          className="bg-white"
          style={{ padding: '32px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <h3
            className="text-[#0A0A0A]"
            style={{
              fontSize: '24px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              marginBottom: '24px',
            }}
          >
            {v('Compose Push Notification', 'Soạn thông báo đẩy')}
          </h3>

          <div className="grid grid-cols-3" style={{ gap: '24px' }}>
            {/* Left Column - Message */}
            <div className="col-span-2 flex flex-col" style={{ gap: '20px' }}>
              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Notification Title *', 'Tiêu đề thông báo *')}
                </Label>
                <Input
                  required
                  placeholder={v('e.g., Flash Sale Alert!', 'vd: Cảnh báo Flash Sale!')}
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  maxLength={50}
                  className="border-[#D1D5DC]"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginTop: '6px',
                  }}
                >
                  {formData.title.length}/50 {v('characters', 'ký tự')}
                </p>
              </div>

              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Message *', 'Nội dung *')}
                </Label>
                <Textarea
                  required
                  placeholder={v('Enter your message...', 'Nhập nội dung của bạn...')}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  maxLength={150}
                  className="border-[#D1D5DC]"
                  style={{
                    minHeight: '120px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginTop: '6px',
                  }}
                >
                  {formData.message.length}/150 {v('characters', 'ký tự')}
                </p>
              </div>

              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Action URL (Optional)', 'URL hành động (Tùy chọn)')}
                </Label>
                <Input
                  placeholder={v('e.g., /products/sale', 'vd: /products/sale')}
                  value={formData.actionUrl}
                  onChange={(e) => handleChange('actionUrl', e.target.value)}
                  className="border-[#D1D5DC]"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginTop: '6px',
                  }}
                >
                  {v('Where users go when they tap the notification', 'Nơi người dùng đến khi nhấn vào thông báo')}
                </p>
              </div>

              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Target Audience *', 'Đối tượng mục tiêu *')}
                </Label>
                <Select value={formData.audience} onValueChange={(v) => handleChange('audience', v)}>
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
                    <SelectItem value="all">{v('All Users (~15,000)', 'Tất cả người dùng (~15.000)')}</SelectItem>
                    <SelectItem value="vip">{v('VIP Members (~2,340)', 'Thành viên VIP (~2.340)')}</SelectItem>
                    <SelectItem value="new">{v('New Users (~1,200)', 'Người dùng mới (~1.200)')}</SelectItem>
                    <SelectItem value="inactive">{v('Inactive Users (~3,450)', 'Người dùng không hoạt động (~3.450)')}</SelectItem>
                    <SelectItem value="custom">{v('Custom Segment', 'Phân khúc tùy chỉnh')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column - Schedule & Preview */}
            <div className="flex flex-col" style={{ gap: '20px' }}>
              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Send Time *', 'Thời gian gửi *')}
                </Label>
                <Select
                  value={formData.scheduleType}
                  onValueChange={(v) => handleChange('scheduleType', v)}
                >
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
                    <SelectItem value="now">{v('Send Now', 'Gửi ngay')}</SelectItem>
                    <SelectItem value="scheduled">{v('Schedule for Later', 'Lên lịch gửi sau')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.scheduleType === 'scheduled' && (
                <>
                  <div>
                    <Label
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      {v('Date *', 'Ngày *')}
                    </Label>
                    <Input
                      required
                      type="date"
                      value={formData.scheduleDate}
                      onChange={(e) => handleChange('scheduleDate', e.target.value)}
                      className="border-[#D1D5DC]"
                      style={{
                        height: '48px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    />
                  </div>

                  <div>
                    <Label
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      {v('Time *', 'Giờ *')}
                    </Label>
                    <Input
                      required
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => handleChange('scheduleTime', e.target.value)}
                      className="border-[#D1D5DC]"
                      style={{
                        height: '48px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    />
                  </div>
                </>
              )}

              {/* Preview */}
              <div className="bg-[#F9FAFB]" style={{ padding: '16px', borderRadius: '10px', marginTop: '16px' }}>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '12px',
                  }}
                >
                  {v('Preview', 'Xem trước')}
                </p>
                <div className="bg-white" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <div className="flex items-start" style={{ gap: '12px' }}>
                    <div
                      className="flex items-center justify-center bg-[#0A0A0A] flex-shrink-0"
                      style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                    >
                      <Bell className="text-white" style={{ width: '20px', height: '20px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          marginBottom: '4px',
                        }}
                      >
                        {formData.title || v('Notification Title', 'Tiêu đề thông báo')}
                      </p>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif', lineHeight: '1.4' }}
                      >
                        {formData.message || v('Your notification message will appear here...', 'Nội dung thông báo của bạn sẽ hiển thị ở đây...')}
                      </p>
                      <p
                        className="text-[#6A7282]"
                        style={{
                          fontSize: '10px',
                          fontFamily: 'Arimo, sans-serif',
                          marginTop: '8px',
                        }}
                      >
                        WearWhere • {v('now', 'bây giờ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSend}
                className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  width: '100%',
                }}
              >
                <Send style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                {formData.scheduleType === 'now' ? v('Send Now', 'Gửi ngay') : v('Schedule', 'Lên lịch')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
            style={{ width: '16px', height: '16px' }}
          />
          <Input
            placeholder={v('Search notifications...', 'Tìm kiếm thông báo...')}
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
      </Card>

      {/* Notifications History */}
      <div className="flex flex-col" style={{ gap: '16px' }}>
        <h3
          className="text-[#0A0A0A]"
          style={{
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'Arimo, sans-serif',
          }}
        >
          {v('Notification History', 'Lịch sử thông báo')}
        </h3>

        {filteredNotifications.map((notif) => (
          <Card
            key={notif.id}
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
                  <h4
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {notif.title}
                  </h4>
                  <Badge
                    className={statusConfig[notif.status as keyof typeof statusConfig].color}
                    style={{
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '6px 12px',
                    }}
                  >
                    {notif.status === 'sent'
                      ? v('Sent', 'Đã gửi')
                      : notif.status === 'scheduled'
                      ? v('Scheduled', 'Đã lên lịch')
                      : v('Draft', 'Bản nháp')}
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
                  {notif.message}
                </p>

                <div className="grid grid-cols-5" style={{ gap: '24px' }}>
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
                      {notif.audience}
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
                      {notif.sent.toLocaleString()}
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
                      className="text-[#10B981]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {notif.opened.toLocaleString()}{' '}
                      <span className="text-[#6A7282]">
                        ({notif.sent > 0 ? ((notif.opened / notif.sent) * 100).toFixed(1) : 0}%)
                      </span>
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
                      {notif.clicked.toLocaleString()}{' '}
                      <span className="text-[#6A7282]">
                        ({notif.sent > 0 ? ((notif.clicked / notif.sent) * 100).toFixed(1) : 0}%)
                      </span>
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
                      {notif.status === 'scheduled' ? v('Scheduled', 'Đã lên lịch') : v('Sent At', 'Thời gian gửi')}
                    </p>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {notif.sentAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
