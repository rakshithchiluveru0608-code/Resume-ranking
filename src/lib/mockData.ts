// Mock data for Resume Ranker application

export interface ResumeCandidate {
  id: string;
  name: string;
  email: string;
  matchScore: number;
  skillMatch: number;
  missingSkillsCount: number;
  biasFlags: string[];
  experienceLevel: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedSkills: string[];
  semanticExplanation: string;
  highlightedSections: { section: string; contribution: number }[];
  scoreExplanation: string;
}

export const mockCandidates: ResumeCandidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    matchScore: 92,
    skillMatch: 88,
    missingSkillsCount: 2,
    biasFlags: [],
    experienceLevel: "Senior",
    matchedSkills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Analysis", "NLP", "Docker"],
    missingSkills: ["Kubernetes", "Spark"],
    recommendedSkills: ["MLOps", "Ray", "Airflow"],
    semanticExplanation: "This resume demonstrates strong alignment with the job description through extensive experience in machine learning engineering, including model deployment and production systems.",
    highlightedSections: [
      { section: "Work Experience - ML Engineer at TechCorp", contribution: 40 },
      { section: "Projects - NLP Pipeline for Document Classification", contribution: 30 },
      { section: "Skills - Technical Proficiencies", contribution: 20 },
      { section: "Education - M.S. Computer Science", contribution: 10 },
    ],
    scoreExplanation: "High match due to direct ML engineering experience, strong NLP background, and production deployment skills. Minor gaps in distributed computing tools.",
  },
  {
    id: "2",
    name: "James Rodriguez",
    email: "j.rodriguez@email.com",
    matchScore: 78,
    skillMatch: 72,
    missingSkillsCount: 4,
    biasFlags: ["Company brand influence detected"],
    experienceLevel: "Mid",
    matchedSkills: ["Python", "SQL", "Data Analysis", "Pandas", "Scikit-learn"],
    missingSkills: ["TensorFlow", "NLP", "Docker", "Kubernetes"],
    recommendedSkills: ["Deep Learning", "PyTorch", "MLOps"],
    semanticExplanation: "Good foundation in data science with transferable analytical skills. Lacks specific deep learning and deployment experience required for the role.",
    highlightedSections: [
      { section: "Work Experience - Data Analyst at BigCo", contribution: 35 },
      { section: "Skills - Programming & Analytics", contribution: 30 },
      { section: "Projects - Predictive Modeling Suite", contribution: 25 },
      { section: "Education - B.S. Statistics", contribution: 10 },
    ],
    scoreExplanation: "Solid analytical foundation but missing specialized ML engineering skills. The candidate shows growth potential but would need upskilling in deep learning frameworks.",
  },
  {
    id: "3",
    name: "Priya Sharma",
    email: "priya.s@email.com",
    matchScore: 85,
    skillMatch: 82,
    missingSkillsCount: 3,
    biasFlags: [],
    experienceLevel: "Senior",
    matchedSkills: ["Python", "TensorFlow", "PyTorch", "NLP", "SQL", "AWS"],
    missingSkills: ["Docker", "Kubernetes", "Spark"],
    recommendedSkills: ["MLOps", "Terraform", "CI/CD"],
    semanticExplanation: "Strong research-to-production background with emphasis on NLP and deep learning. Experience aligns well with core technical requirements.",
    highlightedSections: [
      { section: "Work Experience - Research Scientist at AI Lab", contribution: 45 },
      { section: "Publications - 3 NLP Papers", contribution: 25 },
      { section: "Skills - Deep Learning Stack", contribution: 20 },
      { section: "Education - Ph.D. AI/ML", contribution: 10 },
    ],
    scoreExplanation: "Excellent research background with practical NLP experience. Containerization and orchestration gaps are easily addressable given strong technical foundation.",
  },
  {
    id: "4",
    name: "Michael Thompson",
    email: "m.thompson@email.com",
    matchScore: 65,
    skillMatch: 58,
    missingSkillsCount: 6,
    biasFlags: ["College name influence detected", "Company brand influence detected"],
    experienceLevel: "Junior",
    matchedSkills: ["Python", "SQL", "Git"],
    missingSkills: ["TensorFlow", "NLP", "Docker", "Kubernetes", "ML", "Data Pipelines"],
    recommendedSkills: ["Machine Learning Fundamentals", "Deep Learning", "Cloud Platforms"],
    semanticExplanation: "Entry-level candidate with foundational programming skills. Significant gap in ML-specific tools and methodologies.",
    highlightedSections: [
      { section: "Education - B.S. Computer Science, MIT", contribution: 40 },
      { section: "Internship - Software Engineer at Google", contribution: 35 },
      { section: "Projects - Basic ML Classifier", contribution: 20 },
      { section: "Skills - Programming Languages", contribution: 5 },
    ],
    scoreExplanation: "While the candidate has a strong academic background, there is a significant experience gap in ML engineering. Score reflects potential but not current readiness.",
  },
  {
    id: "5",
    name: "Emily Watson",
    email: "e.watson@email.com",
    matchScore: 71,
    skillMatch: 68,
    missingSkillsCount: 4,
    biasFlags: ["Gender-coded language detected"],
    experienceLevel: "Mid",
    matchedSkills: ["Python", "Machine Learning", "SQL", "Pandas", "AWS"],
    missingSkills: ["NLP", "TensorFlow", "Docker", "Kubernetes"],
    recommendedSkills: ["Natural Language Processing", "Deep Learning", "Containerization"],
    semanticExplanation: "Solid ML practitioner with good cloud experience. Needs deeper specialization in NLP and containerized deployments.",
    highlightedSections: [
      { section: "Work Experience - ML Developer at StartupX", contribution: 40 },
      { section: "Skills - Cloud & ML Tools", contribution: 25 },
      { section: "Projects - Recommendation Engine", contribution: 25 },
      { section: "Education - M.S. Data Science", contribution: 10 },
    ],
    scoreExplanation: "Good practical ML experience with cloud deployment knowledge. The lack of NLP specialization is the primary gap for this specific role.",
  },
];

