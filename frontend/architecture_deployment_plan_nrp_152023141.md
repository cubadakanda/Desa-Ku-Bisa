# Desa-Ku Bisa: Frontend Architecture & Deployment Plan

## 1. Project Structure (`/src`)
Sesuai permintaan, struktur akan diatur untuk skalabilitas dan kemudahan integrasi Cloud:
- `/src/components`: UI components reusable (Navbar, Sidebar, Modal, Tables).
- `/src/pages`: LandingPage, LoginPage, DashboardAdmin (User Management), DashboardWarga (Surat).
- `/src/context`: `AuthContext.jsx` untuk Role-Based Access Control (RBAC).
- `/src/services`: Konfigurasi Axios Interceptor untuk API calls ke EC2.

## 2. Infrastructure & CI/CD
### Dockerfile (Multi-stage)
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### GitHub Actions (`.github/workflows/main.yml`)
```yaml
name: Deploy Frontend to Amazon EC2

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build & Push Docker Image
        run: |
          docker build -t desa-ku-bisa-frontend .
          # Logic to push to registry and deploy to EC2
```

## 3. Environment Variables
File `.env`:
```env
VITE_API_URL=http://<IP_PUBLIC_EC2>:5000
```

## 4. Feature Implementation
- **RBAC:** Admin memiliki akses penuh, Warga hanya akses fitur Pengajuan Surat.
- **S3 Integration:** Form pengajuan surat menyertakan input file yang akan dikirim ke endpoint backend yang terhubung ke Amazon S3.
- **RDS Integration:** Tabel Manajemen User menarik data langsung dari endpoint API yang terhubung ke Amazon RDS.