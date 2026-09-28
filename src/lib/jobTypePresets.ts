import { JobType, JobTypeRequirementPreset } from '@/types';

export const JOB_TYPE_PRESETS: Record<JobType, JobTypeRequirementPreset> = {
  'Full-Time Enterprise': {
    jobType: 'Full-Time Enterprise',
    description: 'Long-term corporate positioning focusing on cross-functional alignment, sprint predictability, and organizational scale.',
    focusAreas: ['Sprint Predictability', 'Stakeholder Management', 'Cross-Functional Squad Leadership', 'Process Automation'],
    keyKeywords: ['Jira', 'Agile', 'Sprint Velocity', 'Stakeholder Matrix', 'Budget Burn Rate', 'SQL', 'Power BI'],
    evaluationWeights: {
      technicalSkills: 0.35,
      softSkills: 0.25,
      metricsImpact: 0.25,
      asyncTooling: 0.15,
    },
    sampleRoleTitles: ['Senior Project Manager', 'Enterprise Staff Engineer', 'Director of Operations', 'Product Lead'],
  },
  'Contract / Freelance': {
    jobType: 'Contract / Freelance',
    description: 'Deliverable-driven positioning emphasizing immediate tool mastery, rapid onboarding, and strict scope boundary control.',
    focusAreas: ['Immediate Time-to-Value', 'Scope Creep Control', 'Specialized Technical Execution', 'SLA Adherence'],
    keyKeywords: ['Deliverable Milestones', 'Scope Boundary', 'Turnkey Execution', 'SLA', 'API Integration', 'Refactoring'],
    evaluationWeights: {
      technicalSkills: 0.50,
      softSkills: 0.15,
      metricsImpact: 0.25,
      asyncTooling: 0.10,
    },
    sampleRoleTitles: ['Contract Solutions Architect', 'Freelance Frontend Developer', 'Technical Consultant', 'Interim PM'],
  },
  'Remote / Distributed': {
    jobType: 'Remote / Distributed',
    description: 'Asynchronous operational positioning emphasizing self-direction, Loom/Notion documentation, and clear written communication.',
    focusAreas: ['Asynchronous Communication', 'Self-Directed Execution', 'Written Documentation', 'Time-Zone Autonomy'],
    keyKeywords: ['Async Workflow', 'Notion', 'Loom', 'Slack Channel Triage', 'Self-Starter', 'Timezone Alignment'],
    evaluationWeights: {
      technicalSkills: 0.30,
      softSkills: 0.30,
      metricsImpact: 0.20,
      asyncTooling: 0.20,
    },
    sampleRoleTitles: ['Remote Senior Developer', 'Distributed Product Manager', 'Async Operations Specialist'],
  },
  'Executive / C-Suite': {
    jobType: 'Executive / C-Suite',
    description: 'High-stakes strategic positioning focusing on P&L ownership, EBITDA growth, board reporting, and enterprise scaling.',
    focusAreas: ['P&L Management', 'EBITDA Growth', 'Board Governance', 'Enterprise Strategy', 'Team Scaling'],
    keyKeywords: ['P&L Responsibility', 'Revenue Growth %', 'CapEx/OpEx', 'Strategic Roadmap', 'Board Presentation', 'M&A'],
    evaluationWeights: {
      technicalSkills: 0.15,
      softSkills: 0.35,
      metricsImpact: 0.40,
      asyncTooling: 0.10,
    },
    sampleRoleTitles: ['Chief Technology Officer (CTO)', 'VP of Engineering', 'VP of Product', 'Chief Operating Officer'],
  },
  'Internship / Early Career': {
    jobType: 'Internship / Early Career',
    description: 'Foundational positioning highlighting rapid learning adaptability, academic project rigor, and technical eagerness.',
    focusAreas: ['Technical Foundation', 'Academic & Bootcamp Projects', 'Collaboration Eagerness', 'Continuous Learning'],
    keyKeywords: ['Python', 'JavaScript', 'Git/GitHub', 'Problem Solving', 'Algorithm Complexity', 'Academic Honors'],
    evaluationWeights: {
      technicalSkills: 0.40,
      softSkills: 0.30,
      metricsImpact: 0.15,
      asyncTooling: 0.15,
    },
    sampleRoleTitles: ['Junior Software Engineer', 'Associate Business Analyst', 'Data Science Intern'],
  },
  'Part-Time / Advisory': {
    jobType: 'Part-Time / Advisory',
    description: 'Strategic mentorship and advisory positioning providing high-level technical guidance and architectural reviews.',
    focusAreas: ['Architectural Review', 'Strategic Advisory', 'Mentorship & Coaching', 'Technical Auditing'],
    keyKeywords: ['Board Advisory', 'Technical Audit', 'Architecture Review', 'Mentorship', 'Growth Strategy'],
    evaluationWeights: {
      technicalSkills: 0.30,
      softSkills: 0.30,
      metricsImpact: 0.30,
      asyncTooling: 0.10,
    },
    sampleRoleTitles: ['Fractional CTO', 'Technical Advisor', 'Part-Time Strategy Director'],
  },
};
