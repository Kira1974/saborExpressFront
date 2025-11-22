import { createContext, useState, useEffect } from "react";
// Si tienes toastify instalado, podrías importarlo aquí para feedback visual
// import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [pedido, setPedido] = useState([]);
  const [total, setTotal] = useState(0);

  // Calcular el total cada vez que cambia el pedido
  useEffect(() => {
    const nuevoTotal = pedido.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(nuevoTotal);
  }, [pedido]);

  // Agregar producto al carrito
  const agregarProducto = (producto) => {
    const existe = pedido.some((p) => p.id === producto.id);

    if (existe) {
      // Si ya existe, aumentamos la cantidad
      const pedidoActualizado = pedido.map((p) =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setPedido(pedidoActualizado);
    } else {
      // Si no existe, lo agregamos con cantidad 1
      setPedido([...pedido, { ...producto, cantidad: 1 }]);
    }
    // toast.success("Producto agregado"); // Opcional
  };

  // Modificar cantidad (aumentar o disminuir)
  const editarCantidad = (id, cantidad) => {
    if (cantidad < 1) {
      eliminarProducto(id);
      return;
    }
    const pedidoActualizado = pedido.map((p) =>
      p.id === id ? { ...p, cantidad } : p
    );
    setPedido(pedidoActualizado);
  };

  // Eliminar un item del carrito
  const eliminarProducto = (id) => {
    const pedidoActualizado = pedido.filter((p) => p.id !== id);
    setPedido(pedidoActualizado);
  };

  // Limpiar carrito (al finalizar compra)
  const vaciarPedido = () => {
    setPedido([]);
  };

  return (
    <CartContext.Provider
      value={{
        pedido,
        total,
        agregarProducto,
        editarCantidad,
        eliminarProducto,
        vaciarPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
