import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  // Mientras verifica el token, mostramos "Cargando..."
  if (loading) return <p className="p-10 text-center">Cargando...</p>;

  // Si terminó de cargar y NO hay usuario, adiós.
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      {/* Sidebar Admin */}
      <aside className="md:w-72 bg-gray-800 text-white px-5 py-10">
        <h2 className="text-3xl font-black text-center mb-10 text-primary">
          ADMIN
        </h2>

        <p className="text-center mb-10 text-gray-400">Hola, {user.nombre}</p>

        <nav className="flex flex-col gap-4">
          {/* Enlace al Dashboard */}
          <Link
            to="/admin"
            className={`${
              location.pathname === "/admin" ? "text-primary" : "text-white"
            } font-bold text-lg hover:text-primary transition-colors`}
          >
            Pedidos & Ventas
          </Link>

          {/* Enlace a Cocina */}
          <Link
            to="/cocina"
            className={`${
              location.pathname === "/cocina" ? "text-primary" : "text-white"
            } font-bold text-lg hover:text-primary transition-colors`}
          >
            Pantalla Cocina
          </Link>

          {/* Botón Cerrar Sesión */}
          <button
            type="button"
            className="text-left font-bold text-lg text-red-500 hover:text-red-300 mt-10"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-10 overflow-y-scroll h-screen">
        <Outlet />
      </main>
    </div>
  );
}
