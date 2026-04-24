# Desa Ku Bisa 🏘️

Platform digital untuk layanan administrasi desa dengan teknologi cloud computing.

**NRP**: 152023141

**Nama**: Parisan Apro

**Mata Kuliah**: Komputasi Awan (Cloud Computing)

**Universitas**: Institut Teknologi Nasional Bandung

## 📋 Deskripsi Proyek

Aplikasi web untuk membantu desa dalam mengelola data penduduk dan pengajuan surat secara digital. Platform ini menyediakan:

- **Admin Dashboard**: Manajemen data warga, tracking antrian pengajuan surat
- **Warga Portal**: Login, pengajuan surat dengan upload dokumen
- **Cloud Infrastructure**: AWS EC2, RDS, S3
- **CI/CD Pipeline**: GitHub Actions untuk automated deployment

#### Test Credentials

| Role  | NIK              | Password |
| ----- | ---------------- | -------- |
| Admin | 0000000000000001 | admin123 |
| Warga | 1234567890123456 | warga123 |
| Paris | 1122334455667700 | paris123 |

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.5 - UI library
- **Vite** 8.0.9 - Build tool
- **React Router DOM** 7.14.2 - Routing
- **Tailwind CSS** 3.4.1 - Styling
- **Axios** 1.15.2 - HTTP client

### Backend

- **Node.js** 18 LTS
- **Express** 4.18.2 - Web framework
- **Sequelize** 6.35.2 - ORM
- **MySQL** 8.0 - Database
- **JWT** 9.1.2 - Authentication
- **bcryptjs** 2.4.3 - Password hashing
- **AWS SDK** - S3 integration

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **AWS EC2** - Compute
- **AWS RDS** - Database
- **AWS S3** - File storage
- **GitHub Actions** - CI/CD
- **Nginx -** Reverse proxy dan web server

## 📁 Struktur Project

```
desa-ku-bisa/
├── frontend/                       # React Vite application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   ├── components/             # Reusable components
│   │   ├── context/                # Auth context
│   │   ├── services/               # API calls
│   │   └── App.jsx                 # Main app with routing
│   ├── Dockerfile                  # Frontend container
│   ├── tailwind.config.js          # Tailwind theme
│   └── package.json
│
├── backend/                        # Node Express API
│   ├── src/
│   │   ├── server.js               # Entry point
│   │   ├── config/                 # Database config
│   │   ├── models/                 # Sequelize models
│   │   ├── routes/                 # API endpoints
│   │   └── middleware/             # Auth, upload, etc
│   ├── Dockerfile                  # Backend container
│   ├── seed.js                     # Database seeding
│   ├── .env.example                # Environment template
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── main.yml                # GitHub Actions CI/CD
│
├── docker-compose.yml              # Local development
├── docker-compose.prod.yml         # Production config
├── DEPLOYMENT_GUIDE.md             # AWS deployment guide
├── LOCAL_TESTING_GUIDE.md          # Development guide
└── README.md                       # This file
```

## 🚀 Quick Start

### Development (Local)

#### Prerequisites

- Node.js 18+
- MySQL 8.0 (atau Docker)
- Git

#### Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/desa-ku-bisa.git
cd desa-ku-bisa

# Option 1: Using Docker Compose (Recommended)
docker-compose up -d
npm run dev  # Frontend
npm run dev  # Backend

# Option 2: Manual Setup
# Frontend
cd frontend
npm install
npm run dev

# Backend (new terminal)
cd backend
npm install
npm run dev
```

#### Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database: localhost:3306 (desa_user / desa_password)

### Production (AWS)

```bash
# 1. Setup AWS resources (RDS, S3, EC2)
# 2. Configure GitHub Secrets
# 3. Push to main branch
# 4. GitHub Actions akan deploy otomatis

