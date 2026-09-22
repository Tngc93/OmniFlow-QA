import React, { useState } from 'react';
import { CalendarClock, Plus, Play, CheckCircle2, Clock, AlertCircle, Trash2, Power } from 'lucide-react';
import { Language } from '../locales/translations';
import { Scenario } from '../types';
import { NewScheduleModal, ScheduledJob } from '../components/NewScheduleModal';

interface SchedulerViewProps {
  lang: Language;
  scenarios?: Scenario[];
  onTriggerScenario?: (scenarioId?: string) => void;
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({ 
  lang, 
  scenarios = [],
  onTriggerScenario 
}) => {
  const isTr = lang === 'tr';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerToast, setTriggerToast] = useState<string | null>(null);

  const [schedules, setSchedules] = useState<ScheduledJob[]>([
    {
      id: 'sch-1',
      title: isTr ? 'Günlük Gece FlowShop TR Sanity Testi' : 'Daily Midnight FlowShop TR Sanity Check',
      cron: '0 0 * * * (Her gece 00:00)',
      target: 'FlowShop TR E2E',
      scenarioId: 'scenario-flowshop-tr-e2e',
      nextRun: isTr ? 'Bu Gece 00:00' : 'Tonight 00:00',
      active: true,
      lastStatus: 'passed'
    },
    {
      id: 'sch-2',
      title: isTr ? 'Black Friday Saatlik Yük & Sepet Kontrolü' : 'Hourly High-Spike Checkout Health Audit',
      cron: '0 * * * * (Her saat başı)',
      target: 'Studio Wireless & Sepet Akışı',
      scenarioId: 'scenario-flowshop-tr-category',
      nextRun: isTr ? '1 saat sonra' : 'In 1 hour',
      active: true,
      lastStatus: 'passed'
    },
    {
      id: 'sch-3',
      title: isTr ? 'Haftalık Mobil Viewport Uyumluluk Taraması' : 'Weekly Mobile Responsive Cross-Device Sweep',
      cron: '0 9 * * 1 (Her Pazartesi 09:00)',
      target: 'iPhone 14 / Android',
      scenarioId: 'scenario-flowshop-tr-mobile',
      nextRun: isTr ? 'Gelecek Pazartesi 09:00' : 'Next Monday 09:00',
      active: true,
      lastStatus: 'passed'
    }
  ]);

  const handleAddJob = (job: ScheduledJob) => {
    setSchedules(prev => [job, ...prev]);
  };

  const handleToggleActive = (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleDeleteJob = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleTriggerNow = (job: ScheduledJob) => {
    setTriggerToast(isTr ? `"${job.title}" görevi hemen tetiklendi!` : `Triggered "${job.title}" now!`);
    setTimeout(() => setTriggerToast(null), 3500);

    if (onTriggerScenario) {
      onTriggerScenario(job.scenarioId);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 select-none">
      
      {/* Toast Notification */}
      {triggerToast && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{triggerToast}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <CalendarClock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {isTr ? 'Zamanlanmış Otomasyon Görevleri (Cron)' : 'Scheduled Test Automation & Cron'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isTr 
              ? 'Canlı e-ticaret sitenizi periyodik olarak arka planda test eden ve hata anında Slack/E-posta uyarı gönderen cron takvimi.'
              : 'Automated recurring regression jobs running headlessly on regular cron schedules.'}
          </p>
        </div>

        <button 
          data-testid="schedule-new-job-btn"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isTr ? 'Yeni Görev Zamanla' : 'Schedule New Job'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-4">{isTr ? 'Zamanlanmış İş' : 'Scheduled Job'}</th>
              <th className="p-4">{isTr ? 'Cron İfadesi' : 'Cron Frequency'}</th>
              <th className="p-4">{isTr ? 'Hedef Senaryo' : 'Target Flow'}</th>
              <th className="p-4">{isTr ? 'Sonraki Çalışma' : 'Next Execution'}</th>
              <th className="p-4">{isTr ? 'Durum' : 'Status'}</th>
              <th className="p-4 text-right">{isTr ? 'İşlem' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {schedules.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  <div>{job.title}</div>
                  {job.alertChannel && (
                    <span className="text-[10px] text-slate-400 font-normal">Kanal: {job.alertChannel}</span>
                  )}
                </td>
                <td className="p-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {job.cron}
                </td>
                <td className="p-4 font-semibold text-indigo-600 dark:text-indigo-400">
                  {job.target}
                </td>
                <td className="p-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  {job.nextRun}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleActive(job.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer
                      ${job.active 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${job.active ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                    <span>{job.active ? (isTr ? 'Aktif' : 'Active') : (isTr ? 'Pasif' : 'Paused')}</span>
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleTriggerNow(job)}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-indigo-600 dark:fill-indigo-300" />
                      <span>{isTr ? 'Şimdi Tetikle' : 'Trigger Now'}</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                      title={isTr ? 'Sil' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Schedule Modal */}
      <NewScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scenarios={scenarios}
        onAddJob={handleAddJob}
        lang={lang}
      />
    </div>
  );
};
