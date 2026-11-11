import React, { useState } from 'react';
import { Search, Target, Clock, Calendar, ArrowRight, ArrowLeft, Cpu, BarChart2, Network, Code, PieChart, Layers, Server, Cloud, ShieldCheck, Radio, Eye, BookOpen, Check } from 'lucide-react';
import { ENGINEERING_ROLES } from '../data/roleBenchmarks';
import { EngineeringRole } from '../types';

interface RoleSelectorProps {
  selectedRoleTitle: string;
  onSelectRole: (roleTitle: string) => void;
  targetLevel: string;
  setTargetLevel: (level: string) => void;
  totalWeeks: number;
  setTotalWeeks: (weeks: number) => void;
  hoursPerWeek: number;
  setHoursPerWeek: (hours: number) => void;
  onProceedToCompare: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const CATEGORIES = ['All', 'AI & Data', 'Software & Systems', 'Cloud & Operations', 'Specialized'];

// Map icon names to Lucide icons
const getRoleIcon = (name: string) => {
  switch (name) {
    case 'Cpu': return Cpu;
    case 'BarChart2': return BarChart2;
    case 'Network': return Network;
    case 'Code': return Code;
    case 'PieChart': return PieChart;
    case 'Layers': return Layers;
    case 'Server': return Server;
    case 'Cloud': return Cloud;
    case 'ShieldCheck': return ShieldCheck;
    case 'Radio': return Radio;
    case 'Eye': return Eye;
    case 'BookOpen': return BookOpen;
    default: return Code;
  }
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRoleTitle,
  onSelectRole,
  targetLevel,
  setTargetLevel,
  totalWeeks,
  setTotalWeeks,
  hoursPerWeek,
  setHoursPerWeek,
  onProceedToCompare,
  onBack,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRoles = ENGINEERING_ROLES.filter((role) => {
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.core_skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Step 3: Engineering Career Goal</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Select Your Target Engineering Role
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose from Data Scientist, AI Engineer, Python Developer, ML Engineer, Data Analyst, Software Engineer, and more. SkillBridge will benchmark your resume against the industry standards for that exact position.
          </p>
        </div>
      </div>

      {/* Preferences & Roadmap Parameters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Target Level */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
            Target Career Tier
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['Junior', 'Mid-Level', 'Senior'].map((level) => (
              <button
                key={level}
                onClick={() => setTargetLevel(level)}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all ${
                  targetLevel === level
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Weeks */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Roadmap Duration</span>
          </label>
          <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[4, 8, 12, 24].map((w) => (
              <button
                key={w}
                onClick={() => setTotalWeeks(w)}
                className={`py-1.5 px-1 text-xs font-bold rounded-lg transition-all ${
                  totalWeeks === w
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {w} Wks
              </button>
            ))}
          </div>
        </div>

        {/* Study Hours/Week */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Weekly Commitment</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { hrs: 5, label: '5h (Casual)' },
              { hrs: 10, label: '10h (Balanced)' },
              { hrs: 20, label: '20h (Intense)' },
            ].map((item) => (
              <button
                key={item.hrs}
                onClick={() => setHoursPerWeek(item.hrs)}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all ${
                  hoursPerWeek === item.hrs
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles or skills (e.g. Python, PyTorch)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => {
          const isSelected = selectedRoleTitle === role.title;
          const Icon = getRoleIcon(role.iconName);

          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.title)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                        {role.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {role.category}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {role.description}
                </p>

                {/* Core skills badges */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core Benchmark Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.core_skills.slice(0, 5).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                    {role.core_skills.length > 5 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-slate-400">
                        +{role.core_skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {role.avg_salary}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {role.difficulty}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating or Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Target: {selectedRoleTitle} ({targetLevel})
            </span>
            <span className="text-[11px] text-slate-400">
              {totalWeeks} Weeks • {hoursPerWeek} hrs/week
            </span>
          </div>

          <button
            disabled={!selectedRoleTitle || isLoading}
            onClick={onProceedToCompare}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isLoading ? 'opacity-80' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Comparing Skills...</span>
              </>
            ) : (
              <>
                <span>Compare Skills & Identify Gaps (Step 4 & 5)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
