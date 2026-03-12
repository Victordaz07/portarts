# 🚀 PORTAFOLIO INTERACTIVO — PRD TÉCNICO PARA CURSOR

> **IMPORTANTE PARA CURSOR:** Este documento es la fuente de verdad del proyecto. Sigue cada instrucción al pie de la letra. No improvises ni agregues features no especificadas. Si algo no está claro, pregunta antes de implementar.

---

## 1. VISIÓN DEL PRODUCTO

Portafolio personal interactivo donde los visitantes pueden **ver y usar apps en vivo** dentro de mockups de dispositivo (phone, tablet, desktop). El dueño del portafolio (Victor) gestiona todo desde un panel admin sin tocar código.

**Referencia visual:** El demo HTML adjunto (`portfolio-v3-interactive.html`) define la estética exacta. Replicar ese look & feel en Next.js.

---

## 2. STACK TECNOLÓGICO

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 3.x |
| Auth | Firebase Auth (GitHub Provider) | 10.x |
| Database | Cloud Firestore | 10.x |
| Storage | Firebase Storage | 10.x |
| Hosting | Firebase Hosting | via firebase-tools |
| State | React Context + hooks | — |
| Markdown | react-markdown + remark-gfm | latest |
| Icons | Lucide React | latest |

### Inicialización del Proyecto

```bash
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app --src-dir
cd portfolio
npm install firebase react-markdown remark-gfm lucide-react
npm install -D @types/node
```

---

## 3. ESTRUCTURA DE ARCHIVOS

```
src/
├── app/
│   ├── layout.tsx              # Root layout con providers
│   ├── page.tsx                # Landing/Home pública
│   ├── project/
│   │   └── [slug]/
│   │       └── page.tsx        # Detalle de proyecto con preview
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout con auth guard
│   │   ├── page.tsx            # Dashboard admin
│   │   ├── projects/
│   │   │   ├── page.tsx        # Lista de proyectos (CRUD)
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # Crear proyecto
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx # Editar proyecto
│   │   └── settings/
│   │       └── page.tsx        # Config general del portafolio
│   └── api/
│       └── github/
│           └── route.ts        # Proxy para GitHub API (evitar rate limits)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── TechMarquee.tsx
│   │   ├── GitHubRepos.tsx
│   │   ├── AboutSection.tsx
│   │   └── CTASection.tsx
│   ├── project/
│   │   ├── DevicePreview.tsx       # 🔥 Core: iframe con mockup de dispositivo
│   │   ├── DeviceFrame.tsx         # Frames: phone, tablet, desktop
│   │   ├── DeviceSwitcher.tsx      # Botones para cambiar dispositivo
│   │   ├── ProjectHero.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── TechBadges.tsx
│   │   ├── Timeline.tsx
│   │   ├── ReadmeViewer.tsx        # Renderiza README de GitHub
│   │   └── ProjectLinks.tsx
│   ├── admin/
│   │   ├── ProjectForm.tsx         # Formulario crear/editar proyecto
│   │   ├── ImageUploader.tsx       # Upload a Firebase Storage
│   │   ├── FeatureEditor.tsx       # Editar features dinámicamente
│   │   ├── TimelineEditor.tsx      # Editar timeline dinámicamente
│   │   └── SettingsForm.tsx        # Config general
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Select.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── Toast.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── firebase.ts                 # Firebase config + init
│   ├── firestore.ts                # CRUD helpers para Firestore
│   ├── auth.ts                     # Auth helpers
│   ├── github.ts                   # GitHub API helpers
│   ├── types.ts                    # TypeScript interfaces
│   └── utils.ts                    # Utilidades generales
├── context/
│   ├── AuthContext.tsx              # Auth provider
│   └── PortfolioContext.tsx         # Config del portafolio
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── useGitHub.ts
│   └── usePortfolioConfig.ts
└── styles/
    └── globals.css                  # Tailwind + custom CSS variables
```

---

## 4. MODELOS DE DATOS (FIRESTORE)

### Colección: `config` (documento único: `portfolio`)

