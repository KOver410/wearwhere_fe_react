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
import { useLanguage } from '@/app/i18n/LanguageContext';

export default function AdminCreateVoucherPage() {
  const { v } = useLanguage();
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
    toast.success(v('Voucher created successfully', 'Tạo voucher thành công'));
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
            {v('Create Platform Voucher', 'Tạo Voucher Nền tảng')}
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
                {v('Basic Information', 'Thông tin cơ bản')}
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
                    {v('Voucher Name *', 'Tên Voucher *')}
                  </Label>
                  <Input
                    required
                    placeholder={v('e.g., Summer Sale 2024', 'VD: Khuyến mãi Hè 2024')}
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
                    {v('Voucher Code *', 'Mã Voucher *')}
                  </Label>
                  <Input
                    required
                    placeholder={v('e.g., SUMMER2024', 'VD: SUMMER2024')}
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
                    {v('Description', 'Mô tả')}
                  </Label>
                  <Textarea
                    placeholder={v('Describe this promotion...', 'Mô tả chương trình khuyến mãi này...')}
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
                    {v('Promotion Type *', 'Loại khuyến mãi *')}
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
                      <SelectItem value="sitewide">{v('Sitewide Sale', 'Khuyến mãi toàn trang')}</SelectItem>
                      <SelectItem value="voucher">{v('Voucher Code', 'Mã Voucher')}</SelectItem>
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
                {v('Discount Settings', 'Cài đặt giảm giá')}
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
                    {v('Discount Type *', 'Loại giảm giá *')}
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
                      <SelectItem value="percentage">{v('Percentage Discount', 'Giảm theo phần trăm')}</SelectItem>
                      <SelectItem value="fixed">{v('Fixed Amount', 'Số tiền cố định')}</SelectItem>
                      <SelectItem value="free_shipping">{v('Free Shipping', 'Miễn phí vận chuyển')}</SelectItem>
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
                      {v('Discount Value *', 'Giá trị giảm giá *')}
                    </Label>
                    <Input
                      required
                      type="number"
                      placeholder={
                        formData.discountType === 'percentage' ? v('e.g., 20', 'VD: 20') : v('e.g., 100000', 'VD: 100000')
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
                        ? v('Enter percentage (e.g., 20 for 20%)', 'Nhập phần trăm (VD: 20 cho 20%)')
                        : v('Enter amount in VND', 'Nhập số tiền theo VND')}
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
                    {v('Minimum Purchase Amount', 'Giá trị đơn hàng tối thiểu')}
                  </Label>
                  <Input
                    type="number"
                    placeholder={v('e.g., 500000', 'VD: 500000')}
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
                    {v('Leave empty for no minimum', 'Để trống nếu không yêu cầu tối thiểu')}
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
                      {v('Maximum Discount Amount', 'Số tiền giảm tối đa')}
                    </Label>
                    <Input
                      type="number"
                      placeholder={v('e.g., 200000', 'VD: 200000')}
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
                      {v('Cap the maximum discount for percentage discounts', 'Giới hạn mức giảm tối đa cho giảm giá theo phần trăm')}
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
                {v('Usage Limits', 'Giới hạn sử dụng')}
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
                    {v('Total Usage Limit', 'Tổng giới hạn sử dụng')}
                  </Label>
                  <Input
                    type="number"
                    placeholder={v('e.g., 1000', 'VD: 1000')}
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
                    {v('Leave empty for unlimited uses', 'Để trống nếu không giới hạn lượt sử dụng')}
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
                    {v('Usage Limit Per User', 'Giới hạn sử dụng mỗi người')}
                  </Label>
                  <Input
                    type="number"
                    placeholder={v('e.g., 3', 'VD: 3')}
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
                    {v('How many times each user can use this voucher', 'Số lần mỗi người dùng có thể sử dụng voucher này')}
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
                {v('Target Audience', 'Đối tượng mục tiêu')}
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
                    {v('Audience Type *', 'Loại đối tượng *')}
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
                      <SelectItem value="all">{v('All Users', 'Tất cả người dùng')}</SelectItem>
                      <SelectItem value="new">{v('New Users Only', 'Chỉ người dùng mới')}</SelectItem>
                      <SelectItem value="vip">{v('VIP Members', 'Thành viên VIP')}</SelectItem>
                      <SelectItem value="custom">{v('Custom Segment', 'Phân khúc tùy chỉnh')}</SelectItem>
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
                      {v('Auto-apply', 'Tự động áp dụng')}
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {v('Automatically apply this promotion at checkout', 'Tự động áp dụng khuyến mãi này khi thanh toán')}
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
                      {v('Stackable', 'Có thể kết hợp')}
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {v('Allow combining with other promotions', 'Cho phép kết hợp với các khuyến mãi khác')}
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
                {v('Schedule', 'Lịch trình')}
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
                    {v('Start Date *', 'Ngày bắt đầu *')}
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
                    {v('End Date *', 'Ngày kết thúc *')}
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
                  {v('Voucher Preview', 'Xem trước Voucher')}
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
                  {formData.code || v('VOUCHER CODE', 'MÃ VOUCHER')}
                </p>
                <p
                  className="text-white/90"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {formData.name || v('Voucher Name', 'Tên Voucher')}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-white/80"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Discount', 'Giảm giá')}
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
                      : v('Free Ship', 'Miễn phí ship')}
                  </p>
                </div>
                {formData.minPurchase && (
                  <div className="text-right">
                    <p
                      className="text-white/80"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {v('Min. Purchase', 'Đơn tối thiểu')}
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
                    {v('Platform Voucher', 'Voucher Nền tảng')}
                  </p>
                  <p
                    className="text-[#4A5565]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif', lineHeight: '1.5' }}
                  >
                    {v('This voucher will be funded by WearWhere, not individual brands. Make sure to set appropriate limits and conditions.', 'Voucher này sẽ do WearWhere tài trợ, không phải các thương hiệu riêng lẻ. Hãy đảm bảo thiết lập giới hạn và điều kiện phù hợp.')}
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
                {v('Create Voucher', 'Tạo Voucher')}
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
                  {v('Cancel', 'Hủy')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
