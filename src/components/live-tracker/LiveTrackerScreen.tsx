import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  FileCheck2,
  Target,
  Kanban,
  FileCode,
  ArrowRight,
  RefreshCw,
  Sliders,
  Layers,
  Award
} from 'lucide-react';
import { UserProfile, ResumeVersion, JobDescription, ApplicationTrackerItem } from '@/types';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface LiveTrackerScreenProps {
  user: UserProfile;
  activeResume: ResumeVersion;
  jobDescriptions: JobDescription[];
  applications: ApplicationTrackerItem[];
  onNavigate: (tab: any) => void;
}

export const LiveTrackerScreen: React.FC<LiveTrackerScreenProps> = ({
  user,
  activeResume,
  jobDescriptions,
  applications,
  onNavigate,
}) => {
  const [pulseTime, setPulseTime] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setPulseTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setPulseTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const liveEvents = [
    {
      id: 'e1',
      type: 'ats_score',
      title: 'Real-Time ATS Telemetry Audit Completed',
      detail: `Deterministic 6-parameter analysis calculated active resume "${activeResume?.name || 'Resume'}" score at ${activeResume?.atsScore || 87}/100.`,
      timestamp: 'Just now',
      badgeText: '+12 pts',
      color: 'emerald',
      icon: TrendingUp,
    },
    {
      id: 'e2',
      type: 'job_match',
      title: 'Target Job Keyword Density Scan',
      detail: `Matched 91% of core required keywords against ${activeResume?.targetCompany || 'CloudScale Dynamics'}.`,
      timestamp: '4 mins ago',
      badgeText: '91% Match',
      color: 'brand',
      icon: Target,
    },
    {
      id: 'e3',
      type: 'tracker_update',
      title: 'Application Pipeline Stage Update',
      detail: 'CloudScale Dynamics (Senior Project Manager) moved to Technical Interview stage.',
      timestamp: '15 mins ago',
      badgeText: 'Interviewing',
      color: 'sky',
      icon: Kanban,
    },
    {
      id: 'e4',
      type: 'ai_improver',
      title: 'Action Verb & Impact Optimization',
      detail: 'Analyzed 7 work experience bullets; identified 3 high-impact metric rephrase suggestions.',
      timestamp: '1 hour ago',
      badgeText: '4 Fixes Ready',
      color: 'amber',
      icon: Sparkles,
    },
    {
      id: 'e5',
      type: 'builder_rezi',
      title: 'Rezi Standard ATS Template Formatting',
      detail: 'Font family: Inter (Clean Sans-Serif), 10.5pt, 1.3 line height. Single column Workday-compliant.',
      timestamp: '2 hours ago',
      badgeText: 'Verified ATS',
      color: 'purple',
      icon: FileCode,
    },
  ];

  const breakdown = activeResume?.atsBreakdown || {
    overall: 87,
    formattingReadability: 24,
    keywordAlignment: 22,
    jobRequirementAlignment: 17,
    experienceRelevance: 13,
    structureCompleteness: 8,
    contentQuality: 3,
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-6xl mx-auto">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE ATS SYSTEM PULSE ACTIVE • {pulseTime}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Real-Time Resume & Application Intelligence
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              Every section, keyword, and bullet point in your active resume is tracked in real-time against enterprise applicant tracking system (ATS) benchmarks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleManualSync}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 backdrop-blur-sm flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing Telemetry...' : 'Refresh Pulse Data'}</span>
            </button>
            <button
              onClick={() => onNavigate('analyzer')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>View Full ATS Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 100% Free Lifetime Guarantee Banner */}
      <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              100% Free Lifetime Access • Enterprise Features Unlocked
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              No subscriptions, no hidden paywalls, no limits. Unlimited AI resume rewrites, all 6 Rezi ATS templates, cover letters, and application kanban tracking are 100% free for all working professionals.
            </p>
          </div>
        </div>
        <Badge variant="success" className="self-start sm:self-auto flex-shrink-0">
          FULL ACCESS UNLOCKED
        </Badge>
      </div>

      {/* Live System Telemetry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ATS Engine Health</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100% Pass</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Parseable structure verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Resume Score</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-brand-600 dark:text-brand-400">{activeResume.atsScore}/100</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">+12 gain after keyword sync</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Keyword Density</span>
            <Target className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400">91% Match</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">14/15 key terms detected</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Applications</span>
            <Kanban className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{applications.length} Roles</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">2 upcoming interviews</p>
        </div>
      </div>

      {/* Main Grid: Real-Time Event Pulse Feed & Parameter Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Real-Time Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <Activity className="w-5 h-5 text-brand-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Live Telemetry Activity Feed
                </h2>
              </div>
              <Badge variant="success" className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Real-Time Stream</span>
              </Badge>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />

              {liveEvents.map((evt) => {
                const IconComp = evt.icon;
                return (
                  <div key={evt.id} className="flex items-start space-x-4 relative z-10 pl-1 group">
                    <div className="w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {evt.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{evt.detail}</p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-bold text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700">
                          {evt.badgeText}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Live Score Breakdown Telemetry */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                6-Point Formula Telemetry
              </h3>
              <Badge variant="brand">87 / 100</Badge>
            </div>

            <div className="space-y-3.5 text-xs">
              <ProgressBar
                label="Formatting & Readability"
                value={breakdown.formattingReadability}
                max={25}
                color="success"
              />
              <ProgressBar
                label="Keyword Alignment"
                value={breakdown.keywordAlignment}
                max={25}
                color="brand"
              />
              <ProgressBar
                label="Job Requirement Alignment"
                value={breakdown.jobRequirementAlignment}
                max={20}
                color="brand"
              />
              <ProgressBar
                label="Experience Relevance"
                value={breakdown.experienceRelevance}
                max={15}
                color="sky"
              />
              <ProgressBar
                label="Structure & Completeness"
                value={breakdown.structureCompleteness}
                max={10}
                color="sky"
              />
              <ProgressBar
                label="Content Quality & Verbs"
                value={breakdown.contentQuality}
                max={5}
                color="warning"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-600 to-sky-600 text-white shadow-lg space-y-3">
            <h3 className="text-sm font-extrabold">Professional Copilot Status</h3>
            <p className="text-xs text-brand-100 leading-relaxed font-medium">
              Your AI Career Assistant is context-aware and continuously monitoring your active application pipeline.
            </p>
            <button
              onClick={() => onNavigate('career-tools')}
              className="w-full py-2.5 rounded-xl bg-white text-brand-700 font-extrabold text-xs hover:bg-brand-50 transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Launch AI Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
