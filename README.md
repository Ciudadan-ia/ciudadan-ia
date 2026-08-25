# CIUDADAN-IA

**La inteligencia artificial explicada en tu idioma.** Proyecto sin fines de lucro con dos
partes: (1) un medio de divulgación científica sobre IA — beneficios y peligros posibles —
en español, inglés y lenguas indígenas de América Latina (piloto: náhuatl y maya yucateco);
(2) una tecnología comunitaria de recolección de voz para que la IA aprenda lenguas que aún
no están en ningún traductor, con soberanía de datos indígenas.

> Nadie en el mundo combina divulgación de IA + publicación EN lenguas indígenas +
> participación comunitaria. Esa intersección vacante es este proyecto
> (ver [benchmark global](docs/benchmark-global.md), 50+ sitios analizados).

## Estructura

```text
site/       Sitio de noticias (Astro, SSG, 4 ediciones de idioma) — ver site/README.md
docs/       Benchmark global, roadmap, flujo de validación de traducciones
specs/      Especificaciones Spec Kit (spec → plan → tasks → verification)
.specify/   Constitución del proyecto y plantillas Spec Kit
```

## Principios (constitución v1.0.0)

1. **Soberanía de datos indígenas** — el beneficio fluye de vuelta a la fuente; crédito
   nominal a autor, traductor, narrador y validador (el build falla sin él).
2. **Ninguna lengua anunciada sin contenido** — fallback: vista bilingüe en paralelo.
3. **Low-bandwidth primero** — cero SPA, ruta `/lite`, PWA offline, portada < 300 KB.
4. **WCAG 2.2 AA** como requisito de publicación.
5. **«Ni pánico ni humo»** — divulgación con evidencia, sin sensacionalismo.
6. **Audio primario** — narrado por hablantes, con transcripción y descarga para radios.
7. **Gobernanza pública** — manifiesto, «¿quién es dueño de tu voz?», política de IA y
   transparencia como páginas de primera clase.

Texto completo: [.specify/memory/constitution.md](.specify/memory/constitution.md)

## Desarrollo rápido

```bash
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build (los schemas son el gate constitucional)
npm run verify   # pa11y WCAG 2.2 AA + presupuesto de peso
```

Guía completa: [specs/001-sitio-noticias-multilingue/quickstart.md](specs/001-sitio-noticias-multilingue/quickstart.md)

## Licencias

Contenido editorial: **CC BY 4.0**. Los datos de voz y texto aportados por comunidades se
rigen por la [gobernanza de datos](site/src/content/pages/gobernanza-de-datos/es.md) — no
son CC: pertenecen a sus comunidades.
