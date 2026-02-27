#!/usr/bin/env bash
# =============================================================
# verificar_fusion.sh — Hilo & Oficio · SASTRERIA
# Verifica la integridad del proyecto ANTES de hacer push/PR.
# Uso: bash verificar_fusion.sh (desde la raíz del repo)
# =============================================================

# ---- Colores para output legible ----
VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
AZUL='\033[0;34m'
NEGRITA='\033[1m'
RESET='\033[0m'

OK="${VERDE}✅ OK${RESET}"
FALLA="${ROJO}❌ FALLA${RESET}"
AVISO="${AMARILLO}⚠️  AVISO${RESET}"

# ---- Contador de errores ----
ERRORES=0
AVISOS=0

# ---- Función para reportar ----
ok()    { echo -e "  ${OK}    $1"; }
falla() { echo -e "  ${FALLA} $1"; ((ERRORES++)); }
aviso() { echo -e "  ${AVISO} $1"; ((AVISOS++)); }
titulo(){ echo -e "\n${AZUL}${NEGRITA}── $1 ──${RESET}"; }

# =============================================================
echo -e "\n${NEGRITA}╔══════════════════════════════════════════════════╗"
echo -e "║   VERIFICADOR DE FUSIÓN — SASTRERIA              ║"
echo -e "╚══════════════════════════════════════════════════╝${RESET}"

# ---- Verificar que estamos en la raíz del repo ----
if [ ! -f "index.html" ]; then
  echo -e "\n${ROJO}ERROR: Ejecuta este script desde la raíz del repo (donde está index.html).${RESET}"
  exit 1
fi

# ---- Rama actual ----
RAMA=$(git branch --show-current 2>/dev/null)
echo -e "\n  Rama actual: ${NEGRITA}${RAMA}${RESET}"


# =============================================================
titulo "1. MARKERS DE CONFLICTO SIN RESOLVER"
# =============================================================
# Si quedan <<<<<<< en el código, el merge no se completó bien.

CONFLICTOS=$(grep -rn \
  -e "^<<<<<<< " \
  -e "^>>>>>>> " \
  -e "^=======$" \
  --include="*.html" \
  --include="*.js" \
  --include="*.css" \
  --include="*.scss" \
  . 2>/dev/null | grep -v "\.git/")

if [ -z "$CONFLICTOS" ]; then
  ok "No hay markers de conflicto pendientes"
else
  falla "Markers de conflicto Git encontrados — el merge no está completo:"
  echo "$CONFLICTOS" | while read -r linea; do
    echo -e "    ${ROJO}$linea${RESET}"
  done
fi


# =============================================================
titulo "2. ARCHIVOS CRÍTICOS — EXISTENCIA"
# =============================================================

archivos_criticos=(
  "index.html"
  "js/main.js"
  "js/calculos.js"
  "css/main.css"
)

for archivo in "${archivos_criticos[@]}"; do
  if [ -f "$archivo" ]; then
    ok "$archivo existe"
  else
    falla "$archivo NO EXISTE"
  fi
done

# Verificar scss (no crítico pero avisamos)
if [ -d "scss" ]; then
  ok "Carpeta scss/ existe"
else
  aviso "Carpeta scss/ no encontrada (puede ser intencional si usas CSS compilado)"
fi


# =============================================================
titulo "3. FUNCIONES REQUERIDAS EN calculos.js"
# =============================================================
# main.js llama estas 3 funciones — deben estar definidas en calculos.js

if [ -f "js/calculos.js" ]; then
  funciones_requeridas=(
    "aplicarDescuento"
    "calcularTotalCarrito"
    "realizarPedido"
  )

  for fn in "${funciones_requeridas[@]}"; do
    if grep -q "function ${fn}" js/calculos.js; then
      ok "function ${fn}() definida en calculos.js"
    else
      falla "function ${fn}() NO encontrada en calculos.js"
    fi
  done

  # Verificar initDescuentoDisplay
  if grep -q "initDescuentoDisplay" js/calculos.js; then
    ok "initDescuentoDisplay() definida en calculos.js"
  else
    aviso "initDescuentoDisplay() no encontrada — el div #cl-pres-descuento quedará vacío"
  fi
else
  falla "No se puede verificar funciones: calculos.js no existe"
fi


# =============================================================
titulo "4. ORDEN DE SCRIPTS EN index.html"
# =============================================================
# calculos.js DEBE cargarse antes que main.js

