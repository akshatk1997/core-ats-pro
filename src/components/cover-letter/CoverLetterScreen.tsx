import React, { useState } from 'react';
import { Mail, Sparkles, Copy, Download, RefreshCw, Check, Plus, Kanban } from 'lucide-react';
import { CoverLetter, ResumeVersion, JobDescription, ApplicationTrackerItem } from '@/types';
import { sampleCoverLetter } from '@/lib/mockData';
import { Badge } from '../ui/Badge';

interface CoverLetterScreenProps {
  activeResume: ResumeVersion;
  jobDescriptions: JobDescription[];
  activeJob?: JobDescription;
  onSaveToTracker?: (app: ApplicationTrackerItem) => void;
  onNavigateToTracker?: () => void;
}

export const CoverLetterScreen: React.FC<CoverLetterScreenProps> = ({
  activeResume,
  jobDescriptions,
  activeJob,
  onSaveToTracker,
  onNavigateToTracker,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(activeJob?.id || jobDescriptions[0]?.id || '');
  const [tone, setTone] = useState<'Professional' | 'Confident' | 'Modern' | 'Technical'>('Confident');
  const [coverLetter, setCoverLetter] = useState<CoverLetter>(sampleCoverLetter);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToTrackerNotice, setSavedToTrackerNotice] = useState(false);

  const selectedJob = jobDescriptions.find((j) => j.id === selectedJobId) || activeJob || jobDescriptions[0];

  const defaultJob: JobDescription = {
    id: 'jd_default',
    title: 'Target Position',
    company: 'Target Organization',
    rawText: '',
    requiredSkills: ['Project Management', 'Agile', 'Leadership'],
    preferredSkills: [],
    responsibilities: [],
    qualifications: [],
    toolsAndTech: [],
    softSkills: [],
    actionVerbs: [],
    createdDate: ''
  };
  const targetJobObj = selectedJob || defaultJob;

  const generateCoverLetterText = () => {
    const topExp = activeResume?.content?.workExperience?.[0];
    const topEdu = activeResume?.content?.education?.[0];
    const candidateSkills = (activeResume?.content?.skills || []).flatMap(s => s.skills || []).slice(0, 4).join(', ');
    const fullName = activeResume?.content?.contactInfo?.fullName || 'Candidate';
    const reqSkills = (targetJobObj.requiredSkills || []).length > 0 ? targetJobObj.requiredSkills.slice(0, 3).join(', ') : 'key technical skills';

    const introParagraph = `Dear Hiring Committee at ${targetJobObj.company},

I am writing to express my strong enthusiasm for the ${targetJobObj.title} position. With a solid professional background in ${activeResume?.targetRole || targetJobObj.title}, including my position as ${topExp?.role || 'a core contributor'} at ${topExp?.company || 'leading organizations'}, I am eager to bring my expertise in ${reqSkills} to ${targetJobObj.company}.`;

    const bodyParagraph1 = topExp
      ? `At ${topExp.company}, I ${topExp.bullets?.[0] ? topExp.bullets[0].replace(/^[A-Z]/, c => c.toLowerCase()) : `directed high-impact deliverables as ${topExp.role}`}. My operational approach directly mirrors ${targetJobObj.company}'s focus on excellence, scale, and reliable execution.`
      : `Throughout my career, I have driven key technical initiatives, establishing streamlined workflows and delivering on strategic objectives within tight deadlines.`;

    const bodyParagraph2 = topEdu
      ? `Furthermore, my educational background (${topEdu.degree} in ${topEdu.fieldOfStudy} from ${topEdu.institution}) along with technical proficiency in ${candidateSkills || reqSkills} enables me to deliver immediate value.`
      : `Additionally, my technical proficiency in ${candidateSkills || reqSkills} provides a strong foundation for managing complex technical projects and aligning cross-functional partners.`;

    const closingParagraph = `I would welcome the opportunity to discuss how my experience and technical background align with ${targetJobObj.company}'s goals. Thank you for your time and consideration.

Sincerely,
${fullName}`;

    return `${introParagraph}\n\n${bodyParagraph1}\n\n${bodyParagraph2}\n\n${closingParagraph}`;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setCoverLetter({
        id: `cl_${Date.now()}`,
        resumeId: activeResume.id,
        jobTitle: selectedJob.title,
        companyName: selectedJob.company,
        tone: tone,
        createdAt: new Date().toISOString().split('T')[0],
        content: generateCoverLetterText()
      });
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${selectedJob.company.replace(/\s+/g, '_')}.txt`;
    link.click();
  };

  const handleSaveToTracker = () => {
    if (onSaveToTracker) {
      const newApp: ApplicationTrackerItem = {
        id: `app_${Date.now()}`,
        company: selectedJob.company,
        role: selectedJob.title,
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
        resumeVersionId: activeResume.id,
        notes: `Cover letter generated with ${tone} tone.`,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      onSaveToTracker(newApp);
      setSavedToTrackerNotice(true);
      setTimeout(() => setSavedToTrackerNotice(false), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Mail className="w-5 h-5 text-brand-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              AI Tailored Cover Letter Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate high-converting, company-specific cover letters using your uploaded resume context.
          </p>
        </div>
      </div>

      {savedToTrackerNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Application for {selectedJob.company} saved directly to your Application Tracker!</span>
          </div>
          {onNavigateToTracker && (
            <button
              onClick={onNavigateToTracker}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 underline flex items-center space-x-1"
            >
              <Kanban className="w-3.5 h-3.5 inline mr-1" />
              <span>View in Tracker →</span>
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Left Controls (5 cols), Right Generated Letter (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Panel */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Target Job & Tone Configuration
            </h3>

            {/* Select Target Job */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Select Target Job Profile
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none"
              >
                {jobDescriptions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} @ {j.company}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Tone */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Tone of Voice
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Confident', 'Professional', 'Modern', 'Technical'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      tone === t
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Cover Letter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
            <div className="flex items-center space-x-2">
              <Badge variant="brand">{coverLetter.tone} Tone</Badge>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {coverLetter.jobTitle} @ {coverLetter.companyName}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveToTracker}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold border border-emerald-200/60 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Tracker</span>
              </button>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Download TXT"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            {coverLetter.content}
          </div>
        </div>
      </div>
    </div>
  );
};
