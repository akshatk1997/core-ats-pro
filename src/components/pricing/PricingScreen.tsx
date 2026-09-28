import React from 'react';
import { UserProfile, ResumeVersion, JobDescription, ApplicationTrackerItem } from '@/types';
import { LiveTrackerScreen } from '../live-tracker/LiveTrackerScreen';

interface PricingScreenProps {
  user: UserProfile;
  activeResume?: ResumeVersion;
  jobDescriptions?: JobDescription[];
  applications?: ApplicationTrackerItem[];
  onNavigate?: (tab: any) => void;
  onUpgradeSuccess?: (plan: any) => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({
  user,
  activeResume,
  jobDescriptions = [],
  applications = [],
  onNavigate = () => {},
}) => {
  // Render full Live System Pulse screen instead of pricing/paywall
  const dummyResume: ResumeVersion = activeResume || {
    id: 'ver_primary',
    name: 'Primary Active Resume',
    targetRole: user.targetRole || 'Project Manager',
    lastUpdated: 'Just now',
    atsScore: 87,
    jobMatchScore: 84,
    isPrimary: true,
    content: {
      contactInfo: { fullName: user.name, email: user.email, phone: '(555) 019-2831', location: 'San Francisco, CA' },
      summary: 'Results-driven professional with strong technical expertise.',
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      leadership: []
    },
    template: 'modern',
    atsBreakdown: {
      overall: 87,
      formattingReadability: 24,
      keywordAlignment: 22,
      jobRequirementAlignment: 17,
      experienceRelevance: 13,
      structureCompleteness: 8,
      contentQuality: 3,
    },
    issues: []
  };

  return (
    <LiveTrackerScreen
      user={user}
      activeResume={dummyResume}
      jobDescriptions={jobDescriptions}
      applications={applications}
      onNavigate={onNavigate}
    />
  );
};
