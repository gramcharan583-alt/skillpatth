import React from 'react';
import {
  LayoutDashboard,
  Compass,
  CheckSquare,
  FolderGit2,
  Briefcase,
  BookOpen,
  Settings,
  X,
  GraduationCap,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

import { NavigationTab, StudentProfile } from '../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  profile: StudentProfile | null;
  overallProgress: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  profile,
  overallProgress,
}) => {
  if (!isOpen) return null;

  const items: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'My Roadmap', icon: Compass },
    { id: 'skills', label: 'Skills Checklist', icon: CheckSquare },
    { id: 'projects', label: 'Projects Engine', icon: FolderGit2 },
    { id: 'internships', label: 'Internships & Placements', icon: Briefcase },
    { id: 'resources', label: 'Career Resources', icon: BookOpen },
    { id: 'ask-ai', label: 'Ask AI', icon: MessageSquare },
    { id: 'settings', label: 'Settings & AI', icon: Settings },
  ];


  const handleSelect = (tab: NavigationTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl z-10 transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                SkillPath AI
              </span>
              <p className="text-[10px] text-slate-500">B.Tech Career Planner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card if present */}
        {profile && (
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              {profile.name || 'Engineering Student'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {profile.branch} • {profile.academicYear} Year
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Progress:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round(overallProgress)}%
              </span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> B.Tech Hackathon Edition
          </span>
        </div>
      </div>
    </div>
  );
};
