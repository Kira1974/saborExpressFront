const categorias = [
  { id: 1, nombre: "Arroces", icono: "arroz" },
  { id: 2, nombre: "Pollo Asado", icono: "pollo" },
  { id: 3, nombre: "Pollo Broaster", icono: "broaster" },
  { id: 4, nombre: "Pollo Mixto", icono: "mixto" },
  { id: 5, nombre: "Combos", icono: "combo" },
  { id: 6, nombre: "Bebidas", icono: "bebida" },
];

export default function CategorySidebar({
  categoriaActual,
  setCategoriaActual,
}) {
  return (
    <aside className="md:w-72 md:h-screen bg-white border-r overflow-y-scroll custom-scrollbar shadow-xl z-10 flex flex-col">
      <div className="p-8 bg-primary">
        <h2 className="text-3xl font-black text-white text-center tracking-wide">
          SABOR EXPRESS
        </h2>
        <p className="text-center text-yellow-300 font-bold mt-2 text-sm uppercase">
          Menú Oficial
        </p>
      </div>

      <div className="mt-4 flex-1">
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            type="button"
            className={`${
              categoriaActual.id === categoria.id
                ? "bg-yellow-50 border-l-4 border-primary text-primary"
                : "bg-white text-gray-600"
            } 
                        text-lg font-bold w-full p-5 hover:bg-gray-50 cursor-pointer flex items-center gap-4 border-b transition-all text-left`}
            onClick={() => setCategoriaActual(categoria)}
          >
            {/* Puedes agregar iconos reales aquí luego */}
            <span>{categoria.nombre}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
