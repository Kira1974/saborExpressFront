import axiosClient from "../config/axiosClient";

export const productService = {
  // ============================================
  // RUTAS PÚBLICAS (Kiosco)
  // ============================================

  // Obtener todos los productos disponibles
  getAllProducts: async () => {
    try {
      const { data } = await axiosClient.get("/products");
      return data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    try {
      const { data } = await axiosClient.get(`/products/category/${category}`);
      return data;
    } catch (error) {
      console.error("Error al obtener productos por categoría:", error);
      throw error;
    }
  },

  // Obtener productos destacados
  getFeaturedProducts: async () => {
    try {
      const { data } = await axiosClient.get("/products/featured");
      return data;
    } catch (error) {
      console.error("Error al obtener productos destacados:", error);
      throw error;
    }
  },

  // Obtener un producto específico
  getProduct: async (id) => {
    try {
      const { data } = await axiosClient.get(`/products/${id}`);
      return data;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  },

  // ============================================
  // RUTAS PRIVADAS (Solo ADMIN) 🔒
  // ============================================

  // Obtener TODOS los productos (incluidos deshabilitados)
  getAllProductsForAdmin: async () => {
    try {
      const { data } = await axiosClient.get("/products/admin/all");
      return data;
    } catch (error) {
      console.error("Error al obtener productos (admin):", error);
      throw error;
    }
  },

  // Crear nuevo producto
  createProduct: async (productData) => {
    try {
      const { data } = await axiosClient.post("/products", productData);
      return data;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  // Actualizar producto completo
  updateProduct: async (id, productData) => {
    try {
      const { data } = await axiosClient.put(`/products/${id}`, productData);
      return data;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  },

  // Habilitar/Deshabilitar producto
  toggleAvailability: async (id) => {
    try {
      const { data } = await axiosClient.patch(`/products/${id}/toggle-availability`);
      return data;
    } catch (error) {
      console.error("Error al cambiar disponibilidad:", error);
      throw error;
    }
  },

  // Marcar/Desmarcar como destacado
  toggleFeatured: async (id) => {
    try {
      const { data } = await axiosClient.patch(`/products/${id}/toggle-featured`);
      return data;
    } catch (error) {
      console.error("Error al cambiar destacado:", error);
      throw error;
    }
  },

  // Eliminar producto permanentemente
  deleteProduct: async (id) => {
    try {
      const { data } = await axiosClient.delete(`/products/${id}`);
      return data;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  },
};