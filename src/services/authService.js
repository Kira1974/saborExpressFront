import axiosClient from "../config/axiosClient";

export const authService = {
  // Login de usuario administrativo
  login: async (credentials) => {
    // credentials debe ser { email, password }
    const { data } = await axiosClient.post("/auth/login", credentials);
    return data;
  },

  // Cerrar sesión (simplemente borramos el token localmente)
  logout: () => {
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("USER_DATA");
  },
};
