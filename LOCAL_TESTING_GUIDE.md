# Local Testing Guide - Desa Ku Bisa

Panduan untuk test aplikasi secara lokal sebelum deployment.

## 1. Setup Development Environment

### 1.1 Install Requirements

**Frontend Requirements:**
- Node.js 18+ (untuk Vite dan React)
- npm atau yarn

**Backend Requirements:**
- Node.js 18+
- MySQL 8.0 (atau gunakan Docker)
- AWS S3 bucket (untuk file upload testing)

### 1.2 Clone & Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/desa-ku-bisa.git
cd desa-ku-bisa

# Frontend setup
cd frontend
npm install
npm run dev

# Di terminal lain - Backend setup
cd backend
npm install
npm run dev
```

## 2. Database Setup (Local Development)

### Option A: Using Docker Compose (Recommended)

```bash
# Dari root directory
docker-compose up -d

# Verify
docker ps

# Check logs
docker-compose logs -f db
```

Database akan accessible:
- Host: `localhost:3306`
- User: `desa_user`
- Password: `desa_password`
- Database: `desa_ku_bisa`

### Option B: Manual MySQL Setup

```bash
# Install MySQL (macOS dengan Homebrew)
brew install mysql

# Start MySQL
brew services start mysql

# Login & create database
mysql -u root -p

# Dalam MySQL CLI:
CREATE DATABASE desa_ku_bisa;
CREATE USER 'desa_user'@'localhost' IDENTIFIED BY 'desa_password';
GRANT ALL PRIVILEGES ON desa_ku_bisa.* TO 'desa_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Environment Configuration

### 3.1 Frontend

File: `frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

### 3.2 Backend

File: `backend/.env`
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=desa_user
DB_PASSWORD=desa_password
DB_NAME=desa_ku_bisa
JWT_SECRET=local-dev-secret-key
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name
CORS_ORIGIN=http://localhost:5173
```

## 4. Seed Database with Test Data

```bash
cd backend

# Jalankan seed script
npm run seed

# Output:
# ✓ Database synced
# ✓ Default admin created (NIK: 0000000000000001, Password: admin123)
# ✓ Test warga created (NIK: 1234567890123456, Password: warga123)
# ✓ Seeding completed
```

## 5. Start Development Servers

### Terminal 1: Backend

```bash
cd backend
npm run dev

# Output:
# ✓ Server running on http://localhost:5000
# ✓ Environment: development
```

Test health check:
```bash
curl http://localhost:5000/health
# Response: {"message":"Server is running"}
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev

# Output:
# VITE v8.0.9  ready in 123 ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

Open browser: http://localhost:5173

## 6. Test Workflow

### 6.1 Landing Page
- Navigate to http://localhost:5173/
- Lihat hero section, features, stats
- Click "Mulai Sekarang" → go to login

### 6.2 Login Page
- URL: http://localhost:5173/login
- **Admin Login:**
  - NIK: `0000000000000001`
  - Password: `admin123`
- **Warga Login:**
  - NIK: `1234567890123456`
  - Password: `warga123`

### 6.3 Admin Dashboard
After login dengan admin:
- View list of residents (warga)
- Create new resident:
  - NIK: 9876543210987654
  - Nama: Siti Nurhaliza
  - Password: secure123
- Edit resident data
- Delete resident (with confirmation)

### 6.4 Warga Dashboard
After login dengan warga (NIK: 1234567890123456):
- View personal data
- Pengajuan Surat tab:
  - Jenis Surat: Surat Domisili
  - Keperluan: Administrasi
  - Upload file (PDF/JPG/PNG, max 10MB)
  - Submit → Status: Pending
- View submission history

### 6.5 Surat Antrian (Admin Only)
After login dengan admin:
- View all pengajuan surat (antrian)
- Update status: Pending → Proses → Selesai
- View file uploads (S3 URLs)

## 7. API Testing with Curl

### 7.1 Authentication

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "0000000000000001",
    "password": "admin123"
  }'

# Response:
# {
#   "message": "Login berhasil",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": 1,
#     "nik": "0000000000000001",
#     "nama": "Admin Desa",
#     "role": "admin"
#   }
# }
```

Save token untuk requests berikutnya:
```bash
export TOKEN="your-token-here"
```

### 7.2 User Management (Admin)

```bash
# Get all users
curl -X GET http://localhost:5000/api/warga \
  -H "Authorization: Bearer $TOKEN"

# Create new user
curl -X POST http://localhost:5000/api/warga \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "1111111111111111",
    "nama": "Test User",
    "password": "testpass123",
    "role": "warga"
  }'

# Update user
curl -X PUT http://localhost:5000/api/warga/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Updated Name",
    "role": "admin"
  }'

# Delete user
curl -X DELETE http://localhost:5000/api/warga/2 \
  -H "Authorization: Bearer $TOKEN"
```