export interface SkillGapData {
  skill: string;
  current: number;
  required: number;
  priority: "High" | "Medium" | "Low";
}

export const mockSkillGapData: SkillGapData[] = [
  { skill: "Python", current: 90, required: 85, priority: "Low" },
  { skill: "Machine Learning", current: 70, required: 90, priority: "High" },
  { skill: "NLP", current: 30, required: 85, priority: "High" },
  { skill: "TensorFlow", current: 40, required: 80, priority: "High" },
  { skill: "Docker", current: 50, required: 70, priority: "Medium" },
  { skill: "SQL", current: 85, required: 75, priority: "Low" },
  { skill: "AWS", current: 60, required: 70, priority: "Medium" },
  { skill: "Kubernetes", current: 20, required: 60, priority: "Medium" },
];

export const mockRadarData = [
  { skill: "Programming", value: 85, fullMark: 100 },
  { skill: "ML/AI", value: 65, fullMark: 100 },
  { skill: "NLP", value: 35, fullMark: 100 },
  { skill: "Cloud/DevOps", value: 55, fullMark: 100 },
  { skill: "Data Engineering", value: 70, fullMark: 100 },
  { skill: "Communication", value: 80, fullMark: 100 },
];

export interface BiasMetric {
  category: string;
  originalScore: number;
  neutralScore: number;
  influence: number;
  description: string;
}

export const mockBiasMetrics: BiasMetric[] = [
  {
    category: "College Name",
    originalScore: 82,
    neutralScore: 75,
    influence: 8.5,
    description: "Prestigious university names may inflate scores by associating brand with competence.",
  },
  {
    category: "Company Brand",
    originalScore: 78,
    neutralScore: 72,
    influence: 7.7,
    description: "Well-known employer names can bias evaluation toward brand recognition over actual skills.",
  },
  {
    category: "Gender Indicators",
    originalScore: 74,
    neutralScore: 74,
    influence: 0,
    description: "Gender-neutral language analysis shows no measurable bias in scoring.",
  },
];
