import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const mockBrand = {
  id: 1,
  name: 'Zara Vietnam',
  logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  email: 'contact@zara.vn',
  verified: false,
  subscriptionTier: 'premium',
  stats: {
    stores: 12,
    products: 1234,
    rating: 4.8,
    reviews: 2341,
  },
};

const verificationCriteria = [
  { id: 'business_license', label: 'Valid business license verified', checked: false },
  { id: 'tax_documents', label: 'Tax registration documents verified', checked: false },
  { id: 'brand_authenticity', label: 'Brand authenticity confirmed', checked: false },
  { id: 'quality_standards', label: 'Products meet quality standards', checked: false },
  { id: 'customer_service', label: 'Customer service standards met', checked: false },
  { id: 'no_violations', label: 'No policy violations in the past 6 months', checked: false },
];

export default function AdminVerifyBrandPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [criteria, setCriteria] = useState(verificationCriteria);
  const [verificationNote, setVerificationNote] = useState('');

  const allChecked = criteria.every((c) => c.checked);

  const handleToggleCriteria = (criteriaId: string) => {
    setCriteria(
      criteria.map((c) => (c.id === criteriaId ? { ...c, checked: !c.checked } : c))
    );
  };

  const handleVerify = () => {
    if (!allChecked) {
      toast.error('Please verify all criteria before granting the verified badge');
      return;
    }
    if (!verificationNote.trim()) {
      toast.error('Please add verification notes');
      return;
    }
    toast.success('Verified badge granted successfully');
    navigate(`/admin/brands/${id}`);
  };

  const handleRemoveVerification = () => {
    if (!verificationNote.trim()) {
      toast.error('Please add a note explaining the removal');
      return;
    }
    toast.success('Verified badge removed');
    navigate(`/admin/brands/${id}`);
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
              Verify Brand
            </h1>
            <p
              className="text-[#4A5565]"
              style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
            >
              Grant or remove verified badge for {mockBrand.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {/* Left Column - Verification Process */}
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
                  {mockBrand.verified && (
                    <Badge
                      className="bg-[#10B981]/10 text-[#10B981]"
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '6px 12px',
                        gap: '4px',
                      }}
                    >
                      <Shield style={{ width: '14px', height: '14px' }} />
                      Verified
                    </Badge>
                  )}
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
                    ⭐ {mockBrand.stats.rating} ({mockBrand.stats.reviews.toLocaleString('vi-VN')})
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Criteria */}
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
              Verification Criteria
            </h3>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '24px',
              }}
            >
              All criteria must be met before granting the verified badge
            </p>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="flex items-center bg-[#F9FAFB]"
                  style={{ padding: '16px', borderRadius: '10px', gap: '12px' }}
                >
                  <Checkbox
                    id={criterion.id}
                    checked={criterion.checked}
                    onCheckedChange={() => handleToggleCriteria(criterion.id)}
                  />
                  <Label
                    htmlFor={criterion.id}
                    className="text-[#0A0A0A] cursor-pointer flex-1"
                    style={{
                      fontSize: '14px',
                      fontWeight: criterion.checked ? '700' : '400',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {criterion.label}
                  </Label>
                  {criterion.checked && (
                    <CheckCircle
                      className="text-[#10B981]"
                      style={{ width: '20px', height: '20px' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Verification Notes */}
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
              Verification Notes
            </h3>
            <Textarea
              placeholder="Add detailed notes about the verification process and decision..."
              value={verificationNote}
              onChange={(e) => setVerificationNote(e.target.value)}
              className="border-[#D1D5DC]"
              style={{
                minHeight: '150px',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
              }}
            />
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="col-span-1 flex flex-col" style={{ gap: '24px' }}>
          {/* Verification Status */}
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
              Current Status
            </h3>
            {mockBrand.verified ? (
              <Badge
                className="bg-[#10B981]/10 text-[#10B981]"
                style={{
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '8px 16px',
                  gap: '6px',
                }}
              >
                <Shield style={{ width: '16px', height: '16px' }} />
                Verified
              </Badge>
            ) : (
              <Badge
                className="bg-[#6A7282]/10 text-[#6A7282]"
                style={{
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '8px 16px',
                }}
              >
                Not Verified
              </Badge>
            )}
          </Card>

          {/* Progress */}
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
              Verification Progress
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <span
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  Criteria Met
                </span>
                <span
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {criteria.filter((c) => c.checked).length}/{criteria.length}
                </span>
              </div>
              <div
                className="w-full bg-[#F3F4F6]"
                style={{ height: '8px', borderRadius: '9999px', overflow: 'hidden' }}
              >
                <div
                  className="bg-[#10B981]"
                  style={{
                    height: '100%',
                    width: `${(criteria.filter((c) => c.checked).length / criteria.length) * 100}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
            {!allChecked && (
              <p
                className="text-[#F54900]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                All criteria must be verified
              </p>
            )}
          </Card>

          {/* Grant Verification */}
          {!mockBrand.verified && (
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
                Grant Verified Badge
              </h3>
              <Button
                onClick={handleVerify}
                disabled={!allChecked}
                className="w-full bg-[#10B981] text-white hover:bg-[#10B981]/90 disabled:bg-[#6A7282] disabled:cursor-not-allowed"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <Shield style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Grant Verified Badge
              </Button>
            </Card>
          )}

          {/* Remove Verification */}
          {mockBrand.verified && (
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
                Remove Verification
              </h3>
              <Button
                onClick={handleRemoveVerification}
                variant="outline"
                className="w-full border-[#E7000B] text-[#E7000B] hover:bg-[#E7000B]/10"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <AlertTriangle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Remove Verified Badge
              </Button>
            </Card>
          )}

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
                The verified badge is a mark of trust. Only grant it to brands that meet all
                criteria and maintain high standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
