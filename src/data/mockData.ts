import { Book, Member, Loan, GuestBookEntry, Feedback, FaqItem, SchoolProfile } from '../types';

export const initialSchoolProfile: SchoolProfile = {
  schoolName: 'SMA Negeri 1 Teladan Nusantara',
  npsn: '20103456',
  libraryName: 'Perpustakaan Widya Mandala SMA',
  accreditation: 'Akreditasi A (Unggul - Perpustakaan Nasional RI)',
  headOfLibrary: 'Dra. Endang Sulistyowati, M.Pd.',
  headOfSchool: 'Dr. H. Bambang Hartono, M.Si.',
  address: 'Jl. Pendidikan Karakter No. 45, Kompleks Pelajar Cendekia',
  phone: '(021) 789-2234',
  email: 'perpustakaan@sman1teladan.sch.id',
  maxBorrowDays: 7,
  finePerDay: 1000,
  maxBooksPerMember: 3,
  soundEnabled: true,
  pushNotificationsEnabled: true,
};

export const initialBooks: Book[] = [
  {
    id: 'b-001',
    title: 'Fisika SMA Terapan: Kinematika & Termodinamika',
    author: 'Dr. Andi Pratama & Soni Setiawan, M.Pd.',
    publisher: 'Penerbit Pustaka Edukasi',
    year: 2024,
    isbn: '978-623-456-101-2',
    category: 'Buku Pelajaran (Kurikulum Merdeka)',
    callNumber: '530.1 PRA f',
    physicalStock: 25,
    availableStock: 21,
    coverUrl: '/src/assets/images/book_cover_fisika_1793583766723.jpg',
    isEbookAvailable: true,
    ebookFileName: 'fisika_sma_terapan_rev2024.pdf',
    ebookSizeMb: 14.2,
    description: 'Buku teks utama Fisika SMA Fase F (Kelas XI) sesuai Kurikulum Merdeka. Membahas kinematika gerak, dinamika rotasi, fluida statis dan dinamis, termodinamika, serta penerapannya dalam teknologi terbarukan.',
    pages: 284,
    language: 'Indonesia',
    sampleContent: [
      {
        title: 'Bab 1: Vektor dan Kinematika Gerak Lurus',
        pageStart: 1,
        content: `A. Pengantar Vektor dalam Gerak
Dalam kehidupan sehari-hari, gerak suatu benda sering kali melibatkan besaran skalar dan besaran vektor. Kecepatan dan percepatan adalah contoh nyata besaran vektor yang memiliki nilai sekaligus arah.

1. Persamaan Gerak Lurus Beraturan (GLB):
s = v × t
di mana s adalah perpindahan (meter), v adalah kecepatan konstan (m/s), dan t adalah waktu (sekon).

2. Gerak Lurus Berubah Beraturan (GLBB):
v_t = v_0 + a × t
s = v_0 × t + 0.5 × a × t²
v_t² = v_0² + 2 × a × s

Contoh Soal Penerapan:
Sebuah mobil listrik milik sekolah bergerak dari keadaan diam dengan percepatan tetap 2,5 m/s². Berapakah kecepatan mobil tersebut setelah menempuh jarak 80 meter di lintasan uji coba?
Penyelesaian:
v_t² = 0 + 2(2,5)(80) = 400 => v_t = 20 m/s (72 km/jam).`
      },
      {
        title: 'Bab 2: Dinamika Gerak dan Hukum Gravitasi Newton',
        pageStart: 45,
        content: `Hukum Newton tentang Gerak:
Hukum I Newton (Kelembaman):
∑F = 0, jika resultan gaya yang bekerja pada benda bernilai nol, benda yang awalnya diam akan tetap diam, dan benda yang bergerak lurus beraturan akan tetap bergerak dengan kecepatan tetap.

Hukum II Newton:
∑F = m × a
Percepatan yang dihasilkan oleh resultan gaya berbanding lurus dengan gaya dan berbanding terbalik dengan massa kelembaman benda.

Hukum III Newton:
F_aksi = - F_reaksi
Gaya aksi dan reaksi selalu berpasangan, besarnya sama namun berlawanan arah dan bekerja pada dua benda yang berbeda.`
      },
      {
        title: 'Bab 3: Termodinamika dan Efisiensi Energi',
        pageStart: 98,
        content: `Hukum Pertama Termodinamika menyatakan kekekalan energi sistem:
ΔU = Q - W
di mana ΔU adalah perubahan energi dalam sistem, Q adalah kalor yang diserap/dilepas sistem, dan W adalah usaha yang dilakukan sistem terhadap lingkungan.

Mesin Carnot dan Siklus Efisiensi:
Efisiensi maksimum mesin kalor ideal adalah:
η = (1 - T_C / T_H) × 100%
Prinsip ini menjadi dasar dalam pengembangan teknologi pendingin ramah lingkungan dan PLTS surya modern.`
      }
    ]
  },
  {
    id: 'b-002',
    title: 'Biologi Sel & Ekosistem SMA: Genetik Modern',
    author: 'Dra. Retno Wulandari, M.Si.',
    publisher: 'Penerbit Edukasi Nasional',
    year: 2024,
    isbn: '978-602-998-341-9',
    category: 'Sains & Teknologi',
    callNumber: '570.2 WUL b',
    physicalStock: 18,
    availableStock: 15,
    coverUrl: '/src/assets/images/book_cover_biologi_1793583766794.jpg',
    isEbookAvailable: true,
    ebookFileName: 'biologi_sel_genetika_sma.pdf',
    ebookSizeMb: 18.5,
    description: 'Panduan komprehensif Biologi SMA mendalami struktur organel sel, metabolisme respirasi seluler, sintesis protein, pembelahan mitosis-meiosis, serta teknologi CRISPR dan rekayasa genetika modern.',
    pages: 312,
    language: 'Indonesia',
    sampleContent: [
      {
        title: 'Bab 1: Struktur & Fungsi Membran Sel',
        pageStart: 1,
        content: `A. Model Mosaik Cair Membran Sel
Membran sel terdiri dari lapisan ganda fosfolipid (phospholipid bilayer) yang bersifat amfifatik, memiliki kepala hidrofilik (menyenangi air) dan ekor hidrofobik (menolak air).

Transport Melalui Membran:
1. Transport Pasif: Tidak memerlukan energi ATP (contoh: difusi sederhana, difusi terfasilitasi saluran protein, dan osmosis).
2. Transport Aktif: Memerlukan energi ATP untuk memompa molekul melawan gradien konsentrasi (contoh: pompa Natrium-Kalium Na+/K+ ATP-ase).`
      },
      {
        title: 'Bab 2: Sintesis Protein dan Kode Genetik DNA',
        pageStart: 72,
        content: `Transkripsi dan Translasi:
DNA menyimpan cetak biru kehidupan melalui sekuens basa nitrogen Adenin (A), Timin (T), Guanin (G), dan Sitosin (C).

Proses Dogma Sentral:
1. Replikasi: Penggandaan rantai ganda DNA secara semikonservatif.
2. Transkripsi: Pembentukan RNA duta (mRNA) oleh enzim RNA polimerase di dalam inti sel (nukleus).
3. Translasi: Penerjemahan kodon mRNA menjadi urutan asam amino di ribosom dibantu tRNA.`
      }
    ]
  },
  {
    id: 'b-003',
    title: 'Sejarah Indonesia Kontemporer SMA: 1945 - Era Digital',
    author: 'Dr. Ahmad Fauzi, MA & Dra. Siti Nurhayati',
    publisher: 'Penerbit Pustaka Utama',
    year: 2023,
    isbn: '978-602-120-778-4',
    category: 'Sejarah & Sosial',
    callNumber: '959.8 FAU s',
    physicalStock: 20,
    availableStock: 17,
    coverUrl: '/src/assets/images/book_cover_sejarah_1793583766963.jpg',
    isEbookAvailable: true,
    ebookFileName: 'sejarah_indonesia_kontemporer.pdf',
    ebookSizeMb: 22.1,
    description: 'Menelusuri dinamika politik, ekonomi, diplomasi kemerdekaan, era Demokrasi Terpimpin, Orde Baru, hingga Reformasi dan integrasi kebangsaan di era transformasi digital Indonesia.',
    pages: 340,
    language: 'Indonesia',
    sampleContent: [
      {
        title: 'Bab 1: Proklamasi dan Perjuangan Mempertahankan Kemerdekaan',
        pageStart: 1,
        content: `Detik-detik Menjelang 17 Agustus 1945:
Peristiwa Rengasdengklok membuktikan tekad generasi muda untuk segera memproklamasikan kemerdekaan Indonesia tanpa campur tangan penjajah. Naskah proklamasi dirumuskan di rumah Laksamana Maeda dan diketik oleh Sayuti Melik.

Jalur Perjuangan Fisik dan Diplomasi:
Selain pertempuran heroik Surabaya 10 November 1945 dan Palagan Ambarawa, para pendiri bangsa giat berdiplomasi di forum internasional melalui Perundingan Linggarjati, Renville, Roem-Royen, hingga Konferensi Meja Bundar (KMB) 1949 di Den Haag.`
      }
    ]
  },
  {
    id: 'b-004',
    title: 'Matematika Tingkat Lanjut SMA: Kalkulus & Aljabar Linear',
    author: 'Prof. Hendra Gunawan, Ph.D.',
    publisher: 'Erlangga Mandiri',
    year: 2024,
    isbn: '978-602-241-890-3',
    category: 'Buku Pelajaran (Kurikulum Merdeka)',
    callNumber: '510.7 GUN m',
    physicalStock: 30,
    availableStock: 26,
    coverUrl: '',
    isEbookAvailable: true,
    ebookFileName: 'matematika_tingkat_lanjut_fase_f.pdf',
    ebookSizeMb: 11.8,
    description: 'Materi pengayaan persiapan olimpiade dan SNBT jenjang SMA. Meliputi trigonometri analitik, limit fungsi aljabar & trigonometri, turunan parsial, integral substitusi, dan matriks transformasi geometri.',
    pages: 360,
    language: 'Indonesia',
    sampleContent: [
      {
        title: 'Bab 1: Konsep Limit Fungsi dan Kontinuitas',
        pageStart: 1,
        content: `Definisi Limit Intuitif:
Dikatakan bahwa lim (x->c) f(x) = L jika f(x) mendekati nilai L ketika x mendekati c baik dari arah kiri maupun kanan.

Aturan L'Hopital untuk Bentuk Tak Tentu:
Jika limit f(x)/g(x) menghasilkan 0/0 atau ∞/∞, maka:
lim (x->c) [f(x)/g(x)] = lim (x->c) [f'(x)/g'(x)]
asalkan turunan g'(x) ≠ 0 di sekitar c.`
      }
    ]
  },
  {
    id: 'b-005',
    title: 'Bumi Manusia: Tetralogi Buru',
    author: 'Pramoedya Ananta Toer',
    publisher: 'Lentera Dipantara',
    year: 2021,
    isbn: '978-979-973-123-5',
    category: 'Fiksi & Sastra',
    callNumber: '899.2 TOE b',
    physicalStock: 12,
    availableStock: 9,
    coverUrl: '',
    isEbookAvailable: false,
    description: 'Karya sastra klasik Indonesia berlatar era kolonial Hindia Belanda. Mengisahkan perjuangan Minke, seorang priyayi muda terpelajar, dan Nyai Ontosoroh dalam melawan ketidakadilan hukum kolonial.',
    pages: 535,
    language: 'Indonesia',
    sampleContent: []
  },
  {
    id: 'b-006',
    title: 'Informatika & Pemrograman Python untuk SMA',
    author: 'Rian Hidayat, S.Kom., M.T.',
    publisher: 'Informatika Press',
    year: 2024,
    isbn: '978-623-711-209-1',
    category: 'Sains & Teknologi',
    callNumber: '005.13 HID i',
    physicalStock: 15,
    availableStock: 12,
    coverUrl: '',
    isEbookAvailable: true,
    ebookFileName: 'informatika_sma_python_algo.pdf',
    ebookSizeMb: 9.4,
    description: 'Panduan belajar berpikir komputasional, struktur data array & dictionary, algoritma sorting/searching, pengolahan data dengan Pandas, dan pembuatan aplikasi web dasar.',
    pages: 250,
    language: 'Indonesia',
    sampleContent: [
      {
        title: 'Bab 1: Algoritma & Berpikir Komputasional',
        pageStart: 1,
        content: `Empat pilar berpikir komputasional:
1. Dekomposisi: Memecah masalah kompleks menjadi bagian-bagian lebih kecil.
2. Pengenalan Pola: Menemukan kesamaan pola data.
3. Abstraksi: Memfokuskan pada informasi penting dan mengabaikan detail yang tidak relevan.
4. Desain Algoritma: Menyusun langkah instruksi logis untuk menyelesaikan masalah.`
      }
    ]
  },
  {
    id: 'b-007',
    title: 'Ensiklopedia Tokoh dan Pahlawan Bangsa Indonesia',
    author: 'Tim Redaksi Sejarah Nasional',
    publisher: 'Balai Pustaka',
    year: 2022,
    isbn: '978-979-407-889-1',
    category: 'Ensiklopedia & Referensi',
    callNumber: '920.059 TIM e',
    physicalStock: 8,
    availableStock: 7,
    coverUrl: '',
    isEbookAvailable: true,
    ebookFileName: 'ensiklopedia_pahlawan_nasional.pdf',
    ebookSizeMb: 35.0,
    description: 'Kumpulan biografi lengkap tokoh perintis kemerdekaan, pejuang hak wanita, cendekiawan, dan pembela tanah air dari Sabang sampai Merauke disertai arsip foto autentik.',
    pages: 420,
    language: 'Indonesia',
    sampleContent: [
      {
        title: 'Ki Hadjar Dewantara: Pelopor Pendidikan Nasional',
        pageStart: 12,
        content: `Semboyan legendaris Taman Siswa yang abadi hingga kini:
"Ing ngarsa sung tulada, ing madya mangun karsa, tut wuri handayani."
Artinya: Di depan memberi teladan, di tengah membangun kehendak/semangat, dan di belakang memberikan dorongan moral bagi generasi penerus.`
      }
    ]
  },
  {
    id: 'b-008',
    title: 'Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa',
    author: 'James Clear',
    publisher: 'Gramedia Pustaka Utama',
    year: 2023,
    isbn: '978-602-063-317-6',
    category: 'Pengembangan Diri',
    callNumber: '158.1 CLE a',
    physicalStock: 10,
    availableStock: 7,
    coverUrl: '',
    isEbookAvailable: false,
    description: 'Buku motivasi dan pengembangan diri terpopuler bagi siswa SMA untuk membangun kebiasaan belajar efektif, konsisten 1% setiap hari, dan membuang kebiasaan menunda tugas.',
    pages: 352,
    language: 'Indonesia',
    sampleContent: []
  }
];

