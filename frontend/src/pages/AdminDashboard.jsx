import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createResident,
  deleteResident,
  getAllSubmissions,
  getResidents,
  updateSubmissionStatus,
  updateResident,
} from "../services/api";
import { Navigate } from "react-router-dom";
// 1. IMPORT GAMBAR ADMIN BG
import adminBg from "../assets/admin-bg.jpg"; 

const emptyForm = {
  nama: "",
  nik: "",
  password: "",
  alamat: "",
  dusun: "",
  rt: "",
  status: "aktif",
  jenisKelamin: "Laki-laki",
};

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  // ... (Sisa state tetap sama)
  const [residents, setResidents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewDocument, setPreviewDocument] = useState(null);
  const [savingSubmissionId, setSavingSubmissionId] = useState(null);
  const [submissionStatusDrafts, setSubmissionStatusDrafts] = useState({});

  useEffect(() => {
    loadResidents();
    loadSubmissions();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/warga" replace />;
  }

  // ... (Semua fungsi handler tetap sama)
  const loadResidents = async () => {
    setLoading(true);
    try {
      const data = await getResidents();
      setResidents(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setMessage("Gagal memuat data warga");
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    setSubmissionsLoading(true);
    try {
      const data = await getAllSubmissions();
      const nextSubmissions = Array.isArray(data) ? data : data.data || [];
      setSubmissions(nextSubmissions);
      setSubmissionStatusDrafts(
        nextSubmissions.reduce((accumulator, item) => {
          accumulator[item.id] = item.status || "pending";
          return accumulator;
        }, {})
      );
    } catch {
      setSubmissions([]);
      setSubmissionStatusDrafts({});
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await updateResident(editingId, form);
        setMessage("Data warga berhasil diperbarui.");
      } else {
        await createResident(form);
        setMessage("Data warga berhasil ditambahkan.");
      }

      await loadResidents();
      resetForm();
    } catch (err) {
      setMessage(err?.message || "Gagal menyimpan data warga.");
    }
  };

  const handleEdit = (resident) => {
    setEditingId(resident.id || resident._id);
    setForm({
      nama: resident.nama || "",
      nik: resident.nik || "",
      password: "",
      alamat: resident.alamat || "",
      dusun: resident.dusun || "",
      rt: resident.rt || "",
      status: resident.status || "aktif",
      jenisKelamin: resident.jenisKelamin || "Laki-laki",
    });
  };

  const handleDelete = async (residentId) => {
    const confirmed = window.confirm("Hapus data warga ini?");
    if (!confirmed) return;

    try {
      await deleteResident(residentId);
      await loadResidents();
      setMessage("Data warga berhasil dihapus.");
    } catch (err) {
      setMessage(err?.message || "Gagal menghapus data warga.");
    }
  };

  const closePreview = () => setPreviewDocument(null);

  const handleStatusDraftChange = (submissionId, nextStatus) => {
    setSubmissionStatusDrafts((previous) => ({
      ...previous,
      [submissionId]: nextStatus,
    }));
  };

  const handleUpdateSubmissionStatus = async (submissionId) => {
    const nextStatus = submissionStatusDrafts[submissionId];
    if (!nextStatus) return;

    try {
      setSavingSubmissionId(submissionId);
      await updateSubmissionStatus(submissionId, nextStatus);
      setMessage("Status surat berhasil diperbarui.");
      await loadSubmissions();
    } catch (error) {
      setMessage(error?.message || "Gagal memperbarui status surat.");
    } finally {
      setSavingSubmissionId(null);
    }
  };

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
              <p className="text-xs text-[#6c797f]">Preview dokumen warga</p>
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
            <p className="text-xs text-[#6c797f]">Sistem Informasi Desa</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-[#6c797f]">Halo, <span className="font-bold text-[#001e2c]">{user?.nama || "Admin"}</span></p>
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
        className="relative bg-[#00344a] py-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${adminBg})` }}
      >
        {/* Overlay agar teks tetap kontras */}
        <div className="absolute inset-0 bg-[#00344a]/85 backdrop-blur-[1px]"></div>
        
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-white">
          <h1 className="text-4xl font-black">Dashboard Panel Admin</h1>
          <p className="mt-2 text-[#d1ecff] max-w-xl opacity-90">
            Selamat datang di pusat kendali data Desa-Ku Bisa. Kelola data penduduk (RDS) dan proses pengajuan surat warga dengan efisien.
          </p>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-12">
        {/* Bagian Form (Kiri) */}
        <section className="lg:col-span-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-[#bbc9cf] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#001e2c]">
              {editingId ? "Edit Data Warga" : "Tambah Data Warga"}
            </h2>
            <p className="mt-2 text-sm text-[#6c797f]">
              Isi formulir untuk sinkronisasi data ke Amazon RDS.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <input
                className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder="Nama Lengkap"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
              />
              <input
                className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder="NIK (16 Digit)"
                value={form.nik}
                onChange={(e) => setForm({ ...form, nik: e.target.value })}
                required
              />
              <input
                className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder={editingId ? "Password baru (kosongkan jika tidak diubah)" : "Password awal (opsional)"}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <textarea
                className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder="Alamat Lengkap"
                rows="3"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  placeholder="Nama Dusun"
                  value={form.dusun}
                  onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                />
                <input
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  placeholder="RT/RW"
                  value={form.rt}
                  onChange={(e) => setForm({ ...form, rt: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  value={form.jenisKelamin}
                  onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
                >
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
                <select
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="aktif">Aktif</option>
                  <option value="mutasi">Mutasi</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              {message ? (
                <div className="rounded-xl border border-[#00cffd]/30 bg-[#e9f5ff] px-4 py-3 text-sm text-[#005469]">
                  {message}
                </div>
              ) : null}

              <div className="flex gap-3 pt-2">
                <button
                  className="flex-1 rounded-xl bg-[#00677f] px-4 py-3 font-bold text-white transition hover:bg-[#005469]"
                  type="submit"
                >
                  {editingId ? "Perbarui Warga" : "Simpan Warga"}
                </button>
                <button
                  className="rounded-xl border border-[#bbc9cf] px-4 py-3 font-semibold text-[#001e2c] transition hover:bg-[#f5faff]"
                  type="button"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Bagian Tabel (Kanan) */}
        <section className="lg:col-span-8 space-y-8">
          {/* Tabel Data Warga */}
          <div className="rounded-3xl border border-[#bbc9cf] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#bbc9cf] px-6 py-4 bg-white">
              <h2 className="text-2xl font-black">Daftar Penduduk Desa</h2>
              <p className="text-sm text-[#6c797f]">Data real-time yang tersimpan di Amazon RDS.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#e9f5ff] text-xs uppercase tracking-[0.2em] text-[#6c797f]">
                  <tr>
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4">NIK</th>
                    <th className="px-6 py-4">Dusun/RT</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-6 py-8 text-[#6c797f]" colSpan="5">
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#00677f] border-t-transparent"></span>
                          Memuat data warga...
                        </div>
                      </td>
                    </tr>
                  ) : residents.length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-[#6c797f]" colSpan="5">
                        Belum ada data warga terdaftar.
                      </td>
                    </tr>
                  ) : (
                    residents.map((resident) => {
                      const residentId = resident.id || resident._id;
                      return (
                        <tr key={residentId} className="border-t border-[#bbc9cf] hover:bg-[#f5faff] transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-[#001e2c]">{resident.nama}</p>
                            <p className="text-xs text-[#6c797f]">{resident.jenisKelamin}</p>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm tracking-tight text-[#001e2c]">{resident.nik}</td>
                          <td className="px-6 py-4 text-[#3c494e]">
                            {resident.dusun || "-"} / RT.{resident.rt || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                              resident.status === 'aktif' ? 'bg-green-100 text-green-800' :
                              resident.status === 'mutasi' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {resident.status || "aktif"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                className="rounded-lg border border-[#bbc9cf] px-3 py-1.5 text-xs font-semibold text-[#00677f] transition hover:bg-[#e9f5ff]"
                                onClick={() => handleEdit(resident)}
                              >
                                Edit
                              </button>
                              <button
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                onClick={() => handleDelete(residentId)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Pengajuan Surat */}
          <div className="rounded-3xl border border-[#bbc9cf] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#bbc9cf] px-6 py-4 bg-white">
              <h2 className="text-2xl font-black">Antrean Pengajuan Surat</h2>
              <p className="text-sm text-[#6c797f]">Validasi dokumen warga yang tersimpan di Amazon S3.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#e9f5ff] text-xs uppercase tracking-[0.2em] text-[#6c797f]">
                  <tr>
                    <th className="px-6 py-4">Nama Warga</th>
                    <th className="px-6 py-4">Jenis & Keperluan</th>
                    <th className="px-6 py-4">Lampiran (S3)</th>
                    <th className="px-6 py-4 text-right">Kelola Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissionsLoading ? (
                    <tr>
                      <td className="px-6 py-8 text-[#6c797f]" colSpan="4">
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#00677f] border-t-transparent"></span>
                          Memuat antrean pengajuan...
                        </div>
                      </td>
                    </tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-[#6c797f]" colSpan="4">
                        Belum ada pengajuan surat masuk.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((item) => (
                      <tr key={item.id} className="border-t border-[#bbc9cf] hover:bg-[#f5faff] transition-colors">
                        <td className="px-6 py-4font-semibold text-[#001e2c]">{item.user?.nama || "-"}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#001e2c]">{item.jenisSurat}</p>
                          <p className="text-xs text-[#6c797f] truncate max-w-xs">{item.keperluan}</p>
                        </td>
                        <td className="px-6 py-4">
                          {item.fileUrl ? (
                            <button
                              onClick={() => setPreviewDocument({ url: item.fileUrl, title: `${item.user?.nama || "Warga"} - ${item.jenisSurat}` })}
                              className="text-xs font-bold text-[#00677f] underline hover:text-[#005469]"
                            >
                              Lihat Dokumen
                            </button>
                          ) : (
                            <span className="text-xs text-[#bbc9cf]">Tidak ada</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <select
                              value={submissionStatusDrafts[item.id] || item.status || "pending"}
                              onChange={(event) => handleStatusDraftChange(item.id, event.target.value)}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-bold outline-none transition ${
                                (submissionStatusDrafts[item.id] || item.status) === 'selesai' ? 'border-green-300 bg-green-50 text-green-900' :
                                (submissionStatusDrafts[item.id] || item.status) === 'proses' ? 'border-amber-300 bg-amber-50 text-amber-900' :
                                'border-[#bbc9cf] bg-white text-[#001e2c]'
                              }`}
                            >
                              <option value="pending">pending</option>
                              <option value="proses">proses</option>
                              <option value="selesai">selesai</option>
                            </select>
                            <button
                              type="button"
                              disabled={savingSubmissionId === item.id}
                              onClick={() => handleUpdateSubmissionStatus(item.id)}
                              className="rounded-lg bg-[#00677f] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#005469] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {savingSubmissionId === item.id ? "..." : "Set"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      {renderPreviewContent()}
    </div>
  );
}