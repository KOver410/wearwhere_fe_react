import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { format } from "date-fns";
import { cn } from "@/shared/ui/utils";
import { useLanguage } from '@/shared/i18n/LanguageContext';

// Mock Data
const MOCK_RETURNS = [
  {
    id: 'RET-8821-401',
    orderId: 'ORD-7782-9012',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
    },
    items: ['Essential Cotton T-Shirt'],
    itemsVi: ['Áo thun cotton cơ bản'],
    reason: 'Size too small',
    status: 'pending',
    date: '2025-06-14T15:30:00',
    amount: 45.00
  },
  {
    id: 'RET-8821-402',
    orderId: 'ORD-7782-9008',
    customer: {
      name: 'Mike Smith',
      email: 'mike.s@example.com',
    },
    items: ['Slim Fit Denim Jeans'],
    itemsVi: ['Quần jean denim slim fit'],
    reason: 'Defective item',
    status: 'approved',
    date: '2025-06-13T09:00:00',
    amount: 130.00
  },
  {
    id: 'RET-8821-403',
    orderId: 'ORD-7782-8999',
    customer: {
      name: 'Emily Davis',
      email: 'emily.d@example.com',
    },
    items: ['Summer Dress'],
    itemsVi: ['Váy mùa hè'],
    reason: 'Changed mind',
    status: 'rejected',
    date: '2025-06-12T11:45:00',
    amount: 89.99
  }
];

const RETURN_STATUSES = [
  { value: 'all', label: 'All Returns' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'refunded', label: 'Refunded' }
];

export default function BrandReturnsPage() {
  const { v, lang } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (value: string) => {
    switch (value) {
      case 'all': return v('All Returns', 'Tất cả yêu cầu trả');
      case 'pending': return v('Pending', 'Chờ xử lý');
      case 'approved': return v('Approved', 'Đã duyệt');
      case 'rejected': return v('Rejected', 'Đã từ chối');
      case 'refunded': return v('Refunded', 'Đã hoàn tiền');
      default: return value.charAt(0).toUpperCase() + value.slice(1);
    }
  };

  const filteredReturns = MOCK_RETURNS.filter(ret => {
    const matchesTab = activeTab === 'all' || ret.status === activeTab;
    const matchesSearch =
      ret.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">{v('Returns & Exchanges', 'Trả hàng & Đổi hàng')}</h1>
          <p className="text-[#64748B] text-sm mt-1">{v('Manage return requests and refunds.', 'Quản lý yêu cầu trả hàng và hoàn tiền.')}</p>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={v('Search return ID, order ID, customer...', 'Tìm mã trả hàng, mã đơn, khách hàng...')}
            className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#F54900]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => alert(v('Advanced filters coming soon', 'Bộ lọc nâng cao sắp ra mắt'))}>
           <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-transparent p-0 border-b border-gray-200 w-full justify-start h-auto rounded-none">
          {RETURN_STATUSES.map((status) => (
            <TabsTrigger
              key={status.value}
              value={status.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900]"
            >
              {getStatusLabel(status.value)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="m-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[150px]">{v('Return ID', 'Mã trả hàng')}</TableHead>
                  <TableHead>{v('Order ID', 'Mã đơn hàng')}</TableHead>
                  <TableHead>{v('Customer', 'Khách hàng')}</TableHead>
                  <TableHead>{v('Items', 'Sản phẩm')}</TableHead>
                  <TableHead>{v('Date', 'Ngày')}</TableHead>
                  <TableHead>{v('Status', 'Trạng thái')}</TableHead>
                  <TableHead>{v('Amount', 'Số tiền')}</TableHead>
                  <TableHead className="text-right">{v('Actions', 'Thao tác')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                      {v('No return requests found.', 'Không tìm thấy yêu cầu trả hàng nào.')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReturns.map((ret) => (
                    <TableRow key={ret.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">
                        <Link to={`/brand/returns/${ret.id}`} className="text-black hover:underline">
                          {ret.id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-500">{ret.orderId}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{ret.customer.name}</span>
                          <span className="text-xs text-gray-500">{ret.customer.email}</span>
                        </div>
                      </TableCell>
                       <TableCell className="text-gray-600 max-w-[200px] truncate">
                        {(lang === 'vi' ? ret.itemsVi : ret.items).join(', ')}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(ret.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("font-medium border", getStatusColor(ret.status))}>
                          {getStatusLabel(ret.status)}
                        </Badge>
                      </TableCell>
                       <TableCell className="font-medium">${ret.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">{v('Open menu', 'Mở menu')}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{v('Actions', 'Thao tác')}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/brand/returns/${ret.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {v('View Details', 'Xem chi tiết')}
                            </DropdownMenuItem>
                            {ret.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  {v('Approve', 'Duyệt')}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  {v('Reject', 'Từ chối')}
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
