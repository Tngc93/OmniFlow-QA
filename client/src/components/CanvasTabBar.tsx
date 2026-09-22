import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe2, 
  Layers, 
  Plus, 
  X, 
  ChevronRight, 
  Check, 
  Search,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import { Scenario } from '../types';
import { Language } from '../locales/translations';
import { MASTER_DOMAINS } from '../data/masterPipeline';

interface CanvasTabBarProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  openScenarioIds: string[];
  onCloseTab: (tabId: string) => void;
  onOpenScenarioInTab: (scenarioId: string) => void;
  scenarios: Scenario[];
  lang: Language;
  selectedMasterDomain?: 'flowshop-tr' | 'flowshop-de' | 'all';
  onSelectMasterDomain?: (domainId: 'flowshop-tr' | 'flowshop-de' | 'all') => void;
}

export const CanvasTabBar: React.FC<CanvasTabBarProps> = ({
  activeTabId,
  onSelectTab,
  openScenarioIds,
  onCloseTab,
  onOpenScenarioInTab,
  scenarios,
  lang,
  selectedMasterDomain = 'flowshop-tr',
  onSelectMasterDomain
}) => {
  const isTr = lang === 'tr';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openScenarios = openScenarioIds
    .map(id => scenarios.find(s => s.id === id))
    .filter((s): s is Scenario => s !== undefined);

  const availableToOpen = scenarios.filter(s => 
    !openScenarioIds.includes(s.id) &&
    (s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-11 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/90 dark:border-slate-800 px-4 flex items-center justify-between gap-2 z-10 backdrop-blur-md select-none">
      
      {/* Left Tabs Container */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        
        {/* 1. MASTER PIPELINE PINNED TAB */}
        <button
          type="button"
          data-testid="tab-master-pipeline"
          onClick={() => onSelectTab('master-pipeline')}
          className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
            activeTabId === 'master-pipeline'
              ? 'bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/20 ring-1 ring-white/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700/80'
          }`}
          title={isTr ? 'Tüm E-Ticaret Otomasyonlarını Bütünleşik Olarak Göster' : 'Show All Connected E-Commerce Automations'}
        >
          <Globe2 className={`w-3.5 h-3.5 ${activeTabId === 'master-pipeline' ? 'animate-pulse text-rose-200' : 'text-indigo-500'}`} />
          <span>{isTr ? '🌐 Genel Tüm Otomasyonlar (Master E2E)' : '🌐 Master Pipeline (All Automations)'}</span>
          <span className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] ${
            activeTabId === 'master-pipeline' 
              ? 'bg-white/20 text-white' 
              : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
          }`}>
            {isTr ? '14 Faz' : '14 Phases'}
          </span>
        </button>

        {/* 1.1 DOMAIN / STORE SELECTOR FOR MASTER PIPELINE */}
        {activeTabId === 'master-pipeline' && (
          <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-1.5 font-mono">
              {isTr ? 'Mağaza:' : 'Store:'}
            </span>
            {MASTER_DOMAINS.map(dom => {
              const isSelected = selectedMasterDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  type="button"
                  data-testid={`domain-btn-${dom.id}`}
                  onClick={() => onSelectMasterDomain && onSelectMasterDomain(dom.id)}
                  className={`h-6 px-2.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-2xs ring-1 ring-white/20 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                  title={`${dom.name} - ${dom.badge}`}
                >
                  <span>{dom.flag}</span>
                  <span className="font-mono text-[10px]">{dom.domain}</span>
                  {isSelected && <span className="text-[9px] font-extrabold ml-0.5">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 flex-shrink-0" />

        {/* 2. SPECIFIC SCENARIO TABS */}
        {openScenarios.map(sc => {
          const isActive = activeTabId === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => onSelectTab(sc.id)}
              className={`group h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/80 shadow-2xs font-bold'
                  : 'bg-slate-50 dark:bg-slate-850/60 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="max-w-[140px] truncate" title={sc.title}>
                {sc.title}
              </span>

              {/* Close Tab Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(sc.id);
                }}
                className="w-4 h-4 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title={isTr ? 'Sekmeyi Kapat' : 'Close Tab'}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Right: + Senaryo Aç Dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          type="button"
          data-testid="open-scenario-tab-btn"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-8 px-2.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
          title={isTr ? 'Yeni Senaryoyu Sekmede Aç' : 'Open Scenario in Tab'}
        >
          <Plus className="w-3.5 h-3.5 text-indigo-500" />
          <span>{isTr ? '+ Senaryo Aç' : '+ Open Scenario'}</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTr ? 'Sekmede Açılacak Senaryoyu Seçin' : 'Select Scenario to Open'}
              </span>
              <span className="text-[10px] font-mono text-indigo-500 font-bold">
                {availableToOpen.length} {isTr ? 'Mevcut' : 'Available'}
              </span>
            </div>

            {/* Search Box */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={isTr ? 'Senaryo ara...' : 'Search scenario...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                autoFocus
              />
            </div>

            {/* Scenario List */}
            <div className="max-h-60 overflow-y-auto space-y-1">
              {availableToOpen.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  {isTr ? 'Açılacak başka senaryo kalmadı veya bulunamadı.' : 'No more scenarios to open.'}
                </div>
              ) : (
                availableToOpen.map(sc => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      onOpenScenarioInTab(sc.id);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {sc.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {sc.category} • {sc.nodes.length} {isTr ? 'Adım' : 'Steps'}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
