import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 1. Layouts (Estructuras visuales)
import { KioskLayout } from "../layouts/KioskLayout";
import AdminLayout from "../layouts/AdminLayout";

// 2. Páginas Reales (Componentes funcionales)
import Menu from "../pages/kiosk/Menu";
import Login from "../pages/auth/Login";
import Kitchen from "../pages/kitchen/Kitchen";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TurnMonitor from "../pages/monitor/TurnMonitor"; // <--- NUEVO: Monitor Real

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 RUTAS PÚBLICAS (Kiosco) */}
        {/* Usan el KioskLayout (Header rojo + Footer) */}
        <Route element={<KioskLayout />}>
          <Route path="/" element={<Menu />} />
        </Route>

        {/* 🔓 PANTALLA DE TURNOS (Monitor TV) */}
        {/* Sin layout, ocupa toda la pantalla */}
        <Route path="/turnos" element={<TurnMonitor />} />

        {/* 🔐 AUTENTICACIÓN */}
        <Route path="/login" element={<Login />} />

        {/* 🛡️ RUTAS PRIVADAS (Requieren Login) */}
        {/* Todo lo que esté aquí verifica token y usa el Sidebar Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cocina" element={<Kitchen />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
