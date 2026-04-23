import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { db } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import wargaRoutes from "./routes/warga.js";
import suratRoutes from "./routes/surat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
// Perbesar limit body-parser agar upload file besar tidak error 413
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/warga", wargaRoutes);
app.use("/api/surat", suratRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan server",
  });
});

// Sync database dan start server
const startServer = async () => {
  try {
    // Create tables first when database is empty.
    await db.sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
    console.log("✓ Database synced");

    const ensureColumn = async (columnName, columnDefinition) => {
      const [rows] = await db.sequelize.query(
        "SELECT COUNT(*) AS columnCount FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = :columnName",
        {
          replacements: { columnName },
        }
      );

      if (!rows?.[0]?.columnCount) {
        await db.sequelize.query(`ALTER TABLE users ADD COLUMN ${columnDefinition}`);
      }
    };

    // Ensure profile columns exist for warga CRUD fields.
    await ensureColumn("alamat", "alamat TEXT NULL");
    await ensureColumn("dusun", "dusun VARCHAR(255) NULL");
    await ensureColumn("rt", "rt VARCHAR(50) NULL");
    await ensureColumn("status", "status ENUM('aktif','mutasi','nonaktif') NOT NULL DEFAULT 'aktif'");
    await ensureColumn(
      "jenisKelamin",
      "jenisKelamin ENUM('Laki-laki','Perempuan') NOT NULL DEFAULT 'Laki-laki'"
    );

    // Start listening
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
