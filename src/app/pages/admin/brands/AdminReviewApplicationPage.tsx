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
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockApplication = {
  id: 1,
  brandName: 'StyleCo Fashion',
  businessName: 'StyleCo Vietnam Ltd.',
  businessType: 'Company',
  email: 'contact@styleco.vn',
  phone: '+84 901 234 567',
  address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
  taxCode: '0123456789',
  requestedTier: 'business',
  submittedDate: '2024-02-14',
  description:
    'Chúng tôi là thương hiệu thời trang Việt Nam với 5 năm kinh nghiệm trong ngành. Chuyên cung cấp các sản phẩm thời trang hiện đại, chất lượng cao cho giới trẻ. Hiện tại chúng tôi đang có 3 cửa hàng tại TP.HCM và muốn mở rộng kinh doanh online thông qua nền tảng WearWhere.',
  businessPlan:
    'Kế hoạch 6 tháng đầu: Upload 200+ sản phẩm, mục tiêu 50-100 đơn hàng/tháng. Cam kết chất lượng sản phẩm và dịch vụ khách hàng tốt nhất.',
  documents: {
    businessLicense: {
      name: 'Business_License_StyleCo.pdf',
      url: '#',
      uploadDate: '2024-02-14',
      verified: true,
    },
    taxDocument: {
      name: 'Tax_Registration_StyleCo.pdf',
      url: '#',
      uploadDate: '2024-02-14',
      verified: true,
    },
    identityCard: {
      name: 'Owner_ID_Card.pdf',
      url: '#',
      uploadDate: '2024-02-14',
      verified: true,
    },
    bankStatement: {
      name: 'Bank_Statement_3months.pdf',
      url: '#',
      uploadDate: '2024-02-14',
      verified: false,
    },
  },
  representative: {
    name: 'Nguyen Van A',
    position: 'CEO',
    phone: '+84 901 234 567',
    email: 'nguyenvana@styleco.vn',
  },
};

