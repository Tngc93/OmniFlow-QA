import React, { useState, useEffect } from 'react';
import { X, CalendarClock, Plus, Bell, Check, Clock, Layers, Search, CheckSquare, Square } from 'lucide-react';
import { Scenario } from '../types';
import { Language } from '../locales/translations';

export interface ScheduledJob {
  id: string;
  title: string;
  cron: string;
  target: string;
  scenarioIds?: string[];
  scenarioId?: string;
  nextRun: string;
  active: boolean;
  lastStatus: 'passed' | 'failed' | 'running' | 'idle';
  alertChannel?: string;
}

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: Scenario[];
  onAddJob: (job: ScheduledJob) => void;
  lang: Language;
}

export const NewScheduleModal: React.FC<NewScheduleModalProps> = ({
  isOpen,
  onClose,
  scenarios,
  onAddJob,
  lang
}) => {
  const isTr = lang === 'tr';
  const [title, setTitle] = useState('');
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>(() => {
    return scenarios.slice(0, 2).map(s => s.id);
  });
  const [scenarioSearch, setScenarioSearch] = useState('');
  const [cronOption, setCronOption] = useState('daily');
  const [customCron, setCustomCron] = useState('0 0 * * *');
  const [alertChannel, setAlertChannel] = useState('slack');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const toggleScenario = (id: string) => {
    setSelectedScenarioIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedScenarioIds(scenarios.map(s => s.id));
  };

  const clearAll = () => {
    setSelectedScenarioIds([]);
  };

  const filteredScenarios = scenarios.filter(s => 
    s.title.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(scenarioSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (selectedScenarioIds.length === 0) {
      alert(isTr ? 'Lütfen en az bir hedef senaryo seçin.' : 'Please select at least one scenario.');
      return;
    }

    const selectedScenarios = scenarios.filter(s => selectedScenarioIds.includes(s.id));
    let targetLabel = '';
    if (selectedScenarios.length === 1) {
      targetLabel = selectedScenarios[0].title;
    } else {
      targetLabel = `${selectedScenarios[0].title} (+${selectedScenarios.length - 1} ${isTr ? 'senaryo' : 'more'})`;
    }

    let cronLabel = '0 0 * * * (Her gece 00:00)';
    let nextRunText = isTr ? 'Bu gece 00:00' : 'Tonight at 00:00';

    if (cronOption === 'hourly') {
      cronLabel = '0 * * * * (Her saat başı)';
      nextRunText = isTr ? '1 saat sonra' : 'In 1 hour';
    } else if (cronOption === 'fifteen') {
      cronLabel = '*/15 * * * * (Her 15 dakikada bir)';
      nextRunText = isTr ? '15 dakika sonra' : 'In 15 minutes';
    } else if (cronOption === 'weekly') {
      cronLabel = '0 9 * * 1 (Her Pazartesi 09:00)';
      nextRunText = isTr ? 'Gelecek Pazartesi 09:00' : 'Next Monday 09:00';
    } else if (cronOption === 'custom') {
      cronLabel = `${customCron} (Özel Zamanlama)`;
      nextRunText = isTr ? 'Planlanan sonraki aralık' : 'Next scheduled interval';
    }

    const newJob: ScheduledJob = {
      id: `sch-${Date.now()}`,
      title,
      cron: cronLabel,
      target: targetLabel,
      scenarioIds: selectedScenarioIds,
      scenarioId: selectedScenarioIds[0],
      nextRun: nextRunText,
      active: true,
      lastStatus: 'idle',
      alertChannel
    };

    onAddJob(newJob);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {isTr ? 'Yeni Görev Zamanla (Cron Job)' : 'Schedule New Automation Task'}
              </h3>
              <p className="text-xs text-slate-400">
                {isTr ? 'Birden fazla hedef senaryoyu periyodik takvime bağlayın' : 'Bind multiple test scenarios to recurring execution schedules'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-1">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Görev Başlığı' : 'Job Title'}
            </label>
            <input
              type="text"
              required
              placeholder={isTr ? 'Örn: Günlük Gece Sepet & 3D Secure Doğrulama' : 'e.g. Daily Midnight Cart & 3DS Sanity Check'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Multi-Scenario Picker with Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {isTr ? 'Çalıştırılacak Hedef Senaryolar (Çoklu Seçim)' : 'Target Test Scenarios (Multi-Select)'}
              </label>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                  {selectedScenarioIds.length} / {scenarios.length} {isTr ? 'Seçildi' : 'Selected'}
                </span>
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-[10px] text-indigo-600 hover:underline font-bold"
                >
                  {isTr ? 'Tümünü Seç' : 'Select All'}
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[10px] text-slate-400 hover:underline"
                >
                  {isTr ? 'Temizle' : 'Clear'}
                </button>
              </div>
            </div>

            {/* Filter Input */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={isTr ? 'Senaryolarda ara...' : 'Filter scenarios...'}
                value={scenarioSearch}
                onChange={(e) => setScenarioSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>

            {/* Checkbox List */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
              {filteredScenarios.map((sc) => {
                const isSelected = selectedScenarioIds.includes(sc.id);
                return (
                  <div
                    key={sc.id}
                    onClick={() => toggleScenario(sc.id)}
                    className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors
                      ${isSelected ? 'bg-indigo-50/70 dark:bg-indigo-950/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'}
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="text-indigo-600 flex-shrink-0">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 fill-indigo-600 text-white" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className={`block text-xs truncate ${isSelected ? 'font-bold text-indigo-950 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                          {sc.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {sc.category} • {sc.nodes.length} {isTr ? 'adım' : 'steps'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex-shrink-0">
                      {sc.criticality}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Yineleme Aralığı (Frekans)' : 'Execution Frequency'}
            </label>
            <select
              value={cronOption}
              onChange={(e) => setCronOption(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-semibold"
            >
              <option value="daily">{isTr ? 'Her Gece 00:00 (Günlük Sanity)' : 'Daily at 00:00 (Midnight Sanity)'}</option>
              <option value="hourly">{isTr ? 'Her Saat Başı (Yüksek Trafik Kontrolü)' : 'Hourly (High-Spike Audit)'}</option>
              <option value="fifteen">{isTr ? 'Her 15 Dakikada Bir (Kritik Ödeme Akışı)' : 'Every 15 Minutes (Critical Payment)'}</option>
              <option value="weekly">{isTr ? 'Her Pazartesi 09:00 (Haftalık Regresyon)' : 'Weekly on Monday 09:00'}</option>
              <option value="custom">{isTr ? 'Özel Cron İfadesi Belirle' : 'Custom Cron Expression'}</option>
            </select>
          </div>

          {cronOption === 'custom' && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {isTr ? 'Cron Formatı (Dakika Saat Gün Ay HaftaGünü)' : 'Cron Expression'}
              </label>
              <input
                type="text"
                placeholder="0 0 * * *"
                value={customCron}
                onChange={(e) => setCustomCron(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-mono focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Hata Bildirim Kanalı' : 'Failure Alert Channel'}
            </label>
            <select
              value={alertChannel}
              onChange={(e) => setAlertChannel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            >
              <option value="slack">Slack: #qa-automation-alerts</option>
              <option value="email">{isTr ? 'E-posta: Dev & QA Ekibi' : 'Email: Dev & QA Team'}</option>
              <option value="jira">Jira MCP: Otomatik Bug / Defect Aç</option>
              <option value="webhook">Webhook: https://api.store.com/webhooks/qa</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition-colors"
            >
              {isTr ? 'İptal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>{isTr ? `Görevi Planla (${selectedScenarioIds.length} Senaryo)` : `Schedule (${selectedScenarioIds.length} Scenarios)`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
