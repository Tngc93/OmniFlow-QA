import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Check, 
  Zap, 
  Camera, 
  GripVertical,
  Eye,
  Bot,
  Code2
} from 'lucide-react';
import { RealMetricsData, Scenario } from '../types';
import { Language, translations } from '../locales/translations';

interface RightSidebarProps {
  metrics: RealMetricsData | null;
  activeScenario: Scenario | null;
  isOpen: boolean;
  onClose: () => void;
  onAddObjectiveToCanvas: (obj: any) => void;
  onOpenScreenshotModal: (url: string) => void;
  lang: Language;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  metrics,
  isOpen,
  onClose,
  onAddObjectiveToCanvas,
  onOpenScreenshotModal,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCoverageCard, setShowCoverageCard] = useState(true);
  const t = translations[lang];
  const isTr = lang === 'tr';

  if (!isOpen) return null;

  const objectives = metrics?.flowObjectives || [
    {
      id: 'obj-1',
      title: 'FlowShop Storefront Init',
      subtitle: 'Connect & Accept Cookies',
      pills: { task: 11, time: '2.1s', passed: 41, automated: 72 }
    },
    {
      id: 'obj-2',
      title: 'Headphones & Earbuds Search',
      subtitle: 'Query & Validate PLP Cards',
      pills: { task: 14, time: '1.8s', passed: 27, automated: 41 }
    },
    {
      id: 'obj-3',
      title: 'Studio Wireless PDP Specs',
      subtitle: 'Hybrid ANC & Sound Tuning',
      pills: { task: 91, time: '2.4s', passed: 18, automated: 20 }
    },
    {
      id: 'obj-4',
      title: 'Cart & Delivery Validation',
      subtitle: 'Fast Shipping & Warranty',
      pills: { task: 87, time: '1.9s', passed: 34, automated: 17 }
    },
    {
      id: 'obj-5',
      title: 'Mobile Viewport Test',
      subtitle: 'iPhone 15 Responsive Flow',
      pills: { task: 12, time: '2.0s', passed: 28, automated: 34 }
    }
  ];

  const filteredObjectives = objectives.filter(o => 
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-84 border-l border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 h-full flex flex-col flex-shrink-0 z-20 shadow-xs select-none transition-colors">
      {/* Top Header */}
      <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
            {t.performanceOverview}
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            {t.overviewSubtitle}
          </span>
        </div>

        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* 1. Insight Metrics with Search Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
              {t.insightMetrics}
            </span>
            <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <span className="text-[9px] font-mono text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 py-0.5 rounded absolute right-2.5 top-2">
              ⌘K
            </span>
          </div>
        </div>

        {/* 2. Automation Coverage Banner */}
        {showCoverageCard && (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 relative">
            <button 
              onClick={() => setShowCoverageCard(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
            <h4 className="text-[11px] font-extrabold text-slate-900 dark:text-white">
              {t.automationCoverage}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t.coverageText} <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{metrics?.passRate || 100}%</strong>
            </p>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics?.passRate || 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Google Core Web Vitals Summary Card */}
        <div 
          data-testid="sidebar-web-vitals-btn"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-web-vitals'));
          }}
          className="p-3 bg-gradient-to-br from-amber-500/5 via-emerald-500/5 to-slate-50 dark:to-slate-900/60 border border-amber-500/30 hover:border-amber-500 rounded-2xl cursor-pointer transition-all group shadow-2xs"
          title={isTr ? 'Google Core Web Vitals & Lighthouse Hız Raporunu Aç' : 'Open Google Core Web Vitals Scorecard'}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Core Web Vitals</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              96/100 Good
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded">
              <div className="text-slate-400">LCP</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">1.2s</div>
            </div>
            <div className="bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded">
              <div className="text-slate-400">INP</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">82ms</div>
            </div>
            <div className="bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded">
              <div className="text-slate-400">CLS</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">0.01</div>
            </div>
          </div>
        </div>

        {/* 3. Workflow A (Triggered by User Actions) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-extrabold text-slate-900 dark:text-white text-xs">
                {metrics?.workflowA.title || 'Workflow A (FlowShop E2E)'}
              </h5>
              <span className="text-[10px] text-slate-400">
                {isTr ? 'Canlı Kullanıcı Aksiyonları Tetiklendi' : 'Triggered by Real User Actions'}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-rose-400" style={{ width: '25%' }}></div>
            <div className="h-full bg-sky-400" style={{ width: '40%' }}></div>
            <div className="h-full bg-emerald-500" style={{ width: '35%' }}></div>
          </div>

          {/* Metric Status Pills */}
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
              • Task: {metrics?.workflowA.tasks || 6}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900">
              • Exec: {metrics?.workflowA.executed || 6}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              • Done: {metrics?.workflowA.done || 6}
            </span>
          </div>
        </div>

        {/* 4. Workflow B (Scheduled Automation) */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-extrabold text-slate-900 dark:text-white text-xs">
                {metrics?.workflowB.title || (isTr ? 'Workflow B (Kategori & Filtre)' : 'Workflow B (Category & Filters)')}
              </h5>
              <span className="text-[10px] text-slate-400">
                {isTr ? 'Planlı E-Ticaret Otomasyonu' : 'Scheduled E-Commerce Automation'}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-rose-400" style={{ width: '15%' }}></div>
            <div className="h-full bg-sky-400" style={{ width: '50%' }}></div>
            <div className="h-full bg-emerald-500" style={{ width: '35%' }}></div>
          </div>

          {/* Metric Status Pills */}
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
              • Task: {metrics?.workflowB.tasks || 4}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900">
              • Exec: {metrics?.workflowB.executed || 4}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              • Done: {metrics?.workflowB.done || 4}
            </span>
          </div>
        </div>

        {/* 5. Flow Objectives Section */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{t.flowObjectives}</h4>
              <p className="text-[10px] text-slate-400">{t.addStepToFlow}</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Plus className="w-3.5 h-3.5" /></button>
          </div>

          <div className="space-y-2">
            {filteredObjectives.map((obj) => (
              <div
                key={obj.id}
                onClick={() => onAddObjectiveToCanvas(obj)}
                className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs cursor-pointer transition-all hover:border-indigo-400 group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {obj.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {obj.subtitle}
                    </p>
                  </div>
                  <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500" />
                </div>

                {/* Bottom Metric Pills */}
                <div className="flex items-center justify-between text-[10px] font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[9px]">
                    {obj.pills.task}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[9px]">
                    {obj.pills.time}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold text-[9px] flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    {obj.pills.passed}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 font-bold text-[9px] flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 fill-violet-600 dark:fill-violet-400 text-violet-600 dark:text-violet-400" />
                    {obj.pills.automated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Live Captured Screenshots Gallery */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {t.liveScreenshots}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div 
              onClick={() => onOpenScreenshotModal('/screenshots/flowshop_home_live.png')}
              className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-video cursor-pointer hover:opacity-90 relative group"
            >
              <img src="/screenshots/flowshop_home_live.png" alt="FlowShop Home" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                {isTr ? 'Canlı Ana Sayfa' : 'Storefront Live'}
              </div>
            </div>

            <div 
              onClick={() => onOpenScreenshotModal('/screenshots/flowshop_pdp.png')}
              className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-video cursor-pointer hover:opacity-90 relative group"
            >
              <img src="/screenshots/flowshop_pdp.png" alt="Studio Wireless PDP" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                {isTr ? 'Kablosuz Kulaklık Detay' : 'Wireless Headphone PDP'}
              </div>
            </div>
          </div>

          {/* Visual Regression Quick Launch Button */}
          <button
            type="button"
            data-testid="sidebar-visual-diff-btn"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-visual-diff', {
                  detail: {
                    stepName: 'Storefront Layout Visual Regression',
                    screenshot: '/screenshots/flowshop_home_live.png'
                  }
                })
              );
            }}
            className="w-full py-2 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs mt-2"
            title="Görsel Regresyon & Piksel-Diff İnceleme"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isTr ? 'Görsel Regresyon (Piksel-Diff)' : 'Visual Regression (Pixel-Diff)'}</span>
          </button>

          {/* AI Self-Healing & Playwright Code Quick Launch Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              data-testid="sidebar-self-healing-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-self-healing'))}
              className="py-2 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="AI Self-Healing Paneli"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{isTr ? 'AI Healing (3)' : 'AI Healing (3)'}</span>
            </button>

            <button
              type="button"
              data-testid="sidebar-playwright-code-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-playwright-code'))}
              className="py-2 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Playwright TypeScript Kodunu Gör"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{isTr ? 'spec.ts Kodu' : 'spec.ts Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
