# 📋 PROPUESTA DE MEJORAS — Hilo & Oficio

**Documento base:** FALTANTE.md (Diagnóstico técnico)  
**Fecha:** 24 de febrero de 2026  
**Enfoque:** Implementación con localStorage como "Falso Backend"

---

## 🎯 RESUMEN EJECUTIVO

Este documento propone las mejoras técnicas necesarias para hacer el sitio **funcional y activo** sin necesidad de un backend real, utilizando **localStorage de JavaScript** como almacenamiento persistente del lado del cliente.

### Estado Actual vs Propuesta

| Aspecto | Estado Actual | Propuesta |
|---------|--------------|-----------|
| Catálogo | Solo visual (HTML) | Objeto JS con datos + funciones |
| Formularios | Simulación sin guardado | localStorage persistente |
| Descuentos | No existen | Funciones con lógica de descuentos |
| Pedidos | No hay sistema | Carrito + cálculo total + confirmación |

---

## 1️⃣ FUNCIÓN PARA MOSTRAR EL CATÁLOGO

### 1.1 Estado Actual
El catálogo está hardcodeado en HTML (solo visual), no hay datos en JavaScript.

### 1.2 Propuesta: Objeto Catalogo + Función mostrarCatalogo()

```javascript
// ============================================================
// CATÁLOGO DE TELAS — Objeto con datos
// ============================================================
const catalogoTelas = {
  // Telas Naturales
  linoPremium: {
    id: 'lino-premium',
    nombre: 'Lino Premium',
    tipo: 'natural',
    precio: 4200,
    precioFormateado: '$4.200',
    unidad: 'metro',
    stock: true,
    descripcion: '100% Lino belga de alta calidad'
  },
  sedaNatural: {
    id: 'seda-natural',
    nombre: 'Seda Natural',
    tipo: 'premium',
    precio: 12800,
    precioFormateado: '$12.800',
    unidad: 'metro',
    stock: true,
    descripcion: '100% Seda natural importada'
  },
  algodonPopelin: {
    id: 'algodon-popelin',
    nombre: 'Algodón Popelín',
    tipo: 'natural',
    precio: 2800,
    precioFormateado: '$2.800',
    unidad: 'metro',
    stock: true,
    descripcion: '100% Algodón peruano'
  },
  gabardinaNavy: {
    id: 'gabardina-navy',
    nombre: 'Gabardina Navy',
    tipo: 'mezcla',
    precio: 3500,
    precioFormateado: '$3.500',
    unidad: 'metro',
    stock: true,
    descripcion: 'Poliésters-Viscosa premium'
  },
  // Telas adicionales para el catálogo
  lanaMerino: {
    id: 'lana-merino',
    nombre: 'Lana Merino',
    tipo: 'natural',
    precio: 8500,
    precioFormateado: '$8.500',
    unidad: 'metro',
    stock: true,
    descripcion: '100% Lana merino australiana'
  },
  satenBruñido: {
    id: 'saten-brunido',
    nombre: 'Satén Bruñido',
    tipo: 'premium',
    precio: 9800,
    precioFormateado: '$9.800',
    unidad: 'metro',
    stock: true,
    descripcion: 'Satén de alta caída'
  },
  denimCoreano: {
    id: 'denim-coreano',
    nombre: 'Denim Coreano',
    tipo: 'mezcla',
    precio: 4500,
    precioFormateado: '$4.500',
    unidad: 'metro',
    stock: false,
    descripcion: 'Denim importado de Corea'
  },
  organzaSilk: {
    id: 'organza-silk',
    nombre: 'Organza de Seda',
    tipo: 'premium',
    precio: 11200,
    precioFormateado: '$11.200',
    unidad: 'metro',
    stock: true,
    descripcion: 'Organza transparente premium'
  }
};

// ============================================================
// FUNCIÓN: Mostrar catálogo en consola
// ============================================================
function mostrarCatalogo() {
  console.log('═══════════════════════════════════════════');
  console.log('📦 CATÁLOGO — Hilo & Oficio');
  console.log('═══════════════════════════════════════════');
  
  let contador = 1;
  
  for (const [key, tela] of Object.entries(catalogoTelas)) {
    const stockStatus = tela.stock ? '✅ Disponible' : '❌ Agotado';
    console.log(`${contador}. ${tela.nombre.toUpperCase()}`);
    console.log(`   💰 Precio: ${tela.precioFormateado} / ${tela.unidad}`);
    console.log(`   🏷️ Tipo: ${tela.tipo}`);
    console.log(`   📊 Estado: ${stockStatus}`);
    console.log(`   📝 ${tela.descripcion}`);
    console.log('───────────────────────────────────────────');
    contador++;
  }
  
  console.log(`Total de productos: ${Object.keys(catalogoTelas).length}`);
  console.log('═══════════════════════════════════════════');
}

// Ejecutar al cargar para verificar
// mostrarCatalogo();
```

