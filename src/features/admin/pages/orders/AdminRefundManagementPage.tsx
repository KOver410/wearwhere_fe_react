import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Search,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const mockRefunds = [
  { id: 'REF-001', orderId: 'ORD-2024-006', customer: 'Nguyen Thi F', brand: 'COS', amount: 1950000, reason: 'Dispute resolved', status: 'pending', requestDate: '2024-02-14', processedDate: null, method: 'original' },
  { id: 'REF-002', orderId: 'ORD-2024-005', customer: 'Hoang Van E', brand: 'Zara', amount: 1800000, reason: 'Order cancelled', status: 'processing', requestDate: '2024-02-13', processedDate: null, method: 'original' },
  { id: 'REF-003', orderId: 'ORD-2024-012', customer: 'Tran Van K', brand: 'H&M', amount: 890000, reason: 'Wrong size', status: 'completed', requestDate: '2024-02-10', processedDate: '2024-02-12', method: 'original' },
  { id: 'REF-004', orderId: 'ORD-2024-018', customer: 'Pham Thi L', brand: 'Mango', amount: 650000, reason: 'Quality issues', status: 'pending', requestDate: '2024-02-14', processedDate: null, method: 'bank' },
  { id: 'REF-005', orderId: 'ORD-2024-021', customer: 'Le Thi H', brand: 'Uniqlo', amount: 2400000, reason: 'Damaged product', status: 'processing', requestDate: '2024-02-13', processedDate: null, method: 'original' },
  { id: 'REF-006', orderId: 'ORD-2024-024', customer: 'Nguyen Van M', brand: 'COS', amount: 1250000, reason: 'Missing items', status: 'completed', requestDate: '2024-02-09', processedDate: '2024-02-11', method: 'wallet' },
  { id: 'REF-007', orderId: 'ORD-2024-027', customer: 'Tran Thi N', brand: 'H&M', amount: 980000, reason: 'Color mismatch', status: 'rejected', requestDate: '2024-02-11', processedDate: '2024-02-13', method: 'original' },
  { id: 'REF-008', orderId: 'ORD-2024-030', customer: 'Le Van O', brand: 'Zara', amount: 1150000, reason: 'Late delivery', status: 'completed', requestDate: '2024-02-08', processedDate: '2024-02-10', method: 'original' },
];

