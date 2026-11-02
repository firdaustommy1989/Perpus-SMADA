/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { NotificationToast } from './components/NotificationToast';
import { DashboardView } from './components/DashboardView';
import { CatalogView } from './components/CatalogView';
import { CirculationView } from './components/CirculationView';
import { MembersView } from './components/MembersView';
import { StudentCardTab } from './components/StudentCardTab';
import { GuestBookView } from './components/GuestBookView';
import { ReportsView } from './components/ReportsView';
import { FeedbackFaqView } from './components/FeedbackFaqView';
import { SettingsView } from './components/SettingsView';
import { LoginView } from './components/LoginView';
import { BookOpen } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentTab, profile, isAuthenticated } = useLibrary();

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <NotificationToast />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'catalog':
        return <CatalogView />;
      case 'circulation':
        return <CirculationView />;
      case 'members':
        return <MembersView />;
      case 'my-card':
        return <StudentCardTab />;
      case 'guestbook':
        return <GuestBookView />;
      case 'reports':
        return <ReportsView />;
      case 'feedback':
        return <FeedbackFaqView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Real-time Floating Notification Toaster */}
      <NotificationToast />

      {/* Main Container Viewport (Desktop baseline 1440px wide layout) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderCurrentView()}
      </main>

      {/* Quiet Footer (Clean Corporate Navy & Bright Yellow Accent) */}
      <footer className="border-t border-slate-200 bg-white py-6 no-print text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-slate-950 stroke-[2.2]" />
            </div>
            <span className="font-bold text-[#0B192C]">{profile.libraryName}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{profile.schoolName}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span>NPSN: {profile.npsn}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-[#0B192C] font-semibold">Sistem Perpustakaan Digital SMA</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}
