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
      <header className="border-b border-[#bbc9cf] bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-black text-[#006689]">Desa-Ku Bisa</p>
            <p className="text-xs text-[#6c797f]">Admin Dashboard</p>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-[#bbc9cf] px-4 py-2 text-sm font-semibold text-[#001e2c] transition hover:bg-[#f5faff]"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-12">
        <section className="lg:col-span-4">
          <div className="rounded-3xl border border-[#bbc9cf] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#001e2c]">
              {editingId ? "Edit Data Warga" : "Tambah Data Warga"}
            </h2>
            <p className="mt-2 text-sm text-[#6c797f]">
              CRUD data warga yang terhubung ke API backend (RDS).
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <input
                className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder="Nama"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
              />
              <input
                className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder="NIK"
                value={form.nik}
                onChange={(e) => setForm({ ...form, nik: e.target.value })}
                required
              />
              {!editingId ? (
                <input
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  placeholder="Password awal (opsional, default warga123)"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              ) : (
                <input
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  placeholder="Password baru (kosongkan jika tidak diubah)"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              )}
              <textarea
                className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                placeholder="Alamat"
                rows="3"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-xl border border-[#bbc9cf] bg-[#e9f5ff] px-4 py-3 outline-none focus:border-[#00677f] focus:ring-2 focus:ring-[#d1ecff]"
                  placeholder="Dusun"
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

              {message ? (
                <div className="rounded-xl border border-[#00cffd]/30 bg-[#e9f5ff] px-4 py-3 text-sm text-[#005469]">
                  {message}
                </div>
              ) : null}

              <div className="flex gap-3">
                <button
                  className="flex-1 rounded-xl bg-[#00677f] px-4 py-3 font-bold text-white transition hover:bg-[#005469]"
                  type="submit"
                >
                  {editingId ? "Perbarui" : "Simpan"}
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

        <section className="lg:col-span-8">
          <div className="rounded-3xl border border-[#bbc9cf] bg-white shadow-sm">
            <div className="border-b border-[#bbc9cf] px-6 py-4">
              <h2 className="text-2xl font-black">Data Warga</h2>
              <p className="text-sm text-[#6c797f]">Read, update, dan delete data penduduk dari RDS.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#e9f5ff] text-xs uppercase tracking-[0.2em] text-[#6c797f]">
                  <tr>
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4">NIK</th>
                    <th className="px-6 py-4">Alamat</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-6 py-8 text-[#6c797f]" colSpan="5">
                        Memuat data...
                      </td>
                    </tr>
                  ) : residents.length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-[#6c797f]" colSpan="5">
                        Belum ada data warga.
                      </td>
                    </tr>
                  ) : (
                    residents.map((resident) => {
                      const residentId = resident.id || resident._id;
                      return (
                        <tr key={residentId} className="border-t border-[#e5e4e7] hover:bg-[#f5faff]">
                          <td className="px-6 py-4 font-semibold">{resident.nama}</td>
                          <td className="px-6 py-4 font-mono text-sm">{resident.nik}</td>
                          <td className="px-6 py-4">{resident.alamat}</td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-[#e9f5ff] px-3 py-1 text-xs font-bold text-[#005469]">
                              {resident.status || "aktif"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                className="rounded-lg border border-[#bbc9cf] px-3 py-2 text-sm font-semibold transition hover:bg-[#f5faff]"
                                onClick={() => handleEdit(resident)}
                              >
                                Edit
                              </button>
                              <button
                                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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

          <div className="mt-8 rounded-3xl border border-[#bbc9cf] bg-white shadow-sm">
            <div className="border-b border-[#bbc9cf] px-6 py-4">
              <h2 className="text-2xl font-black">Pengajuan Surat Warga</h2>
              <p className="text-sm text-[#6c797f]">Lihat semua pengajuan dan dokumen yang diunggah warga.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#e9f5ff] text-xs uppercase tracking-[0.2em] text-[#6c797f]">
                  <tr>
                    <th className="px-6 py-4">Warga</th>
                    <th className="px-6 py-4">Jenis Surat</th>
                    <th className="px-6 py-4">Keperluan</th>
                    <th className="px-6 py-4">Lampiran</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissionsLoading ? (
                    <tr>
                      <td className="px-6 py-8 text-[#6c797f]" colSpan="5">
                        Memuat pengajuan surat...
                      </td>
                    </tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-[#6c797f]" colSpan="5">
                        Belum ada pengajuan surat.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((item) => (
                      <tr key={item.id} className="border-t border-[#e5e4e7] hover:bg-[#f5faff]">
                        <td className="px-6 py-4 font-semibold">{item.user?.nama || "-"}</td>
                        <td className="px-6 py-4">{item.jenisSurat}</td>
                        <td className="px-6 py-4">{item.keperluan}</td>
                        <td className="px-6 py-4">
                          {item.fileUrl ? (
                            <button
                              onClick={() => setPreviewDocument({ url: item.fileUrl, title: `${item.user?.nama || "Warga"} - ${item.jenisSurat}` })}
                              className="text-[#00677f] underline"
                            >
                              Lihat Dokumen
                            </button>
                          ) : (
                            <span className="text-[#6c797f]">Tanpa lampiran</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={submissionStatusDrafts[item.id] || item.status || "pending"}
                              onChange={(event) => handleStatusDraftChange(item.id, event.target.value)}
                              className="rounded-lg border border-[#bbc9cf] bg-white px-3 py-2 text-xs font-semibold outline-none"
                            >
                              <option value="pending">pending</option>
                              <option value="proses">proses</option>
                              <option value="selesai">selesai</option>
                            </select>
                            <button
                              type="button"
                              disabled={savingSubmissionId === item.id}
                              onClick={() => handleUpdateSubmissionStatus(item.id)}
                              className="rounded-lg bg-[#00677f] px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {savingSubmissionId === item.id ? "Menyimpan..." : "Ubah"}
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
