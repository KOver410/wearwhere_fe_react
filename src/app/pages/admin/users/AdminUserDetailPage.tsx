import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Image as ImageIcon,
  Star,
  AlertTriangle,
  Ban,
  Shield,
  Activity,
  Clock,
  Monitor,
} from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Checkbox } from '@/app/components/ui/checkbox';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockUser = {
  id: 1,
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@gmail.com',
  phone: '+84 912 345 678',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  status: 'active',
  registrationDate: '2024-01-15',
  lastActive: '2 giờ trước',
  location: 'Hà Nội, Việt Nam',
  bio: 'Fashion enthusiast | Minimalist style lover',
  stats: {
    totalOrders: 15,
    totalSpent: 25450000,
    reviews: 8,
    ootdPosts: 12,
    followers: 234,
    following: 156,
  },
};

const mockOrders = [
  {
    id: '#15234',
    date: '2024-02-10',
    total: 1250000,
    status: 'delivered',
    items: 3,
  },
  {
    id: '#15180',
    date: '2024-02-05',
    total: 2100000,
    status: 'delivered',
    items: 2,
  },
  {
    id: '#14892',
    date: '2024-01-28',
    total: 850000,
    status: 'cancelled',
    items: 1,
  },
];

const mockOOTDPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    likes: 145,
    comments: 23,
    date: '2024-02-12',
    caption: 'Casual weekend vibes ✨',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
    likes: 203,
    comments: 31,
    date: '2024-02-08',
    caption: 'Office look of the day 💼',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
    likes: 178,
    comments: 19,
    date: '2024-02-03',
    caption: 'Street style inspiration 🌟',
  },
];

const mockReviews = [
  {
    id: 1,
    productName: 'Áo Sơ Mi Trắng Cổ Điển',
    rating: 5,
    comment: 'Chất vải rất đẹp, form dáng chuẩn!',
    date: '2024-02-10',
    helpful: 15,
  },
  {
    id: 2,
    productName: 'Quần Jeans Skinny',
    rating: 4,
    comment: 'Đẹp nhưng hơi chật một chút.',
    date: '2024-02-05',
    helpful: 8,
  },
];

const mockActivityLog = [
  {
    id: 1,
    action: 'Đăng nhập',
    ip: '192.168.1.100',
    device: 'Chrome on Windows',
    location: 'Hà Nội, Việt Nam',
    time: '2024-02-15 14:30:25',
  },
  {
    id: 2,
    action: 'Đặt đơn hàng #15234',
    ip: '192.168.1.100',
    device: 'Chrome on Windows',
    location: 'Hà Nội, Việt Nam',
    time: '2024-02-15 14:25:10',
  },
  {
    id: 3,
    action: 'Thêm sản phẩm vào giỏ hàng',
    ip: '192.168.1.100',
    device: 'Safari on iPhone',
    location: 'Hà Nội, Việt Nam',
    time: '2024-02-15 10:15:30',
  },
  {
    id: 4,
    action: 'Đăng nhập',
    ip: '192.168.1.100',
    device: 'Safari on iPhone',
    location: 'Hà Nội, Việt Nam',
    time: '2024-02-15 10:12:05',
  },
];

const mockReportedContent = [
  {
    id: 1,
    type: 'OOTD Post',
    reason: 'Inappropriate content',
    reportedBy: 3,
    date: '2024-02-10',
    status: 'pending',
  },
  {
    id: 2,
    type: 'Review',
    reason: 'Spam',
    reportedBy: 1,
    date: '2024-02-08',
    status: 'resolved',
  },
];

