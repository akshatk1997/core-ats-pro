import React, { useState } from 'react';
import { Kanban, List, Plus, Building2, Calendar, DollarSign, ExternalLink, MoreVertical, Trash2, Search, Filter } from 'lucide-react';
import { ApplicationTrackerItem, ApplicationStatus, ResumeVersion } from '@/types';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface ApplicationTrackerScreenProps {
  applications: ApplicationTrackerItem[];
  resumeVersions: ResumeVersion[];
  onAddApplication: (app: ApplicationTrackerItem) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDeleteApplication: (id: string) => void;
}

export const ApplicationTrackerScreen: React.FC<ApplicationTrackerScreenProps> = ({
  applications,
  resumeVersions,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [salary, setSalary] = useState('');
  const [notes, setNotes] = useState('');

  const statuses: ApplicationStatus[] = [
    'Saved',
    'Applied',
    'Assessment',
    'Interview',
    'Final Round',
    'Offer',
    'Rejected'
  ];

  const filteredApps = (applications || []).filter((app) =>
    (app?.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app?.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    const newApp: ApplicationTrackerItem = {
      id: `app_${Date.now()}`,
      company,
      role,
      status,
      dateApplied: new Date().toISOString().split('T')[0],
      salary: salary || undefined,
      notes: notes || undefined,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddApplication(newApp);
    setIsModalOpen(false);
    setCompany('');
    setRole('');
    setSalary('');
    setNotes('');
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Kanban className="w-5 h-5 text-brand-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Career Application Pipeline Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track interview schedules, salary ranges, follow-up dates, and linked resume versions across all target applications.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search bar */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto pb-4">
          {statuses.map((columnStatus) => {
            const columnApps = filteredApps.filter((a) => a.status === columnStatus);
            return (
              <div
                key={columnStatus}
                className="bg-slate-100/70 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 min-w-[220px] flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {columnStatus}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {columnApps.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {columnApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2 hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                          {app.company}
                        </span>
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                        {app.role}
                      </p>

                      {app.salary && (
                        <p className="text-[10px] text-slate-500 flex items-center space-x-1">
                          <DollarSign className="w-3 h-3 text-emerald-500" />
                          <span>{app.salary}</span>
                        </p>
                      )}

                      {app.interviewDate && (
                        <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/40 p-1 rounded">
                          <Calendar className="w-3 h-3" />
                          <span>Interview: {app.interviewDate}</span>
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                          className="text-[10px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <span className="text-[9px] text-slate-400">{app.updatedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase">
                <th className="p-4">Company</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Date Applied</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{app.company}</td>
                  <td className="p-4 text-brand-600 dark:text-brand-400 font-medium">{app.role}</td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">{app.salary || '—'}</td>
                  <td className="p-4 text-slate-500 font-mono">{app.dateApplied || '—'}</td>
                  <td className="p-4">
                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Track New Job Application"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Stripe, Notion, CloudScale"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Project Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Pipeline Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Salary Range (Optional)</label>
            <input
              type="text"
              placeholder="e.g. $140,000 - $160,000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Notes / Referral Contacts</label>
            <textarea
              rows={3}
              placeholder="e.g. Referred by Sarah Jenkins. Technical round on Thursday."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all"
          >
            Save Application to Pipeline
          </button>
        </form>
      </Modal>
    </div>
  );
};
