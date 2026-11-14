# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Por igual, dos públicos en la República Dominicana:

- **Personas** que llevan sus finanzas personales, sobre todo en el celular Android, en momentos cortos del día (después de pagar algo, revisando cómo va el mes).
- **Freelancers, emprendedores y pequeñas empresas** que llevan las cuentas del negocio, en el celular y en la computadora.

Una misma cuenta puede tener varios espacios de trabajo (Personal, Freelancer, Emprendedor, Empresa).

## Product Purpose

ACCONTROL es una app web instalable (PWA) para llevar ingresos, gastos, metas de ahorro, deudas, patrimonio y, en los negocios, clientes, inventario, facturas internas, departamentos y resultados. Éxito: que la persona sepa con claridad cuánto tiene, cuánto debe y cómo va, y que confíe en cada número.

## Positioning

Dos cosas a la vez, confirmadas por el dueño:

1. **Personal y negocio en un solo lugar, separados**: cada espacio (Personal, Freelancer, Emprendedor, Empresa) tiene sus datos aparte y sus módulos propios.
2. **Honestidad y control**: cada número es verificable; las estimaciones se dicen estimaciones; no hay «IA» simulada; los datos de demostración llevan la etiqueta DEMO y no cuentan; los datos viven en el dispositivo (la nube llega en la 0.15.0); todo en pesos dominicanos (RD$).

## Operating Context

- Uso diario breve en el celular (registrar un gasto, mirar «Disponible») y sesiones más largas en la computadora (resultados, facturas, inventario, exportar a PDF/Excel/CSV, copias de seguridad).
- Funciona sin conexión (service worker y precache). Cuentas con Supabase Auth.
- Recorrido guiado por tipo de espacio la primera vez.

## Capabilities and Constraints

- JavaScript sin framework, sin librerías externas; capas `domain/`, `data/`, `ui/`, `views/`, `app/`.
- Política de seguridad estricta en `index.html`: sin scripts ni estilos escritos en el HTML; solo archivos propios (las posiciones dinámicas se ponen con `element.style` desde el código).
- Montos en centavos enteros; moneda única RD$.
- Movimiento: solo `transform` y `opacity`, duraciones de 120 a 300 ms, y nada de movimiento con «reducir movimiento» (regla del dueño, 0.14.3).
- Contraste AA como mínimo; los montos siempre legibles; los errores y avisos de seguridad con tono serio.
- Lo que todavía no existe (sincronización en la nube, IA real, bancos, pagos, roles) no se muestra como si existiera.

## Brand Commitments

- El nombre **ACCONTROL** se conserva.
- El dueño liberó todo lo demás de la identidad visual para el rediseño: logo, colores y letra pueden cambiar.
- Voz: español claro, cercano y honesto; explica sin tecnicismos.

## Evidence on Hand

- Datos de demostración propios de la app (marcados DEMO) para personas y para una tienda.
- No hay testimonios, clientes, prensa, cifras de uso ni precios: no se deben inventar.

## Product Principles

1. La claridad del dinero manda sobre la decoración.
2. Nunca presentar como real algo simulado.
3. Lo personal y lo del negocio, siempre separados y fáciles de distinguir.
4. Rápido en el celular, completo en la computadora.

## Accessibility & Inclusion

Contraste AA, uso con teclado y lector de pantalla, respeto de «reducir movimiento», textos en español sencillo para usuarios con poca experiencia digital.
