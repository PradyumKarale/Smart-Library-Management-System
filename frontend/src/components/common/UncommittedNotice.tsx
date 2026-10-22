import React from 'react';
import { TriangleAlert } from 'lucide-react';

export const UncommittedNotice: React.FC = () => (
  <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/25 px-4 py-3 text-sm text-amber-300 mb-4">
    <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
    <span>
      This section uses features from <strong>uncommitted backend changes</strong> (modules/issues,
      modules/students, and related migrations). Make sure the backend server is running with the
      latest local code.
    </span>
  </div>
);
