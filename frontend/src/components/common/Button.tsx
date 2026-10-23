import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-600 hover:bg-brand-500 text-white border border-brand-500/50 shadow-lg shadow-brand-500/20',
  secondary:
    'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600/50',
  danger:
    'bg-rose-600 hover:bg-rose-500 text-white border border-rose-500/50 shadow-lg shadow-rose-500/20',
  ghost:
    'bg-transparent hover:bg-slate-700/60 text-slate-300 hover:text-white border border-transparent',
  outline:
    'bg-transparent hover:bg-slate-700/40 text-slate-300 hover:text-white border border-slate-600/60',
};

const sizeClasses: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = '',
  ...rest
}) => {
  const isSpinning = loading || isLoading;
  const isDisabled = disabled || isSpinning;
  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...rest}
    >
      {isSpinning ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!isSpinning && rightIcon}
    </button>
  );
};
