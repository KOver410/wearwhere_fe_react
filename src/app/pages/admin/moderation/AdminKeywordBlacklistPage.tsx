import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Search,
  Plus,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Filter,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockKeywords = [
  { id: 1, word: 'spam', category: 'spam', severity: 'high', addedBy: 'Admin John', addedAt: '2024-01-15', matchCount: 234 },
  { id: 2, word: 'fake', category: 'misleading', severity: 'medium', addedBy: 'Admin Mary', addedAt: '2024-01-18', matchCount: 156 },
  { id: 3, word: 'scam', category: 'fraud', severity: 'high', addedBy: 'Admin John', addedAt: '2024-01-20', matchCount: 89 },
  { id: 4, word: 'cheap quality', category: 'misleading', severity: 'low', addedBy: 'Admin Sarah', addedAt: '2024-01-22', matchCount: 45 },
  { id: 5, word: 'hate', category: 'harassment', severity: 'high', addedBy: 'Admin John', addedAt: '2024-01-25', matchCount: 67 },
  { id: 6, word: 'click here', category: 'spam', severity: 'medium', addedBy: 'Admin Mary', addedAt: '2024-02-01', matchCount: 112 },
  { id: 7, word: 'buy now', category: 'spam', severity: 'medium', addedBy: 'Admin John', addedAt: '2024-02-03', matchCount: 98 },
  { id: 8, word: 'inappropriate', category: 'profanity', severity: 'high', addedBy: 'Admin Sarah', addedAt: '2024-02-05', matchCount: 134 },
  { id: 9, word: 'misleading info', category: 'misleading', severity: 'medium', addedBy: 'Admin Mary', addedAt: '2024-02-08', matchCount: 76 },
  { id: 10, word: 'phishing', category: 'fraud', severity: 'high', addedBy: 'Admin John', addedAt: '2024-02-10', matchCount: 43 },
  { id: 11, word: 'offensive', category: 'harassment', severity: 'high', addedBy: 'Admin Sarah', addedAt: '2024-02-12', matchCount: 91 },
  { id: 12, word: 'free money', category: 'spam', severity: 'medium', addedBy: 'Admin Mary', addedAt: '2024-02-14', matchCount: 67 },
];

