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
  Download,
  AlertTriangle,
  Trash2,
  Eye,
  UserX,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockDeletedAccounts = [
  {
    id: 1,
    name: 'Nguyễn Văn X',
    email: 'nguyenvanx@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=x',
    requestDate: '2024-02-10',
    deletionDate: '2024-02-17',
    reason: 'User requested account deletion',
    status: 'pending',
    stats: {
      orders: 5,
      reviews: 3,
      posts: 4,
    },
  },
  {
    id: 2,
    name: 'Trần Thị Y',
    email: 'tranthiy@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=y',
    requestDate: '2024-02-08',
    deletionDate: '2024-02-15',
    reason: 'Privacy concerns',
    status: 'approved',
    stats: {
      orders: 12,
      reviews: 7,
      posts: 9,
    },
  },
  {
    id: 3,
    name: 'Lê Minh Z',
    email: 'leminhz@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=z',
    requestDate: '2024-02-05',
    deletionDate: null,
    reason: 'Account inactivity',
    status: 'rejected',
    stats: {
      orders: 0,
      reviews: 0,
      posts: 1,
    },
  },
  {
    id: 4,
    name: 'Phạm Thị W',
    email: 'phamthiw@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=w',
    requestDate: '2024-01-30',
    deletionDate: '2024-02-06',
    reason: 'Switching to another platform',
    status: 'completed',
    stats: {
      orders: 8,
      reviews: 5,
      posts: 6,
    },
  },
];

