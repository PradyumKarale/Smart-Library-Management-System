import React from 'react';
import { useLocation } from 'react-router-dom';

const titleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/books': 'Books',
  '/categories': 'Categories',
  '/issues': 'Issues & Returns',
  '/students': 'Students',
  '/librarians': 'Librarians',
};

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();

  // match longest prefix
  const title = Object.keys(titleMap)
    .filter(k => pathname === k || (k !== '/' && pathname.startsWith(k)))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <header className="h-14 flex items-center px-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md shrink-0">
      <h1 className="text-sm font-semibold text-white tracking-wide">
        {titleMap[title] ?? 'Smart Library'}
      </h1>
    </header>
  );
};
