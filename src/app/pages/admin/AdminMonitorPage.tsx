import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Activity,
  Users,
  ShoppingCart,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Package,
  Store,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock real-time data generator
const generateRealtimeData = () => {
  return {
    timestamp: new Date().toLocaleTimeString('vi-VN'),
    activeUsers: Math.floor(Math.random() * 1000) + 2000,
    currentOrders: Math.floor(Math.random() * 50) + 100,
    serverLoad: Math.floor(Math.random() * 30) + 40,
  };
};

export default function AdminMonitorPage() {
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [currentStats, setCurrentStats] = useState({
    activeUsers: 2543,
    currentOrders: 127,
    activeConnections: 3842,
    pendingOrders: 45,
  });

  const [serverStatus, setServerStatus] = useState({
    webServer: { status: 'healthy', responseTime: 142, uptime: 99.99 },
    database: { status: 'healthy', responseTime: 23, uptime: 99.98 },
    cache: { status: 'healthy', responseTime: 8, uptime: 100 },
    cdn: { status: 'healthy', responseTime: 35, uptime: 99.97 },
  });

  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 65,
    memory: 72,
    disk: 45,
    network: 58,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRealtimeData();
      setRealtimeData((prev) => {
        const updated = [...prev, newData];
        return updated.slice(-20); // Keep only last 20 data points
      });

      // Update current stats with slight variations
      setCurrentStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        currentOrders: Math.max(0, prev.currentOrders + Math.floor(Math.random() * 6) - 3),
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 50) - 25,
        pendingOrders: Math.max(0, prev.pendingOrders + Math.floor(Math.random() * 4) - 2),
      }));

      // Update system metrics
      setSystemMetrics({
        cpu: Math.min(100, Math.max(30, systemMetrics.cpu + Math.floor(Math.random() * 10) - 5)),
        memory: Math.min(100, Math.max(40, systemMetrics.memory + Math.floor(Math.random() * 8) - 4)),
        disk: Math.min(100, Math.max(40, systemMetrics.disk + Math.floor(Math.random() * 2) - 1)),
        network: Math.min(100, Math.max(30, systemMetrics.network + Math.floor(Math.random() * 12) - 6)),
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [systemMetrics.cpu, systemMetrics.memory, systemMetrics.disk, systemMetrics.network]);

  const recentActivities = [
    { id: 1, type: 'order', user: 'Nguyễn Văn A', action: 'đã đặt đơn hàng #15234', time: '2 giây trước' },
    { id: 2, type: 'user', user: 'Trần Thị B', action: 'đã đăng ký tài khoản', time: '5 giây trước' },
    { id: 3, type: 'order', user: 'Lê Minh C', action: 'đã thanh toán đơn hàng #15233', time: '8 giây trước' },
    { id: 4, type: 'brand', user: 'Zara Vietnam', action: 'đã thêm 5 sản phẩm mới', time: '12 giây trước' },
    { id: 5, type: 'order', user: 'Phạm Thị D', action: 'đã hủy đơn hàng #15232', time: '15 giây trước' },
  ];

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A0A0A]" style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', marginBottom: '8px' }}>
            Real-time Monitor
          </h1>
          <p className="text-[#4A5565]" style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}>
            Giám sát hoạt động hệ thống theo thời gian thực
          </p>
        </div>
        <Badge
          className="bg-[#10B981]/10 text-[#10B981]"
          style={{ borderRadius: '9999px', fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '8px 16px', gap: '8px' }}
        >
          <Activity style={{ width: '16px', height: '16px' }} className="animate-pulse" />
          Live
        </Badge>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-4" style={{ gap: '24px' }}>
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <div className="flex items-center justify-center bg-[#10B981]/10" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
              <Users className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
            </div>
            <Badge className="bg-[#10B981]/10 text-[#10B981]" style={{ borderRadius: '9999px', fontSize: '10px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 8px' }}>
              Online
            </Badge>
          </div>
          <div>
            <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
              Active Users
            </p>
            <h3 className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
              {currentStats.activeUsers.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>

        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <div className="flex items-center justify-center bg-[#F54900]/10" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
              <ShoppingCart className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
            </div>
            <Badge className="bg-[#F54900]/10 text-[#F54900]" style={{ borderRadius: '9999px', fontSize: '10px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 8px' }}>
              Processing
            </Badge>
          </div>
          <div>
            <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
              Current Orders
            </p>
            <h3 className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
              {currentStats.currentOrders.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>

        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <div className="flex items-center justify-center bg-[#3B82F6]/10" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
              <Wifi className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
            </div>
            <Badge className="bg-[#10B981]/10 text-[#10B981]" style={{ borderRadius: '9999px', fontSize: '10px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 8px' }}>
              Stable
            </Badge>
          </div>
          <div>
            <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
              Active Connections
            </p>
            <h3 className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
              {currentStats.activeConnections.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>

        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <div className="flex items-center justify-center bg-[#8B5CF6]/10" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
              <Package className="text-[#8B5CF6]" style={{ width: '24px', height: '24px' }} />
            </div>
            <Badge className="bg-[#F54900]/10 text-[#F54900]" style={{ borderRadius: '9999px', fontSize: '10px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 8px' }}>
              Pending
            </Badge>
          </div>
          <div>
            <p className="text-[#6A7282]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
              Pending Orders
            </p>
            <h3 className="text-[#0A0A0A]" style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
              {currentStats.pendingOrders.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-2" style={{ gap: '24px' }}>
        {/* Active Users Chart */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
              Active Users (Live)
            </h2>
            <Badge className="bg-[#10B981]/10 text-[#10B981]" style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 12px', gap: '4px' }}>
              <Activity style={{ width: '12px', height: '12px' }} className="animate-pulse" />
              Updating
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="timestamp" stroke="#6A7282" style={{ fontSize: '10px', fontFamily: 'Arimo, sans-serif' }} />
              <YAxis stroke="#6A7282" style={{ fontSize: '10px', fontFamily: 'Arimo, sans-serif' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
              <Area type="monotone" dataKey="activeUsers" stroke="#10B981" fill="#10B981" fillOpacity={0.15} name="Users" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Current Orders Chart */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
              Current Orders (Live)
            </h2>
            <Badge className="bg-[#F54900]/10 text-[#F54900]" style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 12px', gap: '4px' }}>
              <TrendingUp style={{ width: '12px', height: '12px' }} />
              Active
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="timestamp" stroke="#6A7282" style={{ fontSize: '10px', fontFamily: 'Arimo, sans-serif' }} />
              <YAxis stroke="#6A7282" style={{ fontSize: '10px', fontFamily: 'Arimo, sans-serif' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
              <Line type="monotone" dataKey="currentOrders" stroke="#F54900" strokeWidth={2} dot={false} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Server Status */}
      <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
        <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', marginBottom: '24px' }}>
          Server Status
        </h2>
        <div className="grid grid-cols-4" style={{ gap: '24px' }}>
          {/* Web Server */}
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: '12px' }}>
                <Server className="text-[#0A0A0A]" style={{ width: '20px', height: '20px' }} />
                <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                  Web Server
                </span>
              </div>
              <CheckCircle className="text-[#10B981]" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex justify-between">
                <span className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>Response</span>
                <span className="text-[#0A0A0A]" style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{serverStatus.webServer.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>Uptime</span>
                <span className="text-[#0A0A0A]" style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{serverStatus.webServer.uptime}%</span>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: '12px' }}>
                <HardDrive className="text-[#0A0A0A]" style={{ width: '20px', height: '20px' }} />
                <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                  Database
                </span>
              </div>
              <CheckCircle className="text-[#10B981]" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex justify-between">
                <span className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>Response</span>
                <span className="text-[#0A0A0A]" style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{serverStatus.database.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>Uptime</span>
                <span className="text-[#0A0A0A]" style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{serverStatus.database.uptime}%</span>
              </div>
            </div>
          </div>

          {/* Cache */}
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: '12px' }}>
                <Cpu className="text-[#0A0A0A]" style={{ width: '20px', height: '20px' }} />
                <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                  Cache
                </span>
              </div>
              <CheckCircle className="text-[#10B981]" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex justify-between">
                <span className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>Response</span>
                <span className="text-[#0A0A0A]" style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{serverStatus.cache.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>Uptime</span>
                <span className="text-[#0A0A0A]" style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{serverStatus.cache.uptime}%</span>
              </div>
            </div>
          </div>

          {/* CDN */}
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: '12px' }}>
                <Wifi className="text-[#0A0A0A]" style={{ width: '20px', height: '20px' }} />
                <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
                  CDN
                </span>
              </div>
              <CheckCircle className="text-[#10B981]" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex justify-between">
                <span className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>Response</span>
                <span className="text-[#0A0A0A]" style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{serverStatus.cdn.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>Uptime</span>
                <span className="text-[#0A0A0A]" style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{serverStatus.cdn.uptime}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* System Metrics & Recent Activity */}
      <div className="grid grid-cols-2" style={{ gap: '24px' }}>
        {/* System Metrics */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', marginBottom: '24px' }}>
            System Metrics
          </h2>
          <div className="flex flex-col" style={{ gap: '20px' }}>
            {/* CPU */}
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Cpu className="text-[#0A0A0A]" style={{ width: '16px', height: '16px' }} />
                  <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>CPU</span>
                </div>
                <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{systemMetrics.cpu}%</span>
              </div>
              <div className="w-full bg-[#F3F4F6] h-2" style={{ borderRadius: '9999px' }}>
                <div
                  className="bg-[#6366F1] h-2 transition-all duration-500"
                  style={{ width: `${systemMetrics.cpu}%`, borderRadius: '9999px' }}
                />
              </div>
            </div>

            {/* Memory */}
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Server className="text-[#0A0A0A]" style={{ width: '16px', height: '16px' }} />
                  <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>Memory</span>
                </div>
                <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{systemMetrics.memory}%</span>
              </div>
              <div className="w-full bg-[#F3F4F6] h-2" style={{ borderRadius: '9999px' }}>
                <div
                  className="bg-[#F54900] h-2 transition-all duration-500"
                  style={{ width: `${systemMetrics.memory}%`, borderRadius: '9999px' }}
                />
              </div>
            </div>

            {/* Disk */}
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <HardDrive className="text-[#0A0A0A]" style={{ width: '16px', height: '16px' }} />
                  <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>Disk</span>
                </div>
                <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{systemMetrics.disk}%</span>
              </div>
              <div className="w-full bg-[#F3F4F6] h-2" style={{ borderRadius: '9999px' }}>
                <div
                  className="bg-[#10B981] h-2 transition-all duration-500"
                  style={{ width: `${systemMetrics.disk}%`, borderRadius: '9999px' }}
                />
              </div>
            </div>

            {/* Network */}
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Wifi className="text-[#0A0A0A]" style={{ width: '16px', height: '16px' }} />
                  <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>Network</span>
                </div>
                <span className="text-[#0A0A0A]" style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>{systemMetrics.network}%</span>
              </div>
              <div className="w-full bg-[#F3F4F6] h-2" style={{ borderRadius: '9999px' }}>
                <div
                  className="bg-[#4A5565] h-2 transition-all duration-500"
                  style={{ width: `${systemMetrics.network}%`, borderRadius: '9999px' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <h2 className="text-[#0A0A0A]" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}>
              Recent Activity
            </h2>
            <Badge className="bg-[#10B981]/10 text-[#10B981]" style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif', padding: '4px 12px', gap: '4px' }}>
              <Clock style={{ width: '12px', height: '12px' }} />
              Live
            </Badge>
          </div>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start bg-[#F9FAFB]"
                style={{ padding: '12px', borderRadius: '10px', gap: '12px' }}
              >
                <div className="flex items-center justify-center bg-white" style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0 }}>
                  {activity.type === 'order' && <ShoppingCart className="text-[#0A0A0A]" style={{ width: '16px', height: '16px' }} />}
                  {activity.type === 'user' && <Users className="text-[#10B981]" style={{ width: '16px', height: '16px' }} />}
                  {activity.type === 'brand' && <Store className="text-[#F54900]" style={{ width: '16px', height: '16px' }} />}
                </div>
                <div className="flex-1">
                  <p className="text-[#0A0A0A]" style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', marginBottom: '4px' }}>
                    <strong>{activity.user}</strong> {activity.action}
                  </p>
                  <p className="text-[#6A7282]" style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}