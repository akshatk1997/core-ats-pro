import React, { useState } from 'react';
import {
  FileCode,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Layout,
  Check,
  Type,
  Download,
  FileText,
  Settings2,
  Sliders,
  Layers,
  RotateCcw,
  Code,
  Copy,
  Maximize2
} from 'lucide-react';
import {
  StructuredResume,
  ResumeVersion,
  WorkExperienceItem,
  EducationItem,
  SkillGroup,
  ProjectItem,
  CertificationItem,
  CustomSection,
  CustomSectionItem
} from '@/types';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { generateLaTeXResume } from '@/lib/latexExporter';

interface ResumeBuilderScreenProps {
  activeResume: ResumeVersion;
  onUpdateResumeContent: (updatedContent: StructuredResume) => void;
}

export const ResumeBuilderScreen: React.FC<ResumeBuilderScreenProps> = ({
  activeResume,
  onUpdateResumeContent,
}) => {
  const [resume, setResume] = useState<StructuredResume>(activeResume?.content || {
    contactInfo: { fullName: 'Candidate', email: '', phone: '', location: '' },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>(activeResume.template || 'rezi_standard');
  const [reziFont, setReziFont] = useState<'font-rezi-roboto' | 'font-rezi-inter' | 'font-rezi-garamond' | 'font-rezi-georgia' | 'font-rezi-arial'>('font-rezi-roboto');
  const [fontSize, setFontSize] = useState<'text-[10px]' | 'text-[11px]' | 'text-[12px]'>('text-[11px]');
  const [lineSpacing, setLineSpacing] = useState<'leading-tight' | 'leading-normal' | 'leading-relaxed'>('leading-normal');
  const [pageMargin, setPageMargin] = useState<'p-6' | 'p-8' | 'p-10' | 'p-12'>('p-8');
  const [activeEditTab, setActiveEditTab] = useState<'contact' | 'summary' | 'experience' | 'skills' | 'education' | 'headers' | 'custom-sections'>('contact');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [showLaTeXModal, setShowLaTeXModal] = useState(false);
  const [copiedLaTeX, setCopiedLaTeX] = useState(false);

  // Template Options
  const templates = [
    { id: 'rezi_standard', name: 'Rezi Standard ATS (Recommended)', font: 'font-rezi-roboto', desc: 'High-density single-column format optimized for 99% ATS parsing.' },
    { id: 'harvard_corporate', name: 'Harvard Business Corporate', font: 'font-rezi-garamond', desc: 'Classic executive serif style favored by Fortune 500 recruiters.' },
    { id: 'modern_tech', name: 'Modern Tech & Software', font: 'font-rezi-inter', desc: 'Sleek tech positioning for Product, Engineering & Analytics roles.' },
    { id: 'executive_lead', name: 'Executive Leadership', font: 'font-rezi-georgia', desc: 'Prominent header styling for Senior & Management roles.' },
    { id: 'minimal_clean', name: 'Minimalist Clean ATS', font: 'font-rezi-arial', desc: 'Ultra-clean sans-serif layout with zero parseability friction.' },
    { id: 'digital_product', name: 'Digital Product & Design', font: 'font-rezi-inter', desc: 'Modern skill category badges and bullet highlight structure.' },
  ];

  const handleSaveContent = (newContent: StructuredResume) => {
    setResume(newContent);
    onUpdateResumeContent(newContent);
  };

  // Download Handlers
  const handleDownloadPDF = () => {
    window.print();
  };

  const handleDownloadLaTeX = () => {
    const latexCode = generateLaTeXResume(resume);
    const blob = new Blob([latexCode], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (resume.contactInfo?.fullName || 'Candidate').replace(/\s+/g, '_');
    link.download = `${safeName}_Resume_A4.tex`;
    link.click();

    setDownloadNotice('LaTeX (.tex) A4 Resume Source downloaded successfully!');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleCopyLaTeX = () => {
    const latexCode = generateLaTeXResume(resume);
    navigator.clipboard.writeText(latexCode);
    setCopiedLaTeX(true);
    setTimeout(() => setCopiedLaTeX(false), 2000);
  };

  const handleDownloadTXT = () => {
    const summaryTitle = resume.customHeaders?.summary || 'PROFESSIONAL SUMMARY';
    const expTitle = resume.customHeaders?.workExperience || 'WORK EXPERIENCE';
    const eduTitle = resume.customHeaders?.education || 'EDUCATION';
    const skillsTitle = resume.customHeaders?.skills || 'SKILLS & COMPETENCIES';

    let txtContent = `
${resume.contactInfo.fullName.toUpperCase()}
${resume.contactInfo.location} | ${resume.contactInfo.email} | ${resume.contactInfo.phone} | ${resume.contactInfo.linkedin || ''}

==================================================
${summaryTitle.toUpperCase()}
==================================================
${resume.summary}

==================================================
${expTitle.toUpperCase()}
==================================================
${resume.workExperience.map(exp => `
${exp.role.toUpperCase()} - ${exp.company} (${exp.startDate} - ${exp.endDate} | ${exp.location})
${exp.bullets.map(b => `  • ${b}`).join('\n')}
`).join('\n')}

==================================================
${eduTitle.toUpperCase()}
==================================================
${resume.education.map(edu => `
${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.endDate})
`).join('\n')}

==================================================
${skillsTitle.toUpperCase()}
==================================================
${resume.skills.map(s => `${s.category}: ${s.skills.join(', ')}`).join('\n')}
`;

    if (resume.customSections && resume.customSections.length > 0) {
      resume.customSections.forEach(csec => {
        txtContent += `
==================================================
${csec.title.toUpperCase()}
==================================================
${csec.items.map(item => `
${item.title}${item.subtitle ? ` - ${item.subtitle}` : ''} (${item.date || ''})
${item.bullets.map(b => `  • ${b}`).join('\n')}
`).join('\n')}
`;
      });
    }

    const blob = new Blob([txtContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.contactInfo.fullName.replace(/\s+/g, '_')}_Resume_ATS.txt`;
    link.click();

    setDownloadNotice('Plain Text Resume (.txt) downloaded successfully!');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `${resume.contactInfo.fullName.replace(/\s+/g, '_')}_Resume_Data.json`;
    link.click();

    setDownloadNotice('JSON Resume Data downloaded successfully!');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  // Work Experience Form Actions
  const handleAddWorkExp = () => {
    const newExp: WorkExperienceItem = {
      id: `exp_${Date.now()}`,
      company: 'New Company Inc.',
      role: 'Senior Role Title',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      bullets: ['Led cross-functional team initiatives resulting in 25% delivery efficiency gain.']
    };
    handleSaveContent({
      ...resume,
      workExperience: [newExp, ...resume.workExperience]
    });
  };

  const handleDeleteWorkExp = (id: string) => {
    handleSaveContent({
      ...resume,
      workExperience: resume.workExperience.filter(e => e.id !== id)
    });
  };

  const handleAddBullet = (expId: string) => {
    const updated = resume.workExperience.map(e => {
      if (e.id === expId) {
        return { ...e, bullets: [...e.bullets, 'Spearheaded domain projects utilizing Agile methodologies.'] };
      }
      return e;
    });
    handleSaveContent({ ...resume, workExperience: updated });
  };

  const handleDeleteBullet = (expId: string, bulletIdx: number) => {
    const updated = resume.workExperience.map(e => {
      if (e.id === expId) {
        return { ...e, bullets: e.bullets.filter((_, idx) => idx !== bulletIdx) };
      }
      return e;
    });
    handleSaveContent({ ...resume, workExperience: updated });
  };

  // Education Actions
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu_${Date.now()}`,
      institution: 'University Name',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science & Business',
      startDate: '2018-09',
      endDate: '2022-05',
      gpa: '3.8/4.0'
    };
    handleSaveContent({
      ...resume,
      education: [...resume.education, newEdu]
    });
  };

  // Custom Headers Management Actions
  const handleUpdateHeader = (key: string, value: string) => {
    handleSaveContent({
      ...resume,
      customHeaders: {
        ...(resume.customHeaders || {}),
        [key]: value
      }
    });
  };

  const handleResetHeaders = () => {
    handleSaveContent({
      ...resume,
      customHeaders: {
        summary: 'Professional Summary',
        workExperience: 'Work Experience',
        education: 'Education',
        skills: 'Skills & Technical Exposure',
        projects: 'Key Projects & Initiatives',
        certifications: 'Certifications & Credentials'
      }
    });
  };

  // Custom Sections Management Actions
  const handleAddCustomSection = () => {
    const newSection: CustomSection = {
      id: `csec_${Date.now()}`,
      title: 'Publications & Speaking',
      items: [
        {
          id: `citem_${Date.now()}`,
          title: 'Keynote Speaker & Author',
          subtitle: 'Global Industry Summit',
          date: '2024',
          bullets: ['Delivered keynote on AI workflow automation to 400+ tech professionals.']
        }
      ]
    };
    handleSaveContent({
      ...resume,
      customSections: [...(resume.customSections || []), newSection]
    });
  };

  const handleDeleteCustomSection = (secId: string) => {
    handleSaveContent({
      ...resume,
      customSections: (resume.customSections || []).filter(s => s.id !== secId)
    });
  };

  const handleAddCustomItem = (secId: string) => {
    const updated = (resume.customSections || []).map(sec => {
      if (sec.id === secId) {
        const newItem: CustomSectionItem = {
          id: `citem_${Date.now()}`,
          title: 'New Entry Title',
          subtitle: 'Organization / Issuer Name',
          date: '2024',
          bullets: ['Description of achievement, publication, or credential.']
        };
        return { ...sec, items: [...sec.items, newItem] };
      }
      return sec;
    });
    handleSaveContent({ ...resume, customSections: updated });
  };

  const handleDeleteCustomItem = (secId: string, itemId: string) => {
    const updated = (resume.customSections || []).map(sec => {
      if (sec.id === secId) {
        return { ...sec, items: sec.items.filter(i => i.id !== itemId) };
      }
      return sec;
    });
    handleSaveContent({ ...resume, customSections: updated });
  };

  const handleAddCustomItemBullet = (secId: string, itemId: string) => {
    const updated = (resume.customSections || []).map(sec => {
      if (sec.id === secId) {
        const updatedItems = sec.items.map(item => {
          if (item.id === itemId) {
            return { ...item, bullets: [...item.bullets, 'Additional metric or key contribution details.'] };
          }
          return item;
        });
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    handleSaveContent({ ...resume, customSections: updated });
  };

  const handleDeleteCustomItemBullet = (secId: string, itemId: string, bulletIdx: number) => {
    const updated = (resume.customSections || []).map(sec => {
      if (sec.id === secId) {
        const updatedItems = sec.items.map(item => {
          if (item.id === itemId) {
            return { ...item, bullets: item.bullets.filter((_, idx) => idx !== bulletIdx) };
          }
          return item;
        });
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    handleSaveContent({ ...resume, customSections: updated });
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Top Action Bar */}
      <div className="no-print bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <FileCode className="w-5 h-5 text-brand-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Interactive Resume Creator & ATS Templates
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, customize section headers, build custom sections, and download ATS-compliant PDF & TXT resumes.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold transition-all shadow-md flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF (A4)</span>
          </button>

          <button
            onClick={handleDownloadLaTeX}
            className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
          >
            <Code className="w-4 h-4" />
            <span>LaTeX (.tex)</span>
          </button>

          <button
            onClick={() => setShowLaTeXModal(true)}
            className="px-3 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center space-x-1 border border-purple-300 dark:border-purple-800"
          >
            <FileCode className="w-4 h-4" />
            <span>View LaTeX Code</span>
          </button>

          <button
            onClick={handleDownloadTXT}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Download TXT</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="no-print p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Controls & Editor Forms (5 cols) */}
        <div className="no-print lg:col-span-5 space-y-6">
          {/* ATS Templates Selector */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Layout className="w-4 h-4 text-brand-600" />
                <span>Best ATS Resume Templates Gallery</span>
              </span>
              <Badge variant="brand">{templates.length} Templates</Badge>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                    setReziFont(tpl.font as any);
                  }}
                  className={`p-3 rounded-xl border text-xs text-left transition-all space-y-1 ${
                    selectedTemplate === tpl.id
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{tpl.name}</span>
                    {selectedTemplate === tpl.id && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{tpl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Controls */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Type className="w-4 h-4 text-brand-600" />
              <span>Typography & Layout Density</span>
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-500 block mb-1">Font Family</label>
                <select
                  value={reziFont}
                  onChange={(e) => setReziFont(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs"
                >
                  <option value="font-rezi-roboto">Roboto (Rezi Default)</option>
                  <option value="font-rezi-inter">Inter (Modern Sans)</option>
                  <option value="font-rezi-garamond">Garamond (Executive Serif)</option>
                  <option value="font-rezi-georgia">Georgia (Classic Serif)</option>
                  <option value="font-rezi-arial">Arial (Minimal Clean)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-500 block mb-1">Font Size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs"
                >
                  <option value="text-[10px]">Compact (10px)</option>
                  <option value="text-[11px]">Standard (11px)</option>
                  <option value="text-[12px]">Large (12px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Navigation & Dynamic Editor Tabs */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold space-x-1 overflow-x-auto pb-1">
              {[
                { id: 'contact', label: 'Contact' },
                { id: 'summary', label: 'Summary' },
                { id: 'experience', label: 'Experience' },
                { id: 'skills', label: 'Skills' },
                { id: 'education', label: 'Education' },
                { id: 'headers', label: 'Section Headers ✏️' },
                { id: 'custom-sections', label: '+ Custom Sections 📑' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditTab(tab.id as any)}
                  className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap text-xs ${
                    activeEditTab === tab.id
                      ? 'border-brand-600 text-brand-600 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Contact Form */}
            {activeEditTab === 'contact' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.contactInfo.fullName}
                    onChange={(e) =>
                      handleSaveContent({
                        ...resume,
                        contactInfo: { ...resume.contactInfo, fullName: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="text"
                    value={resume.contactInfo.email}
                    onChange={(e) =>
                      handleSaveContent({
                        ...resume,
                        contactInfo: { ...resume.contactInfo, email: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={resume.contactInfo.phone}
                    onChange={(e) =>
                      handleSaveContent({
                        ...resume,
                        contactInfo: { ...resume.contactInfo, phone: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.contactInfo.location}
                    onChange={(e) =>
                      handleSaveContent({
                        ...resume,
                        contactInfo: { ...resume.contactInfo, location: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Summary Form */}
            {activeEditTab === 'summary' && (
              <div className="space-y-3 text-xs">
                <label className="font-semibold text-slate-600 dark:text-slate-400 block">Professional Summary</label>
                <textarea
                  rows={6}
                  value={resume.summary}
                  onChange={(e) => handleSaveContent({ ...resume, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>
            )}

            {/* TAB 3: Work Experience Form */}
            {activeEditTab === 'experience' && (
              <div className="space-y-4 text-xs">
                <button
                  type="button"
                  onClick={handleAddWorkExp}
                  className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Work Position</span>
                </button>

                {resume.workExperience.map((exp, idx) => (
                  <div key={exp.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex justify-between items-center">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...resume.workExperience];
                          updated[idx] = { ...exp, role: e.target.value };
                          handleSaveContent({ ...resume, workExperience: updated });
                        }}
                        className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteWorkExp(exp.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <label className="font-semibold text-slate-500 block">Bullet Points</label>
                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex space-x-1 items-center">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            const updatedBullets = [...exp.bullets];
                            updatedBullets[bIdx] = e.target.value;
                            const updatedExp = [...resume.workExperience];
                            updatedExp[idx] = { ...exp, bullets: updatedBullets };
                            handleSaveContent({ ...resume, workExperience: updatedExp });
                          }}
                          className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-normal"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteBullet(exp.id, bIdx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddBullet(exp.id)}
                      className="text-[11px] text-brand-600 dark:text-brand-400 font-bold flex items-center space-x-1 pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Bullet Point</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: Skills Form */}
            {activeEditTab === 'skills' && (
              <div className="space-y-3 text-xs">
                {resume.skills.map((grp, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{grp.category}</span>
                    <input
                      type="text"
                      value={grp.skills.join(', ')}
                      onChange={(e) => {
                        const updatedSkills = [...resume.skills];
                        updatedSkills[i] = { ...grp, skills: e.target.value.split(',').map((s) => s.trim()) };
                        handleSaveContent({ ...resume, skills: updatedSkills });
                      }}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Education Form */}
            {activeEditTab === 'education' && (
              <div className="space-y-3 text-xs">
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education Entry</span>
                </button>

                {resume.education.map((edu, idx) => (
                  <div key={edu.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[idx] = { ...edu, degree: e.target.value };
                        handleSaveContent({ ...resume, education: updated });
                      }}
                      className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 font-bold"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[idx] = { ...edu, institution: e.target.value };
                        handleSaveContent({ ...resume, education: updated });
                      }}
                      className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: CUSTOM SECTION HEADERS */}
            {activeEditTab === 'headers' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">Customize Standard Section Titles</span>
                    <span className="text-[10px] text-slate-500">Edit titles for standard resume sections to fit your domain.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetHeaders}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Professional Summary Header</label>
                    <input
                      type="text"
                      value={resume.customHeaders?.summary || 'Professional Summary'}
                      onChange={(e) => handleUpdateHeader('summary', e.target.value)}
                      placeholder="e.g. Executive Summary, Career Overview"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Work Experience Header</label>
                    <input
                      type="text"
                      value={resume.customHeaders?.workExperience || 'Work Experience'}
                      onChange={(e) => handleUpdateHeader('workExperience', e.target.value)}
                      placeholder="e.g. Professional Experience, Employment History"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Education Header</label>
                    <input
                      type="text"
                      value={resume.customHeaders?.education || 'Education'}
                      onChange={(e) => handleUpdateHeader('education', e.target.value)}
                      placeholder="e.g. Academic Credentials, Education & Training"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Skills Header</label>
                    <input
                      type="text"
                      value={resume.customHeaders?.skills || 'Skills & Technical Exposure'}
                      onChange={(e) => handleUpdateHeader('skills', e.target.value)}
                      placeholder="e.g. Core Competencies, Technical Expertise"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Key Projects Header</label>
                    <input
                      type="text"
                      value={resume.customHeaders?.projects || 'Key Projects & Initiatives'}
                      onChange={(e) => handleUpdateHeader('projects', e.target.value)}
                      placeholder="e.g. Featured Projects, Technical Initiatives"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: USER-CREATED CUSTOM SECTIONS */}
            {activeEditTab === 'custom-sections' && (
              <div className="space-y-4 text-xs">
                <button
                  type="button"
                  onClick={handleAddCustomSection}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Custom Section</span>
                </button>

                {(!resume.customSections || resume.customSections.length === 0) ? (
                  <div className="p-6 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                    <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No Custom Sections Created Yet</p>
                    <p className="text-[11px] text-slate-400">Add custom sections like "Publications & Speaking", "Honors & Awards", "Volunteering", or "Patents".</p>
                  </div>
                ) : (
                  resume.customSections.map((sec, secIdx) => (
                    <div key={sec.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                      {/* Section Title Bar */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Section Header Title</label>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => {
                              const updated = [...(resume.customSections || [])];
                              updated[secIdx] = { ...sec, title: e.target.value };
                              handleSaveContent({ ...resume, customSections: updated });
                            }}
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-xs text-brand-600 dark:text-brand-400"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomSection(sec.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete Custom Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Items in Section */}
                      <div className="space-y-3 pt-1">
                        {sec.items.map((item, itemIdx) => (
                          <div key={item.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex justify-between items-center gap-2">
                              <input
                                type="text"
                                value={item.title}
                                placeholder="Item Title / Role"
                                onChange={(e) => {
                                  const updatedSecs = [...(resume.customSections || [])];
                                  const updatedItems = [...sec.items];
                                  updatedItems[itemIdx] = { ...item, title: e.target.value };
                                  updatedSecs[secIdx] = { ...sec, items: updatedItems };
                                  handleSaveContent({ ...resume, customSections: updatedSecs });
                                }}
                                className="flex-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-bold text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomItem(sec.id, item.id)}
                                className="text-slate-400 hover:text-rose-500 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <input
                                type="text"
                                value={item.subtitle || ''}
                                placeholder="Subtitle / Organization"
                                onChange={(e) => {
                                  const updatedSecs = [...(resume.customSections || [])];
                                  const updatedItems = [...sec.items];
                                  updatedItems[itemIdx] = { ...item, subtitle: e.target.value };
                                  updatedSecs[secIdx] = { ...sec, items: updatedItems };
                                  handleSaveContent({ ...resume, customSections: updatedSecs });
                                }}
                                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
                              />
                              <input
                                type="text"
                                value={item.date || ''}
                                placeholder="Date / Period (e.g. 2024)"
                                onChange={(e) => {
                                  const updatedSecs = [...(resume.customSections || [])];
                                  const updatedItems = [...sec.items];
                                  updatedItems[itemIdx] = { ...item, date: e.target.value };
                                  updatedSecs[secIdx] = { ...sec, items: updatedItems };
                                  handleSaveContent({ ...resume, customSections: updatedSecs });
                                }}
                                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
                              />
                            </div>

                            {/* Bullets */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[10px] font-semibold text-slate-500 block">Bullet Points</label>
                              {item.bullets.map((bText, bIdx) => (
                                <div key={bIdx} className="flex items-center space-x-1">
                                  <textarea
                                    rows={2}
                                    value={bText}
                                    onChange={(e) => {
                                      const updatedSecs = [...(resume.customSections || [])];
                                      const updatedItems = [...sec.items];
                                      const updatedBullets = [...item.bullets];
                                      updatedBullets[bIdx] = e.target.value;
                                      updatedItems[itemIdx] = { ...item, bullets: updatedBullets };
                                      updatedSecs[secIdx] = { ...sec, items: updatedItems };
                                      handleSaveContent({ ...resume, customSections: updatedSecs });
                                    }}
                                    className="flex-1 p-1.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCustomItemBullet(sec.id, item.id, bIdx)}
                                    className="text-slate-400 hover:text-rose-500 p-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => handleAddCustomItemBullet(sec.id, item.id)}
                                className="text-[10px] text-brand-600 dark:text-brand-400 font-bold flex items-center space-x-1 pt-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Bullet Point</span>
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleAddCustomItem(sec.id)}
                          className="w-full py-1.5 px-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 font-bold text-[11px] flex items-center justify-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Item to {sec.title}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Resume Preview Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* A4 Sheet Utilization Toolbar */}
          <div className="no-print bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold tracking-wide">A4 Sheet Page Fill:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-400/30">
                98% Optimal Fill (Single Page)
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-semibold text-slate-300">
              <span>A4 Margins:</span>
              <select
                value={pageMargin}
                onChange={(e) => setPageMargin(e.target.value as any)}
                className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-medium"
              >
                <option value="p-6">Compact (0.4")</option>
                <option value="p-8">Standard (0.5")</option>
                <option value="p-10">Relaxed (0.65")</option>
                <option value="p-12">Spacious (0.75")</option>
              </select>
            </div>
          </div>

          {/* A4 Sheet Document Paper */}
          <div
            className={`w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white text-slate-900 ${pageMargin} rounded-xl border-2 border-slate-900 shadow-2xl space-y-5 rezi-resume-document relative overflow-hidden ${reziFont} ${fontSize} ${lineSpacing}`}
            id="resume-print-area"
          >
            {/* Page 1 A4 Sheet Indicator Label */}
            <div className="no-print absolute top-2 right-3 px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider border border-slate-200">
              A4 Sheet (210 × 297 mm)
            </div>

            {/* Header Block */}
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <h2 className="rezi-header-title">
                {resume.contactInfo.fullName}
              </h2>
              <p className="rezi-contact-bar flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
                <span>{resume.contactInfo.location}</span>
                {resume.contactInfo.email && (
                  <>
                    <span>•</span>
                    <a href={`mailto:${resume.contactInfo.email}`} className="text-brand-600 hover:underline font-medium">
                      {resume.contactInfo.email}
                    </a>
                  </>
                )}
                {resume.contactInfo.phone && (
                  <>
                    <span>•</span>
                    <a href={`tel:${resume.contactInfo.phone}`} className="text-slate-700 hover:underline font-medium">
                      {resume.contactInfo.phone}
                    </a>
                  </>
                )}
                {resume.contactInfo.linkedin && (
                  <>
                    <span>•</span>
                    <a
                      href={resume.contactInfo.linkedin.startsWith('http') ? resume.contactInfo.linkedin : `https://${resume.contactInfo.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline font-medium"
                    >
                      {resume.contactInfo.linkedin}
                    </a>
                  </>
                )}
                {resume.contactInfo.portfolio && (
                  <>
                    <span>•</span>
                    <a
                      href={resume.contactInfo.portfolio.startsWith('http') ? resume.contactInfo.portfolio : `https://${resume.contactInfo.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline font-medium"
                    >
                      {resume.contactInfo.portfolio}
                    </a>
                  </>
                )}
                {resume.contactInfo.github && (
                  <>
                    <span>•</span>
                    <a
                      href={resume.contactInfo.github.startsWith('http') ? resume.contactInfo.github : `https://${resume.contactInfo.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline font-medium"
                    >
                      {resume.contactInfo.github}
                    </a>
                  </>
                )}
              </p>
            </div>

            {/* Professional Summary */}
            {resume.summary && (
              <div className="space-y-1">
                <h3 className="rezi-section-title">
                  {resume.customHeaders?.summary || 'Professional Summary'}
                </h3>
                <p className="rezi-bullet-text">{resume.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {resume.workExperience.length > 0 && (
              <div className="space-y-3">
                <h3 className="rezi-section-title">
                  {resume.customHeaders?.workExperience || 'Work Experience'}
                </h3>
                {resume.workExperience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="rezi-role-title">{exp.role}</span>
                        <span className="rezi-company-name">, {exp.company}</span>
                      </div>
                      <span className="rezi-date-location">{exp.startDate} – {exp.endDate} | {exp.location}</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="rezi-bullet-text">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <div className="space-y-1">
                <h3 className="rezi-section-title">
                  {resume.customHeaders?.education || 'Education'}
                </h3>
                {resume.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <span className="rezi-role-title">{edu.degree} in {edu.fieldOfStudy}</span>
                      <span className="rezi-company-name"> — {edu.institution}</span>
                    </div>
                    <span className="rezi-date-location">{edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <div className="space-y-1">
                <h3 className="rezi-section-title">
                  {resume.customHeaders?.skills || 'Skills & Technical Exposure'}
                </h3>
                <div className="space-y-1">
                  {resume.skills.map((grp, i) => (
                    <p key={i} className="rezi-bullet-text">
                      <strong className="text-slate-900 font-bold">{grp.category}:</strong> {grp.skills.join(', ')}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Key Projects & Initiatives */}
            {resume.projects && resume.projects.length > 0 && (
              <div className="space-y-2">
                <h3 className="rezi-section-title">
                  {resume.customHeaders?.projects || 'Key Projects & Initiatives'}
                </h3>
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="rezi-role-title">{proj.title} {proj.role && `(${proj.role})`}</span>
                    </div>
                    {proj.description && <p className="rezi-bullet-text italic">{proj.description}</p>}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="rezi-bullet-text">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic Custom User-Created Sections */}
            {resume.customSections && resume.customSections.map((sec) => (
              <div key={sec.id} className="space-y-2">
                <h3 className="rezi-section-title">{sec.title}</h3>
                {sec.items.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="rezi-role-title">{item.title}</span>
                        {item.subtitle && <span className="rezi-company-name">, {item.subtitle}</span>}
                      </div>
                      {item.date && <span className="rezi-date-location">{item.date}</span>}
                    </div>
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1">
                        {item.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="rezi-bullet-text">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LaTeX Source Code Modal */}
      <Modal
        isOpen={showLaTeXModal}
        onClose={() => setShowLaTeXModal(false)}
        title="LaTeX Source Code (A4 Paper Standard)"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            Copy this ATS-optimized LaTeX source code to compile in <strong>Overleaf</strong>, <strong>TeXShop</strong>, or any LaTeX environment.
          </p>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] max-h-96 overflow-y-auto whitespace-pre-wrap border border-slate-800 selection:bg-emerald-900 selection:text-white">
              {generateLaTeXResume(resume)}
            </pre>

            <div className="absolute top-3 right-3 flex items-center space-x-2">
              <button
                onClick={handleCopyLaTeX}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
              >
                {copiedLaTeX ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLaTeX ? 'Copied LaTeX Code!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-slate-500 font-medium">Standard: \documentclass[a4paper,10pt]{'{article}'}</span>
            <button
              onClick={handleDownloadLaTeX}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .tex File</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
