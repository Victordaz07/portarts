# 🎯 SETUP INICIAL — INSTRUCCIONES PARA CURSOR

> **Repo:** https://github.com/Victordaz07/portarts
> **GitHub User:** Victordaz07
> **Proyecto:** PortArts — Portfolio Interactivo

---

## PASO 0: CLONAR E INICIALIZAR

```bash
git clone https://github.com/Victordaz07/portarts.git
cd portarts

# Crear proyecto Next.js DENTRO del repo (sin crear subcarpeta)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Instalar dependencias
npm install firebase react-markdown remark-gfm rehype-raw lucide-react
npm install -D @types/node
```

---

## PASO 1: COPIAR ARCHIVOS DE REFERENCIA

Copiar estos archivos en la raíz del proyecto:
- `PORTFOLIO-PRD-CURSOR.md` → referencia técnica completa
- `portfolio-v3-interactive.html` → referencia visual
- `tailwind.config.reference.ts` → reemplazar tailwind.config.ts con este contenido
- `globals.css.reference` → reemplazar src/app/globals.css con este contenido

---

## PASO 2: FIREBASE SETUP (VICTOR LO HACE MANUAL)

### 2.1 Crear proyecto en Firebase Console
1. Ir a https://console.firebase.google.com
2. "Agregar proyecto" → nombre: `portarts`
3. Desactivar Google Analytics (no lo necesitamos)
4. Esperar a que se cree

### 2.2 Crear Web App
1. En el dashboard del proyecto → click en icono Web `</>`
2. Nombre: `portarts-web`
3. Marcar "Firebase Hosting"
4. Copiar las credenciales que aparecen

### 2.3 Activar Authentication
1. Build → Authentication → "Comenzar"
2. Sign-in method → GitHub → Habilitar
3. **Necesitas crear una GitHub OAuth App:**
   - Ir a https://github.com/settings/developers
   - "New OAuth App"
   - Application name: `PortArts`
   - Homepage URL: `https://portarts-XXXXX.web.app` (o `http://localhost:3000` por ahora)
   - Authorization callback URL: Copiar el que Firebase te muestra (algo como `https://portarts-XXXXX.firebaseapp.com/__/auth/handler`)
   - Copiar el Client ID y Client Secret que GitHub te da
   - Pegar ambos en Firebase Authentication → GitHub provider

### 2.4 Activar Firestore
1. Build → Firestore Database → "Crear base de datos"
2. Modo producción
3. Ubicación: `us-central1` (o la más cercana)

### 2.5 Activar Storage
1. Build → Storage → "Comenzar"
2. Modo producción

### 2.6 Crear `.env.local`

```bash
# En la raíz del proyecto portarts/
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyACDzhUDmTgqt7-Rax_sSvJ-FnB--y4dq0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=portarts.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=portarts
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=portarts.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=577817045908
NEXT_PUBLIC_FIREBASE_APP_ID=1:577817045908:web:9185df2480ce633c283d81
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BGLBCSHRLH

# Opcional — para más rate limit en GitHub API
GITHUB_TOKEN=ghp_xxxxxxx
```

### 2.7 Seed inicial de Firestore (DESPUÉS del primer login)

Una vez que Victor haga login con GitHub por primera vez, necesita:

1. Ir a Firebase Console → Firestore
2. Crear colección `config`
3. Crear documento con ID `portfolio`
4. Agregar estos campos:

```json
{
  "name": "Victor",
  "title": "Full-Stack Developer",
  "subtitle": "Full-stack developer construyendo productos que combinan diseño impecable con arquitectura sólida.",
  "email": "",
  "githubUsername": "Victordaz07",
  "about": [
    "Desarrollo productos digitales que resuelven problemas reales. Desde plataformas de gestión de flotas hasta apps de productividad con IA.",
    "Mi stack combina React, React Native, Next.js con backends en Firebase y Supabase. Uso herramientas de IA como Claude, Cursor y Antigravity."
  ],
  "stats": [
    {"value": "5+", "label": "Proyectos"},
    {"value": "3", "label": "Plataformas"},
    {"value": "Web", "label": "iOS & Android"},
    {"value": "AI", "label": "Powered Dev"}
  ],
  "techStack": ["React", "React Native", "Next.js", "Firebase", "Supabase", "TypeScript", "Figma", "Claude AI", "Cursor", "Antigravity"],
  "socialLinks": {
    "github": "https://github.com/Victordaz07"
  },
  "allowedAdmins": ["PONER-TU-UID-AQUI"]
}
```

