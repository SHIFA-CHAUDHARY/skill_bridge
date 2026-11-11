"""
SkillBridge AI - Personalized Learning Roadmap Engine
Synthesizes a structured, milestone-driven curriculum based on missing skills.
"""

from typing import Dict, List, Any


CURATED_LEARNING_LINKS = {
    "PyTorch": [
        {"title": "Deep Learning with PyTorch Official Blitz", "type": "Docs", "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html"},
        {"title": "Fast.ai Practical Deep Learning for Coders", "type": "Course", "url": "https://course.fast.ai/"}
    ],
    "TensorFlow": [
        {"title": "TensorFlow Official Beginner Guide", "type": "Docs", "url": "https://www.tensorflow.org/tutorials"}
    ],
    "Large Language Models": [
        {"title": "Hugging Face NLP & Transformers Course", "type": "Course", "url": "https://huggingface.co/learn/nlp-course"},
        {"title": "DeepLearning.AI Generative AI for Everyone", "type": "Course", "url": "https://www.deeplearning.ai/courses/"}
    ],
    "RAG": [
        {"title": "LangChain Official RAG Implementation Guide", "type": "Docs", "url": "https://python.langchain.com/docs/tutorials/rag/"},
        {"title": "LlamaIndex Production RAG Guide", "type": "Docs", "url": "https://docs.llamaindex.ai/"}
    ],
    "Vector Databases": [
        {"title": "ChromaDB Python SDK & Getting Started", "type": "Docs", "url": "https://docs.trychroma.com/"},
        {"title": "Pinecone Learning Center - Vector Search 101", "type": "Article", "url": "https://www.pinecone.io/learn/"}
    ],
    "FastAPI": [
        {"title": "FastAPI Interactive Tutorial & API Design", "type": "Docs", "url": "https://fastapi.tiangolo.com/tutorial/"}
    ],
    "Docker": [
        {"title": "Docker for Developers Hands-On Workshop", "type": "Course", "url": "https://docker-curriculum.com/"}
    ],
    "Kubernetes": [
        {"title": "Kubernetes Interactive Tutorials", "type": "Interactive", "url": "https://kubernetes.io/docs/tutorials/"}
    ],
    "Scikit-learn": [
        {"title": "Scikit-Learn Official User Guide & API Reference", "type": "Docs", "url": "https://scikit-learn.org/stable/user_guide.html"}
    ],
    "Pandas": [
        {"title": "Pandas 10-Minute CookBook & Vectorization", "type": "Docs", "url": "https://pandas.pydata.org/docs/user_guide/10min.html"}
    ],
    "SQL": [
        {"title": "Mode Analytics Advanced SQL Tutorial", "type": "Tutorial", "url": "https://mode.com/sql-tutorial/"}
    ]
}


def build_personalized_roadmap(
    gap_result: Dict[str, Any],
    total_weeks: int = 8,
    hours_per_week: int = 10
) -> Dict[str, Any]:
    """
    Constructs an actionable 4-phase learning roadmap targeting the missing skills.
    """
    target_role = gap_result.get("target_role", "Engineering Goal")
    missing_core = gap_result.get("missing_core_skills", [])
    missing_sec = gap_result.get("missing_secondary_skills", [])

    all_missing = missing_core + [s for s in missing_sec if s not in missing_core]
    if not all_missing:
        all_missing = ["Production System Architecture", "High-Throughput Caching", "Automated CI/CD", "Mock Technical Drills"]

    phase_count = 4
    chunk_size = max(1, (len(all_missing) + phase_count - 1) // phase_count)

    phase_definitions = [
        ("Phase 1: Foundations & Core Skill Gaps", f"Weeks 1 - {max(1, total_weeks // 4)}"),
        ("Phase 2: Framework Mastery & Production Architecture", f"Weeks {max(2, (total_weeks // 4) + 1)} - {max(3, total_weeks // 2)}"),
        ("Phase 3: Integration, Deployment & Advanced Competencies", f"Weeks {max(4, (total_weeks // 2) + 1)} - {max(5, (3 * total_weeks) // 4)}"),
        ("Phase 4: Capstone Showcase & Technical Interview Drills", f"Weeks {max(6, (3 * total_weeks) // 4 + 1)} - {total_weeks}")
    ]

    phases = []
    for i in range(phase_count):
        title, week_range = phase_definitions[i]
        start_idx = i * chunk_size
        end_idx = min(start_idx + chunk_size, len(all_missing))
        phase_skills = all_missing[start_idx:end_idx] or ["System Design & Unit Testing"]

        resources = []
        for sk in phase_skills:
            for key, links in CURATED_LEARNING_LINKS.items():
                if key.lower() in sk.lower() or sk.lower() in key.lower():
                    resources.extend(links)
        if not resources:
            resources.append({
                "title": f"Official {phase_skills[0]} Documentation",
                "type": "Docs",
                "url": "https://docs.python.org/3/"
            })

        project = {
            "name": f"{target_role} Hands-On Milestone Project {i+1}",
            "deliverable": f"Implement a tested service and portfolio demonstration mastering {', '.join(phase_skills[:2])}."
        }

        milestones = [
            {"id": f"p{i+1}-m1", "title": f"Study syntax, concepts, and patterns of {phase_skills[0]}", "done": False},
            {"id": f"p{i+1}-m2", "title": f"Complete practical coding exercises for {phase_skills[-1]}", "done": False},
            {"id": f"p{i+1}-m3", "title": f"Complete deliverable for '{project['name']}'", "done": False},
            {"id": f"p{i+1}-m4", "title": "Push clean, documented code with tests to GitHub repository", "done": False}
        ]

        phases.append({
            "phase_number": i + 1,
            "title": title,
            "week_range": week_range,
            "target_skills": phase_skills,
            "description": f"Focus on bridging: {', '.join(phase_skills)} with ~{hours_per_week} hours/week commitment.",
            "project": project,
            "resources": resources[:3],
            "milestones": milestones
        })

    return {
        "target_role": target_role,
        "total_weeks": total_weeks,
        "hours_per_week": hours_per_week,
        "total_phases": len(phases),
        "phases": phases,
        "capstone_project": gap_result.get("capstone_project", f"End-to-End {target_role} Production Application"),
        "interview_topics": gap_result.get("interview_topics", [])
    }
