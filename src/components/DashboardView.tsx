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
      
      {/* Push Notification Activation Banner (if not yet granted) */}
      {!profile.pushNotificationsEnabled && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Aktifkan Notifikasi Real-Time Transaksi
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Dapatkan notifikasi langsung di layar saat buku selesai dipinjam, jatuh tempo, atau pengajuan disetujui pustakawan.
              </p>
            </div>
          </div>
          <button
            onClick={requestPushPermission}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
          >
            Aktifkan Sekarang
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 text-white">
        <img
          src="/src/assets/images/hero_sma_library_1793583765109.jpg"
          alt="Perpustakaan SMA"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="relative z-10 p-6 sm:p-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <span>Sistem Informasi & Perpustakaan Digital SMA</span>
            <span aria-hidden="true">·</span>
            <span>{profile.accreditation.split('(')[0]}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Selamat Datang di {profile.libraryName}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Pusat literasi digital dan koleksi cetak modern {profile.schoolName}. Akses ribuan modul pelajaran Kurikulum Merdeka, e-book sains, serta sirkulasi buku fisik cepat dan terintegrasi.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentTab('catalog')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Search className="w-4 h-4" /> Cari Buku & E-Book
            </button>
            <button
              onClick={() => setCurrentTab('guestbook')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <ClipboardList className="w-4 h-4" /> Isi Buku Tamu
            </button>
            {role === 'siswa' && (
              <button
                onClick={() => setCurrentTab('my-card')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4" /> Buka KTA Digital
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quantitative Metrics Grid (Tabular numerals, anti-pill unboxed design) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Judul Buku</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalTitles}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Koleksi terdaftar
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Stok Eksemplar</span>
            <BookMarked className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalPhysicalCopies}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Buku fisik di rak
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Anggota Aktif</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {activeMembersCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {members.filter(m => m.role === 'siswa').length} Siswa · {members.filter(m => m.role !== 'siswa').length} Pegawai
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Sedang Dipinjam</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {activeLoans.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Transaksi berjalan
          </span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Keterlambatan</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 font-mono tabular-nums">
            {overdueLoans.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Denda: {formatRupiah(totalFines)}
          </span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Kunjungan Hari Ini</span>
            <ClipboardList className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
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
          
          {/* Chart 1: Daily Visits & Borrow Activity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Aktivitas Kunjungan & Sirkulasi Minggu Ini
                </h3>
                <p className="text-xs text-slate-500">
                  Grafik frekuensi kunjungan siswa harian dan sirkulasi peminjaman
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" /> Kunjungan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" /> Peminjaman
                </span>
              </div>
            </div>

            {/* Simulated High-Res SVG Chart Bar */}
            <div className="pt-4">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 h-44 items-end border-b border-slate-200 pb-2">
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
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        {/* Visit bar */}
                        <div
                          style={{ height: `${visitHeight}%` }}
                          className="w-3.5 sm:w-5 bg-indigo-600 rounded-t-sm transition-all group-hover:bg-indigo-700"
                          title={`Kunjungan ${col.day}: ${col.visits}`}
                        />
                        {/* Loan bar */}
                        <div
                          style={{ height: `${loanHeight}%` }}
                          className="w-3.5 sm:w-5 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-600"
                          title={`Peminjaman ${col.day}: ${col.loans}`}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 group-hover:text-slate-900 truncate">
                        {col.day.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Distribusi Koleksi Berdasarkan Kategori
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Komposisi buku pelajaran kurikulum merdeka, sains, fiksi, dan referensi
            </p>

            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([catName, count], idx) => {
                const percentage = Math.round((count / totalTitles) * 100);
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 truncate max-w-[280px]">
                        {catName}
                      </span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {count} judul ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
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
          
          {/* Pending Approvals (Visible to Admin or Student notification) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Antrean Persetujuan Pinjam
                </h3>
                <p className="text-xs text-slate-500">
                  {pendingApprovals.length} pengajuan menunggu verifikasi
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('circulation')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pendingApprovals.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Tidak ada pengajuan pinjam yang tertunda.
                </div>
              ) : (
                pendingApprovals.map(loan => (
                  <div key={loan.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {loan.memberName}
                      </span>
                      <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                        {loan.memberClass}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-medium truncate">
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Presensi Kunjungan Terkini
                </h3>
                <p className="text-xs text-slate-500">
                  Buku tamu hari ini ({formatDateIndo(todayStr)})
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('guestbook')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Presensi Baru <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {todayVisits.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Belum ada presensi tamu hari ini.
                </div>
              ) : (
                todayVisits.slice(0, 4).map(entry => (
                  <div key={entry.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {entry.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {entry.classOrUnit} · Keperluan: {entry.purpose}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
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
