import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import {
  Users,
  DollarSign,
  TrendingUp,
  Store,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data
const statsData = {
  totalUsers: 48532,
  userGrowth: 12.5,
  revenue: 2847621000,
  revenueGrowth: 18.2,
  gmv: 3564200000,
  gmvGrowth: 15.8,
  activeBrands: 1247,
  brandGrowth: 8.3,
};

const systemHealth = {
  status: 'healthy',
  uptime: 99.98,
  responseTime: 145,
  errorRate: 0.02,
};

const revenueData = [
  { month: 'T1', revenue: 2200, gmv: 2800 },
  { month: 'T2', revenue: 2400, gmv: 3000 },
  { month: 'T3', revenue: 2600, gmv: 3200 },
  { month: 'T4', revenue: 2500, gmv: 3100 },
  { month: 'T5', revenue: 2700, gmv: 3400 },
  { month: 'T6', revenue: 2847, gmv: 3564 },
];

const userGrowthData = [
  { week: 'W1', users: 42000 },
  { week: 'W2', users: 43500 },
  { week: 'W3', users: 45200 },
  { week: 'W4', users: 46800 },
  { week: 'W5', users: 48532 },
];

const brandCategoryData = [
  { category: 'Men', count: 342 },
  { category: 'Women', count: 425 },
  { category: 'Accessories', count: 198 },
  { category: 'Shoes', count: 282 },
];

export default function AdminDashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div>
        <h1 className="text-[#0A0A0A]" style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', marginBottom: '8px' }}>
          System Dashboard
        </h1>
        <p className="text-[#4A5565]" style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}>
          Overview and system monitoring for WearWhere
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4" style={{ gap: '24px' }}>
        {/* Total Users */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center bg-[#10B981]/10" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
                <Users className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
              </div>
              <Badge
                className={`${statsData.userGrowth > 0 ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#E7000B]/10 text-[#E7000B]'}`}
                style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 12px' }}
              >
                {statsData.userGrowth > 0 ? <ArrowUp style={{ width: '12px', height: '12px', display: 'inline' }} /> : <ArrowDown style={{ width: '12px', height: '12px', display: 'inline' }} />}
                {Math.abs(statsData.userGrowth)}%
              </Badge>
            </div>
            <div>
              <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
                Total Users
              </p>
              <h3 className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                {formatNumber(statsData.totalUsers)}
              </h3>
            </div>
          </div>
        </Card>

        {/* Revenue */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center bg-[#3B82F6]/10" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
                <DollarSign className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
              </div>
              <Badge
                className="bg-[#10B981]/10 text-[#10B981]"
                style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 12px' }}
              >
                <ArrowUp style={{ width: '12px', height: '12px', display: 'inline' }} />
                {statsData.revenueGrowth}%
              </Badge>
            </div>
            <div>
              <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
                Revenue (30 days)
              </p>
              <h3 className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                {formatCurrency(statsData.revenue)}
              </h3>
            </div>
          </div>
        </Card>

        {/* GMV */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center bg-[#F59E0B]/10" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
                <TrendingUp className="text-[#F59E0B]" style={{ width: '24px', height: '24px' }} />
              </div>
              <Badge
                className="bg-[#10B981]/10 text-[#10B981]"
                style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 12px' }}
              >
                <ArrowUp style={{ width: '12px', height: '12px', display: 'inline' }} />
                {statsData.gmvGrowth}%
              </Badge>
            </div>
            <div>
              <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
                GMV (30 days)
              </p>
              <h3 className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                {formatCurrency(statsData.gmv)}
              </h3>
            </div>
          </div>
        </Card>

        {/* Active Brands */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center bg-[#8B5CF6]/10" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
                <Store className="text-[#8B5CF6]" style={{ width: '24px', height: '24px' }} />
              </div>
              <Badge
                className="bg-[#10B981]/10 text-[#10B981]"
                style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 12px' }}
              >
                <ArrowUp style={{ width: '12px', height: '12px', display: 'inline' }} />
                {statsData.brandGrowth}%
              </Badge>
            </div>
            <div>
              <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
                Active Brands
              </p>
              <h3 className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                {formatNumber(statsData.activeBrands)}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
        <div className="flex flex-col" style={{ gap: '24px' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
              System Health
            </h2>
            <Badge
              className={`${systemHealth.status === 'healthy' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#E7000B]/10 text-[#E7000B]'}`}
              style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 12px', gap: '4px' }}
            >
              <CheckCircle style={{ width: '14px', height: '14px' }} />
              {systemHealth.status === 'healthy' ? 'Healthy' : 'Issues Detected'}
            </Badge>
          </div>

          <div className="grid grid-cols-3" style={{ gap: '24px' }}>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
                Uptime
              </p>
              <p className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                {systemHealth.uptime}%
              </p>
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
                Avg Response Time
              </p>
              <p className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                {systemHealth.responseTime}ms
              </p>
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
                Error Rate
              </p>
              <p className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                {systemHealth.errorRate}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-2" style={{ gap: '24px' }}>
        {/* Revenue & GMV Chart */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', marginBottom: '24px' }}>
            Revenue & GMV Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6A7282" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }} />
              <YAxis stroke="#6A7282" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
              <Area type="monotone" dataKey="gmv" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} name="GMV (M)" />
              <Area type="monotone" dataKey="revenue" stroke="#F54900" fill="#F54900" fillOpacity={0.2} name="Revenue (M)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', marginBottom: '24px' }}>
            User Growth
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" stroke="#6A7282" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }} />
              <YAxis stroke="#6A7282" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
              <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
        <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', marginBottom: '24px' }}>
          Brands by Category
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={brandCategoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="category" stroke="#6A7282" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }} />
            <YAxis stroke="#6A7282" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '12px',
                fontFamily: 'Arimo, sans-serif',
              }}
            />
            <Bar dataKey="count" fill="#F54900" radius={[10, 10, 0, 0]} name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
