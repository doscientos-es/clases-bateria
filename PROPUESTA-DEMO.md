# Propuesta de demo — Aula

## 1. Idea en una frase

Una plataforma sencilla para que una escuela gestione alumnos, profesores y clases, y convierta su biblioteca de teoría en un itinerario de aprendizaje que se comparte con checks.

La demo será genérica para una escuela, aunque la carpeta use el nombre **Clases Batería** como primer caso de uso.

## 2. Alcance real de esta demo

La demo se concentra en el circuito que vende el producto: gestionar personas, construir clases a partir de la biblioteca y controlar el acceso a la teoría.

El sidebar puede reservar entradas futuras como **Calendario**, **Informes** y **Configuración**, pero deben aparecer vacías o con estado “Próximamente”. No forman parte del producto que se enseñará ni requieren modelo, API o pantallas funcionales.

En cinco minutos el cliente debe ver: crear una clase, ordenar su itinerario, añadir alumnos, compartir contenido con la clase y enviar documentos concretos a uno o varios alumnos.

## 3. Roles y permisos

### Administrador / dirección

- CRUD de alumnos y profesores.
- Crear y editar clases.
- Gestionar relaciones alumno-clase.
- Subir, editar, archivar y organizar documentos.
- Compartir documentos con clases o alumnos concretos.
- Acceso completo al núcleo de la demo.

### Profesor

- Ver las clases que tiene asignadas.
- Configurar el nombre, descripción, nivel y alumnos de sus clases.
- Subir documentos y clasificarlos.
- Construir el itinerario de cada clase colocando documentos en el orden deseado.
- Compartir documentos con toda la clase o con uno o varios alumnos concretos.
- Ver si el contenido ha sido abierto o completado.

### Alumno

- Acceder a su perfil.
- Ver sus clases.
- Ver únicamente documentos compartidos directamente con él o heredados de sus clases.
- Abrir PDFs y marcar teoría como completada.
- No puede ver documentos privados ni administrar usuarios.

## 4. Núcleo funcional

### Alumnos

Listado con búsqueda, filtros por clase y estado, ficha individual, edición, alta y baja lógica. La ficha muestra clases, documentos disponibles y progreso.

Campos iniciales: nombre, apellidos, email, teléfono opcional, avatar opcional, estado, fecha de alta y notas internas.

### Profesores

Listado y ficha con clases asignadas, documentos subidos y actividad reciente. Alta, edición, desactivación y recuperación de acceso.

Campos iniciales: nombre, apellidos, email, especialidad, color identificativo, estado y fecha de alta.

### Clases

Una clase es un grupo operativo, no necesariamente una materia. Puede tener varios profesores y varios alumnos. Un alumno puede pertenecer a varias clases simultáneamente.

Campos iniciales: nombre, descripción, profesor/es, alumnos, color, curso o nivel, estado y orden.

#### Constructor de itinerario para el profesor

La pestaña **Itinerario** tiene dos zonas:

- **Biblioteca disponible**, con búsqueda, filtros por materia/nivel y selección múltiple.
- **Timeline de la clase**, donde el profesor añade documentos, los arrastra para cambiar el orden y puede agruparlos por módulos.

Añadir un documento al itinerario no lo comparte automáticamente. El profesor decide después, mediante el check de cada fila o de un módulo completo, qué contenido queda visible para la clase. Así se separa claramente “preparar el curso” de “publicar el contenido”.

### Biblioteca de documentos

La biblioteca debe soportar cientos o miles de PDFs sin convertirse en una carpeta interminable. La organización recomendada es:

- Materia o área: lectura, técnica, ritmo, armonía, repertorio, etc.
- Nivel o curso.
- Módulo o unidad.
- Orden dentro del itinerario.
- Etiquetas y estado: borrador, publicado, archivado.

Cada documento tiene título, descripción corta, PDF, portada opcional, autor, categoría, nivel, duración estimada y posición.

Importante: todo documento nace como **privado**. Subirlo no da acceso a ningún alumno.

