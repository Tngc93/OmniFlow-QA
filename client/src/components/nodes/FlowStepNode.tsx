import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { 
  Zap, 
  Check, 
  GripVertical, 
  Database, 
  Layers, 
  Search, 
  ShoppingBag, 
  CreditCard, 
  Loader2, 
  Camera,
  MoreVertical,
  Trash2,
  Unlink,
  Play,
  Edit3,
  Bug,
  Save,
  X,
  Eye
} from 'lucide-react';
import { StepData } from '../../types';

interface FlowStepNodeProps {
  id: string;
  data: StepData;
  selected?: boolean;
}

export const FlowStepNode: React.FC<FlowStepNodeProps> = ({ id, data, selected }) => {
  const { deleteElements, setEdges, setNodes } = useReactFlow();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(data.name || '');
  const [editSubtitle, setEditSubtitle] = useState(data.subtext || data.expected || '');
  const menuRef = useRef<HTMLDivElement>(null);

  const isRunning = data.status === 'running';
  const isPassed = data.status === 'passed';
  const isFailed = data.status === 'failed';

  // Close context menu on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
        setIsEditing(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  // Context Menu Actions
  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    deleteElements({ nodes: [{ id }] });
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const handleRunStep = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    window.dispatchEvent(new CustomEvent('run-single-step', { detail: { nodeId: id, data } }));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            data: {
              ...n.data,
              name: editTitle,
              subtext: editSubtitle,
              expected: editSubtitle
            }
          };
        }
        return n;
      })
    );
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleJiraDispatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    window.dispatchEvent(
      new CustomEvent('jira-create-defect', {
        detail: {
          scenarioTitle: data.name,
          stepName: data.name,
          errorMessage: data.expected || 'Step validation defect',
          screenshot: data.screenshot || '/screenshots/flowshop_home_live.png'
        }
      })
    );
  };

  const handleVisualDiff = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    window.dispatchEvent(
      new CustomEvent('open-visual-diff', {
        detail: {
          stepName: data.name || 'E-Ticaret Arayüz Adımı',
          screenshot: data.screenshot || '/screenshots/flowshop_home_live.png'
        }
      })
    );
  };

  // Choose icon based on name or action
  const getStepIcon = () => {
    const name = (data.name || '').toLowerCase();
    if (name.includes('data') || name.includes('collect') || name.includes('init')) return <Database className="w-4 h-4 text-indigo-500" />;
    if (name.includes('search') || name.includes('arama') || name.includes('filter')) return <Search className="w-4 h-4 text-sky-500" />;
    if (name.includes('pdp') || name.includes('laptop') || name.includes('item') || name.includes('horizon') || name.includes('titan')) return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
    if (name.includes('cart') || name.includes('sepet') || name.includes('output')) return <Layers className="w-4 h-4 text-orange-500" />;
    if (name.includes('trigger') || name.includes('action') || name.includes('execute')) return <Zap className="w-4 h-4 text-amber-500" />;
    return <CreditCard className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div 
      className="relative group select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(true);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400 dark:!bg-slate-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-900 hover:!scale-150 hover:!bg-indigo-500 transition-all cursor-crosshair z-20"
        title="Bağlantı Girişi (Sürükleyip Bırakın)"
      />

      {/* Main Node Card */}
      <div
        className={`w-72 bg-white dark:bg-slate-900 rounded-2xl border p-4 shadow-sm transition-all duration-200 backdrop-blur-sm relative
          ${selected 
            ? 'border-indigo-600 dark:border-indigo-500 ring-3 ring-indigo-500/20 shadow-md' 
            : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'}
          ${isRunning ? 'border-amber-500 ring-4 ring-amber-500/20 animate-pulse' : ''}
          ${isPassed ? 'border-emerald-300 dark:border-emerald-800/80 shadow-emerald-500/5' : ''}
          ${isFailed ? 'border-rose-400 dark:border-rose-800 ring-3 ring-rose-500/20' : ''}
        `}
      >
        {/* Inline Edit Form Modal inside Node */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-2.5 py-1">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Adımı Düzenle
              </span>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Adım Adı</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Açıklama / Beklenen Değer</label>
              <input
                type="text"
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
                className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-1 shadow-xs"
              >
                <Save className="w-3 h-3" /> Kaydet
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Top Header: Icon + Title/Subtitle + 3-Dots Action Button */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  ) : (
                    getStepIcon()
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate" title={data.name}>
                    {data.name || 'Test Step'}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-snug truncate" title={data.subtext}>
                    {data.subtext || data.expected || 'Automated Step Execution'}
                  </p>
                </div>
              </div>

              {/* 3-Dots Button and Drag Handle */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  data-testid="node-more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu((prev) => !prev);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  title="Adım İşlemleri (Sil, Düzenle, Bağlantıları Kes)"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
                <div className="text-slate-300 dark:text-slate-600 hover:text-slate-500 cursor-grab">
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Live Playwright Screenshot Thumbnail */}
            {data.screenshot && (
              <div 
                data-testid="node-screenshot-thumb"
                onClick={(e) => {
                  e.stopPropagation();
                  window.dispatchEvent(
                    new CustomEvent('open-screenshot-modal', {
                      detail: { url: data.screenshot, title: data.name, subtext: data.subtext }
                    })
                  );
                }}
                className="mb-2.5 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 relative group/thumb max-h-16 cursor-pointer"
                title="Büyük Ekran Görüntüsünü İncele"
              >
                <img src={data.screenshot} alt="Step screenshot" className="w-full h-16 object-cover object-top" />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Live Snapshot (Büyüt)
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Metric Pills */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]" title="Tasks">
                {data.components || 11}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]" title="Duration">
                {data.duration || data.metricTime || '1.8s'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-0.5" title="Passed Assertions">
                <Check className="w-3 h-3 stroke-[3]" />
                {data.metricPassed || 41}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold text-[10px] flex items-center gap-0.5" title="Automated Events">
                <Zap className="w-3 h-3 fill-violet-600 dark:fill-violet-400 text-violet-600 dark:text-violet-400" />
                {data.metricAutomated || 72}
              </span>
            </div>
          </>
        )}

        {/* 3-Dots / Right-Click Floating Action Menu */}
        {showMenu && !isEditing && (
          <div
            ref={menuRef}
            className="absolute top-10 right-2 z-50 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleRunStep}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bu Adımı Test Et</span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                setIsEditing(true);
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Adımı Düzenle</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              <Unlink className="w-3.5 h-3.5 text-amber-500" />
              <span>Bağlantıları Kes</span>
            </button>

            <button
              onClick={handleJiraDispatch}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              <Bug className="w-3.5 h-3.5 text-sky-500" />
              <span>Jira MCP'ye İlet</span>
            </button>

            <button
              onClick={handleVisualDiff}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-pink-500" />
              <span>Görsel Regresyon (Piksel-Diff)</span>
            </button>

            <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

            <button
              onClick={handleDeleteNode}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-bold"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Adımı Sil (Tuvalden Kaldır)</span>
            </button>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-indigo-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-900 hover:!scale-150 hover:!bg-emerald-500 transition-all cursor-crosshair z-20"
        title="Bağlantı Çıkışı (Tıklayıp Diğer Adıma Sürükleyin)"
      />
    </div>
  );
};
