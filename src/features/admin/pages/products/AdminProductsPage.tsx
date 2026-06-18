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
  Filter,
  Download,
  Package,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Checkbox } from '@/shared/ui/checkbox';
import { toast } from 'sonner';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Áo Sơ Mi Trắng Cổ Điển',
    brand: 'Zara',
    category: 'Áo',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    status: 'active',
    stock: 125,
    sales: 342,
    rating: 4.8,
    reviews: 156,
    createdDate: '2024-01-15',
    reported: 0,
  },
  {
    id: 2,
    name: 'Quần Jeans Skinny',
    brand: 'H&M',
    category: 'Quần',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    status: 'pending',
    stock: 89,
    sales: 218,
    rating: 4.5,
    reviews: 94,
    createdDate: '2024-02-10',
    reported: 0,
  },
  {
    id: 3,
    name: 'Váy Maxi Hoa',
    brand: 'Mango',
    category: 'Váy',
    price: 890000,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    status: 'active',
    stock: 45,
    sales: 167,
    rating: 4.9,
    reviews: 203,
    createdDate: '2023-12-20',
    reported: 0,
  },
  {
    id: 4,
    name: 'Áo Khoác Denim',
    brand: 'Levi\'s',
    category: 'Áo',
    price: 1250000,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    status: 'suspended',
    stock: 0,
    sales: 89,
    rating: 4.3,
    reviews: 67,
    createdDate: '2024-01-30',
    reported: 3,
  },
  {
    id: 5,
    name: 'Giày Sneaker Trắng',
    brand: 'Nike',
    category: 'Giày',
    price: 2100000,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    status: 'active',
    stock: 234,
    sales: 567,
    rating: 4.7,
    reviews: 412,
    createdDate: '2023-11-15',
    reported: 0,
  },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-[#10B981]/10 text-[#10B981]' },
  pending: { label: 'Pending Review', color: 'bg-[#F54900]/10 text-[#F54900]' },
  suspended: { label: 'Suspended', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
  outofstock: { label: 'Out of Stock', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
};

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesBrand;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: mockProducts.length,
    active: mockProducts.filter((p) => p.status === 'active').length,
    pending: mockProducts.filter((p) => p.status === 'pending').length,
    reported: mockProducts.filter((p) => p.reported > 0).length,
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  // Toggle select product
  const toggleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Bulk actions
  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedProducts.length} products`);
    setSelectedProducts([]);
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
            Product Management
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Quản lý tất cả sản phẩm trên nền tảng
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/products/categories">
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
              Categories
            </Button>
          </Link>
          <Link to="/admin/products/style-tags">
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
              Style Tags
            </Button>
          </Link>
          <Link to="/admin/products/reported">
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
              <AlertTriangle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Reported
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
            Export
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
              className="flex items-center justify-center bg-[#3B82F6]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Package className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
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
              Total Products
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
              Active Products
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
              <Filter className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              {stats.pending.toLocaleString('vi-VN')}
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
              <AlertTriangle className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
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
              Reported Products
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.reported.toLocaleString('vi-VN')}
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

          {/* Category Filter */}
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Áo">Áo</SelectItem>
                <SelectItem value="Quần">Quần</SelectItem>
                <SelectItem value="Váy">Váy</SelectItem>
                <SelectItem value="Giày">Giày</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand Filter */}
          <div>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="Zara">Zara</SelectItem>
                <SelectItem value="H&M">H&M</SelectItem>
                <SelectItem value="Mango">Mango</SelectItem>
                <SelectItem value="Levi's">Levi's</SelectItem>
                <SelectItem value="Nike">Nike</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card
          className="bg-[#F9FAFB] border-[#0A0A0A]"
          style={{ padding: '16px 24px', borderRadius: '10px', border: '2px solid' }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-[#0A0A0A]"
              style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {selectedProducts.length} products selected
            </p>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('Approve')}
                className="border-[#10B981] text-[#10B981]"
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <CheckCircle style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('Suspend')}
                className="border-[#F54900] text-[#F54900]"
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <XCircle style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                Suspend
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('Delete')}
                className="border-[#E7000B] text-[#E7000B]"
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <Trash2 style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Products Table */}
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
                <th style={{ padding: '16px 24px', width: '48px' }}>
                  <Checkbox
                    checked={
                      paginatedProducts.length > 0 &&
                      selectedProducts.length === paginatedProducts.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
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
                  Product
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
                  Category
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
                  Price
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
                  Stock
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
                  Performance
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
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                  <td style={{ padding: '16px 24px' }}>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleSelectProduct(product.id)}
                    />
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center" style={{ gap: '12px' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="bg-[#F3F4F6]"
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                        }}
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
                          {product.name}
                        </p>
                        <p
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          ID: #{product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {product.brand}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Badge
                      className="bg-[#F3F4F6] text-[#0A0A0A]"
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '4px 12px',
                      }}
                    >
                      {product.category}
                    </Badge>
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
                      {product.price.toLocaleString('vi-VN')}đ
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className={product.stock === 0 ? 'text-[#E7000B]' : 'text-[#0A0A0A]'}
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {product.stock}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex flex-col" style={{ gap: '4px' }}>
                      <div className="flex items-center" style={{ gap: '4px' }}>
                        <span
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          ⭐ {product.rating} ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center" style={{ gap: '4px' }}>
                        <span
                          className="text-[#6A7282]"
                          style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                        >
                          📦 {product.sales} sales
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex flex-col" style={{ gap: '4px' }}>
                      <Badge
                        className={statusConfig[product.status as keyof typeof statusConfig].color}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 12px',
                        }}
                      >
                        {statusConfig[product.status as keyof typeof statusConfig].label}
                      </Badge>
                      {product.reported > 0 && (
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
                          {product.reported} reports
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center justify-end" style={{ gap: '8px' }}>
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
                            <CheckCircle
                              style={{ width: '14px', height: '14px', marginRight: '8px' }}
                            />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#E7000B]">
                            <Trash2 style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                            Delete
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
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