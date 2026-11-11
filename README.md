# 🌉 SkillBridge AI – Skill Gap & Career Roadmap Predictor

> Intelligent Engineering Skill Diagnostic, Role Benchmark Matching & Personalized Roadmap Engine.
> Built with **Python 3**, **Pandas & NumPy**, **Scikit-learn**, **spaCy NLP**, and **Streamlit** (plus full-stack React UI).

---

## 🛠️ Technology Stack
- **Web App UI:** [Streamlit](https://streamlit.io/) (`app.py`) & React + Tailwind CSS
- **Data Manipulation:** [Pandas](https://pandas.pydata.org/) & [NumPy](https://numpy.org/) (`role_dataset.py`, `similarity_engine.py`)
- **Machine Learning & Vectors:** [Scikit-learn](https://scikit-learn.org/) (`TfidfVectorizer`, `cosine_similarity`)
- **NLP & Named Entity Recognition:** [spaCy](https://spacy.io/) (`nlp_extractor.py`)
- **Roadmap Synthesis:** Algorithmic milestone generator (`roadmap_engine.py`)

---

## 🚀 Quickstart: Running the Streamlit App in VS Code

### 1. Prerequisites
- Python 3.10+
- VS Code with Python extension

### 2. Setup
```bash
# Extract the downloaded zip and navigate to the folder
cd skillbridge-ai

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt

# Download spaCy English language model
python -m spacy download en_core_web_sm
```

### 3. Launch the Streamlit App
```bash
streamlit run app.py
```
Open [http://localhost:8501](http://localhost:8501) in your browser!

### 4. Running via VS Code F5 Debugger
Open the project in VS Code (`code .`) and press **F5**:
- **`Streamlit: SkillBridge Web App (F5)`** - Launches `app.py` in debug mode.
- **`Python: SkillBridge Analyzer (F5)`** - Runs the CLI gap analyzer.
- **`Python: Test ML Similarity Engine`** - Tests Scikit-learn TF-IDF & Cosine Similarity matrices.

---

## 💻 Running the Python CLI
```bash
# List all 12+ engineering benchmarks
python3 skillbridge/main.py list-roles

# Run skill gap analysis against AI Engineer
python3 skillbridge/main.py analyze --role "AI Engineer"

# Generate 8-week structured roadmap (10 study hours/week)
python3 skillbridge/main.py roadmap --role "Data Scientist" --weeks 8 --hours 10

# Test Scikit-learn TF-IDF vector similarity
python3 similarity_engine.py

# Test spaCy NLP extraction
python3 nlp_extractor.py
```

---

## 🌐 Running the Full-Stack React Web App (Optional)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
