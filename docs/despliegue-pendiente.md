# Despliegue — estado comprobado y siguiente acción

Corte: 27/10/2026. #7 se integró en main (`f0ad594872ea61d0ac21cad9767ec6467497f392`).
La ejecución de main [40518194866](https://github.com/Ciudadan-ia/ciudadan-ia/actions/runs/40518194866)
construyó y verificó el sitio. El paso real «Desplegar» fue omitido: faltan
`CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`. Que el trabajo de evaluación termine
con éxito no significa que haya ocurrido un despliegue.

Responsable por designar: tecnológico; custodia de la cuenta y decisión de proveedor: fundador.
No se creó una cuenta, proyecto, token o suscripción ni se cambió el alojamiento.

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
