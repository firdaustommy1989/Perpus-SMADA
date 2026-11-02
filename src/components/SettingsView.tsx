import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { formatRupiah } from '../utils/export';
import { 
  Settings, Building, ShieldCheck, Clock, Bell, 
  Volume2, Save, RotateCcw, Check, Sparkles 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, pushNotification, requestPushPermission } = useLibrary();

  const [formData, setFormData] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const testPushNotification = () => {
    pushNotification(
      'Uji Coba Push Notification Real-Time',
      'Sistem notifikasi real-time SIPERPU SMA berfungsi dengan sangat baik!',
      'success',
      'dashboard'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Pengaturan Sistem & Profil Sekolah
        </h2>
        <p className="text-xs text-slate-500">
          Kelola profil kelembagaan SMA, aturan sirkulasi denda, batas waktu peminjaman, serta preferensi notifikasi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Profil Sekolah & Perpustakaan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Profil Satuan Pendidikan & Perpustakaan
              </h3>
              <p className="text-xs text-slate-500">
                Data resmi yang akan dicantumkan pada kop surat dan KTA digital
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Sekolah SMA *
              </label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nomor Pokok Sekolah Nasional (NPSN) *
              </label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Unit Perpustakaan *
              </label>
              <input
                type="text"
                required
                value={formData.libraryName}
                onChange={(e) => setFormData({ ...formData, libraryName: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Status Akreditasi Perpustakaan
              </label>
              <input
                type="text"
                value={formData.accreditation}
                onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Kepala Perpustakaan
              </label>
              <input
                type="text"
                value={formData.headOfLibrary}
                onChange={(e) => setFormData({ ...formData, headOfLibrary: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.headOfSchool}
                onChange={(e) => setFormData({ ...formData, headOfSchool: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Alamat Sekolah Lengkap
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Aturan Sirkulasi & Denda Keterlambatan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Aturan Sirkulasi & Perhitungan Denda Otomatis
              </h3>
              <p className="text-xs text-slate-500">
                Parameter masa peminjaman dan denda per hari per buku
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Masa Peminjaman Standar (Hari)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.maxBorrowDays}
                onChange={(e) => setFormData({ ...formData, maxBorrowDays: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Default: 7 hari kalender
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tarif Denda per Hari (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.finePerDay}
                onChange={(e) => setFormData({ ...formData, finePerDay: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Format: {formatRupiah(formData.finePerDay || 0)} / hari
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Batas Maksimal Buku per Siswa
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.maxBooksPerMember}
                onChange={(e) => setFormData({ ...formData, maxBooksPerMember: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Maksimal eksemplar aktif dipinjam
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Pengaturan Push Notification & Audio Chime */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Notifikasi Push Real-Time & Audio
              </h3>
              <p className="text-xs text-slate-500">
                Pemberitahuan instan saat terjadi sirkulasi peminjaman atau keterlambatan
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.soundEnabled}
                onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Aktifkan Suara Notifikasi (Web Audio Chime)
                </span>
                <span className="text-[11px] text-slate-500">
                  Memainkan nada lembut saat transaksi disetujui, buku dipinjam, atau buku tamu terisi.
                </span>
              </div>
            </label>

            <div className="flex items-center justify-between p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Uji Coba Notifikasi Push
                </span>
                <span className="text-[11px] text-slate-600">
                  Kirim sinyal uji coba untuk memverifikasi toast & audio real-time
                </span>
              </div>
              <button
                type="button"
                onClick={testPushNotification}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Kirim Uji Coba
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Konfigurasi Berhasil Disimpan
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" /> Simpan Seluruh Pengaturan
          </button>
        </div>

      </form>

    </div>
  );
};