### 1.3 Dónde implementarlo
- **Archivo:** `js/main.js`
- **Ubicación sugerida:** Al inicio del archivo, después de `'use strict'`
- **Elemento HTML relacionado:** `#catalogo`, `.fabric-card`

---

## 2️⃣ FUNCIÓN PARA CALCULAR EL TOTAL

### 2.1 Estado Actual
No existe sistema de pedidos ni cálculo de precios.

### 2.2 Propuesta: Sistema de Carrito + calcularTotal()

```javascript
// ============================================================
// SISTEMA DE PEDIDOS — Carrito
// ============================================================
let carrito = [];

// Función para agregar al carrito
function agregarAlCarrito(productoId, cantidad = 1) {
  const producto = catalogoTelas[productoId];
  
  if (!producto) {
    console.error(`❌ Producto no encontrado: ${productoId}`);
    return false;
  }
  
  if (!producto.stock) {
    console.error(`❌ Producto agotado: ${producto.nombre}`);
    return false;
  }
  
  // Verificar si ya está en el carrito
  const existente = carrito.find(item => item.id === productoId);
  
  if (existente) {
    existente.cantidad += cantidad;
    console.log(`✅ Actualizado: ${producto.nombre} (cantidad: ${existente.cantidad})`);
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    });
    console.log(`✅ Agregado: ${producto.nombre} x${cantidad}`);
  }
  
  // Guardar en localStorage
  guardarCarrito();
  
  return true;
}

// Función para ver el carrito
function verCarrito() {
  console.log('═══════════════════════════════════════════');
  console.log('🛒 CARRITO DE COMPRAS');
  console.log('═══════════════════════════════════════════');
  
  if (carrito.length === 0) {
    console.log('El carrito está vacío.');
    return;
  }
  
  let subtotal = 0;
  
  carrito.forEach((item, index) => {
    const itemTotal = item.precio * item.cantidad;
    subtotal += itemTotal;
    console.log(`${index + 1}. ${item.nombre}`);
    console.log(`   Cantidad: ${item.cantidad} | Precio unitario: $${item.precio.toLocaleString()}`);
    console.log(`   Subtotal: $${itemTotal.toLocaleString()}`);
    console.log('───────────────────────────────────────────');
  });
  
  console.log(`Subtotal: $${subtotal.toLocaleString()} CLP`);
  console.log('═══════════════════════════════════════════');
  
  return subtotal;
}

// Función principal: calcular total
function calcularTotal(pedido) {
  // Si viene como array de IDs, convertir a formato carrito
  if (Array.isArray(pedido) && typeof pedido[0] === 'string') {
    pedido = pedido.map(id => {
      const producto = catalogoTelas[id];
      return producto ? { ...producto, cantidad: 1 } : null;
    }).filter(Boolean);
  }
  
  // Calcular subtotal
  let subtotal = 0;
  
  pedido.forEach(item => {
    subtotal += item.precio * item.cantidad;
  });
  
  console.log('═══════════════════════════════════════════');
  console.log('💰 CÁLCULO DE TOTAL');
  console.log('═══════════════════════════════════════════');
  console.log(`Subtotal: $${subtotal.toLocaleString()} CLP`);
  
  // Aplicar descuento (función anidada)
  const totalConDescuento = aplicarDescuento(subtotal);
  
  console.log('═══════════════════════════════════════════');
  
  return totalConDescuento;
}
```

### 2.3 Dónde implementarlo
- **Archivo:** `js/main.js`
- **Ubicación sugerida:** Después de la función `mostrarCatalogo()`

---

## 3️⃣ APLICANDO DESCUENTOS CON FUNCIONES ANIDADAS

### 3.1 Estado Actual
No existe lógica de descuentos.

### 3.2 Propuesta: aplicarDescuento() anidada

