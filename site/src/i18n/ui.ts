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
    offline: { savedCopy: 'Estás viendo una copia guardada.', title: 'Sin conexión', body: 'No hay conexión ahora mismo. Los artículos que ya visitaste siguen disponibles.' },
    langSuggestion: (endonym) => `¿Prefieres leer en ${endonym}?`,
    topics: { derechos: 'Derechos', trabajo: 'Trabajo', educacion: 'Educación', 'lengua-cultura': 'Lengua y cultura', tecnologia: 'Tecnología', seguridad: 'Seguridad' },
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
    offline: { savedCopy: 'You are viewing a saved copy.', title: 'Offline', body: 'There is no connection right now. Articles you already visited remain available.' },
    langSuggestion: (endonym) => `Would you rather read in ${endonym}?`,
    topics: { derechos: 'Rights', trabajo: 'Work', educacion: 'Education', 'lengua-cultura': 'Language & culture', tecnologia: 'Technology', seguridad: 'Safety' },
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
    offline: { savedCopy: 'Tiquitta ce amatl omopix.', title: 'Ahmo onca matiloni', body: 'Axcan ahmo onca matiloni. In amatlahcuilolli otiquittac oc onca.' },
    langSuggestion: (endonym) => `¿Ticnequi titlapohuaz ica ${endonym}?`,
    topics: { derechos: 'Melahuacayotl', trabajo: 'Tequitl', educacion: 'Temachtiliztli', 'lengua-cultura': 'Tlahtolli huan tlamatiliztli', tecnologia: 'Tepoztlamatiliztli', seguridad: 'Tlapializtli' },
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
    offline: { savedCopy: "Táan a wilik jump'éel copia líik'sa'an.", title: "Mina'an internet", body: "Mina'an internet bejla'e'. Le ts'íibo'ob ts'o'ok a xokiko' láayli' yano'obe'." },
    langSuggestion: (endonym) => `¿A k'áat xook ich ${endonym}?`,
    topics: { derechos: 'Páajtalilo\'ob', trabajo: 'Meyaj', educacion: 'Ka\'ansaj', 'lengua-cultura': "T'aan yéetel miatsil", tecnologia: 'Tecnología', seguridad: 'Kanan' },
  },
};