```typescript
interface PortfolioConfig {
  name: string;                  // "Victor"
  title: string;                 // "Full-Stack Developer"
  subtitle: string;              // Texto del hero
  email: string;
  githubUsername: "Victordaz07";         // Para cargar repos automáticos
  about: string[];               // Párrafos de la sección about
  stats: Array<{
    value: string;
    label: string;
  }>;
  techStack: string[];            // Para el marquee
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  allowedAdmins: string[];        // UIDs de Firebase Auth permitidos
}
```

### Colección: `projects`

```typescript
interface Project {
  id: string;                     // Auto-generated por Firestore
  slug: string;                   // URL-friendly: "dspxteams"
  name: string;                   // "DspXteams"
  tagline: string;                // "Fleet Management Platform"
  description: string;            // Descripción corta (card)
  fullDescription: string;        // Descripción larga (detail)
  featured: boolean;              // true = card grande en grid
  order: number;                  // Orden de display
  status: {
    text: string;                 // "83% completado"
    color: 'green' | 'yellow' | 'blue' | 'red';
  };
  tags: string[];                 // ["Next.js", "Supabase"]
  theme: 'fleet' | 'family' | 'focus' | 'gospel' | 'default' | 'custom';
  themeColor?: string;            // Color hex para tema custom

  // 🔥 PREVIEW CONFIG
  preview: {
    url: string;                  // URL de la app desplegada
    type: 'phone' | 'tablet' | 'desktop';
    allowFullscreen: boolean;
  };

  // GITHUB
  githubRepo: string;             // "usuario/repo" — carga README
  githubUrl: string;              // Link completo al repo

  // METADATA
  metadata: Record<string, string>;  // Key-value libre: {"Stack": "Next.js"}

  // FEATURES
  features: Array<{
    title: string;
    description: string;
    icon?: string;                // Nombre de icono Lucide
  }>;

  // TECH STACK
  techStack: string[];

  // TIMELINE
  timeline: Array<{
    date: string;
    title: string;
    description: string;
  }>;

  // GALLERY (screenshots)
  gallery: Array<{
    url: string;                  // URL de Firebase Storage
    caption: string;
  }>;

  // LINKS
  links: {
    live?: string;
    github?: string;
    figma?: string;
    appStore?: string;
    playStore?: string;
  };

  // SYSTEM
  createdAt: Timestamp;
  updatedAt: Timestamp;
  published: boolean;             // false = no visible en público
}
```

---

## 5. FIREBASE CONFIG

### `firebase.ts`

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### `.env.local` (NO commitear)

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyACDzhUDmTgqt7-Rax_sSvJ-FnB--y4dq0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=portarts.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=portarts
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=portarts.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=577817045908
NEXT_PUBLIC_FIREBASE_APP_ID=1:577817045908:web:9185df2480ce633c283d81
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BGLBCSHRLH
```

### Firestore Security Rules (`firestore.rules`)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Config: público leer, solo admin escribe
    match /config/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Projects: público lee solo published, admin CRUD completo
    match /projects/{projectId} {
      allow read: if resource.data.published == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null &&
        request.auth.uid in get(/databases/$(database)/documents/config/portfolio).data.allowedAdmins;
    }
  }
}
```

