import { StructuredResume, ResumeVersion, JobDescription, JobMatchResult, ApplicationTrackerItem, UserProfile, RecommendationItem, CoverLetter, LinkedInAnalysis } from '@/types';

export const initialUserProfile: UserProfile = {
  id: 'usr_01',
  name: 'Professional Candidate',
  email: 'candidate@domain.com',
  targetRole: 'Project Manager',
  experienceLevel: 'Mid Career (3-7 yrs)',
  preferredIndustry: 'Technology / Corporate',
  careerGoal: 'Secure a high-impact Senior PM role in an enterprise software organization.',
  linkedInUrl: 'https://linkedin.com/in/candidate',
  plan: 'Full Access',
};

export const sampleStructuredResume: StructuredResume = {
  contactInfo: {
    fullName: 'Professional Candidate',
    email: 'candidate@domain.com',
    phone: '(555) 019-2831',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/candidate',
    portfolio: 'candidate-portfolio.io',
  },
  summary: 'Results-driven Project Manager with 3+ years of experience leading cross-functional teams to deliver enterprise software solutions. Proficient in Agile/Scrum methodologies, cross-team stakeholder communication, budget allocation, and risk mitigation.',
  workExperience: [
    {
      id: 'exp_1',
      company: 'Apex Tech Solutions',
      role: 'Associate Project Manager',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      bullets: [
        'Led cross-functional team of 12 engineers, designers, and QA specialists through 14 sprint cycles, delivering product features 2 weeks ahead of schedule.',
        'Worked on digital marketing campaigns and backend infrastructure integration.',
        'Streamlined stakeholder reporting by implementing automated Jira dashboards, reducing status update overhead by 35%.',
        'Managed a project budget of $450,000, ensuring resource allocation optimized project burn rate and minimized scope creep.'
      ]
    },
    {
      id: 'exp_2',
      company: 'Nexus Innovations',
      role: 'Project Management Intern',
      location: 'San Jose, CA',
      startDate: '2022-05',
      endDate: '2022-12',
      current: false,
      bullets: [
        'Supported 5 digital marketing campaigns across paid and organic channels, contributing to improved lead engagement.',
        'Organized daily stand-up meetings and tracked action items using Trello and Confluence for a 9-person software squad.',
        'Synthesized customer feedback data from 200+ surveys into actionable product backlog requirements.'
      ]
    }
  ],
  education: [
    {
      id: 'edu_1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Business Administration & Data Science',
      startDate: '2018-09',
      endDate: '2022-05',
      gpa: '3.82/4.0',
      honors: 'Magna Cum Laude'
    }
  ],
  skills: [
    {
      category: 'Project Management & Methodologies',
      skills: ['Agile / Scrum', 'Kanban', 'Waterfall', 'Risk Management', 'Stakeholder Management', 'Sprint Planning']
    },
    {
      category: 'Tools & Software',
      skills: ['Jira', 'Confluence', 'Asana', 'Microsoft Excel (Advanced)', 'Power BI', 'SQL', 'Tableau', 'Figma']
    },
    {
      category: 'Soft Skills',
      skills: ['Cross-Functional Leadership', 'Executive Presentation', 'Conflict Resolution', 'Data-Driven Decision Making']
    }
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Enterprise Workflow Automation Engine',
      role: 'Student Project Lead',
      description: 'Designed an automated internal request pipeline for campus operations reducing processing lead time.',
      technologies: ['Python', 'Jira API', 'Zapier', 'React'],
      bullets: [
        'Initiated project requirements gathering with 6 department heads to map cross-departmental bottlenecks.',
        'Implemented automated triage logic that reduced average resolution time from 4 days to 18 hours.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'Certified ScrumMaster (CSM)',
      issuer: 'Scrum Alliance',
      dateObtained: '2023-03'
    },
    {
      id: 'cert_2',
      name: 'Google Project Management Professional',
      issuer: 'Coursera / Google',
      dateObtained: '2022-08'
    }
  ],
  achievements: [
    'Awarded "Top Intern Innovator" at Nexus Innovations for introducing automated release notes workflow.',
    'Dean\'s Honor List for 6 consecutive semesters at UC Berkeley.'
  ],
  languages: ['English (Native)', 'Spanish (Professional Working)'],
  leadership: [
    'Vice President of Operations - Berkeley Tech Consulting Student Org (2021-2022)'
  ],
  customHeaders: {
    summary: 'Professional Summary',
    workExperience: 'Work Experience',
    education: 'Education & Academic History',
    skills: 'Skills & Technical Exposure',
    projects: 'Key Projects & Initiatives',
    certifications: 'Certifications & Credentials'
  },
  customSections: [
    {
      id: 'csec_1',
      title: 'Honors, Awards & Publications',
      items: [
        {
          id: 'citem_1',
          title: 'Outstanding Project Delivery Award',
          subtitle: 'Apex Tech Solutions',
          date: '2023',
          bullets: ['Recognized by VP of Engineering for leading cross-functional sprint execution 2 weeks ahead of target launch date.']
        }
      ]
    }
  ]
};

