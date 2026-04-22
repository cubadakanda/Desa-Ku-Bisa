# Deployment Guide - Desa Ku Bisa

Panduan lengkap untuk deploy aplikasi ke AWS EC2 dengan Docker, RDS, dan S3.

## 1. Persiapan AWS Resources

### 1.1 RDS MySQL Database

1. Buka AWS Management Console → RDS
2. Klik "Create database"
3. Engine: MySQL 8.0 (atau lebih baru)
4. DB instance identifier: `desa-ku-bisa-db`
5. Master username: `admin`
6. Master password: `YourStrongPassword123!`
7. DB instance class: `db.t3.micro` (free tier eligible)
8. Storage: `20 GB` (general purpose SSD)
9. Multi-AZ: Disabled (untuk cost optimization)
10. VPC Security Group: Buat baru atau pilih existing yang allow:
    - Inbound rule: MySQL/Aurora port 3306 dari EC2 security group
11. Initial database name: `desa_ku_bisa`
12. Klik "Create database"
13. Tunggu hingga status "Available" (~10 menit)

**Catat**: Endpoint RDS (misal: `desa-ku-bisa-db.xxxxx.ap-southeast-1.rds.amazonaws.com`)

### 1.2 S3 Bucket untuk File Upload

1. Buka AWS Management Console → S3
2. Klik "Create bucket"
3. Bucket name: `desa-ku-bisa-uploads-nrp152023141` (harus unik globally)
4. Region: Asia Pacific (Singapore) `ap-southeast-1`
5. ACL: Private (block public access)
6. Versioning: Enabled (optional)
7. Encryption: AES-256 (default)
8. Klik "Create bucket"

**Upload Policy**:
1. Pilih bucket → Permission tab
2. Bucket Policy → Edit

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:user/backend-user"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::desa-ku-bisa-uploads-nrp152023141/*"
    }
  ]
}
```

### 1.3 IAM User untuk S3 Access

1. Buka AWS Management Console → IAM
2. Klik "Users" → "Create user"
3. User name: `desa-ku-bisa-backend`
4. Attach policies: `AmazonS3FullAccess` (atau custom policy)
5. Klik "Create user"
6. Di Security credentials tab → Create access key
7. Catat:
   - Access Key ID
   - Secret Access Key

### 1.4 EC2 Instance

1. Buka AWS Management Console → EC2
2. Klik "Launch instances"
3. Name: `desa-ku-bisa-server`
4. AMI: Ubuntu Server 22.04 LTS (t3.micro eligible for free tier)
5. Instance type: `t3.micro`
6. Key pair: Buat baru atau pilih existing
   - Name: `desa-ku-bisa-key`
   - Save `.pem` file secara aman
7. Network settings:
   - VPC: Sama dengan RDS
   - Subnet: Pilih yang berada di region yang sama
   - Security group: Buat baru
     - Allow SSH (port 22) dari IP Anda
     - Allow HTTP (port 80) dari semua (0.0.0.0/0)
     - Allow HTTPS (port 443) dari semua
     - Allow port 5000 dari semua (backend)
8. Storage: 30 GB gp3
9. Klik "Launch instance"
10. Tunggu status "Running"

**Catat**: Public IP address atau DNS EC2

## 2. Setup EC2 Instance

### 2.1 Connect ke EC2

```bash
# Dari local machine
ssh -i /path/to/desa-ku-bisa-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# atau jika punya DNS
ssh -i /path/to/desa-ku-bisa-key.pem ubuntu@YOUR_EC2_DNS
```

### 2.2 Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker ubuntu

# Logout dan login kembali
exit
ssh -i /path/to/desa-ku-bisa-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Verify
docker --version
docker compose version
```

### 2.3 Clone Repository

```bash
cd ~
git clone https://github.com/YOUR_GITHUB_USERNAME/desa-ku-bisa.git
cd desa-ku-bisa
```

### 2.4 Configure Environment Variables

```bash
# Backend environment
cat > backend/.env.production << EOF
PORT=5000
NODE_ENV=production
DB_HOST=your-rds-endpoint.ap-southeast-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=YourStrongPassword123!
DB_NAME=desa_ku_bisa
JWT_SECRET=your-super-secret-jwt-key-change-this
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=YOUR_IAM_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_IAM_SECRET_KEY
AWS_BUCKET_NAME=desa-ku-bisa-uploads-nrp152023141
CORS_ORIGIN=https://your-domain.com
EOF

# Frontend environment
cat > frontend/.env.production << EOF
VITE_API_URL=https://your-domain.com/api
EOF
```

## 3. GitHub Actions Setup

### 3.1 Create Docker Hub Access Token

1. Login ke Docker Hub
2. Account settings → Security → New Access Token
3. Name: `desa-ku-bisa-token`
4. Catat token tersebut

