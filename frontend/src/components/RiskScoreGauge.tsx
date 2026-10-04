import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import type { RiskItem } from '../types';

interface RiskScoreGaugeProps {
  score: number;
  level: string;
  category: 'low' | 'medium' | 'high';
  explanation: string;
  findings: RiskItem[];
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  level,
  category,
  explanation,
  findings
}) => {
  const isRed = category === 'high';
  const isYellow = category === 'medium';

  const colorClass = isRed
    ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
    : isYellow
    ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

  const barColor = isRed
    ? 'bg-rose-500'
    : isYellow
    ? 'bg-amber-400'
    : 'bg-emerald-400';

  return (
    <div className={`p-6 rounded-2xl border ${isRed ? 'border-rose-500/30 bg-slate-900/90' : isYellow ? 'border-amber-500/30 bg-slate-900/90' : 'border-emerald-500/30 bg-slate-900/90'} shadow-2xl relative overflow-hidden`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Score & Category */}
        <div className="flex items-center gap-5">
          <div className="relative flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border border-slate-800 p-2 text-center shrink-0 shadow-inner">
            <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isRed ? 'text-rose-400' : isYellow ? 'text-amber-400' : 'text-emerald-400'}`}>
              {score}
            </span>
            <span className="text-[11px] font-mono text-slate-500 mt-0.5">/ 100</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">Indicator Score</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colorClass} flex items-center gap-1.5`}>
                {isRed && <ShieldAlert className="w-3.5 h-3.5" />}
                {isYellow && <AlertTriangle className="w-3.5 h-3.5" />}
                {!isRed && !isYellow && <ShieldCheck className="w-3.5 h-3.5" />}
                {level}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">Safety Signal Summary</h3>
            <p className="text-xs text-slate-400 max-w-lg mt-1 leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>

        {/* Right: Score breakdown chips */}
        <div className="flex flex-col gap-2 md:items-end">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Detected Warning Signals Breakdown:
          </span>

          <div className="flex flex-wrap gap-1.5 max-w-md justify-start md:justify-end">
            {findings.length > 0 ? (
              findings.map((f) => (
                <span
                  key={f.id}
                  className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1"
                >
                  <span className={f.severity === 'high' ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                    +{f.score_impact}
                  </span>
                  <span>{f.title.split('(')[0].trim()}</span>
                </span>
              ))
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                0 detected warning signals
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
          <span className="text-emerald-400">0 - 24 Low Risk</span>
          <span className="text-amber-400">25 - 49 Needs Verification</span>
          <span className="text-rose-400">50 - 100 High Risk</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-700 ${barColor}`}
            style={{ width: `${Math.max(5, score)}%` }}
          ></div>
        </div>
      </div>

    </div>
  );
};
