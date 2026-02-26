/**
 * main.js — Hilo & Oficio
 * -------------------------------------------------------
 * Este archivo es el cerebro del comportamiento interactivo del sitio.
 * Cada módulo está encapsulado en una IIFE (función autoinvocada)
 * para evitar contaminar el scope global con variables.
 *
 * Módulos incluidos:
 * 1. Navbar scroll + hamburger + Carrito
 * 2. Fade-up intersection observer
 * 3. Catalog filter
 * 4. Skin guide hover
 * 5. STEPPER CLIENT — buscar sastre (10 pasos)
 * 6. STEPPER WORKER — postular a la tienda (11 pasos)
 * 7. Range sliders (presupuesto y salario)
 * 8. Flow tabs (cambiar entre cliente/worker)
 * 9. Toast notifications
 * 10. Scroll-to-top
 * 11. Smooth anchor scroll
 * 12. Helpers (funciones utilitarias)
 * 13. Catálogo de telas
 * 14. ★ aplicarDescuento — función de descuento por volumen (NUEVA)
 * 15. ★ initCalculadoraTela — calculadora de precios (NUEVA)
 */

'use strict';
// 'use strict' activa el modo estricto de JavaScript.
// Esto previene errores silenciosos, prohíbe variables no declaradas,
// y hace el código más predecible y seguro. Siempre debe ir al inicio.


// ============================================================
// 1. NAVBAR + CARRITO
// Controla el comportamiento visual de la barra de navegación:
//   - Añade clase cuando el usuario hace scroll
//   - Abre/cierra el menú hamburguesa en móviles
//   - Maneja el carrito de compras lateral
// ============================================================
(function initNav() {
  // IIFE: función anónima que se ejecuta inmediatamente.
  // Esto aísla las variables internas; 'nav', 'burger', etc.
  // no son accesibles desde afuera, evitando conflictos de nombres.

  // ---- Elementos del Navbar ----
  const nav = document.getElementById('nav');
  // Busca el elemento <nav id="nav"> en el DOM.
  // 'const' porque esta referencia nunca cambia.

  const burger = document.getElementById('burger');
  // Botón hamburguesa (tres líneas) visible en móvil.
  // Está dentro del nav, definido con id="burger".

  const drawer = document.getElementById('drawer');
  // El menú lateral desplegable en versión móvil.
  // Se muestra/oculta al hacer clic en burger.

  const drawerClose = document.getElementById('drawer-close');
  // Botón ✕ dentro del drawer para cerrarlo.

  // ---- Elementos del Carrito ----
  const cartBtn = document.getElementById("cart");
  // Botón del carrito en el navbar. Muestra el ícono 🛒.

  const cartDrawer = document.getElementById("cart-drawer");
  // Panel lateral del carrito (drawer) que se despliega desde la derecha.

  const cartOverlay = document.getElementById("cart-overlay");
  // Capa oscura semitransparente detrás del carrito.
  // Al hacer clic, cierra el carrito.

  const cartClose = document.getElementById("cart-close");
  // Botón ✕ dentro del carrito para cerrarlo.

  // ========================================
  // ---- Comportamiento del Navbar al hacer scroll ----
  // ========================================
  window.addEventListener('scroll', () => {
    // Escucha el evento 'scroll' en el objeto window (toda la página).
    // La función flecha se ejecuta cada vez que el usuario desplaza.
    nav?.classList.toggle('nav--scrolled', window.scrollY > 60);
    // '?.' es optional chaining: si nav es null, no lanza error.
    // classList.toggle(clase, condición): agrega la clase si la condición
    // es true, la quita si es false.
    // window.scrollY: cuántos píxeles se ha scrolleado verticalmente.
    // Resultado: nav tiene fondo sólido cuando se scrollea más de 60px.
  }, { passive: true });
  // { passive: true }: le dice al navegador que este listener
  // nunca llamará preventDefault(). Permite optimizaciones de rendimiento
  // especialmente en scroll, que es un evento muy frecuente.

  // ========================================
  // ---- Menú Hamburguesa (Burger) ----
  // ========================================
  burger?.addEventListener('click', () => {
    // Escucha clic en el botón hamburguesa.
    // '?.' evita error si burger no existe en el DOM.
    burger.classList.toggle('open');
    // Alterna la clase 'open' en el ícono burger.
    // El CSS usa esta clase para animar las tres líneas a una ✕.
    drawer?.classList.toggle('open');
    // Alterna la clase 'open' en el drawer para mostrarlo/ocultarlo.
    document.body.classList.toggle('body--lock', drawer?.classList.contains('open'));
    // Si el drawer está abierto, bloquea el scroll del body
    // añadiendo la clase 'body--lock' (que en CSS tiene overflow: hidden).
    // Esto evita que el fondo se desplace mientras el menú está abierto.
  });

  // ---- Función para cerrar el drawer ----
  function closeDrawer() {
    // Función reutilizable para cerrar el drawer.
    // Se llama desde múltiples lugares: botón ✕ y links del drawer.
    burger?.classList.remove('open');
    // Quita la animación del ícono burger, vuelve a las tres líneas.
    drawer?.classList.remove('open');
    // Oculta el drawer.
    document.body.classList.remove('body--lock');
    // Restaura el scroll del body.
  }

  // ---- Event listeners para cerrar el drawer ----
  drawerClose?.addEventListener('click', closeDrawer);
  // Cuando se hace clic en ✕, cierra el drawer.

  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  // Selecciona todos los <a> dentro del drawer.
  // querySelectorAll devuelve un NodeList; forEach itera sobre cada enlace.
  // Al hacer clic en cualquier link del menú móvil, cierra el drawer
  // automáticamente (buena UX: el usuario navegó, ya no necesita el menú).

  // ========================================
  // ---- Carrito de Compras ----
  // ========================================
  // Solo inicializa si todos los elementos del carrito existen en el DOM.
  if (cartBtn && cartDrawer && cartOverlay && cartClose) {

    // Función para cerrar el carrito
    function cerrarCarrito() {
      cartDrawer.classList.remove("active");
      // Quita la clase 'active' que hace visible el drawer del carrito.
      cartOverlay.classList.remove("active");
      // Oculta la capa overlay.
    }

    // Abrir carrito al hacer clic en el botón
    cartBtn.addEventListener("click", () => {
      cartDrawer.classList.add("active");
      // Añade 'active' para mostrar el drawer del carrito.
      cartOverlay.classList.add("active");
      // Muestra la capa overlay oscura.
    });

    // Cerrar carrito al hacer clic en ✕ o en el overlay
    cartClose.addEventListener("click", cerrarCarrito);
    cartOverlay.addEventListener("click", cerrarCarrito);
  }

})();
// El () final invoca inmediatamente la función declarada arriba.


