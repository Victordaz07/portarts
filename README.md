# PortArts — Interactive Developer Portfolio

Portfolio interactivo con preview en vivo de apps, integración GitHub, y panel admin.

## Stack
- Next.js 16 + React 19 + TypeScript
- Firebase (Auth, Firestore, Storage)
- Tailwind CSS v4

## Features
- Preview interactivo de apps en mockups de dispositivo (phone/tablet/desktop)
- Panel admin con autosave y drag & drop
- Integración automática con GitHub (repos + README)
- Login con GitHub y Google
- SEO dinámico

## Setup

1. Clona el repo
2. `npm install`
3. Copia `.env.example` a `.env.local` y llena las credenciales de Firebase
4. Crea un proyecto en Firebase Console con Auth (GitHub + Google), Firestore y Storage
5. Crea el documento `config/portfolio` en Firestore con tu UID en `allowedAdmins`
6. `npm run dev`

## Deploy
```bash
npm run deploy
```

## Licencia
MIT
