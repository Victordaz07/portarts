# Initial setup — step-by-step (Firebase + Cursor)

> **Repo:** https://github.com/Victordaz07/portarts  
> **GitHub user:** Victordaz07  
> **Project:** PortArts — interactive developer portfolio  

---

## Step 0 — Clone and bootstrap

```bash
git clone https://github.com/Victordaz07/portarts.git
cd portarts

# If you are scaffolding Next.js inside the folder (historical note):
# npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

npm install
```

---

## Step 1 — Reference files (if rebuilding from scratch)

Copy any reference assets you maintain alongside the repo:

- `PORTFOLIO-PRD-CURSOR.md` — full technical spec  
- `portfolio-v3-interactive.html` — visual reference (if present)  
- Tailwind / CSS reference files — only if you are regenerating styles from scratch  

The current repo already contains the implemented app; you usually **do not** need to replace `tailwind.config` or `globals.css` unless you are customizing.

---

## Step 2 — Firebase (manual in Console)

### 2.1 Create a Firebase project

1. Go to https://console.firebase.google.com  
2. **Add project** → name: `portarts` (or your choice)  
3. Google Analytics is optional  
4. Wait until the project is ready  

### 2.2 Register a web app

1. In the project dashboard → **Web** `</>`  
2. Name: e.g. `portarts-web`  
3. Enable **Firebase Hosting** if prompted  
4. Copy the config values for `.env.local`  

### 2.3 Enable Authentication

1. **Build → Authentication → Get started**  
2. **Sign-in method → GitHub → Enable**  
3. **Create a GitHub OAuth App:**  
   - https://github.com/settings/developers → **New OAuth App**  
   - Application name: `PortArts`  
   - Homepage URL: `https://<your-project>.web.app` (or `http://localhost:3000` for dev)  
   - Authorization callback URL: use the URL Firebase shows (e.g. `https://<project>.firebaseapp.com/__/auth/handler`)  
   - Paste **Client ID** and **Client Secret** into the GitHub provider in Firebase  

### 2.3.1 Authorized domains (required on Vercel / previews)

If the admin shows **`auth/unauthorized-domain`** in the console, Firebase is blocking OAuth on that host.

1. Firebase Console → **Authentication → Settings → Authorized domains**  
2. **Add domain** for every host you use, for example:  
   - `localhost` (often default)  
   - Your Vercel project: `your-app.vercel.app`  
   - Each **preview** URL if you test previews  
   - Your custom domain if you use one  
3. Save and **reload** the app; try GitHub / Google again  

> **Tip:** In production, your main `*.vercel.app` and custom domain are usually enough. Preview URLs change; add them when you hit errors or do admin work on the primary URL only.

### 2.4 Enable Firestore

1. **Build → Firestore Database → Create database**  
2. Production mode  
3. Region: e.g. `us-central1`  

### 2.5 Enable Storage

1. **Build → Storage → Get started**  
2. Production mode  

### 2.6 Create `.env.local`

Copy values from Firebase Console → Project settings → Your apps (Web). **Never commit** `.env.local`.

```bash
# In the portarts repo root
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=optional

# Production / Vercel — full service account JSON as one line (secret)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Optional — higher GitHub API rate limits
GITHUB_TOKEN=
```

### 2.7 Seed Firestore (after first login)

After you sign in with GitHub once:

1. Firebase Console → Firestore  
2. Create collection `config`  
3. Create document with id `portfolio`  
4. Add fields, for example:

```json
{
  "name": "Your Name",
  "title": "Full-Stack Developer",
  "subtitle": "Short hero line describing what you build.",
  "email": "",
  "githubUsername": "Victordaz07",
  "about": [
    "Paragraph one — what you build and who you help.",
    "Paragraph two — stack and tools you use."
  ],
  "stats": [
    {"value": "5+", "label": "Projects"},
    {"value": "3", "label": "Platforms"},
    {"value": "Web", "label": "iOS & Android"},
    {"value": "AI", "label": "Dev workflow"}
  ],
  "techStack": ["React", "Next.js", "Firebase", "TypeScript", "Figma"],
  "socialLinks": {
    "github": "https://github.com/Victordaz07"
  },
  "allowedAdmins": ["PASTE-YOUR-UID-HERE"]
}
```