export const initialMembers: Member[] = [
  {
    id: 'm-001',
    nis: '23241001',
    nisn: '0067891234',
    name: 'Muhammad Farhan Pratama',
    role: 'siswa',
    grade: 'XI',
    classGroup: 'XI MIPA 1',
    email: 'farhan.pratama@siswa.sman1teladan.sch.id',
    phone: '0812-3456-7890',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-07-15',
    status: 'aktif'
  },
  {
    id: 'm-002',
    nis: '23241002',
    nisn: '0071234567',
    name: 'Aisyah Putri Azzahra',
    role: 'siswa',
    grade: 'XI',
    classGroup: 'XI MIPA 2',
    email: 'aisyah.azzahra@siswa.sman1teladan.sch.id',
    phone: '0813-8899-1122',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-07-15',
    status: 'aktif'
  },
  {
    id: 'm-003',
    nis: '24251015',
    nisn: '0082345678',
    name: 'Rafi Aditya Nugraha',
    role: 'siswa',
    grade: 'X',
    classGroup: 'X Fase E-3',
    email: 'rafi.nugraha@siswa.sman1teladan.sch.id',
    phone: '0857-1234-9900',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-07-18',
    status: 'aktif'
  },
  {
    id: 'm-004',
    nis: '22231088',
    nisn: '0059876543',
    name: 'Nabila Syakira Dewi',
    role: 'siswa',
    grade: 'XII',
    classGroup: 'XII IPS 1',
    email: 'nabila.dewi@siswa.sman1teladan.sch.id',
    phone: '0819-0123-4567',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    joinDate: '2022-07-14',
    status: 'aktif'
  },
  {
    id: 'm-005',
    nis: '198504122010011005',
    nisn: '4567763665200002',
    nip: '19850412 201001 1 005',
    nuptk: '4567763665200002',
    name: 'Drs. Agus Budiman, M.Pd.',
    role: 'guru',
    grade: 'Guru',
    classGroup: 'Guru Fisika & Pembina KIR',
    position: 'Guru Madya Fisika SMA',
    employmentStatus: 'PNS',
    email: 'agus.budiman@guru.sman1teladan.sch.id',
    phone: '0811-2233-4455',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinDate: '2020-01-10',
    status: 'aktif'
  },
  {
    id: 'm-006',
    nis: '197405181999032003',
    nisn: '7823901234900001',
    nip: '19740518 199903 2 003',
    nuptk: '7823901234900001',
    name: 'Dra. Endang Sulistyowati, M.Pd.',
    role: 'pegawai',
    grade: 'Pegawai',
    classGroup: 'Unit Pelaksana Teknis Perpustakaan',
    position: 'Kepala Perpustakaan / Pustakawan Ahli',
    employmentStatus: 'PNS',
    email: 'endang.sulistyowati@staff.sman1teladan.sch.id',
    phone: '0812-9876-5432',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinDate: '2018-03-01',
    status: 'aktif'
  },
  {
    id: 'm-007',
    nis: '199308212023212009',
    nisn: '9012345678900003',
    nip: '19930821 202321 2 009',
    nuptk: '9012345678900003',
    name: 'Siti Rahmawati, S.Kom.',
    role: 'pegawai',
    grade: 'Pegawai',
    classGroup: 'Layanan Digital & Sirkulasi',
    position: 'Pustakawan Pelaksana & Teknisi Sistem',
    employmentStatus: 'PPPK',
    email: 'siti.rahmawati@staff.sman1teladan.sch.id',
    phone: '0856-7890-1234',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-08-15',
    status: 'aktif'
  },
  {
    id: 'm-008',
    nis: 'PEG-202401',
    nisn: '-',
    nip: '-',
    nuptk: '-',
    name: 'Hendra Wijaya, A.Md.',
    role: 'pegawai',
    grade: 'Pegawai',
    classGroup: 'Pengolahan Bahan Pustaka & Preservasi',
    position: 'Staf Administrasi Perpustakaan',
    employmentStatus: 'Tenaga Kependidikan',
    email: 'hendra.wijaya@staff.sman1teladan.sch.id',
    phone: '0813-2211-9988',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-02-01',
    status: 'aktif'
  }
];

