/**
 * Resolves a public asset path against the application's base URL.
 * Handles local development ('/'), custom bases, and GitHub Pages ('/tiendaTactical360/').
 */
export function assetUrl(path: string): string {
  if (!path) return '';
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

