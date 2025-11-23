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

      // Manejo de errores más específico
      let errorMessage = "Error al iniciar sesión";

      if (error.response) {
        // El servidor respondió con un error
        const { status, data } = error.response;

        if (status === 401) {
          errorMessage = data.message || "Credenciales inválidas";
        } else if (status === 400) {
          errorMessage = data.message || "Datos inválidos";
        } else if (status >= 500) {
          errorMessage = "Error del servidor. Intenta más tarde.";
        }
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        errorMessage =
          "No se pudo conectar con el servidor. Verifica tu conexión.";
      }

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
      });

      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info("Sesión cerrada correctamente", {
      position: "top-center",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
