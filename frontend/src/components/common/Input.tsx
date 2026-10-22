import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  rightIcon,
  id,
  className = '',
  ...rest
}) => {
  const rightContent = rightElement || rightIcon;
  const inputId = id ?? `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</span>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-slate-900/60 border rounded-lg px-3 py-2 text-sm text-white
            placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-150
            ${error
              ? 'border-rose-500/60 focus:ring-rose-500/30 focus:border-rose-500'
              : 'border-slate-700/60 focus:ring-brand-500/30 focus:border-brand-500/60'}
            ${leftIcon ? 'pl-9' : ''}
            ${rightContent ? 'pr-10' : ''}
            ${className}
          `}
          {...rest}
        />
        {rightContent && (
          <span className="absolute right-3 text-slate-400">{rightContent}</span>
        )}
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
};
