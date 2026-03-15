import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Truck, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  Download
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import { Checkbox } from "@/app/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/app/components/ui/utils";

// Mock Data
const MOCK_ORDERS = [
  {
    id: 'ORD-7782-9012',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    date: '2025-06-12T10:30:00',
    total: 245.00,
    items: 3,
    status: 'pending',
    paymentStatus: 'paid',
    shippingMethod: 'Standard'
  },
  {
    id: 'ORD-7782-9013',
    customer: {
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    date: '2025-06-12T09:15:00',
    total: 120.50,
    items: 1,
    status: 'confirmed',
    paymentStatus: 'paid',
    shippingMethod: 'Express'
  },
  {
    id: 'ORD-7782-9014',
    customer: {
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    date: '2025-06-11T16:45:00',
    total: 89.99,
    items: 2,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingMethod: 'Standard'
  },
  {
    id: 'ORD-7782-9015',
    customer: {
      name: 'David Wilson',
      email: 'david.w@example.com',
      avatar: null
    },
    date: '2025-06-11T14:20:00',
    total: 450.00,
    items: 4,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingMethod: 'Express'
  },
  {
    id: 'ORD-7782-9016',
    customer: {
      name: 'Jessica Taylor',
      email: 'jess.taylor@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    date: '2025-06-10T11:00:00',
    total: 65.00,
    items: 1,
    status: 'cancelled',
    paymentStatus: 'refunded',
    shippingMethod: 'Standard'
  }
];

const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function BrandOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'refunded': return 'text-gray-600 bg-gray-50 border-gray-100';
      case 'failed': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simple date filter (match day if selected)
    const matchesDate = !date || new Date(order.date).toDateString() === date.toDateString();

    return matchesTab && matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Orders</h1>
          <p className="text-[#64748B] text-sm mt-1">Manage and track your customer orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => alert('Orders exported to CSV!')}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-[#F54900] text-white hover:bg-[#E04400]" onClick={() => alert('Printing shipping labels for pending orders...')}>
            <CalendarIcon className="h-4 w-4" />
            Print Shipping Labels
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search order ID, customer..." 
            className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#F54900]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={() => alert('Advanced filters coming soon')}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-transparent p-0 border-b border-gray-200 w-full justify-start h-auto rounded-none">
          {ORDER_STATUSES.map((status) => (
            <TabsTrigger 
              key={status.value} 
              value={status.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F54900] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 text-gray-500 data-[state=active]:text-[#F54900]"
            >
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="m-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-[180px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      No orders found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/brand/orders/${order.id}`} className="text-black hover:underline">
                          {order.id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {order.customer.avatar ? (
                              <img src={order.customer.avatar} alt={order.customer.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-medium text-gray-600">{order.customer.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{order.customer.name}</span>
                            <span className="text-xs text-gray-500">{order.customer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(order.date), "MMM d, yyyy")}
                        <div className="text-xs text-gray-400">{format(new Date(order.date), "h:mm a")}</div>
                      </TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("font-medium border", getStatusColor(order.status))}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border", getPaymentStatusColor(order.paymentStatus))}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/brand/orders/${order.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {order.status === 'pending' && (
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Confirm Order
                              </DropdownMenuItem>
                            )}
                            {order.status === 'confirmed' && (
                              <DropdownMenuItem>
                                <Truck className="mr-2 h-4 w-4" />
                                Ship Order
                              </DropdownMenuItem>
                            )}
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                               <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
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