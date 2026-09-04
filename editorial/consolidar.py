#!/usr/bin/env python3
"""Consolida el registro editorial canónico: 1000 semillas sin duplicados.

Entrada: editorial/_lote0-raw.json (semillas del Lote 0 + duplicados detectados)
         editorial/_replacements/grupo-{a,b,c}.json (reemplazos por tema)
Salida:  editorial/registro.json
"""
import json, collections, glob, sys, os, re

BASE = os.path.dirname(os.path.abspath(__file__))
raw = json.load(open(os.path.join(BASE, '_lote0-raw.json')))
seeds = raw['seeds']
remove = set(raw['remove'])
overlaps = raw.get('overlaps', {})

kept = [s for s in seeds if s['slug'] not in remove]

# Reemplazos
repl = []
for f in sorted(glob.glob(os.path.join(BASE, '_replacements', 'grupo-*.json'))):
    data = json.load(open(f))
    for topic, items in data.items():
        for s in items:
            s['topic'] = s.get('topic') or topic
            repl.append(s)

print(f'conservadas: {len(kept)} · reemplazos: {len(repl)} · total: {len(kept)+len(repl)}')

# Slugs únicos
taken = {s['slug'] for s in kept}
for s in repl:
    if s['slug'] in taken:
        base = s['slug']
        n = 2
        while f'{base}-{n}' in taken:
            n += 1
        print(f"  colisión resuelta: {base} → {base}-{n}")
        s['slug'] = f'{base}-{n}'
    taken.add(s['slug'])

all_seeds = kept + repl

# Validación de slug
BAD = [s['slug'] for s in all_seeds if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', s['slug']) or len(s['slug']) > 60]
if BAD:
    print(f'✗ {len(BAD)} slugs inválidos: {BAD[:8]}')

# Estado inicial y campos normalizados
for s in all_seeds:
    s.setdefault('state', 'planned')
    s.setdefault('communityPriority', 3)
    s.setdefault('reviewPriority', 'normal')
    s.setdefault('latamAnchor', 'preferred')
    s.setdefault('audience', ['general'])
    s['keywords'] = [k.lower() for k in s.get('keywords', [])][:12]

fmt = collections.Counter(s['format'] for s in all_seeds)
top = collections.Counter(s['topic'] for s in all_seeds)
EXPECTED_FMT = {'explicador': 350, 'pregunta': 300, 'glosario': 150, 'ficha': 100, 'paper': 100}
EXPECTED_TOP = {'tecnologia':150,'derechos':110,'lengua-cultura':110,'trabajo':90,'educacion':90,
                'seguridad':90,'gobierno-democracia':90,'salud':80,'ciencia':70,'medio-ambiente':60,'arte-creatividad':60}

print('\nformato:', dict(fmt))
print('esperado:', EXPECTED_FMT)
ok_fmt = dict(fmt) == EXPECTED_FMT
ok_top = dict(top) == EXPECTED_TOP
print(f'cuotas por formato: {"✓" if ok_fmt else "✗"} · por tema: {"✓" if ok_top else "✗"}')
if not ok_top:
    for t, n in sorted(top.items()):
        if EXPECTED_TOP.get(t) != n:
            print(f'  {t}: {n} (esperado {EXPECTED_TOP.get(t)})')

registro = {
    'version': 1,
    'manualVersion': '1.0',
    'totalPlanned': len(all_seeds),
    'seeds': all_seeds,
    'overlaps': {k: v for k, v in overlaps.items() if k in taken},
}
json.dump(registro, open(os.path.join(BASE, 'registro.json'), 'w'), ensure_ascii=False, indent=2)
print(f'\nregistro.json escrito: {len(all_seeds)} semillas · {len(registro["overlaps"])} con hints de solapamiento')
print('comunitarias (1):', sum(1 for s in all_seeds if s['communityPriority'] == 1))
print('revisión alta:', sum(1 for s in all_seeds if s['reviewPriority'] == 'alta'))
sys.exit(0 if (ok_fmt and ok_top and not BAD) else 1)
