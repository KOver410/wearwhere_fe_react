import { useState } from 'react';
import {
  User,
  CreditCard,
  History,
  Bell,
  Save,
  Building,
  DollarSign,
  Download,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Switch } from "@/shared/ui/switch";
import { Separator } from "@/shared/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from '@/shared/ui/badge';
import { toast } from "sonner";
import { cn } from "@/shared/ui/utils";
import { format } from "date-fns";
import { useLanguage } from '@/shared/i18n/LanguageContext';

// Mock Data
const MOCK_PAYOUTS = [
  { id: 'PO-2024-001', date: '2025-06-01T10:00:00', amount: 1250.00, status: 'paid', account: '**** 4242' },
  { id: 'PO-2024-002', date: '2025-05-15T10:00:00', amount: 980.50, status: 'paid', account: '**** 4242' },
  { id: 'PO-2024-003', date: '2025-05-01T10:00:00', amount: 1540.25, status: 'paid', account: '**** 4242' },
  { id: 'PO-2024-004', date: '2025-04-15T10:00:00', amount: 890.00, status: 'failed', account: '**** 4242' },
  { id: 'PO-2024-005', date: '2025-06-15T10:00:00', amount: 2100.00, status: 'processing', account: '**** 4242' },
];

export default function BrandSettingsPage() {
  const { v } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(v("Settings saved successfully", "Đã lưu cài đặt thành công"));
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return v('Paid', 'Đã thanh toán');
      case 'processing': return v('Processing', 'Đang xử lý');
      case 'failed': return v('Failed', 'Thất bại');
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">{v('Settings', 'Cài đặt')}</h1>
        <p className="text-[#64748B] text-sm">{v('Manage your account, payments, and preferences.', 'Quản lý tài khoản, thanh toán và tùy chọn của bạn.')}</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-transparent p-0 border-b border-gray-200 w-full justify-start h-auto rounded-none overflow-x-auto">
          <TabsTrigger
            value="account"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900] gap-2"
          >
            <User className="h-4 w-4" />
            {v('Account', 'Tài khoản')}
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900] gap-2"
          >
            <Building className="h-4 w-4" />
            {v('Bank Account', 'Tài khoản ngân hàng')}
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900] gap-2"
          >
            <History className="h-4 w-4" />
            {v('Payout History', 'Lịch sử chi trả')}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900] gap-2"
          >
            <Bell className="h-4 w-4" />
            {v('Notifications', 'Thông báo')}
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{v('Personal Information', 'Thông tin cá nhân')}</CardTitle>
              <CardDescription>{v('Update your personal details and contact information.', 'Cập nhật thông tin cá nhân và liên hệ của bạn.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{v('First name', 'Tên')}</Label>
                  <Input id="firstName" defaultValue="Brand" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{v('Last name', 'Họ')}</Label>
                  <Input id="lastName" defaultValue="One" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{v('Email', 'Email')}</Label>
                <Input id="email" defaultValue="brand1@gmail.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{v('Phone number', 'Số điện thoại')}</Label>
                <Input id="phone" defaultValue="+1 (555) 000-0000" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? v("Saving...", "Đang lưu...") : v("Save Changes", "Lưu thay đổi")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{v('Security', 'Bảo mật')}</CardTitle>
              <CardDescription>{v('Change your password and secure your account.', 'Đổi mật khẩu và bảo mật tài khoản của bạn.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{v('Current Password', 'Mật khẩu hiện tại')}</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{v('New Password', 'Mật khẩu mới')}</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{v('Confirm New Password', 'Xác nhận mật khẩu mới')}</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
               <Button onClick={handleSave} disabled={isSaving}>{v('Update Password', 'Cập nhật mật khẩu')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Bank Account Settings */}
        <TabsContent value="bank" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{v('Bank Account Details', 'Thông tin tài khoản ngân hàng')}</CardTitle>
              <CardDescription>{v('Enter the bank account where you want to receive payouts.', 'Nhập tài khoản ngân hàng bạn muốn nhận chi trả.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800 mb-4">
                 <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
                 <p>{v('Payouts are processed weekly on Mondays. Ensure your details are correct to avoid delays.', 'Chi trả được xử lý hàng tuần vào thứ Hai. Hãy đảm bảo thông tin của bạn chính xác để tránh chậm trễ.')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolder">{v('Account Holder Name', 'Tên chủ tài khoản')}</Label>
                <Input id="accountHolder" placeholder={v('e.g. Brand One LLC', 'ví dụ: Công ty TNHH Brand One')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">{v('Bank Name', 'Tên ngân hàng')}</Label>
                  <Input id="bankName" placeholder={v('e.g. Chase Bank', 'ví dụ: Vietcombank')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">{v('Routing Number (ABA)', 'Số định tuyến (ABA)')}</Label>
                  <Input id="routingNumber" placeholder={v('9 digits', '9 chữ số')} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">{v('Account Number', 'Số tài khoản')}</Label>
                  <Input id="accountNumber" placeholder={v('10-12 digits', '10-12 chữ số')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmAccountNumber">{v('Confirm Account Number', 'Xác nhận số tài khoản')}</Label>
                  <Input id="confirmAccountNumber" placeholder={v('Re-enter account number', 'Nhập lại số tài khoản')} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {v('Save Bank Details', 'Lưu thông tin ngân hàng')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payout History */}
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{v('Payout History', 'Lịch sử chi trả')}</CardTitle>
                  <CardDescription>{v('View all your past and processing payouts from WearWhere.', 'Xem tất cả các khoản chi trả đã hoàn tất và đang xử lý từ WearWhere.')}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => alert(v('Payout history exported to CSV!', 'Đã xuất lịch sử chi trả ra CSV!'))}>
                  <Download className="h-4 w-4" />
                  {v('Export CSV', 'Xuất CSV')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{v('Payout ID', 'Mã chi trả')}</TableHead>
                    <TableHead>{v('Date', 'Ngày')}</TableHead>
                    <TableHead>{v('Amount', 'Số tiền')}</TableHead>
                    <TableHead>{v('Status', 'Trạng thái')}</TableHead>
                    <TableHead>{v('Account', 'Tài khoản')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PAYOUTS.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium text-gray-900">{payout.id}</TableCell>
                      <TableCell className="text-gray-600">{format(new Date(payout.date), "MMM d, yyyy")}</TableCell>
                      <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("font-medium border", getStatusColor(payout.status))}>
                          {getStatusLabel(payout.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 font-mono text-xs">{payout.account}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{v('Notification Preferences', 'Tùy chọn thông báo')}</CardTitle>
              <CardDescription>{v('Choose how you want to be notified about important events.', 'Chọn cách bạn muốn được thông báo về các sự kiện quan trọng.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

              {/* Orders */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">{v('Orders', 'Đơn hàng')}</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="new-order-email" className="flex flex-col space-y-1">
                        <span>{v('New Order Email', 'Email đơn hàng mới')}</span>
                        <span className="font-normal text-xs text-gray-500">{v('Receive an email when a new order is placed.', 'Nhận email khi có đơn hàng mới được đặt.')}</span>
                      </Label>
                      <Switch id="new-order-email" defaultChecked />
                   </div>
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="new-order-push" className="flex flex-col space-y-1">
                        <span>{v('New Order Push', 'Thông báo đẩy đơn hàng mới')}</span>
                        <span className="font-normal text-xs text-gray-500">{v('Receive a push notification on your device.', 'Nhận thông báo đẩy trên thiết bị của bạn.')}</span>
                      </Label>
                      <Switch id="new-order-push" defaultChecked />
                   </div>
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="new-order-sms" className="flex flex-col space-y-1">
                        <span>{v('New Order SMS', 'SMS đơn hàng mới')}</span>
                        <span className="font-normal text-xs text-gray-500">{v('Receive a text message (charges may apply).', 'Nhận tin nhắn văn bản (có thể phát sinh phí).')}</span>
                      </Label>
                      <Switch id="new-order-sms" />
                   </div>
                </div>
              </div>

              {/* Returns */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">{v('Returns & Disputes', 'Trả hàng & Khiếu nại')}</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="return-email" className="flex flex-col space-y-1">
                        <span>{v('Return Request Email', 'Email yêu cầu trả hàng')}</span>
                        <span className="font-normal text-xs text-gray-500">{v('When a customer requests a return.', 'Khi khách hàng gửi yêu cầu trả hàng.')}</span>
                      </Label>
                      <Switch id="return-email" defaultChecked />
                   </div>
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="return-push" className="flex flex-col space-y-1">
                        <span>{v('Return Request Push', 'Thông báo đẩy yêu cầu trả hàng')}</span>
                        <span className="font-normal text-xs text-gray-500">{v('Instant notification for returns.', 'Thông báo tức thì cho các yêu cầu trả hàng.')}</span>
                      </Label>
                      <Switch id="return-push" defaultChecked />
                   </div>
                </div>
              </div>

               {/* Inventory */}
               <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">{v('Inventory', 'Kho hàng')}</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="low-stock-email" className="flex flex-col space-y-1">
                        <span>{v('Low Stock Email', 'Email sắp hết hàng')}</span>
                        <span className="font-normal text-xs text-gray-500">{v('When an item quantity falls below 5.', 'Khi số lượng sản phẩm còn dưới 5.')}</span>
                      </Label>
                      <Switch id="low-stock-email" defaultChecked />
                   </div>
                </div>
              </div>

               {/* Payouts */}
               <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">{v('Financials', 'Tài chính')}</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="payout-email" className="flex flex-col space-y-1">
                        <span>{v('Payout Sent Email', 'Email chi trả đã gửi')}</span>
                        <span className="font-normal text-xs text-gray-500">{v('When WearWhere sends a payout to your bank.', 'Khi WearWhere gửi khoản chi trả vào ngân hàng của bạn.')}</span>
                      </Label>
                      <Switch id="payout-email" defaultChecked />
                   </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>{v('Save Preferences', 'Lưu tùy chọn')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