### 3.2 GitHub Secrets

Di repository settings → Secrets and variables → Actions → New repository secret:

```
DOCKERHUB_USERNAME = your-dockerhub-username
DOCKERHUB_TOKEN = your-dockerhub-token
EC2_HOST = your-ec2-public-ip
EC2_USER = ubuntu
EC2_SSH_KEY = (paste content dari .pem file)
```

### 3.3 Push ke Main Branch

```bash
git add .
git commit -m "Add deployment files"
git push origin main
```

GitHub Actions akan otomatis:
1. Build Docker images
2. Push ke Docker Hub
3. Deploy ke EC2 via SSH

## 4. Manual Deployment (Alternative)

Jika tidak ingin menggunakan GitHub Actions:

```bash
# SSH ke EC2
ssh -i desa-ku-bisa-key.pem ubuntu@YOUR_EC2_IP

# Login ke Docker Hub
docker login

# Pull images
docker pull YOUR_DOCKERHUB_USERNAME/desa-ku-bisa-frontend:latest
docker pull YOUR_DOCKERHUB_USERNAME/desa-ku-bisa-backend:latest

# Start containers
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker compose logs -f
```

## 5. SSL/HTTPS Setup (Let's Encrypt)

### 5.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Create Nginx Config

```bash
sudo mkdir -p /etc/nginx/conf.d
cat > /tmp/desa-ku-bisa.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

sudo mv /tmp/desa-ku-bisa.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl restart nginx
```

### 5.3 Get SSL Certificate

```bash
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## 6. Database Initialization

### 6.1 Connect ke RDS

```bash
# Install MySQL client jika belum ada
sudo apt install -y mysql-client

# Connect ke RDS
mysql -h your-rds-endpoint.ap-southeast-1.rds.amazonaws.com \
      -u admin -p desa_ku_bisa
```

### 6.2 Seed Data (Admin Account)

```bash
# Dari EC2 container
docker exec desa-ku-bisa-backend npm run seed
```

## 7. Monitoring & Maintenance

### 7.1 View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### 7.2 Update Application

```bash
# Pull latest images
docker pull YOUR_DOCKERHUB_USERNAME/desa-ku-bisa-frontend:latest
docker pull YOUR_DOCKERHUB_USERNAME/desa-ku-bisa-backend:latest

# Restart services
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

### 7.3 Backup Database

```bash
# Backup RDS (via AWS console atau AWS CLI)
aws rds create-db-snapshot \
  --db-instance-identifier desa-ku-bisa-db \
  --db-snapshot-identifier desa-ku-bisa-backup-$(date +%Y%m%d)
```

## 8. Cost Estimation (Monthly, Singapore Region)

- EC2 t3.micro: $0 (free tier first 12 months)
- RDS MySQL t3.micro: $0 (free tier)
- S3 Storage (first 1GB): $0; per additional: $0.025/GB
- Data Transfer Out: $0.114/GB

**Total**: Kurang dari $1/bulan (dengan free tier)

## 9. Troubleshooting

### Container tidak bisa connect ke RDS
```bash
# Check RDS security group
# Pastikan inbound rule 3306 allow dari EC2 security group

# Test connection dari EC2
mysql -h your-rds-endpoint -u admin -p desa_ku_bisa
```

### S3 upload fail
```bash
# Verifikasi credentials di .env
# Check IAM user policy
# Check S3 bucket policy
# Check file size (max 10MB)
```

### Frontend tidak bisa reach backend
```bash
# Check container networking
docker network ls
docker network inspect desa-network

# Check backend health
curl http://localhost:5000/health

# Check CORS origin di backend .env
```

### GitHub Actions deployment fail
```bash
# Check EC2 SSH key format
# Verify secrets di GitHub
# Check EC2 security group allow port 22
```

## 10. Testing di Production

1. **Login Test**
   ```bash
   curl -X POST https://your-domain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"nik":"0000000000000001","password":"admin123"}'
   ```

2. **Get Users (Admin)**
   ```bash
   curl -X GET https://your-domain.com/api/warga \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Upload File**
   ```bash
   curl -X POST https://your-domain.com/api/surat \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "jenisSurat=Surat Domisili" \
     -F "keperluan=Test" \
     -F "lampiran=@test.pdf"
   ```

## Notes Penting

- Jangan share `.pem` file EC2 key secara publik
- Ganti JWT_SECRET dengan value yang kuat dan random
- Backup database secara berkala
- Monitor CloudWatch untuk metrics dan alarms
- Setup email notifications untuk error alerts
- Dokumentasikan semua credentials di password manager yang aman

## Support & Resources

- AWS Free Tier: https://aws.amazon.com/free/
- Docker Compose: https://docs.docker.com/compose/
- GitHub Actions: https://docs.github.com/en/actions
- Let's Encrypt: https://letsencrypt.org/
