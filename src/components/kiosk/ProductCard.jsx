import useCart from "../../hooks/useCart";
import { formatMoney } from "../../helpers/index";
import { Plus, Sparkles } from "lucide-react";

export default function ProductCard({ producto }) {
  const { agregarProducto } = useCart();

  const {
    nombre = "Producto sin nombre",
    precio = 0,
    imagen = "placeholder",
    descripcion = "",
    destacado = false,
  } = producto || {};

  // 👇 AQUÍ ESTÁ EL TRUCO PARA "QUEMAR" LAS IMÁGENES
  // 1. Si la imagen comienza con "http", es una URL externa (la dejamos igual).
  // 2. Si no, asumimos que es un archivo local en tu carpeta "public/img/".
  //    Así, si el backend manda "pollo-asado", aquí lo convertimos a "/img/pollo-asado.jpg"
  const imageUrl = imagen?.startsWith("http") ? imagen : `/img/${imagen}.jpg`;

  return (
    <div className="group relative animate-fade-in h-full flex flex-col">
      {/* Efecto de brillo sutil al hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-orange-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 rounded-2xl"></div>

      {/* Card principal */}
      <div className="relative flex-1 flex flex-col backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl group-hover:translate-y-[-4px]">
        {/* Badge de Destacado */}
        {destacado && (
          <div className="absolute top-4 right-4 z-10 backdrop-blur-xl bg-gradient-to-r from-amber-500/90 to-yellow-500/90 border border-amber-300/30 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              Destacado
            </span>
          </div>
        )}

        {/* Contenedor de imagen */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shrink-0">
          <img
            src={imageUrl} // 👈 USAMOS LA RUTA CALCULADA AQUÍ
            alt={nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Si la imagen no existe en la carpeta, ponemos esta por defecto para que no se vea roto
              e.target.src =
                "https://via.placeholder.com/400x300/1e293b/94a3b8?text=Sin+Imagen";
              e.target.onerror = null;
            }}
          />

          {/* Overlay con gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

          {/* Decoración de esquina */}
          <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Contenido */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-red-400 transition-colors">
            {nombre}
          </h3>

          {descripcion && (
            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed mt-2 flex-1">
              {descripcion}
            </p>
          )}

          {/* Línea divisoria sutil */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

          {/* Footer con Precio y Botón */}
          <div className="flex items-center justify-between gap-4 mt-auto">
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">
                Precio
              </p>
              <p className="text-2xl font-black text-white tabular-nums">
                {formatMoney(precio)}
              </p>
            </div>

            <button
              onClick={() => agregarProducto(producto)}
              className="backdrop-blur-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl group/btn border border-white/20 active:scale-95"
            >
              <Plus
                className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300"
                strokeWidth={2.5}
              />
              <span className="text-sm">Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
