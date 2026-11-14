---
name: ACCONTROL
description: Finanzas personales y de negocios en RD$, impresas como el valor de un billete dominicano.
colors:
  ink-900: "#141a2a"
  ink-800: "#1e2638"
  ink-500: "#4c5a78"
  ink-300: "#a6b0c8"
  ink-50: "#f1f3f7"
  paper: "#eef1ec"
  surface: "#ffffff"
  text: "#141b29"
  text-muted: "#525d70"
  border: "#dde2ea"
  border-soft: "#e6ebf2"
  chip-gray: "#edf0f5"
  personal: "#5b3a8c"
  personal-deep: "#34204f"
  personal-soft: "#eee8f6"
  personal-ink: "#4a2d78"
  freelancer: "#b85614"
  freelancer-deep: "#5c2a0c"
  freelancer-soft: "#fbebdd"
  freelancer-ink: "#8f410f"
  entrepreneur: "#1f7f86"
  entrepreneur-deep: "#0d3f43"
  entrepreneur-soft: "#dff0f0"
  entrepreneur-ink: "#17666c"
  company: "#b8283f"
  company-deep: "#5e1220"
  company-soft: "#f8e2e6"
  company-ink: "#96203a"
  income: "#168a55"
  income-deep: "#0e6a42"
  income-tint: "#eef9f3"
  alert: "#c73a3a"
  alert-deep: "#a32727"
  alert-tint: "#fef3f3"
  caution: "#b87800"
  caution-deep: "#8a5a00"
  caution-tint: "#fff8e6"
  site-paper: "#0e121a"
  site-paper-2: "#121722"
  site-sheet: "#161c28"
  site-sheet-2: "#1c2433"
  site-glass: "rgb(14 18 26 / 80%)"
  site-rule: "rgb(236 239 244 / 10%)"
  site-rule-2: "rgb(236 239 244 / 18%)"
  site-ink: "#eceff4"
  site-muted: "#a6b0c8"
  site-faint: "#7d88a3"
  site-personal: "#cdbbf0"
  site-personal-solid: "#5b3a8c"
  site-personal-solid-hover: "#6a47a1"
  site-freelancer: "#f3ab72"
  site-freelancer-solid: "#b85614"
  site-entrepreneur: "#79d3d9"
  site-entrepreneur-solid: "#1f7f86"
  site-company: "#f5979f"
  site-company-solid: "#b8283f"
  site-pos: "#6fd3a0"
  site-bezel: "#222a39"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 12.5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 6vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.16em"
  site-display:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7.4vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.03em"
  site-headline:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  site-statement:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 4.6vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  site-title:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  site-lead:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  site-body:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  site-nav:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  hero: "24px"
  pill: "999px"
  site-key: "6px"
  site-control: "12px"
  site-card: "16px"
  site-note: "24px"
  site-panel: "28px"
  site-phone: "38px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  tap: "44px"
  site-gutter: "clamp(20px, 5vw, 64px)"
  site-section: "clamp(100px, 16vh, 180px)"
  site-section-tight: "clamp(80px, 12vh, 140px)"
  site-max: "1180px"
  site-nav-max: "1080px"
