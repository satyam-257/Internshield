import React, { useState } from 'react';
import { CheckSquare, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface ActionStepsCardProps {
  company: string;
  actions: string[];
}

export const ActionStepsCard: React.FC<ActionStepsCardProps> = ({ company, actions }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyChecklist = () => {
    const text = actions.map((a, i) => `${i + 1}. ${a}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Recommended Next Steps
            </h4>
            <p className="text-xs text-slate-400">Independent due diligence checklist for students</p>
          </div>
        </div>

        <button
          onClick={handleCopyChecklist}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Steps!' : 'Copy Checklist'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {actions.map((act, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-start gap-3 text-xs leading-relaxed text-slate-300"
          >
            <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 font-mono font-bold text-[11px] mt-0.5">
              {idx + 1}
            </div>
            <div>
              <p className="font-medium text-slate-200">{act}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Stay safe: Never pay to work.</span>
        </div>

        {company && company !== "Unspecified Organization" && (
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(company + " careers official website")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            <span>Search {company} Careers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