# atau manual:
ssh -i desa-ku-bisa-key.pem ubuntu@YOUR_EC2_IP
cd desa-ku-bisa
docker-compose -f docker-compose.prod.yml up -d
```

Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) untuk detail lengkap.

## 📖 Dokumentasi

- [Local Testing Guide](LOCAL_TESTING_GUIDE.md) - Testing di development environment
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Setup AWS dan deploy ke production
- [Frontend README](frontend/README.md) - Frontend specific documentation
- [Backend README](backend/README.md) - Backend specific documentation

## 🔐 Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Admin & Warga roles
- Password hashing with bcryptjs

### Admin Features

- ✅ Manajemen data warga (CRUD)
- ✅ Tracking antrian pengajuan surat
- ✅ Update status pengajuan (pending → proses → selesai)
- ✅ View attachment files

### Warga Features

- ✅ Login dengan NIK
- ✅ Lihat profil diri
- ✅ Pengajuan surat dengan upload dokumen
- ✅ Track status pengajuan
- ✅ Download surat (ketika selesai)

### Cloud Features

- ✅ AWS RDS untuk data storage
- ✅ AWS S3 untuk file upload
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD
- ✅ Auto deployment ke EC2

## 📊 Database Schema

### User Table

```sql
- id (PK)
- nik (unique)
- password (hashed)
- nama
- role (admin|warga)
- timestamps
```

### Surat Table

```sql
- id (PK)
- jenisSurat
- keperluan
- keterangan
- status (pending|proses|selesai)
- fileUrl (S3 URL)
- userId (FK)
- timestamps
```

## 🔗 API Endpoints

### Auth

- `POST /api/auth/login` - Login

### Users (Admin Only)

- `GET /api/warga` - List semua warga
- `POST /api/warga` - Buat warga baru
- `PUT /api/warga/:id` - Edit warga
- `DELETE /api/warga/:id` - Hapus warga

### Surat (Warga)

- `POST /api/surat` - Buat pengajuan (with file)
- `GET /api/surat/my` - Tracking pengajuan saya

### Surat (Admin)

- `GET /api/surat/all` - Lihat semua pengajuan (antrian)
- `PUT /api/surat/:id/status` - Update status pengajuan

## 🐳 Docker

### Build Images

```bash
# Frontend
docker build -t desa-ku-bisa-frontend:latest frontend/

# Backend
docker build -t desa-ku-bisa-backend:latest backend/
```

### Run with Docker Compose

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Logs
docker-compose logs -f

# Cleanup
docker-compose down
```

## ⚙️ Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=desa_user
DB_PASSWORD=desa_password
DB_NAME=desa_ku_bisa
JWT_SECRET=your-secret-key
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_BUCKET_NAME=xxx
CORS_ORIGIN=http://localhost:5173
```

## 🔄 CI/CD Pipeline

GitHub Actions workflow:

1. **Build**: Compile frontend dan backend
2. **Test**: Run tests (optional)
3. **Push**: Push Docker images ke Docker Hub
4. **Deploy**: SSH ke EC2 dan run docker-compose

Setup requirements:

- GitHub Secrets: DOCKERHUB_USERNAME, DOCKERHUB_TOKEN
- GitHub Secrets: EC2_HOST, EC2_USER, EC2_SSH_KEY

## 📈 Performance & Scaling

### Current Setup

- Suitable untuk: 100-1000 concurrent users
- Database: RDS t3.micro (single AZ)
- Server: EC2 t3.micro (single instance)

### Scaling Options (Future)

- Add RDS Read Replicas
- EC2 Auto Scaling Group
- CloudFront CDN
- ElastiCache for sessions
- RabbitMQ for async tasks

## 🧪 Testing

### Manual Testing

```bash
# Frontend
npm run dev
# Browser test: http://localhost:5173

# Backend
npm run dev
# API test: curl http://localhost:5000/health

# Integration
see LOCAL_TESTING_GUIDE.md
```

### Database Seeding

```bash
cd backend
npm run seed

# Creates:
# - Admin: NIK 0000000000000001 / password: admin123
# - Warga: NIK 1234567890123456 / password: warga123
# - Paris: NIK 1122334455667700 / password
```

## 🛡️ Security

- ✅ JWT authentication
- ✅ Password hashing (bcryptjs)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ S3 private bucket (no public read)
- ✅ IAM policies for backend user
- ✅ Environment variables for secrets

## 📝 Development Guidelines

1. **Branching**: main (production) → develop (staging) → feature (development)
2. **Commits**: Use conventional commits (feat:, fix:, docs:, etc)
3. **PR**: All changes through pull requests with review
4. **Code Style**: Prettier for formatting
5. **Error Handling**: Always return proper HTTP status codes

## 🐛 Troubleshooting

### Frontend Issues

- Check VITE_API_URL in .env
- Clear browser cache (DevTools → Application → Clear)
- Check browser console for errors
- Verify backend running on port 5000

### Backend Issues

- Check database connection
- Verify .env credentials
- Check port 5000 not in use
- Review error logs: `docker-compose logs -f backend`

### Docker Issues

- Check Docker daemon running
- Verify images built: `docker images`
- Check containers running: `docker ps`
- Review container logs: `docker logs <container_id>`

Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) untuk troubleshooting lebih detail.

## 📞 Support

Untuk questions atau issues, buat GitHub issue atau contact:

- **Email**: parisan.apro@example.com
- **GitHub**: https://github.com/YOUR_USERNAME

## 📄 License

ISC License - See LICENSE file

## 🙏 Acknowledgments

- ITS Cloud Computing Course
- AWS Free Tier
- Open Source Community

---

**Status**: ✅ Development Complete | ⏳ Ready for Deployment

Last Updated: 2026 | NRP 152023141
