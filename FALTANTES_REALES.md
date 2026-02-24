# 📋 LO QUE REALMENTE FALTA — Hilo & Oficio

**Fecha:** Febrero 2026  
**Enfoque:** Solo lo que NO existe, 100% JavaScript + localStorage

---

## 🔴 ERRORES ENCONTRADOS (11 total)

### HTML - Enlaces rotos (11)

| # | Línea | Código | Problema |
|---|-------|--------|----------|
| 1 | 36 | `<a href="#" class="nav__logo">` | Logo no lleva a inicio |
| 2 | 786 | `<a href="#" class="btn btn--terra btn--lg">Volver al inicio</a>` | Botón roto |
| 3 | 1009 | `<a href="#" class="btn btn--indigo btn--lg">Volver al inicio</a>` | Botón roto |
| 4 | 1076 | `<a href="#">Sobre nosotros</a>` | No existe página |
| 5 | 1077 | `<a href="#">Blog textil</a>` | No existe página |
| 6 | 1078 | `<a href="#">Contacto</a>` | No existe página |
| 7 | 1079 | `<a href="#">Privacidad</a>` | No existe página |
| 8 | 1087 | `<a href="#" aria-label="Instagram">📸</a>` | No hay link |
| 9 | 1088 | `<a href="#" aria-label="Facebook">📘</a>` | No hay link |
| 10 | 1089 | `<a href="#" aria-label="TikTok">🎵</a>` | No hay link |
| 11 | 1090 | `<a href="#" aria-label="LinkedIn">💼</a>` | No hay link |

---

## 🔴 FUNCIONES JS QUE FALTAN (0 total - NO EXISTEN)

El archivo `js/main.js` NO tiene ninguna de estas funciones:

| # | Función | Para qué sirve |
|---|---------|----------------|
| 1 | `catalogoTelas` | Objeto con datos de productos |
| 2 | `mostrarCatalogo()` | Imprime catálogo en consola |
| 3 | `carrito` | Array para guardar productos |
| 4 | `agregarAlCarrito()` | Agrega producto al carrito |
| 5 | `verCarrito()` | Muestra productos del carrito |
| 6 | `calcularTotal()` | Calcula total con descuentos |
| 7 | `aplicarDescuento()` | Aplica 10% o 20% según monto |
| 8 | `realizarPedido()` | Finaliza compra + guarda en localStorage |
| 9 | `guardarCliente()` | Guarda cliente en localStorage |
| 10 | `guardarPostulacion()` | Guarda postulación en localStorage |
| 11 | `obtenerPedidos()` | Lee pedidos desde localStorage |

**BÚSQUEDA CONFIRMADA:** `grep -n "localStorage\|carrito\|catalogo\|pedido\|descuento" js/main.js` → **0 resultados**

---

## 🔴 CATÁLOGO SIN FUNCIÓN

Las tarjetas de telas (`index.html` líneas ~340-380):
- Muestran precio ($4.200, $12.800, etc.)
- **NO hay botón "Agregar al carrito"**
- **NO hay funcionalidad de compra**

---

## 🔴 FORMULARIOS SIN GUARDADO

Los formularios (cliente 10 pasos + postulante 11 pasos):
- Tienen validación ✅
- Tienen navegación ✅
- **NO guardan datos en localStorage** ❌

---

## ✅ LO QUE SÍ FUNCIONA (NO TOCAR)

- Arquitectura SASS (estructura 7-1)
- Filtros del catálogo (JS)
- Stepper de formularios
- Scroll suave
- Drawer móvil
- Toast notifications
- Scroll to top

---

## 📝 RESUMEN: SOLO ESTO FALTA

1. **11 enlaces HTML** rotos (arreglar con `href="#inicio"`)
2. **11 funciones JS** que no existen (crear desde cero)
3. **Sistema localStorage** (crear desde cero)
4. **Botones comprar** en catálogo (agregar HTML + JS)

**TODO 100% JavaScript/localStorage - CERO backend**
