import React, { useMemo, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  BackgroundVariant,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TerminatorNode } from './nodes/TerminatorNode';
import { FlowStepNode } from './nodes/FlowStepNode';
import { DecisionNode } from './nodes/DecisionNode';
import { PillLabelEdge } from './edges/PillLabelEdge';
import { Language } from '../locales/translations';
import { Zap, Code2, Bot, Sparkles } from 'lucide-react';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onConnect?: (connection: any) => void;
  onRestartTest?: () => void;
  isDarkMode: boolean;
  activeScenarioTitle?: string;
  targetUrl?: string;
  domainFlag?: string;
  domainBadge?: string;
  onOpenTrainingGuide?: () => void;
  lang?: Language;
  viewport?: 'desktop' | 'mobile' | 'tablet';
  onViewportChange?: (viewport: 'desktop' | 'mobile' | 'tablet') => void;
  onOpenWebVitals?: () => void;
  onOpenPlaywrightCode?: () => void;
  onOpenSelfHealing?: () => void;
  onOpenOmniMind?: () => void;
}

const AutoFitViewWatcher: React.FC<{ scenarioKey?: string; nodeCount?: number }> = ({ scenarioKey, nodeCount }) => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.16, duration: 400 });
    }, 120);
    return () => clearTimeout(timer);
  }, [scenarioKey, nodeCount, fitView]);

  return null;
};

