import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
}) => {
  return (
    <div
      className={`
        bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl
        ${hover ? 'hover:border-brand-500/40 hover:shadow-brand-500/10 transition-all duration-200' : ''}
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, icon }) => (
  <div className="flex items-start justify-between gap-4 mb-5">
    <div className="flex items-center gap-3">
      {icon && (
        <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
