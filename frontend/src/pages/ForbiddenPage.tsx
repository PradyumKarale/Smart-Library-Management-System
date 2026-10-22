import React from 'react';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-xl">
        <ShieldX className="w-12 h-12" />
      </div>
      <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted (403)</h1>
      <p className="text-xs text-slate-400 max-w-md leading-relaxed">
        Your current role does not have authorization to view this administrative page. Contact the system administrator if you require additional permissions.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
