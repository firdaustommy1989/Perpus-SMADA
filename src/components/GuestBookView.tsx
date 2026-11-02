import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { GuestBookEntry } from '../types';
import { formatDateIndo, downloadCsv } from '../utils/export';
import { 
  ClipboardList, UserCheck, Search, Download, Calendar, 
  Sparkles, CheckCircle2, User, BookOpen, Clock
} from 'lucide-react';

export const GuestBookView: React.FC = () => {
  const { guestBook, members, addGuestBookEntry, pushNotification, profile, role } = useLibrary();

  const [inputNis, setInputNis] = useState('');
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState<'Siswa' | 'Guru' | 'Tamu'>('Siswa');
  const [classOrUnit, setClassOrUnit] = useState('');
  const [purpose, setPurpose] = useState<GuestBookEntry['purpose']>('Membaca di tempat');
  const [notes, setNotes] = useState('');

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-fill student profile when NIS is typed or selected
  const handleNisChange = (val: string) => {
    setInputNis(val);
    const matched = members.find(m => m.nis.toLowerCase() === val.trim().toLowerCase());
    if (matched) {
      setName(matched.name);
      setClassOrUnit(matched.classGroup);
      setUserRole(matched.role === 'guru' ? 'Guru' : 'Siswa');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addGuestBookEntry({
      name,
      role: userRole,
      identifier: inputNis || 'GUEST-' + Math.floor(Math.random() * 900 + 100),
      classOrUnit: classOrUnit || 'Tamu Umum',
      purpose,
      notes: notes || undefined
    });

    // Reset input form
    setInputNis('');
    setName('');
    setClassOrUnit('');
    setNotes('');
  };

  const filteredEntries = guestBook.filter(entry => {
    const matchesDate = !selectedDate || entry.date === selectedDate;
    const matchesSearch = 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.identifier.includes(searchQuery) ||
      entry.classOrUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDate && matchesSearch;
  });

  const exportGuestBookCsv = () => {
    const headers = ['ID', 'Tanggal', 'Jam (WIB)', 'Nama Pengunjung', 'Tipe', 'NIS / NIP', 'Kelas / Unit', 'Keperluan', 'Catatan'];
    const rows = filteredEntries.map(e => [
      e.id, e.date, e.time, e.name, e.role, e.identifier, e.classOrUnit, e.purpose, e.notes || '-'
    ]);
    downloadCsv(`buku_tamu_perpustakaan_${selectedDate || 'semua'}`, headers, rows);
    pushNotification('Ekspor Buku Tamu', `${filteredEntries.length} data kunjungan berhasil diekspor.`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Buku Tamu & Presensi Kunjungan Harian
          </h2>
          <p className="text-xs text-slate-500">
            Pendataan presensi mandiri civitas akademika {profile.schoolName} saat memasuki perpustakaan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportGuestBookCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Presensi CSV
          </button>
        </div>
      </div>

      {/* 2-Column Split: Check-in Form + Visitor Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form Presensi Kunjungan (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Formulir Presensi Masuk
              </h3>
              <p className="text-xs text-slate-500">
                Ketik NIS untuk isi otomatis nama & kelas
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Quick NIS Scan / Autofill */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nomor Induk Siswa (NIS) / NIP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputNis}
                  onChange={(e) => handleNisChange(e.target.value)}
                  placeholder="Ketik NIS, cth: 23241001"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Quick helper list from existing members */}
              <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
                <span className="text-slate-400 self-center">Pilihan Cepat:</span>
                {members.slice(0, 3).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleNisChange(m.nis)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-mono transition-colors"
                  >
                    {m.nis} ({m.name.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Lengkap Pengunjung *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Status
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru / Tenaga Pendidik</option>
                  <option value="Tamu">Tamu Umum / Wali</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Kelas / Rombel / Unit
                </label>
                <input
                  type="text"
                  value={classOrUnit}
                  onChange={(e) => setClassOrUnit(e.target.value)}
                  placeholder="Contoh: XI MIPA 1"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tujuan / Keperluan Kunjungan *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Membaca di tempat">Membaca di tempat</option>
                <option value="Meminjam buku">Meminjam buku</option>
                <option value="Mengerjakan tugas / Diskusi">Mengerjakan tugas / Diskusi kelompok</option>
                <option value="Menggunakan Komputer / E-Library">Menggunakan Komputer / E-Library</option>
                <option value="Lainnya">Lainnya / Studi Pustaka</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Keterangan Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Topik bacaan atau nama kelompok tugas"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" /> Catat Kehadiran Saya
            </button>
          </form>
        </div>

        {/* Right Column: Log Kunjungan Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Log Daftar Pengunjung ({filteredEntries.length})
              </h3>
              <p className="text-xs text-slate-500">
                Rekam jejak kunjungan harian perpustakaan
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Date Filter */}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 font-mono bg-white text-slate-700"
              />

              {/* Clear Date */}
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline whitespace-nowrap"
                >
                  Semua
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Nama Pengunjung</th>
                  <th className="py-3 px-4">Identitas & Kelas</th>
                  <th className="py-3 px-4">Keperluan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      Belum ada catatan pengunjung pada tanggal ini.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{entry.time} WIB</div>
                        <div className="text-[10px] text-slate-400">{formatDateIndo(entry.date)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{entry.name}</div>
                        <div className="text-[10px] text-indigo-600 font-medium">
                          {entry.role}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{entry.classOrUnit}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          ID: {entry.identifier}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700 font-medium">{entry.purpose}</div>
                        {entry.notes && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {entry.notes}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
