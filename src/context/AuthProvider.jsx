import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verificamos si ya hay sesión guardada
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("USER_DATA");
      const token = localStorage.getItem("AUTH_TOKEN");

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error al parsear usuario:", error);
          localStorage.removeItem("USER_DATA");
          localStorage.removeItem("AUTH_TOKEN");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Llamada REAL al backend
      const data = await authService.login({ email, password });

      // Guardamos el token y los datos del usuario
      localStorage.setItem("AUTH_TOKEN", data.access_token);
      localStorage.setItem("USER_DATA", JSON.stringify(data.user));

      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Error en login:", error);

      // 🔧 FIX: Manejo de errores SIN duplicar toast
      let errorMessage = "Error al iniciar sesión";

      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          errorMessage = data.message || "Credenciales inválidas";
        } else if (status === 400) {
          // Si el backend retorna un array de errores de validación
          if (Array.isArray(data.message)) {
            errorMessage = data.message.join(", ");
          } else {
            errorMessage = data.message || "Datos inválidos";
          }
        } else if (status >= 500) {
          errorMessage = "Error del servidor. Intenta más tarde.";
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }

      // 🔧 FIX: Mostrar toast SOLO UNA VEZ aquí
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        toastId: "login-error", // 🎯 ID único para evitar duplicados
      });

      // Lanzamos el error para que Login.jsx lo capture pero NO muestre otro toast
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info("Sesión cerrada correctamente", {
      position: "top-center",
      toastId: "logout-success", // 🎯 ID único
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
