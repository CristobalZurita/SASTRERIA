// calculos.js

// 2. Función que calcula el total del carrito a partir de los productos agregados
function calcularTotalCarrito(items) {
  let total = 0;

  items.forEach(item => {
    // Los precios en el carrito están en valores completos (ej: 4200 = $4.200)
    // Convertir a miles para aplicarDescuento (ej: 4.2)
    const cantidad = Math.max(1, parseInt(item.cantidad, 10) || 1);
    total += (item.precio * cantidad) / 1000;
  });

  // aplicarDescuento devuelve precios en miles, convertir de vuelta a completos
  const resultado = aplicarDescuento(total); 
  
  return {
    precioFinal: Math.round(resultado.precioFinal * 1000),
    descuentoPct: resultado.descuentoPct,
    ahorro: Math.round(resultado.ahorro * 1000)
  };
}


// 3. Aplicando descuentos con funciones anidadas
/***
 @param {number} total  // Es el dato que se asigna a la función (en miles de CLP: 4.2 = $4.200)
 @returns {{ precioFinal: number, descuentoPct: number, ahorro: number }} // Esta función devuelve un número.
 ***/


function aplicarDescuento(total) {
  // El total llega en miles de CLP (ej: 4.2 = $4.200)
  // Umbrales: > 100 miles = > $100.000, > 50 miles = > $50.000
  
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


// ============================================================
// 15. ★ INIT CALCULADORA TELA — Integración con la UI
// ============================================================
/**
 * ── Integración: Calculadora de descuento en el catálogo de telas ──────────
 * Esta IIFE conecta aplicarDescuento() con la UI del catálogo.
 * Requiere agregar en el HTML el bloque <div id="calculadora-tela">.
 * (Ver index.html comentado para ver la implementación del HTML)
 */
(function initCalculadoraTela() {
  // IIFE: encapsula la lógica y evita variables globales innecesarias.

  // ---- Precios base de las telas (en miles de CLP) ----
  const preciosBase = {};
  // El catálogo visible es la fuente de verdad: extraemos precios por metro desde las tarjetas.
  document.querySelectorAll('.fabric-card:not([data-carousel-clone])').forEach((card) => {
    const id = card.dataset.id;
    const precio = Number(card.dataset.price);

    if (!id || isNaN(precio)) return;
    preciosBase[id] = precio / 1000;
  });

  // ---- Selección de elementos del DOM ----
  const inputMetros = document.getElementById('calc-metros');
  // <input type="number"> donde el usuario escribe cuántos metros desea.
  const selectTela = document.getElementById('calc-tela');
  // <select> donde el usuario elige qué tela quiere calcular.
  const resultBox = document.getElementById('calc-resultado');
  // <div> donde se mostrará el resultado con los precios calculados.

  if (!inputMetros || !selectTela || !resultBox) return;
  // Guardián: si algún elemento no existe (la calculadora no está en esta página),
  // sale silenciosamente sin romper nada.

  // ---- Función principal de cálculo ----
  function calcularYMostrar() {
    // Función principal: lee los inputs, calcula el descuento y actualiza el DOM.

    const metros = parseFloat(inputMetros.value) || 0;
    // Lee cuántos metros inputted el usuario.
    // parseFloat: convierte string a número decimal.
    // || 0: si el campo está vacío o no es número, usa 0 como fallback seguro.

    const telaKey = selectTela.value;
    // Key de la tela seleccionada en el <select>, ej: 'lino', 'seda'.

    const pxMetro = preciosBase[telaKey];
    // Obtiene el precio por metro de la tela elegida.
    // Si telaKey es '' (opción por defecto), pxMetro será undefined.

    if (!pxMetro || metros <= 0) {
      // Si no hay tela seleccionada O metros es 0 o negativo:
      resultBox.innerHTML = '';
      // Limpia el resultado (no muestra nada).
      return;
      // Sale de la función sin calcular.
    }

    const total = metros * pxMetro;
    // Total antes de descuento: metros × precio por metro.
    // Ejemplo: 15 metros × 4.2 = 63.0 (→ $63.000 CLP, califica para 10% dcto)

    const { precioFinal, descuentoPct, ahorro } = aplicarDescuento(total);
    // ★ Llama a nuestra función aplicarDescuento.
    // Desestructura el resultado: extrae los tres valores retornados.

    // ---- Conversión de "miles de CLP" a "CLP completos" para mostrar ----
    const totalCLP = Math.round(total * 1000).toLocaleString('es-CL');
    const finalCLP = Math.round(precioFinal * 1000).toLocaleString('es-CL');
    const ahorroCLP = Math.round(ahorro * 1000).toLocaleString('es-CL');
    // toLocaleString('es-CL') formatea con separador de miles con punto: 63.000

    // ---- Generación del HTML del resultado ----
    resultBox.innerHTML = `
      <div class="calc-result__row">
        <span>Subtotal (${metros}m × $${Math.round(pxMetro * 1000).toLocaleString('es-CL')}/m):</span>
        <strong>$${totalCLP} CLP</strong>
      </div>
      ${descuentoPct > 0 ? `
        <div class="calc-result__row calc-result__row--discount">
          <span>Descuento aplicado (${descuentoPct}% por volumen):</span>
          <strong class="color-green">−$${ahorroCLP} CLP</strong>
        </div>` : '<p class="calc-hint">💡 Compra más de $50.000 para obtener 10% de descuento.</p>'}
      <div class="calc-result__row calc-result__row--total">
        <span><strong>Total a pagar:</strong></span>
        <strong class="calc-result__final">$${finalCLP} CLP</strong>
      </div>
    `;
    // Template literal multilínea con HTML del resultado.
    // El operador ternario muestra la fila de descuento solo si se aplicó alguno.
    // Si no califica, muestra un hint motivando a comprar más.
  }

  // ---- Event listeners para actualizar en tiempo real ----
  inputMetros.addEventListener('input', calcularYMostrar);
  // Recalcula en tiempo real mientras el usuario escribe la cantidad de metros.

  selectTela.addEventListener('change', calcularYMostrar);
  // Recalcula inmediatamente cuando el usuario cambia la tela seleccionada.
})();


// 4. Mensaje de confirmación de pedido
function realizarPedido(pedido) {
  const resultado = calcularTotalCarrito(pedido);
  console.log("Total con descuento:", resultado.precioFinal);
  console.log("Descuento aplicado:", resultado.descuentoPct + "%");
  console.log("Ahorro:", resultado.ahorro);
  console.log("✅ Pedido confirmado. Revisa tu correo electrónico para ver los detalles. ¡Gracias por tu compra!");
}

// Exponer funciones globalmente para uso desde main.js
window.calcularTotalCarrito = calcularTotalCarrito;
window.aplicarDescuento = aplicarDescuento;
window.realizarPedido = realizarPedido;
