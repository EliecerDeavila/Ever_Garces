# Ever Garces | Producción Audiovisual & Fotografía Profesional

Sitio web profesional de fotografía y producción audiovisual con enfoque cinematográfico. Construido con **Astro** (SSR) y **Tailwind CSS v4**, diseñado para ofrecer una experiencia visual premium, rápida y optimizada para SEO.

## ✨ Características

- **SSR con Astro + Node** — Renderizado del lado del servidor para mejor SEO y rendimiento
- **Tailwind CSS v4** — Estilos utilitarios modernos con diseño responsivo
- **Formulario de contacto sin SMTP** — API endpoint que registra mensajes en consola (sin credenciales de correo)
- **Botón flotante WhatsApp** — Mensaje unificado en todos los enlaces
- **Slider de testimonios** — Navegación con flechas, dots y autoplay
- **Carrusel infinito de logos** — Clientes y marcas con animación CSS infinita
- **Lightbox de galería** — Vista ampliada de imágenes con navegación
- **Scroll reveal animations** — Animaciones suaves al hacer scroll
- **Efecto shimmer** — Animación degradada en el nombre principal
- **Meta tags OG** — Optimizado para compartir en redes sociales
- **Favicon SVG** — Logo escalable como favicon
- **Sitemap** — Generación automática para motores de búsqueda
- **Responsive design** — Adaptado a móviles, tablets y escritorio

## 🛠️ Stack Tecnológico

- [Astro](https://astro.build) — Framework web (v6.x)
- [Tailwind CSS v4](https://tailwindcss.com) — Estilos utilitarios
- [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) — Adaptador SSR standalone
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — Generación de sitemap
- [lucide-astro](https://lucide.dev) — Iconos SVG

## 🚀 Empezar

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor SSR (producción local)
npm run start
```

El sitio se sirve en `http://localhost:4321` por defecto.

> **Nota**: Con `@astrojs/netlify`, el build produce una serverless function (no un servidor Node standalone).  
> Para desarrollo local usa `npm run dev`.  
> Para previsualizar el build de producción localmente, instala `netlify-cli` y ejecuta `npx netlify dev`.

## 📁 Estructura del Proyecto

```
/
├── public/
│   ├── IMG/              # Imágenes, logos, sprite SVG
│   ├── VIDEOS/           # Videos promocionales
│   ├── fonts/            # Fuentes woff2 (Playfair Display)
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/       # Componentes Astro
│   │   ├── BaseHead.astro
│   │   ├── Header.astro
│   │   ├── Welcome.astro
│   │   ├── Services.astro
│   │   ├── Portfolio.astro
│   │   ├── Testimonials.astro
│   │   ├── About.astro
│   │   ├── Contact.astro
│   │   ├── Footer.astro
│   │   ├── BackToTop.astro
│   │   └── WhatsAppButton.astro
│   ├── layout/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── api/
│   │       └── contact.ts      # API endpoint del formulario
│   ├── scripts/          # JavaScript (slider, lightbox, menú, etc.)
│   └── styles/
│       └── global.css    # Estilos globales + animaciones CSS
├── astro.config.mjs
├── netlify.toml
├── package.json
└── tsconfig.json
```

## 🌐 Despliegue

### Netlify (SSR)

1. Conecta el repositorio a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist/client`
4. Netlify ejecuta automáticamente `npm run start` para el servidor Node.js

> **Nota**: El sitio usa SSR (Server-Side Rendering), no es un sitio estático. Netlify debe ejecutar el comando `start` para servir las páginas dinámicamente.

## 📬 API

### `POST /api/contact`

Endpoint del formulario de contacto. Acepta JSON con los campos:
- `name` (requerido, mínimo 3 caracteres)
- `email` (requerido, formato email válido)
- `service` (opcional)
- `message` (requerido, mínimo 10 caracteres)

Actualmente registra los datos en la consola del servidor (sin envío de correo).

## 📄 Licencia

Todos los derechos reservados — Ever Garces
