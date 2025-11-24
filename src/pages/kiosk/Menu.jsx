import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../../components/kiosk/ProductCard";
import CategorySidebar from "../../components/kiosk/CategorySidebar";
import OrderSummary from "../../components/kiosk/OrderSummary";
import { productService } from "../../services/productService";
import { Loader2, AlertCircle, ShoppingCart, Flame } from "lucide-react";
import useCart from "../../hooks/useCart";
import { formatMoney } from "../../helpers";

export default function Menu() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActual, setCategoriaActual] = useState({
    id: "ARROCES",
    nombre: "Arroces",
  });
  const [showCart, setShowCart] = useState(false);
  const [fecha, setFecha] = useState(new Date());

  const { pedido, total } = useCart();

  // Reloj en tiempo real
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setFecha(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Cargar productos desde el backend
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getAllProducts();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("No se pudieron cargar los productos. Verifica tu conexión.");
        toast.error("Error al cargar el menú", {
          position: "top-center",
          toastId: "products-error",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Filtrar productos por categoría
  const productosFiltrados = productos.filter(
    (producto) => producto.categoria === categoriaActual.id && producto.disponible
  );

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-red-500 mb-6"></div>
          <p className="text-xl font-semibold text-white/80">Cargando menú...</p>
          <p className="text-white/50 mt-2">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Error al cargar el menú</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col relative overflow-hidden">
      {/* Efectos de fondo sutiles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header Minimalista */}
      <header className="relative z-20 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sabor Express</h1>
              <p className="text-sm text-white/60 font-medium">Brasas con Sabor y Aroma</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Reloj */}
            <div className="text-right hidden md:block">
              <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
                {fecha.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' })}
              </div>
              <div className="text-xl font-bold tabular-nums tracking-tight">
                {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Botón del Carrito */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative backdrop-blur-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-5 py-3 rounded-xl shadow-xl transition-all duration-300 flex items-center gap-3 group border border-white/20"
            >
              <ShoppingCart 
                className="w-5 h-5 group-hover:scale-110 transition-transform" 
                strokeWidth={2.5} 
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold opacity-90 uppercase tracking-wide">Mi Pedido</p>
                <p className="text-lg font-bold">{formatMoney(total)}</p>
              </div>
              {pedido.length > 0 && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-white text-red-600 rounded-full flex items-center justify-center text-xs font-black shadow-lg animate-bounce">
                  {pedido.length}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor principal con sidebar y contenido */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Izquierdo: Categorías */}
        <CategorySidebar
          categoriaActual={categoriaActual}
          setCategoriaActual={setCategoriaActual}
          productosDisponibles={productos}
        />

        {/* Contenido Central: Productos */}
        <main className="relative z-10 flex-1 overflow-y-auto p-8">
          {/* Header de la sección */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-4xl font-bold">
                {categoriaActual.nombre}
              </h2>
              {productosFiltrados.length > 0 && (
                <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-white/90">
                    {productosFiltrados.length} disponibles
                  </span>
                </div>
              )}
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
          </div>

          {/* Grid de Productos */}
          {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-16 text-center max-w-md">
                <div className="w-24 h-24 backdrop-blur-xl bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-white/30" />
                </div>
                <h3 className="text-3xl font-bold text-white/60 mb-3">
                  No hay productos disponibles
                </h3>
                <p className="text-white/40 text-lg">
                  Por favor selecciona otra categoría
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
              {productosFiltrados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Panel Lateral del Carrito (Deslizable) */}
      {showCart && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setShowCart(false)}
          ></div>
          
          {/* Panel del Carrito */}
          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] z-50 animate-slide-in">
            <OrderSummary onClose={() => setShowCart(false)} />
          </div>
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}