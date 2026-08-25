# Flujo de validación de traducciones

Cómo una traducción pasa de `traducido-ia` a `validado` (US4 de la spec; constitución I y V).
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

   Al publicar, el sitio la muestra SOLO en vista bilingüe con el aviso de pendiente.

2. **Editorial** envía a la persona validadora el enlace público
   (`/{lang}/articulos/{slug}/`): la vista bilingüe en paralelo es su herramienta de
   revisión — traducción junto al original, párrafo a párrafo.

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

Si una validación se retira o se detecta un problema, basta regresar `status: traducido-ia`
(y retirar `validator`): la pieza vuelve a vista bilingüe con aviso en el siguiente build.

## Compensación y reconocimiento

Mientras no exista financiamiento: crédito público con nombre en cada pieza y en la página
de [Colabora](/colabora/). Con el primer grant: pago por pieza validada (ver
`specs/001-sitio-noticias-multilingue/spec.md` y decisiones del plan).
