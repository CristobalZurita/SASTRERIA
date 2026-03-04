## Política de integración de ramas (merge)

Este repositorio usa `main` como rama **estable**. Las ramas que se hayan desarrollado sobre un estado distinto del proyecto o que reescriban grandes porciones de archivos críticos **no se mergean directo** a `main`, porque eso puede introducir regresiones (pérdida de funcionalidades ya implementadas).

Criterios aplicados:

- **Se mergea** una rama cuando aporta cambios acotados, coherentes y compatibles con la estructura actual de `main`.
- **No se mergea** cuando el diff implica reestructuración grande (muchas inserciones/borrados) en archivos base como:
  - `index.html`, `js/main.js`, `js/calculos.js`, `css/main.css`, `scss/*`
- En esos casos, la integración correcta es **quirúrgica**, mediante:
  - `git restore --source=<rama> -- <archivo>` para traer archivos puntuales, o
  - `git restore -p --source=<rama> -- <archivo>` para traer solo hunks específicos.

Objetivo: mantener `main` funcionando y evitar “mezclas” que retrocedan el avance del proyecto.
