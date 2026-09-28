import React, { useState, useEffect } from 'react';
import { Search, Command, FileCheck2, Target, Sparkles, FileCode, Mail, Kanban, Settings, X, Compass, Video } from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open menu action
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'platform-guide', label: 'Platform Architecture & System Guide', icon: Compass, category: 'Documentation' },
    { id: 'analyzer', label: 'Analyze Active Resume for ATS', icon: FileCheck2, category: 'Core Actions' },
    { id: 'job-matcher', label: 'Match Resume to Target Job Description', icon: Target, category: 'Core Actions' },
    { id: 'mock-interview', label: 'Start Live AI Video/Voice Mock Interview Studio', icon: Video, category: 'AI Intelligence' },
    { id: 'improver', label: 'Improve Experience Bullet Points with AI', icon: Sparkles, category: 'AI Intelligence' },
    { id: 'builder', label: 'Open ATS Resume Builder & Export PDF', icon: FileCode, category: 'Tools' },
    { id: 'cover-letter', label: 'Generate Tailored Cover Letter', icon: Mail, category: 'Tools' },
    { id: 'tracker', label: 'View Application Kanban Board', icon: Kanban, category: 'Applications' },
    { id: 'settings', label: 'Open Platform Settings & Account', icon: Settings, category: 'System' },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
            ESC
          </kbd>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={() => {
                  onSelectAction(cmd.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>{cmd.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">{cmd.category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
