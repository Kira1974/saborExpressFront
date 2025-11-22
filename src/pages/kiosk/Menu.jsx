import { useEffect, useState } from "react";
import ProductCard from "../../components/kiosk/ProductCard";
import CategorySidebar from "../../components/kiosk/CategorySidebar";
import OrderSummary from "../../components/kiosk/OrderSummary"; // <--- NUEVO IMPORT

// --- BASE DE DATOS LOCAL DEL MENÚ ---
// Los nombres de 'imagen' coinciden con los archivos en public/img/
const PRODUCTOS_DATA = [
  // 1. ARROCES - TODAS LAS CARNES
  {
    id: 101,
    nombre: "Caja de Arroz (Todas las carnes)",
    precio: 68000,
    categoria: "Arroces",
    imagen: "arroz-carnes-caja",
    descripcion: "Caja completa. Incluye todas las carnes especial.",
  },
  {
    id: 102,
    nombre: "1/2 Caja de Arroz (Todas las carnes)",
    precio: 40000,
    categoria: "Arroces",
    imagen: "arroz-carnes-media",
    descripcion: "Media caja de arroz con todas las carnes.",
  },
  {
    id: 103,
    nombre: "1/4 Caja de Arroz (Todas las carnes)",
    precio: 30000,
    categoria: "Arroces",
    imagen: "arroz-carnes-cuarto",
    descripcion: "Cuarto de caja de arroz con todas las carnes.",
  },

  // ARROCES - POLLO Y CAMARÓN
  {
    id: 104,
    nombre: "Caja Arroz Pollo y Camarón",
    precio: 75000,
    categoria: "Arroces",
    imagen: "arroz-camaron-caja",
    descripcion: "Arroz especial con pollo y camarón.",
  },
  {
    id: 105,
    nombre: "1/2 Caja Arroz Pollo y Camarón",
    precio: 45000,
    categoria: "Arroces",
    imagen: "arroz-camaron-media",
    descripcion: "Media caja con pollo y camarón.",
  },
  {
    id: 106,
    nombre: "1/4 Caja Arroz Pollo y Camarón",
    precio: 33000,
    categoria: "Arroces",
    imagen: "arroz-camaron-cuarto",
    descripcion: "Cuarto de caja con pollo y camarón.",
  },

  // 2. POLLO ASADO
  {
    id: 201,
    nombre: "1 Pollo Asado",
    precio: 40000,
    categoria: "Pollo Asado",
    imagen: "pollo-asado-entero",
    descripcion: "Acompañado con papa salada, maduro y arepa.",
  },
  {
    id: 202,
    nombre: "1/2 Pollo Asado",
    precio: 22000,
    categoria: "Pollo Asado",
    imagen: "pollo-asado-medio",
    descripcion: "Acompañado con papa salada, maduro y arepa.",
  },
  {
    id: 203,
    nombre: "1/4 Pollo Asado",
    precio: 14000,
    categoria: "Pollo Asado",
    imagen: "pollo-asado-cuarto",
    descripcion: "Acompañado con papa salada, maduro y arepa.",
  },

  // 3. POLLO BROASTER
  {
    id: 301,
    nombre: "1 Pollo Broaster",
    precio: 45000,
    categoria: "Pollo Broaster",
    imagen: "pollo-broaster-entero",
    descripcion: "Acompañado con papa a la francesa, maduro y arepa.",
  },
  {
    id: 302,
    nombre: "1/2 Pollo Broaster",
    precio: 25000,
    categoria: "Pollo Broaster",
    imagen: "pollo-broaster-medio",
    descripcion: "Acompañado con papa a la francesa, maduro y arepa.",
  },
  {
    id: 303,
    nombre: "1/4 Pollo Broaster",
    precio: 14000,
    categoria: "Pollo Broaster",
    imagen: "pollo-broaster-cuarto",
    descripcion: "Acompañado con papa a la francesa, maduro y arepa.",
  },

  // 4. POLLO MIXTO
  {
    id: 401,
    nombre: "1 Pollo Mixto",
    precio: 42000,
    categoria: "Pollo Mixto",
    imagen: "pollo-mixto-entero",
    descripcion:
      "1/2 Asado + 1/2 Broaster. Incluye papa francesa, papa salada, maduro y arepa.",
  },
  {
    id: 402,
    nombre: "1/2 Pollo Mixto",
    precio: 23000,
    categoria: "Pollo Mixto",
    imagen: "pollo-mixto-medio",
    descripcion:
      "1/4 Asado + 1/4 Broaster. Incluye papa francesa, papa salada, maduro y arepa.",
  },

  // 5. COMBOS (Arroz Chino + Pollo)
  {
    id: 501,
    nombre: "Combo: 1 Caja Arroz + 1 Pollo",
    precio: 65000,
    categoria: "Combos",
    imagen: "combo-1caja-1pollo",
    descripcion: "Arroz chino sencillo + 1 Pollo (Asado o Broaster).",
  },
  {
    id: 502,
    nombre: "Combo: 1/2 Arroz + 1 Pollo",
    precio: 50000,
    categoria: "Combos",
    imagen: "combo-media-1pollo",
    descripcion: "1/2 Caja Arroz + 1 Pollo (Asado o Broaster).",
  },
  {
    id: 503,
    nombre: "Combo: 1 Arroz + 1/2 Pollo",
    precio: 50000,
    categoria: "Combos",
    imagen: "combo-1caja-mediopollo",
    descripcion: "1 Caja Arroz + 1/2 Pollo (Asado o Broaster).",
  },
  {
    id: 504,
    nombre: "Combo: 1/2 Arroz + 1/2 Pollo",
    precio: 38000,
    categoria: "Combos",
    imagen: "combo-media-mediopollo",
    descripcion: "1/2 Caja Arroz + 1/2 Pollo (Asado o Broaster).",
  },
  {
    id: 505,
    nombre: "Combo: 1/4 Arroz + 1/2 Pollo",
    precio: 30000,
    categoria: "Combos",
    imagen: "combo-cuarto-mediopollo",
    descripcion: "1/4 Caja Arroz + 1/2 Pollo (Asado o Broaster).",
  },
  {
    id: 506,
    nombre: "Combo: 1 Porción Arroz + 1/2 Pollo",
    precio: 24000,
    categoria: "Combos",
    imagen: "combo-porcion-mediopollo",
    descripcion: "1 Porción Arroz + 1/2 Pollo (Asado o Broaster).",
  },
  {
    id: 507,
    nombre: "Combo: 2 Porciones Arroz + 1/4 Pollo",
    precio: 20000,
    categoria: "Combos",
    imagen: "combo-2porciones-cuarto",
    descripcion: "2 Porciones Arroz + 1/4 Pollo (Asado o Broaster).",
  },

  // 6. BEBIDAS
  {
    id: 601,
    nombre: "Agua en bolsa",
    precio: 600,
    categoria: "Bebidas",
    imagen: "agua-bolsa",
  },
  {
    id: 602,
    nombre: "Botella agua mini",
    precio: 1000,
    categoria: "Bebidas",
    imagen: "agua-botella",
  },
  {
    id: 603,
    nombre: "Botella agua personal",
    precio: 2000,
    categoria: "Bebidas",
    imagen: "agua-personal",
  },
  {
    id: 604,
    nombre: "Jugo personal",
    precio: 4000,
    categoria: "Bebidas",
    imagen: "jugo-hit",
  },
  {
    id: 605,
    nombre: "Caja de jugo",
    precio: 7000,
    categoria: "Bebidas",
    imagen: "jugo-caja",
  },
  {
    id: 606,
    nombre: "Gaseosa 3 Litros",
    precio: 12000,
    categoria: "Bebidas",
    imagen: "gaseosa-3l",
    descripcion: "Coca-Cola, Manzana o Colombiana",
  },
  {
    id: 607,
    nombre: "Gaseosa 1.5 Litros",
    precio: 8000,
    categoria: "Bebidas",
    imagen: "gaseosa-15l",
    descripcion: "Coca-Cola, Manzana o Colombiana",
  },
  {
    id: 608,
    nombre: "Gaseosa 1 Litro",
    precio: 6000,
    categoria: "Bebidas",
    imagen: "gaseosa-1l",
    descripcion: "Coca-Cola, Manzana o Colombiana",
  },
  {
    id: 609,
    nombre: "Gaseosa Personal",
    precio: 3000,
    categoria: "Bebidas",
    imagen: "gaseosa-personal",
    descripcion: "Coca-Cola, Manzana o Colombiana",
  },
  {
    id: 610,
    nombre: "Coca-Cola 500ml",
    precio: 4000,
    categoria: "Bebidas",
    imagen: "coca-500",
  },
  {
    id: 611,
    nombre: "Coca-Cola Mini",
    precio: 2000,
    categoria: "Bebidas",
    imagen: "coca-mini",
  },
  {
    id: 612,
    nombre: "Pony Malta Personal",
    precio: 3000,
    categoria: "Bebidas",
    imagen: "pony",
  },
];

export default function Menu() {
  const [productos, setProductos] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState({
    id: 1,
    nombre: "Arroces",
  });

  useEffect(() => {
    // Simulamos carga de API
    setProductos(PRODUCTOS_DATA);
  }, []);

  const productosFiltrados = productos.filter(
    (producto) => producto.categoria === categoriaActual.nombre
  );

  return (
    <div className="md:flex md:min-h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Izquierdo: Categorías */}
      <CategorySidebar
        categoriaActual={categoriaActual}
        setCategoriaActual={setCategoriaActual}
      />

      {/* Contenido Central: Productos */}
      {/* 'md:mr-96' crea el espacio para que el carrito no tape los productos */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:mr-96">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-black text-gray-800 uppercase border-b-4 border-primary inline-block pb-2">
              {categoriaActual.nombre}
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Selecciona tus productos favoritos para ordenar.
            </p>
          </header>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </main>

      {/* Sidebar Derecho: Resumen del Pedido */}
      <OrderSummary />
    </div>
  );
}
