import {
  StudentProfile,
  RoadmapTask,
  Skill,
  Project,
  ProjectStatus,
  InternshipApplication,
  ReadinessCheckItem,
  Activity,
  EngineeringBranch,
  CareerGoal,
  AcademicYear,
} from '../types';

import { DEFAULT_ROADMAP_TASKS } from '../data/defaultRoadmap';
import { DEFAULT_SKILLS } from '../data/defaultSkills';
import { DEFAULT_PROJECTS } from '../data/defaultProjects';
import {
  DEFAULT_INTERNSHIP_CHECKLIST,
  DEFAULT_PLACEMENT_CHECKLIST,
} from '../data/readinessChecklists';

const KEYS = {
  PROFILE: 'skillpath_student_profile_v2',
  ROADMAP: 'skillpath_roadmap_tasks_v2',
  SKILLS: 'skillpath_skills_v2',
  PROJECTS: 'skillpath_projects_v2',
  APPLICATIONS: 'skillpath_applications_v2',
  INTERNSHIP_CHECK: 'skillpath_internship_check_v2',
  PLACEMENT_CHECK: 'skillpath_placement_check_v2',
  ACTIVITIES: 'skillpath_activities_v2',
  THEME: 'skillpath_theme_v2',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving localStorage key "${key}":`, err);
  }
}

export class StorageService {
  // ---------------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------------
  static getProfile(): StudentProfile | null {
    return safeGet<StudentProfile | null>(KEYS.PROFILE, null);
  }

  static saveProfile(profile: StudentProfile): void {
    safeSet(KEYS.PROFILE, {
      ...profile,
      updatedAt: new Date().toISOString(),
    });
    this.addActivity('profile', `Updated profile (${profile.branch}, ${profile.academicYear} Year)`);
  }

  // ---------------------------------------------------------------------------
  // Roadmap Tasks
  // ---------------------------------------------------------------------------
  static getRoadmapTasks(): RoadmapTask[] {
    return safeGet<RoadmapTask[]>(KEYS.ROADMAP, []);
  }

  static saveRoadmapTasks(tasks: RoadmapTask[]): void {
    safeSet(KEYS.ROADMAP, tasks);
  }

  static updateTaskStatus(taskId: string, status: RoadmapTask['status']): RoadmapTask[] {
    const tasks = this.getRoadmapTasks();
    const target = tasks.find(t => t.id === taskId);
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          completedAt: status === 'Completed' ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    this.saveRoadmapTasks(updated);

    if (target) {
      this.addActivity('task', `Task "${target.title}" set to ${status}`);
    }
    return updated;
  }

  static addCustomTask(task: Omit<RoadmapTask, 'id' | 'status'>): RoadmapTask {
    const tasks = this.getRoadmapTasks();
    const newTask: RoadmapTask = {
      ...task,
      id: `custom-task-${Date.now()}`,
      status: 'Not Started',
      isCustom: true,
    };
    const updated = [newTask, ...tasks];
    this.saveRoadmapTasks(updated);
    this.addActivity('task', `Added custom task "${task.title}"`);
    return newTask;
  }

  static deleteTask(taskId: string): void {
    const tasks = this.getRoadmapTasks();
    const target = tasks.find(t => t.id === taskId);
    const filtered = tasks.filter(t => t.id !== taskId);
    this.saveRoadmapTasks(filtered);
    if (target) {
      this.addActivity('task', `Removed task "${target.title}"`);
    }
  }

  // ---------------------------------------------------------------------------
  // Skills
  // ---------------------------------------------------------------------------
  static getSkills(): Skill[] {
    return safeGet<Skill[]>(KEYS.SKILLS, []);
  }

  static saveSkills(skills: Skill[]): void {
    safeSet(KEYS.SKILLS, skills);
  }

  static updateSkillStatus(skillId: string, status: Skill['status']): Skill[] {
    const skills = this.getSkills();
    const target = skills.find(s => s.id === skillId);
    const updated = skills.map(s => {
      if (s.id === skillId) {
        return { ...s, status };
      }
      return s;
    });
    this.saveSkills(updated);

    if (target) {
      this.addActivity('skill', `Skill "${target.name}" marked as ${status}`);
    }
    return updated;
  }

  static addCustomSkill(skill: Omit<Skill, 'id' | 'status'>): Skill {
    const skills = this.getSkills();
    const newSkill: Skill = {
      ...skill,
      id: `custom-skill-${Date.now()}`,
      status: 'Not Started',
      isCustom: true,
    };
    const updated = [newSkill, ...skills];
    this.saveSkills(updated);
    this.addActivity('skill', `Added custom skill "${skill.name}"`);
    return newSkill;
  }

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------
  static getProjects(): Project[] {
    return safeGet<Project[]>(KEYS.PROJECTS, []);
  }

  static saveProjects(projects: Project[]): void {
    safeSet(KEYS.PROJECTS, projects);
  }

  static saveProjectToMyProjects(
    projectId: string,
    status: Project['status'] = 'Planned'
  ): Project[] {
    const projects = this.getProjects();
    const target = projects.find(p => p.id === projectId);
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          isSaved: true,
          status,
          startDate: p.startDate || new Date().toISOString().split('T')[0],
        };
      }
      return p;
    });
    this.saveProjects(updated);

    if (target) {
      this.addActivity('project', `Added project "${target.title}" to My Projects (${status})`);
    }
    return updated;
  }

  static updateProject(project: Project): Project[] {
    const projects = this.getProjects();
    const updated = projects.map(p => (p.id === project.id ? project : p));
    this.saveProjects(updated);
    this.addActivity('project', `Updated project "${project.title}" (${project.status || 'Planned'})`);
    return updated;
  }

  static removeProjectFromMyProjects(projectId: string): Project[] {
    const projects = this.getProjects();
    const target = projects.find(p => p.id === projectId);
    const updated: Project[] = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          isSaved: false,
          status: 'Planned' as ProjectStatus,
          startDate: undefined,
          completionDate: undefined,
          userNotes: undefined,
        };
      }
      return p;
    });
    this.saveProjects(updated);

    if (target) {
      this.addActivity('project', `Removed project "${target.title}" from My Projects`);
    }
    return updated;
  }

  static addCustomProject(project: Omit<Project, 'id' | 'isSaved'>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: `custom-proj-${Date.now()}`,
      isSaved: true,
      status: project.status || 'Planned',
      startDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newProject, ...projects];
    this.saveProjects(updated);
    this.addActivity('project', `Created custom project "${project.title}"`);
    return newProject;
  }

  // ---------------------------------------------------------------------------
  // Internship Applications
  // ---------------------------------------------------------------------------
  static getApplications(): InternshipApplication[] {
    return safeGet<InternshipApplication[]>(KEYS.APPLICATIONS, []);
  }

  static saveApplications(apps: InternshipApplication[]): void {
    safeSet(KEYS.APPLICATIONS, apps);
  }

  static addApplication(app: Omit<InternshipApplication, 'id'>): InternshipApplication {
    const apps = this.getApplications();
    const newApp: InternshipApplication = {
      ...app,
      id: `app-${Date.now()}`,
    };
    const updated = [newApp, ...apps];
    this.saveApplications(updated);
    this.addActivity('application', `Applied to ${app.organization} for ${app.role}`);
    return newApp;
  }

  static updateApplication(app: InternshipApplication): void {
    const apps = this.getApplications();
    const updated = apps.map(a => (a.id === app.id ? app : a));
    this.saveApplications(updated);
    this.addActivity('application', `Updated application for ${app.organization} (${app.status})`);
  }

  static deleteApplication(id: string): void {
    const apps = this.getApplications();
    const target = apps.find(a => a.id === id);
    const filtered = apps.filter(a => a.id !== id);
    this.saveApplications(filtered);
    if (target) {
      this.addActivity('application', `Deleted application for ${target.organization}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Readiness Checklists
  // ---------------------------------------------------------------------------
  static getInternshipChecklist(): ReadinessCheckItem[] {
    return safeGet<ReadinessCheckItem[]>(KEYS.INTERNSHIP_CHECK, DEFAULT_INTERNSHIP_CHECKLIST);
  }

  static saveInternshipChecklist(items: ReadinessCheckItem[]): void {
    safeSet(KEYS.INTERNSHIP_CHECK, items);
  }

  static toggleInternshipCheckItem(id: string): ReadinessCheckItem[] {
    const items = this.getInternshipChecklist();
    const updated = items.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    this.saveInternshipChecklist(updated);
    return updated;
  }

  static getPlacementChecklist(): ReadinessCheckItem[] {
    return safeGet<ReadinessCheckItem[]>(KEYS.PLACEMENT_CHECK, DEFAULT_PLACEMENT_CHECKLIST);
  }

  static savePlacementChecklist(items: ReadinessCheckItem[]): void {
    safeSet(KEYS.PLACEMENT_CHECK, items);
  }

  static togglePlacementCheckItem(id: string): ReadinessCheckItem[] {
    const items = this.getPlacementChecklist();
    const updated = items.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    this.savePlacementChecklist(updated);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // Activities
  // ---------------------------------------------------------------------------
  static getActivities(): Activity[] {
    return safeGet<Activity[]>(KEYS.ACTIVITIES, []);
  }

  static addActivity(type: Activity['type'], description: string): void {
    const activities = this.getActivities();
    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      description,
      timestamp: new Date().toISOString(),
    };
    // Keep last 30 activities
    const updated = [newActivity, ...activities].slice(0, 30);
    safeSet(KEYS.ACTIVITIES, updated);
  }

  // ---------------------------------------------------------------------------
  // Personalization Engine & Seeding
  // ---------------------------------------------------------------------------
  static initializeStudentData(profile: StudentProfile, isPresetDemo: boolean = false): void {
    this.saveProfile(profile);

    // Filter roadmap tasks relevant to student's branch and career goal
    const filteredRoadmap = DEFAULT_ROADMAP_TASKS.filter(task => {
      const branchMatch = task.branch === 'All' || task.branch === profile.branch;
      const goalMatch = task.careerGoal === 'All' || task.careerGoal === profile.careerGoal;
      return branchMatch && goalMatch;
    }).map(task => {
      // If preset demo, mark tasks from previous years as completed, current year some in-progress
      if (isPresetDemo) {
        const yearOrder: Record<AcademicYear, number> = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4 };
        const taskYearNum = yearOrder[task.academicYear];
        const studentYearNum = yearOrder[profile.academicYear];

        if (taskYearNum < studentYearNum) {
          return { ...task, status: 'Completed' as const, completedAt: new Date().toISOString() };
        } else if (taskYearNum === studentYearNum && task.priority === 'High') {
          return { ...task, status: 'In Progress' as const };
        }
      }
      return { ...task, status: 'Not Started' as const };
    });

    this.saveRoadmapTasks(filteredRoadmap);

    // Filter skills relevant to branch and career goal
    const filteredSkills = DEFAULT_SKILLS.filter(skill => {
      const branchMatch =
        skill.relevantBranches.includes('All') ||
        skill.relevantBranches.includes(profile.branch);
      const goalMatch =
        skill.relevantGoals.includes('All') ||
        skill.relevantGoals.includes(profile.careerGoal);
      return branchMatch && goalMatch;
    }).map(skill => {
      if (isPresetDemo) {
        const yearOrder: Record<AcademicYear, number> = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4 };
        const skillMinYear = Math.min(...skill.relevantYears.map(y => yearOrder[y]));
        const studentYearNum = yearOrder[profile.academicYear];

        if (skillMinYear < studentYearNum) {
          return { ...skill, status: 'Completed' as const };
        } else if (skillMinYear === studentYearNum && skill.priority === 'High') {
          return { ...skill, status: 'In Progress' as const };
        }
      }
      return { ...skill, status: 'Not Started' as const };
    });

    this.saveSkills(filteredSkills);

    // Seed projects catalog with saved status for demo
    const filteredProjects: Project[] = DEFAULT_PROJECTS.map(proj => {
      const isRelevant =
        (proj.branch === 'All' || proj.branch === profile.branch) &&
        (proj.careerGoal === 'All' || proj.careerGoal === profile.careerGoal);

      if (isPresetDemo && isRelevant && proj.recommendedYear === profile.academicYear) {
        return {
          ...proj,
          isSaved: true,
          status: 'In Progress' as ProjectStatus,
          startDate: new Date().toISOString().split('T')[0],
        };
      }
      return {
        ...proj,
        isSaved: false,
        status: 'Planned' as ProjectStatus,
      };
    });

    this.saveProjects(filteredProjects);

    // Reset readiness checklists with realistic starter state for demo
    const internCheck = DEFAULT_INTERNSHIP_CHECKLIST.map((item, idx) => ({
      ...item,
      isCompleted: isPresetDemo && idx < 3,
    }));
    this.saveInternshipChecklist(internCheck);

    const placeCheck = DEFAULT_PLACEMENT_CHECKLIST.map((item, idx) => ({
      ...item,
      isCompleted: isPresetDemo && idx < 2,
    }));
    this.savePlacementChecklist(placeCheck);

    // Seed sample application if demo
    if (isPresetDemo) {
      const sampleApps: InternshipApplication[] = [
        {
          id: 'app-sample-1',
          organization: profile.branch === 'ECE' ? 'Texas Instruments' : 'Microsoft IDC',
          role: profile.branch === 'ECE' ? 'Embedded Firmware Intern' : 'Software Engineering Intern',
          applicationDate: new Date().toISOString().split('T')[0],
          status: 'Assessment',
          nextAction: 'Online coding round scheduled on Sunday',
          stipendOrSalary: '₹45,000 / month',
          location: 'Bengaluru / Hyderabad',
          notes: 'Prepare core hardware protocols & C pointer operations.',
        },
        {
          id: 'app-sample-2',
          organization: profile.branch === 'ECE' ? 'Bosch Mobility' : 'Swiggy',
          role: profile.branch === 'ECE' ? 'IoT Systems Intern' : 'Backend Engineer Intern',
          applicationDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
          status: 'Applied',
          nextAction: 'Follow up with recruiter on LinkedIn',
          stipendOrSalary: '₹30,000 / month',
          location: 'Pune / Remote',
          notes: 'Referral requested through senior alumni.',
        },
      ];
      this.saveApplications(sampleApps);
    } else {
      this.saveApplications([]);
    }

    this.addActivity('profile', `Initialized career path for ${profile.name || 'Student'} (${profile.branch})`);
  }

  // ---------------------------------------------------------------------------
  // Theme
  // ---------------------------------------------------------------------------
  static getTheme(): 'light' | 'dark' {
    return safeGet<'light' | 'dark'>(KEYS.THEME, 'light');
  }

  static setTheme(theme: 'light' | 'dark'): void {
    safeSet(KEYS.THEME, theme);
  }

  // ---------------------------------------------------------------------------
  // Reset & Backup Export/Import
  // ---------------------------------------------------------------------------
  static clearAll(): void {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }

  static exportJSON(): string {
    const data = {
      profile: this.getProfile(),
      roadmapTasks: this.getRoadmapTasks(),
      skills: this.getSkills(),
      projects: this.getProjects(),
      applications: this.getApplications(),
      internshipChecklist: this.getInternshipChecklist(),
      placementChecklist: this.getPlacementChecklist(),
      activities: this.getActivities(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) safeSet(KEYS.PROFILE, data.profile);
      if (data.roadmapTasks) safeSet(KEYS.ROADMAP, data.roadmapTasks);
      if (data.skills) safeSet(KEYS.SKILLS, data.skills);
      if (data.projects) safeSet(KEYS.PROJECTS, data.projects);
      if (data.applications) safeSet(KEYS.APPLICATIONS, data.applications);
      if (data.internshipChecklist) safeSet(KEYS.INTERNSHIP_CHECK, data.internshipChecklist);
      if (data.placementChecklist) safeSet(KEYS.PLACEMENT_CHECK, data.placementChecklist);
      if (data.activities) safeSet(KEYS.ACTIVITIES, data.activities);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}
