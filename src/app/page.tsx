'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, Cpu, ShieldAlert } from 'lucide-react';

class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Silent Recovery caught exception:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}
import {
  clearAppStorage,
  getStoredUserProfile,
  saveUserProfile,
  getStoredResumeVersions,
  saveResumeVersions,
  getStoredActiveResumeId,
  saveActiveResumeId,
  getStoredJobDescriptions,
  saveJobDescriptions,
  getStoredActiveJobId,
  saveActiveJobId,
  getStoredApplications,
  saveApplications,
} from '@/lib/storage';
import {
  UserProfile,
  ResumeVersion,
  JobDescription,
  ApplicationTrackerItem,
  StructuredResume,
  ResumeIssue,
  ApplicationStatus,
} from '@/types';
import { calculateATSScore } from '@/lib/atsEngine';
import { matchResumeToJob } from '@/lib/jobMatcher';
import { sampleRecommendations, defaultResumeVersion, initialUserProfile, sampleResumeVersions, sampleJobDescription, sampleApplications } from '@/lib/mockData';

// Layouts & Primitives
import { Sidebar, ActiveTab } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { CommandMenu } from '@/components/command-menu/CommandMenu';
import { AuthModal } from '@/components/auth/AuthModal';
import { FileUploaderModal } from '@/components/resume-analyzer/FileUploaderModal';
import { AICareerCopilot } from '@/components/career-copilot/AICareerCopilot';

// Feature Views
import { LandingPage } from '@/components/landing/LandingPage';
import { MainDashboard } from '@/components/dashboard/MainDashboard';
import { ResumeAnalysisScreen } from '@/components/resume-analyzer/ResumeAnalysisScreen';
import { JobMatcherScreen } from '@/components/job-matcher/JobMatcherScreen';
import { AIResumeImproverScreen } from '@/components/improver/AIResumeImproverScreen';
import { ResumeBuilderScreen } from '@/components/resume-builder/ResumeBuilderScreen';
import { CoverLetterScreen } from '@/components/cover-letter/CoverLetterScreen';
import { ApplicationTrackerScreen } from '@/components/application-tracker/ApplicationTrackerScreen';
import { ResumeVersionsScreen } from '@/components/versions/ResumeVersionsScreen';
import { LinkedInOptimizerScreen } from '@/components/linkedin/LinkedInOptimizerScreen';
import { PricingScreen } from '@/components/pricing/PricingScreen';
import { SettingsScreen } from '@/components/settings/SettingsScreen';
import { LiveTrackerScreen } from '@/components/live-tracker/LiveTrackerScreen';
import { AIMockInterviewScreen } from '@/components/interview/AIMockInterviewScreen';
import { PlatformIntroScreen } from '@/components/intro/PlatformIntroScreen';

export default function Home() {
  return (
    <GlobalErrorBoundary>
      <HomeContent />
    </GlobalErrorBoundary>
  );
}