## 5. Modelo de acceso a documentos

El acceso efectivo de un alumno es la unión de dos fuentes:

```text
documentos compartidos directamente con el alumno
                 ∪
documentos compartidos con cualquiera de sus clases
                 =
documentos visibles para el alumno
```

Una misma concesión no debe duplicar el documento en la interfaz. Si llega por dos vías, se muestra una sola vez indicando, si interesa, “Compartido contigo y con tu clase”.

### Compartir con una clase

En la vista de clase aparece el itinerario de documentos con un check por fila. Al activar el check, el documento queda disponible para todos los alumnos activos de esa clase. Al desactivarlo, deja de estar disponible por esa vía, pero no se revoca un acceso directo.

### Compartir con un alumno

Desde el explorador de documentos, el profesor puede seleccionar uno o varios PDFs y pulsar **Compartir**. Un selector permite elegir una clase, un alumno o varios alumnos. La acción debe mostrar un resumen antes de confirmar: documentos seleccionados, destinatarios y efecto esperado. Es útil para refuerzo, deberes o material personalizado.

También puede hacerse desde la ficha del alumno, donde se muestran los documentos directos y los recibidos por sus clases.

### Progreso

El acceso y el progreso son conceptos distintos. Compartir hace visible el documento; abrirlo registra una primera consulta; marcarlo como completado registra el progreso del alumno. La escuela puede revisar quién lo ha visto y quién lo ha completado.

## 6. Recorrido de demo recomendado

### Pantalla 1 — Inicio

Dashboard limpio con tres indicadores del núcleo: alumnos activos, clases activas y documentos en biblioteca. Debajo, accesos directos a “Nueva clase”, “Añadir alumno” y “Explorar documentos”. No incluir informes ni métricas complejas.

### Pantalla 2 — Biblioteca

Vista tipo tabla/lista con filtros, búsqueda y agrupación por materia. Cada documento muestra estado de visibilidad: privado, compartido con 1 clase o compartido directamente. CTA principal: “Subir documento”.

### Pantalla 3 — Una clase

Cabecera con nombre, profesores y número de alumnos. Dos pestañas: “Alumnos” e “Itinerario”. En “Itinerario”, una timeline vertical de unidades con checks grandes y claros. El gesto clave de la demo es activar tres documentos y mostrar el cambio de acceso.

### Pantalla 4 — Flujo del profesor: preparar y compartir

El profesor entra en una clase, abre **Itinerario**, busca en la biblioteca “Ritmo y subdivisión”, “Lectura básica” y “Coordinación”, los añade y los reordena en la timeline. Después activa el check de dos documentos para la clase y abre el explorador para enviar otro documento únicamente a Lucía y Marcos. Un panel de confirmación deja claro quién tendrá acceso.

### Pantalla 5 — Alumno

Ficha con progreso, clases y documentos. Un bloque “Para ti” demuestra el envío individual y otro bloque “De tus clases” demuestra el acceso heredado.

### Pantalla 6 — Portal del alumno

Experiencia mucho más simple: bienvenida, clases, porcentaje de progreso y tarjetas de documentos disponibles. Nada privado aparece. Un PDF puede abrirse en visor y marcarse como completado.

## 7. Dirección visual de la demo

Minimalista, cálida y profesional: fondo marfil muy claro, superficies blancas, tipografía sans de alto contraste, bordes finos, esquinas moderadas y un solo color de acento coral/terracota. La interfaz debe sentirse como una herramienta de trabajo cuidada, no como un campus universitario genérico.

Principios:

- Mucho espacio útil y jerarquía evidente.
- Un CTA principal por pantalla.
- Checks de 28–32 px, visibles y cómodos en móvil.
- Estados explicados con texto además de color.
- Sin gradientes, exceso de ilustraciones ni animaciones decorativas.
- La timeline debe ser el elemento memorable de la demo.
- Calendario, Informes y Configuración son placeholders visuales sin funcionalidad.