### Firebase Storage Rules (`storage.rules`)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Gallery images: público leer, admin subir
    match /projects/{projectId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 6. COMPONENTES CLAVE — ESPECIFICACIONES

### 6.1 DevicePreview.tsx (⭐ COMPONENTE PRINCIPAL)

Este es el corazón del producto. Renderiza un iframe dentro de un mockup de dispositivo realista.

```typescript
interface DevicePreviewProps {
  url: string;
  type: 'phone' | 'tablet' | 'desktop';
  allowFullscreen?: boolean;
}
```

**Comportamiento:**
- Renderiza el iframe con `sandbox="allow-scripts allow-same-origin allow-forms allow-popups"`
- Muestra un placeholder elegante si no hay URL
- Botones para cambiar entre phone/tablet/desktop en tiempo real
- Input editable para cambiar la URL del preview en vivo
- Botón para abrir en nueva pestaña
- Botón de fullscreen que expande el preview a pantalla completa
- Loading spinner mientras carga el iframe
- Manejo de error si el sitio bloquea iframes (X-Frame-Options)

**Diseño de los frames:**

PHONE (320×640):
- Border radius: 40px
- Notch centrado arriba (120×28px, radius en bottom)
- Cámara en el notch (punto de 8px)
- Home bar inferior (100×4px, centrado)
- Border: 3px solid #2a2a30
- Shadow: 0 20px 60px rgba(0,0,0,0.5)

TABLET (600×450):
- Border radius: 20px
- Cámara centrada arriba (punto de 6px)
- Border: 3px solid #2a2a30

DESKTOP (max-width 900px):
- Border radius: 12px
- Topbar de 32px con semáforo (rojo, amarillo, verde)
- URL bar dentro del topbar
- iframe height: 520px

**Stage (contenedor):**
- Background: var(--bg1) con borde sutil
- Border radius grande
- Gradiente radial sutil de acento arriba
- Padding generoso para que el dispositivo "flote"

### 6.2 ReadmeViewer.tsx

Carga y renderiza el README de un repo de GitHub.

```typescript
interface ReadmeViewerProps {
  repo: string;  // "usuario/repo"
}
```

**Comportamiento:**
- Fetch a `/api/github?repo={repo}&file=readme` (proxy interno)
- El API route hace fetch a `https://api.github.com/repos/{repo}/readme` con header `Accept: application/vnd.github.v3.html`
- Renderiza el HTML con estilos que matcheen el tema del portafolio
- Arregla imágenes relativas: prepend `https://raw.githubusercontent.com/{repo}/main/`
- Loading skeleton mientras carga
- Mensaje elegante si no existe README

### 6.3 ProjectForm.tsx (Admin)

Formulario completo para crear/editar proyectos.

**Campos del formulario (en orden):**
1. Nombre + Slug (auto-genera slug del nombre)
2. Tagline
3. Descripción corta
4. Descripción completa (textarea grande)
5. Featured (toggle)
6. Published (toggle)
7. Status (text + color select)
8. Tags (input con chips, agregar/eliminar)
9. Theme (select con preview visual del color)
10. **Preview URL** (input + select tipo dispositivo)
11. **GitHub Repo** (input "usuario/repo")
12. Metadata (key-value dinámico, agregar/eliminar pares)
13. Features (array dinámico, cada uno: título + descripción, agregar/eliminar)
14. Tech Stack (input con chips)
15. Timeline (array dinámico: fecha + título + descripción, agregar/eliminar)
16. Gallery (upload múltiple de imágenes a Firebase Storage)
17. Links (live, github, figma, appStore, playStore)

**UX del formulario:**
- Autosave visual (indicador "Guardado" / "Sin guardar")
- Validación en tiempo real del slug (debe ser único)
- Preview en vivo del device frame al cambiar la Preview URL
- Drag & drop para reordenar features, timeline y gallery
- Cada sección colapsable para no abrumar

### 6.4 GitHubRepos.tsx (Home)

Muestra repos públicos del usuario configurado.

**Comportamiento:**
- Fetch a GitHub API via proxy: `/api/github?user={username}&type=repos`
- Muestra máximo 6 repos ordenados por `updated_at`
- Cada card muestra: nombre, descripción, lenguaje (con color dot), estrellas, forks
- Click abre el repo en nueva pestaña
- Loading skeleton
- Manejo de error elegante

### 6.5 GitHub API Proxy (`/api/github/route.ts`)

```typescript
// Proxy para evitar rate limits de GitHub API
// Soporta:
// - GET /api/github?user=xxx&type=repos  → lista repos
// - GET /api/github?repo=xxx/yyy&file=readme → README en HTML
```

**IMPORTANTE:** No guardar tokens de GitHub en el cliente. Si se necesita auth para rate limits más altos, usar una variable de entorno server-side `GITHUB_TOKEN` (opcional, funciona sin token para repos públicos pero con rate limit de 60 req/hr).

---

## 7. DISEÑO Y ESTÉTICA

### Tokens de Diseño (replicar del HTML demo)

```css
:root {
  --bg: #060608;
  --bg-raised: #0c0c10;
  --bg-card: #121216;
  --bg-hover: #1a1a20;
  --surface: rgba(255, 255, 255, 0.025);
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
  --text-primary: #efeae0;
  --text-secondary: #908a7e;
  --text-muted: #56524a;
  --accent: #e8c547;
  --accent-dim: rgba(232, 197, 71, 0.1);
  --cyan: #47c5e8;
  --green: #4ade80;
  --rose: #f471b5;
  --purple: #a78bfa;
}
```

### Fuentes

```
Instrument Serif — títulos y headings (font-display)
Outfit — body text (font-body)
JetBrains Mono — código, tags, metadata (font-mono)
```

Cargar desde Google Fonts en el layout.

### Tailwind Config

Extender `tailwind.config.ts` con los colores, fuentes y animaciones custom del demo.

### Efectos Obligatorios

1. **Noise overlay** — SVG texture con opacidad baja, fixed, pointer-events none
2. **Ambient blobs** — 2-3 gradientes radiales animados, fixed, blur(140px)
3. **Scroll reveal** — IntersectionObserver, fadeUp con stagger
4. **Nav compact on scroll** — Reduce padding, aumenta background opacity
5. **Card hover** — translateY(-3px) + border highlight + shadow
6. **Project arrow rotation** — Rotate -45deg on card hover
7. **Tech marquee** — CSS infinite scroll horizontal
8. **Smooth page transitions** — Opacity fade entre home y detail

---

## 8. AUTENTICACIÓN

### Proveedores Habilitados:
- GitHub (PRINCIPAL — para login del admin)
- Google (ALTERNATIVA — también habilitado)
- Email/Password (habilitado en Firebase, no usar para admin)

### Flujo:

1. Victor va a `/admin`
2. Si no está logueado → botones "Iniciar sesión con GitHub" y "Iniciar sesión con Google"
3. `signInWithPopup(auth, githubProvider)` o `signInWithPopup(auth, googleProvider)`
4. Se verifica que el UID está en `config.portfolio.allowedAdmins`
5. Si está → acceso al admin. Si no → mensaje "No autorizado"

### Auth Guard (`admin/layout.tsx`):

```typescript
// Pseudocódigo
const { user, loading } = useAuth();
if (loading) return <LoadingSpinner />;
if (!user) return <LoginPage />;
if (!isAdmin(user.uid)) return <UnauthorizedPage />;
return <AdminLayout>{children}</AdminLayout>;
```

### Setup Inicial (ONE TIME):

La primera vez, Victor necesita crear el documento `config/portfolio` manualmente en Firestore Console con su UID en `allowedAdmins`. Documentar esto claramente en el README.

---

## 9. PAGES DETALLADAS

### Home (`/`) — PÚBLICA

Orden de secciones:
1. **Navbar** (fixed, glass effect)
2. **Hero** (nombre, subtítulo, stats)
3. **Project Grid** (cards con visual themes)
4. **Tech Marquee** (scroll infinito)
5. **GitHub Repos** (carga dinámica)
6. **About** (texto + stats cards)
7. **CTA** (botones contacto)
8. **Footer**

Datos: Fetch de Firestore `config/portfolio` + `projects` donde `published == true`, ordenados por `order`.

### Project Detail (`/project/[slug]`) — PÚBLICA

Orden de secciones:
1. **Back button** (vuelve a home)
2. **Project Hero** (info + visual)
3. **🔥 Device Preview** (iframe interactivo con device switcher)
4. **Features Grid**
5. **Tech Stack Badges**
6. **Timeline**
7. **README Viewer** (si tiene githubRepo)
8. **Gallery** (si tiene imágenes)
9. **Links** (live, github, figma, etc.)

### Admin Dashboard (`/admin`) — PRIVADA

- Resumen: total proyectos, publicados vs borrador, último update
- Quick links a crear proyecto, settings

### Admin Projects (`/admin/projects`) — PRIVADA

- Lista de todos los proyectos (publicados y borrador)
- Indicadores de status
- Botones: editar, duplicar, eliminar, toggle publish
- Reordenar con drag & drop
- Botón "Nuevo proyecto"

### Admin Settings (`/admin/settings`) — PRIVADA

- Editar config general del portfolio
- Preview de cómo se ve la home

---

## 10. DEPLOY A FIREBASE HOSTING

### `firebase.json`

```json
{
  "hosting": {
    "source": ".",
    "frameworksBackend": {
      "region": "us-central1"
    },
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Comandos de deploy

```bash
# Setup inicial
firebase login
firebase init hosting  # seleccionar "Web Frameworks (experimental)"
firebase init firestore
firebase init storage

# Deploy
firebase deploy
```

> **NOTA:** Firebase Hosting con Next.js usa Cloud Functions por detrás. Requiere plan Blaze (pay-as-you-go, pero el free tier cubre uso bajo).

---

## 11. ARCHIVOS DE CONFIGURACIÓN

### `.gitignore`

```
node_modules/
.next/
.env.local
.firebase/
*.log
```

### `next.config.ts`

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
};
export default nextConfig;
```

---

## 12. ORDEN DE IMPLEMENTACIÓN (PARA CURSOR)

Implementar en este orden exacto. Cada paso debe funcionar antes de pasar al siguiente.

### Fase 1: Fundación
1. Crear proyecto Next.js con TypeScript + Tailwind
2. Configurar Firebase (firebase.ts, .env.local)
3. Implementar design tokens en globals.css y tailwind.config.ts
4. Crear componentes UI base (Button, Input, Card, etc.)
5. Implementar Navbar + Footer
6. Crear layout raíz con fuentes y providers

### Fase 2: Público (Home + Detail)
7. Implementar Hero component
8. Implementar ProjectCard + ProjectGrid
9. Crear page Home que lee de Firestore
10. Implementar TechMarquee
11. Implementar GitHubRepos + API proxy
12. Implementar AboutSection + CTASection
13. Crear DeviceFrame (phone, tablet, desktop)
14. Crear DevicePreview con switcher
15. Implementar ReadmeViewer
16. Crear page Project Detail con todas las secciones
17. Agregar scroll animations (IntersectionObserver)

### Fase 3: Admin
18. Implementar AuthContext + useAuth
19. Crear login page con GitHub
20. Implementar admin layout con auth guard
21. Crear ProjectForm completo
22. Implementar ImageUploader (Firebase Storage)
23. Crear admin pages: dashboard, projects list, new, edit
24. Crear Settings page
25. Implementar drag & drop para reordenar

### Fase 4: Polish
26. Ambient blobs + noise overlay
27. Page transitions
28. Loading skeletons
29. Error boundaries
30. SEO (meta tags, og:image)
31. Mobile responsive final pass
32. Deploy a Firebase Hosting

---

## 13. REGLAS PARA CURSOR

1. **NO uses `"use client"` en todo.** Solo en componentes que realmente necesitan hooks del browser.
2. **Server Components por defecto.** Fetch de Firestore en el server cuando sea posible.
3. **TypeScript estricto.** Todos los tipos en `lib/types.ts`. Nada de `any`.
4. **No instales librerías extra** que no estén en este documento.
5. **Tailwind puro.** No styled-components ni CSS modules. Excepción: variables CSS custom en globals.css.
6. **Componentes pequeños.** Máximo 150 líneas por archivo. Si es más, dividir.
7. **Error handling en todo.** Try-catch en fetches, estados de error en UI.
8. **Mobile-first responsive.** Diseña para mobile primero, escala a desktop.
9. **Accesibilidad básica.** aria-labels en botones de íconos, alt en imágenes, semantic HTML.
10. **Commits descriptivos.** Un commit por fase completada.

---

## 14. SEED DATA PARA DESARROLLO

Crear un script `scripts/seed.ts` que inserte datos de prueba en Firestore:

- 1 documento en `config/portfolio` con la info de Victor
- 4 proyectos de ejemplo (DspXteams, FamilyDash, Focobit, XtheGospel) con todos los campos llenos
- Ejecutar con: `npx tsx scripts/seed.ts`

Usar los datos del demo HTML como base para el seed.

---

## ARCHIVO DE REFERENCIA VISUAL

El archivo `portfolio-v3-interactive.html` en la raíz del proyecto es la referencia visual. Cada componente debe replicar la estética de ese archivo:
- Colores exactos
- Tipografía exacta
- Espaciado similar
- Animaciones similares
- Device frames idénticos
