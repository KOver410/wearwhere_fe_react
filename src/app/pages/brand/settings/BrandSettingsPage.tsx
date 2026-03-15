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
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Switch } from "@/app/components/ui/switch";
import { Separator } from "@/app/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from '@/app/components/ui/badge';
import { toast } from "sonner";
import { cn } from "@/app/components/ui/utils";
import { format } from "date-fns";

// Mock Data
const MOCK_PAYOUTS = [
  { id: 'PO-2024-001', date: '2025-06-01T10:00:00', amount: 1250.00, status: 'paid', account: '**** 4242' },
  { id: 'PO-2024-002', date: '2025-05-15T10:00:00', amount: 980.50, status: 'paid', account: '**** 4242' },
  { id: 'PO-2024-003', date: '2025-05-01T10:00:00', amount: 1540.25, status: 'paid', account: '**** 4242' },
  { id: 'PO-2024-004', date: '2025-04-15T10:00:00', amount: 890.00, status: 'failed', account: '**** 4242' },
  { id: 'PO-2024-005', date: '2025-06-15T10:00:00', amount: 2100.00, status: 'processing', account: '**** 4242' },
];

export default function BrandSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully");
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Settings</h1>
        <p className="text-[#64748B] text-sm">Manage your account, payments, and preferences.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-transparent p-0 border-b border-gray-200 w-full justify-start h-auto rounded-none overflow-x-auto">
          <TabsTrigger 
            value="account" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900] gap-2"
          >
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger 
            value="bank" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900] gap-2"
          >
            <Building className="h-4 w-4" />
            Bank Account
          </TabsTrigger>
          <TabsTrigger 
            value="payouts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900] gap-2"
          >
            <History className="h-4 w-4" />
            Payout History
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900] gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" defaultValue="Brand" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" defaultValue="One" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="brand1@gmail.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" defaultValue="+1 (555) 000-0000" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password and secure your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
               <Button onClick={handleSave} disabled={isSaving}>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Bank Account Settings */}
        <TabsContent value="bank" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bank Account Details</CardTitle>
              <CardDescription>Enter the bank account where you want to receive payouts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800 mb-4">
                 <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
                 <p>Payouts are processed weekly on Mondays. Ensure your details are correct to avoid delays.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input id="accountHolder" placeholder="e.g. Brand One LLC" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" placeholder="e.g. Chase Bank" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number (ABA)</Label>
                  <Input id="routingNumber" placeholder="9 digits" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" placeholder="10-12 digits" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmAccountNumber">Confirm Account Number</Label>
                  <Input id="confirmAccountNumber" placeholder="Re-enter account number" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                Save Bank Details
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
                  <CardTitle>Payout History</CardTitle>
                  <CardDescription>View all your past and processing payouts from WearWhere.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => alert('Payout history exported to CSV!')}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Account</TableHead>
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
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
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
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about important events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Orders */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Orders</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="new-order-email" className="flex flex-col space-y-1">
                        <span>New Order Email</span>
                        <span className="font-normal text-xs text-gray-500">Receive an email when a new order is placed.</span>
                      </Label>
                      <Switch id="new-order-email" defaultChecked />
                   </div>
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="new-order-push" className="flex flex-col space-y-1">
                        <span>New Order Push</span>
                        <span className="font-normal text-xs text-gray-500">Receive a push notification on your device.</span>
                      </Label>
                      <Switch id="new-order-push" defaultChecked />
                   </div>
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="new-order-sms" className="flex flex-col space-y-1">
                        <span>New Order SMS</span>
                        <span className="font-normal text-xs text-gray-500">Receive a text message (charges may apply).</span>
                      </Label>
                      <Switch id="new-order-sms" />
                   </div>
                </div>
              </div>

              {/* Returns */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Returns & Disputes</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="return-email" className="flex flex-col space-y-1">
                        <span>Return Request Email</span>
                        <span className="font-normal text-xs text-gray-500">When a customer requests a return.</span>
                      </Label>
                      <Switch id="return-email" defaultChecked />
                   </div>
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="return-push" className="flex flex-col space-y-1">
                        <span>Return Request Push</span>
                        <span className="font-normal text-xs text-gray-500">Instant notification for returns.</span>
                      </Label>
                      <Switch id="return-push" defaultChecked />
                   </div>
                </div>
              </div>

               {/* Inventory */}
               <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Inventory</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="low-stock-email" className="flex flex-col space-y-1">
                        <span>Low Stock Email</span>
                        <span className="font-normal text-xs text-gray-500">When an item quantity falls below 5.</span>
                      </Label>
                      <Switch id="low-stock-email" defaultChecked />
                   </div>
                </div>
              </div>

               {/* Payouts */}
               <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Financials</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="flex items-start justify-between space-x-2">
                      <Label htmlFor="payout-email" className="flex flex-col space-y-1">
                        <span>Payout Sent Email</span>
                        <span className="font-normal text-xs text-gray-500">When WearWhere sends a payout to your bank.</span>
                      </Label>
                      <Switch id="payout-email" defaultChecked />
                   </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}