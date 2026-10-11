import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe,
  Tag,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';
import { CareerResource, StudentProfile } from '../types';
import { DEFAULT_RESOURCES } from '../data/defaultResources';

interface ResourcesPageProps {
  profile: StudentProfile | null;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ profile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Array.from(new Set(DEFAULT_RESOURCES.map(r => r.category)));

  const filtered = DEFAULT_RESOURCES.filter(res => {
    if (selectedCategory !== 'All' && res.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchBadge = res.badge.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchBadge) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Curated Engineering Career Resources
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            10 Categories
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Handpicked documentation, simulation suites, competition portals, and verified official career destinations.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search resources (e.g. KiCad, LeetCode, GATE, NPTEL, Overleaf)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs max-w-xs"
        >
          <option value="All">All Categories ({DEFAULT_RESOURCES.length})</option>
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === c
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(res => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4 hover:border-indigo-400 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950">
                  {res.badge}
                </span>

                {res.isOfficial ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Official Portal</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    <Globe className="w-3 h-3" />
                    <span>Curated Search</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {res.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {res.description}
              </p>

              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                <span>Category:</span>
                <strong className="text-slate-600 dark:text-slate-300">{res.category}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span>Targets:</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {res.targetYears.join(', ')} Year
                </span>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold transition-colors"
              >
                <span>Visit Destination</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
