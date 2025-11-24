import axiosClient from "../config/axiosClient";

export const reportService = {
  // Reporte del día actual
  getTodayReport: async () => {
    const { data } = await axiosClient.get("/reports/today");
    return data;
  },

  // Reportes por rango de fechas
  getReportsByDateRange: async (fechaInicio, fechaFin) => {
    const { data } = await axiosClient.get("/reports/range", {
      params: { fechaInicio, fechaFin },
    });
    return data;
  },

  // Estadísticas generales (hoy, últimos 7 días, últimos 30 días)
  getSalesStatistics: async () => {
    const { data } = await axiosClient.get("/reports/statistics");
    return data;
  },

  // Productos más vendidos
  getTopProducts: async (limit = 10, fechaInicio, fechaFin) => {
    const { data } = await axiosClient.get("/reports/top-products", {
      params: { limit, fechaInicio, fechaFin },
    });
    return data;
  },
};