import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
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
  const navigate = useNavigate();
  const { id } = useParams();
  const [reviewNote, setReviewNote] = useState('');
  const [approvedTier, setApprovedTier] = useState('business');
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    if (!reviewNote.trim()) {
      toast.error('Please add review notes');
      return;
    }
    toast.success('Application approved successfully');
    navigate('/admin/brands/applications');
  };

  const handleReject = () => {
    if (!reviewNote.trim() || !rejectReason) {
      toast.error('Please provide rejection reason and notes');
      return;
    }
    toast.success('Application rejected');
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
              Review Brand Application
            </h1>
            <p
              className="text-[#4A5565]"
              style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
            >
              Chi tiết đơn đăng ký của {mockApplication.brandName}
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
              Business Information
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
                  Brand Name
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
                  Business Name
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
                  Business Type
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
                  Tax Code
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
                  Business Address
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
              Contact Information
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
                  Email
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
                  Phone
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
                Representative
              </Label>
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <div>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Name
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
                    Position
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
              Description
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
              Business Plan
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
                Uploaded Documents
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
                {documentsComplete ? 'All Verified' : 'Incomplete'}
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
                        Uploaded: {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}
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
                      {doc.verified ? 'Verified' : 'Pending'}
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
              Application Status
            </h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div className="flex justify-between">
                <span
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  Submitted:
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
                  Requested Tier:
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
              Approve Application
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
                  Approved Tier
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
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
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
                  Review Notes
                </Label>
                <Textarea
                  placeholder="Add notes about approval decision..."
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
                Approve Application
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
              Reject Application
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
                  Rejection Reason
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
                    <SelectValue placeholder="Select reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incomplete_docs">Incomplete Documents</SelectItem>
                    <SelectItem value="invalid_license">Invalid Business License</SelectItem>
                    <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                    <SelectItem value="policy_violation">Policy Violation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                  Rejection Notes
                </Label>
                <Textarea
                  placeholder="Explain rejection reason..."
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
                Reject Application
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
                Important
              </p>
              <p
                className="text-[#0A0A0A]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                Review all documents carefully before making a decision. The brand will be notified
                immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
