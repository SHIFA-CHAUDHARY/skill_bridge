"""
SkillBridge AI - Role Benchmarks Database
Defines core, secondary, and tooling competencies for modern engineering roles.
"""

from typing import Dict, List, Any

ROLE_BENCHMARKS: Dict[str, Dict[str, Any]] = {
    "AI Engineer": {
        "title": "AI Engineer",
        "category": "AI & Data",
        "description": "Architects, fine-tunes, and deploys intelligent models, LLM agents, and GenAI applications into production systems.",
        "core_skills": [
            "Python", "PyTorch or TensorFlow", "Large Language Models (LLMs)",
            "Prompt Engineering", "Vector Databases (Pinecone/Chroma/Weaviate)",
            "RAG (Retrieval-Augmented Generation)", "REST APIs / FastAPI",
            "LangChain or LlamaIndex", "Model Fine-tuning / LoRA", "Git & Version Control"
        ],
        "secondary_skills": [
            "Docker & Containerization", "Hugging Face Transformers",
            "Cloud AI Services (GCP/AWS/Azure)", "Weights & Biases / MLflow",
            "Embeddings & Semantic Search", "Evaluation Metrics (BLEU, ROUGE)",
            "Asynchronous Programming", "Data Preprocessing & Cleaning"
        ],
        "tools_and_frameworks": [
            "FastAPI", "PyTorch", "HuggingFace", "LangChain", "ChromaDB",
            "Docker", "Ollama / vLLM", "PostgreSQL / pgvector"
        ],
        "typical_interview_topics": [
            "Explain Chunking strategies and Vector Embeddings in RAG pipelines",
            "Difference between Fine-tuning, LoRA, and Few-shot prompting",
            "How to mitigate LLM hallucinations and latency bottlenecks",
            "Model quantization (GGML, GGUF, AWQ, GPTQ) and serving architectures"
        ],
        "suggested_capstone_project": "Build an Autonomous Multimodal AI Research Assistant with RAG, vector search, streaming responses, and local evaluation benchmarks."
    },
    "Data Scientist": {
        "title": "Data Scientist",
        "category": "AI & Data",
        "description": "Leverages statistical modeling, experimental design, and machine learning to uncover business insights and predict outcomes.",
        "core_skills": [
            "Python", "SQL & Relational Databases", "Pandas & NumPy",
            "Statistical Analysis & Hypothesis Testing", "Scikit-Learn",
            "Data Visualization (Matplotlib/Seaborn/Plotly)", "Supervised & Unsupervised ML",
            "Feature Engineering", "A/B Testing", "Git"
        ],
        "secondary_skills": [
            "PyTorch or TensorFlow", "Big Data (PySpark / Databricks)",
            "Time Series Forecasting (ARIMA / Prophet)", "Model Interpretability (SHAP / LIME)",
            "Dashboarding (Streamlit / Tableau / Power BI)", "Cloud Data Warehouses (BigQuery / Snowflake)",
            "Dimensionality Reduction (PCA, t-SNE)"
        ],
        "tools_and_frameworks": [
            "Jupyter Notebooks", "Pandas", "Scikit-Learn", "PostgreSQL",
            "BigQuery", "Seaborn", "Streamlit"
        ],
        "typical_interview_topics": [
            "Bias-Variance tradeoff and regularization techniques (L1 vs L2)",
            "Formulating and interpreting A/B testing statistical significance (p-values, power)",
            "Handling imbalanced datasets (SMOTE, precision-recall AUC)",
            "Gradient Boosting algorithms: XGBoost, LightGBM, and CatBoost"
        ],
        "suggested_capstone_project": "End-to-End Customer Churn & Lifetime Value Prediction system with feature store, automated training pipeline, and interactive executive dashboard."
    },
    "Machine Learning Engineer": {
        "title": "Machine Learning Engineer",
        "category": "AI & Data",
        "description": "Bridges research and software engineering to scale, optimize, and reliably serve machine learning models in production.",
        "core_skills": [
            "Python", "PyTorch", "Scikit-Learn", "Data Structures & Algorithms",
            "Model Serving & Deployment (FastAPI / Triton / TorchServe)",
            "Docker & Kubernetes", "Feature Pipelines & ETL",
            "MLflow or WandB", "Git & CI/CD Pipelines"
        ],
        "secondary_skills": [
            "C++ or Rust for High-Performance Inference", "ONNX Model Optimization",
            "Distributed Training (DDP / DeepSpeed)", "Kubeflow or Airflow",
            "Model Monitoring & Data Drift Detection (Evidently AI)",
            "Cloud Computing (AWS SageMaker / GCP Vertex AI)"
        ],
        "tools_and_frameworks": [
            "PyTorch", "Docker", "MLflow", "FastAPI", "Ray", "Kubeflow", "Git"
        ],
        "typical_interview_topics": [
            "Architecting scalable real-time inference vs batch prediction systems",
            "Detecting data drift and concept drift in production pipelines",
            "Model compression techniques: Pruning, Quantization, and Knowledge Distillation",
            "Optimizing GPU memory throughput during training and inference"
        ],
        "suggested_capstone_project": "Production-ready Real-time Recommendation Engine with automated model retraining, drift alerting, and sub-50ms latency serving."
    },
    "Python Developer": {
        "title": "Python Developer",
        "category": "Software & Systems",
        "description": "Constructs robust backend web services, automation workflows, data processing engines, and API microservices in Python.",
        "core_skills": [
            "Python (OOP, Generators, Decorators, Typing)", "FastAPI or Django / Flask",
            "Relational Databases & SQL (PostgreSQL / SQLite)", "ORM (SQLAlchemy or Django ORM)",
            "RESTful API Design", "Unit Testing (pytest, unittest)",
            "Git & GitHub Workflows", "Asyncio & Concurrency"
        ],
        "secondary_skills": [
            "Redis & Caching Strategies", "Celery / Background Task Queues",
            "Docker & Containerization", "Web Scraping (BeautifulSoup / Playwright)",
            "Authentication (JWT, OAuth2)", "CI/CD (GitHub Actions)",
            "Pydantic Data Validation", "Linux CLI & Bash Scripting"
        ],
        "tools_and_frameworks": [
            "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "pytest", "Redis", "Git"
        ],
        "typical_interview_topics": [
            "Python Global Interpreter Lock (GIL), multithreading vs multiprocessing vs asyncio",
            "Database indexing, N+1 query problem, and connection pooling",
            "Writing custom decorators, context managers, and generators",
            "Designing RESTful APIs with idempotent methods and robust error handling"
        ],
        "suggested_capstone_project": "High-throughput Distributed Task Execution & Web Hook Processing Service built with FastAPI, Redis queue, PostgreSQL, and Celery."
    },
    "Data Analyst": {
        "title": "Data Analyst",
        "category": "AI & Data",
        "description": "Transforms raw company metrics into intuitive dashboards, business intelligence insights, and actionable growth strategies.",
        "core_skills": [
            "SQL (Window Functions, CTEs, Aggregations)", "Excel / Google Sheets (Advanced, Pivot, VLOOKUP)",
            "Python (Pandas, Matplotlib, Seaborn)", "BI Tools (Power BI / Tableau)",
            "Data Storytelling & Reporting", "Exploratory Data Analysis (EDA)",
            "Basic Statistics & Metric Definitions"
        ],
        "secondary_skills": [
            "Data Cleaning & Regex", "Google Analytics / Mixpanel",
            "Git & Collaborative Version Control", "Basic Machine Learning Concepts",
            "ETL Basics (dbt, Airflow)", "Business KPI Definition (LTV, CAC, Retention)"
        ],
        "tools_and_frameworks": [
            "PostgreSQL / MySQL", "Tableau or Power BI", "Pandas", "Excel", "Jupyter"
        ],
        "typical_interview_topics": [
            "Complex SQL queries involving Window Functions (RANK, DENSE_RANK, LAG, LEAD)",
            "How to structure an executive dashboard to answer core business questions",
            "Identifying correlation versus causation in observational data",
            "Handling missing, duplicate, and anomalous data in historical logs"
        ],
        "suggested_capstone_project": "Comprehensive E-Commerce Business Intelligence & Revenue Growth Dashboard with cohort retention curves and customer segmentation."
    },
    "Software Engineer (Full Stack)": {
        "title": "Software Engineer (Full Stack)",
        "category": "Software & Systems",
        "description": "Develops end-to-end web applications, uniting responsive interactive frontends with scalable server architectures and databases.",
        "core_skills": [
            "JavaScript / TypeScript", "React or Next.js / Vue", "HTML5 & Modern CSS / Tailwind",
            "Node.js or Python Backend (Express / FastAPI)", "RESTful APIs / GraphQL",
            "SQL & Database Design (PostgreSQL / MySQL)", "Git & Collaborative PR Workflows",
            "Data Structures & Algorithms"
        ],
        "secondary_skills": [
            "Docker & Containerization", "State Management (Zustand / Redux / TanStack Query)",
            "Authentication (JWT / Session / OAuth)", "Cloud Hosting (Vercel / AWS / Cloud Run)",
            "CI/CD Pipelines", "Automated Testing (Jest / Vitest / Playwright)",
            "Web Security (CORS, CSRF, XSS prevention)"
        ],
        "tools_and_frameworks": [
            "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Docker", "Git"
        ],
        "typical_interview_topics": [
            "Frontend state management and rendering lifecycle optimizations",
            "Designing REST APIs and database schema normalization",
            "Data Structures: Hash Maps, Trees, Graphs, Sorting algorithms",
            "Web performance: Code splitting, caching, lazy loading, and asset minification"
        ],
        "suggested_capstone_project": "Full-featured Collaborative Project Management SaaS with real-time updates, kanban drag-and-drop, role-based access control, and payment integration."
    },
    "Backend Engineer": {
        "title": "Backend Engineer",
        "category": "Software & Systems",
        "description": "Constructs the server-side logic, high-throughput microservices, data pipelines, and infrastructure powering modern applications.",
        "core_skills": [
            "Python, Go, or Java", "REST & gRPC APIs", "Relational Databases (PostgreSQL)",
            "NoSQL Databases (Redis / MongoDB)", "System Design & Distributed Architectures",
            "Data Structures & Algorithms", "Git & CI/CD", "Linux Server Environments"
        ],
        "secondary_skills": [
            "Message Brokers (Kafka / RabbitMQ)", "Docker & Kubernetes",
            "Database Replication & Sharding", "Caching Strategies (Cache-Aside, Write-Through)",
            "Monitoring & Observability (Prometheus / Grafana)", "OAuth2 & API Security"
        ],
        "tools_and_frameworks": [
            "PostgreSQL", "Redis", "Docker", "Kafka", "FastAPI / Gin / Spring Boot", "Git"
        ],
        "typical_interview_topics": [
            "Designing a URL shortener or rate limiter at scale (100k req/sec)",
            "CAP theorem and consistency models in distributed data stores",
            "Database transactions, ACID properties, isolation levels, and row locking",
            "Asynchronous processing with event queues and dead-letter handling"
        ],
        "suggested_capstone_project": "Scalable Real-time Distributed Event Streaming & Notification Microservice with rate limiting, Redis caching, and Kafka ingestion."
    },
    "Cloud & DevOps Engineer": {
        "title": "Cloud & DevOps Engineer",
        "category": "Cloud & Operations",
        "description": "Automates cloud infrastructure, implements continuous integration/deployment, and ensures system resilience and observability.",
        "core_skills": [
            "Linux / Unix Operating Systems", "Cloud Platforms (AWS, GCP, or Azure)",
            "Docker & Containerization", "Kubernetes (K8s)",
            "Infrastructure as Code (Terraform)", "CI/CD (GitHub Actions / GitLab CI)",
            "Python or Bash Scripting", "Networking (DNS, VPC, Subnets, SSL/TLS, Load Balancing)"
        ],
        "secondary_skills": [
            "Observability (Prometheus, Grafana, ELK Stack)", "Security & Compliance (IAM, Secrets Management)",
            "Helm Package Manager", "GitOps (ArgoCD / Flux)", "Cloud Cost Optimization"
        ],
        "tools_and_frameworks": [
            "Terraform", "Kubernetes", "Docker", "GitHub Actions", "AWS / GCP", "Prometheus"
        ],
        "typical_interview_topics": [
            "Container orchestration, Kubernetes Pod scheduling, and Service mesh",
            "Zero-downtime deployment patterns (Blue-Green, Canary, Rolling)",
            "Immutable infrastructure with Terraform and state locking",
            "Incident response, root cause analysis, and SLA/SLO/SLI monitoring"
        ],
        "suggested_capstone_project": "Multi-region Kubernetes deployment pipeline automated via Terraform and GitHub Actions with Prometheus alerting and automated rollback."
    },
    "Cybersecurity Engineer": {
        "title": "Cybersecurity Engineer",
        "category": "Cloud & Operations",
        "description": "Defends networks, servers, and software against unauthorized access, vulnerabilities, and advanced cyber threats.",
        "core_skills": [
            "Network Security & Protocols (TCP/IP, HTTP/S, DNS, Firewalls)",
            "Linux & Bash Scripting", "Python for Security Automation",
            "Vulnerability Assessment & Penetration Testing",
            "Cryptography Fundamentals (Public/Private Keys, Hashing, TLS)",
            "OWASP Top 10 Web Vulnerabilities", "SIEM & Log Analysis"
        ],
        "secondary_skills": [
            "Cloud Security (AWS/GCP IAM & Security Groups)", "Reverse Engineering & Malware Analysis",
            "Incident Response & Threat Hunting", "Burp Suite / Wireshark / Nmap",
            "Security Compliance (SOC 2, ISO 27001)"
        ],
        "tools_and_frameworks": [
            "Wireshark", "Nmap", "Burp Suite", "Splunk / ELK", "Python", "Metasploit", "Linux"
        ],
        "typical_interview_topics": [
            "Explaining OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, SSRF) and remediation",
            "Public Key Infrastructure (PKI) and SSL/TLS handshake deep dive",
            "Defending against DDoS attacks and brute-force authentication attacks",
            "Security Incident response procedure from detection to post-mortem"
        ],
        "suggested_capstone_project": "Automated Web Application Security Scanner & Vulnerability Alerting Daemon built in Python with threat dashboard."
    },
    "Embedded Systems & IoT Engineer": {
        "title": "Embedded Systems & IoT Engineer",
        "category": "Specialized",
        "description": "Develops low-level firmware, micro-controller drivers, real-time operating systems, and connected hardware edge devices.",
        "core_skills": [
            "C and C++ Programming", "Microcontrollers (ARM Cortex, ESP32, STM32, Arduino)",
            "Hardware Communication Protocols (UART, SPI, I2C, CAN)",
            "RTOS (FreeRTOS) Concepts", "Python for Hardware Scripting & Testing",
            "Debugging (GDB, Oscilloscopes, Logic Analyzers)", "Memory Constraints & Optimization"
        ],
        "secondary_skills": [
            "Wireless IoT Protocols (BLE, Zigbee, MQTT, LoRaWAN)", "PCB Schematics Reading",
            "Device Drivers & Low-level Registers", "Linux Kernel / Embedded Linux (Yocto)",
            "Firmware OTA (Over-The-Air) Updates"
        ],
        "tools_and_frameworks": [
            "STM32CubeIDE", "ESP-IDF", "FreeRTOS", "PlatformIO", "GDB", "Python"
        ],
        "typical_interview_topics": [
            "Volatile keyword, memory alignment, and interrupt service routines (ISR)",
            "Clock synchronization and timing differences in I2C vs SPI",
            "Preventing deadlocks and priority inversion in FreeRTOS tasks",
            "Optimizing firmware for ultra-low power sleep states"
        ],
        "suggested_capstone_project": "Smart Environmental Edge Node firmware on ESP32 with FreeRTOS, sensor telemetry via MQTT, and secure OTA firmware updates."
    },
    "Computer Vision Engineer": {
        "title": "Computer Vision Engineer",
        "category": "Specialized",
        "description": "Creates algorithms that extract meaningful visual features and high-level understanding from digital images and video streams.",
        "core_skills": [
            "Python", "OpenCV", "Deep Learning (PyTorch or TensorFlow)",
            "Convolutional Neural Networks (CNNs)", "Object Detection (YOLO / Faster R-CNN)",
            "Image Segmentation & Classification", "NumPy & Linear Algebra",
            "Model Optimization (TensorRT / ONNX)"
        ],
        "secondary_skills": [
            "3D Vision & Point Clouds", "Vision Transformers (ViT)",
            "Real-time Video Processing Streams", "Docker & GPU Acceleration (CUDA)",
            "Dataset Annotation & Augmentation pipelines"
        ],
        "tools_and_frameworks": [
            "PyTorch", "OpenCV", "YOLOv8", "CUDA", "TensorRT", "Albumentations"
        ],
        "typical_interview_topics": [
            "Convolution arithmetic, receptive field, and pooling layers",
            "Intersection over Union (IoU) and Non-Maximum Suppression (NMS) in object detection",
            "Transfer learning techniques for vision backbones (ResNet, EfficientNet)",
            "Deploying low-latency video inference pipelines with TensorRT"
        ],
        "suggested_capstone_project": "Real-time Multi-Object Tracking & Spatial Analytics System for industrial safety monitoring using YOLOv8 and DeepSORT."
    },
    "NLP Engineer": {
        "title": "NLP Engineer",
        "category": "Specialized",
        "description": "Specializes in linguistic computation, semantic text understanding, translation, knowledge graphs, and language generation.",
        "core_skills": [
            "Python", "Transformers Architecture & Self-Attention", "Hugging Face Libraries",
            "Text Preprocessing & Tokenization (BPE, WordPiece)", "PyTorch",
            "Vector Embeddings & Semantic Search", "Named Entity Recognition (NER) & Classification",
            "Evaluation Metrics (Perplexity, F1, ROUGE)"
        ],
        "secondary_skills": [
            "spaCy / NLTK", "Knowledge Graphs & Ontologies",
            "Information Extraction & Question Answering", "FastAPI Serving",
            "Synthetic Data Generation & Data Cleaning", "Cross-lingual Models"
        ],
        "tools_and_frameworks": [
            "HuggingFace", "PyTorch", "spaCy", "Transformers", "FastAPI", "ChromaDB"
        ],
        "typical_interview_topics": [
            "Deep dive into Multi-Head Self-Attention mechanisms and positional encodings",
            "Tokenization corner cases and vocabulary size tradeoffs",
            "Contrastive learning for sentence embeddings",
            "Fine-tuning BERT/RoBERTa versus causal decoder models like Llama"
        ],
        "suggested_capstone_project": "Domain-Specific Contract Analysis & Legal Risk Extractor utilizing fine-tuned transformer models and structured information parsing."
    }
}
