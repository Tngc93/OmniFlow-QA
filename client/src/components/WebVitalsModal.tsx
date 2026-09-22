import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Search, 
  Gauge, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Language } from '../locales/translations';

interface WebVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  initialStore?: 'novaTr' | 'novaDe' | 'monsterTr' | 'tulparDe';
}

export const WebVitalsModal: React.FC<WebVitalsModalProps> = ({
  isOpen,
  onClose,
  lang = 'tr',
  initialStore = 'novaTr'
}) => {
  const normalizedInitial = (initialStore === 'tulparDe' || initialStore === 'novaDe') ? 'novaDe' : 'novaTr';
  const [selectedStore, setSelectedStore] = useState<'novaTr' | 'novaDe'>(normalizedInitial);
  const [isAuditing, setIsAuditing] = useState(false);
  const isTr = lang === 'tr';

  useEffect(() => {
    setSelectedStore((initialStore === 'tulparDe' || initialStore === 'novaDe') ? 'novaDe' : 'novaTr');
  }, [initialStore]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleReAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
    }, 1200);
  };

  const storeData = selectedStore === 'novaTr' ? {
    domain: 'novatech.com.tr',
    name: 'NovaTech Türkiye',
    flag: '🇹🇷',
    currency: 'TRY (₺)',
    scores: {
      performance: 94,
      accessibility: 96,
      bestPractices: 100,
      seo: 98
    },
    vitals: [
      { key: 'LCP', name: isTr ? 'En Büyük İçerikli Boyama' : 'Largest Contentful Paint', value: '1.34s', target: '< 2.5s', status: 'good', score: 98, desc: isTr ? 'Hero banner & ürün ana görseli' : 'Hero banner & main product visual' },
      { key: 'INP', name: isTr ? 'Sonraki Boyamayla Etkileşim' : 'Interaction to Next Paint', value: '84ms', target: '< 200ms', status: 'good', score: 96, desc: isTr ? 'Sepete ekle & varyant seçimi tepkisi' : 'Add to cart & variant switch latency' },
      { key: 'CLS', name: isTr ? 'Kümülatif Düzen Kayması' : 'Cumulative Layout Shift', value: '0.014', target: '< 0.10', status: 'good', score: 99, desc: isTr ? 'Ödeme formu ve buton kayma stabilitesi' : 'Checkout form & layout stability' },
      { key: 'FCP', name: isTr ? 'İlk İçerikli Boyama' : 'First Contentful Paint', value: '0.78s', target: '< 1.8s', status: 'good', score: 95, desc: isTr ? 'Header & navigasyon DOM belirmesi' : 'Header & navigation DOM render' },
      { key: 'TTFB', name: isTr ? 'İlk Bayta Kadar Geçen Süre' : 'Time to First Byte', value: '142ms', target: '< 800ms', status: 'good', score: 94, desc: isTr ? 'Cloudflare Edge CDN yanıt hızı' : 'Cloudflare Edge CDN latency' },
      { key: 'SI', name: isTr ? 'Hız İndeksi' : 'Speed Index', value: '1.45s', target: '< 3.4s', status: 'good', score: 97, desc: isTr ? 'Görsel içeriğin kullanıcıya dolum hızı' : 'Visual viewport fill rate' }
    ],
    conversionImpact: isTr 
      ? 'Mevcut LCP ve CLS hız puanı sepet terk oranını %14 azaltmakta, dönüşüm oranını ise tahmini %8.2 artırmaktadır.'
      : 'Current LCP and CLS scores reduce cart abandonment by ~14% and improve checkout conversion by +8.2%.'
  } : {
    domain: 'novatech.de',
    name: 'NovaTech Deutschland',
    flag: '🇩🇪',
    currency: 'EUR (€)',
    scores: {
      performance: 97,
      accessibility: 98,
      bestPractices: 100,
      seo: 99
    },
    vitals: [
      { key: 'LCP', name: isTr ? 'En Büyük İçerikli Boyama' : 'Largest Contentful Paint', value: '1.12s', target: '< 2.5s', status: 'good', score: 99, desc: isTr ? 'NovaTech Titan X17 ürün görseli & WebP' : 'NovaTech Titan X17 visual & WebP load' },
      { key: 'INP', name: isTr ? 'Sonraki Boyamayla Etkileşim' : 'Interaction to Next Paint', value: '68ms', target: '< 200ms', status: 'good', score: 98, desc: isTr ? 'Konfigüratör RAM/SSD seçim tepkisi' : 'Configurator RAM/SSD switch latency' },
      { key: 'CLS', name: isTr ? 'Kümülatif Düzen Kayması' : 'Cumulative Layout Shift', value: '0.008', target: '< 0.10', status: 'good', score: 100, desc: isTr ? 'Cookiebot DSGVO & sepet çekmecesi' : 'Cookiebot DSGVO & cart drawer stability' },
      { key: 'FCP', name: isTr ? 'İlk İçerikli Boyama' : 'First Contentful Paint', value: '0.65s', target: '< 1.8s', status: 'good', score: 98, desc: isTr ? 'Avrupa AWS Frankfurt Edge noktası' : 'Frankfurt AWS CloudFront Edge point' },
      { key: 'TTFB', name: isTr ? 'İlk Bayta Kadar Geçen Süre' : 'Time to First Byte', value: '118ms', target: '< 800ms', status: 'good', score: 97, desc: isTr ? 'Nginx + HTTP/3 sunucu yanıt süresi' : 'Nginx + HTTP/3 server response time' },
      { key: 'SI', name: isTr ? 'Hız İndeksi' : 'Speed Index', value: '1.28s', target: '< 3.4s', status: 'good', score: 98, desc: isTr ? 'Almanya genelinde ultra hızlı algılanan hız' : 'Ultra-fast perceived loading in DACH' }
    ],
    conversionImpact: isTr 
      ? 'Almanya/DACH pazarında 1.12s LCP ile Klarna Sofort ve PayPal Express ödeme tamamlama akıcılığı maksimum seviyededir.'
      : 'In the DACH market, 1.12s LCP maximizes Klarna Sofort and PayPal Express checkout flow completion.'
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isTr ? 'Google Core Web Vitals & E-Ticaret Hız Skoru' : 'Google Core Web Vitals & E-Com Speed Scorecard'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Lighthouse 11.4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isTr 
                  ? 'Kullanıcı deneyimi, LCP render hızı ve sepet dönüşüm metrikleri'
                  : 'Real user experience, LCP paint velocity and checkout conversion metrics'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Store Toggle */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                data-testid="store-vitals-tr"
                onClick={() => setSelectedStore('novaTr')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedStore === 'novaTr'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🇹🇷</span>
                <span>NovaTech TR</span>
              </button>
              <button
                data-testid="store-vitals-de"
                onClick={() => setSelectedStore('novaDe')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedStore === 'novaDe'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🇩🇪</span>
                <span>NovaTech DE</span>
              </button>
            </div>

            <button
              onClick={handleReAudit}
              disabled={isAuditing}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Denetimi Yeniden Çalıştır"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-amber-500' : ''}`} />
              <span>{isAuditing ? (isTr ? 'Ölçülüyor...' : 'Auditing...') : (isTr ? 'Yenile' : 'Refresh')}</span>
            </button>

            <button 
              onClick={onClose} 
              data-testid="web-vitals-modal-close"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top 4 Lighthouse Scores Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-2xl text-emerald-600 dark:text-emerald-400 shadow-sm mb-2 bg-white dark:bg-slate-900">
                {storeData.scores.performance}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isTr ? 'Performans' : 'Performance'}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                90-100 (Good)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/5 to-sky-500/10 border border-sky-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border-4 border-sky-500 flex items-center justify-center font-black text-2xl text-sky-600 dark:text-sky-400 shadow-sm mb-2 bg-white dark:bg-slate-900">
                {storeData.scores.accessibility}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isTr ? 'Erişilebilirlik' : 'Accessibility'}
              </span>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                WCAG 2.1 AA
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center font-black text-2xl text-indigo-600 dark:text-indigo-400 shadow-sm mb-2 bg-white dark:bg-slate-900">
                {storeData.scores.bestPractices}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isTr ? 'En İyi Pratikler' : 'Best Practices'}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                HTTPS, HTTP/3
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center font-black text-2xl text-purple-600 dark:text-purple-400 shadow-sm mb-2 bg-white dark:bg-slate-900">
                {storeData.scores.seo}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                SEO
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                Schema.org Product
              </span>
            </div>
          </div>

          {/* Core Web Vitals 6 Key Metrics Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                {isTr ? 'Google Core Web Vitals Detaylı E-Ticaret Metrikleri' : 'Google Core Web Vitals Detailed Breakdown'}
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Target: Google CWV 2026 Standards
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {storeData.vitals.map((item) => (
                <div 
                  key={item.key}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs hover:border-emerald-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {item.key}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Good
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-3 mb-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {item.value}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.target}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Business & Conversion Impact Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                {isTr ? 'E-Ticaret Dönüşüm ve Gelir Etkisi (Conversion Impact)' : 'E-Commerce Conversion & Revenue Impact'}
              </h5>
              <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 mt-1 leading-relaxed">
                {storeData.conversionImpact}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{storeData.name} ({storeData.domain}) • Lighthouse Telemetry</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            {isTr ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
