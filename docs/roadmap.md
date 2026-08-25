# Roadmap CIUDADAN-IA (post-MVP)

El MVP (feature 001: sitio de noticias multilingüe) está construido. Lo que sigue, en orden
aproximado de dependencia. Fuente: benchmark global (`docs/benchmark-global.md`) y decisiones
de producto registradas en `specs/001-sitio-noticias-multilingue/`.

## 1. Lanzamiento y tracción (sitio)

- [ ] Repo remoto + CI (build, `npm run verify` con pa11y y presupuesto como gates)
- [ ] Deploy en Cloudflare Pages + dominio (propuesto: `ciudadan-ia.org`) + KV binding `CONTRIB` + `BUTTONDOWN_API_KEY`
- [ ] Newsletter semanal real («todos los martes, en 5 minutos») — editar y sostener 4 semanas seguidas antes de promocionarla
- [ ] Canal de WhatsApp (ancla en español) + tramitar verificación de Meta desde el día uno
- [ ] Reemplazar la voz sintética de demostración por narraciones humanas (CTA «préstanos tu voz»)
- [ ] Analítica autoalojada (Matomo) o ninguna — decisión coherente con gobernanza

## 2. Alianzas (validadores y legitimidad)

- [ ] Contactar: Rising Voices (talleres IA Chiapas), INALI/universidades (náhuatl, maya), CENIA/Latam-GPT, Mozilla Common Voice, AmericasNLP
- [ ] Formalizar 2-3 validadores institucionales por lengua del piloto (ver docs/flujo-validacion.md)
- [ ] Validar las traducciones nah/yua existentes y la UI en lengua (`UI_VALIDATED` en site/src/i18n/ui.ts)
- [ ] Publicar directorio de validadores en /transparencia

## 3. Financiamiento (nonprofit con grants)

- [ ] Dossier de grant: misión + benchmark + sitio vivo + números de tracción
- [ ] Objetivos: UNESCO (Decenio de las Lenguas Indígenas 2022-2032, hito 2027), Mozilla Foundation, Google.org, IDRC
- [ ] Constituir la figura legal sin fines de lucro (país por definir)
- [ ] Actualizar /transparencia con cada financiamiento

## 4. Plataforma de recolección de voz (parte 2 del proyecto)

- [ ] Spec Kit: feature 002 con su propia spec (`/speckit-specify`)
- [ ] UX Common Voice (dos botones: hablar/escuchar, contribuir en <30 s) + gobernanza Te Hiku (licencia comunitaria, consentimiento en lengua)
- [ ] Integrarse con Common Voice donde la lengua ya exista (17 variantes de quechua, etc.) en vez de duplicar
- [ ] Metas públicas de horas por lengua en la portada (contadores ya existentes)
- [ ] Pipeline: voz validada → datasets gobernados → fine-tuning (Whisper/NLLB/Latam-GPT) → traductor propio publicable

## 5. Formatos y expansión

- [ ] Video corto (TikTok/Reels/Shorts) en lenguas indígenas — el hueco de video de IA para público general está vacante
- [ ] Explicadores interactivos (scrollytelling): «¿cómo aprende una IA?»
- [ ] Mapa vivo de lenguas indígenas y su estado en la IA (datos World Atlas of Languages, UNESCO)
- [ ] Audio descargable distribuido a radios comunitarias (licencia de retransmisión ya publicada)
- [ ] Expansión de lenguas: Andes (quechua, aymara) → Cono Sur (guaraní, mapudungun) → Brasil (portugués + lenguas amazónicas)
- [ ] Ediciones fundacionales traducidas a nah/yua (hoy hacen fallback a español)
