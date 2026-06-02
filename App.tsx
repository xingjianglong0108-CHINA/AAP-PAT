import React, { useState, useMemo } from 'react';
import { 
  Activity, Heart, ShieldAlert, RotateCcw, Sparkles, BookOpen, 
  Stethoscope, CheckCircle, AlertTriangle, ChevronRight, Info,
  TrendingUp, HelpCircle, UserRound, ArrowRightLeft, Skull
} from 'lucide-react';
import { PATCategory, Symptom, AssessmentView, AgeGroup } from './types';
import { 
  SYMPTOMS, 
  LIFE_THREATENING_COMPLAINTS, 
  IA_SYMPTOMS_AIRWAY, 
  IA_SYMPTOMS_BREATHING, 
  IA_SYMPTOMS_CIRCULATION, 
  AGE_BRACKETS, 
  ASSESSMENT_LOGIC, 
  INTERVENTION_GUIDANCE 
} from './constants';
import AssessmentTriangle from './components/AssessmentTriangle';

const App: React.FC = () => {
  // Navigation View
  const [view, setView] = useState<AssessmentView>('PAT');

  // ============================================
  // A. 初筛 (PAT) State
  // ============================================
  const [selectedPatSymptomIds, setSelectedPatSymptomIds] = useState<Set<string>>(new Set());
  const [selectedLifeThreateningIds, setSelectedLifeThreateningIds] = useState<Set<string>>(new Set());

  // ACTIVE PAT CATEGORIES SELECTOR IN PAT VIEW
  const [activePatCategory, setActivePatCategory] = useState<PATCategory>(PATCategory.APPEARANCE);

  // ============================================
  // B. 初始评估 (Initial Assessment) State
  // ============================================
  const [activeIaCategory, setActiveIaCategory] = useState<'AIRWAY' | 'BREATHING' | 'CIRCULATION'>('AIRWAY');
  const [selectedIaAirwayIds, setSelectedIaAirwayIds] = useState<Set<string>>(new Set());
  const [selectedIaBreathingIds, setSelectedIaBreathingIds] = useState<Set<string>>(new Set());
  const [selectedIaCirculationIds, setSelectedIaCirculationIds] = useState<Set<string>>(new Set());
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('INFANT');
  
  // Real Observed Vital Signs
  const [observedRR, setObservedRR] = useState<string>('');
  const [observedHR, setObservedHR] = useState<string>('');
  const [observedSBP, setObservedSBP] = useState<string>('');

  // Unstable High-Risk Injury Mechanism
  const [selectedRiskMechanism, setSelectedRiskMechanism] = useState<string>('NONE');

  // ============================================
  // C. 临床辅助工具 (Clinical Tools) State
  // ============================================
  const [gcsMode, setGcsMode] = useState<'INFANT' | 'CHILD'>('INFANT');
  const [gcsEye, setGcsEye] = useState<number>(4);
  const [gcsVerbal, setGcsVerbal] = useState<number>(5);
  const [gcsMotor, setGcsMotor] = useState<number>(6);

  const [apgarPulse, setApgarPulse] = useState<number>(2);
  const [apgarResp, setApgarResp] = useState<number>(2);
  const [apgarTone, setApgarTone] = useState<number>(2);
  const [apgarReflex, setApgarReflex] = useState<number>(2);
  const [apgarColor, setApgarColor] = useState<number>(2);

  const [activeAlsTab, setActiveAlsTab] = useState<'PEA' | 'BRADY' | 'VF'>('PEA');

  // ============================================
  // Shared States / AI Report
  // ============================================
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [activeGuidance, setActiveGuidance] = useState<{ title: string, details: string[] } | null>(null);

  // ============================================
  // Reset function
  // ============================================
  const handleReset = () => {
    setSelectedPatSymptomIds(new Set());
    setSelectedLifeThreateningIds(new Set());
    setSelectedIaAirwayIds(new Set());
    setSelectedIaBreathingIds(new Set());
    setSelectedIaCirculationIds(new Set());
    setObservedRR('');
    setObservedHR('');
    setObservedSBP('');
    setSelectedRiskMechanism('NONE');
    setAiReport(null);
    setGcsEye(4);
    setGcsVerbal(5);
    setGcsMotor(6);
    setApgarPulse(2);
    setApgarResp(2);
    setApgarTone(2);
    setApgarReflex(2);
    setApgarColor(2);
  };

  // ============================================
  // Helper functions - Toggles
  // ============================================
  const togglePatSymptom = (id: string) => {
    const next = new Set(selectedPatSymptomIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedPatSymptomIds(next);
    setAiReport(null);
  };

  const toggleLifeThreatening = (id: string) => {
    const next = new Set(selectedLifeThreateningIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLifeThreateningIds(next);
    setAiReport(null);
  };

  const toggleIaAirway = (id: string) => {
    const next = new Set(selectedIaAirwayIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIaAirwayIds(next);
    setAiReport(null);
  };

  const toggleIaBreathing = (id: string) => {
    const next = new Set(selectedIaBreathingIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIaBreathingIds(next);
    setAiReport(null);
  };

  const toggleIaCirculation = (id: string) => {
    const next = new Set(selectedIaCirculationIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIaCirculationIds(next);
    setAiReport(null);
  };

  // ============================================
  // 1. PAT (General Impression) Calculations
  // ============================================
  const patStats = useMemo(() => {
    const hasAppearance = SYMPTOMS.some(s => s.category === PATCategory.APPEARANCE && selectedPatSymptomIds.has(s.id));
    const hasBreathing = SYMPTOMS.some(s => s.category === PATCategory.BREATHING && selectedPatSymptomIds.has(s.id));
    const hasCirculation = SYMPTOMS.some(s => s.category === PATCategory.CIRCULATION && selectedPatSymptomIds.has(s.id));
    return {
      appearance: hasAppearance,
      breathing: hasBreathing,
      circulation: hasCirculation,
    };
  }, [selectedPatSymptomIds]);

  const patResult = useMemo(() => {
    const key = `${patStats.appearance ? '1' : '0'}${patStats.breathing ? '1' : '0'}${patStats.circulation ? '1' : '0'}`;
    return ASSESSMENT_LOGIC[key] || ASSESSMENT_LOGIC['000'];
  }, [patStats]);

  const isPatIrregularOrCritical = useMemo(() => {
    return patStats.appearance || patStats.breathing || patStats.circulation || selectedLifeThreateningIds.size > 0;
  }, [patStats, selectedLifeThreateningIds]);

  // ============================================
  // 2. Initial Assessment Calculations (including Vital thresholds)
  // ============================================
  const currentAgeBracket = useMemo(() => {
    return AGE_BRACKETS[selectedAgeGroup];
  }, [selectedAgeGroup]);

  // Validate Vital Inputs
  const vitalsStatus = useMemo(() => {
    const results = {
      rrAbnormal: false,
      rrText: '未输入',
      hrAbnormal: false,
      hrText: '未输入',
      sbpAbnormal: false,
      sbpText: '未输入'
    };

    if (observedRR !== '') {
      const rr = parseFloat(observedRR);
      if (!isNaN(rr)) {
        if (rr < currentAgeBracket.minRR || rr > currentAgeBracket.maxRR) {
          results.rrAbnormal = true;
          results.rrText = rr < currentAgeBracket.minRR ? '过缓 (Bradybradypnea)' : '过速 (Tachypnea)';
        } else {
          results.rrText = '正常';
        }
      }
    }

    if (observedHR !== '') {
      const hr = parseFloat(observedHR);
      if (!isNaN(hr)) {
        if (hr < currentAgeBracket.minHR || hr > currentAgeBracket.maxHR) {
          results.hrAbnormal = true;
          results.hrText = hr < currentAgeBracket.minHR ? '过缓 (Bradycardia)' : '过速 (Tachycardia)';
        } else {
          results.hrText = '正常';
        }
      }
    }

    if (observedSBP !== '') {
      const sbp = parseFloat(observedSBP);
      if (!isNaN(sbp)) {
        if (sbp < currentAgeBracket.minSBPValue) {
          results.sbpAbnormal = true;
          results.sbpText = '低血压灌注不足';
        } else {
          results.sbpText = '正常';
        }
      }
    }

    return results;
  }, [observedRR, observedHR, observedSBP, currentAgeBracket]);

  // Aggregate Primary Survey Sides Abnormality
  const iaStats = useMemo(() => {
    // Airway side: checked airway checkboxes
    const airwayAbnormal = selectedIaAirwayIds.size > 0;
    
    // Breathing side: checked breathing checkboxes OR RR entered out-of-bounds
    const breathingAbnormal = selectedIaBreathingIds.size > 0 || vitalsStatus.rrAbnormal;
    
    // Circulation side: checked circulation checkboxes OR HR or SBP out-of-bounds
    const circulationAbnormal = selectedIaCirculationIds.size > 0 || vitalsStatus.hrAbnormal || vitalsStatus.sbpAbnormal;

    return {
      airway: airwayAbnormal,
      breathing: breathingAbnormal,
      circulation: circulationAbnormal
    };
  }, [selectedIaAirwayIds, selectedIaBreathingIds, selectedIaCirculationIds, vitalsStatus]);

  // Calculate standard Pediatric CUPS classification
  const cupsClassification = useMemo(() => {
    // Critical (C): Absent airway / arrest state
    const isCritical = 
      selectedIaAirwayIds.has('ia_avpu_unresponsive') || 
      selectedIaAirwayIds.has('ia_airway_obs') ||
      selectedIaBreathingIds.has('ia_cyanosis_central') ||
      (observedHR !== '' && parseFloat(observedHR) < 40) || // cardiac arrest hazard
      selectedRiskMechanism === 'CARDIAC_ARREST';

    // Unstable (U): Any abnormal survey side OR abnormal vital parameters
    const isUnstable = 
      !isCritical && (
        iaStats.airway || 
        iaStats.breathing || 
        iaStats.circulation || 
        selectedRiskMechanism === 'UNSTABLE_TRAUMA_SEIZURE'
      );

    // Potentially Unstable (P): Normal vitals and checks but high-risk injury mechanism/clinical settings
    const isPotentiallyUnstable = 
      !isCritical && 
      !isUnstable && 
      (selectedRiskMechanism === 'CONVULSION_POST' || selectedRiskMechanism === 'MINOR_FRACTURE' || selectedRiskMechanism === 'INFANT_FEVER');

    if (isCritical) {
      return {
        level: 'CRITICAL',
        badge: 'CRITICAL (危重/临界) 🔴',
        bg: 'bg-red-500/10 text-red-600 border-red-300',
        action: '🚨 启动最高级别现场抢救，立即通过高级生命支持 (ALS) 转运医疗中心！立即清理呼吸道，给予高流量纯氧，若心率低于60并伴灌注不良，立即开始胸外按压与辅助通气。准备肾上腺素治疗。',
        desc: '存在气道消失、严重呼吸衰竭或呼吸心跳骤停先兆。'
      };
    } else if (isUnstable) {
      return {
        level: 'UNSTABLE',
        badge: 'UNSTABLE (不稳定) 🟠',
        bg: 'bg-orange-500/10 text-orange-600 border-orange-300',
        action: '🚑 立即建立高级生命支持 (ALS) 会合联络，并开放静脉/骨髓通路。给予有针对性的呼吸调控与体位支持，就地上车快速转送，控制出血。',
        desc: '气道完全或部分受损，呼吸功及脏器微循环代偿不良。'
      };
    } else if (isPotentiallyUnstable) {
      return {
        level: 'POTENTIALLY_UNSTABLE',
        badge: 'POTENTIALLY UNSTABLE (潜在不稳定) 🟡',
        bg: 'bg-yellow-500/10 text-yellow-600 border-yellow-300',
        action: '⚠️ 尽管当前生理体征在正常范围内，但由于高危发病或致伤因，潜在极高恶化可能。继续在救护车转运中开展连续监护，详询 SAMPLE 采集，不建议久滞现场。',
        desc: '气道/呼吸/微循环暂时正常，但高危伤因（如抽搐后、小骨折、3月龄合并发热）意味着极度易变性。'
      };
    } else {
      return {
        level: 'STABLE',
        badge: 'STABLE (生命体征稳定) 🟢',
        bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-300',
        action: '✅ 当前患儿体征稳定，可于现场或低级别转运途中继续完成详细查体与病情跟进治疗。',
        desc: '各项观察正常，无严重高危伤病机制存在。'
      };
    }
  }, [iaStats, selectedIaAirwayIds, selectedIaBreathingIds, observedHR, selectedRiskMechanism]);

  // ============================================
  // 3. GCS (Glasgow) Dynamic Calculation
  // ============================================
  const gcsTotalScore = useMemo(() => {
    return gcsEye + gcsVerbal + gcsMotor;
  }, [gcsEye, gcsVerbal, gcsMotor]);

  const gcsAlertLevel = useMemo(() => {
    if (gcsTotalScore >= 13) return { label: '轻度脑外伤 / 绝大多数反应灵敏', text: 'text-emerald-600' };
    if (gcsTotalScore >= 9) return { label: '中度脑损伤且反应明显退化', text: 'text-orange-500 font-bold' };
    return { label: '重度意识障碍 (GCS 钻底 <= 8)，极高窒息风险！需强烈考虑人工气道插管保护与呼吸支持。', text: 'text-red-600 font-black' };
  }, [gcsTotalScore]);

  // ============================================
  // 4. APGAR Score Calculation
  // ============================================
  const apgarTotalScore = useMemo(() => {
    return apgarPulse + apgarResp + apgarTone + apgarReflex + apgarColor;
  }, [apgarPulse, apgarResp, apgarTone, apgarReflex, apgarColor]);

  const apgarAdvice = useMemo(() => {
    if (apgarTotalScore >= 8) return { rating: '正常状态 (Normal)', desc: '新生儿状况极佳，执行常规保暖与吸痰等基础护理。', color: 'text-emerald-600' };
    if (apgarTotalScore >= 4) return { rating: '中度窒息 (Moderately depressed)', desc: '需要积极给予面罩吸氧、触觉刺激、保暖，必要时正压通气。', color: 'text-orange-500 font-bold' };
    return { rating: '重度窒息 (Severely depressed)', desc: '🚨 极高病死危险！立即开启新生儿心肺复苏：建立人工呼吸、行胸外按压与气道重建，迅速注入抢救药。', color: 'text-red-500 font-black' };
  }, [apgarTotalScore]);

  // ============================================
  // Reset function
  // ============================================

  return (
    <div className="min-h-screen pb-16 max-w-2xl mx-auto px-6 pt-8 relative z-10">
      
      {/* Modal - Guidance Details Checklist */}
      {activeGuidance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setActiveGuidance(null)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 relative z-10 animate-in slide-in-from-bottom-10 duration-500 ease-out">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{activeGuidance.title}</h3>
                </div>
                <button onClick={() => setActiveGuidance(null)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {activeGuidance.details.map((detail, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{detail}</p>
                  </div>
                ))}
             </div>
             <button onClick={() => setActiveGuidance(null)} className="w-full mt-6 py-4 bg-slate-950 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all text-xs uppercase tracking-widest shadow-lg">
                我知道了 (Acknowledge)
             </button>
          </div>
        </div>
      )}

      {/* Main Branding Logo & Title */}
      <div className="flex items-center justify-between mb-6 px-1 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Pediatric Assessment (PAT)</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">儿科院前评估与心肺复苏决策决策支持</p>
          </div>
        </div>

        <button 
          onClick={handleReset} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all shadow-sm active:scale-95 border border-transparent hover:border-red-100" 
          title="系统全面重置"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Tri-View Router Control Card */}
      <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1.5 mb-6 backdrop-blur-md animate-slide-up hover:shadow-xs transition-shadow">
        <button 
          onClick={() => { setView('PAT'); setAiReport(null); }} 
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-black transition-all ${view === 'PAT' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          1. 初筛 (PAT)
        </button>
        <button 
          onClick={() => { setView('INITIAL_ASSESSMENT'); setAiReport(null); }} 
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-black transition-all ${view === 'INITIAL_ASSESSMENT' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          2. 初级评估 (Primary Survey)
        </button>
        <button 
          onClick={() => { setView('CLINICAL_TOOLS'); setAiReport(null); }} 
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-black transition-all ${view === 'CLINICAL_TOOLS' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
        >
          3. 高级工具 (GCS/APGAR/CPR)
        </button>
      </div>

      {/* VIEW A: PAT General Impression Screening */}
      {view === 'PAT' && (
        <div className="space-y-6">
          {/* Visual Presentation Card */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden animate-slide-up border border-slate-200/40">
            <div className="absolute top-4 left-4 bg-indigo-50 text-indigo-600 text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full border border-indigo-100 uppercase uppercase">首要面貌</div>
            <div className="pt-6">
              <AssessmentTriangle 
                appearanceAbnormal={patStats.appearance} 
                breathingAbnormal={patStats.breathing} 
                circulationAbnormal={patStats.circulation} 
                type="PAT" 
              />
            </div>
          </div>

          {/* PAT Symptom Checklists Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 animate-slide-up stagger-1">
            {/* Category Select Toggles */}
            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl overflow-x-auto no-scrollbar">
              {Object.values(PATCategory).map((cat) => {
                const isActive = activePatCategory === cat;
                const abnormalCount = SYMPTOMS.filter(s => s.category === cat && selectedPatSymptomIds.has(s.id)).length;
                return (
                  <button 
                    key={cat} 
                    onClick={() => setActivePatCategory(cat)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-sm font-extrabold' 
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {cat === PATCategory.APPEARANCE ? '外观 (Appearance)' : cat === PATCategory.BREATHING ? '呼吸功 (Breathing)' : '皮肤循环 (Circulating)'}
                    {abnormalCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-red-100 text-red-600 rounded-full font-black">{abnormalCount}</span>}
                  </button>
                );
              })}
            </div>

            {/* List of checked items for current active category */}
            <div className="space-y-2.5">
              {SYMPTOMS.filter(s => s.category === activePatCategory).map((symptom) => {
                const isSelected = selectedPatSymptomIds.has(symptom.id);
                return (
                  <label 
                    key={symptom.id} 
                    className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-red-50/50 border-red-200 text-red-950 hover:bg-red-50' 
                        : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected} 
                      onChange={() => togglePatSymptom(symptom.id)} 
                    />
                    <div className={`w-5 h-5 rounded-md border mt-0.5 mr-3 flex items-center justify-center transition-all ${
                      isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <span className="text-[12px] font-black">✓</span>}
                    </div>
                    <span className="text-xs font-bold leading-relaxed">{symptom.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Life Threatening Chief Complaints Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-slide-up stagger-2">
            <div className="flex items-center gap-2 text-slate-800">
              <Skull className="w-5 h-5 text-red-500 shrink-0" />
              <h3 className="text-sm font-black tracking-tight">危及生命的紧急主诉 (Life-threatening conditions)</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              如有此类情况，即使三角面貌暂时正常，亦必须即刻标记并紧急推进初始详细评估，并连线高级生命支持（ALS）。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIFE_THREATENING_COMPLAINTS.map((complaint) => {
                const isSelected = selectedLifeThreateningIds.has(complaint.id);
                return (
                  <label 
                    key={complaint.id} 
                    className={`flex items-start p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-red-50/60 border-red-300 text-red-950' 
                        : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected} 
                      onChange={() => toggleLifeThreatening(complaint.id)} 
                    />
                    <div className={`w-4.5 h-4.5 rounded border mt-0.5 mr-3 flex items-center justify-center transition-all shrink-0 ${
                      isSelected ? 'border-red-500 bg-red-500 text-white shadow-sm' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-[11px] font-extrabold leading-tight">{complaint.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* PAT Decision/Action results */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg space-y-4 animate-slide-up stagger-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`px-2.5 py-1 text-[9px] font-black rounded-md tracking-wider uppercase border ${
                  isPatIrregularOrCritical 
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  {isPatIrregularOrCritical ? '🚨 异常分流 (URGENT)' : '✅ 稳定分流 (NON-URGENT)'}
                </span>

                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">{patResult.title}</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed mt-1.5 pr-2">
                  {patResult.description}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-center shrink-0">
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">分流响应优先级</div>
                <div className={`text-lg font-black mt-0.5 ${patResult.priority === '极高' || patResult.priority === '高' ? 'text-red-500' : 'text-slate-800'}`}>
                  {patResult.priority}
                </div>
              </div>
            </div>

            {/* Suggested actions list */}
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100 inline-block">初筛干预建议</div>
              <div className="grid grid-cols-1 gap-2">
                {patResult.interventions.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center shrink-0">{idx + 1}</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Flow Jump to detailed initial assessment */}
            <div className="pt-3 flex gap-3">
              <button 
                onClick={() => setView('INITIAL_ASSESSMENT')} 
                className="flex-1 py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-xs font-black tracking-widest shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 uppercase group"
              >
                进入下一步：初始评估 (Initial Survey)
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: INITIAL ASSESSMENT / PRIMARY SURVEY */}
      {view === 'INITIAL_ASSESSMENT' && (
        <div className="space-y-6">
          
          {/* Top selection for Age groups & physiological limits */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-slide-up">
            <div className="flex items-center gap-2 text-slate-800">
              <UserRound className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black tracking-tight">1. 选择患儿年龄段与观察生理参数 (Age Bracket)</h3>
            </div>

            {/* Horizontal scroll for age categories */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              {Object.keys(AGE_BRACKETS).map((key) => {
                const isActive = selectedAgeGroup === key;
                return (
                  <button 
                    key={key} 
                    onClick={() => { setSelectedAgeGroup(key as AgeGroup); setAiReport(null); }}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-600 text-white font-extrabold shadow-sm' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {key === 'INFANT' ? '婴儿 (<1岁)' : key === 'TODDLER' ? '幼儿 (1-3岁)' : key === 'PRESCHOOLER' ? '学龄前 (4-5岁)' : key === 'SCHOOL_AGE' ? '学龄期 (6-12岁)' : '青少年 (13-18岁)'}
                  </button>
                );
              })}
            </div>

            {/* Reference numbers Display Panel based on age bracket */}
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-indigo-50/80 grid grid-cols-3 gap-2 text-center shadow-inner">
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">正常呼吸 (RR)</div>
                <div className="text-sm font-black text-slate-700 mt-1 leading-none">{currentAgeBracket.minRR} - {currentAgeBracket.maxRR}</div>
                <div className="text-[8px] text-slate-400 mt-0.5 font-bold uppercase tracking-tighter">次/分 (bpm)</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">正常脉搏 (HR)</div>
                <div className="text-sm font-black text-slate-700 mt-1 leading-none">{currentAgeBracket.minHR} - {currentAgeBracket.maxHR}</div>
                <div className="text-[8px] text-slate-400 mt-0.5 font-bold uppercase tracking-tighter">次/分 (bpm)</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">收缩压下限 (minSBP)</div>
                <div className="text-sm font-black text-slate-700 mt-1 leading-none">{currentAgeBracket.minSBPValue}</div>
                <div className="text-[8px] text-slate-400 mt-0.5 font-bold uppercase tracking-tighter">mmHg</div>
              </div>
            </div>

            {/* Dynamic Numeric Inputs panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 px-1">实测呼吸频率 (RR)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="请输入" 
                    value={observedRR}
                    onChange={(e) => { setObservedRR(e.target.value); setAiReport(null); }}
                    className={`w-full py-3.5 px-4 rounded-xl border-2 text-xs font-bold leading-none text-slate-800 bg-slate-50 transition-all focus:outline-none focus:bg-white ${
                      vitalsStatus.rrAbnormal ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-indigo-500'
                    }`}
                  />
                  {observedRR !== '' && (
                    <span className={`absolute right-3 top-3.5 px-1.5 py-0.5 text-[8px] font-black rounded ${vitalsStatus.rrAbnormal ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {vitalsStatus.rrText}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 px-1">实测心率/脉搏 (HR)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="请输入" 
                    value={observedHR}
                    onChange={(e) => { setObservedHR(e.target.value); setAiReport(null); }}
                    className={`w-full py-3.5 px-4 rounded-xl border-2 text-xs font-bold leading-none text-slate-800 bg-slate-50 transition-all focus:outline-none focus:bg-white ${
                      vitalsStatus.hrAbnormal ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-indigo-500'
                    }`}
                  />
                  {observedHR !== '' && (
                    <span className={`absolute right-3 top-3.5 px-1.5 py-0.5 text-[8px] font-black rounded ${vitalsStatus.hrAbnormal ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {vitalsStatus.hrText}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 px-1">实测收缩压 (mmHg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="请输入" 
                    value={observedSBP}
                    onChange={(e) => { setObservedSBP(e.target.value); setAiReport(null); }}
                    className={`w-full py-3.5 px-4 rounded-xl border-2 text-xs font-bold leading-none text-slate-800 bg-slate-50 transition-all focus:outline-none focus:bg-white ${
                      vitalsStatus.sbpAbnormal ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-indigo-500'
                    }`}
                  />
                  {observedSBP !== '' && (
                    <span className={`absolute right-3 top-3.5 px-1.5 py-0.5 text-[8px] font-black rounded ${vitalsStatus.sbpAbnormal ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {vitalsStatus.sbpText}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-[9px] text-indigo-400 font-bold leading-tight uppercase tracking-wider text-center pt-1.5">
              💡 儿童估计收缩压安全下限简析公式: 收缩压下限 &gt; 70 + (2 x Age) mmHg
            </p>
          </div>

          {/* Primary Survey Graphic Card */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden animate-slide-up border border-slate-200/40">
            <div className="absolute top-4 left-4 bg-purple-50 text-purple-600 text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full border border-purple-100 uppercase">初级详查 (Primary Survey)</div>
            <div className="pt-6">
              <AssessmentTriangle 
                appearanceAbnormal={iaStats.airway} 
                breathingAbnormal={iaStats.breathing} 
                circulationAbnormal={iaStats.circulation} 
                type="IA" 
              />
            </div>
          </div>

          {/* Detailed check Checklist categorized into Airway (A), Breathing (B), and Circulation (C) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-2 text-slate-800">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black tracking-tight">2. 临床详查核对 (Detailed Clinical Survey)</h3>
            </div>

            {/* Category selection */}
            <div className="flex p-1 bg-slate-100/90 rounded-2xl">
              <button 
                onClick={() => setActiveIaCategory('AIRWAY')}
                className={`flex-1 py-3 px-1 text-[11px] font-black rounded-xl transition-all ${
                  activeIaCategory === 'AIRWAY' ? 'bg-indigo-600 text-white shadow-sm font-extrabold' : 'text-slate-500'
                }`}
              >
                A. 气道与外观 (Airway/AVPU)
              </button>
              <button 
                onClick={() => setActiveIaCategory('BREATHING')}
                className={`flex-1 py-3 px-1 text-[11px] font-black rounded-xl transition-all ${
                  activeIaCategory === 'BREATHING' ? 'bg-indigo-600 text-white shadow-sm font-extrabold' : 'text-slate-500'
                }`}
              >
                B. 呼吸功/发绀 (Breathing)
              </button>
              <button 
                onClick={() => setActiveIaCategory('CIRCULATION')}
                className={`flex-1 py-3 px-1 text-[11px] font-black rounded-xl transition-all ${
                  activeIaCategory === 'CIRCULATION' ? 'bg-indigo-600 text-white shadow-sm font-extrabold' : 'text-slate-500'
                }`}
              >
                C. 脉搏/充盈 (Circulation)
              </button>
            </div>

            {/* Checklist details of active IA category */}
            <div className="space-y-2">
              {activeIaCategory === 'AIRWAY' && IA_SYMPTOMS_AIRWAY.map(item => {
                const isSelected = selectedIaAirwayIds.has(item.id);
                return (
                  <label key={item.id} className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-red-50/50 border-red-200 text-red-950' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleIaAirway(item.id)} />
                    <div className={`w-5 h-5 rounded-md border mt-0.5 mr-3 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <span className="text-[12px] font-bold">✓</span>}
                    </div>
                    <span className="text-xs font-bold leading-relaxed">{item.label}</span>
                  </label>
                );
              })}

              {activeIaCategory === 'BREATHING' && IA_SYMPTOMS_BREATHING.map(item => {
                const isSelected = selectedIaBreathingIds.has(item.id);
                return (
                  <label key={item.id} className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-red-50/50 border-red-200 text-red-950' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleIaBreathing(item.id)} />
                    <div className={`w-5 h-5 rounded-md border mt-0.5 mr-3 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <span className="text-[12px] font-bold">✓</span>}
                    </div>
                    <span className="text-xs font-bold leading-relaxed">{item.label}</span>
                  </label>
                );
              })}

              {activeIaCategory === 'CIRCULATION' && IA_SYMPTOMS_CIRCULATION.map(item => {
                const isSelected = selectedIaCirculationIds.has(item.id);
                return (
                  <label key={item.id} className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-red-50/50 border-red-200 text-red-950' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleIaCirculation(item.id)} />
                    <div className={`w-5 h-5 rounded-md border mt-0.5 mr-3 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <span className="text-[12px] font-bold">✓</span>}
                    </div>
                    <span className="text-xs font-bold leading-relaxed">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* High-risk mechanism/clinical situation selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-slide-up">
            <div className="flex items-center gap-2 text-slate-800">
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-black tracking-tight">3. 特殊伤病机制与危险条件 (CUPS context modifiers)</h3>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">
              根据标准参考卡设定，一些潜在的高危因素可在气道/呼吸/微循环暂时正常的情况下，引发不稳定（P）警告或危重判定。
            </p>

            <select 
              value={selectedRiskMechanism} 
              onChange={(e) => { setSelectedRiskMechanism(e.target.value); setAiReport(null); }}
              className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="NONE">无特殊或高危事件机制 (Normal settings)</option>
              <option value="CARDIAC_ARREST">心跳呼吸骤停状态/致命创伤、窒息 (Cardiac/Resp Arrest state)</option>
              <option value="UNSTABLE_TRAUMA_SEIZURE">活动性大出血、正处于抽搐中、近乎溺水等 (Compromised factors)</option>
              <option value="CONVULSION_POST">严重的抽搐发作后状态 (Post-seizure / Post-ictal state)</option>
              <option value="MINOR_FRACTURE">疑似轻微或中度骨折，但微循环良好 (Minor fractures)</option>
              <option value="INFANT_FEVER">小于3个月且发热婴儿 (Infant &lt; 3mo with fever)</option>
            </select>
          </div>

          {/* Pediatric CUPS Result badge and card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-4 animate-slide-up">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <span className={`px-3 py-1 text-[9px] font-black rounded-lg border uppercase tracking-widest ${cupsClassification.bg}`}>
                  {cupsClassification.badge}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight pt-1">生理诊断分级 (Pediatric CUPS)</h3>
                <p className="text-xs text-slate-400 font-bold leading-normal">{cupsClassification.desc}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-2">标准应急救治行动指引 (Action Point)</div>
              <p className="text-xs font-bold text-slate-700 leading-relaxed pr-1">
                {cupsClassification.action}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* VIEW C: CLINICAL TOOLS & REFERENCE GUIDES */}
      {view === 'CLINICAL_TOOLS' && (
        <div className="space-y-6">
          
          {/* Card A: GCS Score Calculator */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black tracking-tight text-slate-900">儿科/成人格拉斯哥昏迷评分 (Pediatric GCS)</h3>
              </div>
              
              {/* Type toggle */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex text-[9px] font-black">
                <button 
                  onClick={() => { setGcsMode('INFANT'); }}
                  className={`px-2 py-1 rounded-md ${gcsMode === 'INFANT' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400'}`}
                >
                  婴幼儿 (&lt;2岁)
                </button>
                <button 
                  onClick={() => { setGcsMode('CHILD'); }}
                  className={`px-2 py-1 rounded-md ${gcsMode === 'CHILD' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400'}`}
                >
                  儿童/成人 (&gt;2岁)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* 1. Eye opening */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">睁眼反应 (Eye Opening)</label>
                <select 
                  value={gcsEye} 
                  onChange={(e) => setGcsEye(parseInt(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value={4}>4分 - Spontaneous (自主睁眼)</option>
                  <option value={3}>3分 - To speech / To sound (说话或声音刺睁眼)</option>
                  <option value={2}>2分 - To pain (疼痛刺激睁眼)</option>
                  <option value={1}>1分 - No response (无反应)</option>
                </select>
              </div>

              {/* 2. Verbal response */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">语言反应 (Verbal Response)</label>
                {gcsMode === 'INFANT' ? (
                  <select 
                    value={gcsVerbal} 
                    onChange={(e) => setGcsVerbal(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value={5}>5分 - Coos or babbles (咿呀学语/发出声音良好)</option>
                    <option value={4}>4分 - Irritable crying (异常哭闹，但可安抚)</option>
                    <option value={3}>3分 - Cries to pain (疼痛引起哭叫反应)</option>
                    <option value={2}>2分 - Moans to pain (对疼痛呻吟反应)</option>
                    <option value={1}>1分 - None (没有发出过声音)</option>
                  </select>
                ) : (
                  <select 
                    value={gcsVerbal} 
                    onChange={(e) => setGcsVerbal(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value={5}>5分 - Oriented (意识清、定位正常且回答切题)</option>
                    <option value={4}>4分 - Confused (神志恍惚、交流有混淆)</option>
                    <option value={3}>3分 - Inappropriate words (不能连贯，发词不切题)</option>
                    <option value={2}>2分 - Incomprehensible (仅能哼哼无法分辨语言字汇)</option>
                    <option value={1}>1分 - None (完全无发音)</option>
                  </select>
                )}
              </div>

              {/* 3. Motor response */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">运动反应 (Motor Response)</label>
                {gcsMode === 'INFANT' ? (
                  <select 
                    value={gcsMotor} 
                    onChange={(e) => setGcsMotor(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value={6}>6分 - Spontaneous & Purposeful (自主灵活动作)</option>
                    <option value={5}>5分 - Withdraws touch (对肢体触摸有避开防御)</option>
                    <option value={4}>4分 - Withdraws pain (对明显疼痛刺痛躲避)</option>
                    <option value={3}>3分 - Abnormal flexion (疼痛下呈去皮层强直屈曲)</option>
                    <option value={2}>2分 - Abnormal extension (疼痛下呈去大脑强直伸展)</option>
                    <option value={1}>1分 - No response (完全软瘫、无肌张力反应)</option>
                  </select>
                ) : (
                  <select 
                    value={gcsMotor} 
                    onChange={(e) => setGcsMotor(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value={6}>6分 - Obeys commands (意识良好，可按嘱做指定手势)</option>
                    <option value={5}>5分 - Localizes pain (能精确定位疼痛位置并回拨)</option>
                    <option value={4}>4分 - Withdraws pain (疼痛刺激下发生逃避退缩反应)</option>
                    <option value={3}>3分 - Abnormal flexion (去皮层异常屈曲，呈病理弓形)</option>
                    <option value={2}>2分 - Abnormal extension (去大脑病理伸展，极危重)</option>
                    <option value={1}>1分 - No response (对痛温觉完全软瘫无反应)</option>
                  </select>
                )}
              </div>
            </div>

            {/* Score Output block */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 shadow-inner">
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-black">格拉斯哥昏迷评分等级 (GCS Status)</div>
                <div className={`text-xs mt-1 font-bold ${gcsAlertLevel.text}`}>{gcsAlertLevel.label}</div>
              </div>
              <div className="bg-indigo-600 text-white w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                <span className="text-[9px] uppercase font-black tracking-widest leading-none">Total</span>
                <span className="text-xl font-black mt-1 leading-none">{gcsTotalScore}</span>
              </div>
            </div>
          </div>

          {/* Card B: APGAR Newborn Score Calculator */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-slide-up">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black tracking-tight text-slate-900">新生儿 APGAR 评分卡</h3>
            </div>

            <div className="space-y-3">
              {/* Pulse */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-slate-600 min-w-[70px]">心率(Pulse):</span>
                <div className="bg-slate-50 p-0.5 rounded-lg flex gap-1 border">
                  <button onClick={() => setApgarPulse(0)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarPulse === 0 ? 'bg-red-500 text-white shadow-xs' : 'text-slate-500'}`}>0 无心率</button>
                  <button onClick={() => setApgarPulse(1)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarPulse === 1 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500'}`}>1 &lt;100 bpm</button>
                  <button onClick={() => setApgarPulse(2)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarPulse === 2 ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'}`}>2 &gt;=100 bpm</button>
                </div>
              </div>

              {/* Resp */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-slate-600 min-w-[70px]">呼吸(Resp):</span>
                <div className="bg-slate-50 p-0.5 rounded-lg flex gap-1 border">
                  <button onClick={() => setApgarResp(0)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarResp === 0 ? 'bg-red-500 text-white shadow-xs' : 'text-slate-500'}`}>0 无自主呼吸</button>
                  <button onClick={() => setApgarResp(1)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarResp === 1 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500'}`}>1 慢而规则</button>
                  <button onClick={() => setApgarResp(2)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarResp === 2 ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'}`}>2 正常呼吸好</button>
                </div>
              </div>

              {/* Tone */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-slate-600 min-w-[70px]">张力(Tone):</span>
                <div className="bg-slate-50 p-0.5 rounded-lg flex gap-1 border">
                  <button onClick={() => setApgarTone(0)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarTone === 0 ? 'bg-red-500 text-white shadow-xs' : 'text-slate-500'}`}>0 软瘫 (Limp)</button>
                  <button onClick={() => setApgarTone(1)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarTone === 1 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500'}`}>1 某些曲屈</button>
                  <button onClick={() => setApgarTone(2)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarTone === 2 ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'}`}>2 活动性良好</button>
                </div>
              </div>

              {/* Reflex */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-slate-600 min-w-[70px]">反射(Reflex):</span>
                <div className="bg-slate-50 p-0.5 rounded-lg flex gap-1 border">
                  <button onClick={() => setApgarReflex(0)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarReflex === 0 ? 'bg-red-500 text-white shadow-xs' : 'text-slate-500'}`}>0 无反应</button>
                  <button onClick={() => setApgarReflex(1)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarReflex === 1 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500'}`}>1 弹足刺激皱眉</button>
                  <button onClick={() => setApgarReflex(2)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarReflex === 2 ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'}`}>2 咳嗽、喷嚏哭</button>
                </div>
              </div>

              {/* Color */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-slate-600 min-w-[70px]">肤色(Color):</span>
                <div className="bg-slate-50 p-0.5 rounded-lg flex gap-1 border">
                  <button onClick={() => setApgarColor(0)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarColor === 0 ? 'bg-red-500 text-white shadow-xs' : 'text-slate-500'}`}>0 全身苍白青紫</button>
                  <button onClick={() => setApgarColor(1)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarColor === 1 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500'}`}>1 红润四肢变蓝</button>
                  <button onClick={() => setApgarColor(2)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${apgarColor === 2 ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'}`}>2 全身粉红红润</button>
                </div>
              </div>
            </div>

            {/* APGAR Sum Result */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 shadow-inner">
              <div>
                <div className="text-[9px] text-slate-400 font-black">新生儿评分级别 (APGAR Grading)</div>
                <div className={`text-xs mt-1 font-bold ${apgarAdvice.color}`}>{apgarAdvice.rating}</div>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal font-semibold pr-2">{apgarAdvice.desc}</p>
              </div>
              <div className="bg-indigo-600 text-white w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                <span className="text-[9px] uppercase font-black tracking-widest leading-none">Total</span>
                <span className="text-xl font-black mt-1 leading-none">{apgarTotalScore}</span>
              </div>
            </div>
          </div>

          {/* Card C: Respiratory/Cardiac CPR standard table comparison */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-slide-up">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black tracking-tight text-slate-900">不同年龄急救复苏(CPR/通气)对照基准</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-bold">
                <thead>
                  <tr className="border-b text-slate-400">
                    <th className="pb-2 min-w-[120px]">急救要素</th>
                    <th className="pb-2 min-w-[140px]">婴儿 Infant &lt;1岁</th>
                    <th className="pb-2 min-w-[140px]">儿童 Child 1–8岁</th>
                    <th className="pb-2 min-w-[160px]">青少年 Teen 9–18岁</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-1 text-slate-400 leading-normal">单纯人工呼吸频率：<br />有脉搏但呼吸不足</td>
                    <td className="py-3 text-indigo-600 leading-normal">20–30次/分，<br />约每2–3秒1次</td>
                    <td className="py-3 text-indigo-600 leading-normal">20–30次/分，<br />约每2–3秒1次</td>
                    <td className="py-3 text-slate-700 leading-normal">
                      儿科流程：20–30次/分；<br />
                      若按成人流程：约10次/分
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 text-slate-400 leading-normal">CPR按压手法</td>
                    <td className="py-3 text-slate-700 leading-normal">
                      单人：2指法；<br />
                      双人/医护：双拇指环抱法
                    </td>
                    <td className="py-3 text-slate-700 leading-normal">单手或双手掌根按压</td>
                    <td className="py-3 text-slate-700 leading-normal">双手掌根重叠按压</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 text-slate-400 leading-normal">胸外按压深度</td>
                    <td className="py-3 text-slate-600 leading-normal">至少胸廓前后径1/3，<br />约4 cm</td>
                    <td className="py-3 text-slate-600 leading-normal">至少胸廓前后径1/3，<br />约5 cm</td>
                    <td className="py-3 text-slate-600 leading-normal">成人标准：约5–6 cm，<br />不超过6 cm</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 text-slate-400 leading-normal">胸外按压频率</td>
                    <td className="py-3 text-slate-700 leading-normal" colSpan={3}>
                      <span className="bg-slate-50 text-slate-700 px-2 py-1 rounded border border-slate-100">100–120次/分</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 text-slate-400 leading-normal">按压通气比：<br />无高级气道</td>
                    <td className="py-3 text-indigo-600 leading-normal">单人30:2；<br />双人医护15:2</td>
                    <td className="py-3 text-indigo-600 leading-normal">单人30:2；<br />双人医护15:2</td>
                    <td className="py-3 text-slate-700 leading-normal">若按成人：<br />单人/双人30:2</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 text-slate-400 leading-normal">有高级气道CPR通气频率</td>
                    <td className="py-3 text-slate-700 leading-normal">20–30次/分，连续按压</td>
                    <td className="py-3 text-slate-700 leading-normal">20–30次/分，连续按压</td>
                    <td className="py-3 text-slate-700 leading-normal">
                      PALS：20–30次/分；<br />
                      成人流程：约10次/分
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-red-500 leading-relaxed font-bold bg-red-50/50 p-3.5 rounded-xl border border-red-100">
              ⚠️ **核心提示**: 当无脉搏心率 &lt; 60 次/分钟且伴随组织灌注灌不良体征时，即使未发生心脏停搏，也**必须**启动胸外按压（CPR）。
            </p>
          </div>

          {/* Card D: ALS guidelines reference sheets */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black tracking-tight text-slate-100 bg-slate-900 px-3 py-1.5 rounded-xl uppercase">高级急诊急救要领 (ALS Guideline Reference)</h3>
              </div>
            </div>

            <div className="flex p-0.5 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setActiveAlsTab('PEA')}
                className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                  activeAlsTab === 'PEA' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                心搏停止 (Asystole/PEA)
              </button>
              <button 
                onClick={() => setActiveAlsTab('BRADY')}
                className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                  activeAlsTab === 'BRADY' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                心动过缓 (Bradycardia)
              </button>
              <button 
                onClick={() => setActiveAlsTab('VF')}
                className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                  activeAlsTab === 'VF' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                室颤 (VF / pulseless VT)
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {activeAlsTab === 'PEA' && (
                <div className="space-y-2 text-[11px] leading-relaxed font-bold text-slate-700 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-red-600 font-black text-xs mb-1.5">
                    <span>● Asystole / 无脉性电活动 (PEA) 抢救要领</span>
                    <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded font-black tracking-normal">非可电击心律 (Non-shockable)</span>
                  </div>
                  <p>1. **超早期注射肾上腺素**：根据最新 AHA PALS 指南，应在启动 CPR 后**首个 5 分钟内尽早**给予首剂肾上腺素。延迟给药会显著降低患者自主循环恢复 (ROSC) 率及存活率。</p>
                  <p>2. **不间断高质量 CPR**：立即开始人工按压与气道通气（未建立高级气道双人复苏 15:2；建立高级气道后连续按压，每 2-3 秒 1 次人工呼吸，即 20-30 次/分），每次按压后胸廓完全回弹，尽量减少中断。</p>
                  <p>3. **药物剂量与给药频次 (Epinephrine)**：</p>
                  <p className="pl-4 text-indigo-600">- **静脉/骨髓通路 (IV/IO)**: 0.01 mg/kg（使用 0.1 mg/mL / 1:10,000 规格，对应剂量为 **0.1 mL/kg**）</p>
                  <p className="pl-4 text-indigo-600">- **气管内通气给药 (ET，建议仅在无 IV/IO 通路时临时采用)**: 0.1 mg/kg（使用 1 mg/mL / 1:1,000 规格，对应剂量为 **0.1 mL/kg**）</p>
                  <p className="pl-4 text-slate-500">- **重复频次**: 每 3 - 5 分钟重复给药一次，每次给药后应以生理盐水快速冲管。</p>
                  <p className="text-red-500 font-extrabold mt-3 pt-2 border-t border-slate-200">🚨 必须不间断积极排查并极速纠正可逆病因 (5H & 5T / 6H & 5T 评估)：</p>
                  <div className="pl-4 grid grid-cols-2 gap-x-4 text-slate-600 font-bold">
                    <div>
                      <p>• **Hypovolemia** 低血容量</p>
                      <p>• **Hypoxia** 缺氧（确保通气充分）</p>
                      <p>• **Hydrogen ion** 酸中毒</p>
                      <p>• **Hypoglycemia** 低血糖（儿科救治重点）</p>
                      <p>• **Hypo-/Hyperkalemia** 低钾/高钾血症</p>
                      <p>• **Hypothermia** 低体温</p>
                    </div>
                    <div>
                      <p>• **Tension pneumothorax** 张力性气胸</p>
                      <p>• **Tamponade (cardiac)** 心脏压塞</p>
                      <p>• **Toxins** 毒物或药物过量</p>
                      <p>• **Thrombosis (pulmonary)** 肺栓塞</p>
                      <p>• **Thrombosis (coronary)** 冠状动脉血栓</p>
                    </div>
                  </div>
                </div>
              )}

              {activeAlsTab === 'BRADY' && (
                <div className="space-y-2 text-[11px] leading-relaxed font-bold text-slate-700 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-orange-600 font-black text-xs mb-1.5">
                    <span>● 临床儿科心动过缓 (Bradycardia) 救治指南</span>
                    <span className="bg-orange-100 text-orange-700 text-[9px] px-1.5 py-0.5 rounded font-black tracking-normal">伴灌注不良/低血压 (Compromised)</span>
                  </div>
                  <p>1. **初始干预与气道支持**：保持气道畅通，辅以正压给氧（100% 纯氧辅助通气）。监测神态和血流动力学指标。</p>
                  <p>2. **高质量 CPR 按压指征**：若经充分有效的血氧供给和通气后，**心率（HR）仍 &lt; 60 次/分钟且伴随组织低灌注体征**（如神志模糊、强弱脉不一、低血压、四肢厥冷），应**立即开始胸外垂直按压**。</p>
                  <p>3. **核心救治用药指引**：</p>
                  <p className="pl-4 text-indigo-600">
                    - **首选：肾上腺素 (Epinephrine)**：对于在给氧、通气和启动 CPR 后仍有持续症状性心动过缓者，首选肾上腺素。
                    <br /><span className="text-[10px] text-slate-500">• 剂量：IV/IO 0.01 mg/kg (1:10,000 / 0.1 mL/kg)；ET 0.1 mg/kg (1:1,000 / 0.1 mL/kg)。每 3–5 分钟给药一次。</span>
                  </p>
                  <p className="pl-4 text-indigo-600">
                    - **次选：阿托品 (Atropine)**：若明确系由于迷走神经张力过高、原发性房室传导阻滞（AV Block），或在使用首剂肾上腺素后心率未改善时使用。
                    <br /><span className="text-[10px] text-red-500 font-extrabold">• 🚨 核心修订点：依据最新 AHA PALS 指南，已正式取消“单次最小剂量不少于 0.1 mg”的硬性限制（以防剂量不足导致反常性心动过缓的旧观念已被推翻）。</span>
                    <br /><span className="text-[10px] text-slate-500">• 剂量：单次剂量仍为 **0.02 mg/kg**。最大单次剂量：儿童为 **0.5 mg**；青少年为 **1.0 mg**。两剂之间可重复给药（最大累积总剂量儿童 1.0 mg，青少年 2.0 mg）。</span>
                  </p>
                  <p>4. **经皮/经静脉心脏起搏**：若患者发生完全性心脏传导阻滞（三度房室阻滞）或病窦综合征，且药物治疗反应欠佳，应毫不犹豫地立即实施起搏治疗。</p>
                </div>
              )}

              {activeAlsTab === 'VF' && (
                <div className="space-y-2 text-[11px] leading-relaxed font-bold text-slate-700 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-red-500 font-black text-xs mb-1.5">
                    <span>● 心室颤动或无脉性室速 (VF / pulseless VT)</span>
                    <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-normal">可电击心律 (Shockable)</span>
                  </div>
                  <p>1. **即刻、递增式电除颤 (Defibrillation) 与按压配合**：</p>
                  <p className="pl-4 text-slate-600">• **第 1 次除颤能量**: **2 J/kg**。除颤后**立即恢复高质量 CPR 2 分钟**（不测量心律、不评估脉搏）。</p>
                  <p className="pl-4 text-slate-600">• **第 2 次除颤能量**: **4 J/kg**。除颤后立即恢复 CPR 2 分钟。</p>
                  <p className="pl-4 text-slate-600">• **后续除颤能量**: **&ge; 4 J/kg**（推荐继续使用 4 J/kg，或逐步升级，最大单次不超过 **10 J/kg** 或成人标准能量 200 J）。</p>
                  <p>2. **肾上腺素给药时机**：对于可电击心律，推荐在首个或第二个除颤周期失败后（即**第二次除颤后的 CPR 期间**）启动肾上腺素注射。剂量为 **0.01 mg/kg** (1:10,000 / 0.1 mL/kg) IV/IO，每 3-5 分钟重复给药一次。</p>
                  <p>3. **顽固性 VF/pVT 抗心律失常药物 (第三次除颤后/期间注入)**：</p>
                  <p className="pl-4 text-indigo-600">
                    - **首选：胺碘酮 (Amiodarone)**：5 mg/kg IV/IO 快速弹丸式注射（可在随后的难治性电击除颤间期内**重复给药 1 到 2 次**，累积最大总剂量限制在 **15 mg/kg** 或成人最大单剂量 300 mg 以下）。
                  </p>
                  <p className="pl-4 text-indigo-600">
                    - **替代首选：利多卡因 (Lidocaine)**：1 mg/kg IV/IO 负荷剂量。若室颤仍持续或复发，可在 5-10 分钟后追加 1 mg/kg；随后可进行 20-50 mcg/kg/min 的维持静脉输注。
                  </p>
                  <p className="pl-4 text-indigo-600">
                    - **硫酸镁 (Magnesium Sulfate)**：**仅用于**高度怀疑或病确诊为**尖端扭转性室速 (Torsades de Pointes)**或严重低镁血症时。剂量为 **25–50 mg/kg** IV/IO，单次最大极量不超过 2 g，加盐水缓慢（10–20 分钟）滴注或紧急缓慢静注。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-12 text-center text-[11px] font-black leading-relaxed tracking-[0.25em] animate-slide-up">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 uppercase">儿科急诊应急辅助-LZRYEK</span>
        <span className="text-slate-300 ml-3">| AAP Standards</span>
        <br/>
        <span className="text-slate-300/80 uppercase tracking-tighter mt-1 block font-bold">Supported by Gemini 3.5 Pro • Professional Emergency Integration</span>
      </div>
    </div>
  );
};

export default App;
