import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  ChefHat,
  BarChart3,
  AlertCircle,
  Loader2,
  RefreshCw,
  CreditCard,
  Ban,
  Send,
  Eye,
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { reportService } from "../../services/reportService";
import { formatMoney } from "../../helpers";

// Tabs del panel
const TABS = {
  PENDING: "pending",       // Pedidos pendientes de pago
  KITCHEN_VIEW: "kitchen",  // Vista de pedidos en cocina (para admin)
  REPORTS: "reports",       // Reportes y estadísticas
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(TABS.PENDING);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Estados para cada sección
  const [pendingOrders, setPendingOrders] = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  // Cargar datos según la pestaña activa
  const loadData = async () => {
    try {
      setLoading(true);

      switch (activeTab) {
        case TABS.PENDING:
          const pendingData = await orderService.getPendingPaymentOrders();
          setPendingOrders(pendingData.data || []);
          break;

        case TABS.KITCHEN_VIEW:
          const kitchenData = await orderService.getKitchenOrdersForAdmin();
          setKitchenOrders(kitchenData.data || []);
          break;

        case TABS.REPORTS:
          const stats = await reportService.getSalesStatistics();
          const products = await reportService.getTopProducts(10);
          setStatistics(stats.data);
          setTopProducts(products.data || []);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar los datos", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al cambiar de pestaña
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Auto-refresh cada 5 segundos si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, activeTab]);

  // ============================================
  // HANDLERS DE ACCIONES
  // ============================================

  const handleMarkAsPaid = async (orderId) => {
    try {
      await orderService.markAsPaidAndSendToKitchen(orderId);
      toast.success("✅ Pedido marcado como pagado y enviado a cocina", {
        position: "top-center",
      });
      loadData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al procesar el pago", {
        position: "top-center",
      });
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("¿Está seguro de cancelar este pedido?")) return;

    try {
      await orderService.cancelOrder(orderId);
      toast.success("❌ Pedido cancelado correctamente", {
        position: "top-center",
      });
      loadData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al cancelar el pedido", {
        position: "top-center",
      });
    }
  };

  const handleMarkAsReady = async (orderId) => {
    try {
      await orderService.markAsReady(orderId);
      toast.success("✅ Pedido marcado como LISTO", {
        position: "top-center",
      });
      loadData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al marcar como listo", {
        position: "top-center",
      });
    }
  };

  const handleSendToDisplay = async (orderId) => {
    try {
      await orderService.sendToDisplay(orderId);
      toast.success("📺 Pedido enviado a la pantalla de turnos", {
        position: "top-center",
      });
      loadData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al enviar a pantalla", {
        position: "top-center",
      });
    }
  };

  // ============================================
  // COMPONENTE: TAB BUTTONS
  // ============================================

  const TabButton = ({ tab, icon: Icon, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`${
        activeTab === tab
          ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105"
          : "bg-white hover:bg-gray-50 text-gray-700 hover:shadow-md"
      } px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border border-gray-200`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`${
            activeTab === tab ? "bg-white/30 text-white" : "bg-red-100 text-red-600"
          } px-2.5 py-0.5 rounded-full text-xs font-black`}
        >
          {count}
        </span>
      )}
    </button>
  );

  // ============================================
  // COMPONENTE: HEADER
  // ============================================

  const Header = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black text-gray-800 mb-1">
            Panel de Administración
          </h1>
          <p className="text-gray-600 font-medium text-lg">
            Gestión de pedidos y reportes - Pantalla 2 (Caja)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle auto-refresh */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`${
              autoRefresh
                ? "bg-green-100 text-green-700 border-green-300 shadow-sm"
                : "bg-gray-100 text-gray-600 border-gray-300"
            } px-4 py-2.5 rounded-xl font-bold text-sm border-2 flex items-center gap-2 transition-all hover:shadow-md`}
          >
            <RefreshCw
              className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
            {autoRefresh ? "Auto ON" : "Auto OFF"}
          </button>

          {/* Manual refresh */}
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-300 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        <TabButton
          tab={TABS.PENDING}
          icon={Clock}
          label="Pedidos Entrantes"
          count={pendingOrders.length}
        />
        <TabButton
          tab={TABS.KITCHEN_VIEW}
          icon={Eye}
          label="Ver Cocina"
          count={kitchenOrders.length}
        />
        <TabButton
          tab={TABS.REPORTS}
          icon={BarChart3}
          label="Reportes"
        />
      </div>
    </div>
  );

  // ============================================
  // COMPONENTE: PEDIDOS PENDIENTES (PANTALLA 2.1)
  // ============================================

  const PendingOrdersTab = () => (
    <div>
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-orange-500 p-3 rounded-xl">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Pedidos Pendientes de Pago
            </h2>
            <p className="text-gray-600 font-medium">
              Pedidos creados en el kiosco esperando confirmación en caja
            </p>
          </div>
        </div>
      </div>

      {loading && pendingOrders.length === 0 ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-gray-200">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-gray-700 mb-2">
            ¡Todo al día!
          </h3>
          <p className="text-gray-500 font-medium text-lg">
            No hay pedidos pendientes de pago
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
          {pendingOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg border-l-8 border-orange-500 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-5 border-b-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                      Turno
                    </p>
                    <p className="text-5xl font-black text-gray-800">
                      {String(order.numeroTurno).padStart(3, "0")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-2 font-mono">
                      {new Date(order.fecha).toLocaleTimeString()}
                    </p>
                    <span className="bg-orange-100 border-2 border-orange-300 text-orange-700 px-3 py-1.5 rounded-xl text-xs font-black uppercase">
                      Pendiente Pago
                    </span>
                  </div>
                </div>
              </div>

              {/* Body - Items */}
              <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <span className="bg-gray-300 text-gray-800 font-black w-9 h-9 flex items-center justify-center rounded-xl text-sm flex-shrink-0 shadow-sm">
                      {item.cantidad}
                    </span>
                    <div className="flex-1">
                      <p className="font-black text-gray-800 leading-tight mb-1">
                        {item.producto}
                      </p>
                      <p className="text-sm text-gray-600 font-bold">
                        {formatMoney(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer - Total y acciones */}
              <div className="p-5 bg-gray-50 border-t-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 font-black text-lg">TOTAL:</span>
                  <span className="text-3xl font-black text-gray-900">
                    {formatMoney(order.total)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleMarkAsPaid(order.id)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pagado
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Ban className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============================================
  // COMPONENTE: VISTA DE COCINA (PANTALLA 2.2)
  // ============================================

  const KitchenViewTab = () => (
    <div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-yellow-500 p-3 rounded-xl">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Monitoreo de Cocina
            </h2>
            <p className="text-gray-600 font-medium">
              Ver pedidos en cocina • Marcar como listos • Enviar a pantalla de turnos
            </p>
          </div>
        </div>
      </div>

      {loading && kitchenOrders.length === 0 ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
      ) : kitchenOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-gray-200">
          <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-gray-700 mb-2">
            No hay pedidos en cocina
          </h3>
          <p className="text-gray-500 font-medium text-lg">
            Los pedidos aparecerán aquí cuando sean marcados como pagados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
          {kitchenOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-2xl shadow-lg border-l-8 ${
                order.estado === "LISTO"
                  ? "border-green-500"
                  : "border-yellow-500"
              } overflow-hidden hover:shadow-2xl transition-all`}
            >
              {/* Header */}
              <div
                className={`${
                  order.estado === "LISTO"
                    ? "bg-gradient-to-r from-green-50 to-emerald-50"
                    : "bg-gradient-to-r from-yellow-50 to-orange-50"
                } p-5 border-b-2 border-gray-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                      Turno
                    </p>
                    <p className="text-5xl font-black text-gray-800">
                      {String(order.numeroTurno).padStart(3, "0")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-2">
                      {order.enviadoHace}
                    </p>
                    <span
                      className={`${
                        order.estado === "LISTO"
                          ? "bg-green-100 border-green-300 text-green-700"
                          : "bg-yellow-100 border-yellow-300 text-yellow-700"
                      } border-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase`}
                    >
                      {order.estado === "LISTO" ? "✓ Listo" : "En Cocina"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body - Items */}
              <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <span
                      className={`${
                        order.estado === "LISTO"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      } font-black w-9 h-9 flex items-center justify-center rounded-xl text-sm flex-shrink-0 shadow-sm`}
                    >
                      {item.cantidad}
                    </span>
                    <div className="flex-1">
                      <p className="font-black text-gray-800 leading-tight">
                        {item.producto}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer - Acciones según estado */}
              <div className="p-5 bg-gray-50 border-t-2 border-gray-200">
                {order.estado === "EN_COCINA" ? (
                  // Si está EN_COCINA, admin puede marcar como listo
                  <button
                    onClick={() => handleMarkAsReady(order.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Marcar como Listo
                  </button>
                ) : (
                  // Si está LISTO, admin puede enviar a pantalla
                  <button
                    onClick={() => handleSendToDisplay(order.id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                    Enviar a Pantalla de Turnos
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============================================
  // COMPONENTE: REPORTES (PANTALLA 2.3)
  // ============================================

  const ReportsTab = () => (
    <div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-500 p-3 rounded-xl">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Reportes y Estadísticas
            </h2>
            <p className="text-gray-600 font-medium">
              Análisis de ventas y productos más vendidos
            </p>
          </div>
        </div>
      </div>

      {loading && !statistics ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Estadísticas Generales */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* HOY */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-7 text-white border-4 border-blue-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Clock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-wide">Hoy</h3>
                </div>
                <p className="text-5xl font-black mb-2">
                  {formatMoney(statistics.hoy?.totalIngresos || 0)}
                </p>
                <p className="text-sm text-blue-100 font-bold">
                  {statistics.hoy?.totalPedidos || 0} pedidos •{" "}
                  {statistics.hoy?.pedidosPagados || 0} pagados
                </p>
              </div>

              {/* ÚLTIMOS 7 DÍAS */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-7 text-white border-4 border-green-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-wide">7 Días</h3>
                </div>
                <p className="text-5xl font-black mb-2">
                  {formatMoney(statistics.ultimos7Dias?.totalIngresos || 0)}
                </p>
                <p className="text-sm text-green-100 font-bold">
                  {statistics.ultimos7Dias?.totalPedidos || 0} pedidos •
                  Promedio: {formatMoney((statistics.ultimos7Dias?.totalIngresos || 0) / 7)}/día
                </p>
              </div>

              {/* ÚLTIMOS 30 DÍAS */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-7 text-white border-4 border-purple-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-wide">30 Días</h3>
                </div>
                <p className="text-5xl font-black mb-2">
                  {formatMoney(statistics.ultimos30Dias?.totalIngresos || 0)}
                </p>
                <p className="text-sm text-purple-100 font-bold">
                  {statistics.ultimos30Dias?.totalPedidos || 0} pedidos •
                  Promedio: {formatMoney((statistics.ultimos30Dias?.totalIngresos || 0) / 30)}/día
                </p>
              </div>
            </div>
          )}

          {/* Top Productos */}
          {topProducts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-7 border-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-800 mb-5 flex items-center gap-2">
                <span>🏆</span>
                Top 10 Productos Más Vendidos
              </h3>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 transition-colors border border-gray-200"
                  >
                    <div
                      className={`${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/50"
                          : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-500 shadow-lg shadow-gray-400/50"
                          : index === 2
                          ? "bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/50"
                          : "bg-gradient-to-br from-gray-200 to-gray-400"
                      } text-white font-black w-12 h-12 flex items-center justify-center rounded-xl text-xl`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-800 text-lg">
                        {product.producto}
                      </p>
                      <p className="text-sm text-gray-600 font-bold">
                        {product.totalVendido} unidades •{" "}
                        {formatMoney(product.totalIngresos)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-gray-800">
                        {product.totalVendido}
                      </p>
                      <p className="text-xs text-gray-500 font-black uppercase">
                        vendidos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-6">
      <Header />

      {/* Contenido según pestaña activa */}
      {activeTab === TABS.PENDING && <PendingOrdersTab />}
      {activeTab === TABS.KITCHEN_VIEW && <KitchenViewTab />}
      {activeTab === TABS.REPORTS && <ReportsTab />}
    </div>
  );
}