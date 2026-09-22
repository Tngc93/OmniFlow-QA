import React, { useState } from 'react';
import { 
  Play, 
  Layers, 
  ExternalLink, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Filter,
  Folder,
  FolderPlus,
  BookOpen,
  Globe,
  Edit3,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { Scenario } from '../types';
import { Language, translations } from '../locales/translations';
import { EditProjectFolderModal, ProjectFolder as EditProjectFolder } from '../components/EditProjectFolderModal';

interface ProjectFolder {
  id: string;
  name: string;
  baseUrl: string;
  scenariosCount?: number;
  testCustomerEmail?: string;
  testCustomerPassword?: string;
  sessionToken?: string;
  otpCode?: string;
  autoLogin?: boolean;
  scannedEndpoints?: any;
}

interface ScenariosViewProps {
  scenarios: Scenario[];
  projects?: ProjectFolder[];
  activeProjectId?: string;
  onSelectProject?: (id: string) => void;
  onOpenNewProjectModal?: () => void;
  onSelectAndLoadScenario: (id: string) => void;
  onRunScenarioDirectly: (id: string) => void;
  onOpenNewModal: () => void;
  onOpenTrainingGuide?: () => void;
  onUpdateProject?: (project: ProjectFolder) => void;
  lang: Language;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  scenarios,
  projects = [
    {
      id: 'proj-flowshop-tr',
      name: 'FlowShop TR (Mock Store)',
      baseUrl: 'https://flowshop-tr.mock',
      scenariosCount: 20
    }
  ],
  activeProjectId = 'proj-flowshop-tr',
  onSelectProject,
  onOpenNewProjectModal,
  onSelectAndLoadScenario,
  onRunScenarioDirectly,
  onOpenNewModal,
  onOpenTrainingGuide,
  onUpdateProject,
  lang
}) => {
  const t = translations[lang];
  const isTr = lang === 'tr';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Filter scenarios for active project if projectId is specified
  const projectScenarios = scenarios.filter(s => {
    if (activeProjectId === 'all') return true;
    if (activeProjectId === 'proj-flowshop-de') {
      return s.projectId === 'proj-flowshop-de';
    }
    if (activeProjectId === 'proj-flowshop-tr') {
      return !s.projectId || s.projectId === 'proj-flowshop-tr';
    }
    return s.projectId === activeProjectId;
  });

  // Extract all unique individual categories from projectScenarios
  const allCatSet = new Set<string>();
  projectScenarios.forEach(s => {
    if (Array.isArray(s.categories) && s.categories.length > 0) {
      s.categories.forEach(c => allCatSet.add(c.trim()));
    } else if (s.category) {
      s.category.split(',').map(c => c.trim()).forEach(c => allCatSet.add(c));
    }
  });
  const categories = ['All', ...Array.from(allCatSet)];

  const filtered = projectScenarios.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                          s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || 
      (Array.isArray(s.categories) 
        ? s.categories.some(c => c.toLowerCase() === selectedCategory.toLowerCase()) 
        : (s.category && s.category.toLowerCase().includes(selectedCategory.toLowerCase())));
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 select-none">
      
      {/* 1. View Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.scenarioCatalogTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t.scenarioCatalogSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Training Guide Button */}
          {onOpenTrainingGuide && (
            <button
              data-testid="scenarios-training-guide-btn"
              onClick={onOpenTrainingGuide}
              className="px-3.5 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isTr ? '🎓 Senaryo Eğitimi & Rehber' : '🎓 Training & Guide'}</span>
            </button>
          )}

          {/* New Project / Store Folder Button */}
          {onOpenNewProjectModal && (
            <button
              data-testid="scenarios-new-project-btn"
              onClick={onOpenNewProjectModal}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-rose-500" />
              <span>{isTr ? '+ Yeni Site Klasörü' : '+ New Store Folder'}</span>
            </button>
          )}

          {/* New Scenario Button */}
          <button
            data-testid="scenarios-new-scenario-btn"
            onClick={onOpenNewModal}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isTr ? 'Yeni Senaryo Ekle' : 'Add New Scenario'}</span>
          </button>
        </div>
      </div>

      {/* 2. Target Website / Project Folder Banner (Clickable & Editable) */}
      <div 
        onClick={() => setIsEditModalOpen(true)}
        className="p-4 bg-white dark:bg-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-50 to-indigo-50 dark:from-rose-950/60 dark:to-indigo-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-rose-100 dark:border-rose-900/50">
            <Folder className="w-5 h-5 fill-rose-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isTr ? 'Aktif Web Sitesi Test Klasörü' : 'Active Store Test Project'}
              </span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold">
                {projectScenarios.length} {isTr ? 'Hazır Senaryo' : 'Ready Suites'}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {activeProject?.name || 'FlowShop TR (Mock Store)'}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px]">
              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                <Globe className="w-3 h-3" />
                <span>{activeProject?.baseUrl || 'https://flowshop-tr.mock'}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{activeProject?.testCustomerEmail || 'qa.testuser@flowshop.mock'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Switcher & Edit Button */}
        <div className="flex items-center gap-2.5">
          {projects.length > 1 && onSelectProject && (
            <div className="flex items-center gap-2 mr-1" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs text-slate-400">{isTr ? 'Klasör:' : 'Folder:'}</span>
              <select
                value={activeProjectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Dedicated Edit Button with Pencil Icon */}
          <button
            type="button"
            data-testid="edit-project-folder-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-50 to-rose-50 dark:from-indigo-950/80 dark:to-rose-950/60 hover:from-indigo-100 hover:to-rose-100 dark:hover:from-indigo-900/80 dark:hover:to-rose-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-2 border border-indigo-200/90 dark:border-indigo-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            title={isTr ? 'Mağaza Klasörü & Üyelik Bilgilerini Düzenle' : 'Edit Store Project & Auth Vault'}
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>{isTr ? 'Düzenle' : 'Edit'}</span>
          </button>
        </div>
      </div>

      {/* 3. Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                ${selectedCategory === cat
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'}
              `}
            >
              {cat === 'All' ? t.allScenarios : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Grid of Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sc) => {
          const isCritical = sc.criticality === 'Critical';
          const isHigh = sc.criticality === 'High';

          return (
            <div
              key={sc.id}
              className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-600"
            >
              <div className="space-y-3">
                {/* Header: Category + Criticality */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1 max-w-[70%]">
                    {((Array.isArray(sc.categories) && sc.categories.length > 0)
                      ? sc.categories
                      : (sc.category ? sc.category.split(',') : ['E-Commerce Flow'])
                    ).map((c, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-[9px] font-mono font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider truncate">
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase
                      ${isCritical 
                        ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900' 
                        : isHigh 
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}
                    `}
                  >
                    {sc.criticality || 'Normal'}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {sc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {sc.description}
                  </p>
                </div>

                {/* Target URL */}
                {sc.targetUrl && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700/60 truncate">
                    <span className="truncate">{sc.targetUrl}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0 ml-auto" />
                  </div>
                )}

                {/* Step Stats */}
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    {sc.nodes.length} {t.stepsCount}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {sc.lastRunDuration || '2.5s'}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold ml-auto font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100%
                  </span>
                </div>
              </div>

              {/* Bottom Actions: Tuvale Yükle / Hemen Çalıştır */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/80 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectAndLoadScenario(sc.id)}
                  className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{t.loadToCanvas}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onRunScenarioDirectly(sc.id)}
                  className="w-full py-2 px-3 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-rose-600 dark:fill-rose-400" />
                  <span>{t.runDirectly}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Project Folder & Auth Vault Modal */}
      <EditProjectFolderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={activeProject as any}
        onProjectUpdated={(up) => {
          if (onUpdateProject) onUpdateProject(up);
          setIsEditModalOpen(false);
        }}
        lang={lang}
      />
    </div>
  );
};
