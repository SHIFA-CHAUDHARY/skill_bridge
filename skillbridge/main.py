#!/usr/bin/env python3
"""
SkillBridge AI - Unified CLI & VS Code Runner
Skill Gap & Career Roadmap Predictor for Engineers.
"""

import sys
import os
import argparse
import json
from typing import Optional

# Ensure local skillbridge package imports properly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from skillbridge.analyzer import analyze_skill_gap
    from skillbridge.roadmap_generator import generate_roadmap
    from skillbridge.benchmarks import ROLE_BENCHMARKS
except ImportError:
    from analyzer import analyze_skill_gap
    from roadmap_generator import generate_roadmap
    from benchmarks import ROLE_BENCHMARKS


SAMPLE_RESUME_TEXT = """
Aarav Sharma
B.Tech Computer Science | Pre-final Year Student
Email: aarav.sharma@gmail.com | Phone: +1-555-0199
GitHub: github.com/aaravsharma | LinkedIn: linkedin.com/in/aaravsharma

EDUCATION:
Bachelor of Technology in Computer Science & Engineering (2022 - 2026)
GPA: 3.8 / 4.0 | Relevant Coursework: Data Structures, Database Systems, Operating Systems

TECHNICAL SKILLS:
- Languages: Python, C++, SQL, HTML5, CSS3, JavaScript
- Frameworks & Libraries: Flask, Pandas, NumPy, Matplotlib, Scikit-Learn
- Developer Tools: Git, GitHub, VS Code, Linux, Jupyter Notebooks

PROJECTS:
1. Customer Churn Prediction & Analysis Web App
   - Built a supervised classification model with Scikit-Learn achieving 84% accuracy.
   - Deployed REST endpoints using Flask and visualized metrics using Matplotlib.
2. Library Management System
   - Designed normalized relational database with SQLite and Python backend.
"""


def cmd_list_roles():
    print("=" * 60)
    print("🎯 SkillBridge AI - Supported Engineering Target Roles")
    print("=" * 60)
    for role, info in ROLE_BENCHMARKS.items():
        print(f"\n🔹 {role} [{info.get('category', 'Engineering')}]")
        print(f"   {info['description']}")
        print(f"   Core Skills: {', '.join(info['core_skills'][:5])}...")
    print("\n" + "=" * 60)


