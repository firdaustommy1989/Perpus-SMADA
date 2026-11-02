import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { UserRole } from '../types';
import { 
  BookOpen, Lock, User, Eye, EyeOff, ArrowRight, 
  AlertCircle, ShieldCheck, Loader2
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, profile } = useLibrary();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setIdentifier('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(identifier, password, selectedRole);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Terjadi gangguan jaringan saat memverifikasi sesi login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      
      {/* SaaS Split Screen Container */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        
        {/* ========================================================= */}
        {/* LEFT PANEL: Modern Minimalist Deep Navy Showcase */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 xl:col-span-7 bg-[#0B192C] text-white relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden border-r border-[#152A47]">
          
          {/* Ambient Subtle Backing & Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/login_product_panel_1793584892550.jpg"
              alt="Perpustakaan Digital SMA Interface"
              className="w-full h-full object-cover opacity-15 mix-blend-luminosity filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-[#0B192C]/95 to-[#0B192C]/85" />
          </div>

          {/* Top Brand Identity */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-md font-bold">
                <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-heading text-lg font-extrabold tracking-tight text-white block">
                  SIPERPU <span className="text-amber-400">SMA</span>
                </span>
                <span className="text-xs text-slate-400 font-medium block">
                  {profile.schoolName}
                </span>
              </div>
            </div>

            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#152A47] border border-[#1E3A5F] text-xs text-amber-300 font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.accreditation.split('(')[0].trim()}</span>
            </div>
          </div>

          {/* Central Hero Value Proposition */}
          <div className="relative z-10 my-auto py-12 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              <span>Platform Manajemen Perpustakaan Terpadu</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Transformasi Literasi Digital untuk Generasi Unggul SMA.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Kelola sirkulasi bahan pustaka fisik, baca ribuan e-book Kurikulum Merdeka secara interaktif, cetak KTA berbasis QR Code, dan pantau keterlambatan secara transparan dan otomatis.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#0F223D]/80 border border-[#1E3A5F] backdrop-blur-xs">
                <div className="text-xs font-bold text-amber-300 mb-1">
                  Katalog & E-Book Interaktif
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Modul sains, kurikulum merdeka, hingga sastra klasik dengan pembaca digital langsung di browser.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F223D]/80 border border-[#1E3A5F] backdrop-blur-xs">
                <div className="text-xs font-bold text-amber-300 mb-1">
                  KTA Digital QR & Barcode
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Presensi mandiri tanpa kartu fisik, siap scan di gerbang dan tablet kios buku tamu.
                </p>
              </div>
            </div>

            {/* User Testimonial Box */}
            <div className="p-4 rounded-2xl bg-[#0F223D]/60 border border-amber-400/30">
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "Peminjaman buku praktikum olimpiade dan modul SNBT menjadi jauh lebih praktis tanpa antre di meja sirkulasi."
              </p>
              <div className="mt-2 text-[11px] font-semibold text-amber-300 flex items-center justify-between">
                <span>— Aisyah Putri Azzahra, Siswi XI MIPA 2</span>
                <span className="font-mono text-slate-400">NIS: 23241002</span>
              </div>
            </div>
          </div>

          {/* Left Footer Badges */}
          <div className="relative z-10 pt-4 border-t border-[#152A47] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div>NPSN: {profile.npsn} · {profile.libraryName}</div>
            <div className="text-slate-400">© 2026 SIPERPU Digital System</div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: Clean Corporate Login Form */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-12">
          
          <div className="max-w-md w-full mx-auto space-y-7">
            
            {/* Form Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">
                  Portal Autentikasi Pengguna
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  v2.4 Production
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight mt-1.5">
                Masuk ke Akun Anda
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gunakan kredensial resmi sekolah untuk mengakses sistem informasi dan perpustakaan digital.
              </p>
            </div>

            {/* Segmented Role Selection Tabs */}
            <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleTabChange('admin')}
                className={`flex-1 py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pustakawan
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabChange('siswa')}
                className={`flex-1 py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
                  selectedRole === 'siswa'
                    ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Siswa / Anggota
              </button>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div 
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">Gagal Masuk:</div>
                  <div className="mt-0.5 leading-relaxed">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Identifier Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  {selectedRole === 'admin' ? 'Email Administrator' : 'Nomor Induk Siswa (NIS) atau Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'admin@sman1teladan.sch.id' : 'Masukkan NIS (cth: 23241001)'}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B192C] focus:border-[#0B192C] text-slate-900 placeholder:text-slate-400 font-mono transition-all"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-[11px] font-semibold text-[#0B192C] hover:text-amber-600 hover:underline cursor-pointer"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B192C] focus:border-[#0B192C] text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#0B192C] focus:ring-[#0B192C] w-3.5 h-3.5 border-slate-300"
                  />
                  <span>Ingat sesi masuk di perangkat ini</span>
                </label>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#0B192C] hover:bg-[#152A47] active:bg-[#071324] disabled:bg-slate-400 text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 cursor-pointer disabled:cursor-not-allowed border border-slate-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Perpustakaan</span>
                    <ArrowRight className="w-4 h-4 text-amber-400 stroke-[2.2]" />
                  </>
                )}
              </button>

            </form>

            {/* Direct Access to Guest Kiosk */}
            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  login('kios-tamu', 'tamu123', 'guest_kiosk');
                }}
                className="text-xs text-slate-600 hover:text-[#0B192C] inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              >
                <span>Hanya berkunjung ke perpustakaan?</span>
                <span className="font-bold text-[#0B192C] underline decoration-amber-400 decoration-2 underline-offset-2">Isi Buku Tamu Sekarang</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-heading text-base font-bold text-[#0B192C]">
              Pemulihan Kata Sandi Siswa & Staf
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Untuk menjaga integritas dan privasi data akademik SMA Negeri 1 Teladan, pengaturan ulang kata sandi dapat dilakukan melalui konfirmasi langsung ke meja Pustakawan dengan membawa Kartu Pelajar atau Kartu Pegawai.
            </p>
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950">
              <span className="font-bold block mb-1">Pusat Layanan Pustakawan:</span>
              <p className="text-[11px] leading-relaxed text-amber-900">
                Layanan bantuan teknis dan reset kredensial akun perpustakaan buka setiap hari kerja pukul 07.00 - 15.30 WIB di Ruang Sirkulasi Perpustakaan.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0B192C] text-amber-400 hover:text-amber-300 text-xs font-bold cursor-pointer"
              >
                Mengerti & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
