# Host your resume PDF and link it on the site

The site shows a **Download resume** button wherever implemented when `NEXT_PUBLIC_RESUME_URL` is set. Any public HTTPS URL works — the simplest option on this stack is **Vercel Blob**.

## Option A — Vercel Blob (recommended)

1. In your Vercel project: **Storage → Blob** (create a store if you don't have one).
2. Open the store → **Upload** your PDF (e.g. `your-name-cv.pdf`). Uploads are public by default.
3. Copy the resulting URL. It looks like:
   `https://<store-id>.public.blob.vercel-storage.com/your-name-cv-xxxx.pdf`

## Option B — any host

Any public HTTPS URL that loads the PDF directly in the browser works (Google Drive direct link, S3, your own server, etc.).

## Set the URL

### Local
In `.env.local`:
```env
NEXT_PUBLIC_RESUME_URL=https://...your-full-url...
```
Restart `npm run dev` after changing any `NEXT_PUBLIC_*` variable.

### Production (Vercel)
Add `NEXT_PUBLIC_RESUME_URL` in **Project → Settings → Environment Variables** and redeploy.

## Verify
After setting the variable, the **Download resume** button appears and points to this URL. Leave the variable empty to hide the button.
