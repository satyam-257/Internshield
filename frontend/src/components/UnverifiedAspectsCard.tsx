import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { UnknownAspect } from '../types';

interface UnverifiedAspectsCardProps {
  unknowns: UnknownAspect[];
}

export const UnverifiedAspectsCard: React.FC<UnverifiedAspectsCardProps> = ({ unknowns }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800/80">
        <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center">
          <HelpCircle className="w-3.5 h-3.5" />
        </div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Could Not Verify
        </h4>
        <span className="text-[11px] font-mono text-slate-500 ml-auto">
          {unknowns.length} items to check
        </span>
      </div>

      <div className="space-y-3">
        {unknowns.length > 0 ? (
          unknowns.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
              <div>
                <span className="font-semibold text-slate-200">{item.title}: </span>
                <span className="text-slate-400">{item.detail}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic">No specific unverifiable claims noted.</p>
        )}
      </div>
    </div>
  );
};
