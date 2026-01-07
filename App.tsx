
import React, { useState, useMemo } from 'react';
import { PATCategory, Symptom, AssessmentView } from './types';
import { SYMPTOMS, SECONDARY_SYMPTOMS, CATEGORY_LABELS, SECONDARY_CATEGORY_LABELS, ASSESSMENT_LOGIC, INTERVENTION_GUIDANCE } from './constants';
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
  
  const [activeGuidance, setActiveGuidance] = useState<{ title: string, details: string[] } | null>(null);

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
    setActiveGuidance(null);
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
    <div className="min-h-screen pb-16 max-w-2xl mx-auto px-6 pt-8 relative z-10">
      {/* Modal - Guidance Details */}
      {activeGuidance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" onClick={() => setActiveGuidance(null)}></div>
          <div className="glass-card rounded-[3.5rem] p-10 max-w-md w-full shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 duration-500 ease-out">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{activeGuidance.title}</h3>
                <button onClick={() => setActiveGuidance(null)} className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:rotate-90">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <div className="space-y-4">
                {activeGuidance.details.map((detail, i) => (
                  <div key={i} className={`flex gap-4 items-start p-5 bg-white/40 rounded-3xl border border-white/80 animate-slide-up stagger-${i+1}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 mt-2 shrink-0 shadow-[0_0_12px_rgba(192,132,252,0.6)]"></div>
                    <p className="text-[15px] font-bold text-slate-700 leading-relaxed">{detail}</p>
                  </div>
                ))}
             </div>
             <button onClick={() => setActiveGuidance(null)} className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest">
                我知道了
             </button>
          </div>
        </div>
      )}

      {/* Header Visual */}
      <div className="glass-card rounded-[4rem] p-10 mb-10 relative overflow-hidden animate-slide-up">
        {/* Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-100/40 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-100/40 blur-3xl rounded-full"></div>

        <button onClick={reset} className="absolute top-10 left-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 text-slate-400 hover:text-red-500 transition-all z-10 shadow-sm active:scale-90" title="重置">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>

        <div className="absolute top-10 right-10 flex gap-2 z-10 bg-black/5 p-1.5 rounded-3xl backdrop-blur-xl">
          <button onClick={() => setView('INITIAL')} className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 ${view === 'INITIAL' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>初筛 (PAT)</button>
          <button onClick={() => setView('SECONDARY')} className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 ${view === 'SECONDARY' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>详查 (ABCDE)</button>
        </div>

        <div className={`transition-all duration-700 ${view === 'INITIAL' ? 'opacity-100 scale-100 pt-10' : 'opacity-0 scale-90 h-0 overflow-hidden'}`}>
          <AssessmentTriangle appearanceAbnormal={stats.appearance} breathingAbnormal={stats.breathing} circulationAbnormal={stats.circulation} />
        </div>

        {view === 'SECONDARY' && (
          <div className="flex flex-col items-center justify-center py-12 animate-in fade-in slide-in-from-top-4 duration-700 pt-20">
             <div className="w-24 h-24 bg-white/60 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm border border-white">
                <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
             </div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">二次详细评估</h3>
             <p className="text-sm text-slate-400 mt-2 font-bold tracking-widest uppercase">Clinical Physiological Examination</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="animate-slide-up stagger-1">
        {view === 'INITIAL' ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const isActive = activeCategory === key;
              const isAbnormal = key === PATCategory.APPEARANCE ? stats.appearance : key === PATCategory.BREATHING ? stats.breathing : stats.circulation;
              return (
                <button key={key} onClick={() => setActiveCategory(key as PATCategory)} className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] transition-all duration-500 border-2 relative ${isActive ? 'bg-indigo-600 text-white border-indigo-400 shadow-2xl shadow-indigo-200 scale-105 z-10' : 'bg-white/40 text-slate-400 border-transparent hover:border-white'}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label.split(' ')[0]}</span>
                  {isAbnormal && <div className="absolute top-4 right-4 w-3 h-3 bg-red-400 rounded-full shadow-lg animate-pulse border-2 border-white"></div>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
            {Object.entries(SECONDARY_CATEGORY_LABELS).map(([key, label]) => (
              <button key={key} onClick={() => setActiveSecondaryCategory(key)} className={`flex-shrink-0 px-8 py-4 rounded-[1.75rem] font-black text-xs transition-all duration-300 border-2 ${activeSecondaryCategory === key ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl' : 'bg-white/40 border-transparent text-slate-500 hover:bg-white/60'}`}>{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Symptom Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 animate-slide-up stagger-2">
        {(view === 'INITIAL' ? SYMPTOMS.filter(s => s.category === activeCategory) : SECONDARY_SYMPTOMS.filter(s => s.category === activeSecondaryCategory)).map((symptom, idx) => {
          const isSelected = view === 'INITIAL' ? selectedInitialSymptomIds.has(symptom.id) : selectedSecondarySymptomIds.has(symptom.id);
          return (
            <label key={symptom.id} className={`flex items-center p-6 rounded-[2.25rem] cursor-pointer transition-all duration-300 border backdrop-blur-sm group animate-slide-up stagger-${(idx % 4) + 1} ${isSelected ? 'bg-indigo-50/60 border-indigo-300 text-indigo-900 shadow-md translate-y-[-4px]' : 'bg-white/40 border-white text-slate-600 hover:bg-white/70 shadow-sm'}`}>
              <input type="checkbox" className="hidden" checked={isSelected} onChange={() => view === 'INITIAL' ? toggleInitialSymptom(symptom.id) : toggleSecondarySymptom(symptom.id)} />
              <div className={`w-7 h-7 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${isSelected ? 'border-indigo-500 bg-indigo-500 shadow-lg' : 'border-slate-200 bg-white/80 group-hover:border-indigo-300'}`}>
                {isSelected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
              </div>
              <span className="text-[15px] font-extrabold tracking-tight">{symptom.label}</span>
            </label>
          );
        })}
      </div>

      {/* Result Panel */}
      <div className="glass-card rounded-[4.5rem] p-12 text-slate-800 shadow-2xl relative overflow-hidden animate-slide-up stagger-3">
        <div className={`absolute -top-40 -right-40 w-96 h-96 blur-[120px] rounded-full opacity-20 transition-colors duration-1000 ${assessment.priority === '极高' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>

        <div className="flex justify-between items-start mb-12 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-lg transition-all duration-700 ${assessment.priority === '极高' ? 'bg-red-50 text-red-500 border-red-100 border-2' : 'bg-indigo-50 text-indigo-500 border-indigo-100 border-2'}`}>
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">{assessment.title}</h2>
                {!aiReport && (
                  <button onClick={handleGetAiReport} disabled={loadingReport} className={`p-3 rounded-2xl transition-all duration-500 ${loadingReport ? 'bg-slate-100' : 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white hover:scale-110 shadow-lg shadow-purple-100 active:rotate-12'}`}>
                    {loadingReport ? <div className="w-6 h-6 border-[3px] border-purple-200 border-t-purple-600 rounded-full animate-spin"></div> : <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.644.322a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 004.447 2.223l1.16-1.16a2 2 0 011.022-.547l2.387.477a6 6 0 003.86-.517l.644-.322a6 6 0 013.86-.517l2.387.477a2 2 0 001.022-.547l1.16-1.16a2 2 0 00-4.447-2.223l-1.16 1.16z" /></svg>}
                  </button>
                )}
              </div>
              <div className="text-slate-400 text-[11px] mt-2 uppercase tracking-[0.3em] font-black">Clinical Diagnostic Verdict</div>
            </div>
          </div>
          <div className="bg-white/80 shadow-md px-6 py-4 rounded-[2rem] text-center border border-white backdrop-blur-lg">
            <div className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-widest">Priority</div>
            <div className={`text-xl font-black ${assessment.priority === '极高' ? 'text-red-600' : 'text-indigo-600'}`}>{assessment.priority}</div>
          </div>
        </div>

        <div className="bg-white/40 rounded-[2.5rem] p-8 mb-12 border border-white/60 shadow-inner">
          <p className="text-slate-700 text-lg leading-relaxed font-bold tracking-tight italic">"{assessment.description}"</p>
          {selectedSecondarySymptoms.length > 0 && (
            <span className="block mt-4 text-purple-600 text-xs font-black bg-purple-50/50 py-2.5 px-5 rounded-2xl border border-purple-100 inline-block uppercase tracking-wider">
              {selectedSecondarySymptoms.length} Secondary Findings Integrated
            </span>
          )}
        </div>

        <div className="space-y-5 relative z-10">
          <div className="flex items-center gap-3 mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            <div className="w-8 h-px bg-slate-200"></div>
            Management Guidelines
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          {assessment.interventions.map((item, idx) => {
            const hasGuidance = INTERVENTION_GUIDANCE[item];
            return (
              <button key={idx} onClick={() => hasGuidance && setActiveGuidance(hasGuidance)} disabled={!hasGuidance} className={`w-full flex items-center gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border transition-all duration-500 group shadow-sm text-left animate-slide-up stagger-${idx+1} ${hasGuidance ? 'hover:border-purple-300 hover:bg-white/90 hover:scale-[1.03] cursor-pointer' : 'border-white/40 opacity-90 cursor-default'}`}>
                <span className={`w-10 h-10 rounded-[1.25rem] flex items-center justify-center text-sm font-black transition-all duration-500 ${hasGuidance ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>{idx + 1}</span>
                <div className="flex flex-col">
                  <span className={`text-[15px] font-extrabold tracking-tight ${hasGuidance ? 'text-slate-900' : 'text-slate-600'}`}>{item}</span>
                  {hasGuidance && <span className="text-[10px] font-black text-purple-400 uppercase mt-1 tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">View Checklist <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>}
                </div>
              </button>
            );
          })}
        </div>

        {aiReport && (
          <div className="mt-12 pt-12 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-10 duration-1000 relative z-10">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
                 <span className="text-xs font-black uppercase tracking-[0.3em] text-purple-600">AI Specialist Insights</span>
               </div>
               <button onClick={() => setAiReport(null)} className="text-[10px] font-black text-slate-400 hover:text-slate-800 transition-all uppercase py-2 px-5 bg-slate-100/50 rounded-full hover:bg-white shadow-sm">Collapse</button>
             </div>
             <div className="bg-white/80 rounded-[3rem] p-10 text-[15px] text-slate-700 shadow-xl border border-white/80 prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap font-bold leading-relaxed">{aiReport}</div>
             </div>
          </div>
        )}
      </div>

      <p className="mt-16 text-center text-[12px] font-black leading-relaxed tracking-[0.2em] animate-slide-up stagger-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 drop-shadow-sm uppercase">PAT决策辅助-LZRYEK</span>
        <span className="text-slate-300 ml-3">| GEMINI 3.0 PRO POWERED</span>
        <br/>
        <span className="text-slate-300/60 uppercase tracking-tighter mt-2 block font-black">Professional Medical Grade Support • 2025 Edition</span>
      </p>
    </div>
  );
};

export default App;
