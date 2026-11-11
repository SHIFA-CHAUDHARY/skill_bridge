import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Sparkles, FileText, HelpCircle, ShieldAlert, Cpu, BarChart3, Wrench, Layers } from 'lucide-react';
import { GapAnalysis } from '../types';

interface SkillGapAnalysisProps {
  analysis: GapAnalysis;
  onGenerateRoadmap: () => void;
  onOpenOptimizer: () => void;
  onOpenInterviewPrep: () => void;
  onOpenVSCode: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  analysis,
  onGenerateRoadmap,
  onOpenOptimizer,
  onOpenInterviewPrep,
  onOpenVSCode,
  onBack,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'matched' | 'secondary'>('all');

  const {
    target_role,
    match_score = 0,
    ats_score = 0,
    readiness_tier,
    readiness_summary,
    matched_core_skills = [],
    missing_core_skills = [],
    partially_matched_skills = [],
    missing_secondary_skills = [],
    ats_warnings = [],
  } = analysis;

  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 stroke-emerald-500';
    if (score >= 50) return 'text-blue-600 dark:text-blue-400 border-blue-500 stroke-blue-500';
    return 'text-amber-600 dark:text-amber-400 border-amber-500 stroke-amber-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'from-emerald-500/10 to-teal-500/5 border-emerald-200 dark:border-emerald-800/60';
    if (score >= 50) return 'from-blue-500/10 to-indigo-500/5 border-blue-200 dark:border-blue-800/60';
    return 'from-amber-500/10 to-orange-500/5 border-amber-200 dark:border-amber-800/60';
  };

  return (
    <div className="space-y-6">
      {/* Step Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Steps 4 & 5: AI Skill Comparison & Gap Identification</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Skill Gap Diagnostic: {target_role}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              AI compared your resume profile against target requirements. Below are the verified competencies, critical gaps, and recommended actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenOptimizer}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>ATS Bullet Rewriter</span>
            </button>
            <button
              onClick={onOpenInterviewPrep}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mock Interview Drills</span>
            </button>
          </div>
        </div>
      </div>

      {/* Diagnostics Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Match Score Card */}
        <div className={`rounded-2xl p-6 border bg-gradient-to-br ${getScoreBg(match_score)} shadow-xs flex items-center gap-5`}>
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            {/* SVG circular progress */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className={getScoreColor(match_score)}
                strokeWidth="7"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * match_score) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {Math.round(match_score)}%
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Match</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Skill Benchmark Alignment
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {readiness_tier || 'Skill Diagnostic Ready'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Based on {matched_core_skills.length} matched vs {missing_core_skills.length} missing core requirements.
            </p>
          </div>
        </div>

        {/* ATS Score Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ATS Keyword Score
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {Math.round(ats_score)} / 100
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden my-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(ats_score, 100)}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Applicant Tracking Systems look for explicit framework keywords in your bullets.
          </p>
        </div>

        {/* Readiness Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Evaluation Summary</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {readiness_summary}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Core Gaps: <strong className="text-rose-500">{missing_core_skills.length}</strong></span>
            <span>Matched: <strong className="text-emerald-500">{matched_core_skills.length}</strong></span>
            <span>Secondary: <strong className="text-blue-500">{missing_secondary_skills.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Tabs for Gaps */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'all', label: `All Skills (${matched_core_skills.length + missing_core_skills.length + missing_secondary_skills.length})` },
          { id: 'critical', label: `🚨 Critical Gaps (${missing_core_skills.length})` },
          { id: 'matched', label: `✓ Matched (${matched_core_skills.length})` },
          { id: 'secondary', label: `⚡ Secondary (${missing_secondary_skills.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skill Diagnostic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Critical Missing Skills */}
        {(activeTab === 'all' || activeTab === 'critical') && (
          <div className="bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Critical Missing Skills
                  </h3>
                  <span className="text-[11px] text-rose-600 font-semibold">
                    Must-have requirements for {target_role}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold">
                {missing_core_skills.length} Gaps
              </span>
            </div>

            <div className="space-y-2.5">
              {missing_core_skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                        {skill}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        High interview frequency. Addressed in personalized roadmap Phase 1 & 2.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 rounded shrink-0">
                    High Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Column: Matched Verified Skills */}
        {(activeTab === 'all' || activeTab === 'matched') && (
          <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Matched Benchmark Skills
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Already verified in your resume
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                {matched_core_skills.length} Matched
              </span>
            </div>

            <div className="space-y-2.5">
              {matched_core_skills.length > 0 ? (
                matched_core_skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {skill}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No exact core benchmark matches found yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Secondary & Tooling Skills */}
        {(activeTab === 'all' || activeTab === 'secondary') && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Secondary Competencies & Tooling Ecosystem
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Differentiators that elevate candidates from Junior to Competitive Mid
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                {missing_secondary_skills.length} Secondary
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {missing_secondary_skills.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {sec}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                    Bonus
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ATS Warnings if any */}
      {ats_warnings.length > 0 && (
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
              ATS Resume Optimization Tips
            </h4>
          </div>
          <ul className="space-y-1.5">
            {ats_warnings.map((warn, idx) => (
              <li key={idx} className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Step Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Role / Timeline</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenVSCode}
            className="px-4 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>Open Python Code in VS Code</span>
          </button>

          <button
            disabled={isLoading}
            onClick={onGenerateRoadmap}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isLoading ? 'opacity-80' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <span>Generate Personalized Roadmap (Step 6)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
