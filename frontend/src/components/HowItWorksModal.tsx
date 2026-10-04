import React from 'react';
import { X, UserCheck } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            Behind InternShield
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-white mb-4">
          How InternShield Protects Students
        </h3>

        {/* Story */}
        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 mb-6">
          <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            The "Build For A Friend" Story
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every college student knows the anxiety of internship hunting. Friends frequently receive WhatsApp messages, LinkedIn DMs, or suspicious listings offering guaranteed stipends, only to be asked for a "refundable ₹1,500 training deposit" or private bank details. InternShield acts as a second pair of eyes—analyzing context, checking signals, and guiding students on how to independently verify employers.
          </p>
        </div>

        {/* 4 Step Workflow */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Investigation Pipeline
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="font-mono text-blue-400 font-bold block mb-1">01. Ingestion</span>
              <p className="text-slate-300">Safely parses pasted text or validates external URLs with SSRF protection.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="font-mono text-blue-400 font-bold block mb-1">02. Rule Engine</span>
              <p className="text-slate-300">Executes deterministic checks: upfront fees (+30), credentials (+40), domain mismatch (+15), no interview (+10), urgency (+10).</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="font-mono text-blue-400 font-bold block mb-1">03. Local LLM Analysis</span>
              <p className="text-slate-300">Local open-weight model (Qwen via Ollama) evaluates semantic context, promises, and nuanced phrasing.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="font-mono text-blue-400 font-bold block mb-1">04. Explainable Report</span>
              <p className="text-slate-300">Produces evidence cards showing exact quotes, safety rationale, and actionable next steps.</p>
            </div>

          </div>
        </div>

        {/* Core Principles */}
        <div className="border-t border-slate-800/80 pt-4 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Core Safety Principle:</p>
          <p>
            InternShield never makes definitive accusations of fraud. It highlights risk indicators and missing verification so candidates can make informed decisions.
          </p>
        </div>

      </div>
    </div>
  );
};
