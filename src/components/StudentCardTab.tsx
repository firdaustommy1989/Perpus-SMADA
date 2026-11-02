import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { QrCodeSvg, BarcodeSvg } from '../utils/qrcode';
import { Printer, BookOpen, ShieldCheck, Download } from 'lucide-react';

export const StudentCardTab: React.FC = () => {
  const { activeMember, profile } = useLibrary();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B192C] font-heading">
            Kartu Tanda Anggota (KTA) Digital
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gunakan QR Code di bawah untuk verifikasi peminjaman mandiri dan presensi di perpustakaan
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
        >
          <Printer className="w-4 h-4 stroke-[2.2]" /> Cetak / Unduh KTA
        </button>
      </div>

      {/* Card Preview (Deep Navy with Bright Yellow Accents) */}
      <div className="flex justify-center py-6">
        <div className="w-[420px] sm:w-[480px] bg-gradient-to-br from-[#071324] via-[#0B192C] to-[#142844] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-400/40 relative overflow-hidden flex flex-col justify-between">
          
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3.5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-xs">
                <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-[11px] font-extrabold tracking-wider uppercase text-amber-400 font-heading">
                  {profile.schoolName}
                </h4>
                <p className="text-xs font-bold text-white tracking-wide">
                  {profile.libraryName}
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  NPSN: {profile.npsn} · {profile.accreditation.split('(')[0]}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 uppercase shadow-xs">
                {activeMember.role === 'guru' ? 'GURU / TENDIK' : 'SISWA SMA'}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-12 gap-4 my-5 items-center relative z-10">
            <div className="col-span-3">
              <div className="w-20 h-24 rounded-xl bg-[#0F223D] border-2 border-amber-400/60 overflow-hidden shadow-inner flex items-center justify-center">
                <img
                  src={activeMember.avatar}
                  alt={activeMember.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <div className="text-xs font-bold text-amber-300">
                  {activeMember.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="col-span-6 space-y-1.5 text-left">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                  Nama Anggota
                </span>
                <p className="text-sm font-bold text-white leading-tight truncate">
                  {activeMember.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div>
                  <span className="text-[8px] text-slate-400 block uppercase">NIS</span>
                  <span className="font-mono font-bold text-amber-300">{activeMember.nis}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 block uppercase">NISN</span>
                  <span className="font-mono text-slate-300">{activeMember.nisn}</span>
                </div>
              </div>
              <div className="text-[10px]">
                <span className="text-[8px] text-slate-400 block uppercase">Kelas / Rombel</span>
                <span className="font-semibold text-slate-100">{activeMember.classGroup}</span>
              </div>
              <div className="text-[9px] text-emerald-400 flex items-center gap-1 pt-0.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Aktif
              </div>
            </div>

            <div className="col-span-3 flex flex-col items-center justify-center">
              <div className="bg-white p-1 rounded-xl shadow-md border border-amber-400/30">
                <QrCodeSvg value={`SMA-LIB:${activeMember.nis}`} size={70} />
              </div>
              <span className="text-[8px] font-mono text-amber-300/80 mt-1 uppercase font-semibold">
                Scan Masuk
              </span>
            </div>
          </div>

          {/* Footer Barcode */}
          <div className="border-t border-[#1E3A5F] pt-3 flex items-end justify-between relative z-10">
            <div className="bg-white px-2 py-0.5 rounded-md text-slate-900 shadow-xs">
              <BarcodeSvg value={activeMember.nis} width={140} height={22} />
            </div>

            <div className="text-right text-[8px] text-slate-300 leading-tight">
              <p>Kepala Perpustakaan,</p>
              <div className="font-serif italic text-amber-300 text-[10px] my-0.5">
                Endang S.
              </div>
              <p className="font-semibold text-white">{profile.headOfLibrary.split(',')[0]}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
