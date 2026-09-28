import { StructuredResume, ATSScoreBreakdown, ResumeIssue, JobDescription } from '@/types';

export interface DetailedPointCalculation {
  category: string;
  earned: number;
  max: number;
  reason: string;
  tipsToReachMax: string;
}

export function calculateATSScore(
  resume: StructuredResume,
  jobDescription?: JobDescription
): { breakdown: ATSScoreBreakdown; issues: ResumeIssue[]; detailedCalculation: DetailedPointCalculation[] } {
  const issues: ResumeIssue[] = [];
  const detailedCalculation: DetailedPointCalculation[] = [];

  // Safe Fallback Guards
  const workExp = resume?.workExperience || [];
  const eduList = resume?.education || [];
  const skillGroups = resume?.skills || [];
  const contact = resume?.contactInfo || { fullName: 'Candidate', email: '', phone: '', location: '' };
  const reqSkills = jobDescription?.requiredSkills || [];
  const responsibilities = jobDescription?.responsibilities || [];

  // 1. Formatting & Parser Readability (Max 25)
  let formattingScore = 25;
  let formattingReason = 'Standard single-column layout with parseable section headers.';
  let formattingTip = 'Keep font size between 10px-12px and maintain standard headers.';

  if (!resume?.summary || resume.summary.length < 50) {
    formattingScore -= 5;
    formattingReason = 'Professional summary is too short or missing (-5 pts).';
    formattingTip = 'Add a 2-3 sentence summary highlighting your core domain title.';
    issues.push({
      id: 'iss_fmt_summary',
      title: 'Short or missing summary section',
      explanation: 'Your resume lacks a clear professional summary section or it is under 50 characters.',
      whyItMatters: 'A concise summary establishes immediate context for both human recruiters and automated parsers.',
      suggestion: 'Add a 2-3 sentence summary highlighting your core title, domain experience, and key skills.',
      severity: 'medium',
      category: 'completeness',
      section: 'summary'
    });
  }

  if (workExp.length === 0) {
    formattingScore -= 10;
    formattingReason = 'Work experience entries could not be parsed (-10 pts).';
    issues.push({
      id: 'iss_fmt_no_exp',
      title: 'No work experience section identified',
      explanation: 'The parser could not locate work experience entries.',
      whyItMatters: 'Work experience is the most heavily weighted section in ATS systems.',
      suggestion: 'Ensure your work experience section has a standard header like "Work Experience".',
      severity: 'high',
      category: 'structure',
      section: 'workExperience'
    });
  }

  if (!contact.email || !contact.phone) {
    formattingScore -= 4;
    formattingReason = 'Incomplete contact node header (-4 pts).';
    issues.push({
      id: 'iss_fmt_contact',
      title: 'Incomplete contact details',
      explanation: 'Missing email or phone number in contact header.',
      whyItMatters: 'Parsers need clear contact nodes to populate candidate tracking records.',
      suggestion: 'Add your direct phone number and standard email at the top.',
      severity: 'high',
      category: 'completeness',
      section: 'contactInfo'
    });
  }

  detailedCalculation.push({
    category: 'Formatting & Parser Readability',
    earned: Math.max(0, formattingScore),
    max: 25,
    reason: formattingReason,
    tipsToReachMax: formattingTip
  });

  // 2. Keyword Alignment (Max 25)
  let keywordScore = 25;
  let keywordReason = 'High density of domain keywords matched.';
  let keywordTip = 'Integrate exact keywords required in job descriptions.';

  if (jobDescription && reqSkills.length > 0) {
    const resumeTextLower = JSON.stringify(resume || {}).toLowerCase();
    const matchedSkills = reqSkills.filter(skill =>
      resumeTextLower.includes(skill.toLowerCase())
    );
    const ratio = matchedSkills.length / reqSkills.length;
    keywordScore = Math.round(ratio * 25);

    const missingSkills = reqSkills.filter(skill =>
      !resumeTextLower.includes(skill.toLowerCase())
    );

    if (missingSkills.length > 0) {
      keywordReason = `Missing ${missingSkills.length} required keywords: ${missingSkills.slice(0, 3).join(', ')}.`;
      keywordTip = `Add ${missingSkills.slice(0, 3).join(', ')} to your skills or experience section.`;
      issues.push({
        id: 'iss_kw_missing',
        title: `Missing ${missingSkills.length} required key skills`,
        explanation: `Target job requires: ${missingSkills.slice(0, 4).join(', ')}.`,
        whyItMatters: 'ATS keyword filters screen candidate resumes against exact target terms.',
        suggestion: `Integrate missing skills (${missingSkills.slice(0, 3).join(', ')}) into your bullets.`,
        severity: missingSkills.length > 3 ? 'high' : 'medium',
        category: 'keywords',
        section: 'skills',
        highlightText: missingSkills.slice(0, 3).join(', ')
      });
    }
  } else {
    const totalSkills = skillGroups.reduce((acc, cat) => acc + (cat?.skills?.length || 0), 0);
    if (totalSkills < 6) {
      keywordScore = 18;
      keywordReason = 'Low total skill count identified.';
      issues.push({
        id: 'iss_kw_low_count',
        title: 'Low skill count detected',
        explanation: 'Only a few distinct skills are listed in your skills section.',
        whyItMatters: 'A comprehensive skills list improves indexing engines.',
        suggestion: 'Categorize your technical tools and soft skills.',
        severity: 'medium',
        category: 'keywords',
        section: 'skills'
      });
    }
  }

  detailedCalculation.push({
    category: 'Keyword Alignment',
    earned: Math.max(0, keywordScore),
    max: 25,
    reason: keywordReason,
    tipsToReachMax: keywordTip
  });

  // 3. Job Requirement Alignment (Max 20)
  let jobReqScore = 20;
  let jobReqReason = 'Strong alignment with job responsibilities.';
  if (jobDescription && responsibilities.length > 0) {
    const resumeTextLower = JSON.stringify(resume || {}).toLowerCase();
    let matches = 0;
    responsibilities.forEach(resp => {
      const words = (resp || '').toLowerCase().split(' ').filter(w => w.length > 4);
      const matchCount = words.filter(w => resumeTextLower.includes(w)).length;
      if (matchCount >= 2) matches++;
    });
    const respRatio = responsibilities.length > 0 ? matches / responsibilities.length : 1;
    jobReqScore = Math.min(20, Math.max(10, Math.round(respRatio * 20)));
    if (jobReqScore < 20) {
      jobReqReason = 'Some target job responsibilities are missing from experience bullets.';
    }
  } else {
    jobReqScore = 17;
  }

  detailedCalculation.push({
    category: 'Job Requirement Alignment',
    earned: jobReqScore,
    max: 20,
    reason: jobReqReason,
    tipsToReachMax: 'Rephrase experience bullets to mirror responsibilities in target job.'
  });

  // 4. Experience Relevance (Max 15)
  let expRelevanceScore = 15;
  let expReason = 'Adequate depth across work experience entries.';
  const totalBullets = workExp.reduce((acc, exp) => acc + (exp?.bullets?.length || 0), 0);
  if (totalBullets < 4) {
    expRelevanceScore -= 4;
    expReason = 'Sparse experience bullets (-4 pts).';
    issues.push({
      id: 'iss_exp_sparse',
      title: 'Sparse experience bullet points',
      explanation: 'Your work experience entries contain very few bullet points.',
      whyItMatters: 'Recruiters expect 3-5 bullet points per role.',
      suggestion: 'Expand each role with 3-4 bullet points.',
      severity: 'medium',
      category: 'structure',
      section: 'workExperience'
    });
  }

  detailedCalculation.push({
    category: 'Experience Relevance',
    earned: Math.max(0, expRelevanceScore),
    max: 15,
    reason: expReason,
    tipsToReachMax: 'Ensure each role has 3-5 high-impact bullet points.'
  });

  // 5. Structure & Completeness (Max 10)
  let structureScore = 10;
  let structReason = 'All standard sections present.';
  if (eduList.length === 0) {
    structureScore -= 3;
    structReason = 'Missing education section (-3 pts).';
    issues.push({
      id: 'iss_struct_edu',
      title: 'Missing education section',
      explanation: 'No education credentials found.',
      whyItMatters: 'Many ATS filters enforce minimum degree verification checks.',
      suggestion: 'Add your degree and institution.',
      severity: 'high',
      category: 'completeness',
      section: 'education'
    });
  }

  detailedCalculation.push({
    category: 'Structure & Completeness',
    earned: Math.max(0, structureScore),
    max: 10,
    reason: structReason,
    tipsToReachMax: 'Include Education, Certifications, and Technical Skills.'
  });

  // 6. Content Quality & Metrics (Max 5)
  let contentQualityScore = 5;
  let contentReason = 'Contains quantitative achievement metrics.';
  const bulletsWithMetrics = workExp.flatMap(exp => exp?.bullets || []).filter(bullet =>
    /\d+(%|\$|k|M|x| hours| days| weeks| engineers| users| campaigns)/i.test(bullet || '')
  );
  
  if (bulletsWithMetrics.length === 0 && totalBullets > 0) {
    contentQualityScore -= 2;
    contentReason = 'Lacks measurable metrics like %, $, or numbers (-2 pts).';
    issues.push({
      id: 'iss_content_no_metrics',
      title: 'Lack of measurable impact metrics',
      explanation: 'None of your work experience bullets contain quantifiable numbers or percentages.',
      whyItMatters: 'Quantified achievements make bullets 3x more persuasive.',
      suggestion: 'Incorporate genuine metrics where applicable (e.g. "% efficiency gain", "team size").',
      severity: 'high',
      category: 'impact',
      section: 'workExperience'
    });
  }

  detailedCalculation.push({
    category: 'Content Quality & Metrics',
    earned: Math.max(0, contentQualityScore),
    max: 5,
    reason: contentReason,
    tipsToReachMax: 'Add percentages, dollar amounts, or team size metrics to bullets.'
  });

  const overall = Math.min(100, Math.max(0, 
    formattingScore + keywordScore + jobReqScore + expRelevanceScore + structureScore + contentQualityScore
  ));

  const breakdown: ATSScoreBreakdown = {
    overall,
    formattingReadability: Math.min(25, Math.max(0, formattingScore)),
    keywordAlignment: Math.min(25, Math.max(0, keywordScore)),
    jobRequirementAlignment: Math.min(20, Math.max(0, jobReqScore)),
    experienceRelevance: Math.min(15, Math.max(0, expRelevanceScore)),
    structureCompleteness: Math.min(10, Math.max(0, structureScore)),
    contentQuality: Math.min(5, Math.max(0, contentQualityScore)),
  };

  return { breakdown, issues, detailedCalculation };
}
