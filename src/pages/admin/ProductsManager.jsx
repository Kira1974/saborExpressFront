import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Loader2,
  RefreshCw,
  Search,
  Package,
} from "lucide-react";
import { productService } from "../../services/productService";
import { formatMoney } from "../../helpers";
import ProductFormModal from "../../components/admin/ProductFormModal";

const categorias = {
  ARROCES: "Arroces",
  POLLO_ASADO: "Pollo Asado",
  POLLO_BROASTER: "Pollo Broaster",
  POLLO_MIXTO: "Pollo Mixto",
  COMBOS: "Combos",
  BEBIDAS: "Bebidas",
};

export default function ProductsManager() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Cargar productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProductsForAdmin();
      setProductos(response.data || []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar los productos", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const matchSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      filterCategory === "ALL" || producto.categoria === filterCategory;
    return matchSearch && matchCategory;
  });

  // Habilitar/Deshabilitar
  const handleToggleAvailability = async (id) => {
    try {
      const response = await productService.toggleAvailability(id);
      toast.success(response.message, { position: "top-center" });
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Error al cambiar disponibilidad",
        { position: "top-center" }
      );
    }
  };

  // Destacar/Desmarcar
  const handleToggleFeatured = async (id) => {
    try {
      const response = await productService.toggleFeatured(id);
      toast.success(response.message, { position: "top-center" });
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Error al cambiar destacado",
        { position: "top-center" }
      );
    }
  };

  // Eliminar producto
  const handleDelete = async (id, nombre) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar permanentemente el producto "${nombre}"?\n\n⚠️ Esta acción NO se puede deshacer.`
      )
    )
      return;

    try {
      const response = await productService.deleteProduct(id);
      toast.success(response.message, { position: "top-center" });
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Error al eliminar producto",
        { position: "top-center" }
      );
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setShowModal(true);
  };

  // Cerrar modal y recargar
  const handleCloseModal = (shouldReload) => {
    setShowModal(false);
    setEditingProduct(null);
    if (shouldReload) {
      loadProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-800 mb-1">
                Gestión de Productos
              </h1>
              <p className="text-gray-600 font-medium text-lg">
                Crear, editar y administrar el menú del kiosco
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProducts}
              disabled={loading}
              className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 text-blue-700 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:shadow-md disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>

            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Crear Producto
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            />
          </div>

          {/* Filtro por categoría */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all font-medium"
          >
            <option value="ALL">Todas las categorías</option>
            {Object.entries(categorias).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Estadísticas */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-1">
              Total
            </p>
            <p className="text-3xl font-black text-blue-700">{productos.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4">
            <p className="text-sm font-bold text-green-600 uppercase tracking-wide mb-1">
              Disponibles
            </p>
            <p className="text-3xl font-black text-green-700">
              {productos.filter((p) => p.disponible).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4">
            <p className="text-sm font-bold text-red-600 uppercase tracking-wide mb-1">
              Deshabilitados
            </p>
            <p className="text-3xl font-black text-red-700">
              {productos.filter((p) => !p.disponible).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-4">
            <p className="text-sm font-bold text-yellow-600 uppercase tracking-wide mb-1">
              Destacados
            </p>
            <p className="text-3xl font-black text-yellow-700">
              {productos.filter((p) => p.destacado).length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-gray-200">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-gray-700 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500 font-medium text-lg mb-6">
            Intenta con otros filtros o crea un nuevo producto
          </p>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Crear Primer Producto
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-700 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-700 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-700 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700 uppercase tracking-wider">
                    Destacado
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productosFiltrados.map((producto) => (
                  <tr
                    key={producto.id}
                    className={`${
                      !producto.disponible ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=SE";
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-base">
                            {producto.nombre}
                          </p>
                          {producto.descripcion && (
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {producto.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-300 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                        {categorias[producto.categoria]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-black text-gray-800 tabular-nums">
                        {formatMoney(producto.precio)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleAvailability(producto.id)}
                        className={`${
                          producto.disponible
                            ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                            : "bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                        } border-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-2 mx-auto transition-all`}
                      >
                        {producto.disponible ? (
                          <>
                            <Eye className="w-4 h-4" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Oculto
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(producto.id)}
                        className={`${
                          producto.destacado
                            ? "bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200"
                            : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                        } border-2 w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all`}
                      >
                        {producto.destacado ? (
                          <Star className="w-5 h-5 fill-current" />
                        ) : (
                          <StarOff className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 text-blue-700 w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id, producto.nombre)}
                          className="bg-red-100 hover:bg-red-200 border-2 border-red-300 text-red-700 w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}