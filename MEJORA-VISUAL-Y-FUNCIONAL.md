# Plan de mejora — cerrar la distancia entre la demo y los mockups

## Objetivo

La aplicación ya tiene una base técnica razonable: rutas reales con TanStack Router, features separadas, datos locales, repositorios mock, persistencia de demo y reglas de acceso. El problema principal ya no es la estructura: es que la experiencia actual todavía se percibe como un CRUD funcional y no como la demo comercial cuidada que muestran los cuatro mockups.

Este documento es una instrucción de trabajo para transformar la implementación actual en una demo visualmente convincente sin romper la lógica local existente.

## Diagnóstico de la implementación actual

### Lo que sí está bien encaminado

- La navegación de profesor y alumno está separada por rol.
- Hay rutas reales para dashboard, alumnos, profesores, clases, biblioteca, login y portal.
- La clase ya dispone de pestañas de alumnos e itinerario.
- Existe lógica para añadir, quitar, ordenar y compartir documentos.
- La biblioteca ya tiene búsqueda, filtros y selección múltiple.
- El portal ya calcula documentos directos y documentos heredados de clases.
- Hay persistencia local y cambio de identidad demo.

### Lo que no está a la altura de los mockups

1. **Falta una composición de aplicación completa.** El shell actual tiene navegación, pero el contenido se presenta como bloques consecutivos. El mockup tiene una composición de producto: header superior, contexto, acciones principales, columnas, tarjetas y zonas con jerarquía.
2. **El dashboard es demasiado básico.** Actualmente son tres métricas y tres botones. El mockup necesita una bienvenida, métricas con iconos, actividad reciente, bloque de biblioteca, accesos rápidos y una zona visual que explique el estado de la escuela.
3. **Las clases se muestran como una tabla genérica.** Deben ser tarjetas atractivas con color, nivel, profesor, número de alumnos, progreso del itinerario y acceso directo a la clase.
4. **La clase no tiene suficiente peso visual.** El itinerario debe ocupar el espacio principal. La pantalla debe parecer un constructor de aprendizaje, no un formulario con un selector de documentos.
5. **La biblioteca es una tabla plana.** Los documentos necesitan miniatura o portada de PDF, icono de tipo, materia, nivel, tamaño, estado de visibilidad, fecha y acciones. La selección múltiple debe sentirse como un explorador de materiales.
6. **Faltan imágenes y superficies editoriales.** El portal del alumno del mockup usa una cabecera visual, tarjetas de clases con imágenes y bloques diferenciados de contenido. La implementación actual no usa imágenes ni assets visuales.
7. **El portal del alumno es correcto funcionalmente pero poco aspiracional.** Tiene tarjetas y progreso, pero no tiene la bienvenida visual, las clases como experiencias y la separación editorial “Para ti” / “De tus clases” del mockup.
8. **El flujo del profesor todavía no parece una herramienta de preparación.** La biblioteca de la clase usa principalmente un `select`; el mockup pide explorador lateral con búsqueda, filtros, filas seleccionables y panel de compartir.
9. **La demo no comunica claramente la diferencia entre preparar y publicar.** Añadir al itinerario, compartir con la clase y compartir individualmente deben tener estados visuales distintos.
10. **Hay copy y densidad de información de placeholder.** Deben aparecer nombres, materias, niveles, páginas, tamaños, estados y microcopy coherentes con una escuela musical.

## Referencia visual que debe seguirse

Las imágenes de `prototipos/` no son inspiración genérica: son la especificación visual de la demo.

### Lenguaje visual

- Fondo marfil cálido, no gris de dashboard.
- Paneles blancos con borde muy suave.
- Coral/terracota como color primario de acciones y progreso.
- Verde apagado para compartido/completado.
- Amarillo suave para pendiente o no compartido.
- Tipografía sans-serif para la aplicación operativa.
- Tipografía serif o display únicamente para títulos grandes de clase si encaja con el sistema existente.
- Iconos lineales consistentes, sin emojis.
- Radios moderados, no tarjetas excesivamente redondeadas.
- Sombras muy suaves y separación por superficie, no por líneas pesadas.
- Sin gradientes.
- Sin KPIs inventados de negocio, variaciones porcentuales ni gráficas que no existan en el dominio.

### Principio de composición

Cada pantalla debe tener:

1. Una cabecera con contexto y una acción principal.
2. Un bloque principal visualmente dominante.
3. Un bloque secundario que ayude a actuar.
4. Estados visibles mediante icono, texto y color.
5. Una densidad parecida a los mockups: información suficiente para que la pantalla no parezca vacía, sin convertirse en una tabla administrativa.

## Mejoras por pantalla

## 1. Shell y layout global

### Resultado esperado

Un producto con identidad propia, no una colección de páginas.

### Cambios

