const ORDERS_KEY = "SABOR_EXPRESS_ORDERS";
const TURN_KEY = "SABOR_EXPRESS_TURN";

// Helper para obtener la fecha actual como string "YYYY-MM-DD"
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const orderService = {
  /**
     Crea una orden, gestiona el consecutivo del turno y guarda localmente.
     */
  createOrder: async (orderData) => {
    // 1. Simular retardo de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    const hoy = getTodayDate();

    // --- GESTIÓN DEL TURNO ---
    let turnData = JSON.parse(localStorage.getItem(TURN_KEY)) || {
      date: hoy,
      count: 0,
    };

    // Si la fecha guardada es diferente a hoy, REINICIAMOS el contador
    if (turnData.date !== hoy) {
      turnData = { date: hoy, count: 0 };
    }

    // Incrementamos turno
    turnData.count += 1;
    // Guardamos el nuevo turno
    localStorage.setItem(TURN_KEY, JSON.stringify(turnData));

    // --- GESTIÓN DEL PEDIDO ---
    const newOrder = {
      ...orderData,
      id: Date.now(), // ID único basado en tiempo
      turno: String(turnData.count).padStart(3, "0"), // Ej: "005"
      fecha: hoy,
      hora: new Date().toLocaleTimeString(),
      estado: "pendiente", // pendiente -> preparacion -> listo -> entregado
    };

    // --- GESTIÓN DE PERSISTENCIA (BD LOCAL) ---
    // Obtenemos las ordenes existentes
    let storedOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    // Agregamos la nueva orden
    storedOrders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(storedOrders));

    return newOrder;
  },

  /**
   * Obtiene las ordenes del día para el Dashboard y Cocina
   */
  getOrders: async () => {
    const hoy = getTodayDate();
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    // Filtramos solo las de HOY para los reportes diarios
    // Si quieres historial completo, quita el .filter
    return allOrders.filter((order) => order.fecha === hoy);
  },

  /**
   * Actualiza el estado de una orden (Para Cocina)
   */
  updateOrderStatus: async (id, status) => {
    let allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    const updatedOrders = allOrders.map((order) =>
      order.id === id ? { ...order, estado: status } : order
    );

    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    return { success: true };
  },
};
