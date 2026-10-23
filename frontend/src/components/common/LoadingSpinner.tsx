import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  label?: string;
  fullScreen?: boolean;
  fullHeight?: boolean;
}

const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  label,
  fullScreen = false,
  fullHeight = false,
}) => {
  const displayText = label || text;
  const content = (
    <div className="flex flex-col items-center gap-3">
      <span
        className={`${sizeMap[size]} border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin`}
      />
      {displayText && <p className="text-sm text-slate-400">{displayText}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${fullHeight ? 'min-h-[50vh] py-12' : 'py-12'}`}>
      {content}
    </div>
  );
};
