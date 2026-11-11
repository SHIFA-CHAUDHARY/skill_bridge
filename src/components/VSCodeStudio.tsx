import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileCode,
  Play,
  Download,
  Copy,
  Check,
  Terminal as TerminalIcon,
  Settings,
  Bug,
  Search,
  Files,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import JSZip from 'jszip';
import { Roadmap, GapAnalysis } from '../types';

interface VSCodeStudioProps {
  currentRoadmap?: Roadmap | null;
  currentAnalysis?: GapAnalysis | null;
}

export const VSCodeStudio: React.FC<VSCodeStudioProps> = ({
  currentRoadmap,
  currentAnalysis,
}) => {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState<string>(
    `SkillBridge Python Engine v1.0.0 (Python 3.10.12)\nType or click a command below to run the analyzer and roadmap generator in the VS Code terminal.\n`
  );
  const [isRunning, setIsRunning] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState<string>('analyze');
  const [targetRoleParam, setTargetRoleParam] = useState<string>(
    currentAnalysis?.target_role || 'AI Engineer'
  );

  // Folder open/close states
  const [foldersOpen, setFoldersOpen] = useState({
    skillbridge: true,
    tests: true,
    vscode: true,
  });

  // Fetch file contents on mount
  useEffect(() => {
    fetch('/api/python-files')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setFiles(data.files);
        }
      })
      .catch((err) => console.error('Failed to load python files:', err));
  }, []);

  const handleCopyCode = () => {
    const code = files[selectedFile] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Python command via backend /api/run-python
  const runPythonCommand = async (cmdType: string, customArgs?: string[]) => {
    setIsRunning(true);
    const roleArg = targetRoleParam;

    let args: string[] = [];
    let script = 'main.py';
    let displayCmd = '';

    if (cmdType === 'analyze') {
      args = ['analyze', '--role', roleArg];
      displayCmd = `python3 skillbridge/main.py analyze --role "${roleArg}"`;
    } else if (cmdType === 'roadmap') {
      args = ['roadmap', '--role', roleArg, '--weeks', '8', '--hours', '10'];
      displayCmd = `python3 skillbridge/main.py roadmap --role "${roleArg}" --weeks 8 --hours 10`;
    } else if (cmdType === 'list-roles') {
      args = ['list-roles'];
      displayCmd = `python3 skillbridge/main.py list-roles`;
    } else if (cmdType === 'test') {
      script = 'test';
      displayCmd = `python3 -m unittest discover tests`;
    }

    setTerminalOutput((prev) => `${prev}\nstudent@skillbridge:~/skillbridge-ai$ ${displayCmd}\n`);

    try {
      const res = await fetch('/api/run-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, args: customArgs || args }),
      });
      const data = await res.json();

      let output = '';
      if (data.stdout) output += data.stdout;
      if (data.stderr) output += `\n[STDERR]\n${data.stderr}`;
      if (!output) output = '[Command completed with no output]';

      setTerminalOutput((prev) => `${prev}${output}\n`);
    } catch (err: any) {
      setTerminalOutput((prev) => `${prev}\n[Error running Python command]: ${err.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  // One-click Download VS Code project ZIP
  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      // Add all project files
      for (const [filePath, content] of Object.entries(files)) {
        zip.file(filePath, content);
      }

      // Add __init__.py if not present
      if (!zip.file('skillbridge/__init__.py')) {
        zip.file('skillbridge/__init__.py', '"""SkillBridge AI Package"""\n__version__ = "1.0.0"\n');
      }

      // If roadmap exists, include export files
      if (currentRoadmap) {
        zip.file('my_career_roadmap.json', JSON.stringify(currentRoadmap, null, 2));
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skillbridge-ai-vscode.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.py')) return <FileCode className="w-4 h-4 text-emerald-400" />;
    if (fileName.endsWith('.json')) return <span className="text-amber-400 font-mono text-xs">{'{ }'}</span>;
    if (fileName.endsWith('.md')) return <span className="text-blue-400 font-mono text-xs">M↓</span>;
    return <FileCode className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-800/80 mb-3">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Smooth VS Code & Python Programming Environment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            VS Code Workspace & Streamlit / ML Studio
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-3">
            SkillBridge AI is engineered with <strong>Python</strong>, <strong>Pandas & NumPy</strong>, <strong>Scikit-learn (TF-IDF & Cosine Similarity)</strong>, <strong>spaCy NLP</strong>, and <strong>Streamlit</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Python 3.10</span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Pandas & NumPy</span>
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">Scikit-learn</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">spaCy NLP</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">Streamlit</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => runPythonCommand('analyze')}
            disabled={isRunning}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Executing Python...' : 'Run Analyzer (F5)'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/25 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Bundling ZIP...' : 'Download VS Code Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* VS Code IDE Frame */}
      <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-2xl shadow-2xl overflow-hidden font-mono text-xs text-[#cccccc]">
        {/* Title bar */}
        <div className="bg-[#323233] px-4 py-2 flex items-center justify-between border-b border-[#252526] select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-slate-300 text-xs ml-3 font-sans">
              SkillBridge AI – Visual Studio Code [Python 3.10 Engine]
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-sans text-xs">
            <span className="hidden sm:inline">main.py - skillbridge-ai</span>
            <span className="px-2 py-0.5 rounded bg-[#252526] text-emerald-400 text-[10px]">
              Python 3.10 (64-bit)
            </span>
          </div>
        </div>

        {/* Main Editor Body: Activity Bar + Explorer + Code + Terminal */}
        <div className="flex flex-col md:flex-row min-h-[560px]">
          {/* Activity Bar (Vertical Left) */}
          <div className="w-12 bg-[#333333] flex md:flex-col items-center justify-between py-3 border-r border-[#252526] shrink-0">
            <div className="flex md:flex-col items-center gap-4">
              <button title="Explorer" className="p-2 text-white border-l-2 border-white">
                <Files className="w-5 h-5" />
              </button>
              <button title="Search" className="p-2 text-slate-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button
                title="Run and Debug (F5)"
                onClick={() => runPythonCommand('analyze')}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Bug className="w-5 h-5" />
              </button>
            </div>
            <div>
              <button title="Settings" className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Explorer Sidebar */}
          <div className="w-full md:w-64 bg-[#252526] border-r border-[#1e1e1e] p-3 shrink-0 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Explorer: SKILLBRIDGE-AI</span>
                <span className="text-[10px] text-slate-500 font-mono">VS CODE</span>
              </div>

              {/* File Tree */}
              <div className="space-y-1">
                {/* Folder: skillbridge/ */}
                <div>
                  <div
                    onClick={() => setFoldersOpen((p) => ({ ...p, skillbridge: !p.skillbridge }))}
                    className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-[#2a2d2e] cursor-pointer text-slate-300 font-bold"
                  >
                    {foldersOpen.skillbridge ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <Folder className="w-3.5 h-3.5 text-amber-300 fill-current" />
                    <span>skillbridge</span>
                  </div>

                  {foldersOpen.skillbridge && (
                    <div className="pl-5 space-y-0.5">
                      {[
                        'skillbridge/main.py',
                        'skillbridge/analyzer.py',
                        'skillbridge/roadmap_generator.py',
                        'skillbridge/benchmarks.py',
                      ].map((fp) => (
                        <div
                          key={fp}
                          onClick={() => setSelectedFile(fp)}
                          className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors ${
                            selectedFile === fp
                              ? 'bg-[#37373d] text-white font-bold'
                              : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'
                          }`}
                        >
                          {getFileIcon(fp)}
                          <span className="truncate">{fp.replace('skillbridge/', '')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Folder: tests/ */}
                <div>
                  <div
                    onClick={() => setFoldersOpen((p) => ({ ...p, tests: !p.tests }))}
                    className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-[#2a2d2e] cursor-pointer text-slate-300 font-bold"
                  >
                    {foldersOpen.tests ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <Folder className="w-3.5 h-3.5 text-amber-300 fill-current" />
                    <span>tests</span>
                  </div>

                  {foldersOpen.tests && (
                    <div className="pl-5 space-y-0.5">
                      <div
                        onClick={() => setSelectedFile('tests/test_analyzer.py')}
                        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors ${
                          selectedFile === 'tests/test_analyzer.py'
                            ? 'bg-[#37373d] text-white font-bold'
                            : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'
                        }`}
                      >
                        {getFileIcon('tests/test_analyzer.py')}
                        <span>test_analyzer.py</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Folder: .vscode/ */}
                <div>
                  <div
                    onClick={() => setFoldersOpen((p) => ({ ...p, vscode: !p.vscode }))}
                    className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-[#2a2d2e] cursor-pointer text-slate-300 font-bold"
                  >
                    {foldersOpen.vscode ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <Folder className="w-3.5 h-3.5 text-slate-400 fill-current" />
                    <span>.vscode</span>
                  </div>

                  {foldersOpen.vscode && (
                    <div className="pl-5 space-y-0.5">
                      {['.vscode/launch.json', '.vscode/tasks.json'].map((fp) => (
                        <div
                          key={fp}
                          onClick={() => setSelectedFile(fp)}
                          className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors ${
                            selectedFile === fp
                              ? 'bg-[#37373d] text-white font-bold'
                              : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'
                          }`}
                        >
                          {getFileIcon(fp)}
                          <span>{fp.replace('.vscode/', '')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Core Streamlit, NLP & Scikit-learn Python files */}
                <div className="pt-2 border-t border-[#333333]/60 mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-2 pb-1">
                    Streamlit & ML Stack:
                  </span>
                  {[
                    'app.py',
                    'nlp_extractor.py',
                    'similarity_engine.py',
                    'role_dataset.py',
                    'roadmap_engine.py',
                    'requirements.txt',
                    'README.md',
                  ].map((fp) => (
                    <div
                      key={fp}
                      onClick={() => setSelectedFile(fp)}
                      className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors ${
                        selectedFile === fp
                          ? 'bg-[#37373d] text-white font-bold'
                          : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'
                      }`}
                    >
                      {getFileIcon(fp)}
                      <span className="truncate">{fp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick action in sidebar */}
            <div className="pt-3 border-t border-[#333333] mt-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                F5 Debug Target:
              </span>
              <select
                value={targetRoleParam}
                onChange={(e) => setTargetRoleParam(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] text-slate-200 text-xs rounded p-1.5 focus:outline-none"
              >
                <option value="AI Engineer">AI Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Machine Learning Engineer">ML Engineer</option>
                <option value="Software Engineer (Full Stack)">Full Stack Engineer</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps</option>
              </select>
            </div>
          </div>

          {/* Center Column: Editor Tabs + Code View */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            {/* Editor Tab Bar */}
            <div className="bg-[#252526] flex items-center justify-between border-b border-[#1e1e1e] px-2 overflow-x-auto">
              <div className="flex items-center">
                <div className="bg-[#1e1e1e] border-t-2 border-indigo-500 py-2 px-4 flex items-center gap-2 text-slate-200 font-bold">
                  {getFileIcon(selectedFile)}
                  <span>{selectedFile.split('/').pop()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pr-2">
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                  title="Copy File Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => runPythonCommand('analyze')}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 text-[11px] cursor-pointer"
                  title="Run Python Script"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run</span>
                </button>
              </div>
            </div>

            {/* Code Content View */}
            <div className="flex-1 p-4 overflow-auto max-h-[380px] text-xs leading-relaxed font-mono select-text bg-[#1e1e1e]">
              <pre className="text-slate-300">
                {(files[selectedFile] || '# Loading code from skillbridge engine...').split('\n').map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-10 text-slate-600 select-none text-right pr-4 shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap">{line}</span>
                  </div>
                ))}
              </pre>
            </div>

            {/* Integrated Terminal */}
            <div className="border-t border-[#333333] bg-[#181818] p-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2d2d2d] mb-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-200 font-bold">TERMINAL: bash (Python 3.10.12)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runPythonCommand('analyze')}
                    disabled={isRunning}
                    className="px-2 py-0.5 rounded bg-[#2d2d2d] hover:bg-[#3d3d3d] text-emerald-400 font-mono text-[10px] cursor-pointer"
                  >
                    main.py analyze
                  </button>
                  <button
                    onClick={() => runPythonCommand('roadmap')}
                    disabled={isRunning}
                    className="px-2 py-0.5 rounded bg-[#2d2d2d] hover:bg-[#3d3d3d] text-blue-400 font-mono text-[10px] cursor-pointer"
                  >
                    main.py roadmap
                  </button>
                  <button
                    onClick={() => runPythonCommand('test')}
                    disabled={isRunning}
                    className="px-2 py-0.5 rounded bg-[#2d2d2d] hover:bg-[#3d3d3d] text-amber-400 font-mono text-[10px] cursor-pointer"
                  >
                    unittest discover
                  </button>
                  <button
                    onClick={() => setTerminalOutput(`Terminal cleared.\n`)}
                    className="text-slate-500 hover:text-slate-300 text-[10px]"
                    title="Clear Terminal"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Terminal Logs Window */}
              <div className="h-44 overflow-y-auto font-mono text-[11px] text-emerald-400 whitespace-pre-wrap leading-tight bg-[#121212] p-2.5 rounded border border-[#252526]">
                {terminalOutput}
                {isRunning && (
                  <div className="flex items-center gap-2 text-slate-400 mt-1 animate-pulse">
                    <span>Executing python3 process in container...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* VS Code Status Bar */}
        <div className="bg-[#007acc] text-white px-3 py-1 flex items-center justify-between text-[11px] select-none font-sans">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold">
              <TerminalIcon className="w-3 h-3" /> main*
            </span>
            <span>0 Errors, 0 Warnings</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Spaces: 4</span>
            <span>Python 3.10.12</span>
            <span>Prettier: ✓</span>
          </div>
        </div>
      </div>

      {/* VS Code Local Setup Instructions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>How to run this project smoothly in local Visual Studio Code:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-2">
              1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
              Download & Unzip
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Click the "Download VS Code Project (.zip)" button above and extract the folder to your local machine.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-2">
              2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
              Open in VS Code
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Open the extracted directory in VS Code (<code className="text-indigo-600">code .</code>). VS Code will recognize <code className="text-indigo-600">.vscode/launch.json</code> automatically.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-2">
              3
            </span>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
              Press F5 to Debug
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Hit <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-bold">F5</kbd> to launch the Python analyzer with interactive breakpoints and live console feedback!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
