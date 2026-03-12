# Informe del Proyecto PortArts

**Fecha:** 3 de marzo de 2025  
**Versión:** 0.1.0  
**Proyecto Firebase:** portarts

---

## 1. Resumen ejecutivo

**PortArts** es un portfolio interactivo para desarrolladores, construido con Next.js 16 y Firebase. Permite mostrar proyectos con previews en vivo (móvil/tablet/desktop), integrar repositorios de GitHub, y gestionar todo el contenido desde un panel de administración protegido por autenticación.

---

## 2. Stack tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16.1.6 | Framework React con App Router, SSR, API Routes |
| **React** | 19.2.3 | UI |
| **TypeScript** | ^5 | Tipado estático |
| **Tailwind CSS** | ^4 | Estilos |
| **Firebase** | ^12.10.0 | Auth, Firestore, Storage |
| **@dnd-kit** | ^6.3.1 / ^10.0.0 | Drag & drop (ordenar listas) |
| **react-markdown** | ^10.1.0 | Renderizado de README de GitHub |
| **lucide-react** | ^0.576.0 | Iconos |

---

## 3. Arquitectura

### 3.1 Estructura del proyecto

```
src/
├── app/                    # Rutas (App Router)
│   ├── page.tsx             # Home pública
│   ├── layout.tsx           # Layout raíz, metadata dinámica
│   ├── admin/               # Panel de administración (protegido)
│   │   ├── layout.tsx       # Auth guard, login, sidebar
│   │   ├── page.tsx         # Dashboard admin
│   │   ├── projects/        # CRUD proyectos
│   │   └── settings/       # Configuración del portfolio
│   ├── project/[slug]/      # Detalle de proyecto público
│   └── api/github/          # Proxy API GitHub (repos, README)
├── components/
│   ├── home/                # Hero, ProjectGrid, TechMarquee, etc.
│   ├── project/             # DevicePreview, ReadmeViewer, Timeline, etc.
│   ├── admin/               # ProjectForm, ImageUploader, SortableList, etc.
│   ├── layout/              # Navbar, Footer, AmbientBlobs
│   └── ui/                  # Button, Input, Card, Badge, etc.
├── context/
│   └── AuthContext.tsx      # Estado de autenticación y admin
└── lib/
    ├── firebase.ts          # Inicialización Firebase
    ├── firestore.ts         # Helpers Firestore
    ├── auth.ts              # Login GitHub/Google, isAdmin
    └── types.ts             # Tipos PortfolioConfig, Project
```

### 3.2 Flujo de datos

- **Público:** Next.js Server Components leen Firestore directamente (`getPortfolioConfig`, `getPublishedProjects`, `getProjectBySlug`).
- **Admin:** Cliente autenticado con Firebase Auth (GitHub/Google). El UID debe estar en `config/portfolio.allowedAdmins`.
- **Imágenes:** Subida a Firebase Storage (`projects/{id}/...`), URLs guardadas en Firestore.
- **GitHub:** API proxy `/api/github` para listar repos y obtener README (evita CORS, permite token opcional).

---

## 4. Base de datos (Firestore)

### 4.1 Colecciones

| Colección | Documento | Descripción |
|-----------|------------|-------------|
| **config** | portfolio | Configuración global del portfolio |
| **projects** | (auto-ID) | Proyectos individuales |

### 4.2 Esquema `config/portfolio`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del autor |
| title | string | Título del sitio |
| subtitle | string | Subtítulo (Hero) |
| email | string | Email de contacto |
| githubUsername | string | Usuario GitHub para repos |
| about | string[] | Párrafos "Sobre mí" |
| stats | array | `{value, label}` para estadísticas |
| techStack | string[] | Tecnologías para marquee |
| socialLinks | map | github, linkedin, twitter, website |
| allowedAdmins | string[] | UIDs de Firebase Auth con acceso admin |
| metaDescription | string | SEO meta description |
| ogImage | string | URL imagen Open Graph |

### 4.3 Esquema `projects`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| slug | string | URL amigable (único) |
| name | string | Nombre del proyecto |
| tagline | string | Frase corta |
| description | string | Descripción breve |
| fullDescription | string | Descripción completa (Markdown) |
| featured | boolean | Destacado |
| published | boolean | Visible en público |
| order | number | Orden de visualización |
| status | map | `{text, color}` (ej. "En desarrollo") |
| tags | string[] | Etiquetas |
| theme | string | fleet, family, focus, gospel, default, custom |
| themeColor | string | Color si theme=custom |
| preview | map | url, type (phone/tablet/desktop), allowFullscreen |
| githubRepo | string | owner/repo |
| githubUrl | string | URL GitHub |
| metadata | map | Key-value libre |
| features | array | `{title, description, icon}` |
| techStack | string[] | Tecnologías del proyecto |
| timeline | array | `{date, title, description}` |
| gallery | array | `{url, caption}` |
| links | map | live, github, figma, appStore, playStore |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### 4.4 Índices compuestos