export const initialLoans: Loan[] = [
  {
    id: 'L-2024-001',
    memberId: 'm-001',
    memberName: 'Muhammad Farhan Pratama',
    memberNis: '23241001',
    memberClass: 'XI MIPA 1',
    bookId: 'b-001',
    bookTitle: 'Fisika SMA Terapan: Kinematika & Termodinamika',
    bookCategory: 'Buku Pelajaran (Kurikulum Merdeka)',
    borrowDate: '2024-10-20',
    dueDate: '2024-10-27',
    returnDate: '2024-10-26',
    status: 'kembali',
    fineAmount: 0,
    approvedBy: 'Dra. Endang Sulistyowati'
  },
  {
    id: 'L-2024-002',
    memberId: 'm-002',
    memberName: 'Aisyah Putri Azzahra',
    memberNis: '23241002',
    memberClass: 'XI MIPA 2',
    bookId: 'b-002',
    bookTitle: 'Biologi Sel & Ekosistem SMA: Genetik Modern',
    bookCategory: 'Sains & Teknologi',
    borrowDate: '2024-10-28',
    dueDate: '2024-11-04',
    status: 'dipinjam',
    fineAmount: 0,
    approvedBy: 'Dra. Endang Sulistyowati'
  },
  {
    id: 'L-2024-003',
    memberId: 'm-004',
    memberName: 'Nabila Syakira Dewi',
    memberNis: '22231088',
    memberClass: 'XII IPS 1',
    bookId: 'b-003',
    bookTitle: 'Sejarah Indonesia Kontemporer SMA: 1945 - Era Digital',
    bookCategory: 'Sejarah & Sosial',
    borrowDate: '2024-10-15',
    dueDate: '2024-10-22',
    status: 'terlambat',
    fineAmount: 10000, // 10 days late * 1000
    notes: 'Terlambat 10 hari, sudah dikirimkan notifikasi peringatan.',
    approvedBy: 'Dra. Endang Sulistyowati'
  },
  {
    id: 'L-2024-004',
    memberId: 'm-003',
    memberName: 'Rafi Aditya Nugraha',
    memberNis: '24251015',
    memberClass: 'X Fase E-3',
    bookId: 'b-006',
    bookTitle: 'Informatika & Pemrograman Python untuk SMA',
    bookCategory: 'Sains & Teknologi',
    borrowDate: '2024-11-01',
    dueDate: '2024-11-08',
    status: 'menunggu_persetujuan',
    fineAmount: 0,
    notes: 'Diajukan siswa secara online untuk persiapan lomba olimpiade komputer.'
  }
];

