# Quick Setup Guide - Without Docker

Panduan cepat untuk setup Desa Ku Bisa tanpa Docker/MySQL installed.

## 🚀 Opsi 1: Download MySQL Installer (Recommended)

### Step 1: Download MySQL
1. Buka: https://dev.mysql.com/downloads/mysql/
2. Pilih: **Windows (x86, 64-bit), MSI Installer**
3. Download file `.msi` (kurang lebih 320MB)

### Step 2: Install MySQL
1. Double-click installer
2. Pilih: **Setup Type: Custom** (optional)
3. Pilih: **MySQL Server** (at minimum)
4. Install ke default location (C:\Program Files\MySQL\MySQL Server 8.0)
5. Configure:
   - **Config Type**: Development Machine
   - **Port**: 3306 (default)
   - **Service Name**: MySQL80
6. MySQL Notifier akan prompt root password:
   - **Root Password**: `password` (sesuai dengan DB_PASSWORD di .env)
   - Confirm password

### Step 3: Start MySQL Service
Buka **Services** (services.msc):
- Cari: MySQL80
- Klik: Start (jika belum running)

Atau pakai Command Prompt:
```cmd
net start MySQL80
```

### Step 4: Create Database
Buka Command Prompt:

```cmd
mysql -u root -p
```

Masukkan password: `password`

Kemudian copy-paste ini di MySQL CLI:

```sql
CREATE DATABASE IF NOT EXISTS desa_ku_bisa;
USE desa_ku_bisa;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nik VARCHAR(16) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  role ENUM('admin', 'warga') DEFAULT 'warga',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nik (nik)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS surats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jenisSurat VARCHAR(100) NOT NULL,
  keperluan VARCHAR(255) NOT NULL,
  keterangan TEXT,
  status ENUM('pending', 'proses', 'selesai') DEFAULT 'pending',
  fileUrl VARCHAR(500),
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO users (nik, password, nama, role) VALUES 
('0000000000000001', '$2a$10$YOvVawI4r23cZEq6i0nFT.Ws47dMANLDvvXnxFr1a2Ls./mVTWtKq', 'Admin Desa', 'admin');

INSERT IGNORE INTO users (nik, password, nama, role) VALUES 
('1234567890123456', '$2a$10$mTIrGp5c8iA6RiU8EqCdcOLh3j7CxMQMRZ3vXQJyK.qL5CY3V0LOG', 'Budi Santoso', 'warga');

SELECT * FROM users;
EXIT;
```

---

## 🚀 Opsi 2: Run Migration Script (Faster)

### Step 1: Ensure MySQL Running
```cmd
mysql -u root -p
EXIT;
```

Jika error "mysql command not found", need install MySQL dulu.

### Step 2: Run Migration Script
```cmd
cd "d:\SEMESTER 6\Komputasi Awan\desa_ku_bisa\backend"
mysql -u root -p < migration.sql
```

Masukkan password: `password`

Output:
```
Users Table:
...data...
Surats Table:
...
Status: Migration complete!
```

---

## ✅ Verify Setup

### Terminal 1: Backend
```cmd
cd "d:\SEMESTER 6\Komputasi Awan\desa_ku_bisa\backend"
npm run dev
```

Output:
```
✓ Server running on http://localhost:5000
✓ Environment: development
```

### Terminal 2: Frontend
```cmd
cd "d:\SEMESTER 6\Komputasi Awan\desa_ku_bisa\frontend"
npm run dev
```

Output:
```
  VITE v8.0.9  ready in 123 ms
  ➜  Local:   http://localhost:5173/
```

### Test in Browser
1. Open: http://localhost:5173
2. Click "Mulai Sekarang"
3. Login dengan:
   - NIK: 0000000000000001
   - Password: admin123

---

## 🧪 API Test (Curl)

### Login
```cmd
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"nik\":\"0000000000000001\",\"password\":\"admin123\"}"
```

Expected response:
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "nik": "0000000000000001",
    "nama": "Admin Desa",
    "role": "admin"
  }
}
```

---

## ❌ Troubleshooting

### "mysql command not found"
- Need install MySQL Server
- Follow **Opsi 1** step 1-3

### "Access denied for user 'root'@'localhost'"
- Check password di .env (default: `password`)
- Atau reset password MySQL

### "Can't connect to MySQL server on 'localhost'"
- MySQL service not running
- Run: `net start MySQL80`

### "Unknown database 'desa_ku_bisa'"
- Run migration.sql again

---

## Kesimpulan

Sekarang Anda punya:
✅ MySQL database running
✅ Tables created (users, surats)
✅ Default admin & warga test data
✅ Backend ready to connect
✅ Frontend ready to use

Next: Start backend dan frontend, test di browser!