components:
  button-primary:
    backgroundColor: "{colors.personal}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    height: "44px"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.personal-ink}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.alert}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    height: "44px"
  chip:
    backgroundColor: "{colors.chip-gray}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "16px"
  banknote:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.personal-ink}"
    rounded: "{rounded.hero}"
    padding: "24px 16px 36px"
  nav-bar:
    backgroundColor: "{colors.personal-deep}"
    textColor: "{colors.surface}"
  site-gnav:
    backgroundColor: "{colors.site-glass}"
    textColor: "{colors.site-ink}"
    typography: "{typography.site-nav}"
    height: "48px"
  site-lnav:
    backgroundColor: "{colors.site-glass}"
    textColor: "{colors.site-ink}"
    height: "52px"
  site-flyout-card:
    backgroundColor: "{colors.site-sheet}"
    textColor: "{colors.site-ink}"
    rounded: "{rounded.site-card}"
    padding: "18px"
  site-button-install:
    backgroundColor: "{colors.site-personal-solid}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
    height: "52px"
  site-button-install-hover:
    backgroundColor: "{colors.site-personal-solid-hover}"
  site-button-install-sm:
    backgroundColor: "{colors.site-personal-solid}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "5px 13px"
  site-button-ghost:
    textColor: "{colors.site-ink}"
    rounded: "{rounded.site-control}"
    padding: "0 20px"
    height: "44px"
  site-button-fill:
    backgroundColor: "{colors.site-ink}"
    textColor: "{colors.site-paper}"
    rounded: "{rounded.site-control}"
    padding: "0 20px"
    height: "44px"
  site-button-round:
    backgroundColor: "{colors.site-sheet-2}"
    textColor: "{colors.site-ink}"
    rounded: "{rounded.pill}"
    size: "44px"
  site-space-chip:
    textColor: "{colors.site-muted}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  site-space-chip-selected:
    backgroundColor: "{colors.site-personal-solid}"
    textColor: "{colors.surface}"
  site-os-tab-selected:
    backgroundColor: "{colors.site-ink}"
    textColor: "{colors.site-paper}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "40px"
  site-note:
    backgroundColor: "{colors.site-sheet}"
    textColor: "{colors.site-personal}"
    rounded: "{rounded.site-note}"
    padding: "28px 28px 40px"
  site-privacy-card:
    backgroundColor: "{colors.site-sheet}"
    textColor: "{colors.site-ink}"
    rounded: "{rounded.site-panel}"
    padding: "32px"
  site-privacy-card-open:
    backgroundColor: "{colors.site-sheet-2}"
  site-wizard:
    backgroundColor: "{colors.site-sheet}"
    textColor: "{colors.site-ink}"
    rounded: "{rounded.site-panel}"
    padding: "clamp(28px, 4vw, 48px)"
  site-compare-table:
    backgroundColor: "{colors.site-paper-2}"
    textColor: "{colors.site-ink}"
    rounded: "{rounded.site-note}"
    padding: "16px 18px"
  site-phone-frame:
    backgroundColor: "{colors.site-bezel}"
    rounded: "{rounded.site-phone}"
    padding: "9px"
---

# Design System: ACCONTROL

## Overview

**Creative North Star: "El billete dominicano"**

Cada espacio de trabajo es una denominación. Igual que un billete se reconoce por su color antes de leer la cifra, la persona sabe en qué espacio está (Personal, Freelancer, Emprendedor o Empresa) por el color de la barra, y lee su «Disponible» impreso como el valor de un billete: numerales condensados grandes, doble filete fino, una roseta de guilloché trazada con curvas matemáticas y una línea de microtexto como borde de seguridad. El número se ve emitido con cuidado; por eso se cree.

Es una herramienta de uso diario (modo Operate): densidad media, lectura rápida en un Android modesto y en computadora. La expresión vive en pocos lugares precisos (la barra, el billete de Inicio, los títulos condensados, los estados vacíos con roseta) y el resto es papel claro y hojas blancas tranquilas. Rechaza la tarjeta azul de fintech sobre fondo gris, el panel pastel con aspecto de juego y el banco genérico.

Los colores de denominación están ajustados: cada uno tiene una versión de relleno con texto blanco que pasa AA, una profunda para barras, una suave para fondos y una «tinta» para texto sobre papel.

**Key Characteristics:**
- Color por denominación, inyectado con `body[data-kind]` en cuatro variables (`--kind`, `--kind-deep`, `--kind-soft`, `--kind-ink`).
- Papel de seguridad gris verdoso frío (no crema) con hojas blancas encima.
- Barlow para el texto, Barlow Semi Condensed para cifras de valor y títulos; numerales tabulares.
- Guilloché real (hipotrocoides SVG generados en `src/ui/guilloche.js`), siempre tenue y enmascarado lejos del texto.
- Movimiento corto (120–280 ms), solo `transform` y `opacity`, sin rebote; instantáneo con «reducir movimiento».

## Colors

Papel frío, tinta de grabado azul-grafito y un solo color de denominación activo a la vez; verde, rojo y ámbar tienen significado financiero fijo.

### Primary
- **Violeta Personal** (personal / -deep / -soft / -ink): denominación por defecto. Rellena botones principales y lo seleccionado; la versión profunda pinta la barra superior (celular) y la lateral (computadora); la tinta colorea el valor del billete y la pestaña activa.
- **Naranja tostado Freelancer**, **Verde azulado Emprendedor**, **Carmín Empresa**: mismas cuatro funciones cuando ese espacio está abierto. Nunca aparecen dos denominaciones en la misma pantalla salvo en el selector de espacio.

