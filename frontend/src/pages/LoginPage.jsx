import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// 1. IMPORT GAMBAR DARI FOLDER ASSETS
import loginBg from "../assets/login-bg.jpg"; 

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading } = useAuth();
  const [form, setForm] = useState({ nik: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/warga"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const nextUser = await login(form.nik, form.password);
      navigate(nextUser.role === "admin" ? "/admin" : "/warga", { replace: true });
    } catch (err) {
      setError(err?.message || "Login gagal. Periksa NIK dan password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faff] px-4 py-10 flex items-center justify-center">
      <div className="mx-auto grid min-h-[600px] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#bbc9cf] bg-white shadow-xl lg:grid-cols-2">
        
        {/* 2. PANEL KIRI: MENAMBAHKAN BACKGROUND IMAGE */}
        <div 
          className="relative hidden flex-col justify-between p-12 text-white lg:flex bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          {/* OVERLAY: Agar teks tetap terbaca jika gambar terlalu terang */}
          <div className="absolute inset-0 bg-[#00677f]/80 backdrop-blur-[2px]"></div>

          <div className="relative z-10">
            <p className="text-2xl font-black">Desa-Ku Bisa</p>
            <h1 className="mt-10 text-4xl font-black leading-tight">
              Transformasi Digital Menuju Desa Mandiri.
            </h1>
            <p className="mt-4 max-w-lg text-[#d1ecff] opacity-90 leading-relaxed">
              Akses layanan administratif, pantau perkembangan desa, dan sampaikan aspirasi Anda dalam satu platform terintegrasi.
            </p>
          </div>
          
          <div className="relative z-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 p-4">
            <p className="text-sm text-white leading-snug">
              Hanya Admin Desa yang dapat membuat akun baru. Silakan hubungi kantor desa untuk pendaftaran.
            </p>
          </div>
        </div>

        {/* PANEL KANAN: FORM LOGIN */}
        <div className="flex flex-col justify-center p-8 lg:p-12">
          {/* ... Sisa kode form kamu (tetap sama) ... */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <p className="text-xl font-black text-[#006689]">Desa-Ku Bisa</p>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#001e2c]">Selamat Datang</h2>
            <p className="mt-2 text-[#6c797f]">Silakan masuk menggunakan identitas kependudukan Anda.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#001e2c]">Nomor Induk Kependudukan (NIK)</label>
              <input
                value={form.nik}
                onChange={(e) => setForm({ ...form, nik: e.target.value })}
                className="w-full rounded-lg border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none transition focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder="16 digit NIK Anda"
                type="text"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#001e2c]">Kata Sandi</label>
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none transition focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="w-full rounded-lg bg-[#00677f] px-4 py-3 font-bold text-white transition hover:bg-[#005469] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
            >
              {loading ? "Memproses..." : "Masuk Ke Akun"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#bbc9cf] text-center">
            <p className="text-sm text-[#6c797f]">
              Belum memiliki akun? <br />
              <span className="font-medium text-[#001e2c] italic">Akun hanya dapat dibuat oleh Admin/Perangkat Desa.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}