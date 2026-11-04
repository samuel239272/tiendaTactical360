# TACTICAL 360

Catálogo de equipamiento con inspección 3D real, desarrollado exclusivamente en frontend. Interfaz en español, datos locales tipados, seis modelos GLB originales y dieciocho renders locales. No necesita backend, cuentas, base de datos ni servicios de pago.

## Inicio rápido

Requisitos: Node.js 22.12+ o 24 LTS y npm. La instalación también se validó en el entorno disponible con Node.js 26.13 y npm 11.20.

```sh
npm ci
npm run dev
```

Abre `http://127.0.0.1:5173`. El servidor escucha únicamente en la máquina local. Las rutas usan `HashRouter`, por lo que funcionan en alojamiento estático sin reglas especiales de reescritura.

```sh
npm run typecheck     # TypeScript estricto
npm run build         # Verificación de tipos + compilación a dist/
npm run preview       # Vista previa de la compilación
npm test              # Pruebas de interacción en escritorio y móvil
npm run format        # Formato legible del código y la documentación
```

La suite utiliza Microsoft Edge instalado en Windows y emula un iPhone 13 para la resolución y los eventos táctiles. La emulación no sustituye una prueba física en Safari/iOS. Para otro sistema, ajusta `channel` en `playwright.config.ts` o configura Chromium de Playwright. No es necesario instalar navegadores para ejecutar la aplicación.

## Qué incluye

- Inicio con modelo interactivo, categorías, selección de productos y explicación de la experiencia.
- Catálogo con búsqueda normalizada por nombre, referencia y diseñador; filtros por categoría; orden por nombre o fabricante; filtros compartibles en la URL.
- Fichas individuales, variantes de acabado, productos anterior/siguiente y relacionados.
- Visor React Three Fiber / Three.js, GLB/glTF, OrbitControls, iluminación PBR y entorno de estudio generado localmente.
- Órbita horizontal y vertical, zoom limitado, doble clic para enfocar, restablecimiento, pantalla completa y vistas frontal, posterior, laterales, superior e interior cuando corresponde.
- Modos general, exterior, componentes y detalle; hotspots anclados a la geometría, oclusión y selector accesible equivalente.
- Galería con miniaturas, anterior/siguiente y diálogo ampliado con cierre por Escape.
- Datos técnicos opcionales, documentación local, fallbacks ante un recurso ausente o WebGL no disponible, y reintento de carga.
- Tipografías locales Space Grotesk, Inter e IBM Plex Mono; tokens CSS; Tailwind CSS; Framer Motion y Lucide.

## Alcance de la demostración

**ATLAS, ARC, CORE y SPECTRA son diseños conceptuales originales. “T360 Design Lab” es una denominación ficticia.** No se proporcionaron productos comerciales, fotografías, archivos CAD ni fichas de fabricante. Los archivos GLB fueron creados para esta aplicación mediante `scripts/generate-models.mjs`; las imágenes WebP son renders de esos mismos modelos, no fotografías de productos reales.

ATLAS contiene carcasa exterior e interior, rieles, montura, correas, mentonera y cinco almohadillas. ARC contiene dos rieles; CORE, seis almohadillas; SPECTRA, visor y marco. No se simulan componentes ausentes del archivo. Solo ATLAS habilita el preset Interior. Esta geometría conceptual no es una especificación de fabricación.

No se inventan materiales, pesos, tallas, dimensiones, compatibilidades ni certificaciones. Los acabados describen la apariencia visual. Los modelos no acreditan capacidades protectoras, ópticas ni balísticas. Los campos no documentados se omiten.

## Organización

```text
public/
  models/helmets/       # Tres variantes GLB ATLAS (~730 KB cada una)
  models/accessories/   # ARC, CORE y SPECTRA (~51–112 KB)
  images/              # 18 renders WebP
  decoders/draco/       # Decodificadores locales de Three.js
  documents/           # Guía de demostración HTML
  icons/
src/
  app/                 # Inicio, catálogo, ficha, experiencia, 404
  components/          # Layout, catálogo, viewer, hotspots, galería, ficha técnica, UI
  scenes/              # Escena, luces, cargador, controlador de cámara
  hooks/               # Filtrado, visibilidad, selección de hotspots
  data/                # products.ts, categories.ts
  types/               # Contratos de producto y visor
  styles/              # Tokens, responsive y accesibilidad
  utils/               # Validación, liberación de recursos y detección WebGL
scripts/               # Generación de modelos, renders y capturas
tests/                 # Pruebas Playwright
artifacts/             # Capturas revisadas de escritorio y móvil
```

## Añadir un producto real

1. Añade el GLB a `public/models/helmets/` o `public/models/accessories/`. Si usas glTF separado, conserva también sus `.bin` y texturas con las rutas relativas correctas. Las URLs externas se admiten si están explícitamente configuradas y permiten CORS.
2. Añade las fotografías autorizadas a `public/images/`. Recomendada una imagen WebP de 900–1400 px, sin fondos innecesarios y con descripción alternativa significativa. Las imágenes son el respaldo si el 3D no está disponible.
3. Define un objeto `TacticalProduct` en `src/data/products.ts`. El catálogo y la navegación lo incorporan automáticamente. Usa un ID único y una categoría declarada en `categories.ts`.
4. Añade solo especificaciones verificadas. Cada certificación debe incluir `name` y `sourceUrl` con el documento de soporte. Sustituye la documentación de demo por archivos o URLs reales.
5. Sitúa los hotspots en las coordenadas del modelo y usa únicamente piezas presentes. `position` se interpreta en el espacio local del modelo; el visor aplica el mismo `scale` a la geometría y los marcadores.
6. Habilita `hasInterior: true` únicamente si el GLB incluye geometría interna inspectable. Si no tienes modelo, omite `model3D`: la ficha mostrará el respaldo y permitirá abrir la galería.

