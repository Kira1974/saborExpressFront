import { useState, useEffect } from "react";

export default function TurnMonitor() {
  const [turnoActual, setTurnoActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setFecha(new Date());
    }, 1000);


    const fetchTurnoActual = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/orders/current-display');
        const data = await response.json();
        
        if (data.success && data.data.numeroTurno) {
          setTurnoActual(data.data.numeroTurno);
        } else {
          setTurnoActual(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    
    fetchTurnoActual();
    const interval = setInterval(fetchTurnoActual, 3000);
    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };

    console.log("Monitor iniciado...");
    setLoading(false);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col relative overflow-hidden">
      {/* Efectos de fondo sutiles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header Minimalista */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-7 h-7 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sabor Express</h1>
              <p className="text-sm text-white/60 font-medium">Brasas con Sabor y Aroma</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
              {fecha.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' })}
            </div>
            <div className="text-2xl font-bold tabular-nums tracking-tight">
              {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-12">
        <div className="max-w-6xl w-full">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-red-500 mb-6"></div>
              <p className="text-xl font-medium text-white/60">Cargando...</p>
            </div>
          ) : turnoActual ? (
            <div className="text-center space-y-12 animate-fade-in">
              {/* Etiqueta elegante */}
              <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-2xl">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold uppercase tracking-widest text-white/90">
                  Turno Listo
                </span>
              </div>

              {/* Número principal - Diseño moderno */}
              <div className="relative group">
                {/* Glow sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Card del número */}
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-20 shadow-2xl mx-auto max-w-4xl">
                  {/* Decoración de esquinas */}
                  <div className="absolute top-6 left-6 w-20 h-20 border-t-4 border-l-4 border-red-400/40 rounded-tl-3xl"></div>
                  <div className="absolute top-6 right-6 w-20 h-20 border-t-4 border-r-4 border-orange-400/40 rounded-tr-3xl"></div>
                  <div className="absolute bottom-6 left-6 w-20 h-20 border-b-4 border-l-4 border-red-400/40 rounded-bl-3xl"></div>
                  <div className="absolute bottom-6 right-6 w-20 h-20 border-b-4 border-r-4 border-orange-400/40 rounded-br-3xl"></div>
                  
                  {/* Número */}
                  <div className="text-[16rem] font-black leading-none tabular-nums tracking-tighter bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                    {turnoActual}
                  </div>
                </div>
              </div>

              {/* Mensaje de acción */}
              <div className="space-y-6">
                <div className="inline-block backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl px-10 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-7 h-7 text-green-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-white">Su pedido está listo</p>
                      <p className="text-lg text-white/70 font-medium">Puede pasar a recogerlo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-10">
              {/* Ícono animado */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/5 blur-2xl animate-pulse"></div>
                <div className="relative w-32 h-32 mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16 text-white/40"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-white/60">
                  Preparando pedidos...
                </h2>
                <p className="text-xl text-white/40 font-medium">
                  El próximo turno aparecerá aquí
                </p>
              </div>

              {/* Indicador de espera elegante */}
              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="relative z-10 backdrop-blur-xl bg-white/5 border-t border-white/10 py-4">
        <p className="text-center text-white/40 text-sm font-medium">
          Algeciras, Huila • Sistema Digital de Turnos
        </p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}