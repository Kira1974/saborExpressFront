import axiosClient from "../config/axiosClient";

export const productService = {
  // Obtener todos los productos
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
};
