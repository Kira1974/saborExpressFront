import { useEffect, useState } from "react";

// Simulación del servicio de productos (reemplaza con tu API real)
const productService = {
  async getProducts() {
    const response = await fetch('http://localhost:3000/api/v1/products');
    return response.json();
  },
  
  async createProduct(product) {
    const response = await fetch('http://localhost:3000/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(product)
    });
    return response.json();
  },
  
  async updateProduct(id, product) {
    const response = await fetch(`http://localhost:3000/api/v1/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(product)
    });
    return response.json();
  },
  
  async deleteProduct(id) {
    const response = await fetch(`http://localhost:3000/api/v1/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};

const categorias = [
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'PLATO_PRINCIPAL', label: 'Plato Principal' },
  { value: 'BEBIDA', label: 'Bebida' },
  { value: 'POSTRE', label: 'Postre' },
  { value: 'COMBO', label: 'Combo' }
];

const formatMoney = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('TODOS');
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'PLATO_PRINCIPAL',
    disponible: true,
    destacado: false
  });

  // Cargar productos
  const cargarProductos = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Abrir modal para crear nuevo producto
  const handleNuevoProducto = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: 'PLATO_PRINCIPAL',
      disponible: true,
      destacado: false
    });
    setShowModal(true);
  };

  // Abrir modal para editar producto
  const handleEditarProducto = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      categoria: producto.categoria,
      disponible: producto.disponible,
      destacado: producto.destacado || false
    });
    setShowModal(true);
  };

  // Guardar producto (crear o editar)
  const handleSubmit = async () => {
    if (!formData.nombre || !formData.precio) {
      alert('Por favor complete los campos requeridos');
      return;
    }
    
    const productData = {
      ...formData,
      precio: parseFloat(formData.precio)
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        alert('✅ Producto actualizado exitosamente');
      } else {
        await productService.createProduct(productData);
        alert('✅ Producto creado exitosamente');
      }
      
      setShowModal(false);
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('❌ Error al guardar el producto');
    }
  };

  // Eliminar producto
  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar el producto "${nombre}"?`)) {
      try {
        await productService.deleteProduct(id);
        alert('✅ Producto eliminado');
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('❌ Error al eliminar el producto');
      }
    }
  };

  // Toggle disponibilidad rápido
  const handleToggleDisponibilidad = async (producto) => {
    try {
      await productService.updateProduct(producto.id, {
        disponible: !producto.disponible
      });
      cargarProductos();
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'TODOS' || p.categoria === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-gray-800">Gestión de Productos</h1>
        <button
          onClick={handleNuevoProducto}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="TODOS">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        <button
          onClick={cargarProductos}
          className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Actualizar
        </button>
      </div>

      {/* Tabla de productos */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Producto</th>
                  <th className="py-3 px-4 text-left">Categoría</th>
                  <th className="py-3 px-4 text-left">Precio</th>
                  <th className="py-3 px-4 text-center">Disponible</th>
                  <th className="py-3 px-4 text-center">Destacado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-400">
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map(producto => (
                    <tr key={producto.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-gray-800">{producto.nombre}</p>
                          <p className="text-sm text-gray-500">{producto.descripcion}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                          {categorias.find(c => c.value === producto.categoria)?.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-800">
                        {formatMoney(producto.precio)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleDisponibilidad(producto)}
                          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                            producto.disponible 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {producto.disponible ? '✓ Disponible' : '✗ No disponible'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {producto.destacado ? (
                          <span className="text-yellow-500 text-xl">⭐</span>
                        ) : (
                          <span className="text-gray-300 text-xl">☆</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditarProducto(producto)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold transition-all"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(producto.id, producto.nombre)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold transition-all"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-red-600 text-white p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold">
                {editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: Bandeja Paisa"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Descripción del producto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Precio *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">Categoría *</label>
                  <select
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.disponible}
                    onChange={(e) => setFormData({...formData, disponible: e.target.checked})}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700 font-bold">Disponible para la venta</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({...formData, destacado: e.target.checked})}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700 font-bold">⭐ Producto destacado</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-all"
                >
                  {editingProduct ? '💾 Guardar Cambios' : '➕ Crear Producto'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-bold transition-all"
                >
                  ✖️ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}