# Cloudflare Pages — publicación comprobada

Corte: 27/10/2026. Estado: publicado en Cloudflare Pages Free, sin servicios de pago añadidos.

- Sitio público: https://ciudadan-ia.pages.dev/
- Despliegue inmutable: https://55aa0c70.ciudadan-ia.pages.dev/
- Identificador: `55aa0c70-82c6-46e3-a5e4-babf7f083abe`.
- Commit publicado: `ed9f8678e5034d56df8b0315afbeb7950e935128`.
- Ejecución: [40561838718](https://github.com/Ciudadan-ia/ciudadan-ia/actions/runs/40561838718).
- Proyecto `ciudadan-ia`, Direct Upload, rama de producción `main`; plan Free ($0)
  comprobado en el panel. Los pasos «Desplegar» y «Registrar despliegue realmente
  ejecutado» finalizaron con éxito; el panel muestra Production / main.
- Ambos secretos de GitHub están configurados. La clave se transfirió cifrada para
  el repositorio; su valor no se guardó en archivos del proyecto ni se reprodujo en
  mensajes. Token de cuenta `ciudadania-pages-github`, único permiso Pages Write en
  esta cuenta, vencimiento 25/01/2027. Ese alcance incluye todos sus proyectos Pages.

## Verificación de la publicación

El artefacto `dist` contiene 82 páginas HTML. Cinco páginas públicas (portada,
lectura ligera, edición inglesa, estado de participación y un artículo) respondieron
200 y coincidieron byte por byte con el artefacto verificado. Se comprobaron 24
rutas ausentes: los 14 módulos y vistas de revisión, los índices maya/náhuatl y las
ocho rutas completas/ligeras de las cuatro traducciones pendientes. Todas devolvieron
404 con la página de contenido no encontrado; no fue una sustitución por la portada.

Las solicitudes POST vacías a `/api/suscribir` y `/api/contribuir` devolvieron 303 a
`/participacion-pendiente/`. No se enviaron datos personales ni se abrieron servicios
de recepción. Se comprobó también la portada en el navegador. El cliente curl con su
configuración normal pasó las pruebas; Python urllib recibió el bloqueo 1010 de
Cloudflare. No se cambiaron protecciones de Cloudflare ni validación TLS para probar.

La nueva portada, sus tres historias, los 40 contenidos educativos/editoriales y las
traducciones pendientes conservan su estado de revisión. La aprobación de la dirección
de diseño no equivale a revisión científica humana. La copia privada continúa en
https://ciudadania-prototipo-90d.xquaz.chatgpt.site/portada/ .

Responsable tecnológico: por designar; custodia de la cuenta y renovación del token:
fundador hasta que se delegue explícitamente. Renovar antes del 25/01/2027, con el mismo
alcance mínimo y guardado directo en GitHub Secrets. No se creó una automatización de
renovación ni se activaron membresías, cobros, donativos o captación de voz.

El procedimiento siguiente se conserva como referencia para mantenimiento.

## Primera etapa gratuita

- Alojamiento: Cloudflare Pages Free; dirección `pages.dev` asignada por Cloudflare.
  Presupuesto de alojamiento inicial: 0 MXN/mes mientras se mantenga el plan gratuito
  y sus límites. Esto no cambia los costos de otros servicios institucionales.
- Sin compra de dominio, plan Workers Paid, almacenamiento contratado, membresías,
  pagos ni servicios de correo de pago en esta etapa.
- Páginas estáticas: solicitudes gratuitas e ilimitadas cuando no invocan funciones.
  Pages Free admite hasta 20,000 archivos, 25 MiB por archivo y 500 compilaciones
  mensuales en su plataforma. Aquí se compila en GitHub Actions.
- Functions: hasta 100,000 solicitudes diarias compartidas con el resto de Workers
  de la cuenta Free; revisar su uso real en la cuenta antes de abrir nuevos servicios.
  Las funciones actuales solo reciben rutas API y permanecen cerradas a captación.
- Crecimiento posterior: evaluar acceso de miembros, autenticación, protección del
  contenido, pagos y datos personales como una propuesta independiente con costos,
  responsables y validación jurídica. No se instala ni activa un sistema de membresías.

Fuentes oficiales consultadas el 27/10/2026:
[precios y solicitudes](https://developers.cloudflare.com/pages/functions/pricing/),
[límites de Pages](https://developers.cloudflare.com/pages/platform/limits/).

## Conexión guiada de la cuenta

1. El fundador inicia sesión en [Cloudflare](https://dash.cloudflare.com/) o completa
   personalmente el registro, la contraseña y la aceptación de condiciones. Conservar
   la titularidad de la cuenta; no enviar contraseñas ni claves por el chat.
2. Abrir Workers & Pages y revisar los proyectos existentes y el plan. Si existe
   `ciudadan-ia`, confirmar su propietario y tipo antes de modificarlo. Si no existe,
   crear un proyecto Pages de **Direct Upload**, producción `main`. No subir todavía
   una carpeta por arrastre: ese método no compila las Functions de este repositorio.
   La creación vacía puede hacerse con `wrangler pages project create ciudadan-ia
   --production-branch=main` una vez autenticado. No se ha ejecutado este comando.
3. Direct Upload permite publicar con nuestro flujo de GitHub Actions. El mismo
   proyecto no puede convertirse después a integración Git nativa; para ello haría
   falta otro proyecto. No activar un segundo publicador. Confirmar la dirección
   `pages.dev` asignada: puede llevar sufijo si el nombre ya está ocupado; en tal caso
   actualizar `site/astro.config.mjs` antes de compilar para producción.
4. Copiar el Account ID desde Workers & Pages → Account Details o mediante el buscador
   del panel: `Copy account ID`. No hace falta comprar o conectar un dominio.
5. En API Tokens, preparar un token dedicado `ciudadania-pages-github`, permiso
   **Account → Cloudflare Pages → Edit**, limitado a la cuenta elegida; ese permiso
   puede abarcar los proyectos Pages de esa cuenta. No usar Global API Key ni permisos
   DNS, facturación o administración de miembros. Revisar el alcance antes de que el
   fundador confirme su creación. No asumir que existe restricción por proyecto si
   el panel solo ofrece restricción por cuenta.
6. El fundador pega directamente los valores en
   [Settings → Secrets and variables → Actions](https://github.com/Ciudadan-ia/ciudadan-ia/settings/secrets/actions):
   `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_API_TOKEN`. El token queda en GitHub Secrets;
   no en archivos, documentos públicos, incidencias, capturas ni mensajes.
7. Mantener `CIUDADANIA_DRAFT_PREVIEW` ausente o `0`, `PUBLIC_FORMS_ENABLED=false` y
   `FORMS_ENABLED` ausente o `false`. No añadir proveedores de formularios, pagos o
   bindings de participantes. Con Direct Upload las banderas de compilación las fija
   GitHub Actions, no el panel de Cloudflare.
8. Avisar únicamente «sesión iniciada» o «secretos guardados», sin valores. Después
   ejecutar el procedimiento de publicación y comprobar su resultado real.

Referencias:
[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/),
[CI y permisos](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/),
[Account ID sin dominio](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/).

## Procedimiento preparado

1. Confirmar cuenta Cloudflare propietaria y proyecto Pages `ciudadan-ia`.
2. Para el flujo GitHub Actions existente, utilizar un proyecto de Direct Upload o comprobar
   que el proyecto existente admite el despliegue por Wrangler. No crear un segundo proyecto
   por inferencia ni activar dos publicadores sin decidir cuál es el canónico.
3. Guardar en los secretos de Actions del repositorio el Account ID y un token limitado a
   la cuenta/proyecto requerido, con Pages Edit. Introducirlos directamente en GitHub;
   no guardarlos en archivos, incidencias ni conversaciones.
4. Ejecutar el workflow sobre main. Deben pasar auditoría, lint, build, exclusión de
   borradores, formularios y accesibilidad. El artefacto permitido es `dist`; no `draft-review`.
5. Verificar que el paso de Wrangler se ejecutó y registrar su URL/identificador real.
6. Comprobar HTTP, portada, enlaces e idiomas en esa URL. Confirmar que `/v1`, `/aprender`
   y sus variantes `/lite/` no muestran el contenido pendiente. Un código HTTP 200 por sí
   solo no demuestra que el artefacto correcto se publicó.
7. Conservar commit, ejecución, URL y resultado de las pruebas en el registro de operación.

Fuente operativa: [Direct Upload de Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/direct-upload/).
Revalidar el tipo de proyecto y los permisos contra su configuración real antes de actuar.

## Inscripciones y colaboración

Los formularios quedan deshabilitados por defecto en HTML y servidor. No se activa
captación hasta validar el responsable de datos, aviso, conservación y recepción.
Después de esa validación, la activación requiere `PUBLIC_FORMS_ENABLED=true` durante
la compilación y `FORMS_ENABLED=true` en Pages Functions, además de las credenciales
Buttondown o el binding KV `CONTRIB` según el servicio. No es una aprobación jurídica
ni habilita corpus, entrenamiento o grabación de voz.

Sin la bandera o sin proveedor configurado, las funciones redirigen a
`/participacion-pendiente/` antes de leer los datos. Un error del proveedor o de
almacenamiento no genera una confirmación de éxito. No se hicieron envíos reales.


## Protección editorial reforzada · 27/10/2026

El fundador confirmó la dirección de la nueva portada y solicitó avanzar sus
validaciones, manteniendo pendientes fuera de producción. El cambio añade 14 rutas
de revisión excluidas y comprueba textos de las 40 unidades y las tres historias.
Las cuatro traducciones antiguas en maya/náhuatl con estado `traducido-ia` se admiten
únicamente en la compilación de revisión. La edición pública se genera solo con
entradas `validado` y fecha alcanzada. No se anuncia una edición sin contenido
validado. El estado heredado `validado` no acredita una nueva revisión humana de esta
ejecución; antes del estreno corresponde comprobar la responsabilidad editorial
del catálogo existente.

El expediente está en `editorial/portada-validaciones.json`. La revisión humana,
la prueba pedagógica, las traducciones nuevas, la producción audiovisual y la firma
editorial siguen pendientes. Conectar la cuenta no ejecuta por sí solo un despliegue
ni aprueba esos contenidos. El secreto del token solo se introduce directamente en
GitHub; no se solicita por chat.
