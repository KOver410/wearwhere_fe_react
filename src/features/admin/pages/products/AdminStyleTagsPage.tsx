import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Tag,
  Sparkles,
  TrendingUp,
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
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { toast } from 'sonner';

// Mock data
const mockStyleTags = [
  {
    id: 1,
    name: 'Minimalist',
    slug: 'minimalist',
    description: 'Phong cách tối giản, đơn giản nhưng tinh tế',
    color: '#0A0A0A',
    productCount: 1234,
    usageCount: 5678,
    category: 'Style',
    trending: true,
  },
  {
    id: 2,
    name: 'Streetwear',
    slug: 'streetwear',
    description: 'Phong cách đường phố năng động, cá tính',
    color: '#F54900',
    productCount: 987,
    usageCount: 4231,
    category: 'Style',
    trending: true,
  },
  {
    id: 3,
    name: 'Vintage',
    slug: 'vintage',
    description: 'Phong cách cổ điển, hoài niệm',
    color: '#6A7282',
    productCount: 756,
    usageCount: 3456,
    category: 'Style',
    trending: false,
  },
  {
    id: 4,
    name: 'Korean Fashion',
    slug: 'korean-fashion',
    description: 'Phong cách thời trang Hàn Quốc hiện đại',
    color: '#10B981',
    productCount: 1523,
    usageCount: 6789,
    category: 'Style',
    trending: true,
  },
  {
    id: 5,
    name: 'Elegant',
    slug: 'elegant',
    description: 'Phong cách thanh lịch, sang trọng',
    color: '#0A0A0A',
    productCount: 892,
    usageCount: 4123,
    category: 'Style',
    trending: false,
  },
  {
    id: 6,
    name: 'Casual',
    slug: 'casual',
    description: 'Phong cách thoải mái hàng ngày',
    color: '#4A5565',
    productCount: 2341,
    usageCount: 8912,
    category: 'Style',
    trending: true,
  },
  {
    id: 7,
    name: 'Summer',
    slug: 'summer',
    description: 'Phong cách mùa hè tươi mát',
    color: '#F59E0B',
    productCount: 567,
    usageCount: 2345,
    category: 'Season',
    trending: false,
  },
  {
    id: 8,
    name: 'Winter',
    slug: 'winter',
    description: 'Phong cách mùa đông ấm áp',
    color: '#3B82F6',
    productCount: 489,
    usageCount: 1987,
    category: 'Season',
    trending: false,
  },
  {
    id: 9,
    name: 'Office',
    slug: 'office',
    description: 'Phong cách công sở chuyên nghiệp',
    color: '#1F2937',
    productCount: 1123,
    usageCount: 5234,
    category: 'Occasion',
    trending: true,
  },
  {
    id: 10,
    name: 'Party',
    slug: 'party',
    description: 'Phong cách dự tiệc nổi bật',
    color: '#EC4899',
    productCount: 678,
    usageCount: 3456,
    category: 'Occasion',
    trending: false,
  },
];