export const sampleJobDescription: JobDescription = {
  id: 'jd_101',
  title: 'Senior Project Manager - Enterprise Platforms',
  company: 'CloudScale Dynamics',
  rawText: `CloudScale Dynamics is looking for an ambitious, detailed-oriented Senior Project Manager to drive cross-functional alignment across engineering, product management, and customer success teams.

Key Responsibilities:
- Lead end-to-end delivery of enterprise SaaS product lines using Agile/Scrum framework.
- Facilitate sprint planning, daily stand-ups, retrospectives, and backlog grooming sessions.
- Manage complex stakeholder matrix across engineering leadership and C-suite executives.
- Establish key performance metrics, tracking team velocity, burn-down charts, and deliverable quality.
- Identify and mitigate project risks, resolving roadblocks proactive before sprint deadline impact.
- Drive adoption of Jira, Confluence, and Productboard across 4 product domains.

Requirements & Qualifications:
- 3+ years of experience in technical or SaaS project management.
- Hands-on mastery of Jira, Agile, Scrum, and Stakeholder Management.
- Strong proficiency in SQL, Excel data analysis, and Power BI dashboarding.
- Proven track record of delivering complex software projects on time and within budget.
- CSM or PMP certification preferred.
- Exceptional verbal and written executive communication skills.`,
  requiredSkills: ['Project Management', 'Jira', 'Agile', 'Scrum', 'Stakeholder Management', 'Risk Management', 'Excel', 'Executive Communication'],
  preferredSkills: ['PMP Certification', 'Power BI', 'SQL', 'Productboard', 'Budget Allocation'],
  responsibilities: [
    'Lead end-to-end delivery of enterprise SaaS product lines.',
    'Facilitate sprint planning, daily stand-ups, retrospectives, and backlog grooming.',
    'Manage complex stakeholder matrix across engineering leadership.',
    'Establish key performance metrics and burn-down charts.',
    'Mitigate project risks proactive before sprint deadline impact.'
  ],
  qualifications: [
    '3+ years experience in technical project management',
    'CSM or PMP certification preferred',
    'Bachelor degree in Business or technical field'
  ],
  toolsAndTech: ['Jira', 'Confluence', 'Power BI', 'SQL', 'Excel', 'Productboard'],
  softSkills: ['Stakeholder Management', 'Executive Communication', 'Risk Management', 'Conflict Resolution'],
  actionVerbs: ['Lead', 'Facilitate', 'Manage', 'Establish', 'Mitigate', 'Drive'],
  createdDate: '2026-09-20'
};

export const sampleJobMatchResult: JobMatchResult = {
  overallMatch: 84,
  keywordMatch: 91,
  skillMatch: 86,
  experienceMatch: 78,
  responsibilityMatch: 82,
  educationMatch: 100,
  strongMatches: ['Agile / Scrum', 'Jira', 'Confluence', 'Stakeholder Management', 'Excel', 'CSM Certification', 'Risk Management'],
  partialMatches: ['Executive Communication', 'Budget Allocation', 'Productboard'],
  missingRequirements: ['PMP Certification', 'Productboard', 'End-to-End Enterprise SaaS Delivery'],
  transferableSkills: ['Data Analytics with SQL & Power BI', 'Cross-Functional Team Leadership'],
  recommendations: [
    'Add measurable outcomes to your project-management experience bullets.',
    'Highlight experience with SaaS products directly in your summary section.',
    'Include explicit mention of Productboard or similar roadmapping tooling if applicable.'
  ]
};