## 8. Arquitectura técnica propuesta

### Aplicación

Aplicación web responsive con dos superficies: backoffice para dirección/profesores y portal de alumnos. La navegación y los permisos deben derivarse del rol, no solo ocultarse visualmente.

### Entidades principales

- `users` / identidad de autenticación.
- `students`.
- `teachers`.
- `classes`.
- `class_members` — relación alumno-clase.
- `class_teachers` — relación profesor-clase.
- `documents`.
- `document_categories` o estructura de materia/nivel/unidad.
- `document_class_shares` — documento compartido con clase.
- `document_student_shares` — documento compartido directamente.
- `student_document_progress` — visto, completado, fechas y última posición.
- `audit_events` — cambios de acceso y acciones relevantes.

### Reglas de seguridad

- Documento privado por defecto.
- Un alumno solo puede leer metadatos y archivos si existe una concesión directa o una concesión a una clase de la que es miembro.
- Un profesor solo administra clases asignadas y alumnos pertenecientes a ellas, salvo permiso de dirección.
- Las bajas deben ser lógicas para conservar progreso e historial.
- Las revocaciones deben dejar trazabilidad.
- Los PDFs se sirven mediante URLs firmadas de corta duración, nunca desde un bucket público.

### Escalabilidad de la biblioteca

Para casi mil PDFs, conviene separar metadatos de archivos, indexar título/categoría/orden y usar carga múltiple con progreso. La biblioteca debe permitir reordenar unidades sin renombrar archivos y mantener una portada o miniatura generada opcionalmente.

## 9. API / acciones necesarias para el núcleo

- `createStudent`, `updateStudent`, `archiveStudent`.
- `createTeacher`, `updateTeacher`, `archiveTeacher`.
- `createClass`, `updateClass`, `addClassMember`, `removeClassMember`.
- `uploadDocument`, `updateDocument`, `archiveDocument`, `reorderDocuments`.
- `shareDocumentWithClass`, `unshareDocumentWithClass`.
- `shareDocumentWithStudent`, `unshareDocumentWithStudent`.
- `addDocumentToClassPath`, `removeDocumentFromClassPath`, `reorderClassPath`.
- `shareDocumentsWithStudents` — operación múltiple con confirmación de destinatarios.
- `getStudentLibrary` — devuelve la unión de accesos sin duplicados.
- `markDocumentViewed`, `markDocumentCompleted`.
- `getClassProgress`, `getDashboardSummary`.

## 10. Datos de demo sugeridos

Escuela genérica “Aula Norte”, tres profesores, 18 alumnos, cuatro clases y unas 20 piezas de teoría de ejemplo. Materias: fundamentos, ritmo, lectura, técnica y repertorio. El escenario debe incluir un alumno en dos clases para demostrar correctamente la unión de permisos.

## 11. Decisiones a validar antes de programar

- Si una revocación de acceso debe mantener el progreso histórico.
- Si los profesores pueden compartir cualquier documento o solo los que han subido.
- Si el alumno puede descargar PDFs o solo visualizarlos.
- Si las clases tienen fecha de inicio/fin y grupos recurrentes.
- Si se necesitan comentarios, tareas o solo lectura y completado.
- Si la primera demo debe estar tematizada como batería o permanecer totalmente genérica.

## 12. Criterio de éxito de la demo

En menos de cinco minutos, el cliente debe ver: crear una clase, añadir alumnos, elegir documentos en una timeline, compartirlos con un check, enviar uno adicional a un alumno concreto y comprobar desde el portal del alumno que solo aparecen los documentos correctos.

## 13. Arte conceptual incluido

- [Vista general del backoffice](prototipos/backoffice-overview.png)
- [Vista de clase con timeline e itinerario](prototipos/class-timeline.png)
- [Portal del alumno](prototipos/student-portal.png)
- [Vista del profesor preparando y compartiendo contenido](prototipos/teacher-workspace.png)

Estas imágenes son dirección visual de prototipo, no diseño final ni especificación pixel-perfect.

