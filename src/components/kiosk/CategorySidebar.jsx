import { ShoppingBag, Drumstick, Flame, Pizza, Package, Coffee } from "lucide-react";

const categorias = [
  { id: "ARROCES", nombre: "Arroces", icono: ShoppingBag, color: "from-orange-500 to-red-500" },
  { id: "POLLO_ASADO", nombre: "Pollo Asado", icono: Drumstick, color: "from-yellow-600 to-orange-600" },
  { id: "POLLO_BROASTER", nombre: "Pollo Broaster", icono: Flame, color: "from-red-600 to-pink-600" },
  { id: "POLLO_MIXTO", nombre: "Pollo Mixto", icono: Pizza, color: "from-purple-600 to-pink-600" },
  { id: "COMBOS", nombre: "Combos", icono: Package, color: "from-green-600 to-teal-600" },
  { id: "BEBIDAS", nombre: "Bebidas", icono: Coffee, color: "from-blue-600 to-cyan-600" },
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
    <aside className="md:w-80 md:h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 overflow-y-scroll custom-scrollbar shadow-2xl z-10 flex flex-col">
      {/* Header */}
      <div className="p-8 bg-gradient-to-r from-primary to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_white_2px,_transparent_2px)] bg-[length:30px_30px]"></div>
<div className="relative z-10">
<h2 className="text-3xl font-black text-white text-center tracking-wide mb-2">
SABOR EXPRESS
</h2>
<p className="text-center text-yellow-300 font-bold text-sm uppercase tracking-wider">
Menú Digital
</p>
</div>
</div>{/* Lista de Categorías */}
  <div className="mt-2 flex-1 p-2">
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
              ? "bg-gradient-to-r " + categoria.color + " text-white shadow-xl scale-105"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          } 
          text-left font-bold w-full p-4 rounded-xl cursor-pointer flex items-center gap-4 border-2 ${
            isActive ? "border-white" : "border-transparent"
          } transition-all duration-300 mb-3 group relative overflow-hidden`}
          onClick={() => setCategoriaActual(categoria)}
        >
          {/* Efecto de brillo */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
          )}

          {/* Contenido */}
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div
              className={`${
                isActive ? "bg-white/20" : "bg-gray-700"
              } p-3 rounded-xl transition-all`}
            >
              <Icon className="w-6 h-6" strokeWidth={2.5} />
            </div>

            <div className="flex-1">
              <p className="text-lg font-black">{categoria.nombre}</p>
              <p
                className={`text-xs font-medium ${
                  isActive ? "text-white/80" : "text-gray-500"
                }`}
              >
                {count} productos
              </p>
            </div>

            {/* Indicador de selección */}
            {isActive && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </div>
        </button>
      );
    })}
  </div>

  {/* Footer del Sidebar */}
  <div className="p-4 bg-gray-900 border-t border-gray-700">
    <p className="text-center text-gray-500 text-xs">
      Toca una categoría para ver productos
    </p>
  </div>
</aside>
);
}