function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const [viewState, setViewState] = useState<'intro' | 'landing' | 'app'>('intro');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Storage State: Deterministic static initial state to guarantee 100% SSR vs Hydration match
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>(sampleResumeVersions);
  const [activeResumeId, setActiveResumeId] = useState<string>(sampleResumeVersions[0]?.id || 'ver_default');
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([sampleJobDescription]);
  const [activeJobId, setActiveJobId] = useState<string>(sampleJobDescription.id);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>(sampleApplications);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Load localStorage ONLY AFTER client hydration completes to prevent React Error #310
  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.remove('dark');

    if (typeof window !== 'undefined' && (window.location.search.includes('clearStorage') || window.location.search.includes('reset'))) {
      clearAppStorage();
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    try {
      const u = getStoredUserProfile();
      if (u) setUser(u);

      const rvs = getStoredResumeVersions();
      if (Array.isArray(rvs) && rvs.length > 0) {
        setResumeVersions(rvs);
        const arid = getStoredActiveResumeId();
        if (arid && rvs.some((v) => v.id === arid)) {
          setActiveResumeId(arid);
        } else if (rvs[0]?.id) {
          setActiveResumeId(rvs[0].id);
        }
      }

      const jds = getStoredJobDescriptions();
      if (Array.isArray(jds) && jds.length > 0) {
        setJobDescriptions(jds);
        const ajid = getStoredActiveJobId();
        if (ajid && jds.some((j) => j.id === ajid)) {
          setActiveJobId(ajid);
        } else if (jds[0]?.id) {
          setActiveJobId(jds[0].id);
        }
      }

      const apps = getStoredApplications();
      if (Array.isArray(apps)) setApplications(apps);
    } catch (err) {
      console.warn('Post-hydration storage load notice:', err);
    }
  }, []);

  // Temporarily enforce Light Mode globally
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const rawActiveResume = (Array.isArray(resumeVersions) && resumeVersions.length > 0)
    ? (resumeVersions.find((v) => v?.id === activeResumeId) || resumeVersions[0] || defaultResumeVersion)
    : defaultResumeVersion;
  const activeJob = (Array.isArray(jobDescriptions) && jobDescriptions.length > 0)
    ? (jobDescriptions.find((j) => j?.id === activeJobId) || jobDescriptions[0] || sampleJobDescription)
    : sampleJobDescription;

  // Guarantee valid content & breakdown
  const activeResumeContent = rawActiveResume?.content || defaultResumeVersion.content;
  const activeResumeBreakdown = rawActiveResume?.atsBreakdown || calculateATSScore(activeResumeContent, activeJob).breakdown;
  const activeResumeIssues = Array.isArray(rawActiveResume?.issues) ? rawActiveResume.issues : calculateATSScore(activeResumeContent, activeJob).issues;

  const activeResume: ResumeVersion = {
    ...rawActiveResume,
    content: activeResumeContent,
    atsBreakdown: activeResumeBreakdown,
    issues: activeResumeIssues,
    atsScore: typeof rawActiveResume?.atsScore === 'number' ? rawActiveResume.atsScore : activeResumeBreakdown.overall,
    jobMatchScore: typeof rawActiveResume?.jobMatchScore === 'number' ? rawActiveResume.jobMatchScore : 84
  };

  // Helper: Recalculate ATS Score for an active resume version against active target job
  const updateActiveResumeContent = (updatedContent: StructuredResume, targetJobParam?: JobDescription) => {
    const currentJob = targetJobParam || activeJob;
    const { breakdown, issues } = calculateATSScore(updatedContent, currentJob);
    const jobMatch = matchResumeToJob(updatedContent, currentJob);

    const updatedVersions = resumeVersions.map((v) => {
      if (v.id === activeResume.id) {
        return {
          ...v,
          content: updatedContent,
          atsScore: breakdown.overall,
          atsBreakdown: breakdown,
          issues,
          jobMatchScore: jobMatch.overallMatch,
          lastUpdated: 'Just now',
        };
      }
      return v;
    });

    setResumeVersions(updatedVersions);
    saveResumeVersions(updatedVersions);
  };

  // Helper: Select Active Target Job globally across platform
  const handleSelectJob = (jobId: string) => {
    const found = jobDescriptions.find((j) => j.id === jobId);
    if (found) {
      setActiveJobId(found.id);
      saveActiveJobId(found.id);
      updateActiveResumeContent(activeResume.content, found);
    }
  };

  // Helper: Save parsed or uploaded Job Description
  const handleSaveJob = (job: JobDescription) => {
    const existingIdx = jobDescriptions.findIndex((j) => j.id === job.id);
    let updated: JobDescription[];
    if (existingIdx >= 0) {
      updated = [...jobDescriptions];
      updated[existingIdx] = job;
    } else {
      updated = [job, ...jobDescriptions];
    }
    setJobDescriptions(updated);
    saveJobDescriptions(updated);
    setActiveJobId(job.id);
    saveActiveJobId(job.id);
    updateActiveResumeContent(activeResume.content, job);
  };

  // Helper: Select Active Resume Version
  const handleSelectActiveResume = (id: string) => {
    setActiveResumeId(id);
    saveActiveResumeId(id);
    const found = resumeVersions.find((v) => v.id === id);
    if (found) {
      updateActiveResumeContent(found.content, activeJob);
    }
  };

  // Helper: Update single bullet point
  const handleUpdateBullet = (expId: string, bulletIndex: number, newText: string) => {
    const updatedWorkExp = activeResume.content.workExperience.map((exp) => {
      if (exp.id === expId) {
        const newBullets = [...exp.bullets];
        newBullets[bulletIndex] = newText;
        return { ...exp, bullets: newBullets };
      }
      return exp;
    });

    const updatedContent: StructuredResume = {
      ...activeResume.content,
      workExperience: updatedWorkExp,
    };

    updateActiveResumeContent(updatedContent, activeJob);
  };

  // Helper: Upload new resume
  const handleUploadComplete = (newContent: StructuredResume, fileName: string) => {
    const { breakdown, issues } = calculateATSScore(newContent, activeJob);
    
    // Synchronize parsed candidate contact info into active user profile
    if (newContent.contactInfo?.fullName && newContent.contactInfo.fullName !== 'Candidate Name') {
      const updatedUser: UserProfile = {
        ...user,
        name: newContent.contactInfo.fullName,
        email: newContent.contactInfo.email || user.email,
        linkedInUrl: newContent.contactInfo.linkedin || user.linkedInUrl,
      };
      setUser(updatedUser);
      saveUserProfile(updatedUser);
    }

    const newVer: ResumeVersion = {
      id: `ver_${Date.now()}`,
      name: fileName.replace(/\.[^/.]+$/, ''),
      targetRole: activeJob.title || user.targetRole,
      lastUpdated: 'Just now',
      atsScore: breakdown.overall,
      jobMatchScore: 84,
      isPrimary: false,
      content: newContent,
      issues,
      atsBreakdown: breakdown,
      template: 'modern',
    };

    const updatedVersions = [newVer, ...resumeVersions];
    setResumeVersions(updatedVersions);
    saveResumeVersions(updatedVersions);
    setActiveResumeId(newVer.id);
    saveActiveResumeId(newVer.id);
    setActiveTab('analyzer');
  };

  // Helper: Add application card
  const handleAddApplication = (app: ApplicationTrackerItem) => {
    const updated = [app, ...applications];
    setApplications(updated);
    saveApplications(updated);
  };

  // Helper: Update application status
  const handleUpdateApplicationStatus = (id: string, status: ApplicationStatus) => {
    const updated = applications.map((a) => (a.id === id ? { ...a, status, updatedAt: 'Just now' } : a));
    setApplications(updated);
    saveApplications(updated);
  };

  // Helper: Delete application
  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter((a) => a.id !== id);
    setApplications(updated);
    saveApplications(updated);
  };

  // Helper: Delete resume version
  const handleDeleteVersion = (id: string) => {
    const updated = resumeVersions.filter((v) => v.id !== id);
    const finalVersions = updated.length > 0 ? updated : [defaultResumeVersion];
    setResumeVersions(finalVersions);
    saveResumeVersions(finalVersions);
    if (activeResumeId === id || !finalVersions.some(v => v.id === activeResumeId)) {
      setActiveResumeId(finalVersions[0].id);
      saveActiveResumeId(finalVersions[0].id);
      updateActiveResumeContent(finalVersions[0].content, activeJob);
    }
  };

  const [isGlassTransitioning, setIsGlassTransitioning] = useState(false);
  const [glassTransitionLabel, setGlassTransitionLabel] = useState('Entering Workspace Studio 🚀');

  const triggerGlassTransition = (targetTab?: ActiveTab, label: string = 'Entering Workspace Studio 🚀') => {
    setGlassTransitionLabel(label);
    setIsGlassTransitioning(true);
    setTimeout(() => {
      setViewState('app');
      if (targetTab) {
        setActiveTab(targetTab);
      }
    }, 320);
    setTimeout(() => {
      setIsGlassTransitioning(false);
    }, 750);
  };

  if (viewState === 'intro') {
    return (
      <>
        {isGlassTransitioning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-3xl bg-slate-950/70 text-white transition-all duration-500 animate-glass-portal">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-2xl backdrop-blur-2xl flex flex-col items-center space-y-4 animate-scale-up max-w-sm mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/40 animate-pulse">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white tracking-tight">
                  {glassTransitionLabel}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Initializing live ATS diagnostic & workflow studio...
                </p>
              </div>
              <div className="w-52 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 via-sky-400 to-emerald-400 rounded-full w-full animate-pulse" />
              </div>
            </div>
          </div>
        )}
        <PlatformIntroScreen
          user={user}
          onEnterWorkspace={() => triggerGlassTransition('dashboard', 'Entering Workspace Studio 🚀')}
          onNavigate={(tab) => triggerGlassTransition(tab, 'Launching Live Feature Studio...')}
        />
      </>
    );
  }

  if (viewState === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => {
          setViewState('app');
          setActiveTab('dashboard');
        }}
        onLogin={() => setIsAuthModalOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased selection:bg-brand-500 selection:text-white">
      {/* Collapsible Left Sidebar (Desktop) */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'career-tools') {
              setIsCopilotOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          user={user}
        />
      </div>

      {/* Main Right Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 pb-16 md:pb-0 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Top Header Navigation */}
        <Header
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
          onOpenUploadModal={() => setIsFileUploaderOpen(true)}
          onOpenUpgradeModal={() => setActiveTab('upgrade')}
        />

        {/* Dynamic Route View Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <MainDashboard
              user={user}
              activeResume={activeResume}
              jobDescriptions={jobDescriptions}
              applications={applications}
              recommendations={sampleRecommendations}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'analyzer' && (
            <ResumeAnalysisScreen
              activeResume={activeResume}
              targetJob={activeJob}
              onImproveIssue={(iss) => setActiveTab('improver')}
              onReAnalyze={() => updateActiveResumeContent(activeResume.content, activeJob)}
              onOpenUpload={() => setIsFileUploaderOpen(true)}
            />
          )}

          {activeTab === 'job-matcher' && (
            <JobMatcherScreen
              activeResume={activeResume}
              jobDescriptions={jobDescriptions}
              onSaveJob={handleSaveJob}
              onOptimizeForJob={(job) => {
                handleSaveJob(job);
                setActiveTab('analyzer');
              }}
            />
          )}

          {activeTab === 'my-resumes' && (
            <ResumeVersionsScreen
              versions={resumeVersions}
              activeVersionId={activeResumeId}
              onSelectActiveVersion={handleSelectActiveResume}
              onUploadVersion={handleUploadComplete}
              onDeleteVersion={handleDeleteVersion}
              onCreateVersion={(name, role) => {}}
            />
          )}

          {activeTab === 'builder' && (
            <ResumeBuilderScreen
              activeResume={activeResume}
              onUpdateResumeContent={(updated) => updateActiveResumeContent(updated, activeJob)}
            />
          )}

          {activeTab === 'improver' && (
            <AIResumeImproverScreen
              activeResume={activeResume}
              onUpdateBullet={handleUpdateBullet}
            />
          )}

          {activeTab === 'cover-letter' && (
            <CoverLetterScreen
              activeResume={activeResume}
              jobDescriptions={jobDescriptions}
              activeJob={activeJob}
              onSaveToTracker={handleAddApplication}
              onNavigateToTracker={() => setActiveTab('tracker')}
            />
          )}

          {activeTab === 'linkedin' && (
            <LinkedInOptimizerScreen
              activeResume={activeResume}
              activeJob={activeJob}
            />
          )}

          {activeTab === 'tracker' && (
            <ApplicationTrackerScreen
              applications={applications}
              resumeVersions={resumeVersions}
              onAddApplication={handleAddApplication}
              onUpdateStatus={handleUpdateApplicationStatus}
              onDeleteApplication={handleDeleteApplication}
            />
          )}

          {activeTab === 'mock-interview' && (
            <AIMockInterviewScreen
              user={user}
              activeResume={activeResume}
              jobDescriptions={jobDescriptions}
              activeJob={activeJob}
            />
          )}

          {activeTab === 'platform-guide' && (
            <PlatformIntroScreen
              user={user}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {(activeTab === 'live-pulse' || activeTab === 'upgrade') && (
            <LiveTrackerScreen
              user={user}
              activeResume={activeResume}
              jobDescriptions={jobDescriptions}
              applications={applications}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              user={user}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onUpdateUser={(updated) => {
                setUser(updated);
                saveUserProfile(updated);
              }}
              jobDescriptions={jobDescriptions}
              onSaveJob={handleSaveJob}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Slide-Over AI Career Copilot Drawer */}
      <AICareerCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeResume={activeResume}
        targetJob={activeJob}
      />

      {/* Command Palette Modal (Cmd + K) */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onSelectAction={(actionId) => setActiveTab(actionId as ActiveTab)}
      />

      {/* Resume File Upload Modal */}
      <FileUploaderModal
        isOpen={isFileUploaderOpen}
        onClose={() => setIsFileUploaderOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Auth & Onboarding Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          saveUserProfile(u);
        }}
      />
    </div>
  );
}
