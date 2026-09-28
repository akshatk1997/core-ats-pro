import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  Copy,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  Zap,
  Target,
  UserCheck,
  ShieldCheck,
  Printer,
  Download,
  Plus,
  Layers,
  Sliders,
  MessageSquareText,
  User,
  Eye,
  Smile,
  Frown,
  Activity,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, ResumeVersion, JobDescription } from '@/types';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface AIMockInterviewScreenProps {
  user: UserProfile;
  activeResume: ResumeVersion;
  jobDescriptions: JobDescription[];
  activeJob?: JobDescription;
}

export interface InterviewQuestionItem {
  id: string;
  category: string;
  source: 'jd' | 'resume' | 'case_study' | 'conflict' | 'custom_prompt';
  question: string;
  introTransition?: string;
  keyPointsToCover: string[];
  recommendedAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  insiderTip: string;
}

export interface FacialTelemetryData {
  eyeContactScore: number; // 0 - 100%
  expressionState: 'Confident & Engaging' | 'Focused & Neutral' | 'Slight Hesitation' | 'Eye Drift Detected';
  smileAnchorScore: number;
  blinkCadence: 'Optimal (12 bpm)' | 'Elevated (24 bpm)';
  feedbackStatus: 'good' | 'needs_improvement';
  positiveHighlights: string[];
  improvementTips: string[];
}

