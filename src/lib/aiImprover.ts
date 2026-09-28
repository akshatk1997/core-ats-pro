import { BulletAnalysis } from '@/types';

export function analyzeBulletPoint(bulletText: string): BulletAnalysis {
  const safeText = typeof bulletText === 'string' ? bulletText : '';
  const hasMetrics = /\d+(%|\$|k|M|x| hours| days| weeks| engineers| users| campaigns)/i.test(safeText);
  const words = safeText.trim().split(/\s+/);
  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  
  const strongActionVerbs = [
    'spearheaded', 'orchestrated', 'delivered', 'optimized', 'engineered',
    'streamlined', 'pioneered', 'implemented', 'directed', 'championed',
    'accelerated', 'established', 'formulated', 'negotiated', 'surpassed'
  ];
  
  const moderateActionVerbs = [
    'led', 'managed', 'created', 'developed', 'coordinated',
    'designed', 'executed', 'built', 'conducted', 'analyzed', 'organized'
  ];

  let actionVerbStrength: 'weak' | 'moderate' | 'strong' = 'weak';
  if (strongActionVerbs.includes(firstWord)) {
    actionVerbStrength = 'strong';
  } else if (moderateActionVerbs.includes(firstWord)) {
    actionVerbStrength = 'moderate';
  }

  let impactRating = 50;
  if (hasMetrics) impactRating += 30;
  if (actionVerbStrength === 'strong') impactRating += 20;
  else if (actionVerbStrength === 'moderate') impactRating += 10;
  if (words.length >= 10 && words.length <= 25) impactRating += 10;

  impactRating = Math.min(100, Math.max(10, impactRating));

  const issues: string[] = [];
  if (!hasMetrics) {
    issues.push('Missing quantifiable result or impact metric (e.g., %, $, team size, time saved).');
  }
  if (actionVerbStrength === 'weak') {
    issues.push(`Passive or weak opening verb ("${words[0]}"). Use an authoritative action verb.`);
  }
  if (words.length < 8) {
    issues.push('Bullet is too brief to provide sufficient context for ATS keyword matching.');
  } else if (words.length > 30) {
    issues.push('Bullet is overly lengthy and may lose reader attention. Aim for 12-25 words.');
  }

  // Generate suggested alternatives following anti-hallucination principles
  const suggestions = [
    {
      label: 'Impact & Achievement Focused',
      type: 'impact' as const,
      revisedText: generateImpactRevision(bulletText, firstWord, hasMetrics),
      explanation: 'Replaces passive language with strong action verbs while preserving your exact scope. Add your specific metric if available.'
    },
    {
      label: 'Concise & Shortened',
      type: 'shorten' as const,
      revisedText: generateShortenedRevision(bulletText, firstWord),
      explanation: 'Trims unnecessary filler words for high executive scannability.'
    },
    {
      label: 'ATS Keyword Optimized',
      type: 'ats' as const,
      revisedText: generateATSRevision(bulletText),
      explanation: 'Enhances alignment with standard enterprise ATS phrase matching.'
    }
  ];

  return {
    bulletText,
    score: impactRating,
    actionVerbStrength,
    hasMetrics,
    impactRating,
    issues,
    suggestions
  };
}

function generateImpactRevision(text: string, firstWord: string, hasMetrics: boolean): string {
  let cleaned = text.replace(/^(worked on|helped with|responsible for|supported|assisted with)\s+/i, '');
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  if (hasMetrics) {
    return `Spearheaded ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}`;
  } else {
    return `Orchestrated ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)} [Add measurable result if available, e.g., resulting in 20% efficiency gain]`;
  }
}

function generateShortenedRevision(text: string, firstWord: string): string {
  return text
    .replace(/in order to/gi, 'to')
    .replace(/responsible for/gi, 'directed')
    .replace(/worked closely with cross-functional teams to/gi, 'collaborated to')
    .replace(/on a daily basis/gi, 'daily');
}

function generateATSRevision(text: string): string {
  if (!text.toLowerCase().includes('agile') && text.toLowerCase().includes('sprint')) {
    return `${text} within an Agile/Scrum environment`;
  }
  return `Executed ${text.charAt(0).toLowerCase() + text.slice(1)} utilizing industry-standard project frameworks`;
}
