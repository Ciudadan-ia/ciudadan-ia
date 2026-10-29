import data from '../data/articulos-divulgacion.json';
import portada from '../data/portada-propuesta.json';
import additional from '../data/articulos-fuentes.json';

export const articles = data.articles;
export const checkedAt = data.checkedAt;
export const getStory = (id: string) => {
  const story = [...portada.stories, ...additional.stories].find((item) => item.id === id);
  if (!story) throw new Error(`Historia sin expediente: ${id}`);
  return story;
};
export const readingMinutes = (article: typeof articles[number]) => {
  // Estimación a 180 palabras/minuto, sin actividad, glosario ni referencias.
  const text = [article.deck, article.hook, ...article.sections.flatMap((section) => section.paragraphs)].join(' ');
  return Math.max(1, Math.ceil(text.trim().split(/\s+/u).length / 180));
};
