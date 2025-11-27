import { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingBag,
  Filter,
  Search,
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { formatMoney } from "../../helpers";

// --- HELPER DE FECHA LOCAL (CRUCIAL PARA QUE COINCIDA CON ORDER SERVICE) ---
const getLocalDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
};

export default function Reports() {
  // Inicializamos con la fecha LOCAL correcta
  const [filterType, setFilterType] = useState("today");
  const [selectedDate, setSelectedDate] = useState(getLocalDate());

  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({ totalVentas: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      // 1. Traemos TODO el historial crudo desde localStorage
      const allOrders = await orderService.getAllOrdersHistory();

      console.log("Total órdenes en historial:", allOrders.length); // Debug

      // 2. Filtramos según la selección
      let filteredOrders = [];

      // Definimos "HOY" usando la misma lógica que al guardar
      const hoyLocal = getLocalDate();

      if (filterType === "all") {
        filteredOrders = allOrders;
      } else if (filterType === "today") {
        // Aquí estaba el error antes: comparaba UTC vs Local
        filteredOrders = allOrders.filter((o) => o.fecha === hoyLocal);
      } else if (filterType === "date") {
        filteredOrders = allOrders.filter((o) => o.fecha === selectedDate);
      }

      console.log(`Órdenes filtradas (${filterType}):`, filteredOrders.length); // Debug

      // 3. Filtramos solo órdenes válidas (Pagadas o Procesadas)
      // Ignoramos las que solo se crearon pero no se pagaron ('PENDIENTE_PAGO')
      const validOrders = filteredOrders.filter((o) =>
        ["EN_COCINA", "LISTO", "ENTREGADO", "EN_PANTALLA"].includes(o.estado)
      );

      // 4. Procesamiento de Totales
      const productMap = {};
      let totalMoney = 0;
      let totalCount = 0;

      validOrders.forEach((order) => {
        totalMoney += Number(order.total || 0);

        const items = order.items || order.productos || [];
        items.forEach((item) => {
          const prodName = item.producto || item.nombre || "Item";
          const prodQty = Number(item.cantidad || 0);
          // Calculamos ingreso proporcional de este item
          const prodRevenue = Number(item.subtotal || 0);

          if (!productMap[prodName]) {
            productMap[prodName] = {
              nombre: prodName,
              cantidad: 0,
              ingresos: 0,
            };
          }
          productMap[prodName].cantidad += prodQty;
          productMap[prodName].ingresos += prodRevenue;
          totalCount += prodQty;
        });
      });

      // Ordenar ranking
      const ranking = Object.values(productMap).sort(
        (a, b) => b.cantidad - a.cantidad
      );

      setReportData(ranking);
      setSummary({ totalVentas: totalMoney, totalItems: totalCount });
    } catch (error) {
      console.error("Error generando reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [filterType, selectedDate]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header de Reportes */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800">
              Reporte de Ventas
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Consolidado de productos
            </p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterType("today")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filterType === "today"
                ? "bg-white shadow text-purple-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filterType === "all"
                ? "bg-white shadow text-purple-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Histórico
          </button>
          <div className="w-px bg-gray-300 mx-2 my-1"></div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setFilterType("date");
            }}
            className="bg-transparent text-sm font-bold text-gray-600 outline-none px-2"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-200/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-200 font-bold text-xs uppercase tracking-wider">
                Dinero Recaudado
              </p>
              <h3 className="text-4xl font-black mt-1">
                {formatMoney(summary.totalVentas)}
              </h3>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-purple-200 bg-white/10 inline-block px-2 py-1 rounded">
            {filterType === "all"
              ? "Total acumulado"
              : filterType === "today"
              ? "Solo ventas de hoy"
              : `Ventas del ${selectedDate}`}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                Volumen de Ventas
              </p>
              <h3 className="text-4xl font-black text-gray-800 mt-1">
                {summary.totalItems}
              </h3>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400 font-medium">
            Productos individuales vendidos
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Detalle por Producto</h3>
          <button
            onClick={generateReport}
            className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline"
          >
            <Search className="w-3 h-3" /> Actualizar datos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4 font-bold w-16 text-center">#</th>
                <th className="p-4 font-bold">Producto</th>
                <th className="p-4 font-bold text-center">Cant.</th>
                <th className="p-4 font-bold text-right">Total</th>
                <th className="p-4 font-bold text-right w-32">Barra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {reportData.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-400 italic"
                  >
                    No hay ventas registradas con los filtros actuales.
                  </td>
                </tr>
              ) : (
                reportData.map((item, index) => {
                  const porcentaje =
                    summary.totalVentas > 0
                      ? ((item.ingresos / summary.totalVentas) * 100).toFixed(0)
                      : 0;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 text-center font-bold text-gray-400">
                        {index + 1}
                      </td>
                      <td className="p-4 font-bold text-gray-700">
                        {item.nombre}
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-bold">
                          {item.cantidad}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-600">
                        {formatMoney(item.ingresos)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-bold text-gray-400">
                            {porcentaje}%
                          </span>
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500"
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
