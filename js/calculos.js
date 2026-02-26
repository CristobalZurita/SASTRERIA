<<<<<<< HEAD
// 2. Función que calcula el total del pedido
// Recibe:
// - pedido: un arreglo con los productos comprados
// - catalogo: un objeto que contiene los productos y sus precios
function calcularTotalPedido(pedido, catalogo) {
=======
// calculos.js

// Función que calcula el total del carrito a partir de los productos agregados
function calcularTotalCarrito(items) {
>>>>>>> 5e0a5339374deb0978bd3123a9ecb540a4c4330c
  let total = 0;

  items.forEach(item => {
    total += item.precio;
  });

  return total;
}


// 
// 3. Aplicando descuentos con funciones anidadas
/***
 @param {number} total  // Es el dato que se asigna a la función
 @returns {{ precioFinal: number, descuentoPct: number, ahorro: number }} // Esta función devuelve un número.
 ***/


function aplicarDescuento(total) {

  let descuentoPct = 0;
  // Variable para guardar el porcentaje de descuento aplicado.
  // 'let' porque su valor cambiará según las condiciones.
  // Inicializa en 0: sin descuento por defecto.

  if (total > 100) {
    // CONDICIÓN 1 — Compra mayor a $100: aplica 20% de descuento.
    // Esta condición se evalúa PRIMERO porque es la más restrictiva.
    // Ejemplo: total = 150 → entra aquí, obtiene 20%.
    descuentoPct = 20;
    // Registra que se aplicó 20%.

  } else if (total > 50) {
    // CONDICIÓN 2 — Compra mayor a $50 pero ≤ $100: aplica 10% de descuento.
    // 'else if' garantiza que solo corre si la condición anterior fue false.
    // Ejemplo: total = 80 → no entra en if (80 < 100), sí entra aquí.
    // Ejemplo: total = 150 → ya entró en el if anterior, nunca llega aquí.
    descuentoPct = 10;
    // Registra que se aplicó 10%.

  }
  // Si total ≤ 50: ningún bloque se ejecutó, descuentoPct permanece en 0.
  // Ejemplo: total = 30 → sin descuento.

  const multiplicador = 1 - (descuentoPct / 100);
  // Convierte el porcentaje en factor multiplicador para calcular el precio final:
  //   20% de descuento → 1 - 0.20 = 0.80  (el cliente paga el 80% del total)
  //   10% de descuento → 1 - 0.10 = 0.90  (el cliente paga el 90% del total)
  //    0% de descuento → 1 - 0.00 = 1.00  (el cliente paga el 100%, sin descuento)

  const precioFinal = parseFloat((total * multiplicador).toFixed(2));
  // Calcula el precio con descuento multiplicando por el factor.
  // .toFixed(2) convierte a string con exactamente 2 decimales.
  // Esto evita problemas de punto flotante de JavaScript:
  //   sin .toFixed: 80 * 0.80 podría dar 63.99999999999 en vez de 64.
  // parseFloat() convierte de vuelta a número para operar sobre él.

  const ahorro = parseFloat((total - precioFinal).toFixed(2));
  // Cuánto dinero se ahorra: total original menos el precio con descuento.
  // También se redondea a 2 decimales para consistencia.

  return { precioFinal, descuentoPct, ahorro };
  // Retorna un objeto con los tres valores relevantes.
  // Shorthand ES6: { precioFinal } es azúcar sintáctica de { precioFinal: precioFinal }.
  // Quien llame a esta función puede desestructurar: const { precioFinal } = aplicarDescuento(total);
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
  const preciosBase = {
    // Precios por metro en miles de CLP (para que la función de descuento
    // reciba números en rango $50-$200 usando cantidades normales de metros).
    'lino': 4.2,    // $4.200 / metro
    'seda': 12.8,   // $12.800 / metro
    'algodon': 2.8,    // $2.800 / metro
    'gabardina': 3.5,  // $3.500 / metro
  };

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
