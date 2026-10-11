import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Trash2,
  X,
  Layers,
  Wrench,
  ChevronRight,
  GitBranch,
  Play,
  Calendar,
} from 'lucide-react';
import {
  Project,
  StudentProfile,
  AcademicYear,
  EngineeringBranch,
  ProjectDifficulty,
  ProjectStatus,
} from '../types';
import { AIService } from '../services/aiService';

interface ProjectsPageProps {
  projects: Project[];
  profile: StudentProfile | null;
  onSaveToMyProjects: (projectId: string, status?: ProjectStatus) => void;
  onUpdateProject: (project: Project) => void;
  onRemoveFromMyProjects: (projectId: string) => void;
  onAddCustomProject: (project: Omit<Project, 'id' | 'isSaved'>) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  profile,
  onSaveToMyProjects,
  onUpdateProject,
  onRemoveFromMyProjects,
  onAddCustomProject,
}) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-projects'>('discover');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected project for detailed modal
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  // AI Idea Generator modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [customInterest, setCustomInterest] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiGeneratedProject, setAiGeneratedProject] = useState<Partial<Project> | null>(null);

  // Filtering
  const isDiscover = activeTab === 'discover';
  const targetList = isDiscover ? projects : projects.filter(p => p.isSaved);

  const filteredProjects = targetList.filter(proj => {
    if (selectedBranch !== 'All' && proj.branch !== 'All' && proj.branch !== selectedBranch)
      return false;
    if (selectedYear !== 'All' && proj.recommendedYear !== selectedYear) return false;
    if (selectedDifficulty !== 'All' && proj.difficulty !== selectedDifficulty) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = proj.title.toLowerCase().includes(q);
      const matchDesc = proj.description.toLowerCase().includes(q);
      const matchProblem = proj.problemStatement.toLowerCase().includes(q);
      const matchTech = proj.technologies.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchProblem && !matchTech) return false;
    }
    return true;
  });

  const savedProjects = projects.filter(p => p.isSaved);
  const completedSaved = savedProjects.filter(p => p.status === 'Completed').length;
  const inProgressSaved = savedProjects.filter(p => p.status === 'In Progress').length;
  const plannedSaved = savedProjects.filter(p => p.status === 'Planned').length;

  const handleGenerateAiIdea = async () => {
    if (!profile) return;
    setGeneratingAi(true);
    try {
      const res = await AIService.generateProjectIdea(profile, customInterest);
      setAiGeneratedProject(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSaveAiProject = () => {
    if (!aiGeneratedProject?.title) return;
    onAddCustomProject({
      title: aiGeneratedProject.title,
      problemStatement: aiGeneratedProject.problemStatement || 'Automate and solve real-world engineering challenge.',
      description: aiGeneratedProject.description || 'Hands-on engineering project.',
      branch: (aiGeneratedProject.branch as EngineeringBranch) || profile?.branch || 'ECE',
      careerGoal: profile?.careerGoal || 'Embedded Systems and IoT',
      recommendedYear: (aiGeneratedProject.recommendedYear as AcademicYear) || profile?.academicYear || '2nd',
      difficulty: (aiGeneratedProject.difficulty as ProjectDifficulty) || 'Intermediate',
      technologies: aiGeneratedProject.technologies || ['C++', 'Sensors', 'Microcontroller'],
      skillsGained: aiGeneratedProject.skillsGained || ['System Design', 'Debugging'],
      estimatedHours: aiGeneratedProject.estimatedHours || 35,
      implementationSteps: aiGeneratedProject.implementationSteps || ['Plan', 'Design', 'Code', 'Test'],
      expectedOutput: aiGeneratedProject.expectedOutput || 'Working verified prototype.',
      testingSuggestions: aiGeneratedProject.testingSuggestions || ['Unit tests', 'Load tests'],
      status: 'Planned',
    });
    setAiGeneratedProject(null);
    setShowAiModal(false);
    setActiveTab('my-projects');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Engineering Project Discovery
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {profile?.branch} & Core Library
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build resume-worthy practical artifacts with step-by-step implementation & testing roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Project Idea Generator Button */}
          <button
            onClick={() => {
              setShowAiModal(true);
              if (!aiGeneratedProject) handleGenerateAiIdea();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Project Generator</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Switcher & Saved Project Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'discover'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Explore Project Library ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-projects'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>My Active Projects ({savedProjects.length})</span>
          </button>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 px-3 text-xs font-semibold text-slate-500">
          <span>{completedSaved} Completed</span>
          <span>•</span>
          <span className="text-indigo-600 dark:text-indigo-400">{inProgressSaved} In Progress</span>
          <span>•</span>
          <span>{plannedSaved} Planned</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, hardware, or tech (e.g. ESP32, Verilog, React)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
        >
          <option value="All">All Branches</option>
          <option value="ECE">ECE (Electronics & Comm)</option>
          <option value="CSE">CSE (Computer Science)</option>
          <option value="IT">IT (Information Tech)</option>
          <option value="EEE">EEE (Electrical)</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
        </select>

        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
        >
          <option value="All">All Years</option>
          <option value="1st">1st Year (Beginner)</option>
          <option value="2nd">2nd Year (Intermediate)</option>
          <option value="3rd">3rd Year (Advanced)</option>
          <option value="4th">4th Year (Capstone)</option>
        </select>

        <select
          value={selectedDifficulty}
          onChange={e => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
        >
          <option value="All">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <FolderGit2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isDiscover ? 'No Projects Match Filters' : 'No Saved Projects Yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {isDiscover
                ? 'Try resetting the filters or generate a custom idea with AI.'
                : 'Browse the Project Library and click "Add to My Projects" to track your progress.'}
            </p>
          </div>
        ) : (
          filteredProjects.map(proj => {
            const isSaved = Boolean(proj.isSaved);

            return (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex flex-col justify-between gap-4 shadow-sm group"
              >
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {proj.branch} • {proj.recommendedYear} Yr
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          proj.difficulty === 'Beginner'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : proj.difficulty === 'Intermediate'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}
                      >
                        {proj.difficulty}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>~{proj.estimatedHours}h</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    onClick={() => setDetailProject(proj)}
                    className="text-base font-bold text-slate-900 dark:text-white cursor-pointer group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2"
                  >
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {proj.problemStatement}
                  </p>

                  {/* Technologies tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{proj.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailProject(proj)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Blueprint</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {isSaved ? (
                      <div className="flex items-center gap-1.5">
                        <select
                          value={proj.status || 'Planned'}
                          onChange={e =>
                            onUpdateProject({
                              ...proj,
                              status: e.target.value as ProjectStatus,
                              completionDate:
                                e.target.value === 'Completed'
                                  ? new Date().toISOString().split('T')[0]
                                  : undefined,
                            })
                          }
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                            proj.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              : proj.status === 'In Progress'
                              ? 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <option value="Planned">Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <button
                          onClick={() => {
                            if (window.confirm(`Remove "${proj.title}" from My Projects?`)) {
                              onRemoveFromMyProjects(proj.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove from saved projects"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSaveToMyProjects(proj.id, 'Planned')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Add to My Projects</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Project Blueprint Modal */}
      {detailProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {detailProject.branch} • {detailProject.recommendedYear} Year
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  {detailProject.difficulty}
                </span>
              </div>
              <button
                onClick={() => setDetailProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {detailProject.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {detailProject.description}
                </p>
              </div>

              {/* Problem statement */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1">
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                  Problem Statement
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {detailProject.problemStatement}
                </p>
              </div>

              {/* Technologies & Components */}
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Required Components & Technologies
                </div>
                <div className="flex flex-wrap gap-2">
                  {detailProject.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Implementation Steps */}
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Step-by-Step Implementation Blueprint
                </div>
                <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside pl-1">
                  {detailProject.implementationSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Expected Output */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">
                  Expected Output & Deliverable
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {detailProject.expectedOutput}
                </p>
              </div>

              {/* Testing Suggestions */}
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Validation & Testing Suggestions
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {detailProject.testingSuggestions.map((test, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* GitHub search link */}
              {detailProject.githubSearchQuery && (
                <div className="pt-2">
                  <a
                    href={`https://github.com/search?q=${encodeURIComponent(detailProject.githubSearchQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Search similar open-source implementations on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Estimated completion: ~{detailProject.estimatedHours} hours
              </span>

              {detailProject.isSaved ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600">✓ In My Projects</span>
                  <button
                    onClick={() => setDetailProject(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onSaveToMyProjects(detailProject.id, 'Planned');
                    setDetailProject({ ...detailProject, isSaved: true, status: 'Planned' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Add to My Projects
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Project Idea Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    AI Project Ideator
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Customized for {profile?.branch} • {profile?.careerGoal}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Optional Topic Interest or Domain
                </label>
                <input
                  type="text"
                  value={customInterest}
                  onChange={e => setCustomInterest(e.target.value)}
                  placeholder="e.g. Healthcare monitoring, Electric Vehicles, Smart Agriculture..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <button
                type="button"
                disabled={generatingAi}
                onClick={handleGenerateAiIdea}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {generatingAi ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Synthesizing Engineering Blueprint...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate New Project Idea</span>
                  </>
                )}
              </button>

              {aiGeneratedProject && (
                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-2 mt-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                      Generated Recommendation
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      ~{aiGeneratedProject.estimatedHours} hrs
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {aiGeneratedProject.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {aiGeneratedProject.description}
                  </p>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={handleSaveAiProject}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                    >
                      Save to My Projects
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
