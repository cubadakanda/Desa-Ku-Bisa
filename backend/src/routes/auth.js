import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../models/index.js";

const router = express.Router();
const { User } = db;

export const login = async (req, res) => {
  const { nik, password } = req.body;

  if (!nik || !password) {
    return res.status(400).json({ message: "NIK dan password harus diisi" });
  }

  try {
    const user = await User.findOne({ where: { nik } });

    if (!user) {
      return res.status(401).json({ message: "NIK atau password salah" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "NIK atau password salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nik: user.nik,
        nama: user.nama,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nik: user.nik,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

router.post("/login", login);

export default router;
