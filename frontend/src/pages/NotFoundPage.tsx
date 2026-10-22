import React from 'react';
import { Compass, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-3xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-xl">
        <Compass className="w-12 h-12" />
      </div>
      <h1 className="text-2xl font-bold text-white tracking-tight">Page Not Found (404)</h1>
      <p className="text-xs text-slate-400 max-w-md leading-relaxed">
        The route or resource you are trying to reach does not exist or has been relocated.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
