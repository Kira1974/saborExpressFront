import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { KioskLayout } from "../layouts/KioskLayout";
import AdminLayout from "../layouts/AdminLayout";

// Páginas
import Menu from "../pages/kiosk/Menu";
import Login from "../pages/auth/Login";
import Kitchen from "../pages/kitchen/Kitchen";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductsManager from "../pages/admin/ProductsManager";
import TurnMonitor from "../pages/monitor/TurnMonitor";
import Reports from "../pages/admin/Reports"; // <--- IMPORTANTE: Importar la nueva vista

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 RUTAS PÚBLICAS */}
        <Route element={<KioskLayout />}>
          <Route path="/" element={<Menu />} />
        </Route>

        {/* 🔓 PANTALLAS SIN AUTENTICACIÓN */}
        <Route path="/turnos" element={<TurnMonitor />} />
        <Route path="/cocina" element={<Kitchen />} />

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🛡️ RUTAS PRIVADAS (ADMIN) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/productos" element={<ProductsManager />} />

          {/* NUEVA RUTA DE REPORTES */}
          <Route path="/admin/reportes" element={<Reports />} />
        </Route>

        {/* Redirección */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
