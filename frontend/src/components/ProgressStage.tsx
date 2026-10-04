import React from 'react';
import { CheckCircle2, Loader2, Circle, Shield } from 'lucide-react';

export interface StageItem {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface ProgressStageProps {
  stages: StageItem[];
}

export const ProgressStage: React.FC<ProgressStageProps> = ({ stages }) => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-slate-900 border border-blue-500/30 shadow-2xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-blue-500/10 blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Shield className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Investigating opportunity...</h3>
          <p className="text-xs text-slate-400">Running multi-phase deterministic safety checks & local open-weight AI</p>
        </div>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => {
          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                stage.status === 'completed'
                  ? 'text-emerald-300 font-medium'
                  : stage.status === 'in_progress'
                  ? 'text-blue-300 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              {stage.status === 'completed' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {stage.status === 'in_progress' && (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
              )}
              {stage.status === 'pending' && (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}

              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