const statusConfig = {
  pending: { label: 'Pending Approval', color: 'bg-[#F54900]/10 text-[#F54900]', icon: AlertCircle },
  processing: { label: 'Processing', color: 'bg-[#F59E0B]/10 text-[#F59E0B]', icon: Clock },
  completed: { label: 'Completed', color: 'bg-[#10B981]/10 text-[#10B981]', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-[#6A7282]/10 text-[#6A7282]', icon: XCircle },
};

const methodConfig = {
  original: 'Original Payment Method',
  bank: 'Bank Transfer',
  wallet: 'Platform Wallet',
};

export default function AdminRefundManagementPage() {
  const [refunds, setRefunds] = useState(mockRefunds);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter refunds
  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
  const paginatedRefunds = filteredRefunds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: refunds.length,
    pending: refunds.filter((r) => r.status === 'pending').length,
    processing: refunds.filter((r) => r.status === 'processing').length,
    totalAmount: refunds
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  const handleApprove = () => {
    setRefunds(
      refunds.map((r) =>
        r.id === selectedRefund?.id ? { ...r, status: 'processing' } : r
      )
    );
    setApproveModalOpen(false);
    setSelectedRefund(null);
    toast.success('Refund approved and processing');
  };

  const handleReject = () => {
    setRefunds(
      refunds.map((r) =>
        r.id === selectedRefund?.id ? { ...r, status: 'rejected' } : r
      )
    );
    setRejectModalOpen(false);
    setSelectedRefund(null);
    toast.success('Refund rejected');
  };

  const handleExport = () => {
    const csv = refunds
      .map((r) => `${r.id},${r.orderId},${r.customer},${r.brand},${r.amount},${r.status},${r.reason}`)
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refunds.csv';
    a.click();
    toast.success('Refunds exported');
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
            Refund Management
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Quản lý và theo dõi refunds
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/orders/disputes">
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
              View Disputes
            </Button>
          </Link>
          <Link to="/admin/orders">
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
              Back to Orders
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
              className="flex items-center justify-center bg-[#F3F4F6]"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <TrendingDown className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              Total Refunds
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.total}
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
              <AlertCircle className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              Pending Approval
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
              className="flex items-center justify-center bg-[#F59E0B]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Clock className="text-[#F59E0B]" style={{ width: '24px', height: '24px' }} />
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
              Processing
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.processing}
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
              <DollarSign className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
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
              Total Refunded
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(stats.totalAmount / 1000000).toFixed(1)}M
            </h3>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="grid grid-cols-3" style={{ gap: '16px' }}>
          {/* Search */}
          <div className="col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                style={{ width: '16px', height: '16px' }}
              />
              <Input
                placeholder="Search by refund ID, order ID, customer..."
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
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end" style={{ marginTop: '16px' }}>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-[#D1D5DC]"
            style={{
              height: '40px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
            }}
          >
            <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Refunds Table */}
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
                  Refund ID
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
                  Order ID
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
                  Customer
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
                  Brand
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
                  Amount
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
                  Reason
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
                  Method
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
                  Status
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
                  Request Date
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRefunds.map((refund) => (
                <tr key={refund.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {refund.id}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Link to={`/admin/orders/${refund.orderId}`}>
                      <p
                        className="text-[#0A0A0A] hover:underline"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {refund.orderId}
                      </p>
                    </Link>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {refund.customer}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {refund.brand}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {refund.amount.toLocaleString('vi-VN')}đ
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {refund.reason}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {methodConfig[refund.method as keyof typeof methodConfig]}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Badge
                      className={statusConfig[refund.status as keyof typeof statusConfig].color}
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '6px 12px',
                      }}
                    >
                      {statusConfig[refund.status as keyof typeof statusConfig].label}
                    </Badge>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {new Date(refund.requestDate).toLocaleDateString('vi-VN')}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center justify-end" style={{ gap: '8px' }}>
                      {refund.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => {
                              setSelectedRefund(refund);
                              setRejectModalOpen(true);
                            }}
                            variant="ghost"
                            size="sm"
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          >
                            <XCircle
                              className="text-[#E7000B]"
                              style={{ width: '16px', height: '16px' }}
                            />
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedRefund(refund);
                              setApproveModalOpen(true);
                            }}
                            variant="ghost"
                            size="sm"
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          >
                            <CheckCircle
                              className="text-[#10B981]"
                              style={{ width: '16px', height: '16px' }}
                            />
                          </Button>
                        </>
                      )}
                      <Link to={`/admin/orders/${refund.orderId}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                          }}
                        >
                          <ExternalLink
                            className="text-[#0A0A0A]"
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Button>
                      </Link>
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredRefunds.length)} of{' '}
            {filteredRefunds.length} refunds
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
              Previous
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
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Approve Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent style={{ maxWidth: '500px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              Approve Refund
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              Approve this refund and start processing
            </DialogDescription>
          </DialogHeader>
          {selectedRefund && (
            <div className="flex flex-col" style={{ gap: '16px', marginTop: '24px' }}>
              <div className="bg-[#F9FAFB]" style={{ padding: '16px', borderRadius: '10px' }}>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Refund ID
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedRefund.id}
                  </p>
                </div>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Customer
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {selectedRefund.customer}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Amount
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedRefund.amount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
              >
                This refund will be processed to the customer's{' '}
                {methodConfig[selectedRefund.method as keyof typeof methodConfig].toLowerCase()}.
              </p>
            </div>
          )}
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => {
                setApproveModalOpen(false);
                setSelectedRefund(null);
              }}
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-[#10B981] text-white hover:bg-[#10B981]/90"
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
              Approve & Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent style={{ maxWidth: '500px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              Reject Refund
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              Reject this refund request
            </DialogDescription>
          </DialogHeader>
          {selectedRefund && (
            <div className="flex flex-col" style={{ gap: '16px', marginTop: '24px' }}>
              <div className="bg-[#F9FAFB]" style={{ padding: '16px', borderRadius: '10px' }}>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Refund ID
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedRefund.id}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Customer
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {selectedRefund.customer}
                  </p>
                </div>
              </div>
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
              >
                The customer will be notified that their refund request has been rejected.
              </p>
            </div>
          )}
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => {
                setRejectModalOpen(false);
                setSelectedRefund(null);
              }}
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
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
              <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Reject Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
