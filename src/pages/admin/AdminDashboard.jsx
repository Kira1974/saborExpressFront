import { useEffect, useState } from "react";
import { formatMoney } from "../../helpers";
import { orderService } from "../../services/orderService"; // <--- Importamos el servicio real

export default function AdminDashboard() {
  // 1. Estados iniciales
  const [stats, setStats] = useState({
    ventasHoy: 0,
    pedidosTotales: 0,
    pendientes: 0,
  });
  const [ventasRecientes, setVentasRecientes] = useState([]);

  // 2. Función para calcular datos reales del día
  const cargarDatos = async () => {
    // Obtenemos las ordenes SOLO DE HOY (La lógica de fecha está en el servicio)
    const ordenesHoy = await orderService.getOrders();

    // Calculamos estadísticas matemáticas
    const totalVentas = ordenesHoy.reduce((acc, orden) => acc + orden.total, 0);
    const totalPedidos = ordenesHoy.length;
    const totalPendientes = ordenesHoy.filter(
      (o) => o.estado === "pendiente"
    ).length;

    // Actualizamos el estado
    setStats({
      ventasHoy: totalVentas,
      pedidosTotales: totalPedidos,
      pendientes: totalPendientes,
    });

    // Mostramos las ventas recientes (invertimos el array para ver la última primero)
    setVentasRecientes([...ordenesHoy].reverse());
  };

  useEffect(() => {
    // Carga inicial
    cargarDatos();

    // Escuchamos cambios en otras pestañas (ej: Kiosco vende algo)
    const handleStorageChange = () => cargarDatos();
    window.addEventListener("storage", handleStorageChange);

    // Limpieza del evento al salir
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-gray-800">
          Dashboard de Ventas
        </h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-sm shadow-sm">
          📅 Fecha: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* 1. Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Tarjeta Ventas */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-8 border-green-500">
          <p className="text-gray-500 font-bold uppercase text-sm">
            Ventas del Día
          </p>
          <p className="text-4xl font-black text-gray-800 mt-2">
            {formatMoney(stats.ventasHoy)}
          </p>
        </div>

        {/* Tarjeta Pedidos Totales */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-8 border-blue-500">
          <p className="text-gray-500 font-bold uppercase text-sm">
            Pedidos Totales
          </p>
          <p className="text-4xl font-black text-gray-800 mt-2">
            {stats.pedidosTotales}
          </p>
        </div>

        {/* Tarjeta Pedidos Pendientes */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-8 border-yellow-500">
          <p className="text-gray-500 font-bold uppercase text-sm">
            Pedidos Pendientes
          </p>
          <p className="text-4xl font-black text-gray-800 mt-2">
            {stats.pendientes}
          </p>
        </div>
      </div>

      {/* 2. Tabla de Últimas Ventas */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-700">
            Últimos Movimientos
          </h2>
          <button
            onClick={cargarDatos}
            className="text-primary hover:text-red-800 text-sm font-bold flex items-center gap-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Actualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Turno</th>
                <th className="py-3 px-6 text-left">Hora</th>
                <th className="py-3 px-6 text-left">Origen</th>
                <th className="py-3 px-6 text-left">Total</th>
                <th className="py-3 px-6 text-left">Estado</th>
                <th className="py-3 px-6 text-left">Detalle</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {ventasRecientes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-16 h-16 text-gray-300 mb-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                        />
                      </svg>
                      <p className="text-lg font-bold text-gray-400">
                        Aún no hay ventas registradas hoy.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                ventasRecientes.map((venta) => (
                  <tr
                    key={venta.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-6 text-left font-black text-lg">
                      #{venta.turno}
                    </td>
                    <td className="py-3 px-6 text-left">{venta.hora}</td>
                    <td className="py-3 px-6 text-left">{venta.usuario}</td>
                    <td className="py-3 px-6 text-left font-black text-gray-800">
                      {formatMoney(venta.total)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`py-1 px-3 rounded-full text-xs font-bold uppercase
                            ${
                              venta.estado === "listo"
                                ? "bg-green-100 text-green-700"
                                : venta.estado === "pendiente"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                      >
                        {venta.estado}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left text-xs text-gray-500 max-w-xs truncate">
                      {venta.productos
                        .map((p) => `${p.cantidad}x ${p.nombre}`)
                        .join(", ")}
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