if [ -f "index.html" ]; then
  LINEA_CALCULOS=$(grep -n "calculos.js" index.html | head -1 | cut -d: -f1)
  LINEA_MAIN=$(grep -n "main.js" index.html | head -1 | cut -d: -f1)

  if [ -z "$LINEA_CALCULOS" ]; then
    falla "calculos.js no está referenciado en index.html"
  elif [ -z "$LINEA_MAIN" ]; then
    falla "main.js no está referenciado en index.html"
  elif [ "$LINEA_CALCULOS" -lt "$LINEA_MAIN" ]; then
    ok "calculos.js (línea ${LINEA_CALCULOS}) carga antes que main.js (línea ${LINEA_MAIN})"
  else
    falla "ORDEN INCORRECTO: main.js (línea ${LINEA_MAIN}) carga ANTES que calculos.js (línea ${LINEA_CALCULOS})"
  fi
fi


# =============================================================
titulo "5. BUG — setTimeout HUÉRFANO EN main.js"
# =============================================================
# Detecta el fragmento de showToast() que fue pegado accidentalmente
# dentro del bloque if (cartBtn && cartDrawer...) de initNav()

if [ -f "js/main.js" ]; then
  # Buscar el patrón del bug: setTimeout que referencia 't' fuera de showToast
  LINEAS_SETTIMEOUT=$(grep -n "t\.classList\.remove\('show'\)" js/main.js)

  if [ -z "$LINEAS_SETTIMEOUT" ]; then
    ok "No se detectó el bug del setTimeout huérfano"
  else
    # Verificar si está dentro de showToast (correcto) o fuera (bug)
    # Contamos cuántas veces aparece
    CONTEO=$(grep -c "t\.classList\.remove\('show'\)" js/main.js)
    if [ "$CONTEO" -gt 1 ]; then
      falla "t.classList.remove('show') aparece ${CONTEO} veces — posible código duplicado:"
      echo "$LINEAS_SETTIMEOUT" | while read -r linea; do
        echo -e "    ${ROJO}js/main.js:${linea}${RESET}"
      done
    else
      ok "t.classList.remove('show') aparece 1 vez (dentro de showToast — correcto)"
    fi
  fi
fi


# =============================================================
titulo "6. DATA-ATTRIBUTES EN TARJETAS DEL CATÁLOGO"
# =============================================================
# Cada .fabric-card debe tener data-id, data-name, data-price

if [ -f "index.html" ]; then
  TOTAL_CARDS=$(grep -c "class=\"fabric-card" index.html)
  CON_ID=$(grep -c "data-id=" index.html)
  CON_NAME=$(grep -c "data-name=" index.html)
  CON_PRICE=$(grep -c "data-price=" index.html)

  echo -e "  Tarjetas encontradas: ${NEGRITA}${TOTAL_CARDS}${RESET}"

  if [ "$CON_ID" -eq "$TOTAL_CARDS" ]; then
    ok "Todas las tarjetas tienen data-id (${CON_ID}/${TOTAL_CARDS})"
  else
    falla "Solo ${CON_ID}/${TOTAL_CARDS} tarjetas tienen data-id"
  fi

  if [ "$CON_NAME" -eq "$TOTAL_CARDS" ]; then
    ok "Todas las tarjetas tienen data-name (${CON_NAME}/${TOTAL_CARDS})"
  else
    falla "Solo ${CON_NAME}/${TOTAL_CARDS} tarjetas tienen data-name"
  fi

  if [ "$CON_PRICE" -eq "$TOTAL_CARDS" ]; then
    ok "Todas las tarjetas tienen data-price (${CON_PRICE}/${TOTAL_CARDS})"
  else
    falla "Solo ${CON_PRICE}/${TOTAL_CARDS} tarjetas tienen data-price"
  fi
fi


# =============================================================
titulo "7. CLASES CSS DEL CARRITO — DEFINIDAS EN main.css"
# =============================================================

if [ -f "css/main.css" ]; then
  clases_carrito=(
    "cart-item"
    "cart-summary"
    "cart-drawer"
    "cart-overlay"
    "cart-header"
    "cart-footer"
    "descuento-info"
    "descuento-badge"
  )

  for clase in "${clases_carrito[@]}"; do
    if grep -q "\.${clase}" css/main.css; then
      ok ".${clase} definida en main.css"
    else
      aviso ".${clase} NO encontrada en main.css — puede verse sin estilo"
    fi
  done
else
  aviso "css/main.css no encontrado — saltando verificación de estilos"
