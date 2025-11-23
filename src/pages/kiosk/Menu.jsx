import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../../components/kiosk/ProductCard";
import CategorySidebar from "../../components/kiosk/CategorySidebar";
import OrderSummary from "../../components/kiosk/OrderSummary";
import { productService } from "../../services/productService";
import { Loader2, AlertCircle } from "lucide-react";

export default function Menu() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActual, setCategoriaActual] = useState({
    id: "ARROCES",
    nombre: "Arroces",
  });

  // Cargar productos desde el backend
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getAllProducts();
        
        // Debug: Ver qué nos devuelve el backend
        console.log("Productos cargados desde backend:", data);
        console.log("Primer producto:", data[0]);
        
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

  // Debug: Ver productos filtrados
  console.log("Categoría actual:", categoriaActual);
  console.log("Productos filtrados:", productosFiltrados);

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-700">Cargando menú...</p>
          <p className="text-gray-500 mt-2">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error al cargar el menú
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex md:min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Izquierdo: Categorías */}
      <CategorySidebar
        categoriaActual={categoriaActual}
        setCategoriaActual={setCategoriaActual}
        productosDisponibles={productos}
      />

      {/* Contenido Central: Productos */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:mr-96">
        <div className="max-w-6xl mx-auto">
          {/* Header Mejorado */}
          <header className="mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tight">
                    {categoriaActual.nombre}
                  </h1>
                  <p className="text-gray-500 mt-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {productosFiltrados.length} productos disponibles
                  </p>
                </div>
                
                {/* Badge de Categoría */}
                <div className="hidden md:block">
                  <div className="bg-gradient-to-r from-primary to-red-700 text-white px-6 py-3 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Categoría
                    </p>
                    <p className="text-2xl font-black">{categoriaActual.nombre}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Grid de Productos */}
          {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  No hay productos disponibles
                </h3>
                <p className="text-gray-500">
                  Por favor selecciona otra categoría
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in">
              {productosFiltrados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Sidebar Derecho: Resumen del Pedido */}
      <OrderSummary />
    </div>
  );
}