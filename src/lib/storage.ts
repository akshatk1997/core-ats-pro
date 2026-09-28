import { StructuredResume, ResumeVersion, JobDescription, ApplicationTrackerItem, UserProfile } from '@/types';
import { initialUserProfile, sampleResumeVersions, sampleJobDescription, sampleApplications, sampleStructuredResume, defaultResumeVersion } from './mockData';
import { calculateATSScore } from './atsEngine';

const STORAGE_KEYS = {
  USER_PROFILE: 'ats_user_profile',
  RESUME_VERSIONS: 'ats_resume_versions',
  ACTIVE_RESUME_ID: 'ats_active_resume_id',
  JOB_DESCRIPTIONS: 'ats_job_descriptions',
  ACTIVE_JOB_ID: 'ats_active_job_id',
  APPLICATIONS: 'ats_applications',
  THEME: 'ats_theme'
};

export function clearAppStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    sessionStorage.clear();
  } catch (err) {
    console.warn('Failed to clear app storage:', err);
  }
}

function sanitizeStructuredResume(raw: any): StructuredResume {
  if (!raw || typeof raw !== 'object') return sampleStructuredResume;

  return {
    contactInfo: {
      fullName: raw.contactInfo?.fullName || 'Candidate Name',
      email: raw.contactInfo?.email || 'candidate@example.com',
      phone: raw.contactInfo?.phone || '(555) 019-2831',
      location: raw.contactInfo?.location || 'San Francisco, CA',
      linkedin: raw.contactInfo?.linkedin || '',
      portfolio: raw.contactInfo?.portfolio || '',
      github: raw.contactInfo?.github || ''
    },
    summary: typeof raw.summary === 'string' ? raw.summary : sampleStructuredResume.summary,
    workExperience: Array.isArray(raw.workExperience) ? raw.workExperience.map((exp: any, i: number) => ({
      id: exp?.id || `exp_${i}`,
      company: exp?.company || 'Organization',
      role: exp?.role || 'Position',
      location: exp?.location || '',
      startDate: exp?.startDate || '2023-01',
      endDate: exp?.endDate || 'Present',
      current: Boolean(exp?.current),
      bullets: Array.isArray(exp?.bullets) ? exp.bullets.filter((b: any) => typeof b === 'string') : ['Executed key deliverables and project milestones.']
    })) : sampleStructuredResume.workExperience,
    education: Array.isArray(raw.education) ? raw.education.map((edu: any, i: number) => ({
      id: edu?.id || `edu_${i}`,
      institution: edu?.institution || 'University',
      degree: edu?.degree || 'Bachelor of Science',
      fieldOfStudy: edu?.fieldOfStudy || 'General Studies',
      startDate: edu?.startDate || '2018',
      endDate: edu?.endDate || '2022',
      gpa: edu?.gpa || '',
      honors: edu?.honors || ''
    })) : sampleStructuredResume.education,
    skills: Array.isArray(raw.skills) ? raw.skills.map((sGroup: any, i: number) => ({
      category: sGroup?.category || 'Technical Skills',
      skills: Array.isArray(sGroup?.skills) ? sGroup.skills.filter((s: any) => typeof s === 'string') : ['Technical Execution', 'Communication']
    })) : sampleStructuredResume.skills,
    projects: Array.isArray(raw.projects) ? raw.projects.map((p: any, i: number) => ({
      id: p?.id || `proj_${i}`,
      title: p?.title || 'Key Initiative',
      role: p?.role || 'Lead',
      description: p?.description || '',
      technologies: Array.isArray(p?.technologies) ? p.technologies : [],
      bullets: Array.isArray(p?.bullets) ? p.bullets : []
    })) : [],
    certifications: Array.isArray(raw.certifications) ? raw.certifications.map((c: any, i: number) => ({
      id: c?.id || `cert_${i}`,
      name: c?.name || 'Certification',
      issuer: c?.issuer || 'Issuing Authority',
      dateObtained: c?.dateObtained || ''
    })) : [],
    achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
    languages: Array.isArray(raw.languages) ? raw.languages : ['English (Native)'],
    leadership: Array.isArray(raw.leadership) ? raw.leadership : [],
    customHeaders: raw.customHeaders && typeof raw.customHeaders === 'object' ? raw.customHeaders : sampleStructuredResume.customHeaders,
    customSections: Array.isArray(raw.customSections) ? raw.customSections : []
  };
}

