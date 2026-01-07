
import React, { useState, useMemo } from 'react';
import { PATCategory, Symptom, AssessmentView } from './types';
import { SYMPTOMS, SECONDARY_SYMPTOMS, CATEGORY_LABELS, SECONDARY_CATEGORY_LABELS, ASSESSMENT_LOGIC } from './constants';
import AssessmentTriangle from './components/AssessmentTriangle';
import { generateClinicalReport } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AssessmentView>('INITIAL');
  const [activeCategory, setActiveCategory] = useState<PATCategory>(PATCategory.APPEARANCE);
  const [activeSecondaryCategory, setActiveSecondaryCategory] = useState<string>('Airway');
  
  const [selectedInitialSymptomIds, setSelectedInitialSymptomIds] = useState<Set<string>>(new Set());
  const [selectedSecondarySymptomIds, setSelectedSecondarySymptomIds] = useState<Set<string>>(new Set());
  
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const toggleInitialSymptom = (id: string) => {
    const next = new Set(selectedInitialSymptomIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedInitialSymptomIds(next);
    setAiReport(null);
  };

  const toggleSecondarySymptom = (id: string) => {
    const next = new Set(selectedSecondarySymptomIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedSecondarySymptomIds(next);
    setAiReport(null);
  };

  const reset = () => {
    setSelectedInitialSymptomIds(new Set());
    setSelectedSecondarySymptomIds(new Set());
    setAiReport(null);
    setView('INITIAL');
  };

  const selectedInitialSymptoms = useMemo(() => 
    SYMPTOMS.filter(s => selectedInitialSymptomIds.has(s.id)), 
    [selectedInitialSymptomIds]
  );

  const selectedSecondarySymptoms = useMemo(() => 
    SECONDARY_SYMPTOMS.filter(s => selectedSecondarySymptomIds.has(s.id)), 
    [selectedSecondarySymptomIds]
  );

  const stats = useMemo(() => ({
    appearance: SYMPTOMS.some(s => s.category === PATCategory.APPEARANCE && selectedInitialSymptomIds.has(s.id)),
    breathing: SYMPTOMS.some(s => s.category === PATCategory.BREATHING && selectedInitialSymptomIds.has(s.id)),
    circulation: SYMPTOMS.some(s => s.category === PATCategory.CIRCULATION && selectedInitialSymptomIds.has(s.id)),
  }), [selectedInitialSymptomIds]);

  const assessment = useMemo(() => {
    const key = `${stats.appearance ? '1' : '0'}${stats.breathing ? '1' : '0'}${stats.circulation ? '1' : '0'}`;
    return ASSESSMENT_LOGIC[key];
  }, [stats]);

  const handleGetAiReport = async () => {
    setLoadingReport(true);
    const report = await generateClinicalReport(
      selectedInitialSymptoms, 
      selectedSecondarySymptoms, 
      assessment.title
    );
    setAiReport(report);
    setLoadingReport(false);
  };

  return (
    <div className="min-h-screen pb-12 max-w-2xl mx-auto px-4 pt-6">
      {/* Header Visual */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-sm p-8 mb-6 relative overflow-hidden border border-white/50">
        <button 
          onClick={reset}
          className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-400 transition-all z-10"
          title="重置全部"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>

        <div className="absolute top-6 right-6 flex gap-2 z-10 bg-slate-100/50 p-1 rounded-xl">
          <button 
            onClick={() => setView('INITIAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'INITIAL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'
            }`}
          >
            PAT 初筛
          </button>
          <button 
            onClick={() => setView('SECONDARY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'SECONDARY' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'
            }`}
          >
            ABCDE 详查
          </button>
        </div>

        <div className={`transition-all duration-300 ${view === 'INITIAL' ? 'opacity-100 scale-100 pt-4' : 'opacity-0 scale-95 h-0 overflow-hidden'}`}>
          <AssessmentTriangle 
            appearanceAbnormal={stats.appearance}
            breathingAbnormal={stats.breathing}
            circulationAbnormal={stats.circulation}
          />
        </div>

        {view === 'SECONDARY' && (
          <div className="flex flex-col items-center justify-center py-6 animate-fade-in pt-12">
             <div className="w-16 h-16 bg-blue-50/50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
             </div>
             <h3 className="text-lg font-bold text-slate-800">深度评估阶段</h3>
             <p className="text-xs text-slate-400 mt-1">详细记录生命体征与生理发现</p>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      {view === 'INITIAL' ? (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const isActive = activeCategory === key;
            const isAbnormal = key === PATCategory.APPEARANCE ? stats.appearance :
                              key === PATCategory.BREATHING ? stats.breathing : stats.circulation;
            
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key as PATCategory)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 border-2 relative ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                    : 'bg-white text-slate-400 border-transparent hover:border-slate-100'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">{label.split(' ')[0]}</span>
                {isAbnormal && <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full shadow-sm"></div>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {Object.entries(SECONDARY_CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveSecondaryCategory(key)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-xs transition-all border-2 ${
                activeSecondaryCategory === key 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'bg-white border-transparent text-slate-400 hover:border-slate-100 shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Symptom Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {(view === 'INITIAL' 
          ? SYMPTOMS.filter(s => s.category === activeCategory)
          : SECONDARY_SYMPTOMS.filter(s => s.category === activeSecondaryCategory)
        ).map(symptom => {
          const isSelected = view === 'INITIAL' 
            ? selectedInitialSymptomIds.has(symptom.id)
            : selectedSecondarySymptomIds.has(symptom.id);
          
          return (
            <label 
              key={symptom.id}
              className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all border ${
                isSelected 
                  ? 'bg-blue-50/50 border-blue-200 text-blue-700 shadow-sm' 
                  : 'bg-white/80 border-transparent text-slate-600 hover:border-slate-200 shadow-sm'
              }`}
            >
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isSelected} 
                onChange={() => view === 'INITIAL' ? toggleInitialSymptom(symptom.id) : toggleSecondarySymptom(symptom.id)}
              />
              <div className={`w-5.5 h-5.5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-200 bg-slate-50'
              }`}>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                )}
              </div>
              <span className="text-sm font-semibold">{symptom.label}</span>
            </label>
          );
        })}
      </div>

      {/* Assessment Result Panel - iOS Style Glassmorphism */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-8 text-slate-800 shadow-2xl shadow-slate-200/50 border border-white/50 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[80px] rounded-full opacity-10 pointer-events-none ${
          assessment.priority === '极高' ? 'bg-red-500' : 'bg-blue-500'
        }`}></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
              assessment.priority === '极高' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
            }`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{assessment.title}</h2>
                {/* AI Button - Symbol Only */}
                {!aiReport && (
                  <button 
                    onClick={handleGetAiReport}
                    disabled={loadingReport}
                    className={`p-2 rounded-xl transition-all ${
                      loadingReport 
                        ? 'bg-slate-100' 
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110 active:scale-95 shadow-sm shadow-indigo-100'
                    }`}
                    title="生成 AI 深度分析"
                  >
                    {loadingReport ? (
                      <div className="w-5 h-5 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.644.322a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 004.447 2.223l1.16-1.16a2 2 0 011.022-.547l2.387.477a6 6 0 003.86-.517l.644-.322a6 6 0 013.86-.517l2.387.477a2 2 0 001.022-.547l1.16-1.16a2 2 0 00-4.447-2.223l-1.16 1.16z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <div className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">Clinical Assessment Verdict</div>
            </div>
          </div>
          <div className="bg-white shadow-sm border border-slate-100 px-4 py-2 rounded-2xl text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase">响应</div>
            <div className={`text-base font-black ${assessment.priority === '极高' ? 'text-red-600' : 'text-blue-600'}`}>
              {assessment.priority}
            </div>
          </div>
        </div>

        <div className="bg-slate-50/50 rounded-2xl p-5 mb-8 border border-white/40">
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            {assessment.description}
            {selectedSecondarySymptoms.length > 0 && (
              <span className="block mt-2 text-indigo-500 text-[11px] font-bold">
                • 已集成 {selectedSecondarySymptoms.length} 项 ABCDE 临床发现
              </span>
            )}
          </p>
        </div>

        <div className="mb-2 relative z-10">
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4"/></svg>
            紧急干预指南 (Intervention)
          </div>
          <div className="space-y-2.5">
            {assessment.interventions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white hover:border-blue-100 transition-all group shadow-sm">
                <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Report Section */}
        {aiReport && (
          <div className="mt-8 pt-8 border-t border-slate-100/50 animate-fade-in relative z-10">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">AI 专家综合决策报告</span>
               </div>
               <button 
                onClick={() => setAiReport(null)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase"
               >
                 收起
               </button>
             </div>
             <div className="bg-white/80 rounded-[2rem] p-6 text-sm text-slate-600 shadow-inner border border-white prose prose-slate prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-medium leading-relaxed">{aiReport}</div>
             </div>
          </div>
        )}
      </div>

      <p className="mt-10 text-center text-[10px] text-slate-400 font-bold leading-relaxed tracking-wide">
        iOS 系统风格临床决策辅助 • POWERED BY GEMINI 3.0 PRO<br/>
        请遵循 PALS/APLS 指南，AI 生成内容仅供参考
      </p>
    </div>
  );
};

export default App;
