import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { ChefHat, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    if (!email.trim() || !password.trim()) {
      toast.error("Todos los campos son obligatorios", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      const resultado = await login(email, password);

      if (resultado.success) {
        toast.success(`¡Bienvenido ${resultado.user.nombre}!`, {
          position: "top-center",
          icon: "🎉",
        });
        
        // Redirigir según el rol
        if (resultado.user.role === "ADMIN") {
          navigate("/admin");
        } else if (resultado.user.role === "COCINA") {
          navigate("/cocina");
        }
      }
    } catch (error) {
      // El error ya se maneja en AuthProvider, pero por si acaso
      toast.error(error.message || "Error al iniciar sesión", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header con Diseño Moderno */}
          <div className="bg-gradient-to-r from-primary to-red-700 p-8 text-center relative overflow-hidden">
            {/* Patrón de fondo decorativo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            </div>

            {/* Contenido del Header */}
            <div className="relative z-10">
              <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                <ChefHat className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-3xl font-black text-white tracking-wide mb-2">
                SABOR EXPRESS
              </h1>
              <p className="text-red-100 font-medium text-sm">
                Panel Administrativo
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@saborexpress.com"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700 placeholder:text-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-primary" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary text-white font-bold py-4 rounded-xl uppercase transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Credenciales de Prueba */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center mb-3 font-semibold">
                Credenciales de acceso:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Admin:</span>
                  <code className="bg-white px-2 py-1 rounded border border-gray-200 text-primary font-mono">
                    admin@saborexpress.com
                  </code>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Cocina:</span>
                  <code className="bg-white px-2 py-1 rounded border border-gray-200 text-primary font-mono">
                    cocina@saborexpress.com
                  </code>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Password:</span>
                  <code className="bg-white px-2 py-1 rounded border border-gray-200 text-gray-700 font-mono">
                    Admin123! / Cocina123!
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Sistema de Gestión de Pedidos
          <br />
          <span className="text-xs text-gray-400">
            Brasas con Sabor y Aroma - v1.0
          </span>
        </p>
      </div>
    </div>
  );
}
