import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  actionLabel,
  onAction,
}) => {
  const renderedIcon = React.isValidElement(icon)
    ? icon
    : typeof icon === 'function'
    ? React.createElement(icon as React.ComponentType<{ className?: string }>, { className: 'w-10 h-10' })
    : (icon as React.ReactNode) ?? <PackageOpen className="w-10 h-10" />;

  const actionNode = action || (actionLabel && onAction ? (
    <button
      type="button"
      onClick={onAction}
      className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 px-3 py-1.5 text-xs gap-1.5 bg-brand-600 hover:bg-brand-500 text-white border border-brand-500/50 shadow-lg shadow-brand-500/20"
    >
      {actionLabel}
    </button>
  ) : null);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="p-4 rounded-2xl bg-slate-700/40 text-slate-500 border border-slate-700/50">
        {renderedIcon}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-300">{title}</p>
        {description && <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>}
      </div>
      {actionNode && <div className="mt-1">{actionNode}</div>}
    </div>
  );
};
