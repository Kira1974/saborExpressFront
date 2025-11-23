import axiosClient from "../config/axiosClient";

export const orderService = {
  /**
   * Crear una nueva orden en el backend
   */
  createOrder: async (orderData) => {
    try {
      const { data } = await axiosClient.post("/orders", orderData);
      return data;
    } catch (error) {
      console.error("Error al crear orden:", error);
      
      // Manejo de errores
      let errorMessage = "Error al crear el pedido";
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          if (Array.isArray(data.message)) {
            errorMessage = data.message.join(", ");
          } else {
            errorMessage = data.message || "Datos inválidos en el pedido";
          }
        } else if (status === 404) {
          errorMessage = "Producto no encontrado o no disponible";
        } else if (status >= 500) {
          errorMessage = "Error del servidor. Intenta nuevamente.";
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Obtener todas las órdenes (para admin)
   */
  getOrders: async (filters = {}) => {
    try {
      const { data } = await axiosClient.get("/orders", { params: filters });
      return data;
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      throw error;
    }
  },

  /**
   * Obtener órdenes pendientes de pago
   */
  getPendingPaymentOrders: async () => {
    try {
      const { data } = await axiosClient.get("/orders/pending-payment");
      return data;
    } catch (error) {
      console.error("Error al obtener órdenes pendientes:", error);
      throw error;
    }
  },

  /**
   * Obtener órdenes activas en cocina
   */
  getActiveKitchenOrders: async () => {
    try {
      const { data } = await axiosClient.get("/orders/kitchen/active");
      return data;
    } catch (error) {
      console.error("Error al obtener órdenes de cocina:", error);
      throw error;
    }
  },

  /**
   * Marcar orden como pagada
   */
  markAsPaid: async (orderId) => {
    try {
      const { data } = await axiosClient.patch(`/orders/${orderId}/mark-paid`);
      return data;
    } catch (error) {
      console.error("Error al marcar como pagado:", error);
      throw error;
    }
  },

  /**
   * Marcar orden como lista (desde cocina)
   */
  markAsReady: async (orderId) => {
    try {
      const { data } = await axiosClient.patch(`/orders/${orderId}/mark-ready`);
      return data;
    } catch (error) {
      console.error("Error al marcar como listo:", error);
      throw error;
    }
  },
};