> **Important:** UID: Firebase Console → **Authentication → Users** → copy your user’s UID.

### If the site looks “empty” on Vercel

- Server reads use **Firebase Admin** when **`FIREBASE_SERVICE_ACCOUNT_JSON`** is set in Vercel. Without it, SSR may not see data depending on rules.  
- Confirm **`config/portfolio`** exists and projects have **`published: true`** where needed.  
- If local error **“Unable to detect a Project Id”**: fix **`NEXT_PUBLIC_FIREBASE_PROJECT_ID`** or service account `project_id`. Then `npm run clean && npm run dev`.  
- Deploy indexes from `firestore.indexes.json`: `firebase deploy --only firestore:indexes`. While an index is building, lists can be empty briefly.  
- Deploy rules: `firebase deploy --only firestore:rules`. New projects should use **boolean** `published` per `validProject()` in rules.

---

## Step 3 — Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Select as needed:

- Firestore (rules + indexes)  
- Storage (rules)  
- Hosting (Web Frameworks / Next.js)  
- Link to the Firebase project you created  

### Generated Firebase files

Use the repo’s **`firestore.rules`** (summary):

```
match /config/{docId} {
  allow read: if true;
  allow write: if isAdmin() && docId == "portfolio";
}
match /projects/{projectId} {
  allow read: if isPublishedPublic(resource.data.published) || isAdmin();
  allow create: if isAdmin() && validProject();
  allow update, delete: if isAdmin();
}
```

Deploy: `firebase deploy --only firestore:rules`.

**`storage.rules`** — uses custom claim `portfolioAdmin` (not `firestore.get()` inside Storage rules).

On the **Spark (free) plan**, Storage rules cannot read Firestore, so admin checks use **custom claims**:

1. Keep UIDs in `config/portfolio.allowedAdmins`.  
2. Run **`npm run sync-admin-claims`** with a service account locally, **or** use **Admin → Settings → Sync Storage permissions** (needs `FIREBASE_SERVICE_ACCOUNT_JSON` on the server).  
3. **Sign out and sign in again** (or refresh ID token) so the token includes the claim.

On **Blaze**, you could use Firestore-backed rules in Storage; claims are still a valid approach.

---

## Step 4 — Cursor / AI prompts (optional)

### Initial prompt

```
Read PORTFOLIO-PRD-CURSOR.md in the repo root — full PRD.
Use portfolio-v3-interactive.html as visual reference if present.

Execute PHASE 1 (PRD “implementation order”):
- Firebase config in lib/firebase.ts from .env.local
- Design tokens in globals.css / Tailwind
- Base UI components, Navbar, Footer, root layout + fonts
```

### Later phases

Follow the PRD sections for Phases 2–4 (components, auth, admin, polish, SEO, deploy).

---

## Step 5 — Deploy

```bash
firebase deploy
# or
firebase deploy --only hosting
firebase deploy --only firestore:rules,storage:rules
```

---

## Expected layout (reference)

```
portarts/
├── .env.local
├── .gitignore
├── PORTFOLIO-PRD-CURSOR.md
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── next.config.ts
├── package.json
└── src/
    ├── app/
    ├── components/
    ├── lib/
    └── ...
```

---

## Final checklist

- [ ] Firebase project created  
- [ ] GitHub OAuth app created  
- [ ] GitHub provider enabled in Firebase Auth  
- [ ] Firestore enabled  
- [ ] Storage enabled  
- [ ] `.env.local` filled (and secrets on Vercel if used)  
- [ ] `config/portfolio` document with your UID in `allowedAdmins`  
- [ ] Firestore rules + indexes deployed  
- [ ] `firebase deploy` succeeds  
