import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Feedback, FaqItem } from '../types';
import { formatDateIndo } from '../utils/export';
import { 
  HelpCircle, MessageSquare, Send, CheckCircle2, 
  Clock, ChevronDown, ChevronUp, Reply, Shield, UserPlus 
} from 'lucide-react';

export const FeedbackFaqView: React.FC = () => {
  const { 
    faqs, feedbacks, role, activeMember, submitFeedback, 
    respondFeedback, pushNotification 
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'faq' | 'feedback'>('faq');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Student feedback form
  const [category, setCategory] = useState<Feedback['category']>('Saran Buku Baru');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin response modal / inline state
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    submitFeedback(category, message);
    setMessage('');
    setIsSubmitting(false);
  };

  const handleAdminReply = (id: string) => {
    if (!responseText.trim()) return;
    respondFeedback(id, responseText);
    setReplyingId(null);
    setResponseText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Pusat Bantuan, FAQ & Kotak Saran
          </h2>
          <p className="text-xs text-slate-500">
            Panduan tata tertib perpustakaan SMA dan saluran aspirasi pengadaan koleksi serta perbaikan fasilitas
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> FAQ & Tata Tertib
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Kotak Saran ({feedbacks.length})
          </button>
        </div>
      </div>

      {/* Tab 1: FAQ Accordion */}
      {activeTab === 'faq' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* FAQ Accordion List (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {faqs.map(faq => {
              const isOpen = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-3 font-semibold text-slate-900 hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-slate-900 border border-amber-400/40">
                        {faq.category}
                      </span>
                      <span className="text-xs sm:text-sm">{faq.question}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/40 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guidelines Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              Jam Operasional Perpustakaan
            </h4>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Senin - Kamis</span>
                <span className="font-mono font-bold text-slate-900">07:00 - 15:30 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Jumat</span>
                <span className="font-mono font-bold text-slate-900">07:00 - 11:30 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu (KIR/Ekskul)</span>
                <span className="font-mono font-bold text-slate-900">08:00 - 12:00 WIB</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Minggu & Libur Nasional</span>
                <span className="font-bold">Tutup</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h5 className="text-[11px] font-bold text-slate-800 mb-1">Tata Tertib Ruang Baca:</h5>
              <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
                <li>Menitipkan tas dan jaket di loker depan.</li>
                <li>Menjaga ketenangan dan kebersihan meja baca.</li>
                <li>Dilarang membawa makanan berat ke area koleksi.</li>
                <li>Wajib mengisi buku tamu di tablet kios pintu masuk.</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Feedback & Kotak Saran */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Submission Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#0B192C] text-amber-400 flex items-center justify-center font-bold shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Kirim Saran & Aspirasi
                </h3>
                <p className="text-xs text-slate-500">
                  Usulkan buku baru atau berikan masukan layanan
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Pengirim</span>
                <p className="font-bold text-slate-900">{activeMember.name}</p>
                <p className="text-slate-500 font-mono text-[11px]">
                  NIS: {activeMember.nis} · {activeMember.classGroup}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Kategori Aspirasi
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Saran Buku Baru">Usulan Pengadaan Buku Baru</option>
                  <option value="Koleksi Buku">Kritik & Saran Koleksi yang Ada</option>
                  <option value="Fasilitas & Ruangan">Fasilitas, AC, Stop Kontak & Ruangan</option>
                  <option value="Layanan Pustakawan">Pelayanan Sirkulasi Pustakawan</option>
                  <option value="Lainnya">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pesan / Uraian Masukan *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan judul buku, edisi, atau detail saran fasilitas secara lengkap..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0B192C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.2]" /> Kirimkan Aspirasi Saya
              </button>
            </form>
          </div>

          {/* Feedback Feed & Responses (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Saran & Tanggapan Pustakawan ({feedbacks.length})
            </h3>

            {feedbacks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                Belum ada masukan yang terkirim.
              </div>
            ) : (
              feedbacks.map(fb => (
                <div key={fb.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  
                  {/* Header of card */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{fb.senderName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">NIS: {fb.senderNis}</span>
                      </div>
                      <span className="text-[10px] text-[#0B192C] font-bold mt-0.5 block">
                        Kategori: {fb.category}
                      </span>
                    </div>

                    <div className="text-right text-[10px] text-slate-400 font-mono">
                      {formatDateIndo(fb.date)} · {fb.time}
                    </div>
                  </div>

                  {/* Message body */}
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{fb.message}"
                  </p>

                  {/* Admin official response */}
                  {fb.adminResponse ? (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tanggapan Pustakawan
                        </span>
                        {fb.responseDate && (
                          <span className="text-[10px] font-mono text-emerald-700">
                            {formatDateIndo(fb.responseDate)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        {fb.adminResponse}
                      </p>
                    </div>
                  ) : (
                    role === 'admin' ? (
                      <div>
                        {replyingId === fb.id ? (
                          <div className="space-y-2 pt-2">
                            <textarea
                              rows={2}
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Tulis tanggapan resmi dari pihak perpustakaan..."
                              className="w-full text-xs p-2 rounded-lg border border-slate-300"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAdminReply(fb.id)}
                                className="px-3.5 py-1.5 rounded-lg bg-[#0B192C] hover:bg-slate-800 text-amber-400 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Publikasikan Tanggapan
                              </button>
                              <button
                                onClick={() => setReplyingId(null)}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyingId(fb.id);
                              setResponseText('');
                            }}
                            className="text-xs font-bold text-[#0B192C] hover:text-slate-700 flex items-center gap-1 mt-1 cursor-pointer"
                          >
                            <Reply className="w-3 h-3 text-amber-500" /> Beri Tanggapan Resmi
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-amber-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Menunggu tanggapan dari pustakawan
                      </span>
                    )
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