```javascript
// ============================================================
// FUNCIÓN: Aplicar descuentos (anidada dentro de calcularTotal)
// ============================================================
function aplicarDescuento(total) {
  // Esta función se llama DENTRO de calcularTotal()
  
  let descuentoAplicado = 0;
  let porcentaje = 0;
  
  if (total > 100000) {
    // Descuento del 20% para compras mayores a $100.000
    porcentaje = 20;
    descuentoAplicado = total * 0.20;
  } else if (total > 50000) {
    // Descuento del 10% para compras mayores a $50.000
    porcentaje = 10;
    descuentoAplicado = total * 0.10;
  }
  
  if (descuentoAplicado > 0) {
    console.log(`🎉 Descuento aplicado: ${porcentaje}% (-$${descuentoAplicado.toLocaleString()})`);
  } else {
    console.log('💡 ¡Añade más productos para obtener un descuento!');
    console.log('   > $50.000 = 10% de descuento');
    console.log('   > $100.000 = 20% de descuento');
  }
  
  const totalFinal = total - descuentoAplicado;
  console.log(`💵 TOTAL A PAGAR: $${totalFinal.toLocaleString()} CLP`);
  
  return totalFinal;
}

// Alias para usar directamente
function aplicarDescuentoDirecto(total) {
  return aplicarDescuento(total);
}
```

### 3.3 Lógica de descuentos

| Condición | Descuento |
|-----------|-----------|
| $0 - $50.000 | 0% (sin descuento) |
| $50.001 - $100.000 | 10% de descuento |
| + $100.000 | 20% de descuento |

---

## 4️⃣ SIMULANDO EL PROCESO DE COMPRA

### 4.1 Estado Actual
Los formularios se "envían" sin guardar nada.

### 4.2 Propuesta: realizarPedido() completa

```javascript
// ============================================================
// FUNCIÓN: Realizar pedido completo
// ============================================================
function realizarPedido(pedido) {
  // 1. Validar que hay productos
  if (!pedido || pedido.length === 0) {
    console.error('❌ El pedido está vacío. Agrega productos primero.');
    return false;
  }
  
  console.log('═══════════════════════════════════════════');
  console.log('🚀 PROCESANDO PEDIDO');
  console.log('═══════════════════════════════════════════');
  
  // 2. Llamar a calcularTotal() que internamente llama a aplicarDescuento()
  const totalFinal = calcularTotal(pedido);
  
  // 3. Generar ID de pedido
  const idPedido = 'PED-' + Date.now().toString(36).toUpperCase();
  
  // 4. Crear objeto de pedido completo
  const pedidoCompleto = {
    id: idPedido,
    fecha: new Date().toISOString(),
    productos: pedido.map(item => ({
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad
    })),
    total: totalFinal,
    estado: 'pendiente'
  };
  
  // 5. Guardar en localStorage (FALSO BACKEND)
  guardarPedido(pedidoCompleto);
  
  // 6. Mensaje de confirmación
  console.log('═══════════════════════════════════════════');
  console.log('✅ ¡PEDIDO CONFIRMADO!');
  console.log('═══════════════════════════════════════════');
  console.log(`📋 ID de tu pedido: ${idPedido}`);
  console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-CL')}`);
  console.log(`💵 Total pagado: $${totalFinal.toLocaleString()} CLP`);
  console.log('📧 Te enviaremos un correo de confirmación.');
  console.log('═══════════════════════════════════════════');
  
  // Limpiar carrito después del pedido
  carrito = [];
  guardarCarrito();
  
  return pedidoCompleto;
}

// Función auxiliar: guardar pedido en localStorage
function guardarPedido(pedido) {
  // Obtener pedidos anteriores
  const pedidos = obtenerPedidos();
  
  // Agregar nuevo pedido
  pedidos.push(pedido);
  
  // Guardar en localStorage
  localStorage.setItem('hiloOfico_pedidos', JSON.stringify(pedidos));
  
  console.log('💾 Pedido guardado en localStorage');
}

// Función auxiliar: obtener todos los pedidos
function obtenerPedidos() {
  const pedidos = localStorage.getItem('hiloOfico_pedidos');
  return pedidos ? JSON.parse(pedidos) : [];
}
```

---

## 5️⃣ PERSISTENCIA CON LOCALSTORAGE

### 5.1 Estado Actual
No hay persistencia de datos.

### 5.2 Propuesta: Sistema completo de localStorage

```javascript
// ============================================================
// LOCALSTORAGE — Falso Backend
// ============================================================

