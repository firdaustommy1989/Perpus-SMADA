import React, { useState, useRef } from 'react';
import { Book, BookCategory } from '../types';
import { X, BookPlus, Save, Upload, FileText, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';

interface BookFormModalProps {
  initialData?: Book | null;
  onClose: () => void;
  onSave: (data: Omit<Book, 'id'> | Book) => void;
}

const CATEGORIES: BookCategory[] = [
  'Buku Pelajaran (Kurikulum Merdeka)',
  'Sains & Teknologi',
  'Fiksi & Sastra',
  'Sejarah & Sosial',
  'Ensiklopedia & Referensi',
  'Pengembangan Diri',
  'Agama & Budi Pekerti'
];

export const BookFormModal: React.FC<BookFormModalProps> = ({ initialData, onClose, onSave }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [publisher, setPublisher] = useState(initialData?.publisher || '');
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [isbn, setIsbn] = useState(initialData?.isbn || '978-623-');
  const [category, setCategory] = useState<BookCategory>(initialData?.category || 'Buku Pelajaran (Kurikulum Merdeka)');
  const [callNumber, setCallNumber] = useState(initialData?.callNumber || '');
  const [physicalStock, setPhysicalStock] = useState(initialData?.physicalStock || 10);
  const [isEbookAvailable, setIsEbookAvailable] = useState<boolean>(initialData?.isEbookAvailable ?? true);
  const [ebookFileName, setEbookFileName] = useState(initialData?.ebookFileName || '');
  const [ebookSizeMb, setEbookSizeMb] = useState(initialData?.ebookSizeMb || 12.5);
  const [pages, setPages] = useState(initialData?.pages || 240);
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '');

  // File Upload State
  const [coverFileName, setCoverFileName] = useState('');
  const [uploadedPdfSuccess, setUploadedPdfSuccess] = useState(false);
  const [uploadedChapters, setUploadedChapters] = useState(initialData?.sampleContent || []);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Handle Cover Image Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setCoverUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle PDF / E-book File Upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(1));
    setEbookFileName(file.name);
    setEbookSizeMb(sizeMb > 0 ? sizeMb : 1.2);
    setIsEbookAvailable(true);
    setUploadedPdfSuccess(true);

    // Create customized reading chapters based on uploaded document
    setUploadedChapters([
      {
        title: `Bab 1: Ikhtisar ${file.name.replace('.pdf', '')}`,
        pageStart: 1,
        content: `Berkas Digital Resmi: ${file.name}\nUkuran Berkas: ${sizeMb || 1.2} MB\nWaktu Unggah: ${new Date().toLocaleString('id-ID')}\n\nDokumen e-book ini telah berhasil diverifikasi oleh Pustakawan dan diintegrasikan ke perpustakaan digital SMA. Siswa dapat membaca materi lengkap serta mengunduhnya langsung ke perangkat masing-masing.`
      },
      {
        title: 'Bab 2: Pokok Bahasan & Ringkasan Materi',
        pageStart: 35,
        content: `Ringkasan Pokok:\n${description || 'Materi pembelajaran disusun terstruktur sesuai kurikulum sekolah.'}\n\nKompetensi Inti:\n1. Memahami konsep dasar dan terminologi ilmiah\n2. Melakukan analisis studi kasus dan soal latihan kontekstual\n3. Menerapkan pemecahan masalah berbasis bernalar kritis.`
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const bookPayload = {
      title,
      author,
      publisher,
      year: Number(year),
      isbn,
      category,
      callNumber: callNumber || `${category.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      physicalStock: Number(physicalStock),
      availableStock: initialData ? initialData.availableStock : Number(physicalStock),
      coverUrl,
      isEbookAvailable,
      ebookFileName: isEbookAvailable ? (ebookFileName || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`) : undefined,
      ebookSizeMb: isEbookAvailable ? Number(ebookSizeMb) : undefined,
      description,
      pages: Number(pages),
      language: 'Indonesia',
      sampleContent: uploadedChapters.length > 0 ? uploadedChapters : [
        {
          title: 'Bab 1: Pengenalan & Konsep Dasar',
          pageStart: 1,
          content: `Buku: ${title}\nPenulis: ${author}\n\nMateri ini disiapkan untuk mendukung pembelajaran aktif siswa SMA. Pembaca dapat mempelajari pokok-pokok bahasan penting, ringkasan teori, dan latihan studi kasus terapan.`
        }
      ]
    };

    onSave(bookPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B192C] text-amber-400 flex items-center justify-center shadow-xs font-bold">
              <BookPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Data Bahan Pustaka' : 'Tambah Koleksi Buku Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Kelola metadata buku fisik, upload sampul gambar, dan berkas e-book digital
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* Section: Upload Sampul Cover Buku */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#0B192C]" />
                Upload Sampul / Cover Buku
              </label>
              <span className="text-[11px] text-slate-500">
                Format JPG, PNG, atau WEBP
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Cover Preview Thumbnail */}
              <div className="w-16 h-20 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[10px] text-slate-400 font-bold text-center px-1">
                    Belum Ada Sampul
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-600" /> Pilih Berkas Foto dari Komputer
                  </button>

                  {coverUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverUrl('');
                        setCoverFileName('');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Hapus Sampul"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {coverFileName && (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Berkas terpilih: {coverFileName}
                  </p>
                )}

                <div>
                  <input
                    type="text"
                    value={coverUrl.startsWith('data:') ? 'Foto terunggah (Data Base64)' : coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="Atau tempel URL gambar eksternal di sini..."
                    className="w-full text-[11px] p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Judul Buku *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kimia Anorganik SMA Kelas XII"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Penulis / Pengarang *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama penulis atau tim penyusun"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Penerbit *
              </label>
              <input
                type="text"
                required
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Contoh: Penerbit Erlangga, Balai Pustaka"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tahun Terbit
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Jumlah Hal.
              </label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Stok Fisik
              </label>
              <input
                type="number"
                min="0"
                value={physicalStock}
                onChange={(e) => setPhysicalStock(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                No. Rak Panggil
              </label>
              <input
                type="text"
                value={callNumber}
                onChange={(e) => setCallNumber(e.target.value)}
                placeholder="540.1 WAH k"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Kategori Buku
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BookCategory)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nomor ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-623-..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Section: Upload Berkas E-Book PDF Digital */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEbookAvailable}
                  onChange={(e) => setIsEbookAvailable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                Tersedia Versi E-Book / PDF Digital
              </label>
              <span className="text-[11px] text-indigo-600 font-medium">
                Dapat dibaca langsung di browser
              </span>
            </div>

            {isEbookAvailable && (
              <div className="space-y-2 pt-1 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600">
                    Upload Berkas PDF / E-Pub Buku:
                  </span>
                  
                  <input
                    type="file"
                    ref={pdfInputRef}
                    onChange={handlePdfUpload}
                    accept=".pdf,application/pdf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File PDF dari Perangkat
                  </button>
                </div>

                {uploadedPdfSuccess && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Berkas digital berhasil diunggah: <strong>{ebookFileName}</strong> ({ebookSizeMb} MB)</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Nama Berkas Digital
                    </label>
                    <input
                      type="text"
                      value={ebookFileName}
                      onChange={(e) => setEbookFileName(e.target.value)}
                      placeholder="nama_modul_pelajaran.pdf"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Ukuran File (MB)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={ebookSizeMb}
                      onChange={(e) => setEbookSizeMb(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Sinopsis & Deskripsi Materi
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi ringkas pokok bahasan buku atau kompetensi dasar..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0B192C]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.2]" /> Simpan Data Buku
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
