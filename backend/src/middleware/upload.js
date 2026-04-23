import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Konfigurasi S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Storage multer pakai memory
const storage = multer.memoryStorage();
const localUploadDir = path.join(process.cwd(), "uploads");

// Filter file yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file tidak didukung. Gunakan PDF, JPG, atau PNG."));
  }
};

// Middleware upload
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Fungsi upload ke S3 atau local
export const uploadToS3 = async (file, req) => {
  if (!file) return null;

  const hasAwsConfig =
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY;

  // Jika tidak ada config AWS atau bukan production, simpan ke local
  if (!hasAwsConfig || process.env.NODE_ENV !== "production") {
    await fs.mkdir(localUploadDir, { recursive: true });

    const safeFileName = `${uuidv4()}-${Date.now()}-${file.originalname}`.replace(/\s+/g, "-");
    const filePath = path.join(localUploadDir, safeFileName);
    await fs.writeFile(filePath, file.buffer);

    const baseUrl =
      process.env.PUBLIC_BASE_URL ||
      `${req?.protocol || "http"}://${req?.get("host") || `localhost:${process.env.PORT || 5000}`}`;

    return `${baseUrl}/uploads/${safeFileName}`;
  }

  // Jika production dan config AWS lengkap, upload ke S3
  const fileName = `uploads/${uuidv4()}-${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Gagal upload file ke S3");
  }
};