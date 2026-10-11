import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  RoadmapTask,
  Skill,
  Project,
  InternshipApplication,
  ReadinessCheckItem,
  Activity,
  NavigationTab,
  TaskStatus,
  ProjectStatus,
} from './types';
import { StorageService } from './services/storageService';



import { MobileNav } from './components/MobileNav';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { ResetDemoModal } from './components/ResetDemoModal';


import { Dashboard } from './pages/Dashboard';
import { RoadmapPage } from './pages/RoadmapPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { InternshipsPage } from './pages/InternshipsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AskAIPage } from './pages/AskAIPage';
import { SettingsPage } from './pages/SettingsPage';

import { DEMO_PRESETS } from './data/demoProfiles';

export function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [internshipChecklist, setInternshipChecklist] = useState<ReadinessCheckItem[]>([]);
  const [placementChecklist, setPlacementChecklist] = useState<ReadinessCheckItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return StorageService.getTheme() === 'dark';
  });

  // Modals state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);


  // Initialize data on mount
  useEffect(() => {
    const savedProfile = StorageService.getProfile();
    if (!savedProfile || !savedProfile.isOnboarded) {
      // By default open Onboarding
      setShowOnboarding(true);
    } else {
      setProfile(savedProfile);
      setRoadmapTasks(StorageService.getRoadmapTasks());
      setSkills(StorageService.getSkills());
      setProjects(StorageService.getProjects());
      setApplications(StorageService.getApplications());
      setInternshipChecklist(StorageService.getInternshipChecklist());
      setPlacementChecklist(StorageService.getPlacementChecklist());
      setActivities(StorageService.getActivities());
    }
  }, []);

  // Sync theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.setTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // -------------------------------------------------------------------------
  // Onboarding & Presets
  // -------------------------------------------------------------------------
  const handleCompleteOnboarding = (newProfile: StudentProfile, isPresetDemo: boolean = false) => {
    StorageService.initializeStudentData(newProfile, isPresetDemo);
    setProfile(newProfile);
    setRoadmapTasks(StorageService.getRoadmapTasks());
    setSkills(StorageService.getSkills());
    setProjects(StorageService.getProjects());
    setApplications(StorageService.getApplications());
    setInternshipChecklist(StorageService.getInternshipChecklist());
    setPlacementChecklist(StorageService.getPlacementChecklist());
    setActivities(StorageService.getActivities());
    setShowOnboarding(false);
    setActiveTab('dashboard');

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}
  };

  const handleSelectPreset = (presetProfile: StudentProfile) => {
    handleCompleteOnboarding(presetProfile, true);
  };

  const handleResetFresh = () => {
    StorageService.clearAll();
    setProfile(null);
    setRoadmapTasks([]);
    setSkills([]);
    setProjects([]);
    setApplications([]);
    setInternshipChecklist([]);
    setPlacementChecklist([]);
    setActivities([]);
    setShowOnboarding(true);
  };

  // -------------------------------------------------------------------------
  // Profile Update
  // -------------------------------------------------------------------------
  const handleSaveProfile = (updated: StudentProfile, shouldRegenerate: boolean) => {
    if (shouldRegenerate) {
      StorageService.initializeStudentData(updated, false);
      setRoadmapTasks(StorageService.getRoadmapTasks());
      setSkills(StorageService.getSkills());
      setProjects(StorageService.getProjects());
    } else {
      StorageService.saveProfile(updated);
    }
    setProfile(updated);
    setActivities(StorageService.getActivities());
  };

  // -------------------------------------------------------------------------
  // Roadmap Actions
  // -------------------------------------------------------------------------
  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updated = StorageService.updateTaskStatus(taskId, status);
    setRoadmapTasks(updated);
    setActivities(StorageService.getActivities());

    if (status === 'Completed') {
      try {
        confetti({ particleCount: 45, spread: 50, origin: { y: 0.7 } });
      } catch (_) {}
    }
  };

  const handleAddCustomTask = (task: Omit<RoadmapTask, 'id' | 'status'>) => {
    StorageService.addCustomTask(task);
    setRoadmapTasks(StorageService.getRoadmapTasks());
    setActivities(StorageService.getActivities());
  };

  const handleDeleteTask = (taskId: string) => {
    StorageService.deleteTask(taskId);
    setRoadmapTasks(StorageService.getRoadmapTasks());
    setActivities(StorageService.getActivities());
  };

  // -------------------------------------------------------------------------
  // Skills Actions
  // -------------------------------------------------------------------------
  const handleUpdateSkillStatus = (skillId: string, status: TaskStatus) => {
    const updated = StorageService.updateSkillStatus(skillId, status);
    setSkills(updated);
    setActivities(StorageService.getActivities());

    if (status === 'Completed') {
      try {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
      } catch (_) {}
    }
  };

  const handleAddCustomSkill = (skill: Omit<Skill, 'id' | 'status'>) => {
    StorageService.addCustomSkill(skill);
    setSkills(StorageService.getSkills());
    setActivities(StorageService.getActivities());
  };

  // -------------------------------------------------------------------------
  // Projects Actions
  // -------------------------------------------------------------------------
  const handleSaveProjectToMyProjects = (projectId: string, status: ProjectStatus = 'Planned') => {
    const updated = StorageService.saveProjectToMyProjects(projectId, status);
    setProjects(updated);
    setActivities(StorageService.getActivities());
  };

  const handleUpdateProject = (project: Project) => {
    const updated = StorageService.updateProject(project);
    setProjects(updated);
    setActivities(StorageService.getActivities());

    if (project.status === 'Completed') {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (_) {}
    }
  };

  const handleRemoveFromMyProjects = (projectId: string) => {
    const updated = StorageService.removeProjectFromMyProjects(projectId);
    setProjects(updated);
    setActivities(StorageService.getActivities());
  };

  const handleAddCustomProject = (project: Omit<Project, 'id' | 'isSaved'>) => {
    StorageService.addCustomProject(project);
    setProjects(StorageService.getProjects());
    setActivities(StorageService.getActivities());
  };

  // -------------------------------------------------------------------------
  // Internship Applications Actions
  // -------------------------------------------------------------------------
  const handleAddApplication = (app: Omit<InternshipApplication, 'id'>) => {
    StorageService.addApplication(app);
    setApplications(StorageService.getApplications());
    setActivities(StorageService.getActivities());
  };

  const handleUpdateApplication = (app: InternshipApplication) => {
    StorageService.updateApplication(app);
    setApplications(StorageService.getApplications());
    setActivities(StorageService.getActivities());

    if (app.status === 'Offer') {
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      } catch (_) {}
    }
  };

  const handleDeleteApplication = (id: string) => {
    StorageService.deleteApplication(id);
    setApplications(StorageService.getApplications());
    setActivities(StorageService.getActivities());
  };

  // -------------------------------------------------------------------------
  // Readiness Checklists Actions
  // -------------------------------------------------------------------------
  const handleToggleInternshipCheck = (id: string) => {
    const updated = StorageService.toggleInternshipCheckItem(id);
    setInternshipChecklist(updated);
  };

  const handleTogglePlacementCheck = (id: string) => {
    const updated = StorageService.togglePlacementCheckItem(id);
    setPlacementChecklist(updated);
  };

  // -------------------------------------------------------------------------
  // Metric Calculations
  // -------------------------------------------------------------------------
  const totalTasks = roadmapTasks.length;
  const completedTasks = roadmapTasks.filter(t => t.status === 'Completed').length;
  const roadmapPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalSkills = skills.length;
  const completedSkills = skills.filter(s => s.status === 'Completed').length;
  const skillPct = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;

  const overallProgress = totalTasks > 0 || totalSkills > 0 ? (roadmapPct + skillPct) / 2 : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenDemoPresets={() => setShowDemoModal(true)}
        onToggleMobileMenu={() => setIsMobileNavOpen(true)}
        onOpenAIQuery={() => setActiveTab('ask-ai')}
      />

      {/* Main Content Layout with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          profile={profile}
          overallProgress={overallProgress}
          completedTasksCount={completedTasks}
          totalTasksCount={totalTasks}
          onOpenProfile={() => setShowProfileModal(true)}
        />

        {/* Dynamic Page Container */}
        <main className={activeTab === 'ask-ai'
          ? 'flex-1 overflow-hidden flex flex-col'
          : 'flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl'
        }>
          {activeTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              roadmapTasks={roadmapTasks}
              skills={skills}
              projects={projects}
              activities={activities}
              onNavigate={setActiveTab}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onOpenProfile={() => setShowProfileModal(true)}
              onOpenDemoPresets={() => setShowDemoModal(true)}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapPage
              tasks={roadmapTasks}
              profile={profile}
              onUpdateStatus={handleUpdateTaskStatus}
              onAddTask={handleAddCustomTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsPage
              skills={skills}
              profile={profile}
              onUpdateStatus={handleUpdateSkillStatus}
              onAddSkill={handleAddCustomSkill}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage
              projects={projects}
              profile={profile}
              onSaveToMyProjects={handleSaveProjectToMyProjects}
              onUpdateProject={handleUpdateProject}
              onRemoveFromMyProjects={handleRemoveFromMyProjects}
              onAddCustomProject={handleAddCustomProject}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipsPage
              applications={applications}
              internshipChecklist={internshipChecklist}
              placementChecklist={placementChecklist}
              profile={profile}
              onToggleInternshipCheck={handleToggleInternshipCheck}
              onTogglePlacementCheck={handleTogglePlacementCheck}
              onAddApplication={handleAddApplication}
              onUpdateApplication={handleUpdateApplication}
              onDeleteApplication={handleDeleteApplication}
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesPage profile={profile} />
          )}

          {activeTab === 'ask-ai' && (
            <AskAIPage
              profile={profile}
              roadmapTasks={roadmapTasks.map(t => ({ title: t.title, status: t.status }))}
              skills={skills.map(s => ({ name: s.name, status: s.status }))}
              projects={projects.map(p => ({ title: p.title, status: p.status }))}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              profile={profile}
              onUpdateProfile={p => handleSaveProfile(p, false)}
              onResetAll={handleResetFresh}
              onOpenDemoPresets={() => setShowDemoModal(true)}
            />
          )}

        </main>
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={profile}
        overallProgress={overallProgress}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
      />

      {/* Profile & Degree Settings Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Demo Switcher Modal (Hackathon judging presets) */}
      <ResetDemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectPreset={handleSelectPreset}
        onResetFresh={handleResetFresh}
      />
    </div>
  );
}

export default App;
