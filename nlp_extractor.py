"""
SkillBridge AI - NLP Extraction Engine
Powered by spaCy
Extracts candidate entities, linguistic noun chunks, education, and technical skills from resumes.
"""

import re
import spacy
from typing import Dict, List, Set, Any, Optional

# Attempt to load spaCy model with graceful fallback
try:
    nlp = spacy.load("en_core_web_sm")
    SPACY_MODEL_LOADED = True
except Exception:
    # Fallback to blank English model if en_core_web_sm is not yet downloaded
    nlp = spacy.blank("en")
    SPACY_MODEL_LOADED = False

# Comprehensive vocabulary of modern engineering skills
TECHNICAL_SKILLS_TAXONOMY: List[str] = [
    # Languages
    "python", "javascript", "typescript", "c++", "c", "c#", "java", "go", "golang", "rust",
    "html", "html5", "css", "css3", "sql", "r", "matlab", "bash", "shell", "dart", "kotlin", "swift",
    # Frameworks & Libraries
    "react", "react.js", "next.js", "vue", "angular", "node.js", "express", "fastapi", "django", "flask",
    "pytorch", "tensorflow", "keras", "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
    "langchain", "llamaindex", "hugging face", "transformers", "opencv", "yolo", "spacy", "nltk",
    "spring boot", "tailwind css", "bootstrap", "graphql", "triton", "torchserve", "streamlit",
    # Data & Storage
    "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "pinecone", "chromadb", "weaviate",
    "qdrant", "elasticsearch", "bigquery", "snowflake", "dynamodb", "firebase", "cassandra",
    # DevOps, Cloud & Tools
    "docker", "kubernetes", "terraform", "aws", "gcp", "azure", "git", "github", "gitlab",
    "ci/cd", "github actions", "linux", "unix", "prometheus", "grafana", "mlflow", "wandb",
    "celery", "kafka", "rabbitmq", "wireshark", "burp suite", "nmap",
    # Concepts & Methodologies
    "rag", "retrieval-augmented generation", "llm", "large language models", "prompt engineering",
    "fine-tuning", "lora", "deep learning", "machine learning", "data structures", "algorithms",
    "system design", "rest api", "microservices", "a/b testing", "statistics", "eda",
    "feature engineering", "nlp", "computer vision", "object detection", "agile", "scrum"
]

DEGREE_REGEXES = [
    (r"\b(ph\.?d|doctorate)\b", "Ph.D. / Doctorate"),
    (r"\b(m\.?s|master of science|m\.?tech|msc|masters)\b", "Master's Degree"),
    (r"\b(b\.?s|b\.?tech|b\.?e|bachelor of science|bachelor of engineering|bsc|bachelors)\b", "Bachelor's Degree"),
    (r"\b(associate|diploma)\b", "Associate / Diploma")
]


def extract_entities_spacy(doc: spacy.tokens.Doc) -> Dict[str, List[str]]:
    """Extracts Named Entities using spaCy (PERSON, ORG, GPE, DATE)."""
    entities = {
        "persons": [],
        "organizations": [],
        "locations": [],
        "dates": []
    }
    if hasattr(doc, "ents"):
        for ent in doc.ents:
            if ent.label_ == "PERSON" and len(ent.text.strip()) > 2:
                entities["persons"].append(ent.text.strip())
            elif ent.label_ == "ORG" and len(ent.text.strip()) > 2:
                entities["organizations"].append(ent.text.strip())
            elif ent.label_ in ("GPE", "LOC"):
                entities["locations"].append(ent.text.strip())
            elif ent.label_ == "DATE":
                entities["dates"].append(ent.text.strip())
    return entities


def extract_noun_chunks_spacy(doc: spacy.tokens.Doc) -> List[str]:
    """Extracts linguistic noun chunks to discover potential technical competencies."""
    chunks = []
    if doc.has_annotation("DEP") if hasattr(doc, "has_annotation") else False:
        try:
            for chunk in doc.noun_chunks:
                clean_chunk = chunk.text.strip().lower()
                if len(clean_chunk) > 3 and not any(stop in clean_chunk for stop in ["page", "resume", "curriculum", "email"]):
                    chunks.append(chunk.text.strip())
        except Exception:
            pass
    return chunks[:15]


def extract_skills_with_nlp(text: str) -> List[str]:
    """
    Combines spaCy token matching with technical taxonomy to extract
    clean, deduplicated technical skills.
    """
    doc = nlp(text.lower())
    doc_text = doc.text
    extracted_skills: Set[str] = set()

    for skill in TECHNICAL_SKILLS_TAXONOMY:
        # Check boundary matching
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, doc_text):
            extracted_skills.add(skill.title())

    # Special handling for C++ and C#
    if re.search(r"\bc\+\+\b", doc_text):
        extracted_skills.add("C++")
    if re.search(r"\bc#\b", doc_text):
        extracted_skills.add("C#")

    return sorted(list(extracted_skills))


def parse_resume_nlp(text: str) -> Dict[str, Any]:
    """
    Full NLP resume analysis pipeline powered by spaCy.
    Returns candidate contact info, education, years of experience, and extracted skills.
    """
    doc = nlp(text)
    entities = extract_entities_spacy(doc)
    noun_chunks = extract_noun_chunks_spacy(doc)
    skills = extract_skills_with_nlp(text)

    # Candidate Name Resolution
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    candidate_name = "Candidate"
    if entities["persons"]:
        candidate_name = entities["persons"][0]
    elif lines:
        first_line = lines[0]
        if len(first_line) < 40 and not any(w in first_line.lower() for w in ["resume", "curriculum", "skills"]):
            candidate_name = first_line

    # Candidate Email
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    email = email_match.group(0) if email_match else "student@university.edu"

    # Candidate Phone
    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
    phone = phone_match.group(0) if phone_match else "Available on request"

    # Degree / Education
    degree = "Bachelor's Degree in Computer Science / Engineering"
    for pattern, label in DEGREE_REGEXES:
        if re.search(pattern, text, re.IGNORECASE):
            degree = label
            break

    # University / Organization
    university = "Engineering University"
    if entities["organizations"]:
        for org in entities["organizations"]:
            if any(kw in org.lower() for kw in ["university", "college", "institute", "polytechnic"]):
                university = org
                break
        if university == "Engineering University" and entities["organizations"]:
            university = entities["organizations"][0]

    # Estimated Years of Experience
    year_matches = re.findall(r"\b(201\d|202\d)\b", text)
    exp_years = 1
    if len(year_matches) >= 2:
        try:
            years = sorted(list(set(int(y) for y in year_matches)))
            span = years[-1] - years[0]
            exp_years = min(max(span, 1), 6)
        except Exception:
            exp_years = 1

    return {
        "candidate_name": candidate_name,
        "email": email,
        "phone": phone,
        "degree": degree,
        "university": university,
        "estimated_years_experience": exp_years,
        "extracted_skills": skills,
        "noun_chunks": noun_chunks,
        "spacy_model_status": "en_core_web_sm loaded" if SPACY_MODEL_LOADED else "spaCy blank[en] active"
    }


if __name__ == "__main__":
    sample = """
    Aarav Sharma
    B.Tech Computer Science student at Stanford University
    Email: aarav.sharma@gmail.com | Phone: (555) 019-2834
    Skills: Python, Scikit-learn, Pandas, NumPy, PyTorch, Docker, Git, SQL, Flask
    Projects: Customer churn classification with Random Forests and Streamlit app.
    """
    res = parse_resume_nlp(sample)
    print("spaCy NLP Resume Extraction Results:")
    for k, v in res.items():
        print(f"  {k}: {v}")
