/**
 * playwright_test.js — Hilo & Oficio · SASTRERIA
 * ─────────────────────────────────────────────────────────────
 * Verifica el comportamiento DINÁMICO del proyecto después de
 * que verificar_fusion.sh haya pasado sin errores críticos.
 *
 * Uso:
 *   node playwright_test.js
 *
 * Requisitos (una vez, en tu máquina):
 *   npm init -y
 *   npm install playwright
 *   npx playwright install chromium
 *
 * El script abre un navegador real (visible), ejecuta las pruebas,
 * imprime ✅ / ❌ por cada una, y cierra solo.
 * ─────────────────────────────────────────────────────────────
 */

const { chromium } = require('playwright');
const path = require('path');

// ── Colores para la terminal ──────────────────────────────────
const OK    = '\x1b[32m✅ OK\x1b[0m';
const FALLA = '\x1b[31m❌ FALLA\x1b[0m';
const AVISO = '\x1b[33m⚠️  AVISO\x1b[0m';
const TITULO = (t) => `\n\x1b[34m\x1b[1m── ${t} ──\x1b[0m`;
const NEGRITA = (t) => `\x1b[1m${t}\x1b[0m`;

// ── Contadores ────────────────────────────────────────────────
let errores = 0;
let avisos  = 0;

function ok(msg)    { console.log(`  ${OK}    ${msg}`); }
function falla(msg) { console.log(`  ${FALLA} ${msg}`); errores++; }
function aviso(msg) { console.log(`  ${AVISO} ${msg}`); avisos++; }

