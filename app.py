"""
SkillBridge AI - Skill Gap & Career Roadmap Predictor
Built with Python, Pandas, NumPy, Scikit-learn, spaCy, and Streamlit.
"""

import streamlit as st
import pandas as pd
import numpy as np
import json
from io import BytesIO

# Import our custom ML & NLP modules
from role_dataset import get_roles_dataframe, get_roles_data
from nlp_extractor import parse_resume_nlp
from similarity_engine import compute_tfidf_similarity, evaluate_skill_gaps
from roadmap_engine import build_personalized_roadmap

# Page configuration
st.set_page_config(
    page_title="SkillBridge AI - Skill Gap & Career Roadmap Predictor",
    page_icon="🌉",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #475569;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
    }
    .stProgress > div > div > div > div {
        background-color: #3B82F6;
    }
</style>
""", unsafe_allow_html=True)


# Pre-loaded sample student resumes
PRESET_RESUMES = {
    "Aarav Sharma (B.Tech CS Student -> AI Engineer Target)": """Aarav Sharma
Pre-final Year Student, B.Tech Computer Science & Engineering
Email: aarav.sharma@gmail.com | Phone: +1-555-0199
GitHub: github.com/aaravsharma

EDUCATION:
Bachelor of Technology in Computer Science & Engineering
State University of Technology (2022 - 2026) | GPA: 3.8 / 4.0
Relevant Coursework: Data Structures & Algorithms, Database Systems, Operating Systems.

TECHNICAL SKILLS:
- Languages: Python, C++, SQL, HTML5, CSS3, JavaScript
- Frameworks & Libraries: Flask, Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn
- Developer Tools: Git, GitHub, VS Code, Linux, Jupyter Notebooks

PROJECTS:
1. Customer Churn Prediction & Analysis System (Python, Scikit-Learn, Flask)
   - Built a supervised classification model with Random Forests achieving 85% accuracy.
   - Performed exploratory data analysis on 7,000+ customer records using Pandas.
2. Library Management Portal (Python, SQLite, HTML/CSS)
   - Developed full-stack university registration prototype with normalized database.
""",
    "Priya Patel (Junior Web Dev -> Full Stack / Python Target)": """Priya Patel
Junior Web Developer & Frontend Specialist
Email: priya.patel@devmail.com | Portfolio: priyapatel.dev

EDUCATION:
B.S. in Information Systems & Web Engineering (2020 - 2024)

TECHNICAL SKILLS:
- Frontend: JavaScript, TypeScript, React, Next.js, HTML5, CSS3, Tailwind CSS
- Backend Familiarity: Python, Node.js, Express, REST APIs, SQL
- Tools: Git, GitHub, VS Code, Figma, Vite

EXPERIENCE:
Frontend Developer Intern | TechVibe Solutions
- Built 15+ responsive React components with Tailwind CSS.
- Integrated RESTful backend endpoints with Axios and error boundaries.
""",
    "Sneha Reddy (Data Analytics Intern -> Data Scientist Target)": """Sneha Reddy
Data Analyst & BI Specialist
Email: sneha.reddy@analytics.org | Phone: +1-555-8821

EDUCATION:
B.S. in Statistics & Applied Mathematics (2021 - 2025) | GPA: 3.85 / 4.0

TECHNICAL SKILLS:
- Data & Analytics: SQL, Excel (Pivot, VLOOKUP), Tableau, Power BI
- Programming: Python, Pandas, NumPy, Matplotlib, Seaborn
- Statistical Methods: Hypothesis Testing, ANOVA, Linear Regression, A/B Testing
- Tools: Jupyter, Git, Google BigQuery

