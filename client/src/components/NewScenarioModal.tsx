import React, { useState, useEffect } from 'react';
import { X, Plus, Globe, Sparkles } from 'lucide-react';
import { Scenario } from '../types';
import { Language } from '../locales/translations';

interface NewScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Scenario>) => void;
  lang: Language;
  defaultTargetUrl?: string;
}

export const NewScenarioModal: React.FC<NewScenarioModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate,
  lang,
  defaultTargetUrl = 'https://www.novatech.com.tr'
}) => {
  const isTr = lang === 'tr';
  const [title, setTitle] = useState('');
  const categoriesList = [
    { id: 'cat-checkout', name: isTr ? 'Temel Dönüşüm (Checkout)' : 'Core Conversion', icon: '🛍️' },
    { id: 'cat-pricing', name: isTr ? 'Fiyatlandırma & Kampanya' : 'Pricing & Promotions', icon: '🏷️' },
    { id: 'cat-payment', name: isTr ? 'Ödeme & Güvenlik' : 'Payment & Gateways', icon: '💳' },
    { id: 'cat-config', name: isTr ? 'Ürün & Donanım Konfigürasyonu' : 'Product & Configurator', icon: '💻' },
    { id: 'cat-pdp', name: isTr ? 'Müşteri Deneyimi (PDP)' : 'Customer Journey (PDP)', icon: '🔍' },
    { id: 'cat-catalog', name: isTr ? 'Katalog & Envanter' : 'Catalog & Stock', icon: '📦' },
    { id: 'cat-mobile', name: isTr ? 'Mobil & Uyumluluk' : 'Mobile & Compatibility', icon: '📱' },
    { id: 'cat-logistics', name: isTr ? 'Lojistik & Kargo' : 'Logistics & Shipping', icon: '🚚' },
    { id: 'cat-compliance', name: isTr ? 'Hukuki & Uyumluluk (DSGVO/KVKK)' : 'Legal & Compliance (GDPR)', icon: '⚖️' },
    { id: 'cat-security', name: isTr ? 'Siber Güvenlik & PCI-DSS' : 'Cyber Security & PCI-DSS', icon: '🛡️' },
    { id: 'cat-b2b', name: isTr ? 'B2B & Muhasebe' : 'B2B & Accounting', icon: '🏢' }
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    isTr ? 'Temel Dönüşüm (Checkout)' : 'Core Conversion'
  ]);
  const [criticality, setCriticality] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('Critical');
  const [targetUrl, setTargetUrl] = useState(defaultTargetUrl);
  const [customerEmail, setCustomerEmail] = useState('qa.testuser@novatech.com.tr');
  const [customerPassword, setCustomerPassword] = useState('NovaTechQA!2026Secure');
  const [description, setDescription] = useState('');

  const toggleCategory = (catName: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(catName)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter(c => c !== catName);
      }
      return [...prev, catName];
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title,
      category: selectedCategories[0] || 'Genel',
      categories: selectedCategories,
      criticality,
      targetUrl,
      description: description || (isTr ? 'Kullanıcı tanımlı özel e-ticaret test senaryosu.' : 'Custom user-defined e-commerce automation test flow.')
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {isTr ? 'Yeni E-Ticaret Test Senaryosu' : 'New E-Commerce Scenario'}
              </h3>
              <p className="text-xs text-slate-400">
                {isTr ? 'Görsel uçtan uca otomasyon test akışı tasarlayın' : 'Design visual end-to-end automation flow'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Senaryo Başlığı' : 'Scenario Name'}
            </label>
            <input
              type="text"
              required
              placeholder={isTr ? 'Örn: Sepet Tutarı İndirimi & 3D Secure Doğrulama' : 'e.g. Black Friday Flash Checkout & 3D Secure'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Multi-Category Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {isTr ? 'Kategoriler (Birden Fazla Seçilebilir)' : 'Categories (Multi-Selectable)'}
              </label>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold border border-indigo-100 dark:border-indigo-900">
                {selectedCategories.length} {isTr ? 'Kategori Seçildi' : 'Selected'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 max-h-32 overflow-y-auto">
              {categoriesList.map(cat => {
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-2xs font-bold'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    {isSelected && <span className="text-[9px] font-extrabold ml-0.5">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Öncelik Seviyesi' : 'Priority'}
            </label>
            <select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            >
              <option value="Critical">{isTr ? 'Kritik (P0)' : 'Critical (P0)'}</option>
              <option value="High">{isTr ? 'Yüksek (P1)' : 'High (P1)'}</option>
              <option value="Medium">{isTr ? 'Orta (P2)' : 'Medium (P2)'}</option>
              <option value="Low">{isTr ? 'Düşük (P3)' : 'Low (P3)'}</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Hedef Web Sitesi / URL' : 'Target Store URL'}
            </label>
            <div className="relative">
              <input
                type="url"
                required
                placeholder="https://www.novatech.com.tr"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-mono focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {isTr 
                ? 'Test edilecek mağaza adresini girin. Hazır adımlar bu domain üzerinden taranacaktır.' 
                : 'Enter target e-commerce storefront. Test steps will auto-bind to this domain.'}
            </p>
          </div>

          {/* Test Customer Auth Credentials */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{isTr ? 'Test Kullanıcı Oturum Bilgileri (Auth Vault)' : 'Test User Credentials (Auth Vault)'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                  {isTr ? 'Test E-Posta' : 'Test Email'}
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="qa.testuser@novatech.com.tr"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                  {isTr ? 'Test Şifre' : 'Test Password'}
                </label>
                <input
                  type="password"
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isTr ? 'Açıklama & Doğrulama Hedefi' : 'Description & Objective'}
            </label>
            <textarea
              rows={2}
              placeholder={isTr ? 'Bu senaryo hangi müşteri akışını veya sınır durumunu (edge-case) test ediyor?' : 'What customer journey or edge-case does this scenario validate?'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

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
              className="px-5 py-2 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              {isTr ? 'Senaryoyu Oluştur' : 'Create Flow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
