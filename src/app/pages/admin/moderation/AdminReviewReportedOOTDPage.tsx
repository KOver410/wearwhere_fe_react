import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  MessageSquare,
  Share2,
  Flag,
  User,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockReport = {
  id: 1,
  content: {
    id: 1,
    text: 'Summer vibes! Love this new dress from Zara ☀️👗 #OOTD #fashion #summerstyle',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
    ],
    author: {
      id: 1,
      name: 'Nguyễn Lan Anh',
      username: '@lananh_fashion',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      joinDate: '2023-06-15',
      totalPosts: 145,
      followers: 2340,
    },
    postedAt: '2024-02-15T10:30:00',
    likes: 156,
    comments: 23,
    shares: 12,
  },
  reports: [
    {
      id: 1,
      reporter: {
        id: 2,
        name: 'Trần Minh Châu',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
      reason: 'Spam',
      details: 'This post is clearly spam advertising. User posts the same content multiple times.',
      reportedAt: '2024-02-15T11:00:00',
    },
    {
      id: 2,
      reporter: {
        id: 3,
        name: 'Lê Thu Hà',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      },
      reason: 'Inappropriate Content',
      details: 'Contains inappropriate content that violates community guidelines.',
      reportedAt: '2024-02-15T11:15:00',
    },
    {
      id: 3,
      reporter: {
        id: 4,
        name: 'Phạm Văn Nam',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      reason: 'Spam',
      details: 'Excessive tagging and promotional content.',
      reportedAt: '2024-02-15T11:30:00',
    },
  ],
  priority: 'high',
  status: 'claimed',
  claimedBy: 'Admin John',
  claimedAt: '2024-02-15T12:00:00',
};

const actionOptions = [
  { value: 'keep', label: 'Keep Content', color: 'bg-[#10B981]' },
  { value: 'remove', label: 'Remove Content', color: 'bg-[#E7000B]' },
  { value: 'warn', label: 'Warn User', color: 'bg-[#F54900]' },
  { value: 'ban_user', label: 'Ban User', color: 'bg-[#E7000B]' },
];

const actionLabelVi: Record<string, string> = {
  keep: 'Giữ nội dung',
  remove: 'Gỡ nội dung',
  warn: 'Cảnh báo người dùng',
  ban_user: 'Cấm người dùng',
};

const reasonLabelVi: Record<string, string> = {
  Spam: 'Spam',
  'Inappropriate Content': 'Nội dung không phù hợp',
};

export default function AdminReviewReportedOOTDPage() {
  const { v } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedAction, setSelectedAction] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [banDuration, setBanDuration] = useState('7');
  const [selectedImage, setSelectedImage] = useState(0);

  const handleSubmitAction = () => {
    if (!selectedAction) {
      toast.error(v('Please select an action', 'Vui lòng chọn một hành động'));
      return;
    }
    if (!actionNote.trim()) {
      toast.error(v('Please add action notes', 'Vui lòng thêm ghi chú hành động'));
      return;
    }
    toast.success(v('Action submitted successfully', 'Đã gửi hành động thành công'));
    navigate('/admin/moderation');
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: '16px' }}>
          <Link to="/admin/moderation">
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
              {v('Review Reported OOTD Post', 'Xem xét bài đăng OOTD bị báo cáo')}
            </h1>
            <p
              className="text-[#4A5565]"
              style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('Review và take action on reported content', 'Xem xét và xử lý nội dung bị báo cáo')}
            </p>
          </div>
        </div>
        <Badge
          className="bg-[#E7000B]/10 text-[#E7000B]"
          style={{
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '700',
            fontFamily: 'Arimo, sans-serif',
            padding: '8px 16px',
          }}
        >
          <AlertTriangle style={{ width: '16px', height: '16px', marginRight: '6px' }} />
          {mockReport.reports.length} {v('Reports', 'Báo cáo')}
        </Badge>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {/* Left Column - Content & Reports */}
        <div className="col-span-2 flex flex-col" style={{ gap: '24px' }}>
          {/* Original Content */}
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
              {v('Original OOTD Post', 'Bài đăng OOTD gốc')}
            </h3>

            {/* Author Info */}
            <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px' }}>
              <img
                src={mockReport.content.author.avatar}
                alt={mockReport.content.author.name}
                className="bg-[#F3F4F6]"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '9999px',
                  objectFit: 'cover',
                }}
              />
              <div>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {mockReport.content.author.name}
                  </p>
                  <Link to={`/admin/users/${mockReport.content.author.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      <User style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                      {v('View Profile', 'Xem hồ sơ')}
                    </Button>
                  </Link>
                </div>
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {mockReport.content.author.username} • {mockReport.content.author.followers.toLocaleString('vi-VN')} {v('followers', 'người theo dõi')}
                </p>
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {v('Posted', 'Đã đăng')} {new Date(mockReport.content.postedAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Content Text */}
            <p
              className="text-[#0A0A0A]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              {mockReport.content.text}
            </p>

            {/* Images */}
            <div style={{ marginBottom: '20px' }}>
              <img
                src={mockReport.content.images[selectedImage]}
                alt="OOTD"
                className="bg-[#F3F4F6] w-full"
                style={{
                  borderRadius: '14px',
                  objectFit: 'cover',
                  maxHeight: '500px',
                  marginBottom: '12px',
                }}
              />
              {mockReport.content.images.length > 1 && (
                <div className="flex" style={{ gap: '8px' }}>
                  {mockReport.content.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`OOTD ${idx + 1}`}
                      className={`bg-[#F3F4F6] cursor-pointer ${selectedImage === idx ? 'ring-2 ring-[#0A0A0A]' : ''}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                      onClick={() => setSelectedImage(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Engagement Stats */}
            <div
              className="flex items-center bg-[#F9FAFB]"
              style={{ padding: '16px', borderRadius: '10px', gap: '24px' }}
            >
              <div className="flex items-center" style={{ gap: '6px' }}>
                <Heart className="text-[#E7000B]" style={{ width: '18px', height: '18px' }} />
                <span
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockReport.content.likes}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: '6px' }}>
                <MessageSquare
                  className="text-[#0A0A0A]"
                  style={{ width: '18px', height: '18px' }}
                />
                <span
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockReport.content.comments}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: '6px' }}>
                <Share2 className="text-[#0A0A0A]" style={{ width: '18px', height: '18px' }} />
                <span
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockReport.content.shares}
                </span>
              </div>
            </div>
          </Card>

          {/* Reports */}
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
              {v('Reports', 'Báo cáo')} ({mockReport.reports.length})
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {mockReport.reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-[#F9FAFB]"
                  style={{ padding: '16px', borderRadius: '10px' }}
                >
                  <div className="flex items-start" style={{ gap: '12px', marginBottom: '12px' }}>
                    <img
                      src={report.reporter.avatar}
                      alt={report.reporter.name}
                      className="bg-[#F3F4F6]"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '9999px',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                        <p
                          className="text-[#0A0A0A]"
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          {report.reporter.name}
                        </p>
                        <Badge
                          className="bg-[#E7000B]/10 text-[#E7000B]"
                          style={{
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                            padding: '4px 10px',
                          }}
                        >
                          <Flag style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                          {v(report.reason, reasonLabelVi[report.reason] ?? report.reason)}
                        </Badge>
                      </div>
                      <p
                        className="text-[#6A7282]"
                        style={{
                          fontSize: '12px',
                          fontFamily: 'Arimo, sans-serif',
                          marginBottom: '8px',
                        }}
                      >
                        {new Date(report.reportedAt).toLocaleString('vi-VN')}
                      </p>
                      <p
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Arimo, sans-serif',
                          lineHeight: '1.5',
                        }}
                      >
                        {report.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="col-span-1 flex flex-col" style={{ gap: '24px' }}>
          {/* Claim Info */}
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
                marginBottom: '16px',
              }}
            >
              {v('Review Status', 'Trạng thái xem xét')}
            </h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <Clock className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {v('Claimed by', 'Nhận bởi')} {mockReport.claimedBy}
                </p>
              </div>
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                {new Date(mockReport.claimedAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </Card>

          {/* Take Action */}
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
              {v('Take Action', 'Xử lý')}
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {/* Action Selection */}
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
                  {v('Select Action', 'Chọn hành động')} *
                </Label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger
                    className="border-[#D1D5DC]"
                    style={{
                      height: '48px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    <SelectValue placeholder={v('Select action...', 'Chọn hành động...')} />
                  </SelectTrigger>
                  <SelectContent>
                    {actionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {v(option.label, actionLabelVi[option.value] ?? option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ban Duration (if ban selected) */}
              {selectedAction === 'ban_user' && (
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
                    {v('Ban Duration', 'Thời hạn cấm')}
                  </Label>
                  <Select value={banDuration} onValueChange={setBanDuration}>
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
                      <SelectItem value="7">{v('7 days', '7 ngày')}</SelectItem>
                      <SelectItem value="14">{v('14 days', '14 ngày')}</SelectItem>
                      <SelectItem value="30">{v('30 days', '30 ngày')}</SelectItem>
                      <SelectItem value="permanent">{v('Permanent', 'Vĩnh viễn')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Notes */}
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
                  {v('Action Notes', 'Ghi chú hành động')} *
                </Label>
                <Textarea
                  placeholder={v('Explain your decision and reasoning...', 'Giải thích quyết định và lý do của bạn...')}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="border-[#D1D5DC]"
                  style={{
                    minHeight: '120px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
              </div>

              {/* Submit Action */}
              <Button
                onClick={handleSubmitAction}
                className="w-full bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {selectedAction === 'keep' && <CheckCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />}
                {selectedAction === 'remove' && <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />}
                {selectedAction === 'warn' && <AlertCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />}
                {selectedAction === 'ban_user' && <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />}
                {v('Submit Action', 'Gửi hành động')}
              </Button>
            </div>
          </Card>

          {/* Warning */}
          <div
            className="flex items-start bg-[#F54900]/10 border border-[#F54900]/20"
            style={{ padding: '16px', borderRadius: '10px', gap: '12px' }}
          >
            <AlertTriangle
              className="text-[#F54900]"
              style={{ width: '20px', height: '20px', flexShrink: 0 }}
            />
            <div>
              <p
                className="text-[#F54900]"
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '4px',
                }}
              >
                {v('Important', 'Quan trọng')}
              </p>
              <p
                className="text-[#0A0A0A]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                {v('Your decision will be recorded in the moderation history. Make sure to review all evidence carefully.', 'Quyết định của bạn sẽ được ghi lại trong lịch sử kiểm duyệt. Hãy đảm bảo xem xét kỹ tất cả bằng chứng.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
