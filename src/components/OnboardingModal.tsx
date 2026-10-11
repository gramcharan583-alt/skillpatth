import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  StudentProfile,
  AcademicYear,
  EngineeringBranch,
  CareerGoal,
  SkillLevel,
} from '../types';
import { DEMO_PRESETS } from '../data/demoProfiles';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: StudentProfile, isPresetDemo?: boolean) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState<AcademicYear>('2nd');
  const [branch, setBranch] = useState<EngineeringBranch>('ECE');
  const [careerGoal, setCareerGoal] = useState<CareerGoal>('Embedded Systems and IoT');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [weeklyStudyHours, setWeeklyStudyHours] = useState<number>(15);
  const [targetCompany, setTargetCompany] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const branches: EngineeringBranch[] = [
    'ECE',
    'CSE',
    'IT',
    'EEE',
    'Mechanical',
    'Civil',
    'Other',
  ];

  const careerGoals: { goal: CareerGoal; desc: string; icon: string }[] = [
    {
      goal: 'Embedded Systems and IoT',
      desc: 'Firmware, microcontrollers, RTOS, sensors & hardware protocols',
      icon: '⚡',
    },
    {
      goal: 'VLSI and Semiconductor Design',
      desc: 'Digital circuits, Verilog HDL, RTL synthesis & FPGA/ASIC flows',
      icon: '🔬',
    },
    {
      goal: 'Software Development',
      desc: 'Full-stack engineering, algorithms (DSA), systems & cloud',
      icon: '💻',
    },
    {
      goal: 'Artificial Intelligence and Machine Learning',
      desc: 'Deep learning, computer vision, NLP, Python & neural networks',
      icon: '🤖',
    },
    {
      goal: 'Data Science',
      desc: 'Data analysis, statistics, predictive modeling & SQL',
      icon: '📊',
    },
    {
      goal: 'Core Engineering',
      desc: 'CAD, robotics, power systems, structural design & industry',
      icon: '⚙️',
    },
    {
      goal: 'Government Jobs and PSU',
      desc: 'GATE preparation, PSU recruitment (BHEL, IOCL, ISRO, DRDO)',
      icon: '🏛️',
    },
    {
      goal: 'Higher Studies and Research',
      desc: 'M.Tech / MS abroad, research publications & thesis prep',
      icon: '🎓',
    },
    {
      goal: 'Not Decided Yet',
      desc: 'Explore engineering branches, foundational projects & options',
      icon: '🧭',
    },
  ];

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!academicYear) {
        setErrorMsg('Please select your current academic year.');
        return;
      }
      if (!branch) {
        setErrorMsg('Please select your engineering branch.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!careerGoal) {
        setErrorMsg('Please select a target career goal.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    const profile: StudentProfile = {
      id: `student-${Date.now()}`,
      name: name.trim() || 'Engineering Student',
      academicYear,
      branch,
      careerGoal,
      skillLevel,
      weeklyStudyHours: Number(weeklyStudyHours) || 15,
      targetCompany: targetCompany.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnboarded: true,
    };
    onComplete(profile, false);
  };

  const handleLoadDemo = (presetId: string) => {
    const preset = DEMO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onComplete(preset.profile, true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 p-6 sm:p-8 text-white relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Personalized Onboarding</span>
            </div>
            <div className="text-xs font-medium bg-black/20 px-2.5 py-1 rounded-full">
              Step {step} of 3
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to SkillPath AI
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-lg">
            Your Engineering Journey. One Clear Roadmap. Let's tailor your B.Tech skills, projects, and placement path.
          </p>

          {/* Quick Demo Shortcuts for Hackathon Judges */}
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-indigo-200">
              ⚡ Quick Hackathon Presets:
            </span>
            <button
              type="button"
              onClick={() => handleLoadDemo('ece-embedded-y2')}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold rounded-lg transition-colors border border-white/30"
            >
              Aarav (ECE 2nd Yr)
            </button>
            <button
              type="button"
              onClick={() => handleLoadDemo('cse-sde-y3')}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold rounded-lg transition-colors border border-white/30"
            >
              Priya (CSE 3rd Yr)
            </button>
            <button
              type="button"
              onClick={() => handleLoadDemo('ece-vlsi-y4')}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold rounded-lg transition-colors border border-white/30"
            >
              Rohan (ECE 4th Yr VLSI)
            </button>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Academic Year & Branch */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Student Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Current B.Tech Academic Year <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['1st', '2nd', '3rd', '4th'] as AcademicYear[]).map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setAcademicYear(yr)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        academicYear === yr
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-base font-extrabold">{yr} Year</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {yr === '1st' && 'Foundation'}
                        {yr === '2nd' && 'Skill Dev'}
                        {yr === '3rd' && 'Internships'}
                        {yr === '4th' && 'Placements'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Engineering Branch <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {branches.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setBranch(b);
                        // Auto-adjust default goal if appropriate
                        if (b === 'ECE' && careerGoal === 'Software Development') {
                          setCareerGoal('Embedded Systems and IoT');
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        branch === b
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Career Goal & Skill Level */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Select Primary Career Goal <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {careerGoals.map(item => (
                    <button
                      key={item.goal}
                      type="button"
                      onClick={() => setCareerGoal(item.goal)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        careerGoal === item.goal
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        <span>{item.icon}</span>
                        <span>{item.goal}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-6">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Current Confidence / Skill Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSkillLevel(lvl)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        skillLevel === lvl
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{lvl}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {lvl === 'Beginner' && 'Starting from basics'}
                        {lvl === 'Intermediate' && 'Some projects built'}
                        {lvl === 'Advanced' && 'Ready for deep dive'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Weekly Hours & Target Company */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Available Weekly Study Hours
                  </label>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 rounded-full">
                    {weeklyStudyHours} hours / week
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={weeklyStudyHours}
                  onChange={e => setWeeklyStudyHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5 hrs (Light)</span>
                  <span>15 hrs (Recommended)</span>
                  <span>40 hrs (Intense Bootcamp)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Dream Target Company or Role (Optional)
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={e => setTargetCompany(e.target.value)}
                  placeholder={
                    branch === 'ECE'
                      ? 'e.g. Texas Instruments, Qualcomm, Intel, Bosch'
                      : 'e.g. Google, Microsoft, Amazon, L&T'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Dynamic Preview Summary */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Roadmap Ready to Generate:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400">Year:</span>{' '}
                    <strong className="text-slate-800 dark:text-white">{academicYear} Year B.Tech</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Branch:</span>{' '}
                    <strong className="text-slate-800 dark:text-white">{branch}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Career Goal:</span>{' '}
                    <strong className="text-indigo-600 dark:text-indigo-400">{careerGoal}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all"
            >
              <span>{step === 3 ? 'Generate My Roadmap' : 'Next Step'}</span>
              {step === 3 ? (
                <Sparkles className="w-4 h-4 text-amber-300" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
