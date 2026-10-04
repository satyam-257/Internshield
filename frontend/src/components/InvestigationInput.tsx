import React from 'react';
import { FileText, Globe, Search, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

interface InvestigationInputProps {
  text: string;
  url: string;
  activeTab: 'text' | 'url';
  onTextChange: (val: string) => void;
  onUrlChange: (val: string) => void;
  onTabChange: (tab: 'text' | 'url') => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  errorMessage?: string;
}

export const InvestigationInput: React.FC<InvestigationInputProps> = ({
  text,
  url,
  activeTab,
  onTextChange,
  onUrlChange,
  onTabChange,
  onSubmit,
  onReset,
  isLoading,
  errorMessage
}) => {
  const isSubmitDisabled = isLoading || (activeTab === 'text' ? !text.trim() : !url.trim());

  return (
    <div id="check-internship" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Check an Internship</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              AI Safety Analyzer
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Paste the raw internship description, recruiter email, or a public posting URL.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onTabChange('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste Listing Text
          </button>

          <button
            type="button"
            onClick={() => onTabChange('url')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Paste URL <span className="text-[10px] text-blue-300 font-mono">BETA</span>
          </button>
        </div>
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to investigate opportunity</p>
            <p className="text-rose-300/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form Content */}
      {activeTab === 'text' ? (
        <div>
          <div className="relative">
            <textarea
              id="listing-text-input"
              rows={7}
              disabled={isLoading}
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Paste internship text here... e.g.&#10;&#10;Data Science Internship at NexaByte Technologies&#10;We are selecting students for our remote Data Science Internship Program. Earn ₹35,000 per month while working 2 hours per day. NO INTERVIEW REQUIRED. You have been shortlisted directly. Only 10 seats remaining. To confirm your internship seat, submit a refundable registration fee of ₹1,499. Payment must be completed today. Contact: nexabyte.recruitment@gmail.com"
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono resize-y leading-relaxed disabled:opacity-60"
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>Minimum 15 characters required</span>
            <span>{text.length} characters</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            <div className="relative">
              <input
                id="listing-url-input"
                type="url"
                disabled={isLoading}
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="https://example.com/careers/internship-posting"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono disabled:opacity-60"
              />
            </div>
            
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Safe URL Extraction:</strong> InternShield applies strict SSRF security controls, blocks private networks/localhost, and limits response sizes before parsing page text.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading || (!text && !url)}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-30 disabled:pointer-events-none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Input
        </button>

        <button
          id="investigate-button"
          type="button"
          disabled={isSubmitDisabled}
          onClick={onSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-sm text-white shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <Search className="w-4 h-4" />
          <span>{isLoading ? 'Investigating...' : 'Investigate Opportunity'}</span>
        </button>
      </div>

    </div>
  );
};
