import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { formatRupiah, formatDateIndo } from '../utils/export';
import { 
  BookOpen, Users, Clock, AlertTriangle, ArrowUpRight, 
  Sparkles, CheckCircle2, ClipboardList, BookMarked, Shield, 
  ArrowRight, Search, FileText, Download, BellRing
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    books, members, loans, guestBook, profile, setCurrentTab, 
    role, activeMember, requestPushPermission, language
  } = useLibrary();

  const totalTitles = books.length;
  const totalPhysicalCopies = books.reduce((sum, b) => sum + b.physicalStock, 0);
  const activeMembersCount = members.filter(m => m.status === 'aktif').length;
  const activeLoans = loans.filter(l => l.status === 'dipinjam');
  const overdueLoans = loans.filter(l => l.status === 'terlambat');
  const pendingApprovals = loans.filter(l => l.status === 'menunggu_persetujuan');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayVisits = guestBook.filter(g => g.date === todayStr);

  const totalFines = overdueLoans.reduce((sum, l) => sum + l.fineAmount, 0);

  // Category distribution calculation
  const categoryCounts: Record<string, number> = {};
  books.forEach(b => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Real-time Notification Banner in Navy & Yellow */}
      {!profile.pushNotificationsEnabled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0B192C] uppercase tracking-wide">
                Aktifkan Notifikasi Real-Time Perpustakaan
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Dapatkan notifikasi instan di layar saat pengajuan buku disetujui, jatuh tempo tiba, atau peminjaman selesai.
              </p>
            </div>
          </div>
          <button
            onClick={requestPushPermission}
            className="px-4 py-2 rounded-xl bg-[#0B192C] hover:bg-[#152A47] text-amber-400 hover:text-amber-300 text-xs font-bold transition-all whitespace-nowrap shadow-xs cursor-pointer border border-slate-700 shrink-0"
          >
            Aktifkan Sekarang
          </button>
        </div>
      )}

      {/* Hero Welcome Banner (Deep Navy with Bright Yellow Highlights) */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#152A47] bg-gradient-to-br from-[#071324] via-[#0B192C] to-[#12243D] text-white">
        <img
          src="/src/assets/images/hero_sma_library_1793583765109.jpg"
          alt="Perpustakaan SMA"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity filter contrast-125"
        />
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <span>Sistem Informasi & Perpustakaan Digital SMA</span>
            <span aria-hidden="true">·</span>
            <span>{profile.accreditation.split('(')[0].trim()}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] font-heading">
            Selamat Datang di <span className="text-amber-400">{profile.libraryName}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Pusat literasi digital dan koleksi cetak modern {profile.schoolName}. Akses ribuan modul pelajaran Kurikulum Merdeka, e-book sains interaktif, serta sirkulasi peminjaman buku fisik cepat dan tersimpan di cloud.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentTab('catalog')}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.2]" /> Cari Buku & E-Book
            </button>
            <button
              onClick={() => setCurrentTab('guestbook')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" /> Isi Buku Tamu
            </button>
            {role === 'siswa' && (
              <button
                onClick={() => setCurrentTab('my-card')}
                className="px-4 py-2.5 rounded-xl bg-[#0F284A] hover:bg-[#16355F] border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-amber-400" /> Buka KTA Digital
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quantitative Metrics Grid (Clean whitespace, tabular numerals, unboxed design) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Judul Buku</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0B192C] font-mono tabular-nums">
            {totalTitles}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Koleksi terdaftar
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Stok Eksemplar</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#0B192C] flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0B192C] font-mono tabular-nums">
            {totalPhysicalCopies}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Buku fisik di rak
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Anggota Aktif</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0B192C] font-mono tabular-nums">
            {activeMembersCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block truncate">
            {members.filter(m => m.role === 'siswa').length} Siswa · {members.filter(m => m.role !== 'siswa').length} Pegawai
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Sedang Dipinjam</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
            {activeLoans.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Transaksi berjalan
          </span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Keterlambatan</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 font-mono tabular-nums">
            {overdueLoans.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Denda: {formatRupiah(totalFines)}
          </span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Kunjungan Hari Ini</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0B192C] font-mono tabular-nums">
            {todayVisits.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Buku tamu tercatat
          </span>
        </div>

      </div>

      {/* Main Content 2-Column Split: Charts & Circulation Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Analytics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Chart 1: Daily Visits & Borrow Activity (Navy Blue & Bright Yellow Bars) */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0B192C] font-heading">
                  Aktivitas Kunjungan & Sirkulasi Minggu Ini
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Grafik frekuensi kunjungan siswa harian dan sirkulasi peminjaman
                </p>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#0B192C] inline-block shadow-2xs" /> Kunjungan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-amber-400 inline-block shadow-2xs" /> Peminjaman
                </span>
              </div>
            </div>

            {/* Simulated High-Res SVG Chart Bar */}
            <div className="pt-4">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end border-b border-slate-200 pb-2">
                {[
                  { day: 'Senin', visits: 42, loans: 18 },
                  { day: 'Selasa', visits: 58, loans: 24 },
                  { day: 'Rabu', visits: 51, loans: 19 },
                  { day: 'Kamis', visits: 64, loans: 28 },
                  { day: 'Jumat', visits: 39, loans: 15 },
                  { day: 'Sabtu', visits: 22, loans: 8 },
                  { day: 'Minggu', visits: 5, loans: 2 },
                ].map((col, idx) => {
                  const visitHeight = Math.round((col.visits / 70) * 100);
                  const loanHeight = Math.round((col.loans / 70) * 100);

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1.5 h-40">
                        {/* Navy Visit bar */}
                        <div
                          style={{ height: `${visitHeight}%` }}
                          className="w-3.5 sm:w-5 bg-[#0B192C] rounded-t-sm transition-all group-hover:bg-[#152A47]"
                          title={`Kunjungan ${col.day}: ${col.visits}`}
                        />
                        {/* Bright Yellow Loan bar */}
                        <div
                          style={{ height: `${loanHeight}%` }}
                          className="w-3.5 sm:w-5 bg-amber-400 rounded-t-sm transition-all group-hover:bg-amber-300"
                          title={`Peminjaman ${col.day}: ${col.loans}`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 group-hover:text-[#0B192C] truncate">
                        {col.day.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-base font-bold text-[#0B192C] font-heading mb-1">
              Distribusi Koleksi Berdasarkan Kategori
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Komposisi buku pelajaran kurikulum merdeka, sains, fiksi, dan referensi
            </p>

            <div className="space-y-3.5">
              {Object.entries(categoryCounts).map(([catName, count], idx) => {
                const percentage = Math.round((count / totalTitles) * 100);
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 truncate max-w-[280px]">
                        {catName}
                      </span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {count} judul ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#0B192C] h-2.5 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Pending Approvals & Recent Circulations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pending Approvals */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0B192C] font-heading">
                  Antrean Persetujuan Pinjam
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {pendingApprovals.length} pengajuan menunggu verifikasi
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('circulation')}
                className="text-xs font-bold text-[#0B192C] hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pendingApprovals.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Tidak ada pengajuan pinjam yang tertunda.
                </div>
              ) : (
                pendingApprovals.map(loan => (
                  <div key={loan.id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 hover:border-amber-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {loan.memberName}
                      </span>
                      <span className="text-[10px] font-mono text-[#0B192C] bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30 font-bold">
                        {loan.memberClass}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 mt-1 font-semibold truncate">
                      📖 {loan.bookTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Diajukan: {formatDateIndo(loan.borrowDate)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Guest Book Check-ins */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0B192C] font-heading">
                  Presensi Kunjungan Terkini
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Buku tamu hari ini ({formatDateIndo(todayStr)})
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('guestbook')}
                className="text-xs font-bold text-[#0B192C] hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Presensi Baru <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {todayVisits.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Belum ada presensi tamu hari ini.
                </div>
              ) : (
                todayVisits.slice(0, 4).map(entry => (
                  <div key={entry.id} className="py-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {entry.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {entry.classOrUnit} · Keperluan: {entry.purpose}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0 font-medium">
                      {entry.time} WIB
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
