// Función que calcula el total del pedido
// Recibe:
// - pedido: un arreglo con los productos comprados
// - catalogo: un objeto que contiene los productos y sus precios
function calcularTotalPedido(pedido, catalogo) {
  let total = 0;

  // Recorre cada producto del pedido
  pedido.forEach(producto => {
    // Suma al total el precio del producto según el catálogo
    total += catalogo[producto];
  });

  // Devuelve el total final de la compra
  return total;
}