export const sampleRecommendations: RecommendationItem[] = [
  {
    id: 'rec_1',
    priority: 'HIGH',
    title: 'Add measurable outcomes to project experience',
    problem: 'Bullet point describes tasks ("Worked on digital marketing campaigns") without specifying impact metrics.',
    impact: 'Recruiters & ATS algorithms favor candidate bullets with clear metrics (%, $, time saved).',
    suggestedFix: 'Rephrase to highlight revenue, time saved, or team productivity increases achieved.',
    category: 'Impact & Metrics',
    actionLabel: 'Improve Bullet with AI',
    actionType: 'improve_bullet',
    payload: { expId: 'exp_1', bulletIndex: 1 }
  },
  {
    id: 'rec_2',
    priority: 'HIGH',
    title: 'Missing core keyword: Enterprise SaaS',
    problem: 'Target job specifies enterprise SaaS platform management, but your summary lacks this phrasing.',
    impact: 'Keyword match algorithm flagged a potential gap in enterprise context.',
    suggestedFix: 'Integrate "Enterprise SaaS" into your professional summary or recent position title.',
    category: 'Keywords',
    actionLabel: 'Optimize Summary',
    actionType: 'update_summary'
  },
  {
    id: 'rec_3',
    priority: 'MEDIUM',
    title: 'Strengthen 4 action verbs in experience section',
    problem: 'Using passive verbs like "Worked on" and "Supported" instead of authoritative verbs like "Orchestrated" or "Spearheaded".',
    impact: 'Strong action verbs increase recruiter engagement by up to 24%.',
    suggestedFix: 'Replace weak introductory verbs with strong high-impact verbs.',
    category: 'Content Quality',
    actionLabel: 'Enhance Verbs',
    actionType: 'improve_bullet'
  },
  {
    id: 'rec_4',
    priority: 'LOW',
    title: 'Ensure section heading standardization',
    problem: 'Section "Tools & Software" can be parsed better when listed as "Technical Skills".',
    impact: 'Some legacy ATS parsers look specifically for standard "Technical Skills" headers.',
    suggestedFix: 'Standardize skill group category naming.',
    category: 'Formatting',
    actionLabel: 'Fix Header',
    actionType: 'fix_formatting'
  }
];

export const defaultResumeVersion: ResumeVersion = {
  id: 'ver_pm_master',
  name: 'Master Professional Resume',
  targetRole: 'Senior Project Manager',
  targetCompany: 'CloudScale Dynamics',
  isPrimary: true,
  template: 'ats-first',
  lastUpdated: 'Just now',
  atsScore: 87,
  jobMatchScore: 84,
  content: sampleStructuredResume,
  atsBreakdown: {
    overall: 87,
    formattingReadability: 24,
    keywordAlignment: 22,
    jobRequirementAlignment: 17,
    experienceRelevance: 13,
    structureCompleteness: 8,
    contentQuality: 3,
  },
  issues: sampleRecommendations.map(r => ({
    id: r.id,
    title: r.title,
    explanation: r.problem,
    whyItMatters: r.impact,
    suggestion: r.suggestedFix,
    severity: r.priority === 'HIGH' ? 'high' : r.priority === 'MEDIUM' ? 'medium' : 'low',
    category: r.category.toLowerCase().includes('format') ? 'formatting' : 'keywords',
    section: 'workExperience'
  }))
};

export const sampleResumeVersions: ResumeVersion[] = [defaultResumeVersion];

export const sampleApplications: ApplicationTrackerItem[] = [
  {
    id: 'app_1',
    company: 'CloudScale Dynamics',
    role: 'Senior Project Manager',
    location: 'San Francisco, CA (Hybrid)',
    status: 'Interview',
    dateApplied: '2026-09-15',
    resumeVersionId: 'ver_pm_master',
    jobUrl: 'https://cloudscale.careers/pm-senior',
    salary: '$135,000 - $155,000',
    notes: 'First round interview with Engineering Lead completed. Technical case study scheduled for Thursday.',
    interviewDate: '2026-09-28',
    followUpDate: '2026-09-29',
    contacts: 'Sarah Jenkins (Recruiter) - s.jenkins@cloudscale.io',
    updatedAt: '2026-09-25'
  },
  {
    id: 'app_2',
    company: 'FinTech Corp',
    role: 'Business Analyst - Operations',
    location: 'Remote',
    status: 'Assessment',
    dateApplied: '2026-09-18',
    resumeVersionId: 'ver_ba_variant',
    jobUrl: 'https://fintechcorp.com/jobs/ba-ops',
    salary: '$120,000',
    notes: 'Completed SQL & Excel data modeling take-home assessment. Awaiting score.',
    followUpDate: '2026-09-27',
    contacts: 'David Chen (Hiring Manager)',
    updatedAt: '2026-09-22'
  },
  {
    id: 'app_3',
    company: 'Stripe',
    role: 'Technical Program Manager',
    location: 'San Francisco, CA',
    status: 'Applied',
    dateApplied: '2026-09-20',
    resumeVersionId: 'ver_pm_master',
    jobUrl: 'https://stripe.com/jobs/tpm-sf',
    salary: '$160,000',
    notes: 'Applied via referral from UC Berkeley alumni network.',
    updatedAt: '2026-09-20'
  },
  {
    id: 'app_4',
    company: 'Notion',
    role: 'Associate Product Manager',
    location: 'San Francisco, CA',
    status: 'Saved',
    notes: 'Need to tailor resume to emphasize product roadmap modeling before applying.',
    updatedAt: '2026-09-24'
  },
  {
    id: 'app_5',
    company: 'Linear App',
    role: 'Operations Lead',
    location: 'Remote',
    status: 'Offer',
    dateApplied: '2026-08-30',
    resumeVersionId: 'ver_pm_master',
    salary: '$145,000 + Equity',
    notes: 'Offer letter received! Reviewing compensation package.',
    updatedAt: '2026-09-24'
  }
];