- `projects`: `published` + `order` (para listar proyectos publicados)
- `projects`: `slug` + `published` (para buscar por slug)

---

## 5. Seguridad

### 5.1 Firestore Rules

- **config:** Lectura pública; escritura solo si `uid` está en `allowedAdmins`.
- **projects:** Lectura pública solo si `published == true`; admins pueden leer todo y crear/editar/eliminar.

### 5.2 Storage Rules

- **projects/{projectId}/** : Lectura pública; escritura solo si `request.auth != null` (cualquier usuario autenticado; en producción convendría restringir a admins).

### 5.3 Autenticación

- **GitHub** y **Google** mediante Firebase Auth.
- Panel admin: `isAdmin(uid)` comprueba si el UID está en `config/portfolio.allowedAdmins`.

---

## 6. Funcionalidades implementadas

### 6.1 Público (home)

- Hero con subtítulo configurable
- Grid de proyectos publicados con cards
- Marquee de tecnologías
- Sección GitHub con repos del usuario
- Sección "Sobre mí" (párrafos + stats)
- CTA (contacto) con email y enlaces sociales

### 6.2 Detalle de proyecto

- Hero con preview (phone/tablet/desktop)
- Descripción completa con Markdown
- Metadata (key-value)
- Features con iconos
- Timeline
- Tech stack
- Galería de imágenes
- Enlaces (live, GitHub, Figma, App Store, Play Store)
- README de GitHub si hay repo vinculado

### 6.3 Panel de administración

- **Login:** GitHub y Google
- **Proyectos:** Lista, crear, editar, publicar/despublicar, eliminar, reordenar
- **Configuración:** Edición completa del portfolio con:
  - Secciones colapsables
  - Autosave con debounce 2s
  - Preview en vivo de la home
  - Drag & drop para stats y about
  - Redes sociales (GitHub, LinkedIn, Twitter, Website)
  - allowedAdmins
  - SEO (meta description, og-image)

### 6.4 Formulario de proyectos

- Secciones colapsables
- Autosave en edición
- Preview en vivo con DevicePreview
- Drag & drop para features, timeline, gallery
- Metadata key-value editable
- Temas predefinidos + custom con color picker
- Validación de slug en tiempo real
- Links App Store y Play Store
- Indicador de estado: Guardado / Guardando… / Sin guardar

---

## 7. Variables de entorno

| Variable | Descripción |
|----------|-------------|
| NEXT_PUBLIC_FIREBASE_API_KEY | API Key Firebase |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Auth domain |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Project ID |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | Storage bucket |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | Messaging sender |
| NEXT_PUBLIC_FIREBASE_APP_ID | App ID |
| NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID | Analytics (opcional) |
| GITHUB_TOKEN | Token opcional para API GitHub (más límites) |

---

## 8. Despliegue

### 8.1 Scripts

```bash
npm run dev      # Desarrollo local
npm run build    # Build producción
npm run start    # Servidor producción
npm run deploy   # Build + firebase deploy
```

### 8.2 Firebase

- **Hosting:** Configurado para Next.js (frameworksBackend)
- **Firestore:** Rules e índices en `firestore.rules` y `firestore.indexes.json`
- **Storage:** Rules en `storage.rules`

### 8.3 Configuración inicial

1. Crear proyecto en Firebase Console
2. Configurar Auth (GitHub, Google)
3. Crear documento `config/portfolio` con `allowedAdmins: ["UID"]` (UID del primer admin)
4. Rellenar resto de campos desde el panel de admin

---

## 9. Estado actual

| Área | Estado |
|------|--------|
| Home pública | ✅ Completo |
| Detalle proyecto | ✅ Completo |
| Panel admin | ✅ Completo |
| CRUD proyectos | ✅ Completo |
| Configuración portfolio | ✅ Completo |
| Autenticación | ✅ Completo |
| SEO | ✅ Metadata dinámica |
| Storage | ✅ Subida de imágenes |

---

## 10. Recomendaciones

1. **Storage:** Restringir escritura solo a admins (actualmente cualquier usuario autenticado puede subir).
2. **GitHub token:** Configurar `GITHUB_TOKEN` para evitar límites de rate en API pública.
3. **README:** Actualizar el README del repo con instrucciones específicas de PortArts.
4. **Tests:** Añadir tests unitarios/e2e para flujos críticos.
5. **Analytics:** Opcionalmente integrar Firebase Analytics o similar.

---

## 11. Repositorio

- **GitHub:** https://github.com/Victordaz07/portarts

---

*Documento generado para el Project Manager.*
