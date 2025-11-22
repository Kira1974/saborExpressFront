import axiosClient from "../config/axiosClient";

export const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    const { data } = await axiosClient.get("/products");
    return data;
  },

  // Obtener productos por categoría (útil para filtrar en el kiosco)
  getProductsByCategory: async (category) => {
    const { data } = await axiosClient.get(`/products/category/${category}`);
    return data;
  },
};