const FlowCanvasInner: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onConnect,
  onRestartTest,
  isDarkMode,
  activeScenarioTitle = 'NovaTech TR E2E Flow',
  targetUrl = 'https://www.novatech.com.tr',
  domainFlag,
  domainBadge,
  onOpenTrainingGuide,
  lang = 'tr',
  viewport = 'desktop',
  onViewportChange,
  onOpenWebVitals,
  onOpenPlaywrightCode,
  onOpenSelfHealing,
  onOpenOmniMind
}) => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        if (onOpenOmniMind) onOpenOmniMind();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenOmniMind]);

  const nodeTypes = useMemo(() => ({
    terminatorNode: TerminatorNode,
    flowStepNode: FlowStepNode,
    decisionNode: DecisionNode
  }), []);

  const edgeTypes = useMemo(() => ({
    pillLabelEdge: PillLabelEdge,
    default: PillLabelEdge
  }), []);

  return (
    <div className={`w-full h-full relative overflow-hidden select-none transition-colors ${isDarkMode ? 'bg-[#080c14]' : 'bg-[#f8fafc]'}`}>
      
      {/* SVG Definitions for Vibrant Edge Markers */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <marker
            id="flow-arrow"
            viewBox="0 0 12 12"
            refX="9"
            refY="6"
            markerWidth="10"
            markerHeight="10"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 6 L 0 11 z" fill={isDarkMode ? '#818cf8' : '#4f46e5'} />
          </marker>
        </defs>
      </svg>

      {/* Top Floating Engineering Technical HUD Overlay */}
      <div className="absolute top-4 left-6 right-6 z-10 pointer-events-none flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-sm font-mono text-[10px]
          bg-white/85 dark:bg-slate-900/85 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800 dark:text-white">SYS:PLAYWRIGHT-CHROMIUM</span>
          
          {domainFlag && (
            <>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 dark:text-slate-400">
                DOMAIN: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{domainFlag} {domainBadge || targetUrl}</strong>
              </span>
            </>
          )}

          <span className="text-slate-400">|</span>
          <span className="text-slate-500 dark:text-slate-400">TARGET: <strong className="text-indigo-600 dark:text-indigo-400 truncate max-w-[160px] inline-block align-bottom">{targetUrl}</strong></span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 dark:text-slate-400">NODES: <strong>{nodes.length}</strong></span>

          {/* Device Viewport Emulation Segmented Control */}
          {onViewportChange && (
            <>
              <span className="text-slate-400">|</span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[9px] font-bold border border-slate-200/60 dark:border-slate-700/60">
                <button
                  type="button"
                  data-testid="viewport-desktop-btn"
                  onClick={() => onViewportChange('desktop')}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    viewport === 'desktop'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Masaüstü (1920x1080 Full HD)"
                >
                  🖥️ 1080p
                </button>
                <button
                  type="button"
                  data-testid="viewport-mobile-btn"
                  onClick={() => onViewportChange('mobile')}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    viewport === 'mobile'
                      ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Mobil (iPhone 15 Pro - 393x852 @3x)"
                >
                  📱 iPhone
                </button>
                <button
                  type="button"
                  data-testid="viewport-tablet-btn"
                  onClick={() => onViewportChange('tablet')}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    viewport === 'tablet'
                      ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Tablet (iPad Air - 820x1180 @2x)"
                >
                  📱 iPad
                </button>
              </div>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-sm font-mono text-[10px]
          bg-white/85 dark:bg-slate-900/85 border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 pointer-events-auto">
          <span className="text-slate-400">GRID: <strong className="text-slate-700 dark:text-slate-200">32px CAD BLUEPRINT</strong></span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">FLOW: <strong className="text-rose-600 dark:text-rose-400">{activeScenarioTitle}</strong></span>
          
          {onOpenWebVitals && (
            <>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                data-testid="open-web-vitals-btn"
                onClick={onOpenWebVitals}
                className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer flex items-center gap-1 border border-amber-200/50 dark:border-amber-800/50 shadow-2xs"
                title="Google Core Web Vitals & Lighthouse Hız Karnesi"
              >
                <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>⚡ Web Vitals: 96/100</span>
              </button>
            </>
          )}

          {onOpenSelfHealing && (
            <>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                data-testid="open-self-healing-btn"
                onClick={onOpenSelfHealing}
                className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer flex items-center gap-1 border border-emerald-200/50 dark:border-emerald-800/50 shadow-2xs"
                title="AI Kendi Kendini İyileştiren Seçici Paneli"
              >
                <Bot className="w-3 h-3 text-emerald-500" />
                <span>🤖 AI Healing (3)</span>
              </button>
            </>
          )}

          {onOpenPlaywrightCode && (
            <>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                data-testid="open-playwright-code-btn"
                onClick={onOpenPlaywrightCode}
                className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer flex items-center gap-1 border border-purple-200/50 dark:border-purple-800/50 shadow-2xs"
                title="Playwright TypeScript Kodunu Gör ve Dışa Aktar"
              >
                <Code2 className="w-3 h-3 text-purple-500" />
                <span>💾 spec.ts</span>
              </button>
            </>
          )}

          {onOpenOmniMind && (
            <>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                data-testid="open-omnimind-ai-btn"
                onClick={onOpenOmniMind}
                className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white font-extrabold hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-violet-500/30 text-xs border border-violet-400/40"
                title="OmniMind AI: Autonomous QA & Neural Copilot (Ctrl + J)"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>🧠 OmniMind AI</span>
              </button>
            </>
          )}

          <span className="text-slate-400">|</span>
          <button
            onClick={() => fitView({ padding: 0.16, duration: 400 })}
            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            title={lang === 'en' ? 'Fit canvas to view' : 'Tuvali Ekrana Sığdır ve Ortala'}
          >
            <span>🎯 {lang === 'en' ? 'Fit View' : 'Sığdır'}</span>
          </button>

          {onOpenTrainingGuide && (
            <>
              <span className="text-slate-400">|</span>
              <button
                onClick={onOpenTrainingGuide}
                className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                {lang === 'en' ? '🎓 Training Guide' : '🎓 Eğitim & Rehber'}
              </button>
            </>
          )}

          {onRestartTest && (
            <>
              <span className="text-slate-400">|</span>
              <button
                onClick={onRestartTest}
                className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
                title={lang === 'en' ? 'Reset and Restart Test Automation' : 'Otomasyonu Sıfırla ve Baştan Başlat'}
              >
                <span>🔄 {lang === 'en' ? 'Restart' : 'Baştan Başlat'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Floating Device Emulation Indicator if Mobile/Tablet */}
      {viewport !== 'desktop' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-3.5 py-1 rounded-full bg-slate-900/90 text-white border border-slate-700 text-[10px] font-mono shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="font-bold text-pink-400">RESPONSIVE EMULATION:</span>
          <span>
            {viewport === 'mobile' ? 'iPhone 15 Pro (393 × 852 px • 3.0x DPR • Touch Enabled)' : 'iPad Air (820 × 1180 px • 2.0x DPR • Touch Enabled)'}
          </span>
        </div>
      )}

      {/* Technical CAD Corner Crosshairs & Marks */}
      <div className="absolute top-3 left-3 text-slate-400/70 dark:text-slate-700 font-mono text-[10px] pointer-events-none z-10">
        ┌─ [CAD_ORCH_V2]
      </div>
      <div className="absolute top-3 right-3 text-slate-400/70 dark:text-slate-700 font-mono text-[10px] pointer-events-none z-10 text-right">
        [LIVE_DOM_SYNC] ─┐
      </div>
      <div className="absolute bottom-3 left-3 text-slate-400/70 dark:text-slate-700 font-mono text-[10px] pointer-events-none z-10">
        └─ [TELEMETRY: ACTIVE]
      </div>
      <div className="absolute bottom-3 right-16 text-slate-400/70 dark:text-slate-700 font-mono text-[10px] pointer-events-none z-10 text-right">
        [E2E_AUTO_PIPELINE] ─┘
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.2}
        maxZoom={2}
      >
        <AutoFitViewWatcher scenarioKey={activeScenarioTitle} nodeCount={nodes.length} />

        {/* Layer 1: High-Tech Engineering Grid Lines */}
        <Background 
          variant={BackgroundVariant.Lines} 
          gap={36} 
          size={1} 
          color={isDarkMode ? '#172033' : '#e2e8f0'} 
        />

        {/* Layer 2: Subtle Tech Matrix Crosshair Dots */}
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={18} 
          size={1} 
          color={isDarkMode ? '#1e293b' : '#cbd5e1'} 
        />
        
        {/* Bottom Zoom Controls with high-tech styling */}
        <Controls 
          className="!bg-white dark:!bg-slate-900 !border !border-slate-200 dark:!border-slate-800 !shadow-lg !rounded-xl !p-1 text-slate-700 dark:text-slate-200" 
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
};

export const FlowCanvas: React.FC<FlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};
