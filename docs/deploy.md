# Despliegue

El sitio se construye y verifica en GitHub Actions con cada push a `main` y cada día a las
09:05 (hora de Ciudad de México), para publicar las piezas cuya fecha ya llegó.

## Estado

| Pieza | Estado |
| --- | --- |
| Repositorio | <https://github.com/Ciudadan-ia/ciudadan-ia> (público) |
| CI: lint, build y verificación | Funcionando, sin credenciales |
| Despliegue en Cloudflare Pages | **Pendiente de dos secretos** |

## Conectar Cloudflare Pages (una sola vez)

### 1. Crear el proyecto

En <https://dash.cloudflare.com> → **Workers & Pages** → *Create* → *Pages* → *Connect to Git*
→ elegir `Ciudadan-ia/ciudadan-ia`.

Cuando pregunte por la configuración de compilación, elige **«None / no build»**: el sitio ya
viene construido y verificado desde GitHub Actions, que es donde viven los gates
constitucionales. El nombre del proyecto debe ser exactamente **`ciudadan-ia`** (es el que usa
el workflow).

### 2. Obtener las credenciales

- **`CLOUDFLARE_ACCOUNT_ID`**: aparece en la barra lateral del panel, o en la URL
  (`dash.cloudflare.com/<account-id>/...`).
- **`CLOUDFLARE_API_TOKEN`**: *My Profile* → *API Tokens* → *Create Token* → plantilla
  **«Edit Cloudflare Workers»**, o un token personalizado con el permiso
  **Account · Cloudflare Pages · Edit**. Cópialo: solo se muestra una vez.

### 3. Guardarlas en GitHub

```bash
gh secret set CLOUDFLARE_API_TOKEN  --repo Ciudadan-ia/ciudadan-ia
gh secret set CLOUDFLARE_ACCOUNT_ID --repo Ciudadan-ia/ciudadan-ia
```

(o en la web: *Settings* → *Secrets and variables* → *Actions* → *New repository secret*).

Sin estos secretos el despliegue se salta con un aviso, pero el build y la verificación siguen
corriendo: nunca se publica algo que no pasó los gates.

### 4. Variables del sitio (opcionales, para los formularios)

En el proyecto de Cloudflare Pages → *Settings* → *Variables and Secrets*:

- **`BUTTONDOWN_API_KEY`** — alta real de la newsletter. Sin ella el formulario confirma al
  visitante pero no registra a nadie.
- **KV binding `CONTRIB`** — guarda los mensajes del formulario de participación. Se crea en
  *Workers & Pages* → *KV* → *Create namespace* y se asocia al proyecto con el nombre
  `CONTRIB`.

Ambos degradan con elegancia: los formularios responden bien aunque falten, así que el sitio
puede publicarse antes de configurarlos.

## Dominio propio

`ciudadan-ia.pages.dev` funciona desde el primer despliegue. Cuando exista un dominio propio
(por ejemplo `ciudadan-ia.org`):

1. Añadirlo en el proyecto de Pages → *Custom domains*.
2. Cambiar `site:` en `site/astro.config.mjs` — de ahí salen las URLs canónicas, el `hreflang`
   entre ediciones y el mapa del sitio.

## Publicación programada

El cron diario (`5 15 * * *` UTC) reconstruye el sitio. Como el build solo publica las piezas
cuya `publishDate` ya pasó, la cola editorial se materializa sola: no hay que tocar nada para
que aparezcan las piezas del día.

Para revisar la cola completa antes de que se publique:

```bash
cd site
PUBLISH_AS_OF=2027-03-01 npm run build && npm run preview
```
