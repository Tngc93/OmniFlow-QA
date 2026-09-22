import React from 'react';
import { 
  getSmoothStepPath, 
  EdgeLabelRenderer, 
  EdgeProps 
} from '@xyflow/react';

export const PillLabelEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  animated = true
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20
  });

  // Color theme based on label
  const getPillTheme = (lbl: string) => {
    const l = (lbl || '').toLowerCase();
    if (l.includes('setup') || l.includes('true') || l.includes('passed')) 
      return 'bg-emerald-500 text-white shadow-emerald-500/30 border-emerald-400';
    if (l.includes('execute') || l.includes('trigger')) 
      return 'bg-amber-500 text-white shadow-amber-500/30 border-amber-400';
    if (l.includes('combine') || l.includes('finalize')) 
      return 'bg-purple-600 text-white shadow-purple-500/30 border-purple-400';
    if (l.includes('direct') || l.includes('filter')) 
      return 'bg-indigo-600 text-white shadow-indigo-500/30 border-indigo-400';
    return 'bg-indigo-500 text-white shadow-indigo-500/20 border-indigo-400';
  };

  return (
    <>
      {/* 1. Ambient Glowing Halo Background Path */}
      <path
        id={`${id}-glow`}
        className="react-flow__edge-glow"
        d={edgePath}
        fill="none"
        stroke="#6366f1"
        strokeWidth={7}
        strokeOpacity={0.25}
        strokeLinecap="round"
        style={{ filter: 'blur(2px)' }}
      />

      {/* 2. Base Solid Connection Guide Line */}
      <path
        id={`${id}-base`}
        d={edgePath}
        fill="none"
        stroke="#818cf8"
        strokeWidth={3}
        strokeOpacity={0.4}
        strokeLinecap="round"
      />

      {/* 3. Live Animated Pulsing Particle Beam Path */}
      <path
        id={id}
        className="react-flow__edge-path-animated"
        d={edgePath}
        fill="none"
        stroke="#4f46e5"
        strokeWidth={3}
        strokeDasharray="10 8"
        strokeLinecap="round"
        markerEnd={markerEnd || 'url(#flow-arrow)'}
        style={{
          animation: 'flowBeam 1.2s linear infinite',
          ...style
        }}
      />

      {/* 4. Connection Pill Label */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan z-20"
          >
            <div
              className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wide border shadow-md transition-all hover:scale-110 select-none flex items-center gap-1.5 cursor-pointer
                ${getPillTheme(String(label))}
              `}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>{label}</span>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
