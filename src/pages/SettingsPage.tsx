import React, { useState } from 'react';
import {
  Settings,
  User,
  Key,
  Clock,
  Sparkles,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { StorageService } from '../services/storageService';
import { AIService, WeeklyStudyPlanData } from '../services/aiService';

interface SettingsPageProps {
  profile: StudentProfile | null;
  onUpdateProfile: (updated: StudentProfile) => void;
  onResetAll: () => void;
  onOpenDemoPresets: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  profile,
  onUpdateProfile,
  onResetAll,
  onOpenDemoPresets,
}) => {
  const [geminiKey, setGeminiKey] = useState(profile?.geminiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [studyHours, setStudyHours] = useState(profile?.weeklyStudyHours || 15);
  const [targetCompany, setTargetCompany] = useState(profile?.targetCompany || '');

  const [savingKey, setSavingKey] = useState(false);
  const [saveKeySuccess, setSaveKeySuccess] = useState(false);

  // Weekly study plan breakdown state
  const [studyPlan, setStudyPlan] = useState<WeeklyStudyPlanData | null>(null);
  const [loadingStudyPlan, setLoadingStudyPlan] = useState(false);

  // Import JSON error state
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!profile) return null;

  const handleSaveApiKey = () => {
    setSavingKey(true);
    const updated: StudentProfile = {
      ...profile,
      geminiApiKey: geminiKey.trim() || undefined,
      weeklyStudyHours: Number(studyHours) || 15,
      targetCompany: targetCompany.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProfile(updated);
    setSavingKey(false);
    setSaveKeySuccess(true);
    setTimeout(() => setSaveKeySuccess(false), 2000);
  };

  const handleGenerateStudyPlan = async () => {
    setLoadingStudyPlan(true);
    try {
      const res = await AIService.getWeeklyStudyPlan(profile);
      setStudyPlan(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudyPlan(false);
    }
  };

  const handleExportData = () => {
    const jsonStr = StorageService.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillPath_AI_Backup_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importJSON(content);
        if (success) {
          setImportStatus('Data imported successfully! Reloading...');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setImportStatus('Failed to import JSON: Invalid file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Settings & AI Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your Gemini AI integration, study pace targets, and local data persistence.
        </p>
      </div>

      {/* Section 1: AI Integration */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Google Gemini API Key
              </h3>
              <p className="text-xs text-slate-400">
                Optional LLM enhancement for personalized mentor advice and project suggestions
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              profile.geminiApiKey
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
            }`}
          >
            {profile.geminiApiKey ? 'Live Gemini Connected' : 'Using Built-in Local Engine'}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          SkillPath AI is designed with high privacy and complete zero-cost autonomy. When an API key is provided, the application calls Gemini 1.5 Flash. If no key is entered, the system seamlessly uses our deterministic Indian engineering career rule engine.
        </p>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saveKeySuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <Check className="w-4 h-4" />
              <span>Saved successfully!</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleSaveApiKey}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20"
          >
            Save AI Settings
          </button>
        </div>
      </div>

      {/* Section 2: Study Time Target & Timetable Optimizer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Study Target & Weekly Allocation
              </h3>
              <p className="text-xs text-slate-400">
                Optimize your schedule across core subjects, hands-on lab work, and aptitude
              </p>
            </div>
          </div>

          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-full">
            {studyHours} hrs / week
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="5"
            max="40"
            step="1"
            value={studyHours}
            onChange={e => setStudyHours(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>5 hrs / wk</span>
            <span>15 hrs (Recommended)</span>
            <span>40 hrs / wk</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateStudyPlan}
          className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>{loadingStudyPlan ? 'Generating Schedule...' : 'Generate Weekly Study Breakdown'}</span>
        </button>

        {studyPlan && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {studyPlan.allocations.map((alloc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {alloc.domain}
                    </span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {alloc.hours}h
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {alloc.description}
                  </p>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-1">
                    {alloc.activities.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200">
              <strong>Weekend Strategy:</strong> {studyPlan.weekendStrategy}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Data Management & Backup */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Data Management & Backup
            </h3>
            <p className="text-xs text-slate-400">
              Export your roadmap, skills, and project plans as JSON or restore from a backup
            </p>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs rounded-xl">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Import Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Section 4: Danger Zone */}
      <div className="p-6 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
                Hackathon Demo Reset Zone
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-400">
                Quickly clear or switch student profiles for live judging presentations
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenDemoPresets}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-rose-50"
          >
            <span>Switch Student Preset</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all data and start onboarding fresh?')) {
                onResetAll();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Local Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
