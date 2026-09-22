import React, { useState, useEffect } from 'react';
import { 
  X, 
  Unplug, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Bug, 
  Send, 
  Lock, 
  FolderGit2, 
  MessageSquare, 
  Zap,
  RefreshCw,
  Camera,
  Layers,
  HelpCircle,
  Info
} from 'lucide-react';
import { Language } from '../locales/translations';
import { API_BASE } from '../services/api';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: 'jira' | 'github' | 'slack' | 'playwright';
}

interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description: string;
  screenshotUrl: string;
  projectKey: string;
  board: string;
  issueType: string;
  priority: string;
  status: string;
  reporter: string;
  createdAt: string;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTab = 'jira'
}) => {
  const isTr = lang === 'tr';
  const [activeTab, setActiveTab] = useState<'jira' | 'github' | 'slack' | 'playwright'>(initialTab);

  // Jira Form State
  const [jiraDomain, setJiraDomain] = useState('https://novatech-qa.atlassian.net');
  const [jiraEmail, setJiraEmail] = useState('qa.engineer@novatech-ecom.io');
  const [jiraToken, setJiraToken] = useState('ATATT3xFfGF0SecureApiToken-QAAutomationSuite');
  const [jiraProjectKey, setJiraProjectKey] = useState('MONS');
  const [jiraBoardId, setJiraBoardId] = useState('BOARD-104 (QA Automation Sprint)');
  const [jiraIssueType, setJiraIssueType] = useState('Bug');
  const [autoCreateOnFailure, setAutoCreateOnFailure] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // GitHub & Slack State
  const [ghRepo, setGhRepo] = useState('Tngc93/OmniFlow-QA');
  const [ghWorkflow, setGhWorkflow] = useState('playwright-e2e.yml');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T01234/B5678/XYZ9876');
  const [slackChannel, setSlackChannel] = useState('#qa-novatech-alerts');

  // Status & Feedback
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [isCreatingDefect, setIsCreatingDefect] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing Jira issues
  const fetchJiraIssues = async () => {
    try {
      const res = await fetch(`${API_BASE}/integrations/jira/issues`);
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      fetchJiraIssues();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, initialTab, onClose]);

  if (!isOpen) return null;

  // Test Integration Connection
  const handleTestConnection = async (type: string) => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch(`${API_BASE}/integrations/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      setTestStatus(data.message || 'Bağlantı başarılı.');
    } catch (err: any) {
      setTestStatus(`Hata: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Create Sample Defect in Jira
  const handleCreateSampleDefect = async () => {
    setIsCreatingDefect(true);
    try {
      const res = await fetch(`${API_BASE}/integrations/jira/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: 'NovaTech Horizon E2E Arama ve İnceleme',
          stepName: 'Sepete Ekleme & Kargo Rozeti Doğrulaması',
          errorMessage: 'Sepet toplamı kargo tutarı ile eşleşmedi (Assertion Error: ₺48.999 != ₺49.049)',
          screenshot: '/screenshots/novatech_pdp.png',
          projectKey: jiraProjectKey,
          boardId: jiraBoardId,
          issueType: jiraIssueType,
          priority: 'High'
        })
      });
      if (res.ok) {
        await fetchJiraIssues();
        setTestStatus('Jira MCP Defect başarıyla oluşturuldu ve panoya eklendi!');
      }
    } catch (e: any) {
      setTestStatus(`Defect oluşturma hatası: ${e.message}`);
    } finally {
      setIsCreatingDefect(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/integrations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jira: {
            name: 'Jira MCP Defect Tracker',
            connected: true,
            domain: jiraDomain,
            email: jiraEmail,
            projectKey: jiraProjectKey,
            boardId: jiraBoardId,
            issueType: jiraIssueType,
            autoCreateOnFailure
          },
          github: {
            repo: ghRepo,
            workflow: ghWorkflow,
            connected: true
          },
          slack: {
            webhookUrl: slackWebhook,
            channel: slackChannel,
            connected: true
          }
        })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs">
              <Unplug className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                {isTr ? 'Entegrasyon Yapılandırması & Jira MCP' : 'Integrations Configuration & Jira MCP'}
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  Live MCP Active
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isTr 
                  ? 'Jira hata yönetimi, GitHub Actions CI/CD ve Slack bildirim kanallarını bağlayın.' 
                  : 'Configure Jira MCP defect logger, GitHub CI/CD webhooks, and Slack alert webhooks.'}
              </p>
            </div>
          </div>

          <button 
            data-testid="close-integrations-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => { setActiveTab('jira'); setTestStatus(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'jira'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>Jira MCP (Defect Tracker)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono">
              {issues.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('github'); setTestStatus(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'github'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>GitHub Actions CI/CD</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('slack'); setTestStatus(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'slack'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Slack Alerts</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Test Status Banner */}
          {testStatus && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold">{testStatus}</span>
              </div>
              <button onClick={() => setTestStatus(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {isTr ? 'Entegrasyon ayarları başarıyla kaydedildi!' : 'Integration settings saved successfully!'}
            </div>
          )}

          {/* TAB 1: JIRA MCP */}
          {activeTab === 'jira' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {isTr ? 'Jira Model Context Protocol (MCP) Yapılandırması' : 'Jira Model Context Protocol (MCP) Setup'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isTr 
                        ? 'Test otomasyonu hata aldığında otomatik veya manuel olarak belirtilen panoya başlık, açıklama ve ekran görüntüsü ile bilet açar.'
                        : 'Auto-files Jira tickets with failure summary, logs, and screenshot attachments.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTestConnection('jira')}
                      disabled={isTesting}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                      {isTr ? 'Bağlantıyı Test Et' : 'Test MCP Connection'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateSampleDefect}
                      disabled={isCreatingDefect}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isCreatingDefect ? (isTr ? 'Gönderiliyor...' : 'Submitting...') : (isTr ? 'Örnek Bilet Aç' : 'Log Defect Ticket')}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Field 1: Jira Cloud Domain */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {isTr ? 'Jira Cloud Domain' : 'Jira Cloud Domain'}
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === 'domain' ? null : 'domain')}
                          onMouseEnter={() => setActiveTooltip('domain')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 cursor-pointer"
                          title="Alan Hakkında Bilgi"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        {activeTooltip === 'domain' && (
                          <div className="absolute right-0 bottom-full mb-1.5 z-50 w-64 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[10px] leading-relaxed border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95">
                            <span className="font-bold text-indigo-400 block mb-0.5">ℹ️ Jira Cloud Domain Nedir?</span>
                            Şirketinizin Atlassian bulut adresidir. Jira'yı açtığınızda adres çubuğundaki ana URL'dir (örn: https://novatech-qa.atlassian.net). Otomasyon biletleri buraya iletir.
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={jiraDomain}
                      placeholder="https://novatech-qa.atlassian.net"
                      onChange={(e) => setJiraDomain(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Field 2: Yetkili E-Posta */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {isTr ? 'Yetkili E-Posta Adresi' : 'Authorized User Email'}
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === 'email' ? null : 'email')}
                          onMouseEnter={() => setActiveTooltip('email')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 cursor-pointer"
                          title="Alan Hakkında Bilgi"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        {activeTooltip === 'email' && (
                          <div className="absolute right-0 bottom-full mb-1.5 z-50 w-64 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[10px] leading-relaxed border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95">
                            <span className="font-bold text-indigo-400 block mb-0.5">ℹ️ Yetkili E-Posta Nedir?</span>
                            Jira hesabınıza giriş yaptığınız kurumsal e-posta adresinizdir. API Token ile birlikte HTTP Basic kimlik doğrulamasında kullanılır.
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="email"
                      value={jiraEmail}
                      placeholder="qa.engineer@novatech-ecom.io"
                      onChange={(e) => setJiraEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Field 3: Atlassian API Token */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {isTr ? 'Atlassian API Token / MCP Auth' : 'Atlassian API Token / Secret'}
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === 'token' ? null : 'token')}
                          onMouseEnter={() => setActiveTooltip('token')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 cursor-pointer"
                          title="Alan Hakkında Bilgi"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        {activeTooltip === 'token' && (
                          <div className="absolute right-0 bottom-full mb-1.5 z-50 w-72 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[10px] leading-relaxed border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95">
                            <span className="font-bold text-indigo-400 block mb-0.5">🔑 API Token Nereden Alınır?</span>
                            Atlassian hesabınızda şifreniz yerine kullanılan güvenlik anahtarıdır. <strong>id.atlassian.com/manage-profile/security/api-tokens</strong> adresine gidip "Create API token" butonuna tıklayarak oluşturabilirsiniz.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={jiraToken}
                        placeholder="ATATT3xFfGF0SecureApiToken-QAAutomationSuite"
                        onChange={(e) => setJiraToken(e.target.value)}
                        className="w-full px-3 py-2 pr-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  {/* Field 4: Proje Anahtarı & Bilet Türü */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {isTr ? 'Proje Kodu (Key)' : 'Project Key'}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveTooltip(activeTooltip === 'projectKey' ? null : 'projectKey')}
                            onMouseEnter={() => setActiveTooltip('projectKey')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 cursor-pointer"
                            title="Alan Hakkında Bilgi"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>
                          {activeTooltip === 'projectKey' && (
                            <div className="absolute right-0 bottom-full mb-1.5 z-50 w-56 p-2 bg-slate-900 text-white rounded-xl shadow-xl text-[10px] leading-relaxed border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95">
                              <span className="font-bold text-indigo-400 block mb-0.5">🏷️ Proje Anahtarı Nedir?</span>
                              Jira projenizin 2-4 harfli kodudur (örn: MONS, QA). Biletlerin başlığını belirler (örn: MONS-101).
                            </div>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={jiraProjectKey}
                        placeholder="MONS"
                        onChange={(e) => setJiraProjectKey(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono font-bold focus:outline-none focus:border-indigo-500 uppercase"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {isTr ? 'Bilet Türü' : 'Issue Type'}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveTooltip(activeTooltip === 'issueType' ? null : 'issueType')}
                            onMouseEnter={() => setActiveTooltip('issueType')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 cursor-pointer"
                            title="Alan Hakkında Bilgi"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>
                          {activeTooltip === 'issueType' && (
                            <div className="absolute right-0 bottom-full mb-1.5 z-50 w-56 p-2 bg-slate-900 text-white rounded-xl shadow-xl text-[10px] leading-relaxed border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95">
                              <span className="font-bold text-indigo-400 block mb-0.5">🐛 Bilet Türü Seçimi</span>
                              Jira panosunda açılacak biletin tipidir. Test hataları için "Bug" veya "Defect" önerilir.
                            </div>
                          )}
                        </div>
                      </div>
                      <select
                        value={jiraIssueType}
                        onChange={(e) => setJiraIssueType(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Bug">Bug (Hata)</option>
                        <option value="Defect">Defect</option>
                        <option value="Task">Task (Görev)</option>
                      </select>
                    </div>
                  </div>

                  {/* Field 5: Hedef Jira Panosu */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {isTr ? 'Hedef Jira Panosu (Board & Sprint)' : 'Target Jira Board & Sprint'}
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === 'boardId' ? null : 'boardId')}
                          onMouseEnter={() => setActiveTooltip('boardId')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 cursor-pointer"
                          title="Alan Hakkında Bilgi"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        {activeTooltip === 'boardId' && (
                          <div className="absolute right-0 bottom-full mb-1.5 z-50 w-72 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[10px] leading-relaxed border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95">
                            <span className="font-bold text-indigo-400 block mb-0.5">📋 Hedef Jira Panosu Nedir?</span>
                            Test başarısız olduğunda biletin açılacağı Scrum veya Kanban panosudur. Panonun adını (örn: <strong>BOARD-104 (QA Automation Sprint)</strong>) veya Jira URL'sindeki board ID numarasını girebilirsiniz.
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={jiraBoardId}
                      placeholder="BOARD-104 (QA Automation Sprint)"
                      onChange={(e) => setJiraBoardId(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                      <Bug className="w-4 h-4 text-rose-500" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {isTr ? 'Otomasyon Hatalarında Otomatik Bilet Aç' : 'Auto-create Jira defect on test failure'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {isTr ? 'Playwright motoru bir assertion kaçırdığında ekran görüntüsü ile anında bilet oluşturulur.' : 'Automatically captures screenshot and logs ticket to the specified board.'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoCreateOnFailure}
                      onChange={(e) => setAutoCreateOnFailure(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Logged Jira Issues Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Bug className="w-4 h-4 text-sky-500" />
                    {isTr ? 'Jira’ya İletilen Test Hataları & Biletler' : 'Reported Jira Defect Issues & Tickets'}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {issues.length} {isTr ? 'Bilet Kaydı' : 'Tickets'}
                  </span>
                </div>

                <div className="space-y-2">
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-mono font-bold text-xs flex-shrink-0">
                          {issue.key}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {issue.summary}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed whitespace-pre-line">
                            {issue.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-medium">
                            <span>Pano: <strong className="text-slate-600 dark:text-slate-300">{issue.board}</strong></span>
                            <span>•</span>
                            <span>Tür: <strong className="text-rose-600 dark:text-rose-400">{issue.issueType}</strong></span>
                            <span>•</span>
                            <span>Zaman: {issue.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Screenshot Thumbnail */}
                      {issue.screenshotUrl && (
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <img
                            src={issue.screenshotUrl}
                            alt="Bug Snapshot"
                            className="w-16 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                          />
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                            <Camera className="w-2.5 h-2.5" /> Ekte
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB ACTIONS */}
          {activeTab === 'github' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
                GitHub Actions Pipeline Trigger
              </h3>
              <p className="text-[11px] text-slate-500">
                {isTr ? 'Pull Request veya commit açıldığında Playwright testlerini GitHub Runners üzerinde başlatır.' : 'Trigger workflow runs directly from GitHub Actions on pull requests and commits.'}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Repository</label>
                  <input
                    type="text"
                    value={ghRepo}
                    onChange={(e) => setGhRepo(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Workflow Dosyası</label>
                  <input
                    type="text"
                    value={ghWorkflow}
                    onChange={(e) => setGhWorkflow(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTestConnection('github')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-colors"
              >
                {isTr ? 'GitHub Webhook Doğrula' : 'Validate GitHub Hook'}
              </button>
            </div>
          )}

          {/* TAB 3: SLACK ALERTS */}
          {activeTab === 'slack' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Slack Incoming Webhooks
              </h3>
              <p className="text-[11px] text-slate-500">
                {isTr ? 'Test adımları başarısız olduğunda ekran görüntüsü ve detaylı logu Slack kanalına gönderir.' : 'Post failure notifications and screenshots to your QA Slack channel.'}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Webhook URL</label>
                  <input
                    type="text"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Hedef Kanal</label>
                  <input
                    type="text"
                    value={slackChannel}
                    onChange={(e) => setSlackChannel(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTestConnection('slack')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-colors"
              >
                {isTr ? 'Slack Test Mesajı Gönder' : 'Send Slack Test Alert'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-[11px] text-slate-400">
            {isTr ? 'Tüm değişiklikler anında Playwright test koşularına uygulanır.' : 'Changes are applied to live Playwright runs.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
            >
              {isTr ? 'Kapat' : 'Close'}
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-600/20 text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isTr ? 'Yapılandırmayı Kaydet' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
