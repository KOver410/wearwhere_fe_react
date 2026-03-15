import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Link } from 'react-router';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Users, Star, Plus, Package, MessageSquare, TrendingUp } from 'lucide-react';

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const ordersData = [
  { name: 'Mon', orders: 24 },
  { name: 'Tue', orders: 13 },
  { name: 'Wed', orders: 98 },
  { name: 'Thu', orders: 39 },
  { name: 'Fri', orders: 48 },
  { name: 'Sat', orders: 38 },
  { name: 'Sun', orders: 43 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Alice Smith', product: 'Vintage Denim Jacket', amount: '$129.00', status: 'Completed', date: 'Today, 2:34 PM' },
  { id: 'ORD-002', customer: 'Bob Jones', product: 'Cotton Basic Tee', amount: '$29.00', status: 'Processing', date: 'Today, 1:12 PM' },
  { id: 'ORD-003', customer: 'Charlie Brown', product: 'Wool Blend Coat', amount: '$299.00', status: 'Completed', date: 'Yesterday' },
  { id: 'ORD-004', customer: 'Diana Prince', product: 'Leather Boots', amount: '$189.00', status: 'Pending', date: 'Yesterday' },
  { id: 'ORD-005', customer: 'Evan Wright', product: 'Slim Fit Chinos', amount: '$59.00', status: 'Completed', date: 'Feb 7, 2026' },
];

export function BrandDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Dashboard Overview</h2>
        <p className="text-[#64748B]">Welcome back, Brand One. Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Total Revenue</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">$45,231.89</div>
            <p className="text-xs flex items-center mt-1">
              <span className="text-emerald-600 flex items-center mr-1 font-medium">
                +20.1% <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
              <span className="text-[#94A3B8]">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Orders</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">+2350</div>
            <p className="text-xs flex items-center mt-1">
              <span className="text-emerald-600 flex items-center mr-1 font-medium">
                +180.1% <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
              <span className="text-[#94A3B8]">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Product Views</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">12,234</div>
            <p className="text-xs flex items-center mt-1">
              <span className="text-red-500 flex items-center mr-1 font-medium">
                -4.5% <ArrowDownRight className="h-3 w-3 ml-0.5" />
              </span>
              <span className="text-[#94A3B8]">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Store Rating</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">4.8</div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Based on 450 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#0F172A]">Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full" style={{ minWidth: '1px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenueDashboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F54900" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#F54900" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94A3B8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backgroundColor: '#0F172A', color: '#fff' }}
                    labelStyle={{ color: '#94A3B8' }}
                    itemStyle={{ color: '#F54900' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#F54900" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorRevenueDashboard)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders Trend & Quick Actions */}
        <div className="col-span-3 space-y-4">
          <Card className="h-[250px] border-none shadow-sm">
             <CardHeader>
              <CardTitle className="text-[#0F172A]">Orders Trend</CardTitle>
              <CardDescription>Daily orders over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[150px] w-full" style={{ minWidth: '1px', minHeight: '150px' }}>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={ordersData}>
                    <Bar dataKey="orders" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px', border: 'none', backgroundColor: '#0F172A', color: '#fff' }} itemStyle={{ color: '#818CF8' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#0F172A]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link to="/brand/products/new">
                <Button className="w-full justify-start bg-[#F54900]/5 text-[#F54900] hover:bg-[#F54900]/10 border border-[#F54900]/20" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add New Product
                </Button>
              </Link>
              <Link to="/brand/products">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="mr-2 h-4 w-4" /> Manage Inventory
                </Button>
              </Link>
              <Link to="/brand/orders">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> View Messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>You have 12 orders pending shipment.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}