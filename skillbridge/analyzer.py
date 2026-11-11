"""
SkillBridge AI - Resume Parser & Skill Gap Analyzer Engine
Extracts skills, education, and experience from resumes and computes
comprehensive match analytics against target engineering benchmarks.
"""

import re
import json
import difflib
from typing import Dict, List, Set, Any, Tuple
try:
    from skillbridge.benchmarks import ROLE_BENCHMARKS
except ImportError:
    from benchmarks import ROLE_BENCHMARKS


KNOWN_SKILLS_DICTIONARY = [
    # Languages
    "python", "javascript", "typescript", "c++", "c", "c#", "java", "go", "golang", "rust",
    "html", "html5", "css", "css3", "sass", "sql", "r", "matlab", "bash", "shell", "dart", "kotlin", "swift",
    # Frameworks & Libraries
    "react", "react.js", "next.js", "vue", "angular", "node.js", "express", "fastapi", "django", "flask",
    "pytorch", "tensorflow", "keras", "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
    "langchain", "llamaindex", "hugging face", "transformers", "opencv", "yolo", "spacy", "nltk",
    "spring boot", "tailwind css", "bootstrap", "graphql", "triton", "torchserve",
    # Data & Storage
    "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "pinecone", "chromadb", "weaviate",
    "qdrant", "elasticsearch", "bigquery", "snowflake", "dynamodb", "firebase", "cassandra",
    # DevOps, Cloud & Tools
    "docker", "kubernetes", "k8s", "terraform", "aws", "amazon web services", "gcp", "google cloud",
    "azure", "git", "github", "gitlab", "ci/cd", "github actions", "linux", "unix", "prometheus",
    "grafana", "mlflow", "wandb", "weights & biases", "celery", "kafka", "rabbitmq",
    # Concepts & Methodologies
    "rag", "retrieval-augmented generation", "llm", "large language models", "prompt engineering",
    "fine-tuning", "lora", "deep learning", "machine learning", "data structures", "algorithms",
    "system design", "rest api", "restful api", "microservices", "a/b testing", "statistics",
    "eda", "feature engineering", "nlp", "computer vision", "object detection", "agile", "scrum"
]

DEGREE_PATTERNS = [
    (r"\b(ph\.?d|doctorate)\b", "Ph.D. / Doctorate"),
    (r"\b(m\.?s|master of science|m\.?tech|msc|masters)\b", "Master's Degree"),
    (r"\b(b\.?s|b\.?tech|b\.?e|bachelor of science|bachelor of engineering|bsc|bachelors)\b", "Bachelor's Degree"),
    (r"\b(associate|diploma)\b", "Associate / Diploma")
]


