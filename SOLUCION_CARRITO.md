# SOLUCIÓN: Carrito de Compras

## Estado Actual (Análisis Previo)

### Lo que EXISTE (NO eliminar, ADICIONAR):

| Elemento | Existe en | Estado |
|----------|-----------|--------|
| HTML del carrito | index.html | ✅ Existe |
| Botones "Añadir al carro" | index.html | ✅ Existe (4) |
| Estilos CSS | scss/layout/_navbar.scss | ✅ Existe |
| JS: abrir/cerrar drawer | js/main.js (líneas 61-154) | ✅ Existe |
| JS: aplicarDescuento() | js/main.js (línea 1141) | ✅ YA EXISTE |
| JS: Conectado a calculadora | js/main.js (línea 1255) | ✅ YA CONECTADO |

---

## PUNTO 3: aplicarDescuento() - ✅ YA IMPLEMENTADO

La función existe en `js/main.js` (línea 1141) y está conectada a la calculadora:

```javascript
// js/main.js - Línea 1141
function aplicarDescuento(total) {
  if (total > 100) {
    descuentoPct = 20;  // 20% de descuento
  } else if (total > 50) {
    descuentoPct = 10; // 10% de descuento
  }
  // Retorna: { precioFinal, descuentoPct, ahorro }
}

// js/main.js - Línea 1255 (conectado)
const { precioFinal, descuentoPct, ahorro } = aplicarDescuento(total);
```

---

## Lo que FALTA (Crear/Adicionar):

### 1. HTML: data-attributes en tarjetas
- ❌ Algodón: FALTA data-id, data-name, data-price
- ❌ Gabardina: FALTA data-id, data-name, data-price

### 2. JavaScript: funcionalidad del carrito

#### 2.1 Array para almacenar productos
```javascript
let carritoItems = [];
```

#### 2.2 Función agregarAlCarrito()
```javascript
function agregarAlCarrito(boton) {
  const tarjeta = boton.closest('.fabric-card');
  const id = tarjeta.dataset.id;
  const nombre = tarjeta.dataset.name;
  const precio = Number(tarjeta.dataset.price);
  
  if (!id || !nombre || !precio) return;
  
  carritoItems.push({ id, nombre, precio });
  actualizarCarrito();
}
```

#### 2.3 Función actualizarCarrito()
```javascript
function actualizarCarrito() {
  const contador = document.getElementById('cart-count');
  if (contador) contador.textContent = carritoItems.length;
  
  const container = document.getElementById('cart-items');
  if (!container) return;
  
  if (carritoItems.length === 0) {
    container.innerHTML = '<p>Tu carrito está vacío.</p>';
    return;
  }
  
  let html = '';
  let total = 0;
  
  carritoItems.forEach((item, index) => {
    total += item.precio;
    html += `<div class="cart-item">...</div>`;
  });
  
  container.innerHTML = html;
}
```

#### 2.4 Event listeners
```javascript
document.querySelectorAll('.fc-btn').forEach(boton => {
  boton.addEventListener('click', () => agregarAlCarrito(boton));
});
```

---

## Resumen de Cambios (No Destructivo)

1. **Punto 3 (aplicarDescuento)**: ✅ YA EXISTE
2. **index.html**: Agregar data-attributes a Algodón y Gabardina
3. **js/main.js**: AGREGAR funciones del carrito (no destructivo)

---

## Principio Aplicado
- **NO destructivo**: Todo código existente se mantiene
- **Deconstructivo**: Primero analizamos qué existe, luego adicionamos
- **Simplicidad**: Funciones simples que hacen una cosa cada una