fi


# =============================================================
titulo "8. IDs CRÍTICOS EN index.html"
# =============================================================
# El JS busca estos IDs — si no existen en el HTML, falla silenciosamente

if [ -f "index.html" ]; then
  ids_criticos=(
    "cart"
    "cart-drawer"
    "cart-overlay"
    "cart-close"
    "cart-count"
    "cart-items"
    "cart-checkout"
    "cl-pres-descuento"
    "cl-presupuesto"
    "cl-pres-display"
    "wk-salario"
    "wk-sal-display"
    "flow-client"
    "flow-worker"
  )

  for id in "${ids_criticos[@]}"; do
    if grep -q "id=\"${id}\"" index.html; then
      ok "id=\"${id}\" presente en HTML"
    else
      falla "id=\"${id}\" NO encontrado en index.html"
    fi
  done
fi


# =============================================================
titulo "9. REFERENCIAS CRUZADAS JS → HTML"
# =============================================================
# Verificar que las funciones que main.js expone globalmente existen

if [ -f "js/main.js" ]; then
  # showToast debe estar expuesta globalmente
  if grep -q "window\.showToast" js/main.js; then
    ok "window.showToast expuesta globalmente"
  else
    aviso "window.showToast no encontrada — los toasts desde HTML no funcionarán"
  fi

  # Verificar que showToast está definida como función (no solo asignada)
  if grep -q "function showToast" js/main.js; then
    ok "function showToast() definida"
  else
    falla "function showToast() NO definida en main.js"
  fi

  # Verificar createStepper
  if grep -q "function createStepper" js/main.js; then
    ok "function createStepper() definida"
  else
    falla "function createStepper() NO definida en main.js"
  fi

  # Verificar helpers
  for helper in "function v(" "function radioVal(" "function checkVals("; do
    if grep -q "$helper" js/main.js; then
      ok "${helper%(*}() helper presente"
    else
      falla "${helper%(*}() helper NO encontrado — el stepper no puede recolectar datos"
    fi
  done
fi


# =============================================================
titulo "10. ESTADO DEL REPOSITORIO GIT"
# =============================================================

# Verificar si hay merge en progreso sin completar
if [ -f ".git/MERGE_HEAD" ]; then
  falla "Hay un MERGE EN PROGRESO sin completar — resuelve conflictos antes de hacer push"
else
  ok "No hay merge en progreso"
fi

# Archivos con conflictos sin resolver según git
CONFLICTOS_GIT=$(git diff --name-only --diff-filter=U 2>/dev/null)
if [ -z "$CONFLICTOS_GIT" ]; then
  ok "Git no reporta archivos con conflictos pendientes"
else
  falla "Git reporta estos archivos con conflictos sin resolver:"
  echo "$CONFLICTOS_GIT" | while read -r archivo; do
    echo -e "    ${ROJO}$archivo${RESET}"
  done
fi

# Archivos en staging (útil para saber qué se va al commit)
STAGED=$(git diff --cached --name-only 2>/dev/null)
if [ -n "$STAGED" ]; then
  echo -e "\n  ${AZUL}Archivos en staging (listos para commit):${RESET}"
  echo "$STAGED" | while read -r archivo; do
    echo -e "    ${AMARILLO}$archivo${RESET}"
  done
fi


# =============================================================
# RESUMEN FINAL
# =============================================================
echo -e "\n${NEGRITA}╔══════════════════════════════════════════════════╗"
echo -e "║   RESUMEN FINAL                                  ║"
echo -e "╚══════════════════════════════════════════════════╝${RESET}"

if [ "$ERRORES" -eq 0 ] && [ "$AVISOS" -eq 0 ]; then
  echo -e "\n  ${VERDE}${NEGRITA}Todo OK — el proyecto está listo para push y PR.${RESET}\n"
elif [ "$ERRORES" -eq 0 ]; then
  echo -e "\n  ${AMARILLO}${NEGRITA}${AVISOS} aviso(s) — revisables pero no bloquean el merge.${RESET}"
  echo -e "  ${VERDE}Sin errores críticos — podés hacer push.${RESET}\n"
else
  echo -e "\n  ${ROJO}${NEGRITA}${ERRORES} error(es) crítico(s) — NO hacer push hasta resolverlos.${RESET}"
  if [ "$AVISOS" -gt 0 ]; then
    echo -e "  ${AMARILLO}${AVISOS} aviso(s) adicional(es).${RESET}"
  fi
  echo ""
fi