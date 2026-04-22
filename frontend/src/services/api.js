const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("desa-ku-bisa-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const getMultipartHeaders = () => {
  const token = localStorage.getItem("desa-ku-bisa-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginRequest = async ({ nik, password }) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nik, password }),
  });
  if (!response.ok) throw new Error("Login gagal");
  return response.json();
};

export const getResidents = async () => {
  const response = await fetch(`${API_URL}/warga`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil data warga");
  return response.json();
};

export const createResident = async (payload) => {
  const response = await fetch(`${API_URL}/warga`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal menambah warga");
  return response.json();
};

export const updateResident = async (id, payload) => {
  const response = await fetch(`${API_URL}/warga/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal memperbarui warga");
  return response.json();
};

export const deleteResident = async (id) => {
  const response = await fetch(`${API_URL}/warga/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal menghapus warga");
  return response.json();
};

export const getSubmissions = async () => {
  const response = await fetch(`${API_URL}/surat/pengajuan`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil pengajuan");
  return response.json();
};

export const createSubmission = async (formData) => {
  const token = localStorage.getItem("desa-ku-bisa-token");
  const response = await fetch(`${API_URL}/surat/pengajuan`, {
    method: "POST",
    headers: getMultipartHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error("Gagal mengirim pengajuan");
  return response.json();
};
