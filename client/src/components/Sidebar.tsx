import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  CalendarClock, 
  BarChart3, 
  Unplug, 
  FolderGit2, 
  Workflow, 
  Settings, 
  HelpCircle, 
  ChevronDown, 
  PanelLeftClose, 
  PanelLeft,
  Sparkles,
  Layers
} from 'lucide-react';
import { Language, translations } from '../locales/translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  lang: Language;
  scenariosCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  onToggleCollapse,
  lang,
  scenariosCount
}) => {
  const t = translations[lang];
  const [isGeneralOpen, setIsGeneralOpen] = useState(true);
  const [isAutomationOpen, setIsAutomationOpen] = useState(true);

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col items-center justify-between py-4 flex-shrink-0 z-30 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <button 
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Expand Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => setActiveTab('Dashboard')}
            className={`p-2 rounded-xl transition-colors ${activeTab === 'Dashboard' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            title={t.dashboard}
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('Scenarios')}
            className={`p-2 rounded-xl transition-colors ${activeTab === 'Scenarios' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            title={t.scenarios}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('Compliance')}
            className={`p-2 rounded-xl transition-colors ${activeTab === 'Compliance' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            title={t.compliance}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('Analytics')}
            className={`p-2 rounded-xl transition-colors ${activeTab === 'Analytics' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            title={t.analytics}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('Settings')}
          className={`p-2 rounded-xl transition-colors ${activeTab === 'Settings' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          title={t.settings}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-60 bg-white dark:bg-slate-950 border-r border-slate-200/90 dark:border-slate-800/90 h-full flex flex-col justify-between p-4 flex-shrink-0 z-30 text-xs select-none transition-colors">
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Unique Brand Header: OmniFlow QA */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-rose-500/20 ring-2 ring-rose-500/20">
              <Sparkles className="w-4 h-4 fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight">OmniFlow</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-mono text-[9px] font-bold">QA</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">E-Commerce Test Engine</p>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: General */}
        <div className="space-y-1">
          <button
            type="button"
            data-testid="sidebar-general-toggle"
            onClick={() => setIsGeneralOpen(!isGeneralOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group"
          >
            <span>{t.general}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${isGeneralOpen ? '' : '-rotate-90'}`} />
          </button>

          {isGeneralOpen && (
            <div className="space-y-1 animate-in fade-in duration-150">
              <button
                data-testid="sidebar-tab-dashboard"
                onClick={() => setActiveTab('Dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all
                  ${activeTab === 'Dashboard' 
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'}
                `}
              >
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                <span>{t.dashboard}</span>
              </button>

              <button
                data-testid="sidebar-tab-compliance"
                onClick={() => setActiveTab('Compliance')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all
                  ${activeTab === 'Compliance' 
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'}
                `}
              >
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>{t.compliance}</span>
              </button>

              <button
                data-testid="sidebar-tab-scheduler"
                onClick={() => setActiveTab('Scheduler')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all
                  ${activeTab === 'Scheduler' 
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <CalendarClock className="w-4 h-4 flex-shrink-0" />
                  <span>{t.scheduler}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px]">11</span>
              </button>

              <button
                data-testid="sidebar-tab-analytics"
                onClick={() => setActiveTab('Analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all
                  ${activeTab === 'Analytics' 
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'}
                `}
              >
                <BarChart3 className="w-4 h-4 flex-shrink-0" />
                <span>{t.analytics}</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Automation */}
        <div className="space-y-1">
          <button
            type="button"
            data-testid="sidebar-automation-toggle"
            onClick={() => setIsAutomationOpen(!isAutomationOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group"
          >
            <span>{t.automation}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${isAutomationOpen ? '' : '-rotate-90'}`} />
          </button>

          {isAutomationOpen && (
            <div className="space-y-1 animate-in fade-in duration-150">
              {/* Dedicated Scenarios Catalog item */}
              <button
                data-testid="sidebar-tab-scenarios"
                onClick={() => setActiveTab('Scenarios')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all
                  ${activeTab === 'Scenarios' 
                    ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 flex-shrink-0" />
                  <span>{t.scenarios}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md font-mono text-[9px] font-bold ${activeTab === 'Scenarios' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                  {scenariosCount !== undefined ? `${scenariosCount} ${lang === 'tr' ? 'Hazır' : 'Ready'}` : (lang === 'tr' ? 'Hazır' : 'Ready')}
                </span>
              </button>

              <button
                data-testid="sidebar-tab-integrations"
                onClick={() => setActiveTab('Integrations')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all
                  ${activeTab === 'Integrations' 
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'}
                `}
              >
                <Unplug className="w-4 h-4 flex-shrink-0" />
                <span>{t.integrations}</span>
              </button>

              <button
                data-testid="sidebar-tab-repository"
                onClick={() => setActiveTab('Repository')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all
                  ${activeTab === 'Repository' 
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 flex-shrink-0" />
                  <span>{t.repository}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px]">7</span>
              </button>

              <button
                onClick={() => setActiveTab('Workflows')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all
                  ${activeTab === 'Workflows' 
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'}
                `}
              >
                <Workflow className="w-4 h-4 flex-shrink-0" />
                <span>{t.workflows}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Help & Documentation */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <button 
          onClick={() => window.open('https://testomat.io/blog/e-commerce-testing/', '_blank')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          <span>{t.helpSupport}</span>
        </button>
      </div>
    </aside>
  );
};
