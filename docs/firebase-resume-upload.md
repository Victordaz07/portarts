# Subir el CV a Firebase Storage y enlazarlo en el sitio

## 1. Firebase Console

1. Abre [Firebase Console](https://console.firebase.google.com/) y selecciona el proyecto **portarts** (o el que uses).
2. En el menú lateral: **Build → Storage**.
3. Si no está activado, inicia Storage y acepta las reglas por defecto (ajusta reglas de lectura pública si el PDF debe ser descargable sin auth).

## 2. Carpeta sugerida

- Crea una carpeta **`public`** (o **`resume`**) en el bucket.
- Sube el archivo con un nombre estable, por ejemplo:  
  `public/resume/victor-ruiz-cv.pdf`

La ruta completa en el bucket será algo como:  
`gs://<tu-bucket>/public/resume/victor-ruiz-cv.pdf`

## 3. URL pública

1. En la lista de archivos, abre el PDF subido.
2. Usa **Obtener enlace de descarga** / **Access token** según la UI, o copia la URL si usas reglas de lectura pública.
3. La URL debe ser **HTTPS** y accesible en el navegador al pegarla en la barra de direcciones.

Ejemplo de formato:

`https://firebasestorage.googleapis.com/v0/b/<bucket>/o/public%2Fresume%2Fvictor-ruiz-cv.pdf?alt=media&token=...`

## 4. Dónde pegar la URL en el proyecto

### Local

En `.env.local`:

```env
NEXT_PUBLIC_RESUME_URL=https://...tu-url-completa...
```

Reinicia `npm run dev` después de cambiar variables `NEXT_PUBLIC_*`.

### Producción (Vercel)

1. [Vercel Dashboard](https://vercel.com/) → tu proyecto → **Settings → Environment Variables**.
2. Añade `NEXT_PUBLIC_RESUME_URL` con la misma URL para **Production** (y Preview si quieres).
3. Vuelve a desplegar.

Los botones **Download Resume** (Hero y About) solo se muestran si esta variable tiene un valor no vacío.
