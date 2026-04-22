# AWS Setup Guide - Desa Ku Bisa

Panduan lengkap setup AWS infrastructure untuk production deployment. Semua di free tier! 🎉

---

## 📋 Prerequisites

- AWS Account (free tier) - https://aws.amazon.com/free/
- Docker Hub account dengan images yang sudah di-push
- SSH keypair untuk EC2 access

---

## 🚀 Step 1: Setup RDS MySQL Database

### 1.1 Create RDS Instance

1. Buka AWS Console: https://console.aws.amazon.com
2. Search: **RDS** → Click
3. Dashboard → **Create database**

### 1.2 Configure Database

**Engine Options:**
- Engine: **MySQL**
- Version: **8.0.36** (latest compatible)
- Template: **Free tier**

**DB Instance Identifier:**
```
desa-ku-bisa-db
```

**Credentials Settings:**
- Master username: `admin`
- Master password: `YourStrongPassword123!` (remember this!)

**DB Instance Class:**
- **db.t3.micro** (free tier eligible)

**Storage:**
- Allocated storage: **20 GB** (free tier)
- Storage type: **General Purpose (SSD)**
- Storage autoscaling: **Enable**

**Connectivity:**
- VPC: **Default VPC**
- DB subnet group: **Create new**
- Public accessibility: **Yes**
- VPC security group: **Create new** → name: `desa-ku-bisa-db-sg`
- Availability Zone: **ap-southeast-1a** (Singapore)
- Database port: **3306** (default)

**Database Options:**
- Initial database name: `desa_ku_bisa`
- DB Parameter group: **default.mysql8.0**
- Option group: **default:mysql-8-0**

**Backups:**
- Backup retention period: **7 days**
- Backup window: **Default**
- Copy backups to another region: **Disable** (optional, untuk production enable)

**Enhanced Monitoring:**
- Enable Enhanced monitoring: **Disable** (optional)

**Logs Exports:**
- Enable CloudWatch Logs: **Error log, General log, Slowquery log** (optional)

**Encryption & Performance Insights:**
- Enable encryption: **Enable** (default KMS key)
- Performance Insights: **Disable** (optional)

**Click: Create database** ⏳ Wait 5-10 minutes for RDS to be created

---

## 🔐 Step 2: Configure RDS Security Group

After RDS is created:

1. Go to **RDS** → **Databases** → `desa-ku-bisa-db`
2. Copy **Endpoint** (will look like: `desa-ku-bisa-db.xxxxx.ap-southeast-1.rds.amazonaws.com`)
3. Scroll down → **Security group rules**
4. Click security group → **Inbound rules**
5. **Edit inbound rules**
   - Type: **MySQL/Aurora**
   - Protocol: **TCP**
   - Port: **3306**
   - Source: **Anywhere (0.0.0.0/0)** (or EC2 SG later)
6. **Save rules**

**Test Connection:**
```bash
mysql -h desa-ku-bisa-db.xxxxx.ap-southeast-1.rds.amazonaws.com -u admin -p
# Masukkan password: YourStrongPassword123!
```

---

## 📦 Step 3: Setup S3 Bucket

### 3.1 Create S3 Bucket

1. Search: **S3** → Click
2. **Create bucket**

**Bucket name:**
```
desa-ku-bisa-nrp152023141
```
(must be globally unique!)

**Region:** **ap-southeast-1** (Singapore)

**Block Public Access Settings:**
- Block all public access: **OFF** ✓
  - Uncheck all 4 options
  - (Will set specific permission later)

**Versioning:** **Enable** (optional, for backup)

**Encryption:** **Enable with Amazon S3-managed keys**

**Click: Create bucket**

### 3.2 Configure S3 Bucket Policy