- Mantener `AppShell` de `@doscientos/ui`, pero darle más presencia visual.
- Sidebar de ancho estable en escritorio, con marca “Aula Norte / Escuela de Música”.
- Separar navegación principal de herramientas futuras.
- Enlaces de Calendario, Informes y Configuración con badge “Próximamente”.
- Añadir header superior con búsqueda global, notificación demo, avatar y nombre de usuario.
- En móvil, conservar menú lateral y mostrar marca compacta.
- Definir contenedor de contenido con ancho amplio; evitar que las pantallas se queden estrechas.
- Mantener el scroll en el área de contenido, no en toda la página.
- Añadir breadcrumbs o enlace contextual en detalles de clase y alumno.
- El estado activo del sidebar debe ser claro, con fondo coral muy suave y texto coral oscuro.

### Componentes recomendados

- `SchoolBrand`.
- `GlobalSearch` visual, aunque la búsqueda global sea limitada a la demo.
- `UserMenu` / `DemoUserSwitcher`.
- `SidebarSection`.
- `ComingSoonNavItem`.
- `PageIntro` con título, descripción y acciones.

## 2. Dashboard de profesor

### Problema actual

La pantalla actual solo muestra tres `MetricCard` y botones. Funciona como índice, pero no cuenta la historia del producto.

### Composición objetivo

```text
┌ sidebar ┐ ┌ header superior ───────────────────────────┐
           ├ saludo + descripción + acción                │
           ├ métrica alumnos │ métrica clases │ documentos│
           ├ progreso de clases │ próximas acciones       │
           ├ actividad reciente │ biblioteca destacada    │
```

### Cambios concretos

- Saludo personalizado: “Hola, Ana”.
- Descripción: “Aquí tienes un resumen de la actividad de tu escuela”.
- Tres métricas, sin porcentajes inventados:
  - Alumnos activos.
  - Clases activas.
  - Documentos en biblioteca.
- Tarjeta “Mis clases” con las clases del profesor, color de cada clase y progreso real del itinerario.
- Tarjeta “Biblioteca de PDFs” con cuatro documentos destacados y miniatura/icono PDF.
- Tarjeta “Actividad reciente” construida únicamente a partir de acciones locales reales o datos semilla.
- CTA principal: “Nueva clase”.
- CTA secundarias: “Añadir alumno” y “Explorar biblioteca”.
- Si se necesita una visualización, usar barras de progreso de clases, no gráficas de negocio inventadas.
- La dashboard debe tener contenido suficiente en la semilla para no parecer vacía.

## 3. Listado de clases

### Problema actual

La tabla de clases es demasiado genérica y no transmite que cada clase contiene un itinerario de aprendizaje.

### Cambios concretos

- Sustituir la tabla principal por un grid de tarjetas.
- Cada tarjeta debe incluir:
  - Color o banda identificativa.
  - Nombre de la clase.
  - Nivel.
  - Profesor o profesores.
  - Número de alumnos.
  - Número de materiales del itinerario.
  - Barra de documentos compartidos / total.
  - CTA “Abrir clase”.
- Añadir vista alternativa de lista solo si es sencilla, pero la vista inicial debe ser tarjeta.
- Añadir encabezado con “Mis clases” o “Clases de la escuela” según rol.
- Añadir búsqueda y filtro por nivel si ya están disponibles sin inventar lógica adicional.
- Estado vacío con una tarjeta visual y CTA “Crear primera clase”.
- La acción “Nueva clase” debe abrir un formulario corto y después llevar a la clase creada.

## 4. Detalle de clase e itinerario

### Es la pantalla más importante

Esta pantalla debe ser el momento central de la llamada comercial.

### Problema actual

La implementación ya tiene timeline básica, pero el flujo para añadir materiales depende demasiado de un selector y el layout no alcanza la composición del mockup.

### Composición objetivo

```text
cabecera: volver · nombre grande · nivel · profesor · acciones
tabs: Itinerario | Alumnos

columna principal: timeline ordenada de módulos y PDFs
columna lateral: alumnos + biblioteca/explorador de materiales
```

### Timeline

- Número de módulo grande en círculo coral.
- Línea vertical continua entre módulos.
- Módulos plegables con título y descripción.
- Cada documento como fila/tarjeta con:
  - Drag handle.
  - Checkbox grande de compartir con la clase.
  - Icono de PDF o miniatura.
  - Título.
  - Nombre del archivo.
  - Número de páginas y materia.
  - Badge “Compartido”, “Privado” o “Sin compartir”.
  - Menú de acciones.
- Estado compartido: badge verde o amarillo y checkbox coral cuando está activo.
- Estado privado: badge verde muy claro con candado y texto explícito.
- Drop zone visible al final: “Arrastra aquí más documentos”.
- El orden se debe guardar inmediatamente en el repositorio local.
- Añadir al itinerario no debe activar automáticamente el acceso.

