import React, { useState } from 'react';
import { Link } from 'react-router';
import { 
  Plus, Search, Filter, MoreHorizontal, Edit, Trash2, 
  Eye, Archive, ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock Data
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Oversized Cotton T-Shirt',
    sku: 'TSH-001',
    price: 45.00,
    stock: 124,
    status: 'Active',
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    variants: 4
  },
  {
    id: '2',
    name: 'Slim Fit Denim Jeans',
    sku: 'JNS-023',
    price: 89.00,
    stock: 45,
    status: 'Active',
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    variants: 6
  },
  {
    id: '3',
    name: 'Wool Blend Coat',
    sku: 'OUT-104',
    price: 159.00,
    stock: 12,
    status: 'Low Stock',
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    variants: 3
  },
  {
    id: '4',
    name: 'Leather Crossbody Bag',
    sku: 'ACC-005',
    price: 120.00,
    stock: 0,
    status: 'Out of Stock',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    variants: 2
  },
  {
    id: '5',
    name: 'Summer Floral Dress',
    sku: 'DRS-089',
    price: 75.00,
    stock: 56,
    status: 'Draft',
    category: 'Dresses',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    variants: 5
  }
];

export default function BrandProductsPage() {
  const { v } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Filter logic
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || product.status.toLowerCase().replace(' ', '-') === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Active': return v('Active', 'Đang bán');
      case 'Low Stock': return v('Low Stock', 'Sắp hết hàng');
      case 'Out of Stock': return v('Out of Stock', 'Hết hàng');
      case 'Draft': return v('Draft', 'Bản nháp');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">{v('Products', 'Sản phẩm')}</h1>
          <p className="text-sm text-[#64748B] mt-1">{v('Manage your product catalog, inventory, and variants.', 'Quản lý danh mục sản phẩm, tồn kho và biến thể của bạn.')}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/brand/products/categories">
             <Button variant="outline">{v('Categories', 'Danh mục')}</Button>
          </Link>
          <Button variant="outline" onClick={() => alert(v('Import products from CSV coming soon!', 'Nhập sản phẩm từ CSV sắp ra mắt!'))}>{v('Import', 'Nhập')}</Button>
          <Button variant="outline" onClick={() => alert(v('Products exported to CSV!', 'Đã xuất sản phẩm ra CSV!'))}>{v('Export', 'Xuất')}</Button>
          <Link to="/brand/products/new">
            <Button className="bg-[#F54900] text-white hover:bg-[#E04400]">
              <Plus className="mr-2 h-4 w-4" /> {v('Add Product', 'Thêm sản phẩm')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={v('Search products by name or SKU...', 'Tìm sản phẩm theo tên hoặc SKU...')}
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus-visible:ring-[#F54900] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={v('Status', 'Trạng thái')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{v('All Status', 'Tất cả trạng thái')}</SelectItem>
              <SelectItem value="active">{v('Active', 'Đang bán')}</SelectItem>
              <SelectItem value="draft">{v('Draft', 'Bản nháp')}</SelectItem>
              <SelectItem value="low-stock">{v('Low Stock', 'Sắp hết hàng')}</SelectItem>
              <SelectItem value="out-of-stock">{v('Out of Stock', 'Hết hàng')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={v('Category', 'Danh mục')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{v('All Categories', 'Tất cả danh mục')}</SelectItem>
              <SelectItem value="tops">{v('Tops', 'Áo')}</SelectItem>
              <SelectItem value="bottoms">{v('Bottoms', 'Quần')}</SelectItem>
              <SelectItem value="dresses">{v('Dresses', 'Váy đầm')}</SelectItem>
              <SelectItem value="outerwear">{v('Outerwear', 'Áo khoác')}</SelectItem>
              <SelectItem value="accessories">{v('Accessories', 'Phụ kiện')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => alert(v('Advanced filters coming soon', 'Bộ lọc nâng cao sắp ra mắt'))}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <Checkbox 
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">{v('Product', 'Sản phẩm')}</th>
                <th className="px-6 py-4">{v('Status', 'Trạng thái')}</th>
                <th className="px-6 py-4">{v('Inventory', 'Tồn kho')}</th>
                <th className="px-6 py-4">{v('Category', 'Danh mục')}</th>
                <th className="px-6 py-4 text-right">{v('Price', 'Giá')}</th>
                <th className="px-6 py-4 text-right">{v('Actions', 'Hành động')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-gray-500 text-xs">{product.variants} {v('variants', 'biến thể')} • {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{product.stock} {v('in stock', 'còn hàng')}</span>
                      {product.stock < 20 && product.stock > 0 && (
                        <span className="text-xs text-orange-600">{v('Low inventory', 'Tồn kho thấp')}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{v('Actions', 'Hành động')}</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> {v('View Details', 'Xem chi tiết')}
                        </DropdownMenuItem>
                        <Link to={`/brand/products/${product.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> {v('Edit Product', 'Sửa sản phẩm')}
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" /> {v('Archive', 'Lưu trữ')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> {v('Delete', 'Xóa')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {v('Showing', 'Hiển thị')} <span className="font-medium">1</span> {v('to', 'đến')} <span className="font-medium">{filteredProducts.length}</span> {v('of', 'trên')} <span className="font-medium">{MOCK_PRODUCTS.length}</span> {v('results', 'kết quả')}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" /> {v('Previous', 'Trước')}
            </Button>
            <Button variant="outline" size="sm" disabled>
              {v('Next', 'Sau')} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}