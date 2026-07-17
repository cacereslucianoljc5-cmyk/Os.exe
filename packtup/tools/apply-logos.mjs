#!/usr/bin/env node
// Reaplica los logos reales de acciones sobre el bundle compilado de PacktUp.
//
// Uso:
//   node tools/apply-logos.mjs <ruta-al-bundle.js>
//   node tools/apply-logos.mjs public/assets/index-XXXX.js
//
// Qué hace: inyecta un <image> (recortado en círculo) con el logo de cada
// ticker dentro del componente de badge del token. Si no hay logo para un
// ticker, se mantiene el badge nativo (color + texto). Idempotente: si el
// bundle ya está parcheado, no hace nada.

import fs from 'fs';

const TICKERS = ['AAPL','AMD','AMZN','COIN','GOOGL','INTC','META','MSFT','MU','NVDA','TSLA'];
const LG = '{' + TICKERS.map(t => t + ':1').join(',') + '}';

const path = process.argv[2];
if (!path) { console.error('Falta la ruta al bundle. Uso: node tools/apply-logos.mjs public/assets/index-XXXX.js'); process.exit(1); }

let s = fs.readFileSync(path, 'utf8');

if (s.includes('href:`/logos/${e}.svg`')) {
  console.log('El bundle ya está parcheado. Nada que hacer.');
  process.exit(0);
}

// --- Parche 1: bandera lg por ticker ---
const a1 = 'function by({ticker:e,size:t=56,className:n,ring:r=!0}){let i=fy(e)?.color??`#0B0B0C`,';
const b1 = `var LG=${LG};function by({ticker:e,size:t=56,className:n,ring:r=!0}){let lg=LG[e],i=fy(e)?.color??\`#0B0B0C\`,`;

// --- Parche 2: clipPath + <image> del logo tras los círculos de fondo ---
const a2 = '(0,B.jsx)(`defs`,{children:(0,B.jsxs)(`linearGradient`,{id:`g-${e}`,x1:`0`,y1:`0`,x2:`1`,y2:`1`,children:[(0,B.jsx)(`stop`,{offset:`0%`,stopColor:i,stopOpacity:`0.16`}),(0,B.jsx)(`stop`,{offset:`100%`,stopColor:i,stopOpacity:`0.04`})]})}),(0,B.jsx)(`circle`,{cx:`50`,cy:`50`,r:`48`,fill:`#FFFFFF`}),(0,B.jsx)(`circle`,{cx:`50`,cy:`50`,r:`48`,fill:`url(#g-${e})`}),';
const b2 = '(0,B.jsxs)(`defs`,{children:[(0,B.jsxs)(`linearGradient`,{id:`g-${e}`,x1:`0`,y1:`0`,x2:`1`,y2:`1`,children:[(0,B.jsx)(`stop`,{offset:`0%`,stopColor:i,stopOpacity:`0.16`}),(0,B.jsx)(`stop`,{offset:`100%`,stopColor:i,stopOpacity:`0.04`})]}),(0,B.jsx)(`clipPath`,{id:`c-${e}`,children:(0,B.jsx)(`circle`,{cx:`50`,cy:`50`,r:`48`})})]}),(0,B.jsx)(`circle`,{cx:`50`,cy:`50`,r:`48`,fill:`#FFFFFF`}),(0,B.jsx)(`circle`,{cx:`50`,cy:`50`,r:`48`,fill:`url(#g-${e})`}),lg&&(0,B.jsx)(`image`,{href:`/logos/${e}.svg`,x:`2`,y:`2`,width:`96`,height:`96`,preserveAspectRatio:`xMidYMid slice`,clipPath:`url(#c-${e})`}),';

// --- Parche 3: el texto del ticker solo cuando no hay logo ---
const a3 = ',(0,B.jsx)(`text`,{x:`50`,y:`50`,dominantBaseline:`central`,textAnchor:`middle`,fontFamily:`Geist, Inter, sans-serif`,fontWeight:`800`,letterSpacing:`-0.5`,fontSize:o,fill:i===`#111111`||i===`#111827`?`#0B0B0C`:i,children:a})]})}';
const b3 = ',!lg&&(0,B.jsx)(`text`,{x:`50`,y:`50`,dominantBaseline:`central`,textAnchor:`middle`,fontFamily:`Geist, Inter, sans-serif`,fontWeight:`800`,letterSpacing:`-0.5`,fontSize:o,fill:i===`#111111`||i===`#111827`?`#0B0B0C`:i,children:a})]})}';

for (const [name, a] of [['P1', a1], ['P2', a2], ['P3', a3]]) {
  const c = s.split(a).length - 1;
  if (c !== 1) { console.error(`Ancla ${name} encontrada ${c} veces (se esperaba 1). El bundle cambió; ajustar el script.`); process.exit(2); }
}

s = s.replace(a1, b1).replace(a2, b2).replace(a3, b3);
fs.writeFileSync(path, s);
console.log('Bundle parcheado con logos:', path);
