import { ShoppingBag, Drumstick, Flame, Pizza, Package, Coffee } from "lucide-react";

const categorias = [
  { id: "ARROCES", nombre: "Arroces", icono: ShoppingBag, color: "from-orange-500 to-red-500" },
  { id: "POLLO_ASADO", nombre: "Pollo Asado", icono: Drumstick, color: "from-yellow-500 to-orange-500" },
  { id: "POLLO_BROASTER", nombre: "Pollo Broaster", icono: Flame, color: "from-red-500 to-pink-500" },
  { id: "POLLO_MIXTO", nombre: "Pollo Mixto", icono: Pizza, color: "from-purple-500 to-pink-500" },
  { id: "COMBOS", nombre: "Combos", icono: Package, color: "from-green-500 to-emerald-500" },
  { id: "BEBIDAS", nombre: "Bebidas", icono: Coffee, color: "from-blue-500 to-cyan-500" },
];

export default function CategorySidebar({
  categoriaActual,
  setCategoriaActual,
  productosDisponibles = [],
}) {
  // Contar productos por categoría
  const contarProductos = (categoriaId) => {
    return productosDisponibles.filter(
      (p) => p.categoria === categoriaId && p.disponible
    ).length;
  };

  return (
    <aside className="relative z-10 w-80 backdrop-blur-xl bg-white/5 border-r border-white/10 overflow-y-auto flex flex-col">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Flame className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sabor Express</h2>
            <p className="text-xs text-white/60 font-medium tracking-wider">Menú Digital</p>
          </div>
        </div>
      </div>

      {/* Lista de Categorías */}
      <div className="p-4 space-y-3 flex-1">
        {categorias.map((categoria) => {
          const Icon = categoria.icono;
          const count = contarProductos(categoria.id);
          const isActive = categoriaActual.id === categoria.id;

          return (
            <button
              key={categoria.id}
              type="button"
              className={`${
                isActive
                  ? "bg-gradient-to-r " + categoria.color + " text-white shadow-xl scale-[1.02] border-white/30"
                  : "backdrop-blur-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border-white/10"
              } 
              text-left font-bold w-full p-4 rounded-xl cursor-pointer flex items-center gap-3 border transition-all duration-300 group relative overflow-hidden`}
              onClick={() => setCategoriaActual(categoria)}
            >
              {/* Efecto de brillo al hover */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:translate-x-full transform -translate-x-full"></div>
              )}

              {/* Contenido */}
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div
                  className={`${
                    isActive ? "bg-white/20" : "bg-white/10 group-hover:bg-white/15"
                  } p-3 rounded-xl transition-all duration-300`}
                >
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>

                <div className="flex-1">
                  <p className="text-base font-bold">{categoria.nombre}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {count > 0 && isActive && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    )}
                    <p
                      className={`text-xs font-medium ${
                        isActive ? "text-white/90" : "text-white/50 group-hover:text-white/70"
                      }`}
                    >
                      {count} productos
                    </p>
                  </div>
                </div>

                {/* Indicador de selección */}
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-white/10 backdrop-blur-xl bg-white/5">
        <div className="flex items-center justify-center gap-2 text-white/40 text-xs font-medium">
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          <p>Toca una categoría para ver productos</p>
        </div>
      </div>
    </aside>
  );
}