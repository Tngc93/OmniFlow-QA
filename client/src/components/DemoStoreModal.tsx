import React from 'react';
import { X, ExternalLink, Globe } from 'lucide-react';

interface DemoStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

export const DemoStoreModal: React.FC<DemoStoreModalProps> = ({ 
  isOpen, 
  onClose,
  url = 'http://localhost:5000/demo-shop'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-3.5 px-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">FlowShop - Canlı E-Ticaret Hedefi (Mock Store)</h3>
              <span className="text-[10px] text-slate-400 font-mono">{url}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Yeni Sekmede Aç
            </a>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full h-full bg-slate-100 relative">
          <iframe 
            src={url} 
            title="FlowShop Live Mock Store"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};