### Explorador lateral

Sustituir el `select` por un explorador visual:

- Título “Biblioteca”.
- Texto: “Busca y selecciona documentos para añadir a tu clase”.
- Input de búsqueda.
- Chips de materia/tipo: Todos, Teoría, Ejercicios, Partituras.
- Filas con checkbox, icono/miniatura, título, páginas, materia y menú.
- Botón “Añadir materiales”.
- Tras añadir, el documento desaparece de disponibles o aparece marcado como incluido.

### Panel de compartir

En el mismo lateral o como drawer:

- Selector de una clase o de varios alumnos.
- Chips con nombres de alumnos seleccionados.
- Resumen: “Se compartirán 2 documentos”.
- CTA coral “Compartir documentos”.
- Confirmación accesible y visible.

## 5. Biblioteca general

### Problema actual

La biblioteca actual es una tabla con filtros. Es funcional, pero visualmente no parece una biblioteca de materiales didácticos.

### Cambios concretos

- Cabecera con título “Biblioteca” y CTA “Subir documento”.
- Mostrar resumen: número de documentos y materias disponibles.
- Vista inicial en grid de tarjetas o lista enriquecida; evitar tabla desnuda.
- Cada documento debe tener una portada visual consistente:
  - Miniatura generada localmente con bloque blanco y distintivo PDF.
  - O portada sintética basada en materia/color.
  - No hace falta usar PDFs reales en la demo.
- Metadatos visibles: título, materia, nivel, páginas, tamaño, profesor y fecha.
- Badge de visibilidad: Privado, Compartido con clase o Compartido directamente.
- Selección múltiple con toolbar contextual que aparezca al seleccionar.
- Modal de compartir con destinatarios y resumen.
- Filtros en chips o controles compactos, no solo selects de aspecto nativo.
- Añadir agrupación opcional por materia.
- Estado vacío ilustrado con icono de biblioteca y CTA.
- Mantener acciones de editar y archivar, pero en menú contextual para no llenar cada tarjeta de botones.

## 6. Portal del alumno

### Problema actual

La lógica de acceso es adecuada, pero la presentación es demasiado plana y no reproduce el carácter cálido del mockup.

### Cambios concretos

- Cabecera de bienvenida con “Hola, Lucía” y copy breve.
- Hero o banda superior visual con una imagen local de ambiente musical: metrónomo, partitura, instrumento o aula. Usar asset sintético y neutro, sin logos externos.
- Tarjetas de “Tus clases” con imagen, nombre, nivel y progreso.
- Tarjeta de progreso general con porcentaje calculado de documentos completados.
- Sección “Para ti” con materiales directos.
- Sección “De tus clases” con materiales heredados.
- Documentos como filas/cards visuales con icono de tipo y CTA “Abrir documento”.
- Estado “Completado” con icono y badge verde.
- Estado “Sin abrir” claramente visible.
- Mantener el visor/preview local, pero hacerlo parecer un visor de PDF: cabecera, nombre de archivo, icono PDF y acciones.
- No mostrar ningún control de profesor al alumno.
- Las clases y documentos deben seguir viniendo de la misma fuente local cruzada.

## 7. Alumnos y profesores

Los CRUD no necesitan convertirse en el centro visual de la demo, pero sí deben dejar de parecer formularios desnudos.

- Listados en tarjetas compactas o tabla enriquecida con avatar/color, nombre, clase(s), estado y progreso.
- Filtros y búsqueda en una barra visible.
- Ficha lateral o detalle con resumen antes del formulario.
- En alumnos, destacar “Clases” y “Documentos directos”.
- En profesores, destacar “Clases que imparte” y “Documentos subidos”.
- Mantener los formularios simples: nombre, email, nivel/especialidad y estado.
- Después de crear un alumno o profesor, mostrar toast o confirmación clara y actualizar el listado.

## 8. Assets e imágenes

Actualmente el código no usa imágenes. Añadir assets locales propios para completar el lenguaje visual:

- `public/assets/music-hero.jpg` o equivalente para el portal.
- Tres o cuatro imágenes de clase/instrumento para las tarjetas de clases.
- Miniaturas sintéticas para documentos o un componente visual determinista que no necesite archivos.

Si se usan imágenes generadas, deben ser neutras, sin logos, sin texto ilegible y optimizadas para la demo. No descargar imágenes externas durante la ejecución y no depender de red.

## 9. Datos demo necesarios para que las pantallas no se vean vacías

Ampliar la semilla local de forma determinista:

- 3 profesores.
- 8–12 alumnos.
- 4 clases.
- 12–20 documentos.
- 3–5 módulos por la clase principal.
- Estados mezclados: privados, compartidos con clase y compartidos directamente.
- Progreso mezclado: sin abrir, visto y completado.
- Al menos un alumno en dos clases.
- Al menos un profesor con dos clases.
- Metadatos visuales: color de clase, imagen, páginas, tamaño y materia.

