import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { KioskLayout } from "../layouts/KioskLayout";
import AdminLayout from "../layouts/AdminLayout";

// Páginas
import Menu from "../pages/kiosk/Menu";
import Login from "../pages/auth/Login";
import Kitchen from "../pages/kitchen/Kitchen"; // 👁️ SOLO VISTA
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductsManager from "../pages/admin/ProductsManager"; // 🆕 CRUD de productos
import TurnMonitor from "../pages/monitor/TurnMonitor";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 RUTAS PÚBLICAS */}
        <Route element={<KioskLayout />}>
          <Route path="/" element={<Menu />} />
        </Route>

        {/* 🔓 PANTALLAS SIN AUTENTICACIÓN (Acceso desde celular/tablet) */}
        <Route path="/turnos" element={<TurnMonitor />} />
        <Route path="/cocina" element={<Kitchen />} /> {/* 👁️ SOLO VISTA - SIN BOTONES */}

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🛡️ RUTAS PRIVADAS (Requieren Login ADMIN) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/productos" element={<ProductsManager />} /> {/* 🆕 CRUD */}
        </Route>

        {/* Redirección */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};