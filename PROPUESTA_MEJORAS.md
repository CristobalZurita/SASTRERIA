# 📋 PROPUESTA DE MEJORAS — Hilo & Oficio

**Documento base:** FALTANTES_REALES.md  
**Fecha:** Febrero 2026  
**Enfoque:** 100% JavaScript + localStorage (SIN BACKEND)

---

## LO QUE FALTA SEGÚN ANÁLISIS REAL

### 1. HTML - 11 enlaces rotos por corregir

| # | Línea | Cambiar esto | Por esto |
|---|-------|--------------|----------|
| 1 | 36 | `<a href="#" class="nav__logo">` | `<a href="#inicio" class="nav__logo">` |
| 2 | 786 | `<a href="#" class="btn btn--terra btn--lg">Volver al inicio</a>` | `<a href="#inicio" class="btn btn--terra btn--lg">Volver al inicio</a>` |
| 3 | 1009 | `<a href="#" class="btn btn--indigo btn--lg">Volver al inicio</a>` | `<a href="#inicio" class="btn btn--indigo btn--lg">Volver al inicio</a>` |
| 4 | 1076 | `<a href="#">Sobre nosotros</a>` | `<a href="#inicio">Sobre nosotros</a>` |
| 5 | 1077 | `<a href="#">Blog textil</a>` | `<a href="#inicio">Blog textil</a>` |
| 6 | 1078 | `<a href="#">Contacto</a>` | `<a href="#inicio">Contacto</a>` |
| 7 | 1079 | `<a href="#">Privacidad</a>` | `<a href="#inicio">Privacidad</a>` |
| 8 | 1087 | `<a href="#" aria-label="Instagram">📸</a>` | `<a href="https://instagram.com" aria-label="Instagram">📸</a>` |
| 9 | 1088 | `<a href="#" aria-label="Facebook">📘</a>` | `<a href="https://facebook.com" aria-label="Facebook">📘</a>` |
| 10 | 1089 | `<a href="#" aria-label="TikTok">🎵</a>` | `<a href="https://tiktok.com" aria-label="TikTok">🎵</a>` |
| 11 | 1090 | `<a href="#" aria-label="LinkedIn">💼</a>` | `<a href="https://linkedin.com" aria-label="LinkedIn">💼</a>` |

---

### 2. JAVASCRIPT - 11 funciones por crear

AGREGAR EN `js/main.js` (después de `'use strict'`):