No inventar analítica empresarial. Los números deben derivar de los arrays y relaciones reales.

## 10. Cambios técnicos recomendados

- Mantener la arquitectura existente; no reescribir el dominio ni los repositorios.
- Extraer componentes visuales reutilizables en `src/shared/ui` cuando se usen en dos o más features.
- Crear componentes específicos:
  - `AppHeader`.
  - `ClassCard`.
  - `DocumentCard`.
  - `DocumentRow`.
  - `DocumentThumbnail`.
  - `StatusBadge`.
  - `ProgressRing` o `ProgressBar` mejorada.
  - `ItineraryModule`.
  - `ItineraryDocumentRow`.
  - `DocumentExplorer`.
  - `ShareSummaryPanel`.
  - `StudentClassCard`.
- No importar repositorios desde componentes.
- No convertir todo en un componente gigante para conseguir el aspecto.
- Mantener el estado de selección local en exploradores y modales.
- Mantener mutaciones en hooks de aplicación.
- Invalidar o refrescar las queries después de crear, editar, ordenar o compartir.
- Evitar `select` nativo cuando el control sea central para la experiencia; usar primitives del sistema existente.
- Usar `lucide-react` para iconos, con labels accesibles.
- No editar manualmente `routeTree.gen.ts`.

## 11. Responsive y accesibilidad

- Desktop: layout de dos columnas en clase y portal con grid de tarjetas.
- Tablet: convertir el lateral de biblioteca/compartir en drawer.
- Móvil: timeline en una columna, acciones agrupadas y tarjetas a ancho completo.
- Targets táctiles mínimos de 44 px.
- Checkboxes de publicación de al menos 28 px visuales, con label textual.
- Focus visible en links, botones, tabs, checkbox, inputs y drag controls.
- No comunicar estados solo por color.
- Modal de compartir con focus management y cierre con Escape.
- Mantener `prefers-reduced-motion`.

## 12. Prioridad de implementación

### Prioridad 1 — impacto inmediato

- Shell y header superior.
- Dashboard con composición completa.
- Tarjetas de clases.
- Detalle de clase con timeline dominante.
- Explorador visual de documentos en la clase.

### Prioridad 2 — cierre comercial

- Biblioteca visual con portadas/miniaturas.
- Panel de compartir múltiple.
- Portal de alumno con hero, tarjetas de clases y bloques “Para ti” / “De tus clases”.
- Assets locales.

### Prioridad 3 — pulido

- Toasts y confirmaciones.
- Empty states ilustrados.
- Responsive fino.
- Animaciones discretas de checks y progreso.
- Ajustes tipográficos y de espaciado comparando con los mockups.

## 13. Criterios de aceptación visual

- Al abrir `/`, la pantalla no parece una tabla ni un formulario: parece el inicio de un producto.
- Al abrir `/clases`, se ven tarjetas visuales, no únicamente filas de tabla.
- Al abrir una clase, la timeline ocupa visualmente la pantalla y se entiende sin explicación.
- El profesor puede añadir materiales desde un explorador visual, no solo desde un select.
- La diferencia entre documento preparado, privado y compartido es evidente en menos de un segundo.
- La biblioteca tiene identidad visual de biblioteca de materiales, con portadas/miniaturas y metadatos.
- El portal del alumno tiene una experiencia distinta y más cálida que el backoffice.
- Existen imágenes locales visibles en el portal y/o tarjetas de clase.
- El flujo profesor → clase → alumno se mantiene funcional después de los cambios visuales.
- Los cambios de localStorage siguen funcionando al navegar y cambiar de usuario.
- Ninguna pantalla nueva inventa calendario, informes o configuración funcional.

## 14. Verificación obligatoria

Después de implementar la mejora:

1. Ejecutar `pnpm dev` y revisar visualmente las rutas principales.
2. Probar el recorrido completo:
   - login como profesor;
   - crear clase;
   - añadir alumnos;
   - añadir y ordenar documentos;
   - compartir con clase;
   - compartir directamente con varios alumnos;
   - cambiar a un alumno;
   - comprobar clases y documentos visibles;
   - marcar documento completado;
   - volver al profesor.
3. Ejecutar `pnpm format:check`.
4. Ejecutar `pnpm lint`.
5. Ejecutar `pnpm structure:check`.
6. Ejecutar `pnpm typecheck`.
7. Ejecutar `pnpm test`.
8. Ejecutar `pnpm build`.
9. Si existe, ejecutar `pnpm quality`.

No dar por terminada la mejora solo porque compile. La validación principal es visual y de flujo: debe poder enseñarse en una llamada y debe parecerse a la composición, densidad y personalidad de los cuatro mockups.
