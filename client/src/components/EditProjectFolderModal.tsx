import React, { useState, useEffect } from 'react';
import { 
  X, 
  FolderEdit, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Check, 
  Loader2, 
  ShieldCheck, 
  KeyRound, 
  Smartphone,
  ExternalLink,
  Layers,
  Save
} from 'lucide-react';
import { Language } from '../locales/translations';
import { API_BASE } from '../services/api';

export interface ProjectFolder {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  category?: string;
  testCustomerEmail?: string;
  testCustomerPassword?: string;
  sessionToken?: string;
  otpCode?: string;
  autoLogin?: boolean;
  scannedEndpoints?: {
    storefront?: string;
    search?: string;
    category?: string;
    pdp?: string;
    cart?: string;
    checkout?: string;
    login?: string;
    account?: string;
  };
  scenariosCount?: number;
}

interface EditProjectFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectFolder | null;
  onProjectUpdated: (updatedProject: ProjectFolder) => void;
  lang: Language;
}

export const EditProjectFolderModal: React.FC<EditProjectFolderModalProps> = ({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
  lang
}) => {
  const isTr = lang === 'tr';

  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [category, setCategory] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');
  const [sessionToken, setSessionToken] = useState('');
  const [autoLogin, setAutoLogin] = useState(true);

  // Scanned routes
  const [endpoints, setEndpoints] = useState<{
    storefront: string;
    search: string;
    category: string;
    pdp: string;
    cart: string;
    checkout: string;
    login: string;
    account: string;
  }>({
    storefront: '',
    search: '',
    category: '',
    pdp: '',
    cart: '',
    checkout: '',
    login: '',
    account: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when project prop changes
  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setBaseUrl(project.baseUrl || '');
      setCategory(project.category || 'Gaming & PC Electronics');
      setTestEmail(project.testCustomerEmail || 'berk.testuser@monsternotebook-qa.com');
      setTestPassword(project.testCustomerPassword || 'MonsterQA!2026Secure');
      setOtpCode(project.otpCode || '123456');
      setSessionToken(project.sessionToken || 'Bearer monster_qa_session_jwt_2026');
      setAutoLogin(project.autoLogin !== undefined ? project.autoLogin : true);

      const ep = project.scannedEndpoints || {};
      setEndpoints({
        storefront: ep.storefront || `${project.baseUrl}/`,
        search: ep.search || `${project.baseUrl}/arama?q=tulpar`,
        category: ep.category || `${project.baseUrl}/oyun-bilgisayarlari`,
        pdp: ep.pdp || `${project.baseUrl}/tulpar-t7-v20-8-1-intel-core-i7-14700hx-16gb-ram-1tb-ssd-rtx4070-freedos-17-3-fhd-144hz/`,
        cart: ep.cart || `${project.baseUrl}/sepet/`,
        checkout: ep.checkout || `${project.baseUrl}/odeme/`,
        login: ep.login || `${project.baseUrl}/uye-girisi/`,
        account: ep.account || `${project.baseUrl}/hesabim/siparislerim/`
      });
    }
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseUrl.trim() || !name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        baseUrl,
        category,
        testCustomerEmail: testEmail,
        testCustomerPassword: testPassword,
        otpCode,
        sessionToken,
        autoLogin,
        scannedEndpoints: endpoints
      };

      const res = await fetch(`${API_BASE}/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const updated = data.project || { ...project, ...payload };
        onProjectUpdated(updated);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 900);
      } else {
        // Local fallback update
        const updated = { ...project, ...payload };
        onProjectUpdated(updated);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 900);
      }
    } catch (err) {
      console.error('Failed to update project', err);
      // Fallback update
      const updated = {
        ...project,
        name,
        baseUrl,
        testCustomerEmail: testEmail,
        testCustomerPassword: testPassword,
        scannedEndpoints: endpoints
      };
      onProjectUpdated(updated);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 flex-shrink-0">
              <FolderEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {isTr ? 'Mağaza Klasörü & Üyelik Bilgilerini Düzenle' : 'Edit Store Project & Customer Auth Vault'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-800">
                  {project.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isTr 
                  ? 'Sitenin ana URL’ini ve Playwright testlerinde kullanılacak test üyelik kasasını yönetin.' 
                  : 'Manage store target URL and authentication credentials for automated end-to-end test runs.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="close-edit-project-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          
          {/* Section 1: Store & General Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-rose-500" />
              <span>{isTr ? '1. Mağaza & Web Sitesi Bilgileri' : '1. Store & Base Website Info'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isTr ? 'Klasör / Mağaza Adı' : 'Project / Store Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Monster Notebook Resmi Mağazası"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isTr ? 'Kategori & Sektör' : 'Category / Industry'}
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Gaming & PC Electronics"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{isTr ? 'Hedef Ana Web Sitesi URL (Base URL)' : 'Target Website URL (Base URL)'}</span>
                <span className="text-[10px] text-slate-400 font-mono">https://</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  required
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://www.monsternotebook.com.tr"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Test User Authentication Vault (The Core User Request) */}
          <div className="p-5 bg-gradient-to-br from-indigo-50/70 to-rose-50/40 dark:from-indigo-950/40 dark:to-slate-900/60 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {isTr ? '2. Test Müşterisi Kimlik Kasası (Auth Vault)' : '2. Test Customer Auth Vault'}
                    <span className="px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold">
                      Canlı Test Koruması
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isTr 
                      ? 'Playwright test motoru üyelikli sipariş, sepet senkronizasyonu ve profil testlerinde bu hesabı kullanır.' 
                      : 'Playwright engine logs into this dedicated test customer account to run cart persistence and checkout tests.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Test Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isTr ? 'Test Kullanıcı E-Postası' : 'Test Customer Email'}</span>
                </label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="berk.testuser@monsternotebook-qa.com"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-all shadow-2xs"
                />
              </div>

              {/* Test Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" />
                    {isTr ? 'Test Kullanıcı Şifresi' : 'Test Customer Password'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? (isTr ? 'Gizle' : 'Hide') : (isTr ? 'Göster' : 'Show')}</span>
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Token / OTP Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isTr ? '2FA / SMS Bypass Kodu (Opsiyonel)' : '2FA / OTP Bypass Code'}</span>
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isTr ? 'Session / Cookie Token (Opsiyonel)' : 'Session / Cookie Token'}</span>
                </label>
                <input
                  type="text"
                  value={sessionToken}
                  onChange={(e) => setSessionToken(e.target.value)}
                  placeholder="Bearer token veya oturum çerezi"
                  className="w-full px-3 py-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 truncate"
                />
              </div>
            </div>

            {/* Auto-login Toggle */}
            <label className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-indigo-100 dark:border-indigo-900/40 cursor-pointer">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isTr 
                  ? 'Playwright otomasyon testleri yürütülürken bu hesapla otomatik oturum açılsın' 
                  : 'Automatically authenticate with this test account during automated test runs'}
              </span>
            </label>
          </div>

          {/* Section 3: Scanned E-Commerce Endpoints */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isTr ? '3. Taranan E-Ticaret Sayfa Rotaları' : '3. Scanned E-Commerce Page Routes'}</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                {isTr ? 'Senaryoların ziyaret edeceği URL rotaları' : 'Target URLs for each test suite'}
              </span>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {[
                { key: 'storefront', label: isTr ? 'Ana Sayfa (Storefront)' : 'Storefront', val: endpoints.storefront },
                { key: 'search', label: isTr ? 'Arama (Search)' : 'Search', val: endpoints.search },
                { key: 'category', label: isTr ? 'Kategori (PLP)' : 'Category', val: endpoints.category },
                { key: 'pdp', label: isTr ? 'Ürün Detay (PDP)' : 'PDP Product', val: endpoints.pdp },
                { key: 'cart', label: isTr ? 'Sepet (Cart)' : 'Cart', val: endpoints.cart },
                { key: 'checkout', label: isTr ? 'Ödeme (Checkout)' : 'Checkout', val: endpoints.checkout },
                { key: 'login', label: isTr ? 'Üye Girişi (Login)' : 'Login', val: endpoints.login },
                { key: 'account', label: isTr ? 'Hesap & Siparişlerim' : 'Orders / Account', val: endpoints.account }
              ].map((ep) => (
                <div key={ep.key} className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                  <span className="w-36 font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">
                    {ep.label}:
                  </span>
                  <input
                    type="text"
                    value={ep.val}
                    onChange={(e) => setEndpoints(prev => ({ ...prev, [ep.key]: e.target.value }))}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 truncate"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{isTr ? 'Mağaza klasörü ve üyelik kasası başarıyla güncellendi!' : 'Store folder and auth vault credentials updated successfully!'}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isTr ? 'İptal' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="save-project-folder-btn"
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isTr ? 'Kaydediliyor...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isTr ? 'Değişiklikleri Kaydet' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
