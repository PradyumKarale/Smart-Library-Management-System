import React from 'react';
import { Sparkles, ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { AiAssistantChat } from '../components/ai/AiAssistantChat';

export const AiAssistantPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/25">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white">AI Library Assistant</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              Groq Cloud
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Natural-language catalog search, course-aligned recommendations, and library guidance grounded in verified database inventory.
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Catalog Grounded</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Only real titles, real authors, and live shelf availability.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Ultra-Fast LPU</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Powered by Groq's high-throughput LPU inference engine.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Safe & Role-Aware</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Read-only catalog operations protecting borrower privacy.</p>
          </div>
        </div>
      </div>

      {/* Standalone Chat Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-2 sm:p-4">
        <AiAssistantChat standalone />
      </div>
    </div>
  );
};
