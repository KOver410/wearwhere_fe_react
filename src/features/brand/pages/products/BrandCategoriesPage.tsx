import React, { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search, MoreHorizontal, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useLanguage } from '@/shared/i18n/LanguageContext';

const MOCK_CATEGORIES = [
  { id: '1', name: 'Tops', count: 124, slug: 'tops' },
  { id: '2', name: 'Bottoms', count: 85, slug: 'bottoms' },
  { id: '3', name: 'Dresses', count: 42, slug: 'dresses' },
  { id: '4', name: 'Outerwear', count: 30, slug: 'outerwear' },
  { id: '5', name: 'Accessories', count: 56, slug: 'accessories' },
  { id: '6', name: 'Footwear', count: 18, slug: 'footwear' },
];

export default function BrandCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { v } = useLanguage();

  const filteredCategories = MOCK_CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/brand/products">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">{v('Categories', 'Danh mục')}</h1>
          <p className="text-sm text-[#64748B]">{v('Manage your product categories and sub-categories.', 'Quản lý danh mục và danh mục con sản phẩm của bạn.')}</p>
        </div>
        <div className="ml-auto">
          <Button className="bg-[#F54900] text-white hover:bg-[#E04400]" onClick={() => alert(v('Add category form coming soon!', 'Biểu mẫu thêm danh mục sắp ra mắt!'))}>
            <Plus className="mr-2 h-4 w-4" /> {v('Add Category', 'Thêm danh mục')}
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={v('Search categories...', 'Tìm danh mục...')}
            className="pl-9 bg-gray-50 border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-hidden border rounded-lg border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">{v('Name', 'Tên')}</th>
                <th className="px-6 py-4">{v('Slug', 'Đường dẫn')}</th>
                <th className="px-6 py-4">{v('Products', 'Sản phẩm')}</th>
                <th className="px-6 py-4 text-right">{v('Actions', 'Hành động')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500">/{cat.slug}</td>
                  <td className="px-6 py-4 text-gray-500">{cat.count} {v('products', 'sản phẩm')}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> {v('Edit', 'Sửa')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
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
      </div>
    </div>
  );
}
