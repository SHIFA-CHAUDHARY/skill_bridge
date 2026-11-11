"""
Unit tests for SkillBridge AI Analyzer & Roadmap Generator
Run in VS Code terminal: python3 -m unittest discover tests
"""

import unittest
from skillbridge.analyzer import analyze_skill_gap, extract_skills_from_text
from skillbridge.roadmap_generator import generate_roadmap


class TestSkillBridge(unittest.TestCase):

    def test_extract_skills(self):
        text = "Proficient in Python, PyTorch, Docker, and PostgreSQL with Git version control."
        skills = extract_skills_from_text(text)
        self.assertIn("Python", skills)
        self.assertIn("Pytorch", skills)
        self.assertIn("Docker", skills)
        self.assertIn("Postgresql", skills)

    def test_gap_analysis_ai_engineer(self):
        text = "Aarav Sharma - Student skilled in Python, Scikit-Learn, Pandas, Git, SQL."
        result = analyze_skill_gap(text, "AI Engineer")
        self.assertEqual(result["target_role"], "AI Engineer")
        self.assertIn("Python", result["matched_core_skills"])
        self.assertTrue(len(result["missing_core_skills"]) > 0)
        self.assertTrue(0 <= result["match_score"] <= 100)

    def test_roadmap_generation(self):
        text = "Student with Python and Git"
        gap = analyze_skill_gap(text, "Data Scientist")
        roadmap = generate_roadmap(gap, total_weeks=8, hours_per_week=10)
        self.assertEqual(roadmap["total_weeks"], 8)
        self.assertEqual(len(roadmap["phases"]), 4)
        self.assertTrue(len(roadmap["phases"][0]["milestones"]) > 0)


if __name__ == "__main__":
    unittest.main()
