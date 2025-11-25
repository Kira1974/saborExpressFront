import { useEffect, useState } from "react";
import { Clock, ChefHat, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { orderService } from "../../services/orderService";

export default function KitchenDisplay() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date());

  const cargarPedidos = async () => {
    try {
      const response = await orderService.getActiveKitchenOrders();
      setPedidos(response.data || []);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clockInterval = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 text-gray-800 p-4 md:p-6">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-xl shadow-lg">
              <ChefHat className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-800">
                PANTALLA DE COCINA
              </h1>
              <p className="text-gray-600 font-medium">
                Vista en tiempo real • Solo lectura
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-600 font-bold uppercase mb-1">
                {fecha.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <p className="text-2xl font-black text-gray-800 tabular-nums">
                {fecha.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-100 border-2 border-green-300 px-4 py-2 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-sm text-green-700">
                Sistema activo
              </span>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 px-4 py-2 rounded-xl">
              <span className="font-bold text-sm text-gray-800">
                {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} activo
                {pedidos.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <button
            onClick={cargarPedidos}
            disabled={loading}
            className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 px-4 py-2 rounded-xl font-bold text-sm text-blue-700 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </header>

      {/* Grid de Pedidos */}
      {loading && pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-600 font-bold text-lg">Cargando pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-12 text-center">
          <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-700 mb-3">
            No hay pedidos en cocina
          </h2>
          <p className="text-gray-500 text-lg font-medium">
            Los pedidos aparecerán aquí cuando el administrador los confirme
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {pedidos.map((pedido, index) => (
            <div
              key={pedido.id}
              className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b-2 border-orange-200 p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
                      Turno
                    </p>
                    <p className="text-5xl md:text-6xl font-black text-gray-800">
                      {String(pedido.numeroTurno).padStart(3, "0")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-yellow-100 border-2 border-yellow-300 px-3 py-1.5 rounded-lg">
                      <p className="text-yellow-700 text-xs font-bold uppercase">
                        En Preparación
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{pedido.tiempoEspera}</span>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 md:p-6 space-y-3 min-h-[200px] max-h-[350px] overflow-y-auto">
                {pedido.items?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-black w-10 h-10 flex items-center justify-center rounded-xl text-lg shadow-lg">
                        {item.cantidad}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-black text-gray-800 leading-snug mb-1">
                          {item.producto}
                        </p>
                        {item.descripcion && (
                          <p className="text-sm text-gray-600 font-medium">
                            {item.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {pedido.observacion && (
                  <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3">
                    <p className="text-red-700 text-sm font-bold">
                      ⚠️ Nota: {pedido.observacion}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer - SIN BOTONES (Solo vista) */}
              <div className="p-4 bg-gray-50 border-t-2 border-gray-200 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  📢 Avisa al administrador cuando esté listo
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
        <p className="text-blue-700 font-medium text-sm">
          🔄 Se actualiza automáticamente cada 3 segundos • Avisa verbalmente al
          administrador cuando los pedidos estén listos
        </p>
      </div>
    </div>
  );
}