export default function AdminReviewApplicationPage() {
  const { v } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [reviewNote, setReviewNote] = useState('');
  const [approvedTier, setApprovedTier] = useState('business');
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    if (!reviewNote.trim()) {
      toast.error(v('Please add review notes', 'Vui lòng thêm ghi chú xét duyệt'));
      return;
    }
    toast.success(v('Application approved successfully', 'Đã duyệt đơn đăng ký thành công'));
    navigate('/admin/brands/applications');
  };

  const handleReject = () => {
    if (!reviewNote.trim() || !rejectReason) {
      toast.error(v('Please provide rejection reason and notes', 'Vui lòng cung cấp lý do và ghi chú từ chối'));
      return;
    }
    toast.success(v('Application rejected', 'Đã từ chối đơn đăng ký'));
    navigate('/admin/brands/applications');
  };

  const documentsComplete = Object.values(mockApplication.documents).every((doc) => doc.verified);

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: '16px' }}>
          <Link to="/admin/brands/applications">
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
              {v('Review Brand Application', 'Xét duyệt đơn đăng ký thương hiệu')}
            </h1>
            <p
              className="text-[#4A5565]"
              style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('Application details of', 'Chi tiết đơn đăng ký của')} {mockApplication.brandName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {/* Left Column - Application Details */}
        <div className="col-span-2 flex flex-col" style={{ gap: '24px' }}>
          {/* Business Information */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h2
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '24px',
              }}
            >
              {v('Business Information', 'Thông tin doanh nghiệp')}
            </h2>
            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              <div>
                <Label
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Brand Name', 'Tên thương hiệu')}
                </Label>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockApplication.brandName}
                </p>
              </div>
              <div>
                <Label
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Business Name', 'Tên doanh nghiệp')}
                </Label>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockApplication.businessName}
                </p>
              </div>
              <div>
                <Label
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Business Type', 'Loại hình kinh doanh')}
                </Label>
                <Badge
                  className="bg-[#F3F4F6] text-[#0A0A0A]"
                  style={{
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '4px 12px',
                  }}
                >
                  {mockApplication.businessType}
                </Badge>
              </div>
              <div>
                <Label
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Tax Code', 'Mã số thuế')}
                </Label>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockApplication.taxCode}
                </p>
              </div>
              <div className="col-span-2">
                <Label
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Business Address', 'Địa chỉ kinh doanh')}
                </Label>
                <div className="flex items-start" style={{ gap: '8px' }}>
                  <MapPin
                    className="text-[#6A7282]"
                    style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }}
                  />
                  <p
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {mockApplication.address}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h2
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '24px',
              }}
            >
              {v('Contact Information', 'Thông tin liên hệ')}
            </h2>
            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              <div>
                <Label
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Email', 'Email')}
                </Label>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Mail className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                  <p
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {mockApplication.email}
                  </p>
                </div>
              </div>
              <div>
                <Label
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Phone', 'Số điện thoại')}
                </Label>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Phone className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
                  <p
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {mockApplication.phone}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <Label
                className="text-[#6A7282]"
                style={{
                  fontSize: '12px',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '12px',
                  display: 'block',
                }}
              >
                {v('Representative', 'Người đại diện')}
              </Label>
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <div>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Name', 'Họ tên')}
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {mockApplication.representative.name}
                  </p>
                </div>
                <div>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Position', 'Chức vụ')}
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {mockApplication.representative.position}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Description & Business Plan */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h2
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '16px',
              }}
            >
              {v('Description', 'Mô tả')}
            </h2>
            <p
              className="text-[#0A0A0A]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              {mockApplication.description}
            </p>
            <h2
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '16px',
              }}
            >
              {v('Business Plan', 'Kế hoạch kinh doanh')}
            </h2>
            <p
              className="text-[#0A0A0A]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                lineHeight: '1.6',
              }}
            >
              {mockApplication.businessPlan}
            </p>
          </Card>

          {/* Documents */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
              <h2
                className="text-[#0A0A0A]"
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {v('Uploaded Documents', 'Hồ sơ đã tải lên')}
              </h2>
              <Badge
                className={
                  documentsComplete
                    ? 'bg-[#10B981]/10 text-[#10B981]'
                    : 'bg-[#F54900]/10 text-[#F54900]'
                }
                style={{
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '6px 12px',
                }}
              >
                {documentsComplete ? v('All Verified', 'Đã xác minh đủ') : v('Incomplete', 'Chưa đầy đủ')}
              </Badge>
            </div>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {Object.entries(mockApplication.documents).map(([key, doc]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-[#F9FAFB]"
                  style={{ padding: '16px', borderRadius: '10px' }}
                >
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <div
                      className="flex items-center justify-center bg-white"
                      style={{ width: '40px', height: '40px', borderRadius: '8px' }}
                    >
                      <FileText
                        className="text-[#0A0A0A]"
                        style={{ width: '20px', height: '20px' }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        {doc.name}
                      </p>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('Uploaded', 'Đã tải lên')}: {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <Badge
                      className={
                        doc.verified
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : 'bg-[#6A7282]/10 text-[#6A7282]'
                      }
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '4px 12px',
                      }}
                    >
                      {doc.verified ? v('Verified', 'Đã xác minh') : v('Pending', 'Đang chờ')}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                      }}
                    >
                      <Download style={{ width: '16px', height: '16px' }} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Review Actions */}
        <div className="col-span-1 flex flex-col" style={{ gap: '24px' }}>
          {/* Application Status */}
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
              {v('Application Status', 'Trạng thái đơn')}
            </h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div className="flex justify-between">
                <span
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {v('Submitted', 'Ngày nộp')}:
                </span>
                <span
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {new Date(mockApplication.submittedDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {v('Requested Tier', 'Gói đăng ký')}:
                </span>
                <Badge
                  className="bg-[#10B981]/10 text-[#10B981]"
                  style={{
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '4px 12px',
                  }}
                >
                  {mockApplication.requestedTier}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Approve Section */}
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
              {v('Approve Application', 'Duyệt đơn')}
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
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
                  {v('Approved Tier', 'Gói được duyệt')}
                </Label>
                <Select value={approvedTier} onValueChange={setApprovedTier}>
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
                    <SelectItem value="starter">{v('Starter', 'Khởi đầu')}</SelectItem>
                    <SelectItem value="business">{v('Business', 'Doanh nghiệp')}</SelectItem>
                    <SelectItem value="premium">{v('Premium', 'Cao cấp')}</SelectItem>
                  </SelectContent>
                </Select>
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
                  {v('Review Notes', 'Ghi chú xét duyệt')}
                </Label>
                <Textarea
                  placeholder={v('Add notes about approval decision...', 'Thêm ghi chú về quyết định duyệt...')}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="border-[#D1D5DC]"
                  style={{
                    minHeight: '120px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
              </div>
              <Button
                onClick={handleApprove}
                className="bg-[#10B981] text-white hover:bg-[#10B981]/90"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <CheckCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                {v('Approve Application', 'Duyệt đơn')}
              </Button>
            </div>
          </Card>

          {/* Reject Section */}
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
              {v('Reject Application', 'Từ chối đơn')}
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
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
                  {v('Rejection Reason', 'Lý do từ chối')}
                </Label>
                <Select value={rejectReason} onValueChange={setRejectReason}>
                  <SelectTrigger
                    className="border-[#D1D5DC]"
                    style={{
                      height: '48px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    <SelectValue placeholder={v('Select reason...', 'Chọn lý do...')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incomplete_docs">{v('Incomplete Documents', 'Hồ sơ không đầy đủ')}</SelectItem>
                    <SelectItem value="invalid_license">{v('Invalid Business License', 'Giấy phép kinh doanh không hợp lệ')}</SelectItem>
                    <SelectItem value="suspicious">{v('Suspicious Activity', 'Hoạt động đáng ngờ')}</SelectItem>
                    <SelectItem value="policy_violation">{v('Policy Violation', 'Vi phạm chính sách')}</SelectItem>
                    <SelectItem value="other">{v('Other', 'Khác')}</SelectItem>
                  </SelectContent>
                </Select>
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
                  {v('Rejection Notes', 'Ghi chú từ chối')}
                </Label>
                <Textarea
                  placeholder={v('Explain rejection reason...', 'Giải thích lý do từ chối...')}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="border-[#D1D5DC]"
                  style={{
                    minHeight: '120px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
              </div>
              <Button
                onClick={handleReject}
                variant="outline"
                className="border-[#E7000B] text-[#E7000B] hover:bg-[#E7000B]/10"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                {v('Reject Application', 'Từ chối đơn')}
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
                {v('Review all documents carefully before making a decision. The brand will be notified immediately.', 'Hãy xem xét kỹ tất cả hồ sơ trước khi đưa ra quyết định. Thương hiệu sẽ được thông báo ngay lập tức.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
