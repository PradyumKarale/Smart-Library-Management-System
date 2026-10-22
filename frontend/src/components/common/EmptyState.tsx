import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
    <div className="p-4 rounded-2xl bg-slate-700/40 text-slate-500 border border-slate-700/50">
      {icon ?? <PackageOpen className="w-10 h-10" />}
    </div>
    <div>
      <p className="text-base font-semibold text-slate-300">{title}</p>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>}
    </div>
    {action && <div className="mt-1">{action}</div>}
  </div>
);
