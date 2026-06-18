import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MousePointer2, Users, Eye, Globe } from 'lucide-react';
import { useLanguage } from '@/app/i18n/LanguageContext';

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
  const { v } = useLanguage();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">{v('Traffic Analytics', 'Phân tích lưu lượng truy cập')}</h2>
        <p className="text-[#64748B]">{v("Monitor your store's visitors and traffic sources.", 'Theo dõi khách truy cập và nguồn lưu lượng của cửa hàng.')}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">{v('Total Page Views', 'Tổng lượt xem trang')}</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">145,231</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">{v('+12% from last week', '+12% so với tuần trước')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">{v('Unique Visitors', 'Khách truy cập duy nhất')}</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">45,231</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">{v('+8% from last week', '+8% so với tuần trước')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">{v('Avg. Time on Site', 'Thời gian trung bình trên trang')}</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">{v('2m 45s', '2p 45s')}</div>
            <p className="text-xs text-red-500 font-medium mt-1">{v('-12s from last week', '-12s so với tuần trước')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">{v('Bounce Rate', 'Tỷ lệ thoát')}</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <MousePointer2 className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">42.3%</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">{v('-2.1% from last week', '-2.1% so với tuần trước')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Traffic Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{v('Traffic Overview', 'Tổng quan lưu lượng')}</CardTitle>
            <CardDescription>{v('Visitors vs Page Views over last 7 days', 'Khách truy cập so với lượt xem trang trong 7 ngày qua')}</CardDescription>
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
            <CardTitle>{v('Traffic Sources', 'Nguồn lưu lượng')}</CardTitle>
            <CardDescription>{v('Where your visitors are coming from', 'Khách truy cập của bạn đến từ đâu')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{v('Source', 'Nguồn')}</TableHead>
                  <TableHead className="text-right">{v('Visitors', 'Khách truy cập')}</TableHead>
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
          <CardTitle>{v('Most Viewed Products', 'Sản phẩm được xem nhiều nhất')}</CardTitle>
          <CardDescription>{v('Products generating the most interest', 'Các sản phẩm thu hút nhiều sự quan tâm nhất')}</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{v('Product Name', 'Tên sản phẩm')}</TableHead>
                  <TableHead>{v('Page Views', 'Lượt xem trang')}</TableHead>
                  <TableHead>{v('Conversion Rate', 'Tỷ lệ chuyển đổi')}</TableHead>
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