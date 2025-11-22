import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Hook que crearemos ahora
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if ([email, password].includes("")) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    // Intentamos loguear (Aquí conecta con tu AuthProvider)
    const resultado = await login(email, password);

    if (resultado.success) {
      toast.success("Bienvenido de nuevo");
      navigate("/admin"); // Redirigir al panel
    } else {
      toast.error(resultado.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-800">Iniciar Sesión</h1>
          <p className="text-gray-500">Acceso administrativo SaborExpress</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="******"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
