import React, { useState } from 'react';
import { Sparkles, X, Brain, Wand2, RefreshCw, Send, CheckCircle2, Copy, AlertTriangle, ShieldCheck, Database, Layers, ArrowRight, Zap, Code } from 'lucide-react';
import { Language } from '../locales/translations';

interface OmniMindModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onApplyPipeline?: (nodes: any[], edges: any[], title: string) => void;
  currentNodes?: any[];
}

export const OmniMindModal: React.FC<OmniMindModalProps> = ({
  isOpen,
  onClose,
  lang = 'tr',
  onApplyPipeline,
  currentNodes = []
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'rca' | 'data' | 'chat'>('prompt');
  
  // Prompt-to-Pipeline State
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPipeline, setGeneratedPipeline] = useState<any | null>(null);

  // RCA State
  const [rcaErrorLog, setRcaErrorLog] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rcaResult, setRcaResult] = useState<any | null>(null);

  // Synthetic Data State
  const [dataCountry, setDataCountry] = useState<'tr' | 'de'>('tr');
  const [syntheticData, setSyntheticData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: lang === 'en' 
        ? "Hello! I am OmniMind AI, your autonomous QA architect. I can generate complete visual test graphs, diagnose flaky selectors, produce synthetic e-commerce compliance data, and optimize Playwright execution. How can I assist your pipeline today?"
        : "Merhaba! Ben OmniMind AI, otonom QA mimarınızım. Doğal dilden görsel test grafikleri üretebilir, kararsız (flaky) seçicileri teşhis edebilir, KVKK/DSGVO uyumlu sentetik test verisi oluşturabilir ve Playwright testlerinizi optimize edebilirim. Tuvaliniz için ne yapmamı istersiniz?",
      timestamp: 'Şimdi'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const isTr = lang === 'tr';

  // Preset Prompts
  const quickPrompts = [
    {
      title: isTr ? 'NovaTech TR: Sepet, Kupon (NOVAPRO20) & 3D Secure' : 'NovaTech TR: Cart, Coupon & 3D Secure Checkout',
      prompt: 'NovaTech TR üzerinde Horizon X15 ürününü sepete ekleyen, NOVAPRO20 kupon kodunu doğrulayan ve İyziPay 3D Secure ödeme adımına ilerleyen uçtan uca senaryo oluştur.'
    },
    {
      title: isTr ? 'NovaTech DE: Titan X17 Konfigüratör & Klarna Pay' : 'NovaTech DE: Titan X17 Configurator & Klarna Pay',
      prompt: 'NovaTech DE mağazasında Titan X17 için 32GB RAM ve 2TB SSD konfigürasyonu seçip, Klarna Später Bezahlen ve DSGVO çerez onayını doğrulayan pipeline oluştur.'
    },
    {
      title: isTr ? 'Global E-Ticaret: Lighthouse & 404 Kırık Link Denetimi' : 'Global E-Com: Lighthouse & Broken Link Audit',
      prompt: 'Ana sayfa ve kategori sayfalarında Core Web Vitals (LCP < 2.5s, CLS < 0.1) ve kırık link HTTP 404 denetimi yapan sentetik performans boru hattı çiz.'
    }
  ];

  // Handler for Generating Pipeline
  const handleGeneratePipeline = async (customPrompt?: string) => {
    const textToUse = customPrompt || promptInput;
    if (!textToUse.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/omnimind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'prompt_to_pipeline', prompt: textToUse, lang })
      });
      const data = await response.json();
      setGeneratedPipeline(data);
    } catch (err) {
      console.error('Error generating pipeline:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for RCA
  const handleAnalyzeRCA = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/omnimind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze_pipeline',
          errorLog: rcaErrorLog || 'Timeout 30000ms waiting for locator button[data-testid="add-to-cart"] to be visible',
          nodeCount: currentNodes.length,
          lang
        })
      });
      const data = await response.json();
      setRcaResult(data);
    } catch (err) {
      console.error('Error analyzing RCA:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler for Synthetic Data
  const handleGenerateSyntheticData = async (country: 'tr' | 'de') => {
    setDataCountry(country);
    try {
      const response = await fetch('http://localhost:5000/api/ai/omnimind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_synthetic_data', country, lang })
      });
      const data = await response.json();
      setSyntheticData(data);
    } catch (err) {
      console.error('Error generating synthetic data:', err);
    }
  };

  // Handler for Chat
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, timestamp: 'Şimdi' }]);

    try {
      const response = await fetch('http://localhost:5000/api/ai/omnimind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: userMsg, lang })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply, timestamp: 'Şimdi' }]);
    } catch (err) {
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: isTr ? 'Bağlantı hatası oluştu, yerel AI motoru ile devam ediliyor.' : 'Network error occurred, fallback response activated.',
        timestamp: 'Şimdi'
      }]);
    }
  };

  const copyToClipboard = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-violet-500/30 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl shadow-violet-950/60 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-violet-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-violet-500/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  OmniMind AI
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 tracking-wider uppercase">
                  Autonomous QA & Neural Copilot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isTr 
                  ? 'Yapay zeka tabanlı boru hattı sentezi, akıllı kök neden analizi & sentetik test veri motoru'
                  : 'AI-driven test pipeline synthesis, root cause diagnostics & synthetic compliance data foundry'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-violet-400 bg-violet-950/50 px-2 py-1 rounded border border-violet-800/40">
              Ctrl + J
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'prompt'
                ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>{isTr ? 'Prompt-to-Pipeline' : 'Prompt-to-Pipeline'}</span>
          </button>

          <button
            onClick={() => setActiveTab('rca')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'rca'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isTr ? 'Kök Neden Analizi (RCA)' : 'Root Cause Analysis'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('data');
              if (!syntheticData) handleGenerateSyntheticData('tr');
            }}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'data'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{isTr ? 'Sentetik Veri Fabrikası' : 'Synthetic Data Foundry'}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'chat'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTr ? 'Neural QA Asistanı' : 'Neural QA Chat'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60">
          
          {/* TAB 1: Prompt-to-Pipeline */}
          {activeTab === 'prompt' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                <label className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-2">
                  <Wand2 className="w-4 h-4 text-violet-400" />
                  <span>{isTr ? 'Doğal Dilde Test Akışı Tanımlayın:' : 'Describe your Test Automation Flow in Plain Language:'}</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={isTr 
                      ? 'Örn: NovaTech TR Horizon X15 ürününü sepete ekle, kupon uygula ve 3D secure adımına geç...'
                      : 'E.g.: Add Horizon X15 to cart on NovaTech TR, apply coupon and test 3D secure payment...'}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleGeneratePipeline()}
                  />
                  <button
                    onClick={() => handleGeneratePipeline()}
                    disabled={isGenerating || !promptInput.trim()}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-violet-500/20"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isTr ? 'Pipeline Sentezle' : 'Synthesize Pipeline'}</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="mt-4">
                  <span className="text-xs text-slate-400 font-semibold">{isTr ? 'Veya hazır şablonlardan birini seçin:' : 'Or choose a pre-architected template:'}</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2">
                    {quickPrompts.map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPromptInput(qp.prompt);
                          handleGeneratePipeline(qp.prompt);
                        }}
                        className="text-left p-3 rounded-lg bg-slate-900/80 hover:bg-violet-950/40 border border-slate-800 hover:border-violet-500/40 transition-all group"
                      >
                        <div className="text-xs font-bold text-slate-200 group-hover:text-violet-300 flex items-center justify-between">
                          <span>{qp.title}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{qp.prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated Result Preview */}
              {generatedPipeline && (
                <div className="bg-slate-950 border border-violet-500/30 rounded-xl p-5 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>{generatedPipeline.title || 'Sentezlenen Boru Hattı'}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{generatedPipeline.description}</p>
                    </div>

                    {onApplyPipeline && (
                      <button
                        onClick={() => {
                          onApplyPipeline(generatedPipeline.nodes, generatedPipeline.edges, generatedPipeline.title);
                          onClose();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isTr ? 'Tuvale Enjekte Et & Çalıştır' : 'Apply to Canvas & Run'}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                    {generatedPipeline.nodes?.map((n: any, i: number) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/50">
                            {n.data?.type || 'step'}
                          </span>
                          <span className="text-[10px] text-slate-500">#{i + 1}</span>
                        </div>
                        <div className="text-xs font-bold text-white truncate">{n.data?.title || n.data?.label}</div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.data?.subtext || n.data?.description}</div>
                        {n.data?.action && (
                          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400 truncate">
                            &gt; {n.data.action}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Root Cause Analysis (RCA) */}
          {activeTab === 'rca' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                <label className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>{isTr ? 'Hata Logu veya Flaky Adım Açıklaması:' : 'Paste Error Log or Flaky Step Description:'}</span>
                </label>
                <textarea
                  value={rcaErrorLog}
                  onChange={(e) => setRcaErrorLog(e.target.value)}
                  placeholder={isTr 
                    ? 'TimeoutError: locator.waitFor: Timeout 30000ms exceeded.\nwaiting for locator(\'button[data-testid="add-to-cart"]\') to be visible...'
                    : 'Paste error stack trace or Playwright timeout message here...'}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAnalyzeRCA}
                    disabled={isAnalyzing}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-cyan-600/20"
                  >
                    {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    <span>{isTr ? 'AI Kök Neden Teşhisi Yap' : 'Run Neural RCA Diagnostics'}</span>
                  </button>
                </div>
              </div>

              {rcaResult && (
                <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {rcaResult.rootCauseCategory || 'DOM Timing & Dynamic Hydration Race'}
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      {isTr ? `Kritiklik Skoru: %${rcaResult.confidence || 94}` : `Confidence: ${rcaResult.confidence || 94}%`}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{isTr ? 'Teşhis Edilen Temel Neden:' : 'Diagnosed Root Cause:'}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rcaResult.explanation}</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isTr ? 'Önerilen Otonom Çözüm (Playwright Auto-Patch):' : 'Suggested Auto-Patch (Playwright):'}</span>
                      </span>
                    </div>
                    <pre className="text-xs font-mono text-cyan-300 bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto">
                      {rcaResult.suggestedFixCode || `// Replace brittle DOM click with state-aware locator:
await page.waitForLoadState('networkidle');
await page.locator('[data-testid="add-to-cart"]:not([disabled])').click({ timeout: 10000 });`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Synthetic Data Foundry */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>{isTr ? 'E-Ticaret Uyumlu Sentetik Veri Fabrikası' : 'E-Commerce Synthetic Compliance Data Foundry'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isTr 
                      ? 'KVKK ve DSGVO kurallarına %100 uyumlu, geçerli algoritma sağlama toplamlı (Luhn, VKN, T.C., IBAN) anlık test verileri.'
                      : '100% compliant with KVKK & GDPR, featuring mathematically valid checksums for test automation.'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerateSyntheticData('tr')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      dataCountry === 'tr'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    🇹🇷 NovaTech TR
                  </button>
                  <button
                    onClick={() => handleGenerateSyntheticData('de')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      dataCountry === 'de'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    🇩🇪 NovaTech DE
                  </button>
                  <button
                    onClick={() => handleGenerateSyntheticData(dataCountry)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title={isTr ? 'Yeni Veri Üret' : 'Regenerate Data'}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {syntheticData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(syntheticData.fields || {}).map(([key, item]: [string, any]) => (
                    <div key={key} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-300">{item.label}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {item.checksumStatus || 'VALID'}
                          </span>
                        </div>
                        <div className="text-sm font-mono text-emerald-400 mt-2 select-all bg-slate-900/90 p-2 rounded border border-slate-800">
                          {item.value}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                        <span>{item.notes}</span>
                        <button
                          onClick={() => copyToClipboard(key, item.value)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedKey === key ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Kopyalandı
                            </span>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Kopyala
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Neural QA Chat */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[360px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Brain className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className="text-[9px] text-slate-400 block mt-1.5 text-right">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={isTr 
                    ? 'Playwright, e-ticaret edge-case veya test mimarisi hakkında soru sorun...'
                    : 'Ask OmniMind AI about Playwright specs, flaky locators, test matrix...'}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>OmniMind Autonomous Engine v2.6 Online</span>
          </div>
          <span>NovaTech E-Commerce QA Neural Platform</span>
        </div>

      </div>
    </div>
  );
};
