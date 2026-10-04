import React from 'react';
import type { DemoExample } from '../types';
import { Play } from 'lucide-react';

interface DemoSelectorProps {
  examples: DemoExample[];
  onSelectExample: (example: DemoExample, autoSubmit?: boolean) => void;
  isLoading: boolean;
}

export const DemoSelector: React.FC<DemoSelectorProps> = ({
  examples,
  onSelectExample,
  isLoading
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Judge Instant Test Suite
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            3 Built-In Scenarios
          </span>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Click any card to load & test immediately
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {examples.map((ex) => {
          const isRed = ex.badgeColor === 'red';
          const isGreen = ex.badgeColor === 'green';

          return (
            <button
              key={ex.id}
              disabled={isLoading}
              onClick={() => onSelectExample(ex, false)}
              className="group text-left p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-200 group-hover:text-white flex items-center gap-1.5">
                  {ex.title}
                </span>
                
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isRed
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : isGreen
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {ex.badge}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {ex.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-blue-400 group-hover:text-blue-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" />
                  Load Scenario
                </span>
                <span className="text-[10px] text-slate-400">Click to fill</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
