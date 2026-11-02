import React from 'react';
import { Member } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { QrCodeSvg, BarcodeSvg } from '../utils/qrcode';
import { X, Printer, Download, BookOpen, ShieldCheck } from 'lucide-react';

interface MemberCardModalProps {
  member: Member;
  onClose: () => void;
}

export const MemberCardModal: React.FC<MemberCardModalProps> = ({ member, onClose }) => {
  const { profile } = useLibrary();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
          <div>
            <h3 className="text-base font-bold text-[#0B192C] font-heading">
              Kartu Tanda Anggota (KTA) Digital
            </h3>
            <p className="text-xs text-slate-500">
              Kartu perpustakaan resmi berbasis QR Code & Barcode pemindai otomatis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.2]" /> Cetak Kartu
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Library Card Preview Container */}
        <div className="my-6 flex justify-center">
          
          {/* Card Physical Dimension (Standard CR80 ID Card Proportion) */}
          <div className="w-[420px] sm:w-[460px] bg-gradient-to-br from-[#071324] via-[#0B192C] to-[#142844] text-white rounded-2xl p-5 shadow-xl border border-amber-400/40 relative overflow-hidden flex flex-col justify-between">
            
            {/* Subtle background security accent */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#1E3A5F]/20 blur-2xl pointer-events-none" />

            {/* Header: School Letterhead */}
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 relative z-10">
              <div className="flex items-center gap-2.5">
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
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 uppercase shadow-xs">
                  {member.role === 'guru' ? 'GURU / PENDIDIK' : member.role === 'pegawai' ? 'PEGAWAI / STAF' : 'SISWA SMA'}
                </span>
              </div>
            </div>

            {/* Main Content: Avatar, Bio, QR Code */}
            <div className="grid grid-cols-12 gap-3.5 my-3.5 items-center relative z-10">
              
              {/* Photo */}
              <div className="col-span-3">
                <div className="w-20 h-24 rounded-lg bg-[#0F223D] border-2 border-amber-400/60 overflow-hidden shadow-inner flex items-center justify-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-xs font-bold text-amber-300">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Identity details */}
              <div className="col-span-6 space-y-1 text-left">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                    Nama Anggota
                  </span>
                  <p className="text-xs font-bold text-white leading-tight truncate">
                    {member.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase">
                      {member.role === 'siswa' ? 'NIS' : 'NIP / ID'}
                    </span>
                    <span className="font-mono font-bold text-amber-300 truncate block">
                      {member.nip || member.nis}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase">
                      {member.role === 'siswa' ? 'NISN' : 'NUPTK'}
                    </span>
                    <span className="font-mono text-slate-300 truncate block">
                      {member.nuptk || member.nisn || '-'}
                    </span>
                  </div>
                </div>
                <div className="text-[10px]">
                  <span className="text-[8px] text-slate-400 block uppercase">
                    {member.role === 'siswa' ? 'Kelas / Rombel' : 'Jabatan / Unit'}
                  </span>
                  <span className="font-semibold text-slate-100 truncate block">
                    {member.position || member.classGroup}
                  </span>
                </div>
                <div className="text-[9px] text-emerald-400 flex items-center gap-1 pt-0.5">
                  <ShieldCheck className="w-3 h-3" /> Status: Terverifikasi Aktif
                </div>
              </div>

              {/* QR Code */}
              <div className="col-span-3 flex flex-col items-center justify-center">
                <div className="bg-white p-1 rounded-lg shadow-md border border-amber-400/30">
                  <QrCodeSvg value={`SMA-LIB:${member.nis}`} size={68} />
                </div>
                <span className="text-[8px] font-mono text-amber-300/80 mt-1 uppercase font-semibold">
                  Scan Masuk
                </span>
              </div>
            </div>

            {/* Footer with Barcode & Signatures */}
            <div className="border-t border-[#1E3A5F] pt-2.5 flex items-end justify-between relative z-10">
              <div className="bg-white px-2 py-0.5 rounded text-slate-900 shadow-xs">
                <BarcodeSvg value={member.nis} width={130} height={22} />
              </div>

              <div className="text-right text-[8px] text-slate-300 leading-tight">
                <p>Kepala Perpustakaan,</p>
                <div className="font-serif italic text-amber-300 text-[10px] my-0.5">
                  Endang S.
                </div>
                <p className="font-semibold text-white">{profile.headOfLibrary.split(',')[0]}</p>
                <p className="text-[7px] text-slate-400">NIP. 19740518 199903 2 003</p>
              </div>
            </div>

          </div>

        </div>

        {/* Card Guidelines Note */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 no-print">
          <p className="font-semibold text-slate-800">Petunjuk Penggunaan Kartu:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
            <li>Tunjukkan QR Code ini pada scanner kamera di meja sirkulasi atau Kios Buku Tamu saat berkunjung.</li>
            <li>Kartu wajib dibawa setiap melakukan peminjaman buku fisik secara langsung.</li>
            <li>Kartu ini berlaku selama menjadi peserta didik atau staf aktif di {profile.schoolName}.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
