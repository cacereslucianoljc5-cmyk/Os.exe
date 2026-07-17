# PacktUp — build deployable con logos de acciones

> **Open. Own. Invest.** — Tokenized stock packs.

Este repo contiene el **sitio ya construido** de PacktUp (`packtup.vercel.app`) con
los **logos reales de las acciones** incorporados en los badges de token.

> ⚠️ **Importante:** esto es el _output compilado_ de Vite (JS minificado en
> `public/assets/`), **no** el código fuente original en TSX. Se creó así porque
> PacktUp se despliega por CLI y el source vive en otra parte. Sirve para
> versionar y redeployar el sitio con los logos siempre presentes.

## Estructura

```
public/                 sitio estático desplegable (lo que sirve Vercel)
  index.html
  assets/               bundle JS/CSS de Vite (con el parche de logos aplicado)
  logos/                11 logos SVG de acciones (recortados en círculo por la app)
  packs/                imágenes de los packs (.webp)
  favicon.svg, icons.svg
vercel.json             ruteo SPA (fallback a index.html salvo /assets)
tools/
  apply-logos.mjs       reaplica el parche de logos sobre un bundle nuevo
  logos/                los SVG de origen (por si hay que recopiarlos a public/logos)
```

## Desplegar en Vercel

**Opción A — Git integration (recomendada):** conectá este repo al proyecto
`packtup` en Vercel. Framework preset: **Other**. Output directory: `public`.
Cada push redeploya con los logos ya incluidos.

**Opción B — CLI:**

```bash
vercel deploy public --prod
```

## Logos incluidos

NVDA · AMD · TSLA · AAPL · GOOGL · META · MSFT · AMZN · COIN · MU · INTC

Los tickers sin logo real (p. ej. SPCX, SPY, QQQ) usan el badge nativo de la app
(círculo de color + ticker), que es el comportamiento de respaldo intencional.

Los logos provienen del repo público
[`ShaadyEmad/ticker-logos`](https://github.com/ShaadyEmad/ticker-logos).

## Si Vercel genera un bundle nuevo (otro hash)

Cuando el build de Vite cambia, el archivo `public/assets/index-*.js` cambia de
nombre y hay que reaplicar el parche:

```bash
# 1) reaplicar el parche al bundle nuevo
node tools/apply-logos.mjs public/assets/index-XXXX.js

# 2) asegurarse de que los logos estén en public/logos/
cp tools/logos/*.svg public/logos/
```

El script es **idempotente** y verifica que los puntos de inserción existan antes
de tocar nada.
