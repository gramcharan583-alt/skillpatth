import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckSquare,
  FolderGit2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Layers,
  ChevronRight,
  Target,
  ExternalLink,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  StudentProfile,
  RoadmapTask,
  Skill,
  Project,
  Activity,
  NavigationTab,
} from '../types';
import { AIService, RoadmapAdviceData } from '../services/aiService';

interface DashboardProps {
  profile: StudentProfile | null;
  roadmapTasks: RoadmapTask[];
  skills: Skill[];
  projects: Project[];
  activities: Activity[];
  onNavigate: (tab: NavigationTab) => void;
  onUpdateTaskStatus: (taskId: string, status: RoadmapTask['status']) => void;
  onOpenProfile: () => void;
  onOpenDemoPresets: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  roadmapTasks,
  skills,
  projects,
  activities,
  onNavigate,
  onUpdateTaskStatus,
  onOpenProfile,
  onOpenDemoPresets,
}) => {
  const [advice, setAdvice] = useState<RoadmapAdviceData | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    if (profile) {
      setLoadingAdvice(true);
      AIService.getRoadmapAdvice(profile)
        .then(res => {
          setAdvice(res.data);
        })
        .finally(() => {
          setLoadingAdvice(false);
        });
    }
  }, [profile?.academicYear, profile?.branch, profile?.careerGoal]);

  if (!profile) return null;

  // -------------------------------------------------------------------------
  // Metrics Calculations (Defensive against NaN/division by zero)
  // -------------------------------------------------------------------------
  const totalTasks = roadmapTasks.length;
  const completedTasks = roadmapTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = roadmapTasks.filter(t => t.status === 'In Progress').length;
  const roadmapPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalSkills = skills.length;
  const completedSkills = skills.filter(s => s.status === 'Completed').length;
  const skillPct = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;

  const savedProjects = projects.filter(p => p.isSaved);
  const totalSavedProjects = savedProjects.length;
  const completedSavedProjects = savedProjects.filter(p => p.status === 'Completed').length;
  const inProgressSavedProjects = savedProjects.filter(p => p.status === 'In Progress').length;
  const plannedSavedProjects = savedProjects.filter(p => p.status === 'Planned').length;
  const projectPct = totalSavedProjects > 0 ? (completedSavedProjects / totalSavedProjects) * 100 : 0;

  // Overall completion defined as average of roadmap completion and skill completion
  const overallPct = Math.round(
    totalTasks > 0 || totalSkills > 0
      ? (roadmapPct + skillPct) / 2
      : 0
  );

  // High priority upcoming tasks (not completed)
  const highPriorityTasks = roadmapTasks
    .filter(t => t.status !== 'Completed' && (t.priority === 'High' || t.status === 'In Progress'))
    .slice(0, 4);

  // Skill completion by category data for chart
  const categories = Array.from(new Set(skills.map(s => s.category)));
  const categoryChartData = categories.slice(0, 5).map(cat => {
    const catSkills = skills.filter(s => s.category === cat);
    const catCompleted = catSkills.filter(s => s.status === 'Completed').length;
    return {
      name: cat.split(' ')[0], // short name
      fullName: cat,
      completed: catCompleted,
      total: catSkills.length,
      pct: catSkills.length > 0 ? Math.round((catCompleted / catSkills.length) * 100) : 0,
    };
  });

  // Project donut chart data
  const projectPieData = [
    { name: 'Completed', value: completedSavedProjects, color: '#10B981' },
    { name: 'In Progress', value: inProgressSavedProjects, color: '#6366F1' },
    { name: 'Planned', value: plannedSavedProjects, color: '#94A3B8' },
  ].filter(d => d.value > 0);

  // Dynamic next recommended actions based on current progress
  const nextActions = [
    {
      title: highPriorityTasks[0] ? `Advance: "${highPriorityTasks[0].title}"` : 'Explore Your Year Roadmap',
      desc: highPriorityTasks[0] ? highPriorityTasks[0].description : 'Review upcoming milestones for your branch.',
      actionTab: 'roadmap' as NavigationTab,
      badge: 'High Impact',
    },
    {
      title: completedSkills < 5 ? 'Verify Core Technical Skills' : 'Deepen Domain Specialization',
      desc: 'Check off foundational programming, circuits, and tools in your skill checklist.',
      actionTab: 'skills' as NavigationTab,
      badge: 'Skills',
    },
    {
      title: totalSavedProjects === 0 ? 'Select a Practical Project' : 'Document Your Current Project',
      desc: totalSavedProjects === 0
        ? `Pick a ${profile.academicYear} Year ${profile.branch} project to add to your portfolio.`
        : 'Ensure your hardware schematics or GitHub repository are up-to-date.',
      actionTab: 'projects' as NavigationTab,
      badge: 'Portfolio',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-indigo-100 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>{profile.academicYear} Year {profile.branch} Engineer</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200">
                🎯 {profile.careerGoal}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {profile.name || 'Engineer'}! 👋
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Here is your active engineering roadmap. You have completed{' '}
              <strong className="text-white font-bold">{completedTasks}</strong> of{' '}
              <strong className="text-white font-bold">{totalTasks}</strong> roadmap tasks and{' '}
              <strong className="text-white font-bold">{completedSkills}</strong> recommended skills.
            </p>
          </div>

          {/* Quick Stat Pill in Hero */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex-shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {overallPct}%
              </div>
              <div className="text-[10px] text-indigo-200 uppercase font-semibold">
                Overall Progress
              </div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {profile.weeklyStudyHours}h
              </div>
              <div className="text-[10px] text-indigo-200 uppercase font-semibold">
                Weekly Target
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Roadmap Completion */}
        <div 
          onClick={() => onNavigate('roadmap')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Roadmap Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-400">/ {totalTasks} tasks</span>
            <span className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(roadmapPct)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, roadmapPct))}%` }}
            />
          </div>
          <div className="mt-3 flex items-center text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
            <span>View roadmap milestones</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Card 2: Skills Checklist */}
        <div 
          onClick={() => onNavigate('skills')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Skills Verified
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {completedSkills}
            </span>
            <span className="text-xs text-slate-400">/ {totalSkills} skills</span>
            <span className="ml-auto text-xs font-bold text-blue-600 dark:text-blue-400">
              {Math.round(skillPct)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, skillPct))}%` }}
            />
          </div>
          <div className="mt-3 flex items-center text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
            <span>Open skills checklist</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Card 3: Hands-On Projects */}
        <div 
          onClick={() => onNavigate('projects')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              My Projects
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {completedSavedProjects}
            </span>
            <span className="text-xs text-slate-400">/ {totalSavedProjects} active</span>
            <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {inProgressSavedProjects} in progress
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, projectPct))}%` }}
            />
          </div>
          <div className="mt-3 flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
            <span>Discover branch projects</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Card 4: Study Target & Metric Explanation */}
        <div 
          onClick={onOpenProfile}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Pace
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {profile.weeklyStudyHours}h
            </span>
            <span className="text-xs text-slate-400">target per week</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            Overall progress is computed as the balanced average of roadmap milestones & verified skills.
          </p>
          <div className="mt-3 flex items-center text-[11px] font-semibold text-purple-600 dark:text-purple-400 group-hover:underline">
            <span>Adjust study target</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>

      {/* AI Roadmap Strategic Advice Banner */}
      {advice && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Personalized Career Advisor ({profile.academicYear} Year {profile.branch})
              </h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold">
              AI Insight
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {advice.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                🎯 Core Priorities
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                {advice.keyPriorities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                ⏳ Weekly Focus Strategy
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {advice.recommendedWeeklyFocus}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                💡 Placement Edge
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {advice.careerInsight}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Priority Tasks + 3 Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: High Priority Upcoming Tasks (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                High-Priority Upcoming Tasks
              </h2>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {highPriorityTasks.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Award className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                All High-Priority Tasks Completed!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Incredible work! Explore subsequent academic year roadmap milestones or start a new capstone project.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {highPriorityTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                        {task.priority} Priority
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {task.academicYear} Year • {task.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {task.description}
                    </p>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {task.status !== 'In Progress' && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'In Progress')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                      >
                        Start
                      </button>
                    )}
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skill Breakdown Chart */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Skill Domain Preparedness
              </h3>
              <span className="text-xs text-slate-400">
                {completedSkills} of {totalSkills} verified
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickFormatter={v => `${v}%`} tickLine={false} />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val}% completed (${item.payload.completed}/${item.payload.total})`,
                      item.payload.fullName,
                    ]}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="pct" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Recommended Next Actions + Activity Feed */}
        <div className="space-y-6">
          {/* 3 Recommended Actions */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recommended Next Actions
              </h3>
            </div>

            <div className="space-y-3">
              {nextActions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate(item.actionTab)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 rounded-full">
                      {item.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <span className="text-[11px] text-slate-400">Live feed</span>
            </div>

            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No recent actions recorded yet. Start by checking off a task or skill!
              </p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {activities.slice(0, 6).map(act => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
