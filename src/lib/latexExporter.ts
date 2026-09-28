import { StructuredResume } from '@/types';

/**
 * Escapes LaTeX special characters to ensure valid compilation.
 */
export function escapeLaTeX(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Generates clean, ATS-optimized, high-density LaTeX code for A4 paper.
 */
export function generateLaTeXResume(resume: StructuredResume): string {
  const safeResume = resume || {
    contactInfo: { fullName: 'Candidate', email: '', phone: '', location: '' },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };

  const summaryTitle = escapeLaTeX(safeResume.customHeaders?.summary || 'PROFESSIONAL SUMMARY').toUpperCase();
  const expTitle = escapeLaTeX(safeResume.customHeaders?.workExperience || 'WORK EXPERIENCE').toUpperCase();
  const eduTitle = escapeLaTeX(safeResume.customHeaders?.education || 'EDUCATION').toUpperCase();
  const skillsTitle = escapeLaTeX(safeResume.customHeaders?.skills || 'SKILLS & COMPETENCIES').toUpperCase();
  const projectsTitle = escapeLaTeX(safeResume.customHeaders?.projects || 'KEY PROJECTS & INITIATIVES').toUpperCase();

  const name = escapeLaTeX(safeResume.contactInfo?.fullName || 'Candidate');
  const location = escapeLaTeX(safeResume.contactInfo?.location || '');
  const email = escapeLaTeX(safeResume.contactInfo?.email || '');
  const phone = escapeLaTeX(safeResume.contactInfo?.phone || '');
  const linkedin = safeResume.contactInfo?.linkedin ? escapeLaTeX(safeResume.contactInfo.linkedin) : '';
  const portfolio = safeResume.contactInfo?.portfolio ? escapeLaTeX(safeResume.contactInfo.portfolio) : '';
  const github = safeResume.contactInfo?.github ? escapeLaTeX(safeResume.contactInfo.github) : '';

  const contactItems = [location, phone, email, linkedin, portfolio, github].filter(Boolean);

  let latex = `% =================================================================
% ATS-COMPLIANT EXECUTIVE RESUME (LaTeX / A4 Paper Standard)
% Formatted for 100% Full A4 Sheet Page Utilization & High-Density Layout
% =================================================================
\\documentclass[a4paper,10pt]{article}

% --- Packages ---
\\usepackage[utf8]{inputenc}
\\usepackage[a4paper, left=0.5in, right=0.5in, top=0.5in, bottom=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}

% --- Page Setup & Styles ---
\\pagestyle{empty}
\\raggedbottom
\\raggedright

% Hyperlink configuration
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue,
    pdftitle={Resume - ${name}},
    pdfauthor={${name}}
}

% Custom section headings with horizontal rule line
\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0pt}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{8pt}{4pt}

% Bullet list spacing configuration for maximum A4 sheet utilization
\\setlist[itemize]{leftmargin=1.2em, itemsep=2pt, parsep=0pt, topsep=2pt}

\\begin{document}

% --- HEADER SECTION ---
\\begin{center}
    {\\Huge \\textbf{\\MakeUppercase{${name}}}}\\\\ \\vspace{4pt}
    {\\small ${contactItems.join(' ~|~ ')}}
\\end{center}
\\vspace{-4pt}

% --- PROFESSIONAL SUMMARY ---
\\section*{${summaryTitle}}
${escapeLaTeX(safeResume.summary || '')}

% --- WORK EXPERIENCE ---
\\section*{${expTitle}}
`;

  (safeResume.workExperience || []).forEach((exp) => {
    const role = escapeLaTeX(exp.role || '');
    const company = escapeLaTeX(exp.company || '');
    const dateStr = escapeLaTeX(`${exp.startDate || ''} -- ${exp.endDate || ''}`);
    const loc = escapeLaTeX(exp.location || '');

    latex += `\\noindent
\\textbf{${role}} \\hfill \\textbf{${dateStr}}\\\\
\\textit{${company}} \\hfill \\textit{${loc}}
\\begin{itemize}
`;
    (exp.bullets || []).forEach((b) => {
      latex += `  \\item ${escapeLaTeX(b)}\n`;
    });
    latex += `\\end{itemize}\n\\vspace{2pt}\n`;
  });

  // Education Section
  if (safeResume.education && safeResume.education.length > 0) {
    latex += `% --- EDUCATION ---
\\section*{${eduTitle}}
`;
    safeResume.education.forEach((edu) => {
      const degree = escapeLaTeX(edu.degree || '');
      const field = escapeLaTeX(edu.fieldOfStudy || '');
      const inst = escapeLaTeX(edu.institution || '');
      const dateStr = escapeLaTeX(edu.endDate || '');
      const gpa = edu.gpa ? escapeLaTeX(`GPA: ${edu.gpa}`) : '';

      latex += `\\noindent
\\textbf{${degree} in ${field}} \\hfill \\textbf{${dateStr}}\\\\
\\textit{${inst}} ${gpa ? `\\hfill \\textit{${gpa}}` : ''}\\\\
\\vspace{2pt}\n`;
    });
  }

  // Skills Section
  if (safeResume.skills && safeResume.skills.length > 0) {
    latex += `% --- SKILLS & COMPETENCIES ---
\\section*{${skillsTitle}}
\\begin{itemize}[leftmargin=1em, label={}]
`;
    safeResume.skills.forEach((s) => {
      const cat = escapeLaTeX(s.category || '');
      const skList = escapeLaTeX((s.skills || []).join(', '));
      latex += `  \\item \\textbf{${cat}:} ${skList}\n`;
    });
    latex += `\\end{itemize}\n\\vspace{2pt}\n`;
  }

  // Projects Section (if any)
  if (safeResume.projects && safeResume.projects.length > 0) {
    latex += `% --- PROJECTS ---
\\section*{${projectsTitle}}
`;
    safeResume.projects.forEach((proj) => {
      const title = escapeLaTeX(proj.title || '');
      const techs = proj.technologies && proj.technologies.length > 0 ? escapeLaTeX(` (${proj.technologies.join(', ')})`) : '';
      latex += `\\noindent
\\textbf{${title}}${techs}\\\\
${escapeLaTeX(proj.description || '')}
`;
      if (proj.bullets && proj.bullets.length > 0) {
        latex += `\\begin{itemize}\n`;
        proj.bullets.forEach((b) => {
          latex += `  \\item ${escapeLaTeX(b)}\n`;
        });
        latex += `\\end{itemize}\n`;
      }
      latex += `\\vspace{2pt}\n`;
    });
  }

  // Custom Sections (if any)
  if (safeResume.customSections && safeResume.customSections.length > 0) {
    safeResume.customSections.forEach((csec) => {
      const cTitle = escapeLaTeX(csec.title || '').toUpperCase();
      latex += `% --- ${cTitle} ---
\\section*{${cTitle}}
`;
      (csec.items || []).forEach((item) => {
        const itemTitle = escapeLaTeX(item.title || '');
        const sub = item.subtitle ? escapeLaTeX(` - ${item.subtitle}`) : '';
        const date = item.date ? escapeLaTeX(item.date) : '';

        latex += `\\noindent
\\textbf{${itemTitle}}${sub} \\hfill \\textbf{${date}}
`;
        if (item.bullets && item.bullets.length > 0) {
          latex += `\\begin{itemize}\n`;
          item.bullets.forEach((b) => {
            latex += `  \\item ${escapeLaTeX(b)}\n`;
          });
          latex += `\\end{itemize}\n`;
        }
        latex += `\\vspace{2pt}\n`;
      });
    });
  }

  latex += `
\\end{document}
`;

  return latex;
}
