// calculos.js

// 2. Función que calcula el total del carrito a partir de los productos agregados
function calcularTotalCarrito(items) {
  let total = 0;

  items.forEach(item => {
    total += item.precio;
  });

  const resultado = aplicarDescuento(total); // con esto se carga el descuento

  return resultado;
}


// 
// 3. Aplicando descuentos con funciones anidadas
/***
 @param {number} total  // Es el dato que se asigna a la función
 @returns {{ precioFinal: number, descuentoPct: number, ahorro: number }} // Esta función devuelve un número.
 ***/


function aplicarDescuento(total) {

  let descuentoPct = 0;  // Variable para guardar el porcentaje de descuento aplicado.

  if (total > 100) {
    descuentoPct = 20;
  } else if (total > 50) {
    descuentoPct = 10;
  }

  const multiplicador = 1 - (descuentoPct / 100);
  const precioFinal = parseFloat((total * multiplicador).toFixed(2));
  const ahorro = parseFloat((total - precioFinal).toFixed(2));

  return { precioFinal, descuentoPct, ahorro };
}


// 4. Mensaje 

function realizarPedido(pedido) {

  const resultado = calcularTotalCarrito(pedido);

  console.log("Total con descuento:", resultado.precioFinal);
  console.log("Descuento aplicado:", resultado.descuentoPct + "%");
  console.log("Ahorro:", resultado.ahorro);

  console.log("✅ Pedido confirmado. Revisa tu correo electrónico para ver los detalles ¡Gracias por tu compra!");
}


