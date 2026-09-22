import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Globe, Sparkles, CheckCircle2, ArrowRight, Loader2, Layers, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';
import { Language } from '../locales/translations';
import { API_BASE } from '../services/api';

interface ProjectFolder {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  category: string;
  scannedEndpoints: {
    storefront: string;
    search: string;
    category: string;
    pdp: string;
    cart: string;
    checkout: string;
    login: string;
  };
  scenariosCount: number;
}

interface NewProjectFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: ProjectFolder) => void;
  lang: Language;
}

export const NewProjectFolderModal: React.FC<NewProjectFolderModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  lang
}) => {
  const isTr = lang === 'tr';
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedRoutes, setScannedRoutes] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [testCustomerEmail, setTestCustomerEmail] = useState('qa.testuser@monsternotebook.com.tr');
  const [testCustomerPassword, setTestCustomerPassword] = useState('MonsterQA!2026Secure');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-scan URL on debounced typing
  useEffect(() => {
    if (!baseUrl || baseUrl.length < 8) {
      setScannedRoutes(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsScanning(true);
      try {
        const res = await fetch(`${API_BASE}/projects/scan-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: baseUrl })
        });
        const data = await res.json();
        if (data?.scanned) {
          setScannedRoutes(data.scanned);
          if (!name) {
            try {
              const host = new URL(data.scanned.baseUrl).hostname.replace('www.', '');
              setName(host.charAt(0).toUpperCase() + host.slice(1));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error('Scan error', err);
      } finally {
        setIsScanning(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [baseUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || baseUrl,
          baseUrl,
          category: 'E-Commerce Storefront',
          testCustomerEmail,
          testCustomerPassword
        })
      });

      const data = await res.json();
      if (data?.project) {
        onProjectCreated(data.project);
        setName('');
        setBaseUrl('');
        setScannedRoutes(null);
        onClose();
      }
    } catch (err) {
      console.error('Project creation failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {isTr ? 'Yeni Web Sitesi Test Klasörü Oluştur' : 'Create Store Test Project Folder'}
              </h3>
              <p className="text-xs text-slate-400">
                {isTr ? 'Ana site URL’ini girin; sistem uç noktaları tarayıp senaryoları otomatik bağlasın' : 'Enter base store URL; AI scanner discovers routes and binds test suites'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Hedef Mağaza Ana URL (Base Store URL)' : 'Target Store Base URL'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="https://www.monsternotebook.com.tr"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full pl-8 pr-8 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-mono focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-bold"
              />
              <Globe className="w-4 h-4 text-indigo-500 absolute left-2.5 top-3" />
              {isScanning && (
                <Loader2 className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 animate-spin" />
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {isTr ? 'Örn: https://www.monsternotebook.com.tr veya herhangi bir e-ticaret sitesi' : 'e.g. https://www.monsternotebook.com.tr or any e-commerce URL'}
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Klasör / Mağaza Adı' : 'Project Folder Name'}
            </label>
            <input
              type="text"
              required
              placeholder={isTr ? 'Örn: Monster Notebook' : 'e.g. Monster Notebook'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Test Customer Credentials / Auth Vault */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-extrabold text-[11px] text-slate-900 dark:text-white uppercase tracking-wider">
                {isTr ? 'Test Kullanıcı Kimlik Kasası (Auth Vault)' : 'Test User Credentials (Auth Vault)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {isTr 
                ? 'Playwright otomasyon motoru üye girişi, sepet kaydetme ve profil kontrollerinde bu kimlik bilgilerini kullanır.'
                : 'Playwright engine logs into the storefront with these credentials to verify member checkout & account.'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {isTr ? 'Test Müşteri E-Postası' : 'Test Customer Email'}
                </label>
                <input
                  type="email"
                  value={testCustomerEmail}
                  onChange={(e) => setTestCustomerEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {isTr ? 'Test Müşteri Şifresi' : 'Test Customer Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={testCustomerPassword}
                    onChange={(e) => setTestCustomerPassword(e.target.value)}
                    className="w-full pl-2.5 pr-7 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Smart URL Scanner Discovery Preview */}
          {scannedRoutes && (
            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  {isTr ? 'Otomatik Taranan E-Ticaret Uç Noktaları' : 'Discovered E-Commerce Endpoints'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold">
                  {isTr ? '7 Rota Eşleşti' : '7 Routes Mapped'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                  <span className="text-slate-400 block text-[9px] font-sans">STOREFRONT:</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate">{scannedRoutes.storefront}</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                  <span className="text-slate-400 block text-[9px] font-sans">SEARCH:</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate">{scannedRoutes.search}</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                  <span className="text-slate-400 block text-[9px] font-sans">CATEGORY:</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate">{scannedRoutes.category}</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                  <span className="text-slate-400 block text-[9px] font-sans">PDP:</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate">{scannedRoutes.pdp}</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                  <span className="text-slate-400 block text-[9px] font-sans">CART:</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate">{scannedRoutes.cart}</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                  <span className="text-slate-400 block text-[9px] font-sans">CHECKOUT:</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate">{scannedRoutes.checkout}</span>
                </div>
              </div>

              <p className="text-[10px] text-indigo-700 dark:text-indigo-300 font-medium">
                {isTr 
                  ? '✨ Bu klasör oluşturulduğunda tüm hazır e-ticaret senaryoları taranan bu rotalarla otomatik oluşturulacaktır.'
                  : '✨ Creating this folder will auto-bind the complete suite of e-commerce scenarios to these discovered routes.'}
              </p>
            </div>
          )}

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
              disabled={isSubmitting || !baseUrl}
              className="px-5 py-2 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isTr ? 'Klasör Oluşturuluyor...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{isTr ? 'Site Klasörünü & Senaryoları Başlat' : 'Create Folder & Auto-Bind'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
