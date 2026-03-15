import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import {
  ArrowLeft,
  XCircle,
  AlertTriangle,
  Calendar,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const mockBrand = {
  id: 1,
  name: 'Zara Vietnam',
  logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  email: 'contact@zara.vn',
  status: 'active',
  subscriptionTier: 'premium',
  stats: {
    stores: 12,
    products: 1234,
    rating: 4.8,
  },
};

const suspensionReasons = [
  { value: 'policy_violation', label: 'Policy Violation' },
  { value: 'fake_products', label: 'Selling Fake Products' },
  { value: 'poor_service', label: 'Poor Customer Service' },
  { value: 'fraud', label: 'Fraudulent Activity' },
  { value: 'multiple_complaints', label: 'Multiple Customer Complaints' },
  { value: 'payment_issues', label: 'Payment Issues' },
  { value: 'other', label: 'Other' },
];

const suspensionDurations = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: '60', label: '60 days' },
  { value: '90', label: '90 days' },
  { value: 'permanent', label: 'Permanent' },
];

export default function AdminSuspendBrandPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionDuration, setSuspensionDuration] = useState('30');
  const [detailedReason, setDetailedReason] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState('');
  const [notifyBrand, setNotifyBrand] = useState(true);

  const handleSuspend = () => {
    if (!suspensionReason) {
      toast.error('Please select a suspension reason');
      return;
    }
    if (!detailedReason.trim()) {
      toast.error('Please provide detailed explanation');
      return;
    }
    toast.success('Brand suspended successfully');
    navigate(`/admin/brands/${id}`);
  };

  const calculateSuspensionEndDate = () => {
    if (suspensionDuration === 'permanent') {
      return 'Permanent suspension';
    }
    const days = parseInt(suspensionDuration);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    return endDate.toLocaleDateString('vi-VN');
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: '16px' }}>
          <Link to={`/admin/brands/${id}`}>
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
              Suspend Brand
            </h1>
            <p
              className="text-[#4A5565]"
              style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
            >
              Suspend brand activities for {mockBrand.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {/* Left Column - Suspension Details */}
        <div className="col-span-2 flex flex-col" style={{ gap: '24px' }}>
          {/* Brand Info */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-center" style={{ gap: '16px' }}>
              <img
                src={mockBrand.logo}
                alt={mockBrand.name}
                className="bg-[#F3F4F6]"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                }}
              />
              <div>
                <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
                  <h2
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {mockBrand.name}
                  </h2>
                  <Badge
                    className="bg-[#10B981]/10 text-[#10B981]"
                    style={{
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '6px 12px',
                    }}
                  >
                    {mockBrand.status === 'active' ? 'Active' : 'Suspended'}
                  </Badge>
                </div>
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {mockBrand.email}
                </p>
                <div className="flex items-center" style={{ gap: '16px', marginTop: '8px' }}>
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    🏪 {mockBrand.stats.stores} stores
                  </span>
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    📦 {mockBrand.stats.products.toLocaleString('vi-VN')} products
                  </span>
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    ⭐ {mockBrand.stats.rating}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Suspension Details Form */}
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
                marginBottom: '24px',
              }}
            >
              Suspension Details
            </h3>
            <div className="flex flex-col" style={{ gap: '20px' }}>
              {/* Suspension Reason */}
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
                  Suspension Reason *
                </Label>
                <Select value={suspensionReason} onValueChange={setSuspensionReason}>
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
                    {suspensionReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Suspension Duration */}
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
                  Suspension Duration *
                </Label>
                <Select value={suspensionDuration} onValueChange={setSuspensionDuration}>
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
                    {suspensionDurations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginTop: '6px',
                  }}
                >
                  {suspensionDuration === 'permanent'
                    ? 'Brand will be permanently suspended'
                    : `Suspension will end on ${calculateSuspensionEndDate()}`}
                </p>
              </div>

              {/* Detailed Explanation */}
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
                  Detailed Explanation *
                </Label>
                <Textarea
                  placeholder="Provide detailed explanation for the suspension, including specific violations and evidence..."
                  value={detailedReason}
                  onChange={(e) => setDetailedReason(e.target.value)}
                  className="border-[#D1D5DC]"
                  style={{
                    minHeight: '150px',
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
                  This explanation will be sent to the brand
                </p>
              </div>

              {/* Evidence Links */}
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
                  Evidence Links (Optional)
                </Label>
                <Textarea
                  placeholder="Add links to evidence, reports, or screenshots (one per line)..."
                  value={evidenceLinks}
                  onChange={(e) => setEvidenceLinks(e.target.value)}
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
          </Card>

          {/* Impact Warning */}
          <Card
            className="bg-[#E7000B]/10 border-[#E7000B]/20"
            style={{ padding: '24px', borderRadius: '14px', border: '2px solid' }}
          >
            <div className="flex items-start" style={{ gap: '12px' }}>
              <AlertTriangle
                className="text-[#E7000B]"
                style={{ width: '24px', height: '24px', flexShrink: 0 }}
              />
              <div>
                <h3
                  className="text-[#E7000B]"
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                  }}
                >
                  Suspension Impact
                </h3>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '12px',
                  }}
                >
                  When a brand is suspended, the following will happen:
                </p>
                <ul className="flex flex-col" style={{ gap: '8px', paddingLeft: '20px' }}>
                  <li
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    All products will be hidden from the platform
                  </li>
                  <li
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Brand portal access will be restricted
                  </li>
                  <li
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Active orders will be cancelled
                  </li>
                  <li
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Brand will receive email notification
                  </li>
                  <li
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Revenue payouts will be held
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="col-span-1 flex flex-col" style={{ gap: '24px' }}>
          {/* Suspension Summary */}
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
              Suspension Summary
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  Reason
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {suspensionReason
                    ? suspensionReasons.find((r) => r.value === suspensionReason)?.label
                    : 'Not selected'}
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
                  Duration
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {suspensionDurations.find((d) => d.value === suspensionDuration)?.label}
                </p>
              </div>
              {suspensionDuration !== 'permanent' && (
                <div>
                  <p
                    className="text-[#6A7282]"
                    style={{
                      fontSize: '12px',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    End Date
                  </p>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    <Calendar
                      className="text-[#6A7282]"
                      style={{ width: '14px', height: '14px' }}
                    />
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {calculateSuspensionEndDate()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Affected Data */}
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
              Affected Data
            </h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div className="flex items-center justify-between">
                <span
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  Stores
                </span>
                <span
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockBrand.stats.stores}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  Products
                </span>
                <span
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {mockBrand.stats.products.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </Card>

          {/* Confirm Suspension */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <Button
              onClick={handleSuspend}
              className="w-full bg-[#E7000B] text-white hover:bg-[#E7000B]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Confirm Suspension
            </Button>
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
                This action is serious
              </p>
              <p
                className="text-[#0A0A0A]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                Make sure you have reviewed all evidence before suspending a brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
