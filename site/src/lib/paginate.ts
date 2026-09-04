/**
 * Paginación estática: página 1 en la URL base, n ≥ 2 en `{base}pagina/{n}/`.
 * El segmento literal `pagina` resuelve la precedencia de rutas de Astro y está
 * en RESERVED_SLUGS para que ningún artículo pueda colisionar con él.
 */
export interface StaticPage<T> {
  page: number;
  items: T[];
  url: string;
  prevUrl?: string;
  nextUrl?: string;
  lastPage: number;
  total: number;
}

export function paginateStatic<T>(items: T[], pageSize: number, baseUrl: string): StaticPage<T>[] {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const lastPage = Math.max(1, Math.ceil(items.length / pageSize));
  const urlFor = (n: number) => (n === 1 ? base : `${base}pagina/${n}/`);
  return Array.from({ length: lastPage }, (_, i) => {
    const page = i + 1;
    return {
      page,
      items: items.slice(i * pageSize, (i + 1) * pageSize),
      url: urlFor(page),
      prevUrl: page > 1 ? urlFor(page - 1) : undefined,
      nextUrl: page < lastPage ? urlFor(page + 1) : undefined,
      lastPage,
      total: items.length,
    };
  });
}

export const PAGE_SIZES = {
  topic: 40,
  format: 50,
  all: 50,
  lite: 200,
} as const;
