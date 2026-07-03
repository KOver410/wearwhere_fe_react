import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Plus, MapPin, Phone, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/shared/i18n/LanguageContext';

// Mock data for locations
const locations = [
  {
    id: 1,
    name: 'WearWhere Flagship Store',
    address: '123 Fashion St, District 1, HCMC',
    addressVi: '123 Đường Thời Trang, Quận 1, TP. Hồ Chí Minh',
    phone: '+84 28 1234 5678',
    status: 'Active',
    type: 'Store'
  },
  {
    id: 2,
    name: 'WearWhere Hanoi Branch',
    address: '456 Style Ave, Ba Dinh, Hanoi',
    addressVi: '456 Đại lộ Phong Cách, Ba Đình, Hà Nội',
    phone: '+84 24 8765 4321',
    status: 'Active',
    type: 'Store'
  },
  {
    id: 3,
    name: 'Da Nang Popup',
    address: '789 Coastal Rd, Da Nang',
    addressVi: '789 Đường Ven Biển, Đà Nẵng',
    phone: '+84 23 6543 2198',
    status: 'Inactive',
    type: 'Popup'
  },
];

export function BrandLocationsPage() {
  const { v, lang } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">{v('Store Locations', 'Địa điểm cửa hàng')}</h2>
          <p className="text-[#64748B]">{v('Manage your physical store branches and popup locations.', 'Quản lý các chi nhánh cửa hàng và điểm bán popup của bạn.')}</p>
        </div>
        <Link to="/brand/locations/new">
          <Button className="bg-[#F54900] text-white hover:bg-[#E04400]">
            <Plus className="mr-2 h-4 w-4" /> {v('Add Location', 'Thêm địa điểm')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{v('All Locations', 'Tất cả địa điểm')}</CardTitle>
          <CardDescription>{v('A list of your registered store addresses and contact info.', 'Danh sách địa chỉ cửa hàng và thông tin liên hệ đã đăng ký.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">{v('Store Name', 'Tên cửa hàng')}</TableHead>
                <TableHead>{v('Address', 'Địa chỉ')}</TableHead>
                <TableHead>{v('Phone', 'Điện thoại')}</TableHead>
                <TableHead>{v('Status', 'Trạng thái')}</TableHead>
                <TableHead className="text-right">{v('Actions', 'Hành động')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#F54900]/10 flex items-center justify-center text-[#F54900] shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{location.name}</div>
                        <div className="text-xs text-muted-foreground">{location.type === 'Store' ? v('Store', 'Cửa hàng') : location.type === 'Popup' ? v('Popup', 'Popup') : location.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{lang === 'vi' ? location.addressVi : location.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-3 w-3" />
                      {location.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={location.status === 'Active' ? 'default' : 'secondary'}>
                      {location.status === 'Active' ? v('Active', 'Đang hoạt động') : location.status === 'Inactive' ? v('Inactive', 'Ngừng hoạt động') : location.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Link to={`/brand/locations/${location.id}`}>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                           <Pencil className="h-4 w-4" />
                         </Button>
                       </Link>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { if (window.confirm(`Delete location "${location.name}"?`)) alert(v('Location deleted!', 'Đã xóa địa điểm!')); }}>
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
