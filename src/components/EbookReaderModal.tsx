import React, { useState } from 'react';
import { Book } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { 
  X, Download, ZoomIn, ZoomOut, Maximize2, Minimize2, 
  ChevronLeft, ChevronRight, Bookmark, BookOpen, Sun, Moon, Coffee, Check
} from 'lucide-react';

interface EbookReaderModalProps {
  book: Book;
  onClose: () => void;
}

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({ book, onClose }) => {
  const { pushNotification, profile } = useLibrary();
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [fontSize, setFontSize] = useState<number>(16);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const chapters = book.sampleContent && book.sampleContent.length > 0 
    ? book.sampleContent 
    : [
        {
          title: 'Halaman Pengantar & Ringkasan Materi',
          pageStart: 1,
          content: `${book.title}\nPenulis: ${book.author}\nPenerbit: ${book.publisher} (${book.year})\nISBN: ${book.isbn}\nKategori: ${book.category}\n\nSinopsis & Deskripsi:\n${book.description}\n\nCatatan Pustakawan: Berkas versi digital lengkap telah diunggah ke repositori e-library SMA untuk peminjaman mandiri siswa.`
        }
      ];

  const currentChapter = chapters[currentChapterIdx] || chapters[0];

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(15);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          pushNotification(
            'Unduh Berkas Selesai',
            `Modul digital "${book.ebookFileName || book.title + '.pdf'}" (${book.ebookSizeMb || 12} MB) berhasil disimpan untuk dipelajari secara offline.`,
            'success'
          );
          return 0;
        }
        return prev + 25;
      });
    }, 200);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#433422] border-[#ebd7be]';
      case 'dark':
        return 'bg-[#181a1b] text-[#e8e6e3] border-[#2d3134]';
      default:
        return 'bg-white text-slate-800 border-slate-200';
    }
  };

  const getReaderBackground = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f4e4c1]';
      case 'dark':
        return 'bg-[#0f1112]';
      default:
        return 'bg-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4">
      <div className={`w-full ${isFullScreen ? 'h-full rounded-none' : 'max-w-5xl h-[92vh] rounded-2xl'} flex flex-col shadow-2xl overflow-hidden border transition-all ${getThemeClasses()}`}>
        
        {/* Header Toolbar */}
        <div className="px-4 py-3 border-b flex items-center justify-between gap-3 shrink-0 bg-inherit">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">
                {book.title}
              </h3>
              <p className="text-[11px] opacity-70 truncate">
                {book.author} · {currentChapter.title}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Font Size Adjust */}
            <div className="hidden sm:flex items-center border rounded-lg px-2 py-1 text-xs gap-2">
              <button
                onClick={() => setFontSize(s => Math.max(13, s - 1))}
                className="hover:opacity-75 font-bold px-1"
                title="Perkecil Teks"
              >
                A-
              </button>
              <span className="font-mono text-[11px] opacity-60">{fontSize}px</span>
              <button
                onClick={() => setFontSize(s => Math.min(24, s + 1))}
                className="hover:opacity-75 font-bold px-1"
                title="Perbesar Teks"
              >
                A+
              </button>
            </div>

            {/* Reading Theme Toggle */}
            <div className="flex items-center border rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded ${theme === 'light' ? 'bg-white shadow-xs text-slate-900' : 'opacity-60 hover:opacity-100'}`}
                title="Mode Terang"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-1.5 rounded ${theme === 'sepia' ? 'bg-[#ebd7be] text-[#433422]' : 'opacity-60 hover:opacity-100'}`}
                title="Mode Sepia (Nyaman Membaca)"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded ${theme === 'dark' ? 'bg-slate-800 text-white' : 'opacity-60 hover:opacity-100'}`}
                title="Mode Gelap"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => {
                setBookmarked(!bookmarked);
                pushNotification(
                  bookmarked ? 'Penanda Dihapus' : 'Halaman Ditandai',
                  `${currentChapter.title} disimpan ke daftar bacaan Anda.`,
                  'info'
                );
              }}
              className={`p-2 rounded-lg border transition-colors ${
                bookmarked ? 'text-amber-600 border-amber-300 bg-amber-50' : 'opacity-70 hover:opacity-100'
              }`}
              title="Tandai Halaman (Bookmark)"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isDownloading ? `${downloadProgress}%` : 'Unduh PDF'}
              </span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-lg border opacity-70 hover:opacity-100 transition-colors"
              title={isFullScreen ? 'Kecilkan' : 'Layar Penuh'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg border hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
              title="Tutup Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Download progress bar */}
        {isDownloading && (
          <div className="w-full bg-indigo-100 h-1">
            <div 
              className="bg-indigo-600 h-1 transition-all duration-200" 
              style={{ width: `${downloadProgress}%` }} 
            />
          </div>
        )}

        {/* Reader Body: Sidebar Chapters + Main Reading Canvas */}
        <div className={`flex-1 flex overflow-hidden ${getReaderBackground()}`}>
          
          {/* Chapter navigation sidebar */}
          <div className="hidden md:block w-64 border-r border-inherit bg-inherit/40 overflow-y-auto p-4 shrink-0">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">
              Daftar Bab & Materi
            </h4>
            <div className="space-y-1">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentChapterIdx(idx)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors block ${
                    currentChapterIdx === idx
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-black/5 opacity-80'
                  }`}
                >
                  <div className="truncate font-medium">{ch.title}</div>
                  <div className={`text-[10px] mt-0.5 ${currentChapterIdx === idx ? 'text-indigo-100' : 'opacity-60'}`}>
                    Hal. {ch.pageStart}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-inherit/60 text-[11px] opacity-70">
              <p className="font-semibold mb-1">Informasi Digital:</p>
              <p>Format: PDF E-Pub 3.0</p>
              <p>Lisensi: Kemdikbudristek</p>
              <p>Penyedia: Perpustakaan SMA</p>
            </div>
          </div>

          {/* Reading Page Paper Simulation */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            <div 
              className={`max-w-2xl w-full p-6 sm:p-12 rounded-xl shadow-md border ${getThemeClasses()} my-auto min-h-[500px] flex flex-col justify-between`}
            >
              <div>
                <div className="border-b pb-3 mb-6 flex items-center justify-between text-xs opacity-60">
                  <span className="font-mono">Koleksi Digital SMA Negeri 1 Teladan</span>
                  <span>{book.category}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">
                  {currentChapter.title}
                </h2>

                <div 
                  className="leading-relaxed whitespace-pre-line select-text"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {currentChapter.content}
                </div>
              </div>

              <div className="mt-12 pt-4 border-t flex items-center justify-between text-xs opacity-60 font-mono">
                <span>Bab {currentChapterIdx + 1} dari {chapters.length}</span>
                <span>Halaman {currentChapter.pageStart + currentChapterIdx * 12}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Page Navigation */}
        <div className="px-4 py-2.5 border-t flex items-center justify-between shrink-0 bg-inherit text-xs">
          <button
            onClick={() => setCurrentChapterIdx(i => Math.max(0, i - 1))}
            disabled={currentChapterIdx === 0}
            className="px-3 py-1.5 rounded-lg border flex items-center gap-1.5 disabled:opacity-40 hover:bg-black/5 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Bab Sebelumnya
          </button>

          <div className="flex items-center gap-2">
            <span className="opacity-70 font-mono">
              Bab {currentChapterIdx + 1} / {chapters.length}
            </span>
          </div>

          <button
            onClick={() => setCurrentChapterIdx(i => Math.min(chapters.length - 1, i + 1))}
            disabled={currentChapterIdx >= chapters.length - 1}
            className="px-3 py-1.5 rounded-lg border flex items-center gap-1.5 disabled:opacity-40 hover:bg-black/5 transition-colors font-medium"
          >
            Bab Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
