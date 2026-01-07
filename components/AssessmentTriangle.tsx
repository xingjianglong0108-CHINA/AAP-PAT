
import React from 'react';

interface Props {
  appearanceAbnormal: boolean;
  breathingAbnormal: boolean;
  circulationAbnormal: boolean;
}

const AssessmentTriangle: React.FC<Props> = ({ appearanceAbnormal, breathingAbnormal, circulationAbnormal }) => {
  const getColor = (abnormal: boolean) => abnormal ? '#F87171' : '#34D399';
  const getFilter = (abnormal: boolean) => abnormal ? 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.6))' : 'none';

  return (
    <div className="relative w-72 h-72 mx-auto flex items-center justify-center transition-all duration-700">
      <svg viewBox="0 0 200 180" className="w-full h-full overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Base Triangle Outline */}
        <path 
          d="M 100 20 L 180 150 L 20 150 Z" 
          fill="none" 
          stroke="rgba(255,255,255,0.5)" 
          strokeWidth="10"
          strokeLinejoin="round"
          className="transition-all duration-700"
        />
        
        {/* Appearance Side (Left) */}
        <line 
          x1="100" y1="20" x2="20" y2="150" 
          stroke={getColor(appearanceAbnormal)} 
          strokeWidth="8" 
          strokeLinecap="round" 
          style={{ transition: 'stroke 0.7s, filter 0.7s', filter: getFilter(appearanceAbnormal) }}
        />
        
        {/* Breathing Side (Right) */}
        <line 
          x1="100" y1="20" x2="180" y2="150" 
          stroke={getColor(breathingAbnormal)} 
          strokeWidth="8" 
          strokeLinecap="round" 
          style={{ transition: 'stroke 0.7s, filter 0.7s', filter: getFilter(breathingAbnormal) }}
        />
        
        {/* Circulation Side (Bottom) */}
        <line 
          x1="20" y1="150" x2="180" y2="150" 
          stroke={getColor(circulationAbnormal)} 
          strokeWidth="8" 
          strokeLinecap="round" 
          style={{ transition: 'stroke 0.7s, filter 0.7s', filter: getFilter(circulationAbnormal) }}
        />

        {/* Vertices */}
        <circle cx="100" cy="20" r="7" fill={getColor(appearanceAbnormal || breathingAbnormal)} className="transition-all duration-700" />
        <circle cx="20" cy="150" r="7" fill={getColor(appearanceAbnormal || circulationAbnormal)} className="transition-all duration-700" />
        <circle cx="180" cy="150" r="7" fill={getColor(breathingAbnormal || circulationAbnormal)} className="transition-all duration-700" />

        {/* Labels */}
        <text x="100" y="5" textAnchor="middle" className="text-[12px] fill-slate-500 font-black tracking-widest uppercase">外观</text>
        <text x="10" y="170" textAnchor="middle" className="text-[12px] fill-slate-500 font-black tracking-widest uppercase">循环</text>
        <text x="190" y="170" textAnchor="middle" className="text-[12px] fill-slate-500 font-black tracking-widest uppercase">呼吸</text>
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center pt-10 pointer-events-none">
        <div className={`px-5 py-2 rounded-full text-[11px] font-black tracking-[0.2em] transition-all duration-700 shadow-sm border ${
          (appearanceAbnormal || breathingAbnormal || circulationAbnormal) 
          ? 'bg-red-50/80 text-red-500 border-red-200 backdrop-blur-md scale-110' 
          : 'bg-emerald-50/80 text-emerald-600 border-emerald-200 backdrop-blur-md'
        }`}>
          {(appearanceAbnormal || breathingAbnormal || circulationAbnormal) ? '🚨 ABNORMAL' : '✅ STABLE'}
        </div>
      </div>
    </div>
  );
};

export default AssessmentTriangle;
