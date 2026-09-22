import React, { useState, useEffect } from 'react';
import { 
  Unplug, 
  FolderGit2, 
  Users, 
  Inbox, 
  MessageSquare, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Bug,
  Plus,
  Camera,
  Settings2,
  Sparkles,
  X,
  AlertTriangle,
  Clock,
  ZoomIn,
  Copy,
  Check,
  Info,
  ShieldAlert
} from 'lucide-react';
import { Language } from '../locales/translations';
import { IntegrationsModal } from '../components/IntegrationsModal';
import { API_BASE } from '../services/api';

interface ViewProps {
  lang: Language;
}

export const IntegrationsView: React.FC<ViewProps> = ({ lang }) => {
  const isTr = lang === 'tr';
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'jira' | 'github' | 'slack' | 'playwright'>('jira');
  const [jiraIssues, setJiraIssues] = useState<any[]>([]);

  const fetchIssues = async () => {
    try {
      const res = await fetch(`${API_BASE}/integrations/jira/issues`);
      if (res.ok) {
        const data = await res.json();
        setJiraIssues(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [modalOpen]);

  const openModal = (tab: 'jira' | 'github' | 'slack' | 'playwright') => {
    setSelectedTab(tab);
    setModalOpen(true);
  };

  const integrations = [
    { 
      id: 'jira',
      name: 'Jira MCP Defect Tracker', 
      desc: isTr ? 'Başarısız testlerde başlık, ekran görüntüsü ve hata dökümüyle otomatik bilet açma' : 'Auto-log defect tickets on payment or checkout failures with live screenshots', 
      active: true,
      badge: 'MCP Active',
      stat: isTr ? `${jiraIssues.length} Aktif Bilet` : `${jiraIssues.length} Active Tickets`
    },
    { 
      id: 'github',
      name: 'GitHub Actions CI/CD', 
      desc: isTr ? 'Pull Request ve merge anlarında Playwright testlerini otomatik tetikleme' : 'Run Playwright tests on every PR and main commit', 
      active: true,
      badge: 'Connected',
      stat: 'main branch'
    },
    { 
      id: 'slack',
      name: 'Slack Alerts Channel', 
      desc: isTr ? 'Test başarısız olduğunda #qa-alerts kanalına anlık bildirim' : 'Instant failure and screenshot notification to Slack', 
      active: true,
      badge: 'Connected',
      stat: '#qa-alerts'
    },
    { 
      id: 'playwright',
      name: 'Playwright CLI & Reporter', 
      desc: isTr ? 'Chromium motoru DOM izleri ve interaktif test yürütücü' : 'Native Playwright JUnit, HAR, and HTML report generators', 
      active: true,
      badge: 'Chromium',
      stat: 'Headless v1.40'
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 space-y-8 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 select-none">
      {/* Top Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
              <Unplug className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {isTr ? 'CI/CD & Jira MCP Entegrasyonları' : 'CI/CD & Jira MCP Integrations'}
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-bold border border-indigo-200 dark:border-indigo-800">
                Model Context Protocol
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isTr 
              ? 'Jira defect takibi, GitHub Actions test tetikleme ve Slack hata uyarı kanalları.' 
              : 'Connect automated testing into continuous delivery pipelines and bug trackers.'}
          </p>
        </div>

        <button
          onClick={() => openModal('jira')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Settings2 className="w-4 h-4" />
          <span>{isTr ? 'Entegrasyon Yapılandır' : 'Configure Integrations'}</span>
        </button>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div 
            key={item.id} 
            data-testid={`integration-card-${item.id}`}
            onClick={() => openModal(item.id as any)}
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/90 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.id === 'jira' ? <Bug className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : <Unplug className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                {item.badge}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-slate-400 font-semibold">{item.stat}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 group-hover:underline">
                {isTr ? 'Ayarları Aç' : 'Manage Settings'} &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Jira MCP Defect Stream Section */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                {isTr ? 'Jira MCP ile Açılan Canlı Hata Biletleri' : 'Live Defects Logged via Jira MCP'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isTr ? 'Test adımlarında başarısız olan senaryolar ekran görüntüleri ve dökümleriyle Jira panosuna işlenmiştir.' : 'Test failures automatically posted to Jira board with step screenshot attachments.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => openModal('jira')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-bold transition-colors cursor-pointer"
          >
            {isTr ? 'Tüm Biletleri & Ayarları Gör' : 'View All Tickets & Settings'}
          </button>
        </div>

        <div className="space-y-3">
          {jiraIssues.map((issue) => (
            <div 
              key={issue.id}
              className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-mono font-black text-xs">
                  {issue.key}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {issue.summary}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 whitespace-pre-line line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-semibold">
                    <span>{isTr ? 'Hedef Pano:' : 'Board:'} <strong className="text-slate-700 dark:text-slate-300">{issue.board}</strong></span>
                    <span>•</span>
                    <span>{isTr ? 'Durum:' : 'Status:'} <strong className="text-emerald-600 dark:text-emerald-400">{issue.status}</strong></span>
                    <span>•</span>
                    <span>{issue.createdAt}</span>
                  </div>
                </div>
              </div>

              {issue.screenshotUrl && (
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <img
                    src={issue.screenshotUrl}
                    alt="Defect Snapshot"
                    className="w-20 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                  />
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                    <Camera className="w-2.5 h-2.5 text-indigo-500" /> {isTr ? 'Ekran Görüntüsü' : 'Screenshot'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <IntegrationsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lang={lang}
        initialTab={selectedTab}
      />
    </div>
  );
};

export const RepositoryView: React.FC<ViewProps> = ({ lang }) => {
  const isTr = lang === 'tr';
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  const files = [
    {
      name: 'flowshop_home_live.png',
      type: isTr ? 'Full HD Canlı Ekran Görüntüsü' : 'Full HD Live Screenshot',
      size: '507 KB',
      time: 'Bugün 13:43',
      scenarioTitle: isTr ? 'FlowShop TR: FlowShop Studio Wireless E2E Arama ve İnceleme' : 'FlowShop TR: Studio Wireless E2E Flow',
      stepName: isTr ? 'Ana Sayfa Yükleme & Başlık Doğrulama' : 'Storefront Landing & Title Verification',
      url: 'https://flowshop-tr.mock/',
      status: 'passed',
      duration: '2.1s',
      screenshotUrl: '/screenshots/flowshop_home_live.png',
      description: isTr 
        ? 'Playwright Chromium motoruyla FlowShop TR ana sayfası yüklendi. Sayfa başlığı (<title>) ve navigasyon bileşenleri başarıyla doğrulandı.' 
        : 'FlowShop TR storefront rendered with Chromium engine. Page title and top navigation elements verified successfully.',
      assertions: [
        { text: isTr ? 'HTTP 200 OK yanıtı alındı' : 'HTTP 200 OK response received', passed: true },
        { text: isTr ? 'DOM Başlığı: "FlowShop - QA Automation Demo Store"' : 'DOM Title: "FlowShop - QA Automation Demo Store"', passed: true },
        { text: isTr ? 'Çerez onay bannerı tespit edildi ve onaylandı' : 'Cookie consent banner detected and accepted', passed: true },
        { text: isTr ? 'Arama kutusu (#search-input) görünür ve aktif' : 'Search input (#search-input) visible and active', passed: true }
      ]
    },
    {
      name: 'flowshop_pdp.png',
      type: isTr ? 'FlowShop Studio Wireless Ürün Detayı (PDP) Ekranı' : 'FlowShop Studio Wireless PDP View',
      size: '408 KB',
      time: 'Bugün 13:43',
      scenarioTitle: isTr ? 'FlowShop TR: Studio Wireless E2E Akışı' : 'FlowShop TR: Studio Wireless E2E Flow',
      stepName: isTr ? 'Studio Wireless Donanım & Fiyat Doğrulama (PDP)' : 'Studio Wireless Specs & Pricing (PDP)',
      url: 'https://flowshop-tr.mock/products/studio-wireless/',
      status: 'passed',
      duration: '1.9s',
      screenshotUrl: '/screenshots/flowshop_pdp.png',
      description: isTr 
        ? 'FlowShop kablosuz kulaklık PDP sayfası tarandı. Hibrit Aktif Gürültü Engelleme (ANC), 40mm dinamik sürücüler, ürün fiyatı ve Sepete Ekle butonu teyit edildi.' 
        : 'FlowShop wireless headphone product detail page inspected. Hybrid ANC, 40mm drivers, pricing, and Add to Cart button verified.',
      assertions: [
        { text: isTr ? 'Ürün başlığı (#product-title) görünür' : 'Product heading (#product-title) visible', passed: true },
        { text: isTr ? 'Donanım özellikleri: Hibrit ANC & 40mm Sürücü teyit edildi' : 'Hardware specs: Hybrid ANC & 40mm Drivers verified', passed: true },
        { text: isTr ? 'Stok durumu "In Stock" doğrulandı' : 'Stock status "In Stock" verified', passed: true },
        { text: isTr ? 'Sepete Ekle butonu tıklanabilir durumda' : 'Add to Cart CTA clickable', passed: true }
      ]
    },
    {
      name: 'flowshop_category.png',
      type: isTr ? 'Ses Sistemleri Kategori Ekranı' : 'Audio Gear Category Grid',
      size: '413 KB',
      time: 'Bugün 13:43',
      scenarioTitle: isTr ? 'FlowShop TR: Kategori ve Filtreleme Testi' : 'FlowShop TR: Category & Filter Suite',
      stepName: isTr ? 'Ses Sistemleri Ürün Listelemesi & Filtreleme' : 'Audio Gear Listing & Filter Assertions',
      url: 'https://flowshop-tr.mock/audio-gear/',
      status: 'passed',
      duration: '2.4s',
      screenshotUrl: '/screenshots/flowshop_category.png',
      description: isTr 
        ? 'Ses Sistemleri kategorisinde kulaklık ve hoparlör kartları listelendi, Kablosuz filtresi uygulandı ve fiyat sıralaması doğrulandı.' 
        : 'Audio Gear catalog grid rendered. Wireless filter and price sorting verified.',
      assertions: [
        { text: isTr ? 'Kategori ızgarasında ürün kartları listelendi' : 'Product cards listed in catalog grid', passed: true },
        { text: isTr ? 'Kablosuz & Bluetooth 5.3 filtresi uygulandı' : 'Wireless & Bluetooth 5.3 filter applied', passed: true },
        { text: isTr ? 'Sayfalama (Pagination) bileşeni hazır' : 'Pagination component verified', passed: true }
      ]
    },
    {
      name: 'flowshop_checkout_3dsecure_fail.png',
      type: isTr ? 'Ödeme & 3D Secure Hata İzi (Failed Trace)' : 'Checkout & 3D Secure Defect Trace',
      size: '482 KB',
      time: 'Bugün 12:15',
      scenarioTitle: 'FlowShop TR: Checkout & 3D Secure Güvenlik Doğrulaması',
      stepName: isTr ? 'Ödeme Ağ Geçidi & 3D Secure Doğrulama' : 'Payment Gateway & 3D Secure Validation',
      url: 'https://flowshop-tr.mock/checkout/',
      status: 'failed',
      duration: '5.2s',
      screenshotUrl: '/screenshots/flowshop_category.png',
      description: isTr 
        ? 'Ödeme onay aşamasında banka 3D Secure iframe modülünün yüklenmesi beklendi fakat API zaman aşımına uğradı.' 
        : 'Payment gateway iframe was expected on checkout step, but the payment provider API returned a timeout.',
      errorTitle: 'AssertionError: Expected 3D Secure frame to load within 5000ms',
      errorDescription: isTr 
        ? 'Playwright motoru ödeme aşamasında "#payment-gateway-iframe" seçicisini 5000ms boyunca bekledi. Banka entegrasyonu HTTP 504 Gateway Timeout döndürdüğü için assertion başarısız oldu.'
        : 'Playwright engine timed out after 5000ms waiting for "#payment-gateway-iframe". The payment gateway API returned HTTP 504 Gateway Timeout.',
      errorStack: `Error: page.waitForSelector: Timeout 5000ms exceeded.
  waiting for locator("#payment-gateway-iframe") to be visible
  at CheckoutFlow.verifyPaymentGateway (engine.js:142:15)
  at async runScenarioStep (runner.js:89:9)
  at async executePipeline (runner/engine.js:210:12)`,
      assertions: [
        { text: 'Sepet toplamı ₺4.999 doğrulandı', passed: true },
        { text: 'Teslimat adresi formu dolduruldu', passed: true },
        { text: '3D Secure iframe modülü (#payment-gateway-iframe) yüklendi', passed: false }
      ]
    },
    {
      name: 'runs.json',
      type: isTr ? 'Gerçek Yürütme Log Veritabanı' : 'Real Execution Runs Database',
      size: '16.4 KB',
      time: 'Bugün 13:43',
      isJson: true,
      scenarioTitle: 'OmniFlow QA Telemetry Engine',
      stepName: isTr ? 'Tüm Otomasyon Koşuları & DOM İzleri' : 'All Automation Runs & DOM Traces',
      url: `${API_BASE}/runs`,
      status: 'passed',
      duration: '11.4s',
      description: isTr 
        ? 'Playwright motoru tarafından icra edilen tüm senaryoların süreleri, adım sonuçları, ekran görüntüleri ve DOM log kayıtlarını içeren birleşik telemetri JSON dosyası.' 
        : 'Unified telemetry runs JSON database containing step timestamps, assertion logs, and screenshot URLs.'
    }
  ];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(files, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatchJira = (file: any) => {
    window.dispatchEvent(
      new CustomEvent('jira-create-defect', {
        detail: {
          scenarioTitle: file.scenarioTitle,
          stepName: file.stepName,
          errorMessage: file.errorTitle || 'Step Trace Inspection',
          screenshot: file.screenshotUrl || '/screenshots/flowshop_home_live.png'
        }
      })
    );
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 select-none">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {isTr ? 'Test Deposu & İz Dosyaları (Traces)' : 'Test Repository & Playwright Traces'}
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-mono text-xs font-bold border border-sky-200 dark:border-sky-800">
                {files.length} {isTr ? 'Dosya' : 'Files'}
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isTr 
              ? 'Yürütülen testlerin ekran görüntüleri, Playwright DOM izleri ve hata kayıtları. İncelemek için herhangi bir dosyaya tıklayın.' 
              : 'Inspect Playwright traces, network waterfall files, and step screenshots. Click any file to open the inspection lightbox.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-2xs">
            💾 {isTr ? 'Depo Boyutu: 1.8 MB' : 'Repo Size: 1.8 MB'}
          </span>
        </div>
      </div>

      {/* Files List Table */}
      <div className="space-y-2.5">
        {files.map((file, i) => (
          <div 
            key={i} 
            data-testid={`repo-file-${i}`}
            onClick={() => setSelectedFile(file)}
            className={`p-4 bg-white dark:bg-slate-800 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs group
              ${file.status === 'failed' 
                ? 'border-rose-200 dark:border-rose-900/80 hover:border-rose-400 hover:shadow-md bg-rose-50/20 dark:bg-rose-950/10' 
                : 'border-slate-200/90 dark:border-slate-700/90 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md'}
            `}
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                ${file.status === 'failed' 
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400' 
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}
              `}>
                {file.isJson ? (
                  <FileText className="w-5 h-5 text-indigo-500" />
                ) : file.status === 'failed' ? (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                ) : (
                  <Camera className="w-5 h-5 text-emerald-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {file.name}
                  </span>
                  {file.status === 'failed' ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      FAILED TRACE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      PASSED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="truncate">{file.scenarioTitle || file.type}</span>
                  <span>•</span>
                  <span className="font-mono text-[10px]">{file.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-[11px] font-mono text-slate-400">{file.time}</span>
              <button 
                type="button"
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 group-hover:border-indigo-300"
              >
                {isTr ? 'İncele' : 'Inspect'} &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rich Trace & Screenshot Inspection Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs
                  ${selectedFile.status === 'failed' 
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600' 
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'}
                `}>
                  {selectedFile.isJson ? <FileText className="w-5 h-5" /> : selectedFile.status === 'failed' ? <AlertTriangle className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedFile.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black
                      ${selectedFile.status === 'failed' 
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800' 
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'}
                    `}>
                      {selectedFile.status === 'failed' ? 'FAIL / HATA ALINDI' : 'SUCCESS / BAŞARILI'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedFile.type} • {selectedFile.size} • {selectedFile.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="Zoom Görüntü"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  data-testid="close-repo-modal"
                  onClick={() => setSelectedFile(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Image Preview Container */}
              {selectedFile.screenshotUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950/90 relative group shadow-sm flex items-center justify-center">
                  <img
                    src={selectedFile.screenshotUrl}
                    alt={selectedFile.name}
                    className={`w-full object-contain transition-all duration-300 ${isZoomed ? 'max-h-[550px] scale-105' : 'max-h-72'}`}
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[10px] font-bold">
                    PLAYWRIGHT CHROMIUM 1920x1080 VIEWPORT
                  </div>
                </div>
              )}

              {/* Scenario & Step Context Info */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/90 dark:border-slate-700/90 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Hedef Senaryo</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 block">{selectedFile.scenarioTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Test Adımı</span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5 block">{selectedFile.stepName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Hedef URL & İcra</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a href={selectedFile.url} target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-mono text-[11px] truncate flex items-center gap-1">
                        {selectedFile.url} <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[10px] font-bold">{selectedFile.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-2.5">
                  {selectedFile.description}
                </p>
              </div>

              {/* If FAILED: Red Box with Error Title, Explanation & Stack Trace */}
              {selectedFile.status === 'failed' && (
                <div className="p-5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/80 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-sm text-rose-800 dark:text-rose-200">
                        {selectedFile.errorTitle}
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                        {selectedFile.errorDescription}
                      </p>
                    </div>
                  </div>

                  {selectedFile.errorStack && (
                    <div className="bg-slate-950 rounded-xl p-3 text-[11px] font-mono text-rose-300 border border-slate-800 overflow-x-auto">
                      <div className="text-slate-500 text-[10px] font-bold mb-1">// Playwright Trace / Stack Trace:</div>
                      <pre className="whitespace-pre">{selectedFile.errorStack}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Step Assertions Checklist */}
              {selectedFile.assertions && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {isTr ? 'Adım Doğrulama Kontrolleri (Assertions)' : 'Step Assertions & Validations'}
                  </h4>
                  <div className="space-y-1.5">
                    {selectedFile.assertions.map((ast: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between
                          ${ast.passed 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200' 
                            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 font-bold'}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {ast.passed ? (
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          )}
                          <span>{ast.text}</span>
                        </div>
                        <span className="font-mono text-[10px] uppercase font-bold">
                          {ast.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special JSON Viewer for runs.json */}
              {selectedFile.isJson && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">JSON Telemetri Veritabanı Görüntüleyici</span>
                    <button
                      onClick={handleCopyJson}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Kopyalandı' : 'JSON Kopyala'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-2xl border border-slate-800 max-h-64 overflow-y-auto leading-relaxed">
                    {JSON.stringify(files, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                {selectedFile.screenshotUrl && (
                  <a
                    href={selectedFile.screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isTr ? 'Görseli Yeni Sekmede Aç' : 'Open in New Tab'}</span>
                  </a>
                )}

                {selectedFile.status === 'failed' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDispatchJira(selectedFile);
                      setSelectedFile(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bug className="w-3.5 h-3.5" />
                    <span>{isTr ? 'Jira MCP ile Hata Bileti Aç' : 'Create Jira Defect'}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
              >
                {isTr ? 'Kapat' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