```javascript
// ============================================================
// 1. CATÁLOGO DE TELAS — Objeto con datos
// ============================================================
const catalogoTelas = {
  linoPremium: { id: 'lino-premium', nombre: 'Lino Premium', tipo: 'natural', precio: 4200, precioFormateado: '$4.200', unidad: 'metro', stock: true },
  sedaNatural: { id: 'seda-natural', nombre: 'Seda Natural', tipo: 'premium', precio: 12800, precioFormateado: '$12.800', unidad: 'metro', stock: true },
  algodonPopelin: { id: 'algodon-popelin', nombre: 'Algodón Popelín', tipo: 'natural', precio: 2800, precioFormateado: '$2.800', unidad: 'metro', stock: true },
  gabardinaNavy: { id: 'gabardina-navy', nombre: 'Gabardina Navy', tipo: 'mezcla', precio: 3500, precioFormateado: '$3.500', unidad: 'metro', stock: true }
};

// ============================================================
// 2. MOSTRAR CATÁLOGO
// ============================================================
function mostrarCatalogo() {
  console.log('═══════════════════════════════════════════');
  console.log('📦 CATÁLOGO — Hilo & Oficio');
  console.log('═══════════════════════════════════════════');
  for (const [key, tela] of Object.entries(catalogoTelas)) {
    const stockStatus = tela.stock ? '✅ Disponible' : '❌ Agotado';
    console.log(`• ${tela.nombre} - ${tela.precioFormateado}/mt - ${stockStatus}`);
  }
  console.log('═══════════════════════════════════════════');
}

// ============================================================
// 3. CARRITO
// ============================================================
let carrito = [];

// ============================================================
// 4. AGREGAR AL CARRITO
// ============================================================
function agregarAlCarrito(productoId, cantidad = 1) {
  const producto = catalogoTelas[productoId];
  if (!producto) { console.error(`❌ Producto no encontrado: ${productoId}`); return false; }
  if (!producto.stock) { console.error(`❌ Agotado: ${producto.nombre}`); return false; }
  
  const existente = carrito.find(item => item.id === productoId);
  if (existente) { existente.cantidad += cantidad; }
  else { carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: cantidad }); }
  
  guardarCarrito();
  console.log(`✅ Agregado: ${producto.nombre} x${cantidad}`);
  return true;
}

// ============================================================
// 5. VER CARRITO
// ============================================================
function verCarrito() {
  console.log('═══════════════════════════════════════════');
  console.log('🛒 CARRITO DE COMPRAS');
  console.log('═══════════════════════════════════════════');
  if (carrito.length === 0) { console.log('El carrito está vacío.'); return; }
  
  let subtotal = 0;
  carrito.forEach((item, index) => {
    const itemTotal = item.precio * item.cantidad;
    subtotal += itemTotal;
    console.log(`${index + 1}. ${item.nombre} x${item.cantidad} = $${itemTotal.toLocaleString()}`);
  });
  console.log(`Subtotal: $${subtotal.toLocaleString()} CLP`);
  console.log('═══════════════════════════════════════════');
  return subtotal;
}

// ============================================================
// 6. CALCULAR TOTAL + 7. APLICAR DESCUENTO (ANIDADA)
// ============================================================
function calcularTotal(pedido) {
  if (!pedido || pedido.length === 0) { console.error('❌ Carrito vacío'); return 0; }
  
  let subtotal = 0;
  pedido.forEach(item => { subtotal += item.precio * item.cantidad; });
  
  console.log(`Subtotal: $${subtotal.toLocaleString()} CLP`);
  
  // Función anidada: aplicarDescuento
  let descuentoAplicado = 0;
  if (subtotal > 100000) { descuentoAplicado = subtotal * 0.20; console.log(`🎉 Descuento 20%: -$${descuentoAplicado.toLocaleString()}`); }
  else if (subtotal > 50000) { descuentoAplicado = subtotal * 0.10; console.log(`🎉 Descuento 10%: -$${descuentoAplicado.toLocaleString()}`); }
  
  const totalFinal = subtotal - descuentoAplicado;
  console.log(`💵 TOTAL A PAGAR: $${totalFinal.toLocaleString()} CLP`);
  return totalFinal;
}

// ============================================================
// 8. REALIZAR PEDIDO
// ============================================================
function realizarPedido(pedido) {
  if (!pedido || pedido.length === 0) { console.error('❌ Pedido vacío'); return false; }
  
  const totalFinal = calcularTotal(pedido);
  const idPedido = 'PED-' + Date.now().toString(36).toUpperCase();
  
  const pedidoCompleto = {
    id: idPedido,
    fecha: new Date().toISOString(),
    productos: pedido,
    total: totalFinal,
    estado: 'pendiente'
  };
  
  guardarPedido(pedidoCompleto);
  
  console.log('═══════════════════════════════════════════');
  console.log('✅ ¡PEDIDO CONFIRMADO!');
  console.log(`📋 ID: ${idPedido}`);
  console.log(`💵 Total: $${totalFinal.toLocaleString()} CLP`);
  console.log('═══════════════════════════════════════════');
  
  carrito = [];
  guardarCarrito();
  return pedidoCompleto;
}

// ============================================================
// LOCALSTORAGE — FALSO BACKEND
// ============================================================
const LS_KEYS = {
  CLIENTES: 'hiloOfico_clientes',
  POSTULANTES: 'hiloOfico_postulantes',
  PEDIDOS: 'hiloOfico_pedidos',
  CARRITO: 'hiloOfico_carrito'
};

function guardarCarrito() { localStorage.setItem(LS_KEYS.CARRITO, JSON.stringify(carrito)); }
function cargarCarrito() { const s = localStorage.getItem(LS_KEYS.CARRITO); if (s) { try { carrito = JSON.parse(s); } catch(e) { carrito = []; } } }

function guardarCliente(datos) {
  const lista = obtenerClientes();
  lista.push({ id: 'CLI-' + Date.now().toString(36).toUpperCase(), fecha: new Date().toISOString(), ...datos });
  localStorage.setItem(LS_KEYS.CLIENTES, JSON.stringify(lista));
}
function obtenerClientes() { const d = localStorage.getItem(LS_KEYS.CLIENTES); return d ? JSON.parse(d) : []; }

function guardarPostulacion(datos) {
  const lista = obtenerPostulaciones();
  lista.push({ id: 'POST-' + Date.now().toString(36).toUpperCase(), fecha: new Date().toISOString(), ...datos });
  localStorage.setItem(LS_KEYS.POSTULANTES, JSON.stringify(lista));
}
function obtenerPostulaciones() { const d = localStorage.getItem(LS_KEYS.POSTULANTES); return d ? JSON.parse(d) : []; }

function guardarPedido(pedido) {
  const lista = obtenerPedidos();
  lista.push(pedido);
  localStorage.setItem(LS_KEYS.PEDIDOS, JSON.stringify(lista));
}
function obtenerPedidos() { const d = localStorage.getItem(LS_KEYS.PEDIDOS); return d ? JSON.parse(d) : []; }

// Inicializar
(function initLocalStorage() { cargarCarrito(); console.log('💾 Sistema localStorage iniciado'); })();
```

---

### 3. HTML - Agregar botones de comprar en catálogo

En las tarjetas de telas (líneas ~340-380), AGREGAR:

```html
<button class="btn btn--terra btn--sm" onclick="agregarAlCarrito('lino-premium', 1)">
  Agregar al carrito
</button>
```

---

### 4. Modificar submitFlow() para guardar en localStorage

En `js/main.js`,buscar `function submitFlow` y AGREGAR antes del `setTimeout`:

```javascript
// Guardar en localStorage
if (flowId === 'flow-client') { guardarCliente(clientData); }
if (flowId === 'flow-worker') { guardarPostulacion(workerData); }
```

---

## 📋 RESUMEN DE IMPLEMENTACIÓN

| # | Qué hacer | Dónde | Estado |
|---|-----------|-------|--------|
| 1 | Corregir 11 enlaces `href="#"` | index.html | ❌ POR HACER |
| 2 | Agregar 11 funciones JS | js/main.js | ❌ POR HACER |
| 3 | Agregar botones comprar | index.html | ❌ POR HACER |
| 4 | Modificar submitFlow | js/main.js | ❌ POR HACER |

**TODO 100% JavaScript + localStorage - CERO backend**
