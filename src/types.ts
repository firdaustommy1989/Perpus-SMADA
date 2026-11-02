export type UserRole = 'admin' | 'siswa' | 'guest_kiosk';

export type BookCategory = 
  | 'Buku Pelajaran (Kurikulum Merdeka)'
  | 'Sains & Teknologi'
  | 'Fiksi & Sastra'
  | 'Sejarah & Sosial'
  | 'Ensiklopedia & Referensi'
  | 'Pengembangan Diri'
  | 'Agama & Budi Pekerti';

export interface BookChapter {
  title: string;
  pageStart: number;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  category: BookCategory;
  callNumber: string; // e.g. "530.1 PRA f"
  physicalStock: number;
  availableStock: number;
  coverUrl: string;
  isEbookAvailable: boolean;
  ebookFileName?: string;
  ebookSizeMb?: number;
  description: string;
  pages: number;
  language: string;
  sampleContent: BookChapter[];
}

export interface Member {
  id: string;
  nis: string; // for student: NIS; for staff: NIP or ID Pegawai
  nisn: string; // for student: NISN; for staff: NUPTK
  nip?: string;
  nuptk?: string;
  name: string;
  role: 'siswa' | 'guru' | 'pegawai';
  grade: 'X' | 'XI' | 'XII' | 'Guru' | 'Pegawai';
  classGroup: string; // e.g. "Fase E-2", "XI MIPA 1", or "Staf Perpustakaan", "Guru Fisika"
  position?: string; // e.g. "Pustakawan Pelaksana", "Guru Fisika SMA", "Kepala Tata Usaha"
  employmentStatus?: 'PNS' | 'PPPK' | 'Honorer / GTT' | 'Tenaga Kependidikan' | 'Pelajar';
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  status: 'aktif' | 'nonaktif';
}

export type LoanStatus = 'menunggu_persetujuan' | 'dipinjam' | 'kembali' | 'terlambat';

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  memberNis: string;
  memberClass: string;
  bookId: string;
  bookTitle: string;
  bookCategory: BookCategory;
  borrowDate: string; // YYYY-MM-DD
  dueDate: string;    // YYYY-MM-DD
  returnDate?: string;// YYYY-MM-DD
  status: LoanStatus;
  fineAmount: number; // in IDR
  notes?: string;
  approvedBy?: string;
}

export interface GuestBookEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  role: 'Siswa' | 'Guru' | 'Tamu';
  identifier: string; // NIS or NIP or KTP
  classOrUnit: string;
  purpose: 'Membaca di tempat' | 'Meminjam buku' | 'Mengerjakan tugas / Diskusi' | 'Menggunakan Komputer / E-Library' | 'Lainnya';
  notes?: string;
}

export interface Feedback {
  id: string;
  date: string;
  time: string;
  senderName: string;
  senderNis: string;
  role: 'Siswa' | 'Guru';
  category: 'Koleksi Buku' | 'Fasilitas & Ruangan' | 'Layanan Pustakawan' | 'Saran Buku Baru' | 'Lainnya';
  message: string;
  status: 'baru' | 'ditindaklanjuti' | 'selesai';
  adminResponse?: string;
  responseDate?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Keanggotaan' | 'Peminjaman & Denda' | 'Layanan Digital' | 'Tata Tertib';
}

export interface SchoolProfile {
  schoolName: string;
  npsn: string;
  libraryName: string;
  accreditation: string;
  headOfLibrary: string;
  headOfSchool: string;
  address: string;
  phone: string;
  email: string;
  maxBorrowDays: number;
  finePerDay: number; // e.g. Rp 1.000 / day
  maxBooksPerMember: number;
  soundEnabled: boolean;
  pushNotificationsEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  linkToTab?: string;
}