### 7.3 Surat Pengajuan (Warga)

```bash
# Login sebagai warga
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "1234567890123456",
    "password": "warga123"
  }'

# Simpan WARGA_TOKEN dari response

# Create pengajuan dengan file
curl -X POST http://localhost:5000/api/surat \
  -H "Authorization: Bearer $WARGA_TOKEN" \
  -F "jenisSurat=Surat Domisili" \
  -F "keperluan=Administrasi Pernikahan" \
  -F "keterangan=Untuk syarat administrasi" \
  -F "lampiran=@path/to/file.pdf"

# Get my pengajuan
curl -X GET http://localhost:5000/api/surat/my \
  -H "Authorization: Bearer $WARGA_TOKEN"
```

### 7.4 Antrian Surat (Admin)

```bash
# Get all pengajuan (queue)
curl -X GET http://localhost:5000/api/surat/all \
  -H "Authorization: Bearer $TOKEN"

# Update status
curl -X PUT http://localhost:5000/api/surat/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "proses"}'

# Update status ke selesai
curl -X PUT http://localhost:5000/api/surat/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "selesai"}'
```

## 8. Frontend Component Testing

### 8.1 Check Page Loading

```bash
# Check console untuk errors
# Browser DevTools → Console tab
```

### 8.2 Test Protected Routes

```bash
# Logout, kemudian coba akses /admin
# Should redirect ke /login

# Warga login, coba akses /admin
# Should show "Akses Ditolak"
```

### 8.3 Test Styling

- Verify Tailwind colors:
  - Primary Navy: #00677f
  - Cyan Accent: #00cffd
  - Light Background: #f5faff

### 8.4 Test Responsiveness

- Buka Chrome DevTools → Device Toolbar
- Test di: Mobile, Tablet, Desktop sizes

## 9. Browser DevTools Debugging

### 9.1 Network Tab
- Monitor API calls
- Check request/response bodies
- Verify status codes (200, 401, 403, 500)

### 9.2 Storage Tab
- Check localStorage for:
  - `desa-ku-bisa-token` (JWT)
  - `desa-ku-bisa-user` (User object)

### 9.3 Application Tab
- Check cookies
- Clear cache if needed

## 10. Common Issues & Solutions

### Issue: "Cannot connect to database"
```bash
# Check MySQL running
mysql -u desa_user -p desa_ku_bisa

# Check .env credentials
# Verify port 3306 not blocked
```

### Issue: "S3 upload fails"
```bash
# Verify AWS credentials di .env
# Check bucket name dan region
# Verify IAM permissions

# Test S3 connection
aws s3 ls --profile default
```

### Issue: "CORS error di frontend"
```bash
# Backend console: Check CORS_ORIGIN setting
# Frontend console: Check exact error message
# Verify backend running on port 5000
```

### Issue: "JWT token invalid"
```bash
# Token mungkin expired (7 hari)
# Login ulang untuk refresh token
# Check JWT_SECRET consistency
```

### Issue: "Port already in use"
```bash
# Frontend port 5173
lsof -i :5173
kill -9 <PID>

# Backend port 5000
lsof -i :5000
kill -9 <PID>

# atau ubah PORT di .env backend
```

## 11. Cleanup

### Stop Development Servers

```bash
# Backend: Press Ctrl+C
# Frontend: Press Ctrl+C

# Docker containers
docker-compose down
```

### Clean Database

```bash
# Full reset (hapus data)
docker-compose down -v

# atau MySQL command
mysql -u desa_user -p desa_ku_bisa
DROP TABLE surat;
DROP TABLE users;
EXIT;
```

## 12. Performance Testing

### 12.1 Load Testing dengan Autocannon

```bash
# Install global
npm install -g autocannon

# Test backend
autocannon -c 10 -d 30 http://localhost:5000/health

# Test with auth
autocannon -c 10 -d 30 -b 1024 http://localhost:5000/api/warga \
  -H "Authorization: Bearer $TOKEN"
```

### 12.2 Browser Performance

1. Open DevTools → Lighthouse
2. Run Audit untuk Mobile dan Desktop
3. Check metrics: FCP, LCP, CLS

## 13. Pre-Deployment Checklist

- [ ] All API endpoints tested manually
- [ ] Frontend routing working correctly
- [ ] Auth flow (login/logout) working
- [ ] Admin can create/edit/delete users
- [ ] Warga can submit pengajuan with file
- [ ] File uploads to S3 working
- [ ] No console errors di browser
- [ ] No server errors di backend terminal
- [ ] Database seeding working
- [ ] All environment variables set
- [ ] Docker builds without errors
- [ ] GitHub Actions workflow configured

## Next Steps

1. Fix any issues ditemukan di testing
2. Update documentation jika ada changes
3. Prepare AWS resources (RDS, S3, EC2)
4. Setup GitHub Actions secrets
5. Deploy ke production

Good luck! 🚀