// Keys para localStorage
const LS_KEYS = {
  CLIENTES: 'hiloOfico_clientes',
  POSTULANTES: 'hiloOfico_postulantes',
  PEDIDOS: 'hiloOfico_pedidos',
  CARrito: 'hiloOfico_carrito',
  PRESUPUESTOS: 'hiloOfico_presupuestos'
};

// ----- Guardar Carrito -----
function guardarCarrito() {
  localStorage.setItem(LS_KEYS.CARRITO, JSON.stringify(carrito));
}

// ----- Cargar Carrito al iniciar -----
function cargarCarrito() {
  const stored = localStorage.getItem(LS_KEYS.CARRITO);
  if (stored) {
    try {
      carrito = JSON.parse(stored);
      console.log(`🛒 Carrito cargado: ${carrito.length} productos`);
    } catch (e) {
      console.error('Error al cargar carrito:', e);
      carrito = [];
    }
  }
}

// ----- Guardar datos de cliente -----
function guardarCliente(datos) {
  const clientes = obtenerClientes();
  clientes.push({
    id: 'CLI-' + Date.now().toString(36).toUpperCase(),
    fecha: new Date().toISOString(),
    ...datos
  });
  localStorage.setItem(LS_KEYS.CLIENTES, JSON.stringify(clientes));
}

function obtenerClientes() {
  const data = localStorage.getItem(LS_KEYS.CLIENTES);
  return data ? JSON.parse(data) : [];
}

// ----- Guardar postulación -----
function guardarPostulacion(datos) {
  const postulaciones = obtenerPostulaciones();
  postulaciones.push({
    id: 'POST-' + Date.now().toString(36).toUpperCase(),
    fecha: new Date().toISOString(),
    ...datos
  });
  localStorage.setItem(LS_KEYS.POSTULANTES, JSON.stringify(postulaciones));
}

function obtenerPostulaciones() {
  const data = localStorage.getItem(LS_KEYS.POSTULANTES);
  return data ? JSON.parse(data) : [];
}

// ----- Guardar presupuesto -----
function guardarPresupuesto(datos) {
  const presupuestos = obtenerPresupuestos();
  presupuestos.push({
    id: 'PRES-' + Date.now().toString(36).toUpperCase(),
    fecha: new Date().toISOString(),
    ...datos
  });
  localStorage.setItem(LS_KEYS.PRESUPUESTOS, JSON.stringify(presupuestos));
}

function obtenerPresupuestos() {
  const data = localStorage.getItem(LS_KEYS.PRESUPUESTOS);
  return data ? JSON.parse(data) : [];
}

// ----- Inicializar al cargar la página -----
(function initLocalStorage() {
  cargarCarrito();
  console.log('💾 Sistema de localStorage inicializado');
})();
```

---

## 6️⃣ INTEGRACIÓN CON FORMULARIOS EXISTENTES

### 6.1 Modificar submitFlow() en stepper

```javascript
// Modificar la función submitFlow existente en js/main.js
// Located around line 195-210

function submitFlow(btn, tipoFlujo) {
  btn.classList.add('btn--loading'); btn.disabled = true;
  
  setTimeout(() => {
    // Guardar en localStorage según el tipo de flujo
    if (tipoFlujo === 'cliente') {
      guardarCliente(clientData);
      console.log('✅ Cliente guardado en localStorage');
    } else if (tipoFlujo === 'postulante') {
      guardarPostulacion(workerData);
      console.log('✅ Postulación guardada en localStorage');
    }
    
    if (wrapper)  wrapper.style.display = 'none';
    if (resultEl) resultEl.classList.add('show');
    populateSummary();
    
    if (barFill) barFill.style.width = '100%';
    if (barPct)  barPct.textContent  = '100% completado';
    dots.forEach(d => d.classList.replace('active', 'done') || d.classList.add('done'));
    
    showToast(toastOk, 'ok');
  }, 1800);
}
```

### 6.2 Botones "Volver al inicio" - Corregir

```html
<!-- En index.html, cambiar: -->
<a href="#" class="btn btn--terra btn--lg">Volver al inicio</a>
<!-- Por: -->
<a href="#inicio" class="btn btn--terra btn--lg">Volver al```

---

##  inicio</a>
7️⃣ RESUMEN: DÓNDE IMPLEMENTAR CADA COSA

### Tabla de implementación

| Función | Archivo | Línea aproximada | Estado actual |
|---------|---------|-------------------|---------------|
| `catalogoTelas` | main.js | Después de `'use strict'` | ❌ No existe |
| `mostrarCatalogo()` | main.js | Después de objeto catálogo | ❌ No existe |
| `agregarAlCarrito()` | main.js | Después de catálogo | ❌ No existe |
| `verCarrito()` | main.js | Después de agregar | ❌ No existe |
| `calcularTotal()` | main.js | Después de verCarrito | ❌ No existe |
| `aplicarDescuento()` | main.js | Dentro de calcularTotal | ❌ No existe |
| `realizarPedido()` | main.js | Después de calcularTotal | ❌ No.exists |
| `LS_KEYS`, `guardar*`, `obtener*` | main.js | Al final del archivo | ❌ No existe |
| Corregir `href="#"` | index.html | Footer, Navbar, Resultados | ⚠️ Parcial |

---

## 8️⃣ EJEMPLO DE USO COMPLETO

```javascript
// ===== EJEMPLO DE USO =====

