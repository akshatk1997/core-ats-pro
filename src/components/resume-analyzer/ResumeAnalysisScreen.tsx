import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Upload,
  ArrowRight,
  Download,
  Info,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Zap,
  Tag,
  Layers,
  Award,
  BookOpen,
  Calculator
} from 'lucide-react';
import { ResumeVersion, ResumeIssue, JobDescription } from '@/types';
import { calculateATSScore } from '@/lib/atsEngine';
import { calculateKeywordFrequencies, KeywordFrequency } from '@/lib/jobMatcher';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';

interface ResumeAnalysisScreenProps {
  activeResume: ResumeVersion;
  targetJob?: JobDescription;
  onImproveIssue: (issue: ResumeIssue) => void;
  onReAnalyze: () => void;
  onOpenUpload: () => void;
}

export const ResumeAnalysisScreen: React.FC<ResumeAnalysisScreenProps> = ({
  activeResume,
  targetJob,
  onImproveIssue,
  onReAnalyze,
  onOpenUpload,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<ResumeIssue | null>(activeResume?.issues?.[0] || null);
  const [jobscanTab, setJobscanTab] = useState<'hard_skills' | 'soft_skills' | 'recruiter_tips' | 'job_title'>('hard_skills');
  const [highlightFilter, setHighlightFilter] = useState<'all' | 'hard' | 'missing' | 'soft'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const resume = activeResume?.content || {
    contactInfo: { fullName: 'Candidate', email: '', phone: '', location: '' },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };
  const defaultJobDescription: JobDescription = targetJob || {
    id: 'jd_default',
    title: 'Senior Project Manager',
    company: 'CloudScale Dynamics',
    rawText: 'Project management Jira Agile Scrum Stakeholder management Risk management Excel Power BI SQL',
    requiredSkills: ['Project Management', 'Jira', 'Agile', 'Scrum', 'Stakeholder Management', 'Risk Management', 'Excel', 'Power BI'],
    preferredSkills: ['PMP Certification', 'SQL', 'Productboard'],
    responsibilities: ['Lead sprint planning', 'Manage stakeholder matrices', 'Track velocity'],
    qualifications: ['Bachelor degree', '3+ years experience'],
    toolsAndTech: ['Jira', 'Confluence', 'Excel', 'Power BI', 'SQL'],
    softSkills: ['Stakeholder Management', 'Executive Communication', 'Leadership'],
    actionVerbs: ['Lead', 'Facilitate', 'Manage'],
    createdDate: '2026-09-20'
  };

  // Live real-time score calculation
  const { breakdown, issues, detailedCalculation } = calculateATSScore(resume, defaultJobDescription);
  const frequencies = calculateKeywordFrequencies(resume, defaultJobDescription);

  const matchedHard = frequencies.filter(f => f.category === 'hard_skill' && f.status === 'matched');
  const missingHard = frequencies.filter(f => f.category === 'hard_skill' && f.status === 'missing');
  const softSkills = frequencies.filter(f => f.category === 'soft_skill');

  const handleRunScan = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onReAnalyze();
    }, 800);
  };

  const handleCopyMissing = () => {
    const text = missingHard.map(m => m.keyword).join(', ');
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Live ATS Top Header Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Live ATS Scanner</span>
            </span>
            <span className="text-slate-400 text-xs">• Matching target: {defaultJobDescription.title}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>ATS Compatibility Audit & Score Diagnostic</span>
          </h1>
          <p className="text-slate-400 text-xs max-w-xl">
            Live score calculated mathematically across 6 evaluation parameters. Click the score to see exact point calculations.
          </p>
        </div>

        {/* Top Score Circular Gauge */}
        <div className="flex items-center space-x-4 z-10">
          <div className="flex flex-col items-end cursor-pointer" onClick={() => setShowFormulaModal(true)}>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
              <span>Exact ATS Score</span>
              <Info className="w-3 h-3 text-brand-400" />
            </span>
            <span className="text-3xl font-black text-emerald-400 num-tabular">{breakdown.overall} / 100</span>
            <span className="text-[10px] text-brand-400 font-bold hover:underline">Why {breakdown.overall}? Click for Formula</span>
          </div>

          <div
            onClick={() => setShowFormulaModal(true)}
            className="relative w-16 h-16 rounded-full bg-slate-950 border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-400 text-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >
            {breakdown.overall}
          </div>

          <button
            onClick={onOpenUpload}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Resume</span>
          </button>
        </div>
      </div>

      {/* Live Highlighting Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Overlay Filter:</span>
          <div className="flex items-center space-x-1">
            {(['all', 'hard', 'missing', 'soft'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setHighlightFilter(filter)}
                className={`px-3 py-1 rounded-lg font-semibold uppercase text-[10px] transition-all ${
                  highlightFilter === filter
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setShowFormulaModal(true)}
            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center space-x-1"
          >
            <Calculator className="w-3.5 h-3.5 text-brand-600" />
            <span>View Mathematical Score Formula</span>
          </button>

          <button
            onClick={handleCopyMissing}
            className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-[11px] border border-rose-200/60 dark:border-rose-800 flex items-center space-x-1"
          >
            <Copy className="w-3 h-3" />
            <span>{copiedKey ? 'Copied!' : 'Copy Missing Terms'}</span>
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Document Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[780px]">
          <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <FileCheck2 className="w-4 h-4 text-brand-600" />
              <span>Parsed Resume Text Stream & Live Highlighting</span>
            </div>
            <button
              onClick={handleRunScan}
              disabled={isAnalyzing}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center space-x-1 hover:underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Run Live Re-Scan</span>
            </button>
          </div>

          <div className="p-8 space-y-6 font-sans text-slate-800 dark:text-slate-200 text-xs overflow-y-auto max-h-[720px] leading-relaxed">
            {/* Contact */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 text-center space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {resume.contactInfo?.fullName || 'Candidate'}
              </h2>
              <p className="text-slate-500 text-[11px]">
                {resume.contactInfo?.location || ''} • {resume.contactInfo?.email || ''} • {resume.contactInfo?.phone || ''}
              </p>
              {resume.contactInfo?.linkedin && (
                <p className="text-brand-600 dark:text-brand-400 text-[11px] font-medium">
                  {resume.contactInfo.linkedin}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
                Professional Summary
              </h3>
              <p className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                {resume.summary || 'No summary provided.'}
              </p>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
                Work Experience
              </h3>
              {(resume.workExperience || []).map((exp) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
                    <span>{exp.role} — <span className="text-brand-600 dark:text-brand-400">{exp.company}</span></span>
                    <span className="text-[11px] font-normal text-slate-500">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                    {exp.bullets.map((bullet, idx) => {
                      const issue = issues.find(
                        (i) => i.section === 'workExperience' && i.bulletIndex === idx
                      );
                      return (
                        <li
                          key={idx}
                          onClick={() => {
                            if (issue) setSelectedIssue(issue);
                          }}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            issue
                              ? 'bg-rose-50/50 dark:bg-rose-950/30 border-l-2 border-rose-500 font-medium'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          {bullet}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
                Technical Skills & Keyword Densities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {frequencies.map((freq, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      freq.status === 'matched'
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    <span className="font-bold">{freq.keyword}</span>
                    <Badge variant={freq.status === 'matched' ? 'success' : 'danger'} size="sm">
                      {freq.countInResume}x found
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Diagnostic Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live ATS Score Breakdown</h3>
              <button
                onClick={() => setShowFormulaModal(true)}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Exact Formula →
              </button>
            </div>

            <div className="space-y-3">
              <ProgressBar label="Formatting & Readability" value={breakdown.formattingReadability} max={25} color="brand" />
              <ProgressBar label="Keyword Alignment" value={breakdown.keywordAlignment} max={25} color="success" />
              <ProgressBar label="Job Requirement Alignment" value={breakdown.jobRequirementAlignment} max={20} color="brand" />
              <ProgressBar label="Experience Relevance" value={breakdown.experienceRelevance} max={15} color="sky" />
              <ProgressBar label="Structure & Completeness" value={breakdown.structureCompleteness} max={10} color="brand" />
              <ProgressBar label="Content Quality & Metrics" value={breakdown.contentQuality} max={5} color="warning" />
            </div>
          </div>

          {/* AI Recommendation Inspector Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>AI Recommendation Inspector</span>
            </h3>

            {selectedIssue ? (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <Badge variant={selectedIssue.severity === 'high' ? 'danger' : 'warning'}>
                  {selectedIssue.title}
                </Badge>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedIssue.explanation}
                </p>
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px]">
                  <strong>Why it matters:</strong> {selectedIssue.whyItMatters}
                </div>
                <button
                  onClick={() => onImproveIssue(selectedIssue)}
                  className="w-full py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Improve with AI Bullet Intelligence</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">Click any issue to inspect details.</p>
            )}
          </div>
        </div>
      </div>

      {/* Exact ATS Score Formula Modal */}
      <Modal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        title="Mathematical ATS Score Formula & Live Point Breakdown"
        subtitle={`Total Score: ${breakdown.overall} / 100 points calculated deterministically`}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            Per platform specifications, ATS scores are calculated deterministically across 6 backend-weighted categories rather than randomly generated by LLMs:
          </p>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {detailedCalculation.map((item, idx) => (
              <div key={idx} className="pt-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.category}</span>
                  <span className="font-extrabold text-brand-600 dark:text-brand-400 num-tabular">
                    {item.earned} / {item.max} pts
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">{item.reason}</p>
                <p className="text-brand-600 dark:text-brand-400 text-[11px] font-semibold">
                  💡 How to get max points: {item.tipsToReachMax}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center mt-4">
            <span className="font-bold">Final Deterministic Total ATS Score:</span>
            <span className="text-2xl font-black text-emerald-400 num-tabular">{breakdown.overall} / 100</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
