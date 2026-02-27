// =============================================================================
// THEME SWITCHER — Agregar a js/main.js
//
// INSTRUCCIONES:
//  1. Copiar este bloque completo al final de main.js (antes del cierre del IIFE
//     init() si lo tienes, o al final del archivo).
//  2. Asegurarse de que el HTML del footer tenga los .theme-chip (ver snippet HTML).
//  3. Compilar SCSS y listo.
// =============================================================================

// ─── CONSTANTES ──────────────────────────────────────────────────────────────

/** Temas disponibles — deben coincidir con data-theme en los botones HTML */
const THEMES_DISPONIBLES = ['original', 'noche', 'esmeralda'];

/** Clave de localStorage para persistir el tema elegido */
const THEME_KEY = 'hiloyoficio_theme';

/** Clases CSS que se agregan al body (sin 'original', que es el default) */
const THEME_CLASSES = THEMES_DISPONIBLES
  .filter(t => t !== 'original')
  .map(t => `theme--${t}`);


// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Guarda el tema en localStorage de forma segura.
 * @param {string} tema
 */
function guardarTema(tema) {
  try {
    tema === 'original'
      ? localStorage.removeItem(THEME_KEY)
      : localStorage.setItem(THEME_KEY, tema);
  } catch (_) { /* storage bloqueado → se ignora */ }
}

/**
 * Lee el tema guardado en localStorage.
 * @returns {string} nombre del tema o 'original' por defecto
 */
function leerTema() {
  try {
    return localStorage.getItem(THEME_KEY) || 'original';
  } catch (_) { return 'original'; }
}


// ─── FUNCIÓN PRINCIPAL ───────────────────────────────────────────────────────

/**
 * Aplica un tema al body y actualiza el estado activo de los botones.
 *
 * @param {string}  nombreTema  - 'original' | 'noche' | 'esmeralda'
 * @param {boolean} persistir  - Si es true guarda en localStorage (default: true)
 */
function aplicarTema(nombreTema, persistir = true) {
  // Validar que el tema exista, fallback a 'original'
  const tema = THEMES_DISPONIBLES.includes(nombreTema) ? nombreTema : 'original';

  // 1. Limpiar todas las clases de tema del body
  document.body.classList.remove(...THEME_CLASSES);

  // 2. Aplicar la nueva (si no es 'original')
  if (tema !== 'original') {
    document.body.classList.add(`theme--${tema}`);
  }

  // 3. Actualizar aria-pressed y clase .is-active en los botones
  document.querySelectorAll('.theme-chip').forEach(btn => {
    const activo = btn.dataset.theme === tema;
    btn.classList.toggle('is-active', activo);
    btn.setAttribute('aria-pressed', String(activo));
  });

  // 4. Persistir
  if (persistir) guardarTema(tema);
}


// ─── INICIALIZACIÓN ──────────────────────────────────────────────────────────

/**
 * Inicializa los event listeners del switcher y restaura el tema guardado.
 * Llamar una vez cuando el DOM esté listo.
 */
function inicializarTemas() {
  // Bind de eventos en cada botón
  document.querySelectorAll('.theme-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      aplicarTema(btn.dataset.theme);
    });
  });

  // Restaurar tema de sesión anterior (sin volver a guardarlo)
  aplicarTema(leerTema(), false);
}

// ─── LLAMAR EN EL INIT ────────────────────────────────────────────────────────
// Busca la función init() que ya existe en main.js y agrega esta línea dentro:
//
//   inicializarTemas();
//
// O si no hay IIFE de init, agregar al final del archivo:

document.addEventListener('DOMContentLoaded', inicializarTemas);

// Si ya tienes un DOMContentLoaded o función init(), simplemente llama
// inicializarTemas() dentro de ella en vez de la línea de arriba.
