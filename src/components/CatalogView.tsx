import React, { useState, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, BookCategory } from '../types';
import { EbookReaderModal } from './EbookReaderModal';
import { LoanModal } from './LoanModal';
import { BookFormModal } from './BookFormModal';
import { 
  Search, BookOpen, Bookmark, Plus, Edit2, Trash2, 
  FileText, CheckCircle2, AlertCircle, Sparkles, Filter, 
  Upload, Download, FileSpreadsheet, X
} from 'lucide-react';
import { downloadCsv } from '../utils/export';

const ALL_CATEGORY = 'Semua Kategori';

export const CatalogView: React.FC = () => {
  const { books, role, addBook, updateBook, deleteBook, pushNotification } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [filterEbookOnly, setFilterEbookOnly] = useState(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  // Modals state
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [borrowingBook, setBorrowingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const bookCsvRef = useRef<HTMLInputElement>(null);

  const categories = [
    ALL_CATEGORY,
    'Buku Pelajaran (Kurikulum Merdeka)',
    'Sains & Teknologi',
    'Fiksi & Sastra',
    'Sejarah & Sosial',
    'Ensiklopedia & Referensi',
    'Pengembangan Diri',
  ];

  const filteredBooks = books.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.callNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === ALL_CATEGORY || b.category === selectedCategory;
    const matchesEbook = !filterEbookOnly || b.isEbookAvailable;
    const matchesAvailable = !filterAvailableOnly || b.availableStock > 0;

    return matchesSearch && matchesCategory && matchesEbook && matchesAvailable;
  });

  // Export Books to CSV
  const handleExportBooks = () => {
    const headers = ['ID', 'Judul Buku', 'Pengarang', 'Penerbit', 'Tahun', 'ISBN', 'Kategori', 'No Rak', 'Stok Fisik', 'Stok Tersedia', 'Ada Ebook'];
    const rows = filteredBooks.map(b => [
      b.id, b.title, b.author, b.publisher, b.year, b.isbn, b.category, b.callNumber, b.physicalStock, b.availableStock, b.isEbookAvailable ? 'Ya' : 'Tidak'
    ]);
    downloadCsv(`katalog_buku_sma_${new Date().toISOString().split('T')[0]}`, headers, rows);
    pushNotification('Ekspor Katalog Berhasil', `${filteredBooks.length} data buku diekspor ke format CSV.`, 'success');
  };

  // Download Sample Template for Book Batch Import
  const handleDownloadBookTemplate = () => {
    const headers = ['Judul Buku', 'Pengarang', 'Penerbit', 'Tahun', 'ISBN', 'Kategori', 'No Rak', 'Stok Fisik', 'Deskripsi'];
    const sampleRows = [
      ['Kimia Terapan SMA Kelas XI', 'Dr. Budi Santoso', 'Erlangga Edukasi', '2024', '978-623-111-222-3', 'Sains & Teknologi', '540.2 BUD k', '15', 'Modul reaksi redoks dan stoikiometri'],
      ['Sosiologi Budaya Indonesia SMA', 'Dra. Retno Palupi', 'Balai Pustaka', '2023', '978-602-333-444-5', 'Sejarah & Sosial', '301.0 PAL s', '20', 'Kajian dinamika sosial masyarakat modern']
    ];
    downloadCsv('template_import_buku_perpustakaan', headers, sampleRows);
  };

  // Batch CSV Upload for Books
  const handleBatchBookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        alert('Berkas CSV kosong atau tidak memiliki data buku.');
        return;
      }

      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 2 && cols[0]) {
          addBook({
            title: cols[0],
            author: cols[1] || 'Tim Penyusun',
            publisher: cols[2] || 'Penerbit SMA',
            year: Number(cols[3]) || new Date().getFullYear(),
            isbn: cols[4] || `978-623-${Math.floor(Math.random() * 900000 + 100000)}`,
            category: (cols[5] as BookCategory) || 'Buku Pelajaran (Kurikulum Merdeka)',
            callNumber: cols[6] || `K-0${Math.floor(Math.random() * 900 + 100)}`,
            physicalStock: Number(cols[7]) || 10,
            availableStock: Number(cols[7]) || 10,
            coverUrl: '',
            isEbookAvailable: true,
            ebookFileName: `${cols[0].toLowerCase().replace(/\s+/g, '_')}.pdf`,
            ebookSizeMb: 12.5,
            description: cols[8] || 'Koleksi bahan pustaka perpustakaan digital sekolah.',
            pages: 250,
            language: 'Indonesia',
            sampleContent: [
              {
                title: 'Bab 1: Ikhtisar Pembelajaran',
                pageStart: 1,
                content: `Judul: ${cols[0]}\nPengarang: ${cols[1] || 'Tim Penyusun'}\n\nModul digital hasil impor data batch pustakawan.`
              }
            ]
          });
          count++;
        }
      }

      pushNotification('Import Buku Berhasil', `${count} koleksi buku berhasil diimpor dari berkas CSV.`, 'success');
      setShowBatchModal(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Katalog Buku & Repositori E-Book
          </h2>
          <p className="text-xs text-slate-500">
            Telusuri koleksi buku teks Kurikulum Merdeka, karya sastra, modul olimpiade, upload sampul & e-book
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {role === 'admin' && (
            <>
              <button
                onClick={() => setShowBatchModal(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="Import Buku dari Berkas CSV / Excel"
              >
                <Upload className="w-3.5 h-3.5 text-[#0B192C]" /> Upload Batch CSV
              </button>

              <button
                onClick={handleExportBooks}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0B192C]" /> Ekspor CSV
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.2]" /> Tambah Koleksi Buku
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        
        {/* Search Bar & Checkbox Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul buku, pengarang, nomor rak, atau ISBN..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B192C] focus:border-[#0B192C] text-slate-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 shrink-0">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filterEbookOnly}
                onChange={(e) => setFilterEbookOnly(e.target.checked)}
                className="rounded text-[#0B192C] focus:ring-amber-400"
              />
              <span>Tersedia E-Book Digital</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filterAvailableOnly}
                onChange={(e) => setFilterAvailableOnly(e.target.checked)}
                className="rounded text-[#0B192C] focus:ring-amber-400"
              />
              <span>Stok Fisik Tersedia</span>
            </label>
          </div>
        </div>

        {/* Category Segmented Controls (Section 1.A DO) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">
              Tidak ada buku yang cocok
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba gunakan kata kunci lain atau ubah filter kategori.
            </p>
          </div>
        ) : (
          filteredBooks.map((book) => {
            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Book Card Top: Cover + Badges */}
                <div>
                  <div className="relative aspect-3/4 bg-slate-100 overflow-hidden flex items-center justify-center">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      /* Styled CSS/SVG Fallback Container */
                      <div className="w-full h-full p-6 bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 text-white flex flex-col justify-between">
                        <div className="text-[10px] font-mono tracking-wider uppercase text-indigo-300">
                          {book.category}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold leading-snug line-clamp-3">
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 truncate">
                            {book.author}
                          </p>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {book.publisher} ({book.year})
                        </div>
                      </div>
                    )}

                    {/* Quick Ebook badge in Bright Yellow */}
                    {book.isEbookAvailable && (
                      <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
                        E-BOOK PDF
                      </div>
                    )}
                  </div>

                  {/* Metadata & Title (Zero-Pill discipline: unboxed text with dots) */}
                  <div className="p-5 space-y-2">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                      <span>{book.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{book.year}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="text-xs text-slate-600 truncate">
                      Penulis: {book.author}
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Rak: {book.callNumber}</span>
                      <span className={book.availableStock > 0 ? 'text-emerald-700 font-bold' : 'text-rose-500 font-bold'}>
                        {book.availableStock > 0 ? `Stok: ${book.availableStock}/${book.physicalStock}` : 'Stok Habis'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {book.isEbookAvailable ? (
                      <button
                        onClick={() => setReadingBook(book)}
                        className="w-full py-2 px-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-[#0B192C] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Baca Digital
                      </button>
                    ) : (
                      <div className="w-full py-2 px-2.5 rounded-xl bg-slate-50 text-slate-400 text-xs font-medium text-center">
                        Cetak Saja
                      </div>
                    )}

                    <button
                      onClick={() => setBorrowingBook(book)}
                      disabled={book.availableStock <= 0}
                      className="w-full py-2 px-2.5 rounded-xl bg-[#0B192C] hover:bg-[#152A47] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Pinjam Fisik
                    </button>
                  </div>

                  {/* Admin Edit/Delete */}
                  {role === 'admin' && (
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="text-xs font-semibold text-slate-600 hover:text-[#0B192C] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus buku "${book.title}"?`)) {
                            deleteBook(book.id);
                          }
                        }}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Reader Modal */}
      {readingBook && (
        <EbookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}

      {/* Loan Modal */}
      {borrowingBook && (
        <LoanModal
          book={borrowingBook}
          onClose={() => setBorrowingBook(null)}
        />
      )}

      {/* Add / Edit Book Modal */}
      {(showAddModal || editingBook) && (
        <BookFormModal
          initialData={editingBook}
          onClose={() => {
            setShowAddModal(false);
            setEditingBook(null);
          }}
          onSave={(data) => {
            if (editingBook) {
              updateBook(editingBook.id, data);
            } else {
              addBook(data as Omit<Book, 'id'>);
            }
          }}
        />
      )}

      {/* Batch Import CSV Modal for Books */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Import Batch Koleksi Buku via CSV
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload banyak data buku sekaligus ke katalog perpustakaan
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-indigo-950 block">Petunjuk Kolom Berkas:</span>
              <p className="text-indigo-900 leading-relaxed">
                Gunakan template CSV agar kolom Judul, Pengarang, Penerbit, Tahun, ISBN, dan Stok terdata dengan rapi.
              </p>
              <button
                type="button"
                onClick={handleDownloadBookTemplate}
                className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 text-indigo-700 font-bold hover:bg-indigo-50 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Template CSV Buku
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 hover:border-indigo-500 transition-colors bg-slate-50/50">
              <input
                type="file"
                ref={bookCsvRef}
                onChange={handleBatchBookUpload}
                accept=".csv,text/csv"
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Pilih Berkas CSV Koleksi Buku
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Format berkas .csv (Comma Separated Values)
                </p>
              </div>
              <button
                type="button"
                onClick={() => bookCsvRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Unggah & Masukkan ke Katalog
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
