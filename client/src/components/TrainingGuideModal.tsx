import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  GitBranch, 
  MousePointer, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Play, 
  Cpu, 
  Zap, 
  Database, 
  ExternalLink,
  BookOpen,
  CalendarClock,
  Bug,
  Lock,
  UserCheck,
  Trash2,
  Unlink,
  Camera,
  FolderPlus,
  Search,
  MoreVertical,
  Check
} from 'lucide-react';
import { Language } from '../locales/translations';

interface TrainingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TrainingGuideModal: React.FC<TrainingGuideModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isTr = lang === 'tr';
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const trainingModules = [
    {
      id: 'mod-1',
      title: isTr ? '1. Mağaza Projesi & Akıllı URL Tarama' : '1. Store Project & Smart URL Scanner',
      desc: isTr 
        ? 'Herhangi bir e-ticaret sitesinin URL’ini girin; sistem 7 kritik rotayı otomatik haritalandırır.'
        : 'Enter any store URL; OmniFlow AI maps 7 critical conversion and checkout routes automatically.',
      icon: <FolderPlus className="w-5 h-5 text-rose-500" />,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {isTr 
              ? 'Sol menüden "+ Yeni Klasör" butonuna basarak mağazanızın adresini girin (örn: https://www.novatech.com.tr). Akıllı URL Tarayıcı, siteyi anında analiz ederek arama, kategori, ürün detay (PDP), sepet, ödeme ve üye girişi yollarını otomatik ayrıştırır.'
              : 'Click "+ New Folder" and provide your target storefront URL (e.g. https://www.novatech.com.tr). The built-in scanner detects storefront, search, PDP, cart, checkout, and login endpoints in real time.'}
          </p>

          {/* Visual Route Discovery Blueprint */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-3 font-mono">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800">
              <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> [SMART_URL_SCANNER_v2]
              </span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] rounded-full border border-emerald-800">
                7 ROTA EŞLEŞTİ (100% COVERAGE)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">STOREFRONT:</span>
                <span className="text-indigo-300">https://www.novatech.com.tr/</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">SEARCH:</span>
                <span className="text-emerald-300">/arama?q=horizon</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">CATEGORY (PLP):</span>
                <span className="text-sky-300">/oyun-bilgisayarlari</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">PRODUCT (PDP):</span>
                <span className="text-amber-300">/horizon-x15/</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">CART:</span>
                <span className="text-rose-300">/sepet/</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">AUTH / LOGIN:</span>
                <span className="text-purple-300">/uye-girisi/</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mod-2',
      title: isTr ? '2. Test Müşteri Kimlik Kasası (Auth Vault)' : '2. Store Test Credentials (Auth Vault)',
      desc: isTr
        ? 'Playwright testlerinin üye girişi yapabilmesi ve kayıtlı sepeti test edebilmesi için kimlik kasası.'
        : 'Store customer email and password vault to allow Playwright authenticated checkout verification.',
      icon: <UserCheck className="w-5 h-5 text-emerald-500" />,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {isTr
              ? 'E-ticaret sitelerinde misafir alışverişin yanı sıra kayıtlı üye sepeti, adres seçimi ve "Hesabım" akışlarının test edilmesi zorunludur. Proje oluşturulurken veya "Ayarlar" menüsünden test müşterisi e-posta ve şifresi tanımlanır. Playwright bu bilgileri güvenle form alanlarına aktarır.'
              : 'Authenticated checkout, saved addresses, and profile verification require real login credentials. Configure your dedicated QA customer credentials during project creation or via Settings.'}
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                {isTr ? 'Aktif Mağaza Test Kasası' : 'Active Store Auth Vault'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold">
                AES-256 SECURED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-400 font-sans block">Test Müşteri E-Postası:</span>
                <span className="text-slate-800 dark:text-slate-100 font-bold">qa.testuser@novatech.com.tr</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-400 font-sans block">Test Müşteri Şifresi:</span>
                <span className="text-slate-800 dark:text-slate-100 font-bold">••••••••••••• (NovaTechQA!2026Secure)</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mod-3',
      title: isTr ? '3. Görsel Tuval & Düğüm Yönetimi (3 Nokta / Sağ Tık)' : '3. Canvas Orchestration & Node Management',
      desc: isTr
        ? 'Düğümler ferah 240px aralıklarla dizilir; 3 nokta veya sağ tık ile silme, bağlantı kesme ve düzenleme yapılır.'
        : 'Nodes feature 240px breathing room. Click 3-dots or right-click to delete, disconnect, or edit nodes.',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {isTr
              ? 'Kontrol panelindeki tuval üzerinde her adım kartı 240px dikey boşlukla yerleşir ve birbirini asla perdelemez. Sağ paneldeki "Flow Objectives" listesinden yeni adım ekleyebilir, tuvaldeki herhangi bir adımın üzerine gelip 3 noktaya (•••) basarak veya sağ tıklayarak silebilirsiniz.'
              : 'Flow nodes are vertically spaced at 240px intervals to ensure clear edge paths. Hover over any card and click 3-dots (•••) or right-click to access deletion and configuration actions.'}
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <MoreVertical className="w-4 h-4 text-indigo-600" />
              {isTr ? 'Düğüm Aksiyon Menüsü Seçenekleri:' : 'Node Context Menu Actions:'}
            </h5>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-rose-600 dark:text-rose-400 block">Adımı Sil (Delete Node)</span>
                  <span className="text-[10px] text-slate-400">Düğümü ve bağlı tüm okları tuvalden kaldırır.</span>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Unlink className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">Bağlantıları Kes (Unlink)</span>
                  <span className="text-[10px] text-slate-400">Gelen ve giden tüm bağlantı çizgilerini çözer.</span>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Bu Adımı Test Et</span>
                  <span className="text-[10px] text-slate-400">Yalnızca bu adımı Playwright ile çalıştırır.</span>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Bug className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-sky-600 dark:text-sky-400 block">Jira MCP'ye İlet</span>
                  <span className="text-[10px] text-slate-400">Bu adımdaki hatayı doğrudan panoya aktarır.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mod-4',
      title: isTr ? '4. Playwright ile Canlı Test İcrası & Ekran Görüntüleri' : '4. Playwright Live Automation & Step Screenshots',
      desc: isTr
        ? 'Gerçek Chromium tarayıcısı siteyi açar, DOM testlerini yapar ve her adımda Full HD ekran görüntüsü alır.'
        : 'Real Playwright Chromium browser loads the storefront, validates DOM, and captures step snapshots.',
      icon: <Play className="w-5 h-5 text-emerald-500" />,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {isTr
              ? '"Canlı Akışı Başlat" butonuna tıkladığınızda Playwright motoru arka planda Chromium tarayıcısını başlatır. WebSocket köprüsü ile tuvaldeki adımlar sırayla sarı (çalışıyor), yeşil (başarılı) ve kırmızı (hatalı) renklerle aydınlanır. Her adımın gerçek ekran görüntüsü karta ve sağ galeriye anında eklenir.'
              : 'Click "Run Live Flow" to launch the headless Playwright engine. WebSocket events update node badges in real time and capture high-definition step screenshots.'}
          </p>

          <div className="p-3 bg-slate-900 rounded-2xl flex items-center justify-around text-[10px] font-mono text-white">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Chromium v124.0.0</span>
            </div>
            <span>•</span>
            <span className="text-indigo-300">Avg Step Time: 1.8s</span>
            <span>•</span>
            <span className="text-emerald-300">214 Assertions Passed</span>
            <span>•</span>
            <span className="text-amber-300 flex items-center gap-1">
              <Camera className="w-3 h-3" /> Live Snapshots: 7
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'mod-5',
      title: isTr ? '5. Çoklu Senaryo Zamanlayıcı (Cron Job Schedules)' : '5. Multi-Scenario Scheduled Cron Jobs',
      desc: isTr
        ? 'Yeni Görev Zamanla penceresinde 1\'den fazla senaryo seçilerek otomatik gece testleri kurgulanabilir.'
        : 'Schedule automated test suites selecting multiple target scenarios with cron intervals.',
      icon: <CalendarClock className="w-5 h-5 text-violet-500" />,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {isTr
              ? 'Sol menüdeki "Zamanlayıcı" sekmesinden "+ Yeni Görev Zamanla" butonuna tıklayın. Açılan pencerede tek tek arama yaparak veya "Tümünü Seç" ile 1’den fazla senaryoyu aynı göreve ekleyin. Cron ifadesi ile her gece 02:00 veya her 30 dakikada bir otomatik çalışmasını sağlayın.'
              : 'Navigate to Scheduler and click "+ Schedule New Job". Select multiple target scenarios with searchable checkboxes, configure your cron expression (e.g. daily at 02:00), and let the engine test your store unattended.'}
          </p>

          <div className="p-3.5 bg-violet-50 dark:bg-violet-950/40 rounded-2xl border border-violet-200 dark:border-violet-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-violet-900 dark:text-violet-200">
              <span>Seçilen Hedef Senaryolar (Multi-Select Preview)</span>
              <span className="px-2 py-0.5 rounded bg-violet-200 dark:bg-violet-900 text-violet-800 dark:text-violet-200 font-mono text-[10px]">
                3 Senaryo Seçili
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>NovaTech TR: Horizon X15 E2E Arama ve İnceleme</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>NovaTech TR: Oyun Bilgisayarları Kategori & Filtre</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>NovaTech TR: Mobil Responsive & Menü</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mod-6',
      title: isTr ? '6. Jira MCP Entegrasyonu & Ekran Görüntülü Hata Bildirimi' : '6. Jira MCP Connector & Defect Auto-Logging',
      desc: isTr
        ? 'Test adımlarında bir hata oluştuğunda Jira panosunda başlık, açıklama ve ekran görüntüsü ile bilet açılır.'
        : 'Automatically file bug tickets into your Jira sprint board with attached step screenshots.',
      icon: <Bug className="w-5 h-5 text-sky-500" />,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {isTr
              ? 'Entegrasyonlar menüsünden veya tuvaldeki "Jira MCP" butonundan Atlassian Jira Cloud hesabınızı bağlayın. Otomasyon motoru sepet, ödeme veya stok adımlarında bir hata yakaladığında otomatik olarak belirtilen Board üzerinde bilet (Bug) açar. Biletin içinde adım adı, DOM hata detayı ve hata anında yakalanan ekran görüntüsü yer alır.'
              : 'Connect your Atlassian Jira board using the Jira MCP Connector. When a test failure occurs, OmniFlow automatically creates a Bug ticket with step summary, DOM logs, and screenshot attachment.'}
          </p>

          {/* Jira Mock Ticket Preview */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-mono font-bold text-xs">
                  NOVA-412
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 text-[10px] font-bold">
                  Bug (Defect)
                </span>
                <span className="text-slate-400 text-[10px]">BOARD-104 QA Sprint</span>
              </div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                [E2E QA] NovaTech PDP: Renk Varyant Seçiminde Sepet Senkronizasyon Gecikmesi
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                Playwright E2E Otomasyonu sırasında Titan X17 modelinde donanım seçildiğinde DOM sepet güncellemesi 2500ms üzerinde sürdü.
              </p>
            </div>

            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <img
                src="/screenshots/novatech_pdp.png"
                alt="Jira Bug"
                className="w-16 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
              />
              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                <Camera className="w-2.5 h-2.5 text-indigo-500" /> Ekli Görsel
              </span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {isTr ? 'A\'dan Z\'ye E-Ticaret QA Otomasyon Kılavuzu' : 'A-to-Z E-Commerce QA Automation Guide'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-800">
                  Master Training
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isTr ? 'Proje klasörü oluşturmaktan Jira MCP hata takibine uçtan uca kullanım rehberi.' : 'End-to-end user guide from store setup to Jira MCP defect workflows.'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6-Step Horizontal Navigator */}
        <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
          {trainingModules.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3 text-left transition-all border-b-2 flex flex-col justify-between ${
                activeStep === idx 
                  ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-2xs' 
                  : 'border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-900/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                  activeStep === idx ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-[11px] font-bold truncate text-slate-800 dark:text-slate-200">
                  {mod.title.split('.')[1]?.trim() || mod.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Active Module Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {trainingModules[activeStep].icon}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {trainingModules[activeStep].title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {trainingModules[activeStep].desc}
              </p>
            </div>
          </div>

          {trainingModules[activeStep].content}
        </div>

        {/* Modal Footer with Previous / Next Step Buttons */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              activeStep === 0 
                ? 'border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-600 cursor-not-allowed' 
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            &larr; {isTr ? 'Önceki Bölüm' : 'Previous Chapter'}
          </button>

          <span className="text-xs font-mono text-slate-400">
            {activeStep + 1} / {trainingModules.length}
          </span>

          {activeStep < trainingModules.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.min(trainingModules.length - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span>{isTr ? 'Sonraki Bölüm' : 'Next Chapter'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isTr ? 'Kılavuzu Tamamla & Kapat' : 'Complete & Close'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
