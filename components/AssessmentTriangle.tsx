import React from 'react';

interface Props {
  appearanceAbnormal: boolean;
  breathingAbnormal: boolean;
  circulationAbnormal: boolean;
  type: 'PAT' | 'IA';
}

const AssessmentTriangle: React.FC<Props> = ({ 
  appearanceAbnormal, 
  breathingAbnormal, 
  circulationAbnormal,
  type
}) => {
  const getColor = (abnormal: boolean) => abnormal ? '#EF4444' : '#10B981';
  const getFilter = (abnormal: boolean) => abnormal ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.7))' : 'none';

  const leftLabel = type === 'PAT' ? '气道与外观 (Airway/App)' : '气道与外观 (Airway/Mental)';
  const rightLabel = type === 'PAT' ? '呼吸功 (Breathing Work)' : '呼吸状态 (Breathing Status)';
  const bottomLabel = type === 'PAT' ? '皮肤循环 (Circulation)' : '血管循环 (Vitals/Pulse)';

  const activeCount = (appearanceAbnormal ? 1 : 0) + (breathingAbnormal ? 1 : 0) + (circulationAbnormal ? 1 : 0);

  return (
    <div className="relative w-80 h-80 mx-auto flex flex-col items-center justify-center transition-all duration-700">
      <div className="text-center mb-1 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
        {type === 'PAT' ? '一般面貌第一印象 (General Impression)' : '二次详细生理评估 (Primary Survey)'}
      </div>
      
      <svg viewBox="0 0 240 220" className="w-[85%] h-[85%] overflow-visible mt-2">
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Glow behind abnormal triangle */}
        {activeCount > 0 && (
          <path 
            d="M 120 25 L 210 170 L 30 170 Z" 
            fill="url(#ringGlow)" 
            className="animate-pulse duration-[3s]"
          />
        )}

        {/* Base Triangle Outline Background */}
        <path 
          d="M 120 25 L 210 170 L 30 170 Z" 
          fill="none" 
          stroke="rgba(255,255,255,0.7)" 
          strokeWidth="11"
          strokeLinejoin="round"
          className="transition-all duration-750"
        />
        
        {/* Airway & Appearance Side (Left side of triangle) */}
        <line 
          x1="120" y1="25" x2="30" y2="170" 
          stroke={getColor(appearanceAbnormal)} 
          strokeWidth="9" 
          strokeLinecap="round" 
          style={{ transition: 'stroke 0.5s, filter 0.5s', filter: getFilter(appearanceAbnormal) }}
        />
        
        {/* Breathing Side (Right side of triangle) */}
        <line 
          x1="120" y1="25" x2="210" y2="170" 
          stroke={getColor(breathingAbnormal)} 
          strokeWidth="9" 
          strokeLinecap="round" 
          style={{ transition: 'stroke 0.5s, filter 0.5s', filter: getFilter(breathingAbnormal) }}
        />
        
        {/* Circulation Side (Bottom of triangle) */}
        <line 
          x1="30" y1="170" x2="210" y2="170" 
          stroke={getColor(circulationAbnormal)} 
          strokeWidth="9" 
          strokeLinecap="round" 
          style={{ transition: 'stroke 0.5s, filter 0.5s', filter: getFilter(circulationAbnormal) }}
        />

        {/* Vertices indicator circles */}
        <circle cx="120" cy="25" r="8" fill={getColor(appearanceAbnormal || breathingAbnormal)} className="transition-all duration-500 shadow-lg" />
        <circle cx="30" cy="170" r="8" fill={getColor(appearanceAbnormal || circulationAbnormal)} className="transition-all duration-500 shadow-lg" />
        <circle cx="210" cy="170" r="8" fill={getColor(breathingAbnormal || circulationAbnormal)} className="transition-all duration-500 shadow-lg" />

        {/* Vertex Labels inside the SVG */}
        {/* Top: Airway & Appearance */}
        <text 
          x="120" 
          y="-1" 
          textAnchor="middle" 
          className={`text-[11px] font-black tracking-wider transition-colors duration-500 ${appearanceAbnormal ? 'fill-red-600 font-black' : 'fill-slate-600 font-extrabold'}`}
        >
          {leftLabel}
        </text>
        
        {/* Right Bottom: Breathing */}
        <text 
          x="165" 
          y="186" 
          textAnchor="start" 
          className={`text-[11px] font-black tracking-wider transition-colors duration-500 ${breathingAbnormal ? 'fill-red-600 font-black' : 'fill-slate-600 font-extrabold'}`}
        >
          {rightLabel}
        </text>

        {/* Left Bottom: Circulation */}
        <text 
          x="75" 
          y="186" 
          textAnchor="end" 
          className={`text-[11px] font-black tracking-wider transition-colors duration-500 ${circulationAbnormal ? 'fill-red-600 font-black' : 'fill-slate-600 font-extrabold'}`}
        >
          {bottomLabel}
        </text>
      </svg>
      
      <div className="absolute bottom-1 flex items-center justify-center pointer-events-none">
        <div className={`px-5 py-2 rounded-full text-[11px] font-black tracking-[0.2em] transition-all duration-500 shadow-sm border ${
          activeCount > 0 
          ? 'bg-red-500/10 text-red-600 border-red-300 backdrop-blur-md scale-105 font-black' 
          : 'bg-emerald-500/10 text-emerald-600 border-emerald-300 backdrop-blur-md font-black'
        }`}>
          {activeCount > 0 ? `🚨 ${activeCount} 项异常 (Abnormal)` : '✅ 指标完全正常 (All Normal)'}
        </div>
      </div>
    </div>
  );
};

export default AssessmentTriangle;
