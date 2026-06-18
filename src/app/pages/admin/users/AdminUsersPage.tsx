import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  Eye,
  MoreHorizontal,
  Ban,
  Mail,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    status: 'active',
    registrationDate: '2024-01-15',
    lastActive: '2 giờ trước',
    orders: 15,
    reviews: 8,
    ootdPosts: 12,
    reportedCount: 0,
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    status: 'suspended',
    registrationDate: '2024-02-20',
    lastActive: '1 ngày trước',
    orders: 8,
    reviews: 3,
    ootdPosts: 5,
    reportedCount: 2,
  },
  {
    id: 3,
    name: 'Lê Minh C',
    email: 'leminhc@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    status: 'active',
    registrationDate: '2023-11-05',
    lastActive: '30 phút trước',
    orders: 42,
    reviews: 25,
    ootdPosts: 31,
    reportedCount: 0,
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    status: 'banned',
    registrationDate: '2024-03-10',
    lastActive: '2 tuần trước',
    orders: 3,
    reviews: 1,
    ootdPosts: 2,
    reportedCount: 5,
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    status: 'inactive',
    registrationDate: '2023-08-22',
    lastActive: '3 tháng trước',
    orders: 7,
    reviews: 4,
    ootdPosts: 6,
    reportedCount: 0,
  },
  {
    id: 6,
    name: 'Võ Thị F',
    email: 'vothif@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    status: 'active',
    registrationDate: '2024-01-03',
    lastActive: '5 phút trước',
    orders: 23,
    reviews: 15,
    ootdPosts: 19,
    reportedCount: 0,
  },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-[#10B981]/10 text-[#10B981]' },
  inactive: { label: 'Inactive', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
  suspended: { label: 'Suspended', color: 'bg-[#F54900]/10 text-[#F54900]' },
  banned: { label: 'Banned', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
};

export default function AdminUsersPage() {
  const { v } = useLanguage();
  const statusLabel = (status: keyof typeof statusConfig) =>
    ({
      active: v('Active', 'Hoạt động'),
      inactive: v('Inactive', 'Không hoạt động'),
      suspended: v('Suspended', 'Tạm khóa'),
      banned: v('Banned', 'Bị cấm'),
    })[status];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === 'active').length,
    suspended: mockUsers.filter((u) => u.status === 'suspended').length,
    banned: mockUsers.filter((u) => u.status === 'banned').length,
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
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
            {v('User Management', 'Quản lý người dùng')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Manage all end users in the system', 'Quản lý tất cả end users trong hệ thống')}
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Button
            variant="outline"
            className="border-[#D1D5DC]"
            style={{
              height: '48px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '0 24px',
            }}
          >
            <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Export', 'Xuất dữ liệu')}
          </Button>
          <Link to="/admin/users/deleted">
            <Button
              variant="outline"
              className="border-[#D1D5DC]"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <AlertCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Deleted Accounts', 'Tài khoản đã xóa')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ gap: '24px' }}>
        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#3B82F6]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Users className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Total Users', 'Tổng người dùng')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.total.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#10B981]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <UserCheck className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Active Users', 'Người dùng hoạt động')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.active.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#F54900]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <UserX className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Suspended', 'Tạm khóa')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.suspended.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#E7000B]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Ban className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Banned Users', 'Người dùng bị cấm')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.banned.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="grid grid-cols-4" style={{ gap: '16px' }}>
          {/* Search */}
          <div className="col-span-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                style={{ width: '16px', height: '16px' }}
              />
              <Input
                placeholder={v('Search users...', 'Tìm kiếm người dùng...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Status', 'Trạng thái')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Status', 'Tất cả trạng thái')}</SelectItem>
                <SelectItem value="active">{v('Active', 'Hoạt động')}</SelectItem>
                <SelectItem value="inactive">{v('Inactive', 'Không hoạt động')}</SelectItem>
                <SelectItem value="suspended">{v('Suspended', 'Tạm khóa')}</SelectItem>
                <SelectItem value="banned">{v('Banned', 'Bị cấm')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Registration Date Filter */}
          <div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Registration Date', 'Ngày đăng ký')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Time', 'Tất cả thời gian')}</SelectItem>
                <SelectItem value="today">{v('Today', 'Hôm nay')}</SelectItem>
                <SelectItem value="week">{v('This Week', 'Tuần này')}</SelectItem>
                <SelectItem value="month">{v('This Month', 'Tháng này')}</SelectItem>
                <SelectItem value="year">{v('This Year', 'Năm nay')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Filter */}
          <div>
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Activity', 'Hoạt động')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Activity', 'Tất cả hoạt động')}</SelectItem>
                <SelectItem value="active_24h">{v('Active in 24h', 'Hoạt động trong 24h')}</SelectItem>
                <SelectItem value="active_7d">{v('Active in 7 days', 'Hoạt động trong 7 ngày')}</SelectItem>
                <SelectItem value="active_30d">{v('Active in 30 days', 'Hoạt động trong 30 ngày')}</SelectItem>
                <SelectItem value="inactive">{v('Inactive', 'Không hoạt động')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card
        className="bg-white"
        style={{ padding: '0', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('User', 'Người dùng')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Status', 'Trạng thái')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Registration', 'Ngày đăng ký')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Last Active', 'Hoạt động gần nhất')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Activity', 'Hoạt động')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Reports', 'Báo cáo')}
                </th>
                <th
                  className="text-right text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Actions', 'Thao tác')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center" style={{ gap: '12px' }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="bg-[#F3F4F6]"
                        style={{ width: '40px', height: '40px', borderRadius: '9999px' }}
                      />
                      <div>
                        <p
                          className="text-[#0A0A0A]"
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          {user.name}
                        </p>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Badge
                      className={statusConfig[user.status as keyof typeof statusConfig].color}
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '4px 12px',
                      }}
                    >
                      {statusLabel(user.status as keyof typeof statusConfig)}
                    </Badge>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {new Date(user.registrationDate).toLocaleDateString('vi-VN')}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {user.lastActive}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center" style={{ gap: '12px' }}>
                      <div className="flex items-center" style={{ gap: '4px' }}>
                        <span
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {user.orders} {v('orders', 'đơn hàng')}
                        </span>
                      </div>
                      <div className="flex items-center" style={{ gap: '4px' }}>
                        <span
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {user.ootdPosts} {v('posts', 'bài đăng')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {user.reportedCount > 0 ? (
                      <Badge
                        className="bg-[#E7000B]/10 text-[#E7000B]"
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 12px',
                        }}
                      >
                        {user.reportedCount} {v('reports', 'báo cáo')}
                      </Badge>
                    ) : (
                      <span
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('No reports', 'Không có báo cáo')}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center justify-end" style={{ gap: '8px' }}>
                      <Link to={`/admin/users/${user.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                          }}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          >
                            <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                            {v('Send Email', 'Gửi email')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Ban style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                            {v('Suspend User', 'Tạm khóa người dùng')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#E7000B]">
                            <Ban style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                            {v('Ban User', 'Cấm người dùng')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between bg-[#F9FAFB] border-t border-[#E5E7EB]"
          style={{ padding: '16px 24px' }}
        >
          <p
            className="text-[#6A7282]"
            style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Showing', 'Hiển thị')} {(currentPage - 1) * itemsPerPage + 1} {v('to', 'đến')}{' '}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} {v('of', 'trong')}{' '}
            {filteredUsers.length} {v('users', 'người dùng')}
          </p>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                height: '36px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              {v('Previous', 'Trước')}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? 'bg-[#0A0A0A] text-white'
                    : 'border-[#D1D5DC] text-[#0A0A0A]'
                }
                style={{
                  height: '36px',
                  width: '36px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '0',
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                height: '36px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              {v('Next', 'Sau')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}