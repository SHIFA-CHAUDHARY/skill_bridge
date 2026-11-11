import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, Sparkles, User, ArrowRight, AlertCircle, FileCheck2 } from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes';

interface ResumeUploadProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  pdfBase64: string | null;
  setPdfBase64: (b64: string | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
  onProceedToExtraction: () => void;
  isLoading: boolean;
  onSelectSampleRole?: (role: string) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  resumeText,
  setResumeText,
  pdfBase64,
  setPdfBase64,
  fileName,
  setFileName,
  onProceedToExtraction,
  isLoading,
  onSelectSampleRole,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setSelectedSampleId(null);

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        // Split data URL prefix
        const base64 = result.split(',')[1];
        setPdfBase64(base64);
        setResumeText(`[PDF Document: ${file.name} attached for multimodal AI analysis]`);
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text, markdown, or docx-like text
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = (ev.target?.result as string) || '';
        setResumeText(text);
        setPdfBase64(null);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleResume) => {
    setSelectedSampleId(sample.id);
    setResumeText(sample.text);
    setPdfBase64(null);
    setFileName(`${sample.name}_Resume.txt`);
    if (onSelectSampleRole) {
      onSelectSampleRole(sample.targetRole);
    }
  };

  const canProceed = Boolean(resumeText.trim() || pdfBase64);

  return (
    <div className="space-y-6">
      {/* Intro hero banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs mb-4 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Step 1: Student Resume Intake</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            SkillBridge AI – Engineering Skill Gap & Career Roadmap Predictor
          </h1>
          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
            Upload your resume or pick a student profile. Our AI engine extracts technical proficiencies, compares your background against 20+ real engineering target roles, flags critical skill gaps, and generates a personalized week-by-week learning roadmap.
          </p>
        </div>
      </div>

      {/* Instant Demo Presets Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Or Try One-Click Student Archetypes:
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click to auto-populate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_RESUMES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {sample.name}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {sample.subtitle}
                </p>
                <div className="mt-2 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  Target: {sample.targetRole}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Upload / Paste Workspace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {/* Tab switch */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document (.pdf, .txt, .docx)</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Resume Text</span>
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[0.99]'
                  : fileName
                  ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx,.md"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                {fileName ? (
                  <FileCheck2 className="w-8 h-8 text-emerald-500" />
                ) : (
                  <Upload className="w-8 h-8" />
                )}
              </div>

              {fileName ? (
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {fileName}
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    File loaded successfully and ready for AI analysis
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Click to replace with a different file
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                    Drop your resume here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse files</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Supports PDF, DOCX, TXT, and Markdown files.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="relative">
              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setSelectedSampleId(null);
                  setFileName('Pasted_Resume.txt');
                }}
                rows={12}
                placeholder="Paste your full resume here (Contact Info, Education, Technical Skills, Projects, Experience, Certifications)..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-4 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
              <div className="absolute bottom-3 right-3 text-[11px] text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded backdrop-blur-xs">
                {resumeText.length} characters | {resumeText.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-500" />
            <span>AI extracts technical stack, frameworks, tools, degree, and projects.</span>
          </div>

          <button
            disabled={!canProceed || isLoading}
            onClick={onProceedToExtraction}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              canProceed && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/25 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI Extracting Profile...</span>
              </>
            ) : (
              <>
                <span>Extract Skills & Profile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
