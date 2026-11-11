"""
SkillBridge AI - Role Dataset Module
Powered by Pandas & NumPy
Defines engineering role benchmarks as structured DataFrames.
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Any


def get_roles_data() -> List[Dict[str, Any]]:
    """Returns raw structured list of engineering role benchmarks."""
    return [
        {
            "role_id": "ai_engineer",
            "role_title": "AI Engineer",
            "category": "AI & Data",
            "description": "Designs, fine-tunes, and deploys intelligent LLM agents, GenAI architectures, and multimodal models into real-world software.",
            "core_skills": [
                "Python", "PyTorch", "TensorFlow", "Large Language Models", "Prompt Engineering",
                "Vector Databases", "ChromaDB", "Pinecone", "RAG", "FastAPI", "LangChain",
                "LlamaIndex", "Fine-tuning", "LoRA", "Git"
            ],
            "secondary_skills": [
                "Docker", "Hugging Face", "Transformers", "Cloud AI", "GCP", "AWS",
                "Weights & Biases", "MLflow", "Embeddings", "Semantic Search"
            ],
            "tools": ["FastAPI", "PyTorch", "HuggingFace", "LangChain", "ChromaDB", "Docker"],
            "avg_salary": "$135,000 - $185,000",
            "experience_level": "Junior to Mid",
            "typical_interview_topics": [
                "Explain chunking strategies and vector indexing in RAG pipelines",
                "Difference between LoRA, fine-tuning, and few-shot prompting",
                "Mitigating LLM hallucinations and latency bottlenecks",
                "Model quantization (AWQ, GPTQ, GGUF) and serving architectures"
            ],
            "capstone_project": "Autonomous Multimodal AI Research Assistant with RAG, Vector Search, and Streaming API"
        },
        {
            "role_id": "data_scientist",
            "role_title": "Data Scientist",
            "category": "AI & Data",
            "description": "Applies statistical modeling, experimental design, and predictive machine learning to solve high-stakes business and product problems.",
            "core_skills": [
                "Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Statistical Analysis",
                "Hypothesis Testing", "Data Visualization", "Matplotlib", "Seaborn",
                "Supervised Learning", "Unsupervised Learning", "Feature Engineering", "A/B Testing", "Git"
            ],
            "secondary_skills": [
                "PyTorch", "PySpark", "Time Series Forecasting", "SHAP", "LIME",
                "Streamlit", "BigQuery", "Snowflake", "PCA", "Dimensionality Reduction"
            ],
            "tools": ["Pandas", "NumPy", "Scikit-Learn", "PostgreSQL", "Jupyter", "Streamlit"],
            "avg_salary": "$125,000 - $165,000",
            "experience_level": "Junior to Mid",
            "typical_interview_topics": [
                "Bias-Variance tradeoff and L1 vs L2 regularization mathematics",
                "Formulating statistical hypotheses and interpreting p-values in A/B tests",
                "Handling severely imbalanced datasets using SMOTE and Precision-Recall AUC",
                "Gradient Boosting mechanics (XGBoost, LightGBM, CatBoost)"
            ],
            "capstone_project": "End-to-End Customer Lifetime Value & Churn Prediction System with Interactive Dashboard"
        },
        {
            "role_id": "ml_engineer",
            "role_title": "Machine Learning Engineer",
            "category": "AI & Data",
            "description": "Specializes in scaling, optimizing, containerizing, and maintaining automated ML training and real-time inference pipelines in production.",
            "core_skills": [
                "Python", "PyTorch", "Scikit-learn", "Data Structures", "Algorithms",
                "Model Serving", "FastAPI", "Triton", "Docker", "Kubernetes",
                "Feature Pipelines", "ETL", "MLflow", "CI/CD", "Git"
            ],
            "secondary_skills": [
                "C++", "ONNX", "Distributed Training", "DeepSpeed", "Data Drift Detection",
                "Evidently AI", "Airflow", "Kubeflow", "AWS SageMaker"
            ],
            "tools": ["PyTorch", "Docker", "MLflow", "FastAPI", "Ray", "Git"],
            "avg_salary": "$140,000 - $190,000",
            "experience_level": "Mid to Senior",
            "typical_interview_topics": [
                "Architecting scalable real-time inference vs offline batch scoring",
                "Detecting data drift and concept drift in live production pipelines",
                "Model compression techniques: Pruning, Quantization, and Knowledge Distillation",
                "Optimizing GPU memory throughput during training and inference"
            ],
            "capstone_project": "Production Real-Time Recommendation Engine with Automated Drift Alerting & Sub-50ms Serving"
        },
        {
            "role_id": "python_developer",
            "role_title": "Python Developer",
            "category": "Software & Systems",
            "description": "Engineers robust backend services, microservices, data processing scripts, automated tools, and RESTful web applications in Python.",
            "core_skills": [
                "Python", "OOP", "FastAPI", "Django", "Flask", "SQL",
                "PostgreSQL", "SQLAlchemy", "REST API", "pytest", "Git", "Asyncio"
            ],
            "secondary_skills": [
                "Redis", "Celery", "Docker", "Web Scraping", "Playwright",
                "BeautifulSoup", "JWT", "OAuth2", "CI/CD", "GitHub Actions", "Linux"
            ],
            "tools": ["FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "pytest", "Redis", "Git"],
            "avg_salary": "$110,000 - $150,000",
            "experience_level": "Junior to Mid",
            "typical_interview_topics": [
                "Python Global Interpreter Lock (GIL), multithreading vs multiprocessing vs asyncio",
                "Database indexing, N+1 query problem, and connection pooling",
                "Writing custom decorators, context managers, and generators",
                "Designing RESTful APIs with idempotent methods and robust error handling"
            ],
            "capstone_project": "High-Throughput Distributed Task Processing Microservice with FastAPI, Redis, and Celery"
        },
        {
            "role_id": "data_analyst",
            "role_title": "Data Analyst",
            "category": "AI & Data",
            "description": "Turns raw databases and tracking logs into clear executive dashboards, actionable metrics, and commercial growth recommendations.",
            "core_skills": [
                "SQL", "Window Functions", "Excel", "Pivot Tables", "Python",
                "Pandas", "Matplotlib", "Seaborn", "Tableau", "Power BI",
                "Data Storytelling", "EDA", "Statistics"
            ],
            "secondary_skills": [
                "Regex", "Google Analytics", "Git", "dbt", "Airflow", "KPI Metrics"
            ],
            "tools": ["SQL", "Tableau", "Power BI", "Pandas", "Excel"],
            "avg_salary": "$80,000 - $115,000",
            "experience_level": "Junior",
            "typical_interview_topics": [
                "Writing complex SQL queries with Window Functions (RANK, DENSE_RANK, LAG, LEAD)",
                "Structuring an executive dashboard to answer core commercial hypotheses",
                "Distinguishing correlation from causation in observational datasets",
                "Cleaning dirty, missing, and duplicate transaction data"
            ],
            "capstone_project": "E-Commerce Cohort Retention & Revenue Performance Dashboard with Customer Lifetime Value"
        },
        {
            "role_id": "fullstack_engineer",
            "role_title": "Software Engineer (Full Stack)",
            "category": "Software & Systems",
            "description": "Constructs end-to-end applications, uniting responsive interactive frontends with scalable server architectures and databases.",
            "core_skills": [
                "JavaScript", "TypeScript", "React", "Next.js", "HTML5", "CSS3",
                "Tailwind CSS", "Node.js", "Python", "FastAPI", "Express",
                "REST API", "SQL", "PostgreSQL", "Git", "Data Structures"
            ],
            "secondary_skills": [
                "Docker", "State Management", "Redux", "Zustand", "OAuth",
                "CI/CD", "Automated Testing", "Jest", "Vitest", "Web Security"
            ],
            "tools": ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Docker", "Git"],
            "avg_salary": "$120,000 - $160,000",
            "experience_level": "Junior to Mid",
            "typical_interview_topics": [
                "Frontend state management and rendering lifecycle optimization",
                "Designing scalable relational database schemas with foreign key constraints",
                "Core data structures: Hash Maps, Binary Trees, Graph traversals",
                "Web performance optimization: Code splitting, CDN caching, and lazy loading"
            ],
            "capstone_project": "Collaborative Real-Time Workspace SaaS with Kanban Boards, RBAC, and Live Sockets"
        },
        {
            "role_id": "cloud_devops",
            "role_title": "Cloud & DevOps Engineer",
            "category": "Cloud & Operations",
            "description": "Automates cloud infrastructure, implements continuous integration/deployment, and ensures system resilience and observability.",
            "core_skills": [
                "Linux", "AWS", "GCP", "Azure", "Docker", "Kubernetes",
                "Terraform", "CI/CD", "GitHub Actions", "Python", "Bash", "Networking", "TLS"
            ],
            "secondary_skills": [
                "Prometheus", "Grafana", "ELK Stack", "IAM", "Helm", "GitOps", "ArgoCD"
            ],
            "tools": ["Terraform", "Kubernetes", "Docker", "GitHub Actions", "AWS", "Prometheus"],
            "avg_salary": "$135,000 - $180,000",
            "experience_level": "Mid to Senior",
            "typical_interview_topics": [
                "Container orchestration, Kubernetes Pod scheduling, and Service discovery",
                "Zero-downtime deployment patterns: Blue-Green vs Canary vs Rolling",
                "Infrastructure as Code with Terraform state locking and drift management",
                "Incident response, root cause analysis, and SLA/SLO/SLI metric tracking"
            ],
            "capstone_project": "Multi-Region Cloud Kubernetes Pipeline Automated via Terraform with Prometheus Alerting"
        },
        {
            "role_id": "cybersecurity",
            "role_title": "Cybersecurity Engineer",
            "category": "Cloud & Operations",
            "description": "Defends networks, servers, and software against unauthorized access, vulnerabilities, and cyber threats.",
            "core_skills": [
                "Network Security", "TCP/IP", "Firewalls", "Linux", "Bash",
                "Python", "Vulnerability Assessment", "Penetration Testing",
                "Cryptography", "PKI", "TLS", "OWASP Top 10", "SIEM"
            ],
            "secondary_skills": [
                "Cloud Security", "Burp Suite", "Wireshark", "Nmap", "Incident Response"
            ],
            "tools": ["Wireshark", "Burp Suite", "Nmap", "Python", "Linux", "Splunk"],
            "avg_salary": "$125,000 - $170,000",
            "experience_level": "Mid to Senior",
            "typical_interview_topics": [
                "Remediation techniques for OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, SSRF)",
                "Public Key Infrastructure and cryptographic handshakes",
                "Mitigating Distributed Denial of Service (DDoS) attacks",
                "Security incident response lifecycle from containment to post-mortem"
            ],
            "capstone_project": "Automated Web Application Security Scanner & Vulnerability Alerting Daemon in Python"
        }
    ]


def get_roles_dataframe() -> pd.DataFrame:
    """
    Transforms role benchmarks into a Pandas DataFrame for vectorized analytics.
    """
    data = get_roles_data()
    df = pd.DataFrame(data)
    # Add formatted search text combining title, description, and core skills
    df["search_corpus"] = df.apply(
        lambda r: f"{r['role_title']} {r['description']} {' '.join(r['core_skills'])} {' '.join(r['secondary_skills'])}",
        axis=1
    )
    # Add count of total core skills as a numerical feature
    df["core_skills_count"] = df["core_skills"].apply(len)
    return df


if __name__ == "__main__":
    df = get_roles_dataframe()
    print("Roles DataFrame successfully built with Pandas:")
    print(df[["role_id", "role_title", "category", "core_skills_count"]].to_string())
