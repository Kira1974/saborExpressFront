

export const formatMoney = (amount) => {
  // Validar que amount sea un número
  const numero = Number(amount);
  
  if (isNaN(numero)) {
    console.error("formatMoney recibió un valor inválido:", amount);
    return "$0";
  }
  
  return numero.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};