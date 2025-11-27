// src/services/orderService.js

const ORDERS_KEY = "SABOR_EXPRESS_ORDERS";
const TURN_KEY = "SABOR_EXPRESS_TURN";

// --- FUNCIÓN CLAVE PARA ARREGLAR EL PROBLEMA ---
// Obtiene la fecha local (YYYY-MM-DD) respetando tu zona horaria
const getLocalDate = () => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};

export const orderService = {
  // ============================================
  // PANTALLA 1 - KIOSCO
  // ============================================

  createOrder: async (orderData) => {
    // Simulamos espera
    await new Promise((resolve) => setTimeout(resolve, 300));

    const hoy = getLocalDate(); // <--- USAMOS FECHA LOCAL

    // Gestión de Turnos (Reinicio diario)
    let turnData = JSON.parse(localStorage.getItem(TURN_KEY)) || {
      date: hoy,
      count: 0,
    };
    if (turnData.date !== hoy) {
      turnData = { date: hoy, count: 0 };
    }
    turnData.count += 1;
    localStorage.setItem(TURN_KEY, JSON.stringify(turnData));

    // Crear Pedido
    const newOrder = {
      ...orderData,
      id: Date.now(),
      turno: String(turnData.count).padStart(3, "0"),
      fecha: hoy, // Guardamos YYYY-MM-DD local
      timestamp: new Date().toISOString(),
      hora: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      estado: "PENDIENTE_PAGO", // Estado inicial correcto
      sincronizado: false,
    };

    // Guardar en BD Local
    let storedOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    storedOrders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(storedOrders));

    // Disparar evento para que el Dashboard se entere inmediatamente
    window.dispatchEvent(new Event("storage"));

    return newOrder;
  },

  // ============================================
  // PANTALLA 2 - ADMIN (Dashboard)
  // ============================================

  // Obtener pedidos (Con filtro opcional de fecha)
  getOrders: async (filters = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    // Si el dashboard pide una fecha específica, filtramos
    if (filters.fecha) {
      return allOrders.filter((order) => order.fecha === filters.fecha);
    }

    return allOrders;
  },

  getPendingPaymentOrders: async () => {
    const hoy = getLocalDate();
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    return {
      data: allOrders.filter(
        (o) => o.fecha === hoy && o.estado === "PENDIENTE_PAGO"
      ),
    };
  },

  // ============================================
  // ACCIONES DE ESTADO (Cocina, Caja)
  // ============================================

  markAsPaidAndSendToKitchen: async (id) => {
    let allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const updatedOrders = allOrders.map((order) =>
      order.id === id ? { ...order, estado: "EN_COCINA" } : order
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("storage"));
    return { success: true };
  },

  markAsReady: async (id) => {
    let allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const updatedOrders = allOrders.map((order) =>
      order.id === id ? { ...order, estado: "LISTO" } : order
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("storage"));
    return { success: true };
  },

  sendToDisplay: async (id) => {
    // En local solo cambiamos estado si quisieras rastrearlo, o no hacemos nada
    return { success: true };
  },

  cancelOrder: async (id) => {
    let allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const updatedOrders = allOrders.map((order) =>
      order.id === id ? { ...order, estado: "CANCELADO" } : order
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("storage"));
    return { success: true };
  },

  getKitchenOrdersForAdmin: async () => {
    const hoy = getLocalDate();
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    return {
      data: allOrders.filter(
        (o) =>
          o.fecha === hoy && (o.estado === "EN_COCINA" || o.estado === "LISTO")
      ),
    };
  },

  // Para reportes
  getAllOrdersHistory: async () => {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  },
};
