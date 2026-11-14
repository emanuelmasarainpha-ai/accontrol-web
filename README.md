# ACCONTROL · sitio web

Página pública para conocer ACCONTROL e instalarla en Windows, Mac, Linux, Android o iPhone.
HTML, CSS y JavaScript puros: no hay que compilar nada.

## Ver en tu computadora

```bash
node tools/serve.mjs
```

y abre http://localhost:5300

## Publicar

El repositorio está conectado a Vercel: cada cambio que se sube a la rama `main` se publica solo.

## Antes de lanzar

- Cambia `APP_URL` (línea 5 de `main.js`) por la dirección real de la app.
- Cuando cambies `styles.css` o `main.js`, sube el número `?v=` en `index.html` para que los navegadores no muestren la versión vieja.

## Archivos

- `index.html`, `styles.css`, `main.js`: la página.
- `assets/`: letras (Bodoni Moda y Schibsted Grotesk, licencia OFL), logo y capturas de la app con datos DEMO.
- `vercel.json`: reglas de caché para Vercel.
- `PRODUCT.md`, `DESIGN.md`: producto y sistema de diseño (internos).
- `tools/serve.mjs`: servidor local para probar.
