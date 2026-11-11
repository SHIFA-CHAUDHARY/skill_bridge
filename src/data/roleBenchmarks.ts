import { EngineeringRole } from '../types';

export const ENGINEERING_ROLES: EngineeringRole[] = [
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'AI & Data',
    description: 'Designs, fine-tunes, and deploys intelligent LLM agents, GenAI architectures, and multimodal models into real-world software.',
    core_skills: [
      'Python', 'PyTorch or TensorFlow', 'Large Language Models (LLMs)',
      'Prompt Engineering', 'Vector Databases (Pinecone/Chroma/Weaviate)',
      'RAG (Retrieval-Augmented Generation)', 'REST APIs / FastAPI',
      'LangChain or LlamaIndex', 'Model Fine-tuning / LoRA', 'Git & Version Control'
    ],
    secondary_skills: [
      'Docker & Containerization', 'Hugging Face Transformers',
      'Cloud AI Services (GCP/AWS)', 'Weights & Biases / MLflow',
      'Embeddings & Semantic Search', 'Evaluation Metrics (BLEU, ROUGE)'
    ],
    tools_and_frameworks: ['FastAPI', 'PyTorch', 'HuggingFace', 'LangChain', 'ChromaDB', 'Docker'],
    difficulty: 'Intermediate',
    avg_salary: '$135,000 - $185,000',
    iconName: 'Cpu',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'AI & Data',
    description: 'Applies statistical modeling, experimental design, and predictive machine learning to solve high-stakes business and product problems.',
    core_skills: [
      'Python', 'SQL & Relational Databases', 'Pandas & NumPy',
      'Statistical Analysis & Hypothesis Testing', 'Scikit-Learn',
      'Data Visualization (Matplotlib/Seaborn)', 'Supervised & Unsupervised ML',
      'Feature Engineering', 'A/B Testing', 'Git'
    ],
    secondary_skills: [
      'PyTorch', 'Big Data (PySpark)', 'Time Series Forecasting',
      'Model Interpretability (SHAP/LIME)', 'Streamlit / Dash', 'Cloud Data Warehouses'
    ],
    tools_and_frameworks: ['Pandas', 'Scikit-Learn', 'PostgreSQL', 'Jupyter', 'Streamlit'],
    difficulty: 'Intermediate',
    avg_salary: '$125,000 - $165,000',
    iconName: 'BarChart2',
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'AI & Data',
    description: 'Specializes in scaling, optimizing, containerizing, and maintaining automated ML training and real-time inference pipelines in production.',
    core_skills: [
      'Python', 'PyTorch', 'Scikit-Learn', 'Data Structures & Algorithms',
      'Model Serving & Deployment (FastAPI/Triton)', 'Docker & Containerization',
      'Feature Pipelines & ETL', 'MLflow / Experiment Tracking', 'Git & CI/CD'
    ],
    secondary_skills: [
      'Kubernetes', 'ONNX Optimization', 'Distributed Training (DDP)',
      'Model Drift Detection', 'Airflow / Kubeflow'
    ],
    tools_and_frameworks: ['PyTorch', 'Docker', 'MLflow', 'FastAPI', 'Ray', 'Git'],
    difficulty: 'Advanced',
    avg_salary: '$140,000 - $190,000',
    iconName: 'Network',
  },
  {
    id: 'python-developer',
    title: 'Python Developer',
    category: 'Software & Systems',
    description: 'Engineers robust backend services, microservices, data processing scripts, automated tools, and RESTful web applications in Python.',
    core_skills: [
      'Python (OOP, Generators, Typing)', 'FastAPI or Django / Flask',
      'Relational Databases & SQL (PostgreSQL)', 'ORM (SQLAlchemy/Django ORM)',
      'RESTful API Design', 'Unit Testing (pytest)', 'Git & GitHub Workflows'
    ],
    secondary_skills: [
      'Redis & Caching', 'Celery / Async Task Queues', 'Docker',
      'Web Scraping (Playwright/BeautifulSoup)', 'CI/CD Pipelines'
    ],
    tools_and_frameworks: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Docker', 'pytest', 'Redis'],
    difficulty: 'Beginner Friendly',
    avg_salary: '$110,000 - $150,000',
    iconName: 'Code',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'AI & Data',
    description: 'Turns raw databases and tracking logs into clear executive dashboards, actionable metrics, and commercial growth recommendations.',
    core_skills: [
      'SQL (Window Functions, CTEs)', 'Excel & Google Sheets (Advanced Formulas)',
      'Python (Pandas, Matplotlib)', 'BI Tools (Tableau / Power BI)',
      'Data Storytelling & Reporting', 'Exploratory Data Analysis (EDA)'
    ],
    secondary_skills: [
      'Regex & Data Cleaning', 'Google Analytics', 'Git', 'Basic Machine Learning', 'dbt'
    ],
    tools_and_frameworks: ['SQL', 'Tableau', 'Power BI', 'Pandas', 'Excel'],
    difficulty: 'Beginner Friendly',
    avg_salary: '$80,000 - $115,000',
    iconName: 'PieChart',
  },
  {
    id: 'fullstack-engineer',
    title: 'Software Engineer (Full Stack)',
    category: 'Software & Systems',
    description: 'Constructs holistic digital products, connecting responsive modern web interfaces with scalable API backends and persistent databases.',
    core_skills: [
      'JavaScript / TypeScript', 'React or Next.js', 'HTML5 & Modern Tailwind CSS',
      'Node.js or Python Backend (Express / FastAPI)', 'RESTful APIs / GraphQL',
      'SQL & Database Design (PostgreSQL)', 'Git & PR Collaboration',
      'Data Structures & Algorithms'
    ],
    secondary_skills: [
      'Docker', 'State Management (Zustand/Redux)', 'Authentication (OAuth/JWT)',
      'Automated Testing (Playwright/Vitest)', 'Cloud Deployment'
    ],
    tools_and_frameworks: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Git'],
    difficulty: 'Intermediate',
    avg_salary: '$120,000 - $160,000',
    iconName: 'Layers',
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    category: 'Software & Systems',
    description: 'Focuses on server architecture, database throughput, distributed transactions, caching systems, and high-concurrency microservices.',
    core_skills: [
      'Python, Go, or Java', 'REST & gRPC APIs', 'Relational Databases (PostgreSQL)',
      'NoSQL Databases (Redis/MongoDB)', 'System Design & Distributed Systems',
      'Data Structures & Algorithms', 'Git & CI/CD', 'Linux CLI'
    ],
    secondary_skills: [
      'Message Queues (Kafka / RabbitMQ)', 'Docker & Kubernetes',
      'Database Sharding & Replication', 'Prometheus & Grafana Monitoring'
    ],
    tools_and_frameworks: ['PostgreSQL', 'Redis', 'Docker', 'Kafka', 'FastAPI', 'Linux'],
    difficulty: 'Intermediate',
    avg_salary: '$130,000 - $175,000',
    iconName: 'Server',
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Engineer',
    category: 'Cloud & Operations',
    description: 'Architects cloud infrastructure, automates deployment pipelines, provisions infrastructure as code, and guarantees zero-downtime operations.',
    core_skills: [
      'Linux / Unix Systems', 'Cloud Platforms (AWS, GCP, or Azure)',
      'Docker & Containerization', 'Kubernetes (K8s)',
      'Infrastructure as Code (Terraform)', 'CI/CD (GitHub Actions)',
      'Python or Bash Scripting', 'Networking (DNS, VPC, Subnets, TLS)'
    ],
    secondary_skills: [
      'Observability (Prometheus, Grafana)', 'Cloud Security & IAM',
      'Helm Charts', 'GitOps (ArgoCD)'
    ],
    tools_and_frameworks: ['Terraform', 'Kubernetes', 'Docker', 'GitHub Actions', 'AWS', 'Linux'],
    difficulty: 'Advanced',
    avg_salary: '$135,000 - $180,000',
    iconName: 'Cloud',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Engineer',
    category: 'Cloud & Operations',
    description: 'Guards infrastructure, software pipelines, and networks against vulnerabilities, intrusion attempts, and unauthorized access.',
    core_skills: [
      'Network Security & Protocols (TCP/IP, Firewalls)', 'Linux & Bash Scripting',
      'Python for Security Automation', 'Vulnerability Assessment & Pen Testing',
      'Cryptography Fundamentals (TLS, PKI)', 'OWASP Top 10 Web Vulnerabilities',
      'SIEM & Log Analysis'
    ],
    secondary_skills: [
      'Cloud Security (AWS/GCP IAM)', 'Burp Suite & Wireshark',
      'Incident Response', 'Reverse Engineering'
    ],
    tools_and_frameworks: ['Wireshark', 'Burp Suite', 'Nmap', 'Python', 'Linux', 'Splunk'],
    difficulty: 'Advanced',
    avg_salary: '$125,000 - $170,000',
    iconName: 'ShieldCheck',
  },
  {
    id: 'embedded-systems',
    title: 'Embedded Systems & IoT Engineer',
    category: 'Specialized',
    description: 'Writes real-time low-level firmware and device drivers for microcontrollers, sensors, robotics, and connected hardware products.',
    core_skills: [
      'C and C++ Programming', 'Microcontrollers (ARM Cortex, ESP32, STM32)',
      'Hardware Protocols (UART, SPI, I2C, CAN)', 'RTOS (FreeRTOS) Concepts',
      'Python for Hardware Testing', 'Debugging (GDB, Oscilloscopes)'
    ],
    secondary_skills: [
      'IoT Protocols (MQTT, BLE, LoRa)', 'PCB Schematic Reading',
      'Embedded Linux', 'Firmware Over-The-Air (OTA)'
    ],
    tools_and_frameworks: ['ESP-IDF', 'FreeRTOS', 'STM32Cube', 'GDB', 'Python'],
    difficulty: 'Advanced',
    avg_salary: '$120,000 - $160,000',
    iconName: 'Radio',
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision Engineer',
    category: 'Specialized',
    description: 'Builds systems that process, classify, and track visual inputs across video feeds, satellite imagery, and autonomous robotics.',
    core_skills: [
      'Python', 'OpenCV', 'Deep Learning (PyTorch)',
      'Convolutional Networks (CNNs)', 'Object Detection (YOLO / Faster R-CNN)',
      'Image Segmentation & Classification', 'NumPy & Linear Algebra'
    ],
    secondary_skills: [
      'Vision Transformers (ViT)', 'TensorRT / ONNX Optimization',
      'CUDA Acceleration', '3D Vision & Point Clouds'
    ],
    tools_and_frameworks: ['PyTorch', 'OpenCV', 'YOLOv8', 'CUDA', 'Albumentations'],
    difficulty: 'Advanced',
    avg_salary: '$135,000 - $185,000',
    iconName: 'Eye',
  },
  {
    id: 'nlp-engineer',
    title: 'NLP Engineer',
    category: 'Specialized',
    description: 'Architects specialized language parsing engines, tokenizers, multilingual translation models, and semantic reasoning systems.',
    core_skills: [
      'Python', 'Transformers Architecture & Self-Attention', 'Hugging Face Libraries',
      'Text Preprocessing & Tokenization', 'PyTorch',
      'Vector Embeddings & Semantic Search', 'NER & Text Classification'
    ],
    secondary_skills: [
      'spaCy / NLTK', 'Knowledge Graphs', 'FastAPI Serving', 'Synthetic Data Generation'
    ],
    tools_and_frameworks: ['HuggingFace', 'PyTorch', 'spaCy', 'Transformers', 'FastAPI'],
    difficulty: 'Advanced',
    avg_salary: '$135,000 - $180,000',
    iconName: 'BookOpen',
  }
];
