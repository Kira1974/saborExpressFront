import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChefHat, Clock, Loader2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { orderService } from "../../services/orderService";

export default function KitchenDisplay() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date());

  // Cargar pedidos activos en cocina desde el backend
  const cargarPedidos = async () => {
    try {
      const response = await orderService.getActiveKitchenOrders();
      setPedidos(response.data || []);
    } catch (error) {
      console.error("Error al cargar pedidos de cocina:", error);
      toast.error("Error al cargar pedidos", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // Marcar pedido como listo
  const marcarComoListo = async (orderId) => {
    try {
      await orderService.markAsReady(orderId);
      toast.success("✅ Pedido marcado como LISTO", {
        position: "top-center",
      });
      cargarPedidos(); // Recargar lista
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al marcar como listo", {
        position: "top-center",
      });
    }
  };

  // Reloj en tiempo real
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setFecha(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Cargar pedidos al montar y cada 3 segundos
  useEffect(() => {
    cargarPedidos();

    const interval = setInterval(() => {
      cargarPedidos();
    }, 3000); // Auto-refresh cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900 text-white p-4 md:p-6">
      {/* Header con Reloj */}
      <header className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-xl">
              <ChefHat className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                PANTALLA DE COCINA
              </h1>
              <p className="text-white/70 font-medium text-sm md:text-lg">
                Pedidos en preparación
              </p>
            </div>
          </div>

          {/* Reloj Digital */}
          <div className="text-center md:text-right">
            <div className="bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-xl border border-white/30">
              <p className="text-xs md:text-sm text-white/70 font-bold uppercase tracking-wider mb-1">
                {fecha.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <p className="text-2xl md:text-4xl font-black tabular-nums">
                {fecha.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Badge de estado */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-xs md:text-sm">
                Sistema en línea
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
              <span className="font-bold text-xs md:text-sm">
                {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} activo{pedidos.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Botón de actualización manual */}
          <button
            onClick={cargarPedidos}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 font-bold text-xs md:text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </header>

      {/* Grid de Pedidos */}
      {loading && pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-white/50 mb-4" />
          <p className="text-white/70 font-bold text-base md:text-lg">Cargando pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-12 md:p-16 text-center">
          <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-white/30 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-black mb-3">No hay pedidos en cocina</h2>
          <p className="text-white/70 text-base md:text-lg font-medium">
            Los pedidos aparecerán aquí cuando sean confirmados por el administrador
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {pedidos.map((pedido, index) => (
            <div
              key={pedido.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-3xl animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Header de la Comanda */}
              <div className="bg-white/20 backdrop-blur-sm p-4 md:p-6 border-b border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-white/70 font-bold uppercase tracking-wider">
                      Turno
                    </p>
                    <p className="text-5xl md:text-6xl font-black">
                      {String(pedido.numeroTurno).padStart(3, "0")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 px-3 py-1.5 rounded-lg">
                      <p className="text-yellow-200 text-xs font-bold uppercase tracking-wider">
                        Preparando
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tiempo de espera */}
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {pedido.tiempoEspera}
                  </span>
                </div>
              </div>

              {/* Cuerpo (Lista de productos) */}
              <div className="p-4 md:p-6 space-y-3 md:space-y-4 min-h-[200px] max-h-[350px] md:max-h-[400px] overflow-y-auto">
                {pedido.items?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 md:p-4"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="bg-white/20 backdrop-blur-sm text-white font-black w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl text-lg md:text-xl flex-shrink-0 shadow-lg">
                        {item.cantidad}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg md:text-xl font-black leading-snug mb-1">
                          {item.producto}
                        </p>
                        {item.descripcion && (
                          <p className="text-xs md:text-sm text-white/60 font-medium">
                            {item.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Observaciones especiales */}
                {pedido.observacion && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 md:p-4 mt-3">
                    <p className="text-red-200 text-sm md:text-base font-bold">
                      ⚠️ Nota: {pedido.observacion}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer con botón */}
              <div className="p-4 md:p-5 bg-white/5 backdrop-blur-sm border-t border-white/20">
                <button
                  onClick={() => marcarComoListo(pedido.id)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Marcar como Listo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer con instrucciones */}
      <div className="mt-6 md:mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 text-center">
        <p className="text-white/50 font-medium text-sm md:text-base">
          Los pedidos se actualizan automáticamente cada 3 segundos •
          Al marcar como listo, el administrador podrá enviarlo a la pantalla de turnos
        </p>
      </div>
    </div>
  );
}