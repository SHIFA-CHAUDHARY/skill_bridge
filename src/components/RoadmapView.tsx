import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ExternalLink, Download, FileText, Share2, Award, BookOpen, Layers, Terminal, Sparkles, Printer, ArrowLeft, RefreshCw, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Roadmap, RoadmapPhase } from '../types';

interface RoadmapViewProps {
  roadmap: Roadmap;
  onOpenVSCode: () => void;
  onOpenInterviewPrep: () => void;
  onOpenOptimizer: () => void;
  onBack: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onOpenVSCode,
  onOpenInterviewPrep,
  onOpenOptimizer,
  onBack,
}) => {
  // Store completed milestones in local state
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`skillbridge_milestones_${roadmap.target_role}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        `skillbridge_milestones_${roadmap.target_role}`,
        JSON.stringify(completedMilestones)
      );
    } catch {
      // ignore
    }
  }, [completedMilestones, roadmap.target_role]);

  const toggleMilestone = (id: string) => {
    const nextState = !completedMilestones[id];
    setCompletedMilestones((prev) => ({
      ...prev,
      [id]: nextState,
    }));

    if (nextState) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  // Calculate overall progress %
  const allMilestones: string[] = [];
  roadmap.phases.forEach((p) => {
    p.milestones.forEach((m) => allMilestones.push(m.id));
  });
  const totalCount = allMilestones.length || 1;
  const completedCount = allMilestones.filter((id) => completedMilestones[id]).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Export to Markdown
  const exportMarkdown = () => {
    let md = `# SkillBridge AI – Career Roadmap: ${roadmap.target_role}\n\n`;
    md += `> Duration: ${roadmap.total_weeks} Weeks | Commitment: ${roadmap.hours_per_week} hours/week\n\n`;

    roadmap.phases.forEach((phase) => {
      md += `## ${phase.title} (${phase.week_range})\n`;
      md += `**Target Skills:** ${phase.target_skills.join(', ')}\n\n`;
      md += `${phase.description}\n\n`;
      md += `### 🛠️ Hands-on Project: ${phase.project.name}\n`;
      md += `**Deliverable:** ${phase.project.deliverable}\n\n`;

      md += `### 📚 Recommended Resources:\n`;
      phase.resources.forEach((r) => {
        md += `- [${r.type}] [${r.title}](${r.url})\n`;
      });
      md += `\n### ✅ Milestones:\n`;
      phase.milestones.forEach((m) => {
        const isDone = completedMilestones[m.id] ? '[x]' : '[ ]';
        md += `- ${isDone} ${m.title}\n`;
      });
      md += `\n---\n\n`;
    });

    if (roadmap.capstone_project) {
      const cap = typeof roadmap.capstone_project === 'string'
        ? { name: roadmap.capstone_project }
        : roadmap.capstone_project;
      md += `## 🏆 Capstone Showcase: ${cap.name}\n\n`;
      if (cap.overview) md += `${cap.overview}\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge_${roadmap.target_role.replace(/\s+/g, '_')}_Roadmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON
  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(roadmap, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `SkillBridge_${roadmap.target_role.replace(/\s+/g, '_')}_Roadmap.json`;
    a.click();
  };

  const handleCopySummary = () => {
    const text = `SkillBridge AI Roadmap for ${roadmap.target_role} (${roadmap.total_weeks} Weeks):\n` +
      roadmap.phases.map((p) => `• ${p.title}: ${p.target_skills.join(', ')}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentPhase = roadmap.phases[activePhaseIndex] || roadmap.phases[0];

  return (
    <div className="space-y-6">
      {/* Roadmap Header & Progress Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Step 6: Personalized Learning Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              {roadmap.target_role} Career Roadmap
            </h1>
            <p className="text-indigo-200/90 text-xs sm:text-sm leading-relaxed">
              Tailored {roadmap.total_weeks}-week curriculum ({roadmap.hours_per_week} hours/week) bridging your exact skill gaps. Complete hands-on milestones, build portfolio projects, and prep for technical interviews.
            </p>
          </div>

          {/* Progress widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 min-w-[240px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                Overall Progress
              </span>
              <span className="text-sm font-black text-white">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-indigo-300">
              <span>{completedCount} of {totalCount} completed</span>
              <span>{roadmap.phases.length} Phases</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Export & Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/10">
          <button
            onClick={exportMarkdown}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown (.md)</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Roadmap</span>
          </button>
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={onOpenVSCode}
            className="ml-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open in VS Code Python Studio</span>
          </button>
        </div>
      </div>

      {/* Phase Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {roadmap.phases.map((phase, idx) => {
          const isActive = idx === activePhaseIndex;
          const phaseMilestones = phase.milestones.map((m) => m.id);
          const phaseDone = phaseMilestones.filter((id) => completedMilestones[id]).length;
          const isPhaseFullyDone = phaseMilestones.length > 0 && phaseDone === phaseMilestones.length;

          return (
            <button
              key={phase.phase_number}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Phase {phase.phase_number}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {phase.week_range}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-2">
                {phase.title.replace(/^Phase \d+:\s*/, '')}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{phaseDone}/{phaseMilestones.length} done</span>
                {isPhaseFullyDone && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Deep Dive */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Phase Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold">
                {currentPhase.week_range}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Phase {currentPhase.phase_number} of {roadmap.phases.length}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {currentPhase.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {currentPhase.description}
            </p>
          </div>

          {/* Target Skills Pill Cloud */}
          <div className="sm:text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Focus Skills for this Phase:
            </span>
            <div className="flex flex-wrap sm:justify-end gap-1.5">
              {currentPhase.target_skills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column: Milestones vs Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Milestone Checklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Actionable Milestones
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Click to mark done
              </span>
            </div>

            <div className="space-y-2">
              {currentPhase.milestones.map((m) => {
                const isChecked = Boolean(completedMilestones[m.id]);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/50 text-slate-500'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold leading-relaxed ${
                        isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {m.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hands-on Project Deliverable Card */}
            {currentPhase.project && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-blue-50/50 dark:from-indigo-950/40 dark:to-blue-950/20 border border-indigo-200/80 dark:border-indigo-900/40 mt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200">
                    Phase Project Deliverable
                  </span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {currentPhase.project.name}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                  {currentPhase.project.deliverable}
                </p>
                {currentPhase.project.architecture_tips && (
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg">
                    💡 Tip: {currentPhase.project.architecture_tips}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Curated Free Resources */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Curated Free Learning Resources
              </h4>
            </div>

            <div className="space-y-2.5">
              {currentPhase.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {res.type}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors block">
                        {res.title}
                      </span>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        {res.url}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0" />
                </a>
              ))}
            </div>

            {/* Interview Prep Drill Teaser */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ready to test knowledge for this phase?
                </span>
                <button
                  onClick={onOpenInterviewPrep}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Start Drills →
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Practice technical interview questions targeting {currentPhase.target_skills.slice(0, 2).join(' & ')}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Capstone Project Card */}
      {roadmap.capstone_project && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-6 h-6 text-amber-300" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
              End-of-Roadmap Portfolio Capstone
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mb-2">
            {typeof roadmap.capstone_project === 'string'
              ? roadmap.capstone_project
              : roadmap.capstone_project.name}
          </h3>
          <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed max-w-3xl mb-4">
            {typeof roadmap.capstone_project === 'object' && roadmap.capstone_project.overview
              ? roadmap.capstone_project.overview
              : 'Complete this production-grade project to bridge your final skill gaps and provide demonstrable proof of competence on your resume and GitHub.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenOptimizer}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-900 hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer"
            >
              Generate ATS Resume Bullets for this Project
            </button>
            <button
              onClick={onOpenVSCode}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 cursor-pointer"
            >
              Set up Python Project Files in VS Code
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Skill Diagnostic</span>
        </button>

        <button
          onClick={onOpenVSCode}
          className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Terminal className="w-4 h-4" />
          <span>Open Full VS Code & Python Workbench</span>
        </button>
      </div>
    </div>
  );
};
