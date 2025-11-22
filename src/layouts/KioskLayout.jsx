import { Outlet } from "react-router-dom";

export const KioskLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Sencillo */}
      <header className="bg-primary p-6 shadow-md">
        <h1 className="text-white text-3xl font-bold text-center tracking-wider">
          🍔 SABOR EXPRESS
        </h1>
      </header>

      {/* Contenido dinámico de las páginas */}
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>Toca la pantalla para ordenar</p>
      </footer>
    </div>
  );
};
