import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Plus, MapPin, Phone, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

// Mock data for locations
const locations = [
  { 
    id: 1, 
    name: 'WearWhere Flagship Store', 
    address: '123 Fashion St, District 1, HCMC', 
    phone: '+84 28 1234 5678', 
    status: 'Active',
    type: 'Store'
  },
  { 
    id: 2, 
    name: 'WearWhere Hanoi Branch', 
    address: '456 Style Ave, Ba Dinh, Hanoi', 
    phone: '+84 24 8765 4321', 
    status: 'Active',
    type: 'Store'
  },
  { 
    id: 3, 
    name: 'Da Nang Popup', 
    address: '789 Coastal Rd, Da Nang', 
    phone: '+84 23 6543 2198', 
    status: 'Inactive',
    type: 'Popup'
  },
];

export function BrandLocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Store Locations</h2>
          <p className="text-[#64748B]">Manage your physical store branches and popup locations.</p>
        </div>
        <Link to="/brand/locations/new">
          <Button className="bg-[#F54900] text-white hover:bg-[#E04400]">
            <Plus className="mr-2 h-4 w-4" /> Add Location
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
          <CardDescription>A list of your registered store addresses and contact info.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Store Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        <div className="text-xs text-muted-foreground">{location.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-3 w-3" />
                      {location.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={location.status === 'Active' ? 'default' : 'secondary'}>
                      {location.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Link to={`/brand/locations/${location.id}`}>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                           <Pencil className="h-4 w-4" />
                         </Button>
                       </Link>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { if (window.confirm(`Delete location "${location.name}"?`)) alert('Location deleted!'); }}>
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