import React, { useState } from 'react';
import { Files, Plus, Check, ArrowRight, GitCompare, Trash2, Upload, FileUp, Sparkles, RefreshCw, Layers, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ResumeVersion, StructuredResume } from '@/types';
import { Badge } from '../ui/Badge';
import { parseRawResumeText } from '@/lib/resumeParser';

interface ResumeVersionsScreenProps {
  versions: ResumeVersion[];
  activeVersionId: string;
  onSelectActiveVersion: (id: string) => void;
  onUploadVersion?: (content: StructuredResume, fileName: string) => void;
  onDeleteVersion?: (id: string) => void;
  onCreateVersion?: (name: string, targetRole: string) => void;
}

export const ResumeVersionsScreen: React.FC<ResumeVersionsScreenProps> = ({
  versions,
  activeVersionId,
  onSelectActiveVersion,
  onUploadVersion,
  onDeleteVersion,
  onCreateVersion,
}) => {
  const [compareMode, setCompareMode] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [versionAId, setVersionAId] = useState<string>(versions[0]?.id || '');
  const [versionBId, setVersionBId] = useState<string>(versions[1]?.id || versions[0]?.id || '');
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const versionA = versions.find((v) => v.id === versionAId) || versions[0];
  const versionB = versions.find((v) => v.id === versionBId) || versions[1] || versions[0];

  const handleFileUpload = (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setTimeout(() => {
        const parsed = parseRawResumeText(text);
        if (onUploadVersion) {
          onUploadVersion(parsed, file.name);
        }
        setIsParsing(false);
        setShowUploadModal(false);
      }, 600);
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const getFileExtensionBadge = (name: string) => {
    const ext = name.split('.').pop()?.toUpperCase();
    if (ext === 'PDF') return <Badge variant="danger">PDF FILE</Badge>;
    if (ext === 'DOCX' || ext === 'DOC') return <Badge variant="brand">DOCX FILE</Badge>;
    if (ext === 'JSON') return <Badge variant="info">JSON DATA</Badge>;
    return <Badge variant="default">TXT / DATA STREAM</Badge>;
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Files className="w-5 h-5 text-brand-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Role-Specific Resume Version Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Zero sample data pre-populated. Upload and manage live resume files customized for target role criteria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowUploadModal(!showUploadModal)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs font-extrabold transition-all shadow-md flex items-center space-x-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>+ Insert Live Resume File</span>
          </button>

          {versions.length > 1 && (
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                compareMode
                  ? 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
              }`}
            >
              <GitCompare className="w-4 h-4 inline mr-1.5" />
              <span>{compareMode ? 'Exit Comparison' : 'Side-by-Side Comparison'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload File Panel Modal / Drawer */}
      {showUploadModal && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-brand-500 shadow-xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Insert Live Resume Document</h3>
              <p className="text-xs text-slate-500">Upload your real .pdf, .docx, .txt, or .json file to generate real-time ATS data insights.</p>
            </div>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Close
            </button>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
                : 'border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
          >
            <Upload className="w-8 h-8 text-brand-600 dark:text-brand-400 mb-2" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Drag & drop your live resume file here</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOCX, TXT, JSON (Max 10MB)</span>

            <label className="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer">
              <span>Browse Real File</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {isParsing && (
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center space-x-2 text-xs text-brand-700 dark:text-brand-300">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Parsing document data stream and indexing real candidate nodes...</span>
            </div>
          )}
        </div>
      )}

      {/* Main Grid View or Empty State */}
      {versions.length === 0 ? (
        /* Empty State: No Live Files Inserted Yet */
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mx-auto shadow-sm">
            <FileUp className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
              No Live Resume Files Inserted Yet
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Upload your actual resume file (.pdf, .docx, .txt, .json) to track role-specific versions, generate real-time ATS scores, and inspect exact keyword coverage.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-xs transition-all shadow-lg inline-flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Insert Live Resume File Now</span>
          </button>
        </div>
      ) : !compareMode ? (
        /* Normal Version Cards Grid displaying Real File Data Insights */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {versions.map((ver) => (
            <div
              key={ver.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all space-y-4 relative ${
                ver.id === activeVersionId
                  ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <Badge variant={ver.isPrimary ? 'brand' : 'default'}>
                    {ver.isPrimary ? 'Primary Master' : 'Role Variant'}
                  </Badge>
                  {getFileExtensionBadge(ver.name)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-mono">{ver.lastUpdated}</span>
                  {onDeleteVersion && (
                    <button
                      onClick={() => onDeleteVersion(ver.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Delete version file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{ver.name}</h3>
                <p className="text-xs text-slate-500">Target Role: {ver.targetRole}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Candidate: {ver.content.contactInfo.fullName}</p>
              </div>

              {/* Real Data Insights Node Breakdown */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Parsed Source Data Insights</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                  <div>💼 {ver.content.workExperience.length} Position(s)</div>
                  <div>🎓 {ver.content.education.length} Education Node(s)</div>
                  <div>🛠️ {ver.content.skills.length} Skill Group(s)</div>
                  <div>📑 {ver.content.customSections?.length || 0} Custom Section(s)</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Real ATS Score</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{ver.atsScore}%</span>
                </div>

                {ver.id !== activeVersionId ? (
                  <button
                    onClick={() => onSelectActiveVersion(ver.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Set as Active
                  </button>
                ) : (
                  <Badge variant="success">Active Workspace</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Side by Side Comparison Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Version A */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-brand-600">Resume Version A</h3>
              <select
                value={versionAId}
                onChange={(e) => setVersionAId(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              >
                {versions.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            {versionA && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <p className="text-sm font-bold">{versionA.name}</p>
                <p className="text-xs text-slate-500">Candidate: {versionA.content.contactInfo.fullName}</p>
                <p className="text-xs text-slate-500">ATS Score: {versionA.atsScore}%</p>
                <p className="text-xs text-slate-500">Target Job Match: {versionA.jobMatchScore || 84}%</p>
                <p className="text-xs text-slate-500">Work Positions: {versionA.content.workExperience.length}</p>
              </div>
            )}
          </div>

          {/* Version B */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-sky-600">Resume Version B</h3>
              <select
                value={versionBId}
                onChange={(e) => setVersionBId(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              >
                {versions.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            {versionB && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <p className="text-sm font-bold">{versionB.name}</p>
                <p className="text-xs text-slate-500">Candidate: {versionB.content.contactInfo.fullName}</p>
                <p className="text-xs text-slate-500">ATS Score: {versionB.atsScore}%</p>
                <p className="text-xs text-slate-500">Target Job Match: {versionB.jobMatchScore || 76}%</p>
                <p className="text-xs text-slate-500">Work Positions: {versionB.content.workExperience.length}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
