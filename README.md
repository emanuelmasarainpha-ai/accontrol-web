# ACCONTROL · sitio web

Página pública para conocer ACCONTROL e instalarla en Windows, Mac, Linux, Android o iPhone, con un blog de
finanzas y negocios y las páginas informativas y legales. HTML, CSS y JavaScript puros: no hay que instalar nada.

## Ver en tu computadora

```bash
node tools/serve.mjs
```

y abre http://localhost:5300 (imita a Vercel: `/blog`, `/blog/fondo-emergencia`, `/contacto`… sin «.html»).

## Publicar

El repositorio está conectado a Vercel: cada cambio que se sube a la rama `main` se publica solo. Antes de subir:

```bash
node tools/build-site.mjs   # vuelve a generar el blog, las páginas, sitemap.xml y robots.txt
node tools/check-site.mjs   # revisa enlaces, títulos, h1, JSON-LD, sitemap y que no haya anuncios apagados
```

Las páginas generadas (`blog/`, `sobre-nosotros.html`, `contacto.html`, `privacidad.html`, `cookies.html`,
`terminos.html`, `404.html`, `sitemap.xml`, `robots.txt`) se suben a GitHub junto con lo demás: Vercel no compila nada.

## Cómo publicar un artículo nuevo

1. Crea un archivo en `content/blog/`. El nombre del archivo es la dirección: `content/blog/mi-articulo.html` → `/blog/mi-articulo`.
2. Empieza con este encabezado (la descripción, de 120 a 160 letras):

   ```
   ---
   title: El título del artículo
   description: Una o dos frases que resumen el artículo (es lo que muestra Google).
   date: 2026-12-01
   category: finanzas-personales
   featured: false
   ---
   ```

   `category` es una de las de `site.config.mjs` (`finanzas-personales`, `emprendimiento`, `administracion-de-negocios`,
   `educacion-financiera`, `productividad`, `tecnologia-y-finanzas`). `featured: true` lo pone en «Destacados» (máximo 3).
   Opcional: `updated:` (fecha de la última revisión) e `image:`, `imageAlt:`, `imageWidth:`, `imageHeight:`, `imageCaption:`.
3. Debajo, el texto en HTML sencillo: `<p>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<strong>`, `<a href="/blog/otro">`,
   tablas dentro de `<div class="table-wrap">`. **No uses `<h1>`**: el título ya lo es. Con 4 o más `<h2>` se crea sola
   la tabla de contenido.
4. Ejecuta `node tools/build-site.mjs` y `node tools/check-site.mjs`, revisa en `node tools/serve.mjs` y sube los cambios.

El listado, las categorías, los artículos relacionados, el buscador y el sitemap se actualizan solos.

### Video del artículo

Cada artículo puede llevar un video horizontal (1920×1080) bajo el título. En el encabezado:
`video: /assets/videos/<nombre>.mp4`, `videoPoster: /assets/videos/<nombre>.jpg` (portada) y
`videoDuration: PT1M14S` (duración). Opcional: `videoCaption:` y `videoDate:`. El generador pone el reproductor
(se carga solo al darle play) y los datos de video para Google. Los videos se hacen en la carpeta
`accontrol-blog-videos` (ver su `LEEME.md`). Ahora mismo **van sin voz**; cuando estén las voces se reemplazan.

## Activar el formulario de contacto

Hoy el formulario se ve, pero **no envía** (y lo dice). Para activarlo:

1. Crea una cuenta en un servicio de formularios que acepte JSON, por ejemplo [Formspree](https://formspree.io)
   (tiene plan gratuito con un límite de mensajes al mes). Usa un correo de ACCONTROL para recibir los mensajes.
2. Crea un formulario y copia su dirección (algo como `https://formspree.io/f/abcdwxyz`).
3. Pégala en `CONTACT.endpoint` de `site.config.mjs`, genera, revisa y sube.
4. Envía un mensaje de prueba desde la página publicada y comprueba que te llegue.

La política de privacidad ya menciona «un servicio especializado en recibir formularios»; si quieres, añade su nombre.

## Google AdSense

Hoy **no hay anuncios** ni código de Google en el sitio. Todo está preparado para activarlos cuando Google te apruebe:

- `site.config.mjs` → `ADS`: `enabled`, `publisherId` (`pub-` y 16 números) y el número de cada bloque de anuncio.
- Con `enabled: false` o sin `publisherId`, las páginas no llevan nada de anuncios y **no se crea `ads.txt`**.
- Los anuncios solo van en el blog: listado (`blog-list`), a mitad de los artículos largos (`article-middle`) y al
  final de cada artículo (`article-end`). Nunca en la portada, el contacto ni las páginas legales.
- Solo se cargan después de que la persona los acepta en el aviso de cookies (`site.js`), con Google Consent Mode v2.
  Si los rechaza, el sitio no carga nada de Google.
- Al activarlos, `node tools/build-site.mjs` crea `ads.txt` con la línea
  `google.com, pub-TU-NÚMERO, DIRECT, f08c47fec0942fa0`.

**Antes de activar anuncios:** actualiza `content/paginas/privacidad.html` y `content/paginas/cookies.html` (y su fecha).
Si tendrás visitantes de Europa, el Reino Unido o Suiza, Google exige un aviso de consentimiento certificado: activa el
mensaje de «Privacidad y mensajes» de AdSense para esas regiones.

## Páginas legales

`content/paginas/privacidad.html`, `cookies.html` y `terminos.html` describen lo que el sitio y la app hacen hoy.
**Revísalas antes de publicar y cada vez que cambie algo** (activar el contacto, anuncios, analítica o cobros).
No son asesoría legal: conviene que las revise un profesional.

## Antes de lanzar

- Cambia `APP_URL` (línea 5 de `main.js`) por la dirección real de la app (hoy el botón «Abrir ACCONTROL» lleva a una dirección de ejemplo).
- Cuando cambies `styles.css` o `main.js`, sube el número `?v=` en `index.html`. Cuando cambies `site.css` o `site.js`,
  sube `assetVersion` en `site.config.mjs` y el `?v=` de esos dos archivos en `index.html`.
- Si usas un dominio propio, cámbialo en `SITE.url` (`site.config.mjs`) y en las etiquetas de `index.html` (canonical, Open Graph y JSON-LD).

## Archivos

- `index.html`, `styles.css`, `main.js`: la portada.
- `site.css`, `site.js`: blog, páginas nuevas, aviso de cookies y anuncios (también los usa la portada para el pie y el aviso).
- `site.config.mjs`: dirección del sitio, categorías, anuncios, contacto (no se publica).
- `content/blog/`, `content/paginas/`: el texto de los artículos y las páginas (no se publica).
- `tools/build-site.mjs`: genera las páginas; `tools/check-site.mjs`: las revisa; `tools/serve.mjs`: servidor local.
- `assets/`: letras (Bodoni Moda y Schibsted Grotesk, licencia OFL), logo y capturas de la app con datos DEMO.
- `vercel.json`: direcciones limpias, sin barra al final y reglas de caché.
- `PRODUCT.md`, `DESIGN.md`: producto y sistema de diseño (internos).
