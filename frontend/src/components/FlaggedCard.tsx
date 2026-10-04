import React, { useState } from 'react';
import type { RiskItem } from '../types';
import { ChevronDown, ChevronUp, AlertCircle, Quote, HelpCircle } from 'lucide-react';

interface FlaggedCardProps {
  finding: RiskItem;
  defaultExpanded?: boolean;
}

export const FlaggedCard: React.FC<FlaggedCardProps> = ({
  finding,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isHigh = finding.severity === 'high';

  return (
    <div
      className={`rounded-xl border transition-all ${
        isHigh
          ? 'bg-rose-950/20 border-rose-500/30'
          : 'bg-amber-950/20 border-amber-500/30'
      }`}
    >
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
              isHigh
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-100">{finding.title}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isHigh
                    ? 'bg-rose-500/20 text-rose-300 font-bold'
                    : 'bg-amber-500/20 text-amber-300 font-bold'
                }`}
              >
                +{finding.score_impact} pts
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{finding.summary}</p>
          </div>
        </div>

        <button
          type="button"
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 shrink-0 px-2 py-1 rounded bg-slate-900/60 border border-slate-800"
        >
          <span className="text-[11px] hidden sm:inline">Why was this flagged?</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Explanation Body */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 text-xs space-y-3">
          
          {/* InternShield found quote */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-mono">
            <div className="flex items-center gap-1.5 text-blue-400 mb-1 font-sans text-[11px] font-semibold">
              <Quote className="w-3.5 h-3.5" />
              <span>InternShield found in listing:</span>
            </div>
            <p className="text-slate-200 italic pl-5 border-l-2 border-blue-500/40">
              "{finding.evidence_quote}"
            </p>
          </div>

          {/* Educational context / Why it matters */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-semibold text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Why this matters for your safety:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {finding.why_it_matters}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
