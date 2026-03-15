import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Calendar as CalendarIcon, Download } from 'lucide-react';

const monthlyData = [
  { name: 'Jan', revenue: 4000, previous: 2400 },
  { name: 'Feb', revenue: 3000, previous: 1398 },
  { name: 'Mar', revenue: 2000, previous: 9800 },
  { name: 'Apr', revenue: 2780, previous: 3908 },
  { name: 'May', revenue: 1890, previous: 4800 },
  { name: 'Jun', revenue: 2390, previous: 3800 },
  { name: 'Jul', revenue: 3490, previous: 4300 },
  { name: 'Aug', revenue: 4200, previous: 2400 },
  { name: 'Sep', revenue: 5100, previous: 3200 },
  { name: 'Oct', revenue: 3800, previous: 4100 },
  { name: 'Nov', revenue: 6500, previous: 5200 },
  { name: 'Dec', revenue: 7200, previous: 6100 },
];

const categoryData = [
  { name: 'Apparel', value: 400 },
  { name: 'Footwear', value: 300 },
  { name: 'Accessories', value: 200 },
  { name: 'Sale', value: 100 },
];

const COLORS = ['#F54900', '#4F46E5', '#10B981', '#F59E0B'];

const productPerformance = [
  { name: 'Vintage Denim Jacket', category: 'Apparel', revenue: '$12,340', growth: '+12%' },
  { name: 'Cotton Basic Tee', category: 'Apparel', revenue: '$8,200', growth: '+5%' },
  { name: 'Leather Boots', category: 'Footwear', revenue: '$6,500', growth: '-2%' },
  { name: 'Wool Blend Coat', category: 'Apparel', revenue: '$5,400', growth: '+18%' },
  { name: 'Classic Sneakers', category: 'Footwear', revenue: '$4,200', growth: '+3%' },
];

export function BrandSalesPage() {
  const [period, setPeriod] = useState('year');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Sales Analytics</h2>
          <p className="text-[#64748B]">Detailed breakdown of your revenue and sales performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9" onClick={() => alert('Date range picker coming soon')}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Jan 1, 2025 - Dec 31, 2025
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => alert('Sales report downloaded!')}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Comparing current period vs previous period</CardDescription>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full" style={{ minWidth: '1px', minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar name="Current Period" dataKey="revenue" fill="#F54900" radius={[4, 4, 0, 0]} />
                <Bar name="Previous Period" dataKey="previous" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Category Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full" style={{ minWidth: '1px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Best selling items by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productPerformance.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.revenue}</TableCell>
                    <TableCell className={`text-right ${product.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {product.growth}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}