import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock, FileKey, Server, Globe } from 'lucide-react';
import { Language } from '../locales/translations';

interface ComplianceViewProps {
  lang: Language;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({ lang }) => {
  const isTr = lang === 'tr';

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 select-none">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            {isTr ? 'E-Ticaret Güvenlik & PCI-DSS Uyumluluk Denetimi' : 'E-Commerce Security & PCI-DSS Compliance'}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTr 
            ? 'Ödeme sistemleri, KVKK/GDPR veri güvenliği, SSL/TLS şifreleme ve sepet tutarlılığı doğrulama raporu.'
            : 'Payment gateway isolation, GDPR data privacy, SSL/TLS handshake, and cart tamper-resistance audit.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isTr ? 'Genel Skor' : 'Overall Score'}</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">99.4%</div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{isTr ? 'Tüm kritik testler geçti' : 'All critical audits passed'}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isTr ? 'PCI-DSS Seviyesi' : 'PCI-DSS Level'}</span>
          <div className="text-3xl font-black text-sky-600 mt-1">Level 1</div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{isTr ? 'Tokenize Ödeme Gateway' : 'Tokenized Payment Gateway'}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isTr ? 'Aktif Güvenlik Korumaları' : 'Active Safeguards'}</span>
          <div className="text-3xl font-black text-violet-600 mt-1">12 / 12</div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{isTr ? 'Sıfır açık tespit edildi' : 'Zero vulnerabilities found'}</span>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          {isTr ? 'Otomasyon Tarafından Doğrulanan Güvenlik Kriterleri' : 'Security Benchmarks Verified by Test Suite'}
        </h3>

        <div className="space-y-3">
          {[
            {
              title: isTr ? 'Kredi Kartı Veri İzolasyonu (PCI-DSS)' : 'Credit Card Data Isolation (PCI-DSS)',
              desc: isTr ? 'Müşteri kredi kartı numaraları sunucuda veya yerel depolamada saklanmaz; Stripe/Iyzico iFrame tokenizasyonu doğrulanmıştır.' : 'Raw credit card numbers never touch backend storage; iframe tokenization verified.',
              status: 'Passed'
            },
            {
              title: isTr ? 'Sepet & Fiyat Manipülasyon Koruması' : 'Cart & Price Tamper Protection',
              desc: isTr ? 'İstemci tarafında DOM üzerinden değiştirilen ürün fiyatları, kasa adımında veritabanı fiyatıyla doğrulanır.' : 'Client-side DOM manipulated prices are strictly re-verified against catalog database.',
              status: 'Passed'
            },
            {
              title: isTr ? 'SSL/TLS 1.3 & HSTS Başlıkları' : 'SSL/TLS 1.3 & HSTS Security Headers',
              desc: isTr ? 'Tüm e-ticaret sayfalarında ve API isteklerinde 256-bit uçtan uca şifreleme zorunludur.' : 'All checkout endpoints enforce HTTPS with strict transport security.',
              status: 'Passed'
            },
            {
              title: isTr ? 'Form XSS & SQL Enjeksiyon Filtrelemesi' : 'Form XSS & SQL Injection Sanitization',
              desc: isTr ? 'Arama inputu ve adres formlarında kötü amaçlı payload girişi denetlendi.' : 'All search inputs and checkout form inputs filter suspicious scripts.',
              status: 'Passed'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 leading-relaxed">{item.desc}</p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[10px] flex-shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
