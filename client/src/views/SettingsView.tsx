import React, { useState, useEffect } from 'react';
import { Settings, Globe, Moon, Sun, Monitor, Cpu, Check, UserCheck, Lock, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';
import { Language } from '../locales/translations';
import { API_BASE } from '../services/api';

interface SettingsViewProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  onSetLang,
  isDarkMode,
  onToggleTheme
}) => {
  const isTr = lang === 'tr';
  const [testEmail, setTestEmail] = useState('berk.testuser@monsternotebook-qa.com');
  const [testPassword, setTestPassword] = useState('MonsterQA!2026Secure');
  const [showPw, setShowPw] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState('proj-monster');

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const p = data[0];
          setActiveProjectId(p.id);
          if (p.testCustomerEmail) setTestEmail(p.testCustomerEmail);
          if (p.testCustomerPassword) setTestPassword(p.testCustomerPassword);
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch(`${API_BASE}/projects/${activeProjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCustomerEmail: testEmail,
          testCustomerPassword: testPassword
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 select-none">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            {isTr ? 'Sistem & Test Ayarları' : 'System & Engine Settings'}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTr 
            ? 'Dil tercihi, karanlık/aydınlık tema, mağaza test kullanıcı kasası ve Playwright motoru konfigürasyonu.'
            : 'Language preferences, Dark/Light mode theme, store test user vault, and Playwright execution environment.'}
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Test User Credentials Vault */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{isTr ? 'E-Ticaret Test Kullanıcı Kasası (Auth Vault)' : 'Store Test User Credentials (Auth Vault)'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              Active Vault
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isTr 
              ? 'Playwright otomasyon motoru; üye girişi, sepet kaydetme, fatura adresi ve profil kontrolleri içeren senaryolarda doğrudan bu kimlik bilgileriyle siteye giriş yapar.'
              : 'Playwright automation uses these credentials to log in, verify authenticated carts, addresses, and member checkout journeys.'}
          </p>

          <form onSubmit={handleSaveCredentials} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isTr ? 'Test Kullanıcı E-Posta Adresi' : 'Test Customer Email'}
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isTr ? 'Test Kullanıcı Şifresi' : 'Test Customer Password'}
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                {savedSuccess && (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isTr ? 'Bilgiler başarıyla güncellendi!' : 'Credentials updated successfully!'}</span>
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? (isTr ? 'Kaydediliyor...' : 'Saving...') : (isTr ? 'Kasayı Güncelle' : 'Update Vault')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Language Selection */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>{isTr ? 'Dil Seçimi (Language)' : 'Language Preference'}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSetLang('tr')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between
                ${lang === 'tr' 
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}
              `}
            >
              <div>
                <span className="block text-xs font-bold">Türkçe (TR)</span>
                <span className="text-[10px] text-slate-400">Varsayılan dil</span>
              </div>
              {lang === 'tr' && <Check className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => onSetLang('en')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between
                ${lang === 'en' 
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}
              `}
            >
              <div>
                <span className="block text-xs font-bold">English (EN)</span>
                <span className="text-[10px] text-slate-400">International standard</span>
              </div>
              {lang === 'en' && <Check className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Theme Mode Selection */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            {isDarkMode ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{isTr ? 'Görünüm & Tema' : 'Appearance & Theme'}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { if (isDarkMode) onToggleTheme(); }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between
                ${!isDarkMode 
                  ? 'border-amber-500 bg-amber-50/50 text-amber-900 font-bold' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}
              `}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="block text-xs font-bold">{isTr ? 'Açık Tema (Light)' : 'Light Mode'}</span>
                  <span className="text-[10px] text-slate-400">{isTr ? 'Aydınlık CAD Grid' : 'Crisp CAD Grid'}</span>
                </div>
              </div>
              {!isDarkMode && <Check className="w-4 h-4 text-amber-600" />}
            </button>

            <button
              onClick={() => { if (!isDarkMode) onToggleTheme(); }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between
                ${isDarkMode 
                  ? 'border-violet-500 bg-violet-950/40 text-violet-200 font-bold' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}
              `}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-violet-400" />
                <div>
                  <span className="block text-xs font-bold">{isTr ? 'Koyu Tema (Dark)' : 'Dark Mode'}</span>
                  <span className="text-[10px] text-slate-400">{isTr ? 'Premium Cyber Grid' : 'Cyber Matrix Grid'}</span>
                </div>
              </div>
              {isDarkMode && <Check className="w-4 h-4 text-violet-400" />}
            </button>
          </div>
        </div>

        {/* Engine Preferences */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>{isTr ? 'Playwright Yürütme Motoru' : 'Playwright Engine Config'}</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span>Browser Driver:</span>
              <strong className="text-slate-900 dark:text-white">Chromium 1243 (Headless Shell)</strong>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span>Default Target:</span>
              <strong className="text-indigo-600 dark:text-indigo-400">https://www.monsternotebook.com.tr/</strong>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span>Telemetry:</span>
              <strong className="text-emerald-600 font-bold">WebSocket Live Stream (Active)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
