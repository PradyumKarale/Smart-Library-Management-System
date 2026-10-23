import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { issueService } from '../services/issueService';
import { Loan } from '../types/issue';
import { Link } from 'react-router-dom';
import { BookOpen, Repeat, ChevronRight, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    issueService.getLoans({ activeOnly: true })
      .then(r => setLoans(r.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const daysLeft = (due: string) => Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">Welcome, {user?.fullName?.split(' ')[0]} 👋</h2>
        <p className="text-sm text-slate-400 mt-1">Student portal</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/books">
          <Card hover className="h-full">
            <div className="inline-flex p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">Browse Books</p>
            <p className="text-xs text-slate-400 mt-0.5">Explore the library catalogue</p>
          </Card>
        </Link>
        <Link to="/issues">
          <Card hover className="h-full">
            <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <Repeat className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">My Loans</p>
            <p className="text-xs text-slate-400 mt-0.5">Track your issued books</p>
          </Card>
        </Link>
        <Link to="/assistant">
          <Card hover className="h-full border-brand-500/30 bg-gradient-to-br from-brand-950/40 to-slate-900">
            <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-brand-500/20 to-indigo-500/20 text-brand-300 border border-brand-500/30 mb-3">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              AI Assistant <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded-full font-medium">Groq</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Course book recommendations</p>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader title="Active Loans" icon={<Clock className="w-4 h-4" />} action={
          <Link to="/issues" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        } />
        {loading ? <LoadingSpinner size="sm" /> : loans.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2 text-slate-500">
            <CheckCircle2 className="w-8 h-8" />
            <p className="text-sm">No active loans. Browse books to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {loans.map(loan => {
              const dl = daysLeft(loan.dueDate);
              const overdue = dl < 0;
              return (
                <div key={loan.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30 border border-slate-700/40">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{loan.book?.title ?? 'Unknown'}</p>
                    <p className="text-xs text-slate-400">Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={overdue ? 'danger' : dl <= 2 ? 'warning' : 'success'}>
                    {overdue ? `${Math.abs(dl)}d overdue` : `${dl}d left`}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
