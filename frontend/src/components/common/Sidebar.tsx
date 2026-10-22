import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Users,
  UserCog,
  Repeat,
  Tag,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { to: '/',            label: 'Dashboard',  icon: <LayoutDashboard className="w-5 h-5" />, roles: ['ADMIN', 'LIBRARIAN', 'STUDENT'] },
  { to: '/books',       label: 'Books',       icon: <BookOpen className="w-5 h-5" />,        roles: ['ADMIN', 'LIBRARIAN', 'STUDENT'] },
  { to: '/categories',  label: 'Categories',  icon: <Tag className="w-5 h-5" />,             roles: ['ADMIN', 'LIBRARIAN'] },
  { to: '/issues',      label: 'Issues',      icon: <Repeat className="w-5 h-5" />,          roles: ['ADMIN', 'LIBRARIAN', 'STUDENT'] },
  { to: '/students',    label: 'Students',    icon: <Users className="w-5 h-5" />,           roles: ['ADMIN', 'LIBRARIAN'] },
  { to: '/librarians',  label: 'Librarians',  icon: <UserCog className="w-5 h-5" />,         roles: ['ADMIN'] },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const visible = navItems.filter(n => n.roles.includes(user.role));

  return (
    <aside
      className={`flex flex-col h-screen bg-slate-900 border-r border-slate-700/50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} shrink-0`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="p-2 rounded-xl bg-brand-600/20 border border-brand-500/30">
          <Library className="w-5 h-5 text-brand-400" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-sm leading-tight">
            Smart Library<br />
            <span className="text-brand-400 font-semibold text-xs">Management System</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visible.map(item => {
          const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                ${active
                  ? 'bg-brand-600/25 text-brand-300 border border-brand-500/30 shadow-md shadow-brand-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70 border border-transparent'}
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <span className={active ? 'text-brand-400' : ''}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 pt-2 border-t border-slate-700/50 space-y-1">
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 text-[10px] font-semibold border border-brand-500/25">
              {user.role}
            </span>
          </div>
        )}
        <button
          onClick={logout}
          title="Logout"
          className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(p => !p)}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent transition-all duration-150 justify-center"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};
