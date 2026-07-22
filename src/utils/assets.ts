// Central asset path resolver for static export & GitHub Pages
export function getAssetPath(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Next.js static export with basePath /Porfolio
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/Porfolio' : '';
  
  return `${basePath}${cleanPath}`;
}
