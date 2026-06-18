import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MousePointer2, Users, Eye, Globe } from 'lucide-react';

const trafficData = [
  { name: 'Mon', visitors: 1200, views: 3400 },
  { name: 'Tue', visitors: 1400, views: 3800 },
  { name: 'Wed', visitors: 1100, views: 3200 },
  { name: 'Thu', visitors: 1600, views: 4500 },
  { name: 'Fri', visitors: 2100, views: 6700 },
  { name: 'Sat', visitors: 1800, views: 5400 },
  { name: 'Sun', visitors: 1900, views: 5800 },
];

const trafficSources = [
  { source: 'Direct', visitors: '12,340', percent: '45%' },
  { source: 'Google Search', visitors: '8,200', percent: '30%' },
  { source: 'Instagram', visitors: '4,100', percent: '15%' },
  { source: 'Facebook', visitors: '1,300', percent: '5%' },
  { source: 'Email Marketing', visitors: '800', percent: '3%' },
  { source: 'Referral', visitors: '560', percent: '2%' },
];

const popularProducts = [
  { name: 'Vintage Denim Jacket', views: '12,450', conversion: '2.4%' },
  { name: 'Cotton Basic Tee', views: '10,200', conversion: '3.1%' },
  { name: 'Wool Blend Coat', views: '8,900', conversion: '1.8%' },
  { name: 'Leather Boots', views: '7,500', conversion: '2.1%' },
  { name: 'Slim Fit Chinos', views: '6,200', conversion: '2.5%' },
];

export function BrandTrafficPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Traffic Analytics</h2>
        <p className="text-[#64748B]">Monitor your store's visitors and traffic sources.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Total Page Views</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">145,231</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">+12% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Unique Visitors</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">45,231</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">+8% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Avg. Time on Site</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">2m 45s</div>
            <p className="text-xs text-red-500 font-medium mt-1">-12s from last week</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Bounce Rate</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <MousePointer2 className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">42.3%</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">-2.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Traffic Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Visitors vs Page Views over last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full" style={{ minWidth: '1px', minHeight: '350px' }}>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#F54900" strokeWidth={2.5} activeDot={{ r: 8, fill: '#F54900' }} />
                  <Line type="monotone" dataKey="visitors" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Visitors</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trafficSources.map((source) => (
                  <TableRow key={source.source}>
                    <TableCell className="font-medium">{source.source}</TableCell>
                    <TableCell className="text-right">{source.visitors}</TableCell>
                    <TableCell className="text-right">{source.percent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Popular Products by Views */}
      <Card>
        <CardHeader>
          <CardTitle>Most Viewed Products</CardTitle>
          <CardDescription>Products generating the most interest</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Page Views</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.views}</TableCell>
                    <TableCell>{product.conversion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}