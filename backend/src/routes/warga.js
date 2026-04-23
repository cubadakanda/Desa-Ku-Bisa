import express from "express";
import bcryptjs from "bcryptjs";
import { db } from "../models/index.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();
const { User } = db;

// Admin: Create user (warga)
export const createUser = async (req, res) => {
  const { nik, password, nama, alamat, dusun, rt, status, jenisKelamin, role } = req.body;

  if (!nik || !nama) {
    return res.status(400).json({ message: "NIK dan nama wajib diisi" });
  }

  try {
    const existingUser = await User.findOne({ where: { nik } });
    if (existingUser) {
      return res.status(409).json({ message: "NIK sudah terdaftar" });
    }

    // Admin form does not provide password; use a safe default for first login.
    const plainPassword = password || "warga123";
    const hashedPassword = await bcryptjs.hash(plainPassword, 10);
    const user = await User.create({
      nik,
      password: hashedPassword,
      nama,
      alamat: alamat || null,
      dusun: dusun || null,
      rt: rt || null,
      status: status || "aktif",
      jenisKelamin: jenisKelamin || "Laki-laki",
      role: role || "warga",
    });

    return res.status(201).json({
      message: "User berhasil dibuat",
      initialPassword: password ? undefined : plainPassword,
      user: {
        id: user.id,
        nik: user.nik,
        nama: user.nama,
        alamat: user.alamat,
        dusun: user.dusun,
        rt: user.rt,
        status: user.status,
        jenisKelamin: user.jenisKelamin,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "nik",
        "nama",
        "alamat",
        "dusun",
        "rt",
        "status",
        "jenisKelamin",
        "role",
        "createdAt",
        "updatedAt",
      ],
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Admin: Get single user
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "nik",
        "nama",
        "alamat",
        "dusun",
        "rt",
        "status",
        "jenisKelamin",
        "role",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Admin: Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nik, password, nama, alamat, dusun, rt, status, jenisKelamin, role } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (nik && nik !== user.nik) {
      const existingUser = await User.findOne({ where: { nik } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(409).json({ message: "NIK sudah terdaftar" });
      }
      user.nik = nik;
    }

    if (typeof nama !== "undefined") user.nama = nama;
    if (typeof password === "string" && password.trim()) {
      user.password = await bcryptjs.hash(password, 10);
    }
    if (typeof alamat !== "undefined") user.alamat = alamat;
    if (typeof dusun !== "undefined") user.dusun = dusun;
    if (typeof rt !== "undefined") user.rt = rt;
    if (typeof status !== "undefined") user.status = status;
    if (typeof jenisKelamin !== "undefined") user.jenisKelamin = jenisKelamin;
    if (typeof role !== "undefined") user.role = role;

    await user.save();

    return res.status(200).json({
      message: "User berhasil diperbarui",
      user: {
        id: user.id,
        nik: user.nik,
        nama: user.nama,
        alamat: user.alamat,
        dusun: user.dusun,
        rt: user.rt,
        status: user.status,
        jenisKelamin: user.jenisKelamin,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await user.destroy();

    return res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

router.post("/", authenticate, authorize(["admin"]), createUser);
router.get("/", authenticate, authorize(["admin"]), getAllUsers);
router.get("/:id", authenticate, authorize(["admin"]), getUser);
router.put("/:id", authenticate, authorize(["admin"]), updateUser);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

export default router;
