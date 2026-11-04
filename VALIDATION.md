# Validación ejecutada

Fecha: 3 de noviembre de 2026.

## Comprobaciones

- `npm run typecheck`: sin errores de TypeScript.
- `npm run build`: compilación de producción correcta; carpeta `dist/` generada.
- Auditoría de instalación final: **0 vulnerabilidades reportadas**, después de actualizar Vite a 7.3.7 y React Router a 7.18.5 dentro de sus versiones principales.
- `npm test -- --max-failures=1 --trace=off`: **14 pruebas aprobadas**, siete en escritorio y siete con emulación móvil.
- Tras mejorar la conservación del foco y del espacio de la galería, `npm test -- --grep 'galería, miniaturas' --trace=off`: **2 pruebas aprobadas**.
- `node scripts/verify-preview.mjs`: inicio, catálogo y ficha sin desbordamiento horizontal a 320, 768, 1024 y 1920 px; transición suave a vista posterior y restablecimiento con movimiento normal; panel técnico móvil plegable.
- `node scripts/capture-preview.mjs`: capturas de inicio escritorio/móvil y ficha de producto, revisadas visualmente.
- `node scripts/verify-build.mjs`: comprobación de `dist/` con un servidor de producción local, catálogo de seis productos, carga diferida de Three.js, carga GLB y navegación sin errores de ejecución. Capturas finales actualizadas desde la compilación.
- Tras actualizar las dependencias, `npm test -- --trace=off`: repetición completa de los 14 casos en las versiones finales.

## Cobertura de las 14 pruebas

1. Inicio y carga GLB, catálogo, búsquedas por nombre/referencia, búsqueda sin resultados, categorías, limpieza de filtros, orden alfabético y por fabricante, selección de producto, variantes y siguiente producto.
2. Galería, imágenes anterior/siguiente, miniaturas, diálogo ampliado, cierre con Escape, retorno al visor, componentes de la ficha y disponibilidad de documentación.
3. Ancho de página, disponibilidad de las imágenes, menú móvil, navegación y página de producto inexistente.
4. Carga del modelo, zoom real medido mediante posición de cámara, presets frontal/interior, teclado, arrastre de ratón o gesto táctil emulado, doble clic para enfoque, restablecimiento, selector y marcador de componentes, apertura/cierre de pantalla completa.
5. Carga de los otros cinco GLB sin errores de JavaScript y ocultación del preset Interior en los accesorios.
6. Petición GLB interrumpida: respaldo visual, galería y recuperación mediante reintento.
7. WebGL deshabilitado: aviso y galería funcional.

Cada caso se ejecutó en los dos perfiles. Las capturas de cámara y las comprobaciones de atributos verifican cambios reales del estado 3D; no se sustituyeron por animación de imágenes.

## Correcciones realizadas durante QA

- Fijadas las dependencias internas compatibles de Framer Motion después de detectar un export incompatible al compilar.
- Sincronizadas las actualizaciones rápidas de parámetros del catálogo.
- Eliminada la inercia residual antes de aplicar presets o restablecer la cámara.
- Conservado el contenido original de la galería al abrir su diálogo para evitar cambios de altura y permitir restaurar el foco.
- Separada la detección de WebGL del código que importa Three.js; ajustados los chunks para que el catálogo no cargue el motor innecesariamente.
- Reducidos los modelos mediante reutilización de geometrías y limitadas las fuentes al subconjunto latino utilizado.

## Límites

- Las pruebas de navegador se ejecutaron con Microsoft Edge/Chromium en Windows. El perfil móvil emula resolución y eventos táctiles; no se ha probado en dispositivos físicos, Safari ni Firefox.
- No se realizó una auditoría formal WCAG ni medición de FPS en dispositivos de gama baja. Se verificaron navegación por teclado, etiquetas, foco, diálogos y preferencia de movimiento reducido dentro de los flujos de la suite.
- Los archivos de demostración son GLB sin compresión geométrica ni texturas. La arquitectura incluye Draco/Meshopt, pero no se probó un asset comercial comprimido ni una textura KTX2.
- Vite muestra un aviso de tamaño para el motor Three.js. El build finaliza correctamente y el motor se separa de la interfaz.
- Las capturas y pruebas validan la aplicación de demostración, no la seguridad o el rendimiento protector de ningún producto físico.
