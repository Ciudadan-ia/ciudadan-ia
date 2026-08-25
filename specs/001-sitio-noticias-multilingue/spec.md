# Feature Specification: Sitio de noticias multilingüe CIUDADAN-IA

**Feature Branch**: `001-sitio-noticias-multilingue`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Sitio de noticias multilingüe de CIUDADAN-IA: medio de divulgación científica sobre IA (beneficios y peligros) publicado en español (default), inglés, náhuatl y maya yucateco. Portada con selector de lenguas de tres capas con endónimos, historia dominante, contadores vivos por lengua, CTA de contribución de fricción cero, newsletter con promesa y día fijo, voz rotatoria de la semana, player de audio accesible con descarga y transcripción, footer de gobernanza. Artículos con estructura pregunta corta + capa profunda, estados de traducción (borrador → traducido-IA → validado) con crédito nominal a autor/traductor/narrador/validador, vista bilingüe en paralelo como fallback. Páginas fundacionales: manifiesto, gobernanza de datos en lenguaje llano, política de uso de IA, transparencia, colabora. Ruta /lite de solo texto y PWA offline. User stories: lector general, hablante nativo de náhuatl/maya, docente, validador institucional."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lector general descubre y entiende la IA en su idioma (Priority: P1)

Una persona latinoamericana sin formación técnica llega a la portada (por búsqueda, redes o
WhatsApp), encuentra una historia dominante con titular de consecuencia humana, lee la
respuesta corta a una pregunta cotidiana sobre IA ("¿puede una IA quitarme el trabajo?") y,
si quiere, baja a la capa profunda con tiempo de lectura indicado. Puede escuchar la versión
en audio y suscribirse a la newsletter con promesa clara ("la IA explicada en tu idioma,
todos los martes, en 5 minutos").

**Why this priority**: es la razón de ser del medio; sin lectura no hay audiencia, credibilidad
ni argumento para el financiamiento del resto del proyecto.

**Independent Test**: publicar la portada con al menos 5 artículos en español; una persona sin
contexto puede llegar, leer una respuesta corta en menos de 2 minutos, encontrar la capa
profunda y suscribirse a la newsletter, todo sin ayuda.

**Acceptance Scenarios**:

1. **Given** la portada publicada, **When** un visitante entra por primera vez, **Then** ve una
   historia dominante, dos destacadas y carriles temáticos, con el selector de lenguas visible
   en el encabezado sin hacer scroll.
2. **Given** un artículo abierto, **When** el lector lo recorre, **Then** encuentra primero la
   respuesta corta (lectura < 2 min) y después la capa profunda con su tiempo de lectura
   indicado.
3. **Given** cualquier página, **When** el lector deja su correo en el bloque de newsletter,
   **Then** recibe confirmación de suscripción y la promesa editorial queda explícita (día fijo
   y duración).
4. **Given** un dispositivo de gama baja con conexión lenta, **When** carga la portada, **Then**
   el contenido es legible aunque el navegador tenga JavaScript deshabilitado.

---

### User Story 2 - Hablante nativo lee, escucha y contribuye en su lengua (Priority: P2)

Una persona hablante de náhuatl o maya yucateco cambia el sitio a su lengua mediante el
selector de endónimos, lee artículos en su lengua (o en vista bilingüe en paralelo cuando la
traducción aún no existe), escucha el audio narrado, descarga el audio para compartirlo por
WhatsApp o radio comunitaria, y encuentra un llamado claro para contribuir con su voz o
corregir una traducción, sin registro previo.

**Why this priority**: es el diferenciador único del proyecto y el embudo hacia la parte 2
(tecnología de lenguas); sin experiencia digna en lengua indígena el proyecto pierde su razón
de existir.

**Independent Test**: con 2-3 artículos traducidos a náhuatl y maya, un hablante puede cambiar
de lengua, leer en vista bilingüe un artículo no traducido, reproducir/descargar un audio y
enviar su interés de contribuir, todo desde un teléfono de gama baja.

**Acceptance Scenarios**:

1. **Given** la portada en español, **When** el hablante abre el selector de lenguas, **Then**
   ve las lenguas por su endónimo (Nāhuatlahtōlli, Maaya t'aan), sin banderas, con las lenguas
   del piloto destacadas.
2. **Given** el sitio en náhuatl, **When** el hablante abre un artículo ya validado, **Then**
   lo lee íntegramente en náhuatl con el crédito nominal de quien tradujo y validó visible.
3. **Given** el sitio en náhuatl, **When** el hablante abre un artículo aún no traducido,
   **Then** ve la vista bilingüe en paralelo (náhuatl disponible + español) — nunca una página
   vacía ni un error.
4. **Given** un artículo con audio, **When** el hablante usa el player, **Then** puede
   reproducir, pausar, ver la transcripción y descargar el archivo comprimido para compartir.
5. **Given** cualquier página en lengua indígena, **When** el hablante quiere participar,
   **Then** encuentra en el primer scroll un llamado a contribuir que puede completar en menos
   de 30 segundos sin crear cuenta.

---

### User Story 3 - Docente usa el contenido en su aula (Priority: P3)

Una persona docente (de secundaria, bachillerato o educación comunitaria) encuentra la puerta
"para docentes" en la portada, accede a artículos organizados por tema con respuestas cortas
reutilizables en clase, y se suscribe a la edición de newsletter para docentes. Puede imprimir
o proyectar la ruta ligera de solo texto sin distracciones.

**Why this priority**: los docentes multiplican el alcance (un docente = decenas de
estudiantes) y son el público objetivo natural de las alianzas institucionales, pero dependen
de que exista primero el contenido de P1.

**Independent Test**: con la portada y 5 artículos publicados, un docente puede llegar a la
puerta "para docentes", encontrar contenido por tema y obtener una versión de solo texto
utilizable en aula.

**Acceptance Scenarios**:

1. **Given** la portada, **When** el docente entra por la puerta "para docentes", **Then**
   encuentra el contenido organizado por tema con la respuesta corta visible de cada pieza.
2. **Given** cualquier artículo, **When** el docente abre su versión de solo texto, **Then**
   obtiene el contenido íntegro en una columna, sin navegación decorativa, apto para imprimir.

---

### User Story 4 - Validador institucional revisa y aprueba traducciones (Priority: P4)

Una persona validadora nativa (de una universidad, academia de lengua u organización aliada)
recibe el enlace a un artículo en estado "traducido por IA", lo revisa contra el original en
la vista bilingüe en paralelo, y comunica sus correcciones al equipo editorial. Cuando el
equipo aplica los cambios y publica la versión validada, el nombre de la persona validadora
aparece en el crédito de la pieza.

**Why this priority**: el flujo de validación garantiza la calidad lingüística y cultural,
pero en el MVP puede operar por canales existentes (correo/WhatsApp) sin herramienta propia;
lo esencial es que el estado y el crédito sean visibles en el sitio.

**Independent Test**: publicar un artículo en estado "traducido-IA" con su aviso visible;
tras la validación externa, actualizarlo a "validado" y comprobar que el aviso desaparece y
el crédito nominal de quien validó aparece.

**Acceptance Scenarios**:

1. **Given** un artículo traducido por IA sin validar, **When** cualquier persona lo abre,
   **Then** ve un aviso claro de "traducción pendiente de validación por hablantes" en la
   lengua correspondiente.
2. **Given** un artículo validado, **When** cualquier persona lo abre, **Then** el aviso ya no
   aparece y el crédito muestra autor, traductor y validador con nombre.
3. **Given** la vista bilingüe en paralelo, **When** la persona validadora la usa, **Then**
   puede comparar párrafo a párrafo la lengua indígena con el español.

---

### Edge Cases

- ¿Qué pasa cuando una lengua del selector no tiene ningún artículo validado aún? → La edición
  de esa lengua muestra artículos en vista bilingüe (traducción IA marcada + español); nunca
  una portada vacía. Si ni siquiera hay traducción IA, la lengua no aparece en el selector
  (principio "ninguna lengua anunciada sin contenido").
- ¿Qué pasa cuando un artículo no tiene audio todavía? → El player se sustituye por el llamado
  "préstanos tu voz" que enlaza al flujo de contribución; nunca un player roto o vacío.
- ¿Qué pasa sin conexión? → Las páginas ya visitadas se sirven desde el caché offline con un
  indicador de "estás viendo una copia guardada"; las no visitadas muestran una página offline
  con lo disponible.
- ¿Qué pasa si el navegador no soporta la app instalable u offline? → El sitio funciona igual
  como web normal; la capacidad offline es mejora progresiva.
- ¿Qué pasa con caracteres especiales (saltillo, glotal, diacríticos apilados) en dispositivos
  antiguos? → Las fuentes del sitio los cubren y se prueban en gama baja; nunca se depende de
  la fuente del sistema.
- ¿Qué pasa si alguien envía el formulario de contribución con datos incompletos o spam? → El
  formulario valida campos mínimos (nombre o seudónimo, medio de contacto, lengua) y explica
  el error en lenguaje llano; incluye protección anti-spam no intrusiva.
- ¿Qué pasa cuando el lector llega con su navegador en inglés a la edición en español? → Se le
  ofrece de forma visible (no intrusiva) el enlace a la edición en inglés; la preferencia
  elegida persiste en visitas siguientes.

## Requirements *(mandatory)*

### Functional Requirements

#### Ediciones e idiomas

- **FR-001**: El sitio DEBE publicarse en cuatro ediciones: español (por defecto), inglés,
  náhuatl y maya yucateco, cada una con su propia ruta estable y enlazable.
- **FR-002**: El selector de lenguas DEBE estar visible en el encabezado de toda página, usar
  endónimos (nunca banderas) y organizarse en capas: lenguas destacadas primero y lista
  completa accesible.
- **FR-003**: El sitio DEBE detectar el idioma preferido del navegador y ofrecer un enlace de
  corrección visible de un clic; la elección del usuario DEBE persistir entre visitas.
- **FR-004**: Todo bloque de texto en una lengua distinta a la de la página DEBE declarar su
  lengua correctamente para tecnologías de asistencia y buscadores.
- **FR-005**: Ninguna lengua DEBE aparecer en el selector sin contenido disponible; una lengua
  con contenido parcial DEBE resolver a la vista bilingüe en paralelo.

#### Contenido editorial

- **FR-006**: Cada artículo DEBE estructurarse como respuesta corta (lectura < 2 minutos) +
  capa profunda opcional con tiempo de lectura indicado.
- **FR-007**: Cada artículo DEBE mostrar crédito nominal: autor; y cuando apliquen, traductor,
  narrador y validador.
- **FR-008**: Cada traducción DEBE tener un estado visible del ciclo: borrador → traducido-IA
  (con aviso "pendiente de validación") → validado (aviso removido, crédito de validador
  visible).
- **FR-009**: La vista bilingüe en paralelo DEBE permitir comparar la lengua indígena y el
  español lado a lado (o alternando por bloque en pantallas angostas).
- **FR-010**: El sitio DEBE lanzarse con al menos 5 artículos en español, de los cuales al
  menos 2 tengan traducción a náhuatl y a maya yucateco (estado traducido-IA o validado).
- **FR-011**: La portada DEBE presentar: historia dominante con pieza visual, dos historias
  destacadas, carriles temáticos, y puertas de entrada por audiencia (público general,
  docentes, comunidades hablantes).
- **FR-012**: La portada DEBE mostrar contadores por lengua (artículos publicados, audios
  disponibles, personas colaboradoras) actualizados con cada publicación.
- **FR-013**: La portada DEBE incluir la sección "voz de la semana": una persona hablante con
  nombre, territorio y cita o audio, rotada editorialmente.

#### Audio

- **FR-014**: Todo artículo con audio DEBE ofrecer un reproductor accesible (teclado y lector
  de pantalla) con transcripción visible y botón de descarga del archivo comprimido.
- **FR-015**: Los audios DEBEN estar indexados por lengua y publicados con una licencia que
  permita su retransmisión por radios comunitarias, indicada junto al botón de descarga.
- **FR-016**: Un artículo sin audio DEBE mostrar el llamado "préstanos tu voz" en lugar del
  reproductor.

#### Participación y captación

- **FR-017**: Toda página DEBE incluir un llamado a contribuir (grabar voz / corregir
  traducción / contar una historia) completable en menos de 30 segundos sin crear cuenta,
  mediante un formulario de interés con validación y protección anti-spam.
- **FR-018**: El formulario de contribución DEBE mostrar el consentimiento en lenguaje llano
  en el punto de captura: qué se hace con los datos y cómo el beneficio regresa a la
  comunidad.
- **FR-019**: Toda página DEBE incluir el bloque de suscripción a la newsletter con promesa
  explícita (contenido, día fijo, duración) y confirmación de alta; DEBE existir la opción de
  segmento para docentes.

#### Páginas fundacionales

- **FR-020**: El sitio DEBE incluir cinco páginas fundacionales: manifiesto, gobernanza de
  datos en lenguaje llano ("¿quién es dueño de tu voz?"), política de uso de IA, transparencia
  de financiamiento, y colabora (validadores y alianzas).
- **FR-021**: El pie de página de todo el sitio DEBE enlazar las páginas fundacionales e
  indicar las licencias del contenido (divulgación) y de los datos de voz (comunitaria).

#### Alcance, rendimiento y acceso

- **FR-022**: Todo el contenido DEBE ser legible sin JavaScript habilitado.
- **FR-023**: El sitio DEBE ofrecer una ruta ligera de solo texto por artículo y por portada,
  generada del mismo contenido, apta para conexiones 2G e impresión.
- **FR-024**: El sitio DEBE poder instalarse como aplicación y servir sin conexión las páginas
  ya visitadas, indicando cuando se muestra una copia guardada.
- **FR-025**: Toda página DEBE cumplir accesibilidad WCAG 2.2 AA (contraste, jerarquía de
  encabezados, enlaces de salto, foco visible, textos alternativos).
- **FR-026**: La portada DEBE pesar menos de 300 KB en su primera carga y las imágenes DEBEN
  servirse en variantes adaptadas al dispositivo.
- **FR-027**: Los caracteres propios de las lenguas del piloto (saltillo U+A78B/U+A78C,
  oclusiva glotal, diacríticos apilados) DEBEN renderizar correctamente con las fuentes del
  sitio en dispositivos de gama baja.

### Key Entities

- **Artículo**: pieza editorial con título (dos tiempos), respuesta corta, capa profunda,
  tema, pieza visual, tiempo de lectura, fecha; existe en una o más lenguas vinculadas entre
  sí como traducciones de un mismo original.
- **Traducción**: versión de un artículo en una lengua; atributos: lengua, estado (borrador /
  traducido-IA / validado), texto, créditos propios (traductor, validador).
- **Audio**: narración de un artículo en una lengua; atributos: narrador, duración, archivo
  descargable, transcripción, licencia de retransmisión.
- **Persona colaboradora**: autor, traductor, narrador o validador con nombre público, rol y
  (opcional) territorio/afiliación; aparece en créditos y contadores.
- **Lengua/Edición**: idioma publicable con endónimo, código, estado (activa solo si tiene
  contenido) y contadores (artículos, audios, colaboradores).
- **Voz de la semana**: destaque editorial de una persona hablante: nombre, territorio,
  cita o audio, semana de publicación.
- **Suscripción**: correo + segmento (general / docentes) + lengua preferida.
- **Interés de contribución**: registro de una persona que quiere participar: nombre o
  seudónimo, contacto, lengua, tipo de aporte (voz / corrección / historia), consentimiento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona sin contexto previo puede llegar a la portada, entender de qué trata
  el sitio y leer una respuesta corta completa en menos de 2 minutos.
- **SC-002**: Un hablante puede cambiar a su lengua, abrir un artículo y (si no está traducido)
  ver la vista bilingüe, en 3 interacciones o menos desde la portada.
- **SC-003**: El 100% de los artículos publicados en lenguas indígenas muestra su estado de
  traducción y su crédito nominal completo.
- **SC-004**: El sitio completo es navegable y legible sin JavaScript y en una conexión 2G
  simulada (portada < 300 KB primera carga; ruta lite < 50 KB).
- **SC-005**: Cero errores de accesibilidad de nivel AA detectables por herramientas
  automáticas en portada, artículo tipo y páginas fundacionales.
- **SC-006**: El flujo de contribución se completa en menos de 30 segundos sin crear cuenta,
  medido de clic inicial a confirmación.
- **SC-007**: Las páginas visitadas quedan disponibles sin conexión y el sitio es instalable
  como aplicación en los navegadores móviles principales.
- **SC-008**: Los caracteres especiales de náhuatl y maya yucateco renderizan correctamente en
  un dispositivo Android de gama baja de referencia (sin cuadros vacíos ni sustituciones).

## Assumptions

- El equipo editorial escribe primero en español; las traducciones iniciales las produce IA y
  se marcan como pendientes hasta la validación por hablantes (modelo definido en la
  constitución del proyecto).
- La validación de traducciones en el MVP ocurre fuera del sitio (correo/WhatsApp con
  validadores aliados); el sitio solo refleja estados y créditos. Una herramienta de
  validación propia queda fuera del alcance de esta feature.
- La newsletter se opera con un servicio externo de correo; el sitio solo captura la
  suscripción con confirmación.
- Los audios narrados por hablantes pueden no existir al lanzamiento; el llamado "préstanos tu
  voz" es el sustituto aceptado (FR-016). No se usa voz sintética sin marcarla.
- La plataforma de recolección de voz (parte 2 del proyecto) queda fuera del alcance; el
  formulario de interés de contribución es su precursor.
- El video corto y los explicadores interactivos se distribuyen en redes sociales en esta
  etapa; su integración profunda al sitio queda para una feature posterior.
- Ortografías del piloto: náhuatl según normas INALI y maya yucateco según norma de la
  Academia de la Lengua Maya; las variantes dialectales del náhuatl se tratan editorialmente
  (nota de variante), no como ediciones separadas.
- El nombre público del medio es CIUDADAN-IA; dominio y redes se definen al momento del
  deploy.