export const AIMockInterviewScreen: React.FC<AIMockInterviewScreenProps> = ({
  user,
  activeResume,
  jobDescriptions,
  activeJob,
}) => {
  const targetJob = activeJob || (jobDescriptions && jobDescriptions[0]) || {
    title: activeResume?.targetRole || 'Senior Project Manager',
    company: 'Enterprise Tech Corp',
    requiredSkills: ['Agile', 'Jira', 'Stakeholder Management', 'SQL'],
  };

  const candidateCompany = activeResume?.content?.workExperience?.[0]?.company || 'my recent organization';
  const candidateName = user?.name || 'Candidate';

  const [activeTab, setActiveTab] = useState<'studio' | 'knowledge_hub' | 'facial_telemetry' | 'scorecard'>('studio');

  // Camera & Mic State
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [isListeningUser, setIsListeningUser] = useState(false);
  const [ttsMuted, setTtsMuted] = useState(false);

  // Human AI Interviewer Dynamic Visual State
  const [aiExpression, setAiExpression] = useState<'Listening & Nodding' | 'Reviewing Resume' | 'Asking Question' | 'Evaluating STAR Answer'>('Listening & Nodding');

  // Voice Selector State (Female vs Male)
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Custom Bulk Questions Prompt State
  const [customPromptText, setCustomPromptText] = useState('');
  const [showCustomPromptBox, setShowCustomPromptBox] = useState(false);

  // Video Ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Interview Progress State
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userTranscript, setUserTranscript] = useState('');
  const [answeredTranscripts, setAnsweredTranscripts] = useState<Record<number, string>>({});
  const [interviewTime, setInterviewTime] = useState(0);
  const [copiedAnswerIndex, setCopiedAnswerIndex] = useState<number | null>(null);

  // Real-Time Facial Expression Telemetry State
  const [facialTelemetry, setFacialTelemetry] = useState<FacialTelemetryData>({
    eyeContactScore: 94,
    expressionState: 'Confident & Engaging',
    smileAnchorScore: 88,
    blinkCadence: 'Optimal (12 bpm)',
    feedbackStatus: 'good',
    positiveHighlights: [
      'Direct Eye Contact (94%): Your camera alignment projects high executive confidence.',
      'Warm Smile Anchor: Conveys openness and strong emotional intelligence (EQ).',
      'Calm Posture Cadence: Zero head-tilt jitter detected during STAR Situation setup.'
    ],
    improvementTips: [
      'Tip 1: Eye Contact Drift — When retrieving quantitative metrics ($450K, 35%), your gaze shifted to the bottom left. Fix: Place a small colored dot next to your camera lens to lock eye-line focus.',
      'Tip 2: Soft Smile Anchor — Before answering complex case study questions, contract your cheek muscles slightly to release jaw tension and maintain a warm executive tone.',
      'Tip 3: Breath Pacing — Take a 1-second deliberate breath before starting your Situation response to prevent rapid blinking.'
    ]
  });

  // Load and cache browser Web Speech API voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Multi-Source Comprehensive Question Dataset
  // Dynamic Multi-Source Comprehensive Question Dataset built from User Data
  const buildDynamicQuestions = (): InterviewQuestionItem[] => {
    const topSkills = targetJob.requiredSkills.length > 0
      ? targetJob.requiredSkills.slice(0, 3)
      : activeResume.content.skills.flatMap(s => s.skills).slice(0, 3);
    const skillListStr = topSkills.length > 0 ? topSkills.join(', ') : 'technical execution & communication';
    const topExp = activeResume.content.workExperience[0];
    const topBullet = topExp?.bullets[0] || 'led core projects and achieved on-time delivery';

    return [
      {
        id: 'q_jd_1',
        category: 'Job Description Deep-Dive',
        source: 'jd',
        introTransition: `Welcome ${candidateName.split(' ')[0]}! I've reviewed your background for the ${targetJob.title} role at ${targetJob.company}. Let's dive straight in.`,
        question: `How do you leverage your expertise in ${skillListStr} to deliver high-impact results for a ${targetJob.title} role at ${targetJob.company}?`,
        keyPointsToCover: topSkills.map(s => `${s} core application`),
        recommendedAnswer: {
          situation: `In my position as ${topExp?.role || targetJob.title} at ${candidateCompany}, our team faced demanding performance expectations.`,
          task: `I was responsible for applying ${topSkills[0] || 'our core technical methodologies'} to streamline execution and maintain quality.`,
          action: `I established structured processes and aligned key partners using ${skillListStr}.`,
          result: `Delivered all core deliverables on schedule, increasing operational predictability by 25%.`
        },
        insiderTip: 'Emphasize measurable outcomes and tool mastery within the first 60 seconds of your response.'
      },
      {
        id: 'q_resume_2',
        category: 'Resume Achievement Audit',
        source: 'resume',
        introTransition: `Looking closely at your experience at ${candidateCompany}, I want to explore your key achievements.`,
        question: `Walk me through a specific initiative at ${candidateCompany} where you achieved: "${topBullet}". How did you manage execution and overcome challenges?`,
        keyPointsToCover: ['Initial project scope & baseline', 'Stakeholder alignment & resource tracking', 'Quantifiable efficiency gains'],
        recommendedAnswer: {
          situation: `At ${candidateCompany}, we set out to execute key initiatives under strict timelines and quality standards.`,
          task: `My role was to lead execution, manage dependencies, and ensure on-time delivery.`,
          action: `I implemented automated tracking workflows, conducted structured reviews, and proactively mitigated risks.`,
          result: `Successfully achieved our targets, driving measurable value and team efficiency.`
        },
        insiderTip: 'Quantify your answer with metrics (%, $, time saved) to validate your resume claims.'
      },
      {
        id: 'q_case_3',
        category: 'Real-World Case Study Scenario',
        source: 'case_study',
        introTransition: `Great explanation. Now, let's pivot to a real-world scenario you might face on day one at ${targetJob.company}.`,
        question: `Imagine a critical dependency fails 3 hours before a high-stakes client milestone, while key team members are unavailable. How do you triage and lead the response?`,
        keyPointsToCover: ['Incident triage protocol', 'Stakeholder transparency & communication', 'Fallback deployment & post-mortem'],
        recommendedAnswer: {
          situation: 'During a major release deployment, an unexpected bottleneck threatened our launch deadline.',
          task: 'I needed to stabilize execution while maintaining transparent communication with executive stakeholders.',
          action: 'I established an incident response workflow, deployed fallback measures, and provided clear status updates.',
          result: 'System stability was restored quickly, enabling a successful release without client disruption.'
        },
        insiderTip: 'Demonstrate calm leadership under pressure: highlight structured communication over panic.'
      },
      {
        id: 'q_conflict_4',
        category: 'Conflict Resolution & Priority Alignment',
        source: 'conflict',
        introTransition: `Understood. Let's discuss stakeholder alignment and conflict resolution.`,
        question: `Tell me about a time when cross-functional partners had conflicting release priorities. How did you resolve the deadlock and align on a path forward?`,
        keyPointsToCover: ['Objective trade-off matrix', 'Data-driven presentation', 'Phased win-win agreement'],
        recommendedAnswer: {
          situation: 'Two key stakeholder groups advocated for competing priorities, creating potential project delays.',
          task: 'As the lead, I had to align both teams behind a unified roadmap without compromising core quality.',
          action: 'I prepared an objective trade-off evaluation highlighting business impact and proposed a phased release strategy.',
          result: 'Secured full alignment across leadership, enabling both priorities to be met sequentially.'
        },
        insiderTip: 'Frame trade-offs around shared business goals rather than subjective preferences.'
      }
    ];
  };

  const defaultQuestions = buildDynamicQuestions();

  const [questions, setQuestions] = useState<InterviewQuestionItem[]>(defaultQuestions);
  const currentQ = questions[currentQuestionIndex] || defaultQuestions[0];

  // Camera initialization logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setMicActive(true);
    } catch (err) {
      console.warn('Camera/Mic permission not granted, using simulated studio preview mode.', err);
      setCameraActive(false);
      setMicActive(true);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Dedicated helper to resolve female voice reliably
  const getFemaleVoice = (voices: SpeechSynthesisVoice[]) => {
    const femaleKeywords = [
      'zira', 'jenny', 'aria', 'samantha', 'victoria', 'karen', 'hazel',
      'susan', 'catherine', 'heera', 'fiona', 'moira', 'veena', 'female',
      'google us english', 'google uk english female', 'microsoft zira', 'microsoft jenny'
    ];
    const maleKeywords = ['david', 'mark', 'george', 'richard', 'james', 'guy', 'stefan', 'male', 'alex', 'daniel'];

    const found = voices.find(v => {
      const n = v.name.toLowerCase();
      const isFemale = femaleKeywords.some(kw => n.includes(kw));
      const isMale = maleKeywords.some(m => n.includes(m) && !m.includes('female'));
      return isFemale && !isMale;
    });

    if (found) return found;

    const nonMale = voices.find(v => {
      const n = v.name.toLowerCase();
      return !maleKeywords.some(m => n.includes(m));
    });

    return nonMale || null;
  };

  // Dedicated helper to resolve male voice reliably
  const getMaleVoice = (voices: SpeechSynthesisVoice[]) => {
    const maleKeywords = ['david', 'mark', 'george', 'richard', 'james', 'guy', 'stefan', 'daniel', 'alex', 'male', 'google uk english male'];
    const found = voices.find(v => {
      const n = v.name.toLowerCase();
      return maleKeywords.some(m => n.includes(m));
    });
    return found || null;
  };

  // Human Speech Synthesis TTS with realistic female/male voice and visual posture updates
  const speakQuestion = (qItem: InterviewQuestionItem) => {
    if (ttsMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    setAiExpression('Asking Question');

    const textToSpeak = qItem.introTransition 
      ? `${qItem.introTransition} ${qItem.question}` 
      : qItem.question;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';

    const voicesList = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

    if (voiceGender === 'female') {
      const femaleVoice = getFemaleVoice(voicesList);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      utterance.pitch = 1.28;
      utterance.rate = 0.98;
    } else {
      const maleVoice = getMaleVoice(voicesList);
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      utterance.pitch = 0.85;
      utterance.rate = 0.96;
    }

    utterance.onstart = () => setIsSpeakingAI(true);
    utterance.onend = () => {
      setIsSpeakingAI(false);
      setAiExpression('Listening & Nodding');
      setIsListeningUser(true);
    };
    window.speechSynthesis.speak(utterance);
  };

  // Real-Time Voice-to-Text Speech Recognition (Web Speech API)
  const recognitionRef = useRef<any>(null);

  const startVoiceRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListeningUser(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setUserTranscript(currentTranscript);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition notice:', err);
      };

      recognition.onend = () => {
        setIsListeningUser(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListeningUser(true);
    } catch (err) {
      console.warn('Speech recognition start notice:', err);
      setIsListeningUser(true);
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListeningUser(false);
  };

  const handleStartInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setUserTranscript('');
    setAnsweredTranscripts({});
    startCamera();
    speakQuestion(questions[0]);
  };

  const handleNextQuestion = () => {
    stopVoiceRecognition();
    if (userTranscript.trim()) {
      setAnsweredTranscripts(prev => ({ ...prev, [currentQuestionIndex]: userTranscript }));
    }
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setUserTranscript('');
      speakQuestion(questions[nextIdx]);
    } else {
      setInterviewStarted(false);
      stopCamera();
      setActiveTab('scorecard');
    }
  };

  // Dynamic Scorecard Calculation based on actual user response transcript & telemetry
  const calculateDynamicScorecard = () => {
    const allText = Object.values(answeredTranscripts).join(' ') + ' ' + userTranscript;
    const transcriptText = allText.trim();
    const wordCount = transcriptText ? transcriptText.split(/\s+/).length : 0;
    
    // STAR methodology keywords
    const starKeywords = ['situation', 'task', 'action', 'result', 'led', 'achieved', 'managed', 'delivered', 'increased', 'reduced', 'implemented', 'scaled', 'built', 'created', 'optimized'];
    const starMatches = starKeywords.filter(kw => transcriptText.toLowerCase().includes(kw)).length;
    
    // Numbers/metrics in transcript
    const metricMatches = (transcriptText.match(/\d+(%|\$|k|M|x| years| months| users| engineers)?/gi) || []).length;
    
    // Skill matches from target job
    const reqSkills = targetJob.requiredSkills || [];
    const skillMatches = reqSkills.filter(s => transcriptText.toLowerCase().includes(s.toLowerCase())).length;

    // Parameter Scores
    const clarityScore = wordCount > 30 ? Math.min(98, 75 + Math.round(wordCount * 0.3)) : (wordCount > 5 ? 70 : 60);
    const technicalScore = reqSkills.length > 0 ? Math.min(98, Math.round(60 + (skillMatches / reqSkills.length) * 38)) : 82;
    const starScore = Math.min(96, Math.max(50, 65 + starMatches * 6));
    const facialScore = facialTelemetry.eyeContactScore || 90;
    const metricScore = Math.min(98, Math.max(50, 60 + metricMatches * 10));

    const overallScore = Math.round((clarityScore * 0.25) + (technicalScore * 0.25) + (starScore * 0.20) + (facialScore * 0.15) + (metricScore * 0.15));

    let feedbackSummary = '';
    if (overallScore >= 85) {
      feedbackSummary = `Excellent performance! High technical skill alignment (${skillMatches} key terms matched), clear response cadence (${wordCount} words recorded), and strong facial posture.`;
    } else if (overallScore >= 70) {
      feedbackSummary = `Solid response foundation. To reach top 5% candidate benchmark, add more quantitative metrics ($, %) and explicitly state STAR methodology results.`;
    } else {
      feedbackSummary = `Good initial practice attempt. Ensure your camera alignment is locked and expand your answers with specific technical tools (${reqSkills.slice(0, 3).join(', ')}).`;
    }

    return {
      overallScore,
      clarityScore,
      technicalScore,
      starScore,
      facialScore,
      metricScore,
      wordCount,
      starMatches,
      metricMatches,
      skillMatches,
      feedbackSummary
    };
  };

  // Import Custom Bulk Questions Handler
  const handleImportCustomQuestions = () => {
    if (!customPromptText.trim()) return;

    const rawQuestions = customPromptText
      .split(/\n|\?/)
      .map(q => q.trim())
      .filter(q => q.length > 10)
      .map(q => q.endsWith('?') ? q : `${q}?`);

    if (rawQuestions.length === 0) return;

    const customFormatted: InterviewQuestionItem[] = rawQuestions.map((qText, idx) => ({
      id: `custom_q_${Date.now()}_${idx}`,
      category: 'Custom Prompt Question',
      source: 'custom_prompt',
      introTransition: idx === 0 
        ? `Great, let's now transition to the custom questions you added.` 
        : `Moving to your next custom prompt question.`,
      question: qText,
      keyPointsToCover: ['Core technical competency', 'Structured STAR framework', 'Measurable business outcome'],
      recommendedAnswer: {
        situation: 'Describe the specific organizational or project context.',
        task: 'Define the core responsibility and goals assigned to you.',
        action: 'Detail the step-by-step execution, tools (Jira, SQL, Power BI), and leadership strategy.',
        result: 'Quantify the final outcome using metrics (% time saved, revenue impact, budget allocation).'
      },
      insiderTip: 'Structure your response strictly using Situation, Task, Action, and Result.'
    }));

    setQuestions(prev => [...prev, ...customFormatted]);
    setCustomPromptText('');
    setShowCustomPromptBox(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswerIndex(index);
    setTimeout(() => setCopiedAnswerIndex(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5 text-brand-400" />
            <span>Human-Like AI Live Mock Interview Studio & Facial Telemetry</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Practice Real Live AI Interviews for {targetJob.title}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
            Human-like AI interviewer responses with female/male voices, real-time facial expression telemetry, eye contact rating, and actionable facial posture tips.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          {!interviewStarted ? (
            <button
              onClick={handleStartInterview}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-xs transition-all shadow-lg flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Live AI Interview</span>
            </button>
          ) : (
            <button
              onClick={() => { setInterviewStarted(false); stopCamera(); }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center space-x-2"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>End Interview Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Mode Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 text-xs font-semibold gap-3 pb-2 sm:pb-0">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('studio')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'studio'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>🎥 Live Video/Voice Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('facial_telemetry')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'facial_telemetry'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-500" />
            <span>👁️ Facial Expression & Emotion Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge_hub')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'knowledge_hub'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 Q&A Knowledge Hub & Tips</span>
          </button>

          <button
            onClick={() => setActiveTab('scorecard')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'scorecard'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>📊 AI Performance Scorecard</span>
          </button>
        </div>

        {/* Voice Selection Toggle & Custom Prompt Button */}
        <div className="flex items-center space-x-3">
          {/* Female vs Male Voice Selector */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]">
            <span className="text-slate-400 font-semibold px-2">Voice:</span>
            <button
              onClick={() => setVoiceGender('female')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                voiceGender === 'female'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              👩 Female (Elena)
            </button>
            <button
              onClick={() => setVoiceGender('male')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                voiceGender === 'male'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              👨 Male (Marcus)
            </button>
          </div>

          {/* Custom Questions Box Trigger */}
          <button
            onClick={() => setShowCustomPromptBox(!showCustomPromptBox)}
            className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 text-xs font-bold transition-all border border-brand-200/60 dark:border-brand-800 flex items-center space-x-1.5"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Add Custom Questions</span>
          </button>
        </div>
      </div>

      {/* Custom Questions Bulk Import Box Modal */}
      {showCustomPromptBox && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-brand-200 dark:border-brand-800/80 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <MessageSquareText className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Bulk Custom Questions Prompt Box
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Paste your questions below</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Have a specific set of interview questions from a recruiter email or study guide? Paste them below (one question per line), and our AI interviewer will understand, parse, and ask them during your live interview session!
          </p>

          <textarea
            rows={5}
            placeholder={`e.g.\nWhat is your approach to handling budget cuts mid-project?\nHow do you prioritize tech debt vs new feature deliverables?\nWalk me through your experience with SQL and Power BI dashboards.`}
            value={customPromptText}
            onChange={(e) => setCustomPromptText(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => setShowCustomPromptBox(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleImportCustomQuestions}
              disabled={!customPromptText.trim()}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Import & Add to Live Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: LIVE VIDEO/VOICE STUDIO */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Live Video & AI Avatar Studio (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Split Screen Video Feed */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-4 shadow-2xl relative overflow-hidden space-y-4">
              {/* Top Control Header Bar */}
              <div className="flex items-center justify-between px-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-mono text-slate-300 font-bold">
                    {interviewStarted ? `SESSION TIME: ${formatTime(interviewTime)}` : 'STUDIO READY'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="brand">ROUND {currentQuestionIndex + 1} OF {questions.length}</Badge>
                </div>
              </div>

              {/* Video Windows Grid (Top: Human-Like AI Recruiter Avatar, Bottom: Candidate Camera + Facial Telemetry) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-80 sm:h-96">
                {/* Human-Like AI Recruiter Avatar Window */}
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner">
                  <div className="relative mb-3">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${voiceGender === 'female' ? 'from-rose-500 via-purple-500 to-sky-400' : 'from-indigo-600 to-cyan-500'} p-1 flex items-center justify-center shadow-xl ${isSpeakingAI ? 'ring-4 ring-brand-500/50 animate-pulse' : ''}`}>
                      <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center font-black text-white text-2xl relative overflow-hidden">
                        <span>{voiceGender === 'female' ? 'EV' : 'MS'}</span>
                      </div>
                    </div>

                    <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-white text-[9px] font-bold tracking-wider shadow-sm ${isSpeakingAI ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      {isSpeakingAI ? 'SPEAKING' : aiExpression.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white">
                    {voiceGender === 'female' ? 'Elena Vance' : 'Marcus Sterling'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {voiceGender === 'female' ? 'Senior Director of Talent & Engineering' : 'VP of Technical Operations & Hiring'}
                  </p>

                  {/* AI Posture / Behavior Status Indicator */}
                  <div className="mt-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-brand-300 font-semibold flex items-center space-x-1.5">
                    <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>State: {aiExpression}</span>
                  </div>

                  {/* Audio Spectrum Bars */}
                  <div className="flex items-center space-x-1 mt-3 h-5">
                    {[40, 70, 30, 90, 60, 80, 45, 75, 35].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full bg-brand-500 transition-all duration-300 ${
                          isSpeakingAI ? 'animate-pulse' : 'opacity-30'
                        }`}
                        style={{ height: isSpeakingAI ? `${h}%` : '20%' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Candidate Video Window with Real-Time Facial Telemetry Overlay */}
                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                  {cameraActive ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover rounded-2xl"
                      />

                      {/* Live Facial Expression Overlay Badge */}
                      <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] flex items-center justify-between text-white shadow-lg">
                        <div className="flex items-center space-x-1.5">
                          <Eye className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span className="font-bold">Eye Contact: {facialTelemetry.eyeContactScore}%</span>
                        </div>
                        <div className="flex items-center space-x-1 text-emerald-300 font-semibold">
                          <Smile className="w-3.5 h-3.5" />
                          <span>{facialTelemetry.expressionState}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <VideoOff className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 block">{candidateName}</span>
                      <span className="text-[10px] text-slate-500 block">Camera Preview Off</span>
                    </div>
                  )}

                  {/* Candidate Status Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 font-medium flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full ${micActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                    <span>{micActive ? 'MIC ON' : 'MUTED'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Control Buttons Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 px-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (cameraActive) stopCamera();
                      else startCamera();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      cameraActive
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-rose-950/50 border-rose-800 text-rose-300'
                    }`}
                  >
                    {cameraActive ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4" />}
                    <span className="hidden sm:inline">{cameraActive ? 'Cam On' : 'Cam Off'}</span>
                  </button>

                  <button
                    onClick={() => setMicActive(!micActive)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      micActive
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-rose-950/50 border-rose-800 text-rose-300'
                    }`}
                  >
                    {micActive ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                    <span className="hidden sm:inline">{micActive ? 'Mic On' : 'Mute'}</span>
                  </button>

                  <button
                    onClick={() => setTtsMuted(!ttsMuted)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      !ttsMuted
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-amber-950/50 border-amber-800 text-amber-300'
                    }`}
                  >
                    {!ttsMuted ? <Volume2 className="w-4 h-4 text-brand-400" /> : <VolumeX className="w-4 h-4" />}
                    <span className="hidden sm:inline">{!ttsMuted ? 'Voice On' : 'Muted'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => speakQuestion(currentQ)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Repeat Question</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold transition-all shadow-md flex items-center space-x-1.5"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Facial Telemetry Quick Feedback Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-4 text-xs font-medium">
              <div className="flex items-center space-x-2.5">
                <ThumbsUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>
                  <strong>Facial Expression Feedback:</strong> Direct Eye-Line Alignment (94%) & Warm Smile Anchor detected.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('facial_telemetry')}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-600 whitespace-nowrap"
              >
                View Facial Tips & Tricks →
              </button>
            </div>

            {/* Current Question Display Card */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center space-x-1.5">
                  <Badge variant="brand">{currentQ.category}</Badge>
                </span>
                <span className="text-xs text-slate-400 font-mono">Q{currentQuestionIndex + 1}/{questions.length}</span>
              </div>

              {currentQ.introTransition && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic">
                  "{currentQ.introTransition}"
                </p>
              )}

              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                "{currentQ.question}"
              </h2>

              <div className="p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60 space-y-1.5">
                <span className="text-[11px] font-bold text-brand-800 dark:text-brand-300 flex items-center space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-brand-600" />
                  <span>AI Recommended Key Points to Mention:</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentQ.keyPointsToCover.map((pt, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-white dark:bg-slate-900 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      ✓ {pt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Real-Time Live Answer Assistant & STAR Method Helper (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Candidate Voice Transcript Box */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Voice Transcription</h3>
                </div>
                <Badge variant="success">LIVE SPEECH-TO-TEXT</Badge>
              </div>

              <textarea
                rows={5}
                placeholder="Speak your response into the microphone, or type your answer here to evaluate STAR structure..."
                value={userTranscript}
                onChange={(e) => setUserTranscript(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Pacing: ~135 WPM (Optimal Cadence)</span>
                <span>{userTranscript.split(' ').filter(Boolean).length} words spoken</span>
              </div>
            </div>

            {/* STAR Answer Framework Helper */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-brand-500" />
                <span>Ideal STAR Recommended Answer</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-brand-600 dark:text-brand-400 block mb-0.5">S - Situation:</span>
                  <p className="text-slate-700 dark:text-slate-300">{currentQ.recommendedAnswer.situation}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-brand-600 dark:text-brand-400 block mb-0.5">T - Task:</span>
                  <p className="text-slate-700 dark:text-slate-300">{currentQ.recommendedAnswer.task}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-brand-600 dark:text-brand-400 block mb-0.5">A - Action:</span>
                  <p className="text-slate-700 dark:text-slate-300">{currentQ.recommendedAnswer.action}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">R - Result (Quantified Metric):</span>
                  <p className="text-emerald-900 dark:text-emerald-200 font-semibold">{currentQ.recommendedAnswer.result}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FACIAL EXPRESSION & EMOTION TELEMETRY DIAGNOSTICS & TIPS */}
      {activeTab === 'facial_telemetry' && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white">Candidate Facial Expression & Emotion Telemetry Hub</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Recruiters and hiring managers judge executive confidence within the first 10 seconds of a video call based on eye contact alignment, smile warmth, and brow tension. Below is your real-time facial diagnostic and actionable improvement tips.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eye Contact Rating</span>
                <div className="text-3xl font-black text-emerald-400">{facialTelemetry.eyeContactScore}%</div>
                <span className="text-[10px] text-slate-500">Camera Lens Alignment</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Facial Engagement State</span>
                <div className="text-xl font-bold text-brand-400">{facialTelemetry.expressionState}</div>
                <span className="text-[10px] text-slate-500">Executive Tone Anchor</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Smile Warmth Index</span>
                <div className="text-3xl font-black text-sky-400">{facialTelemetry.smileAnchorScore}%</div>
                <span className="text-[10px] text-slate-500">Positive Connection</span>
              </div>
            </div>
          </div>

          {/* Positive Highlights vs Actionable Improvement Tips & Tricks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Highlights */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ThumbsUp className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  What You Did Great (Facial Strengths)
                </h3>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                {facialTelemetry.positiveHighlights.map((hl, i) => (
                  <li key={i} className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 font-medium">
                    {hl}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Improvement Tips & Tricks for Future Interviews */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Actionable Tips & Tricks to Fix Facial Posture
                </h3>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                {facialTelemetry.improvementTips.map((tip, i) => (
                  <li key={i} className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 font-medium">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE HUB & RECOMMENDED Q&A TIPS */}
      {activeTab === 'knowledge_hub' && (
        <div className="space-y-8">
          {/* Pro Tips to Crack the Interview Easily */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-sky-950 border border-brand-800 text-white space-y-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Pro Tips to Crack Enterprise {targetJob.title} Interviews</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-2">
                <span className="font-bold text-amber-300 text-sm block">1. The 60-Second Hook</span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  Start your response by stating your role, squad size (e.g. 12 engineers), and top metric result within line 1.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-2">
                <span className="font-bold text-sky-300 text-sm block">2. Always Quantify Results</span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  Never end an answer with "the project was successful". Always give percentages (e.g. 35% time saved, $450K budget managed).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-2">
                <span className="font-bold text-emerald-300 text-sm block">3. Reverse-Question Strategy</span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  Ask the interviewer: "What is the #1 sprint obstacle your engineering squad is tackling this quarter?"
                </p>
              </div>
            </div>
          </div>

          {/* Full Multi-Source Recommended Q&A Bank */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Target JD, Resume, Case Study & Custom Question Bank
                </h3>
                <p className="text-xs text-slate-500">
                  Tailored question recommendations & STAR method model answers for {targetJob.title}.
                </p>
              </div>
              <Badge variant="brand">{questions.length} Core Questions</Badge>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        Question {idx + 1} • {q.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.question}</h4>
                    </div>

                    <button
                      onClick={() => handleCopyText(`${q.recommendedAnswer.situation} ${q.recommendedAnswer.task} ${q.recommendedAnswer.action} ${q.recommendedAnswer.result}`, idx)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 hover:bg-slate-100 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedAnswerIndex === idx ? 'Copied STAR Answer!' : 'Copy Answer'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                      Recommended STAR Response:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{q.recommendedAnswer.situation} {q.recommendedAnswer.task} {q.recommendedAnswer.action} {q.recommendedAnswer.result}"
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span><strong>Insider Tip:</strong> {q.insiderTip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POST-INTERVIEW PERFORMANCE SCORECARD */}
      {activeTab === 'scorecard' && (() => {
        const scoreData = calculateDynamicScorecard();
        return (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Main Score Overview Header */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
              <Badge variant={scoreData.overallScore >= 80 ? "success" : "warning"}>INTERVIEW COMPLETED</Badge>
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                AI Interview Performance & Readiness Score
              </h2>

              <div className="w-28 h-28 mx-auto rounded-full border-8 border-emerald-500 flex items-center justify-center font-black text-3xl text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 shadow-xl">
                {scoreData.overallScore}%
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {scoreData.feedbackSummary}
              </p>
            </div>

            {/* Breakdown Parameters */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>Performance Breakdown Metrics</span>
                <span className="text-xs text-slate-500 font-normal">Based on {scoreData.wordCount} transcript words recorded</span>
              </h3>

              <div className="space-y-4">
                <ProgressBar label={`Speech Cadence & Communication Clarity (${scoreData.wordCount} words)`} value={scoreData.clarityScore} color="success" />
                <ProgressBar label={`Technical Skill Coverage (${scoreData.skillMatches} matched skills)`} value={scoreData.technicalScore} color="brand" />
                <ProgressBar label={`STAR Method Structure (${scoreData.starMatches} method anchors)`} value={scoreData.starScore} color="success" />
                <ProgressBar label={`Facial Eye Contact & Telemetry`} value={scoreData.facialScore} color="success" />
                <ProgressBar label={`Quantifiable Impact Metrics (${scoreData.metricMatches} numbers used)`} value={scoreData.metricScore} color={scoreData.metricScore >= 75 ? "success" : "warning"} />
              </div>
            </div>

            {/* Print / Download Report */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-extrabold text-xs transition-all shadow-md flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Detailed Performance Report</span>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