EXPERIENCE:
Data Analytics Intern | RetailPulse Insights
- Built automated SQL queries with Window Functions to track sales trends across 45 stores.
- Designed 3 interactive Tableau executive dashboards for leadership.
"""
}


def extract_text_from_file(uploaded_file) -> str:
    """Extracts plain text from TXT, PDF, or DOCX uploads."""
    if uploaded_file.name.endswith(".txt"):
        return uploaded_file.read().decode("utf-8", errors="ignore")
    elif uploaded_file.name.endswith(".pdf"):
        try:
            from pypdf import PdfReader
            reader = PdfReader(uploaded_file)
            text = "\n".join([page.extract_text() or "" for page in reader.pages])
            return text if text.strip() else "[Could not extract text from PDF]"
        except Exception:
            return uploaded_file.read().decode("utf-8", errors="ignore")
    elif uploaded_file.name.endswith(".docx"):
        try:
            import docx
            doc = docx.Document(uploaded_file)
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception:
            return uploaded_file.read().decode("utf-8", errors="ignore")
    return uploaded_file.read().decode("utf-8", errors="ignore")


def main():
    # Header Banner
    st.markdown('<div class="main-header">🌉 SkillBridge AI – Career Roadmap Predictor</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Powered by <b>Python</b>, <b>Pandas & NumPy</b>, <b>Scikit-learn (TF-IDF)</b>, <b>spaCy NLP</b>, and <b>Streamlit</b></div>', unsafe_allow_html=True)

    # Load Role Benchmarks DataFrame
    df_roles = get_roles_dataframe()
    role_titles = df_roles["role_title"].tolist()

    # Sidebar: Controls & Settings
    st.sidebar.header("🎯 Target Role & Settings")
    
    selected_role = st.sidebar.selectbox(
        "Select Your Engineering Target Role:",
        options=role_titles,
        index=0
    )

    roadmap_weeks = st.sidebar.select_slider(
        "Roadmap Duration (Weeks):",
        options=[4, 8, 12, 24],
        value=8
    )

    hours_per_week = st.sidebar.slider(
        "Available Study Hours/Week:",
        min_value=5,
        max_value=30,
        value=10,
        step=5
    )

    st.sidebar.markdown("---")
    st.sidebar.markdown("### 🛠️ Technology Stack Active")
    st.sidebar.info(
        "• **NLP:** spaCy Entity & Skill Extractor\n"
        "• **Vectors:** Scikit-learn TF-IDF & Cosine Similarity\n"
        "• **Analytics:** Pandas DataFrames & NumPy Arrays\n"
        "• **UI:** Streamlit Web Dashboard"
    )

    # STEP 1: Resume Input (Upload or Preset)
    st.markdown("### Step 1: Student Resume Intake")
    col1, col2 = st.columns([1, 1])

    with col1:
        preset_choice = st.selectbox(
            "Quick Demo Preset (One-Click):",
            options=["None (Upload My Own Resume)"] + list(PRESET_RESUMES.keys())
        )

    with col2:
        uploaded_file = st.file_uploader(
            "Or Upload Resume File (.pdf, .docx, .txt):",
            type=["pdf", "docx", "txt"]
        )

    # Determine Active Resume Text
    if uploaded_file is not None:
        resume_text = extract_text_from_file(uploaded_file)
        st.success(f"Loaded file: `{uploaded_file.name}` ({len(resume_text)} characters)")
    elif preset_choice != "None (Upload My Own Resume)":
        resume_text = PRESET_RESUMES[preset_choice]
        st.info(f"Using demo student resume: **{preset_choice.split(' (')[0]}**")
    else:
        resume_text = PRESET_RESUMES[list(PRESET_RESUMES.keys())[0]]

    # Expandable preview of resume text
    with st.expander("📄 View Resume Content", expanded=False):
        resume_text = st.text_area("Edit or paste resume text:", value=resume_text, height=180)

    st.markdown("---")

    # STEP 2: spaCy NLP Extraction
    st.markdown("### Step 2: AI Profile & Skill Extraction (spaCy NLP)")
    with st.spinner("Processing resume with spaCy NLP pipeline..."):
        nlp_profile = parse_resume_nlp(resume_text)

    col_cand1, col_cand2, col_cand3, col_cand4 = st.columns(4)
    col_cand1.metric("👤 Candidate", nlp_profile["candidate_name"])
    col_cand2.metric("🎓 Education", nlp_profile["degree"].split(" in ")[0])
    col_cand3.metric("🏛️ Institution", nlp_profile["university"][:25])
    col_cand4.metric("💼 Experience", f"~{nlp_profile['estimated_years_experience']} Year(s)")

    # Display Extracted Skills as Badges
    st.write(f"**Identified Skills ({len(nlp_profile['extracted_skills'])} found):**")
    if nlp_profile["extracted_skills"]:
        st.write(" • ".join([f"`{s}`" for s in nlp_profile["extracted_skills"]]))
    else:
        st.warning("No explicit technical skills identified. Please check resume text.")

    st.markdown("---")

    # STEP 3 & 4: Scikit-learn TF-IDF Semantic Ranking & Skill Gap Evaluation
    st.markdown(f"### Steps 3 & 4: Skill Gap Diagnostic against **{selected_role}**")

    # Compute TF-IDF Semantic Similarity across all roles
    sim_df = compute_tfidf_similarity(resume_text, df_roles)
    
    # Compute specific skill gaps for selected role
    gaps = evaluate_skill_gaps(nlp_profile["extracted_skills"], selected_role)

    # Metric Cards
    col_m1, col_m2, col_m3, col_m4 = st.columns(4)
    with col_m1:
        st.metric("📊 Role Match Score", f"{gaps['match_score']}%")
    with col_m2:
        st.metric("📄 ATS Score", f"{gaps['ats_score']}%")
    with col_m3:
        st.metric("✅ Matched Skills", len(gaps["matched_core_skills"]))
    with col_m4:
        st.metric("🚨 Critical Gaps", len(gaps["missing_core_skills"]))

    st.progress(int(gaps["match_score"]))
    st.info(f"**Readiness Status:** {gaps['readiness_tier']} — *{gaps['readiness_summary']}*")

    # STEP 5: Missing Skills & Comparison Table (Pandas)
    st.markdown("### Step 5: Missing Skills & Competency Breakdown")
    
    tab_overview, tab_table, tab_all_roles = st.tabs([
        "📋 Gap Diagnostic",
        "📊 Pandas Comparison Table",
        "🌐 Scikit-learn TF-IDF Ranking (All Roles)"
    ])

    with tab_overview:
        col_gap1, col_gap2 = st.columns(2)
        with col_gap1:
            st.error(f"🚨 **Critical Missing Skills ({len(gaps['missing_core_skills'])})**")
            for skill in gaps["missing_core_skills"]:
                st.markdown(f"- ❌ **{skill}** *(Must-have requirement for {selected_role})*")
        
        with col_gap2:
            st.success(f"✅ **Matched Benchmark Skills ({len(gaps['matched_core_skills'])})**")
            for skill in gaps["matched_core_skills"]:
                st.markdown(f"- ✔️ **{skill}** *(Verified in resume)*")

        if gaps["missing_secondary_skills"]:
            st.warning(f"⚡ **Secondary Ecosystem Skills ({len(gaps['missing_secondary_skills'])})**")
            st.write(" • ".join([f"`{s}`" for s in gaps["missing_secondary_skills"]]))

    with tab_table:
        st.dataframe(
            gaps["comparison_dataframe"],
            use_container_width=True,
            hide_index=True
        )

    with tab_all_roles:
        st.write("Semantic similarity of your resume against all engineering roles (Scikit-learn `TfidfVectorizer` + `cosine_similarity`):")
        st.dataframe(
            sim_df[["role_title", "category", "semantic_similarity_pct", "avg_salary", "experience_level"]].rename(
                columns={
                    "role_title": "Engineering Role",
                    "category": "Domain",
                    "semantic_similarity_pct": "Semantic Match %",
                    "avg_salary": "Avg Salary",
                    "experience_level": "Tier"
                }
            ),
            use_container_width=True,
            hide_index=True
        )

    st.markdown("---")

    # STEP 6: Personalized Learning Roadmap
    st.markdown(f"### Step 6: Personalized {roadmap_weeks}-Week Learning Roadmap")
    
    roadmap = build_personalized_roadmap(gaps, total_weeks=roadmap_weeks, hours_per_week=hours_per_week)

    for phase in roadmap["phases"]:
        with st.expander(f"📌 {phase['title']} ({phase['week_range']})", expanded=True):
            st.write(f"**Target Skills to Master:** {' • '.join([f'`{s}`' for s in phase['target_skills']])}")
            st.write(f"*{phase['description']}*")
            
            st.markdown(f"**🛠️ Hands-on Milestone Project:** `{phase['project']['name']}`")
            st.caption(f"Deliverable: {phase['project']['deliverable']}")
            
            st.markdown("**📚 Curated Free Resources:**")
            for res in phase["resources"]:
                st.markdown(f"- [{res['type']}] [{res['title']}]({res['url']})")

            st.markdown("**✅ Milestones Checklist:**")
            for m in phase["milestones"]:
                st.checkbox(m["title"], key=f"check_{phase['phase_number']}_{m['id']}")

    # End-of-Roadmap Capstone
    st.success(f"🏆 **Capstone Showcase Project:** {roadmap['capstone_project']}")

    # Download Buttons (JSON & Markdown)
    st.markdown("### 📥 Export Your Career Roadmap")
    col_dl1, col_dl2 = st.columns(2)

    with col_dl1:
        # Generate Markdown export
        md_content = f"# SkillBridge AI Career Roadmap: {selected_role}\n\n"
        md_content += f"> Duration: {roadmap_weeks} Weeks | Study: {hours_per_week} hrs/week | Match Score: {gaps['match_score']}%\n\n"
        for p in roadmap["phases"]:
            md_content += f"## {p['title']} ({p['week_range']})\n"
            md_content += f"**Target Skills:** {', '.join(p['target_skills'])}\n\n"
            md_content += f"**Project:** {p['project']['name']}\n{p['project']['deliverable']}\n\n"
            md_content += "### Milestones:\n"
            for m in p["milestones"]:
                md_content += f"- [ ] {m['title']}\n"
            md_content += "\n---\n"
        
        st.download_button(
            label="📄 Download Roadmap as Markdown (.md)",
            data=md_content,
            file_name=f"SkillBridge_{selected_role.replace(' ', '_')}_Roadmap.md",
            mime="text/markdown"
        )

    with col_dl2:
        roadmap_json = json.dumps(roadmap, indent=2)
        st.download_button(
            label="💾 Download Roadmap as JSON (.json)",
            data=roadmap_json,
            file_name=f"SkillBridge_{selected_role.replace(' ', '_')}_Roadmap.json",
            mime="application/json"
        )


if __name__ == "__main__":
    main()
