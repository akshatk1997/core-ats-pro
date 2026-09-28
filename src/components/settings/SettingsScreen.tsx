import React, { useState } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Shield,
  Download,
  Trash2,
  Check,
  Upload,
  FileText,
  Sliders,
  Target,
  Plus,
  RefreshCw
} from 'lucide-react';
import { UserProfile, JobDescription } from '@/types';
import { parseRawJobDescription } from '@/lib/jobMatcher';
import { Badge } from '../ui/Badge';

interface SettingsScreenProps {
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onUpdateUser: (user: UserProfile) => void;
  jobDescriptions?: JobDescription[];
  onSaveJob?: (job: JobDescription) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  darkMode,
  setDarkMode,
  onUpdateUser,
  jobDescriptions = [],
  onSaveJob = () => {},
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [targetRole, setTargetRole] = useState(user.targetRole);
  const [matchThreshold, setMatchThreshold] = useState<number>(80);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [isUploadingJd, setIsUploadingJd] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      targetRole,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleJdFileUploadSettings = (file: File) => {
    setIsUploadingJd(true);
    setUploadFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setTimeout(() => {
        const titleFromFilename = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const title = titleFromFilename || targetRole || 'Uploaded Job Role';
        const company = 'Target Organization';

        const parsed = parseRawJobDescription(
          text.length > 20 ? text : `Job Description file ${file.name}.\nRequired skills: Project Management, Agile, SQL, Stakeholder Management.`,
          title,
          company
        );

        onSaveJob(parsed);
        setIsUploadingJd(false);
        setUploadFileName('');
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }, 600);
    };
    reader.readAsText(file);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "Core_ATS_Resume_Platform_Data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all stored resume and application data to default sample state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Settings className="w-5 h-5 text-brand-600" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Account & Job Description Settings
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved and Job Description updated!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Profile Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Job Description File Upload Settings Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Job Description File Upload Settings
              </h3>
              <p className="text-[11px] text-slate-500">
                Upload target Job Description documents (.pdf, .docx, .txt, .json, .md) to parse required skills automatically.
              </p>
            </div>
            <Badge variant="brand">JD Parser Active</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Upload New Job Description File
              </span>
              <p className="text-[11px] text-slate-500">
                Select a file to parse job title, company, and required keywords into your active match profile.
              </p>
              
              <label className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold cursor-pointer transition-all shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingJd ? 'Parsing JD File...' : 'Choose JD File'}</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.json,.md"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleJdFileUploadSettings(e.target.files[0]);
                    }
                  }}
                />
              </label>
              {uploadFileName && <p className="text-[10px] text-brand-600 font-mono">Selected: {uploadFileName}</p>}
            </div>

            {/* Match Threshold Control */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Minimum Target Match Threshold
                </span>
                <span className="font-bold text-brand-600">{matchThreshold}%</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Sets the benchmark match score for target job positions.
              </p>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={matchThreshold}
                onChange={(e) => setMatchThreshold(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>
          </div>

          {/* List of Saved Job Descriptions */}
          {jobDescriptions.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Saved Job Profiles ({jobDescriptions.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {jobDescriptions.map((jd) => (
                  <div key={jd.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{jd.title}</span>
                      <span className="text-[10px] text-slate-500">{jd.company} • {jd.requiredSkills.length} skills</span>
                    </div>
                    <Badge variant="success">Active Target</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Appearance & Theme</h3>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Dark Interface Mode</span>
              <span className="text-[11px] text-slate-500">Switch between dark charcoal and clean light themes</span>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Data & Storage Management</h3>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Platform JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={handleResetData}
              className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold flex items-center space-x-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset All Stored Data</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};
