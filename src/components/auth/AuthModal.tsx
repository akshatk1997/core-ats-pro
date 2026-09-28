import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, ArrowRight, Upload, CheckCircle2 } from 'lucide-react';
import { UserProfile, TargetRole } from '@/types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'onboarding'>('login');
  const [email, setEmail] = useState('candidate@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Candidate User');

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [targetRole, setTargetRole] = useState<TargetRole>('Project Manager');
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>('Mid Career (3-7 yrs)');
  const [industry, setIndustry] = useState('Technology / Corporate');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMode('onboarding');
  };

  const handleOnboardingComplete = () => {
    const updatedProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || 'Candidate User',
      email: email || 'candidate@example.com',
      targetRole,
      experienceLevel,
      preferredIndustry: industry,
      careerGoal: `Targeting ${targetRole} positions in ${industry}`,
      plan: 'Full Access'
    };
    onAuthSuccess(updatedProfile);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'onboarding' ? 'Personalize Your AI Career Experience' : mode === 'login' ? 'Sign In to Antigravity' : 'Create Free Account'}
    >
      {mode !== 'onboarding' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-md"
          >
            {mode === 'login' ? 'Sign In & Access Dashboard' : 'Create Account'}
          </button>

          <div className="text-center pt-2 text-[11px] text-slate-500">
            {mode === 'login' ? (
              <span>Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-brand-600 font-bold">Sign up free</button></span>
            ) : (
              <span>Already registered? <button type="button" onClick={() => setMode('login')} className="text-brand-600 font-bold">Sign in</button></span>
            )}
          </div>
        </form>
      ) : (
        <div className="space-y-6 text-xs animate-fade-in">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>Step {onboardingStep} of 3</span>
            <span>Target Setup</span>
          </div>

          {onboardingStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">What primary role are you targeting?</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Project Manager',
                  'Product Manager',
                  'Business Analyst',
                  'Data Analyst',
                  'Digital Marketing',
                  'Software Engineer',
                  'Finance',
                  'Consulting'
                ].map((roleOption) => (
                  <button
                    key={roleOption}
                    type="button"
                    onClick={() => setTargetRole(roleOption as TargetRole)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      targetRole === roleOption
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {roleOption}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setOnboardingStep(2)}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Next: Experience Level</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">What is your current experience level?</h4>
              <div className="space-y-2">
                {[
                  'Entry Level',
                  'Early Career (1-3 yrs)',
                  'Mid Career (3-7 yrs)',
                  'Senior / Executive (7+ yrs)'
                ].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl as any)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      experienceLevel === lvl
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setOnboardingStep(3)}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Next: Ready</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Setup Complete!</h4>
              <p className="text-xs text-slate-500">Your account is configured for {targetRole} optimization.</p>
              <button
                type="button"
                onClick={handleOnboardingComplete}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all"
              >
                Enter Platform Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