export default function AdminUserDetailPage() {
  const { v } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('permanent');
  const [notifyUser, setNotifyUser] = useState(true);

  const handleBanUser = () => {
    toast.success(v('User has been banned successfully', 'Đã cấm người dùng thành công'));
    setBanModalOpen(false);
    navigate('/admin/users');
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link to="/admin/users">
        <Button
          variant="ghost"
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Arimo, sans-serif',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          {v('Back to Users', 'Quay lại Người dùng')}
        </Button>
      </Link>

      {/* User Header */}
      <Card
        className="bg-white"
        style={{ padding: '32px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start" style={{ gap: '24px' }}>
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="bg-[#F3F4F6]"
              style={{ width: '100px', height: '100px', borderRadius: '14px' }}
            />
            <div>
              <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
                <h1
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '30px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockUser.name}
                </h1>
                <Badge
                  className="bg-[#10B981]/10 text-[#10B981]"
                  style={{
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '4px 12px',
                  }}
                >
                  {v('Active', 'Hoạt động')}
                </Badge>
              </div>
              <p
                className="text-[#6A7282]"
                style={{
                  fontSize: '16px',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '16px',
                }}
              >
                {mockUser.bio}
              </p>
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Mail className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                  <span
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {mockUser.email}
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Phone className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                  <span
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {mockUser.phone}
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <MapPin className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                  <span
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {mockUser.location}
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Calendar className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                  <span
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Joined', 'Tham gia')} {new Date(mockUser.registrationDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center" style={{ gap: '12px' }}>
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
              <Mail style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Send Email', 'Gửi email')}
            </Button>
            <Dialog open={banModalOpen} onOpenChange={setBanModalOpen}>
              <DialogTrigger asChild>
                <Button
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
                  <Ban style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  {v('Ban User', 'Cấm người dùng')}
                </Button>
              </DialogTrigger>
              <DialogContent
                style={{ maxWidth: '500px', borderRadius: '14px', padding: '32px' }}
              >
                <DialogHeader>
                  <DialogTitle
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '8px',
                    }}
                  >
                    {v('Ban User', 'Cấm người dùng')}
                  </DialogTitle>
                  <DialogDescription
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v(
                      "This action will restrict the user's access to the platform.",
                      'Hành động này sẽ hạn chế quyền truy cập của người dùng vào nền tảng.'
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col" style={{ gap: '24px', marginTop: '24px' }}>
                  {/* Reason */}
                  <div className="flex flex-col" style={{ gap: '8px' }}>
                    <Label
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {v('Reason for Ban', 'Lý do cấm')}
                    </Label>
                    <Textarea
                      placeholder={v('Enter the reason for banning this user...', 'Nhập lý do cấm người dùng này...')}
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="border-[#D1D5DC]"
                      style={{
                        minHeight: '100px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    />
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col" style={{ gap: '8px' }}>
                    <Label
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {v('Ban Duration', 'Thời hạn cấm')}
                    </Label>
                    <RadioGroup value={banDuration} onValueChange={setBanDuration}>
                      <div className="flex items-center" style={{ gap: '8px', padding: '8px 0' }}>
                        <RadioGroupItem value="7days" id="7days" />
                        <Label
                          htmlFor="7days"
                          style={{
                            fontSize: '14px',
                            fontFamily: 'Arimo, sans-serif',
                            cursor: 'pointer',
                          }}
                        >
                          {v('7 days', '7 ngày')}
                        </Label>
                      </div>
                      <div className="flex items-center" style={{ gap: '8px', padding: '8px 0' }}>
                        <RadioGroupItem value="30days" id="30days" />
                        <Label
                          htmlFor="30days"
                          style={{
                            fontSize: '14px',
                            fontFamily: 'Arimo, sans-serif',
                            cursor: 'pointer',
                          }}
                        >
                          {v('30 days', '30 ngày')}
                        </Label>
                      </div>
                      <div className="flex items-center" style={{ gap: '8px', padding: '8px 0' }}>
                        <RadioGroupItem value="90days" id="90days" />
                        <Label
                          htmlFor="90days"
                          style={{
                            fontSize: '14px',
                            fontFamily: 'Arimo, sans-serif',
                            cursor: 'pointer',
                          }}
                        >
                          {v('90 days', '90 ngày')}
                        </Label>
                      </div>
                      <div className="flex items-center" style={{ gap: '8px', padding: '8px 0' }}>
                        <RadioGroupItem value="permanent" id="permanent" />
                        <Label
                          htmlFor="permanent"
                          style={{
                            fontSize: '14px',
                            fontFamily: 'Arimo, sans-serif',
                            cursor: 'pointer',
                          }}
                        >
                          {v('Permanent', 'Vĩnh viễn')}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Notify User */}
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <Checkbox
                      id="notify"
                      checked={notifyUser}
                      onCheckedChange={(checked) => setNotifyUser(checked as boolean)}
                    />
                    <Label
                      htmlFor="notify"
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Arimo, sans-serif',
                        cursor: 'pointer',
                      }}
                    >
                      {v('Send email notification to user', 'Gửi thông báo qua email cho người dùng')}
                    </Label>
                  </div>
                </div>
                <DialogFooter style={{ marginTop: '24px' }}>
                  <Button
                    variant="outline"
                    onClick={() => setBanModalOpen(false)}
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
                    onClick={handleBanUser}
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
                    {v('Confirm Ban', 'Xác nhận cấm')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-6 border-t border-[#E5E7EB]"
          style={{ gap: '24px', marginTop: '32px', paddingTop: '24px' }}
        >
          <div className="text-center">
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {mockUser.stats.totalOrders}
            </h3>
            <p
              className="text-[#6A7282]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('Orders', 'Đơn hàng')}
            </p>
          </div>
          <div className="text-center">
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(mockUser.stats.totalSpent / 1000000).toFixed(1)}M
            </h3>
            <p
              className="text-[#6A7282]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('Total Spent', 'Tổng chi tiêu')}
            </p>
          </div>
          <div className="text-center">
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {mockUser.stats.reviews}
            </h3>
            <p
              className="text-[#6A7282]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('Reviews', 'Đánh giá')}
            </p>
          </div>
          <div className="text-center">
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {mockUser.stats.ootdPosts}
            </h3>
            <p
              className="text-[#6A7282]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('OOTD Posts', 'Bài đăng OOTD')}
            </p>
          </div>
          <div className="text-center">
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {mockUser.stats.followers}
            </h3>
            <p
              className="text-[#6A7282]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('Followers', 'Người theo dõi')}
            </p>
          </div>
          <div className="text-center">
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {mockUser.stats.following}
            </h3>
            <p
              className="text-[#6A7282]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('Following', 'Đang theo dõi')}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList
          className="bg-white border-b border-[#E5E7EB]"
          style={{ padding: '0', height: 'auto', borderRadius: '0' }}
        >
          <TabsTrigger
            value="orders"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
            }}
          >
            <ShoppingBag style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Orders History', 'Lịch sử đơn hàng')}
          </TabsTrigger>
          <TabsTrigger
            value="ootd"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
            }}
          >
            <ImageIcon style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('OOTD Posts', 'Bài đăng OOTD')}
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
            }}
          >
            <Star style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Reviews', 'Đánh giá')}
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
            }}
          >
            <Activity style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Activity Log', 'Nhật ký hoạt động')}
          </TabsTrigger>
          <TabsTrigger
            value="reported"
            style={{
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '16px 24px',
            }}
          >
            <AlertTriangle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Reported Content', 'Nội dung bị báo cáo')}
          </TabsTrigger>
        </TabsList>

        {/* Orders History */}
        <TabsContent value="orders">
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
                      {v('Order ID', 'Mã đơn hàng')}
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
                      {v('Date', 'Ngày')}
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
                      {v('Items', 'Số lượng')}
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
                      {v('Total', 'Tổng tiền')}
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
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#E5E7EB]">
                      <td style={{ padding: '16px 24px' }}>
                        <p
                          className="text-[#0A0A0A]"
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          {order.id}
                        </p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {new Date(order.date).toLocaleDateString('vi-VN')}
                        </p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p
                          className="text-[#0A0A0A]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {order.items} {v('items', 'sản phẩm')}
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
                          {order.total.toLocaleString('vi-VN')}đ
                        </p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <Badge
                          className={
                            order.status === 'delivered'
                              ? 'bg-[#10B981]/10 text-[#10B981]'
                              : 'bg-[#E7000B]/10 text-[#E7000B]'
                          }
                          style={{
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                            padding: '4px 12px',
                          }}
                        >
                          {order.status === 'delivered'
                            ? v('delivered', 'đã giao')
                            : v('cancelled', 'đã hủy')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* OOTD Posts */}
        <TabsContent value="ootd">
          <div className="grid grid-cols-3" style={{ gap: '24px' }}>
            {mockOOTDPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-white overflow-hidden"
                style={{ borderRadius: '14px', border: '1px solid #E5E7EB', padding: '0' }}
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full bg-[#F3F4F6]"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px' }}>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '12px',
                    }}
                  >
                    {post.caption}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: '16px' }}>
                      <span
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        ❤️ {post.likes}
                      </span>
                      <span
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        💬 {post.comments}
                      </span>
                    </div>
                    <span
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {new Date(post.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews">
          <div className="flex flex-col" style={{ gap: '16px' }}>
            {mockReviews.map((review) => (
              <Card
                key={review.id}
                className="bg-white"
                style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
              >
                <div className="flex items-start justify-between" style={{ marginBottom: '12px' }}>
                  <div>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {review.productName}
                    </p>
                    <div className="flex items-center" style={{ gap: '4px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={i < review.rating ? 'text-[#F54900]' : 'text-[#E5E7EB]'}
                          style={{ width: '16px', height: '16px' }}
                          fill={i < review.rating ? '#F54900' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <span
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {new Date(review.date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '12px',
                  }}
                >
                  {review.comment}
                </p>
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {review.helpful} người thấy hữu ích
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Log */}
        <TabsContent value="activity">
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
                      {v('Action', 'Hành động')}
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
                      {v('Device', 'Thiết bị')}
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
                      {v('IP Address', 'Địa chỉ IP')}
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
                      {v('Location', 'Vị trí')}
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
                      {v('Time', 'Thời gian')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockActivityLog.map((activity) => (
                    <tr key={activity.id} className="border-b border-[#E5E7EB]">
                      <td style={{ padding: '16px 24px' }}>
                        <p
                          className="text-[#0A0A0A]"
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          {activity.action}
                        </p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                          <Monitor
                            className="text-[#6A7282]"
                            style={{ width: '14px', height: '14px' }}
                          />
                          <p
                            className="text-[#6A7282]"
                            style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                          >
                            {activity.device}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {activity.ip}
                        </p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {activity.location}
                        </p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                          <Clock
                            className="text-[#6A7282]"
                            style={{ width: '14px', height: '14px' }}
                          />
                          <p
                            className="text-[#6A7282]"
                            style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                          >
                            {activity.time}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Reported Content */}
        <TabsContent value="reported">
          <div className="flex flex-col" style={{ gap: '16px' }}>
            {mockReportedContent.map((report) => (
              <Card
                key={report.id}
                className="bg-white"
                style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
                      <AlertTriangle
                        className="text-[#F54900]"
                        style={{ width: '20px', height: '20px' }}
                      />
                      <h3
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        {report.type}
                      </h3>
                      <Badge
                        className={
                          report.status === 'pending'
                            ? 'bg-[#F54900]/10 text-[#F54900]'
                            : 'bg-[#10B981]/10 text-[#10B981]'
                        }
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 12px',
                        }}
                      >
                        {report.status === 'pending'
                          ? v('pending', 'đang chờ')
                          : v('resolved', 'đã xử lý')}
                      </Badge>
                    </div>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '8px',
                      }}
                    >
                      {v('Reason:', 'Lý do:')} {report.reason}
                    </p>
                    <div className="flex items-center" style={{ gap: '16px' }}>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('Reported by', 'Bị báo cáo bởi')} {report.reportedBy} {v('users', 'người dùng')}
                      </p>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {new Date(report.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  {report.status === 'pending' && (
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#D1D5DC]"
                        style={{
                          height: '36px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        {v('Review', 'Xem xét')}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#E7000B] text-white hover:bg-[#E7000B]/90"
                        style={{
                          height: '36px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        {v('Remove Content', 'Gỡ nội dung')}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
