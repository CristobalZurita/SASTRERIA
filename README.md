# Hilo & Oficio

**Plataforma textil nacional que conecta clientes con sastres artesanales de Chile.**

---

## ¿Qué es Hilo & Oficio?

Es una plataforma web que permite a mujeres y hombres encontrar sastres artesanales personalizados en cualquier región de Chile. El usuario selecciona su tela ideal, descubre qué colores le favorecen según su tono de piel, y se conecta con un sastre especializado en su zona.

---

## Características principales

### 1. Guía de color personalizada

Sistema de colorimetría que recomienda telas y colores según el tono de piel del usuario: clara, oliva o morena. Cada piel tiene una paleta única de colores que la favorecen.

### 2. Catálogo de telas

Más de 80 materiales disponibles con filtros por tipo: naturales, sintéticos, mezclas y premium. Cada tela muestra precio por metro, disponibilidad y descripción detallada.

### 3. Calculadora de tela con descuentos

Herramienta que calcula el costo total según metros requeridos. **Aplica descuentos por volumen:**

- Compras mayores a $50.000: **10% de descuento**
- Compras mayores a $100.000: **20% de descuento**

### 4. Buscador de sastres

Red de más de 340 sastres activos en las 16 regiones de Chile. El usuario puede filtrar por tipo de prenda, ocasión y disponibilidad geográfica.

### 5. Formulario dual

Dos flujos separados en un mismo formulario:

- **Cliente:** 10 pasos para buscar un sastre (datos, ubicación, tipo de prenda, ocasión, telas preferidas, presupuesto, plazo)
- **Postulante:** 11 pasos para trabajar en la tienda (datos personales, experiencia, especialidades, disponibilidad, motivación)

### 6. Carrito de compras

Panel lateral donde el usuario puede agregar telas seleccionadas, ver el total y proceder al checkout.

---

## Tecnologías utilizadas

| Tecnología                  | Uso                                    |
| ---------------------------- | -------------------------------------- |
| **HTML5**              | Estructura semántica del sitio        |
| **CSS3**               | Estilos y animaciones                  |
| **SASS/SCSS**          | Preprocesador CSS con arquitectura 7-1 |
| **JavaScript Vanilla** | Interactividad sin librerías          |
| **Bootstrap 5**        | Sistema de grillas y utilitarios       |
| **Git / GitHub**       | Control de versiones y colaboración   |

---

## Estructura del proyecto

```
SASTRERIA/
├── index.html              # Página principal
├── css/
│   └── main.css          # CSS compilado
├── scss/                  # Código fuente SASS
│   ├── abstracts/        # Variables, mixins, funciones
│   ├── base/             # Reset y tipografía
│   ├── components/       # Botones, cards, stepper
│   ├── layout/           # Navbar, hero, footer
│   └── pages/            # Estilos específicos de home
├── js/
│   └── main.js           # Lógica JavaScript completa
└── ARCHIVOS_PRUEBA/      # Documentación y versiones de referencia
```

---

## Cómo ejecutar el proyecto

### Instalación de dependencias

```bash
npm install
```

### Desarrollo (con watch)

```bash
npm run watch
```

### Producción (build)

```bash
npm run build
```

---

## Equipo

- **Cristobal Zurita** - Desarrollo principal
- **Amara Tripaiñán** - Funcionalidad del carrito
- **Maria Cosio** - Mejoras y optimización

---

## Estado del proyecto

✅ **En producción** - Rama principal: `main`
✅ **Comentarios exhaustivos** - Todo el código documentado
✅ **Carrito de compras** - UI completa, lógica en desarrollo
✅ **Formularios dual** - 10+11 pasos funcionando
✅ **Calculadora de descuentos** - Implementada y conectada