export const initialGuestBookEntries: GuestBookEntry[] = [
  {
    id: 'g-001',
    date: '2024-11-01',
    time: '07:45',
    name: 'Muhammad Farhan Pratama',
    role: 'Siswa',
    identifier: '23241001',
    classOrUnit: 'XI MIPA 1',
    purpose: 'Mengerjakan tugas / Diskusi',
    notes: 'Diskusi kelompok fisika praktikum'
  },
  {
    id: 'g-002',
    date: '2024-11-01',
    time: '08:30',
    name: 'Drs. Agus Budiman, M.Pd.',
    role: 'Guru',
    identifier: '198504122010011005',
    classOrUnit: 'Guru Fisika',
    purpose: 'Menggunakan Komputer / E-Library',
    notes: 'Mencari referensi soal asesmen sumatif'
  },
  {
    id: 'g-003',
    date: '2024-11-01',
    time: '09:15',
    name: 'Aisyah Putri Azzahra',
    role: 'Siswa',
    identifier: '23241002',
    classOrUnit: 'XI MIPA 2',
    purpose: 'Meminjam buku',
    notes: 'Peminjaman buku Biologi Sel'
  },
  {
    id: 'g-004',
    date: '2024-11-01',
    time: '10:05',
    name: 'Rafi Aditya Nugraha',
    role: 'Siswa',
    identifier: '24251015',
    classOrUnit: 'X Fase E-3',
    purpose: 'Membaca di tempat',
    notes: 'Membaca modul coding Python'
  }
];

