"""
SkillBridge AI - Similarity & Skill Gap Analytics Engine
Powered by Scikit-learn, Pandas & NumPy
Calculates TF-IDF vector representations, Cosine Similarity, and skill gap metrics.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from role_dataset import get_roles_dataframe, get_roles_data


def compute_tfidf_similarity(resume_text: str, role_df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes Scikit-learn TF-IDF vectors for the resume against all engineering roles
    and calculates pairwise cosine similarity using NumPy.
    """
    corpus = [resume_text] + role_df["search_corpus"].tolist()
    
    # Initialize Scikit-learn TF-IDF Vectorizer with unigrams & bigrams
    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=2000
    )
    
    tfidf_matrix = vectorizer.fit_transform(corpus)
    
    # Extract candidate vector (first row) and role vectors (remaining rows)
    candidate_vec = tfidf_matrix[0:1]
    roles_vec = tfidf_matrix[1:]
    
    # Compute Cosine Similarities via Scikit-learn
    cosine_sims = cosine_similarity(candidate_vec, roles_vec)[0]
    
    # Add similarity scores to a copy of the Pandas DataFrame
    df_results = role_df.copy()
    df_results["semantic_similarity_raw"] = cosine_sims
    # Scale to percentage between 0 and 100 with NumPy
    df_results["semantic_similarity_pct"] = np.round(cosine_sims * 100, 1)
    
    return df_results.sort_values(by="semantic_similarity_raw", ascending=False)


def evaluate_skill_gaps(
    candidate_skills: List[str],
    target_role_title: str
) -> Dict[str, Any]:
    """
    Evaluates candidate skills against the target role using Pandas & NumPy sets.
    Computes matched core skills, critical missing skills, and weighted match score.
    """
    roles = get_roles_data()
    role_dict = next((r for r in roles if r["role_title"].lower() == target_role_title.lower()), None)
    if not role_dict:
        role_dict = roles[0] # Default to AI Engineer

    core_requirements = role_dict["core_skills"]
    secondary_requirements = role_dict["secondary_skills"]

    cand_skills_lower = [s.lower().strip() for s in candidate_skills]

    matched_core: List[str] = []
    missing_core: List[str] = []

    for req in core_requirements:
        req_clean = req.lower().strip()
        # Direct match or substring overlap
        if any(req_clean == cs or req_clean in cs or cs in req_clean for cs in cand_skills_lower):
            matched_core.append(req)
        else:
            missing_core.append(req)

    matched_sec: List[str] = []
    missing_sec: List[str] = []
    for sec in secondary_requirements:
        sec_clean = sec.lower().strip()
        if any(sec_clean == cs or sec_clean in cs or cs in sec_clean for cs in cand_skills_lower):
            matched_sec.append(sec)
        else:
            missing_sec.append(sec)

    # Vectorized score calculation with NumPy
    core_weight = 0.70
    sec_weight = 0.30

    core_ratio = len(matched_core) / max(len(core_requirements), 1)
    sec_ratio = len(matched_sec) / max(len(secondary_requirements), 1)

    # NumPy vector dot product for weighted match
    weights = np.array([core_weight, sec_weight])
    ratios = np.array([core_ratio, sec_ratio])
    raw_score = float(np.dot(weights, ratios) * 100)

    # Normalize between 12% and 98%
    match_score = float(np.clip(np.round(raw_score, 1), 12.0, 98.0))

    # ATS score heuristic using NumPy
    ats_score = float(np.clip(np.round(match_score * 0.9 + len(candidate_skills) * 0.8, 1), 15.0, 96.0))

    # Readiness Tier
    if match_score >= 75.0:
        readiness_tier = "Interview Ready (High Match)"
        summary = "Your technical profile strongly aligns with industry standards for this position."
    elif match_score >= 50.0:
        readiness_tier = "Promising Candidate (Moderate Gap)"
        summary = "You have solid foundational skills. Bridging 3-4 key missing skills will make you highly competitive."
    else:
        readiness_tier = "Emerging Learner (Foundational Gap)"
        summary = "Substantial technical gaps identified. A dedicated multi-week structured roadmap is recommended."

    # Build comparison breakdown as a Pandas DataFrame
    comparison_records = []
    for skill in core_requirements:
        comparison_records.append({
            "Skill": skill,
            "Type": "Core Requirement",
            "Status": "✅ Verified" if skill in matched_core else "🚨 Missing",
            "Priority": "Critical" if skill in missing_core else "Met"
        })
    for skill in secondary_requirements:
        comparison_records.append({
            "Skill": skill,
            "Type": "Secondary / Ecosystem",
            "Status": "✅ Verified" if skill in matched_sec else "⚡ Nice-to-Have",
            "Priority": "Secondary" if skill in missing_sec else "Met"
        })

    comparison_df = pd.DataFrame(comparison_records)

    return {
        "role_info": role_dict,
        "target_role": role_dict["role_title"],
        "match_score": match_score,
        "ats_score": ats_score,
        "readiness_tier": readiness_tier,
        "readiness_summary": summary,
        "matched_core_skills": matched_core,
        "missing_core_skills": missing_core,
        "matched_secondary_skills": matched_sec,
        "missing_secondary_skills": missing_sec,
        "comparison_dataframe": comparison_df,
        "interview_topics": role_dict.get("typical_interview_topics", []),
        "capstone_project": role_dict.get("capstone_project", "")
    }


if __name__ == "__main__":
    df_roles = get_roles_dataframe()
    sample_resume = "Python, PyTorch, Pandas, Scikit-learn, Git, SQL, Docker, FastAPI"
    print("Computing TF-IDF Vector Similarity with Scikit-learn:")
    sim_df = compute_tfidf_similarity(sample_resume, df_roles)
    print(sim_df[["role_title", "category", "semantic_similarity_pct"]].to_string())

    print("\nEvaluating Skill Gaps with NumPy & Pandas:")
    gaps = evaluate_skill_gaps(["Python", "Pandas", "Scikit-learn", "Git"], "Data Scientist")
    print(f"Match Score: {gaps['match_score']}% | Tier: {gaps['readiness_tier']}")
    print(f"Missing Core Skills: {gaps['missing_core_skills']}")
