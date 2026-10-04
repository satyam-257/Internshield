import React from 'react';
import { Bot, Lock, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';
import type { AIAnalysis } from '../types';

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/10 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Open-Source AI Analysis</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-semibold normal-case">
                <Lock className="w-3 h-3" />
                100% Local Inference
              </span>
            </h4>
            <p className="text-[11px] font-mono text-slate-400">
              Model: {analysis.model_used}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span>Ollama Engine</span>
        </div>
      </div>

      {/* Summary paragraph */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-sm leading-relaxed mb-4">
        {analysis.summary}
      </div>

      {/* Specific concerns if provided */}
      {analysis.concerns && analysis.concerns.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Identified Cautionary Factors:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.concerns.map((concern, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{concern}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conservative assistant disclaimer */}
      <div className="pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-start gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          {analysis.disclaimer}
        </span>
      </div>

    </div>
  );
};
