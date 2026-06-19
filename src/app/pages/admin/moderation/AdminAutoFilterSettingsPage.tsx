import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  Save,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockSettings = {
  autoHideThreshold: 5,
  spamDetectionEnabled: true,
  profanityFilterEnabled: true,
  linkFilterEnabled: true,
  duplicateContentDetection: true,
};

const mockKeywords = [
  { id: 1, word: 'spam', category: 'spam', severity: 'high' },
  { id: 2, word: 'fake', category: 'misleading', severity: 'medium' },
  { id: 3, word: 'scam', category: 'fraud', severity: 'high' },
  { id: 4, word: 'cheap quality', category: 'misleading', severity: 'low' },
  { id: 5, word: 'hate', category: 'harassment', severity: 'high' },
  { id: 6, word: 'click here', category: 'spam', severity: 'medium' },
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

export default function AdminAutoFilterSettingsPage() {
  const { v } = useLanguage();
  const [settings, setSettings] = useState(mockSettings);
  const [keywords, setKeywords] = useState(mockKeywords);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newKeyword, setNewKeyword] = useState('');
  const [newCategory, setNewCategory] = useState('spam');
  const [newSeverity, setNewSeverity] = useState('medium');

  // Filter keywords
  const filteredKeywords = keywords.filter((keyword) => {
    const matchesSearch = keyword.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || keyword.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
    };
    setKeywords([...keywords, newItem]);
    setNewKeyword('');
    toast.success(v('Keyword added', 'Đã thêm từ khóa'));
  };

  const handleDeleteKeyword = (id: number) => {
    setKeywords(keywords.filter((k) => k.id !== id));
    toast.success(v('Keyword removed', 'Đã gỡ từ khóa'));
  };

  const handleSaveSettings = () => {
    toast.success(v('Settings saved successfully', 'Đã lưu cài đặt thành công'));
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
            {v('Auto-filter Settings', 'Cài đặt bộ lọc tự động')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Configure automatic content filtering and moderation rules', 'Cấu hình lọc nội dung tự động và quy tắc kiểm duyệt')}
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
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
          <Link to="/admin/moderation/keywords">
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
              {v('Keyword Blacklist', 'Danh sách từ khóa cấm')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {/* Left Column - Settings */}
        <div className="col-span-2 flex flex-col" style={{ gap: '24px' }}>
          {/* Auto-hide Settings */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '20px',
              }}
            >
              {v('Auto-hide Threshold', 'Ngưỡng tự động ẩn')}
            </h3>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '16px',
              }}
            >
              {v('Automatically hide content when it reaches this number of reports', 'Tự động ẩn nội dung khi đạt đến số lượng báo cáo này')}
            </p>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <Input
                type="number"
                value={settings.autoHideThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, autoHideThreshold: parseInt(e.target.value) })
                }
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                  maxWidth: '150px',
                }}
              />
              <span
                className="text-[#0A0A0A]"
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {v('reports', 'báo cáo')}
              </span>
            </div>
          </Card>

          {/* Detection Rules */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '20px',
              }}
            >
              {v('Detection Rules', 'Quy tắc phát hiện')}
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {/* Spam Detection */}
              <div
                className="flex items-center justify-between bg-[#F9FAFB]"
                style={{ padding: '16px', borderRadius: '10px' }}
              >
                <div>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    {v('Spam Detection', 'Phát hiện spam')}
                  </p>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Detect repetitive or promotional content', 'Phát hiện nội dung lặp lại hoặc quảng cáo')}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({ ...settings, spamDetectionEnabled: !settings.spamDetectionEnabled })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.spamDetectionEnabled ? 'bg-[#10B981]' : 'bg-[#D1D5DC]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.spamDetectionEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Profanity Filter */}
              <div
                className="flex items-center justify-between bg-[#F9FAFB]"
                style={{ padding: '16px', borderRadius: '10px' }}
              >
                <div>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    {v('Profanity Filter', 'Bộ lọc ngôn từ thô tục')}
                  </p>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Filter content with inappropriate language', 'Lọc nội dung có ngôn từ không phù hợp')}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({ ...settings, profanityFilterEnabled: !settings.profanityFilterEnabled })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.profanityFilterEnabled ? 'bg-[#10B981]' : 'bg-[#D1D5DC]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.profanityFilterEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Link Filter */}
              <div
                className="flex items-center justify-between bg-[#F9FAFB]"
                style={{ padding: '16px', borderRadius: '10px' }}
              >
                <div>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    {v('External Link Filter', 'Bộ lọc liên kết ngoài')}
                  </p>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Flag content with suspicious external links', 'Gắn cờ nội dung có liên kết ngoài đáng ngờ')}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({ ...settings, linkFilterEnabled: !settings.linkFilterEnabled })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.linkFilterEnabled ? 'bg-[#10B981]' : 'bg-[#D1D5DC]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.linkFilterEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Duplicate Detection */}
              <div
                className="flex items-center justify-between bg-[#F9FAFB]"
                style={{ padding: '16px', borderRadius: '10px' }}
              >
                <div>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    {v('Duplicate Content Detection', 'Phát hiện nội dung trùng lặp')}
                  </p>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Detect and flag duplicate or copied content', 'Phát hiện và gắn cờ nội dung trùng lặp hoặc sao chép')}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      duplicateContentDetection: !settings.duplicateContentDetection,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.duplicateContentDetection ? 'bg-[#10B981]' : 'bg-[#D1D5DC]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.duplicateContentDetection ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Keyword Blacklist Preview */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <h3
                className="text-[#0A0A0A]"
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {v('Keyword Blacklist Preview', 'Xem trước danh sách từ khóa cấm')}
              </h3>
              <Badge
                className="bg-[#F3F4F6] text-[#0A0A0A]"
                style={{
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '6px 12px',
                }}
              >
                {keywords.length} {v('keywords', 'từ khóa')}
              </Badge>
            </div>

            {/* Add Keyword */}
            <div
              className="flex items-end bg-[#F9FAFB]"
              style={{ padding: '16px', borderRadius: '10px', gap: '12px', marginBottom: '20px' }}
            >
              <div style={{ flex: 1 }}>
                <Label
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '6px',
                    display: 'block',
                  }}
                >
                  {v('Keyword', 'Từ khóa')}
                </Label>
                <Input
                  placeholder={v('Enter keyword...', 'Nhập từ khóa...')}
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="border-[#D1D5DC]"
                  style={{
                    height: '40px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
              </div>
              <div style={{ width: '140px' }}>
                <Label
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '6px',
                    display: 'block',
                  }}
                >
                  {v('Category', 'Danh mục')}
                </Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger
                    className="border-[#D1D5DC]"
                    style={{
                      height: '40px',
                      borderRadius: '8px',
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
              <div style={{ width: '120px' }}>
                <Label
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '6px',
                    display: 'block',
                  }}
                >
                  {v('Severity', 'Mức độ')}
                </Label>
                <Select value={newSeverity} onValueChange={setNewSeverity}>
                  <SelectTrigger
                    className="border-[#D1D5DC]"
                    style={{
                      height: '40px',
                      borderRadius: '8px',
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
              <Button
                onClick={handleAddKeyword}
                className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                style={{
                  height: '40px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '0 16px',
                }}
              >
                <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                {v('Add', 'Thêm')}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center" style={{ gap: '12px', marginBottom: '16px' }}>
              <div className="relative" style={{ flex: 1 }}>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                  style={{ width: '14px', height: '14px' }}
                />
                <Input
                  placeholder={v('Search keywords...', 'Tìm kiếm từ khóa...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-[#D1D5DC]"
                  style={{
                    height: '40px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger
                  className="border-[#D1D5DC]"
                  style={{
                    height: '40px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                    width: '160px',
                  }}
                >
                  <SelectValue />
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

            {/* Keywords List */}
            <div className="flex flex-col" style={{ gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {filteredKeywords.map((keyword) => {
                const cat = categories.find((c) => c.value === keyword.category);
                return (
                  <div
                    key={keyword.id}
                    className="flex items-center justify-between bg-[#F9FAFB]"
                    style={{ padding: '12px', borderRadius: '8px' }}
                  >
                    <div className="flex items-center" style={{ gap: '12px' }}>
                      <span
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                        }}
                      >
                        {keyword.word}
                      </span>
                      <Badge
                        className={cat?.color}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 10px',
                        }}
                      >
                        {cat ? v(cat.label, categoryLabelVi[cat.value] ?? cat.label) : null}
                      </Badge>
                      <Badge
                        className={severityConfig[keyword.severity as keyof typeof severityConfig].color}
                        style={{
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontFamily: 'Arimo, sans-serif',
                          padding: '4px 10px',
                        }}
                      >
                        {v(
                          severityConfig[keyword.severity as keyof typeof severityConfig].label,
                          severityLabelVi[keyword.severity] ?? severityConfig[keyword.severity as keyof typeof severityConfig].label
                        )}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleDeleteKeyword(keyword.id)}
                      variant="ghost"
                      size="sm"
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                      }}
                    >
                      <Trash2
                        className="text-[#E7000B]"
                        style={{ width: '14px', height: '14px' }}
                      />
                    </Button>
                  </div>
                );
              })}
            </div>

            <Link to="/admin/moderation/keywords">
              <Button
                variant="outline"
                className="w-full border-[#D1D5DC] mt-4"
                style={{
                  height: '40px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {v('View Full Blacklist', 'Xem toàn bộ danh sách cấm')}
              </Button>
            </Link>
          </Card>
        </div>

        {/* Right Column - Actions & Info */}
        <div className="col-span-1 flex flex-col" style={{ gap: '24px' }}>
          {/* Save Settings */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <Button
              onClick={handleSaveSettings}
              className="w-full bg-[#10B981] text-white hover:bg-[#10B981]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              <Save style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Save Settings', 'Lưu cài đặt')}
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '16px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '16px',
              }}
            >
              {v('Quick Actions', 'Hành động nhanh')}
            </h3>
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <Link to="/admin/moderation/history">
                <Button
                  variant="outline"
                  className="w-full border-[#D1D5DC]"
                  style={{
                    height: '40px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Moderation History', 'Lịch sử kiểm duyệt')}
                </Button>
              </Link>
              <Link to="/admin/moderation/warnings">
                <Button
                  variant="outline"
                  className="w-full border-[#D1D5DC]"
                  style={{
                    height: '40px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('User Warnings', 'Cảnh báo người dùng')}
                </Button>
              </Link>
              <Link to="/admin/moderation/appeals">
                <Button
                  variant="outline"
                  className="w-full border-[#D1D5DC]"
                  style={{
                    height: '40px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Appeal Reviews', 'Xem xét khiếu nại')}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Info */}
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
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '4px',
                }}
              >
                {v('Auto-filter Guidelines', 'Hướng dẫn bộ lọc tự động')}
              </p>
              <p
                className="text-[#0A0A0A]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                {v('Auto-filtered content will be added to moderation queue for manual review. Adjust threshold carefully to balance automation and accuracy.', 'Nội dung bị lọc tự động sẽ được thêm vào hàng đợi kiểm duyệt để xem xét thủ công. Điều chỉnh ngưỡng cẩn thận để cân bằng giữa tự động hóa và độ chính xác.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}