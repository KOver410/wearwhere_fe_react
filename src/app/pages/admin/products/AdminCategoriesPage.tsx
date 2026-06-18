import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Folder,
  Grid3x3,
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
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockCategories = [
  {
    id: 1,
    name: 'Áo',
    slug: 'ao',
    description: 'Tất cả các loại áo thời trang',
    productCount: 1234,
    isActive: true,
    order: 1,
    subcategories: [
      { id: 11, name: 'Áo Sơ Mi', productCount: 456 },
      { id: 12, name: 'Áo Thun', productCount: 523 },
      { id: 13, name: 'Áo Khoác', productCount: 255 },
    ],
  },
  {
    id: 2,
    name: 'Quần',
    slug: 'quan',
    description: 'Các loại quần cho mọi phong cách',
    productCount: 987,
    isActive: true,
    order: 2,
    subcategories: [
      { id: 21, name: 'Quần Jean', productCount: 423 },
      { id: 22, name: 'Quần Tây', productCount: 312 },
      { id: 23, name: 'Quần Short', productCount: 252 },
    ],
  },
  {
    id: 3,
    name: 'Váy',
    slug: 'vay',
    description: 'Váy đầm cho mọi dịp',
    productCount: 756,
    isActive: true,
    order: 3,
    subcategories: [
      { id: 31, name: 'Váy Maxi', productCount: 234 },
      { id: 32, name: 'Váy Mini', productCount: 312 },
      { id: 33, name: 'Váy Midi', productCount: 210 },
    ],
  },
  {
    id: 4,
    name: 'Giày Dép',
    slug: 'giay-dep',
    description: 'Giày dép phong cách',
    productCount: 1523,
    isActive: true,
    order: 4,
    subcategories: [
      { id: 41, name: 'Giày Sneaker', productCount: 678 },
      { id: 42, name: 'Giày Cao Gót', productCount: 445 },
      { id: 43, name: 'Sandal', productCount: 400 },
    ],
  },
  {
    id: 5,
    name: 'Phụ Kiện',
    slug: 'phu-kien',
    description: 'Phụ kiện hoàn thiện phong cách',
    productCount: 2341,
    isActive: true,
    order: 5,
    subcategories: [
      { id: 51, name: 'Túi Xách', productCount: 567 },
      { id: 52, name: 'Trang Sức', productCount: 823 },
      { id: 53, name: 'Kính Mát', productCount: 451 },
      { id: 54, name: 'Thắt Lưng', productCount: 500 },
    ],
  },
  {
    id: 6,
    name: 'Đồ Thể Thao',
    slug: 'do-the-thao',
    description: 'Trang phục và phụ kiện thể thao',
    productCount: 623,
    isActive: false,
    order: 6,
    subcategories: [
      { id: 61, name: 'Áo Thể Thao', productCount: 234 },
      { id: 62, name: 'Quần Thể Thao', productCount: 389 },
    ],
  },
];

