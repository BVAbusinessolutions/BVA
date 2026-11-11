# BVA Business Solutions · Sitio web

Página de presentación de BVA Business Solutions: páginas web, automatización e inteligencia artificial para pymes y empresarios de Costa Rica.

Hecha con React 18, Vite 7 y React Router 7, con escenas 3D (Three.js + React Three Fiber) en la portada, el proceso de trabajo y el contacto, y una vista 3D de la plataforma hecha con CSS.

## Requisitos

- Node.js 20 LTS o superior
- npm 10 o superior

## Cómo correrlo en local

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`.

## Scripts

| Comando           | Qué hace                                                  |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga automática             |
| `npm run build`   | Genera la versión de producción en `dist/`                |
| `npm run preview` | Sirve `dist/` para revisarla antes de publicar            |
| `npm run lint`    | Revisa el código con ESLint                               |
| `npm run format`  | Ordena el formato con Prettier                            |
| `npm run test`    | Corre las pruebas (validación del formulario y botón)     |

## Variables de entorno

Copia `.env.example` como `.env` y completa:

| Variable                   | Para qué                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `VITE_CONTACT_WEBHOOK_URL` | Webhook de n8n que recibe el formulario. Es pública: nunca pongas llaves secretas. Vacía = envío simulado. |
| `VITE_CONTACT_EMAIL`       | Correo que se muestra en el sitio                                                                          |
| `VITE_CONTACT_WHATSAPP`    | WhatsApp (solo dígitos, con código de país) para el enlace directo                                         |
| `VITE_SITE_URL`            | URL pública del sitio, para enlaces canónicos y Open Graph                                                 |

## Rutas

| Ruta          | Página                                                    |
| ------------- | --------------------------------------------------------- |
| `/`           | Portada con todas las secciones (`/#proceso`, `/#negocios`) |
| `/servicios`  | Detalle de cada servicio y proceso de trabajo             |
| `/plataforma` | Plataforma BVA (CRM)                                      |
| `/contacto`   | Formulario y datos directos                               |
| `/privacidad` | Política de privacidad                                    |

## Estructura

```
src/
├── app/            # App.jsx (Suspense + ErrorBoundary) y providers.jsx (Router, movimiento)
├── routing/        # AppRouter (rutas con carga diferida), paths.js, lazyWithRetry
├── pages/          # una página por ruta (HomePage, ServicesPage, …)
├── components/
│   ├── layout/     # PublicLayout, SiteHeader, NavLinks, MenuToggle, SiteFooter, PageHero, ErrorBoundary
│   ├── ui/         # Button, SectionHeading, Field, TextInput, TextArea, Checkbox, StatusMessage, PageLoader, Reveal, PlayMarker
│   ├── brand/      # Logo (SVG) y BrandLink
│   ├── three/      # LazyScene, SceneErrorBoundary y scenes/ (LogoScene, FlowScene, PlayFieldScene)
│   ├── hero/       # portada
│   ├── services/   # ServicesSection, ServiceList, ServiceItem
│   ├── process/    # ProcessSection, ProcessSteps, ProcessStep
│   ├── platform/   # PlatformSection, PlatformMock, MockWindow, MockSidebar, MockBoard, MockChip, FeatureList
│   ├── industries/ # IndustriesSection, IndustryCard
│   ├── contact/    # ContactSection, ContactForm, ContactDirect
│   └── cta/        # CtaBanner
├── hooks/          # useInView, useScrolled, useHashScroll, usePageMeta, useActiveStep, usePointerTilt, useContactForm
├── services/       # httpClient.js (fetch base) y contactService.js (webhook n8n)
├── utils/          # validateContact.js, scrollToTarget.js
├── context/        # MotionContext (preferencia "reducir movimiento")
├── lib/three/      # geometrías del logo para las escenas 3D
├── config/         # site.js (datos públicos) y navigation.js (menús)
├── content/        # es.js: todos los textos del sitio
├── styles/         # tokens.css, global.css, motion.css
└── assets/img/     # imágenes importadas desde el código (public/img para las estáticas)
```

Reglas: los componentes solo muestran; la lógica vive en `hooks/`; toda llamada de red pasa por `services/`; los textos visibles están en `content/es.js`; las URLs se escriben una sola vez en `routing/paths.js`.

## Rendimiento

- Cada página se descarga solo al visitarla (`lazyWithRetry` + `Suspense`), con reintento si falla el archivo.
- Three.js y React van en paquetes separados (`vite.config.js`); las escenas 3D se cargan solo cuando su sección se acerca a la pantalla y se pausan fuera de ella.
- Listas y piezas repetidas usan `memo`; el scroll del encabezado se lee una vez por fotograma.
- Todo el movimiento se apaga si la persona activó "reducir movimiento" en su sistema.

## Antes de publicar

- [ ] Configurar `VITE_CONTACT_EMAIL`, `VITE_CONTACT_WHATSAPP` y `VITE_SITE_URL`
- [ ] Completar y revisar con un abogado `src/content/es.js` → `privacy`
- [ ] Configurar `VITE_CONTACT_WEBHOOK_URL` y validar los datos de nuevo en n8n
- [ ] Probar en un celular de gama media
