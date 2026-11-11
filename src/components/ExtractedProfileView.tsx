import React from 'react';
import { User, GraduationCap, Briefcase, Award, ArrowRight, ArrowLeft, CheckCircle2, Cpu, Wrench, Database, Layers } from 'lucide-react';
import { GapAnalysis } from '../types';

interface ExtractedProfileViewProps {
  analysis: GapAnalysis;
  onProceedToRole: () => void;
  onBack: () => void;
}

export const ExtractedProfileView: React.FC<ExtractedProfileViewProps> = ({
  analysis,
  onProceedToRole,
  onBack,
}) => {
  const { candidate, extracted_skills = [], key_strengths = [] } = analysis;

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Step 2: AI Profile Extraction Complete</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Parsed Profile & Identified Skill Inventory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            AI has reviewed your resume structure, recognized {extracted_skills.length} technical capabilities, verified your academic credentials, and calculated your initial readiness.
          </p>
        </div>

        <button
          onClick={onProceedToRole}
          className="self-start sm:self-center px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>Select Target Role (Step 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Candidate Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Candidate Name</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{candidate.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{candidate.email}</p>
            {candidate.phone && candidate.phone !== 'Available on request' && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{candidate.phone}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Education & Degree</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{candidate.degree}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{candidate.university}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Experience Level</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {candidate.estimated_years_experience <= 1 ? 'Undergraduate / Junior (0-1 yr)' : `${candidate.estimated_years_experience} Years Approx.`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ready for targeted skill expansion
            </p>
          </div>
        </div>
      </div>

      {/* Extracted Skills Cloud */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Extracted Technical Inventory ({extracted_skills.length} skills found)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Recognized across languages, frameworks, & tools
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {extracted_skills.length > 0 ? (
            extracted_skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No explicit skills found in the text.</p>
          )}
        </div>
      </div>

      {/* Key Strengths & Candidate Highlights */}
      {key_strengths.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Candidate Resume Highlights
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {key_strengths.map((str, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Different Resume</span>
        </button>

        <button
          onClick={onProceedToRole}
          className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>Choose Target Role (Step 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
