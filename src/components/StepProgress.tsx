import React from 'react';
import { Upload, FileCheck, Target, GitCompare, AlertTriangle, MapPin, CheckCircle2 } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  maxAccessibleStep: number;
}

export const STEPS = [
  { step: 1, title: 'Upload Resume', desc: 'PDF, DOCX, Text', icon: Upload },
  { step: 2, title: 'AI Extraction', desc: 'Skills & Profile', icon: FileCheck },
  { step: 3, title: 'Target Role', desc: 'Select Career Goal', icon: Target },
  { step: 4, title: 'Skill Comparison', desc: 'Industry Diagnostic', icon: GitCompare },
  { step: 5, title: 'Missing Skills', desc: 'Gap Identification', icon: AlertTriangle },
  { step: 6, title: 'Learning Roadmap', desc: 'Weekly Milestones', icon: MapPin },
];

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onStepClick,
  maxAccessibleStep,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 shadow-xs">
      <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const isClickable = s.step <= maxAccessibleStep;

            return (
              <React.Fragment key={s.step}>
                <button
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick && onStepClick(s.step)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
                    isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800'
                      : isClickable
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer opacity-90'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300 dark:ring-indigo-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Step {s.step}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold block ${
                        isCurrent
                          ? 'text-indigo-900 dark:text-indigo-200'
                          : isCompleted
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                </button>

                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 min-w-[14px] mx-1 transition-colors ${
                      currentStep > index + 1
                        ? 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
