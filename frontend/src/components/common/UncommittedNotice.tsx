import React from 'react';
import { TriangleAlert } from 'lucide-react';

interface UncommittedNoticeProps {
  featureName?: string;
  endpoints?: string[];
}

export const UncommittedNotice: React.FC<UncommittedNoticeProps> = ({ featureName, endpoints }) => (
  <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/25 px-4 py-3 text-sm text-amber-300 mb-4">
    <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
    <div>
      <p>
        This section uses features from <strong>{featureName || 'uncommitted backend changes'}</strong>.
      </p>
      {endpoints && endpoints.length > 0 && (
        <div className="mt-1 text-xs text-amber-400/80 font-mono flex flex-wrap gap-1.5">
          {endpoints.map((ep) => (
            <span key={ep} className="bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/20">{ep}</span>
          ))}
        </div>
      )}
    </div>
  </div>
);
