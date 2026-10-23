import React from 'react';

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string; border: string }> = {
  brand: {
    bg: 'bg-brand-500/15',
    text: 'text-brand-300',
    dot: 'bg-brand-400',
    border: 'border-brand-500/30',
  },
  success: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/30',
  },
  warning: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
    border: 'border-amber-500/30',
  },
  danger: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    dot: 'bg-rose-400',
    border: 'border-rose-500/30',
  },
  neutral: {
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    border: 'border-slate-700/60',
  },
  default: {
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    border: 'border-slate-700/60',
  },
  info: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400',
    border: 'border-cyan-500/30',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const styles = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />}
      {children}
    </span>
  );
};
