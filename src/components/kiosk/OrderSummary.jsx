import { useState } from "react";
import useCart from "../../hooks/useCart";
import { formatMoney } from "../../helpers";
import { orderService } from "../../services/orderService";
import { toast } from "react-toastify";
import { ShoppingCart, Trash2, Plus, Minus, Send, Loader2, X } from "lucide-react";

export default function OrderSummary() {
  const { pedido, total, editarCantidad, eliminarProducto, vaciarPedido } = useCart();
  const [loading, setLoading] = useState(false);

  const confirmarPedido = async () => {
    if (pedido.length === 0) {
      toast.error("El carrito está vacío", {
        position: "top-center",
        toastId: "empty-cart",
      });
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el backend
      const items = pedido.map((item) => ({
        productId: item.id,
        cantidad: item.cantidad,
      }));

      // Crear orden en el backend
      const response = await orderService.createOrder({ items });

      toast.success(
        <div>
          <p className="font-black text-lg">¡Pedido Enviado!</p>
          <p className="text-2xl font-black text-primary mt-2">
            Tu turno es: {response.data.numeroTurno}
          </p>
          <p className="text-sm mt-2">Dirígete a caja para pagar</p>
        </div>,
        {
          autoClose: 8000,
          position: "top-center",
          className: "bg-white",
          toastId: "order-success",
        }
      );

      // Limpiar carrito
      vaciarPedido();

      // Disparar evento para actualizar otras pantallas
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error al crear orden:", error);
      toast.error(error.message || "Hubo un error al enviar el pedido", {
        position: "top-center",
        toastId: "order-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-full md:w-96 md:h-screen bg-white shadow-2xl p-6 flex flex-col fixed md:right-0 md:top-0 z-30 overflow-hidden border-l-4 border-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Mi Pedido
          </h2>
          {pedido.length > 0 && (
            <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-black">
              {pedido.length}
            </div>
          )}
        </div>
        <div className="h-1 bg-gradient-to-r from-primary to-red-700 rounded-full"></div>
      </div>

      {/* Lista de Productos */}
      <div className="flex-1 overflow-y-scroll custom-scrollbar space-y-4">
        {pedido.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 font-bold text-lg">
              Tu carrito está vacío
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Agrega productos para continuar
            </p>
          </div>
        ) : (
          pedido.map((producto) => (
            <div
              key={producto.id}
              className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl shadow-md border-2 border-gray-100 hover:border-primary transition-all relative group"
            >
              {/* Botón Eliminar */}
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => eliminarProducto(producto.id)}
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>

              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-8">
                  <p className="font-bold text-gray-800 text-sm leading-tight">
                    {producto.nombre}
                  </p>
                  <p className="text-primary font-black text-lg mt-1">
                    {formatMoney(producto.precio)}
                  </p>
                </div>
              </div>

              {/* Controles de Cantidad */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 bg-white rounded-lg shadow border-2 border-gray-200">
                  <button
                    type="button"
                    className="px-3 py-2 font-bold text-lg text-gray-600 hover:bg-red-50 hover:text-primary transition-colors rounded-l-lg"
                    onClick={() =>
                      editarCantidad(producto.id, producto.cantidad - 1)
                    }
                  >
                    <Minus className="w-4 h-4" strokeWidth={3} />
                  </button>
                  <span className="font-black text-xl w-8 text-center">
                    {producto.cantidad}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-2 font-bold text-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors rounded-r-lg"
                    onClick={() =>
                      editarCantidad(producto.id, producto.cantidad + 1)
                    }
                  >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>

                <p className="font-black text-gray-800 text-lg">
                  {formatMoney(producto.precio * producto.cantidad)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con Total y Botón */}
      <div className="mt-6 pt-6 border-t-2 border-gray-200">
        {/* Total */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-xl mb-4">
          <div className="flex justify-between items-center">
            <p className="text-xl text-gray-600 font-bold">Total a Pagar:</p>
            <p className="text-4xl font-black text-gray-900">
              {formatMoney(total)}
            </p>
          </div>
        </div>

        {/* Botón Confirmar */}
        <button
          type="button"
          className={`${
            pedido.length === 0 || loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary shadow-lg hover:shadow-2xl"
          } 
          w-full p-5 text-white font-black uppercase rounded-xl text-xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-95`}
          onClick={confirmarPedido}
          disabled={pedido.length === 0 || loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Send className="w-6 h-6" />
              Confirmar Pedido
            </>
          )}
        </button>

        {/* Botón Vaciar Carrito */}
        {pedido.length > 0 && !loading && (
          <button
            type="button"
            className="w-full mt-3 p-3 text-red-600 hover:text-red-800 font-bold uppercase text-sm transition-colors flex items-center justify-center gap-2"
            onClick={vaciarPedido}
          >
            <Trash2 className="w-4 h-4" />
            Vaciar Carrito
          </button>
        )}
      </div>
    </aside>
  );
}
