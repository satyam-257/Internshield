import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { NormalAspect } from '../types';

interface NormalAspectsCardProps {
  aspects: NormalAspect[];
}

export const NormalAspectsCard: React.FC<NormalAspectsCardProps> = ({ aspects }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800/80">
        <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          What Looks Normal
        </h4>
        <span className="text-[11px] font-mono text-slate-500 ml-auto">
          {aspects.length} positive signals
        </span>
      </div>

      <div className="space-y-3">
        {aspects.length > 0 ? (
          aspects.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <div>
                <span className="font-semibold text-slate-200">{item.title}: </span>
                <span className="text-slate-400">{item.detail}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic">No standard baseline signals detected.</p>
        )}
      </div>
    </div>
  );
};
