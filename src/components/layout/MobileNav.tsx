import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Target,
  FileCode,
  Sparkles,
  Kanban,
  Settings
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface MobileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer' as const, label: 'Analyzer', icon: FileCheck2 },
    { id: 'job-matcher' as const, label: 'Matcher', icon: Target },
    { id: 'builder' as const, label: 'Builder', icon: FileCode },
    { id: 'improver' as const, label: 'Improver', icon: Sparkles },
    { id: 'tracker' as const, label: 'Tracker', icon: Kanban },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-1.5 rounded-xl transition-all ${
              isActive
                ? 'text-brand-600 dark:text-brand-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
