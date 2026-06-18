import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/shared/contexts/AuthContext';
import { LayoutDashboard, ShoppingBag, BarChart3, LogOut, Settings, MapPin, Store, Package, ShoppingCart, RotateCcw, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/ui/utils';
import { Button } from '@/shared/ui/button';
import logoImage from '@/assets/80e96fc2cdc554ebf44dc26a8edeb9829e3445b2.png';

export function BrandLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      // Ignore logout request errors; the local session is cleared regardless.
    }
    navigate('/brand/login');
  };

  const initial = (user?.name?.trim()?.[0] ?? 'B').toUpperCase();
  
  const navigation = [
    { name: 'Overview', href: '/brand/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/brand/orders', icon: ShoppingCart },
    { name: 'Returns', href: '/brand/returns', icon: RotateCcw },
    { name: 'Products', href: '/brand/products', icon: Package },
    { name: 'Sales Analytics', href: '/brand/sales', icon: ShoppingBag },
    { name: 'Traffic Analytics', href: '/brand/traffic', icon: BarChart3 },
    { name: 'Store Profile', href: '/brand/profile', icon: Store },
    { name: 'Store Locations', href: '/brand/locations', icon: MapPin },
    { name: 'Settings', href: '/brand/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F172A] flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-white/10">
          <Link to="/brand/dashboard" className="flex items-center">
            <img src={logoImage} alt="WearWhere" className="h-9 w-auto brightness-0 invert" />
          </Link>
          <div className="mt-2 text-xs text-[#F54900] uppercase tracking-wider font-medium">Brand Portal</div>
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-[#F54900] text-white shadow-lg shadow-[#F54900]/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                {item.name}
                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white/60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center p-3 mb-4 rounded-lg bg-white/5 border border-white/10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F54900] to-[#FF7A45] flex items-center justify-center text-white font-bold mr-3">
              {initial}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name ?? 'Brand'}</p>
              <p className="text-xs text-slate-400">{user?.email ?? ''}</p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 bg-transparent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}