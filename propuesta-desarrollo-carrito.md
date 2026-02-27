# Propuesta de Desarrollo — Carrito de Compras + Calculadora

## Proyecto: Hilo & Oficio · Repositorio SASTRERIA

---

## 1. Diagnóstico Real del Estado Actual

Luego de leer los tres archivos completos (`index.html`, `main.js`, y el análisis previo), el diagnóstico corrige algunos supuestos del análisis anterior:

### ✅ Lo que SÍ existe y funciona correctamente

| Elemento                                                                                       | Archivo        | Líneas aprox.      |
| ---------------------------------------------------------------------------------------------- | -------------- | ------------------- |
| HTML del carrito (drawer, overlay, header, body, footer)                                       | `index.html` | Sección CARRITO    |
| `data-id`, `data-name`, `data-price` en las 4 tarjetas (lino, seda, algodón, gabardina) | `index.html` | Cards del catálogo |
| `agregarAlCarrito(boton)`                                                                    | `js/main.js` | initNav() IIFE      |
| `actualizarCarrito()`                                                                        | `js/main.js` | initNav() IIFE      |
| Abrir / cerrar drawer del carrito                                                              | `js/main.js` | initNav() IIFE      |
| Listener del botón `cart-checkout`                                                          | `js/main.js` | initNav() IIFE      |
| Binding de botones `.fc-btn`                                                                 | `js/main.js` | Bottom de initNav() |
| `<div id="cl-pres-descuento" class="descuento-info">`                                        | `index.html` | Paso 7 del stepper  |
| Tag `<script src="js/calculos.js">`                                                          | `index.html` | Antes de main.js    |

> **Conclusión**: El análisis anterior decía que faltaban los `data-*` en Algodón y Gabardina, pero **ya están en el HTML**. Ese punto no requiere acción.

---

### ❌ Lo que FALTA y bloquea la aplicación

Se identifican **4 problemas reales** ordenados por severidad:

---

## 2. Problema 1 — CRÍTICO: `js/calculos.js` no existe

`main.js` llama a tres funciones que deben vivir en `calculos.js` (cargado antes en el HTML). Si el archivo no existe, **toda la sección del carrito rompe con ReferenceError**:

```
ReferenceError: calcularTotalCarrito is not defined
ReferenceError: realizarPedido is not defined
```

### Funciones faltantes en `calculos.js`

**`calcularTotalCarrito(items)`** — llamada en `actualizarCarrito()` y en el listener de `cart-checkout`:

```javascript
// Recibe: array de { id, nombre, precio }
// Retorna: { precioFinal, descuentoPct, ahorro }
```

**`realizarPedido(items)`** — llamada en el listener de `cart-checkout`:

```javascript
// Recibe: array de items del carrito
// Acción: registrar o loguear el pedido
// Por ahora: console.log suficiente (placeholder para API real)
```

**`aplicarDescuento(total)`** — necesaria para que `calcularTotalCarrito` funcione:

```javascript
// La lógica según el análisis:
// total (en miles CLP) > 100.000 → 20% de descuento
// total > 50.000         → 10% de descuento
// total ≤ 50.000         → sin descuento
// Retorna: { precioFinal, descuentoPct, ahorro }
```

### Acción requerida

**Crear** `/js/calculos.js` con las tres funciones. No tocar `main.js`.

---

## 3. Problema 2 — CRÍTICO: Bug en `main.js` (código huérfano)

Dentro del bloque `if (cartBtn && cartDrawer && cartOverlay && cartClose)` hay un `setTimeout` **fuera de cualquier función**, referenciando una variable `t` que no existe en ese scope:

```javascript
// CÓDIGO HUÉRFANO (líneas después del listener de cartCheckout)
setTimeout(() => {
  t.classList.remove('show');   // ← t es undefined aquí
  setTimeout(() => t.remove(), 400);
}, 4000); // 👈 ESTA LÍNEA — cambia 4000 por 8000
```

Esto es un fragmento de `showToast()` que fue pegado accidentalmente en el bloque de inicialización del carrito. **Rompe la ejecución de `initNav()` con `ReferenceError: t is not defined`** antes de que el carrito pueda inicializarse.

### Acción requerida

**Eliminar** esas 4 líneas de `main.js`. El `showToast()` real ya existe y es correcto más abajo en el mismo archivo.

---

## 4. Problema 3 — FUNCIONAL: `initDescuentoDisplay()` no está implementada

El HTML del Paso 7 del stepper cliente ya tiene el contenedor:

```html
<div id="cl-pres-descuento" class="descuento-info">
  <!-- Vacío al cargar. JS lo rellena con initDescuentoDisplay() -->
</div>
```

Pero esa función **no existe en ningún archivo JS**. El slider de presupuesto se actualiza visualmente, pero el div de descuento nunca se rellena.

### Comportamiento esperado (según el comentario en el HTML)

- Slider mueve → leer valor → llamar `aplicarDescuento(valor)` → mostrar resultado en `#cl-pres-descuento`
- Ejemplo: `<span class="descuento-badge">🏷 10% OFF</span> Con descuento: <strong>$45.000 CLP</strong>`