def cmd_analyze(resume_path: Optional[str], role: str, raw_text: Optional[str] = None):
    text = raw_text
    if not text:
        if resume_path and os.path.exists(resume_path):
            with open(resume_path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            print("[INFO] No resume file provided or file not found. Using default engineering student sample.")
            text = SAMPLE_RESUME_TEXT

    result = analyze_skill_gap(text, role)

    print("\n" + "=" * 65)
    print(f"  SKILLBRIDGE AI – GAP REPORT: {result['target_role'].upper()}")
    print("=" * 65)
    print(f"👤 Candidate: {result['candidate']['name']} ({result['candidate']['degree']})")
    print(f"🎯 Target Role: {result['target_role']}")
    print(f"📊 Role Match Score: {result['match_score']}%")
    print(f"📄 ATS Readiness Score: {result['ats_score']}%")
    print(f"🏷️  Status: {result['readiness_tier']}")
    print(f"💡 Summary: {result['readiness_summary']}\n")

    print("-" * 65)
    print(f"✅ MATCHED SKILLS ({len(result['matched_core_skills'])} found):")
    for s in result["matched_core_skills"]:
        print(f"   ✓ {s}")

    print(f"\n🚨 CRITICAL MISSING SKILLS ({len(result['missing_core_skills'])} gaps):")
    for s in result["missing_core_skills"]:
        print(f"   ✗ {s}")

    if result["missing_secondary_skills"]:
        print(f"\n⚡ SECONDARY GAPS ({len(result['missing_secondary_skills'])} gaps):")
        for s in result["missing_secondary_skills"][:5]:
            print(f"   - {s}")

    print("\n" + "=" * 65)
    return result


def cmd_roadmap(resume_path: Optional[str], role: str, weeks: int = 8, hours: int = 10, raw_text: Optional[str] = None):
    gap = cmd_analyze(resume_path, role, raw_text)
    roadmap = generate_roadmap(gap, total_weeks=weeks, hours_per_week=hours)

    print("\n" + "=" * 65)
    print(f"  PERSONALIZED {weeks}-WEEK LEARNING ROADMAP ({hours} hrs/week)")
    print("=" * 65)

    for phase in roadmap["phases"]:
        print(f"\n📌 {phase['title']} ({phase['week_range']})")
        print(f"   Target Skills: {', '.join(phase['target_skills'])}")
        print(f"   🛠️ Project: {phase['project']['name']}")
        print(f"      Deliverable: {phase['project']['deliverable']}")
        print("   📚 Recommended Resources:")
        for res in phase["resources"]:
            print(f"      • [{res['type']}] {res['title']} -> {res['url']}")
        print("   ✅ Milestone Checklist:")
        for m in phase["milestones"]:
            print(f"      [ ] {m['title']}")

    print("\n" + "=" * 65)
    print("🏆 CAPSTONE PROJECT:")
    print(f"   {roadmap['capstone_project']}")
    print("=" * 65)
    return roadmap


def main():
    parser = argparse.ArgumentParser(
        description="SkillBridge AI - Skill Gap & Career Roadmap Predictor (Python Engine)",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: list-roles
    subparsers.add_parser("list-roles", help="List all supported engineering target roles and competencies")

    # Command: analyze
    parser_analyze = subparsers.add_parser("analyze", help="Analyze resume against target role")
    parser_analyze.add_argument("--resume", "-r", type=str, help="Path to resume text or markdown file")
    parser_analyze.add_argument("--role", type=str, default="AI Engineer", help="Target engineering role")
    parser_analyze.add_argument("--json", action="store_true", help="Output pure JSON")

    # Command: roadmap
    parser_roadmap = subparsers.add_parser("roadmap", help="Generate multi-week personalized learning roadmap")
    parser_roadmap.add_argument("--resume", "-r", type=str, help="Path to resume file")
    parser_roadmap.add_argument("--role", type=str, default="AI Engineer", help="Target role")
    parser_roadmap.add_argument("--weeks", "-w", type=int, default=8, help="Total timeline weeks (4, 8, 12, 24)")
    parser_roadmap.add_argument("--hours", type=int, default=10, help="Available study hours per week")
    parser_roadmap.add_argument("--json", action="store_true", help="Output pure JSON")

    args = parser.parse_args()

    if args.command == "list-roles":
        cmd_list_roles()
    elif args.command == "analyze":
        if args.json:
            text = SAMPLE_RESUME_TEXT
            if args.resume and os.path.exists(args.resume):
                with open(args.resume, "r", encoding="utf-8") as f:
                    text = f.read()
            gap = analyze_skill_gap(text, args.role)
            print(json.dumps(gap, indent=2))
        else:
            cmd_analyze(args.resume, args.role)
    elif args.command == "roadmap":
        if args.json:
            text = SAMPLE_RESUME_TEXT
            if args.resume and os.path.exists(args.resume):
                with open(args.resume, "r", encoding="utf-8") as f:
                    text = f.read()
            gap = analyze_skill_gap(text, args.role)
            roadmap = generate_roadmap(gap, total_weeks=args.weeks, hours_per_week=args.hours)
            print(json.dumps(roadmap, indent=2))
        else:
            cmd_roadmap(args.resume, args.role, weeks=args.weeks, hours=args.hours)
    else:
        # Default run demo analysis
        print("👋 Welcome to SkillBridge AI! Running default demo for 'AI Engineer'...\n")
        cmd_roadmap(None, "AI Engineer", weeks=8, hours=10)


if __name__ == "__main__":
    main()
