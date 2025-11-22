import { AppRouter } from "./router/AppRouter";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";

// Importamos estilos de Toastify si decidiste usarlo
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRouter />
        <ToastContainer /> {/* Para las notificaciones flotantes */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
