import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { 
  Stethoscope, 
  LayoutDashboard, 
  Users, 
  PawPrint, 
  Calendar, 
  FileText, 
  Receipt, 
  Package,
  LogOut
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clientes', icon: Users, label: 'Clientes', roles: ['administrador', 'recepcionista'] },
    { path: '/mascotas', icon: PawPrint, label: 'Mascotas' },
    { path: '/citas', icon: Calendar, label: 'Citas' },
    { path: '/historial', icon: FileText, label: 'Historial Clínico', roles: ['administrador', 'veterinario'] },
    { path: '/facturacion', icon: Receipt, label: 'Facturación', roles: ['administrador', 'recepcionista'] },
    { path: '/inventario', icon: Package, label: 'Inventario', roles: ['administrador'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(currentUser?.role || '')
  );

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h1 className="text-xl">VetCare</h1>
              <p className="text-xs text-blue-300">Sistema Veterinario</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="mb-3 px-4 py-2">
            <p className="text-xs text-blue-300">Usuario actual</p>
            <p className="text-sm">{currentUser.nombre}</p>
            <p className="text-xs text-blue-300 capitalize">{currentUser.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
