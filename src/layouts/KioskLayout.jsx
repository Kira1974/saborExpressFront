import { Outlet } from "react-router-dom";

export const KioskLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-primary p-6 shadow-md">
        <div className="flex items-center justify-center gap-4">
          {/* Logo desde public */}
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />

          <h1 className="text-white text-3xl font-bold tracking-wider">
            SABOR EXPRESS
          </h1>
        </div>
      </header>

      {/* Contenido dinámico */}
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>Toca la pantalla para ordenar</p>
      </footer>
    </div>
  );
};
