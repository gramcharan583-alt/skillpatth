import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  GraduationCap,
  Sparkles,
  Key,
  Clock,
  Target,
  RefreshCw,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  StudentProfile,
  AcademicYear,
  EngineeringBranch,
  CareerGoal,
  SkillLevel,
} from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile | null;
  onSave: (updated: StudentProfile, shouldRegenerateRoadmap: boolean) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState<AcademicYear>('2nd');
  const [branch, setBranch] = useState<EngineeringBranch>('ECE');
  const [careerGoal, setCareerGoal] = useState<CareerGoal>('Embedded Systems and IoT');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(15);
  const [targetCompany, setTargetCompany] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [shouldRegenerate, setShouldRegenerate] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAcademicYear(profile.academicYear || '2nd');
      setBranch(profile.branch || 'ECE');
      setCareerGoal(profile.careerGoal || 'Embedded Systems and IoT');
      setSkillLevel(profile.skillLevel || 'Intermediate');
      setWeeklyStudyHours(profile.weeklyStudyHours || 15);
      setTargetCompany(profile.targetCompany || '');
      setGeminiApiKey(profile.geminiApiKey || '');
      setShouldRegenerate(false);
      setSavedSuccess(false);
    }
  }, [profile, isOpen]);

  if (!isOpen || !profile) return null;

  const branches: EngineeringBranch[] = [
    'ECE',
    'CSE',
    'IT',
    'EEE',
    'Mechanical',
    'Civil',
    'Other',
  ];

  const careerGoals: CareerGoal[] = [
    'Embedded Systems and IoT',
    'VLSI and Semiconductor Design',
    'Software Development',
    'Artificial Intelligence and Machine Learning',
    'Data Science',
    'Core Engineering',
    'Government Jobs and PSU',
    'Higher Studies and Research',
    'Not Decided Yet',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...profile,
      name: name.trim() || 'Engineering Student',
      academicYear,
      branch,
      careerGoal,
      skillLevel,
      weeklyStudyHours: Number(weeklyStudyHours) || 15,
      targetCompany: targetCompany.trim() || undefined,
      geminiApiKey: geminiApiKey.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated, shouldRegenerate);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Student Profile & Preferences
              </h3>
              <p className="text-xs text-slate-500">Edit degree details and AI settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={e => {
                  setAcademicYear(e.target.value as AcademicYear);
                  setShouldRegenerate(true);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="1st">1st Year (Foundation)</option>
                <option value="2nd">2nd Year (Skill Dev)</option>
                <option value="3rd">3rd Year (Industry Prep)</option>
                <option value="4th">4th Year (Placement & Capstone)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Engineering Branch
              </label>
              <select
                value={branch}
                onChange={e => {
                  setBranch(e.target.value as EngineeringBranch);
                  setShouldRegenerate(true);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                {branches.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Primary Career Goal
            </label>
            <select
              value={careerGoal}
              onChange={e => {
                setCareerGoal(e.target.value as CareerGoal);
                setShouldRegenerate(true);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              {careerGoals.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Skill Level
              </label>
              <select
                value={skillLevel}
                onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Study Hours / Wk ({weeklyStudyHours}h)
              </label>
              <input
                type="range"
                min="5"
                max="40"
                value={weeklyStudyHours}
                onChange={e => setWeeklyStudyHours(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Dream Target Organization
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={e => setTargetCompany(e.target.value)}
              placeholder="e.g. Texas Instruments, Qualcomm, Microsoft, ISRO"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          {/* Gemini API Key Section */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-950 dark:text-purple-200">
              <Key className="w-4 h-4 text-purple-600" />
              <span>Optional: Google Gemini API Key</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Unlock real-time live LLM advice. If left empty, SkillPath AI uses its built-in expert deterministic mentor engine with 100% offline reliability.
            </p>
            <input
              type="password"
              value={geminiApiKey}
              onChange={e => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
            />
          </div>

          {/* Re-sync Roadmap Checkbox */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="regen-check"
              checked={shouldRegenerate}
              onChange={e => setShouldRegenerate(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="regen-check" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <strong className="block text-slate-900 dark:text-white">Re-sync roadmap with new branch/goal selections</strong>
              <span>Updates recommended tasks, skills, and projects to match your new academic year & branch.</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
