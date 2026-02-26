// calculos.js

// Función que calcula el total del carrito a partir de los productos agregados
function calcularTotalCarrito(items) {
  let total = 0;

  items.forEach(item => {
    total += item.precio;
  });

  return total;
}