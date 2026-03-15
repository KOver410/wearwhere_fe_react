import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ArrowLeft, Tag, Percent, DollarSign, Users, Calendar, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCreateVoucherPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: 'sitewide',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    usageLimitPerUser: '',
    startDate: '',
    endDate: '',
    targetAudience: 'all',
    categories: [] as string[],
    brands: [] as string[],
    autoApply: false,
    stackable: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Voucher created successfully');
    navigate('/admin/marketing/promotions');
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center" style={{ gap: '16px' }}>
        <Link to="/admin/marketing/promotions">
          <Button
            variant="outline"
            size="sm"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              padding: '0',
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
            Create Platform Voucher
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Tạo voucher mới cho WearWhere platform
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3" style={{ gap: '24px' }}>
          {/* Left Column - Main Info */}
          <div className="col-span-2 flex flex-col" style={{ gap: '24px' }}>
            {/* Basic Information */}
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
                Basic Information
              </h3>

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
                    Voucher Name *
                  </Label>
                  <Input
                    required
                    placeholder="e.g., Summer Sale 2024"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
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
                    Voucher Code *
                  </Label>
                  <Input
                    required
                    placeholder="e.g., SUMMER2024"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
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
                    Code sẽ tự động uppercase và không có khoảng trắng
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
                    Description
                  </Label>
                  <Textarea
                    placeholder="Describe this promotion..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="border-[#D1D5DC]"
                    style={{
                      minHeight: '100px',
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
                    Promotion Type *
                  </Label>
                  <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
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
                      <SelectItem value="sitewide">Sitewide Sale</SelectItem>
                      <SelectItem value="voucher">Voucher Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Discount Settings */}
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
                Discount Settings
              </h3>

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
                    Discount Type *
                  </Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(v) => handleChange('discountType', v)}
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
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.discountType !== 'free_shipping' && (
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
                      Discount Value *
                    </Label>
                    <Input
                      required
                      type="number"
                      placeholder={
                        formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 100000'
                      }
                      value={formData.discountValue}
                      onChange={(e) => handleChange('discountValue', e.target.value)}
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
                      {formData.discountType === 'percentage'
                        ? 'Enter percentage (e.g., 20 for 20%)'
                        : 'Enter amount in VND'}
                    </p>
                  </div>
                )}

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
                    Minimum Purchase Amount
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.minPurchase}
                    onChange={(e) => handleChange('minPurchase', e.target.value)}
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
                    Leave empty for no minimum
                  </p>
                </div>

                {formData.discountType === 'percentage' && (
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
                      Maximum Discount Amount
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 200000"
                      value={formData.maxDiscount}
                      onChange={(e) => handleChange('maxDiscount', e.target.value)}
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
                      Cap the maximum discount for percentage discounts
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Usage Limits */}
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
                Usage Limits
              </h3>

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
                    Total Usage Limit
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.usageLimit}
                    onChange={(e) => handleChange('usageLimit', e.target.value)}
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
                    Leave empty for unlimited uses
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
                    Usage Limit Per User
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.usageLimitPerUser}
                    onChange={(e) => handleChange('usageLimitPerUser', e.target.value)}
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
                    How many times each user can use this voucher
                  </p>
                </div>
              </div>
            </Card>

            {/* Target Audience */}
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
                Target Audience
              </h3>

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
                    Audience Type *
                  </Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(v) => handleChange('targetAudience', v)}
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
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="new">New Users Only</SelectItem>
                      <SelectItem value="vip">VIP Members</SelectItem>
                      <SelectItem value="custom">Custom Segment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between bg-[#F9FAFB]" style={{ padding: '16px', borderRadius: '10px' }}>
                  <div>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      Auto-apply
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      Automatically apply this promotion at checkout
                    </p>
                  </div>
                  <Switch
                    checked={formData.autoApply}
                    onCheckedChange={(checked) => handleChange('autoApply', checked)}
                  />
                </div>

                <div className="flex items-center justify-between bg-[#F9FAFB]" style={{ padding: '16px', borderRadius: '10px' }}>
                  <div>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      Stackable
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      Allow combining with other promotions
                    </p>
                  </div>
                  <Switch
                    checked={formData.stackable}
                    onCheckedChange={(checked) => handleChange('stackable', checked)}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Schedule & Summary */}
          <div className="flex flex-col" style={{ gap: '24px' }}>
            {/* Schedule */}
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
                Schedule
              </h3>

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
                    Start Date *
                  </Label>
                  <Input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
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
                    End Date *
                  </Label>
                  <Input
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="border-[#D1D5DC]"
                    style={{
                      height: '48px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Preview */}
            <Card
              className="bg-gradient-to-br from-[#F54900] to-[#E7000B]"
              style={{ padding: '24px', borderRadius: '14px', border: 'none' }}
            >
              <div className="flex items-center" style={{ gap: '8px', marginBottom: '16px' }}>
                <Tag className="text-white" style={{ width: '20px', height: '20px' }} />
                <h3
                  className="text-white"
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  Voucher Preview
                </h3>
              </div>

              <div className="bg-white/20 backdrop-blur-sm" style={{ padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
                <p
                  className="text-white"
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                  }}
                >
                  {formData.code || 'VOUCHER CODE'}
                </p>
                <p
                  className="text-white/90"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {formData.name || 'Voucher Name'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-white/80"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Discount
                  </p>
                  <p
                    className="text-white"
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {formData.discountType === 'percentage'
                      ? `${formData.discountValue || '0'}%`
                      : formData.discountType === 'fixed'
                      ? `${parseInt(formData.discountValue || '0').toLocaleString('vi-VN')}đ`
                      : 'Free Ship'}
                  </p>
                </div>
                {formData.minPurchase && (
                  <div className="text-right">
                    <p
                      className="text-white/80"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      Min. Purchase
                    </p>
                    <p
                      className="text-white"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {parseInt(formData.minPurchase).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Info Card */}
            <Card
              className="bg-[#3B82F6]/10"
              style={{ padding: '16px', borderRadius: '14px', border: '1px solid #3B82F6' }}
            >
              <div className="flex" style={{ gap: '12px' }}>
                <Info className="text-[#3B82F6]" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                <div>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    Platform Voucher
                  </p>
                  <p
                    className="text-[#4A5565]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif', lineHeight: '1.5' }}
                  >
                    This voucher will be funded by WearWhere, not individual brands. Make sure to
                    set appropriate limits and conditions.
                  </p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <Button
                type="submit"
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
                Create Voucher
              </Button>
              <Link to="/admin/marketing/promotions">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#D1D5DC]"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    width: '100%',
                  }}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
