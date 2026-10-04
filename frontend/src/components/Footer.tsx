import React from 'react';
import { Shield, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-200">InternShield</span>
              <p className="text-[11px] text-slate-500">Think before you apply.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Hacktoberfest 2026 Weekend Challenge
            </span>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="pt-6 text-center text-slate-500 text-[11px] leading-relaxed max-w-3xl mx-auto">
          <p className="mb-2">
            <strong>Safety Disclaimer:</strong> InternShield provides informational risk indicators based on text pattern analysis and open-weight AI inference. It does not provide legal advice, background verification services, or definitive legal determinations regarding organizations or individuals. Always conduct independent verification before sharing personal details or financial assets.
          </p>
          <p className="text-slate-600">
            Open-source software released under the MIT License. Built with local AI via Ollama.
          </p>
        </div>

      </div>
    </footer>
  );
};
