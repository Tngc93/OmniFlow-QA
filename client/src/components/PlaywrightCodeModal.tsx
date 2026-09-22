import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Code2, 
  FileCode, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Scenario } from '../types';
import { generatePlaywrightCode } from '../utils/playwrightGenerator';
import { Language } from '../locales/translations';

interface PlaywrightCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario | null;
  viewport?: 'desktop' | 'mobile' | 'tablet';
  lang?: Language;
}

export const PlaywrightCodeModal: React.FC<PlaywrightCodeModalProps> = ({
  isOpen,
  onClose,
  scenario,
  viewport = 'desktop',
  lang = 'tr'
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCmdCopied, setIsCmdCopied] = useState(false);
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

  const generatedCode = generatePlaywrightCode(scenario, viewport);
  const fileName = `e2e-${(scenario?.id || 'omniflow-pipeline').replace(/[^a-z0-9_-]/gi, '-')}.spec.ts`;
  const cliCommand = `npx playwright test ${fileName} --project=chromium --headed`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(cliCommand);
    setIsCmdCopied(true);
    setTimeout(() => setIsCmdCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([generatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const codeLines = generatedCode.split('\n');

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
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">
                  {isTr ? 'Playwright TypeScript E2E Kod Üretici' : 'Playwright TypeScript E2E Spec Generator'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-800">
                  v1.42+ Compatible
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {scenario?.title || 'Master Pipeline'} • {codeLines.length} {isTr ? 'Satır TypeScript Kodu' : 'Lines of TypeScript'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyCode}
              data-testid="copy-playwright-code-btn"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isCopied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Kodu Kopyala' : 'Copy Code')}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isTr ? '.spec.ts İndir' : 'Download .spec.ts'}</span>
            </button>

            <button 
              onClick={onClose} 
              data-testid="playwright-code-close"
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* IDE Code Viewer */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#0b0f19]">
          {/* File Tab Bar */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border-t-2 border-indigo-500 rounded-t text-indigo-300 font-bold">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>{fileName}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span>UTF-8</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span className="text-emerald-500">Playwright Test Runner</span>
            </div>
          </div>

          {/* Syntax Highlighted Lines Container */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed select-text">
            <div className="table w-full">
              {codeLines.map((line, idx) => {
                let lineClass = 'text-slate-300';
                if (line.trim().startsWith('import') || line.trim().startsWith('from') || line.trim().startsWith('export')) {
                  lineClass = 'text-purple-400 font-bold';
                } else if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
                  lineClass = 'text-slate-500 italic';
                } else if (line.includes('test(') || line.includes('test.describe(') || line.includes('test.step(')) {
                  lineClass = 'text-sky-400 font-bold';
                } else if (line.includes('await page.') || line.includes('expect(')) {
                  lineClass = 'text-emerald-400';
                } else if (line.includes("path:") || line.includes("waitUntil:")) {
                  lineClass = 'text-amber-300';
                }

                return (
                  <div key={idx} className="table-row hover:bg-slate-800/30">
                    <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-[11px] w-12">
                      {idx + 1}
                    </span>
                    <span className={`table-cell whitespace-pre font-mono ${lineClass}`}>
                      {line}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer / CLI Run Guide */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/80 text-xs">
          <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold flex-shrink-0">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{isTr ? 'Terminalde Çalıştır:' : 'Run in CLI:'}</span>
            </div>
            <code className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 truncate flex-1 select-all">
              {cliCommand}
            </code>
            <button
              onClick={handleCopyCmd}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
              title="Komutu Kopyala"
            >
              {isCmdCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{isCmdCopied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-sm cursor-pointer flex-shrink-0"
          >
            {isTr ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