> **IMPORTANTE:** El UID lo encuentras en Firebase Console → Authentication → Users → copiar el UID de tu cuenta.

---

## PASO 3: FIREBASE CLI

```bash
# Instalar Firebase CLI (si no la tienes)
npm install -g firebase-tools

# Login
firebase login

# Inicializar en el proyecto
firebase init

# Seleccionar:
# - Firestore (rules + indexes)
# - Storage (rules)
# - Hosting (con Web Frameworks)
# - Seleccionar el proyecto portarts que creaste
```

### Archivos de Firebase que se generan:

**`firestore.rules`** — Reemplazar con:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /config/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
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

**`storage.rules`** — Reemplazar con:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{projectId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## PASO 4: DECIRLE A CURSOR QUÉ HACER

### Prompt inicial para Cursor:

```
Lee el archivo PORTFOLIO-PRD-CURSOR.md que está en la raíz del proyecto. 
Este es el PRD completo del proyecto.

También tienes como referencia visual el archivo portfolio-v3-interactive.html.

Ejecuta la FASE 1 completa (pasos 1-6 del PRD, sección "ORDEN DE IMPLEMENTACIÓN"):
1. El proyecto Next.js ya está creado
2. Configura Firebase (lib/firebase.ts) usando las variables de .env.local
3. Implementa los design tokens en globals.css y tailwind.config.ts
   (usa los archivos de referencia tailwind.config.reference.ts y globals.css.reference)
4. Crea los componentes UI base (Button, Input, Card, etc.)
5. Implementa Navbar + Footer
6. Crea el layout raíz con Google Fonts (Instrument Serif, Outfit, JetBrains Mono) y providers

NO avances a la Fase 2 hasta que confirme que la Fase 1 funciona.
```

### Prompt para Fase 2:

```
La Fase 1 está completa y funciona. Ahora ejecuta la FASE 2 completa 
(pasos 7-17 del PRD):

Sigue exactamente las especificaciones del PRD para cada componente.
El diseño debe replicar la estética del archivo portfolio-v3-interactive.html.

Componente más importante: DevicePreview.tsx — sigue la especificación 
6.1 del PRD al pie de la letra. Los device frames deben verse idénticos 
al CSS en globals.css.reference.
```

### Prompt para Fase 3:

```
Fase 2 funciona correctamente. Ejecuta la FASE 3 (pasos 18-25 del PRD):
- Auth con GitHub
- Admin layout con auth guard  
- ProjectForm completo con todos los campos
- ImageUploader a Firebase Storage
- CRUD completo de proyectos
- Settings page

Sigue las Firestore Security Rules del PRD.
```

### Prompt para Fase 4:

```
Todo funcional. Ejecuta la FASE 4 (pasos 26-32 del PRD):
- Ambient blobs + noise overlay
- Page transitions
- Loading skeletons
- Error boundaries
- SEO meta tags
- Mobile responsive final pass
- Preparar para deploy a Firebase Hosting
```

---

## PASO 5: DEPLOY

```bash
# Build y deploy
firebase deploy

# O solo hosting:
firebase deploy --only hosting

# Solo reglas:
firebase deploy --only firestore:rules,storage:rules
```

---

## ESTRUCTURA FINAL ESPERADA

```
portarts/
├── .env.local                    # Credenciales (NO en git)
├── .gitignore
├── PORTFOLIO-PRD-CURSOR.md       # Referencia técnica
├── portfolio-v3-interactive.html # Referencia visual
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx              # Home pública
    │   ├── project/[slug]/page.tsx
    │   ├── admin/...
    │   └── api/github/route.ts
    ├── components/
    │   ├── layout/
    │   ├── home/
    │   ├── project/
    │   ├── admin/
    │   └── ui/
    ├── lib/
    ├── context/
    ├── hooks/
    └── styles/
        └── globals.css
```

---

## CHECKLIST FINAL

- [ ] Proyecto Firebase creado
- [ ] GitHub OAuth App creada
- [ ] Auth activado con GitHub provider
- [ ] Firestore activado
- [ ] Storage activado
- [ ] `.env.local` con todas las credenciales
- [ ] Repo clonado y Next.js inicializado
- [ ] Archivos de referencia copiados a la raíz
- [ ] Firebase CLI instalado e inicializado
- [ ] Fase 1 ejecutada en Cursor
- [ ] Fase 2 ejecutada en Cursor
- [ ] Fase 3 ejecutada en Cursor
- [ ] Fase 4 ejecutada en Cursor
- [ ] Documento `config/portfolio` creado en Firestore con tu UID
- [ ] `firebase deploy` exitoso
