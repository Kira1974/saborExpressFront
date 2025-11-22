import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { formatMoney } from "../../helpers";

export default function Kitchen() {
  // 1. Estado inicial vacío
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // --- ZONA DE DATOS DE PRUEBA (MOCK DATA) ---
    // Para ver la cocina con pedidos de ejemplo, descomenta el bloque de abajo:

    /*
        const PEDIDOS_MOCK = [
            {
                id: 1,
                turno: "001",
                usuario: "Cliente Kiosco",
                total: 68000,
                productos: [
                    { id: 101, nombre: "Caja de Arroz (Todas las carnes)", cantidad: 1, notas: "Sin raíces chinas" },
                    { id: 606, nombre: "Gaseosa 3 Litros", cantidad: 1 }
                ],
                estado: "pendiente"
            },
            {
                id: 2,
                turno: "002",
                usuario: "Cliente Kiosco",
                total: 45000,
                productos: [
                    { id: 301, nombre: "1 Pollo Broaster", cantidad: 1, notas: "Papas bien crocantes" },
                    { id: 610, nombre: "Coca-Cola 500ml", cantidad: 2 }
                ],
                estado: "pendiente"
            },
            {
                id: 3,
                turno: "003",
                usuario: "Cliente Kiosco",
                total: 23000,
                productos: [
                    { id: 402, nombre: "1/2 Pollo Mixto", cantidad: 1 }
                ],
                estado: "pendiente"
            }
        ];
        setPedidos(PEDIDOS_MOCK);
        */

    console.log("Pantalla de cocina lista. Esperando pedidos...");
  }, []);

  const completarOrden = (id) => {
    // 1. Eliminamos visualmente la tarjeta
    const pedidosActualizados = pedidos.filter((pedido) => pedido.id !== id);
    setPedidos(pedidosActualizados);

    // 2. Notificación
    toast.success(`Pedido #${id} marcado como LISTO`);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-black text-gray-800 mb-10">
        Cocina - Pedidos Pendientes
      </h1>

      {pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 opacity-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-32 h-32 text-gray-400 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
          <p className="text-center text-2xl text-gray-500 font-bold">
            No hay pedidos pendientes 🎉
          </p>
          <p className="text-gray-400">
            Los nuevos pedidos aparecerán aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white shadow-xl rounded-xl border-l-8 border-primary overflow-hidden transform transition-all hover:-translate-y-1"
            >
              {/* Header de la Comanda */}
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">
                    Turno
                  </span>
                  <p className="text-4xl font-black text-gray-800">
                    {pedido.turno}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-mono mb-1">
                    ID: #{pedido.id}
                  </p>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                    {pedido.estado}
                  </span>
                </div>
              </div>

              {/* Cuerpo (Lista de productos) */}
              <div className="p-5 space-y-4 min-h-[200px]">
                {pedido.productos.map((producto, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <span className="bg-primary text-white font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm flex-shrink-0">
                        {producto.cantidad}
                      </span>
                      <div>
                        <p className="text-lg font-bold text-gray-700 leading-snug">
                          {producto.nombre}
                        </p>
                        {/* Notas de cocina */}
                        {producto.notas && (
                          <p className="text-sm text-red-600 font-bold italic mt-1 bg-red-50 p-1 rounded">
                            ⚠️ Nota: {producto.notas}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer (Botón de Acción) */}
              <div className="p-4 bg-gray-50 border-t">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white w-full py-3 px-4 uppercase font-black rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                  onClick={() => completarOrden(pedido.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Marcar como Listo
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 font-mono">
                  Entrada: 10:30 AM
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
