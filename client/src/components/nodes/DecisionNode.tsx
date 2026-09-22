import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { GitBranch, MoreVertical, Trash2, Unlink } from 'lucide-react';
import { StepData } from '../../types';

interface DecisionNodeProps {
  id: string;
  data: StepData;
  selected?: boolean;
}

export const DecisionNode: React.FC<DecisionNodeProps> = ({ id, data, selected }) => {
  const { deleteElements, setEdges } = useReactFlow();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-400 !w-3 !h-3 !border-2 !border-white hover:!scale-150 transition-all cursor-crosshair z-20"
        title="Bağlantı Girişi"
      />

      <div
        className={`w-60 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-3 shadow-sm transition-all relative
          ${selected ? 'ring-2 ring-amber-500' : ''}
        `}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 flex items-center justify-center text-xs font-bold">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-amber-950 dark:text-amber-100">{data.label || 'Decision Branch'}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="p-1 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-md transition-colors"
            title="İşlemler"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>

        {data.condition && (
          <p className="text-[10px] font-mono text-amber-900 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-900/40 p-1.5 rounded border border-amber-200 dark:border-amber-800 truncate">
            {data.condition}
          </p>
        )}

        <div className="flex justify-between items-center mt-2 text-[10px] font-bold">
          <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> True (Pass)
          </span>
          <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> False (Retry)
          </span>
        </div>

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
        id="bottom"
        className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white hover:!scale-150 transition-all cursor-crosshair z-20"
        title="Bağlantı Çıkışı"
      />
    </div>
  );
};
