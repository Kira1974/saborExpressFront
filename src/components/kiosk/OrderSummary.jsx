import useCart from "../../hooks/useCart";
import { formatMoney } from "../../helpers";
import { orderService } from "../../services/orderService"; // Importamos el servicio real
import { toast } from "react-toastify";

export default function OrderSummary() {
  const { pedido, total, editarCantidad, eliminarProducto, vaciarPedido } =
    useCart();

  const confirmarPedido = async () => {
    if (pedido.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    try {
      // Preparamos los datos
      const dataPedido = {
        total: total,
        productos: pedido,
        usuario: "Kiosco Local",
      };

      // Usamos el servicio que tiene la lógica del reinicio diario
      const nuevaOrden = await orderService.createOrder(dataPedido);

      toast.success(`¡Pedido Enviado! Tu turno es: ${nuevaOrden.turno}`, {
        autoClose: 5000,
        position: "top-center",
        className: "font-bold text-xl",
      });

      vaciarPedido();

      // Opcional: Disparar un evento para que otras pestañas se actualicen (si usas el monitor en otra pestaña)
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al enviar el pedido");
    }
  };

  return (
    <aside className="w-96 h-screen bg-white shadow-2xl p-5 flex flex-col fixed right-0 top-0 z-20 overflow-hidden">
      <h2 className="text-3xl font-black text-center mb-5">Mi Pedido</h2>

      <div className="flex-1 overflow-y-scroll custom-scrollbar space-y-4">
        {pedido.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-lg">
            Aquí verás tus alimentos...
          </p>
        ) : (
          pedido.map((producto) => (
            <div
              key={producto.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800 w-40 text-sm">
                    {producto.nombre}
                  </p>
                  <p className="text-primary font-bold text-lg">
                    {formatMoney(producto.precio)}
                  </p>
                </div>

                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2 bg-white rounded shadow border px-2">
                  <button
                    type="button"
                    className="px-2 font-bold text-lg text-gray-600 hover:bg-gray-200"
                    onClick={() =>
                      editarCantidad(producto.id, producto.cantidad - 1)
                    }
                  >
                    -
                  </button>
                  <span className="font-black text-lg w-4 text-center">
                    {producto.cantidad}
                  </span>
                  <button
                    type="button"
                    className="px-2 font-bold text-lg text-gray-600 hover:bg-gray-200"
                    onClick={() =>
                      editarCantidad(producto.id, producto.cantidad + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-gray-700 text-sm">
                  {formatMoney(producto.precio * producto.cantidad)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 pt-5 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl text-gray-600 font-bold">Total:</p>
          <p className="text-3xl font-black text-gray-800">
            {formatMoney(total)}
          </p>
        </div>

        <button
          type="button"
          className={`${
            pedido.length === 0 ? "bg-gray-300" : "bg-primary hover:bg-red-700"
          } 
          w-full p-4 text-white font-bold uppercase rounded-lg shadow-lg text-xl transition-colors`}
          onClick={confirmarPedido}
          disabled={pedido.length === 0}
        >
          Confirmar
        </button>
      </div>
    </aside>
  );
}
