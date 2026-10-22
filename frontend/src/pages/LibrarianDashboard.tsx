import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { bookService } from '../services/bookService';
import { issueService } from '../services/issueService';
import { Loan } from '../types/issue';
import { Link } from 'react-router-dom';
import { BookOpen, Repeat, ChevronRight, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const LibrarianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookCount, setBookCount] = useState<number | null>(null);
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      bookService.getAll(),
      issueService.getLoans({ activeOnly: true }),
    ]).then(([b, l]) => {
      setBookCount(b.status === 'fulfilled' ? b.value.length : 0);
      setActiveLoans(l.status === 'fulfilled' ? l.value.slice(0, 5) : []);
    }).finally(() => setLoading(false));
  }, []);

  const daysLeft = (due: string) => Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white">Hello, {user?.fullName?.split(' ')[0]} 👋</h2>
        <p className="text-sm text-slate-400 mt-1">Librarian workspace</p>
      </div>

      {loading ? <LoadingSpinner text="Loading…" /> : (
        <div className="grid grid-cols-2 gap-4">
          <Link to="/books">
            <Card hover>
              <div className="inline-flex p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-white">{bookCount ?? '—'}</p>
              <p className="text-xs text-slate-400 mt-0.5">Total Books</p>
            </Card>
          </Link>
          <Link to="/issues">
            <Card hover>
              <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                <Repeat className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-white">{activeLoans.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Active Issues</p>
            </Card>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Quick Actions" icon={<Activity className="w-4 h-4" />} />
          <div className="space-y-2">
            {[
              { label: 'Browse books',  to: '/books',      desc: 'View and manage catalogue' },
              { label: 'Issue a book',  to: '/issues',     desc: 'Create a new loan' },
              { label: 'View students', to: '/students',   desc: 'Manage student accounts' },
              { label: 'Categories',    to: '/categories', desc: 'Manage book categories' },
            ].map(a => (
              <Link key={a.to} to={a.to} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/40 border border-transparent hover:border-slate-600/40 transition-all duration-150 group">
                <div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white">{a.label}</p>
                  <p className="text-xs text-slate-500">{a.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-colors" />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Active Loans" icon={<Clock className="w-4 h-4" />} action={
            <Link to="/issues" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          } />
          {loading ? <LoadingSpinner size="sm" /> : activeLoans.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2 text-slate-500">
              <CheckCircle2 className="w-7 h-7" />
              <p className="text-xs">No active loans right now.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeLoans.map(loan => {
                const dl = daysLeft(loan.dueDate);
                const overdue = dl < 0;
                return (
                  <div key={loan.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-700/30 border border-slate-700/40">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">{loan.book?.title}</p>
                      <p className="text-xs text-slate-500">{loan.student?.fullName}</p>
                    </div>
                    <Badge variant={overdue ? 'danger' : dl <= 2 ? 'warning' : 'success'}>
                      {overdue ? `${Math.abs(dl)}d over` : `${dl}d`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