### Acción requerida

**Agregar** `initDescuentoDisplay()` al final de `calculos.js` (o como módulo separado en `main.js`). Se recomienda en `calculos.js` para mantener la cohesión de responsabilidades.

---

## 5. Problema 4 — CSS: Clases sin estilos definidos

El JS de `actualizarCarrito()` genera HTML dinámico con clases que probablemente no tienen estilos en `scss/layout/_navbar.scss`:

| Clase CSS            | Generada por               | Riesgo sin estilo                        |
| -------------------- | -------------------------- | ---------------------------------------- |
| `.cart-item`       | `actualizarCarrito()`    | Items del carrito sin separación visual |
| `.cart-summary`    | `actualizarCarrito()`    | Resumen de totales sin destacar          |
| `.descuento-info`  | `index.html` (Paso 7)    | Div de descuento invisible o sin formato |
| `.descuento-badge` | `initDescuentoDisplay()` | Badge sin color verde                    |

El HTML ya referencia `.cart-header`, `.cart-body`, `.cart-footer` — estas pueden existir o no dependiendo del estado actual del CSS que no fue compartido.

### Acción requerida

**Agregar** en `scss/layout/_navbar.scss` (o en el archivo CSS compilado directamente si no se usa el flujo SASS) los bloques para `.cart-item`, `.cart-summary`, `.descuento-info` y `.descuento-badge`.

---

## 6. Plan de Acción Ordenado

```
PASO 1  →  Crear js/calculos.js
PASO 2  →  Eliminar bug en js/main.js (4 líneas huérfanas)
PASO 3  →  Agregar initDescuentoDisplay() en calculos.js
PASO 4  →  Agregar estilos CSS faltantes
```

### No se toca

- `index.html` — no requiere cambios
- La lógica existente de `main.js` (fuera del bug) — no se modifica
- Los `data-*` de las tarjetas — ya están correctos

---

## 7. Especificación de `js/calculos.js`

```javascript
/**
 * calculos.js — Hilo & Oficio
 * Funciones de cálculo y lógica de negocio del carrito.
 * Cargado ANTES de main.js para que sus funciones estén disponibles.
 */

'use strict';

// ============================================================
// aplicarDescuento(total)
// Calcula el descuento por volumen según el presupuesto.
// Parámetros:
//   total (Number): precio bruto en CLP
// Retorna:
//   { precioFinal, descuentoPct, ahorro }
// Umbrales:
//   > $100.000 CLP → 20% OFF
//   > $50.000  CLP → 10% OFF
//   ≤ $50.000  CLP → 0% (sin descuento)
// ============================================================
function aplicarDescuento(total) { ... }

// ============================================================
// calcularTotalCarrito(items)
// Suma todos los precios del array de items y aplica descuento.
// Parámetros:
//   items (Array<{ id, nombre, precio }>)
// Retorna:
//   { precioFinal, descuentoPct, ahorro }
// ============================================================
function calcularTotalCarrito(items) { ... }

// ============================================================
// realizarPedido(items)
// Registra el pedido. Placeholder hasta integrar API real.
// Parámetros:
//   items (Array<{ id, nombre, precio }>)
// ============================================================
function realizarPedido(items) { ... }

// ============================================================
// initDescuentoDisplay()
// Conecta el slider #cl-presupuesto con #cl-pres-descuento.
// Se ejecuta al cargar la página. Actualiza en tiempo real.
// ============================================================
function initDescuentoDisplay() { ... }

// Inicializar al cargar
initDescuentoDisplay();
```

---

## 8. Especificación del CSS faltante

```css
/* En scss/layout/_navbar.scss o css/main.css */

/* Items del carrito */
.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  font-size: 0.9rem;
}

/* Resumen de total y descuento */
.cart-summary {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 2px solid rgba(0,0,0,0.15);
  font-size: 0.875rem;
}

/* Contenedor del info de descuento (Paso 7 stepper) */
.descuento-info {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  min-height: 1.5rem; /* evita que el layout salte al aparecer */
}

/* Badge verde de descuento */
.descuento-badge {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  margin-right: 6px;
  font-size: 0.8rem;
}
```

---

## 9. Resumen Ejecutivo

| # | Acción                                      | Archivo            | Tipo     | Prioridad    |
| - | -------------------------------------------- | ------------------ | -------- | ------------ |
| 1 | Crear `js/calculos.js` con las 3 funciones | `js/calculos.js` | CREAR    | 🔴 Crítico  |
| 2 | Agregar `initDescuentoDisplay()`           | `js/calculos.js` | CREAR    | 🟡 Funcional |
| 3 | Eliminar 4 líneas de código huérfano      | `js/main.js`     | CORREGIR | 🔴 Crítico  |
| 4 | Agregar 4 bloques CSS                        | `css/main.css`   | AGREGAR  | 🟠 Visual    |

**Total de archivos a modificar o crear: 3**
(`js/calculos.js` nuevo · `js/main.js` corrección mínima · `css/main.css` adición)

**`index.html` no requiere ningún cambio.**

---

*Propuesta generada para rama CZ_sastre · Repositorio SASTRERIA*

