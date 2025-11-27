import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  LogOut,
  ChefHat,
  BarChart3,
} from "lucide-react";

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Pedidos y ventas",
    },
    {
      path: "/admin/productos",
      label: "Productos",
      icon: Package,
      description: "Gestión del menú",
    },

    {
      path: "/admin/reportes",
      label: "Reportes",
      icon: BarChart3,
      description: "Gestión del menú",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 shadow-xl flex flex-col">
        {/* Header del Sidebar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">
                Sabor Express
              </h2>
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                Panel Admin
              </p>
            </div>
          </div>

          {/* Info del Usuario */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">
              Sesión Activa
            </p>
            <p className="text-lg font-black text-gray-800 truncate">
              {user.nombre}
            </p>
            <p className="text-sm text-gray-600 font-medium truncate">
              {user.email}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-700 uppercase">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Menú Principal
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-[1.02]"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                } flex items-center gap-3 p-4 rounded-xl transition-all font-bold group`}
              >
                <div
                  className={`${
                    isActive
                      ? "bg-white/20"
                      : "bg-gray-200 group-hover:bg-gray-300"
                  } w-10 h-10 rounded-lg flex items-center justify-center transition-all`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-base">{item.label}</p>
                  <p
                    className={`text-xs ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Cerrar Sesión */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 border-2 border-red-300 text-red-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-md group"
          >
            <LogOut
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              strokeWidth={2.5}
            />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