// ============================================================
// 2. FADE-UP OBSERVER
// Anima elementos haciéndolos aparecer desde abajo al hacer scroll.
// Usa la API moderna IntersectionObserver (más eficiente que scroll events).
// ============================================================
(function initFade() {
  // IIFE para encapsular esta funcionalidad.

  const els = document.querySelectorAll('.fade-up');
  // Selecciona TODOS los elementos con clase 'fade-up' en el documento.
  // En el CSS, .fade-up tiene opacity:0 y transform: translateY(30px) por defecto.
  // Cuando se añade la clase 'in', transiciona a opacity:1 y translateY(0).

  if (!els.length) return;
  // Guardián de salida temprana: si no hay elementos .fade-up, no hace nada.
  // Evita crear un observer innecesario. 'return' sale de la función.

  const obs = new IntersectionObserver(entries => {
    // IntersectionObserver: API del navegador que observa cuándo un elemento
    // entra o sale del viewport (área visible de la pantalla).
    // Es mucho más eficiente que escuchar el evento scroll y calcular posiciones.
    // 'entries' es un array de todos los elementos que cambiaron de estado.

    entries.forEach(e => {
      // Itera sobre cada entrada (elemento que cruzó el umbral).
      if (e.isIntersecting) {
        // isIntersecting: true si el elemento ahora es visible en el viewport.
        e.target.classList.add('in');
        // Añade la clase 'in' que activa la animación CSS (fade + slide up).
        obs.unobserve(e.target);
        // Deja de observar este elemento: la animación solo ocurre una vez.
        // Optimización importante: sin esto, el observer seguiría activo innecesariamente.
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  // Opciones del observer:
  // threshold: 0.1 → activa cuando el 10% del elemento es visible.
  // rootMargin: '0px 0px -30px 0px' → reduce el viewport en 30px por abajo,
  //   haciendo que el elemento se active un poco antes de llegar al borde inferior.

  els.forEach(el => obs.observe(el));
  // Registra cada elemento .fade-up para ser observado.
  // Desde este momento, el observer vigilará cuándo cada uno entra al viewport.
})();


// ============================================================
// 3. CATALOG FILTER
// Maneja los botones de filtro del catálogo de telas.
// Cuando se selecciona un tipo, las cards que no coinciden
// se atenúan visualmente con una clase CSS.
// ============================================================
(function initCatalog() {
  // IIFE de encapsulamiento.

  const btns = document.querySelectorAll('.sec-catalog__filter-btn');
  // Selecciona todos los botones de filtro (Todos, Naturales, Sintéticos, etc.).
  // Cada botón tiene data-filter="all|natural|sintetico|mezcla|premium".

  const cards = document.querySelectorAll('.fabric-card');
  // Selecciona todas las tarjetas de tela del catálogo.
  // Cada card tiene data-type="natural|premium|mezcla|etc.".

  btns.forEach(btn => btn.addEventListener('click', () => {
    // Para cada botón, agrega un listener de clic.
    // Cuando se hace clic en un botón de filtro:

    btns.forEach(b => b.classList.remove('active'));
    // Primero quita la clase 'active' de TODOS los botones.
    // Esto "resetea" el estado visual antes de marcar el nuevo activo.

    btn.classList.add('active');
    // Marca como activo el botón que se acaba de clicar.
    // El CSS aplica un estilo destacado al botón activo.

    const f = btn.dataset.filter;
    // Lee el atributo data-filter del botón clicado.
    // btn.dataset.filter es equivalente a btn.getAttribute('data-filter').
    // Ejemplo: si se clicó "Naturales", f = "natural".

    cards.forEach(c => {
      // Itera sobre cada tarjeta del catálogo.
      const match = f === 'all' || c.dataset.type === f;
      // match es true si:
      //   - El filtro es 'all' (mostrar todo), O
      //   - El tipo de la card coincide con el filtro seleccionado.
      c.classList.toggle('fabric-card--dimmed', !match);
      // Si NO hay match: añade 'fabric-card--dimmed' (atenúa la card).
      // Si SÍ hay match: quita 'fabric-card--dimmed' (card visible y clara).
    });
  }));
})();


// ============================================================
// 4. SKIN GUIDE HOVER
// Efecto de hover en la sección de guía de color por tono de piel.
// Al hacer hover sobre una card, las demás se atenúan.
// Crea un efecto de "foco" que guía la atención del usuario.
// ============================================================
(function initSkin() {
  // IIFE de encapsulamiento.

  const cards = document.querySelectorAll('.skin-card');
  // Selecciona las 3 tarjetas: piel clara, oliva/media, morena/oscura.

  cards.forEach(card => {
    // Para cada tarjeta de tono de piel:

    card.addEventListener('mouseenter', () =>
      // mouseenter: se dispara cuando el cursor entra en el área del elemento.
      // (A diferencia de mouseover, no se propaga a hijos, más eficiente.)
      cards.forEach(c => { if (c !== card) c.classList.add('skin-card--muted'); })
      // Atenúa todas las cards EXCEPTO la que recibe el hover.
      // 'c !== card' compara referencias de objeto en memoria, no valores.
    );

    card.addEventListener('mouseleave', () =>
      // mouseleave: se dispara cuando el cursor sale del elemento.
      cards.forEach(c => c.classList.remove('skin-card--muted'))
      // Quita el atenuado de todas las cards al salir.
      // Restaura el estado visual normal de la sección.
    );
  });
})();


// ============================================================
// 5 & 6. STEPPER FACTORY
// Función fábrica reutilizable que crea un stepper (formulario multi-paso).
// Se usa dos veces: una para el flujo cliente y otra para el postulante.
// Patrón de diseño: Factory Function + configuración por objeto (config object pattern).
// ============================================================
function createStepper(config) {
  // Recibe un objeto 'config' con toda la configuración del stepper.
  // Esto hace la función genérica y reutilizable para distintos flujos.

  // ---- Desestructuración de la configuración ----
  const {
    flowId,       // String: id del div.stepper__flow principal
    totalSteps,   // Number: cantidad total de pasos del formulario
    formData,     // Object: referencia al objeto donde se guardarán los datos
    validators,   // Object: mapa de paso → función que valida ese paso
    collectors,   // Object: mapa de paso → función que recolecta datos de ese paso
    resultId,     // String: id del div de éxito (se muestra al terminar)
    wrapperId,    // String: id del div que contiene el formulario (se oculta al terminar)
    summaryId,    // String: id del div donde se inyecta el resumen final
    toastOk,      // String: mensaje del toast de éxito
  } = config;
  // Desestructuración del objeto config: extrae cada propiedad como variable local.
  // Es equivalente a escribir: const flowId = config.flowId; etc.

  // ---- Selección de elementos del DOM ----
  const flow = document.getElementById(flowId);
  // Busca el contenedor principal del stepper en el DOM.
  if (!flow) return;
  // Si el elemento no existe (ej: esta página no tiene este flujo), sale.
  // Guardián de null: evita errores en páginas que no tengan ambos steppers.

  const barFill = flow.querySelector('.stepper__bar-fill');
  // La barra de progreso visual (div que se expande con width CSS).
  const barText = flow.querySelector('.stepper__progress-row span');
  // El texto "Paso X de Y" en la barra de progreso.
  const barPct = flow.querySelector('.stepper__progress-row strong');
  // El texto "XX% completado" en la barra de progreso.
  const dots = flow.querySelectorAll('.stepper__dots button');
  // Los puntos/botones numerados (1, 2, 3...) bajo la barra de progreso.
  const wrapper = document.getElementById(wrapperId);
  // El contenedor del formulario completo.
  const resultEl = document.getElementById(resultId);
  // El div de "¡Solicitud enviada!" que se muestra al terminar.

  let current = 1;
  // 'let' porque sí cambia: rastrea en qué paso está el usuario.
  // Comienza en el paso 1.

  // ---- Función para calcular porcentaje de progreso ----
  function pct() {
    return Math.round(((current - 1) / totalSteps) * 100);
    // Calcula el porcentaje de avance.
    // (current - 1) porque en el paso 1 el progreso es 0%.
    // En el último paso antes de enviar: (totalSteps - 1) / totalSteps * 100.
    // Math.round: redondea al entero más cercano.
  }

  // ---- Función para actualizar la interfaz visual ----
  function updateUI() {
    // Actualiza todos los elementos visuales de progreso.
    const p = pct();
    // Calcula el porcentaje actual una sola vez para reusar el valor.

    if (barFill) barFill.style.width = p + '%';
    // Cambia el ancho de la barra de progreso. El CSS tiene transition,
    // lo que genera la animación suave de la barra.

    if (barText) barText.textContent = `Paso ${current} de ${totalSteps}`;
    // Actualiza el texto "Paso X de Y". Template literal con backticks.

    if (barPct) barPct.textContent = p + '% completado';
    // Actualiza el porcentaje textual.

    dots.forEach((d, i) => {
      // Itera sobre cada punto numerado.
      // 'd' es el elemento botón, 'i' es su índice (0-based).
      d.classList.remove('active', 'done');
      // Primero limpia el estado: quita ambas clases de todos los puntos.

      if (i + 1 < current) d.classList.add('done');
      // i + 1 convierte el índice 0-based al número de paso 1-based.
      // Si el paso es anterior al actual: marcar como completado (✓).

      else if (i + 1 === current) d.classList.add('active');
      // Si es el paso actual: marcar como activo (resaltado).
      // Los pasos futuros no reciben ninguna clase (estado neutro).
    });
  }

  // ---- Función para navegar a un paso específico ----
  function goTo(n) {
    // Navega al paso número 'n'.
    // Es la función central de navegación del stepper.

    flow.querySelectorAll('.stepper__step').forEach(s => s.classList.remove('active'));
    // Oculta TODOS los pasos quitando la clase 'active'.
    // En CSS, .stepper__step sin 'active' tiene display:none.

    const target = flow.querySelector(`.stepper__step[data-step="${n}"]`);
    // Busca específicamente el div del paso 'n' usando selector de atributo.
    // Ejemplo: .stepper__step[data-step="3"] para el tercer paso.

    if (target) target.classList.add('active');
    // Muestra solo el paso destino añadiendo 'active'.

    current = n;
    // Actualiza la variable de seguimiento.

    updateUI();
    // Actualiza la barra de progreso y los dots.

    const sec = document.getElementById('form-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Hace scroll suave hacia la sección del formulario.
    // Útil en móvil donde el formulario puede estar fuera del viewport
    // después de clicar "Siguiente".
    // block: 'start' alinea el elemento al tope del viewport.
  }

  // ---- Función para validar el paso actual ----
  function validate(step) {
    // Ejecuta el collector y el validator para el paso actual.
    // Retorna un array de errores (vacío si todo está bien).

    const fn = validators[step];
    // Busca la función validadora para este paso en el objeto validators.
    // Puede ser undefined si ese paso no tiene validación.

    const col = collectors[step];
    // Busca la función recolectora para este paso.

    if (col) col();
    // Si existe un collector, ejecutarlo PRIMERO.
    // Así los datos se guardan en formData antes de validar.
    // Esto permite que los validators accedan a formData si es necesario.

    if (!fn) return [];
    // Si no hay validator para este paso, retorna array vacío (sin errores).
    // Pasos sin validación (como el de presupuesto con range slider) pasan siempre.

    return fn(formData);
    // Ejecuta la función validadora pasando formData.
    // Retorna un array de objetos { id, msg } para cada error encontrado.
  }

  // ---- Función para mostrar errores en los campos ----
  function markErrors(errors) {
    // Muestra los mensajes de error en los campos correspondientes.

    flow.querySelectorAll('.stepper__field.error').forEach(f => f.classList.remove('error'));
    // Limpia los errores previos: quita la clase 'error' de todos los campos.
    // Necesario para que los errores del intento anterior no persistan.

    flow.querySelectorAll('.group-err').forEach(e => e.remove());
    // Elimina los mensajes de error de grupos (radio/checkbox).
    // Estos son <p> insertados dinámicamente, hay que borrarlos del DOM.

    errors.forEach(({ id, msg }) => {
      // Desestructuración: extrae 'id' y 'msg' de cada objeto de error.

      const el = document.getElementById(id);
      // Intenta encontrar el campo con ese id (input, select, textarea).

      if (el) {
        // Si existe un elemento con ese id, es un campo de formulario normal.
        const field = el.closest('.stepper__field');
        // .closest() busca el ancestro más cercano con esa clase.
        // Sube por el árbol DOM hasta encontrar el contenedor del campo.

        if (field) {
          field.classList.add('error');
          // Marca el contenedor del campo como error.
          // El CSS aplica borde rojo u otros estilos de error.

          const errSpan = field.querySelector('.err');
          // Busca el <span class="err"> dentro del campo.
          if (errSpan) errSpan.textContent = msg;
          // Inserta el mensaje de error en ese span.
        }
      } else {
        // Si no hay elemento con ese id, es un grupo de radios o checkboxes.
        const grp = flow.querySelector(`[data-group="${id}"]`);
        // Busca el contenedor del grupo por atributo data-group.

        if (grp) {
          const p = document.createElement('p');
          // Crea un nuevo elemento <p> para mostrar el error del grupo.
          p.className = 'group-err';
          // Le asigna clase para estilos y para poder borrarlo después.
          p.textContent = '⚠ ' + msg;
          // Escribe el mensaje con ícono de advertencia.
          grp.after(p);
          // Inserta el <p> inmediatamente después del contenedor del grupo.
        }
      }
    });
  }

  // ========================================
  // ---- DELEGACIÓN DE EVENTOS ----
  // En lugar de añadir listeners a cada botón individualmente,
  // se escucha en el padre. Es más eficiente y funciona con elementos
  // que aún no existen cuando se inicializa el script.
  // ========================================
  flow.addEventListener('click', e => {
    // Escucha clics en cualquier parte del flujo.

    const nextBtn = e.target.closest('[data-next]');
    // e.target: el elemento exacto donde se hizo clic.
    // .closest('[data-next]'): sube por el DOM buscando un elemento
    // con atributo data-next. Si el clic fue en el botón o su hijo, lo encuentra.
    // Retorna null si no hay ningún ancestro con ese atributo.

    const prevBtn = e.target.closest('[data-prev]');
    // Similar: detecta clics en el botón "← Atrás".

    const subBtn = e.target.closest('[data-submit]');
    // Similar: detecta clics en el botón de envío final.

    // ---- Botón Siguiente ----
    if (nextBtn) {
      // Si se clicó en un botón "Siguiente":
      const errs = validate(current);
      // Ejecuta collector + validator del paso actual.
      // errs será [] si todo está bien, o [{id, msg}, ...] si hay errores.

      if (errs.length) { markErrors(errs); showToast('Completa los campos requeridos.', 'err'); return; }
      // Si hay errores: muéstralos visualmente, muestra toast de alerta,
      // y 'return' detiene la ejecución (no avanza al siguiente paso).

      if (current < totalSteps) goTo(current + 1);
      // Si no hay errores y no es el último paso, avanza al siguiente.
    }

    // ---- Botón Atrás ----
    if (prevBtn && current > 1) goTo(current - 1);
    // Si se clicó en "Atrás" y no estamos en el primer paso, retrocede.
    // La condición 'current > 1' evita ir al paso 0 (que no existe).
    // No se valida al retroceder: el usuario puede corregir campos anteriores.

    // ---- Botón Enviar ----
    if (subBtn) {
      // Si se clicó en el botón de envío final:
      const errs = validate(current);
      // Valida el último paso también antes de enviar.
      if (errs.length) { markErrors(errs); showToast('Completa los campos requeridos.', 'err'); return; }
      submitFlow(subBtn);
      // Si todo está bien, inicia el proceso de envío.
    }
  });

  // ---- Función para enviar el formulario ----
  function submitFlow(btn) {
    // Simula el envío del formulario con un estado de carga.

    btn.classList.add('btn--loading'); btn.disabled = true;
    // Añade clase de carga (puede mostrar spinner en CSS) y deshabilita el botón.
    // Esto evita envíos dobles si el usuario hace clic varias veces.

    setTimeout(() => {
      // Simula una petición al servidor con 1800ms de espera.
      // En producción, aquí iría un fetch() o axios() real a una API.

      if (wrapper) wrapper.style.display = 'none';
      // Oculta el formulario completo.

      if (resultEl) resultEl.classList.add('show');
      // Muestra el div de confirmación/éxito.

      populateSummary();
      // Llena el resumen con los datos recolectados.

      // Fuerza el 100% en la barra de progreso:
      if (barFill) barFill.style.width = '100%';
      if (barPct) barPct.textContent = '100% completado';

      dots.forEach(d => d.classList.replace('active', 'done') || d.classList.add('done'));
      // Para cada dot: intenta reemplazar 'active' por 'done'.
      // classList.replace() retorna false si la clase no existía,
      // entonces el || añade 'done' igualmente.
      // Todos los dots quedan con el estado de completado.

      showToast(toastOk, 'ok');
      // Muestra el toast de éxito con el mensaje configurado.
    }, 1800);
    // 1800 milisegundos = 1.8 segundos de "carga simulada".
  }

  // ---- Función para generar el resumen de datos ----
  function populateSummary() {
    // Genera el HTML del resumen con todos los datos recolectados.

    const el = document.getElementById(summaryId);
    // Busca el contenedor del resumen.
    if (!el) return;
    // Sale si no existe.

    el.innerHTML = Object.entries(formData)
    // Object.entries() convierte el objeto en array de pares [clave, valor].
    // Ejemplo: [['Nombre', 'Ana Muñoz'], ['Región', 'RM'], ...]

      .filter(([, v]) => v && String(v).trim())
      // Filtra pares donde el valor existe y no es solo espacios.
      // [, v] desestructura ignorando la clave (la coma sin nombre).
      // String(v) convierte arrays a string para poder usar .trim().

      .map(([k, v]) => `<div class="stepper__summary-row"><span class="k">${k}</span><span class="val">${Array.isArray(v) ? v.join(', ') : v}</span></div>`)
      // Para cada par [clave, valor], genera una fila HTML.
      // Array.isArray(v): si es array (ej: telas seleccionadas), une con coma.
      // Si no es array, usa el valor directamente.

      .join('');
    // Une todos los strings HTML en uno solo (sin separador).
    // El resultado se asigna como innerHTML del contenedor del resumen.
  }

  // ---- Inicializar la interfaz ----
  updateUI();
  // Inicializa la UI del stepper cuando se crea.
  // Establece el estado visual correcto para el paso 1.
}


// ============================================================
// 5. STEPPER CLIENTE — buscar sastre (10 pasos)
// Instancia del stepper para el flujo de cliente que busca sastre.
// ============================================================
const clientData = {};
// Objeto vacío donde se irán acumulando los datos del cliente.
// Se pasa por referencia a createStepper, que lo irá llenando.

createStepper({
  // Llama a la función fábrica con la configuración del flujo cliente.

  flowId: 'flow-client',
  // ID del div contenedor del stepper cliente en el HTML.

  totalSteps: 10,
  // El flujo cliente tiene 10 pasos.

  formData: clientData,
  // Referencia al objeto donde se guardarán los datos.

  wrapperId: 'client-form-wrap',
  // ID del div que envuelve todos los pasos del formulario.

  resultId: 'client-done',
  // ID del div de confirmación que se muestra al terminar.

  summaryId: 'client-summary',
  // ID del div donde se inyecta el resumen de la solicitud.

  toastOk: '¡Tu solicitud fue enviada! Te contactaremos pronto.',
  // Mensaje del toast de éxito al completar el formulario.

  // ---- Collectors: funciones que recolectan los datos de cada paso ----
  collectors: {
    // Objeto de funciones, una por paso, que leen los campos y guardan en clientData.
    // Se ejecutan antes de validar, asegurando que los datos estén actualizados.

    1: () => {
      // Paso 1: Datos de contacto
      clientData['Nombre'] = v('cl-nombre') + ' ' + v('cl-apellido');
      // Concatena nombre y apellido con espacio intermedio.
      // v() es un helper definido al final del archivo que lee .value.trim()
      clientData['Correo'] = v('cl-correo');
      // Lee el valor del input de email.
      clientData['Teléfono'] = v('cl-tel');
      // Lee el valor del input de teléfono.
    },
    2: () => {
      // Paso 2: Ubicación
      clientData['Región'] = v('cl-region');
      // Lee el valor del select de región.
      clientData['Ciudad'] = v('cl-ciudad');
      // Lee el valor del input de ciudad.
    },
    3: () => { clientData['Tipo de prenda'] = radioVal('cl-tipo'); },
    // Paso 3: Lee qué radio button está seleccionado en el grupo 'cl-tipo'.
    // radioVal() es un helper que retorna el value del radio seleccionado.

    4: () => { clientData['Ocasión'] = radioVal('cl-ocasion'); },
    // Paso 4: Lee la ocasión seleccionada.

    5: () => {
      clientData['Telas preferidas'] = checkVals('cl-tela');
      // checkVals() retorna un array con los values de todos los checkboxes marcados.
    },

    6: () => { clientData['Tono de piel'] = radioVal('cl-tono'); },
    // Paso 6: Lee el tono de piel seleccionado.

    7: () => { clientData['Presupuesto'] = '$' + parseInt(v('cl-presupuesto')).toLocaleString('es-CL') + ' CLP'; },
    // Paso 7: Lee el valor del range slider, lo convierte a entero con parseInt(),
    // lo formatea con separadores de miles en español chileno (1.200.000),
    // y añade símbolo $ y sufijo CLP.

    8: () => { clientData['Plazo'] = radioVal('cl-plazo'); },
    // Paso 8: Lee el plazo seleccionado.

    9: () => { clientData['Disponibilidad'] = radioVal('cl-disponibilidad'); },
    // Paso 9: Lee la disponibilidad seleccionada.

    10: () => {
      // Paso 10: Descripción del proyecto
      clientData['Descripción del proyecto'] = v('cl-descripcion');
      // Lee el texto del textarea de descripción.
      clientData['Referencia visual'] = v('cl-referencia');
      // Lee el link de referencia opcional.
    },
  },

  // ---- Validators: funciones que validan los datos de cada paso ----
  validators: {
    // Objeto de funciones validadoras, una por paso que requiere validación.
    // Cada función recibe (formData) y retorna [] si todo está bien,
    // o [{id, msg}] con los errores encontrados.

    1: () => {
      // Validación del paso 1.
      const errs = [];
      // Array acumulador de errores, empieza vacío.
      if (!v('cl-nombre')) errs.push({ id: 'cl-nombre', msg: 'Nombre obligatorio.' });
      // Si el campo nombre está vacío, empuja un objeto de error al array.
      if (!v('cl-apellido')) errs.push({ id: 'cl-apellido', msg: 'Apellido obligatorio.' });
      // Validación del apellido.
      if (!v('cl-correo') || !v('cl-correo').includes('@')) errs.push({ id: 'cl-correo', msg: 'Correo inválido.' });
      // Doble condición: vacío O no contiene '@'.
      // Es validación básica; en producción se usaría regex más completo.
      if (!v('cl-tel')) errs.push({ id: 'cl-tel', msg: 'Teléfono obligatorio.' });
      return errs;
      // Retorna el array: vacío si no hay errores, con objetos si los hay.
    },
    2: () => {
      const errs = [];
      if (!v('cl-region')) errs.push({ id: 'cl-region', msg: 'Selecciona una región.' });
      if (!v('cl-ciudad')) errs.push({ id: 'cl-ciudad', msg: 'Ingresa tu ciudad.' });
      return errs;
    },
    3: () => !radioVal('cl-tipo') ? [{ id: 'g-tipo', msg: 'Elige el tipo de prenda.' }] : [],
    // Versión compacta con operador ternario:
    // Si no hay radio seleccionado → retorna array con un error.
    // Si sí hay selección → retorna array vacío.
    4: () => !radioVal('cl-ocasion') ? [{ id: 'g-ocasion', msg: 'Indica la ocasión.' }] : [],
    5: () => !checkVals('cl-tela').length ? [{ id: 'g-tela', msg: 'Selecciona al menos una tela.' }] : [],
    // .length verifica si el array de checkboxes tiene algún elemento seleccionado.
    6: () => !radioVal('cl-tono') ? [{ id: 'g-tono', msg: 'Elige tu tono de piel.' }] : [],
    8: () => !radioVal('cl-plazo') ? [{ id: 'g-plazo', msg: 'Indica el plazo.' }] : [],
    9: () => !radioVal('cl-disponibilidad') ? [{ id: 'g-disp', msg: 'Indica tu disponibilidad.' }] : [],
    10: () => {
      // Validación del paso 10: la descripción debe tener al menos 20 caracteres.
      const desc = v('cl-descripcion');
      if (!desc || desc.length < 20) return [{ id: 'cl-descripcion', msg: 'Mínimo 20 caracteres.' }];
      return [];
    },
  },
});


// ============================================================
// 6. STEPPER POSTULANTE — trabajar en la tienda (11 pasos)
// Segunda instancia del stepper, para el flujo de postulación laboral.
// Misma función fábrica, diferente configuración.
// ============================================================
const workerData = {};
// Objeto separado para los datos del postulante.
// Independiente de clientData para no mezclar información de ambos flujos.

createStepper({
  flowId: 'flow-worker',
  // ID del contenedor del stepper de postulación.
  totalSteps: 11,
  // El flujo postulante tiene 11 pasos (uno más que el cliente).
  formData: workerData,
  wrapperId: 'worker-form-wrap',
  resultId: 'worker-done',
  summaryId: 'worker-summary',
  toastOk: '¡Postulación enviada con éxito! Nos contactaremos en 3-5 días hábiles.',

  // ---- Collectors del flujo de postulación ----
  collectors: {
    // Colectores del flujo de postulación. Similar al cliente pero con más campos.
    1: () => {
      workerData['Nombre'] = v('wk-nombre') + ' ' + v('wk-apellido');
      workerData['RUT'] = v('wk-rut');
      workerData['Correo'] = v('wk-correo');
      workerData['Teléfono'] = v('wk-tel');
    },
    // Paso 1: Datos personales. Guarda nombre completo, RUT, correo y teléfono.
    2: () => {
      workerData['Fecha nac.'] = v('wk-fnac');
      workerData['Género'] = v('wk-genero');
      workerData['Nacionalidad'] = v('wk-nac');
    },
    // Paso 2: Datos adicionales. Fecha de nacimiento, género y nacionalidad.
    3: () => {
      workerData['Región'] = v('wk-region');
      workerData['Ciudad'] = v('wk-ciudad');
      workerData['Dirección'] = v('wk-dir');
    },
    // Paso 3: Ubicación completa con dirección opcional.
    4: () => { workerData['Cargo'] = radioVal('wk-cargo'); },
    // Paso 4: Cargo al que postula.
    5: () => {
      workerData['Nivel educacional'] = radioVal('wk-edu');
      workerData['Institución'] = v('wk-inst');
    },
    // Paso 5: Nivel educacional e institución de estudios.
    6: () => { workerData['Experiencia'] = radioVal('wk-exp'); },
    // Paso 6: Años de experiencia en el rubro.
    7: () => { workerData['Especialidades'] = checkVals('wk-esp'); },
    // Paso 7: Array de especialidades seleccionadas con checkboxes.
    8: () => {
      workerData['Disponibilidad'] = radioVal('wk-disp');
      workerData['Modalidad'] = radioVal('wk-modal');
    },
    // Paso 8: Disponibilidad horaria y modalidad de trabajo deseada.
    9: () => { workerData['Expectativa salarial'] = '$' + parseInt(v('wk-salario')).toLocaleString('es-CL') + ' / mes'; },
    // Paso 9: Expectativa salarial formateada con separador de miles chileno.
    10: () => {
      workerData['Motivación'] = v('wk-motiv');
      workerData['Portafolio/LinkedIn'] = v('wk-link');
    },
    // Paso 10: Carta de motivación y link al portafolio o LinkedIn.
    11: () => { workerData['Referencias'] = v('wk-ref'); },
    // Paso 11: Referencias laborales de personas que avalen la trayectoria.
  },

  // ---- Validators del flujo de postulación ----
  validators: {
    1: () => {
      const e = [];
      if (!v('wk-nombre')) e.push({ id: 'wk-nombre', msg: 'Nombre obligatorio.' });
      if (!v('wk-apellido')) e.push({ id: 'wk-apellido', msg: 'Apellido obligatorio.' });
      if (!v('wk-rut') || v('wk-rut').length < 8) e.push({ id: 'wk-rut', msg: 'RUT inválido.' });
      // El RUT chileno debe tener al menos 8 caracteres (ej: 1234567-8).
      if (!v('wk-correo') || !v('wk-correo').includes('@')) e.push({ id: 'wk-correo', msg: 'Correo inválido.' });
      if (!v('wk-tel')) e.push({ id: 'wk-tel', msg: 'Teléfono obligatorio.' });
      return e;
    },
    2: () => {
      const e = [];
      if (!v('wk-fnac')) e.push({ id: 'wk-fnac', msg: 'Fecha de nacimiento obligatoria.' });
      if (!v('wk-genero')) e.push({ id: 'wk-genero', msg: 'Selecciona una opción.' });
      return e;
    },
    3: () => {
      const e = [];
      if (!v('wk-region')) e.push({ id: 'wk-region', msg: 'Selecciona tu región.' });
      if (!v('wk-ciudad')) e.push({ id: 'wk-ciudad', msg: 'Ingresa tu ciudad.' });
      return e;
    },
    4: () => !radioVal('wk-cargo') ? [{ id: 'g-wk-cargo', msg: 'Selecciona el cargo.' }] : [],
    5: () => !radioVal('wk-edu') ? [{ id: 'g-wk-edu', msg: 'Selecciona tu nivel educacional.' }] : [],
    6: () => !radioVal('wk-exp') ? [{ id: 'g-wk-exp', msg: 'Indica tu experiencia.' }] : [],
    7: () => !checkVals('wk-esp').length ? [{ id: 'g-wk-esp', msg: 'Selecciona al menos una especialidad.' }] : [],
    8: () => {
      const e = [];
      if (!radioVal('wk-disp')) e.push({ id: 'g-wk-disp', msg: 'Indica tu disponibilidad.' });
      if (!radioVal('wk-modal')) e.push({ id: 'g-wk-modal', msg: 'Indica la modalidad.' });
      return e;
    },
    10: () => {
      const txt = v('wk-motiv');
      // Lee el texto de motivación.
      return (!txt || txt.length < 40) ? [{ id: 'wk-motiv', msg: 'Cuéntanos un poco más (mínimo 40 caracteres).' }] : [];
      // Valida que tenga al menos 40 caracteres para asegurar respuestas elaboradas.
    },
  },
});


// ============================================================
// 7. RANGE SLIDERS
// Conecta los sliders de rango con sus displays de valor.
// Cuando el usuario mueve el slider, el número mostrado se actualiza en tiempo real.
// ============================================================
function initRange(inputId, displayId, prefix = '$', suffix = '') {
  // inputId:   ID del <input type="range">
  // displayId: ID del elemento donde mostrar el valor formateado
  // prefix:    prefijo del valor (default '$')
  // suffix:    sufijo del valor (default vacío, podría ser ' / mes')

  const input = document.getElementById(inputId);
  // Referencia al input range.
  const display = document.getElementById(displayId);
  // Referencia al elemento de display del valor.
  if (!input || !display) return;
  // Guardián: si alguno no existe, no hace nada.

  const fmt = val => prefix + parseInt(val).toLocaleString('es-CL') + suffix;
  // Función formateadora reutilizable.
  // parseInt convierte a entero (el range devuelve string).
  // toLocaleString('es-CL') aplica formato de miles con punto: 1.200.000.

  display.textContent = fmt(input.value);
  // Inicializa el display con el valor actual del slider (el valor inicial del HTML).

  input.addEventListener('input', () => { display.textContent = fmt(input.value); });
  // 'input' (no 'change'): se dispara continuamente mientras se arrastra el slider.
  // Actualiza el display en tiempo real con cada movimiento del thumb.
}

// Inicializar los dos sliders de la página
initRange('cl-presupuesto', 'cl-pres-display');
// Inicializa el slider de presupuesto del cliente.
// Sin prefix/suffix → usa los defaults: $ y ''.

initRange('wk-salario', 'wk-sal-display');
// Inicializa el slider de salario del postulante.


// ============================================================
// 8. FLOW TABS
// Maneja los tabs que alternan entre el flujo cliente y el flujo postulant.
// ============================================================
document.querySelectorAll('.flow-tabs__btn').forEach(btn => {
  // Itera sobre los dos botones de tab.
  btn.addEventListener('click', () => {
    // Al hacer clic en cualquier tab:

    document.querySelectorAll('.flow-tabs__btn').forEach(b => b.classList.remove('active'));
    // Quita 'active' de todos los tabs primero.

    btn.classList.add('active');
    // Marca como activo solo el tab clicado.

    const target = btn.dataset.flow;
    // Lee el valor de data-flow: 'client' o 'worker'.

    document.querySelectorAll('.stepper__flow').forEach(f => f.classList.remove('active'));
    // Oculta todos los flujos de stepper.

    document.getElementById('flow-' + target)?.classList.add('active');
    // Muestra solo el flujo correspondiente al tab seleccionado.
    // 'flow-' + 'client' = 'flow-client'
    // 'flow-' + 'worker' = 'flow-worker'
  });
});


// ============================================================
// 9. TOAST NOTIFICATIONS
// Sistema de notificaciones temporales (mensajes que aparecen y desaparecen).
// Tipos: 'ok' (éxito verde), 'err' (error rojo), 'inf' (información neutral).
// ============================================================
function showToast(msg, type = 'inf') {
  // msg:  texto a mostrar en el toast
  // type: tipo de toast (default 'inf')

  document.querySelector('.toast')?.remove();
  // Elimina cualquier toast existente antes de crear uno nuevo.
  // Evita apilar múltiples toasts en pantalla si se llama seguido.

  const t = document.createElement('div');
  // Crea un nuevo <div> para el toast.

  t.className = `toast toast--${type}`;
  // Asigna clases: 'toast' (base) y 'toast--ok/err/inf' (variante de color/ícono).

  const ico = { ok: '✅', err: '⚠️', inf: '🧵' };
  // Objeto mapa tipo → ícono emoji.

  t.innerHTML = `<span class="toast__ico">${ico[type] || '•'}</span><span>${msg}</span>`;
  // Construye el HTML interno del toast: ícono + mensaje.
  // ico[type] || '•': si el tipo no existe en el mapa, usa bullet como fallback.

  document.body.appendChild(t);
  // Inserta el toast al final del body (encima de todo por z-index en CSS).

  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  // Doble requestAnimationFrame: asegura que el elemento está renderizado
  // antes de añadir la clase 'show' que dispara la animación CSS.
  // Un solo rAF no siempre garantiza el reflow inicial necesario para la transición.

  setTimeout(() => {
    t.classList.remove('show');
    // Inicia la animación de salida (CSS transition de opacity y transform).
    setTimeout(() => t.remove(), 400);
    // Después de 400ms (duración de la transición), elimina el nodo del DOM.
  }, 4000);
  // El toast permanece visible durante 4 segundos antes de desvanecerse.
}

window.showToast = showToast;
// Expone showToast al scope global (window) para que pueda ser llamada
// desde otros scripts o desde la consola del navegador durante desarrollo.


// ============================================================
// 10. SCROLL TO TOP
// Botón flotante que aparece al bajar y vuelve al inicio al clicarlo.
// ============================================================
(function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  // Busca el botón flotante con clase 'scroll-top'.
  if (!btn) return;
  // Guardián: si no existe en esta página, no hace nada.

  window.addEventListener('scroll', () => btn.classList.toggle('on', window.scrollY > 400), { passive: true });
  // Muestra el botón cuando el usuario ha scrolleado más de 400px.
  // 'on' es la clase que lo hace visible (CSS: opacity:1, pointer-events:auto).
  // { passive: true } para mejor rendimiento en el evento scroll.

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  // Al hacer clic, hace scroll suave hasta el tope de la página.
  // window.scrollTo con behavior:'smooth' usa animación nativa del navegador.
})();


// ============================================================
// 11. SMOOTH SCROLL
// Hace que todos los links de anclaje (#id) scrolleen suavemente.
// El CSS 'scroll-behavior: smooth' no siempre funciona en Safari;
// este JS es una solución más compatible entre navegadores.
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  // Selecciona todos los <a> cuyo href empiece con '#'.
  // a[href^="#"] es un selector CSS de atributo que empieza con.
  a.addEventListener('click', e => {
    // Agrega listener de clic a cada link ancla.
    const href = a.getAttribute('href');
    // Obtiene el href completo, ej: '#como-funciona'.
    if (!href || href === '#') return;
    // Si el href es solo '#' (sin destino), no hace nada y deja comportamiento default.

    const tgt = document.querySelector(href);
    // Busca el elemento destino en el DOM usando el href como selector CSS.
    if (tgt) {
      e.preventDefault();
      // Previene el comportamiento default del enlace (salto brusco e instantáneo).
      tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Scrollea suavemente hasta el elemento destino.
      // block: 'start' alinea el tope del elemento con el tope del viewport.
    }
  });
});


// ============================================================
// 12. HELPERS — Funciones utilitarias reutilizadas en todo el archivo
// ============================================================

/**
 * Helper para obtener el valor de un input por ID.
 * @param {string} id - El ID del elemento input
 * @returns {string} El valor del input sin espacios al inicio/final
 */
function v(id) {
  // Nombre 'v' (de "value"): muy corto porque se usa muchas veces.
  const el = document.getElementById(id);
  // Busca el elemento por ID.
  return el ? el.value.trim() : '';
  // Operador ternario: si existe → retorna value sin espacios extra.
  // Si no existe → retorna string vacío (no lanza error de null).
  // .trim() elimina espacios al inicio y final del texto ingresado.
}

/**
 * Helper para obtener el valor del radio button seleccionado en un grupo.
 * @param {string} name - El atributo 'name' del grupo de radios
 * @returns {string} El value del radio seleccionado o vacío
 */
function radioVal(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  // Busca el input de tipo radio con ese nombre que esté marcado (:checked).
  return el ? el.value : '';
  // Retorna el value si hay selección, o string vacío si no hay ninguna.
}

/**
 * Helper para obtener los valores de todos los checkboxes marcados en un grupo.
 * @param {string} name - El atributo 'name' del grupo de checkboxes
 * @returns {string[]} Array con los values de los checkboxes marcados
 */
function checkVals(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(e => e.value);
  // querySelectorAll: encuentra todos los checkboxes marcados con ese nombre.
  // Array.from(): convierte NodeList a Array para poder usar .map().
  // .map(e => e.value): extrae solo el value de cada checkbox marcado.
  // Retorna un array de strings, ej: ['Lino', 'Seda', 'Algodón'].
}


// ============================================================
// 13. CATÁLOGO DE TELAS
// Función para construir un objeto con las telas disponibles.
// ============================================================

const catalogo = {};
// Objeto vacío para almacenar el catálogo de telas.
// key: ID de la tela, value: precio

// Selecciona todas las tarjetas de tela y extrae sus datos
document.querySelectorAll('.fabric-card').forEach(card => {
  const id = card.dataset.id;
  // data-id de la tarjeta (ej: 'lino', 'seda', 'algodon', 'gabardina')
  const price = Number(card.dataset.price);
  // data-price de la tarjeta (número)

  catalogo[id] = price;
  // Guarda en el objeto: { lino: 4200, seda: 12800, ... }
});

/**
 * Muestra el catálogo de telas en la consola del navegador.
 * Útil para depuración y desarrollo.
 */
function mostrarCatalogo() {
  console.log("Catálogo disponible:");

  for (let producto in catalogo) {
    console.log(producto + " - $" + catalogo[producto]);
  }
}

// Ejecutar al cargar para verificar en consola
mostrarCatalogo();


// ============================================================
// 14. ★ APLICAR DESCUENTO — Función de descuento por volumen
// ============================================================
/**
 * ═══════════════════════════════════════════════════════════
 * ★ FUNCIÓN NUEVA: aplicarDescuento(total)
 *
 * DÓNDE VIVE: al final del archivo, fuera de cualquier IIFE.
 * Está expuesta globalmente para ser llamada desde la consola o desde otros scripts.
 *
 * PROPÓSITO: calcular el precio final de una compra de telas
 * aplicando descuento por volumen según el total.
 *
 * REGLAS DE NEGOCIO:
 *   - Total > $100  →  20% de descuento (paga el 80%)
 *   - Total > $50   →  10% de descuento (paga el 90%)
 *   - Total ≤ $50   →  sin descuento    (paga el 100%)
 *
 * ⚠ EL ORDEN DE LAS CONDICIONES ES CRÍTICO:
 *   Si evaluamos primero "> $50", un total de $150 también
 *   cumpliría esa condición y obtendría solo 10% en vez de 20%.
 *   Por eso SIEMPRE se evalúa primero la condición más fuerte (> $100).
 * ═══════════════════════════════════════════════════════════
 *
 * @param {number} total - El total de la compra (en miles de CLP para este proyecto).
 * @returns {{ precioFinal: number, descuentoPct: number, ahorro: number }}
 *
 * Ejemplos de uso en consola:
 *   aplicarDescuento(120)  → { precioFinal: 96,  descuentoPct: 20, ahorro: 24 }
 *   aplicarDescuento(80)   → { precioFinal: 72,  descuentoPct: 10, ahorro: 8  }
 *   aplicarDescuento(30)   → { precioFinal: 30,  descuentoPct: 0,  ahorro: 0  }
 */
function aplicarDescuento(total) {
  // Parámetro 'total': el monto de la compra antes de aplicar descuento.
  // En el contexto de Hilo & Oficio: precio en miles de CLP (4.2 = $4.200 CLP).

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
