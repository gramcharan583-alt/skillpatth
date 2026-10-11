import React, { useState } from 'react';
import {
  Compass,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  BookOpen,
  AlertCircle,
  X,
  ChevronRight,
  GraduationCap,
  ListOrdered,
  Calendar,
} from 'lucide-react';
import {
  RoadmapTask,
  StudentProfile,
  AcademicYear,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '../types';

interface RoadmapPageProps {
  tasks: RoadmapTask[];
  profile: StudentProfile | null;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onAddTask: (task: Omit<RoadmapTask, 'id' | 'status'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  tasks,
  profile,
  onUpdateStatus,
  onAddTask,
  onDeleteTask,
}) => {
  const [selectedYear, setSelectedYear] = useState<AcademicYear | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Task detail modal state
  const [selectedTask, setSelectedTask] = useState<RoadmapTask | null>(null);

  // Add custom task modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Foundation');
  const [newYear, setNewYear] = useState<AcademicYear>(profile?.academicYear || '2nd');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newHours, setNewHours] = useState(20);
  const [newPrereqs, setNewPrereqs] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // -------------------------------------------------------------------------
  // Filtering
  // -------------------------------------------------------------------------
  const filteredTasks = tasks.filter(task => {
    if (selectedYear !== 'All' && task.academicYear !== selectedYear) return false;
    if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && task.priority !== selectedPriority) return false;
    if (selectedStatus !== 'All' && task.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchCat = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category)));

  // Progress metrics
  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const pct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Year-wise stats
  const getYearStats = (yr: AcademicYear) => {
    const yrTasks = tasks.filter(t => t.academicYear === yr);
    const yrDone = yrTasks.filter(t => t.status === 'Completed').length;
    return {
      total: yrTasks.length,
      done: yrDone,
      pct: yrTasks.length > 0 ? Math.round((yrDone / yrTasks.length) * 100) : 0,
    };
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom student-defined goal',
      category: newCategory,
      academicYear: newYear,
      branch: profile?.branch || 'All',
      careerGoal: profile?.careerGoal || 'All',
      priority: newPriority,
      estimatedHours: Number(newHours) || 15,
      prerequisites: newPrereqs.trim() || undefined,
      resourceUrl: newUrl.trim() || undefined,
    });

    setNewTitle('');
    setNewDesc('');
    setNewPrereqs('');
    setNewUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Year-Wise Engineering Roadmap
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {profile?.branch} • {profile?.careerGoal}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track milestones sequentially from First-Year Foundations to Fourth-Year Placement Execution.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Goal</span>
        </button>
      </div>

      {/* Year-by-Year Milestone Cards Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['1st', '2nd', '3rd', '4th'] as AcademicYear[]).map(yr => {
          const stats = getYearStats(yr);
          const isCurrentStudentYear = profile?.academicYear === yr;
          const isSelected = selectedYear === yr;

          return (
            <div
              key={yr}
              onClick={() => setSelectedYear(selectedYear === yr ? 'All' : yr)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              {isCurrentStudentYear && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-md">
                  Current
                </span>
              )}

              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {yr === '1st' && 'Foundation'}
                {yr === '2nd' && 'Skill Dev'}
                {yr === '3rd' && 'Industry Prep'}
                {yr === '4th' && 'Placements'}
              </div>

              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {yr} Year
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{stats.done}/{stats.total} done</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.pct}%</span>
              </div>

              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${stats.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search roadmap tasks, protocols, or topics..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Status Filter */}
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

        {/* Filter results count */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-slate-700 dark:text-slate-300">{filteredTasks.length}</strong> of{' '}
            {tasks.length} milestones
          </span>
          {(selectedYear !== 'All' || selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedYear('All');
                setSelectedCategory('All');
                setSelectedPriority('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task Cards Timeline List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Roadmap Tasks Match Your Criteria
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your filter settings or add a custom milestone.
            </p>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : isInProgress
                    ? 'border-indigo-300 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/15'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left Content */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {task.academicYear} Year
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {task.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : task.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>~{task.estimatedHours} hrs</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedTask(task)}
                      className={`text-base font-bold cursor-pointer hover:text-indigo-600 transition-colors ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {task.description}
                    </p>

                    {task.prerequisites && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                        <span className="font-semibold text-slate-500">Prerequisites:</span>
                        <span>{task.prerequisites}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions & Status Selector */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={task.status}
                        onChange={e => onUpdateStatus(task.id, e.target.value as TaskStatus)}
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

                      <button
                        onClick={() => setSelectedTask(task)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View details & resources"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {task.resourceUrl && (
                      <a
                        href={task.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>Resource Guide</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {selectedTask.academicYear} Year • {selectedTask.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  #{selectedTask.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedTask.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedTask.description}
              </p>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Estimated Time:</span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {selectedTask.estimatedHours} hours
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Priority:</span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {selectedTask.priority}
                  </strong>
                </div>
                {selectedTask.prerequisites && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Prerequisites:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {selectedTask.prerequisites}
                    </strong>
                  </div>
                )}
              </div>

              {selectedTask.resourceUrl && (
                <div className="pt-2">
                  <a
                    href={selectedTask.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Open recommended curriculum / documentation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Status Update Quick Switch */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Update Milestone Status:
                </span>
                <div className="flex gap-2">
                  {(['Not Started', 'In Progress', 'Completed'] as TaskStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedTask.id, st);
                        setSelectedTask({ ...selectedTask, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedTask.status === st
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Custom Milestone Task
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Build Quadcopter flight controller or solve 50 LeetCode trees"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Details of what you plan to accomplish..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Academic Year
                  </label>
                  <select
                    value={newYear}
                    onChange={e => setNewYear(e.target.value as AcademicYear)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Foundation">Foundation</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="Programming & DSA">Programming & DSA</option>
                    <option value="Specialization">Specialization</option>
                    <option value="Projects & Portfolio">Projects & Portfolio</option>
                    <option value="Internships">Internships</option>
                    <option value="Placement & Aptitude">Placement & Aptitude</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={newHours}
                    onChange={e => setNewHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Resource URL (Optional)
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
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
