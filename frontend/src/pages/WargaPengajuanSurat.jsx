import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createSubmission, getSubmissions } from "../services/api";
// 1. IMPORT GAMBAR BACKGROUND
import wargaBg from "../assets/admin-bg.jpg"; 

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
  const [selectedFileName, setSelectedFileName] = useState("");
  const [previewDocument, setPreviewDocument] = useState(null);

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
      setSelectedFileName("");
      await loadHistory();
    } catch (err) {
      setMessage(err?.message || "Gagal mengirim pengajuan surat.");
    } finally {
      setLoading(false);
    }
  };

  const closePreview = () => setPreviewDocument(null);

  const renderPreviewContent = () => {
    if (!previewDocument) return null;

    const { url, title } = previewDocument;
    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(url);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={closePreview}>
        <div
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-[#bbc9cf] px-5 py-4">
            <div>
              <p className="text-lg font-black text-[#001e2c]">{title}</p>
              <p className="text-xs text-[#6c797f]">Preview dokumen pengajuan</p>
            </div>
            <button
              onClick={closePreview}
              className="rounded-full border border-[#bbc9cf] px-4 py-2 text-sm font-semibold text-[#001e2c] transition hover:bg-[#f5faff]"
            >
              Tutup
            </button>
          </div>

          <div className="h-[70vh] bg-[#f5faff] p-4">
            {isImage ? (
              <img src={url} alt={title} className="h-full w-full rounded-2xl object-contain bg-white" />
            ) : (
              <iframe title={title} src={url} className="h-full w-full rounded-2xl border-0 bg-white" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5faff] text-[#001e2c]">
      <header className="border-b border-[#bbc9cf] bg-white sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-black text-[#006689]">Desa-Ku Bisa</p>
            <p className="text-xs text-[#6c797f]">Layanan Warga</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#001e2c]">{user?.nama || "Warga"}</p>
              <p className="text-[10px] text-[#6c797f] font-mono">{user?.nik}</p>
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

      {/* 2. PANEL PENYAMBUT DENGAN BACKGROUND IMAGE */}
      <div 
        className="relative bg-[#00344a] py-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${wargaBg})` }}
      >
        {/* Overlay agar teks tetap terbaca */}
        <div className="absolute inset-0 bg-[#00344a]/80 backdrop-blur-[1px]"></div>
        
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-white">
          <h1 className="text-4xl font-black">Layanan Mandiri Warga</h1>
          <p className="mt-2 text-[#d1ecff] max-w-xl opacity-90">
            Ajukan surat keterangan dan dokumen administrasi secara digital. Pantau status pengajuan Anda secara real-time.
          </p>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-12">
        {/* Kolom Kiri: Form Pengajuan */}
        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-[#bbc9cf] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#e9f5ff] flex items-center justify-center text-[#00677f]">
                <span className="text-xl">📄</span>
              </div>
              <h2 className="text-2xl font-black">Formulir Pengajuan</h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                    placeholder="Misal: Melamar Pekerjaan"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Keterangan Tambahan (Opsional)</label>
                <textarea
                  value={form.keterangan}
                  onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff] resize-none"
                  rows="3"
                  placeholder="Tambahkan detail jika ada..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Lampiran Dokumen (KTP/KK)</label>
                <div className="group relative border-2 border-dashed border-[#bbc9cf] rounded-2xl p-8 transition-all hover:border-[#00677f] hover:bg-[#f5faff] flex flex-col items-center justify-center text-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setForm({ ...form, lampiran: file });
                      setSelectedFileName(file ? file.name : "");
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#6c797f] group-hover:text-[#00677f] mb-3 transition-colors">
                    <span className="text-2xl">📁</span>
                  </div>
                  <p className="text-sm font-bold">Pilih file atau tarik ke sini</p>
                  <p className="text-[10px] text-[#6c797f] mt-1 uppercase tracking-wider">Maks 10MB (PDF, JPG, PNG)</p>
                  {selectedFileName ? (
                    <div className="mt-4 rounded-lg bg-[#00677f] px-3 py-2 text-[10px] font-bold text-white shadow-md">
                      FILE: {selectedFileName}
                    </div>
                  ) : null}
                </div>
              </div>

              {message ? (
                <div className="rounded-xl border border-[#00cffd]/30 bg-[#e9f5ff] px-4 py-3 text-sm text-[#005469] font-medium">
                  {message}
                </div>
              ) : null}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-[#00677f] px-5 py-4 font-bold text-white transition hover:bg-[#005469] shadow-lg shadow-[#00677f]/20 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                type="submit"
              >
                {loading ? "Sedang Mengirim..." : "Kirim Pengajuan Sekarang"}
              </button>
            </form>
          </div>
        </section>

        {/* Kolom Kanan: Riwayat */}
        <section className="lg:col-span-5">
          <div className="rounded-3xl border border-[#bbc9cf] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black mb-6">Status Pengajuan</h2>
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-[#e9f5ff] rounded-2xl">
                  <p className="text-sm text-[#6c797f]">Anda belum memiliki riwayat pengajuan.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id || item._id} className="rounded-2xl border border-[#bbc9cf] bg-[#f5faff] p-5 hover:border-[#00677f] transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-black text-[#001e2c] leading-tight">{item.jenisSurat}</p>
                        <p className="text-[10px] font-bold text-[#6c797f] uppercase tracking-widest mt-1">{item.keperluan}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter ${
                        item.status === 'selesai' ? 'bg-green-100 text-green-700' :
                        item.status === 'proses' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status || "pending"}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-[#bbc9cf]/50 pt-4">
                      <p className="text-[10px] text-[#6c797f] font-medium">
                        Lampiran: <span className="text-[#001e2c]">{item.fileUrl ? "Tersedia" : "Kosong"}</span>
                      </p>
                      {item.fileUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewDocument({ url: item.fileUrl, title: item.jenisSurat })}
                          className="text-[10px] font-black text-[#00677f] uppercase hover:underline"
                        >
                          Lihat File
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      {renderPreviewContent()}
    </div>
  );
}