No me deja acceder a los archivos crudos de las ramas — la red del entorno está restringida. Pero tengo suficiente con lo que ya está en el contexto. Te explico el enfoque concreto.

---

## El problema de revisar una fusión antes del merge

Cuando fusionás `mari-agrega` + `rama-amara` en `CZ_sastre`, los errores posibles son de  **3 tipos distintos** :

**Tipo A — Conflictos de merge** (Git te avisa): dos ramas tocaron la misma línea del mismo archivo. Git los marca con `<<<<<<<`. Fácil de ver, difícil de resolver bien.

**Tipo B — Errores silenciosos de integración** (Git NO te avisa): las ramas no conflictuaron, pero el código resultante está roto. Por ejemplo: rama-amara agrega `calcularTotalCarrito()` en `calculos.js`, y mari-agrega mueve o renombra ese mismo archivo. Git lo mezcla sin protestar, pero el resultado no funciona.

**Tipo C — Inconsistencias lógicas** (nadie te avisa): funciones que se llaman pero están en un orden incorrecto, variables asumidas en un scope que ya no las tiene, o CSS que apunta a clases que cambiaron de nombre.

Para este proyecto, los **Tipos B y C son el riesgo real** dado lo que ya veo en el código.

---

## Lo que yo ya sé que hay que revisar en este proyecto específico

Basándome en los archivos del contexto, estas son las **verificaciones concretas** para después de la fusión, antes del PR:

### 1. Verificar que `calculos.js` llegó completo y en el lugar correcto

```bash
# Desde CZ_sastre después de la fusión:
ls js/
# Debe aparecer: calculos.js  main.js
# Si no aparece calculos.js → git checkout de la rama que lo tiene
```

Luego abrir `js/calculos.js` y confirmar que existen las tres funciones:

* `aplicarDescuento(total)`
* `calcularTotalCarrito(items)`
* `realizarPedido(items)`

### 2. Verificar el orden de los `<script>` en `index.html`

Esto es crítico. El HTML ya tiene esto (lo veo en el documento):

```html
<script src="js/calculos.js"></script>
<script src="js/main.js"></script>
```

`calculos.js` **debe ir antes** que `main.js`. Si la fusión invirtió ese orden o eliminó alguno, `main.js` intentará llamar funciones que aún no existen.

### 3. Buscar el bug del `setTimeout` huérfano en `main.js`

Después de la fusión, buscar en `js/main.js` estas líneas exactas:

```javascript
setTimeout(() => {
  t.classList.remove('show');
  setTimeout(() => t.remove(), 400);
}, 4000);
```

Si aparecen **dentro del bloque `if (cartBtn && cartDrawer...)`** y  **fuera de cualquier función** , están en el lugar equivocado. Ese código pertenece a `showToast()` y ahí rompe `initNav()`.

### 4. Verificar que los `data-*` de las tarjetas no se pisaron

```bash
grep -n "data-id" index.html
```

Debe mostrar 4 líneas (lino, seda, algodón, gabardina). Si una rama tocó las tarjetas del catálogo, podría haber eliminado atributos.

### 5. Revisar que las clases CSS del carrito existen en el CSS compilado

```bash
grep -n "cart-item\|cart-summary\|descuento-info\|descuento-badge" css/main.css
```

Si no aparecen, el carrito funciona pero se ve sin formato.

---

## El flujo concreto para revisar la fusión

```bash
# 1. Hacer la fusión (todavía sin push)
git checkout CZ_sastre
git merge mari-agrega
git merge rama-amara

# 2. Ver qué cambió realmente
git diff HEAD~2 HEAD --stat
# Esto muestra todos los archivos modificados en los últimos 2 merges

# 3. Revisar cambios en los archivos críticos
git diff HEAD~2 HEAD -- js/main.js
git diff HEAD~2 HEAD -- js/calculos.js
git diff HEAD~2 HEAD -- index.html

# 4. Verificar que no hay markers de conflicto sin resolver
grep -rn "<<<<<<\|>>>>>>\|=======" js/ index.html css/

# 5. Abrir index.html en el navegador localmente
# Abrir DevTools → Console → verificar que no hay errores en rojo

# 6. Hacer la prueba funcional mínima:
#   - Hacer clic en "Añadir al carro" en una tarjeta
#   - El contador debe incrementar a 1
#   - Abrir el carrito → debe mostrar el item
#   - Mover el slider de presupuesto → debe aparecer el % de descuento
#   - Clic en "Finalizar pedido" → debe aparecer toast de confirmación

# 7. Solo si todo eso pasa → push y PR
git push origin CZ_sastre
```

---

## Por qué no podés confiar solo en que "no hubo conflictos"

Cuando Git dice `Merge made by the 'recursive' strategy` sin conflictos, solo significa que no tocaron la **misma línea** en el  **mismo archivo** . No detecta:

* Que una rama agregó una llamada a función que la otra rama nunca escribió
* Que una rama renombró una variable que la otra rama usa con el nombre viejo
* Que una rama movió un `<script>` de lugar

Por eso el paso 5 (abrir en el navegador y revisar la consola) es el más importante — es la única validación real.
