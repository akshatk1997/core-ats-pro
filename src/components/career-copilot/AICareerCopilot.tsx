import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, MessageSquare, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CopilotMessage, ResumeVersion, JobDescription } from '@/types';
import { calculateATSScore } from '@/lib/atsEngine';
import { calculateKeywordFrequencies } from '@/lib/jobMatcher';

interface AICareerCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  activeResume: ResumeVersion;
  targetJob?: JobDescription;
}

export const AICareerCopilot: React.FC<AICareerCopilotProps> = ({
  isOpen,
  onClose,
  activeResume,
  targetJob,
}) => {
  const defaultJob: JobDescription = targetJob || {
    id: 'jd_default',
    title: 'Senior Project Manager',
    company: 'Target Enterprise',
    rawText: 'Project management Jira Agile Scrum Stakeholder management Risk management Excel Power BI SQL',
    requiredSkills: ['Project Management', 'Jira', 'Agile', 'Scrum', 'Stakeholder Management', 'Risk Management'],
    preferredSkills: ['PMP Certification', 'SQL'],
    responsibilities: ['Drive sprint delivery', 'Manage cross-functional stakeholders'],
    qualifications: ['Bachelor degree', '3+ years experience'],
    toolsAndTech: ['Jira', 'Confluence', 'Excel'],
    softSkills: ['Leadership', 'Communication'],
    actionVerbs: ['Lead', 'Spearhead'],
    createdDate: '2026-09-20'
  };

  // Real live source calculations
  const resume = activeResume.content;
  const { breakdown, issues } = calculateATSScore(resume, defaultJob);
  const frequencies = calculateKeywordFrequencies(resume, defaultJob);

  const matchedSkills = frequencies.filter(f => f.status === 'matched');
  const missingSkills = frequencies.filter(f => f.status === 'missing');

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello ${resume.contactInfo.fullName || 'Candidate'}! I am your AI Career Copilot, operating on live real-time analysis of your active resume "${activeResume.name}" (Score: ${breakdown.overall}/100) and target role "${defaultJob.title}" at ${defaultJob.company}. Ask me anything about your source file, missing keywords, ATS fixes, or interview preparation!`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: `Why is my live ATS score ${breakdown.overall}?`, action: 'why_score' },
        { label: `What keywords am I missing? (${missingSkills.length})`, action: 'missing_keywords' },
        { label: 'Generate tailored summary for this role', action: 'tailor_summary' },
        { label: 'Prep me with live interview questions', action: 'interview_prep' }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate dynamic live-tracked response based on exact source file and scan data
    setTimeout(() => {
      let botReply = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('score') || qLower.includes('why') || qLower.includes('breakdown')) {
        botReply = `📊 Live Deterministic ATS Breakdown for "${activeResume.name}":
• Overall Score: ${breakdown.overall}/100
• Formatting & Readability: ${breakdown.formattingReadability}/25
• Keyword Alignment: ${breakdown.keywordAlignment}/25
• Job Requirement Alignment: ${breakdown.jobRequirementAlignment}/20
• Experience Relevance: ${breakdown.experienceRelevance}/15
• Structure & Completeness: ${breakdown.structureCompleteness}/10
• Content Quality & Verbs: ${breakdown.contentQuality}/5

${issues.length > 0 ? `⚠️ Priority Issues Identified (${issues.length}):\n${issues.slice(0, 2).map((iss, i) => `${i + 1}. ${iss.title}: ${iss.suggestion}`).join('\n')}` : '✅ Pristine formatting and section structure!'}`;

      } else if (qLower.includes('missing') || qLower.includes('keyword') || qLower.includes('skill')) {
        if (missingSkills.length === 0) {
          botReply = `🎯 Outstanding! You have matched 100% of the key required skills (${matchedSkills.map(s => s.keyword).join(', ')}) for ${defaultJob.title} at ${defaultJob.company}.`;
        } else {
          botReply = `🔍 Live Keyword Density Analysis for ${defaultJob.title} at ${defaultJob.company}:
Matched Skills (${matchedSkills.length}): ${matchedSkills.slice(0, 5).map(s => s.keyword).join(', ')}

❌ Missing Key Terms (${missingSkills.length}): ${missingSkills.map(s => `"${s.keyword}"`).join(', ')}.

💡 Action Tip: Incorporate "${missingSkills.slice(0, 3).map(s => s.keyword).join('", "')}" into your Work Experience bullets or Skills section to gain up to +${Math.min(15, missingSkills.length * 3)} ATS points.`;
        }

      } else if (qLower.includes('summary') || qLower.includes('tailor') || qLower.includes('profile')) {
        const topExp = resume.workExperience[0];
        const missingText = missingSkills.slice(0, 2).map(s => s.keyword).join(' and ');
        botReply = `📝 Here is an AI-tailored Professional Summary built directly from your source file and target role (${defaultJob.title}):

"Results-driven ${topExp?.role || activeResume.targetRole} with proven expertise leading cross-functional teams at ${topExp?.company || 'enterprise organizations'}. Skilled in ${resume.skills[0]?.skills.slice(0, 3).join(', ') || 'strategic execution'}${missingText ? ` and ${missingText}` : ''}. Demonstrated track record delivering scalable outcomes. Seeking to drive impact as ${defaultJob.title} at ${defaultJob.company}."`;

      } else if (qLower.includes('interview') || qLower.includes('prep') || qLower.includes('question')) {
        const topExp = resume.workExperience[0];
        botReply = `🎙️ Live AI Mock Interview Questions tailored for ${defaultJob.title} at ${defaultJob.company}:

1. "At ${topExp?.company || 'your previous company'}, you served as ${topExp?.role || 'Project Manager'}. Walk me through how you managed sprint deliverables when scope changed."
2. "The role at ${defaultJob.company} requires proficiency in ${defaultJob.requiredSkills.slice(0, 2).join(' and ')}. How have you utilized these tools in real-world scenarios?"
3. "Describe a situation where you had to align technical teams with non-technical stakeholders to meet tight deadlines."`;

      } else if (qLower.includes('experience') || qLower.includes('work') || qLower.includes('bullet')) {
        const topExp = resume.workExperience[0];
        botReply = `💼 Source File Experience Audit:
You have ${resume.workExperience.length} work position(s) listed:
${resume.workExperience.map((w, i) => `${i + 1}. ${w.role} at ${w.company} (${w.startDate} - ${w.endDate}) - ${w.bullets.length} bullets`).join('\n')}

${topExp ? `Top Bullet Suggestion for ${topExp.company}:
Original: "${topExp.bullets[0] || ''}"
Enhanced: "${topExp.bullets[0]?.replace(/^(\w+)/, '$1 and spearheaded cross-functional delivery') || ''}"` : ''}`;

      } else if (qLower.includes('custom') || qLower.includes('section') || qLower.includes('header')) {
        botReply = `📑 Source File Custom Sections Audit:
Standard Headers Customized: ${resume.customHeaders ? Object.keys(resume.customHeaders).length : 0} section(s).
User Custom Sections: ${resume.customSections?.length || 0} custom section(s) (${resume.customSections?.map(c => c.title).join(', ') || 'None'}).

You can add or rename custom headers in the "Section Headers ✏️" and "+ Custom Sections 📑" tabs in the Resume Builder.`;

      } else {
        botReply = `🤖 Source File Intelligence Context:
• Candidate Name: ${resume.contactInfo.fullName}
• Active Resume: "${activeResume.name}" (${resume.workExperience.length} positions, ${resume.skills.length} skill groups)
• Live ATS Compatibility: ${breakdown.overall}/100 vs ${defaultJob.title} (${defaultJob.company})
• Key Matched Terms: ${matchedSkills.slice(0, 4).map(s => s.keyword).join(', ')}

How can I help you customize your resume bullets, analyze target job requirements, or refine section headers?`;
      }

      const botMsg: CopilotMessage = {
        id: `b_${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slide-in font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
              <span>AI Career Copilot</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-extrabold uppercase">
                LIVE TELEMETRY
              </span>
            </h3>
            <p className="text-[10px] text-slate-300">
              Source: {activeResume.name} • Score: {breakdown.overall}/100
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col space-y-1.5 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[90%] leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none shadow-md font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm font-normal'
              }`}
            >
              {m.text}
            </div>

            {m.suggestedActions && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {m.suggestedActions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(act.label)}
                    className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-[11px] font-bold border border-brand-200/80 dark:border-brand-800 transition-all shadow-sm flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-brand-500" />
                    <span>{act.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Input */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask AI Copilot about your source resume or JD..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 font-medium"
          />
          <button
            type="submit"
            className="p-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
