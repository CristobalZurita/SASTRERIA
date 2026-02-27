# Hilo & Oficio

Plataforma textil nacional orientada a conectar clientes con sastres artesanales de Chile, mostrar un catalogo visual de telas y centralizar la experiencia de seleccion, cotizacion y contacto en una sola pagina.

## Estado actual

La version vigente en este repositorio integra trabajo propio sobre `CZ_sastre` y una absorcion aditiva de aportes utiles de otras ramas del equipo. La base actual conserva la arquitectura del proyecto y extiende funcionalidades sin rehacer la estructura principal.

## Funcionalidades implementadas

### Hero editorial

- Hero principal con video ambiental de fondo desde `assets/video.mp4`
- Cajas flotantes con muestras textiles reales
- Contenido frontal preservado: titular, CTA y KPIs

### Guia de color

- Tres tarjetas de tono de piel con paletas recomendadas y colores a evitar
- Interaccion visual para destacar la tarjeta activa

### Catalogo de telas

- Catalogo visual con fotos reales desde `assets/images`
- Filtros por categoria: natural, sintetico, mezcla y premium
- Carrusel horizontal con flechas laterales
- Navegacion por teclado en el carrusel
- Loop visual continuo en el desplazamiento lateral

### Modal tecnico de telas

- Vista ampliada de la tela
- Material, ancho util, gramaje, acabado y uso recomendado
- Calculo por metros
- Ofertas por cantidad
- Seleccion de envio dentro del modal
- Total estimado con descuento y envio

### Carrito de compras

- Drawer lateral con contador de unidades reales
- Miniaturas por item
- Aumento y disminucion de cantidades
- Persistencia en `localStorage`
- Resumen con subtotal, descuento, envio y total
- Checkout conectado a la logica comun de `js/calculos.js`

### Sastres destacados

- Tarjetas destacadas con imagen, tags, rating y metrica
- Popup tipo directorio con 10 sastres ficticios a nivel nacional
- Modal de biografia individual al pinchar la foto de cada sastre

### Formularios duales

- Flujo cliente de 10 pasos
- Flujo postulante de 11 pasos
- Barra de progreso, validacion y resumen final

### Extras de interfaz

- Boton flotante para volver arriba
- Toasts de confirmacion y error
- Scroll suave para anclas internas
- Navbar responsive con drawer movil

## Falso backend

Este proyecto no usa backend real. La persistencia de carrito y envio funciona en frontend mediante `localStorage`.

Puntos relevantes:

- El carrito guarda productos, cantidades e imagenes
- El envio seleccionado se persiste en navegador
- La logica de descuento se calcula en cliente

## Tecnologias

- HTML5
- SCSS con arquitectura tipo 7-1
- JavaScript vanilla
- Bootstrap 5
- Git y GitHub
- Playwright instalado como dependencia del repo

## Estructura principal

```text
SASTRERIA/
├── index.html
├── assets/
│   ├── images/
│   └── video.mp4
├── css/
│   ├── main.css
│   └── main.css.map
├── js/
│   ├── calculos.js
│   └── main.js
├── scss/
│   ├── abstracts/
│   ├── base/
│   ├── components/
│   ├── layout/
│   └── pages/
├── package.json
└── playwright_test.js
```

## Archivos clave

- `index.html`: pagina principal completa
- `js/main.js`: interacciones del sitio, carrito, carrusel, modales y steppers
- `js/calculos.js`: descuentos, calculo del carrito y apoyo a la calculadora
- `scss/layout/_hero.scss`: hero principal y video de fondo
- `scss/layout/_navbar.scss`: navbar, drawer y carrito
- `scss/components/_cards.scss`: tarjetas de telas y sastres
- `scss/pages/_home.scss`: carrusel, directorio, modales y ajustes de pagina

## Como ejecutar

### Opcion simple

Abrir `index.html` en navegador.

### Compilar SCSS manualmente

```bash
npx sass scss/main.scss css/main.css
```

### Modo watch para estilos

```bash
npx sass --watch scss/main.scss:css/main.css
```

### Validar sintaxis de JavaScript

```bash
node --check js/main.js
node --check js/calculos.js
```

## Dependencias

Instalacion base:

```bash
npm install
```

Nota: `package.json` actualmente no define scripts de `build` ni `watch`; la compilacion se hace con `npx sass`.

## Colaboracion

La rama de trabajo usada para consolidar esta version fue `CZ_sastre`. La integracion se realizo de forma aditiva, conservando la base funcional vigente y adaptando aportes utiles del equipo sin rehacer la arquitectura existente.

## Creditos

- Cristobal Zurita
- Amara
- Maria
