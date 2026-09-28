import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Zap,
  RefreshCw,
  Copy,
  Filter,
  Tag,
  Layers,
  ArrowLeftRight,
  Upload,
  FileUp,
  Sliders,
  ChevronDown,
  Cpu,
  Search,
  CheckSquare,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { JobDescription, JobMatchResult, ResumeVersion, JobType } from '@/types';
import {
  parseRawJobDescription,
  matchResumeToJob,
  calculateKeywordFrequencies,
  analyzeDeepJdCriteria,
  DeepCriteriaAnalysis
} from '@/lib/jobMatcher';
import { JOB_TYPE_PRESETS } from '@/lib/jobTypePresets';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface JobMatcherScreenProps {
  activeResume: ResumeVersion;
  jobDescriptions: JobDescription[];
  onSaveJob: (job: JobDescription) => void;
  onOptimizeForJob: (job: JobDescription) => void;
}

export const JobMatcherScreen: React.FC<JobMatcherScreenProps> = ({
  activeResume,
  jobDescriptions,
  onSaveJob,
  onOptimizeForJob,
}) => {
  const [selectedJob, setSelectedJob] = useState<JobDescription>(jobDescriptions[0] || {
    id: 'jd_default',
    title: 'Target Role',
    company: 'Target Company',
    rawText: 'Paste or upload a job description file to begin ATS keyword matching.',
    requiredSkills: ['Project Management', 'Communication', 'Agile'],
    preferredSkills: ['PMP', 'SQL'],
    responsibilities: ['Lead team execution'],
    qualifications: ['Bachelor degree'],
    toolsAndTech: ['Jira'],
    softSkills: ['Leadership'],
    actionVerbs: ['Lead'],
    createdDate: '2026-09-27'
  });
  const [activeJobType, setActiveJobType] = useState<JobType>(selectedJob.jobType || 'Full-Time Enterprise');
  const [rawInputText, setRawInputText] = useState('');
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [matcherTab, setMatcherTab] = useState<'deep_criteria' | 'comparison' | 'keyword_density' | 'new_job'>('deep_criteria');
  const [criteriaFilter, setCriteriaFilter] = useState<'all' | 'missing' | 'must_have' | 'hard_skill' | 'tool' | 'soft_skill'>('all');
  const [uploadMode, setUploadMode] = useState<'upload_file' | 'paste_text'>('upload_file');
  const [uploadFileName, setUploadFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const currentJobTypePreset = JOB_TYPE_PRESETS[activeJobType];

  const handleApplyJobTypeRequirements = (jType: JobType) => {
    setActiveJobType(jType);
    const preset = JOB_TYPE_PRESETS[jType];
    const updatedReqs = Array.from(new Set([...(selectedJob.requiredSkills || []), ...(preset?.keyKeywords || [])]));
    const updatedJob: JobDescription = {
      ...selectedJob,
      jobType: jType,
      jobTypeRequirements: {
        focusAreas: preset?.focusAreas || [],
        keyKeywords: preset?.keyKeywords || [],
      },
      requiredSkills: updatedReqs,
      rawText: `${selectedJob.rawText || ''}\n\n[JOB TYPE REQUIREMENTS: ${jType}]\nFocus Areas: ${(preset?.focusAreas || []).join(', ')}\nKey Keywords: ${(preset?.keyKeywords || []).join(', ')}`
    };
    setSelectedJob(updatedJob);
    onSaveJob(updatedJob);
  };

  // Deep JD & Keyword Calculations
  const resumeContent = activeResume?.content || { contactInfo: { fullName: 'Candidate' }, summary: '', workExperience: [], education: [], skills: [], projects: [], certifications: [] };
  const matchResult: JobMatchResult = matchResumeToJob(resumeContent, selectedJob);
  const frequencies = calculateKeywordFrequencies(resumeContent, selectedJob);
  const deepAnalysis: DeepCriteriaAnalysis = analyzeDeepJdCriteria(resumeContent, selectedJob);

  const matchedSkills = frequencies.filter(f => f.status === 'matched');
  const missingSkills = frequencies.filter(f => f.status === 'missing');

  const filteredCriteriaItems = deepAnalysis.items.filter(item => {
    if (criteriaFilter === 'missing') return item.status === 'missing';
    if (criteriaFilter === 'must_have') return item.importance === 'Must Have';
    if (criteriaFilter === 'hard_skill') return item.category === 'hard_skill';
    if (criteriaFilter === 'tool') return item.category === 'tool';
    if (criteriaFilter === 'soft_skill') return item.category === 'soft_skill';
    return true;
  });

  const handleJdFileUpload = (file: File) => {
    setIsAnalyzing(true);
    setUploadFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setTimeout(() => {
        const titleFromFilename = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const title = jobTitleInput.trim() || titleFromFilename || 'Target Job Role';
        const company = companyInput.trim() || 'Target Organization';

        const parsed = parseRawJobDescription(
          text.length > 20 ? text : `Job Description from file ${file.name}.\nRequirements: Project Management, Agile, SQL, Power BI, Stakeholder Communication.`,
          title,
          company
        );

        onSaveJob(parsed);
        setSelectedJob(parsed);
        setIsAnalyzing(false);
        setMatcherTab('deep_criteria');
        setRawInputText('');
        setJobTitleInput('');
        setCompanyInput('');
        setUploadFileName('');
      }, 700);
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleJdFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleParseNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInputText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const parsed = parseRawJobDescription(
        rawInputText,
        jobTitleInput || 'Target Role',
        companyInput || 'Target Company'
      );
      onSaveJob(parsed);
      setSelectedJob(parsed);
      setIsAnalyzing(false);
      setMatcherTab('deep_criteria');
      setRawInputText('');
      setJobTitleInput('');
      setCompanyInput('');
    }, 800);
  };

  const handleCopyMissing = () => {
    const text = missingSkills.map(m => m.keyword).join(', ');
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Jobscan Top Workspace Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-brand-400" />
              <span>Deep JD Analysis & Keyword Coverage Hub</span>
            </span>
            <span className="text-slate-400 text-xs">• Target: {selectedJob.title}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Job Description Criteria & Exact Keyword Coverage
          </h1>
          <p className="text-slate-400 text-xs max-w-xl">
            Deep analysis of target job criteria, keyword frequencies, missing requirement gaps, and exact resume coverage tips.
          </p>
        </div>

        {/* Job Selector & Actions */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="relative">
            <select
              value={selectedJob.id}
              onChange={(e) => {
                const found = jobDescriptions.find(j => j.id === e.target.value);
                if (found) setSelectedJob(found);
              }}
              className="appearance-none bg-slate-800 text-white text-xs font-semibold px-3.5 py-2.5 pr-8 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-none cursor-pointer"
            >
              {jobDescriptions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} @ {j.company}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => onOptimizeForJob(selectedJob)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs font-extrabold transition-all shadow-lg flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Optimize Resume for This Job</span>
          </button>
        </div>
      </div>

      {/* Job Type Requirements Presets Studio */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Job Role & Job Type Requirements Presets
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your target job type to dynamically inject specific ATS evaluation criteria, focus areas, and keyword requirements.
            </p>
          </div>

          {/* Job Type Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(Object.keys(JOB_TYPE_PRESETS) as JobType[]).map((jType) => (
              <button
                key={jType}
                onClick={() => handleApplyJobTypeRequirements(jType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeJobType === jType
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
                }`}
              >
                {jType}
              </button>
            ))}
          </div>
        </div>

        {/* Active Job Type Requirements Overview Banner */}
        {currentJobTypePreset && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                📋 {currentJobTypePreset.jobType} Requirements: {currentJobTypePreset.description}
              </span>
              <Badge variant="brand" className="w-fit text-[11px]">
                Requirements Preset Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Focus Areas */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Target Focus Areas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentJobTypePreset.focusAreas.map((fa, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-brand-50/80 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800 font-semibold text-[11px]">
                      {fa}
                    </span>
                  ))}
                </div>
              </div>

              {/* Required Preset Keywords */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Job Type Key Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentJobTypePreset.keyKeywords.map((kw, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-[11px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setMatcherTab('deep_criteria')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            matcherTab === 'deep_criteria'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4 text-brand-500" />
          <span>Deep JD Criteria & Keywords ({deepAnalysis.totalCriteria})</span>
        </button>

        <button
          onClick={() => setMatcherTab('comparison')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            matcherTab === 'comparison'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Side-by-Side Match</span>
        </button>

        <button
          onClick={() => setMatcherTab('keyword_density')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            matcherTab === 'keyword_density'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Keyword Density ({frequencies.length})</span>
        </button>

        <button
          onClick={() => setMatcherTab('new_job')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            matcherTab === 'new_job'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload / Add Job Description</span>
        </button>
      </div>

      {/* VIEW 1: DEEP JD CRITERIA & EXACT KEYWORD ANALYSIS */}
      {matcherTab === 'deep_criteria' && (
        <div className="space-y-6">
          {/* Executive Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall JD Match</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{matchResult.overallMatch}%</span>
                <Badge variant={matchResult.overallMatch >= 80 ? 'success' : 'warning'}>
                  {matchResult.overallMatch >= 80 ? 'Strong Match' : 'Gap Action Required'}
                </Badge>
              </div>
              <ProgressBar value={matchResult.overallMatch} color="brand" />
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hard Skills Criteria</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {deepAnalysis.hardSkillsCovered}/{deepAnalysis.hardSkillsTotal}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {deepAnalysis.hardSkillsTotal > 0 ? Math.round((deepAnalysis.hardSkillsCovered / deepAnalysis.hardSkillsTotal) * 100) : 100}%
                </span>
              </div>
              <ProgressBar
                value={deepAnalysis.hardSkillsTotal > 0 ? Math.round((deepAnalysis.hardSkillsCovered / deepAnalysis.hardSkillsTotal) * 100) : 100}
                color="success"
              />
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tools & Software</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                  {deepAnalysis.toolsCovered}/{deepAnalysis.toolsTotal}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {deepAnalysis.toolsTotal > 0 ? Math.round((deepAnalysis.toolsCovered / deepAnalysis.toolsTotal) * 100) : 100}%
                </span>
              </div>
              <ProgressBar
                value={deepAnalysis.toolsTotal > 0 ? Math.round((deepAnalysis.toolsCovered / deepAnalysis.toolsTotal) * 100) : 100}
                color="sky"
              />
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Missing Criteria Gaps</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {deepAnalysis.missingCriteria} Gaps
                </span>
                <button
                  onClick={handleCopyMissing}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold text-[10px] border border-rose-200/60 dark:border-rose-800 flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey ? 'Copied!' : 'Copy Gaps'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Action items identified to achieve 100% JD coverage.</p>
            </div>
          </div>

          {/* Filtering & Detailed Criteria Matrix Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-brand-600" />
                  <span>Exact Job Description Criteria & Keyword Analysis</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full diagnostic of keywords present in {selectedJob.title} vs your active resume.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                {[
                  { id: 'all', label: `All (${deepAnalysis.items.length})` },
                  { id: 'missing', label: `Missing Gaps (${deepAnalysis.missingCriteria})`, highlight: true },
                  { id: 'must_have', label: 'Must Have' },
                  { id: 'hard_skill', label: 'Hard Skills' },
                  { id: 'tool', label: 'Tools & Tech' },
                  { id: 'soft_skill', label: 'Soft Skills' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCriteriaFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      criteriaFilter === f.id
                        ? f.highlight
                          ? 'bg-rose-500 text-white border-rose-600 shadow-sm font-extrabold'
                          : 'bg-brand-600 text-white border-brand-700 shadow-sm font-extrabold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria Items Table / Cards List */}
            <div className="space-y-3">
              {filteredCriteriaItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-bold text-slate-700 dark:text-slate-200">No Missing Criteria in This Filter!</p>
                  <p className="text-xs text-slate-500">Your resume properly covers all JD criteria in this view.</p>
                </div>
              ) : (
                filteredCriteriaItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      item.status === 'missing'
                        ? 'border-rose-200 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20'
                        : item.status === 'overused'
                        ? 'border-amber-200 dark:border-amber-950 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          item.status === 'matched' ? 'bg-emerald-500' : item.status === 'overused' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{item.keyword}</span>
                        <Badge variant="outline" className="uppercase text-[9px]">
                          {item.category.replace('_', ' ')}
                        </Badge>
                        <Badge variant={item.importance === 'Must Have' ? 'brand' : 'default'} className="text-[9px]">
                          {item.importance}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-3 text-xs font-semibold">
                        <span className="text-slate-500">
                          Resume: <strong className={item.countInResume > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{item.countInResume}x</strong>
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">
                          JD Target: <strong>{item.countInJob}x</strong>
                        </span>
                        <Badge variant={item.status === 'matched' ? 'success' : item.status === 'overused' ? 'warning' : 'danger'}>
                          {item.status === 'matched' ? '✓ Covered' : item.status === 'overused' ? '⚠️ Overused' : '✕ Missing'}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed pl-5">
                      💡 {item.recommendation}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Side-by-Side Match */}
      {matcherTab === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Target Job Description Text Stream (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6 min-h-[650px]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Job Description</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedJob.title}</h3>
              </div>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{selectedJob.company}</span>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-[550px] overflow-y-auto">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requiredSkills.map((req, i) => (
                    <Badge key={i} variant={activeResume.content.skills.some(s => s.skills.includes(req)) ? 'success' : 'danger'}>
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Responsibilities & Expectations:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Raw Job Description text:</span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {selectedJob.rawText}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Jobscan Match Gauge & Skill Diagnostics (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Jobscan Score Ring Card */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Job Match</span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                    {matchResult.overallMatch}% <span className="text-sm font-normal text-slate-400">Match</span>
                  </h2>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-brand-500 flex items-center justify-center font-black text-brand-600 dark:text-brand-400 text-xl bg-brand-50 dark:bg-brand-950/40">
                  {matchResult.overallMatch}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ProgressBar label="Keyword Match" value={matchResult.keywordMatch} color="brand" />
                <ProgressBar label="Skill Coverage" value={matchResult.skillMatch} color="success" />
                <ProgressBar label="Experience Alignment" value={matchResult.experienceMatch} color="sky" />
                <ProgressBar label="Responsibilities" value={matchResult.responsibilityMatch} color="warning" />
              </div>
            </div>

            {/* Found vs Missing Keyword Badges */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Found vs Missing Keywords</h3>
                <button
                  onClick={handleCopyMissing}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-[11px] border border-rose-200/60 dark:border-rose-800 flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey ? 'Copied!' : 'Copy Missing'}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    ✓ Found in Your Resume ({matchedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((m, i) => (
                      <Badge key={i} variant="success">{m.keyword}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                    ✕ Missing Requirements ({missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((m, i) => (
                      <Badge key={i} variant="danger">{m.keyword}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Jobalytics Keyword Density */}
      {matcherTab === 'keyword_density' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Jobalytics Keyword Density Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {frequencies.map((freq, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{freq.keyword}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{freq.category}</span>
                </div>
                <Badge variant={freq.status === 'matched' ? 'success' : 'danger'}>
                  {freq.countInResume}x found
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: Upload or Add Job Description */}
      {matcherTab === 'new_job' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Job Description File & Text Parser
              </h3>
              <p className="text-xs text-slate-500">
                Upload a Job Description document or paste raw job posting text to extract exact keywords.
              </p>
            </div>

            {/* Switch Mode Buttons */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setUploadMode('upload_file')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  uploadMode === 'upload_file'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Upload File (.pdf, .docx)
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('paste_text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  uploadMode === 'paste_text'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Paste Raw Text
              </button>
            </div>
          </div>

          {/* Role & Company Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Job Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Senior Project Manager"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Company Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. CloudScale Dynamics"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          {/* Mode 1: File Dropzone */}
          {uploadMode === 'upload_file' && (
            <div className="space-y-4">
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
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-3 shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {uploadFileName ? `Uploaded: ${uploadFileName}` : 'Drag & drop Job Description file here'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Supports .pdf, .docx, .txt, .json, .md files (Max 10MB)
                </span>

                <label className="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer">
                  <span>Browse Job Description File</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.json,.md"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleJdFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {isAnalyzing && (
                <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center space-3 text-xs text-brand-700 dark:text-brand-300">
                  <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>Parsing Job Description stream and extracting semantic ATS keywords...</span>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Paste Raw Text */}
          {uploadMode === 'paste_text' && (
            <form onSubmit={handleParseNewJob} className="space-y-4">
              <div className="text-xs">
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Raw Job Posting Content
                </label>
                <textarea
                  rows={8}
                  placeholder="Paste job responsibilities, required technical skills, tools, qualifications..."
                  value={rawInputText}
                  onChange={(e) => setRawInputText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || !rawInputText.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Parse & Run Job Match</span>}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
