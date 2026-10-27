# Flujo de validación de traducciones

Cómo una traducción pasa de `traducido-ia` a `validado` (US4 de la spec; constitución I y V).
Actualizado el 27/10/2026: las traducciones pendientes solo aparecen en la revisión
privada. No se generan sus rutas en producción ni se anuncian ediciones vacías.
En el MVP la conversación con validadores ocurre por correo/WhatsApp; el sitio solo refleja
estados y créditos — todo se controla con frontmatter, sin tocar código.

## Roles

- **Equipo editorial**: escribe el original en español, genera la traducción IA, aplica las
  correcciones del validador y actualiza el frontmatter.
- **Persona validadora**: hablante con formación lingüística (alianza institucional) que
  revisa la traducción contra el original.

## Paso a paso

1. **Editorial** crea la traducción en `site/src/content/articles/{slug}/{lang}.md`:

   ```yaml
   status: traducido-ia
   translator: "IA (Claude) — ayamo oquittaqueh tlahtohqueh"   # o equivalente
   ```

   La compilación privada de revisión la muestra en vista bilingüe con el aviso de
   pendiente. La compilación de producción la excluye, también en `/lite/`.

2. **Editorial** acuerda la variedad lingüística y prepara una copia de revisión
   autorizada, con la traducción junto al original, párrafo a párrafo. Un enlace a una
   ruta del prototipo privado solo sirve si la persona tiene acceso; no hacer público
   el prototipo para resolver esa limitación. Cualquier envío o invitación requiere
   autorización del fundador; esta guía no acredita que haya ocurrido.

3. **Validadora** devuelve correcciones por el canal acordado (documento, audio de WhatsApp,
   texto corregido completo — lo que le resulte natural).

4. **Editorial** aplica las correcciones al archivo `{lang}.md` y actualiza el frontmatter:

   ```yaml
   status: validado
   translator: "Nombre de quien tradujo/corrigió"
   validator: "Nombre de la persona validadora"
   ```

   > El build FALLA si `status: validado` no lleva `translator` y `validator` con nombre —
   > es el gate mecánico del Principio I. Verificado el 2026-08-25 (T035).

5. **Publicar** (`npm run build && npm run verify` → deploy). La pieza pasa a mostrarse
   monolingüe, sin aviso, con el crédito nominal completo visible.

## Reversa

Si una validación se retira o se detecta un problema, regresar `status: traducido-ia`
(y retirar `validator`): la pieza se retira de producción en el siguiente despliegue
y permanece en la revisión privada bilingüe con aviso. Comprobar además el resultado
público; cambiar un archivo no acredita que se haya desplegado.

## Compensación y reconocimiento

Mientras no exista financiamiento: crédito público con nombre en cada pieza y en la página
de [Colabora](/colabora/). Con el primer grant: pago por pieza validada (ver
`specs/001-sitio-noticias-multilingue/spec.md` y decisiones del plan).
