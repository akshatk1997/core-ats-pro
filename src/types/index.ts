export type TargetRole = 
  | 'Project Manager'
  | 'Product Manager'
  | 'Business Analyst'
  | 'Data Analyst'
  | 'Digital Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance'
  | 'Consulting'
  | 'Software Engineer'
  | 'Operations'
  | 'General Corporate';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  targetRole: TargetRole;
  experienceLevel: 'Entry Level' | 'Early Career (1-3 yrs)' | 'Mid Career (3-7 yrs)' | 'Senior / Executive (7+ yrs)';
  preferredIndustry: string;
  careerGoal: string;
  linkedInUrl?: string;
  plan: 'Full Access' | 'Enterprise Free';
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface StructuredResume {
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
    github?: string;
  };
  summary: string;
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: string[];
  languages: string[];
  leadership: string[];
  customHeaders?: Record<string, string>;
  customSections?: CustomSection[];
}

export interface ATSScoreBreakdown {
  overall: number; // 0-100
  formattingReadability: number; // Max 25
  keywordAlignment: number; // Max 25
  jobRequirementAlignment: number; // Max 20
  experienceRelevance: number; // Max 15
  structureCompleteness: number; // Max 10
  contentQuality: number; // Max 5
}

export type IssueSeverity = 'high' | 'medium' | 'low' | 'insight';

export interface ResumeIssue {
  id: string;
  title: string;
  explanation: string;
  whyItMatters: string;
  suggestion: string;
  severity: IssueSeverity;
  category: 'formatting' | 'keywords' | 'impact' | 'completeness' | 'structure';
  section: keyof StructuredResume | 'formatting';
  bulletIndex?: number;
  highlightText?: string;
}

export interface RecommendationItem {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  problem: string;
  impact: string;
  suggestedFix: string;
  category: string;
  actionLabel: string;
  actionType: 'add_keyword' | 'improve_bullet' | 'fix_formatting' | 'update_summary';
  payload?: any;
}

export type JobType = 
  | 'Full-Time Enterprise'
  | 'Contract / Freelance'
  | 'Remote / Distributed'
  | 'Executive / C-Suite'
  | 'Internship / Early Career'
  | 'Part-Time / Advisory';

export interface JobTypeRequirementPreset {
  jobType: JobType;
  description: string;
  focusAreas: string[];
  keyKeywords: string[];
  evaluationWeights: {
    technicalSkills: number;
    softSkills: number;
    metricsImpact: number;
    asyncTooling: number;
  };
  sampleRoleTitles: string[];
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  jobType?: JobType;
  jobTypeRequirements?: {
    focusAreas: string[];
    keyKeywords: string[];
    workplaceType?: 'Remote' | 'Hybrid' | 'On-Site';
    seniorityLevel?: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  };
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  toolsAndTech: string[];
  softSkills: string[];
  actionVerbs: string[];
  createdDate: string;
}

export interface JobMatchResult {
  overallMatch: number; // 0-100
  keywordMatch: number;
  skillMatch: number;
  experienceMatch: number;
  responsibilityMatch: number;
  educationMatch: number;
  strongMatches: string[];
  partialMatches: string[];
  missingRequirements: string[];
  transferableSkills: string[];
  recommendations: string[];
}

export interface ResumeVersion {
  id: string;
  name: string;
  targetRole: string;
  targetCompany?: string;
  lastUpdated: string;
  atsScore: number;
  jobMatchScore?: number;
  isPrimary: boolean;
  content: StructuredResume;
  issues: ResumeIssue[];
  atsBreakdown: ATSScoreBreakdown;
  jobMatch?: JobMatchResult;
  template: 'classic' | 'modern' | 'executive' | 'minimal' | 'corporate' | 'ats-first';
}

export interface BulletAnalysis {
  bulletText: string;
  score: number;
  actionVerbStrength: 'weak' | 'moderate' | 'strong';
  hasMetrics: boolean;
  impactRating: number;
  issues: string[];
  suggestions: {
    label: string;
    type: 'impact' | 'shorten' | 'ats' | 'professional';
    revisedText: string;
    explanation: string;
  }[];
}

export interface CoverLetter {
  id: string;
  resumeId: string;
  jobTitle: string;
  companyName: string;
  tone: 'Professional' | 'Confident' | 'Modern' | 'Technical';
  content: string;
  createdAt: string;
}

export interface LinkedInAnalysis {
  currentHeadline: string;
  headlineScore: number;
  suggestedHeadlines: string[];
  aboutSectionFeedback: string[];
  suggestedAbout: string;
  missingKeywords: string[];
  profilePositioning: string;
}

export type ApplicationStatus = 
  | 'Saved'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Final Round'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationTrackerItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  status: ApplicationStatus;
  dateApplied?: string;
  resumeVersionId?: string;
  jobUrl?: string;
  salary?: string;
  notes?: string;
  interviewDate?: string;
  followUpDate?: string;
  contacts?: string;
  updatedAt: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}
