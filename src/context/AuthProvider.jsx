import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verificamos si ya hay sesión guardada
  useEffect(() => {
    const storedUser = localStorage.getItem("USER_DATA");
    const token = localStorage.getItem("AUTH_TOKEN");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    /* ---------------------------------------------------------------
       OPCIÓN A: BACKEND REAL (Descomenta esto cuando tengas la API)
       --------------------------------------------------------------- */
    /*
    try {
      const data = await authService.login({ email, password });

      localStorage.setItem("AUTH_TOKEN", data.access_token);
      localStorage.setItem("USER_DATA", JSON.stringify(data.user));

      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
    */

    /* ---------------------------------------------------------------
       OPCIÓN B: SIMULACIÓN TEMPORAL (Para desarrollo sin backend)
       --------------------------------------------------------------- */

    // Simulamos una pequeña espera de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validamos credenciales "Hardcodeadas"
    if (email === "admin@saborexpress.com" && password === "admin123") {
      const userMock = {
        id: 1,
        nombre: "Administrador",
        email: "admin@saborexpress.com",
        rol: "admin",
      };
      const tokenMock = "token-falso-123456789";

      localStorage.setItem("AUTH_TOKEN", tokenMock);
      localStorage.setItem("USER_DATA", JSON.stringify(userMock));
      setUser(userMock);
      return { success: true };
    } else {
      return {
        success: false,
        message:
          "Credenciales incorrectas (Prueba: admin@saborexpress.com / admin123)",
      };
    }
  };

  const logout = () => {
    // authService.logout(); // Descomentar si tu servicio hace llamada a API
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("USER_DATA");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
