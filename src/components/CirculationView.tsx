import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Loan, LoanStatus } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/export';
import { 
  ArrowLeftRight, Check, X, Clock, AlertTriangle, 
  RotateCcw, Search, Plus, Calendar, FileText, CheckCircle2 
} from 'lucide-react';

export const CirculationView: React.FC = () => {
  const { 
    loans, role, activeMember, approveLoan, rejectLoan, 
    returnBook, renewLoan, profile, setCurrentTab 
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // If in student mode, prioritize or filter to active student's loans, but allow viewing all if desired
  const userLoans = role === 'siswa' 
    ? loans.filter(l => l.memberId === activeMember.id)
    : loans;

  const filteredLoans = userLoans.filter(l => {
    const matchesSearch = 
      l.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.memberNis.includes(searchQuery) ||
      l.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'pending') return matchesSearch && l.status === 'menunggu_persetujuan';
    if (activeTab === 'borrowed') return matchesSearch && l.status === 'dipinjam';
    if (activeTab === 'overdue') return matchesSearch && l.status === 'terlambat';
    if (activeTab === 'returned') return matchesSearch && l.status === 'kembali';

    return matchesSearch;
  });

  const pendingCount = userLoans.filter(l => l.status === 'menunggu_persetujuan').length;
  const overdueCount = userLoans.filter(l => l.status === 'terlambat').length;
  const activeCount = userLoans.filter(l => l.status === 'dipinjam').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B192C] font-heading">
            {role === 'siswa' ? 'Riwayat Peminjaman Buku Saya' : 'Meja Sirkulasi & Transaksi Peminjaman'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {role === 'siswa'
              ? `Daftar buku yang Anda pinjam dengan NIS: ${activeMember.nis}`
              : 'Verifikasi peminjaman fisik, pengembalian, perpanjangan, dan pencatatan denda'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('catalog')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" /> Pinjam Koleksi Buku
          </button>
        </div>
      </div>

      {/* Stats Quick Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Menunggu Persetujuan</span>
            <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
              {pendingCount} berkas
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Sedang Dipinjam</span>
            <span className="text-2xl font-bold font-mono text-[#0B192C] tabular-nums">
              {activeCount} transaksi
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B192C] flex items-center justify-center font-bold">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Terlambat & Kena Denda</span>
            <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
              {overdueCount} buku
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-medium">
            {[
              { id: 'all', label: 'Semua Transaksi' },
              { id: 'pending', label: `Menunggu (${pendingCount})` },
              { id: 'borrowed', label: `Dipinjam (${activeCount})` },
              { id: 'overdue', label: `Terlambat (${overdueCount})` },
              { id: 'returned', label: 'Dikembalikan' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Filter */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIS, judul..."
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B192C] focus:border-[#0B192C]"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">ID Transaksi</th>
                <th className="py-3 px-4">Peminjam</th>
                <th className="py-3 px-4">Judul Koleksi</th>
                <th className="py-3 px-4">Jadwal Pinjam & Tempo</th>
                <th className="py-3 px-4">Status & Denda</th>
                <th className="py-3 px-4 text-right">Aksi Sirkulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada transaksi sirkulasi dalam kategori ini.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const getStatusLabel = () => {
                    switch (loan.status) {
                      case 'menunggu_persetujuan':
                        return (
                          <span className="text-amber-900 bg-amber-100 border border-amber-300 font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-amber-700" /> Menunggu Verifikasi
                          </span>
                        );
                      case 'dipinjam':
                        return (
                          <span className="text-[#0B192C] font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sedang Dipinjam
                          </span>
                        );
                      case 'terlambat':
                        return (
                          <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" /> Terlambat
                          </span>
                        );
                      case 'kembali':
                        return (
                          <span className="text-slate-500 font-medium text-[11px]">
                            ✓ Selesai ({formatDateIndo(loan.returnDate)})
                          </span>
                        );
                    }
                  };

                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* ID */}
                      <td className="py-4 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                        {loan.id}
                      </td>

                      {/* Borrower */}
                      <td className="py-4 px-4 min-w-[160px]">
                        <div className="font-bold text-slate-900">{loan.memberName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          NIS: {loan.memberNis} · {loan.memberClass}
                        </div>
                      </td>

                      {/* Book */}
                      <td className="py-4 px-4 max-w-[220px]">
                        <div className="font-semibold text-slate-900 truncate">
                          {loan.bookTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {loan.bookCategory}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px]">
                        <div>Pinjam: {formatDateIndo(loan.borrowDate)}</div>
                        <div className={`font-semibold ${loan.status === 'terlambat' ? 'text-rose-600' : 'text-slate-700'}`}>
                          Tempo: {formatDateIndo(loan.dueDate)}
                        </div>
                      </td>

                      {/* Status & Fine */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div>{getStatusLabel()}</div>
                        {loan.fineAmount > 0 && (
                          <div className="text-[11px] font-mono font-bold text-rose-600 mt-0.5">
                            Denda: {formatRupiah(loan.fineAmount)}
                          </div>
                        )}
                        {loan.notes && (
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                            {loan.notes}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Librarian actions for pending */}
                          {role === 'admin' && loan.status === 'menunggu_persetujuan' && (
                            <>
                              <button
                                onClick={() => approveLoan(loan.id)}
                                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                title="Setujui Peminjaman"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.2]" /> Setujui
                              </button>
                              <button
                                onClick={() => rejectLoan(loan.id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors cursor-pointer"
                                title="Tolak Peminjaman"
                              >
                                <X className="w-3.5 h-3.5" /> Tolak
                              </button>
                            </>
                          )}

                          {/* Active / Overdue Loan actions */}
                          {(loan.status === 'dipinjam' || loan.status === 'terlambat') && (
                            <>
                              <button
                                onClick={() => renewLoan(loan.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                title="Perpanjang Masa Pinjam 7 Hari"
                              >
                                <RotateCcw className="w-3 h-3" /> Perpanjang
                              </button>
                              
                              {role === 'admin' && (
                                <button
                                  onClick={() => returnBook(loan.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0B192C] hover:bg-[#152A47] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                  title="Proses Pengembalian Buku"
                                >
                                  Kembalikan
                                </button>
                              )}
                            </>
                          )}

                          {loan.status === 'kembali' && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              Selesai
                            </span>
                          )}

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

    </div>
  );
};
