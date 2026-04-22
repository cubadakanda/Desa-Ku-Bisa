-- ============================================
-- Desa Ku Bisa - Database Migration Script
-- ============================================
-- Run this in MySQL CLI:
-- mysql -u root -p < migration.sql

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS desa_ku_bisa;
USE desa_ku_bisa;

-- 2. Create Users Table
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

-- 3. Create Surat Table
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

-- ============================================
-- Seed Default Data (Optional)
-- ============================================

-- Default Admin User (NIK: 0000000000000001, Password: admin123)
-- Password hash: $2a$10$xxx... (bcryptjs hash)
INSERT IGNORE INTO users (nik, password, nama, role) VALUES 
('0000000000000001', '$2a$10$YOvVawI4r23cZEq6i0nFT.Ws47dMANLDvvXnxFr1a2Ls./mVTWtKq', 'Admin Desa', 'admin');

-- Test Warga User (NIK: 1234567890123456, Password: warga123)
INSERT IGNORE INTO users (nik, password, nama, role) VALUES 
('1234567890123456', '$2a$10$mTIrGp5c8iA6RiU8EqCdcOLh3j7CxMQMRZ3vXQJyK.qL5CY3V0LOG', 'Budi Santoso', 'warga');

-- ============================================
-- Verification
-- ============================================
SELECT 'Users Table:' as '';
SELECT * FROM users;
SELECT 'Surats Table:' as '';
SELECT * FROM surats;
SELECT 'Migration complete!' as 'Status';
