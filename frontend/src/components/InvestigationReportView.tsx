import React, { useState } from 'react';
import type { InvestigationReport } from '../types';
import { RiskScoreGauge } from './RiskScoreGauge';
import { FlaggedCard } from './FlaggedCard';
import { NormalAspectsCard } from './NormalAspectsCard';
import { UnverifiedAspectsCard } from './UnverifiedAspectsCard';
import { AIAnalysisCard } from './AIAnalysisCard';
import { ActionStepsCard } from './ActionStepsCard';
import { Building2, MapPin, DollarSign, Mail, Share2, Check, ArrowLeft } from 'lucide-react';

interface InvestigationReportViewProps {
  report: InvestigationReport;
  onReset: () => void;
}

export const InvestigationReportView: React.FC<InvestigationReportViewProps> = ({
  report,
  onReset
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopySummary = () => {
    const summary = `🛡️ InternShield Investigation Report
Role: ${report.role}
Company: ${report.company}
Risk Score: ${report.risk_score} / 100 (${report.risk_level})

Important Findings:
${report.important_findings.map(f => `- ${f.title}`).join('\n')}

AI Assessment:
${report.ai_analysis.summary}

Check full safety guidelines on InternShield.`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div id="investigation-report" className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Investigate Another Listing</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                InternShield Safety Dossier
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Source: {report.source_type.toUpperCase()}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {report.role}
            </h2>
            <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 mt-1">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>{report.company}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            {report.extracted_data.stipend && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                {report.extracted_data.stipend}
              </span>
            )}
            {report.extracted_data.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {report.extracted_data.location}
              </span>
            )}
            {report.extracted_data.contact_email && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {report.extracted_data.contact_email}
              </span>
            )}
          </div>
        </div>

        {/* Source preview snippet */}
        {report.source_preview && (
          <div className="mt-4 text-xs text-slate-400 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <span className="text-slate-500 block mb-1 font-sans text-[11px] font-semibold">Analyzed Text Snippet:</span>
            <p className="line-clamp-2 italic">"{report.source_preview}"</p>
          </div>
        )}
      </div>

      {/* Risk Score Gauge */}
      <RiskScoreGauge
        score={report.risk_score}
        level={report.risk_level}
        category={report.risk_category}
        explanation={report.score_explanation}
        findings={report.important_findings}
      />

      {/* 🚨 IMPORTANT FINDINGS */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Important Findings</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-semibold normal-case">
                {report.important_findings.length} flagged {report.important_findings.length === 1 ? 'signal' : 'signals'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Click any card to inspect detected quote & safety rationale</p>
          </div>
        </div>

        <div className="space-y-3">
          {report.important_findings.length > 0 ? (
            report.important_findings.map((finding) => (
              <FlaggedCard key={finding.id} finding={finding} defaultExpanded={true} />
            ))
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <span>✓ No high or medium risk warning signals were identified in this listing.</span>
            </div>
          )}
        </div>
      </div>

      {/* Two columns: What Looks Normal & Could Not Verify */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NormalAspectsCard aspects={report.normal_aspects} />
        <UnverifiedAspectsCard unknowns={report.unknowns} />
      </div>

      {/* Open-Source AI Analysis */}
      <AIAnalysisCard analysis={report.ai_analysis} />

      {/* Recommended Next Steps */}
      <ActionStepsCard company={report.company} actions={report.recommended_actions} />

    </div>
  );
};
