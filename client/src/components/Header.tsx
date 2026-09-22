import React, { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  ChevronDown, 
  Database, 
  Play, 
  Loader2, 
  Info, 
  ExternalLink,
  Plus,
  PanelRight,
  Globe,
  Sun,
  Moon,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Scenario } from '../types';
import { Language, translations } from '../locales/translations';

interface HeaderProps {
  scenarios: Scenario[];
  activeScenario: Scenario | null;
  onSelectScenario: (id: string) => void;
  onOpenNewScenarioModal: () => void;
  isRunning: boolean;
  onRunTest: () => void;
  onRestartTest?: () => void;
  isRightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  onOpenLiveSite: () => void;
  lang: Language;
  onToggleLang: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenTrainingGuide?: () => void;
  activeProject?: any;
}

export const Header: React.FC<HeaderProps> = ({
  scenarios,
  activeScenario,
  onSelectScenario,
  onOpenNewScenarioModal,
  isRunning,
  onRunTest,
  onRestartTest,
  isRightSidebarOpen,
  onToggleRightSidebar,
  onOpenLiveSite,
  lang,
  onToggleLang,
  isDarkMode,
  onToggleTheme,
  onOpenTrainingGuide,
  activeProject
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = translations[lang];

  return (
    <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200/90 dark:border-slate-800 px-5 flex items-center justify-between z-20 shadow-xs select-none transition-colors">
      {/* Left: Undo & Redo */}
      <div className="flex items-center gap-1.5">
        <button 
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={t.undo}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button 
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={t.redo}
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Workflow Selector Dropdown */}
      <div className="relative">
        <button
          data-testid="scenario-dropdown-btn"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex flex-col items-center text-center px-4 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <span>{activeScenario?.title || 'Monster Notebook E2E Flow'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform" />
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {activeScenario?.targetUrl || 'https://www.monsternotebook.com.tr'}
          </span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>{t.scenarioCatalogTitle}</span>
              <span className="text-rose-500 font-mono">{scenarios.length} Scenarios</span>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectScenario(sc.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between
                    ${sc.id === activeScenario?.id 
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'}
                  `}
                >
                  <div className="truncate mr-2">
                    <span className="block truncate">{sc.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{sc.category || 'E-Commerce'}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex-shrink-0">
                    {sc.nodes.length} {t.stepsCount}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onOpenNewScenarioModal();
                  setIsDropdownOpen(false);
                }}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Yeni Senaryo Ekle' : 'Add Custom Workflow'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions, Language Switcher, Theme Switcher & Run Automation */}
      <div className="flex items-center gap-2">
        {/* Language Switcher Toggle */}
        <button
          data-testid="lang-toggle"
          onClick={onToggleLang}
          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          title={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="uppercase font-mono text-[11px]">{lang}</span>
        </button>

        {/* Theme Switcher Toggle (Light / Dark) */}
        <button
          data-testid="theme-toggle"
          onClick={onToggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={isDarkMode ? t.lightMode : t.darkMode}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* Open Live Store */}
        <button
          onClick={onOpenLiveSite}
          className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-800"
          title={`Canlı Mağazayı Aç: ${activeProject?.baseUrl || 'https://www.monsternotebook.com.tr'}`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-0.5" />
          <span className="hidden sm:inline font-bold">
            {activeProject?.name ? (activeProject.name.includes('Tulpar') ? 'Tulpar Notebook (DE)' : 'Monster Notebook (TR)') : 'Canlı Mağaza'}
          </span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>

        {/* Master Training Guide Button */}
        {onOpenTrainingGuide && (
          <button
            onClick={onOpenTrainingGuide}
            className="px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl flex items-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-800 shadow-2xs cursor-pointer"
            title={lang === 'tr' ? "A'dan Z'ye Eğitim & Kullanım Rehberi" : "Master Training & User Guide"}
          >
            <span>{lang === 'tr' ? '🎓 Eğitim & Rehber' : '🎓 Training & Guide'}</span>
          </button>
        )}

        {/* Restart / Baştan Başlat Button */}
        {onRestartTest && (
          <button
            onClick={onRestartTest}
            disabled={isRunning}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
            title={lang === 'tr' ? 'Tüm Adımları Sıfırla ve Baştan Başlat' : 'Reset Flow and Restart Automation'}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{lang === 'tr' ? 'Baştan Başlat' : 'Restart'}</span>
          </button>
        )}

        {/* Play ▷ Run Automation CTA Button */}
        <button
          onClick={onRunTest}
          disabled={isRunning}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md
            ${isRunning
              ? 'bg-amber-500 text-white animate-pulse cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-emerald-500/20'
            }
          `}
          title="Execute Live Playwright Automation"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t.running}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t.runAutomation}</span>
            </>
          )}
        </button>

        {/* Info Icon */}
        <button 
          onClick={() => window.open('https://testomat.io/blog/e-commerce-testing/', '_blank')}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={t.workflowInfo}
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Toggle Right Sidebar */}
        <button
          onClick={onToggleRightSidebar}
          className={`p-2 rounded-xl border transition-colors
            ${isRightSidebarOpen 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700' 
              : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'}
          `}
          title={t.toggleSidebar}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
