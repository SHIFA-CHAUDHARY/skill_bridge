"""
SkillBridge AI - Personalized Learning Roadmap Generator
Generates phase-by-phase actionable milestones, projects, interview questions,
and learning resources based on the candidate's exact skill gaps.
"""

import json
from typing import Dict, List, Any


CURATED_RESOURCES_MAP: Dict[str, List[Dict[str, str]]] = {
    "PyTorch or TensorFlow": [
        {"title": "Deep Learning with PyTorch Official Blitz", "type": "Documentation", "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html", "free": True},
        {"title": "Fast.ai Practical Deep Learning for Coders", "type": "Course", "url": "https://course.fast.ai/", "free": True},
        {"title": "Andrej Karpathy - Neural Networks: Zero to Hero", "type": "Video Playlist", "url": "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", "free": True}
    ],
    "Large Language Models (LLMs)": [
        {"title": "Hugging Face LLM Course & Transformers", "type": "Course", "url": "https://huggingface.co/learn/nlp-course", "free": True},
        {"title": "DeepLearning.AI Generative AI for Everyone", "type": "Course", "url": "https://www.deeplearning.ai/courses/", "free": True},
        {"title": "Full Stack LLM BootCamp Resources", "type": "Documentation", "url": "https://fullstackdeeplearning.com/", "free": True}
    ],
    "RAG (Retrieval-Augmented Generation)": [
        {"title": "LangChain Official RAG Tutorial & Concept Guide", "type": "Documentation", "url": "https://python.langchain.com/docs/tutorials/rag/", "free": True},
        {"title": "LlamaIndex Production RAG Guide", "type": "Documentation", "url": "https://docs.llamaindex.ai/", "free": True},
        {"title": "Pinecone Learning Center - Vector Search Explained", "type": "Article", "url": "https://www.pinecone.io/learn/", "free": True}
    ],
    "Vector Databases (Pinecone/Chroma/Weaviate)": [
        {"title": "ChromaDB Quickstart & Python SDK", "type": "Documentation", "url": "https://docs.trychroma.com/", "free": True},
        {"title": "Pgvector: Vector similarity search for Postgres", "type": "GitHub Repository", "url": "https://github.com/pgvector/pgvector", "free": True}
    ],
    "Prompt Engineering": [
        {"title": "Learn Prompting Comprehensive Guide", "type": "Interactive Guide", "url": "https://learnprompting.org/", "free": True},
        {"title": "Anthropic & Google Prompt Engineering Best Practices", "type": "Documentation", "url": "https://ai.google.dev/gemini-api/docs/prompting-intro", "free": True}
    ],
    "REST APIs / FastAPI": [
        {"title": "FastAPI Official Interactive Tutorial", "type": "Documentation", "url": "https://fastapi.tiangolo.com/tutorial/", "free": True},
        {"title": "Building Production APIs with Pydantic & Async Python", "type": "Video", "url": "https://www.youtube.com/watch?v=-ykeT6kkSp8", "free": True}
    ],
    "Docker & Containerization": [
        {"title": "Docker for Developers Hands-on Guide", "type": "Interactive Course", "url": "https://docker-curriculum.com/", "free": True},
        {"title": "Official Docker Engine Documentation", "type": "Documentation", "url": "https://docs.docker.com/get-started/", "free": True}
    ],
    "Kubernetes (K8s)": [
        {"title": "Kubernetes Interactive Tutorials", "type": "Interactive", "url": "https://kubernetes.io/docs/tutorials/", "free": True},
        {"title": "TechWorld with Nana - Kubernetes 101 Course", "type": "Video Course", "url": "https://www.youtube.com/watch?v=X48VuDVv0do", "free": True}
    ],
    "SQL & Relational Databases": [
        {"title": "Mode Analytics Advanced SQL Tutorial", "type": "Tutorial", "url": "https://mode.com/sql-tutorial/", "free": True},
        {"title": "PostgreSQL Official Documentation & Indexing Guide", "type": "Documentation", "url": "https://www.postgresql.org/docs/", "free": True}
    ],
    "Pandas & NumPy": [
        {"title": "Pandas 10-Minute Walkthrough & Cookbook", "type": "Documentation", "url": "https://pandas.pydata.org/docs/user_guide/10min.html", "free": True},
        {"title": "Kaggle Python & Pandas Micro-Courses", "type": "Interactive", "url": "https://www.kaggle.com/learn", "free": True}
    ],
    "Model Serving & Deployment (FastAPI / Triton / TorchServe)": [
        {"title": "Serving ML Models with FastAPI & Docker", "type": "GitHub Guide", "url": "https://github.com/tiangolo/fastapi", "free": True},
        {"title": "Triton Inference Server Architecture", "type": "Documentation", "url": "https://github.com/triton-inference-server/server", "free": True}
    ],
    "Scikit-Learn": [
        {"title": "Scikit-Learn Official User Guide & Cheatsheet", "type": "Documentation", "url": "https://scikit-learn.org/stable/user_guide.html", "free": True}
    ]
}


