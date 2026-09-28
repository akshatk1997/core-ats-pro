import React, { useState } from 'react';
import { Search, Command, Sun, Moon, Bell, Sparkles, Upload, FilePlus, Zap } from 'lucide-react';
import { UserProfile } from '@/types';

interface HeaderProps {
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onOpenCommandMenu: () => void;
  onOpenUploadModal: () => void;
  onOpenUpgradeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  darkMode,
  setDarkMode,
  onOpenCommandMenu,
  onOpenUploadModal,
  onOpenUpgradeModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 'n1', title: 'ATS Analysis Complete', desc: 'Score updated to 87/100 (+12 gain)', time: '10m ago' },
    { id: 'n2', title: 'Interview Scheduled', desc: 'CloudScale Dynamics - Senior PM on Sept 28', time: '1h ago' },
    { id: 'n3', title: 'AI Bullet Improvement Available', desc: '4 recommendations ready for review', time: '3h ago' }
  ];

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search & Command Palette Trigger */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <button
          onClick={onOpenCommandMenu}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600 transition-colors text-xs font-medium"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search resumes, jobs, or type a command...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 shadow-2xs">
            <Command className="w-2.5 h-2.5 mr-0.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Upload Quick Button */}
        <button
          onClick={onOpenUploadModal}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 text-xs font-semibold transition-colors border border-brand-200/60 dark:border-brand-800"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Resume</span>
        </button>

        {/* Full Access Status Pill */}
        <button
          onClick={onOpenUpgradeModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold shadow-2xs transition-all"
          title="Full Access Unlocked - 100% Free Lifetime Platform"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Full Access (100% Free)</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Notifications</span>
                <span className="text-[10px] text-brand-600 font-semibold cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
