import React, { useState } from 'react';
import { Header } from './components/Header';
import { StepProgress } from './components/StepProgress';
import { ResumeUpload } from './components/ResumeUpload';
import { ExtractedProfileView } from './components/ExtractedProfileView';
import { RoleSelector } from './components/RoleSelector';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { RoadmapView } from './components/RoadmapView';
import { VSCodeStudio } from './components/VSCodeStudio';
import { ResumeOptimizerModal } from './components/ResumeOptimizerModal';
import { InterviewPrepModal } from './components/InterviewPrepModal';
import { GapAnalysis, Roadmap } from './types';
import { SAMPLE_RESUMES } from './data/sampleResumes';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'analyzer' | 'vscode'>('analyzer');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);

  // Resume State
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES[0].text);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>('Aarav_Sharma_Resume.txt');

  // Role Configuration State
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>('AI Engineer');
  const [targetLevel, setTargetLevel] = useState<string>('Junior');
  const [totalWeeks, setTotalWeeks] = useState<number>(8);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);

  // Analysis & Roadmap State
  const [analysis, setAnalysis] = useState<GapAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isInterviewPrepOpen, setIsInterviewPrepOpen] = useState(false);

  // Step 1 -> 2: Extract skills & candidate info
  const handleExtractProfile = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          pdfBase64,
          targetRole: selectedRoleTitle,
          targetLevel,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAnalysis(data.data);
        setCurrentStep(2);
        setMaxAccessibleStep((prev) => Math.max(prev, 2));
      } else {
        setErrorMessage(data.error || 'Failed to extract resume profile');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with analysis engine');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 -> 4: Compare skills & identify missing gaps for selected role
  const handleCompareSkills = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          pdfBase64,
          targetRole: selectedRoleTitle,
          targetLevel,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAnalysis(data.data);
        setCurrentStep(4);
        setMaxAccessibleStep((prev) => Math.max(prev, 5));
      } else {
        setErrorMessage(data.error || 'Failed to analyze skill gap');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error comparing skills');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 5 -> 6: Generate personalized roadmap
  const handleGenerateRoadmap = async () => {
    if (!analysis) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gapAnalysis: analysis,
          targetRole: selectedRoleTitle,
          targetLevel,
          totalWeeks,
          hoursPerWeek,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setRoadmap(data.data);
        setCurrentStep(6);
        setMaxAccessibleStep(6);
      } else {
        setErrorMessage(data.error || 'Failed to generate career roadmap');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error generating roadmap');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setMaxAccessibleStep(1);
    setAnalysis(null);
    setRoadmap(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      {currentTab === 'analyzer' ? (
        <main className="flex-1 pb-16">
          {/* 6-Step Visual Breadcrumbs */}
          <StepProgress
            currentStep={currentStep}
            onStepClick={(s) => setCurrentStep(s)}
            maxAccessibleStep={maxAccessibleStep}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="font-bold underline text-xs"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* STEP 1: Upload Resume */}
            {currentStep === 1 && (
              <ResumeUpload
                resumeText={resumeText}
                setResumeText={setResumeText}
                pdfBase64={pdfBase64}
                setPdfBase64={setPdfBase64}
                fileName={fileName}
                setFileName={setFileName}
                onProceedToExtraction={handleExtractProfile}
                isLoading={isLoading}
                onSelectSampleRole={(role) => setSelectedRoleTitle(role)}
              />
            )}

            {/* STEP 2: AI Extraction of Skills & Credentials */}
            {currentStep === 2 && analysis && (
              <ExtractedProfileView
                analysis={analysis}
                onProceedToRole={() => {
                  setCurrentStep(3);
                  setMaxAccessibleStep((p) => Math.max(p, 3));
                }}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {/* STEP 3: Select Target Engineering Role */}
            {currentStep === 3 && (
              <RoleSelector
                selectedRoleTitle={selectedRoleTitle}
                onSelectRole={(r) => setSelectedRoleTitle(r)}
                targetLevel={targetLevel}
                setTargetLevel={setTargetLevel}
                totalWeeks={totalWeeks}
                setTotalWeeks={setTotalWeeks}
                hoursPerWeek={hoursPerWeek}
                setHoursPerWeek={setHoursPerWeek}
                onProceedToCompare={handleCompareSkills}
                onBack={() => setCurrentStep(2)}
                isLoading={isLoading}
              />
            )}

            {/* STEPS 4 & 5: AI Skill Comparison & Missing Skills Diagnostic */}
            {(currentStep === 4 || currentStep === 5) && analysis && (
              <SkillGapAnalysis
                analysis={analysis}
                onGenerateRoadmap={handleGenerateRoadmap}
                onOpenOptimizer={() => setIsOptimizerOpen(true)}
                onOpenInterviewPrep={() => setIsInterviewPrepOpen(true)}
                onOpenVSCode={() => setCurrentTab('vscode')}
                onBack={() => setCurrentStep(3)}
                isLoading={isLoading}
              />
            )}

            {/* STEP 6: Personalized Learning Roadmap */}
            {currentStep === 6 && roadmap && (
              <RoadmapView
                roadmap={roadmap}
                onOpenVSCode={() => setCurrentTab('vscode')}
                onOpenInterviewPrep={() => setIsInterviewPrepOpen(true)}
                onOpenOptimizer={() => setIsOptimizerOpen(true)}
                onBack={() => setCurrentStep(4)}
              />
            )}
          </div>
        </main>
      ) : (
        /* VS Code Studio & Python Engine Tab */
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <VSCodeStudio
              currentRoadmap={roadmap}
              currentAnalysis={analysis}
            />
          </div>
        </main>
      )}

      {/* AI Resume Bullet Optimizer Modal */}
      <ResumeOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
        targetRole={selectedRoleTitle}
        candidateSkills={analysis?.extracted_skills || []}
        missingSkills={analysis?.missing_core_skills || []}
      />

      {/* Technical Mock Interview Prep Modal */}
      <InterviewPrepModal
        isOpen={isInterviewPrepOpen}
        onClose={() => setIsInterviewPrepOpen(false)}
        targetRole={selectedRoleTitle}
        missingSkills={analysis?.missing_core_skills || []}
      />
    </div>
  );
}
