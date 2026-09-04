/**
 * Cadenas de interfaz por lengua. Principio del benchmark (Papa Reo): el idioma
 * indígena es arquitectura, no decoración — la UI misma se traduce.
 *
 * Las cadenas nah/yua de esta versión fueron redactadas con apoyo de IA y están
 * PENDIENTES DE VALIDACIÓN por hablantes (ver docs/flujo-validacion.md). El
 * marcador uiValidated controla el aviso global por edición.
 */
import type { Lang } from './languages';

export const UI_VALIDATED: Record<Lang, boolean> = {
  es: true,
  en: true,
  nah: false,
  yua: false,
};

type UIStrings = {
  siteTagline: string;
  skipToContent: string;
  readShort: string;
  readDeep: string;
  readingTime: (min: number) => string;
  languageSelector: string;
  allEditions: string;
  featuredLanguages: string;
  otherLanguages: string;
  translationNotice: string;
  bilingualHint: string;
  credits: { author: string; translator: string; narrator: string; validator: string };
  listen: string;
  transcript: string;
  download: string;
  rebroadcast: string;
  lendVoice: string;
  lendVoiceBody: string;
  contribute: string;
  contributeShort: string;
  newsletterPromise: string;
  newsletterEmail: string;
  newsletterButton: string;
  voiceOfWeek: string;
  counters: { articles: string; audios: string; people: string };
  doors: { general: string; docentes: string; comunidades: string };
  footer: { governance: string; liteVersion: string; licenses: string };
  aiAssisted: {
    label: string;
    sampled: string;
    reviewedBy: (name: string, date: string) => string;
    how: string;
    editor: string;
  };
  sourcesTitle: string;
  relatedTitle: string;
  relatedInSpanish: string;
  seriesPrev: string;
  seriesNext: string;
  seriesOf: (n: number, m: number) => string;
  correctionsTitle: string;
  pendingTranslationReview: string;
  offline: { savedCopy: string; title: string; body: string };
  langSuggestion: (endonym: string) => string;
  topics: Record<string, string>;
};