export const sampleCoverLetter: CoverLetter = {
  id: 'cl_101',
  resumeId: 'ver_pm_master',
  jobTitle: 'Senior Project Manager',
  companyName: 'CloudScale Dynamics',
  tone: 'Confident',
  createdAt: '2026-09-22',
  content: `Dear Hiring Committee at CloudScale Dynamics,

I am writing to express my strong enthusiasm for the Senior Project Manager position. Having led cross-functional engineering teams of up to 12 specialists and delivered enterprise software deliverables ahead of schedule, I am eager to bring my expertise in Agile methodologies, stakeholder matrix management, and data-driven project execution to your team.

At Apex Tech Solutions, I directed end-to-end sprint delivery while streamlining stakeholder reporting through custom Jira automation—slashing update overhead by 35% and maintaining a strict budget burn rate across $450K initiatives. My experience directly mirrors CloudScale's commitment to scaling enterprise platforms without compromising on quality or sprint velocity.

Furthermore, my background combining Data Science and Business Administration from UC Berkeley allows me to translate complex technical requirements into actionable team roadmaps. I am certified as a ScrumMaster (CSM) and possess hands-on technical proficiency with SQL, Power BI, and Jira.

I would welcome the opportunity to discuss how my project leadership and technical background align with CloudScale Dynamics' upcoming product milestones. Thank you for your time and consideration.

Sincerely,
Professional Candidate`
};

export const sampleLinkedInAnalysis: LinkedInAnalysis = {
  currentHeadline: 'Associate Project Manager | Software & Operations',
  headlineScore: 68,
  suggestedHeadlines: [
    'Associate Project Manager | Agile & Scrum Leader | CSM® | Enterprise SaaS & Data Analytics',
    'Project Manager | Cross-Functional Team Leadership | Jira & Power BI | Tech Operations',
    'Project Manager @ Apex Tech | Certified ScrumMaster | Driving Enterprise Product Milestones'
  ],
  aboutSectionFeedback: [
    'Your current summary highlights education, but lacks core technical keywords such as Agile, Jira, Risk Management, and Budget Allocation.',
    'Include 2-3 key quantitative career highlights at the very top of your profile.',
    'Add a clear Call to Action at the end inviting recruiters to connect.'
  ],
  suggestedAbout: `Passionate Project Manager with 3+ years of experience steering cross-functional engineering and design squads through end-to-end product releases. Certified ScrumMaster (CSM) skilled in Jira, SQL, Power BI, and Agile frameworks.

Key Highlights:
• Led 12-person cross-functional squad delivering enterprise software initiatives 2 weeks ahead of target deadlines.
• Reduced project status update overhead by 35% through custom Jira workflow automation.
• Managed $450K project budgets while keeping scope creep under 5%.

Open to connecting regarding Project Management, Product Operations, and Agile leadership roles in Tech & Enterprise SaaS.`,
  missingKeywords: ['Agile / Scrum', 'Certified ScrumMaster (CSM)', 'Stakeholder Management', 'Jira Automation', 'SaaS Product Lifecycle'],
  profilePositioning: 'Strong technical positioning for Project Manager and Business Analyst roles, with room to highlight quantitative leadership outcomes.'
};
