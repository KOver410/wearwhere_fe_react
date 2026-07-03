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
  Search,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Flag,
  Shield,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

// Mock data
const mockReportedProducts = [
  {
    id: 1,
    productId: 156,
    name: 'Áo Sơ Mi Giả Hàng Hiệu',
    brand: 'Unknown Seller',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    reportCount: 8,
    reportReasons: [
      { reason: 'Fake Product', count: 5 },
      { reason: 'Misleading Information', count: 3 },
    ],
    status: 'pending',
    reportDate: '2024-02-14',
    description: 'Sản phẩm có logo giả mạo thương hiệu nổi tiếng',
  },
  {
    id: 2,
    productId: 287,
    name: 'Quần Jean Không Đúng Mô Tả',
    brand: 'Fashion Store',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    reportCount: 5,
    reportReasons: [
      { reason: 'Misleading Information', count: 4 },
      { reason: 'Poor Quality', count: 1 },
    ],
    status: 'pending',
    reportDate: '2024-02-13',
    description: 'Hình ảnh không khớp với sản phẩm thực tế',
  },
  {
    id: 3,
    productId: 423,
    name: 'Giày Nike Fake',
    brand: 'Fake Store',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    reportCount: 12,
    reportReasons: [
      { reason: 'Fake Product', count: 10 },
      { reason: 'Policy Violation', count: 2 },
    ],
    status: 'under_review',
    reportDate: '2024-02-12',
    description: 'Sản phẩm giả mạo thương hiệu Nike',
  },
  {
    id: 4,
    productId: 198,
    name: 'Váy Vi Phạm Chính Sách',
    brand: 'TrendyShop',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    reportCount: 3,
    reportReasons: [
      { reason: 'Policy Violation', count: 2 },
      { reason: 'Inappropriate Content', count: 1 },
    ],
    status: 'resolved',
    reportDate: '2024-02-10',
    description: 'Hình ảnh không phù hợp với chính sách nền tảng',
    resolution: 'Product suspended and seller warned',
  },
];

const statusConfig = {
  pending: { label: 'Pending Review', color: 'bg-[#F54900]/10 text-[#F54900]', icon: AlertTriangle },
  under_review: { label: 'Under Review', color: 'bg-[#6366F1]/10 text-[#6366F1]', icon: Shield },
  resolved: { label: 'Resolved', color: 'bg-[#10B981]/10 text-[#10B981]', icon: CheckCircle },
  dismissed: { label: 'Dismissed', color: 'bg-[#6A7282]/10 text-[#6A7282]', icon: XCircle },
};

const reasonColors: Record<string, string> = {
  'Fake Product': 'bg-[#E7000B]/10 text-[#E7000B]',
  'Misleading Information': 'bg-[#F54900]/10 text-[#F54900]',
  'Poor Quality': 'bg-[#6A7282]/10 text-[#6A7282]',
  'Policy Violation': 'bg-[#0A0A0A]/10 text-[#0A0A0A]',
  'Inappropriate Content': 'bg-[#E7000B]/10 text-[#E7000B]',
};

