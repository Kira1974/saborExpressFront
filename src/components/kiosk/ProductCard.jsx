import useCart from "../../hooks/useCart";
import { formatMoney } from "../../helpers/index";
import { Plus, Star } from "lucide-react";

export default function ProductCard({ producto }) {
  const { agregarProducto } = useCart();
  
  // Desestructuración con validación
  const { 
    id,
    nombre = "Producto sin nombre", 
    precio = 0, 
    imagen = "placeholder", 
    descripcion = "", 
    destacado = false 
  } = producto || {};

  // Debug en consola (opcional, puedes eliminarlo después)
  console.log("Producto:", { id, nombre, precio, imagen });

  return (
    <div className="group border-2 border-gray-200 shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-2xl hover:border-primary transition-all duration-300 transform hover:-translate-y-2 relative">
      {/* Badge de Destacado */}
      {destacado && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 shadow-lg animate-pulse">
            <Star className="w-3 h-3 fill-current" />
            Destacado
          </div>
        </div>
      )}

      {/* Imagen del producto */}
      <div className="h-48 w-full overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={`/img/${imagen}.jpg`}
          alt={`Imagen de ${nombre}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Sabor+Express";
          }}
        />
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col">
        <div className="flex-1 mb-4">
          <h3 className="text-lg font-black text-gray-800 leading-tight mb-2 group-hover:text-primary transition-colors min-h-[3rem]">
            {nombre}
          </h3>

          {/* Descripción */}
          {descripcion && (
            <p className="text-gray-600 text-sm leading-relaxed border-l-4 border-primary pl-3 py-2 bg-red-50 rounded">
              {descripcion}
            </p>
          )}
        </div>

        {/* Footer con Precio y Botón */}
        <div className="mt-auto pt-4 border-t-2 border-gray-100 space-y-3">
          {/* Precio */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
              Precio
            </p>
            <p className="text-primary text-3xl font-black">
              {formatMoney(precio)}
            </p>
          </div>

          {/* Botón Agregar */}
          <button
            type="button"
            className="bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary w-full py-4 text-white font-black uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 group/btn"
            onClick={() => agregarProducto(producto)}
          >
            <Plus 
              className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" 
              strokeWidth={3} 
            />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}