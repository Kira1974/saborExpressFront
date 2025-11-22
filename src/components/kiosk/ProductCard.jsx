import useCart from "../../hooks/useCart";
import { formatMoney } from "../../helpers/index";

export default function ProductCard({ producto }) {
  const { agregarProducto } = useCart();
  const { nombre, precio, imagen, descripcion } = producto;

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4 bg-white flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      {/* Imagen del producto */}
      <div className="h-40 w-full overflow-hidden rounded-t-xl mb-3 relative bg-gray-100">
        <img
          src={`/img/${imagen}.jpg`}
          alt={`Imagen de ${nombre}`}
          className="w-full h-full object-cover"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/300?text=SaborExpress")
          }
        />
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">
          {nombre}
        </h3>

        {/* Mostramos la descripción si existe (acompañamientos) */}
        {descripcion && (
          <p className="text-gray-500 text-xs mt-2 italic border-l-2 border-primary pl-2">
            {descripcion}
          </p>
        )}

        <div className="mt-auto pt-4">
          <p className="text-primary text-2xl font-black mb-3">
            {formatMoney(precio)}
          </p>

          <button
            type="button"
            className="bg-primary hover:bg-red-700 w-full p-2 text-white font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
            onClick={() => agregarProducto(producto)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
