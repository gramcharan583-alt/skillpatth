import React, { useState } from 'react';
import {
  Briefcase,
  CheckSquare,
  Plus,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  X,
  Search,
  Filter,
  TrendingUp,
  FileText,
  Clock,
} from 'lucide-react';
import {
  InternshipApplication,
  ReadinessCheckItem,
  ApplicationStatus,
  StudentProfile,
} from '../types';

interface InternshipsPageProps {
  applications: InternshipApplication[];
  internshipChecklist: ReadinessCheckItem[];
  placementChecklist: ReadinessCheckItem[];
  profile: StudentProfile | null;
  onToggleInternshipCheck: (id: string) => void;
  onTogglePlacementCheck: (id: string) => void;
  onAddApplication: (app: Omit<InternshipApplication, 'id'>) => void;
  onUpdateApplication: (app: InternshipApplication) => void;
  onDeleteApplication: (id: string) => void;
}

export const InternshipsPage: React.FC<InternshipsPageProps> = ({
  applications,
  internshipChecklist,
  placementChecklist,
  profile,
  onToggleInternshipCheck,
  onTogglePlacementCheck,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
}) => {
  const [activeSection, setActiveSection] = useState<'applications' | 'internship-check' | 'placement-check'>('applications');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<InternshipApplication | null>(null);

  // Form states
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');
  const [appDate, setAppDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [nextAction, setNextAction] = useState('');
  const [stipend, setStipend] = useState('');
  const [notes, setNotes] = useState('');

  // Readiness metrics
  const internDone = internshipChecklist.filter(i => i.isCompleted).length;
  const internPct = internshipChecklist.length > 0 ? Math.round((internDone / internshipChecklist.length) * 100) : 0;

  const placeDone = placementChecklist.filter(p => p.isCompleted).length;
  const placePct = placementChecklist.length > 0 ? Math.round((placeDone / placementChecklist.length) * 100) : 0;

  // Pipeline counts
  const offersCount = applications.filter(a => a.status === 'Offer').length;
  const interviewsCount = applications.filter(a => a.status === 'Interview').length;
  const assessmentCount = applications.filter(a => a.status === 'Assessment').length;
  const appliedCount = applications.filter(a => a.status === 'Applied').length;

  const handleOpenAdd = () => {
    setOrg('');
    setRole(profile?.branch === 'ECE' ? 'Embedded Systems Intern' : 'Software Engineering Intern');
    setAppDate(new Date().toISOString().split('T')[0]);
    setStatus('Applied');
    setNextAction('Follow up on application status in 5 days');
    setStipend('₹35,000 / month');
    setNotes('');
    setEditingApp(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (app: InternshipApplication) => {
    setEditingApp(app);
    setOrg(app.organization);
    setRole(app.role);
    setAppDate(app.applicationDate);
    setStatus(app.status);
    setNextAction(app.nextAction);
    setStipend(app.stipendOrSalary || '');
    setNotes(app.notes || '');
    setShowAddModal(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org.trim() || !role.trim()) return;

    if (editingApp) {
      onUpdateApplication({
        ...editingApp,
        organization: org.trim(),
        role: role.trim(),
        applicationDate: appDate,
        status,
        nextAction: nextAction.trim() || 'Awaiting response',
        stipendOrSalary: stipend.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      onAddApplication({
        organization: org.trim(),
        role: role.trim(),
        applicationDate: appDate,
        status,
        nextAction: nextAction.trim() || 'Awaiting response',
        stipendOrSalary: stipend.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }
    setShowAddModal(false);
  };

  // Curated Official Portals based on Branch
  const officialPortals = [
    {
      name: 'Texas Instruments Careers',
      role: 'Hardware, Embedded & Analog Internships',
      url: 'https://careers.ti.com/',
      isRelevant: profile?.branch === 'ECE' || profile?.branch === 'EEE',
    },
    {
      name: 'Qualcomm Student Programs',
      role: 'Modem, SoC & Software Internships',
      url: 'https://www.qualcomm.com/company/careers/students-graduates',
      isRelevant: profile?.branch === 'ECE' || profile?.branch === 'CSE',
    },
    {
      name: 'Intel Student Opportunities',
      role: 'VLSI, Silicon Design & AI Architecture',
      url: 'https://jobs.intel.com/en/student-center',
      isRelevant: profile?.branch === 'ECE' || profile?.branch === 'CSE',
    },
    {
      name: 'Microsoft University Recruitment',
      role: 'Software Engineering & Research Internships',
      url: 'https://careers.microsoft.com/v2/global/en/students',
      isRelevant: true,
    },
    {
      name: 'Google Students Careers',
      role: 'Software, Hardware & Cloud Engineering',
      url: 'https://www.google.com/about/careers/applications/students/',
      isRelevant: true,
    },
    {
      name: 'Larsen & Toubro (L&T) Early Careers',
      role: 'Core Engineering, Infrastructure & Embedded',
      url: 'https://www.larsentoubro.com/corporate/careers/',
      isRelevant: profile?.branch === 'Mechanical' || profile?.branch === 'Civil' || profile?.branch === 'EEE',
    },
    {
      name: 'ISRO ICRB Central Recruitment',
      role: 'Scientist / Engineer ‘SC’ Fellowships',
      url: 'https://www.isro.gov.in/Careers.html',
      isRelevant: true,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Internship & Placement Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Career Execution
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track applications, monitor your hiring pipeline, and assess your internship & campus readiness.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Pipeline Overview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Application Pipeline
            </span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {applications.length} Tracked
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <span className="text-emerald-600 font-bold">{offersCount} Offers</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">{interviewsCount} Interviews</span>
            <span>•</span>
            <span>{assessmentCount} Tests</span>
          </div>
        </div>

        {/* Card 2: Internship Readiness */}
        <div
          onClick={() => setActiveSection('internship-check')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Internship Readiness
            </span>
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{internPct}%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {internDone} / {internshipChecklist.length} Items
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${internPct}%` }}
            />
          </div>
        </div>

        {/* Card 3: Placement Readiness */}
        <div
          onClick={() => setActiveSection('placement-check')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Placement Readiness
            </span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{placePct}%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {placeDone} / {placementChecklist.length} Items
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${placePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSection('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'applications'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Applications Tracker ({applications.length})
        </button>
        <button
          onClick={() => setActiveSection('internship-check')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'internship-check'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Internship Checklist ({internDone}/{internshipChecklist.length})
        </button>
        <button
          onClick={() => setActiveSection('placement-check')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'placement-check'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Placement Checklist ({placeDone}/{placementChecklist.length})
        </button>
      </div>

      {/* SECTION 1: APPLICATIONS TRACKER */}
      {activeSection === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Applications Recorded Yet
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Record internship and job opportunities you are pursuing to maintain structured follow-ups.
              </p>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Add First Application
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map(app => {
                const statusColors: Record<ApplicationStatus, string> = {
                  Interested: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                  Applied: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
                  Assessment: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                  Interview: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
                  Offer: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold',
                  Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
                };

                return (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Edit application"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete application for ${app.organization}?`)) {
                                onDeleteApplication(app.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {app.organization}
                        </h3>
                        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {app.role}
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Applied: {app.applicationDate}</span>
                        </span>
                        {app.stipendOrSalary && (
                          <span>Stipend: <strong>{app.stipendOrSalary}</strong></span>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
                        <span className="text-slate-400 font-medium block text-[10px] uppercase">
                          Next Action
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {app.nextAction}
                        </span>
                      </div>

                      {app.notes && (
                        <p className="text-[11px] text-slate-500 italic pt-1">
                          "{app.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Official Company Portals Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Verified Official Career Portals
                </h3>
                <p className="text-xs text-slate-500">
                  Direct official recruitment links (no third-party scrapers or unverified postings)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {officialPortals.map((p, idx) => (
                <a
                  key={idx}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {p.role}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INTERNSHIP READINESS CHECKLIST */}
      {activeSection === 'internship-check' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200">
            <strong>7-Step Internship Launch Checklist:</strong> Verify all 7 dimensions before dispatching cold emails and applying through corporate careers sites.
          </div>

          {internshipChecklist.map(item => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                item.isCompleted
                  ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => onToggleInternshipCheck(item.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                    item.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-500'
                  }`}
                >
                  {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold ${
                      item.isCompleted
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 mt-2">
                    <strong className="text-indigo-600 dark:text-indigo-400">Pro-Tip:</strong>{' '}
                    {item.tips}
                  </div>
                </div>

                {item.guideUrl && (
                  <a
                    href={item.guideUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 flex-shrink-0"
                    title="View guide"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: PLACEMENT READINESS CHECKLIST */}
      {activeSection === 'placement-check' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200">
            <strong>8-Step Placement & Campus Drives Checklist:</strong> Complete each pillar to maximize conversion rates across written aptitude, technical rounds, and HR interviews.
          </div>

          {placementChecklist.map(item => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                item.isCompleted
                  ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => onTogglePlacementCheck(item.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                    item.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-500'
                  }`}
                >
                  {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold ${
                      item.isCompleted
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 mt-2">
                    <strong className="text-emerald-600 dark:text-emerald-400">Pro-Tip:</strong>{' '}
                    {item.tips}
                  </div>
                </div>

                {item.guideUrl && (
                  <a
                    href={item.guideUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 flex-shrink-0"
                    title="View guide"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingApp ? 'Edit Application Record' : 'Record New Application'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Company / Organization Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="e.g. Texas Instruments, Microsoft, TCS, Bosch"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Role / Position <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Embedded Firmware Intern"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Application Date
                  </label>
                  <input
                    type="date"
                    value={appDate}
                    onChange={e => setAppDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Pipeline Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Interested">Interested</option>
                    <option value="Applied">Applied</option>
                    <option value="Assessment">Assessment Scheduled</option>
                    <option value="Interview">Interview Round</option>
                    <option value="Offer">Offer Received 🎉</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Stipend / CTC (Optional)
                  </label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={e => setStipend(e.target.value)}
                    placeholder="e.g. ₹40,000 / month"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Next Action / Follow-Up Task
                </label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={e => setNextAction(e.target.value)}
                  placeholder="e.g. Solve past year coding questions before Sunday test"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Notes & Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Recruiter contact, referral senior, or interview topics to revise..."
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  {editingApp ? 'Update Record' : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
