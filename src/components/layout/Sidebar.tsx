import {
  LayoutDashboard,
  FileCheck2,
  Target,
  Files,
  FileCode,
  Sparkles,
  Mail,
  Linkedin,
  Kanban,
  Bot,
  Settings,
  HelpCircle,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldAlert,
  Activity,
  Video,
  Compass
} from 'lucide-react';
import { UserProfile } from '@/types';

export type ActiveTab =
  | 'dashboard'
  | 'analyzer'
  | 'job-matcher'
  | 'my-resumes'
  | 'builder'
  | 'improver'
  | 'cover-letter'
  | 'linkedin'
  | 'tracker'
  | 'career-tools'
  | 'mock-interview'
  | 'settings'
  | 'live-pulse'
  | 'platform-guide'
  | 'upgrade';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  user,
}) => {
  const mainNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer' as const, label: 'Resume Analyzer', icon: FileCheck2, badge: 'ATS 87' },
    { id: 'job-matcher' as const, label: 'Job Matcher', icon: Target },
    { id: 'my-resumes' as const, label: 'My Resumes', icon: Files },
    { id: 'builder' as const, label: 'Resume Builder', icon: FileCode },
    { id: 'improver' as const, label: 'AI Resume Improver', icon: Sparkles },
    { id: 'cover-letter' as const, label: 'Cover Letter', icon: Mail },
    { id: 'linkedin' as const, label: 'LinkedIn Optimizer', icon: Linkedin },
    { id: 'tracker' as const, label: 'Application Tracker', icon: Kanban, count: 5 },
    { id: 'mock-interview' as const, label: 'AI Mock Interview', icon: Video, badge: 'LIVE AI' },
    { id: 'career-tools' as const, label: 'AI Career Tools', icon: Bot },
  ];

  const secondaryNavItems = [
    { id: 'platform-guide' as const, label: 'Platform Architecture', icon: Compass, badge: 'GUIDE' },
    { id: 'live-pulse' as const, label: 'Live System Pulse', icon: Activity, highlight: true },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        {!collapsed ? (
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
              CORE
            </div>
            <div>
              <span className="font-extrabold text-xs tracking-tight text-slate-900 dark:text-white block leading-tight">
                CORE ATS RESUME
              </span>
              <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 tracking-wider uppercase block">
                CHECKER & INTELLIGENCE
              </span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 mx-auto rounded-lg bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
            CORE
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className={`px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed ? 'Core Intelligence' : '•••'}
        </div>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center rounded-xl text-xs font-medium transition-all ${
                collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 space-x-3'
              } ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/50'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {item.badge}
                </span>
              )}
              {!collapsed && item.count && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 my-2">
          <div className={`px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed ? 'Account & Support' : '•••'}
          </div>

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-xl text-xs font-medium transition-all ${
                  collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 space-x-3'
                } ${
                  item.highlight
                    ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 hover:from-amber-500/20 hover:to-orange-500/20'
                    : isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/60 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${item.highlight ? 'text-amber-500' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs flex-shrink-0">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
