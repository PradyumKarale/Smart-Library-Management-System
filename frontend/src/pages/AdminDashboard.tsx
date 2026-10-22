import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { bookService } from '../services/bookService';
import { studentService } from '../services/studentService';
import { librarianService } from '../services/librarianService';
import { issueService } from '../services/issueService';
import { Link } from 'react-router-dom';
import { BookOpen, Users, UserCog, Repeat, ChevronRight, Activity } from 'lucide-react';

interface Stats {
  books: number;
  students: number;
  librarians: number;
  activeIssues: number;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      bookService.getAll(),
      studentService.getAll(),
      librarianService.getAll(),
      issueService.getLoans({ activeOnly: true }),
    ]).then(([b, s, l, i]) => {
      setStats({
        books:        b.status === 'fulfilled' ? b.value.length : 0,
        students:     s.status === 'fulfilled' ? s.value.length : 0,
        librarians:   l.status === 'fulfilled' ? l.value.length : 0,
        activeIssues: i.status === 'fulfilled' ? i.value.length : 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Books',   value: stats?.books,        icon: <BookOpen className="w-6 h-6" />, to: '/books',      color: 'brand'   },
    { label: 'Students',      value: stats?.students,     icon: <Users className="w-6 h-6" />,    to: '/students',   color: 'emerald' },
    { label: 'Librarians',    value: stats?.librarians,   icon: <UserCog className="w-6 h-6" />,  to: '/librarians', color: 'violet'  },
    { label: 'Active Issues', value: stats?.activeIssues, icon: <Repeat className="w-6 h-6" />,   to: '/issues',     color: 'amber'   },
  ] as const;

  const colorMap = {
    brand:   { bg: 'bg-brand-500/10',   text: 'text-brand-400',   border: 'border-brand-500/20'   },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20'  },
    amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20'   },
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-white">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h2>
        <p className="text-sm text-slate-400 mt-1">Here's what's happening in the library today.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading stats…" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(sc => {
            const c = colorMap[sc.color];
            return (
              <Link key={sc.label} to={sc.to}>
                <Card hover padding="md" className="group">
                  <div className={`inline-flex p-2.5 rounded-xl ${c.bg} ${c.text} border ${c.border} mb-3`}>
                    {sc.icon}
                  </div>
                  <p className="text-2xl font-bold text-white">{sc.value ?? '—'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sc.label}</p>
                  <div className={`flex items-center gap-1 mt-2 text-xs ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span>View all</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Quick Actions" icon={<Activity className="w-4 h-4" />} />
          <div className="space-y-2">
            {[
              { label: 'Add a new book',       to: '/books',      desc: 'Expand the library catalogue' },
              { label: 'Issue a book',          to: '/issues',     desc: 'Create a new loan record' },
              { label: 'Register a librarian',  to: '/librarians', desc: 'Add new staff member' },
              { label: 'Manage categories',     to: '/categories', desc: 'Organise book taxonomy' },
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
          <CardHeader title="System Info" icon={<Activity className="w-4 h-4" />} />
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
              <span className="text-slate-400">Your Role</span>
              <span className="text-brand-400 font-semibold">{user?.role}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
              <span className="text-slate-400">Email</span>
              <span className="text-white text-xs">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Backend API</span>
              <span className="text-emerald-400 text-xs font-medium">Active (Connected)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
