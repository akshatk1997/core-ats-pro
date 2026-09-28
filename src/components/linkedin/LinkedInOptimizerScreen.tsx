import React, { useState } from 'react';
import { Linkedin, Sparkles, Copy, Check, ShieldCheck, RefreshCw, Zap, Target, UserCheck } from 'lucide-react';
import { LinkedInAnalysis, ResumeVersion, JobDescription } from '@/types';
import { sampleLinkedInAnalysis } from '@/lib/mockData';
import { Badge } from '../ui/Badge';

interface LinkedInOptimizerScreenProps {
  activeResume?: ResumeVersion;
  activeJob?: JobDescription;
}

export const LinkedInOptimizerScreen: React.FC<LinkedInOptimizerScreenProps> = ({
  activeResume,
  activeJob,
}) => {
  const allSkills = activeResume?.content?.skills?.flatMap(s => s.skills || []) || ['Agile', 'Jira', 'SQL', 'Stakeholder Management', 'Power BI'];
  
  const defaultHeadline = activeResume?.content?.contactInfo?.fullName && activeResume?.targetRole
    ? `${activeResume.targetRole} | ${activeResume.content.workExperience?.[0]?.company || 'Enterprise Solutions'} | ${allSkills.slice(0, 3).join(' • ')}`
    : sampleLinkedInAnalysis.currentHeadline;

  const targetRoleName = activeJob?.title || activeResume?.targetRole || 'Professional Role';
  const targetCompany = activeJob?.company || 'Target Organization';

  const topSkillsStr = allSkills.length > 0 ? allSkills.slice(0, 3).join(' • ') : 'Strategy • Leadership • Execution';
  const altSkillsStr = allSkills.length > 3 ? allSkills.slice(3, 6).join(' • ') : topSkillsStr;

  const [analysis, setAnalysis] = useState<LinkedInAnalysis>({
    ...sampleLinkedInAnalysis,
    currentHeadline: defaultHeadline,
    headlineScore: activeResume ? Math.min(96, Math.round(75 + activeResume.atsScore * 0.2)) : 84,
    suggestedHeadlines: [
      `${targetRoleName} | ${topSkillsStr} | ${activeResume?.content.workExperience[0]?.company || 'Enterprise Leader'}`,
      `${targetRoleName} | Expertise in ${allSkills.slice(0, 2).join(' & ') || 'Strategic Execution'} | Performance Driven`,
      `${targetRoleName} @ ${targetCompany} | ${altSkillsStr}`
    ],
    suggestedAbout: activeResume
      ? `Results-driven ${targetRoleName} with a proven track record in ${allSkills.slice(0, 4).join(', ')}. Demonstrated success at ${activeResume?.content.workExperience[0]?.company || 'leading organizations'}, driving key technical deliverables, optimizing cross-functional processes, and achieving scalable outcomes.\n\nPassionate about aligning operational execution with core business objectives. Skilled in ${allSkills.slice(0, 5).join(', ')}.\n\nCore Competencies: ${allSkills.join(' • ')}.`
      : sampleLinkedInAnalysis.suggestedAbout
  });

  const [customHeadline, setCustomHeadline] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copiedHeadline, setCopiedHeadline] = useState<number | null>(null);
  const [copiedAbout, setCopiedAbout] = useState(false);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedHeadline(idx);
    setTimeout(() => setCopiedHeadline(null), 2000);
  };

  const handleCopyAbout = () => {
    navigator.clipboard.writeText(analysis.suggestedAbout);
    setCopiedAbout(true);
    setTimeout(() => setCopiedAbout(false), 2000);
  };

  const handleCustomScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHeadline.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      const matchScore = Math.min(98, Math.max(62, customHeadline.length * 1.5 + (customHeadline.toLowerCase().includes(targetRoleName.toLowerCase()) ? 20 : 5)));
      setAnalysis({
        ...analysis,
        currentHeadline: customHeadline,
        headlineScore: Math.round(matchScore),
        suggestedHeadlines: [
          `${customHeadline} | ${topSkillsStr}`,
          `${targetRoleName} | ${customHeadline} | Key Results`,
          `${customHeadline} @ ${targetCompany} | ${altSkillsStr}`
        ]
      });
      setIsScanning(false);
      setCustomHeadline('');
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <Linkedin className="w-3.5 h-3.5 text-sky-400" />
            <span>LinkedIn Recruiter SEO & Executive Positioning</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            LinkedIn Profile Keyword Optimizer for {targetRoleName}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
            Optimize your public profile headline, about summary, and experience section keywords to rank top-of-search in executive recruiter feeds.
          </p>
        </div>

        <div className="flex items-center space-x-2 z-10">
          <Badge variant="brand" className="px-3 py-1 text-xs">
            <Target className="w-3.5 h-3.5 mr-1" />
            <span>Target Role: {targetRoleName}</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Custom Headline Input & Headline Suggestions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Custom Input Form */}
          <form onSubmit={handleCustomScan} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-sky-500" />
              <span>Analyze & Score Custom LinkedIn Headline</span>
            </h3>
            <input
              type="text"
              placeholder="Paste your current LinkedIn headline..."
              value={customHeadline}
              onChange={(e) => setCustomHeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={isScanning || !customHeadline.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Scan & Optimize Headline</span>}
            </button>
          </form>

          {/* Headline Results */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Headline Positioning Audit
              </h3>
              <Badge variant={analysis.headlineScore >= 80 ? 'success' : 'warning'}>
                Score: {analysis.headlineScore}/100
              </Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Inspected Active Headline:</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold">"{analysis.currentHeadline}"</p>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                High-Converting Suggested Headlines:
              </span>
              {analysis.suggestedHeadlines.map((h, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 hover:border-sky-500/40 transition-all">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">{h}</p>
                  <button
                    onClick={() => handleCopy(h, i)}
                    className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs"
                  >
                    {copiedHeadline === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copiedHeadline === i ? 'Copied to Clipboard!' : 'Copy Headline'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: About Section & Missing Keywords (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Executive "About" Section Generator</span>
              </h3>
              <button
                onClick={handleCopyAbout}
                className="py-1 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs"
              >
                {copiedAbout ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAbout ? 'Copied About Section' : 'Copy Summary'}</span>
              </button>
            </div>

            <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              {analysis.suggestedAbout}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Recruiter Search Keyword Checklist</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Include these high-frequency search keywords in your LinkedIn profile skills section:
            </p>
            <div className="flex flex-wrap gap-2">
              {(activeJob?.requiredSkills || ['Agile', 'Jira', 'SQL', 'Stakeholder Management', 'Power BI', 'Scrum', 'Risk Management', 'Budget Burn Rate']).map((sk, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
