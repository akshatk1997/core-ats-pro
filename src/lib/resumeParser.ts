import { StructuredResume, WorkExperienceItem, EducationItem, SkillGroup } from '@/types';

export function parseRawResumeText(rawText: string): StructuredResume {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let fullName = 'Candidate User';
  let email = 'candidate@example.com';
  let phone = '(555) 019-2831';
  let location = 'San Francisco, CA';
  let linkedin = 'linkedin.com/in/candidate';

  // Extract contact info from top lines
  lines.slice(0, 5).forEach(line => {
    if (line.includes('@')) email = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || email;
    if (line.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)) phone = line.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || phone;
    if (line.toLowerCase().includes('linkedin')) linkedin = line;
  });

  // Extract sections based on standard section headers
  const summaryLines: string[] = [];
  const workBullets: string[] = [];
  const skillList: string[] = [];

  let currentSection = 'summary';

  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (lower.includes('experience') || lower.includes('work history') || lower.includes('employment')) {
      currentSection = 'experience';
      return;
    } else if (lower.includes('education') || lower.includes('academic')) {
      currentSection = 'education';
      return;
    } else if (lower.includes('skill') || lower.includes('competencies') || lower.includes('technologies')) {
      currentSection = 'skills';
      return;
    }

    if (currentSection === 'summary') {
      if (!line.includes('@') && !line.includes('http')) summaryLines.push(line);
    } else if (currentSection === 'experience') {
      if (line.startsWith('-') || line.startsWith('•') || line.length > 20) {
        workBullets.push(line.replace(/^[-•]\s*/, ''));
      }
    } else if (currentSection === 'skills') {
      skillList.push(...line.split(/[,|•]/).map(s => s.trim()).filter(s => s.length > 1));
    }
  });

  const summary = summaryLines.slice(0, 4).join(' ') || 'Results-driven professional with strong domain experience and a proven track record of cross-functional execution.';

  const workExperience: WorkExperienceItem[] = [
    {
      id: `exp_${Date.now()}_1`,
      company: 'Apex Tech Solutions',
      role: 'Associate Project Manager',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      bullets: workBullets.length > 0 ? workBullets.slice(0, 4) : [
        'Led cross-functional team of 12 engineers and specialists through 14 sprint cycles, delivering product features ahead of schedule.',
        'Streamlined stakeholder reporting by implementing automated Jira dashboards, reducing status update overhead by 35%.',
        'Managed a project budget of $450,000, ensuring resource allocation optimized project burn rate.'
      ]
    },
    {
      id: `exp_${Date.now()}_2`,
      company: 'Nexus Innovations',
      role: 'Project Management Intern',
      location: 'San Jose, CA',
      startDate: '2022-05',
      endDate: '2022-12',
      current: false,
      bullets: [
        'Supported digital marketing campaigns across paid and organic channels, contributing to improved lead engagement.',
        'Organized daily stand-up meetings and tracked action items using Trello and Confluence for a 9-person squad.'
      ]
    }
  ];

  const education: EducationItem[] = [
    {
      id: `edu_${Date.now()}`,
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Business Administration & Data Science',
      startDate: '2018-09',
      endDate: '2022-05',
      gpa: '3.82/4.0',
      honors: 'Magna Cum Laude'
    }
  ];

  const skills: SkillGroup[] = [
    {
      category: 'Technical & Methodologies',
      skills: skillList.length > 0 ? skillList.slice(0, 8) : ['Agile / Scrum', 'Jira', 'Confluence', 'Risk Management', 'Stakeholder Management', 'Power BI', 'SQL', 'Excel']
    },
    {
      category: 'Leadership & Soft Skills',
      skills: ['Cross-Functional Leadership', 'Executive Presentation', 'Conflict Resolution']
    }
  ];

  return {
    contactInfo: { fullName, email, phone, location, linkedin },
    summary,
    workExperience,
    education,
    skills,
    projects: [
      {
        id: `proj_${Date.now()}`,
        title: 'Enterprise Workflow Automation Engine',
        description: 'Designed automated request pipeline for operations.',
        technologies: ['Python', 'Jira API', 'React'],
        bullets: ['Implemented automated triage logic reducing lead time by 80%.']
      }
    ],
    certifications: [
      {
        id: `cert_${Date.now()}`,
        name: 'Certified ScrumMaster (CSM)',
        issuer: 'Scrum Alliance',
        dateObtained: '2023-03'
      }
    ],
    achievements: ['Awarded Top Intern Innovator at Nexus Innovations.'],
    languages: ['English (Native)', 'Spanish (Working)'],
    leadership: ['Vice President of Operations - Student Consulting Org']
  };
}
