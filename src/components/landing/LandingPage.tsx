import React, { useState } from 'react';
import {
  FileCheck2,
  Target,
  Sparkles,
  FileCode,
  Kanban,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Lock,
  Star,
  Layers,
  BarChart3
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How is Core ATS Resume Checker different from standard ATS checkers?',
      a: 'Generic resume checkers use naive keyword counting. Core ATS uses an explainable 6-point scoring architecture, semantic requirement mapping, Rezi ATS font standards, and strict non-hallucination bullet intelligence.'
    },
    {
      q: 'Will my resume pass ATS filters at top enterprise companies?',
      a: 'Yes. Our ATS-First templates adhere strictly to parseable font hierarchies, standard header tags, and single-column structural layouts compatible with Workday, Taleo, Greenhouse, and Lever.'
    },
    {
      q: 'Does the AI fabricate fake numbers or achievements?',
      a: 'Never. Core ATS enforces strict anti-hallucination controls. If your bullet lacks metrics, our AI prompts you for genuine outcomes rather than inventing fabricated percentages.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center font-extrabold text-sm shadow-md">
              CORE
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              CORE ATS <span className="text-brand-400 font-semibold text-xs ml-1">RESUME CHECKER</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#comparison" className="hover:text-white transition-colors">Comparison</a>
            <a href="#demo" className="hover:text-white transition-colors">100% Free Access</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg hover:shadow-brand-500/20"
            >
              Analyze My Resume
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-brand-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Core ATS Resume Checker & Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-4xl mx-auto">
            Build a Resume That Gets Read.
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            AI-powered resume analysis that helps you understand ATS compatibility, match your resume to real job descriptions, and improve every section before you apply.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-sm transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center space-x-2"
            >
              <span>Analyze My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>See How It Works</span>
            </a>
          </div>
        </div>

        {/* Live Animated Product Demo Preview */}
        <div id="demo" className="max-w-5xl mx-auto px-6 mt-16 relative z-10">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-brand-950/50 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">core-ats.ai/resume-checker</span>
              </div>
              <Badge variant="brand">LIVE ATS AUDIT SCAN</Badge>
            </div>

            {/* Simulated Live Product Display */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ATS Score</span>
                <div className="text-3xl font-black text-emerald-400">87</div>
                <span className="text-[10px] text-slate-500 font-medium">Pass Rate: 98%</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keyword Match</span>
                <div className="text-3xl font-black text-brand-400">91%</div>
                <span className="text-[10px] text-slate-500 font-medium">Core Terms Matched</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience Match</span>
                <div className="text-3xl font-black text-sky-400">84%</div>
                <span className="text-[10px] text-slate-500 font-medium">Role Relevance</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Formatting</span>
                <div className="text-3xl font-black text-purple-400">96%</div>
                <span className="text-[10px] text-slate-500 font-medium">Readability Clean</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Missing Job Keywords Flagged</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-1 rounded bg-rose-950/60 text-rose-300 text-xs font-mono border border-rose-800/50">Jira</span>
                  <span className="px-2 py-1 rounded bg-rose-950/60 text-rose-300 text-xs font-mono border border-rose-800/50">Agile</span>
                  <span className="px-2 py-1 rounded bg-rose-950/60 text-rose-300 text-xs font-mono border border-rose-800/50">Stakeholder Management</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Recommendation</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  "Add measurable outcomes to your project-management experience."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Core ATS Resume Checker & Career Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};
