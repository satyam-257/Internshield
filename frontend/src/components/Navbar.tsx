import React from 'react';
import { Shield, HelpCircle, Cpu } from 'lucide-react';

interface NavbarProps {
  ollamaStatus: {
    connected: boolean;
    model: string;
  };
  onOpenHowItWorks: () => void;
  onScrollToInput: () => void;
  onScrollToAboutAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  ollamaStatus,
  onOpenHowItWorks,
  onScrollToInput,
  onScrollToAboutAI
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">InternShield</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Hacktoberfest
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Think before you apply.</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={onScrollToInput}
            className="hover:text-white transition-colors"
          >
            Check Internship
          </button>
          <button 
            onClick={onOpenHowItWorks}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            How It Works
          </button>
          <button 
            onClick={onScrollToAboutAI}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            Open-Source AI
          </button>
        </nav>

        {/* Status Indicator Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${ollamaStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="font-mono text-slate-300">
              {ollamaStatus.connected ? `Ollama: ${ollamaStatus.model}` : 'Rule Engine Active'}
            </span>
          </div>

          <button
            onClick={onScrollToInput}
            className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-md shadow-blue-600/20"
          >
            Check an Offer
          </button>
        </div>

      </div>
    </header>
  );
};
