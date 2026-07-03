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
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Building,
} from 'lucide-react';

// Mock data
const mockApplications = [
  {
    id: 1,
    brandName: 'StyleCo Fashion',
    businessName: 'StyleCo Vietnam Ltd.',
    email: 'contact@styleco.vn',
    phone: '+84 901 234 567',
    status: 'pending',
    submittedDate: '2024-02-14',
    businessType: 'Company',
    requestedTier: 'business',
    documents: {
      businessLicense: true,
      taxDocument: true,
      identityCard: true,
    },
    description: 'Chúng tôi là thương hiệu thời trang Việt Nam với 5 năm kinh nghiệm...',
  },
  {
    id: 2,
    brandName: 'Urban Street',
    businessName: 'Urban Street Co.',
    email: 'hello@urbanstreet.vn',
    phone: '+84 902 345 678',
    status: 'under_review',
    submittedDate: '2024-02-13',
    businessType: 'Company',
    requestedTier: 'starter',
    documents: {
      businessLicense: true,
      taxDocument: true,
      identityCard: true,
    },
    description: 'Streetwear brand focusing on Vietnamese youth culture...',
  },
  {
    id: 3,
    brandName: 'Luxury Boutique',
    businessName: 'Luxury Boutique International',
    email: 'info@luxuryboutique.vn',
    phone: '+84 903 456 789',
    status: 'pending',
    submittedDate: '2024-02-12',
    businessType: 'Individual',
    requestedTier: 'premium',
    documents: {
      businessLicense: true,
      taxDocument: false,
      identityCard: true,
    },
    description: 'High-end fashion boutique specializing in designer brands...',
  },
  {
    id: 4,
    brandName: 'EcoWear',
    businessName: 'EcoWear Sustainable Fashion',
    email: 'team@ecowear.vn',
    phone: '+84 904 567 890',
    status: 'approved',
    submittedDate: '2024-02-10',
    businessType: 'Company',
    requestedTier: 'business',
    documents: {
      businessLicense: true,
      taxDocument: true,
      identityCard: true,
    },
    description: 'Sustainable fashion brand using eco-friendly materials...',
    reviewNote: 'All documents verified. Approved for Business tier.',
  },
  {
    id: 5,
    brandName: 'Teen Fashion Hub',
    businessName: 'Teen Fashion Hub',
    email: 'contact@teenhub.vn',
    phone: '+84 905 678 901',
    status: 'rejected',
    submittedDate: '2024-02-09',
    businessType: 'Individual',
    requestedTier: 'starter',
    documents: {
      businessLicense: false,
      taxDocument: false,
      identityCard: true,
    },
    description: 'Fashion for teenagers...',
    reviewNote: 'Incomplete documents. Business license required.',
  },
];

const statusConfig = {
  pending: { label: 'Pending Review', color: 'bg-[#F54900]/10 text-[#F54900]', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-[#0A0A0A]/10 text-[#0A0A0A]', icon: Eye },
  approved: { label: 'Approved', color: 'bg-[#10B981]/10 text-[#10B981]', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-[#E7000B]/10 text-[#E7000B]', icon: XCircle },
};

const tierConfig = {
  starter: { label: 'Starter', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
  business: { label: 'Business', color: 'bg-[#10B981]/10 text-[#10B981]' },
  premium: { label: 'Premium', color: 'bg-[#F54900]/10 text-[#F54900]' },
};

export default function AdminBrandApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter applications
  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesTier = tierFilter === 'all' || app.requestedTier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter((a) => a.status === 'pending').length,
    underReview: mockApplications.filter((a) => a.status === 'under_review').length,
    approved: mockApplications.filter((a) => a.status === 'approved').length,
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
              Brand Applications
            </h1>
            <Badge
              className="bg-[#F54900]/10 text-[#F54900]"
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
            Review và approve đơn đăng ký brand mới
          </p>
        </div>
        <Link to="/admin/brands">
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
            Back to Brands
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
              className="flex items-center justify-center bg-[#F3F4F6]"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <FileText className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              Total Applications
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
              <Clock className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              className="flex items-center justify-center bg-[#0A0A0A]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Eye className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              Approved
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.approved}
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
                placeholder="Search applications..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tier Filter */}
          <div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder="Requested Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Applications List */}
      <div className="flex flex-col" style={{ gap: '16px' }}>
        {paginatedApplications.map((app) => {
          const StatusIcon = statusConfig[app.status as keyof typeof statusConfig].icon;
          const documentsComplete =
            app.documents.businessLicense && app.documents.taxDocument && app.documents.identityCard;

          return (
            <Card
              key={app.id}
              className="bg-white"
              style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: '16px' }}>
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
                      {app.brandName}
                    </h3>
                    <Badge
                      className={statusConfig[app.status as keyof typeof statusConfig].color}
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
                      {statusConfig[app.status as keyof typeof statusConfig].label}
                    </Badge>
                    <Badge
                      className={tierConfig[app.requestedTier as keyof typeof tierConfig].color}
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '6px 12px',
                      }}
                    >
                      {tierConfig[app.requestedTier as keyof typeof tierConfig].label}
                    </Badge>
                  </div>
                  <div className="flex items-center" style={{ gap: '16px', marginBottom: '12px' }}>
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <Building className="text-[#6A7282]" style={{ width: '14px', height: '14px' }} />
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {app.businessName}
                      </p>
                    </div>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {app.email}
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {app.phone}
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      Submitted: {new Date(app.submittedDate).toLocaleDateString('vi-VN')}
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
                    {app.description}
                  </p>

                  {/* Documents Status */}
                  <div
                    className="flex items-center bg-[#F9FAFB]"
                    style={{ gap: '12px', padding: '12px', borderRadius: '8px' }}
                  >
                    <span
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
                    >
                      DOCUMENTS:
                    </span>
                    <Badge
                      className={
                        app.documents.businessLicense
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : 'bg-[#E7000B]/10 text-[#E7000B]'
                      }
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '4px 10px',
                      }}
                    >
                      {app.documents.businessLicense ? '✓' : '✗'} Business License
                    </Badge>
                    <Badge
                      className={
                        app.documents.taxDocument
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : 'bg-[#E7000B]/10 text-[#E7000B]'
                      }
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '4px 10px',
                      }}
                    >
                      {app.documents.taxDocument ? '✓' : '✗'} Tax Document
                    </Badge>
                    <Badge
                      className={
                        app.documents.identityCard
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : 'bg-[#E7000B]/10 text-[#E7000B]'
                      }
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '4px 10px',
                      }}
                    >
                      {app.documents.identityCard ? '✓' : '✗'} Identity Card
                    </Badge>
                  </div>

                  {/* Review Note */}
                  {app.reviewNote && (
                    <div
                      className={
                        app.status === 'approved'
                          ? 'bg-[#10B981]/10 border border-[#10B981]/20'
                          : 'bg-[#E7000B]/10 border border-[#E7000B]/20'
                      }
                      style={{ padding: '12px', borderRadius: '8px', marginTop: '16px' }}
                    >
                      <p
                        className={app.status === 'approved' ? 'text-[#10B981]' : 'text-[#E7000B]'}
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          marginBottom: '4px',
                        }}
                      >
                        {app.status === 'approved' ? 'APPROVED:' : 'REJECTED:'}
                      </p>
                      <p
                        className="text-[#0A0A0A]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {app.reviewNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {app.status === 'pending' && (
                  <Link to={`/admin/brands/applications/${app.id}`}>
                    <Button
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
                      Review Application
                    </Button>
                  </Link>
                )}
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
            {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of{' '}
            {filteredApplications.length} applications
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
    </div>
  );
}