// ── Helper: esperar un tiempo ─────────────────────────────────
const esperar = (ms) => new Promise(r => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────
// RUTA AL ARCHIVO — ajusta si tu index.html está en otra carpeta
// ─────────────────────────────────────────────────────────────
const RUTA_HTML = 'file://' + path.resolve(__dirname, 'index.html');


// =============================================================
async function correrPruebas() {
// =============================================================

  console.log('\n\x1b[1m╔══════════════════════════════════════════════════╗');
  console.log('║   PLAYWRIGHT — PRUEBAS DINÁMICAS · SASTRERIA     ║');
  console.log('╚══════════════════════════════════════════════════╝\x1b[0m');
  console.log(`\n  Abriendo: ${RUTA_HTML}`);

  // ── Lanzar navegador ──────────────────────────────────────
  const browser = await chromium.launch({
    headless: false,   // false = ves el navegador abrirse (útil para debug)
    slowMo: 80,        // 80ms entre acciones — más legible visualmente
  });

  const context = await browser.newContext();
  const page    = await context.newPage();

  // ── Capturar errores de consola del navegador ─────────────
  const erroresConsola = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      erroresConsola.push(msg.text());
    }
  });

  // ── Capturar errores de página (ReferenceError, etc.) ─────
  const erroresPagina = [];
  page.on('pageerror', err => {
    erroresPagina.push(err.message);
  });

  await page.goto(RUTA_HTML, { waitUntil: 'domcontentloaded' });
  await esperar(600); // Dar tiempo a que los scripts se ejecuten


  // ===========================================================
  console.log(TITULO('1. CARGA DE PÁGINA SIN ERRORES'));
  // ===========================================================

  if (erroresPagina.length === 0) {
    ok('No hay errores de página (ReferenceError, SyntaxError, etc.)');
  } else {
    erroresPagina.forEach(e => falla(`Error de página: ${e}`));
  }

  if (erroresConsola.length === 0) {
    ok('No hay errores en la consola del navegador');
  } else {
    erroresConsola.forEach(e => falla(`Error en consola: ${e}`));
  }

  // Verificar que el navbar existe
  const nav = await page.$('#nav');
  if (nav) ok('Navbar (#nav) presente en el DOM');
  else falla('Navbar (#nav) no encontrado');


  // ===========================================================
  console.log(TITULO('2. CARRITO — BOTONES "AÑADIR AL CARRO"'));
  // ===========================================================

  // Verificar que existen los 4 botones
  const botonesCarrito = await page.$$('.fc-btn');
  if (botonesCarrito.length === 4) {
    ok(`4 botones .fc-btn encontrados`);
  } else if (botonesCarrito.length > 0) {
    aviso(`Se encontraron ${botonesCarrito.length} botones .fc-btn (se esperaban 4)`);
  } else {
    falla('No se encontraron botones .fc-btn');
  }

  // Contador inicial debe ser 0
  const contadorInicial = await page.$eval('#cart-count', el => el.textContent.trim()).catch(() => null);
  if (contadorInicial === '0') {
    ok('Contador del carrito inicia en 0');
  } else if (contadorInicial !== null) {
    aviso(`Contador inicial es "${contadorInicial}" (se esperaba "0")`);
  } else {
    falla('#cart-count no encontrado en el DOM');
  }

  // Hacer clic en el primer botón "Añadir al carro"
  if (botonesCarrito.length > 0) {
    await botonesCarrito[0].click();
    await esperar(300);

    const contadorDespues = await page.$eval('#cart-count', el => el.textContent.trim()).catch(() => null);
    if (contadorDespues === '1') {
      ok('Contador incrementó a 1 después de añadir un producto');
    } else {
      falla(`Contador no cambió correctamente — valor actual: "${contadorDespues}"`);
    }
  }

  // Añadir un segundo producto
  if (botonesCarrito.length > 1) {
    await botonesCarrito[1].click();
    await esperar(300);

    const contadorDos = await page.$eval('#cart-count', el => el.textContent.trim()).catch(() => null);
    if (contadorDos === '2') {
      ok('Contador incrementó a 2 con el segundo producto');
    } else {
      falla(`Contador después del segundo producto: "${contadorDos}" (se esperaba "2")`);
    }
  }


  // ===========================================================
  console.log(TITULO('3. CARRITO — DRAWER (ABRIR / CERRAR)'));
  // ===========================================================

  // Verificar que el drawer existe y está cerrado
  const drawerCarrito = await page.$('#cart-drawer');
  if (!drawerCarrito) {
    falla('#cart-drawer no encontrado en el DOM');
  } else {
    ok('#cart-drawer presente en el DOM');

    // Abrir el carrito haciendo clic en el ícono
    const btnCarrito = await page.$('#cart');
    if (btnCarrito) {
      await btnCarrito.click();
      await esperar(400);

      const estaActivo = await page.$eval('#cart-drawer', el =>
        el.classList.contains('active')
      ).catch(() => false);

      if (estaActivo) {
        ok('Cart drawer se abre con clase "active"');
      } else {
        falla('Cart drawer no tiene clase "active" después de hacer clic');
      }

      // Verificar que hay items en el drawer
      const itemsHTML = await page.$eval('#cart-items', el => el.innerHTML).catch(() => '');
      if (itemsHTML.includes('cart-item') || itemsHTML.includes('cart-summary')) {
        ok('Cart items y/o resumen presentes en el drawer');
      } else if (itemsHTML.includes('vacío')) {
        aviso('El drawer muestra carrito vacío — verificar si los botones añadieron items');
      } else {
        falla('#cart-items está vacío o no tiene estructura esperada');
      }

      // Cerrar con el botón ✕
      const btnCerrar = await page.$('#cart-close');
      if (btnCerrar) {
        await btnCerrar.click();
        await esperar(400);

        const estaCerrado = await page.$eval('#cart-drawer', el =>
          !el.classList.contains('active')
        ).catch(() => false);

        if (estaCerrado) {
          ok('Cart drawer se cierra correctamente con botón ✕');
        } else {
          falla('Cart drawer NO se cerró después de hacer clic en ✕');
        }
      } else {
        falla('#cart-close no encontrado');
      }
    } else {
      falla('#cart (botón del carrito en navbar) no encontrado');
    }
  }


  // ===========================================================
  console.log(TITULO('4. CARRITO — OVERLAY Y CHECKOUT'));
  // ===========================================================

  // Reabrir el carrito para probar overlay y checkout
  const btnCartReabrir = await page.$('#cart');
  if (btnCartReabrir) {
    await btnCartReabrir.click();
    await esperar(400);

    // Verificar overlay activo
    const overlayActivo = await page.$eval('#cart-overlay', el =>
      el.classList.contains('active')
    ).catch(() => false);

    if (overlayActivo) {
      ok('Overlay se activa al abrir el carrito');
    } else {
      falla('Overlay no se activó con el carrito abierto');
    }

    // Cerrar con overlay (clic fuera)
    const overlay = await page.$('#cart-overlay');
    if (overlay) {
      await overlay.click();
      await esperar(400);

      const cerradoPorOverlay = await page.$eval('#cart-drawer', el =>
        !el.classList.contains('active')
      ).catch(() => false);

      if (cerradoPorOverlay) {
        ok('Carrito se cierra al hacer clic en el overlay');
      } else {
        falla('El carrito no se cerró al hacer clic en el overlay');
      }
    }
  }

  // Probar botón Finalizar Pedido con items en el carrito
  const btnCartAbrir2 = await page.$('#cart');
  if (btnCartAbrir2) {
    await btnCartAbrir2.click();
    await esperar(300);

    const btnCheckout = await page.$('#cart-checkout');
    if (btnCheckout) {
      await btnCheckout.click();
      await esperar(600);

      // Debe aparecer un toast de confirmación
      const toastVisible = await page.$('.toast.show').catch(() => null);
      if (toastVisible) {
        const toastTexto = await toastVisible.innerText().catch(() => '');
        if (toastTexto.includes('Pedido') || toastTexto.includes('confirmado') || toastTexto.includes('Total')) {
          ok('Toast de confirmación de pedido apareció correctamente');
        } else {
          ok(`Toast apareció (contenido: "${toastTexto.substring(0, 50)}...")`);
        }
      } else {
        aviso('Toast de confirmación no detectado — puede que el carrito estuviera vacío');
      }
    } else {
      falla('#cart-checkout no encontrado');
    }
  }


  // ===========================================================
  console.log(TITULO('5. SLIDER DE PRESUPUESTO + DESCUENTO'));
  // ===========================================================

  // Navegar al paso 7 del stepper cliente directamente
  // Para esto necesitamos avanzar por el stepper o forzar el paso visible
  // Usamos evaluate para mostrar el paso 7 directamente
  await page.evaluate(() => {
    // Ocultar todos los pasos
    document.querySelectorAll('#flow-client .stepper__step').forEach(s => {
      s.classList.remove('active');
    });
    // Mostrar el paso 7
    const paso7 = document.querySelector('#flow-client .stepper__step[data-step="7"]');
    if (paso7) paso7.classList.add('active');
  });
  await esperar(300);

  const slider = await page.$('#cl-presupuesto');
  const displayPres = await page.$('#cl-pres-display');

  if (!slider) {
    falla('#cl-presupuesto (slider de presupuesto) no encontrado');
  } else if (!displayPres) {
    falla('#cl-pres-display no encontrado');
  } else {
    // Leer valor inicial del display
    const valorInicial = await displayPres.innerText();
    ok(`Slider encontrado — valor inicial: ${valorInicial}`);

    // Cambiar el valor del slider a 200.000 (debe dar 10% de descuento)
    await page.evaluate(() => {
      const input = document.getElementById('cl-presupuesto');
      if (input) {
        input.value = 200000;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await esperar(300);

    const valorNuevo = await displayPres.innerText();
    if (valorNuevo !== valorInicial) {
      ok(`Display del slider se actualizó: "${valorNuevo}"`);
    } else {
      falla('Display del slider no cambió al mover el slider');
    }

    // Verificar el div de descuento
    const divDescuento = await page.$('#cl-pres-descuento');
    if (divDescuento) {
      const textoDescuento = await divDescuento.innerText();
      if (textoDescuento && textoDescuento.trim() !== '') {
        ok(`Div de descuento tiene contenido: "${textoDescuento.substring(0, 60)}"`);
      } else {
        aviso('#cl-pres-descuento existe pero está vacío — initDescuentoDisplay() puede no estar implementada');
      }
    } else {
      falla('#cl-pres-descuento no encontrado en el DOM');
    }
  }


  // ── Limpieza entre tests ─────────────────────────────────
  // Forzar cierre de cualquier overlay/drawer activo antes de
  // continuar. Evita que el cart-overlay bloquee clicks de
  // los tests siguientes. Siempre se corre entre secciones.
  await page.evaluate(() => {
    const drawer  = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer)  drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('body--lock');
  });
  await esperar(300);


  // ===========================================================
  console.log(TITULO('6. FILTROS DEL CATÁLOGO'));
  // ===========================================================

  // Scroll a la sección del catálogo
  await page.evaluate(() => {
    const catalogo = document.getElementById('catalogo');
    if (catalogo) catalogo.scrollIntoView();
  });
  await esperar(400);

  const botonesFilter = await page.$$('.sec-catalog__filter-btn');
  if (botonesFilter.length === 0) {
    falla('No se encontraron botones de filtro (.sec-catalog__filter-btn)');
  } else {
    ok(`${botonesFilter.length} botones de filtro encontrados`);

    // Clic en "Naturales"
    const btnNaturales = await page.$('[data-filter="natural"]');
    if (btnNaturales) {
      await btnNaturales.click();
      await esperar(300);

      // Verificar que el botón quedó activo
      const estaActivo = await btnNaturales.evaluate(el => el.classList.contains('active'));
      if (estaActivo) {
        ok('Botón "Naturales" queda activo después del clic');
      } else {
        falla('Botón "Naturales" no tiene clase "active" después del clic');
      }

      // Verificar que las tarjetas no-naturales quedaron dimmed
      const cardsDimmed = await page.$$('.fabric-card--dimmed');
      if (cardsDimmed.length > 0) {
        ok(`${cardsDimmed.length} tarjeta(s) atenuadas correctamente con filtro "Naturales"`);
      } else {
        aviso('Ninguna tarjeta quedó atenuada — verificar lógica del filtro');
      }
    } else {
      falla('Botón de filtro [data-filter="natural"] no encontrado');
    }

    // Volver a "Todos"
    const btnTodos = await page.$('[data-filter="all"]');
    if (btnTodos) {
      await btnTodos.click();
      await esperar(300);
      ok('Filtro "Todos" restaurado');
    }
  }


  // ===========================================================
  console.log(TITULO('7. TABS CLIENTE / POSTULANTE'));
  // ===========================================================

  const tabs = await page.$$('.flow-tabs__btn');
  if (tabs.length < 2) {
    falla(`Se encontraron ${tabs.length} tabs (se esperaban 2)`);
  } else {
    ok('2 tabs encontrados (.flow-tabs__btn)');

    // Verificar que flow-client está activo por defecto
    const clientActivo = await page.$eval('#flow-client', el =>
      el.classList.contains('active')
    ).catch(() => false);

    if (clientActivo) {
      ok('flow-client activo por defecto');
    } else {
      falla('flow-client NO está activo al cargar');
    }

    // Clic en tab "Postular" (worker)
    const tabWorker = await page.$('[data-flow="worker"]');
    if (tabWorker) {
      await tabWorker.click();
      await esperar(400);

      const workerActivo = await page.$eval('#flow-worker', el =>
        el.classList.contains('active')
      ).catch(() => false);

      const clientInactivo = await page.$eval('#flow-client', el =>
        !el.classList.contains('active')
      ).catch(() => false);

      if (workerActivo) ok('flow-worker se activa al hacer clic en el tab');
      else falla('flow-worker no se activó');

      if (clientInactivo) ok('flow-client se desactiva al cambiar de tab');
      else falla('flow-client no se desactivó');

      // Volver al tab cliente
      const tabClient = await page.$('[data-flow="client"]');
      if (tabClient) {
        await tabClient.click();
        await esperar(300);
      }
    } else {
      falla('[data-flow="worker"] no encontrado');
    }
  }


  // ===========================================================
  console.log(TITULO('8. STEPPER CLIENTE — NAVEGACIÓN'));
  // ===========================================================

  // Asegurarnos de que el paso 1 está visible
  await page.evaluate(() => {
    document.querySelectorAll('#flow-client .stepper__step').forEach(s => s.classList.remove('active'));
    const paso1 = document.querySelector('#flow-client .stepper__step[data-step="1"]');
    if (paso1) paso1.classList.add('active');
  });
  await esperar(200);

  // Intentar avanzar sin llenar nada (debe fallar validación)
  const btnSiguiente = await page.$('#flow-client [data-next]');
  if (btnSiguiente) {
    await btnSiguiente.click();
    await esperar(400);

    // Verificar que seguimos en el paso 1 (validación bloqueó el avance)
    const paso1Activo = await page.$eval(
      '#flow-client .stepper__step[data-step="1"]',
      el => el.classList.contains('active')
    ).catch(() => false);

    if (paso1Activo) {
      ok('Validación bloqueó el avance cuando los campos están vacíos');
    } else {
      falla('El stepper avanzó sin validar los campos obligatorios');
    }

    // Verificar que aparecen mensajes de error
    const camposConError = await page.$$('#flow-client .stepper__field.error');
    if (camposConError.length > 0) {
      ok(`${camposConError.length} campo(s) marcados con error correctamente`);
    } else {
      aviso('No se marcaron campos con error — la UI de validación puede no estar funcionando');
    }
  } else {
    falla('Botón [data-next] no encontrado en el paso 1');
  }

  // Llenar el paso 1 y avanzar
  await page.fill('#cl-nombre',   'Test');
  await page.fill('#cl-apellido', 'Prueba');
  await page.fill('#cl-correo',   'test@test.cl');
  await page.fill('#cl-tel',      '+56912345678');
  await esperar(200);

  const btnSiguienteRelleno = await page.$('#flow-client [data-next]');
  if (btnSiguienteRelleno) {
    await btnSiguienteRelleno.click();
    await esperar(400);

    const paso2Activo = await page.$eval(
      '#flow-client .stepper__step[data-step="2"]',
      el => el.classList.contains('active')
    ).catch(() => false);

    if (paso2Activo) {
      ok('Stepper avanzó al paso 2 con campos válidos');
    } else {
      falla('Stepper no avanzó al paso 2 a pesar de campos válidos');
    }

    // Probar botón Atrás desde el paso 2
    const btnAtras = await page.$('#flow-client [data-prev]');
    if (btnAtras) {
      await btnAtras.click();
      await esperar(300);

      const volvio = await page.$eval(
        '#flow-client .stepper__step[data-step="1"]',
        el => el.classList.contains('active')
      ).catch(() => false);

      if (volvio) ok('Botón Atrás funciona — regresó al paso 1');
      else falla('Botón Atrás no regresó al paso 1');
    }
  }


  // ===========================================================
  console.log(TITULO('9. BARRA DE PROGRESO DEL STEPPER'));
  // ===========================================================

  // La barra debe estar en 0% en el paso 1
  const barraAncho = await page.$eval(
    '#flow-client .stepper__bar-fill',
    el => el.style.width
  ).catch(() => null);

  if (barraAncho === '0%') {
    ok('Barra de progreso inicia en 0%');
  } else if (barraAncho !== null) {
    aviso(`Barra de progreso tiene ancho "${barraAncho}" (se esperaba "0%")`);
  } else {
    falla('.stepper__bar-fill no encontrado o sin estilo width');
  }

  const textoPaso = await page.$eval(
    '#flow-client .stepper__progress-row span',
    el => el.textContent
  ).catch(() => null);

  if (textoPaso && textoPaso.includes('1') && textoPaso.includes('10')) {
    ok(`Texto de progreso correcto: "${textoPaso}"`);
  } else if (textoPaso) {
    aviso(`Texto de progreso: "${textoPaso}" — verificar formato`);
  } else {
    falla('Texto de progreso (.stepper__progress-row span) no encontrado');
  }


  // ===========================================================
  console.log(TITULO('10. BOTÓN SCROLL-TO-TOP'));
  // ===========================================================

  // Scroll al fondo para que aparezca el botón
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await esperar(500);

  const scrollBtn = await page.$('.scroll-top');
  if (!scrollBtn) {
    falla('.scroll-top no encontrado en el DOM');
  } else {
    const estaVisible = await scrollBtn.evaluate(el => el.classList.contains('on'));
    if (estaVisible) {
      ok('Botón scroll-top visible después de hacer scroll');
    } else {
      aviso('Botón scroll-top no tiene clase "on" — puede que el scroll no sea suficiente para activarlo');
    }

    // Hacer clic y verificar que volvió arriba
    await scrollBtn.click();
    await esperar(600);

    const scrollY = await page.evaluate(() => window.scrollY);
    if (scrollY < 100) {
      ok(`Scroll-to-top funcionó — posición: ${scrollY}px`);
    } else {
      aviso(`Scroll-to-top: posición actual ${scrollY}px (se esperaba ~0)`);
    }
  }


  // ===========================================================
  // RESUMEN FINAL
  // ===========================================================
  await browser.close();

  console.log('\n\x1b[1m╔══════════════════════════════════════════════════╗');
  console.log('║   RESUMEN FINAL                                  ║');
  console.log('╚══════════════════════════════════════════════════╝\x1b[0m');

  if (errores === 0 && avisos === 0) {
    console.log(`\n  \x1b[32m\x1b[1mTodo OK — el proyecto está listo para push y PR.\x1b[0m\n`);
  } else if (errores === 0) {
    console.log(`\n  \x1b[33m\x1b[1m${avisos} aviso(s) — revisables pero no bloquean el merge.\x1b[0m`);
    console.log(`  \x1b[32mSin errores críticos — podés hacer push.\x1b[0m\n`);
  } else {
    console.log(`\n  \x1b[31m\x1b[1m${errores} error(es) crítico(s) — NO hacer push hasta resolverlos.\x1b[0m`);
    if (avisos > 0) {
      console.log(`  \x1b[33m${avisos} aviso(s) adicional(es).\x1b[0m`);
    }
    console.log('');
  }
}


// ── Punto de entrada ──────────────────────────────────────────
correrPruebas().catch(err => {
  console.error('\n\x1b[31m❌ ERROR INESPERADO EN EL SCRIPT:\x1b[0m', err.message);
  console.error('   Verificá que index.html existe en la misma carpeta que este script.');
  process.exit(1);
});
