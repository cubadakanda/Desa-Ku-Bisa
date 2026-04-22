# Desa-Ku Bisa: Setup & Deployment Guide

## 1. Instalasi & Setup Project

Jalankan perintah berikut di terminal Anda:

```bash
# Membuat project Vite dengan React
npm create vite@latest desa-ku-bisa -- --template react

# Masuk ke direktori project
cd desa-ku-bisa

# Instalasi dependencies (Tailwind, Axios, Lucide React)
npm install -D tailwindcss postcss autoprefixer
npm install axios lucide-react react-router-dom
npx tailwindcss init -p
```

## 2. Konfigurasi Tailwind CSS

Update file `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          navy: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

## 3. Dockerfile (Multi-stage Build)

Buat file `Dockerfile` di root folder:

```dockerfile
# Stage 1: Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 4. CI/CD Workflow (.github/workflows/deploy.yml)

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker Image
        run: docker build -t desakubisa-frontend .

      # Tambahkan step login ke Docker Registry & Push jika diperlukan
      # Serta step untuk SSH ke EC2 dan melakukan 'docker pull' & 'docker run'
```
