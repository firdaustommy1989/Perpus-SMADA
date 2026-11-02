import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Book, Member, Loan, GuestBookEntry, Feedback, FaqItem, SchoolProfile, 
  UserRole, NotificationItem 
} from '../types';
import { 
  initialBooks, initialMembers, initialLoans, initialGuestBookEntries, 
  initialFeedbacks, initialFaqs, initialSchoolProfile 
} from '../data/mockData';
import { playNotificationChime } from '../utils/audio';
import { db, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import { 
  collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, writeBatch, getDoc 
} from 'firebase/firestore';

interface ToastNotification extends NotificationItem {
  duration?: number;
}

export type CloudSyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface LibraryContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeMember: Member;
  setActiveMember: (member: Member) => void;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, selectedRole?: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  // Cloud Sync
  cloudSyncStatus: CloudSyncStatus;
  isCloudReady: boolean;

  // Data States
  books: Book[];
  members: Member[];
  loans: Loan[];
  guestBook: GuestBookEntry[];
  feedbacks: Feedback[];
  faqs: FaqItem[];
  profile: SchoolProfile;
  notifications: NotificationItem[];
  activeToasts: ToastNotification[];

  // Actions
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  requestLoan: (bookId: string, notes?: string) => { success: boolean; message: string };
  approveLoan: (loanId: string) => void;
  rejectLoan: (loanId: string, reason?: string) => void;
  returnBook: (loanId: string) => void;
  renewLoan: (loanId: string) => { success: boolean; message: string };
  
  addGuestBookEntry: (entry: Omit<GuestBookEntry, 'id' | 'date' | 'time'>) => void;
  submitFeedback: (category: Feedback['category'], message: string) => void;
  respondFeedback: (id: string, response: string) => void;
  updateProfile: (profile: Partial<SchoolProfile>) => void;
  
  // Notifications
  pushNotification: (title: string, message: string, type?: NotificationItem['type'], linkToTab?: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  dismissToast: (id: string) => void;
  requestPushPermission: () => Promise<boolean>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

// Helper to sanitize objects for Firestore (removes undefined fields which Firestore rejects)
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      clean[key] = val;
    }
  }
  return clean;
}

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('siperpu_auth') === 'true';
  });
  const [role, setRoleState] = useState<UserRole>('admin');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Cloud sync state
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('syncing');
  const [isCloudReady, setIsCloudReady] = useState(false);

  // Data states initialized from defaults
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [activeMember, setActiveMember] = useState<Member>(initialMembers[0]);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [guestBook, setGuestBook] = useState<GuestBookEntry[]>(initialGuestBookEntries);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [faqs] = useState<FaqItem[]>(initialFaqs);
  const [profile, setProfile] = useState<SchoolProfile>(initialSchoolProfile);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      title: 'Cloud Realtime Aktif',
      message: 'SIPERPU SMA terhubung ke Google Cloud Firestore. Data tersinkronisasi otomatis di semua perangkat.',
      type: 'success',
      read: false,
      linkToTab: 'dashboard'
    }
  ]);

  const [activeToasts, setActiveToasts] = useState<ToastNotification[]>([]);

  // Track initial hydration to avoid double-toasting on first snapshot
  const isInitialLoad = useRef(true);

  // Push Notification Dispatcher (Web Push API + In-App Toast + Audio synthesis)
  const pushNotification = (
    title: string, 
    message: string, 
    type: NotificationItem['type'] = 'info',
    linkToTab?: string
  ) => {
    const id = 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const newNotif: NotificationItem = {
      id,
      timestamp: timeStr,
      title,
      message,
      type,
      read: false,
      linkToTab
    };

    setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);

    // Trigger in-app toast
    const toastItem: ToastNotification = { ...newNotif, duration: 5000 };
    setActiveToasts(prev => [toastItem, ...prev.slice(0, 3)]);

    // Play sound if enabled
    if (profile.soundEnabled) {
      playNotificationChime(type === 'alert' ? 'alert' : type === 'success' ? 'success' : 'info');
    }

    // Trigger Browser Push Notification if granted
    if (profile.pushNotificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch {
        // Fallback for sandboxed iframes
      }
    }
  };

  const dismissToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const requestPushPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      updateProfile({ pushNotificationsEnabled: granted });
      if (granted) {
        pushNotification('Notifikasi Push Aktif', 'Perpustakaan akan mengirimkan update status sirkulasi dan peminjaman secara real-time!', 'success');
      }
      return granted;
    } catch {
      return false;
    }
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'guest_kiosk') {
      setCurrentTab('guestbook');
    } else if (newRole === 'siswa') {
      if (currentTab === 'members' || currentTab === 'reports' || currentTab === 'settings') {
        setCurrentTab('catalog');
      }
    }
  };

  // -------------------------------------------------------------
  // FIRESTORE REALTIME SYNC (All devices, all browsers)
  // -------------------------------------------------------------
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const initializeFirestoreSync = async () => {
      try {
        await testConnection();
        setCloudSyncStatus('syncing');

        // 1. Books collection sync
        const unsubBooks = onSnapshot(collection(db, 'books'), async (snapshot) => {
          if (snapshot.empty) {
            // Seed books to cloud
            const batch = writeBatch(db);
            initialBooks.forEach(b => {
              const ref = doc(db, 'books', b.id);
              batch.set(ref, sanitizeForFirestore(b));
            });
            await batch.commit();
          } else {
            const cloudBooks = snapshot.docs.map(docSnap => docSnap.data() as Book);
            setBooks(cloudBooks);
          }
          setCloudSyncStatus('synced');
          setIsCloudReady(true);
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'books');
          setCloudSyncStatus('error');
        });
        unsubs.push(unsubBooks);

        // 2. Members collection sync
        const unsubMembers = onSnapshot(collection(db, 'members'), async (snapshot) => {
          if (snapshot.empty) {
            const batch = writeBatch(db);
            initialMembers.forEach(m => {
              const ref = doc(db, 'members', m.id);
              batch.set(ref, sanitizeForFirestore(m));
            });
            await batch.commit();
          } else {
            const cloudMembers = snapshot.docs.map(docSnap => docSnap.data() as Member);
            setMembers(cloudMembers);
            // Update activeMember if matching ID
            setActiveMember(prev => cloudMembers.find(m => m.id === prev.id) || cloudMembers[0] || prev);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'members');
        });
        unsubs.push(unsubMembers);

        // 3. Loans collection sync
        const unsubLoans = onSnapshot(collection(db, 'loans'), async (snapshot) => {
          if (snapshot.empty) {
            const batch = writeBatch(db);
            initialLoans.forEach(l => {
              const ref = doc(db, 'loans', l.id);
              batch.set(ref, sanitizeForFirestore(l));
            });
            await batch.commit();
          } else {
            const cloudLoans = snapshot.docs.map(docSnap => docSnap.data() as Loan);
            setLoans(cloudLoans);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'loans');
        });
        unsubs.push(unsubLoans);

        // 4. Guestbook collection sync
        const unsubGuestbook = onSnapshot(collection(db, 'guestbook'), async (snapshot) => {
          if (snapshot.empty) {
            const batch = writeBatch(db);
            initialGuestBookEntries.forEach(g => {
              const ref = doc(db, 'guestbook', g.id);
              batch.set(ref, sanitizeForFirestore(g));
            });
            await batch.commit();
          } else {
            const cloudEntries = snapshot.docs.map(docSnap => docSnap.data() as GuestBookEntry);
            setGuestBook(cloudEntries);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'guestbook');
        });
        unsubs.push(unsubGuestbook);

        // 5. Feedbacks collection sync
        const unsubFeedbacks = onSnapshot(collection(db, 'feedbacks'), async (snapshot) => {
          if (snapshot.empty) {
            const batch = writeBatch(db);
            initialFeedbacks.forEach(f => {
              const ref = doc(db, 'feedbacks', f.id);
              batch.set(ref, sanitizeForFirestore(f));
            });
            await batch.commit();
          } else {
            const cloudFeedbacks = snapshot.docs.map(docSnap => docSnap.data() as Feedback);
            setFeedbacks(cloudFeedbacks);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'feedbacks');
        });
        unsubs.push(unsubFeedbacks);

        // 6. Settings profile sync
        const profileRef = doc(db, 'settings', 'profile');
        const unsubProfile = onSnapshot(profileRef, async (docSnap) => {
          if (!docSnap.exists()) {
            await setDoc(profileRef, sanitizeForFirestore(initialSchoolProfile));
          } else {
            setProfile(docSnap.data() as SchoolProfile);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, 'settings/profile');
        });
        unsubs.push(unsubProfile);

        // Turn off initial flag after 1.5s
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 1500);

      } catch (err) {
        console.warn("Firestore connection check failed, using cache:", err);
        setCloudSyncStatus('offline');
      }
    };

    initializeFirestoreSync();

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  // Check Overdue Fines recalculation
  useEffect(() => {
    if (!isCloudReady) return;

    const today = new Date().toISOString().split('T')[0];
    let updatedCount = 0;

    loans.forEach(loan => {
      if ((loan.status === 'dipinjam' || loan.status === 'terlambat') && loan.dueDate < today) {
        const due = new Date(loan.dueDate).getTime();
        const cur = new Date(today).getTime();
        const diffDays = Math.max(1, Math.floor((cur - due) / (1000 * 60 * 60 * 24)));
        const fine = diffDays * (profile.finePerDay || 1000);
        
        if (loan.status !== 'terlambat' || loan.fineAmount !== fine) {
          updatedCount++;
          // Upsert in Firestore safely with merge: true
          const loanRef = doc(db, 'loans', loan.id);
          setDoc(loanRef, {
            status: 'terlambat',
            fineAmount: fine,
            notes: `Terlambat ${diffDays} hari. Denda berjalan ${fine}.`
          }, { merge: true }).catch(err => {
            console.warn(`Overdue sync deferred for loan ${loan.id}:`, err);
          });
        }
      }
    });

    if (updatedCount > 0 && !isInitialLoad.current) {
      const timer = setTimeout(() => {
        pushNotification(
          'Peringatan Keterlambatan Buku',
          `Terdapat ${updatedCount} peminjaman buku yang melewati batas tanggal kembali. Denda otomatis disinkronkan ke cloud.`,
          'alert',
          'circulation'
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [profile.finePerDay, loans.length, isCloudReady]);

  // -------------------------------------------------------------
  // CLOUD CRUD: BOOKS
  // -------------------------------------------------------------
  const addBook = async (bookData: Omit<Book, 'id'>) => {
    const id = 'b-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    const newBook: Book = {
      ...bookData,
      id,
    };

    // Optimistic update
    setBooks(prev => [newBook, ...prev]);

    try {
      const bookRef = doc(db, 'books', id);
      await setDoc(bookRef, sanitizeForFirestore(newBook));
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `books/${id}`);
    }

    pushNotification(
      'Buku Baru Ditambahkan',
      `Judul "${newBook.title}" berhasil disimpan di Cloud dan dapat diakses semua perangkat.`,
      'success',
      'catalog'
    );
  };

  const updateBook = async (id: string, bookData: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...bookData } : b));

    try {
      const bookRef = doc(db, 'books', id);
      await setDoc(bookRef, sanitizeForFirestore(bookData), { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `books/${id}`);
    }

    pushNotification('Katalog Diperbarui', `Informasi buku telah diperbarui di Cloud.`, 'info', 'catalog');
  };

  const deleteBook = async (id: string) => {
    const target = books.find(b => b.id === id);
    setBooks(prev => prev.filter(b => b.id !== id));

    try {
      const bookRef = doc(db, 'books', id);
      await deleteDoc(bookRef);
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `books/${id}`);
    }

    pushNotification('Buku Dihapus', `Buku "${target?.title || id}" telah dihapus dari cloud.`, 'warning', 'catalog');
  };

  // -------------------------------------------------------------
  // CLOUD CRUD: MEMBERS (Students & Staff)
  // -------------------------------------------------------------
  const addMember = async (memberData: Omit<Member, 'id'>) => {
    const id = 'm-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    const newMember: Member = {
      ...memberData,
      id,
    };

    setMembers(prev => [newMember, ...prev]);

    try {
      const memberRef = doc(db, 'members', id);
      await setDoc(memberRef, sanitizeForFirestore(newMember));
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `members/${id}`);
    }

    pushNotification(
      'Anggota Baru Terdaftar',
      `Anggota ${newMember.name} (${newMember.nis}) telah tersimpan di cloud & siap cetak KTA Digital.`,
      'success',
      'members'
    );
  };

  const updateMember = async (id: string, memberData: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...memberData } : m));
    if (activeMember.id === id) {
      setActiveMember(prev => ({ ...prev, ...memberData }));
    }

    try {
      const memberRef = doc(db, 'members', id);
      await setDoc(memberRef, sanitizeForFirestore(memberData), { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `members/${id}`);
    }

    pushNotification('Data Anggota Diperbarui', `Profil anggota berhasil disinkronkan ke cloud.`, 'info', 'members');
  };

  const deleteMember = async (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));

    try {
      const memberRef = doc(db, 'members', id);
      await deleteDoc(memberRef);
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `members/${id}`);
    }

    pushNotification('Anggota Dihapus', `Data anggota telah dihapus dari cloud.`, 'warning', 'members');
  };

  // -------------------------------------------------------------
  // CLOUD CIRCULATION / LOANS
  // -------------------------------------------------------------
  const requestLoan = (bookId: string, notes?: string): { success: boolean; message: string } => {
    const book = books.find(b => b.id === bookId);
    if (!book) return { success: false, message: 'Buku tidak ditemukan.' };
    if (book.availableStock <= 0) return { success: false, message: 'Stok buku fisik sedang habis.' };

    const activeUserLoans = loans.filter(
      l => l.memberId === activeMember.id && (l.status === 'dipinjam' || l.status === 'terlambat' || l.status === 'menunggu_persetujuan')
    );

    if (activeUserLoans.length >= profile.maxBooksPerMember) {
      return { 
        success: false, 
        message: `Maksimal peminjaman adalah ${profile.maxBooksPerMember} buku. Anda telah mencapai batas.` 
      };
    }

    const today = new Date();
    const borrowDateStr = today.toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (profile.maxBorrowDays || 7));
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const loanId = 'L-' + new Date().getFullYear() + '-' + Date.now().toString(36);
    const newLoan: Loan = {
      id: loanId,
      memberId: activeMember.id,
      memberName: activeMember.name,
      memberNis: activeMember.nis,
      memberClass: activeMember.classGroup,
      bookId: book.id,
      bookTitle: book.title,
      bookCategory: book.category,
      borrowDate: borrowDateStr,
      dueDate: dueDateStr,
      status: 'menunggu_persetujuan',
      fineAmount: 0,
      notes: notes || 'Pengajuan mandiri via aplikasi web siswa'
    };

    // Optimistic updates
    setLoans(prev => [newLoan, ...prev]);
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableStock: Math.max(0, b.availableStock - 1) } : b));

    // Cloud writes
    (async () => {
      try {
        const batch = writeBatch(db);
        batch.set(doc(db, 'loans', loanId), sanitizeForFirestore(newLoan));
        batch.update(doc(db, 'books', bookId), { availableStock: Math.max(0, book.availableStock - 1) });
        await batch.commit();
        setCloudSyncStatus('synced');
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `loans/${loanId}`);
      }
    })();

    pushNotification(
      'Pengajuan Peminjaman Baru',
      `${activeMember.name} (${activeMember.classGroup}) mengajukan peminjaman buku: "${book.title}". Menunggu persetujuan pustakawan.`,
      'info',
      'circulation'
    );

    return { success: true, message: 'Pengajuan peminjaman berhasil diajukan!' };
  };

  const approveLoan = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const approver = profile.headOfLibrary || 'Pustakawan';
    setLoans(prev => prev.map(l => l.id === loanId ? { 
      ...l, 
      status: 'dipinjam', 
      approvedBy: approver 
    } : l));

    (async () => {
      try {
        const loanRef = doc(db, 'loans', loanId);
        await setDoc(loanRef, { status: 'dipinjam', approvedBy: approver }, { merge: true });
        setCloudSyncStatus('synced');
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `loans/${loanId}`);
      }
    })();

    pushNotification(
      'Peminjaman Disetujui',
      `Peminjaman buku "${loan.bookTitle}" untuk ${loan.memberName} telah disetujui. Batas kembali: ${loan.dueDate}.`,
      'success',
      'circulation'
    );
  };

  const rejectLoan = (loanId: string, reason?: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    // Restore stock
    setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, availableStock: b.availableStock + 1 } : b));
    setLoans(prev => prev.filter(l => l.id !== loanId));

    (async () => {
      try {
        const batch = writeBatch(db);
        batch.delete(doc(db, 'loans', loanId));
        const bookSnap = await getDoc(doc(db, 'books', loan.bookId));
        if (bookSnap.exists()) {
          const currentStock = (bookSnap.data() as Book).availableStock || 0;
          batch.update(doc(db, 'books', loan.bookId), { availableStock: currentStock + 1 });
        }
        await batch.commit();
        setCloudSyncStatus('synced');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `loans/${loanId}`);
      }
    })();

    pushNotification(
      'Peminjaman Ditolak',
      `Pengajuan buku "${loan.bookTitle}" untuk ${loan.memberName} telah ditolak. ${reason ? `Alasan: ${reason}` : ''}`,
      'warning',
      'circulation'
    );
  };

  const returnBook = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const returnDateStr = new Date().toISOString().split('T')[0];

    setLoans(prev => prev.map(l => l.id === loanId ? {
      ...l,
      status: 'kembali',
      returnDate: returnDateStr
    } : l));

    setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, availableStock: b.availableStock + 1 } : b));

    (async () => {
      try {
        const batch = writeBatch(db);
        batch.set(doc(db, 'loans', loanId), { status: 'kembali', returnDate: returnDateStr }, { merge: true });
        const bookSnap = await getDoc(doc(db, 'books', loan.bookId));
        if (bookSnap.exists()) {
          const currentStock = (bookSnap.data() as Book).availableStock || 0;
          batch.set(doc(db, 'books', loan.bookId), { availableStock: currentStock + 1 }, { merge: true });
        }
        await batch.commit();
        setCloudSyncStatus('synced');
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `loans/${loanId}`);
      }
    })();

    const fineMsg = loan.fineAmount > 0 
      ? ` Denda administrasi keterlambatan: Rp ${loan.fineAmount.toLocaleString('id-ID')}.` 
      : ' Tepat waktu tanpa denda.';

    pushNotification(
      'Pengembalian Buku Berhasil',
      `Buku "${loan.bookTitle}" milik ${loan.memberName} telah berhasil dikembalikan.${fineMsg}`,
      'success',
      'circulation'
    );
  };

  const renewLoan = (loanId: string): { success: boolean; message: string } => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return { success: false, message: 'Data tidak ditemukan.' };
    if (loan.status === 'terlambat') return { success: false, message: 'Buku yang telah terlambat tidak dapat diperpanjang secara otomatis.' };

    const currentDue = new Date(loan.dueDate);
    currentDue.setDate(currentDue.getDate() + (profile.maxBorrowDays || 7));
    const newDueDateStr = currentDue.toISOString().split('T')[0];

    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, dueDate: newDueDateStr } : l));

    (async () => {
      try {
        await setDoc(doc(db, 'loans', loanId), { dueDate: newDueDateStr }, { merge: true });
        setCloudSyncStatus('synced');
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `loans/${loanId}`);
      }
    })();

    pushNotification(
      'Perpanjangan Peminjaman',
      `Peminjaman buku "${loan.bookTitle}" diperpanjang hingga ${newDueDateStr}.`,
      'info',
      'circulation'
    );

    return { success: true, message: `Berhasil diperpanjang sampai ${newDueDateStr}` };
  };

  // -------------------------------------------------------------
  // CLOUD GUESTBOOK
  // -------------------------------------------------------------
  const addGuestBookEntry = async (entry: Omit<GuestBookEntry, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const id = 'gb-' + Date.now();

    const newEntry: GuestBookEntry = {
      ...entry,
      id,
      date: dateStr,
      time: timeStr
    };

    setGuestBook(prev => [newEntry, ...prev]);

    try {
      await setDoc(doc(db, 'guestbook', id), sanitizeForFirestore(newEntry));
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `guestbook/${id}`);
    }

    pushNotification(
      'Kunjungan Baru Dicatat',
      `${entry.name} (${entry.classOrUnit}) berkunjung untuk: ${entry.purpose}. Tersimpan di Cloud.`,
      'info',
      'guestbook'
    );
  };

  // -------------------------------------------------------------
  // CLOUD FEEDBACKS
  // -------------------------------------------------------------
  const submitFeedback = async (category: Feedback['category'], message: string) => {
    const now = new Date();
    const id = 'fb-' + Date.now();
    const newFeedback: Feedback = {
      id,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      senderName: activeMember.name,
      senderNis: activeMember.nis,
      role: activeMember.role === 'guru' ? 'Guru' : 'Siswa',
      category,
      message,
      status: 'baru'
    };

    setFeedbacks(prev => [newFeedback, ...prev]);

    try {
      await setDoc(doc(db, 'feedbacks', id), sanitizeForFirestore(newFeedback));
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `feedbacks/${id}`);
    }

    pushNotification(
      'Saran / Pengaduan Baru Masuk',
      `Pesan baru dari ${activeMember.name} kategori "${category}": "${message.slice(0, 50)}..."`,
      'info',
      'feedback'
    );
  };

  const respondFeedback = async (id: string, response: string) => {
    const now = new Date();
    const responseData = {
      status: 'ditindaklanjuti' as const,
      adminResponse: response,
      responseDate: now.toISOString().split('T')[0]
    };

    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...responseData } : f));

    try {
      await setDoc(doc(db, 'feedbacks', id), sanitizeForFirestore(responseData), { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `feedbacks/${id}`);
    }

    pushNotification(
      'Tanggapan Pengaduan Dikirim',
      `Tanggapan resmi telah dipublikasikan dan tersinkronisasi.`,
      'success',
      'feedback'
    );
  };

  // -------------------------------------------------------------
  // CLOUD SETTINGS / PROFILE
  // -------------------------------------------------------------
  const updateProfile = async (profileData: Partial<SchoolProfile>) => {
    setProfile(prev => ({ ...prev, ...profileData }));

    try {
      const profileRef = doc(db, 'settings', 'profile');
      await setDoc(profileRef, sanitizeForFirestore(profileData), { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/profile');
    }

    pushNotification('Pengaturan Disimpan', 'Profil dan konfigurasi perpustakaan berhasil disinkronkan ke Cloud.', 'success', 'settings');
  };

  // -------------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------------
  const login = async (identifier: string, password: string, selectedRole: UserRole = 'admin'): Promise<{ success: boolean; message: string }> => {
    // Artificial latency (500ms) for realistic SaaS loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    const cleanId = identifier.trim().toLowerCase();

    // 1. Admin login check
    if (selectedRole === 'admin' || cleanId === 'admin' || cleanId.includes('pustakawan') || cleanId === 'admin@sman1teladan.sch.id') {
      if (password !== 'admin123') {
        return {
          success: false,
          message: 'Kata sandi salah. Gunakan kata sandi "admin123" untuk akun Pustakawan Administrator.'
        };
      }
      setRoleState('admin');
      setIsAuthenticated(true);
      localStorage.setItem('siperpu_auth', 'true');
      pushNotification('Login Berhasil', 'Selamat datang kembali di panel Pustakawan SIPERPU SMA.', 'success', 'dashboard');
      return { success: true, message: 'Berhasil masuk sebagai Admin' };
    }

    // 2. Member (Siswa / Guru) login check
    const matchedMember = members.find(m => 
      m.nis.toLowerCase() === cleanId || 
      m.email.toLowerCase() === cleanId || 
      m.name.toLowerCase().includes(cleanId)
    );

    if (matchedMember) {
      const expectedPass = matchedMember.role === 'guru' ? 'guru123' : 'siswa123';
      if (password !== expectedPass) {
        return {
          success: false,
          message: `Kata sandi tidak sesuai untuk akun ${matchedMember.name}. Kata sandi bawaan adalah "${expectedPass}".`
        };
      }
      setActiveMember(matchedMember);
      setRoleState('siswa');
      setIsAuthenticated(true);
      localStorage.setItem('siperpu_auth', 'true');
      pushNotification('Login Berhasil', `Selamat datang ${matchedMember.name} (${matchedMember.classGroup})!`, 'success', 'catalog');
      return { success: true, message: 'Berhasil masuk' };
    }

    // 3. Kios Tamu bypass
    if (selectedRole === 'guest_kiosk') {
      setRoleState('guest_kiosk');
      setCurrentTab('guestbook');
      setIsAuthenticated(true);
      localStorage.setItem('siperpu_auth', 'true');
      return { success: true, message: 'Mode Kios Tamu aktif' };
    }

    return {
      success: false,
      message: 'Nomor Induk Siswa (NIS) atau Email tidak terdaftar dalam pangkalan data anggota perpustakaan.'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('siperpu_auth');
    pushNotification('Sesi Berakhir', 'Anda telah keluar dari sistem perpustakaan.', 'info');
  };

  return (
    <LibraryContext.Provider value={{
      role,
      setRole,
      activeMember,
      setActiveMember,
      language,
      setLanguage,
      currentTab,
      setCurrentTab,
      isAuthenticated,
      login,
      logout,
      cloudSyncStatus,
      isCloudReady,
      books,
      members,
      loans,
      guestBook,
      feedbacks,
      faqs,
      profile,
      notifications,
      activeToasts,
      addBook,
      updateBook,
      deleteBook,
      addMember,
      updateMember,
      deleteMember,
      requestLoan,
      approveLoan,
      rejectLoan,
      returnBook,
      renewLoan,
      addGuestBookEntry,
      submitFeedback,
      respondFeedback,
      updateProfile,
      pushNotification,
      markNotificationAsRead,
      clearAllNotifications,
      dismissToast,
      requestPushPermission,
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
