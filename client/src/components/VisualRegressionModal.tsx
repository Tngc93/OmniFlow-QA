import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Eye, 
  Sliders, 
  Layers, 
  Columns, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  Download, 
  Check, 
  Sparkles,
  MoveHorizontal
} from 'lucide-react';
import { Language } from '../locales/translations';

interface VisualRegressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  baselineUrl?: string;
  currentUrl?: string;
  stepName?: string;
  targetDomain?: string;
  lang?: Language;
}

export const VisualRegressionModal: React.FC<VisualRegressionModalProps> = ({
  isOpen,
  onClose,
  baselineUrl = '/screenshots/monster_home_live.png',
  currentUrl = '/screenshots/monster_home_live.png',
  stepName = 'Storefront & Hero Banner Layout',
  targetDomain = 'monsternotebook.com.tr',
  lang = 'tr'
}) => {
  const [viewMode, setViewMode] = useState<'slider' | 'diff' | 'sideBySide'>('slider');
  const [sliderPos, setSliderPos] = useState(50); // 0 - 100%
  const [tolerance, setTolerance] = useState(1.0); // %
  const [isAccepted, setIsAccepted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const isTr = lang === 'tr';
  const detectedDiff = 0.32; // 0.32% mismatch
  const isPassed = detectedDiff <= tolerance;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Mouse Drag for Split Slider
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percentage);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl cursor-default text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">
                  {isTr ? 'Görsel Regresyon & Piksel-Diff İnceleyici' : 'Visual Regression & Pixel-Diff Inspector'}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                  isPassed 
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' 
                    : 'bg-rose-950/60 text-rose-400 border-rose-800'
                }`}>
                  {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {isPassed ? (isTr ? `PASSED (%${detectedDiff} Fark)` : `PASSED (${detectedDiff}% Diff)`) : `FAILED (%${detectedDiff} Fark)`}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {stepName} • <span className="font-mono text-indigo-400">{targetDomain}</span> • 1920x1080 Viewport
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Selector */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl text-xs font-bold border border-slate-700">
              <button
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'slider'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Öncesi / Sonrası Kaydırıcı"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isTr ? 'Kaydırıcı' : 'Split Slider'}</span>
              </button>

              <button
                onClick={() => setViewMode('diff')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'diff'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Piksel Uyuşmazlık Haritası"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isTr ? 'Diff Mask' : 'Pixel Mask'}</span>
              </button>

              <button
                onClick={() => setViewMode('sideBySide')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'sideBySide'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Yan Yana Karşılaştırma"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{isTr ? 'Yan Yana' : 'Side-by-Side'}</span>
              </button>
            </div>

            <button 
              onClick={onClose} 
              data-testid="visual-diff-close"
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Canvas */}
        <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center bg-slate-950/70 select-none">
          {viewMode === 'slider' && (
            <div className="w-full flex flex-col items-center">
              {/* Slider Viewport Container */}
              <div 
                ref={containerRef}
                className="relative w-full max-w-4xl aspect-[16/10] max-h-[56vh] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group cursor-ew-resize bg-slate-900"
                onMouseDown={handleMouseDown}
              >
                {/* Left Side: Current Run */}
                <img 
                  src={currentUrl} 
                  alt="Current Live Run" 
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-700 text-indigo-300 font-mono text-[10px] font-bold pointer-events-none z-10 backdrop-blur-xs">
                  {isTr ? 'CANLI KOŞUM (CURRENT)' : 'CURRENT RUN (LIVE)'}
                </div>

                {/* Right Side Clip: Baseline */}
                <div 
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                >
                  <img 
                    src={baselineUrl} 
                    alt="Baseline Reference" 
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700 text-slate-300 font-mono text-[10px] font-bold pointer-events-none z-10 backdrop-blur-xs">
                    {isTr ? 'REFERANS (BASELINE)' : 'BASELINE REFERENCE'}
                  </div>
                </div>

                {/* Vertical Divider Line with Drag Knob */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.9)] z-20 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pink-500 text-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing border-2 border-white pointer-events-auto">
                    <MoveHorizontal className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Slider Position Indicator */}
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{isTr ? 'Referans' : 'Baseline'}: {Math.round(sliderPos)}%</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPos} 
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="w-48 accent-pink-500 cursor-pointer"
                />
                <span>{isTr ? 'Canlı' : 'Current'}: {100 - Math.round(sliderPos)}%</span>
              </div>
            </div>
          )}

          {viewMode === 'diff' && (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-full max-w-4xl aspect-[16/10] max-h-[56vh] rounded-2xl overflow-hidden border border-pink-500/40 shadow-2xl bg-slate-950 flex items-center justify-center">
                {/* Base Live Image darkened */}
                <img 
                  src={currentUrl} 
                  alt="Base Live" 
                  className="w-full h-full object-contain opacity-40 filter grayscale"
                />

                {/* Neon Magenta Diff Highlight Layer */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-full h-full max-w-4xl">
                    {/* Simulated Diff Areas (Banners, Badges, Buttons) */}
                    <div className="absolute top-[18%] left-[28%] w-[44%] h-[12%] border-2 border-pink-500 bg-pink-500/30 rounded-lg shadow-[0_0_15px_#ff007f] animate-pulse">
                      <span className="absolute -top-5 left-1 font-mono text-[9px] font-bold text-pink-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-pink-500/50">
                        Δ BANNER_TEXT (+0.18%)
                      </span>
                    </div>

                    <div className="absolute top-[48%] right-[14%] w-[18%] h-[8%] border-2 border-pink-500 bg-pink-500/30 rounded-lg shadow-[0_0_15px_#ff007f] animate-pulse">
                      <span className="absolute -top-5 left-1 font-mono text-[9px] font-bold text-pink-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-pink-500/50">
                        Δ PRICE_BADGE (+0.14%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 backdrop-blur-md flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                  <span>{isTr ? 'Fark Alanları: 3,450 Piksel (%0.32 Uyuşmazlık)' : 'Diff Areas: 3,450 Pixels (0.32% Mismatch)'}</span>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'sideBySide' && (
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[58vh]">
              <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>{isTr ? '1. Referans (Baseline)' : '1. Baseline'}</span>
                  <span className="text-[10px] font-mono text-slate-500">Golden Reference</span>
                </div>
                <div className="flex-1 p-2 flex items-center justify-center bg-slate-950/40">
                  <img src={baselineUrl} alt="Baseline" className="max-h-[38vh] w-auto object-contain rounded-lg" />
                </div>
              </div>

              <div className="flex flex-col bg-slate-900 border border-pink-500/40 rounded-2xl overflow-hidden shadow-lg shadow-pink-500/5">
                <div className="px-3 py-2 border-b border-pink-500/30 text-xs font-bold text-pink-400 flex items-center justify-between bg-pink-950/20">
                  <span>{isTr ? '2. Piksel-Diff Haritası' : '2. Diff Map'}</span>
                  <span className="text-[10px] font-mono text-pink-400 font-bold">0.32% Diff</span>
                </div>
                <div className="flex-1 p-2 flex items-center justify-center bg-slate-950/80 relative">
                  <img src={currentUrl} alt="Diff Mask" className="max-h-[38vh] w-auto object-contain rounded-lg opacity-40 filter grayscale" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-8 border-2 border-pink-500 bg-pink-500/40 rounded shadow-[0_0_12px_#ff007f]" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-800 text-xs font-bold text-indigo-400 flex items-center justify-between">
                  <span>{isTr ? '3. Canlı Koşum (Current)' : '3. Current Run'}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Live Capture</span>
                </div>
                <div className="flex-1 p-2 flex items-center justify-center bg-slate-950/40">
                  <img src={currentUrl} alt="Current" className="max-h-[38vh] w-auto object-contain rounded-lg" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Threshold Controls */}
        <div className="px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-6">
            {/* Tolerance Control */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">
                {isTr ? 'Kabul Edilebilir Tolerans Eşiği:' : 'Visual Tolerance Threshold:'}
              </span>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0.1" 
                  max="3.0" 
                  step="0.1" 
                  value={tolerance}
                  onChange={(e) => setTolerance(parseFloat(e.target.value))}
                  className="w-28 accent-indigo-500 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  %{tolerance.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              <span>{isTr ? 'Tespit Edilen:' : 'Detected:'} <strong className="text-pink-400">%{detectedDiff}</strong></span>
              <span className="mx-2">•</span>
              <span>DOM: <code className="text-slate-300">#main-content .hero</code></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsAccepted(true);
                setTimeout(() => setIsAccepted(false), 2000);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAccepted 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isAccepted ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isAccepted ? (isTr ? 'Yeni Referans Kaydedildi!' : 'Saved as New Baseline!') : (isTr ? 'Yeni Referans Olarak Güncelle' : 'Update as New Baseline')}</span>
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
