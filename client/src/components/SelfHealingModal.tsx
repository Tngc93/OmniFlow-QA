import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  History, 
  Sliders, 
  Check,
  Layers,
  Wand2
} from 'lucide-react';
import { Language } from '../locales/translations';

interface SelfHealingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const SelfHealingModal: React.FC<SelfHealingModalProps> = ({
  isOpen,
  onClose,
  lang = 'tr'
}) => {
  const [isApplied, setIsApplied] = useState(false);
  const isTr = lang === 'tr';

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyAll = () => {
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
    }, 2500);
  };

  const healedRecords = [
    {
      id: 'heal-1',
      title: isTr ? 'Monster TR Sepete Ekle Butonu' : 'Monster TR Add to Cart CTA',
      store: '🇹🇷 monsternotebook.com.tr',
      brokenSelector: 'button#btn-add-cart-2026_x8a92',
      healedSelector: 'button[data-testid="pdp-add-to-cart"], button:has-text("Sepete Ekle")',
      reason: isTr ? 'Tailwind derlemesi sonrası dinamik hash ve React element ID değişimi' : 'Tailwind build CSS class hash mutation and dynamic React ID drift',
      strategy: isTr ? 'ARIA Rolü + İçerik Metni ("Sepete Ekle") + Fiyat Kartı Yakınlığı' : 'ARIA Role + Text Match ("Sepete Ekle") + Price Box Proximity',
      confidence: 98.8,
      status: 'Auto-Healed'
    },
    {
      id: 'heal-2',
      title: isTr ? 'Tulpar DE QWERTZ Klavye Konfigüratörü' : 'Tulpar DE QWERTZ Keyboard Selector',
      store: '🇩🇪 tulparnotebook.de',
      brokenSelector: 'div.configurator-step-keyboard > div:nth-child(3)',
      healedSelector: '[data-qa="spec-option-qwertz"], label:has-text("Deutsches Tastaturlayout")',
      reason: isTr ? 'A/B test varyantı ile DOM kapsayıcı hiyerarşisinin yer değiştirmesi' : 'Container layout shifted due to A/B test marketing variant',
      strategy: isTr ? 'Semantik Dil Etiketi + Bileşen Varlık Özniteliği' : 'Semantic Language Label + Component Attribute match',
      confidence: 97.9,
      status: 'Auto-Healed'
    },
    {
      id: 'heal-3',
      title: isTr ? 'Monster TR Yurtiçi Kargo Teslimat Seçimi' : 'Monster TR Yurtiçi Shipping Radio',
      store: '🇹🇷 monsternotebook.com.tr',
      brokenSelector: 'input#cargo-provider-yurtici',
      healedSelector: 'input[name="shipping_method"][value*="yurtici"]',
      reason: isTr ? 'Ödeme altyapısı güncellemesi sonrası öznitelik isim değişikliği' : 'Checkout payment SDK vendor update renamed input ID attribute',
      strategy: isTr ? 'Görsel Koordinat Yakınlığı + Bitişik Yurtiçi Logo Eşleşmesi' : 'Visual Geometry Proximity + Adjacent Logo Image OCR',
      confidence: 99.1,
      status: 'Auto-Healed'
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl cursor-default text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">
                  {isTr ? 'AI Kendi Kendini İyileştiren Seçici Motoru' : 'AI Self-Healing Selector Engine'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isTr ? '3 Kırılan Seçici Kurtarıldı' : '3 Broken Selectors Healed'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isTr ? 'Sıfır Bakımlı E-Ticaret Otomasyonu • Dinamik DOM İyileştirme Telemetrisi' : 'Zero-Maintenance E-Commerce Automation • Dynamic DOM Heuristic Telemetry'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            data-testid="self-healing-close"
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 select-none">
          {/* Top Performance Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                {isTr ? 'İzlenen Seçici Sayısı' : 'Monitored Selectors'}
              </span>
              <span className="text-2xl font-black text-white mt-1 font-mono">184</span>
              <span className="text-[10px] text-slate-500 mt-0.5">18 E2E Test Suite</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 flex flex-col">
              <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                {isTr ? 'İyileştirme Başarısı' : 'Healing Success'}
              </span>
              <span className="text-2xl font-black text-emerald-400 mt-1 font-mono">100%</span>
              <span className="text-[10px] text-emerald-500/80 mt-0.5">{isTr ? '3/3 Kırılma Önlendi' : '3/3 Breakages Prevented'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 flex flex-col">
              <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">
                {isTr ? 'Ortalama Güven Skoru' : 'Avg Confidence'}
              </span>
              <span className="text-2xl font-black text-indigo-400 mt-1 font-mono">98.6%</span>
              <span className="text-[10px] text-indigo-400/80 mt-0.5">{isTr ? 'Çoklu Sezgisel Eşleşme' : 'Multi-Heuristic Match'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex flex-col">
              <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                {isTr ? 'Flakiness Azalımı' : 'Flake Reduction'}
              </span>
              <span className="text-2xl font-black text-amber-400 mt-1 font-mono">-94.2%</span>
              <span className="text-[10px] text-amber-400/80 mt-0.5">{isTr ? 'Bakım Süresi Sıfırlandı' : 'Maintenance Time Saved'}</span>
            </div>
          </div>

          {/* Healed Selectors List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                {isTr ? 'Canlı İyileştirilen Seçiciler (Self-Healed DOM Registry)' : 'Self-Healed DOM Registry'}
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Playwright Auto-Recovery Active
              </span>
            </div>

            <div className="space-y-3">
              {healedRecords.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.store}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-400/90 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span>{item.reason}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        %{item.confidence} {isTr ? 'Uyum' : 'Match'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                        ⚡ {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Selector Mutation Diff Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40">
                      <div className="text-[10px] text-rose-400 font-bold uppercase mb-1">
                        {isTr ? '❌ Kırılan Eski Seçici' : '❌ Broken Selector'}
                      </div>
                      <code className="text-rose-300 text-[11px] break-all select-text">
                        {item.brokenSelector}
                      </code>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{isTr ? '✅ Otomatik İyileştirilen Seçici' : '✅ Auto-Healed Selector'}</span>
                      </div>
                      <code className="text-emerald-300 text-[11px] break-all select-text">
                        {item.healedSelector}
                      </code>
                    </div>
                  </div>

                  {/* Recovery Strategy Info */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isTr ? 'İyileştirme Sezgisi:' : 'Recovery Strategy:'} <strong className="text-slate-200">{item.strategy}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heuristic Strategy Weights */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40">
            <h5 className="text-xs font-bold text-indigo-200 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              {isTr ? 'Kullanılan 4 Katmanlı AI Sezgisellik Matrisi' : '4-Tier AI Heuristic Matrix'}
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400">1. ARIA Semantic Tree</span>
                <div className="font-bold text-indigo-400 mt-0.5">%35 Weight</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400">2. Coordinate Proximity</span>
                <div className="font-bold text-emerald-400 mt-0.5">%25 Weight</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400">3. Fuzzy Text Levenshtein</span>
                <div className="font-bold text-amber-400 mt-0.5">%25 Weight</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400">4. Historical Sibling Graph</span>
                <div className="font-bold text-purple-400 mt-0.5">%15 Weight</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isTr ? 'Tüm iyileştirmeler geriye dönük test kırılmalarını %0 seviyesinde tutar.' : 'All healed locators ensure 0% regression breakages.'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApplyAll}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isApplied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isApplied ? <Check className="w-3.5 h-3.5" /> : <Wand2 className="w-3.5 h-3.5" />}
              <span>{isApplied ? (isTr ? 'Seçiciler Senaryoya Yazıldı!' : 'Applied to Scenario!') : (isTr ? 'Tüm İyileştirmeleri Senaryoya Kaydet' : 'Apply All to Scenario')}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {isTr ? 'Kapat' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