export default function AdminCategoriesPage() {
  const { v } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  // Filter categories
  const filteredCategories = mockCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    total: mockCategories.length,
    active: mockCategories.filter((c) => c.isActive).length,
    inactive: mockCategories.filter((c) => !c.isActive).length,
    totalProducts: mockCategories.reduce((sum, c) => sum + c.productCount, 0),
  };

  const handleCreate = () => {
    toast.success(v('Category created successfully', 'Tạo danh mục thành công'));
    setCreateModalOpen(false);
    setFormData({ name: '', slug: '', description: '', isActive: true });
  };

  const handleEdit = () => {
    toast.success(v('Category updated successfully', 'Cập nhật danh mục thành công'));
    setEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    toast.success(v('Category deleted successfully', 'Xóa danh mục thành công'));
  };

  const handleToggleStatus = (id: number) => {
    toast.success(v('Category status updated', 'Cập nhật trạng thái danh mục'));
  };

  const openEditModal = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      isActive: category.isActive,
    });
    setEditModalOpen(true);
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
            {v('Categories Management', 'Quản Lý Danh Mục')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Quản lý danh mục sản phẩm toàn hệ thống
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
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
              {v('Back to Products', 'Quay Lại Sản Phẩm')}
            </Button>
          </Link>
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '0 24px',
                }}
              >
                <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                {v('Add Category', 'Thêm Danh Mục')}
              </Button>
            </DialogTrigger>
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
                  {v('Create New Category', 'Tạo Danh Mục Mới')}
                </DialogTitle>
                <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
                  {v('Add a new product category to the system', 'Thêm danh mục sản phẩm mới vào hệ thống')}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col" style={{ gap: '20px', marginTop: '24px' }}>
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <Label
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {v('Category Name', 'Tên Danh Mục')}
                  </Label>
                  <Input
                    placeholder={v('e.g., Áo Sơ Mi', 'ví dụ: Áo Sơ Mi')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-[#D1D5DC]"
                    style={{
                      height: '48px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  />
                </div>
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <Label
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {v('Slug', 'Đường Dẫn')}
                  </Label>
                  <Input
                    placeholder={v('e.g., ao-so-mi', 'ví dụ: ao-so-mi')}
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="border-[#D1D5DC]"
                    style={{
                      height: '48px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  />
                </div>
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <Label
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {v('Description', 'Mô Tả')}
                  </Label>
                  <Textarea
                    placeholder={v('Brief description...', 'Mô tả ngắn gọn...')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border-[#D1D5DC]"
                    style={{
                      minHeight: '100px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {v('Active Status', 'Trạng Thái Hoạt Động')}
                  </Label>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>
              <DialogFooter style={{ marginTop: '24px' }}>
                <Button
                  variant="outline"
                  onClick={() => setCreateModalOpen(false)}
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '0 24px',
                  }}
                >
                  {v('Cancel', 'Hủy')}
                </Button>
                <Button
                  onClick={handleCreate}
                  className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '0 24px',
                  }}
                >
                  {v('Create Category', 'Tạo Danh Mục')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              <Folder className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Categories', 'Tổng Danh Mục')}
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
              className="flex items-center justify-center bg-[#10B981]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Eye className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
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
              {v('Active Categories', 'Danh Mục Hoạt Động')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.active}
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
              <EyeOff className="text-[#6A7282]" style={{ width: '24px', height: '24px' }} />
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
              {v('Inactive Categories', 'Danh Mục Ngừng Hoạt Động')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.inactive}
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#8B5CF6]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Grid3x3 className="text-[#8B5CF6]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Products', 'Tổng Sản Phẩm')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.totalProducts.toLocaleString('vi-VN')}
            </h3>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
            style={{ width: '16px', height: '16px' }}
          />
          <Input
            placeholder={v('Search categories...', 'Tìm kiếm danh mục...')}
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
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-2" style={{ gap: '24px' }}>
        {filteredCategories.map((category) => (
          <Card
            key={category.id}
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-start justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-start" style={{ gap: '16px' }}>
                <div
                  className="flex items-center justify-center bg-[#F3F4F6]"
                  style={{ width: '56px', height: '56px', borderRadius: '10px' }}
                >
                  <Folder className="text-[#0A0A0A]" style={{ width: '28px', height: '28px' }} />
                </div>
                <div>
                  <div className="flex items-center" style={{ gap: '8px', marginBottom: '4px' }}>
                    <h3
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {category.name}
                    </h3>
                    <Badge
                      className={
                        category.isActive
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : 'bg-[#6A7282]/10 text-[#6A7282]'
                      }
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '4px 12px',
                      }}
                    >
                      {category.isActive ? v('Active', 'Đang hoạt động') : v('Inactive', 'Ngừng hoạt động')}
                    </Badge>
                  </div>
                  <p
                    className="text-[#6A7282]"
                    style={{
                      fontSize: '12px',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    /{category.slug}
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '8px',
                    }}
                  >
                    {category.description}
                  </p>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    📦 {category.productCount.toLocaleString('vi-VN')} {v('products', 'sản phẩm')}
                  </p>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(category)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                  }}
                >
                  <Edit style={{ width: '16px', height: '16px' }} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="text-[#E7000B]"
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                  }}
                >
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </Button>
              </div>
            </div>

            {/* Subcategories */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div
                className="border-t border-[#E5E7EB]"
                style={{ paddingTop: '16px', marginTop: '16px' }}
              >
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                  }}
                >
                  {v('SUBCATEGORIES', 'DANH MỤC CON')}
                </p>
                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                  {category.subcategories.map((sub) => (
                    <Badge
                      key={sub.id}
                      className="bg-[#F3F4F6] text-[#0A0A0A]"
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '6px 12px',
                      }}
                    >
                      {sub.name} ({sub.productCount})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
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
              {v('Edit Category', 'Chỉnh Sửa Danh Mục')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Update category information', 'Cập nhật thông tin danh mục')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col" style={{ gap: '20px', marginTop: '24px' }}>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {v('Category Name', 'Tên Danh Mục')}
              </Label>
              <Input
                placeholder={v('e.g., Áo Sơ Mi', 'ví dụ: Áo Sơ Mi')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {v('Slug', 'Đường Dẫn')}
              </Label>
              <Input
                placeholder={v('e.g., ao-so-mi', 'ví dụ: ao-so-mi')}
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {v('Description', 'Mô Tả')}
              </Label>
              <Textarea
                placeholder={v('Brief description...', 'Mô tả ngắn gọn...')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-[#D1D5DC]"
                style={{
                  minHeight: '100px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {v('Active Status', 'Trạng Thái Hoạt Động')}
              </Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              {v('Cancel', 'Hủy')}
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              {v('Save Changes', 'Lưu Thay Đổi')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}