export const initialFeedbacks: Feedback[] = [
  {
    id: 'fb-001',
    date: '2024-10-25',
    time: '11:20',
    senderName: 'Muhammad Farhan Pratama',
    senderNis: '23241001',
    role: 'Siswa',
    category: 'Saran Buku Baru',
    message: 'Mohon ditambahkan koleksi buku olimpiade Fisika IPhO edisi terbaru dan pembahasan soal UTBK SNBT 2025.',
    status: 'ditindaklanjuti',
    adminResponse: 'Terima kasih Farhan. Usulan buku SNBT dan IPhO telah dimasukkan ke dalam Rencana Pengadaan Bahan Pustaka Semester Genap.',
    responseDate: '2024-10-26'
  },
  {
    id: 'fb-002',
    date: '2024-10-29',
    time: '13:40',
    senderName: 'Aisyah Putri Azzahra',
    senderNis: '23241002',
    role: 'Siswa',
    category: 'Fasilitas & Ruangan',
    message: 'Stop kontak di area meja baca lesehan sebelah barat mohon diperbaiki karena sering longgar saat mengisi daya laptop.',
    status: 'selesai',
    adminResponse: 'Stop kontak sudah diganti baru oleh bagian teknisi sarpras sekolah kemarin siang. Silakan digunakan kembali.',
    responseDate: '2024-10-30'
  }
];

