export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  degree: string;
  university: string;
  estimated_years_experience: number;
  summary?: string;
}

export interface PartiallyMatchedSkill {
  required: string;
  candidate_has: string;
  explanation?: string;
  similarity?: number;
}

export interface GapAnalysis {
  candidate: CandidateInfo;
  target_role: string;
  role_category?: string;
  role_description?: string;
  match_score: number;
  ats_score: number;
  readiness_tier: string;
  readiness_summary: string;
  extracted_skills: string[];
  matched_core_skills: string[];
  missing_core_skills: string[];
  partially_matched_skills: PartiallyMatchedSkill[];
  matched_secondary_skills?: string[];
  missing_secondary_skills: string[];
  tools_and_frameworks?: string[];
  key_strengths?: string[];
  ats_warnings?: string[];
  interview_topics?: string[];
  suggested_capstone_project?: string;
}

export interface ResourceItem {
  title: string;
  type: string;
  url: string;
  free?: boolean;
}

export interface MilestoneItem {
  id: string;
  title: string;
  done: boolean;
}

export interface PhaseProject {
  name: string;
  deliverable: string;
  tech_stack?: string[];
  architecture_tips?: string;
  estimated_hours?: number;
}

export interface RoadmapPhase {
  phase_number: number;
  title: string;
  week_range: string;
  target_skills: string[];
  description: string;
  project: PhaseProject;
  resources: ResourceItem[];
  milestones: MilestoneItem[];
  interview_drills?: string[];
}

export interface CapstoneProjectDetails {
  name: string;
  overview?: string;
  deliverable?: string;
  key_features?: string[];
  resume_impact_bullet?: string;
}

export interface Roadmap {
  target_role: string;
  total_weeks: number;
  hours_per_week: number;
  total_phases: number;
  phases: RoadmapPhase[];
  capstone_project?: string | CapstoneProjectDetails;
  overall_strategy?: string;
  interview_drills?: string[];
  matched_skills_summary?: string[];
  bridged_skills_count?: number;
}

export interface EngineeringRole {
  id: string;
  title: string;
  category: 'AI & Data' | 'Software & Systems' | 'Cloud & Operations' | 'Specialized';
  description: string;
  core_skills: string[];
  secondary_skills: string[];
  tools_and_frameworks: string[];
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Advanced';
  avg_salary: string;
  iconName: string;
}