def generate_roadmap(
    gap_analysis: Dict[str, Any],
    total_weeks: int = 8,
    hours_per_week: int = 10
) -> Dict[str, Any]:
    """
    Synthesize an actionable, chronologically sequenced learning roadmap
    specifically addressing the candidate's missing skills.
    """
    target_role = gap_analysis.get("target_role", "Engineering Role")
    missing_core = gap_analysis.get("missing_core_skills", [])
    missing_sec = gap_analysis.get("missing_secondary_skills", [])
    matched_skills = gap_analysis.get("matched_core_skills", [])

    all_missing = missing_core + [s for s in missing_sec if s not in missing_core]
    if not all_missing:
        all_missing = ["Advanced Production Architecture", "System Design & Scaling", "End-to-End CI/CD Automation", "Mock Technical Interview Mastery"]

    # Partition skills across 4 progressive phases
    phase_count = 4
    chunk_size = max(1, (len(all_missing) + phase_count - 1) // phase_count)

    phases = []
    phase_titles = [
        ("Phase 1: Foundation & Critical Core Skills", "Weeks 1 - " + str(max(1, total_weeks // 4))),
        ("Phase 2: Framework Mastery & Production Architecture", "Weeks " + str(max(2, (total_weeks // 4) + 1)) + " - " + str(max(3, total_weeks // 2))),
        ("Phase 3: Integration, Deployment & Advanced Gaps", "Weeks " + str(max(4, (total_weeks // 2) + 1)) + " - " + str(max(5, (3 * total_weeks) // 4))),
        ("Phase 4: Capstone Engineering & Interview Ready", "Weeks " + str(max(6, (3 * total_weeks) // 4 + 1)) + " - " + str(total_weeks))
    ]

    for i in range(phase_count):
        title, week_range = phase_titles[i]
        start_idx = i * chunk_size
        end_idx = min(start_idx + chunk_size, len(all_missing))
        phase_skills = all_missing[start_idx:end_idx]

        if not phase_skills:
            if i == 0:
                phase_skills = ["Advanced Language Idioms", "Object Oriented Design"]
            elif i == 1:
                phase_skills = ["Cloud Infrastructure", "API Architecture"]
            elif i == 2:
                phase_skills = ["Testing & CI/CD Pipelines", "Containerization"]
            else:
                phase_skills = ["Full System Integration", "Technical Interview Drills"]

        # Gather curated resources for these skills
        resources = []
        for sk in phase_skills:
            if sk in CURATED_RESOURCES_MAP:
                resources.extend(CURATED_RESOURCES_MAP[sk])

        if not resources:
            resources.append({
                "title": f"Official {phase_skills[0]} Documentation & Tutorial",
                "type": "Documentation",
                "url": "https://developer.mozilla.org/ or https://docs.python.org/3/",
                "free": True
            })

        # Phase project
        if i == 0:
            project = {
                "name": f"{target_role} Core Fundamentals Project",
                "deliverable": f"Implement a modular command-line application demonstrating deep grasp of {', '.join(phase_skills[:2])}.",
                "estimated_hours": max(6, hours_per_week // 2)
            }
        elif i == 1:
            project = {
                "name": f"Production Service & Pipeline Architecture",
                "deliverable": f"Design and implement a tested service or workflow leveraging {phase_skills[0] if phase_skills else 'APIs'} with clean schema validation.",
                "estimated_hours": max(10, hours_per_week)
            }
        elif i == 2:
            project = {
                "name": f"Full Containerized System with CI/CD",
                "deliverable": f"Package your application with Docker, implement automated unit tests with pytest/vitest, and deploy on cloud infrastructure.",
                "estimated_hours": max(12, int(hours_per_week * 1.2))
            }
        else:
            project = {
                "name": gap_analysis.get("suggested_capstone_project") or f"Production {target_role} Showcase Platform",
                "deliverable": "End-to-end deployed portfolio application with comprehensive README, architectural diagram, and live demo link.",
                "estimated_hours": max(18, hours_per_week * 2)
            }

        # Milestones / Checklist
        milestones = [
            {"id": f"p{i+1}-m1", "title": f"Study syntax, principles, and idioms of {phase_skills[0]}", "done": False},
            {"id": f"p{i+1}-m2", "title": f"Build practical hands-on exercises for {phase_skills[-1]}", "done": False},
            {"id": f"p{i+1}-m3", "title": f"Complete '{project['name']}' deliverable", "done": False},
            {"id": f"p{i+1}-m4", "title": "Commit clean, well-documented code with tests to GitHub", "done": False}
        ]

        phases.append({
            "phase_number": i + 1,
            "title": title,
            "week_range": week_range,
            "target_skills": phase_skills,
            "description": f"Focus intensely on bridging {', '.join(phase_skills)}. Spend ~{hours_per_week} hours per week.",
            "project": project,
            "resources": resources[:4],
            "milestones": milestones
        })

    return {
        "target_role": target_role,
        "total_weeks": total_weeks,
        "hours_per_week": hours_per_week,
        "total_phases": len(phases),
        "phases": phases,
        "interview_drills": gap_analysis.get("interview_topics", []),
        "capstone_project": gap_analysis.get("suggested_capstone_project", ""),
        "matched_skills_summary": matched_skills,
        "bridged_skills_count": len(all_missing)
    }


if __name__ == "__main__":
    from analyzer import analyze_skill_gap
    sample = "Python, Pandas, Git, SQL, Flask"
    gap = analyze_skill_gap(sample, "AI Engineer")
    roadmap = generate_roadmap(gap, total_weeks=8, hours_per_week=10)
    print(json.dumps(roadmap, indent=2))