const statusConfig = {
  pending: { label: 'Pending Review', color: 'bg-[#F54900]/10 text-[#F54900]', icon: AlertTriangle },
  approved: { label: 'Approved', color: 'bg-[#10B981]/10 text-[#10B981]', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-[#E7000B]/10 text-[#E7000B]', icon: XCircle },
  completed: { label: 'Deleted', color: 'bg-[#6A7282]/10 text-[#6A7282]', icon: Trash2 },
};

export default function AdminDeletedAccountsPage() {
  const { v } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter accounts
  const filteredAccounts = mockDeletedAccounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    pending: mockDeletedAccounts.filter((a) => a.status === 'pending').length,
    approved: mockDeletedAccounts.filter((a) => a.status === 'approved').length,
    completed: mockDeletedAccounts.filter((a) => a.status === 'completed').length,
    rejected: mockDeletedAccounts.filter((a) => a.status === 'rejected').length,
  };

  const statusLabels: Record<string, string> = {
    pending: v('Pending Review', 'Chờ duyệt'),
    approved: v('Approved', 'Đã duyệt'),
    rejected: v('Rejected', 'Từ chối'),
    completed: v('Deleted', 'Đã xóa'),
  };

  const handleApprove = () => {
    toast.success(v('Account deletion request approved', 'Đã duyệt yêu cầu xóa tài khoản'));
    setReviewModalOpen(false);
  };

  const handleReject = () => {
    toast.success(v('Account deletion request rejected', 'Đã từ chối yêu cầu xóa tài khoản'));
    setReviewModalOpen(false);
  };

  const handleReview = (account: any) => {
    setSelectedAccount(account);
    setReviewModalOpen(true);
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
            {v('Deleted Accounts', 'Tài khoản đã xóa')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Quản lý yêu cầu xóa tài khoản và lịch sử xóa
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/users">
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
              {v('Back to Users', 'Quay lại Người dùng')}
            </Button>
          </Link>
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
            {v('Export', 'Xuất')}
          </Button>
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
              className="flex items-center justify-center bg-[#F54900]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <AlertTriangle className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              {v('Pending Review', 'Chờ duyệt')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.pending}
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
              <CheckCircle className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
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
              {v('Approved', 'Đã duyệt')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.approved}
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#6A7282]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Trash2 className="text-[#6A7282]" style={{ width: '24px', height: '24px' }} />
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
              {v('Completed', 'Hoàn tất')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.completed}
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
              <XCircle className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
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
              {v('Rejected', 'Từ chối')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.rejected}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="grid grid-cols-2" style={{ gap: '16px' }}>
          {/* Search */}
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                style={{ width: '16px', height: '16px' }}
              />
              <Input
                placeholder={v('Search accounts...', 'Tìm kiếm tài khoản...')}
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
                <SelectItem value="pending">{v('Pending Review', 'Chờ duyệt')}</SelectItem>
                <SelectItem value="approved">{v('Approved', 'Đã duyệt')}</SelectItem>
                <SelectItem value="rejected">{v('Rejected', 'Từ chối')}</SelectItem>
                <SelectItem value="completed">{v('Completed', 'Hoàn tất')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Accounts Table */}
      <Card
        className="bg-white"
        style={{
          padding: '0',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
        }}
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
                  {v('Request Date', 'Ngày yêu cầu')}
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
                  {v('Deletion Date', 'Ngày xóa')}
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
                  {v('Reason', 'Lý do')}
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
                  {v('Status', 'Trạng thái')}
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
              {paginatedAccounts.map((account) => {
                const StatusIcon = statusConfig[account.status as keyof typeof statusConfig].icon;
                return (
                  <tr key={account.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center" style={{ gap: '12px' }}>
                        <img
                          src={account.avatar}
                          alt={account.name}
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
                            {account.name}
                          </p>
                          <p
                            className="text-[#6A7282]"
                            style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                          >
                            {account.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <Calendar
                          className="text-[#6A7282]"
                          style={{ width: '14px', height: '14px' }}
                        />
                        <p
                          className="text-[#0A0A0A]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {new Date(account.requestDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {account.deletionDate ? (
                        <p
                          className="text-[#0A0A0A]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {new Date(account.deletionDate).toLocaleDateString('vi-VN')}
                        </p>
                      ) : (
                        <span
                          className="text-[#6A7282]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          -
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {account.reason}
                      </p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center" style={{ gap: '12px' }}>
                        <span
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {account.stats.orders} {v('orders', 'đơn hàng')}
                        </span>
                        <span
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          {account.stats.posts} {v('posts', 'bài đăng')}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <Badge
                        className={
                          statusConfig[account.status as keyof typeof statusConfig].color
                        }
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 12px',
                          gap: '4px',
                        }}
                      >
                        <StatusIcon style={{ width: '12px', height: '12px' }} />
                        {statusLabels[account.status]}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center justify-end" style={{ gap: '8px' }}>
                        {account.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleReview(account)}
                            className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                            style={{
                              height: '36px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontFamily: 'Arimo, sans-serif',
                            }}
                          >
                            <Eye style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                            {v('Review', 'Xem xét')}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} {v('of', 'trên')}{' '}
            {filteredAccounts.length} {v('requests', 'yêu cầu')}
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
              {v('Next', 'Tiếp')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent style={{ maxWidth: '600px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              {v('Review Account Deletion Request', 'Xem xét yêu cầu xóa tài khoản')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v(
                "Please review the user's deletion request carefully before making a decision.",
                'Vui lòng xem xét kỹ yêu cầu xóa của người dùng trước khi đưa ra quyết định.'
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="flex flex-col" style={{ gap: '24px', marginTop: '24px' }}>
              {/* User Info */}
              <div className="flex items-center" style={{ gap: '16px' }}>
                <img
                  src={selectedAccount.avatar}
                  alt={selectedAccount.name}
                  className="bg-[#F3F4F6]"
                  style={{ width: '64px', height: '64px', borderRadius: '14px' }}
                />
                <div>
                  <h3
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    {selectedAccount.name}
                  </h3>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {selectedAccount.email}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div
                className="bg-[#F9FAFB]"
                style={{ padding: '16px', borderRadius: '10px', gap: '12px', display: 'flex', flexDirection: 'column' }}
              >
                <div className="flex justify-between">
                  <span
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Request Date:', 'Ngày yêu cầu:')}
                  </span>
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {new Date(selectedAccount.requestDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Reason:', 'Lý do:')}
                  </span>
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedAccount.reason}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Total Orders:', 'Tổng đơn hàng:')}
                  </span>
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedAccount.stats.orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Total Reviews:', 'Tổng đánh giá:')}
                  </span>
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedAccount.stats.reviews}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Total Posts:', 'Tổng bài đăng:')}
                  </span>
                  <span
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedAccount.stats.posts}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div
                className="flex items-start bg-[#E7000B]/10 border border-[#E7000B]/20"
                style={{ padding: '16px', borderRadius: '10px', gap: '12px' }}
              >
                <AlertTriangle className="text-[#E7000B]" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                <div>
                  <p
                    className="text-[#E7000B]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    {v('Warning: This action cannot be undone', 'Cảnh báo: Hành động này không thể hoàn tác')}
                  </p>
                  <p
                    className="text-[#E7000B]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v(
                      'Once approved, all user data including orders, reviews, and posts will be permanently deleted after 7 days.',
                      'Sau khi duyệt, toàn bộ dữ liệu người dùng bao gồm đơn hàng, đánh giá và bài đăng sẽ bị xóa vĩnh viễn sau 7 ngày.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter style={{ marginTop: '24px', gap: '12px' }}>
            <Button
              variant="outline"
              onClick={handleReject}
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
              <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Reject', 'Từ chối')}
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-[#E7000B] text-white hover:bg-[#E7000B]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <CheckCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Approve Deletion', 'Duyệt xóa')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