export const initialFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Keanggotaan',
    question: 'Bagaimana cara menjadi anggota perpustakaan SMA?',
    answer: 'Seluruh siswa, guru, dan staf SMA Negeri 1 Teladan secara otomatis terdaftar sebagai anggota perpustakaan pada awal tahun ajaran baru menggunakan Nomor Induk Siswa (NIS) atau NIP. Anda dapat langsung mengunduh dan mencetak Kartu Tanda Anggota (KTA) Digital ber-QR Code di menu Kartu Anggota.'
  },
  {
    id: 'faq-2',
    category: 'Peminjaman & Denda',
    question: 'Berapa batas maksimal buku fisik yang dapat dipinjam dan durasinya?',
    answer: 'Siswa dapat meminjam maksimal 3 (tiga) eksemplar buku sekaligus dengan batas waktu peminjaman 7 (tujuh) hari kalender. Peminjaman dapat diperpanjang 1 kali selama 7 hari berikutnya jika buku tidak sedang diantre oleh siswa lain.'
  },
  {
    id: 'faq-3',
    category: 'Peminjaman & Denda',
    question: 'Berapa tarif denda jika terlambat mengembalikan buku?',
    answer: 'Keterlambatan pengembalian buku fisik dikenakan denda administrasi sebesar Rp 1.000,- (seribu rupiah) per hari per buku. Biaya denda disetorkan ke kas pemeliharaan bahan pustaka sekolah.'
  },
  {
    id: 'faq-4',
    category: 'Layanan Digital',
    question: 'Apakah membaca e-book di perpustakaan digital ini memerlukan kuota khusus?',
    answer: 'Tidak. Pembaca digital (E-Book Reader) terintegrasi langsung di aplikasi ini dan dapat diakses gratis oleh seluruh civitas akademika melalui jaringan Wi-Fi sekolah maupun internet pribadi.'
  },
  {
    id: 'faq-5',
    category: 'Tata Tertib',
    question: 'Bagaimana jika buku perpustakaan yang dipinjam hilang atau rusak?',
    answer: 'Peminjam wajib melaporkan ke bagian sirkulasi pustakawan dan mengganti buku dengan judul & edisi yang sama atau buku relevan yang disetujui oleh Kepala Perpustakaan sesuai peraturan sekolah.'
  }
];
