import React from 'react';
import { ShieldCheck, AlertTriangle, Search, CheckCircle2, Lock } from 'lucide-react';

interface HeroProps {
  onCheckClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCheckClick }) => {
  return (
    <section className="relative pt-12 pb-16 overflow-hidden border-b border-slate-900">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 mb-6 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Local Inference & Privacy</span>
          <span className="text-slate-600">•</span>
          <span className="text-blue-400 font-mono">Open-Weight AI via Ollama</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Think before <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">you apply.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-400 mb-8 leading-relaxed">
          InternShield investigates questionable internship offers, suspicious recruiter emails, upfront fee requests, and direct-selection claims before you risk your money or personal data.
        </p>

        {/* Action Button & Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onCheckClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-xl shadow-blue-600/30 active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            Check an Internship Now
          </button>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Powered by open-weight AI</span>
            <span className="text-slate-600">•</span>
            <span>Zero cloud vendor lock-in</span>
          </div>
        </div>

        {/* Three Outcome Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400">🟢 Low Risk Indicators</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Verified company domain, standard technical interview, transparent stipend.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-400">🟡 Needs Verification</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Generic recruiter email or early stage startup needing domain confirmation.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-400">🔴 High Risk Indicators</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Upfront registration fees, sensitive credentials, urgency, or guaranteed selection.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
