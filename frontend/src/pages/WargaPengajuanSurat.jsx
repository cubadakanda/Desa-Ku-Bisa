import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createSubmission, getSubmissions } from "../services/api";

const emptyForm = {
  jenisSurat: "Surat Keterangan Domisili",
  keperluan: "",
  keterangan: "",
  lampiran: null,
};

export default function WargaPengajuanSurat() {
  const { user, isAuthenticated, logout } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const loadHistory = async () => {
    try {
      const data = await getSubmissions();
      setHistory(Array.isArray(data) ? data : data.data || []);
    } catch {
      setHistory([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jenisSurat", form.jenisSurat);
      formData.append("keperluan", form.keperluan);
      formData.append("keterangan", form.keterangan);
      if (form.lampiran) {
        formData.append("lampiran", form.lampiran);
      }

      await createSubmission(formData);
      setMessage("Pengajuan surat berhasil dikirim.");
      setForm(emptyForm);
      await loadHistory();
    } catch (err) {
      setMessage(err?.message || "Gagal mengirim pengajuan surat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faff] text-[#001e2c]">
      <header className="border-b border-[#bbc9cf] bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-black text-[#006689]">Desa-Ku Bisa</p>
            <p className="text-xs text-[#6c797f]">Layanan Pengajuan Surat</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user?.name || "Warga"}</p>
              <p className="text-xs text-[#6c797f]">{user?.nik}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-full border border-[#bbc9cf] px-4 py-2 text-sm font-semibold text-[#001e2c] transition hover:bg-[#f5faff]"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-[#bbc9cf] bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black">Pengajuan Dokumen Digital</h1>
            <p className="mt-2 max-w-2xl text-[#6c797f]">
              Kirimkan permohonan surat keterangan, izin, atau administrasi lainnya secara langsung. File Anda akan dikirim sebagai multipart/form-data dan disimpan ke Amazon S3 melalui backend Node.js.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Jenis Surat</label>
                  <select
                    value={form.jenisSurat}
                    onChange={(e) => setForm({ ...form, jenisSurat: e.target.value })}
                    className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  >
                    <option>Surat Keterangan Domisili</option>
                    <option>Surat Pengantar Nikah (NA)</option>
                    <option>Surat Keterangan Tidak Mampu</option>
                    <option>Izin Keramaian & Acara</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Keperluan</label>
                  <input
                    value={form.keperluan}
                    onChange={(e) => setForm({ ...form, keperluan: e.target.value })}
                    className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                    placeholder="Misal: Persyaratan kerja"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Keterangan Tambahan (Opsional)</label>
                <textarea
                  value={form.keterangan}
                  onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  rows="4"
                  placeholder="Tambahkan informasi detail jika diperlukan..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Lampiran Dokumen (KTP/KK/Lainnya)</label>
                <div className="group relative border-2 border-dashed border-[#bbc9cf] rounded-xl p-8 transition-colors hover:border-[#00677f] bg-[#e9f5ff]/30 flex flex-col items-center justify-center text-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setForm({ ...form, lampiran: e.target.files?.[0] || null })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#6c797f] group-hover:text-[#00677f] mb-4 transition-colors">
                    <span className="text-3xl">☁️</span>
                  </div>
                  <p className="text-sm font-bold">Tarik file ke sini atau <span className="text-[#00677f] underline">Pilih File</span></p>
                  <p className="text-xs text-[#6c797f] mt-1">Maksimal 10MB per file. Format PDF, JPG, PNG didukung.</p>
                </div>
              </div>

              {message ? (
                <div className="rounded-xl border border-[#00cffd]/30 bg-[#e9f5ff] px-4 py-3 text-sm text-[#005469]">
                  {message}
                </div>
              ) : null}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-[#00677f] px-5 py-3 font-bold text-white transition hover:bg-[#005469] disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
              >
                {loading ? "Mengirim..." : "Kirim Pengajuan"}
              </button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-5">
          <div className="rounded-3xl border border-[#bbc9cf] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Riwayat Pengajuan</h2>
            <div className="mt-6 space-y-4">
              {history.length === 0 ? (
                <p className="text-sm text-[#6c797f]">Belum ada pengajuan surat.</p>
              ) : (
                history.map((item) => (
                  <div key={item.id || item._id} className="rounded-2xl border border-[#bbc9cf] bg-[#e9f5ff] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#001e2c]">{item.jenisSurat}</p>
                        <p className="text-xs text-[#6c797f]">{item.keperluan}</p>
                      </div>
                      <span className="rounded-full bg-[#d1ecff] px-3 py-1 text-xs font-bold text-[#005469]">
                        {item.status || "pending"}
                      </span>
                    </div>
                    {item.keterangan ? (
                      <p className="mt-3 text-sm text-[#3c494e]">{item.keterangan}</p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
