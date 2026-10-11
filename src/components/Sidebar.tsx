import React from 'react';
import {
  LayoutDashboard,
  Compass,
  CheckSquare,
  FolderGit2,
  Briefcase,
  BookOpen,
  Settings,
  Target,
  Sparkles,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';

import { NavigationTab, StudentProfile } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  profile: StudentProfile | null;
  overallProgress: number;
  completedTasksCount: number;
  totalTasksCount: number;
  onOpenProfile: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'roadmap', label: 'My Roadmap', icon: Compass },
  { id: 'skills', label: 'Skills Checklist', icon: CheckSquare },
  { id: 'projects', label: 'Projects Engine', icon: FolderGit2 },
  { id: 'internships', label: 'Internships & Placements', icon: Briefcase },
  { id: 'resources', label: 'Career Resources', icon: BookOpen },
  { id: 'ask-ai', label: 'Ask AI', icon: MessageSquare, badge: 'AI' },
  { id: 'settings', label: 'Settings & AI', icon: Settings },
];


export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  overallProgress,
  completedTasksCount,
  totalTasksCount,
  onOpenProfile,
}) => {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 transition-colors flex-shrink-0">
      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Career Hub
        </div>

        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress & Target Card */}
      {profile && (
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-200">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Journey Progress</span>
            </div>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
              {Math.round(overallProgress)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-indigo-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>Tasks Done</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {completedTasksCount}/{totalTasksCount}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-indigo-200/50 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
              <Target className="w-3 h-3 text-emerald-500" />
              <span>Target: {profile.weeklyStudyHours}h/wk</span>
            </div>
            <button
              onClick={onOpenProfile}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> SkillPath AI v2.0
        </span>
        <span>MVP Complete</span>
      </div>
    </aside>
  );
};