export const UI: Record<Lang, UIStrings> = {
  es: {
    siteTagline: 'La inteligencia artificial explicada en tu idioma',
    skipToContent: 'Saltar al contenido',
    readShort: 'La respuesta corta',
    readDeep: 'A fondo',
    readingTime: (min) => `${min} min de lectura`,
    languageSelector: 'Elegir lengua',
    allEditions: 'Todas las ediciones',
    featuredLanguages: 'Lenguas del piloto',
    otherLanguages: 'Otras lenguas',
    translationNotice: 'Esta traducción la hizo una IA y aún no ha sido validada por hablantes. ¿Hablas esta lengua? Ayúdanos a corregirla.',
    bilingualHint: 'Vista bilingüe: la traducción junto al original en español.',
    credits: { author: 'Escribió', translator: 'Tradujo', narrator: 'Narró', validator: 'Validó' },
    listen: 'Escuchar este artículo',
    transcript: 'Leer la transcripción',
    download: 'Descargar audio',
    rebroadcast: 'Las radios comunitarias pueden retransmitir este audio libremente.',
    lendVoice: 'Préstanos tu voz',
    lendVoiceBody: 'Este artículo aún no tiene narración. Si hablas esta lengua, tu voz puede llevarlo a quienes escuchan más de lo que leen.',
    contribute: 'Participa: graba tu voz, corrige una traducción o cuéntanos tu historia',
    contributeShort: 'Participa',
    newsletterPromise: 'La IA explicada en tu idioma. Todos los martes, en 5 minutos.',
    newsletterEmail: 'Tu correo',
    newsletterButton: 'Suscribirme',
    voiceOfWeek: 'La voz de la semana',
    counters: { articles: 'artículos', audios: 'audios', people: 'personas colaborando' },
    doors: { general: 'Quiero entender la IA', docentes: 'Enseño en un aula', comunidades: 'Hablo una lengua originaria' },
    footer: { governance: 'Nuestra gobernanza', liteVersion: 'Versión ligera', licenses: 'Contenido CC BY 4.0 · Los datos de voz pertenecen a sus comunidades' },
    aiAssisted: {
      label: 'Redacción asistida por IA',
      sampled: 'revisión humana por muestreo',
      reviewedBy: (name, date) => `revisado por ${name} el ${date}`,
      how: '¿cómo trabajamos?',
      editor: 'Responsable editorial',
    },
    sourcesTitle: 'Fuentes',
    relatedTitle: 'Siguiente pregunta',
    relatedInSpanish: 'En español',
    seriesPrev: 'Anterior',
    seriesNext: 'Siguiente',
    seriesOf: (n, m) => `${n} de ${m}`,
    correctionsTitle: 'Correcciones',
    pendingTranslationReview: 'Esta traducción la hizo una IA y está pendiente de revisión humana.',
    offline: { savedCopy: 'Estás viendo una copia guardada.', title: 'Sin conexión', body: 'No hay conexión ahora mismo. Los artículos que ya visitaste siguen disponibles.' },
    langSuggestion: (endonym) => `¿Prefieres leer en ${endonym}?`,
    topics: {
      derechos: 'Derechos',
      trabajo: 'Trabajo',
      educacion: 'Educación',
      'lengua-cultura': 'Lengua y cultura',
      tecnologia: 'Tecnología',
      seguridad: 'Seguridad',
      salud: 'Salud',
      'gobierno-democracia': 'Gobierno y democracia',
      'medio-ambiente': 'Medio ambiente',
      'arte-creatividad': 'Arte y creatividad',
      ciencia: 'Ciencia',
    },
  },
  en: {
    siteTagline: 'Artificial intelligence, explained in your language',
    skipToContent: 'Skip to content',
    readShort: 'The short answer',
    readDeep: 'In depth',
    readingTime: (min) => `${min} min read`,
    languageSelector: 'Choose language',
    allEditions: 'All editions',
    featuredLanguages: 'Pilot languages',
    otherLanguages: 'Other languages',
    translationNotice: 'This translation was produced by AI and has not yet been validated by speakers. Do you speak this language? Help us correct it.',
    bilingualHint: 'Bilingual view: the translation alongside the Spanish original.',
    credits: { author: 'Written by', translator: 'Translated by', narrator: 'Narrated by', validator: 'Validated by' },
    listen: 'Listen to this article',
    transcript: 'Read the transcript',
    download: 'Download audio',
    rebroadcast: 'Community radio stations may rebroadcast this audio freely.',
    lendVoice: 'Lend us your voice',
    lendVoiceBody: 'This article has no narration yet. If you speak this language, your voice can carry it to those who listen more than they read.',
    contribute: 'Take part: record your voice, correct a translation, or tell us your story',
    contributeShort: 'Take part',
    newsletterPromise: 'AI explained in your language. Every Tuesday, in 5 minutes.',
    newsletterEmail: 'Your email',
    newsletterButton: 'Subscribe',
    voiceOfWeek: 'Voice of the week',
    counters: { articles: 'articles', audios: 'audio pieces', people: 'people collaborating' },
    doors: { general: 'I want to understand AI', docentes: 'I teach a classroom', comunidades: 'I speak an Indigenous language' },
    footer: { governance: 'Our governance', liteVersion: 'Lite version', licenses: 'Content CC BY 4.0 · Voice data belongs to its communities' },
    aiAssisted: {
      label: 'AI-assisted writing',
      sampled: 'human review by sampling',
      reviewedBy: (name, date) => `reviewed by ${name} on ${date}`,
      how: 'how we work',
      editor: 'Editor in charge',
    },
    sourcesTitle: 'Sources',
    relatedTitle: 'Next question',
    relatedInSpanish: 'In Spanish',
    seriesPrev: 'Previous',
    seriesNext: 'Next',
    seriesOf: (n, m) => `${n} of ${m}`,
    correctionsTitle: 'Corrections',
    pendingTranslationReview: 'This translation was produced by AI and is pending human review.',
    offline: { savedCopy: 'You are viewing a saved copy.', title: 'Offline', body: 'There is no connection right now. Articles you already visited remain available.' },
    langSuggestion: (endonym) => `Would you rather read in ${endonym}?`,
    topics: {
      derechos: 'Rights',
      trabajo: 'Work',
      educacion: 'Education',
      'lengua-cultura': 'Language & culture',
      tecnologia: 'Technology',
      seguridad: 'Safety',
      salud: 'Health',
      'gobierno-democracia': 'Government & democracy',
      'medio-ambiente': 'Environment',
      'arte-creatividad': 'Art & creativity',
      ciencia: 'Science',
    },
  },
  nah: {
    siteTagline: 'In tepoztlahtolmatiliztli moixpantia ica motlahtol',
    skipToContent: 'Xipano itech tlahtolli',
    readShort: 'Achto tlananquililli',
    readDeep: 'Occachi huehca',
    readingTime: (min) => `${min} min tlapohualiztli`,
    languageSelector: 'Xitlapehpeni motlahtol',
    allEditions: 'Nochi tlahtolmeh',
    featuredLanguages: 'Achto tlahtolmeh',
    otherLanguages: 'Occequi tlahtolmeh',
    translationNotice: 'Inin tlahtolcuepaliztli oquichiuh ce IA huan ayamo oquittaqueh tlahtohqueh. ¿Titlahtoa inin tlahtolli? Xitechpalehui ma cualli yeto.',
    bilingualHint: 'Ome tlahtolli: in tlahtolcuepaliztli inahuac in caxtillantlahtolli.',
    credits: { author: 'Oquihcuiloh', translator: 'Oquitlahtolcuep', narrator: 'Oquipouh', validator: 'Oquittac' },
    listen: 'Xiccaqui inin amatlahcuilolli',
    transcript: 'Xicpohua tlen mihtoa',
    download: 'Xicana in caquiztli',
    rebroadcast: 'In radiohuan altepeco huel occeppa quitemacah inin caquiztli.',
    lendVoice: 'Xitechmaca motozqui',
    lendVoiceBody: 'Inin amatlahcuilolli ayamo quipia tozquitl. Tla titlahtoa inin tlahtolli, motozqui huel quinhuiquilia aquihqueh tlacaquih.',
    contribute: 'Ximotlali: xicihcuilo motozqui, xicyecti ce tlahtolcuepaliztli, nozo xitechtlapohui motlahtollamiz',
    contributeShort: 'Ximotlali',
    newsletterPromise: 'In IA moixpantia ica motlahtol. Mochi martes, ipan macuilli minutos.',
    newsletterEmail: 'Mocorreo',
    newsletterButton: 'Nimotlaliz',
    voiceOfWeek: 'In tozquitl inin chicueyilhuitl',
    counters: { articles: 'amatlahcuilolli', audios: 'caquiztli', people: 'tlacah tequitih' },
    doors: { general: 'Nicnequi nicmatiz tlen IA', docentes: 'Nitemachtia', comunidades: 'Nitlahtoa ce macehualtlahtolli' },
    footer: { governance: 'Totlanahuatil', liteVersion: 'Tlahtolli zan iyoh', licenses: 'Tlahtolli CC BY 4.0 · In tozquitl imaxca in altepemeh' },
    aiAssisted: {
      label: 'Tlahcuiloliztli ica IA tepalehuiliztli',
      sampled: 'tlacatl quitta cequi tlahcuilolmeh',
      reviewedBy: (name, date) => `oquittac ${name} ipan ${date}`,
      how: '¿quenin titequitih?',
      editor: 'Tlahcuilolpixqui',
    },
    sourcesTitle: 'Canin hualehua',
    relatedTitle: 'Occe tlahtlaniliztli',
    relatedInSpanish: 'Ica caxtillantlahtolli',
    seriesPrev: 'Yancuic',
    seriesNext: 'Zatepan',
    seriesOf: (n, m) => `${n} itech ${m}`,
    correctionsTitle: 'Tlayectilizmeh',
    pendingTranslationReview: 'Inin tlahtolcuepaliztli oquichiuh ce IA huan ayamo oquittac ce tlacatl.',
    offline: { savedCopy: 'Tiquitta ce amatl omopix.', title: 'Ahmo onca matiloni', body: 'Axcan ahmo onca matiloni. In amatlahcuilolli otiquittac oc onca.' },
    langSuggestion: (endonym) => `¿Ticnequi titlapohuaz ica ${endonym}?`,
    topics: {
      derechos: 'Melahuacayotl',
      trabajo: 'Tequitl',
      educacion: 'Temachtiliztli',
      'lengua-cultura': 'Tlahtolli huan tlamatiliztli',
      tecnologia: 'Tepoztlamatiliztli',
      seguridad: 'Tlapializtli',
      salud: 'Pactiliztli',
      'gobierno-democracia': 'Tlanahuatiliztli',
      'medio-ambiente': 'Tlalticpactli',
      'arte-creatividad': 'Toltecayotl',
      ciencia: 'Tlamatiliztli',
    },
  },
  yua: {
    siteTagline: "Le inteligencia artificial ku tsolik ich a t'aan",
    skipToContent: "Máan tak tu'ux yaan le ts'íibo'",
    readShort: 'Le chan núuk',
    readDeep: 'Taam xook',
    readingTime: (min) => `${min} min xook`,
    languageSelector: "Yéey a t'aan",
    allEditions: "Tuláakal t'aano'ob",
    featuredLanguages: "Yáax t'aano'ob",
    otherLanguages: "Uláak' t'aano'ob",
    translationNotice: "Le sut t'aana' beeta'ab tumen jump'éel IA, ma' xoka'ak tumen máaxo'ob t'anik le t'aano'. ¿Ka t'anik le t'aana'? Áanto'on utia'al k-utskíintik.",
    bilingualHint: "Ka'ap'éel t'aan: le sut t'aan yéetel le castellano tu tséel.",
    credits: { author: "Ts'íibta'ab tumen", translator: "Suta'ab tumen", narrator: "A'ala'ab tumen", validator: "Xoka'ab tumen" },
    listen: "U'uy le ts'íiba'",
    transcript: "Xook ba'ax ku ya'ala'al",
    download: 'Éems le juumo',
    rebroadcast: "Le radio kaajo'obo' je'el u páajtal u ka'a máansiko'ob le juuma'.",
    lendVoice: 'Majáant to\'on a juum',
    lendVoiceBody: "Le ts'íiba' mina'an u juum. Wa ka t'anik le t'aana', a juum je'el u bisik ti' máaxo'ob ku yu'ubik.",
    contribute: "Táakpajal: ts'áa a juum, utskíint jump'éel sut t'aan, wa tsikbalt a k'ajláay to'on",
    contributeShort: 'Táakpajal',
    newsletterPromise: "Le IA ku tsolik ich a t'aan. Tuláakal martes, ich 5 minutos.",
    newsletterEmail: 'A correo',
    newsletterButton: 'In ts\'áaikinba',
    voiceOfWeek: 'U juum le semanaa',
    counters: { articles: "ts'íibo'ob", audios: "juumo'ob", people: 'máako\'ob táakpajal' },
    doors: { general: "In k'áat in na'at le IA", docentes: 'Kin ka\'ansaj', comunidades: "Kin t'anik jump'éel máasewal t'aan" },
    footer: { governance: 'K-nu\'ukbesajil', liteVersion: 'Sáasil xook', licenses: "Ts'íib CC BY 4.0 · Le juumo'obo' u ti'al le kaajo'obo'" },
    aiAssisted: {
      label: "Ts'íibil yéetel u yáantaj IA",
      sampled: 'ku xoka\'al tumen máak jump\'íit ti\' jump\'íit',
      reviewedBy: (name, date) => `xoka'ab tumen ${name} ti' ${date}`,
      how: "¿bix k-meyaj?",
      editor: "Nu'ukbesaj ts'íib",
    },
    sourcesTitle: "Tu'ux ku taal",
    relatedTitle: "U láak' k'áat chi'",
    relatedInSpanish: 'Ich castellano',
    seriesPrev: "Táanil",
    seriesNext: "Ku taal",
    seriesOf: (n, m) => `${n} ti' ${m}`,
    correctionsTitle: "Utskíinsajo'ob",
    pendingTranslationReview: "Le sut t'aana' beeta'ab tumen IA yéetel ma' xoka'ak tumen máak.",
    offline: { savedCopy: "Táan a wilik jump'éel copia líik'sa'an.", title: "Mina'an internet", body: "Mina'an internet bejla'e'. Le ts'íibo'ob ts'o'ok a xokiko' láayli' yano'obe'." },
    langSuggestion: (endonym) => `¿A k'áat xook ich ${endonym}?`,
    topics: {
      derechos: "Páajtalilo'ob",
      trabajo: 'Meyaj',
      educacion: "Ka'ansaj",
      'lengua-cultura': "T'aan yéetel miatsil",
      tecnologia: 'Tecnología',
      seguridad: 'Kanan',
      salud: "Toj óolal",
      'gobierno-democracia': "Jala'achil",
      'medio-ambiente': "Yóok'ol kaab",
      'arte-creatividad': 'Utsul meyaj',
      ciencia: "Na'atil",
    },
  },
};
