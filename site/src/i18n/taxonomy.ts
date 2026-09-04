/**
 * Taxonomía editorial (docs/taxonomia.md). Fuente única de temas, subtemas y
 * formatos: un subtema desconocido rompe el build (gate del schema) y toda
 * etiqueta existe en las 4 lenguas antes de que exista una página.
 */
import type { Lang } from './languages';

export const TOPICS = [
  'tecnologia',
  'derechos',
  'lengua-cultura',
  'trabajo',
  'educacion',
  'seguridad',
  'gobierno-democracia',
  'salud',
  'ciencia',
  'medio-ambiente',
  'arte-creatividad',
] as const;
export type Topic = (typeof TOPICS)[number];

export const FORMATS = ['explicador', 'pregunta', 'glosario', 'ficha', 'paper'] as const;
export type Format = (typeof FORMATS)[number];

/** Rango de palabras del cuerpo por formato (manual de estilo §4, tolerancia ±10 %). */
export const FORMAT_WORDS: Record<Format, [number, number]> = {
  explicador: [600, 900],
  pregunta: [300, 500],
  glosario: [150, 300],
  ficha: [400, 600],
  paper: [500, 700],
};

/** Subtemas por tema (slug → etiqueta en español). Los conteos viven en docs/taxonomia.md. */
export const SUBTOPICS: Record<Topic, Record<string, string>> = {
  tecnologia: {
    'como-funciona-un-llm': 'Cómo funciona un modelo de lenguaje',
    'aprendizaje-automatico': 'Aprendizaje automático',
    'ia-generativa-imagen-voz-video': 'Imagen, voz y video generados',
    'chips-computo-costos': 'Chips, cómputo y costos',
    'modelos-abiertos-cerrados-regionales': 'Modelos abiertos, cerrados y regionales',
    'agentes-y-automatizacion': 'Agentes y automatización',
    'evaluacion-limites-y-mitos': 'Evaluación, límites y mitos',
  },
  derechos: {
    'privacidad-y-datos-personales': 'Privacidad y datos personales',
    'vigilancia-y-reconocimiento-facial': 'Vigilancia y reconocimiento facial',
    'discriminacion-algoritmica': 'Discriminación algorítmica',
    'pueblos-indigenas-datos-consentimiento': 'Pueblos indígenas, datos y consentimiento',
    'explicacion-impugnacion-reparacion': 'Explicación, impugnación y reparación',
    'expresion-y-moderacion-automatica': 'Expresión y moderación automática',
  },
  'lengua-cultura': {
    'por-que-tu-lengua-no-esta': 'Por qué tu lengua no está en la IA',
    'proyectos-comunitarios': 'Proyectos comunitarios',
    'traduccion-automatica-y-limites': 'Traducción automática y sus límites',
    'voz-y-radios-comunitarias': 'Voz y radios comunitarias',
    'soberania-de-datos-linguisticos': 'Soberanía de datos lingüísticos',
    'cultura-memoria-y-saberes': 'Cultura, memoria y saberes',
    'espanol-latinoamericano-en-la-ia': 'El español latinoamericano en la IA',
  },
  trabajo: {
    'que-tareas-cambian-por-oficio': 'Qué tareas cambian, oficio por oficio',
    'plataformas-y-gestion-algoritmica': 'Plataformas y gestión algorítmica',
    'trabajadores-invisibles-de-la-ia': 'Los trabajadores invisibles de la IA',
    'usar-ia-en-tu-oficio': 'Usar IA en tu oficio',
    'sindicatos-y-transicion-justa': 'Sindicatos y transición justa',
    'productividad-y-quien-captura-la-ganancia': 'Productividad y quién captura la ganancia',
  },
  educacion: {
    'aula-evaluacion-e-integridad': 'Aula, evaluación e integridad',
    'alfabetizacion-estudiantes-y-familias': 'Alfabetización para estudiantes y familias',
    'recursos-para-docentes': 'Recursos para docentes',
    'educacion-intercultural-bilingue': 'Educación intercultural bilingüe',
    'educacion-superior-e-investigacion': 'Educación superior e investigación',
    'politicas-brecha-y-equidad': 'Políticas, brecha y equidad',
  },
  seguridad: {
    'deepfakes-y-desinformacion': 'Deepfakes y desinformación',
    'estafas-con-ia': 'Estafas con IA',
    'seguridad-digital-cotidiana': 'Seguridad digital cotidiana',
    'violencia-digital-de-genero': 'Violencia digital de género',
    'ciberseguridad-e-infraestructura': 'Ciberseguridad e infraestructura',
    'seguridad-de-los-sistemas-de-ia': 'Seguridad de los sistemas de IA',
  },
  'gobierno-democracia': {
    'leyes-de-ia': 'Leyes de IA',
    'gobierno-digital-y-focalizacion': 'Gobierno digital y focalización',
    'elecciones-y-propaganda': 'Elecciones y propaganda',
    justicia: 'Justicia',
    'geopolitica-y-soberania-tecnologica': 'Geopolítica y soberanía tecnológica',
    'participacion-y-transparencia-algoritmica': 'Participación y transparencia algorítmica',
  },
  salud: {
    'diagnostico-por-imagen': 'Diagnóstico por imagen',
    'chatbots-de-salud': 'Chatbots de salud',
    'salud-mental-y-compania-artificial': 'Salud mental y compañía artificial',
    'salud-publica-y-sistemas-rurales': 'Salud pública y sistemas rurales',
    'datos-medicos-y-sesgo': 'Datos médicos y sesgo',
    'farmacos-y-biologia': 'Fármacos y biología',
  },
  ciencia: {
    'ia-como-herramienta-cientifica': 'La IA como herramienta científica',
    'historia-de-la-ia': 'Historia de la IA',
    'como-se-investiga': 'Cómo se investiga',
    'cerebro-vs-maquina': 'Cerebro y máquina',
    'ciencia-latinoamericana-con-ia': 'Ciencia latinoamericana con IA',
  },
  'medio-ambiente': {
    'agua-energia-y-centros-de-datos': 'Agua, energía y centros de datos',
    'minerales-y-basura-electronica': 'Minerales y basura electrónica',
    'clima-biodiversidad-y-territorio': 'Clima, biodiversidad y territorio',
    'agricultura-y-campo': 'Agricultura y campo',
    greenwashing: 'Promesas verdes y realidad',
  },
  'arte-creatividad': {
    'derechos-de-autor-y-entrenamiento': 'Derechos de autor y entrenamiento',
    'voz-e-imagen-de-artistas': 'Voz e imagen de artistas',
    'practica-artistica': 'Práctica artística',
    'periodismo-y-medios': 'Periodismo y medios',
    'textil-e-iconografia-indigena': 'Textil e iconografía indígena',
  },
};