export default function AdminReportedProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter reports
  const filteredReports = mockReportedProducts.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesReason =
      reasonFilter === 'all' ||
      report.reportReasons.some((r) => r.reason === reasonFilter);
    return matchesSearch && matchesStatus && matchesReason;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    pending: mockReportedProducts.filter((r) => r.status === 'pending').length,
    underReview: mockReportedProducts.filter((r) => r.status === 'under_review').length,
    resolved: mockReportedProducts.filter((r) => r.status === 'resolved').length,
    total: mockReportedProducts.length,
  };

  const handleReview = (report: any) => {
    setSelectedReport(report);
    setReviewModalOpen(true);
  };

  const handleTakeAction = (action: 'suspend' | 'remove' | 'dismiss') => {
    toast.success(`Product ${action}ed successfully`);
    setReviewModalOpen(false);
    setActionNote('');
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
            <h1
              className="text-[#0A0A0A]"
              style={{
                fontSize: '36px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              Reported Products
            </h1>
            <Badge
              className="bg-[#E7000B]/10 text-[#E7000B]"
              style={{
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '6px 16px',
              }}
            >
              {stats.pending} Pending
            </Badge>
          </div>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Xem xét và xử lý các sản phẩm bị báo cáo
          </p>
        </div>
        <Link to="/admin/products">
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
            Back to Products
          </Button>
        </Link>
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
              Pending Review
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
              className="flex items-center justify-center bg-[#6366F1]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Shield className="text-[#6366F1]" style={{ width: '24px', height: '24px' }} />
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
              Under Review
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.underReview}
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
              Resolved
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.resolved}
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
              <Flag className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
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
              Total Reports
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.total}
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
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                style={{ width: '16px', height: '16px' }}
              />
              <Input
                placeholder="Search products..."
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
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason Filter */}
          <div>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder="Report Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="Fake Product">Fake Product</SelectItem>
                <SelectItem value="Misleading Information">Misleading Information</SelectItem>
                <SelectItem value="Poor Quality">Poor Quality</SelectItem>
                <SelectItem value="Policy Violation">Policy Violation</SelectItem>
                <SelectItem value="Inappropriate Content">Inappropriate Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="flex flex-col" style={{ gap: '16px' }}>
        {paginatedReports.map((report) => {
          const StatusIcon = statusConfig[report.status as keyof typeof statusConfig].icon;
          return (
            <Card
              key={report.id}
              className="bg-white"
              style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
            >
              <div className="flex items-start" style={{ gap: '24px' }}>
                {/* Product Image */}
                <img
                  src={report.image}
                  alt={report.name}
                  className="bg-[#F3F4F6]"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />

                {/* Report Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between" style={{ marginBottom: '12px' }}>
                    <div>
                      <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
                        <h3
                          className="text-[#0A0A0A]"
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            fontFamily: 'Arimo, sans-serif',
                          }}
                        >
                          {report.name}
                        </h3>
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
                          <Flag style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                          {report.reportCount} reports
                        </Badge>
                      </div>
                      <div className="flex items-center" style={{ gap: '16px', marginBottom: '12px' }}>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          Brand: <span className="text-[#0A0A0A] font-bold">{report.brand}</span>
                        </p>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          Product ID: #{report.productId}
                        </p>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          Reported: {new Date(report.reportDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <p
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Arimo, sans-serif',
                          marginBottom: '16px',
                        }}
                      >
                        {report.description}
                      </p>
                    </div>
                    <Badge
                      className={statusConfig[report.status as keyof typeof statusConfig].color}
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '6px 12px',
                        gap: '4px',
                      }}
                    >
                      <StatusIcon style={{ width: '14px', height: '14px' }} />
                      {statusConfig[report.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>

                  {/* Report Reasons */}
                  <div className="flex items-center" style={{ gap: '8px', marginBottom: '16px' }}>
                    <span
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      Reasons:
                    </span>
                    {report.reportReasons.map((reason: any) => (
                      <Badge
                        key={reason.reason}
                        className={reasonColors[reason.reason] || 'bg-[#F3F4F6] text-[#0A0A0A]'}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 12px',
                        }}
                      >
                        {reason.reason} ({reason.count})
                      </Badge>
                    ))}
                  </div>

                  {/* Resolution */}
                  {report.resolution && (
                    <div
                      className="bg-[#10B981]/10 border border-[#10B981]/20"
                      style={{ padding: '12px', borderRadius: '8px', marginBottom: '16px' }}
                    >
                      <p
                        className="text-[#10B981]"
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          marginBottom: '4px',
                        }}
                      >
                        Resolution:
                      </p>
                      <p
                        className="text-[#0A0A0A]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {report.resolution}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {report.status === 'pending' && (
                    <div className="flex items-center" style={{ gap: '12px' }}>
                      <Button
                        size="sm"
                        onClick={() => handleReview(report)}
                        className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                        style={{
                          height: '36px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        <Eye style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                        Review & Take Action
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#D1D5DC]"
                        style={{
                          height: '36px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        View Product Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      <Card
        className="bg-white"
        style={{ padding: '16px 24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="flex items-center justify-between">
          <p
            className="text-[#6A7282]"
            style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
          >
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredReports.length)} of{' '}
            {filteredReports.length} reports
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

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent style={{ maxWidth: '700px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              Review Reported Product
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              Review the report details and take appropriate action
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="flex flex-col" style={{ gap: '24px', marginTop: '24px' }}>
              {/* Product Info */}
              <div className="flex items-start" style={{ gap: '16px' }}>
                <img
                  src={selectedReport.image}
                  alt={selectedReport.name}
                  className="bg-[#F3F4F6]"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
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
                    {selectedReport.name}
                  </h3>
                  <p
                    className="text-[#6A7282]"
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '8px',
                    }}
                  >
                    Brand: {selectedReport.brand} | Product ID: #{selectedReport.productId}
                  </p>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    {selectedReport.reportReasons.map((reason: any) => (
                      <Badge
                        key={reason.reason}
                        className={reasonColors[reason.reason] || 'bg-[#F3F4F6] text-[#0A0A0A]'}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 12px',
                        }}
                      >
                        {reason.reason} ({reason.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Note */}
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  Action Note (Optional)
                </Label>
                <Textarea
                  placeholder="Add notes about your decision..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="border-[#D1D5DC]"
                  style={{
                    minHeight: '100px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
              </div>

              {/* Warning */}
              <div
                className="flex items-start bg-[#F54900]/10 border border-[#F54900]/20"
                style={{ padding: '16px', borderRadius: '10px', gap: '12px' }}
              >
                <AlertTriangle
                  className="text-[#F54900]"
                  style={{ width: '20px', height: '20px', flexShrink: 0 }}
                />
                <div>
                  <p
                    className="text-[#F54900]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    Important
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    Suspending or removing a product will affect the brand's account. Make sure to
                    review all evidence carefully.
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter style={{ marginTop: '24px', gap: '12px' }}>
            <Button
              variant="outline"
              onClick={() => handleTakeAction('dismiss')}
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
              Dismiss Report
            </Button>
            <Button
              onClick={() => handleTakeAction('suspend')}
              className="bg-[#F54900] text-white hover:bg-[#F54900]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <AlertTriangle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Suspend Product
            </Button>
            <Button
              onClick={() => handleTakeAction('remove')}
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
              <Flag style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Remove Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}