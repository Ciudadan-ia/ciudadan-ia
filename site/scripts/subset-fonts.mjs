#!/usr/bin/env node
/**
 * Documentación del pipeline de subseteo de fuentes (constitución III y
 * research.md D5). Las woff2 de public/fonts/ ya están generadas; este script
 * imprime los pasos para regenerarlas si cambian los rangos o las fuentes.
 *
 * Requisitos: uv (o python3 + fonttools + brotli).
 *
 * Rangos incluidos (QA: saltillo U+A78B/C, glotal U+0294, apóstrofo U+02BC,
 * macrones nahuas U+0100-017F, diacríticos combinantes U+0300-036F):
 */
export const UNICODES =
  'U+0000-00FF,U+0100-017F,U+0294,U+02BC,U+02C8,U+0300-036F,U+2010-2027,U+2039-203A,U+20AC,U+2212,U+A78B-A78C';

const steps = `
1. Descargar originales (OFL):
   Gentium Plus Regular/Bold/Italic:
     https://github.com/google/fonts/raw/main/ofl/gentiumplus/GentiumPlus-{Regular,Bold,Italic}.ttf
   Noto Sans (variable):
     https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans[wdth,wght].ttf

2. Instanciar pesos de Noto (400/500/700) con fontTools.varLib.instancer:
   uv run --with fonttools --with brotli python3 -c "
     from fontTools.ttLib import TTFont
     from fontTools.varLib.instancer import instantiateVariableFont
     for w in (400,500,700):
         f = TTFont('NotoSans-VF.ttf')
         instantiateVariableFont(f, {'wght': w, 'wdth': 100}, inplace=True)
         f.save(f'NotoSans-{w}.ttf')"

3. Subsetear cada TTF a woff2:
   uv run --with fonttools --with brotli pyftsubset FUENTE.ttf \\
     --unicodes='${UNICODES}' \\
     --layout-features=kern,liga,ccmp,mark,mkmk \\
     --flavor=woff2 --output-file=public/fonts/DESTINO.woff2

4. Verificar cobertura (debe dar todo True):
   getBestCmap() debe contener 0xA78B, 0xA78C, 0x0294, 0x02BC, 0x0100, 0x0303.

Salidas esperadas en public/fonts/: gentium-plus-400.woff2, gentium-plus-700.woff2,
gentium-plus-400-italic.woff2, noto-sans-400.woff2, noto-sans-500.woff2, noto-sans-700.woff2
(~19-36 KB cada una).
`;

console.log(steps);
