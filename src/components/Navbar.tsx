import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  Bell, BookOpen, Users, ArrowLeftRight, ClipboardList, 
  FileText, MessageSquare, HelpCircle, Settings, Shield, User,
  Volume2, VolumeX, Menu, X, Check, Globe, LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, setRole, activeMember, setActiveMember, members,
    currentTab, setCurrentTab, notifications, markNotificationAsRead, 
    clearAllNotifications, profile, updateProfile, language, setLanguage,
    requestPushPermission, logout, cloudSyncStatus
  } = useLibrary();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: language === 'id' ? 'Beranda' : 'Dashboard' },
    { id: 'catalog', label: language === 'id' ? 'Katalog & E-Book' : 'Catalog & E-Book' },
    { id: 'circulation', label: language === 'id' ? 'Sirkulasi' : 'Circulation' },
    ...(role === 'admin' ? [
      { id: 'members', label: language === 'id' ? 'Siswa & Pegawai' : 'Students & Staff' },
      { id: 'reports', label: language === 'id' ? 'Laporan' : 'Reports' },
    ] : [
      { id: 'my-card', label: language === 'id' ? 'KTA Digital' : 'Student Card' },
    ]),
    { id: 'guestbook', label: language === 'id' ? 'Buku Tamu' : 'Guest Book' },
    { id: 'feedback', label: language === 'id' ? 'Saran & FAQ' : 'Help & Feedback' },
    ...(role === 'admin' ? [{ id: 'settings', label: language === 'id' ? 'Pengaturan' : 'Settings' }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
        {/* Top bar contract: Zone 1 (Wordmark) - Zone 2 (Nav links) - Zone 3 (Action controls) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* ZONE 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setCurrentTab('dashboard')} 
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap block">
                  SIPERPU SMA
                </span>
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap block">
                  {profile.schoolName.slice(0, 24)}
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 text-xs font-semibold uppercase tracking-wider ${
                    isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Realtime Cloud Sync Indicator */}
            <div 
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 text-[11px] font-medium text-slate-700 shadow-2xs"
              title={
                cloudSyncStatus === 'synced' 
                  ? 'Data tersimpan di Google Cloud Firestore dan terupdate otomatis di semua perangkat.' 
                  : cloudSyncStatus === 'syncing' 
                  ? 'Menghubungkan ke Cloud Firestore...' 
                  : 'Mode offline'
              }
            >
              <span className="relative flex h-2 w-2">
                {cloudSyncStatus === 'synced' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  cloudSyncStatus === 'synced' 
                    ? 'bg-emerald-500' 
                    : cloudSyncStatus === 'syncing' 
                    ? 'bg-amber-500 animate-pulse' 
                    : 'bg-rose-500'
                }`} />
              </span>
              <span className="text-slate-600 hidden md:inline">Cloud:</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                cloudSyncStatus === 'synced' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {cloudSyncStatus === 'synced' ? 'Realtime' : cloudSyncStatus === 'syncing' ? 'Sync...' : 'Offline'}
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => updateProfile({ soundEnabled: !profile.soundEnabled })}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                profile.soundEnabled 
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-50' 
                  : 'border-slate-200 text-slate-400 bg-slate-50'
              }`}
              title={profile.soundEnabled ? 'Notifikasi Suara: Aktif' : 'Notifikasi Suara: Senyap'}
              aria-label="Toggle notification audio"
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors"
              title="Ganti Bahasa / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Push Notification Bell & Drawer */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (!profile.pushNotificationsEnabled) {
                    requestPushPermission();
                  }
                }}
                className="relative p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label="Pemberitahuan Transaksi"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Notifikasi Real-Time
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Log transaksi peminjaman & sistem
                      </p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        Belum ada notifikasi transaksi baru.
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            markNotificationAsRead(item.id);
                            if (item.linkToTab) {
                              setCurrentTab(item.linkToTab);
                              setShowNotifDropdown(false);
                            }
                          }}
                          className={`p-3 text-left cursor-pointer transition-colors hover:bg-slate-50 ${
                            !item.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-semibold text-slate-900 truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 px-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Web Push API Terintegrasi</span>
                    <button
                      onClick={requestPushPermission}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Aktifkan Push Browser
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Badge Button */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              title="Ganti Mode Pengguna"
            >
              {role === 'admin' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pustakawan</span>
                </>
              ) : role === 'guest_kiosk' ? (
                <>
                  <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kios Tamu</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="truncate max-w-[100px]">{activeMember.name.split(' ')[0]}</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
              title="Keluar dari Akun (Logout)"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentTab === item.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Pilih Hak Akses & Akun Demo
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Anda dapat menguji ketiga peran utama sistem perpustakaan SMA secara instan tanpa perlu logout:
            </p>

            <div className="mt-4 space-y-2.5">
              {/* Option 1: Admin / Librarian */}
              <button
                onClick={() => {
                  setRole('admin');
                  setShowRoleModal(false);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  role === 'admin' 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Admin / Pustakawan</span>
                    {role === 'admin' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola buku, setujui peminjaman, data siswa/guru, denda, dan laporan sekolah.
                  </p>
                </div>
              </button>

              {/* Option 2: Siswa / Anggota */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                role === 'siswa' 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600' 
                  : 'border-slate-200'
              }`}>
                <div 
                  onClick={() => {
                    setRole('siswa');
                    setShowRoleModal(false);
                  }}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">Siswa / Anggota Perpustakaan</span>
                      {role === 'siswa' && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cari buku, ajukan pinjam, baca e-book digital, unduh KTA QR, dan pantau denda.
                    </p>
                  </div>
                </div>

                {/* Sub-selection of Member Account */}
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Ganti Profil Siswa Aktif:
                  </label>
                  <select
                    value={activeMember.id}
                    onChange={(e) => {
                      const found = members.find(m => m.id === e.target.value);
                      if (found) {
                        setActiveMember(found);
                        setRole('siswa');
                        setShowRoleModal(false);
                      }
                    }}
                    className="w-full text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.classGroup} - NIS: {m.nis})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Option 3: Kios Buku Tamu */}
              <button
                onClick={() => {
                  setRole('guest_kiosk');
                  setShowRoleModal(false);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  role === 'guest_kiosk' 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Kios Buku Tamu Digital</span>
                    {role === 'guest_kiosk' && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mode layar sentuh di depan pintu perpustakaan untuk presensi kunjungan harian siswa & guru.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
