import { useState, useEffect } from "react";

export default function TurnMonitor() {
  const [turnos, setTurnos] = useState({
    enPreparacion: [],
    listos: [],
  });

  useEffect(() => {
    // --- ZONA DE DATOS DE PRUEBA (MOCK DATA) ---
    // Descomenta el bloque de abajo para ver cómo se vería en el TV:

    /* const MOCK_TURNOS = {
      enPreparacion: ["015", "016", "018", "019"],
      listos: ["012", "014"],
    };
    setTurnos(MOCK_TURNOS);
    */

    // Aquí iría un polling (consulta repetitiva) al backend cada 5 segundos:
    // const interval = setInterval(() => fetchTurnos(), 5000);
    // return () => clearInterval(interval);

    console.log("Monitor de turnos iniciado...");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-lg border-b border-gray-700">
        <h1 className="text-4xl md:text-5xl font-black text-center tracking-widest text-yellow-400 uppercase">
          Estado de Pedidos
        </h1>
      </header>

      {/* Contenido Principal Dividido */}
      <main className="flex-1 grid grid-cols-2 divide-x divide-gray-700">
        {/* COLUMNA IZQUIERDA: EN PREPARACIÓN */}
        <section className="p-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-400 uppercase flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-10 h-10 animate-pulse"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            En Preparación
          </h2>

          {turnos.enPreparacion.length === 0 ? (
            <p className="text-gray-600 text-2xl mt-20">
              No hay pedidos en cola
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 w-full max-w-md text-center">
              {turnos.enPreparacion.map((turno) => (
                <div
                  key={turno}
                  className="text-7xl md:text-8xl font-black text-gray-300 border-2 border-gray-600 rounded-xl py-6 bg-gray-800 shadow-inner"
                >
                  {turno}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COLUMNA DERECHA: LISTOS PARA ENTREGAR */}
        <section className="p-10 flex flex-col items-center bg-gray-800/50 relative overflow-hidden">
          {/* Efecto de brillo de fondo */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-green-400 uppercase flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Listos para Retirar
          </h2>

          {turnos.listos.length === 0 ? (
            <p className="text-gray-500 text-2xl mt-20">Esperando pedidos...</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 w-full max-w-md text-center">
              {turnos.listos.map((turno) => (
                <div
                  key={turno}
                  className="text-8xl md:text-9xl font-black text-green-400 border-4 border-green-500 rounded-2xl py-8 bg-gray-900 shadow-[0_0_30px_rgba(34,197,94,0.3)] transform scale-105"
                >
                  {turno}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 text-center p-2 text-gray-500 text-sm">
        SaborExpress - Monitor de Turnos
      </footer>
    </div>
  );
}
