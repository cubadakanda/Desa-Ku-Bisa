import { Link } from "react-router-dom";

const features = [
  {
    title: "Administrasi Mandiri",
    description: "Ajukan berbagai surat keterangan, domisili, dan berkas kependudukan secara mandiri melalui aplikasi.",
  },
  {
    title: "Pusat Informasi",
    description: "Dapatkan berita terkini, pengumuman penting, dan agenda kegiatan desa secara real-time dan akurat.",
  },
  {
    title: "Pajak & Retribusi",
    description: "Kemudahan cek tagihan PBB dan pembayaran iuran warga melalui sistem pembayaran digital yang terintegrasi.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5faff] text-[#001e2c]">
      <header className="sticky top-0 z-20 border-b border-[#bbc9cf] bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-black text-[#006689]">Desa-Ku Bisa</p>
            <p className="text-xs text-[#6c797f]">Layanan Desa Digital</p>
          </div>
          <Link
            to="/login"
            className="rounded-full bg-[#00677f] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#005469]"
          >
            Masuk
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#00344a] py-20 lg:py-32">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00344a] via-[#00344a]/80 to-transparent"></div>
          </div>
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="space-y-8 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00cffd]/20 border border-[#00cffd]/30 rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-[#00cffd]"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00cffd]">Transformasi Digital 2024</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                Layanan <span className="text-[#00cffd]">Desa Digital</span> Terpadu
              </h1>
              <p className="text-lg text-[#d1ecff] max-w-xl leading-relaxed">
                Mewujudkan tata kelola desa yang transparan, akuntabel, dan modern. Akses layanan publik kini lebih cepat, mudah, dan aman dalam genggaman Anda.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-[#00cffd] text-[#005469] px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-[#00cffd]/20 transition-all active:scale-95"
                >
                  Mulai Sekarang
                </Link>
                <a
                  href="#fitur"
                  className="bg-transparent border-2 border-[#bbc9cf] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition-all"
                >
                  Lihat Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="fitur" className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-[#001e2c]">Layanan Unggulan Kami</h2>
            <p className="text-[#6c797f] max-w-2xl mx-auto">Sistem informasi desa yang dirancang khusus untuk mempermudah administrasi dan komunikasi antara perangkat desa dan masyarakat.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="group bg-white border border-[#bbc9cf] p-8 rounded-3xl hover:shadow-2xl hover:shadow-[#00677f]/5 transition-all duration-300">
                <div className="w-16 h-16 bg-[#e9f5ff] rounded-2xl flex items-center justify-center text-[#00677f] mb-6 group-hover:bg-[#00677f] group-hover:text-white transition-colors">
                  <span className="text-3xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#001e2c]">{feature.title}</h3>
                <p className="text-[#6c797f] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#ddf1ff] py-16">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-4">
              <p className="text-4xl lg:text-5xl font-black text-[#006689] mb-2">12.5k</p>
              <p className="text-sm font-bold uppercase tracking-widest text-[#6c797f]">Warga Aktif</p>
            </div>
            <div className="text-center p-4">
              <p className="text-4xl lg:text-5xl font-black text-[#006689] mb-2">45+</p>
              <p className="text-sm font-bold uppercase tracking-widest text-[#6c797f]">Jenis Layanan</p>
            </div>
            <div className="text-center p-4">
              <p className="text-4xl lg:text-5xl font-black text-[#006689] mb-2">0.5s</p>
              <p className="text-sm font-bold uppercase tracking-widest text-[#6c797f]">Rata-rata Respon</p>
            </div>
            <div className="text-center p-4">
              <p className="text-4xl lg:text-5xl font-black text-[#006689] mb-2">24/7</p>
              <p className="text-sm font-bold uppercase tracking-widest text-[#6c797f]">Dukungan Sistem</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-[#bbc9cf] bg-[#f5faff] mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto gap-4">
          <p className="text-xs text-[#6c797f]">© 2024 Desa-Ku Bisa. Transformasi Digital Menuju Desa Mandiri.</p>
          <div className="flex gap-6">
            <a className="text-xs text-[#6c797f] hover:text-[#00cffd] hover:underline transition-all" href="#">Kebijakan Privasi</a>
            <a className="text-xs text-[#6c797f] hover:text-[#00cffd] hover:underline transition-all" href="#">Panduan Pengguna</a>
            <a className="text-xs text-[#6c797f] hover:text-[#00cffd] hover:underline transition-all" href="#">Kontak Kami</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
