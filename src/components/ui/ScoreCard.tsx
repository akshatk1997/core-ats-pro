import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  subtitle?: string;
  trend?: string;
  icon?: React.ReactNode;
  color?: 'brand' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  maxScore = 100,
  subtitle,
  trend,
  icon,
  color = 'brand',
  onClick,
}) => {
  const percentage = Math.round((score / maxScore) * 100);

  const getScoreColor = () => {
    if (color === 'success' || percentage >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20';
    if (color === 'warning' || percentage >= 65) return 'text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20';
    if (color === 'danger' || percentage < 65) return 'text-rose-600 dark:text-rose-400 border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20';
    return 'text-brand-600 dark:text-brand-400 border-brand-500/20 bg-brand-50/50 dark:bg-brand-950/20';
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {score}
        </span>
        {maxScore !== 100 && (
          <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            / {maxScore}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
        {trend && (
          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${getScoreColor()}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
