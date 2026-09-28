import React, { useState } from 'react';
import {
  Compass,
  Zap,
  FileCheck2,
  Target,
  FileCode,
  Sparkles,
  Video,
  Activity,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  BarChart3,
  Sliders,
  Cpu,
  Eye,
  Lock,
  Globe,
  TrendingUp,
  Briefcase,
  Play,
  Check,
  Code,
  Upload,
  Kanban,
  Smile,
  FileText,
  Rocket
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { UserProfile } from '@/types';

interface PlatformIntroScreenProps {
  user?: UserProfile;
  onEnterWorkspace?: () => void;
  onNavigate?: (tab: any) => void;
}

export const PlatformIntroScreen: React.FC<PlatformIntroScreenProps> = ({
  user,
  onEnterWorkspace,
  onNavigate,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleLaunch = (tab: string = 'dashboard') => {
    if (onEnterWorkspace) {
      onEnterWorkspace();
    }
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const workflowSteps = [
    {
      step: 1,
      title: 'Document Ingestion',
      subtitle: 'Multi-format Parsing',
      icon: Upload,
      color: 'brand',
      desc: 'Parses .PDF, .DOCX, .TXT, and .JSON resume files with 100% structural fidelity.',
      highlights: ['PDF & Word Node Extraction', 'Zero Sample Pollution', 'Custom Header Detection']
    },
    {
      step: 2,
      title: '6-Parameter Scan',
      subtitle: 'ATS Math Formula',
      icon: FileCheck2,
      color: 'emerald',
      desc: 'Evaluates formatting, keyword density, and experience alignment on a 100-point scale.',
      highlights: ['Formatting (25%)', 'Keywords (25%)', 'Requirements (20%)', 'Experience (15%)', 'Structure (10%)', 'Quality (5%)']
    },
    {
      step: 3,
      title: 'Job Type Matching',
      subtitle: 'Role Positioning',
      icon: Target,
      color: 'sky',
      desc: 'Injects specific requirements for Full-Time, Contract, Remote, Executive, and Internship roles.',
      highlights: ['6 Job Type Presets', 'Focus Area Alignment', '1-Click Keyword Injection']
    },
    {
      step: 4,
      title: 'AI Mock Interview',
      subtitle: 'Facial Telemetry Studio',
      icon: Video,
      color: 'purple',
      desc: 'Real-time webcam tracking for eye-contact %, smile anchor score, posture, and female/male voices.',
      highlights: ['Dual Web Speech Voices', 'Camera Telemetry Overlay', 'STAR Answer Evaluator']
    },
    {
      step: 5,
      title: 'A4 & LaTeX Export',
      subtitle: 'Rezi Print Standard',
      icon: Code,
      color: 'amber',
      desc: 'Generates un-clipped A4 PDFs and clean LaTeX source code (.tex) for Overleaf compilation.',
      highlights: ['A4 Paper Standard (210×297mm)', 'LaTeX Code Viewer & Modal', 'Custom Sections Manager']
    },
    {
      step: 6,
      title: 'Application Pipeline',
      subtitle: 'Kanban & Telemetry',
      icon: Kanban,
      color: 'rose',
      desc: 'Tracks interview dates, salary ranges, and live telemetry audit events in real-time.',
      highlights: ['Drag-and-Drop Pipeline', 'Salary & Date Tracker', 'Real-Time System Telemetry']
    }
  ];

  return (
    <div className="space-y-12 pb-20 animate-fade-in max-w-7xl mx-auto selection:bg-brand-500 selection:text-white">
      {/* Top Floating Glass Action Bar */}
      <div className="p-4 sm:p-5 rounded-2xl glass-card border border-white/60 dark:border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-6 z-30 backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90">
        <div className="flex items-center space-x-3">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400/50" />
          <div>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider block">
              Core ATS Resume Checker &amp; Intelligence Platform
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
              Interactive System Architecture &amp; Live Workflow Infographics
            </span>
          </div>
        </div>

        <button
          onClick={() => handleLaunch('dashboard')}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-sky-500 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-black text-xs transition-all shadow-xl shadow-brand-500/30 flex items-center justify-center space-x-2 active:scale-95 border border-white/20"
        >
          <Rocket className="w-4 h-4 animate-bounce text-amber-300" />
          <span>Enter Workspace Studio 🚀</span>
        </button>
      </div>

      {/* Premium Gradient Hero Banner Section with Ultra-High Visibility & Visual Telemetry Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white border border-slate-700/80 shadow-2xl relative overflow-hidden glass-card backdrop-blur-3xl">
        <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-gradient-to-br from-brand-500/25 via-sky-500/20 to-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[130px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Title, High-Contrast Description & Action Launchers */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-slate-950/90 border border-brand-400/60 shadow-lg shadow-brand-500/20 text-white text-xs sm:text-sm font-black uppercase tracking-widest">
              <Cpu className="w-4.5 h-4.5 text-brand-400 animate-pulse" />
              <span className="text-white drop-shadow-md">Interactive Visual Architecture &amp; System Onboarding</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-2xl">
                Built for Serious Professionals Targetting{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent font-black drop-shadow-md">
                  Top 1% Roles.
                </span>
              </h1>

              <div className="text-slate-100 font-semibold text-base sm:text-lg leading-relaxed bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-white/20 backdrop-blur-2xl shadow-xl space-y-2">
                <p className="text-white drop-shadow-md leading-relaxed">
                  Understand how enterprise Applicant Tracking Systems (ATS) scan, parse, and score your resume. Practice live video &amp; voice AI interviews with real-time facial telemetry, generate Overleaf-compatible LaTeX source code, and track your career pipeline—all in one place.
                </p>
              </div>
            </div>

            {/* 4-Card Visual Feature Counter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-brand-500/40 backdrop-blur-md space-y-1 shadow-md">
                <span className="text-xl font-black text-brand-400 block num-tabular">6-Point</span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Math ATS Formula</span>
                <span className="text-[10px] text-slate-300 block">Formatting &amp; Keywords</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md space-y-1 shadow-md">
                <span className="text-xl font-black text-emerald-400 block num-tabular">A4 + .tex</span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Rezi Standard</span>
                <span className="text-[10px] text-slate-300 block">Overleaf LaTeX Export</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-md space-y-1 shadow-md">
                <span className="text-xl font-black text-purple-400 block num-tabular">Dual Voice</span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider block">AI Mock Interview</span>
                <span className="text-[10px] text-slate-300 block">Camera Eye Telemetry</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/40 backdrop-blur-md space-y-1 shadow-md">
                <span className="text-xl font-black text-sky-400 block num-tabular">6 Presets</span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Job Matcher</span>
                <span className="text-[10px] text-slate-300 block">Full-time, Remote, Exec</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleLaunch('dashboard')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-sky-500 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-black text-xs transition-all shadow-xl shadow-brand-500/30 flex items-center space-x-2.5 active:scale-95 border border-white/30"
              >
                <span>Enter Workspace Studio 🚀</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => handleLaunch('analyzer')}
                className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs transition-all backdrop-blur-md flex items-center space-x-2 shadow-md"
              >
                <FileCheck2 className="w-4 h-4 text-brand-400" />
                <span>Launch Live ATS Scanner</span>
              </button>

              <button
                onClick={() => handleLaunch('mock-interview')}
                className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-md"
              >
                <Video className="w-4 h-4 text-emerald-400" />
                <span>Start AI Live Mock Interview</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual System Architecture & Telemetry Visual Card */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-white">System Architecture Preview</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">100% OPERATIONAL</span>
            </div>

            {/* Visual Score & Telemetry Meters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">ATS Score Gauge</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">87 / 100</div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full w-[87%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">Webcam Telemetry</span>
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs font-bold text-purple-300">Eye-Contact: 98%</div>
                <div className="text-[10px] text-slate-400">Posture: <span className="text-emerald-400 font-bold">Optimal Anchor</span></div>
              </div>
            </div>

            {/* Visual LaTeX Code Snippet Preview */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans border-b border-slate-800 pb-1.5">
                <span className="font-bold text-amber-400 flex items-center space-x-1">
                  <Code className="w-3.5 h-3.5" />
                  <span>Rezi LaTeX Engine (.tex)</span>
                </span>
                <span>Overleaf Ready</span>
              </div>
              <p className="text-emerald-300 font-mono">{"\\documentclass[a4paper,10pt]{article}"}</p>
              <p className="text-slate-400 font-mono">{"\\usepackage[margin=0.5in]{geometry}"}</p>
              <p className="text-sky-300 font-mono">{"\\begin{document} % ATS High-Density Format"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* VISUAL ARCHITECTURE PIPELINE NODE MAP */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">
              SYSTEM ARCHITECTURE FLOWCHART
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              End-to-End Visual System Pipeline Node Map
            </h2>
          </div>
          <button
            onClick={() => handleLaunch('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-xs transition-all shadow-md flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>Enter Workspace Studio 🚀</span>
          </button>
        </div>

        {/* 6 Visual Nodes connected in a sequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {workflowSteps.map((s) => {
            const IconComp = s.icon;
            const isSelected = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 relative overflow-hidden ${
                  isSelected
                    ? 'border-brand-400 bg-slate-850 ring-2 ring-brand-500/30 shadow-lg'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${isSelected ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {s.step}
                  </span>
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{s.title}</h4>
                  <p className="text-[10px] text-slate-400">{s.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        {(() => {
          const currentStepObj = workflowSteps.find(s => s.step === activeStep) || workflowSteps[0];
          const tabs = ['my-resumes', 'analyzer', 'job-matcher', 'mock-interview', 'builder', 'tracker'];
          const targetTab = tabs[(currentStepObj.step - 1) % tabs.length];

          return (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4 animate-fade-in shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-brand-500 text-white font-black text-sm flex items-center justify-center">
                    {currentStepObj.step}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Step {currentStepObj.step}: {currentStepObj.title} ({currentStepObj.subtitle})
                    </h3>
                    <p className="text-xs text-slate-300">{currentStepObj.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunch(targetTab)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-xs transition-all shadow-md flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <span>Launch Step {currentStepObj.step} in Workspace 🚀</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {(currentStepObj.highlights || []).map((h, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* LAYERED INFOGRAPHICS SECTIONS */}

      {/* LAYER 1: Multi-Format Document Ingestion */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-extrabold uppercase tracking-wider">
            LAYER 1 INFOGRAPHIC
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            Multi-Format Stream Ingestion &amp; Parsed Node Extraction
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-bold">.PDF FILE</span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">PDF Document Streams</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Extracts text layers, position titles, dates, bullet structures, and custom sections without structural distortion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-600 border border-sky-500/20 text-[10px] font-bold">.DOCX FILE</span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Microsoft Word Docs</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Parses Word XML tags, table contents, paragraph margins, and bullet list item hierarchies.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold">.TXT FILE</span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Plain Text Streams</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Processes raw ASCII / UTF-8 text strings, identifying email, phone, and standard section headers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[10px] font-bold">.JSON DATA</span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Structured JSON Schema</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Imports and exports 100% structured JSON schemas containing custom headers and user-created custom sections.
            </p>
          </div>
        </div>
      </div>

      {/* LAYER 2: Deterministic 6-Point ATS Calculation Engine */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            LAYER 2 INFOGRAPHIC
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            Mathematical 6-Parameter ATS Evaluation Formula
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-300">1. Formatting &amp; Readability</h3>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">25 Pts</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Evaluates parseable header tags, single-column structural layout, and standard ATS fonts (Inter, Roboto, Georgia).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-brand-700 dark:text-brand-300">2. Keyword Alignment</h3>
              <span className="text-sm font-black text-brand-600 dark:text-brand-400">25 Pts</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Exact and semantic match density against required hard skills, tools, and technical domain terms in the job post.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-sky-700 dark:text-sky-300">3. Job Requirement Alignment</h3>
              <span className="text-sm font-black text-sky-600 dark:text-sky-400">20 Pts</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Verifies total experience years, qualification matches, and explicit responsibility coverage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-purple-700 dark:text-purple-300">4. Experience Relevance</h3>
              <span className="text-sm font-black text-purple-600 dark:text-purple-400">15 Pts</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Evaluates title progression, company context, and direct domain experience alignment for target roles.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-amber-700 dark:text-amber-300">5. Structure &amp; Completeness</h3>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400">10 Pts</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Checks presence of mandatory section headers: Professional Summary, Work Experience, Education, Skills, Projects.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-rose-700 dark:text-rose-300">6. Content Quality &amp; Verbs</h3>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">5 Pts</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Penalizes weak passive verbs ("Worked on") and rewards strong action verbs ("Orchestrated", "Spearheaded") with quantitative metrics.
            </p>
          </div>
        </div>
      </div>

      {/* LAYER 3: Job Role & Job Type Requirements Presets */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-extrabold uppercase tracking-wider">
            LAYER 3 INFOGRAPHIC
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            6 Specialized Job Type Requirements Presets
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <Badge variant="brand">Full-Time Enterprise</Badge>
            <p className="text-slate-600 dark:text-slate-300">Sprint predictability, Jira velocity, budget burn rate, stakeholder matrices.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <Badge variant="brand">Contract / Freelance</Badge>
            <p className="text-slate-600 dark:text-slate-300">Immediate time-to-value, SLA adherence, turn-key technical execution, scope boundaries.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <Badge variant="brand">Remote / Distributed</Badge>
            <p className="text-slate-600 dark:text-slate-300">Asynchronous communication, Notion &amp; Loom documentation, Slack triage, time-zone autonomy.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <Badge variant="brand">Executive / C-Suite</Badge>
            <p className="text-slate-600 dark:text-slate-300">P&amp;L management, EBITDA growth %, board governance, CapEx/OpEx, strategic roadmaps.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <Badge variant="brand">Internship / Early Career</Badge>
            <p className="text-slate-600 dark:text-slate-300">Technical fundamentals, academic &amp; bootcamp project execution, problem-solving eagerness.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <Badge variant="brand">Part-Time / Advisory</Badge>
            <p className="text-slate-600 dark:text-slate-300">Architectural reviews, technical auditing, board advisory, mentorship &amp; coaching.</p>
          </div>
        </div>
      </div>

      {/* LAYER 4: AI Mock Interview Studio with Multimodal Camera Telemetry */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold uppercase tracking-wider">
            LAYER 4 INFOGRAPHIC
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            Multimodal Camera Telemetry &amp; Dual Voice AI Interview Studio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <Smile className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-purple-900 dark:text-purple-200">Female &amp; Male Voice Engine</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Web Speech API voice engine with natural female/male voices, pitch, rate controls, and audio visualization waveforms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-purple-900 dark:text-purple-200">Facial Expression Telemetry</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Real-time webcam telemetry measuring Eye-Contact Ratio (%), Smile Anchor Score, Blink Cadence, and Executive Posture.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-purple-900 dark:text-purple-200">Multi-Source Question Matrix</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Generates questions from target JD, resume work history, case study scenarios, C-suite conflicts, and custom bulk prompts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-purple-900 dark:text-purple-200">STAR Answer Evaluator</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Evaluates spoken/typed candidate answers across Situation, Task, Action, and Result with downloadable transcripts.
            </p>
          </div>
        </div>
      </div>

      {/* LAYER 5: Rezi Standard A4 Resume Builder & LaTeX Source Generator */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            LAYER 5 INFOGRAPHIC
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            A4 Sheet Paper Formatting &amp; LaTeX Source Export (.tex)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <Code className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-amber-900 dark:text-amber-200">LaTeX Source Export (.tex)</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Generates clean, ATS-compliant LaTeX code (<code className="bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded font-mono text-[11px]">{"\\documentclass[a4paper,10pt]{article}"}</code>) with a 1-click Overleaf code viewer modal.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-amber-900 dark:text-amber-200">A4 Paper Sheet Utilization</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Formatted to strict 210 × 297 mm A4 sheet boundaries with margin adjustment (0.4" to 0.75") and live 98% page-fill gauge.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <Sliders className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-amber-900 dark:text-amber-200">Custom Section Headers Manager</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Customize standard section header titles and build unlimited custom sections (Patents, Publications, Volunteering, Speaking).
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER ENTER WORKSPACE CALL TO ACTION */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600 via-sky-600 to-emerald-600 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Launch Your High-Impact Application?
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 font-medium">
            Step into the workspace studio to analyze resumes, practice AI interviews, and generate A4 &amp; LaTeX resumes.
          </p>
        </div>

        <button
          onClick={() => handleLaunch('dashboard')}
          className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-sm transition-all shadow-xl flex items-center space-x-2.5 flex-shrink-0 border border-slate-700"
        >
          <Rocket className="w-5 h-5 text-emerald-400" />
          <span>Enter Workspace Studio 🚀</span>
        </button>
      </div>
    </div>
  );
};
