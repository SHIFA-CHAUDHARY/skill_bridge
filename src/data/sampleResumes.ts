export interface SampleResume {
  id: string;
  name: string;
  subtitle: string;
  targetRole: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    subtitle: '3rd Year CS Student (Python & Basics -> AI Engineer)',
    targetRole: 'AI Engineer',
    text: `Aarav Sharma
Pre-final Year Student, B.Tech Computer Science & Engineering
Email: aarav.sharma@gmail.com | Phone: +1-555-0199
GitHub: github.com/aaravsharma | LinkedIn: linkedin.com/in/aaravsharma

EDUCATION
Bachelor of Technology in Computer Science & Engineering
State University of Technology (2022 - 2026) | GPA: 3.8 / 4.0
Relevant Coursework: Data Structures & Algorithms, Object Oriented Programming, Database Management Systems, Discrete Mathematics, Probability & Statistics.

TECHNICAL SKILLS
- Programming Languages: Python, C++, SQL, JavaScript, HTML5, CSS3
- Frameworks & Libraries: Flask, Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn
- Developer Tools: Git, GitHub, VS Code, Linux/Ubuntu, Jupyter Notebooks
- Concepts: REST APIs, Supervised Machine Learning, OOP, Relational Database Normalization

PROJECTS
1. Customer Churn Prediction & Analysis System (Python, Scikit-Learn, Flask)
   - Built a supervised classification model using Random Forests to predict telecom customer churn with 85% accuracy.
   - Performed exploratory data analysis (EDA) and feature scaling on 7,000+ customer records using Pandas and Seaborn.
   - Created a lightweight Flask API to serve predictions with structured JSON payloads.

2. Student Course Management Portal (Python, SQLite, HTML/CSS)
   - Developed a full-stack university registration prototype supporting 500+ mock student entries.
   - Designed schema with SQLite, implemented CRUD operations, and wrote custom unit tests.

CERTIFICATIONS & ACHIEVEMENTS
- HackerRank Python (5 Stars Gold Badge)
- LeetCode: 220+ problems solved (Arrays, Hash Maps, Linked Lists, Binary Search)
- Finalist in University Hackathon 2024`
  },
  {
    id: 'priya',
    name: 'Priya Patel',
    subtitle: 'Junior Frontend Developer (React, JS -> Full Stack & Python)',
    targetRole: 'Software Engineer (Full Stack)',
    text: `Priya Patel
Junior Web Developer & Frontend Specialist
Email: priya.patel@devmail.com | Portfolio: priyapatel.dev
GitHub: github.com/priyapatel | Location: San Jose, CA

EDUCATION
B.S. in Information Systems & Web Engineering
California State University (2020 - 2024) | Magna Cum Laude

TECHNICAL SKILLS
- Frontend: JavaScript (ES6+), TypeScript, React, Next.js, HTML5, CSS3, Tailwind CSS, Redux Toolkit
- Web Technologies: REST APIs, Responsive Design, Webpack, Vite, npm/yarn
- Developer Tools: Git, GitHub, VS Code, Figma, Chrome DevTools
- Familiarity: Python, Node.js basics, SQL queries

EXPERIENCE
Frontend Developer Intern | TechVibe Solutions (June 2023 - Present)
- Developed 15+ reusable React components using Tailwind CSS, increasing page load speed by 28%.
- Integrated RESTful backend endpoints with Axios and implemented error boundary screens.
- Collaborated with UX designers in Figma to build accessible, mobile-first design systems.

PROJECTS
1. DevFlow - Developer Task Kanban Board (React, TypeScript, Tailwind)
   - Created an interactive drag-and-drop task tracking board using HTML5 Drag and Drop API.
   - Implemented client-side filtering, search, and local storage caching for offline usage.
2. Weather Analytics Dashboard (JavaScript, OpenWeatherMap API)
   - Built a real-time 7-day weather predictor with interactive charts and dynamic geolocation.`
  },
  {
    id: 'sneha',
    name: 'Sneha Reddy',
    subtitle: 'Data Analytics Intern (SQL, Excel, Pandas -> Data Scientist)',
    targetRole: 'Data Scientist',
    text: `Sneha Reddy
Data Analyst & BI Specialist
Email: sneha.reddy@analytics.org | Phone: +1-555-8821
LinkedIn: linkedin.com/in/snehareddy-data

EDUCATION
B.S. in Statistics & Applied Mathematics
University of Illinois (2021 - 2025) | GPA: 3.85 / 4.0

TECHNICAL SKILLS
- Data & Analytics: SQL (PostgreSQL, MySQL), Excel (VLOOKUP, Pivot, Solver), Tableau, Power BI
- Programming: Python (Pandas, NumPy, Matplotlib, Seaborn), basic R
- Statistical Methods: Hypothesis Testing, ANOVA, Linear Regression, Confidence Intervals, A/B Testing
- Tools: Jupyter, Git, Google BigQuery, Google Sheets

EXPERIENCE
Data Analytics Intern | RetailPulse Insights (May 2024 - August 2024)
- Built automated SQL queries with CTEs and Window Functions (RANK, DENSE_RANK) to track weekly sales trends across 45 stores.
- Designed 3 interactive Tableau executive dashboards utilized by senior leadership.
- Conducted exploratory data analysis on promotional campaigns, identifying a 12% drop in marketing return-on-ad-spend (ROAS).

PROJECTS
1. Housing Market Valuation & Price Trends (Python, Pandas, Statsmodels)
   - Analyzed 10,000+ real estate transaction records, removing outliers and performing collinearity checks.
   - Built multiple linear regression model identifying key square footage and zip-code value drivers.
2. E-Commerce Customer Retention & Cohort Study (SQL, Power BI)
   - Modeled monthly customer churn cohorts, calculating 30-day and 90-day repeat purchase rates.`
  },
  {
    id: 'david',
    name: 'David Chen',
    subtitle: 'Mechanical/EE Undergrad (C++, MATLAB -> Embedded / Robotics)',
    targetRole: 'Embedded Systems & IoT Engineer',
    text: `David Chen
Electrical & Robotics Engineering Undergrad
Email: david.chen@robotics.edu | Phone: +1-555-0312
GitHub: github.com/davidchen-eng

EDUCATION
B.S. in Electrical Engineering & Mechatronics
Purdue University (2022 - 2026) | GPA: 3.7 / 4.0

TECHNICAL SKILLS
- Programming: C, C++, Python, MATLAB, Simulink
- Microcontrollers & Hardware: Arduino, ESP32, STM32 basics, Raspberry Pi
- Protocols: UART, I2C, SPI, PWM
- Software & Tools: Git, Linux CLI, PlatformIO, Oscilloscopes, Logic Analyzers, Multimeters
- Concepts: Digital Logic, Control Systems, PID Controllers, Circuit Schematics

PROJECTS
1. Autonomous Line-Following & Obstacle-Avoiding Robot (C++, Arduino, Ultrasonic Sensors)
   - Programmed closed-loop PID control algorithm to maintain high-speed path stability along line boundaries.
   - Integrated ultrasonic distance sensing to interrupt motor drive routines upon detecting obstacles within 15cm.
2. IoT Environmental Monitoring Station (ESP32, C++, Python)
   - Engineered dual-sensor telemetry node reading temperature, humidity, and barometric pressure.
   - Transmitted sensor readings via Wi-Fi to a local Python logging listener using socket connections.`
  }
];