export default function AdminStyleTagsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#0A0A0A',
    category: 'Style',
  });

  // Filter tags
  const filteredTags = mockStyleTags.filter((tag) => {
    const matchesSearch =
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tag.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const stats = {
    total: mockStyleTags.length,
    trending: mockStyleTags.filter((t) => t.trending).length,
    totalProducts: mockStyleTags.reduce((sum, t) => sum + t.productCount, 0),
    totalUsage: mockStyleTags.reduce((sum, t) => sum + t.usageCount, 0),
  };

  const handleCreate = () => {
    toast.success('Style tag created successfully');
    setCreateModalOpen(false);
    setFormData({ name: '', slug: '', description: '', color: '#0A0A0A', category: 'Style' });
  };

  const handleEdit = () => {
    toast.success('Style tag updated successfully');
    setEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    toast.success('Style tag deleted successfully');
  };

  const openEditModal = (tag: any) => {
    setSelectedTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      color: tag.color,
      category: tag.category,
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
            Style Tags Management
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            Quản lý style tags cho AI recommendation
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
              Back to Products
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
                Add Style Tag
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
                  Create New Style Tag
                </DialogTitle>
                <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
                  Add a new style tag for AI recommendations
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
                    Tag Name
                  </Label>
                  <Input
                    placeholder="e.g., Minimalist"
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
                    Slug
                  </Label>
                  <Input
                    placeholder="e.g., minimalist"
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
                    Category
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger
                      className="border-[#D1D5DC]"
                      style={{
                        height: '48px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Style">Style</SelectItem>
                      <SelectItem value="Season">Season</SelectItem>
                      <SelectItem value="Occasion">Occasion</SelectItem>
                      <SelectItem value="Color">Color</SelectItem>
                      <SelectItem value="Material">Material</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <Label
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    Tag Color
                  </Label>
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="border-[#D1D5DC]"
                      style={{
                        width: '80px',
                        height: '48px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                      }}
                    />
                    <Input
                      placeholder="#0A0A0A"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="border-[#D1D5DC]"
                      style={{
                        flex: 1,
                        height: '48px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <Label
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    Description
                  </Label>
                  <Textarea
                    placeholder="Brief description for AI understanding..."
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
                  Cancel
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
                  Create Tag
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
              <Tag className="text-[#3B82F6]" style={{ width: '24px', height: '24px' }} />
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
              Total Tags
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
              <TrendingUp className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              Trending Tags
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.trending}
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
              <Sparkles className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
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
              Tagged Products
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.totalProducts.toLocaleString('vi-VN')}
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
              <Tag className="text-[#8B5CF6]" style={{ width: '24px', height: '24px' }} />
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
              Total Usage
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(stats.totalUsage / 1000).toFixed(1)}K
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
                placeholder="Search tags..."
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
                <SelectItem value="Style">Style</SelectItem>
                <SelectItem value="Season">Season</SelectItem>
                <SelectItem value="Occasion">Occasion</SelectItem>
                <SelectItem value="Color">Color</SelectItem>
                <SelectItem value="Material">Material</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tags Grid */}
      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {filteredTags.map((tag) => (
          <Card
            key={tag.id}
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-start justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    backgroundColor: `${tag.color}15`,
                  }}
                >
                  <Tag style={{ width: '24px', height: '24px', color: tag.color }} />
                </div>
                <div>
                  <div className="flex items-center" style={{ gap: '8px', marginBottom: '4px' }}>
                    <h3
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {tag.name}
                    </h3>
                    {tag.trending && (
                      <TrendingUp
                        className="text-[#F54900]"
                        style={{ width: '14px', height: '14px' }}
                      />
                    )}
                  </div>
                  <Badge
                    className="bg-[#F3F4F6] text-[#6A7282]"
                    style={{
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontFamily: 'Arimo, sans-serif',
                      padding: '2px 8px',
                      marginBottom: '8px',
                    }}
                  >
                    {tag.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: '4px' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(tag)}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                  }}
                >
                  <Edit style={{ width: '14px', height: '14px' }} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(tag.id)}
                  className="text-[#E7000B]"
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                  }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </Button>
              </div>
            </div>

            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '12px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '12px',
              }}
            >
              {tag.description}
            </p>

            <div
              className="grid grid-cols-2 bg-[#F9FAFB]"
              style={{ gap: '12px', padding: '12px', borderRadius: '8px' }}
            >
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '10px', fontFamily: 'Arimo, sans-serif', marginBottom: '2px' }}
                >
                  Products
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {tag.productCount.toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '10px', fontFamily: 'Arimo, sans-serif', marginBottom: '2px' }}
                >
                  Usage
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {tag.usageCount.toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Modal - Similar structure to Create Modal */}
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
              Edit Style Tag
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              Update style tag information
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
                Tag Name
              </Label>
              <Input
                placeholder="e.g., Minimalist"
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
                Slug
              </Label>
              <Input
                placeholder="e.g., minimalist"
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
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger
                  className="border-[#D1D5DC]"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Style">Style</SelectItem>
                  <SelectItem value="Season">Season</SelectItem>
                  <SelectItem value="Occasion">Occasion</SelectItem>
                  <SelectItem value="Color">Color</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                Tag Color
              </Label>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="border-[#D1D5DC]"
                  style={{
                    width: '80px',
                    height: '48px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                />
                <Input
                  placeholder="#0A0A0A"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="border-[#D1D5DC]"
                  style={{
                    flex: 1,
                    height: '48px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                Description
              </Label>
              <Textarea
                placeholder="Brief description for AI understanding..."
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
              Cancel
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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}