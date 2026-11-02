import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { downloadCsv, formatDateIndo, formatRupiah } from '../utils/export';
import { 
  FileText, Download, Printer, Filter, Calendar, 
  CheckCircle2, AlertTriangle, BookOpen, Users, ArrowLeftRight 
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { books, members, loans, guestBook, profile, pushNotification } = useLibrary();

  const [reportType, setReportType] = useState<'books' | 'members' | 'loans' | 'guestbook'>('loans');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  const exportCurrentReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];

    if (reportType === 'books') {
      const headers = ['ID', 'Judul Buku', 'Pengarang', 'Penerbit', 'Tahun', 'ISBN', 'Kategori', 'No. Rak', 'Stok Fisik', 'Stok Tersedia', 'Ada E-Book'];
      const rows = books.map(b => [
        b.id, b.title, b.author, b.publisher, b.year, b.isbn, b.category, b.callNumber, b.physicalStock, b.availableStock, b.isEbookAvailable ? 'Ya' : 'Tidak'
      ]);
      downloadCsv(`laporan_koleksi_buku_${timestamp}`, headers, rows);
    } else if (reportType === 'members') {
      const headers = ['ID', 'NIS', 'NISN', 'Nama Anggota', 'Tipe', 'Kelas / Rombel', 'Email', 'No. HP', 'Status', 'Tgl Daftar'];
      const rows = members.map(m => [
        m.id, m.nis, m.nisn, m.name, m.role, m.classGroup, m.email, m.phone, m.status, m.joinDate
      ]);
      downloadCsv(`laporan_anggota_perpustakaan_${timestamp}`, headers, rows);
    } else if (reportType === 'loans') {
      const headers = ['ID Pinjam', 'Nama Peminjam', 'NIS', 'Kelas', 'Judul Buku', 'Kategori', 'Tgl Pinjam', 'Batas Kembali', 'Tgl Dikembalikan', 'Status', 'Denda (Rp)'];
      const rows = loans.map(l => [
        l.id, l.memberName, l.memberNis, l.memberClass, l.bookTitle, l.bookCategory, l.borrowDate, l.dueDate, l.returnDate || '-', l.status, l.fineAmount
      ]);
      downloadCsv(`laporan_sirkulasi_peminjaman_${timestamp}`, headers, rows);
    } else {
      const headers = ['ID', 'Tanggal', 'Jam', 'Nama Pengunjung', 'Status', 'NIS/NIP', 'Kelas/Unit', 'Keperluan', 'Catatan'];
      const rows = guestBook.map(g => [
        g.id, g.date, g.time, g.name, g.role, g.identifier, g.classOrUnit, g.purpose, g.notes || '-'
      ]);
      downloadCsv(`laporan_kunjungan_perpustakaan_${timestamp}`, headers, rows);
    }

    pushNotification('Unduh Laporan Berhasil', `Berkas laporan resmi berhasil diekspor ke format CSV / Excel.`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Interactive Controls (Hidden during physical print) */}
      <div className="no-print space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Pusat Laporan & Ekspor Data Perpustakaan
            </h2>
            <p className="text-xs text-slate-500">
              Cetak laporan berkala dan ekspor rekaman sirkulasi, data buku, anggota, dan keterlambatan ke Excel / PDF
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCurrentReport}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor Excel (.csv)
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Lembar Resmi
            </button>
          </div>
        </div>

        {/* Report Type Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'loans', label: 'Sirkulasi & Denda', icon: ArrowLeftRight, count: loans.length },
            { id: 'books', label: 'Master Data Buku', icon: BookOpen, count: books.length },
            { id: 'members', label: 'Data Anggota Siswa', icon: Users, count: members.length },
            { id: 'guestbook', label: 'Buku Tamu Kunjungan', icon: FileText, count: guestBook.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                    {tab.count}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">{tab.label}</div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Official Printable Report Paper Document */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Kop Surat Resmi Sekolah */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center relative">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-600">
            Pemerintah Daerah Provinsi · Dinas Pendidikan
          </h3>
          <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-900 mt-0.5">
            {profile.schoolName}
          </h2>
          <h4 className="text-xs font-bold text-indigo-700 tracking-wider uppercase mt-0.5">
            {profile.libraryName} · NPSN: {profile.npsn}
          </h4>
          <p className="text-[11px] text-slate-500 mt-1">
            {profile.address} · Telp: {profile.phone} · Email: {profile.email}
          </p>
        </div>

        {/* Title of Document */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 underline underline-offset-4">
              {reportType === 'loans' && 'LAPORAN REKAPITULASI TRANSAKSI SIRKULASI & DENDA'}
              {reportType === 'books' && 'LAPORAN MASTER DATA KOLEKSI PUSTAKA & E-BOOK'}
              {reportType === 'members' && 'LAPORAN REKAPITULASI ANGGOTA PERPUSTAKAAN'}
              {reportType === 'guestbook' && 'LAPORAN REKAPITULASI KUNJUNGAN BUKU TAMU'}
            </h3>
            <span className="text-slate-500 text-[11px]">
              Tahun Ajaran Aktif · Dicetak pada: {formatDateIndo(todayStr)}
            </span>
          </div>
          <div className="text-right text-[11px] font-mono text-slate-500">
            Status: Dokumen Resmi Terverifikasi
          </div>
        </div>

        {/* Report Content Table */}
        <div className="overflow-x-auto">
          {reportType === 'loans' && (
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-r border-slate-300">No.</th>
                  <th className="p-2 border-r border-slate-300">ID Pinjam</th>
                  <th className="p-2 border-r border-slate-300">Nama Peminjam / NIS</th>
                  <th className="p-2 border-r border-slate-300">Kelas</th>
                  <th className="p-2 border-r border-slate-300">Judul Buku</th>
                  <th className="p-2 border-r border-slate-300">Tgl Pinjam</th>
                  <th className="p-2 border-r border-slate-300">Jatuh Tempo</th>
                  <th className="p-2 border-r border-slate-300">Status</th>
                  <th className="p-2 text-right">Denda (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loans.map((loan, idx) => (
                  <tr key={loan.id} className="text-[11px]">
                    <td className="p-2 font-mono text-center border-r border-slate-200">{idx + 1}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{loan.id}</td>
                    <td className="p-2 font-medium border-r border-slate-200">
                      {loan.memberName} <span className="text-slate-500 font-mono text-[10px]">({loan.memberNis})</span>
                    </td>
                    <td className="p-2 border-r border-slate-200">{loan.memberClass}</td>
                    <td className="p-2 border-r border-slate-200 max-w-[200px] truncate">{loan.bookTitle}</td>
                    <td className="p-2 font-mono border-r border-slate-200 whitespace-nowrap">{loan.borrowDate}</td>
                    <td className="p-2 font-mono border-r border-slate-200 whitespace-nowrap">{loan.dueDate}</td>
                    <td className="p-2 border-r border-slate-200 capitalize font-semibold">
                      {loan.status.replace('_', ' ')}
                    </td>
                    <td className="p-2 text-right font-mono font-bold">
                      {loan.fineAmount > 0 ? formatRupiah(loan.fineAmount) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'books' && (
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-r border-slate-300">No.</th>
                  <th className="p-2 border-r border-slate-300">Judul Buku</th>
                  <th className="p-2 border-r border-slate-300">Pengarang / Penerbit</th>
                  <th className="p-2 border-r border-slate-300">Kategori</th>
                  <th className="p-2 border-r border-slate-300">No. Rak</th>
                  <th className="p-2 border-r border-slate-300 font-mono text-center">Fisik</th>
                  <th className="p-2 border-r border-slate-300 font-mono text-center">Sisa</th>
                  <th className="p-2 text-center">E-Book</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {books.map((b, idx) => (
                  <tr key={b.id}>
                    <td className="p-2 font-mono text-center border-r border-slate-200">{idx + 1}</td>
                    <td className="p-2 font-semibold border-r border-slate-200">{b.title}</td>
                    <td className="p-2 border-r border-slate-200">{b.author} · {b.publisher} ({b.year})</td>
                    <td className="p-2 border-r border-slate-200">{b.category}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{b.callNumber}</td>
                    <td className="p-2 font-mono text-center border-r border-slate-200">{b.physicalStock}</td>
                    <td className="p-2 font-mono text-center border-r border-slate-200 font-bold">{b.availableStock}</td>
                    <td className="p-2 text-center">{b.isEbookAvailable ? 'Ada (PDF)' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'members' && (
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-r border-slate-300">No.</th>
                  <th className="p-2 border-r border-slate-300">Nama Lengkap</th>
                  <th className="p-2 border-r border-slate-300">NIS</th>
                  <th className="p-2 border-r border-slate-300">NISN</th>
                  <th className="p-2 border-r border-slate-300">Tingkat / Rombel</th>
                  <th className="p-2 border-r border-slate-300">Kontak</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {members.map((m, idx) => (
                  <tr key={m.id}>
                    <td className="p-2 font-mono text-center border-r border-slate-200">{idx + 1}</td>
                    <td className="p-2 font-bold border-r border-slate-200">{m.name}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{m.nis}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{m.nisn}</td>
                    <td className="p-2 border-r border-slate-200">{m.classGroup}</td>
                    <td className="p-2 border-r border-slate-200">{m.email}</td>
                    <td className="p-2 text-center font-bold text-emerald-700 capitalize">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'guestbook' && (
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-r border-slate-300">No.</th>
                  <th className="p-2 border-r border-slate-300">Waktu</th>
                  <th className="p-2 border-r border-slate-300">Nama Pengunjung</th>
                  <th className="p-2 border-r border-slate-300">Peran & NIS</th>
                  <th className="p-2 border-r border-slate-300">Kelas / Unit</th>
                  <th className="p-2">Keperluan Kunjungan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {guestBook.map((g, idx) => (
                  <tr key={g.id}>
                    <td className="p-2 font-mono text-center border-r border-slate-200">{idx + 1}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{g.date} {g.time}</td>
                    <td className="p-2 font-bold border-r border-slate-200">{g.name}</td>
                    <td className="p-2 border-r border-slate-200">{g.role} ({g.identifier})</td>
                    <td className="p-2 border-r border-slate-200">{g.classOrUnit}</td>
                    <td className="p-2">{g.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Official Signatures Section for High School Paperwork */}
        <div className="mt-12 pt-6 grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-semibold text-slate-800">Kepala Sekolah</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-900">{profile.headOfSchool}</p>
            <p className="text-[10px] font-mono text-slate-500">NIP. 19680315 199403 1 004</p>
          </div>

          <div>
            <p className="text-slate-500">Dibuat Oleh,</p>
            <p className="font-semibold text-slate-800">Kepala Perpustakaan</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-900">{profile.headOfLibrary}</p>
            <p className="text-[10px] font-mono text-slate-500">NIP. 19740518 199903 2 003</p>
          </div>
        </div>

      </div>

    </div>
  );
};
