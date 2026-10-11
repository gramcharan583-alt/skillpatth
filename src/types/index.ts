export type AcademicYear = '1st' | '2nd' | '3rd' | '4th';

export type EngineeringBranch = 
  | 'CSE' 
  | 'IT' 
  | 'ECE' 
  | 'EEE' 
  | 'Mechanical' 
  | 'Civil' 
  | 'Other';

export type CareerGoal =
  | 'Software Development'
  | 'Artificial Intelligence and Machine Learning'
  | 'Data Science'
  | 'Embedded Systems and IoT'
  | 'VLSI and Semiconductor Design'
  | 'Core Engineering'
  | 'Government Jobs and PSU'
  | 'Higher Studies and Research'
  | 'Not Decided Yet';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export type TaskCategory = 
  | 'Foundation'
  | 'Core Engineering'
  | 'Programming & DSA'
  | 'Specialization'
  | 'Projects & Portfolio'
  | 'Internships'
  | 'Placement & Aptitude'
  | 'Competitive Exams';

export type SkillCategory =
  | 'Programming and technical fundamentals'
  | 'Branch-specific engineering skills'
  | 'Tools, platforms, and technologies'
  | 'Practical laboratory skills'
  | 'Projects and portfolio'
  | 'Communication and aptitude'
  | 'Resume and internships'
  | 'Placement and interview preparation';

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProjectStatus = 'Planned' | 'In Progress' | 'Completed';

export type ApplicationStatus = 
  | 'Interested' 
  | 'Applied' 
  | 'Assessment' 
  | 'Interview' 
  | 'Offer' 
  | 'Rejected';

export interface StudentProfile {
  id: string;
  name: string;
  academicYear: AcademicYear;
  branch: EngineeringBranch;
  careerGoal: CareerGoal;
  skillLevel: SkillLevel;
  weeklyStudyHours: number;
  targetCompany?: string;
  geminiApiKey?: string;
  createdAt: string;
  updatedAt: string;
  isOnboarded: boolean;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  academicYear: AcademicYear;
  branch: string; // 'All' or specific branch
  careerGoal: string; // 'All' or specific goal
  priority: TaskPriority;
  estimatedHours: number;
  prerequisites?: string;
  resourceUrl?: string;
  status: TaskStatus;
  completedAt?: string;
  notes?: string;
  isCustom?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  relevantBranches: (EngineeringBranch | 'All')[];
  relevantGoals: (CareerGoal | 'All')[];
  relevantYears: AcademicYear[];
  priority: TaskPriority;
  estimatedHours: number;
  resourceUrl: string;
  status: TaskStatus;
  isCustom?: boolean;
}

export interface Project {
  id: string;
  title: string;
  problemStatement: string;
  description: string;
  branch: EngineeringBranch | 'All';
  careerGoal: CareerGoal | 'All';
  recommendedYear: AcademicYear;
  difficulty: ProjectDifficulty;
  technologies: string[];
  skillsGained: string[];
  estimatedHours: number;
  implementationSteps: string[];
  expectedOutput: string;
  testingSuggestions: string[];
  resourceUrl?: string;
  githubSearchQuery?: string;
  isSaved?: boolean;
  status?: ProjectStatus;
  startDate?: string;
  completionDate?: string;
  userNotes?: string;
}

export interface InternshipApplication {
  id: string;
  organization: string;
  role: string;
  applicationDate: string;
  status: ApplicationStatus;
  nextAction: string;
  stipendOrSalary?: string;
  location?: string;
  notes?: string;
}

export interface ReadinessCheckItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
  tips: string;
  guideUrl?: string;
}

export interface Activity {
  id: string;
  type: 'task' | 'skill' | 'project' | 'application' | 'profile' | 'ai';
  description: string;
  timestamp: string;
}

export interface CareerResource {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  isOfficial: boolean;
  targetYears: AcademicYear[];
  targetGoals: (CareerGoal | 'All')[];
  badge: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'roadmap'
  | 'skills'
  | 'projects'
  | 'internships'
  | 'resources'
  | 'ask-ai'
  | 'settings';

// ─── AI Chat Types ──────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
