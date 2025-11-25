import { useState, useEffect } from "react";
import { X, Loader2, Save, Package } from "lucide-react";
import { toast } from "react-toastify";
import { productService } from "../../services/productService";

const categorias = {
  ARROCES: "Arroces",
  POLLO_ASADO: "Pollo Asado",
  POLLO_BROASTER: "Pollo Broaster",
  POLLO_MIXTO: "Pollo Mixto",
  COMBOS: "Combos",
  BEBIDAS: "Bebidas",
};

export default function ProductFormModal({ product, onClose }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "ARROCES",
    imagen: "",
    disponible: true,
    destacado: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar datos si es edición
  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio: product.precio || "",
        categoria: product.categoria || "ARROCES",
        imagen: product.imagen || "",
        disponible: product.disponible ?? true,
        destacado: product.destacado ?? false,
      });
    }
  }, [product]);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validar formulario
  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres";
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = "La descripción no puede exceder 500 caracteres";
    }

    if (!formData.precio) {
      newErrors.precio = "El precio es requerido";
    } else if (isNaN(formData.precio) || Number(formData.precio) < 0) {
      newErrors.precio = "El precio debe ser un número mayor o igual a 0";
    }

    if (!formData.categoria) {
      newErrors.categoria = "La categoría es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Por favor corrige los errores del formulario", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        precio: Number(formData.precio),
        categoria: formData.categoria,
        imagen: formData.imagen.trim() || undefined,
        disponible: formData.disponible,
        destacado: formData.destacado,
      };

      if (isEditing) {
        const response = await productService.updateProduct(product.id, dataToSend);
        toast.success(response.message, { position: "top-center" });
      } else {
        const response = await productService.createProduct(dataToSend);
        toast.success(response.message, { position: "top-center" });
      }

      onClose(true); // Cerrar y recargar
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Error al guardar el producto",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => !loading && onClose(false)}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Package className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
                </h2>
                <p className="text-white/80 text-sm font-medium">
                  {isEditing ? "Modifica los datos del producto" : "Completa el formulario"}
                </p>
              </div>
            </div>
            <button
              onClick={() => !loading && onClose(false)}
              disabled={loading}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
            >
              <X className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nombre del Producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
                maxLength={100}
                className={`w-full px-4 py-3 border-2 ${
                  errors.nombre ? "border-red-300" : "border-gray-300"
                } rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all disabled:bg-gray-100`}
                placeholder="Ej: Caja de Arroz Completa"
              />
              {errors.nombre && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.nombre}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.nombre.length}/100 caracteres
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={loading}
                maxLength={500}
                rows={3}
                className={`w-full px-4 py-3 border-2 ${
                  errors.descripcion ? "border-red-300" : "border-gray-300"
                } rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none disabled:bg-gray-100`}
                placeholder="Ej: Arroz chino con todas las carnes especiales"
              />
              {errors.descripcion && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.descripcion}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.descripcion.length}/500 caracteres
              </p>
            </div>

            {/* Grid: Precio y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Precio */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Precio (COP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  step="100"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.precio ? "border-red-300" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all disabled:bg-gray-100`}
                  placeholder="25000"
                />
                {errors.precio && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    {errors.precio}
                  </p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.categoria ? "border-red-300" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all disabled:bg-gray-100`}
                >
                  {Object.entries(categorias).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    {errors.categoria}
                  </p>
                )}
              </div>
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                URL de Imagen (Opcional)
              </label>
              <input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all disabled:bg-gray-100"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deja vacío para usar imagen por defecto
              </p>
            </div>

            {/* Switches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Disponible */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-green-700 mb-1">
                      Producto Disponible
                    </p>
                    <p className="text-xs text-green-600">
                      Visible en el kiosco
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-6 h-6 accent-green-600 rounded"
                  />
                </label>
              </div>

              {/* Destacado */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-yellow-700 mb-1">
                      Producto Destacado
                    </p>
                    <p className="text-xs text-yellow-600">
                      Aparece primero
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-6 h-6 accent-yellow-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={() => onClose(false)}
                disabled={loading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditing ? "Actualizar" : "Crear Producto"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}