### Secondary
- **Verde financiero** (income, income-deep, income-tint): ingresos, dinero libre, metas cumplidas.

### Tertiary
- **Rojo de alerta** (alert, alert-deep, alert-tint): solo errores, avisos de seguridad y valores negativos.
- **Ámbar de precaución** (caution…): riesgo medio y cuotas próximas, siempre con texto e ícono.

### Neutral
- **Tinta de grabado** (ink-900 … ink-50): textos fuertes, títulos, gastos en gráficos (ink-500), ahorro (ink-300). En el código se llama `--navy-*` por historia.
- **Papel de seguridad** (paper): fondo de toda la app.
- **Hoja** (surface): paneles, billete, campos.
- **Texto** y **Texto apagado**: cuerpo y explicaciones.
- **Filete** (border, border-soft): bordes de campos y de paneles.

### Modo oscuro: «el billete de noche»
El mismo mundo de noche (`:root[data-theme='dark']` en `tokens.css`): papel nocturno (#0e121a), hoja (#161c28), tinta clara (#eceff4). Las escalas se invierten (fondos -50/-100 oscuros teñidos; textos -600/-900 claros) y cada denominación tiene su tinta de noche (violeta #cdbbf0, naranja #f3ab72, verde azulado #79d3d9, carmín #f5979f) sobre su fondo suave oscuro. Los rellenos con texto blanco usan `--solid-*` y no se invierten. Contraste AA de cada pareja comprobado en `test/theme.test.js`.

### Named Rules
**La Regla de Una Denominación.** El color del espacio activo es el único acento de marca en pantalla. Cambiar de espacio cambia el color; nunca se mezclan.

**La Regla del Rojo Reservado.** El rojo significa alerta o negativo, nada más. Los gastos son tinta, no rojo, para que el rojo conserve su peso.

**La Regla del Color con Palabras.** Ningún estado se comunica solo con color: siempre hay texto o ícono al lado.

## Typography

**Display Font:** Barlow Semi Condensed (con Barlow y la del sistema)
**Body Font:** Barlow (con system-ui)

**Character:** Una grotesca de origen señalético con su variante condensada: legible y sobria en el texto, con la autoridad compacta de los numerales impresos en un billete. Guardadas en la app (`src/styles/fonts/`, licencia OFL), pesos 400/600 y 600/700.

### Hierarchy
- **Display** (700, clamp(2.75rem, 12.5vw, 4.5rem), 1): el valor del billete. Símbolo RD$ y centavos al 46–50 % del tamaño. Con cifras largas baja a clamp(2rem, 9vw, 3.5rem).
- **Headline** (700, clamp(1.75rem, 6vw, 2.125rem), 1.1): título de cada pantalla, en tinta, con `text-wrap: balance`.
- **Title** (700, 1.1875rem): títulos de panel.
- **Body** (400, 1rem, 1.5): texto general; los campos usan 16 px para evitar el zoom del teléfono.
- **Label** (700, 0.8125rem, 0.16em, MAYÚSCULAS): el nombre del valor del billete («DISPONIBLE»). Es una etiqueta de dato, no un titular decorativo.

### Named Rules
**La Regla del Numeral de Valor.** Toda cifra de dinero protagonista usa Barlow Semi Condensed con numerales tabulares; el texto corrido nunca.

## Layout

Celular primero. Un margen lateral de 16 px (24 px desde 640 px). En celular: barra superior del color profundo del espacio, contenido en una columna y barra de pestañas blanca translúcida abajo con botón flotante (+); los paneles con cifras dejan 64 px libres a la derecha hasta 899 px para que el botón no tape nada. Desde 900 px: barra lateral de 248 px en el color profundo del espacio y contenido en rejilla de 2 columnas donde haga falta. Puntos de cambio usados: 640, 720, 900, 960 y 1100 px. Ritmo de espacios en pasos de 4/8 (4, 8, 12, 16, 24, 32, 48). Todo lo tocable mide al menos 44 px.

## Elevation & Depth

Híbrido sobrio: el papel es plano y las hojas blancas se separan con un filete casi invisible y una sombra suave en dos capas. La sombra fuerte se reserva para lo que flota (diálogos, hojas, el billete).

### Shadow Vocabulary
- **Suave** (`0 1px 2px rgb(15 39 71 / 4%), 0 6px 20px rgb(15 39 71 / 6%)`): paneles y tarjetas.
- **Elevada** (`0 2px 6px rgb(15 39 71 / 8%), 0 14px 32px rgb(15 39 71 / 14%)`): el billete y elementos destacados.
- **Flotante** (`0 12px 40px rgb(15 39 71 / 22%)`): diálogos y menús.
- **Botón principal**: brillo interior de 1 px arriba más una sombra teñida del color profundo del espacio.

### Named Rules
**La Regla del Papel Plano.** El fondo nunca lleva sombra ni degradado; la profundidad la dan las hojas encima.

## Shapes

Esquinas generosas pero no infladas: 12 px en botones y campos, 20 px en paneles, 24 px en el billete, píldora en las etiquetas. El billete lleva **doble filete**: un borde exterior al 50 % del color del espacio y, 5 px adentro, un segundo filete al 26 %. La roseta de guilloché es circular, se recorta por el borde derecho del billete y se desvanece con una máscara hacia el texto. La marca es una «A» dentro de un doble filete redondeado (`icons/mark.svg`).

## Components

### Buttons
- **Shape:** esquinas suaves (12 px), alto mínimo 44 px, peso 600.
- **Primary:** relleno del color del espacio, texto blanco, brillo interior y sombra teñida.
- **Ghost:** hoja blanca con filete gris y texto en tinta del espacio.
- **Danger / Danger ghost:** rojo de alerta lleno, o blanco con texto rojo profundo.
- **Press:** se hunde con `scale` en 120 ms; el color cambia al instante. Foco visible con contorno de 2 px en tinta.

### Chips
- **Style:** píldora gris claro con texto apagado, 0.75rem, peso 600. El sello DEMO usa el mismo molde.

### Cards / Containers
- **Corner Style:** 20 px.
- **Background:** hoja blanca sobre papel.
- **Shadow Strategy:** sombra Suave (ver Elevation).
- **Border:** filete casi invisible (border-soft); en error, fondo y borde rojo tenue.
- **Internal Padding:** 16 px; 24 px desde 640 px.

### Inputs / Fields
- **Style:** hoja blanca, filete gris medio, 12 px, 16 px de letra.
- **Focus:** contorno de 2 px en tinta (ink-500).
- **Error:** borde rojo y fondo rojo tenue, con mensaje en texto.

### Navigation
- **Celular:** barra superior en color profundo del espacio con ACCONTROL y selector de espacio; pestañas abajo en hoja blanca translúcida; la activa en tinta del espacio con peso 600 y una píldora suave (`--kind-soft`, 56×28 px) detrás del ícono que aparece con `--ease-pop`.
- **Computadora:** barra lateral en color profundo del espacio, texto blanco; el enlace activo lleva un fondo blanco al 14 % y una barrita blanca de 3 px a la izquierda que crece desde el centro.
- **Botón + (celular):** círculo de 56 px que va del color del espacio a su versión profunda, con sombra teñida; se hunde al tocarlo.

### Interruptor del sol y la luna
Botón de 44 px con el sol y la luna en **PNG sin fondo** (`src/assets/sun.png`, `moon.png`): sol dorado con halo y rayos alternados; luna creciente lavanda con cráteres y dos estrellas. Al anochecer el sol gira 140°, se encoge y se hunde mientras la luna entra girando (transform, 280 ms) y cuatro chispas saltan desde el centro (doradas de día, plateadas de noche). En el menú lateral, en Ajustes (grande) y en las pantallas de acceso.

### Ojo de la contraseña
Botón de 44 px: ojo **cerrado** (párpado con pestañas) cuando la contraseña está oculta, **abierto** cuando se ve. Al cambiar, una estela del ojo con desenfoque fijo aparece y se va (efecto de desenfoque de movimiento; solo transform y opacity).

### Chele, el guía
Mascota del recorrido: robotcito de traje negro con lentes dorados y regla. Viste la **denominación del espacio**: audífonos, antena, corbata, pin y brillo de los ojos usan `--kind` / `--kind-deep` (mezclados con blanco para los tonos claros). Va al lado de su globo, nunca encima de lo resaltado; se mueve solo con transform y opacity.

### El billete (signature)
La tarjeta de «Disponible» en Inicio: hoja blanca con doble filete del color del espacio, roseta de guilloché a la derecha (opacidad 0.34, enmascarada), etiqueta DISPONIBLE, valor Display en tinta del espacio, línea explicativa, botones Registrar ingreso / Registrar gasto y una fila de microtexto de 7 px abajo. Al llegar, la roseta entra girando un poco y el valor cuenta hasta su cifra exacta (el lector de pantalla recibe la cifra final de una vez).

## Do's and Don'ts

### Do:
- **Do** colorear con `--kind`, `--kind-deep`, `--kind-soft` y `--kind-ink`, nunca con el hex de una denominación concreta.
- **Do** animar solo `transform` y `opacity`, con `--dur-press` (120 ms), `--dur-base` (200 ms) o `--dur-enter` (280 ms) y las curvas `--ease-out`, `--ease-in-out` o `--ease-pop`.
- **Do** mantener la roseta y el microtexto tenues y lejos del texto que se lee.
- **Do** marcar todo dato de demostración con el sello DEMO.
- **Do** poner los estilos en los archivos CSS (la CSP prohíbe estilos en línea) y lo dinámico por CSSOM.

### Don't:
- **Don't** usar rojo para gastos ni para decorar.
- **Don't** usar curvas con rebote ni animaciones de más de 300 ms.
- **Don't** poner degradados ni sombras en el papel de fondo.
- **Don't** añadir bordes laterales gruesos de color como acento de tarjetas.
- **Don't** cargar letras ni librerías de servicios externos.
- **Don't** escribir `#fff` como fondo de hojas o controles (usa `--surface`) ni usar una escala -600/-900 como fondo con texto blanco (usa `--solid-*`): de noche se invertiría.

## Sitio web: «el billete de noche» en grande

El sitio público (`index.html`, `styles.css`, `main.js`) es el mismo mundo del billete, contado para persuadir en vez de para operar. No es otra marca: es el modo oscuro de la app, el mismo doble filete y la misma roseta de hipotrocoides (generada en `main.js` con los mismos anillos que la app). Lo que cambia es la escala y el tiempo: la letra crece, el papel es siempre de noche y el movimiento se estira a lo largo del scroll. Sus tokens viven en el front matter con el prefijo `site-` (colores, tipografía, redondeos, espacios y componentes); las claves de la app no se tocan.

### Lo que cambia a propósito respecto a la app
- **Noche por defecto, y solo noche.** El sitio declara `color-scheme: dark` y no tiene interruptor de sol y luna. El papel nocturno es el fondo de toda la página; no hay versión clara.
- **Letra más grande.** El cuerpo sube de 16 px a 19 px (site-body, 1.0625rem por debajo de 560 px), el titular del héroe llega a 6rem y los títulos de sección a 4.75rem. La app lee cifras en un Android; el sitio se lee de lejos y de un vistazo.
- **Movimiento más largo y atado al scroll.** La app anima en 120–280 ms; el sitio arrastra escenas de dos pantallas de alto y deja transiciones de hasta 1.2 s. Es una excepción del sitio, no una licencia para la app.

### Colores del sitio
Papel nocturno, hojas un tono arriba y tinta clara; la violeta de noche es el único acento mientras no se elige otro espacio.

- **Papel nocturno** (site-paper): fondo de toda la página y de la hoja del menú de celular. **Papel nocturno 2** (site-paper-2): pie, tabla de comparación y la pantalla del equipo.
- **Hoja de noche** (site-sheet) y **Hoja alzada** (site-sheet-2): el billete, las tarjetas de privacidad, el asistente de instalación, las tarjetas del desplegable; la hoja alzada es el estado abierto o señalado.
- **Vidrio nocturno** (site-glass): la barra global y la subnavegación, siempre con desenfoque y saturación detrás.
- **Filete de noche** (site-rule, site-rule-2): tinta clara al 10 % y al 18 % para separar filas, bordes de tarjeta y botones fantasma.
- **Tinta clara** (site-ink), **Tinta apagada** (site-muted) y **Tinta tenue** (site-faint): titulares; subtítulos y explicaciones; notas finas, contadores y el pie.
- **Violeta de noche** (site-personal) con su **relleno** (site-personal-solid, y site-personal-solid-hover al pasar): la tinta es para texto, íconos, filetes y la roseta; el relleno lleva texto blanco y pinta el botón Instalar, la selección y el número de paso del asistente.
- **Naranja, verde azulado y carmín de noche** (site-freelancer, site-entrepreneur, site-company, cada uno con su `-solid`): solo existen en el bloque de espacios y en los puntos que nombran cada espacio.
- **Verde de noche** (site-pos): ingresos y la parte libre del mes dentro del billete. Nada más es verde.
- **Bisel** (site-bezel): el marco del equipo y de los teléfonos de la galería.

**La Regla del Selector de Cuatro.** La sección de espacios es la única que se tiñe con cada denominación: al elegir un espacio cambian el relleno del botón, las marcas de la lista, el filete y la roseta del billete. Fuera de ahí, las cuatro solo aparecen como puntos de 10 px que nombran el espacio (desplegable, menú de celular, tabla); el resto de la página es violeta de noche.

### Tipografía del sitio
Letra propia del sitio, distinta de la app: los titulares, las cifras de valor y los números de paso son **Bodoni Moda** (600, óptica automática, tracking negativo, `text-wrap: balance`), con el aire de un valor grabado; el cuerpo, las etiquetas y la interfaz son **Schibsted Grotesk** (400–700). Los numerales tabulares van solo en montos y tablas, porque en Schibsted el ancho fijo también separa comas y puntos. Las dos se guardan en `assets/fonts/` (licencia OFL).

**Color por tramo.** Cada tramo de la página toma una denominación como fondo y acento: Personal (violeta) en héroe, declaración, cómo funciona y galería; el selector de Espacios cambia el tramo al espacio elegido; Freelancer (naranja) en Privacidad; Emprendedor (verde azulado) en Compara; Empresa (carmín) en Instalar y Preguntas; el cierre vuelve al papel de noche. El fondo del tramo es la tinta profunda del espacio al 30 % sobre el papel, y las hojas, filetes y botones del tramo se tiñen con ella.

- **Display del sitio** (site-display): el titular del héroe y el del cierre, nada más. Máximo 12 ch en el cierre.
- **Titular de sección** (site-headline): un titular por sección, centrado, máximo 16 ch.
- **Declaración** (site-statement): la frase que se enciende palabra por palabra.
- **Título** (site-title): los párrafos de «Cómo funciona»; los pasos del asistente y las tarjetas de privacidad usan la misma voz un escalón abajo.
- **Entrada** (site-lead): el subtítulo bajo cada titular, en tinta apagada, máximo 46 ch.
- **Cuerpo** (site-body) y **Navegación** (site-nav).
- El billete conserva su jerarquía de la app: etiqueta en mayúsculas con 0.16em, valor condensado, RD$ y centavos al 48–50 %.

**La Regla del Titular Solo.** Ningún titular lleva una línea pequeña encima (sin «eyebrows» ni antetítulos). La etiqueta del billete («DISPONIBLE», «PATRIMONIO NETO») no es un antetítulo: es el nombre del dato y vive dentro del billete.

### Layout del sitio
Página de producto de una columna central: ancho máximo de 1180 px (site-max; 1080 px para las barras y el pie, site-nav-max), margen lateral fluido (site-gutter) y secciones con mucho aire vertical (site-section, o site-section-tight en galería, comparación y preguntas). Los titulares van centrados; el contenido se abre en dos columnas en «Cómo funciona», espacios y privacidad. Cambios en 1000 px (las dos columnas se apilan y el billete de la historia queda fijo arriba), 833 px (aparece el menú de celular, se esconde la subnavegación, el pie se pliega en desplegables) y 560 px (cuerpo más chico, la tabla pasa a una columna con selector). Todo lo tocable mide 44 px, salvo las pestañas de sistema y el selector de la tabla, de 40 px.

### Profundidad en el sitio
El papel nocturno es plano. Lo que flota lleva sombra **negra** en dos capas, nunca de color: el billete (`0 2px 6px rgb(0 0 0 / 28%), 0 24px 60px rgb(0 0 0 / 36%)`), el equipo (anillo de 1 px más `0 40px 100px rgb(0 0 0 / 55%)`), los teléfonos de la galería (`0 30px 70px rgb(0 0 0 / 45%)`) y el botón Instalar (brillo interior de 1 px más `0 8px 22px rgb(0 0 0 / 40%)`). Las barras usan vidrio: fondo nocturno translúcido con `blur(20px)` y `saturate(180%)`; al abrir un desplegable, el resto de la página se oscurece con una cortina desenfocada.

**La Regla de la Sombra Negra.** De noche, una sombra de color se lee como resplandor de neón. En el sitio toda sombra es negra; el color vive en filetes y tinta.

### Formas del sitio
La misma familia de esquinas que la app, con pasos más grandes para piezas más grandes: 6 px en las teclas que se citan dentro del texto (site-key), 12 px en botones fantasma (site-control), 16 px en las tarjetas del desplegable (site-card), 24 px en el billete y la tabla (site-note), 28 px en privacidad y el asistente (site-panel), 38 px en el marco de los teléfonos (site-phone) y píldora en Instalar, el selector de espacios y las pestañas de sistema. El asistente de instalación hereda el **doble filete** del billete (7 px y 13 px adentro, en violeta al 45 % y al 22 %). Los íconos son de trazo redondeado de 1.6–1.8 px, sin relleno.

### Componentes del sitio

#### Navegación
- **Barra global:** 48 px de vidrio nocturno, marca ACCONTROL a la izquierda, enlaces de 13 px al 86 % de opacidad y un Instalar pequeño a la derecha. Los desplegables ocupan **todo el ancho** bajo la barra: se abren con un recorte de arriba hacia abajo (`clip-path`, 0.42 s) y su contenido baja 8 px y aparece con un pequeño retraso. Con puntero fino se abren al pasar (140 ms de espera) y se cierran al salir (220 ms); se cierran al hacer scroll, con Escape o tocando la cortina.
- **Subnavegación fija:** 52 px, aparece deslizándose desde arriba cuando el titular del héroe se ha ido (55 % de la pantalla). Lleva el nombre en condensada y los enlaces de sección; el enlace de la sección actual va en blanco con un filete de 1 px debajo.
- **Menú de celular:** desde 833 px hacia abajo, la hamburguesa se convierte en una X y abre una hoja de papel nocturno a pantalla completa con enlaces en condensada de 28 px que entran escalonados (35 ms cada uno). Bloquea el scroll de la página mientras está abierta.

#### Botón Instalar
Píldora de relleno violeta (site-button-install) con el ícono de pantalla con flecha. Su texto lo pone el sistema detectado («Instalar en Windows», «Instalar en Android»…). Al pasar se aclara; al presionar se encoge a 0.97. Al lado, un enlace de texto en violeta de noche («Otros sistemas») con chevron. Los botones secundarios son fantasma (filete site-rule-2) o de relleno claro (site-button-fill) dentro del asistente; los de flecha de la galería son círculos de 44 px.

#### Galería
Riel horizontal con encaje por tarjeta, sin barra de scroll visible, alineado con el borde de la columna central. Cada tarjeta es una captura real de la app en un marco de teléfono de 38 px; al pasar sube 6 px. Debajo, puntos de avance (el actual se alarga a 28 px) y flechas que se apagan en los extremos; las flechas del teclado también mueven el riel.

#### Selector de espacios
Grupo de radios en píldoras con su punto de color. El elegido se rellena del `-solid` de su denominación con texto blanco. Al cambiar, la lista se desvanece y baja 6 px, se reemplaza a los 220 ms y vuelve escalonada (25 ms por fila) mientras la roseta del billete gira 24°. El billete del espacio muestra el nombre del espacio en condensada grande y su microtexto propio. Lo que aún no existe se lista aparte, en tinta apagada, bajo un desplegable «+».

#### Privacidad
Tarjetas desplegables en dos columnas (una en celular): ícono de línea de 56 px en violeta, título en condensada y un «+» que gira 45° al abrir. Abierta, la tarjeta pasa a hoja alzada y su filete se aclara.

#### Comparación
Tabla de cuatro espacios con marcas de línea (✓ en tinta clara, guion en gris) y encabezado y primera columna fijos. Por debajo de 560 px muestra **una sola columna** a la vez, elegida con un selector de píldoras encima; la píldora elegida es de tinta clara con texto nocturno.

#### Asistente de instalación
Detecta el sistema (Windows, Mac, Linux, Android, iPhone) y lo dice en una línea tenue («Detectamos Windows. ¿Usas otro? Elígelo arriba.»); unas pestañas en píldora permiten cambiarlo. Dentro de una hoja con doble filete: barra de progreso de 4 px, tres pasos con número condensado gigante en violeta, título, explicación con las teclas de la interfaz citadas como pequeñas cápsulas, y un **dibujo de línea** de lo que la persona va a ver (ventana del navegador, aviso de instalar, menú, Dock o pantalla de inicio) con trazos de tinta clara al 34 % y lo importante resaltado en violeta. Un anillo pulsa sobre el botón que hay que tocar. Los pasos se deslizan 24 px a los lados; el último botón dice «Abrir ACCONTROL».

#### Escenas con el scroll (signature)
- **El equipo que se abre:** el héroe mide 230 vh (190 vh en celular) con una escena fija. Al bajar, la tapa de la laptop pasa de 52° a plana, el equipo sube y crece (de 0.82 a 1.12; de 0.9 a 1 en pantallas angostas) y el texto del héroe se retira subiendo 60 px, encogiéndose y desenfocándose. La roseta del billete gira hasta 70° y, pasado el 18 % de la escena, el «Disponible» cuenta hasta su cifra en 1.4 s.
- **Palabras que se encienden:** una declaración en una escena fija de 210 vh; cada palabra pasa del 16 % de opacidad a plena al avanzar el scroll, y las palabras clave («DEMO», «finge») van en violeta de noche. El lector de pantalla recibe la frase entera.
- **El billete que cambia de cara:** en «Cómo funciona» el billete queda fijo mientras pasan cuatro párrafos; cada uno trae su cara (Disponible, el mes, una meta, patrimonio). La cara entra subiendo 14 px y saliendo de un desenfoque de 6 px, la roseta gira de 30° en 30° y el párrafo activo pasa del 28 % a plena opacidad.

#### Entradas al llegar
Titulares, subtítulos y bloques suben 40 px y salen de un desenfoque de 4 px en 0.9–1.1 s, escalonados 80 ms (máximo cuatro). El contenido es visible sin JavaScript; lo que ya está en pantalla al cargar no se anima.

### Movimiento del sitio
- Lo que sigue al scroll se escribe en cada cuadro solo con `transform`, `opacity` y `filter` (desenfoque); el bucle solo lee posiciones. Los desplegables usan además `clip-path`.
- Curva única de salida `cubic-bezier(0.16, 1, 0.3, 1)` para casi todo; sin rebote. Dentro de las escenas se usan sus equivalentes en código (salida cúbica y entrada-salida cúbica).
- **La Regla de la Página Quieta.** Con «reducir movimiento», todo queda estático: sin transiciones ni animaciones, las escenas de 230 vh y 210 vh se vuelven secciones normales, todas las palabras se ven encendidas, el «Disponible» muestra su cifra final, no hay entradas al llegar y el riel salta sin deslizarse.

### Do's and Don'ts del sitio

#### Do:
- **Do** decir «Instalar» en todo botón de acción: ACCONTROL es una app instalable desde el navegador, no hay `.exe` que descargar.
- **Do** poner el sello DEMO en toda cifra de demostración que se muestre, y decir en el pie que las cifras y pantallas son de demostración.
- **Do** cambiar la dirección de la app solo en la constante `APP_URL` de `main.js`; todos los enlaces `data-app-link` y el último paso del asistente la leen de ahí.
- **Do** dejar que la denominación activa venga de `--kind` / `--kind-solid` dentro del bloque de espacios, igual que en la app.
- **Do** mantener las escenas con el scroll en `transform`, `opacity` y `filter`, con la curva `0.16, 1, 0.3, 1`.

#### Don't:
- **Don't** poner antetítulos ni «eyebrows» sobre los titulares.
- **Don't** usar sombras de color ni resplandores; las sombras del sitio son negras.
- **Don't** escribir «Descargar» en un botón ni sugerir un instalador.
- **Don't** mostrar las cuatro denominaciones a todo color fuera del selector de espacios.
- **Don't** llevar la duración larga ni las escenas de scroll del sitio a la app.