// 1. Ver catálogo
mostrarCatalogo();

// 2. Agregar productos al carrito
agregarAlCarrito('lino-premium', 2);  // 2 metros de lino
agregarAlCarrito('seda-natural', 1);  // 1 metro de seda

// 3. Ver carrito
verCarrito();

// 4. Realizar pedido (esto calcula total + descuento + guarda)
const miPedido = [
  { id: 'lino-premium', nombre: 'Lino Premium', precio: 4200, cantidad: 2 },
  { id: 'seda-natural', nombre: 'Seda Natural', precio: 12800, cantidad: 1 }
];

realizarPedido(miPedido);
// Output esperado:
// - Subtotal: $21.200
// - Descuento 10%: -$2.120
// - Total a pagar: $19.080 CLP

// 5. Ver todos los pedidos guardados
console.log(obtenerPedidos());
// Output: Array con todos los pedidos en localStorage
```

---

## 9️⃣ PRÓXIMOS PASOS PARA EL EQUIPO

### Sprint 1: Implementar Catálogo + Carrito
- [ ] Crear objeto `catalogoTelas` en `js/main.js`
- [ ] Implementar `mostrarCatalogo()`
- [ ] Implementar `agregarAlCarrito()` y `verCarrito()`

### Sprint 2: Sistema de Pedidos
- [ ] Implementar `calcularTotal()` con `aplicarDescuento()` anidada
- [ ] Implementar `realizarPedido()`
- [ ] Conectar con botones de catálogo (agregar "Agregar al carrito" en HTML)

### Sprint 3: LocalStorage
- [ ] Crear sistema de persistencia completo
- [ ] Modificar `submitFlow()` para guardar en localStorage
- [ ] Crear panel de administración simple (visualizar pedidos)

### Sprint 4: Correcciones menores
- [ ] Corregir enlaces rotos (`href="#"` → `href="#inicio"`)
- [ ] Mejorar validaciones de email y RUT
- [ ] Agregar funcionalidad a dots del stepper

---

## 📁 ARCHIVO ACTUALIZADO RESULTANTE

```
js/main.js (propuesta de adiciones):

Línea 1-10:  ✓现有代码
Línea 11:    + const catalogoTelas = { ... }
Línea 50:    + function mostrarCatalogo() { ... }
Línea 75:    + let carrito = []
Línea 77:    + function agregarAlCarrito() { ... }
Línea 100:   + function verCarrito() { ... }
Línea 130:   + function calcularTotal() { ... }
Línea 150:   +   function aplicarDescuento() { ... } // Anidada
Línea 175:   + function realizarPedido() { ... }
Línea 210:   + const LS_KEYS = { ... }
Línea 220:   + function guardarCarrito() { ... }
Línea 225:   + function cargarCarrito() { ... }
Línea 235:   + function guardarCliente() { ... }
Línea 245:   + function guardarPostulacion() { ... }
Línea 255:   + function guardarPresupuesto() { ... }
Línea 265:   + (function initLocalStorage() { ... })();
```

---

*Documento creado como propuesta de mejora. Todas las funciones son **aditivas** - no modifican el código existente, solo agregan funcionalidad.*