## 14. Especificación de implementación para el equipo

### Persistencia local

Empezar con un **MockRepository local** respaldado por `mock-data.json`. Al arrancar, carga una copia profunda de la semilla. Todas las altas, ediciones, relaciones, órdenes, checks y progresos se guardan en `localStorage` bajo una clave versionada, por ejemplo `clases-bateria.demo.v1`. Si el volumen creciera, el mismo contrato puede pasar a IndexedDB sin tocar la UI.

No usar servidor, red, emails ni autenticación real. Añadir “Restablecer datos de demo” para borrar la clave local y recargar la semilla.

### Login simulado

Rutas:

- `/login` — tarjetas seleccionables con dos profesores y tres alumnos.
- `/registro` — pantalla con “Registro no disponible en la demo”.
- `/recuperar-contrasena` — pantalla informativa sin envío de emails.

Al seleccionar una tarjeta, guardar `currentDemoUserId` en `localStorage`, cargar el rol y navegar al inicio correspondiente. “Cambiar usuario” debe estar siempre visible en el shell. Cambiar de identidad no reinicia los datos: si Ana crea una clase, añade a Lucía y comparte documentos, al entrar después como Lucía deben aparecer esa clase y esos documentos.

### Contrato que no debe cambiar al sustituir la persistencia

Definir interfaces de dominio/aplicación como:

```ts
interface StudentRepository {
  list(filters?: StudentFilters): Promise<Student[]>
  getById(id: string): Promise<Student | null>
  create(input: CreateStudentInput): Promise<Student>
  update(id: string, input: UpdateStudentInput): Promise<Student>
  archive(id: string): Promise<void>
}

interface TeacherRepository {
  list(): Promise<Teacher[]>
  getById(id: string): Promise<Teacher | null>
}

interface ClassRepository {
  list(): Promise<SchoolClass[]>
  getDetail(id: string): Promise<ClassDetail | null>
  create(input: CreateClassInput): Promise<SchoolClass>
  update(id: string, input: UpdateClassInput): Promise<SchoolClass>
  addStudent(classId: string, studentId: string): Promise<void>
  removeStudent(classId: string, studentId: string): Promise<void>
}

interface DocumentRepository {
  list(filters?: DocumentFilters): Promise<Document[]>
  addToClassPath(classId: string, documentId: string): Promise<void>
  removeFromClassPath(classId: string, documentId: string): Promise<void>
  reorderClassPath(classId: string, orderedDocumentIds: string[]): Promise<void>
  shareWithClass(classId: string, documentId: string, shared: boolean): Promise<void>
  shareWithStudents(documentIds: string[], studentIds: string[]): Promise<void>
  getStudentLibrary(studentId: string): Promise<VisibleDocument[]>
}
```

La aplicación solo conoce estas interfaces. `MockStudentRepository`, `MockTeacherRepository`, `MockClassRepository` y `MockDocumentRepository` leen y actualizan el store local. El proveedor de persistencia se inyecta una sola vez en `app/providers`; ninguna pantalla importa `localStorage` ni detalles de transporte.

### Capas y responsabilidades

```text
feature/
  ui/              componentes, rutas, formularios, estados de carga/error
  application/     casos de uso, comandos, queries y DTOs
  domain/          entidades, value objects y reglas puras
  infrastructure/  repositorios mock y store local
shared/
  ui/              botones, inputs, modal, checkbox, tabla, empty state
  lib/             fechas, ids, errores, validación
```

Features mínimas: `students`, `teachers`, `classes`, `documents`, `student-portal` y `dashboard`. Cada feature debe exponer una API pública pequeña desde su `index.ts`; ninguna feature debe importar componentes internos de otra.

### Casos de uso mínimos

