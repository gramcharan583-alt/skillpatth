import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Sparkles,
  Award,
  BookOpen,
  X,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { Skill, SkillCategory, StudentProfile, TaskPriority, TaskStatus } from '../types';
import { AIService } from '../services/aiService';

interface SkillsPageProps {
  skills: Skill[];
  profile: StudentProfile | null;
  onUpdateStatus: (skillId: string, status: TaskStatus) => void;
  onAddSkill: (skill: Omit<Skill, 'id' | 'status'>) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({
  skills,
  profile,
  onUpdateStatus,
  onAddSkill,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Skill explanation modal state
  const [explainingSkill, setExplainingSkill] = useState<Skill | null>(null);
  const [skillExplanation, setSkillExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  // Add custom skill modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('Programming and technical fundamentals');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newHours, setNewHours] = useState(25);
  const [newUrl, setNewUrl] = useState('');

  // Category definitions
  const CATEGORIES: SkillCategory[] = [
    'Programming and technical fundamentals',
    'Branch-specific engineering skills',
    'Tools, platforms, and technologies',
    'Practical laboratory skills',
    'Projects and portfolio',
    'Communication and aptitude',
    'Resume and internships',
    'Placement and interview preparation',
  ];

  // Filtering
  const filteredSkills = skills.filter(skill => {
    if (selectedCategory !== 'All' && skill.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && skill.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = skill.name.toLowerCase().includes(q);
      const matchDesc = skill.description.toLowerCase().includes(q);
      const matchCat = skill.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  // Overall metric calculations
  const totalCount = skills.length;
  const completedCount = skills.filter(s => s.status === 'Completed').length;
  const inProgressCount = skills.filter(s => s.status === 'In Progress').length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Handle AI Explanation request
  const handleExplainSkill = async (skill: Skill) => {
    setExplainingSkill(skill);
    setLoadingExplanation(true);
    setSkillExplanation(null);

    if (profile) {
      try {
        const res = await AIService.explainSkillRelevance(skill.name, profile);
        setSkillExplanation(res.data);
      } catch (err) {
        setSkillExplanation('SkillPath AI provides targeted industry relevance for your engineering discipline.');
      } finally {
        setLoadingExplanation(false);
      }
    }
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddSkill({
      name: newName.trim(),
      description: newDesc.trim() || 'Custom engineering skill',
      category: newCategory,
      relevantBranches: [profile?.branch || 'All'],
      relevantGoals: [profile?.careerGoal || 'All'],
      relevantYears: [profile?.academicYear || '2nd'],
      priority: newPriority,
      estimatedHours: Number(newHours) || 20,
      resourceUrl: newUrl.trim() || 'https://www.google.com',
    });

    setNewName('');
    setNewDesc('');
    setNewUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Interactive Skill Checklist
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {profile?.branch} Track
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and verify competencies across 8 essential engineering dimensions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Skill</span>
        </button>
      </div>

      {/* Progress Overview Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Recommended Skills Progress
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {completedCount}
              </span>
              <span className="text-sm text-slate-400">/ {totalCount} verified</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 ml-2">
                ({overallPct}% completed)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{completedCount} Completed</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>{inProgressCount} Learning</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>{totalCount - completedCount - inProgressCount} Pending</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * Notice: Appearing on this checklist indicates recommended curriculum relevance for your branch. A skill is only recognized once marked as Completed by you.
        </p>
      </div>

      {/* Category Cards Horizontal Scroller / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(cat => {
          const catSkills = skills.filter(s => s.category === cat);
          const catDone = catSkills.filter(s => s.status === 'Completed').length;
          const catPct = catSkills.length > 0 ? Math.round((catDone / catSkills.length) * 100) : 0;
          const isSelected = selectedCategory === cat;

          return (
            <div
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                {cat}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">{catDone}/{catSkills.length}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{catPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${catPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g. C, Verilog, UART, DSA, Docker)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs max-w-xs"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs"
        >
          <option value="All">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Skills Checklist Items */}
      <div className="space-y-3">
        {filteredSkills.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Skills Match Your Filter
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Reset your category or search filters to see all recommended skills.
            </p>
          </div>
        ) : (
          filteredSkills.map(skill => {
            const isCompleted = skill.status === 'Completed';
            const isInProgress = skill.status === 'In Progress';

            return (
              <div
                key={skill.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : isInProgress
                    ? 'border-indigo-300 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Checkbox + Title + Description */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateStatus(
                          skill.id,
                          isCompleted ? 'Not Started' : 'Completed'
                        )
                      }
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : isInProgress
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-800'
                      }`}
                      title={isCompleted ? 'Mark not completed' : 'Mark completed'}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                      {!isCompleted && isInProgress && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-sm" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {skill.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            skill.priority === 'High'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {skill.priority} Priority
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>~{skill.estimatedHours} hrs</span>
                        </span>
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-bold ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {skill.name}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions & Status selector */}
                  <div className="flex items-center gap-2.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Ask AI why it matters button */}
                    <button
                      onClick={() => handleExplainSkill(skill)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 transition-colors"
                      title="Ask SkillPath AI why this skill matters for your goal"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span className="hidden sm:inline">Why it matters</span>
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={skill.status}
                      onChange={e => onUpdateStatus(skill.id, e.target.value as TaskStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                          : isInProgress
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                          : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {skill.resourceUrl && (
                      <a
                        href={skill.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Open documentation / tutorial"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* AI Skill Explanation Modal */}
      {explainingSkill && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Skill Mentor: {explainingSkill.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Relevance for {profile?.branch} & {profile?.careerGoal}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExplainingSkill(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingExplanation ? (
              <div className="py-8 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-500">
                  Synthesizing industry requirements & interview contexts...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {skillExplanation}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Recommended Study Time: ~{explainingSkill.estimatedHours} hours
                  </span>
                  <a
                    href={explainingSkill.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>View Learning Tutorial</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Custom Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Custom Skill
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Skill Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. FreeRTOS Multithreading or PyTorch Neural Networks"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Brief summary of concepts and practical mastery..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as SkillCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Resource Link (Optional)
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
