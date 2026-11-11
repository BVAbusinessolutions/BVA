# BVA Business Solutions · sitio web

React 18 + Vite 7 + React Router 7 + Three.js. CSS Modules (no Tailwind). Textos en español.

## Estructura (no cambiarla sin preguntar)

- `src/app/` arranque y providers · `src/routing/` rutas, `paths.js` (única fuente de URLs), `lazyWithRetry`
- `src/pages/` una página por ruta · `src/components/<sección>/` componentes pequeños por sección
- `src/components/ui/` piezas reutilizables · `src/components/three/` escenas 3D con carga diferida
- `src/hooks/` lógica y estado · `src/services/` toda llamada de red · `src/utils/` funciones puras
- `src/content/es.js` todos los textos visibles · `src/config/` datos del sitio y menús
- `src/styles/tokens.css` colores y espaciado · `src/assets/img/` y `public/img/` imágenes
- `bva-backend/` API Node + Express + MySQL (JWT, bcrypt), con sus propias pruebas (`npm test` dentro)

## Reglas

- Componentes solo muestran; la lógica va en un hook. Menos de ~150 líneas por componente.
- Nada de `fetch` en componentes: usar `services/`.
- Nunca poner secretos en variables `VITE_*`.
- Three.js debe quedar fuera de la carga inicial: en `vite.config.js` el `vite/preload-helper` va en el chunk `react`.
- Marca: #0A0A0B, #2F5BFF, #F4F4F5; fuentes Sora (títulos) e Inter (texto).
- No leer otros proyectos de la carpeta `BACKEND` ni de `Documentos`.

## Comandos

`npm run dev` · `npm run lint` · `npm test` · `npm run build`. Verificar los tres últimos antes de dar algo por terminado.
