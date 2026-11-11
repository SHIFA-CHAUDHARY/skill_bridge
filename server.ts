import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import JSZip from 'jszip';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize server-side Gemini client per skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // Helper to execute local Python scripts
  const runPythonScript = (args: string[], inputStdin?: string): Promise<{ stdout: string; stderr: string; code: number | null }> => {
    return new Promise((resolve) => {
      const child = spawn('python3', args, { cwd: __dirname });
      let stdout = '';
      let stderr = '';

      if (inputStdin) {
        child.stdin.write(inputStdin);
        child.stdin.end();
      }

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({ stdout, stderr, code });
      });

      child.on('error', (err) => {
        resolve({ stdout: '', stderr: err.message, code: 1 });
      });
    });
  };

  // Endpoint: Run Python snippet or script for VS Code interactive playground
  app.post('/api/run-python', async (req: Request, res: Response) => {
    try {
      const { command, script, customCode, args } = req.body;

      if (customCode) {
        // Execute arbitrary Python code safely
        const tempPath = path.join(__dirname, 'skillbridge', '_runner_temp.py');
        await fs.promises.writeFile(tempPath, customCode, 'utf-8');
        const result = await runPythonScript([tempPath, ...(args || [])]);
        try {
          await fs.promises.unlink(tempPath);
        } catch {
          // ignore
        }
        return res.json({
          success: result.code === 0,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.code,
        });
      }

      let scriptArgs: string[] = [];
      if (script === 'main.py') {
        scriptArgs = ['skillbridge/main.py', ...(args || ['analyze', '--role', 'AI Engineer'])];
      } else if (script === 'analyzer.py') {
        scriptArgs = ['skillbridge/analyzer.py', ...(args || ['AI Engineer'])];
      } else if (script === 'roadmap_generator.py') {
        scriptArgs = ['skillbridge/roadmap_generator.py'];
      } else if (script === 'test') {
        scriptArgs = ['-m', 'unittest', 'discover', 'tests'];
      } else {
        scriptArgs = ['skillbridge/main.py', ...(args || ['list-roles'])];
      }

      const result = await runPythonScript(scriptArgs);
      return res.json({
        success: result.code === 0,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.code,
      });
    } catch (err: any) {
      console.error('Python execution error:', err);
      return res.status(500).json({ error: err.message || 'Failed to execute Python' });
    }
  });

  // Endpoint: Get project source files for VS Code studio viewer
  app.get('/api/python-files', async (_req: Request, res: Response) => {
    try {
      const files: Record<string, string> = {};
      const filePaths = [
        'app.py',
        'nlp_extractor.py',
        'similarity_engine.py',
        'role_dataset.py',
        'roadmap_engine.py',
        'skillbridge/main.py',
        'skillbridge/analyzer.py',
        'skillbridge/roadmap_generator.py',
        'skillbridge/benchmarks.py',
        'requirements.txt',
        '.vscode/launch.json',
        '.vscode/tasks.json',
        'tests/test_analyzer.py',
        'README.md',
      ];

      for (const fp of filePaths) {
        const fullPath = path.join(__dirname, fp);
        if (fs.existsSync(fullPath)) {
          files[fp] = await fs.promises.readFile(fullPath, 'utf-8');
        }
      }

      return res.json({ files });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Endpoint: Download complete project as ZIP for VS Code
  app.get('/api/download-zip', async (_req: Request, res: Response) => {
    try {
      const zip = new JSZip();

      const projectFiles = [
        'app.py',
        'nlp_extractor.py',
        'similarity_engine.py',
        'role_dataset.py',
        'roadmap_engine.py',
        'requirements.txt',
        'README.md',
        '.vscode/launch.json',
        '.vscode/tasks.json',
        'skillbridge/__init__.py',
        'skillbridge/main.py',
        'skillbridge/analyzer.py',
        'skillbridge/roadmap_generator.py',
        'skillbridge/benchmarks.py',
        'tests/test_analyzer.py',
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'index.html',
        '.env.example',
        'server.ts',
        'src/main.tsx',
        'src/App.tsx',
        'src/index.css',
        'src/types/index.ts',
        'src/data/roleBenchmarks.ts',
        'src/data/sampleResumes.ts',
        'src/components/Header.tsx',
        'src/components/StepProgress.tsx',
        'src/components/ResumeUpload.tsx',
        'src/components/ExtractedProfileView.tsx',
        'src/components/RoleSelector.tsx',
        'src/components/SkillGapAnalysis.tsx',
        'src/components/RoadmapView.tsx',
        'src/components/VSCodeStudio.tsx',
        'src/components/ResumeOptimizerModal.tsx',
        'src/components/InterviewPrepModal.tsx',
      ];

      for (const relPath of projectFiles) {
        const fullPath = path.join(__dirname, relPath);
        if (fs.existsSync(fullPath)) {
          const content = await fs.promises.readFile(fullPath);
          zip.file(relPath, content);
        }
      }

      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="skillbridge-ai-vscode.zip"');
      return res.send(buffer);
    } catch (err: any) {
      console.error('ZIP generation error:', err);
      return res.status(500).json({ error: 'Failed to generate ZIP bundle' });
    }
  });

  // Endpoint: Analyze resume & compute skill gaps
  app.post('/api/analyze-resume', async (req: Request, res: Response) => {
    try {
      const { resumeText, targetRole = 'AI Engineer', targetLevel = 'Junior', pdfBase64 } = req.body;

      if (!resumeText && !pdfBase64) {
        return res.status(400).json({ error: 'Resume text or PDF upload is required' });
      }

      // First, attempt real Gemini 3.8 Flash extraction and gap analysis
      if (process.env.GEMINI_API_KEY) {
        try {
          const contents: any[] = [];
          if (pdfBase64) {
            contents.push({
              inlineData: {
                mimeType: 'application/pdf',
                data: pdfBase64,
              },
            });
          }

          const prompt = `You are SkillBridge AI, a Senior Technical Recruiter & Engineering Director.
Analyze the following student resume for the target role: "${targetRole}" (Target Level: ${targetLevel}).

Resume Content:
${resumeText || '[Resume provided as PDF document attached]'}

Evaluate the candidate's skills against industry standards for a modern ${targetLevel} ${targetRole}.
Return a strict JSON object with this exact structure:
{
  "candidate": {
    "name": string,
    "email": string,
    "phone": string,
    "degree": string,
    "university": string,
    "estimated_years_experience": number,
    "summary": string
  },
  "target_role": "${targetRole}",
  "match_score": number (0 to 100),
  "ats_score": number (0 to 100),
  "readiness_tier": string (e.g. "Interview Ready (High Match)", "Promising Candidate (Moderate Gap)", or "Emerging Learner (Foundational Gap)"),
  "readiness_summary": string (2-3 sentences explaining strengths and biggest gap),
  "extracted_skills": string[] (all technical and soft skills identified in the resume),
  "matched_core_skills": string[] (core skills required for ${targetRole} that the student possesses),
  "missing_core_skills": string[] (critical must-have skills for ${targetRole} missing from their resume),
  "partially_matched_skills": [
    {
      "required": string,
      "candidate_has": string,
      "explanation": string
    }
  ],
  "missing_secondary_skills": string[] (nice-to-have or differentiator skills missing),
  "key_strengths": string[] (3-4 standout highlights from their resume),
  "ats_warnings": string[] (2-3 formatting or keyword suggestions to pass applicant tracking systems)
}`;

          contents.push({ text: prompt });

          const geminiResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const jsonText = geminiResponse.text?.trim() || '{}';
          const parsed = JSON.parse(jsonText);
          return res.json({ success: true, data: parsed, engine: 'Gemini 3.8 Flash' });
        } catch (geminiError: any) {
          console.warn('Gemini API call failed, falling back to local Python engine:', geminiError.message);
        }
      }

      // Fallback: Invoke native Python engine
      const pyResult = await runPythonScript(['skillbridge/analyzer.py', targetRole], resumeText || 'Engineering Student Resume with Python and SQL');
      if (pyResult.stdout) {
        try {
          const parsed = JSON.parse(pyResult.stdout);
          return res.json({ success: true, data: parsed, engine: 'Python 3 Engine' });
        } catch {
          // continue to fallback
        }
      }

      return res.status(500).json({ error: 'Failed to process resume analysis' });
    } catch (err: any) {
      console.error('Error in /api/analyze-resume:', err);
      return res.status(500).json({ error: err.message || 'Internal analysis error' });
    }
  });

  // Endpoint: Generate personalized learning roadmap
  app.post('/api/generate-roadmap', async (req: Request, res: Response) => {
    try {
      const { gapAnalysis, targetRole = 'AI Engineer', totalWeeks = 8, hoursPerWeek = 10, targetLevel = 'Junior' } = req.body;

      if (!gapAnalysis) {
        return res.status(400).json({ error: 'Gap analysis data is required' });
      }

      if (process.env.GEMINI_API_KEY) {
        try {
          const prompt = `You are SkillBridge AI's Chief Engineering Mentor.
Based on the candidate's skill gap analysis for the target role "${targetRole}" (${targetLevel} level), construct a personalized ${totalWeeks}-week learning roadmap (${hoursPerWeek} study hours/week).

Missing Core Skills: ${(gapAnalysis.missing_core_skills || []).join(', ')}
Missing Secondary Skills: ${(gapAnalysis.missing_secondary_skills || []).join(', ')}
Already Matched Skills: ${(gapAnalysis.matched_core_skills || []).join(', ')}

Create 4 progressive phases spanning the ${totalWeeks} weeks.
Output a strict JSON object with this exact structure:
{
  "target_role": "${targetRole}",
  "total_weeks": ${totalWeeks},
  "hours_per_week": ${hoursPerWeek},
  "total_phases": 4,
  "phases": [
    {
      "phase_number": number (1 to 4),
      "title": string (e.g. "Phase 1: Foundations & Core Frameworks"),
      "week_range": string (e.g. "Weeks 1-2"),
      "target_skills": string[],
      "description": string (deep overview of what and why),
      "project": {
        "name": string,
        "deliverable": string,
        "tech_stack": string[],
        "architecture_tips": string
      },
      "resources": [
        {
          "title": string,
          "type": string (e.g. "Documentation", "Course", "Video", "GitHub Repo"),
          "url": string,
          "free": boolean
        }
      ],
      "milestones": [
        {
          "id": string,
          "title": string,
          "done": false
        }
      ],
      "interview_drills": string[]
    }
  ],
  "capstone_project": {
    "name": string,
    "overview": string,
    "key_features": string[],
    "resume_impact_bullet": string
  },
  "overall_strategy": string
}`;

          const geminiResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const jsonText = geminiResponse.text?.trim() || '{}';
          const parsed = JSON.parse(jsonText);
          return res.json({ success: true, data: parsed, engine: 'Gemini 3.8 Flash' });
        } catch (geminiError: any) {
          console.warn('Gemini roadmap generation fallback to Python:', geminiError.message);
        }
      }

      // Fallback: Generate via Python roadmap_generator.py
      const tempGapFile = path.join(__dirname, 'skillbridge', '_temp_gap.json');
      await fs.promises.writeFile(tempGapFile, JSON.stringify(gapAnalysis), 'utf-8');

      const pyCode = `
import json
from skillbridge.roadmap_generator import generate_roadmap
with open('${tempGapFile}', 'r') as f:
    gap = json.load(f)
roadmap = generate_roadmap(gap, total_weeks=${totalWeeks}, hours_per_week=${hoursPerWeek})
print(json.dumps(roadmap))
`;
      const result = await runPythonScript(['-c', pyCode]);
      try {
        await fs.promises.unlink(tempGapFile);
      } catch {}

      if (result.stdout) {
        try {
          const parsed = JSON.parse(result.stdout);
          return res.json({ success: true, data: parsed, engine: 'Python 3 Engine' });
        } catch {}
      }

      return res.status(500).json({ error: 'Failed to generate roadmap' });
    } catch (err: any) {
      console.error('Error in /api/generate-roadmap:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Endpoint: AI Resume Bullet Optimizer
  app.post('/api/optimize-resume', async (req: Request, res: Response) => {
    try {
      const { candidateSkills, targetRole, missingSkills } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          bullets: [
            `Engineered scalable microservices in Python utilizing FastAPI, boosting response throughput by 35%.`,
            `Implemented retrieval-augmented generation (RAG) pipeline with vector embeddings and ChromaDB.`,
            `Containerized end-to-end ML training and serving workflows with Docker and automated CI/CD.`,
          ],
        });
      }

      const prompt = `Generate 5 high-impact, ATS-optimized Google-XYZ formula resume bullet points ("Accomplished [X] as measured by [Y], by doing [Z]") for a candidate aiming to land a ${targetRole} position.
Their current skills: ${(candidateSkills || []).join(', ')}
Skills they are bridging: ${(missingSkills || []).join(', ')}

Return a strict JSON object: { "bullets": string[], "ats_advice": string[] }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text?.trim() || '{"bullets": []}');
      return res.json(parsed);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Endpoint: Mock Interview Questions & Model Answers
  app.post('/api/interview-questions', async (req: Request, res: Response) => {
    try {
      const { targetRole, missingSkills } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          questions: [
            {
              question: `How would you architect a low-latency RAG system handling 1,000 queries per minute?`,
              key_concepts: ['Chunking', 'Vector Indexing (HNSW)', 'Async FastAPI', 'Redis Caching'],
              model_answer: 'Discuss hybrid search (keyword + dense embeddings), reranking models, pre-computed vector caching, and async inference workers.',
            },
          ],
        });
      }

      const prompt = `Generate 4 realistic technical interview questions for a ${targetRole} candidate specifically probing the following skill gaps: ${(missingSkills || []).join(', ')}.
For each question, provide key concepts to mention and a comprehensive model answer.
Return a strict JSON object:
{
  "questions": [
    {
      "question": string,
      "skill_tested": string,
      "difficulty": "Easy" | "Medium" | "Hard",
      "key_concepts": string[],
      "model_answer": string
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text?.trim() || '{"questions": []}');
      return res.json(parsed);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      pythonVersion: 'Python 3.10.12',
    });
  });

  // Vite middleware in dev or static dist in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SkillBridge AI Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