const categories = [
  { value: 'spam', label: 'Spam', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
  { value: 'harassment', label: 'Harassment', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
  { value: 'misleading', label: 'Misleading', color: 'bg-[#F54900]/10 text-[#F54900]' },
  { value: 'fraud', label: 'Fraud', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
  { value: 'profanity', label: 'Profanity', color: 'bg-[#F54900]/10 text-[#F54900]' },
];

const severityConfig = {
  high: { label: 'High', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
  medium: { label: 'Medium', color: 'bg-[#F54900]/10 text-[#F54900]' },
  low: { label: 'Low', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
};

const categoryLabelVi: Record<string, string> = {
  spam: 'Spam',
  harassment: 'Quấy rối',
  misleading: 'Gây hiểu lầm',
  fraud: 'Lừa đảo',
  profanity: 'Ngôn từ thô tục',
};

const severityLabelVi: Record<string, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

export default function AdminKeywordBlacklistPage() {
  const { v } = useLanguage();
  const [keywords, setKeywords] = useState(mockKeywords);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newCategory, setNewCategory] = useState('spam');
  const [newSeverity, setNewSeverity] = useState('medium');
  const [bulkKeywords, setBulkKeywords] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter keywords
  const filteredKeywords = keywords.filter((keyword) => {
    const matchesSearch = keyword.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || keyword.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || keyword.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  // Pagination
  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage);
  const paginatedKeywords = filteredKeywords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: keywords.length,
    highSeverity: keywords.filter((k) => k.severity === 'high').length,
    totalMatches: keywords.reduce((sum, k) => sum + k.matchCount, 0),
    spam: keywords.filter((k) => k.category === 'spam').length,
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      toast.error(v('Please enter a keyword', 'Vui lòng nhập từ khóa'));
      return;
    }
    const newItem = {
      id: keywords.length + 1,
      word: newKeyword.trim(),
      category: newCategory,
      severity: newSeverity,
      addedBy: 'Admin John',
      addedAt: new Date().toISOString().split('T')[0],
      matchCount: 0,
    };
    setKeywords([...keywords, newItem]);
    setNewKeyword('');
    setAddModalOpen(false);
    toast.success(v('Keyword added', 'Đã thêm từ khóa'));
  };

  const handleBulkAdd = () => {
    if (!bulkKeywords.trim()) {
      toast.error(v('Please enter keywords', 'Vui lòng nhập từ khóa'));
      return;
    }
    const lines = bulkKeywords.split('\n').filter((line) => line.trim());
    const newItems = lines.map((line, idx) => ({
      id: keywords.length + idx + 1,
      word: line.trim(),
      category: newCategory,
      severity: newSeverity,
      addedBy: 'Admin John',
      addedAt: new Date().toISOString().split('T')[0],
      matchCount: 0,
    }));
    setKeywords([...keywords, ...newItems]);
    setBulkKeywords('');
    setBulkModalOpen(false);
    toast.success(v(`${newItems.length} keywords added`, `Đã thêm ${newItems.length} từ khóa`));
  };

  const handleDeleteKeyword = (id: number) => {
    setKeywords(keywords.filter((k) => k.id !== id));
    toast.success(v('Keyword removed', 'Đã gỡ từ khóa'));
  };

  const handleBulkDelete = () => {
    const count = selectedKeywords.length;
    setKeywords(keywords.filter((k) => !selectedKeywords.includes(k.id)));
    setSelectedKeywords([]);
    toast.success(v(`${count} keywords removed`, `Đã gỡ ${count} từ khóa`));
  };

  const handleToggleSelect = (id: number) => {
    if (selectedKeywords.includes(id)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== id));
    } else {
      setSelectedKeywords([...selectedKeywords, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedKeywords.length === paginatedKeywords.length) {
      setSelectedKeywords([]);
    } else {
      setSelectedKeywords(paginatedKeywords.map((k) => k.id));
    }
  };

  const handleExport = () => {
    const csv = keywords.map((k) => `${k.word},${k.category},${k.severity}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-blacklist.csv';
    a.click();
    toast.success(v('Keywords exported', 'Đã xuất từ khóa'));
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
            {v('Keyword Blacklist', 'Danh sách từ khóa cấm')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Manage the list of blocked keywords', 'Quản lý danh sách từ khóa bị cấm')}
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/moderation/settings">
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
              <Filter style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Filter Settings', 'Cài đặt bộ lọc')}
            </Button>
          </Link>
          <Link to="/admin/moderation">
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
              {v('Back to Queue', 'Quay lại hàng đợi')}
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
              <AlertTriangle className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Keywords', 'Tổng số từ khóa')}
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
              {v('High Severity', 'Mức độ cao')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.highSeverity}
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
              {v('Total Matches', 'Tổng số lượt khớp')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.totalMatches}
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
              <X className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
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
              {v('Spam Keywords', 'Từ khóa spam')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.spam}
            </h3>
          </div>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '12px' }}>
            <Button
              onClick={() => setAddModalOpen(true)}
              className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
              style={{
                height: '40px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Add Keyword', 'Thêm từ khóa')}
            </Button>
            <Button
              onClick={() => setBulkModalOpen(true)}
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
              <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Bulk Add', 'Thêm hàng loạt')}
            </Button>
            {selectedKeywords.length > 0 && (
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                className="border-[#E7000B] text-[#E7000B]"
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <Trash2 style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                {v('Delete Selected', 'Xóa mục đã chọn')} ({selectedKeywords.length})
              </Button>
            )}
          </div>
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
            {v('Export CSV', 'Xuất CSV')}
          </Button>
        </div>
      </Card>

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
                placeholder={v('Search keywords...', 'Tìm kiếm từ khóa...')}
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
                <SelectValue placeholder={v('Category', 'Danh mục')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Categories', 'Tất cả danh mục')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {v(cat.label, categoryLabelVi[cat.value] ?? cat.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Severity Filter */}
          <div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Severity', 'Mức độ')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Severity', 'Tất cả mức độ')}</SelectItem>
                <SelectItem value="high">{v('High', 'Cao')}</SelectItem>
                <SelectItem value="medium">{v('Medium', 'Trung bình')}</SelectItem>
                <SelectItem value="low">{v('Low', 'Thấp')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Keywords Table */}
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
                <th style={{ padding: '16px 24px', width: '40px' }}>
                  <Checkbox
                    checked={
                      paginatedKeywords.length > 0 &&
                      selectedKeywords.length === paginatedKeywords.length
                    }
                    onCheckedChange={handleSelectAll}
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
                  {v('Keyword', 'Từ khóa')}
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
                  {v('Category', 'Danh mục')}
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
                  {v('Severity', 'Mức độ')}
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
                  {v('Matches', 'Lượt khớp')}
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
                  {v('Added By', 'Người thêm')}
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
                  {v('Added Date', 'Ngày thêm')}
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
              {paginatedKeywords.map((keyword) => {
                const cat = categories.find((c) => c.value === keyword.category);
                return (
                  <tr key={keyword.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                    <td style={{ padding: '16px 24px' }}>
                      <Checkbox
                        checked={selectedKeywords.includes(keyword.id)}
                        onCheckedChange={() => handleToggleSelect(keyword.id)}
                      />
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
                        {keyword.word}
                      </p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <Badge
                        className={cat?.color}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '6px 12px',
                        }}
                      >
                        {cat ? v(cat.label, categoryLabelVi[cat.value] ?? cat.label) : null}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <Badge
                        className={severityConfig[keyword.severity as keyof typeof severityConfig].color}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '6px 12px',
                        }}
                      >
                        {v(
                          severityConfig[keyword.severity as keyof typeof severityConfig].label,
                          severityLabelVi[keyword.severity] ?? severityConfig[keyword.severity as keyof typeof severityConfig].label
                        )}
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
                        {keyword.matchCount}
                      </p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {keyword.addedBy}
                      </p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {new Date(keyword.addedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center justify-end">
                        <Button
                          onClick={() => handleDeleteKeyword(keyword.id)}
                          variant="ghost"
                          size="sm"
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                          }}
                        >
                          <Trash2
                            className="text-[#E7000B]"
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Button>
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
            {Math.min(currentPage * itemsPerPage, filteredKeywords.length)} {v('of', 'trong')}{' '}
            {filteredKeywords.length} {v('keywords', 'từ khóa')}
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

      {/* Add Keyword Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
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
              {v('Add Keyword', 'Thêm từ khóa')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Add a new keyword to the blacklist', 'Thêm từ khóa mới vào danh sách cấm')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col" style={{ gap: '20px', marginTop: '24px' }}>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {v('Keyword', 'Từ khóa')} *
              </Label>
              <Input
                placeholder={v('Enter keyword or phrase...', 'Nhập từ khóa hoặc cụm từ...')}
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {v('Category', 'Danh mục')} *
              </Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
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
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {v(cat.label, categoryLabelVi[cat.value] ?? cat.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {v('Severity', 'Mức độ')} *
              </Label>
              <Select value={newSeverity} onValueChange={setNewSeverity}>
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
                  <SelectItem value="high">{v('High', 'Cao')}</SelectItem>
                  <SelectItem value="medium">{v('Medium', 'Trung bình')}</SelectItem>
                  <SelectItem value="low">{v('Low', 'Thấp')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => setAddModalOpen(false)}
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
              onClick={handleAddKeyword}
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
              {v('Add Keyword', 'Thêm từ khóa')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Add Modal */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
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
              {v('Bulk Add Keywords', 'Thêm từ khóa hàng loạt')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Add multiple keywords at once (one per line)', 'Thêm nhiều từ khóa cùng lúc (mỗi từ khóa một dòng)')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col" style={{ gap: '20px', marginTop: '24px' }}>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {v('Keywords (one per line)', 'Từ khóa (mỗi từ khóa một dòng)')} *
              </Label>
              <textarea
                placeholder="spam&#10;fake&#10;scam&#10;..."
                value={bulkKeywords}
                onChange={(e) => setBulkKeywords(e.target.value)}
                className="w-full border-[#D1D5DC] border"
                style={{
                  minHeight: '200px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '12px',
                }}
              />
              <p
                className="text-[#6A7282]"
                style={{
                  fontSize: '12px',
                  fontFamily: 'Arimo, sans-serif',
                  marginTop: '6px',
                }}
              >
                {bulkKeywords.split('\n').filter((l) => l.trim()).length} {v('keywords entered', 'từ khóa đã nhập')}
              </p>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Category', 'Danh mục')} *
                </Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
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
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {v(cat.label, categoryLabelVi[cat.value] ?? cat.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {v('Severity', 'Mức độ')} *
                </Label>
                <Select value={newSeverity} onValueChange={setNewSeverity}>
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
                    <SelectItem value="high">{v('High', 'Cao')}</SelectItem>
                    <SelectItem value="medium">{v('Medium', 'Trung bình')}</SelectItem>
                    <SelectItem value="low">{v('Low', 'Thấp')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => setBulkModalOpen(false)}
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
              onClick={handleBulkAdd}
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
              <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Bulk Add', 'Thêm hàng loạt')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
