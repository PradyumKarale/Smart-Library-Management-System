import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AiAssistantChat } from '../ai/AiAssistantChat';

export const Layout: React.FC = () => (
  <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
    <Sidebar />
    <div className="flex flex-col flex-1 overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6 relative">
        <Outlet />
        <AiAssistantChat />
      </main>
    </div>
  </div>
);
