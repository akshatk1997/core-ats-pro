import { StructuredResume, JobDescription, JobMatchResult } from '@/types';
import { sampleStructuredResume, sampleJobDescription } from './mockData';

export interface KeywordFrequency {
  keyword: string;
  countInResume: number;
  countInJob: number;
  category: 'hard_skill' | 'soft_skill' | 'tool' | 'qualification';
  status: 'matched' | 'missing' | 'overused';
}

export interface DeepCriteriaItem {
  keyword: string;
  category: 'hard_skill' | 'tool' | 'soft_skill' | 'qualification' | 'verb';
  importance: 'Must Have' | 'Preferred' | 'Nice to Have';
  status: 'matched' | 'missing' | 'overused';
  countInResume: number;
  countInJob: number;
  recommendation: string;
}

export interface DeepCriteriaAnalysis {
  totalCriteria: number;
  coveredCriteria: number;
  missingCriteria: number;
  hardSkillsCovered: number;
  hardSkillsTotal: number;
  toolsCovered: number;
  toolsTotal: number;
  softSkillsCovered: number;
  softSkillsTotal: number;
  items: DeepCriteriaItem[];
}

export function calculateKeywordFrequencies(
  resume: StructuredResume,
  jobDescription: JobDescription
): KeywordFrequency[] {
  const resumeText = JSON.stringify(resume || {}).toLowerCase();
  const jobText = (jobDescription?.rawText || '').toLowerCase();

  const reqSkills = jobDescription?.requiredSkills || [];
  const prefSkills = jobDescription?.preferredSkills || [];
  const tools = jobDescription?.toolsAndTech || [];
  const soft = jobDescription?.softSkills || [];

  const allKeywords = [
    ...reqSkills.map(s => ({ name: s, cat: 'hard_skill' as const })),
    ...prefSkills.map(s => ({ name: s, cat: 'hard_skill' as const })),
    ...tools.map(s => ({ name: s, cat: 'tool' as const })),
    ...soft.map(s => ({ name: s, cat: 'soft_skill' as const })),
  ];

  // Remove duplicates
  const uniqueMap = new Map<string, 'hard_skill' | 'soft_skill' | 'tool' | 'qualification'>();
  allKeywords.forEach(k => {
    if (k.name) uniqueMap.set(k.name, k.cat);
  });

  const frequencies: KeywordFrequency[] = [];

  uniqueMap.forEach((category, kw) => {
    const regex = new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    const resumeMatches = (resumeText.match(regex) || []).length;
    const jobMatches = (jobText.match(regex) || []).length || 1;

    let status: 'matched' | 'missing' | 'overused' = 'missing';
    if (resumeMatches > 0 && resumeMatches <= 8) status = 'matched';
    else if (resumeMatches > 8) status = 'overused';

    frequencies.push({
      keyword: kw,
      countInResume: resumeMatches,
      countInJob: jobMatches,
      category,
      status,
    });
  });

  return frequencies;
}