Ejemplo de estructura (valores deliberadamente vacíos para no crear una ficha ficticia):

```ts
const product: TacticalProduct = {
  id: 'referencia-del-producto',
  name: 'Nombre documentado',
  manufacturer: 'Fabricante documentado',
  reference: 'Referencia documentada',
  category: 'helmets',
  description: 'Descripción verificada.',
  shortDescription: 'Resumen del producto.',
  color: { name: 'Acabado documentado', hex: '#788364' },
  images: [{ src: '/images/producto.webp', alt: 'Descripción de la fotografía' }],
  model3D: { exterior: '/models/helmets/producto.glb', scale: 1, hasInterior: false },
  specifications: {},
  components: [],
  documentation: [],
  illustrative: false,
};
```

### Convenciones geométricas

- glTF 2.0, eje Y hacia arriba, frente del producto hacia +Z.
- Centra el modelo aproximadamente en `(0, 0.12, 0)`. El demo ocupa unos 2.4 × 2.1 × 2.5 unidades; usa `scale` o normaliza el archivo para mantener un encuadre equivalente.
- Usa materiales glTF PBR estándar; aplica las transformaciones en la herramienta de autoría.
- Objetivo orientativo: menos de 100 000 triángulos y menos de 5 MB por modelo. Valida el resultado visual después de simplificar.
- El cargador admite Meshopt y Draco; Draco utiliza los decodificadores de `public/decoders/draco/`, sin CDN. Los modelos de demo son ligeros, reutilizan geometrías y no necesitan texturas ni compresión adicional.
- KTX2 no se activa porque estos modelos no contienen texturas. Para una colección con texturas grandes, integra `KTX2Loader`, sus transcodificadores locales y `detectSupport(renderer)` antes de incorporarlas; no basta con cambiar la extensión de una imagen.
- La validación en ejecución comprueba que la escena contiene geometría y límites finitos. No sustituye una validación completa de glTF ni una revisión técnica del producto.

## Rendimiento y accesibilidad

El módulo de escena se importa de forma diferida. El canvas usa renderizado bajo demanda, limita el pixel ratio y detiene el render fuera de pantalla o con la pestaña oculta. Los materiales, geometrías y texturas se liberan al desmontar; también se descartan cargas que finalizan después de abandonar un producto. No hay rotación automática continua. Los modelos se solicitan solo al abrir su visor.

Los usuarios pueden controlar el visor con botones y teclado: flechas para presets, `+`/`−` para zoom y `0` para restablecer. Los componentes se pueden elegir sin acertar en un marcador 3D. Los diálogos usan `<dialog>`, foco nativo y Escape. La aplicación respeta `prefers-reduced-motion`, utiliza etiquetas accesibles y foco visible. La galería y las fichas siguen disponibles sin WebGL.

La compilación conserva Three.js y sus cargadores en un archivo separado de unos 777 KB sin comprimir. Es el motor WebGL, cargado con la escena; el aviso de tamaño de Vite no representa un fallo de compilación. No se oculta el aviso aumentando artificialmente su umbral.

## Regenerar assets y capturas

Los assets ya están incluidos y no requieren regeneración para usar la aplicación.

```sh
npm run assets:models
# Con npm run dev en otra terminal:
npm run assets:images
node scripts/capture-preview.mjs
# Después de npm run build (inicia y cierra su propio servidor):
node scripts/verify-build.mjs
```

El estudio de render en `scripts/asset-studio.html` es una herramienta local de desarrollo; no se incluye en `dist/`. Las fuentes de generación quedan disponibles para reproducir los modelos. Las tipografías mantienen las licencias de sus paquetes Fontsource; los decodificadores proceden del paquete Three.js. Consulta `ASSETS.md`.

## Publicación estática

`npm run build` genera `dist/`. Sirve esa carpeta con un servidor HTTP estático. No abras `index.html` con `file://`: los módulos y GLB requieren HTTP. La configuración actual usa rutas desde la raíz; para desplegar bajo un subdirectorio, adapta `base` en Vite y los prefijos de assets de los datos. No se ha añadido infraestructura ni se ha publicado el proyecto en un servicio externo.

## Validación

La suite comprueba catálogo, búsquedas, filtros, orden, variantes, navegación, galería, documentos, ausencia de desbordamiento, carga de todos los GLB, órbita real, zoom, presets, foco, reset, hotspots, pantalla completa, ausencia de modelo y ausencia de WebGL. Consulta `VALIDATION.md` para los resultados ejecutados y las limitaciones.

Referencias de implementación: [compatibilidad React/Fiber](https://r3f.docs.pmnd.rs/getting-started/installation), [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader). Las versiones directas y el lockfile están fijados; los overrides de `motion-dom` y `motion-utils` evitan una incompatibilidad comprobada entre versiones menores de Framer Motion.
