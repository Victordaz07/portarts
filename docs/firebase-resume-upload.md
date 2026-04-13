# Host your resume PDF on Firebase Storage and link it on the site

## 1. Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/) and select your project (e.g. **portarts**).
2. In the sidebar: **Build → Storage**.
3. If Storage is not enabled yet, turn it on and accept the default rules (adjust public read rules if the PDF must download without authentication).

## 2. Suggested folder

- Create a folder such as **`public`** or **`resume`** in the bucket.
- Upload the file with a stable name, for example:  
  `public/resume/your-name-cv.pdf`

The full path in the bucket will look like:  
`gs://<your-bucket>/public/resume/your-name-cv.pdf`

## 3. Public URL

1. In the file list, open the uploaded PDF.
2. Use **Get download link** / **Access token** depending on the UI, or copy the URL if you use public read rules.
3. The URL must be **HTTPS** and load in the browser when pasted in the address bar.

Example shape:

`https://firebasestorage.googleapis.com/v0/b/<bucket>/o/public%2Fresume%2Fyour-name-cv.pdf?alt=media&token=...`

## 4. Where to put the URL in the project

### Local

In `.env.local`:

```env
NEXT_PUBLIC_RESUME_URL=https://...your-full-url...
```

Restart `npm run dev` after changing any `NEXT_PUBLIC_*` variables.

### Production (e.g. Vercel)

Add the same variable in the hosting provider’s environment settings and redeploy.

## 5. Verify

After setting `NEXT_PUBLIC_RESUME_URL`, the site should show **Download resume** (or equivalent) where implemented, pointing to this URL.
