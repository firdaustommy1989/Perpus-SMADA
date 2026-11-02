import React, { useState } from 'react';
import { Book, Member } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { formatDateIndo, formatRupiah } from '../utils/export';
import { X, Calendar, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoanModalProps {
  book: Book;
  onClose: () => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({ book, onClose }) => {
  const { role, activeMember, members, profile, requestLoan, pushNotification } = useLibrary();
  const [selectedMemberId, setSelectedMemberId] = useState<string>(activeMember.id);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (profile.maxBorrowDays || 7));

  const borrowDateStr = borrowDate.toISOString().split('T')[0];
  const dueDateStr = dueDate.toISOString().split('T')[0];

  const handleConfirm = () => {
    const res = requestLoan(book.id, notes);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pengajuan Peminjaman Buku Fisik
              </h3>
              <p className="text-xs text-slate-500">
                Sirkulasi peminjaman bahan pustaka perpustakaan SMA
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Book Preview */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-3 items-center">
          <div className="w-12 h-16 rounded bg-slate-200 overflow-hidden shrink-0 shadow-xs">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                SMA
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{book.title}</h4>
            <p className="text-[11px] text-slate-500 truncate">{book.author} · {book.publisher}</p>
            <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-1">
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                Rak: {book.callNumber}
              </span>
              <span>Tersedia: {book.availableStock} eks</span>
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div className="mt-4 space-y-3">
          {role === 'admin' ? (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Pilih Anggota Peminjam
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.classGroup} - NIS: {m.nis})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Peminjam</span>
              <p className="text-xs font-bold text-slate-900">{activeMember.name}</p>
              <p className="text-[11px] text-slate-500">NIS: {activeMember.nis} · {activeMember.classGroup}</p>
            </div>
          )}

          {/* Dates Schedule */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                Tanggal Pinjam
              </span>
              <span className="text-xs font-mono font-semibold text-slate-800">
                {formatDateIndo(borrowDateStr)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                Batas Pengembalian
              </span>
              <span className="text-xs font-mono font-semibold text-indigo-900">
                {formatDateIndo(dueDateStr)} ({profile.maxBorrowDays} hari)
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Catatan / Keperluan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Persiapan olimpiade sains / bahan tugas kelompok"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
            ⚠️ Denda keterlambatan: {formatRupiah(profile.finePerDay)} per hari kalender. Harap kembalikan tepat waktu.
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Konfirmasi Peminjaman
          </button>
        </div>

      </div>
    </div>
  );
};
