import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  User, 
  Layers, 
  Clock, 
  GraduationCap,
  Cpu,
  MessageSquare
} from 'lucide-react';
import { StudentProfile, NavigationTab } from '../types';

interface NavbarProps {
  profile: StudentProfile | null;
  activeTab: NavigationTab;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenProfile: () => void;
  onOpenDemoPresets: () => void;
  onToggleMobileMenu: () => void;
  onOpenAIQuery: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  isDark,
  onToggleTheme,
  onOpenProfile,
  onOpenDemoPresets,
  onToggleMobileMenu,
  onOpenAIQuery,
}) => {
  const hasGeminiKey = Boolean(profile?.geminiApiKey?.trim());

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                    SkillPath AI
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 rounded uppercase tracking-wider">
                    B.Tech
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                  Your Engineering Journey. One Clear Roadmap.
                </p>
              </div>
            </div>
          </div>

          {/* Center Info Pills (Desktop) */}
          {profile && (
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{profile.academicYear} Year B.Tech</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300">
                <Cpu className="w-3.5 h-3.5" />
                <span>{profile.branch}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 max-w-[200px] truncate">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{profile.weeklyStudyHours} hrs/week</span>
              </div>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* AI Advisor Badge */}
            <div 
              title={hasGeminiKey ? 'Gemini 1.5 Flash Connected' : 'Running Built-in Deterministic AI Mentor Engine'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50"
             onClick={onOpenAIQuery}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
              <span className="hidden md:inline">
                {hasGeminiKey ? 'Gemini AI Active' : 'SkillPath AI Engine'}
              </span>
            </div>

            {/* Demo Presets Switcher (Essential for Hackathon Judges!) */}
            <button
              onClick={onOpenDemoPresets}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              title="Switch demo student profiles for presentation"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Demo Presets</span>
            </button>
            <button
              onClick={onOpenAIQuery}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              title="Ask AI a question"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Profile Avatar / Edit */}
            {profile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Edit profile & preferences"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {profile.name ? profile.name.charAt(0) : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
                  {profile.name || 'Student'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
