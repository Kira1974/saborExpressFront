import axiosClient from "../config/axiosClient";

export const orderService = {
  // ============================================
  // PANTALLA 1 - KIOSCO (PÚBLICO)
  // ============================================
  
  // Crear nuevo pedido desde el kiosco
  createOrder: async (orderData) => {
    const { data } = await axiosClient.post("/orders", orderData);
    return data;
  },

  // ============================================
  // PANTALLA 2 - ADMINISTRADOR (CAJA) 🔒
  // ============================================
  
  // Obtener pedidos pendientes de pago (recién creados en kiosco)
  getPendingPaymentOrders: async () => {
    const { data } = await axiosClient.get("/orders/pending-payment");
    return data;
  },

  // Marcar pedido como pagado y enviar automáticamente a cocina
  markAsPaidAndSendToKitchen: async (orderId) => {
    const { data } = await axiosClient.patch(`/orders/${orderId}/mark-paid`);
    return data;
  },

  // Cancelar pedido no pagado
  cancelOrder: async (orderId) => {
    const { data } = await axiosClient.patch(`/orders/${orderId}/cancel`);
    return data;
  },

  // Ver pedidos en cocina (para el módulo de monitoreo del admin)
  getKitchenOrdersForAdmin: async () => {
    const { data } = await axiosClient.get("/orders/kitchen-view");
    return data;
  },

  // Enviar pedido listo a la pantalla de turnos (Pantalla 4)
  sendToDisplay: async (orderId) => {
    const { data } = await axiosClient.patch(`/orders/${orderId}/send-to-display`);
    return data;
  },

  // ============================================
  // PANTALLA 3 - COCINA (PÚBLICO)
  // ============================================
  
  // Obtener pedidos activos en cocina (EN_COCINA)
  getActiveKitchenOrders: async () => {
    const { data } = await axiosClient.get("/orders/kitchen/active");
    return data;
  },

  // Marcar pedido como listo (cocina termina de preparar)
  markAsReady: async (orderId) => {
    const { data } = await axiosClient.patch(`/orders/${orderId}/mark-ready`);
    return data;
  },

  // ============================================
  // PANTALLA 4 - MONITOR DE TURNOS (PÚBLICO)
  // ============================================
  
  // Obtener el turno que se está mostrando actualmente en la pantalla
  getCurrentDisplayTurn: async () => {
    const { data } = await axiosClient.get("/orders/current-display");
    return data;
  },

  // ============================================
  // CONSULTAS GENERALES 🔒
  // ============================================
  
  // Obtener todas las órdenes con filtros opcionales
  getAllOrders: async (filters = {}) => {
    const { data} = await axiosClient.get("/orders", { params: filters });
    return data;
  },

  // Obtener detalle de una orden específica
  getOrderById: async (orderId) => {
    const { data } = await axiosClient.get(`/orders/${orderId}`);
    return data;
  },

  // Marcar pedido como entregado (completa el ciclo)
  markAsDelivered: async (orderId) => {
    const { data } = await axiosClient.patch(`/orders/${orderId}/mark-delivered`);
    return data;
  },
};