- `listStudents`, `createStudent`, `updateStudent`, `archiveStudent`.
- `listTeachers`, `createTeacher`, `updateTeacher`, `archiveTeacher`.
- `createClass`, `updateClass`, `getClassDetail`, `manageClassStudents`.
- `getClassPath`, `addDocumentToClassPath`, `removeDocumentFromClassPath`, `reorderClassPath`.
- `searchDocuments`, `shareDocumentsWithClass`, `shareDocumentsWithStudents`.
- `getStudentLibrary`, `markDocumentViewed`, `markDocumentCompleted`.

Cada caso de uso debe devolver datos preparados para la UI y errores tipados. La UI no debe decidir si un alumno ve un documento; esa regla vive en `getStudentLibrary`.

### Regla de biblioteca visible

```ts
visibleDocumentIds(studentId) = directShareDocumentIds(studentId)
  ∪ classShareDocumentIds(classIdsForStudent(studentId));
```

El resultado se deduplica por `documentId`, se ordena por la posición del itinerario cuando existe y después por título. Un documento añadido a un itinerario pero no compartido continúa siendo privado.

### Rutas y navegación de la demo

- `/` — dashboard reducido.
- `/alumnos` y `/alumnos/:id` — CRUD y ficha.
- `/profesores` y `/profesores/:id` — CRUD y ficha.
- `/clases` y `/clases/:id` — clase, alumnos e itinerario.
- `/biblioteca` — explorador y compartir.
- `/alumno` — portal del alumno demo.
- `/calendario`, `/informes`, `/configuracion` — placeholder vacío “Próximamente”.

### Estados que deben estar implementados

Todas las pantallas del núcleo necesitan: carga inicial, vacío, error recuperable y éxito. En acciones de check, usar actualización optimista con rollback si falla. En la demo mock, las operaciones deben persistir durante la sesión para que el cliente vea inmediatamente el resultado al cambiar de pantalla.

### Compartir múltiple

El explorador permite seleccionar documentos mediante checkbox. El botón “Compartir” abre un modal con selector múltiple de alumnos y resumen de la acción. Confirmar ejecuta una sola operación de aplicación; el resultado muestra cuántos documentos y destinatarios se han actualizado. No enviar emails en la demo.

### Frontera de infraestructura

La infraestructura de esta entrega se limita a `seed-loader`, `local-store`, `demo-session` y los repositorios mock. El dominio no conoce el navegador. Si en el futuro cambia la persistencia, se sustituye únicamente esa implementación por otra que cumpla los contratos; no se modifican dominio, casos de uso ni pantallas.

### Base técnica Doscientos a reutilizar

El equipo debe partir del starter operativo interno y aplicar las skills `lead-demo-generation`, `technical-details` y `doscientos-ecosystem` como guía de estructura y calidad. La base recomendada para esta SPA es React + TypeScript + Vite + TanStack Router + TanStack Query + Tailwind v4 + `@doscientos/ui`, respetando las versiones y scripts del starter.

Reutilizar el shell, primitives accesibles, patrones de `DataViewState`, fixtures sintéticas y quality gates del starter. No copiar el dominio de customers: sustituirlo por las features de esta propuesta. Las rutas deben ser rutas reales del router, no condicionales sobre `window.location`. La demo debe arrancar sin red y ofrecer `dev`, `build`, `lint`, `typecheck`, `test` y `quality`.

### Checklist de entrega de la demo

- El profesor demo puede abrir “Batería · Nivel inicial”.
- `/login`, `/registro` y `/recuperar-contrasena` son rutas navegables de demo.
- Se puede cambiar de profesor a alumno sin perder los cambios.
- Una clase creada durante la llamada aparece al entrar como alumno miembro.
- Puede añadir y quitar documentos del itinerario.
- Puede reordenarlos y distinguir preparados de compartidos.
- Puede activar/desactivar el check de compartir con la clase.
- Puede compartir uno o varios documentos con Lucía y Marcos.
- Lucía ve la unión de sus accesos directos y de sus clases sin duplicados.
- Un documento privado no aparece en el portal del alumno.
- Al cambiar de pantalla, los cambios mock siguen vivos durante la sesión.
- Calendario, Informes y Configuración no contienen funcionalidad falsa.
