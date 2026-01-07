
import React from 'react';

interface Props {
  appearanceAbnormal: boolean;
  breathingAbnormal: boolean;
  circulationAbnormal: boolean;
}

const AssessmentTriangle: React.FC<Props> = ({ appearanceAbnormal, breathingAbnormal, circulationAbnormal }) => {
  const getColor = (abnormal: boolean) => abnormal ? '#EF4444' : '#10B981';

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-lg">
        {/* Triangle Path */}
        <path 
          d="M 100 20 L 180 150 L 20 150 Z" 
          fill="none" 
          stroke="#E2E8F0" 
          strokeWidth="8"
          strokeLinejoin="round"
        />
        
        {/* Appearance Side */}
        <line x1="100" y1="20" x2="20" y2="150" stroke={getColor(appearanceAbnormal)} strokeWidth="8" strokeLinecap="round" />
        
        {/* Breathing Side */}
        <line x1="100" y1="20" x2="180" y2="150" stroke={getColor(breathingAbnormal)} strokeWidth="8" strokeLinecap="round" />
        
        {/* Circulation Side */}
        <line x1="20" y1="150" x2="180" y2="150" stroke={getColor(circulationAbnormal)} strokeWidth="8" strokeLinecap="round" />

        {/* Vertices */}
        <circle cx="100" cy="20" r="6" fill={getColor(appearanceAbnormal || breathingAbnormal)} />
        <circle cx="20" cy="150" r="6" fill={getColor(appearanceAbnormal || circulationAbnormal)} />
        <circle cx="180" cy="150" r="6" fill={getColor(breathingAbnormal || circulationAbnormal)} />

        {/* Labels */}
        <text x="100" y="10" textAnchor="middle" className="text-[10px] fill-gray-500 font-bold">外观</text>
        <text x="10" y="165" textAnchor="middle" className="text-[10px] fill-gray-500 font-bold">循环</text>
        <text x="190" y="165" textAnchor="middle" className="text-[10px] fill-gray-500 font-bold">呼吸</text>
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${
          (appearanceAbnormal || breathingAbnormal || circulationAbnormal) 
          ? 'bg-red-50 text-red-600 border border-red-200' 
          : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          PAT 实时状态
        </div>
      </div>
    </div>
  );
};

export default AssessmentTriangle;
