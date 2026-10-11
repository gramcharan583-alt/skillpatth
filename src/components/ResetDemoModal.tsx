import React from 'react';
import { X, Layers, RotateCcw, ArrowRight, UserCheck, Trash2 } from 'lucide-react';
import { DEMO_PRESETS } from '../data/demoProfiles';
import { StudentProfile } from '../types';

interface ResetDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (profile: StudentProfile) => void;
  onResetFresh: () => void;
}

export const ResetDemoModal: React.FC<ResetDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  onResetFresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hackathon Demo Presets
              </h3>
              <p className="text-xs text-slate-500">
                Switch instantly between branches, years, and career paths
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Cards List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {DEMO_PRESETS.map(preset => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset.profile);
                onClose();
              }}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {preset.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {preset.profile.branch}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {preset.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Goal: {preset.profile.careerGoal}</span>
                  <span>•</span>
                  <span>{preset.profile.weeklyStudyHours}h / week</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors flex-shrink-0 ml-3">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}

          {/* Reset Fresh Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data and start the onboarding wizard from scratch?')) {
                  onResetFresh();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All & Start Fresh Onboarding</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
