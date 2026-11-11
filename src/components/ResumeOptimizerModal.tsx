import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, FileCheck, ArrowRight, Lightbulb } from 'lucide-react';

interface ResumeOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: string;
  candidateSkills: string[];
  missingSkills: string[];
}

export const ResumeOptimizerModal: React.FC<ResumeOptimizerModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  candidateSkills,
  missingSkills,
}) => {
  const [bullets, setBullets] = useState<string[]>([]);
  const [atsAdvice, setAtsAdvice] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleGenerateBullets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          candidateSkills,
          missingSkills,
        }),
      });
      const data = await res.json();
      if (data.bullets) {
        setBullets(data.bullets);
        setAtsAdvice(data.ats_advice || []);
      }
    } catch (err) {
      console.error('Error generating bullets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              AI ATS Resume Bullet Optimizer
            </h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Targeted for {targetRole}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
          Google-XYZ formatted bullet points ("Accomplished [X] as measured by [Y], by doing [Z]") designed to pass Applicant Tracking Systems while highlighting the skills you are bridging.
        </p>

        {bullets.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <FileCheck className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Generate Tailored Resume Action Bullets
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              AI will synthesize accomplishment bullets integrating your matched skills with your target role gaps: {missingSkills.slice(0, 3).join(', ')}.
            </p>
            <button
              onClick={handleGenerateBullets}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 cursor-pointer"
            >
              {isLoading ? 'Synthesizing Bullets...' : 'Generate 5 Pro Resume Bullets'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bullets.map((bullet, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {bullet}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(bullet, idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-colors shrink-0"
                  title="Copy bullet"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}

            {atsAdvice.length > 0 && (
              <div className="mt-4 p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                    ATS Keyword Recommendations
                  </span>
                </div>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  {atsAdvice.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 flex justify-between items-center">
              <button
                onClick={handleGenerateBullets}
                disabled={isLoading}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Regenerate Variations
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
