import express from "express";
import { db } from "../models/index.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { upload, uploadToS3 } from "../middleware/upload.js";

const router = express.Router();
const { Surat } = db;

// Warga: Create surat (with file upload)
export const createSurat = async (req, res) => {
  const { jenisSurat, keperluan, keterangan } = req.body;
  const userId = req.user.id;

  if (!jenisSurat || !keperluan) {
    return res.status(400).json({ message: "Jenis surat dan keperluan harus diisi" });
  }

  try {
    let fileUrl = null;

    // Upload ke S3 jika ada file
    if (req.file) {
      fileUrl = await uploadToS3(req.file, req);
    }

    const surat = await Surat.create({
      jenisSurat,
      keperluan,
      keterangan: keterangan || null,
      fileUrl,
      userId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Pengajuan surat berhasil dibuat",
      surat,
    });
  } catch (error) {
    console.error("Create surat error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Warga: Get my surat (tracking)
export const getMySurat = async (req, res) => {
  const userId = req.user.id;

  try {
    const surats = await Surat.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(surats);
  } catch (error) {
    console.error("Get my surat error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Admin: Get all surat (antrian)
export const getAllSurat = async (req, res) => {
  try {
    const surats = await Surat.findAll({
      include: [
        {
          association: "user",
          attributes: ["id", "nik", "nama"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json(surats);
  } catch (error) {
    console.error("Get all surat error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Admin: Update surat status
export const updateSuratStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "proses", "selesai"].includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  try {
    const surat = await Surat.findByPk(id);

    if (!surat) {
      return res.status(404).json({ message: "Surat tidak ditemukan" });
    }

    surat.status = status;
    await surat.save();

    return res.status(200).json({
      message: "Status surat berhasil diperbarui",
      surat,
    });
  } catch (error) {
    console.error("Update surat status error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Routes
router.post("/", authenticate, upload.single("lampiran"), createSurat);
router.get("/my", authenticate, getMySurat);
router.get("/all", authenticate, authorize(["admin"]), getAllSurat);
router.put("/:id/status", authenticate, authorize(["admin"]), updateSuratStatus);

export default router;
