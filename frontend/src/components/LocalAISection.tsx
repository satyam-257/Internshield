import React from 'react';
import { Lock, ShieldCheck, Cpu, DollarSign, RefreshCw, EyeOff, Award } from 'lucide-react';

export const LocalAISection: React.FC = () => {
  return (
    <section id="about-open-ai" className="my-16 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        
        {/* Section Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-semibold mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>Local Open-Source AI Architecture</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Powered by Open-Weight Models running through Ollama
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          Your internship descriptions, recruiter emails, and job search context are evaluated locally using open-weight models. Student data does not need to be sent to proprietary cloud AI APIs like OpenAI, Anthropic, or Google.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <EyeOff className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Local Inference & Privacy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inference runs directly on your machine. Confidential emails and resumes remain private on your device.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Zero Per-Analysis API Cost</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No subscription charges, no rate limits, and zero recurring tokens. Free and accessible to any student worldwide.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Hot-Swappable Weights</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configurable via <code className="text-blue-300">OLLAMA_MODEL</code>. Easily switch between Qwen, Gemma, Llama, or Mistral without changing code.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Graceful Hybrid Fallback</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If Ollama is offline or model is loading, InternShield’s deterministic rule engine continues executing 100% of risk checks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Calibrated Risk Evidence</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The AI never acts as a judge or declares criminal guilt; it summarizes verifiable signals to assist human judgment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Hacktoberfest Compliant</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pure open-source AI at its core. Open innovation built for community collaboration and student empowerment.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