def extract_candidate_info(text: str) -> Dict[str, Any]:
    """Extract candidate name, contact, education, and years of experience."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    name = lines[0] if lines else "Candidate"
    if len(name) > 40 or any(kw in name.lower() for kw in ["resume", "curriculum", "page", "skills"]):
        name = "Engineering Candidate"

    # Email extraction
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    email = email_match.group(0) if email_match else "student@university.edu"

    # Phone extraction
    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
    phone = phone_match.group(0) if phone_match else "Available on request"

    # Degree / Education
    degree = "Bachelor's in Computer Science / Engineering"
    for pattern, label in DEGREE_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            degree = label
            break

    # Experience calculation heuristic
    year_matches = re.findall(r"\b(201\d|202\d)\b", text)
    exp_years = 0
    if len(year_matches) >= 2:
        try:
            years = sorted(list(set(int(y) for y in year_matches)))
            span = years[-1] - years[0]
            exp_years = min(max(span, 1), 6)
        except Exception:
            exp_years = 1
    elif "intern" in text.lower() or "internship" in text.lower():
        exp_years = 1

    # Extract University / College
    uni_match = re.search(r"(?:university|institute of technology|college|polytechnic)[^\n,]+", text, re.IGNORECASE)
    university = uni_match.group(0).strip() if uni_match else "Engineering Institution"

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "degree": degree,
        "university": university,
        "estimated_years_experience": exp_years
    }


def extract_skills_from_text(text: str) -> List[str]:
    """Scan resume text against known technology vocabulary and return normalized list."""
    text_lower = text.lower()
    found_skills: Set[str] = set()

    for skill in KNOWN_SKILLS_DICTIONARY:
        # Check boundary matches
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.add(skill.title())

    # Special handling for C++ and C#
    if re.search(r"\bc\+\+\b", text_lower):
        found_skills.add("C++")
    if re.search(r"\bc#\b", text_lower):
        found_skills.add("C#")

    return sorted(list(found_skills))


def calculate_similarity(skill_a: str, skill_b: str) -> float:
    """Compute string similarity ratio between two skill names."""
    a = skill_a.lower().strip()
    b = skill_b.lower().strip()
    if a == b:
        return 1.0
    if a in b or b in a:
        return 0.85
    return difflib.SequenceMatcher(None, a, b).ratio()


def analyze_skill_gap(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Core function comparing a candidate's resume skills against a target engineering role.
    Returns matched skills, missing skills, match score %, ATS score, and recommendations.
    """
    if target_role not in ROLE_BENCHMARKS:
        # Fallback to closest role or AI Engineer
        target_role = "AI Engineer"

    benchmark = ROLE_BENCHMARKS[target_role]
    candidate_info = extract_candidate_info(resume_text)
    candidate_skills = extract_skills_from_text(resume_text)
    candidate_skills_lower = [s.lower() for s in candidate_skills]

    core_requirements = benchmark["core_skills"]
    secondary_requirements = benchmark["secondary_skills"]
    tools_requirements = benchmark.get("tools_and_frameworks", [])

    matched_core: List[str] = []
    missing_core: List[str] = []
    partially_matched: List[Dict[str, str]] = []

    # Check Core Skills
    for core_skill in core_requirements:
        found = False
        # Exact or sub-token check (e.g. "PyTorch or TensorFlow" matches if PyTorch or TensorFlow is found)
        options = [opt.strip().lower() for opt in re.split(r" or | / |, ", core_skill)]
        for opt in options:
            if any(opt in cs or cs in opt for cs in candidate_skills_lower):
                matched_core.append(core_skill)
                found = True
                break

        if not found:
            # Check for partial similarity
            best_partial = None
            best_score = 0.0
            for cs in candidate_skills:
                sim = calculate_similarity(core_skill, cs)
                if sim > 0.65 and sim > best_score:
                    best_score = sim
                    best_partial = cs

            if best_partial and best_score >= 0.7:
                partially_matched.append({
                    "required": core_skill,
                    "candidate_has": best_partial,
                    "similarity": round(best_score * 100, 1)
                })
            else:
                missing_core.append(core_skill)

    # Check Secondary Skills
    matched_secondary: List[str] = []
    missing_secondary: List[str] = []
    for sec_skill in secondary_requirements:
        options = [opt.strip().lower() for opt in re.split(r" or | / |, ", sec_skill)]
        found = any(any(opt in cs or cs in opt for cs in candidate_skills_lower) for opt in options)
        if found:
            matched_secondary.append(sec_skill)
        else:
            missing_secondary.append(sec_skill)

    # Calculate overall match percentage score
    total_core = max(len(core_requirements), 1)
    total_sec = max(len(secondary_requirements), 1)

    core_weight = 0.75
    sec_weight = 0.25

    core_ratio = len(matched_core) / total_core
    sec_ratio = len(matched_secondary) / total_sec

    # Partial match partial points
    partial_bonus = (len(partially_matched) * 0.4) / total_core

    raw_score = ((core_ratio * core_weight) + (sec_ratio * sec_weight) + partial_bonus) * 100
    match_score = min(max(round(raw_score, 1), 12.0), 98.0)

    # ATS score heuristic
    ats_score = min(round(match_score * 0.92 + (len(candidate_skills) * 0.8), 1), 95.0)

    # Readiness tier definition
    if match_score >= 80:
        readiness_tier = "Interview Ready (High Match)"
        readiness_summary = "Your profile strongly matches industry expectations for this role. Focus on system design and interview drills."
    elif match_score >= 55:
        readiness_tier = "Promising Candidate (Moderate Gap)"
        readiness_summary = "You have solid foundational competencies. Bridging 3-4 key missing skills will make you highly competitive."
    else:
        readiness_tier = "Emerging Learner (Foundational Gap)"
        readiness_summary = "Significant technical gaps identified. A dedicated multi-week structured roadmap is strongly recommended."

    return {
        "candidate": candidate_info,
        "target_role": target_role,
        "role_category": benchmark.get("category", "Engineering"),
        "role_description": benchmark["description"],
        "match_score": match_score,
        "ats_score": ats_score,
        "readiness_tier": readiness_tier,
        "readiness_summary": readiness_summary,
        "extracted_skills": candidate_skills,
        "matched_core_skills": matched_core,
        "missing_core_skills": missing_core,
        "partially_matched_skills": partially_matched,
        "matched_secondary_skills": matched_secondary,
        "missing_secondary_skills": missing_secondary,
        "tools_and_frameworks": tools_requirements,
        "interview_topics": benchmark.get("typical_interview_topics", []),
        "suggested_capstone_project": benchmark.get("suggested_capstone_project", "")
    }


if __name__ == "__main__":
    import sys
    sample_text = """
    Aarav Sharma
    Computer Science Student | Python Enthusiast
    Email: aarav.sharma@gmail.com
    Education: B.Tech Computer Science, 2024
    Skills: Python, Scikit-Learn, Pandas, NumPy, Flask, Git, SQL, HTML, CSS
    Projects: Customer Segmentation using K-Means and Flask web app.
    """
    role = sys.argv[1] if len(sys.argv) > 1 else "AI Engineer"
    result = analyze_skill_gap(sample_text, role)
    print(json.dumps(result, indent=2))
