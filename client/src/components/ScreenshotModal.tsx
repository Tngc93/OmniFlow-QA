import React from 'react';
import { X, Download, ExternalLink, Camera, Eye } from 'lucide-react';

interface ScreenshotModalProps {
  url: string | null;
  onClose: () => void;
  onOpenVisualDiff?: (url: string) => void;
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({ url, onClose, onOpenVisualDiff }) => {
  React.useEffect(() => {
    if (!url) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [url, onClose]);

  if (!url) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold">Automation Step Screenshot Capture</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenVisualDiff && (
              <button
                type="button"
                data-testid="open-visual-diff-btn"
                onClick={() => {
                  onClose();
                  onOpenVisualDiff(url);
                }}
                className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-pink-400" />
                <span>Piksel-Diff Regresyon</span>
              </button>
            )}

            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Full Size
            </a>
            <button 
              data-testid="modal-close-btn"
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/50">
          <img 
            src={url} 
            alt="Step Screenshot" 
            className="max-h-[75vh] w-auto rounded-lg shadow-2xl object-contain border border-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
