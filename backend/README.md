# Backend - Desa Ku Bisa

API server untuk platform digital layanan desa menggunakan Node.js, Express, dan Sequelize ORM.

## Tech Stack

- **Framework**: Express.js 4.18.2
- **Database**: MySQL dengan Sequelize ORM 6.35.2
- **Authentication**: JWT (jsonwebtoken 9.1.2)
- **Password Hashing**: bcryptjs 2.4.3
- **File Upload**: Multer 1.4.5
- **Cloud Storage**: AWS S3 (@aws-sdk/client-s3)
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv

## Setup Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` ke `.env` dan update dengan credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
```

### 3. Setup Database

```bash
# Lokal: Buat database MySQL
mysql -u root -p
CREATE DATABASE desa_ku_bisa;

# Atau gunakan Docker
docker-compose up -d db
```

### 4. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login dengan NIK dan password

### User Management (Admin Only)
- `POST /api/warga` - Buat user baru
- `GET /api/warga` - Daftar semua user
- `GET /api/warga/:id` - Detail user
- `PUT /api/warga/:id` - Update user
- `DELETE /api/warga/:id` - Hapus user

### Pengajuan Surat (Warga)
- `POST /api/surat` - Buat pengajuan surat (dengan upload file)
- `GET /api/surat/my` - Tracking pengajuan saya

### Antrian Surat (Admin Only)
- `GET /api/surat/all` - Semua pengajuan (antrian)
- `PUT /api/surat/:id/status` - Update status pengajuan

## Database Models

### User
```sql
- id (PK, auto increment)
- nik (unique, varchar)
- password (hashed)
- nama (varchar)
- role (enum: admin, warga)
- createdAt
- updatedAt
```

### Surat
```sql
- id (PK, auto increment)
- jenisSurat (varchar)
- keperluan (varchar)
- keterangan (text)
- status (enum: pending, proses, selesai)
- fileUrl (varchar - S3 URL)
- userId (FK to User)
- createdAt
- updatedAt
```

## Docker Deployment

### Local Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

Deployment ke EC2:
1. Konfigurasi GitHub Secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`
2. Push ke branch `main` akan trigger GitHub Actions
3. Otomatis build, push ke Docker Hub, dan deploy ke EC2

## File Structure

```
backend/
├── src/
│   ├── server.js              # Main entry point
│   ├── config/
│   │   └── database.js        # Sequelize config
│   ├── models/
│   │   ├── User.js
│   │   ├── Surat.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── warga.js
│   │   └── surat.js
│   └── middleware/
│       ├── auth.js            # JWT verification & role authorization
│       └── upload.js          # Multer + S3 upload
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

## Testing Endpoints

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nik":"1234567890123456","password":"password123"}'
```

### Buat User Baru (Admin)
```bash
curl -X POST http://localhost:5000/api/warga \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nik":"1234567890123456","password":"pass","nama":"John Doe","role":"warga"}'
```

### Upload Surat dengan File
```bash
curl -X POST http://localhost:5000/api/surat \
  -H "Authorization: Bearer <token>" \
  -F "jenisSurat=Surat Domisili" \
  -F "keperluan=Administrasi" \
  -F "lampiran=@file.pdf"
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT secret key
- `AWS_REGION` - AWS region
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_BUCKET_NAME` - S3 bucket name
- `CORS_ORIGIN` - CORS allowed origins

## Notes

- JWT tokens expire dalam 7 hari
- File uploads dibatasi 10MB
- Supported file types: PDF, JPG, PNG
- S3 files disimpan dengan struktur: `uploads/{uuid}-{timestamp}-{filename}`
- Password minimal tidak ada validasi - tambahkan sesuai kebutuhan

## Troubleshooting

### Database Connection Error
- Pastikan MySQL running
- Check credentials di `.env`
- Verifikasi database sudah dibuat

### S3 Upload Error
- Verifikasi AWS credentials
- Pastikan bucket name benar
- Check S3 bucket permissions

### JWT Token Invalid
- Token mungkin sudah expired (7 hari)
- Refresh dengan login ulang
- Check JWT_SECRET konsisten

## Development Guidelines

1. Semua endpoint protected perlu authentication (kecuali /auth/login)
2. Admin-only endpoints perlu `authorize(["admin"])` middleware
3. User data tidak pernah return password di response
4. Semua error messages dalam Bahasa Indonesia
5. Timestamps di database otomatis (Sequelize)
