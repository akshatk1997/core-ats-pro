import React from 'react';
import {
  FileCheck2,
  Target,
  Sparkles,
  FileCode,
  Mail,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Clock,
  Briefcase,
  Video
} from 'lucide-react';
import { UserProfile, ResumeVersion, JobDescription, ApplicationTrackerItem, RecommendationItem } from '@/types';
import { ScoreCard } from '../ui/ScoreCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';

interface MainDashboardProps {
  user: UserProfile;
  activeResume: ResumeVersion;
  jobDescriptions: JobDescription[];
  applications: ApplicationTrackerItem[];
  recommendations: RecommendationItem[];
  onNavigate: (tab: any) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  user,
  activeResume,
  jobDescriptions,
  applications,
  recommendations,
  onNavigate,
}) => {
  const breakdown = activeResume?.atsBreakdown || {
    overall: 87,
    formattingReadability: 24,
    keywordAlignment: 22,
    jobRequirementAlignment: 17,
    experienceRelevance: 13,
    structureCompleteness: 8,
    contentQuality: 3,
  };
  const userName = user?.name ? user.name.split(' ')[0] : 'Candidate';
  const atsScoreVal = activeResume?.atsScore || 85;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-6 md:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>AI Career Copilot Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Good evening, {userName}.
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            Let's make your next application stronger. Your active resume is optimized at{' '}
            <span className="font-bold text-emerald-400">{atsScoreVal}% ATS compatibility</span>.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2.5 z-10">
          <button
            onClick={() => onNavigate('mock-interview')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span>Start Live AI Interview</span>
          </button>
          <button
            onClick={() => onNavigate('analyzer')}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Analyze Resume</span>
          </button>
          <button
            onClick={() => onNavigate('job-matcher')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center space-x-2 backdrop-blur-sm"
          >
            <Target className="w-4 h-4" />
            <span>Match Job</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ScoreCard
          title="Resume Health Score"
          score={atsScoreVal}
          subtitle="Overall ATS readiness"
          trend="+12 pts vs last scan"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          color="success"
          onClick={() => onNavigate('analyzer')}
        />
        <ScoreCard
          title="Job Match Rating"
          score={activeResume?.jobMatchScore || 84}
          subtitle={activeResume?.targetCompany ? `Matched to ${activeResume.targetCompany}` : 'Target role match'}
          trend="Strong Alignment"
          icon={<Target className="w-5 h-5 text-brand-500" />}
          color="brand"
          onClick={() => onNavigate('job-matcher')}
        />
        <ScoreCard
          title="Active Applications"
          score={(applications || []).length}
          maxScore={10}
          subtitle={`${(applications || []).filter(a => a?.status === 'Interview').length} interview(s) scheduled`}
          trend="In Progress"
          icon={<Briefcase className="w-5 h-5 text-sky-500" />}
          color="brand"
          onClick={() => onNavigate('tracker')}
        />
        <ScoreCard
          title="Open Fixes"
          score={(recommendations || []).length}
          maxScore={10}
          subtitle="High priority recommendations"
          trend="Action Required"
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          color="warning"
          onClick={() => onNavigate('improver')}
        />
      </div>

      {/* Main Content Layout: Left Breakdown + Right Action items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: ATS Score Architecture (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  ATS Compatibility Architecture
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Explainable breakdown across 6 deterministic evaluation categories
                </p>
              </div>
              <button
                onClick={() => onNavigate('analyzer')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center space-x-1"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <ProgressBar
                  label="Formatting & Readability"
                  value={breakdown.formattingReadability}
                  max={25}
                  color="brand"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Clean font hierarchy, standard section headers, no text boxes or complex graphics.
                </p>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <ProgressBar
                  label="Keyword Alignment"
                  value={breakdown.keywordAlignment}
                  max={25}
                  color="success"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Includes core domain terms ({activeResume.content.skills[0]?.skills.slice(0, 3).join(', ') || 'essential skills'}).
                </p>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <ProgressBar
                  label="Job Requirement Alignment"
                  value={breakdown.jobRequirementAlignment}
                  max={20}
                  color="brand"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct alignment with key job responsibilities & qualifications.
                </p>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <ProgressBar
                  label="Experience Relevance"
                  value={breakdown.experienceRelevance}
                  max={15}
                  color="sky"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Strong bullet depth across past {activeResume.targetRole || 'professional'} positions.
                </p>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <ProgressBar
                  label="Structure & Completeness"
                  value={breakdown.structureCompleteness}
                  max={10}
                  color="brand"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Complete contact details, education, certifications & projects.
                </p>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <ProgressBar
                  label="Content Quality & Metrics"
                  value={breakdown.contentQuality}
                  max={5}
                  color="warning"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Action verbs & quantitative outcomes (% gain, team size, budget).
                </p>
              </div>
            </div>
          </div>

          {/* Recent Applications Snapshot */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Active Job Application Pipeline
              </h3>
              <button
                onClick={() => onNavigate('tracker')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                View Kanban Board →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{app.company}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{app.role} • {app.location}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        app.status === 'Offer'
                          ? 'success'
                          : app.status === 'Interview'
                          ? 'brand'
                          : app.status === 'Assessment'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {app.status}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {app.updatedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: High Priority Recommendations & Quick Tools (1 col) */}
        <div className="space-y-6">
          {/* Prioritized Recommendations Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Top Improvement Actions</span>
              </h3>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {recommendations.length} total
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        rec.priority === 'HIGH' ? 'danger' : rec.priority === 'MEDIUM' ? 'warning' : 'info'
                      }
                      size="sm"
                    >
                      {rec.priority} PRIORITY
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-medium">{rec.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {rec.problem}
                  </p>
                  <button
                    onClick={() => onNavigate('improver')}
                    className="w-full mt-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
                  >
                    <span>{rec.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launcher Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-900 to-slate-900 text-white shadow-md space-y-4">
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-brand-300">
              Quick Career Tools
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('cover-letter')}
                className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-colors flex items-center space-x-3 text-xs font-semibold"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Generate Tailored Cover Letter</span>
              </button>
              <button
                onClick={() => onNavigate('linkedin')}
                className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-colors flex items-center space-x-3 text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Optimize LinkedIn Headline</span>
              </button>
              <button
                onClick={() => onNavigate('builder')}
                className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-colors flex items-center space-x-3 text-xs font-semibold"
              >
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Export ATS PDF Resume</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULLY VISIBLE PLATFORM PERFORMANCE & SYSTEM ARCHITECTURE MATRIX */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform Performance & System Architecture Matrix</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Enterprise ATS & Telemetry Engine Status
            </h2>
          </div>
          <button
            onClick={() => onNavigate('live-pulse')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all shadow-md flex items-center space-x-2 self-start sm:self-auto"
          >
            <Zap className="w-4 h-4" />
            <span>Open Live Telemetry Pulse</span>
          </button>
        </div>

        {/* 6 Core Architecture Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">1. Document Parsing Node</span>
              <Badge variant="success" size="sm">100% Active</Badge>
            </div>
            <p className="text-[11px] text-slate-400">PDF, Word, Text & JSON AST structural node extraction.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">2. ATS Math Evaluation</span>
              <Badge variant="success" size="sm">100-Pt Matrix</Badge>
            </div>
            <p className="text-[11px] text-slate-400">6-Parameter weighted scoring engine (Formatting, Keywords, Skills).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">3. Job Type Matching Engine</span>
              <Badge variant="brand" size="sm">6 Presets</Badge>
            </div>
            <p className="text-[11px] text-slate-400">Full-Time, Contract, Remote, Executive & Internship keyword presets.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">4. Telemetry Mock Interview</span>
              <Badge variant="brand" size="sm">Webcam + Speech</Badge>
            </div>
            <p className="text-[11px] text-slate-400">Real-time facial tracking, posture audit & dual Web Speech voices.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">5. A4 & LaTeX Export Studio</span>
              <Badge variant="success" size="sm">A4 Standard</Badge>
            </div>
            <p className="text-[11px] text-slate-400">Zero-clip A4 PDF rendering and Overleaf LaTeX source export.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">6. Storage & Security Engine</span>
              <Badge variant="success" size="sm">Protected v2</Badge>
            </div>
            <p className="text-[11px] text-slate-400">Sanitized, versioned local storage with fail-safe error recovery.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
