// ACCONTROL · configuración del sitio (blog, páginas legales, anuncios y contacto).
// Cambia lo que necesites aquí y después ejecuta:  node tools/build-site.mjs
// (genera el blog, las páginas, sitemap.xml, robots.txt y, solo si lo configuras, ads.txt).

export const SITE = {
  // Dirección pública del sitio, SIN barra al final. Si un día usas un dominio propio, cámbiala aquí y vuelve a generar.
  url: 'https://accontrol-web.vercel.app',
  name: 'ACCONTROL',
  lang: 'es-DO',
  locale: 'es_DO',
  // Imagen para compartir en redes (la que ya existe en el sitio).
  shareImage: '/assets/icon-512.png',
  logo: '/assets/icon-512.png',
  // Versión de los estilos y el código de las páginas nuevas (súbela cuando cambies site.css o site.js).
  assetVersion: '20261122c',
};

// Categorías del blog: el orden es el de los filtros. «tone» es el color de la marca que usa cada una.
export const CATEGORIES = [
  { slug: 'finanzas-personales', name: 'Finanzas personales', tone: 'personal', description: 'Organizar tu dinero, ahorrar y salir de deudas, paso a paso.' },
  { slug: 'emprendimiento', name: 'Emprendimiento', tone: 'freelancer', description: 'Las cuentas de un negocio que empieza: qué medir y qué evitar.' },
  { slug: 'administracion-de-negocios', name: 'Administración de negocios', tone: 'entrepreneur', description: 'Llevar las cuentas de un colmado, una tienda o una pequeña empresa.' },
  { slug: 'educacion-financiera', name: 'Educación financiera', tone: 'company', description: 'Los conceptos básicos del dinero, explicados con ejemplos.' },
  { slug: 'productividad', name: 'Productividad', tone: 'personal', description: 'Hábitos y rutinas para dedicarle menos tiempo a las cuentas.' },
  { slug: 'tecnologia-y-finanzas', name: 'Tecnología y finanzas', tone: 'entrepreneur', description: 'Herramientas digitales para llevar mejor el dinero.' },
];

// Artículos por página en el listado del blog.
export const PAGE_SIZE = 9;

// ─── Anuncios (Google AdSense) ───────────────────────────────────────────────
// APAGADO. No pongas nada aquí hasta que Google APRUEBE tu cuenta.
//   publisherId: el que te da AdSense, con la forma «pub-0000000000000000» (sin «ca-»).
//   slots:       el número de cada bloque de anuncio que crees en AdSense (Anuncios → Por bloque de anuncios).
// Con enabled en false (o sin publisherId), las páginas NO llevan ningún código de anuncios y NO se crea ads.txt.
// Los anuncios solo van en el blog (nunca en la portada, el contacto ni las páginas legales) y solo se cargan
// después de que la persona los acepte en el aviso de cookies.
export const ADS = {
  enabled: false,
  publisherId: '',
  slots: {
    'blog-list': '',
    'article-middle': '',
    'article-end': '',
  },
};

// ─── Contacto ────────────────────────────────────────────────────────────────
// Dirección (URL) del servicio que recibe los mensajes del formulario. Vacío = el formulario se ve, pero dice con
// claridad que todavía no envía. Sirve cualquier servicio que acepte JSON por POST (por ejemplo Formspree:
// https://formspree.io/f/XXXXXXX). Ver README.md → «Activar el formulario de contacto».
export const CONTACT = {
  endpoint: '',
};

// ─── Analítica ───────────────────────────────────────────────────────────────
// El sitio NO usa analítica. Si un día la añades, debe pasar por el aviso de cookies (categoría «analytics»).
export const ANALYTICS = { enabled: false };
