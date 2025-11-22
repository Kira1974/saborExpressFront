export const formatMoney = (amount) => {
  return amount.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};