1. Click bucket → **Permissions** tab
2. Scroll to **Bucket policy** → **Edit**
3. Paste policy (update bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBackendUpload",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:user/backend-app"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::desa-ku-bisa-nrp152023141/*"
    }
  ]
}
```

4. **Save changes**

### 3.3 Configure CORS

1. Bucket → **Configuration** tab → **CORS**
2. **Edit CORS**
3. Paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. **Save changes**

---

## 👤 Step 4: Create IAM User untuk Backend

### 4.1 Create IAM User

1. Search: **IAM** → Click
2. **Users** → **Create user**

**User name:**
```
backend-app
```

**Set permissions:**
- Choose: **Attach policies directly**
- Search: `AmazonS3FullAccess`
- Check the policy
- **Create user**

### 4.2 Generate Access Keys

1. Click user: `backend-app`
2. **Security credentials** tab
3. **Create access key**
4. Use case: **Application running outside AWS**
5. **Create access key**

⚠️ **IMPORTANT**: Copy dan simpan:
- **Access Key ID**
- **Secret Access Key**

(Tidak bisa dilihat lagi setelah close!)

---

## 🖥️ Step 5: Setup EC2 Instance

### 5.1 Create EC2 Instance

1. Search: **EC2** → Click
2. **Instances** → **Launch instances**

**Name and tags:**
```
desa-ku-bisa-server
```

**AMI:** Ubuntu Server 22.04 LTS (free tier eligible)

**Instance type:** **t3.micro** (free tier)

**Key pair:**
- Create new key pair
- Name: `desa-ku-bisa-key`
- Key pair type: **RSA**
- Format: `.pem` (for Mac/Linux) or `.ppk` (for Windows PuTTY)
- **Create key pair** → Save `.pem` file aman!

**Network settings:**
- VPC: **Default VPC**
- Subnet: **Default subnet in ap-southeast-1a**
- Auto-assign public IP: **Enable**
- Firewall (Security group): **Create security group**
  - Name: `desa-ku-bisa-sg`
  - Description: "Security group for Desa Ku Bisa app"

**Inbound rules:**
- Rule 1: SSH
  - Type: SSH
  - Protocol: TCP
  - Port: 22
  - Source: **My IP** (atau **Anywhere** untuk testing)
  
- Rule 2: HTTP
  - Type: HTTP
  - Protocol: TCP
  - Port: 80
  - Source: **Anywhere (0.0.0.0/0)**
  
- Rule 3: HTTPS
  - Type: HTTPS
  - Protocol: TCP
  - Port: 443
  - Source: **Anywhere (0.0.0.0/0)**

- Rule 4: Custom TCP (Backend API)
  - Type: Custom TCP
  - Protocol: TCP
  - Port: 5000
  - Source: **Anywhere (0.0.0.0/0)**

**Storage:**
- Volume size: **30 GB** (or 8GB if using free tier)
- Volume type: **gp3**

**Click: Launch instance** ⏳ Wait 1-2 minutes

---

## 🔗 Step 6: Connect to EC2

### 6.1 Get EC2 Details

1. Click instance → Copy:
   - **Public IPv4 address** (e.g., `18.1.2.3`)
   - **Public IPv4 DNS** (e.g., `ec2-18-1-2-3.ap-southeast-1.compute.amazonaws.com`)

### 6.2 SSH Connect (Windows)

**Using Windows Subsystem for Linux (WSL) atau Git Bash:**

```bash
# Set key permission
chmod 400 desa-ku-bisa-key.pem

# Connect
ssh -i desa-ku-bisa-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Or using PuTTY (Windows):**
1. Download PuTTY: https://www.putty.org/
2. Download PuTTYgen
3. Open PuTTYgen → Load `.pem` → Save as `.ppk`
4. Open PuTTY:
   - Host: `ubuntu@YOUR_EC2_PUBLIC_IP`
   - Auth → Private key: select `.ppk`
   - Open

---

## ⚙️ Step 7: Setup EC2 Instance

### 7.1 Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 7.2 Install Docker

```bash
# Install Docker
sudo apt install -y docker.io docker-compose-plugin

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Verify
docker --version
docker compose version
```

### 7.3 Clone Repository

```bash
cd ~
git clone https://github.com/cubadakanda/Desa-Ku-Bisa.git
cd Desa-Ku-Bisa
```

### 7.4 Create Environment File

```bash
cat > backend/.env.production << 'EOF'
PORT=5000
NODE_ENV=production
DB_HOST=desa-ku-bisa-db.xxxxx.ap-southeast-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=YourStrongPassword123!
DB_NAME=desa_ku_bisa
JWT_SECRET=your-super-secret-jwt-key-change-this
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=YOUR_IAM_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_IAM_SECRET_ACCESS_KEY
AWS_BUCKET_NAME=desa-ku-bisa-nrp152023141
CORS_ORIGIN=http://YOUR_EC2_PUBLIC_IP
EOF
```

Update values:
- `DB_HOST`: RDS endpoint (from Step 1)
- `DB_PASSWORD`: RDS password
- `JWT_SECRET`: Generate random string (min 32 chars)
- `AWS_ACCESS_KEY_ID`: From IAM user (Step 4)
- `AWS_SECRET_ACCESS_KEY`: From IAM user (Step 4)
- `AWS_BUCKET_NAME`: S3 bucket name (Step 3)
- `YOUR_EC2_PUBLIC_IP`: EC2 public IP

### 7.5 Create docker-compose.prod.yml

```bash
cat > docker-compose.prod.yml << 'EOF'
version: "3.8"

services:
  backend:
    image: cubadakanda/desa-ku-bisa-backend:latest
    container_name: desa-ku-bisa-backend
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      NODE_ENV: production
      DB_HOST: ${DB_HOST}
      DB_PORT: ${DB_PORT}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      AWS_REGION: ${AWS_REGION}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_BUCKET_NAME: ${AWS_BUCKET_NAME}
      CORS_ORIGIN: ${CORS_ORIGIN}
    restart: unless-stopped
    networks:
      - app-network

  frontend:
    image: cubadakanda/desa-ku-bisa-frontend:latest
    container_name: desa-ku-bisa-frontend
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://${CORS_ORIGIN}:5000/api
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF
```

---

## 🚀 Step 8: Start Application

### 8.1 Pull Latest Images

```bash
docker pull cubadakanda/desa-ku-bisa-backend:latest
docker pull cubadakanda/desa-ku-bisa-frontend:latest
```

### 8.2 Load Environment

```bash
cd ~/Desa-Ku-Bisa
export $(cat backend/.env.production | xargs)
```

### 8.3 Start Containers

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 8.4 Verify

```bash
# Check containers running
docker ps

# Check logs
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

---

## 🔗 Step 9: Access Application

### Frontend
```
http://YOUR_EC2_PUBLIC_IP
```

### Backend API
```
http://YOUR_EC2_PUBLIC_IP:5000/api
```

### Health Check
```bash
curl http://YOUR_EC2_PUBLIC_IP:5000/health
```

---

## 📊 Database Initial Setup

### 9.1 Connect to RDS dari EC2

```bash
# Install MySQL client
sudo apt install -y mysql-client

# Connect to RDS
mysql -h desa-ku-bisa-db.xxxxx.ap-southeast-1.rds.amazonaws.com \
      -u admin -p desa_ku_bisa
```

Masukkan password RDS Anda

### 9.2 Create Tables & Seed Data

Copy-paste dari `backend/migration.sql`:

```sql
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

## ✅ Test Login

**Admin:**
- NIK: `0000000000000001`
- Password: `admin123`

**Warga:**
- NIK: `1234567890123456`
- Password: `warga123`

---

## 💰 Cost Estimation (Monthly)

- EC2 t3.micro: **FREE** (first 12 months)
- RDS MySQL t3.micro: **FREE** (first 12 months)
- S3 (first 1GB): **FREE**
- Data transfer: **~$0.11 per GB**

**Total: FREE (if under 1 GB/month)**

---

## 🔒 Security Tips

1. Change RDS password to something strong
2. Change JWT_SECRET to random strong value
3. Restrict SSH access (Security Group)
4. Enable RDS backups
5. Use HTTPS (Let's Encrypt)
6. Rotate IAM keys periodically

---

## 📝 Troubleshooting

### Cannot connect to RDS from EC2
- Check Security Group rules (port 3306 open)
- Verify RDS endpoint correct
- Check password correct

### S3 upload fails
- Verify IAM credentials correct
- Check S3 bucket name exact
- Check IAM policy attached

### Frontend/Backend not communicating
- Check EC2 security group (port 5000 open)
- Check CORS_ORIGIN in .env correct
- Check backend logs: `docker compose logs backend`

---

## 🎉 Congratulations!

Application is now deployed to AWS! 🚀

Next: Setup domain name, SSL certificate, monitoring alerts.

---

**For questions, refer to:**
- AWS Documentation: https://docs.aws.amazon.com/
- Docker Docs: https://docs.docker.com/
- Node.js Docs: https://nodejs.org/
