import { useEffect, useState } from "react";
import { formatMoney } from "../../helpers";
import { orderService } from "../../services/orderService";
import {
  Calendar,
  Search,
  DollarSign,
  ShoppingBag,
  Clock,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [stats, setStats] = useState({
    ventasHoy: 0,
    pedidosTotales: 0,
    pendientes: 0,
  });
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Obtenemos todo y filtramos en cliente (Estrategia Local-First)
      const data = await orderService.getOrders({ fecha: fechaSeleccionada });

      const ordenesDelDia = data.filter((orden) => {
        const fechaOrden = orden.fecha.substring(0, 10);
        return fechaOrden === fechaSeleccionada;
      });

      const totalVentas = ordenesDelDia.reduce(
        (acc, orden) => acc + parseFloat(orden.total),
        0
      );
      const totalPedidos = ordenesDelDia.length;
      const totalPendientes = ordenesDelDia.filter(
        (o) => o.estado === "PENDIENTE_PAGO" || o.estado === "EN_COCINA"
      ).length;

      setStats({
        ventasHoy: totalVentas,
        pedidosTotales: totalPedidos,
        pendientes: totalPendientes,
      });

      setVentasFiltradas([...ordenesDelDia].reverse());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Pequeña espera para que se note la recarga visual
      setTimeout(() => setCargando(false), 300);
    }
  };

  useEffect(() => {
    cargarDatos();
    const handleStorageChange = () => cargarDatos();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fechaSeleccionada]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* --- ENCABEZADO Y FILTROS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Reporte de Ventas
          </h1>
          <p className="text-gray-500 mt-1">
            Resumen general y contabilidad diaria
          </p>
        </div>

        {/* Columna de Filtros (Vertical) */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          {/* 1. Selector de Fecha */}
          <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="block w-full pl-10 pr-3 py-2 border-none rounded-lg text-gray-700 bg-transparent focus:ring-2 focus:ring-primary focus:bg-gray-50 font-medium outline-none transition-all cursor-pointer"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
          </div>

          {/* 2. Botón Filtrar (Debajo) */}
          <button
            onClick={cargarDatos}
            className="bg-primary hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 w-full"
          >
            {cargando ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span>Filtrar Resultados</span>
          </button>
        </div>
      </div>

      {/* --- TARJETAS DE MÉTRICAS (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Ingresos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">
                Ingresos Totales
              </p>
              <h3 className="text-4xl font-black text-gray-800 mt-2">
                {formatMoney(stats.ventasHoy)}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-green-600 font-bold">
            <TrendingUp className="h-4 w-4" />
            <span>Contabilidad al día</span>
          </div>
        </div>

        {/* Card 2: Pedidos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">
                Total Pedidos
              </p>
              <h3 className="text-4xl font-black text-gray-800 mt-2">
                {stats.pedidosTotales}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <ShoppingBag className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Registrados en esta fecha
          </div>
        </div>

        {/* Card 3: Pendientes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-50 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">
                En Cocina
              </p>
              <h3 className="text-4xl font-black text-gray-800 mt-2">
                {stats.pendientes}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
              <Clock className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-4 text-sm text-yellow-600 font-bold animate-pulse">
            {stats.pendientes > 0 ? "Requiere atención" : "Todo al día"}
          </div>
        </div>
      </div>

      {/* --- TABLA DE DETALLES --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-800">
              Historial de Transacciones
            </h2>
            <p className="text-sm text-gray-500">
              Detalle de cada pedido realizado
            </p>
          </div>
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            {ventasFiltradas.length} Registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider text-left">
              <tr>
                <th className="p-4">Turno</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Detalle de Productos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 opacity-50">
                      <ShoppingBag className="h-16 w-16 mb-4" />
                      <p className="text-lg font-bold">
                        No hay ventas en esta fecha.
                      </p>
                      <p className="text-sm">
                        Intenta seleccionar otro día en el calendario.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((venta) => (
                  <tr
                    key={venta.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-black text-gray-800 text-lg bg-gray-100 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                        #{venta.numeroTurno || venta.turno}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-600">
                      {new Date(venta.fecha).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <span className="font-black text-gray-800 text-lg">
                        {formatMoney(Number(venta.total))}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${
                          venta.estado === "ENTREGADO" ||
                          venta.estado === "LISTO"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : venta.estado === "CANCELADO"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full 
                          ${
                            venta.estado === "LISTO"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }
                        `}
                        ></span>
                        {venta.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600 max-w-md truncate font-medium">
                        {(venta.items || venta.productos || [])
                          .map(
                            (p) =>
                              `${p.cantidad}x ${
                                p.product?.nombre || p.nombre || "Item"
                              }`
                          )
                          .join(", ")}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
