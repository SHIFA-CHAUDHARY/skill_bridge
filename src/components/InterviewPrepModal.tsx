import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, ChevronUp, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';

interface QuestionItem {
  question: string;
  skill_tested?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  key_concepts?: string[];
  model_answer: string;
}

interface InterviewPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: string;
  missingSkills: string[];
}

export const InterviewPrepModal: React.FC<InterviewPrepModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  missingSkills,
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, missingSkills }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setExpandedIndex(0);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyBadge = (diff?: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Hard':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    }
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
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Mock Technical Interview Drills
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Probing Identified Gaps for {targetRole}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
          Questions real engineering hiring managers ask to test depth on your missing skills. Test yourself first, then expand to inspect key concepts and model responses.
        </p>

        {questions.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <BookOpen className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Generate Role-Specific Technical Questions
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              AI will formulate technical interview scenarios directly challenging: {missingSkills.slice(0, 3).join(', ')}.
            </p>
            <button
              onClick={handleFetchQuestions}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25 cursor-pointer"
            >
              {isLoading ? 'Synthesizing Interview Drills...' : 'Start Interview Drill Session'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyBadge(q.difficulty)}`}>
                            {q.difficulty || 'Medium'}
                          </span>
                          {q.skill_tested && (
                            <span className="text-[10px] font-semibold text-slate-400">
                              Tested: {q.skill_tested}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {q.question}
                        </h4>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
                      {q.key_concepts && q.key_concepts.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Key Concepts Interviewers Look For:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {q.key_concepts.map((kc, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                              >
                                {kc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Model Answer Strategy:
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60 font-sans">
                          {q.model_answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-3 flex justify-between items-center">
              <button
                onClick={handleFetchQuestions}
                disabled={isLoading}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Regenerate New Questions
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
