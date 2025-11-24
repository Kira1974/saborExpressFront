import { X, Trash2, Plus, Minus, ShoppingBag, AlertCircle } from "lucide-react";
import useCart from "../../hooks/useCart";
import { formatMoney } from "../../helpers";
import { useState } from "react";
import { toast } from "react-toastify";
import { orderService } from "../../services/orderService";
import { useNavigate } from "react-router-dom";

export default function OrderSummary({ onClose }) {
  const { pedido, total, agregarProducto, eliminarProducto, vaciarPedido } = useCart();
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  const handleConfirmarPedido = async () => {
    if (pedido.length === 0) {
      toast.warning("Agrega productos antes de confirmar", {
        position: "top-center",
      });
      return;
    }

    try {
      setProcesando(true);
      
      // Preparar items del pedido - El backend solo necesita productId y cantidad
      const items = pedido.map((item) => ({
        productId: item.id,
        cantidad: item.cantidad,
      }));

      // Enviar pedido al backend
      const response = await orderService.createOrder({ items });

      // Mostrar número de turno
      toast.success(
        `¡Pedido confirmado! Tu número de turno es: ${response.data.numeroTurno}`,
        {
          position: "top-center",
          autoClose: 5000,
        }
      );

      // Limpiar carrito
      vaciarPedido();
      
      // Cerrar resumen
      onClose();

      // Opcional: Redirigir a una página de confirmación
      // navigate(`/turno/${response.numeroTurno}`);
    } catch (error) {
      console.error("Error al confirmar pedido:", error);
      toast.error("Error al procesar el pedido. Intenta de nuevo.", {
        position: "top-center",
      });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="h-full backdrop-blur-2xl bg-slate-900/95 border-l border-white/10 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mi Pedido</h2>
              <p className="text-sm text-white/60 font-medium">
                {pedido.length} {pedido.length === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 backdrop-blur-xl bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/10 group"
          >
            <X className="w-5 h-5 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all" strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Línea decorativa */}
        <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
      </div>

      {/* Lista de Productos */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {pedido.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center max-w-sm">
              <div className="w-20 h-20 backdrop-blur-xl bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-white/30" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-white/60 mb-3">
                Tu carrito está vacío
              </h3>
              <p className="text-white/40">
                Agrega productos del menú para comenzar tu pedido
              </p>
            </div>
          </div>
        ) : (
          <>
            {pedido.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] group"
              >
                <div className="flex gap-4">
                  {/* Imagen */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x80/1e293b/94a3b8?text=SE";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-base mb-1 line-clamp-1">
                      {item.nombre}
                    </h4>
                    <p className="text-lg font-black text-white/90 tabular-nums">
                      {formatMoney(item.precio)}
                    </p>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => eliminarProducto(item.id)}
                        className="w-8 h-8 backdrop-blur-xl bg-white/10 hover:bg-red-500/20 hover:border-red-400/30 rounded-lg flex items-center justify-center transition-all border border-white/10 group/btn"
                      >
                        <Minus className="w-4 h-4 text-white/70 group-hover/btn:text-red-400" strokeWidth={2.5} />
                      </button>

                      <span className="text-lg font-bold text-white tabular-nums min-w-[2rem] text-center">
                        {item.cantidad}
                      </span>

                      <button
                        onClick={() => agregarProducto(item)}
                        className="w-8 h-8 backdrop-blur-xl bg-white/10 hover:bg-green-500/20 hover:border-green-400/30 rounded-lg flex items-center justify-center transition-all border border-white/10 group/btn"
                      >
                        <Plus className="w-4 h-4 text-white/70 group-hover/btn:text-green-400" strokeWidth={2.5} />
                      </button>

                      <button
                        onClick={() => {
                          // Eliminar completamente el producto
                          for (let i = 0; i < item.cantidad; i++) {
                            eliminarProducto(item.id);
                          }
                        }}
                        className="ml-auto w-8 h-8 backdrop-blur-xl bg-white/10 hover:bg-red-500/20 hover:border-red-400/30 rounded-lg flex items-center justify-center transition-all border border-white/10 group/btn"
                      >
                        <Trash2 className="w-4 h-4 text-white/70 group-hover/btn:text-red-400" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-medium text-white/60">Subtotal</span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    {formatMoney(item.precio * item.cantidad)}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer con Total y Botones */}
      {pedido.length > 0 && (
        <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 p-6 space-y-4">
          {/* Total */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-1">
                  Total a Pagar
                </p>
                <p className="text-4xl font-black text-white tabular-nums">
                  {formatMoney(total)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmarPedido}
              disabled={procesando}
              className="w-full backdrop-blur-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 border border-white/20 group"
            >
              {procesando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Confirmar Pedido</span>
                </>
              )}
            </button>

            <button
              onClick={vaciarPedido}
              className="w-full backdrop-blur-xl bg-white/10 hover:bg-white/15 text-white/90 hover:text-white font-bold py-3 px-6 rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              <span>Vaciar Carrito</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}