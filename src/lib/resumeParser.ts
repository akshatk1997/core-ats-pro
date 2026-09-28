import { StructuredResume, WorkExperienceItem, EducationItem, SkillGroup, ProjectItem, CertificationItem } from '@/types';

export function parseRawResumeText(rawText: string): StructuredResume {
  const cleanText = rawText.trim();

  // 1. JSON Direct Parse Check
  if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleanText);
      if (parsed && typeof parsed === 'object' && (parsed.contactInfo || parsed.workExperience || parsed.skills)) {
        return {
          contactInfo: {
            fullName: parsed.contactInfo?.fullName || 'Candidate Name',
            email: parsed.contactInfo?.email || 'candidate@example.com',
            phone: parsed.contactInfo?.phone || '',
            location: parsed.contactInfo?.location || '',
            linkedin: parsed.contactInfo?.linkedin || '',
            portfolio: parsed.contactInfo?.portfolio || '',
            github: parsed.contactInfo?.github || ''
          },
          summary: parsed.summary || '',
          workExperience: Array.isArray(parsed.workExperience) ? parsed.workExperience : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
          languages: Array.isArray(parsed.languages) ? parsed.languages : [],
          leadership: Array.isArray(parsed.leadership) ? parsed.leadership : [],
          customHeaders: parsed.customHeaders || {},
          customSections: Array.isArray(parsed.customSections) ? parsed.customSections : []
        };
      }
    } catch (e) {
      // Continue to natural text parsing
    }
  }

  // 2. Line-by-Line Dynamic Parsing
  const rawLines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  let fullName = '';
  let email = '';
  let phone = '';
  let location = '';
  let linkedin = '';

  // Extract contact info from top lines
  for (const line of rawLines.slice(0, 7)) {
    if (!email && line.includes('@')) {
      const match = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (match) email = match[0];
    }
    if (!phone && line.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)) {
      const match = line.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      if (match) phone = match[0];
    }
    if (!linkedin && line.toLowerCase().includes('linkedin')) {
      linkedin = line;
    }
    if (!fullName && !line.includes('@') && !line.includes('http') && !line.match(/\d{3}/) && line.length < 35) {
      fullName = line;
    }
  }

  if (!fullName) fullName = rawLines[0] || 'Uploaded Candidate';
  if (!email) email = 'candidate@uploaded-resume.com';

  // Section Segmentation
  const summaryLines: string[] = [];
  const expLines: string[] = [];
  const eduLines: string[] = [];
  const skillLines: string[] = [];
  const projectLines: string[] = [];
  const certLines: string[] = [];

  let currentSec = 'summary';

  for (const line of rawLines) {
    const lower = line.toLowerCase();
    if (lower.match(/^(experience|work history|employment history|professional experience|work experience)/i)) {
      currentSec = 'experience';
      continue;
    } else if (lower.match(/^(education|academic background|qualifications)/i)) {
      currentSec = 'education';
      continue;
    } else if (lower.match(/^(skills|technical skills|competencies|technologies)/i)) {
      currentSec = 'skills';
      continue;
    } else if (lower.match(/^(projects|key initiatives|key projects)/i)) {
      currentSec = 'projects';
      continue;
    } else if (lower.match(/^(certifications|licenses|credentials)/i)) {
      currentSec = 'certifications';
      continue;
    } else if (lower.match(/^(summary|profile|about me|executive summary)/i)) {
      currentSec = 'summary';
      continue;
    }

    if (currentSec === 'summary') {
      if (!line.includes('@') && !line.match(/^http/) && line !== fullName) {
        summaryLines.push(line);
      }
    } else if (currentSec === 'experience') {
      expLines.push(line);
    } else if (currentSec === 'education') {
      eduLines.push(line);
    } else if (currentSec === 'skills') {
      skillLines.push(line);
    } else if (currentSec === 'projects') {
      projectLines.push(line);
    } else if (currentSec === 'certifications') {
      certLines.push(line);
    }
  }

  // Build Parsed Work Experience Items from extracted lines
  const workExperience: WorkExperienceItem[] = [];
  let currentJob: WorkExperienceItem | null = null;

  for (const l of expLines) {
    if (l.startsWith('-') || l.startsWith('•') || l.startsWith('*')) {
      const bText = l.replace(/^[-•*]\s*/, '').trim();
      if (currentJob) {
        currentJob.bullets.push(bText);
      } else {
        currentJob = {
          id: `exp_${Date.now()}_0`,
          company: 'Target Organization',
          role: 'Professional Role',
          location: '',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bullets: [bText]
        };
        workExperience.push(currentJob);
      }
    } else {
      // Line is likely a Company or Role header
      const parts = l.split(/[-|•–]/).map(p => p.trim());
      currentJob = {
        id: `exp_${Date.now()}_${workExperience.length}`,
        company: parts[0] || 'Organization',
        role: parts[1] || parts[0] || 'Professional Role',
        location: parts[2] || '',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        bullets: []
      };
      workExperience.push(currentJob);
    }
  }

  // Fallback if no experience headers found
  if (workExperience.length === 0 && expLines.length > 0) {
    workExperience.push({
      id: `exp_${Date.now()}_default`,
      company: 'Extracted Professional Experience',
      role: 'Role',
      location: '',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: expLines.slice(0, 6)
    });
  }

  // Build Parsed Education Items
  const education: EducationItem[] = [];
  if (eduLines.length > 0) {
    education.push({
      id: `edu_${Date.now()}`,
      institution: eduLines[0] || 'University',
      degree: eduLines[1] || 'Bachelor Degree',
      fieldOfStudy: 'General Studies',
      startDate: '2018',
      endDate: '2022',
    });
  }

  // Build Parsed Skills Groups
  const parsedSkillsList: string[] = [];
  for (const sLine of skillLines) {
    parsedSkillsList.push(...sLine.split(/[,|•]/).map(s => s.trim()).filter(s => s.length > 1));
  }

  const skills: SkillGroup[] = parsedSkillsList.length > 0
    ? [{ category: 'Extracted Technical & Core Skills', skills: parsedSkillsList }]
    : [];

  // Build Parsed Projects
  const projects: ProjectItem[] = projectLines.length > 0 ? [
    {
      id: `proj_${Date.now()}`,
      title: projectLines[0] || 'Extracted Project',
      description: projectLines.slice(1, 3).join(' ') || '',
      technologies: parsedSkillsList.slice(0, 4),
      bullets: projectLines.slice(1, 4)
    }
  ] : [];

  // Build Parsed Certifications
  const certifications: CertificationItem[] = certLines.map((c, i) => ({
    id: `cert_${Date.now()}_${i}`,
    name: c,
    issuer: 'Issuing Body',
    dateObtained: ''
  }));

  return {
    contactInfo: {
      fullName,
      email,
      phone,
      location,
      linkedin
    },
    summary: summaryLines.join(' ') || 'Professional candidate with parsed experience.',
    workExperience,
    education,
    skills,
    projects,
    certifications,
    achievements: [],
    languages: [],
    leadership: []
  };
}
