import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    // Sync database (create tables if not exist)
    await db.sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
    console.log("✓ Database synced");

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
