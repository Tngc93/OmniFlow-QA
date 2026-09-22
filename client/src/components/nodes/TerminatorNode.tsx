import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { User, CheckCircle2, MoreVertical, Trash2, Unlink } from 'lucide-react';
import { StepData } from '../../types';

interface TerminatorNodeProps {
  id: string;
  data: StepData;
}

export const TerminatorNode: React.FC<TerminatorNodeProps> = ({ id, data }) => {
  const { deleteElements, setEdges } = useReactFlow();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isStart = data.isStart;
  const isRunning = data.status === 'running';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div 
      className="relative group select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(true);
      }}
    >
      {!isStart && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-slate-400 dark:!bg-slate-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-900 hover:!scale-150 hover:!bg-emerald-500 transition-all cursor-crosshair z-20"
          title="Bağlantı Girişi (Bitiş Adımına Bağla)"
        />
      )}

      {/* Terminator Card */}
      <div
        className={`w-64 bg-white dark:bg-slate-900 rounded-xl border px-4 py-3 shadow-xs flex items-center justify-between gap-3 transition-all duration-200 relative
          ${isStart 
            ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700' 
            : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'}
          ${isRunning ? 'ring-3 ring-indigo-500/20 border-indigo-500 animate-pulse' : ''}
        `}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            ${isStart 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' 
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'}
          `}>
            {isStart ? <User className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
              {data.label || (isStart ? 'User Initializing' : 'Action Completion')}
            </h4>
            <span className="text-[11px] text-slate-400 block truncate">
              {data.subtext || (isStart ? 'Initializing for Automation' : 'Automation Complete')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((prev) => !prev);
          }}
          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          title="İşlemler"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-10 right-2 z-50 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              <Unlink className="w-3.5 h-3.5 text-amber-500" />
              <span>Bağlantıları Kes</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                deleteElements({ nodes: [{ id }] });
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-bold"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Düğümü Sil</span>
            </button>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-indigo-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-900 hover:!scale-150 hover:!bg-emerald-500 transition-all cursor-crosshair z-20"
        title="Bağlantı Çıkışı"
      />
    </div>
  );
};