function sanitizeResumeVersion(v: any): ResumeVersion {
  if (!v || typeof v !== 'object') return defaultResumeVersion;

  const content = sanitizeStructuredResume(v.content);
  const { breakdown, issues } = calculateATSScore(content);

  return {
    id: typeof v.id === 'string' && v.id ? v.id : `ver_${Date.now()}`,
    name: typeof v.name === 'string' && v.name ? v.name : 'Master Resume Version',
    targetRole: typeof v.targetRole === 'string' && v.targetRole ? v.targetRole : 'Professional Role',
    targetCompany: typeof v.targetCompany === 'string' ? v.targetCompany : 'Target Enterprise',
    isPrimary: Boolean(v.isPrimary),
    template: typeof v.template === 'string' ? v.template : 'ats-first',
    lastUpdated: typeof v.lastUpdated === 'string' ? v.lastUpdated : 'Just now',
    atsScore: typeof v.atsScore === 'number' ? v.atsScore : breakdown.overall,
    jobMatchScore: typeof v.jobMatchScore === 'number' ? v.jobMatchScore : 84,
    content,
    atsBreakdown: v.atsBreakdown && typeof v.atsBreakdown === 'object' ? v.atsBreakdown : breakdown,
    issues: Array.isArray(v.issues) ? v.issues : issues
  };
}

function sanitizeJobDescription(j: any): JobDescription {
  if (!j || typeof j !== 'object') return sampleJobDescription;

  return {
    id: typeof j.id === 'string' && j.id ? j.id : `jd_${Date.now()}`,
    title: typeof j.title === 'string' && j.title ? j.title : 'Target Job Role',
    company: typeof j.company === 'string' && j.company ? j.company : 'Target Organization',
    rawText: typeof j.rawText === 'string' ? j.rawText : sampleJobDescription.rawText,
    requiredSkills: Array.isArray(j.requiredSkills) ? j.requiredSkills : sampleJobDescription.requiredSkills,
    preferredSkills: Array.isArray(j.preferredSkills) ? j.preferredSkills : sampleJobDescription.preferredSkills,
    responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : sampleJobDescription.responsibilities,
    qualifications: Array.isArray(j.qualifications) ? j.qualifications : sampleJobDescription.qualifications,
    toolsAndTech: Array.isArray(j.toolsAndTech) ? j.toolsAndTech : sampleJobDescription.toolsAndTech,
    softSkills: Array.isArray(j.softSkills) ? j.softSkills : sampleJobDescription.softSkills,
    actionVerbs: Array.isArray(j.actionVerbs) ? j.actionVerbs : sampleJobDescription.actionVerbs,
    createdDate: typeof j.createdDate === 'string' ? j.createdDate : '2026-09-27'
  };
}

export function getStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined') return initialUserProfile;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!stored) return initialUserProfile;
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? { ...initialUserProfile, ...parsed } : initialUserProfile;
  } catch (err) {
    console.warn('Failed to parse user profile from localStorage:', err);
    return initialUserProfile;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save user profile to localStorage:', err);
  }
}

export function getStoredResumeVersions(): ResumeVersion[] {
  if (typeof window === 'undefined') return sampleResumeVersions;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESUME_VERSIONS);
    if (!stored) return sampleResumeVersions;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(sanitizeResumeVersion);
    }
    return sampleResumeVersions;
  } catch (err) {
    console.warn('Failed to parse resume versions from localStorage:', err);
    return sampleResumeVersions;
  }
}

export function saveResumeVersions(versions: ResumeVersion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.RESUME_VERSIONS, JSON.stringify(versions));
  } catch (err) {
    console.warn('Failed to save resume versions to localStorage:', err);
  }
}

export function getStoredActiveResumeId(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_RESUME_ID) || '';
  } catch (err) {
    return '';
  }
}

export function saveActiveResumeId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_RESUME_ID, id);
  } catch (err) {
    console.warn('Failed to save active resume ID to localStorage:', err);
  }
}

export function getStoredJobDescriptions(): JobDescription[] {
  if (typeof window === 'undefined') return [sampleJobDescription];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.JOB_DESCRIPTIONS);
    if (!stored) return [sampleJobDescription];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(sanitizeJobDescription);
    }
    return [sampleJobDescription];
  } catch (err) {
    console.warn('Failed to parse job descriptions from localStorage:', err);
    return [sampleJobDescription];
  }
}

export function saveJobDescriptions(jobs: JobDescription[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.JOB_DESCRIPTIONS, JSON.stringify(jobs));
  } catch (err) {
    console.warn('Failed to save job descriptions to localStorage:', err);
  }
}

export function getStoredActiveJobId(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_JOB_ID) || '';
  } catch (err) {
    return '';
  }
}

export function saveActiveJobId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_JOB_ID, id);
  } catch (err) {
    console.warn('Failed to save active job ID to localStorage:', err);
  }
}

export function getStoredApplications(): ApplicationTrackerItem[] {
  if (typeof window === 'undefined') return sampleApplications;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!stored) return sampleApplications;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : sampleApplications;
  } catch (err) {
    console.warn('Failed to parse applications from localStorage:', err);
    return sampleApplications;
  }
}

export function saveApplications(apps: ApplicationTrackerItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  } catch (err) {
    console.warn('Failed to save applications to localStorage:', err);
  }
}