export function analyzeDeepJdCriteria(
  resume: StructuredResume,
  jobDescription: JobDescription
): DeepCriteriaAnalysis {
  const resumeText = JSON.stringify(resume || {}).toLowerCase();
  const jobText = (jobDescription?.rawText || '').toLowerCase();

  const reqSkills = jobDescription?.requiredSkills || [];
  const prefSkills = jobDescription?.preferredSkills || [];
  const tools = jobDescription?.toolsAndTech || [];
  const soft = jobDescription?.softSkills || [];
  const verbs = jobDescription?.actionVerbs || [];

  const rawList: { name: string; cat: 'hard_skill' | 'tool' | 'soft_skill' | 'qualification' | 'verb'; importance: 'Must Have' | 'Preferred' | 'Nice to Have' }[] = [
    ...reqSkills.map(s => ({ name: s, cat: 'hard_skill' as const, importance: 'Must Have' as const })),
    ...prefSkills.map(s => ({ name: s, cat: 'hard_skill' as const, importance: 'Preferred' as const })),
    ...tools.map(s => ({ name: s, cat: 'tool' as const, importance: 'Must Have' as const })),
    ...soft.map(s => ({ name: s, cat: 'soft_skill' as const, importance: 'Nice to Have' as const })),
    ...verbs.map(s => ({ name: s, cat: 'verb' as const, importance: 'Preferred' as const })),
  ];

  const items: DeepCriteriaItem[] = [];
  let coveredCount = 0;
  let hardCovered = 0, hardTotal = 0;
  let toolsCovered = 0, toolsTotal = 0;
  let softCovered = 0, softTotal = 0;

  const seen = new Set<string>();

  rawList.forEach(entry => {
    if (seen.has(entry.name.toLowerCase())) return;
    seen.add(entry.name.toLowerCase());

    const regex = new RegExp(entry.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    const resumeMatches = (resumeText.match(regex) || []).length;
    const jobMatches = (jobText.match(regex) || []).length || 1;

    let status: 'matched' | 'missing' | 'overused' = 'missing';
    if (resumeMatches > 0 && resumeMatches <= 8) {
      status = 'matched';
      coveredCount++;
    } else if (resumeMatches > 8) {
      status = 'overused';
      coveredCount++;
    }

    if (entry.cat === 'hard_skill') {
      hardTotal++;
      if (status !== 'missing') hardCovered++;
    } else if (entry.cat === 'tool') {
      toolsTotal++;
      if (status !== 'missing') toolsCovered++;
    } else if (entry.cat === 'soft_skill') {
      softTotal++;
      if (status !== 'missing') softCovered++;
    }

    let rec = '';
    if (status === 'missing') {
      rec = `Add "${entry.name}" to your Work Experience bullet points or Skills section to cover this ${entry.importance} criterion.`;
    } else if (status === 'overused') {
      rec = `Keyword "${entry.name}" appears ${resumeMatches} times. Consider varying with synonyms to avoid over-stuffing.`;
    } else {
      rec = `Properly covered in your resume (${resumeMatches} occurrence${resumeMatches > 1 ? 's' : ''}).`;
    }

    items.push({
      keyword: entry.name,
      category: entry.cat,
      importance: entry.importance,
      status,
      countInResume: resumeMatches,
      countInJob: jobMatches,
      recommendation: rec,
    });
  });

  return {
    totalCriteria: items.length,
    coveredCriteria: coveredCount,
    missingCriteria: items.length - coveredCount,
    hardSkillsCovered: hardCovered,
    hardSkillsTotal: hardTotal,
    toolsCovered,
    toolsTotal,
    softSkillsCovered: softCovered,
    softSkillsTotal: softTotal,
    items,
  };
}

export function matchResumeToJob(
  resume: StructuredResume,
  jobDescription: JobDescription
): JobMatchResult {
  const resumeObj = resume || sampleStructuredResume;
  const jobObj = jobDescription || sampleJobDescription;

  const resumeText = JSON.stringify(resumeObj).toLowerCase();
  
  const candidateSkills = (resumeObj.skills || []).flatMap(group => (group?.skills || []).map(s => (s || '').toLowerCase()));
  const workBullets = (resumeObj.workExperience || []).flatMap(w => (w?.bullets || []).map(b => (b || '').toLowerCase()));
  
  const strongMatches: string[] = [];
  const partialMatches: string[] = [];
  const missingRequirements: string[] = [];
  
  const reqSkills = jobObj.requiredSkills || [];
  const responsibilities = jobObj.responsibilities || [];

  reqSkills.forEach(req => {
    if (!req) return;
    const reqLower = req.toLowerCase();
    const exactSkillMatch = candidateSkills.some(cs => cs.includes(reqLower) || reqLower.includes(cs));
    const textMatch = resumeText.includes(reqLower);

    if (exactSkillMatch) {
      strongMatches.push(req);
    } else if (textMatch) {
      partialMatches.push(req);
    } else {
      missingRequirements.push(req);
    }
  });

  const totalReq = reqSkills.length || 1;
  const keywordMatch = Math.round(((strongMatches.length + partialMatches.length * 0.5) / totalReq) * 100);
  const skillMatch = Math.round((strongMatches.length / totalReq) * 100);
  
  let matchedResponsibilities = 0;
  responsibilities.forEach(resp => {
    if (!resp) return;
    const keyTerms = resp.toLowerCase().split(' ').filter(w => w.length > 4);
    const hasMatch = workBullets.some(b => keyTerms.some(term => b.includes(term)));
    if (hasMatch) matchedResponsibilities++;
  });

  const respCount = responsibilities.length || 1;
  const responsibilityMatch = Math.round((matchedResponsibilities / respCount) * 100);
  const experienceMatch = Math.round((responsibilityMatch * 0.6) + (skillMatch * 0.4));
  const educationMatch = (resumeObj.education || []).length > 0 ? 100 : 60;

  const overallMatch = Math.round(
    keywordMatch * 0.35 +
    skillMatch * 0.25 +
    experienceMatch * 0.25 +
    responsibilityMatch * 0.15
  );

  const recommendations: string[] = [];
  if (missingRequirements.length > 0) {
    recommendations.push(
      `Add missing core terms (${missingRequirements.slice(0, 3).join(', ')}) to your experience bullets if you have relevant exposure.`
    );
  }
  if (partialMatches.length > 0) {
    recommendations.push(
      `Promote partially matched skills (${partialMatches.slice(0, 2).join(', ')}) into your primary Technical Skills section.`
    );
  }
  recommendations.push(
    `Ensure your professional summary highlights your suitability for a ${jobObj.title || 'Target'} role at ${jobObj.company || 'Target Organization'}.`
  );

  return {
    overallMatch: Math.min(100, Math.max(0, overallMatch)),
    keywordMatch,
    skillMatch,
    experienceMatch,
    responsibilityMatch,
    educationMatch,
    strongMatches,
    partialMatches,
    missingRequirements,
    transferableSkills: candidateSkills.slice(0, 3).map(s => s.toUpperCase()),
    recommendations,
  };
}

export function parseRawJobDescription(rawText: string, title: string = 'Target Role', company: string = 'Company'): JobDescription {
  const text = rawText.toLowerCase();
  
  const skillDictionary = [
    // Project & Product Management
    'project management', 'product management', 'agile', 'scrum', 'kanban', 'waterfall', 'pmp', 'prince2',
    'jira', 'confluence', 'trello', 'asana', 'productboard', 'slite', 'linear', 'notion', 'sprint planning',
    'stakeholder management', 'risk management', 'budget allocation', 'scope management', 'vendor management',
    // Data & Analytics
    'sql', 'excel', 'power bi', 'tableau', 'looker', 'python', 'r', 'data analysis', 'data science', 'etl',
    'snowflake', 'bigquery', 'spark', 'airflow', 'a/b testing', 'google analytics', 'amplitude',
    // Software & Engineering
    'react', 'next.js', 'typescript', 'javascript', 'node.js', 'express', 'aws', 'azure', 'gcp', 'docker',
    'kubernetes', 'terraform', 'ci/cd', 'git', 'github', 'gitlab', 'rest api', 'graphql', 'microservices',
    'system design', 'machine learning', 'ai', 'llm',
    // Business & Marketing
    'crm', 'salesforce', 'hubspot', 'seo', 'sem', 'digital marketing', 'content strategy', 'lead generation',
    'financial modeling', 'sap', 'oracle', 'budgeting', 'forecasting', 'compliance', 'operations',
    // UI/UX & Design
    'figma', 'sketch', 'adobe xd', 'user research', 'wireframing', 'ui/ux', 'prototyping',
    // Soft Skills & Leadership
    'cross-functional leadership', 'executive communication', 'conflict resolution', 'problem solving',
    'strategic thinking', 'mentorship', 'team leadership', 'presentation skills'
  ];

  const extractedSkills = skillDictionary.filter(kw => text.includes(kw));

  const requiredSkills = extractedSkills.length > 0
    ? extractedSkills.slice(0, 10).map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    : ['Project Management', 'Agile / Scrum', 'Stakeholder Management', 'Data Analysis', 'Cross-Functional Leadership'];

  const preferredSkills = extractedSkills.length > 5
    ? extractedSkills.slice(5, 12).map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    : ['PMP Certification', 'Power BI', 'SQL', 'Jira Automation'];

  const toolsAndTech = extractedSkills.filter(s =>
    ['jira', 'confluence', 'excel', 'power bi', 'tableau', 'sql', 'python', 'react', 'figma', 'salesforce', 'aws', 'docker', 'trello', 'asana'].includes(s)
  ).map(s => s.toUpperCase());

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const responsibilities = lines.filter(l =>
    l.startsWith('-') || l.startsWith('•') || l.toLowerCase().includes('lead') || l.toLowerCase().includes('manage') || l.toLowerCase().includes('drive') || l.toLowerCase().includes('develop')
  ).slice(0, 6);

  return {
    id: `jd_${Date.now()}`,
    title,
    company,
    rawText,
    requiredSkills,
    preferredSkills,
    responsibilities: responsibilities.length > 0
      ? responsibilities.map(r => r.replace(/^[-•]\s*/, ''))
      : [
          'Lead cross-functional teams to execute strategic project deliverables on schedule.',
          'Manage stakeholder communication and align project milestones with business objectives.',
          'Track team velocity, mitigate operational risks, and optimize budget allocation.'
        ],
    qualifications: [
      'Bachelor degree in Business, Computer Science, Engineering, or equivalent experience',
      '3+ years of progressive professional experience in domain role'
    ],
    toolsAndTech: toolsAndTech.length > 0 ? toolsAndTech : ['JIRA', 'CONFLUENCE', 'EXCEL', 'POWER BI', 'SQL'],
    softSkills: ['Stakeholder Management', 'Executive Communication', 'Cross-Functional Leadership', 'Conflict Resolution'],
    actionVerbs: ['Lead', 'Spearhead', 'Orchestrate', 'Deliver', 'Optimize', 'Execute'],
    createdDate: new Date().toISOString().split('T')[0]
  };
}