export const ALL_SUBTOPIC_SLUGS: readonly string[] = Object.values(SUBTOPICS).flatMap((t) =>
  Object.keys(t),
);

export function subtopicsOf(topic: Topic): string[] {
  return Object.keys(SUBTOPICS[topic]);
}

export function topicOfSubtopic(subtopic: string): Topic | undefined {
  return TOPICS.find((t) => subtopic in SUBTOPICS[t]);
}

/** Slugs que colisionarían con rutas del sitio. */
export const RESERVED_SLUGS: readonly string[] = [
  'pagina',
  'temas',
  'glosario',
  'fichas',
  'papers',
  'preguntas',
  'buscar',
  'articulos',
  'ediciones',
  'contribuye',
  'docentes',
  'lite',
  'offline',
  'manifiesto',
  'gobernanza-de-datos',
  'politica-de-ia',
  'transparencia',
  'colabora',
  'qa-tipografia',
];

/** Etiquetas de formato por lengua (nah/yua pendientes de validación como el resto de la UI). */
export const FORMAT_LABELS: Record<Format, Record<Lang, string>> = {
  explicador: { es: 'Explicador', en: 'Explainer', nah: 'Tlamachtiliztli', yua: 'Tsolik' },
  pregunta: { es: 'Pregunta', en: 'Question', nah: 'Tlahtlaniliztli', yua: "K'áat chi'" },
  glosario: { es: 'Glosario', en: 'Glossary', nah: 'Tlahtolnechicoliztli', yua: "T'aan xookil" },
  ficha: { es: 'Ficha', en: 'Profile', nah: 'Amatlahcuilolli', yua: "Ts'íibil" },
  paper: { es: 'Estudio', en: 'Study', nah: 'Tlatemoliztli', yua: 'Xaak' },
};
