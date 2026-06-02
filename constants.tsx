import { PATCategory, Symptom, AssessmentResult } from './types';

// ============================================
// 1. 初筛 (General Impression - PAT)
// ============================================

export const SYMPTOMS: Symptom[] = [
  // Airway & Appearance / 气道与外观
  { id: 'pat_cry_speech', label: '哭声异常/虚弱或无法言语 (Abnormal/absent cry or speech)', category: PATCategory.APPEARANCE },
  { id: 'pat_response', label: '对父母或环境刺激反应减退 (Decreased response to parents/stimuli)', category: PATCategory.APPEARANCE },
  { id: 'pat_muscle_tone', label: '肌张力松弛、僵硬或无自主活动 (Floppy/rigid muscle tone or not moving)', category: PATCategory.APPEARANCE },

  // Work of Breathing / 呼吸功
  { id: 'pat_breath_effort_high', label: '呼吸努力增加 (鼻扇、吸气三凹征或腹式呼吸) (Increased effort)', category: PATCategory.BREATHING },
  { id: 'pat_breath_effort_low', label: '呼吸努力减弱/呼吸极度放缓或停止 (Decreased/absent effort)', category: PATCategory.BREATHING },
  { id: 'pat_noisy_breath', label: '喘鸣、呻吟等异常呼吸杂音 (Noisy breathing)', category: PATCategory.BREATHING },

  // Circulation to Skin / 皮肤循环
  { id: 'pat_cyanosis', label: '发绀 (Cyanosis / 皮肤或粘膜变蓝)', category: PATCategory.CIRCULATION },
  { id: 'pat_mottling', label: '花斑 (Mottling / 皮肤大理石样花斑纹)', category: PATCategory.CIRCULATION },
  { id: 'pat_pallor', label: '面色苍白/惨白 (Paleness/pallor)', category: PATCategory.CIRCULATION },
  { id: 'pat_bleeding', label: '肉眼可见的严重活动性出血 (Obvious significant bleeding)', category: PATCategory.CIRCULATION },
];

export const LIFE_THREATENING_COMPLAINTS = [
  { id: 'compl_trauma', label: '严重创伤/烧伤 (Major trauma/burns)' },
  { id: 'compl_seizure', label: '持续或活动性抽搐 (Active seizures)' },
  { id: 'compl_asthma', label: '严重哮喘发作/窒息感 (Severe asthma attack)' },
  { id: 'compl_airway_obs', label: '气道完全或严重硬阻 (Severe airway obstruction)' },
  { id: 'compl_diabetic_keto', label: '糖尿病急症/酮症酸中毒疑诊 (Diabetic emergency)' },
];

export const CATEGORY_LABELS = {
  [PATCategory.APPEARANCE]: '气道与外观 (Airway/App)',
  [PATCategory.BREATHING]: '呼吸功 (Work of Breathing)',
  [PATCategory.CIRCULATION]: '皮肤循环 (Circulation to Skin)',
};

// ============================================
// 2. 初始评估 (Initial Assessment - Primary Survey)
// ============================================

export const IA_SYMPTOMS_AIRWAY = [
  { id: 'ia_airway_obs', label: '气道完全/部分受阻 (Obstruction to airflow)', category: 'Airway' },
  { id: 'ia_airway_noisy', label: '窒息性粗口呼吸、气泡音、喘鸣或杂音 (Gurgling, stridor, noisy breathing)', category: 'Airway' },
  { id: 'ia_avpu_verbal', label: '意识反应减退：仅能对声音发出反应 (Verbal on AVPU scale)', category: 'Airway' },
  { id: 'ia_avpu_pain', label: '意识反应严重减退：仅能对疼痛发出反应 (Pain on AVPU scale)', category: 'Airway' },
  { id: 'ia_avpu_unresponsive', label: '意识丧失：对任何刺激均无反应 (Unresponsive on AVPU scale)', category: 'Airway' },
];

export const IA_SYMPTOMS_BREATHING = [
  { id: 'ia_breath_retractions', label: '肋间、锁骨下或剑突下吸气性凹陷 (Presence of retractions)', category: 'Breathing' },
  { id: 'ia_breath_flaring', label: '鼻翼扇动 (Nasal flaring)', category: 'Breathing' },
  { id: 'ia_breath_noisy', label: '出现呻吟、哮鸣音、呼气性呻吟或叹息 (Stridor, wheezes, grunting, gasping)', category: 'Breathing' },
  { id: 'ia_cyanosis_central', label: '中心性发绀 (唇周/舌部或躯干变蓝) (Central cyanosis)', category: 'Breathing' },
];

export const IA_SYMPTOMS_CIRCULATION = [
  { id: 'ia_circ_color', label: '异常全身发绀、花斑或面色惨白 (Cyanosis, mottling, or pallor)', category: 'Circulation' },
  { id: 'ia_circ_weak_pulse', label: '由于低灌注评估发现外周或中央脉搏细弱、消失 (Absent or weak pulses)', category: 'Circulation' },
  { id: 'ia_circ_cap_refill', label: '毛细血管再充盈时间 (CRT) > 2秒 (伴随其他低灌注表现)', category: 'Circulation' },
];

// ============================================
// 3. 生理参考指标表 (Pediatric Reference Brackets)
// ============================================

export interface AgeBracket {
  name: string;
  label: string;
  minRR: number;
  maxRR: number;
  minHR: number;
  maxHR: number;
  minSBP: string;
  minSBPValue: number;
}

export const AGE_BRACKETS: Record<string, AgeBracket> = {
  INFANT: {
    name: 'INFANT',
    label: '婴儿 (<1岁) Infant (<1yr)',
    minRR: 30,
    maxRR: 60,
    minHR: 100,
    maxHR: 160,
    minSBP: '>60 mmHg或强外周脉搏 (or strong pulses)',
    minSBPValue: 60
  },
  TODDLER: {
    name: 'TODDLER',
    label: '幼儿 (1-3岁) Toddler (1-3yr)',
    minRR: 24,
    maxRR: 40,
    minHR: 90,
    maxHR: 150,
    minSBP: '>70 mmHg或强外周脉搏 (or strong pulses)',
    minSBPValue: 70
  },
  PRESCHOOLER: {
    name: 'PRESCHOOLER',
    label: '学龄前 (4-5岁) Preschooler (4-5yr)',
    minRR: 22,
    maxRR: 34,
    minHR: 80,
    maxHR: 140,
    minSBP: '>75 mmHg',
    minSBPValue: 75
  },
  SCHOOL_AGE: {
    name: 'SCHOOL_AGE',
    label: '学龄期 (6-12岁) School-age (6-12yr)',
    minRR: 18,
    maxRR: 30,
    minHR: 70,
    maxHR: 120,
    minSBP: '>80 mmHg',
    minSBPValue: 80
  },
  ADOLESCENT: {
    name: 'ADOLESCENT',
    label: '青少年 (13-18岁) Adolescent (13-18yr)',
    minRR: 12,
    maxRR: 20,
    minHR: 60,
    maxHR: 100,
    minSBP: '>90 mmHg',
    minSBPValue: 90
  },
};

// ============================================
// 4. 初筛 (PAT) 病理生理推断逻辑
// ============================================

export const ASSESSMENT_LOGIC: Record<string, AssessmentResult> = {
  '000': {
    status: 'STABLE',
    title: '外观与生命体征稳定',
    description: '儿科评估三角 (PAT) 气道/外观、呼吸功、皮肤循环三个核心维度均无明显异常。',
    priority: '低',
    interventions: ['获取详细病史 (SAMPLE 问诊流程)', '常规无创生命体征持续监测', '转入初始详查评估（Primary Survey）进行精确生理参数验证']
  },
  '010': {
    status: 'RESPIRATORY_DISTRESS',
    title: '呼吸窘迫 (Respiratory Distress)',
    description: '仅呼吸功单项异常。提示患儿正在尽力增加呼吸努力以维持足够的气体交换，通常处于代偿期。',
    priority: '中',
    interventions: ['允许患儿保持最舒适/自然体位 (避免强行束缚)', '根据指征给予吸氧治疗 (鼻导管/面罩)', '准备负压吸引清除口鼻腔分泌物']
  },
  '110': {
    status: 'RESPIRATORY_FAILURE',
    title: '呼吸衰竭 (Respiratory Failure)',
    description: '气道外观与呼吸功同时异常。提示患儿的气体交换代偿机制已濒临崩溃，无法独立维持正常通气和氧合。',
    priority: '高',
    interventions: ['立即开放气道 (仰头抬颏或推下颌法)', '给予高浓度面罩吸氧或球囊面罩 (BVM) 加压辅助通气', '紧急联络气道处理专家进行插管准备', '持续监测血氧及意识变化']
  },
  '001': {
    status: 'COMPENSATED_SHOCK',
    title: '代偿性休克 (Compensated Shock)',
    description: '仅循环灌注异常，气道外观与呼吸自主正常。提示患儿正通过外周血管剧烈收缩维持核心血压和心脑脑灌注。',
    priority: '高',
    interventions: ['迅速建立外周静脉 (IV) 通路或骨髓腔灌注 (IO) 通路', '准备等渗晶体液按 20 ml/kg 进行快速液体复苏', '紧密监测脉搏频率、强度、毛细血管充盈时间及血压']
  },
  '101': {
    status: 'DECOMPENSATED_SHOCK',
    title: '失代偿性休克 (Decompensated Shock)',
    description: '气道外观与皮肤循环双重异常。提示外周血管收缩等代偿机制已经衰竭，核心脑灌注和心排血量出现严重障碍，表现为神志反应迟钝。',
    priority: '极高',
    interventions: ['启动最高优先级别大出血/休克抢救方案', '多通道建立静脉/骨髓通路并执行紧急液体复苏', '考虑血管活性药物制剂、积极给氧与气道支持']
  },
  '100': {
    status: 'CNS_METABOLIC',
    title: '中枢神经 / 代偿及严重代谢障碍 (CNS/Metabolic)',
    description: '仅脑外观与神志异常，呼吸功与外周循环基本正常。可见于急性非缺氧性脑病、中毒、脑创伤、重度低血糖等。',
    priority: '中',
    interventions: ['立即检测床旁快速血糖 (D-Stick)，排除低血糖昏迷', '密切评估双侧瞳孔对光反射、大小及神经张力征象', '详询潜在药物、毒物摄入史，预防性准备维持气道']
  },
  '111': {
    status: 'CARDIOPULMONARY_FAILURE',
    title: '心肺衰竭濒死状态 (Cardiopulmonary Failure)',
    description: '儿科评估三角 (PAT) 外观、呼吸、循环三个特征全线严重恶化。是发生心搏呼吸骤停前的极端危重征兆。',
    priority: '极高',
    interventions: ['立即触发PALS (儿科高级生命支持) / CPR 流程', '建立多通路高级气道管理，球囊面罩 100% 纯氧辅助通气', '连接心电监护设备防范心跳骤停，备齐肾上腺素和除颤监护仪']
  },
  '011': { 
    status: 'SHOCK_RESPIRATORY_DISTRESS',
    title: '循环衰竭伴呼吸极度代偿',
    description: '呼吸与皮肤循环双维度发生异常。代偿性发绀可能处于呼吸循环连锁恶化阶段。',
    priority: '极高',
    interventions: ['高流量吸氧，积极维持呼吸阻力', '迅速开放双静脉通路，启动晶体液补液方案', '做好呼吸骤停抢救的机械通气准备']
  }
};

export const INTERVENTION_GUIDANCE: Record<string, { title: string, details: string[] }> = {
  '获取详细病史 (SAMPLE 问诊流程)': {
    title: 'SAMPLE 病史采集 (Page 1 标准)',
    details: [
      'S (Signs/Symptoms): 详细询问主诉、起病形式以及目前主要伴随体征。',
      'A (Allergies): 明确有无任何药物过敏、食物及特定环境接触过敏史。',
      'M (Medications): 记录近两周内正在服用的任何处方/非处方药、自服药物。',
      'P (Past History): 关注有无早产儿、先天性心脏病、哮喘、免疫缺陷等。',
      'L (Last Meal): 确认最近一次进餐/喂奶的确切时间及实物，用于可能的麻醉准备。',
      'E (Events): 引起本次紧急就诊的前驱事件或诱发暴露因素（如跌倒、误服、剧烈咳嗽等）。'
    ]
  },
  '常规无创生命体征持续监测': {
    title: '多维度无创监护指标',
    details: [
      '呼吸观察: 计数至少一整分钟，辨识有无异常呼吸节律不整等。',
      '心电/脉搏监护: 持续监测心率波形及振幅，重点监控极高心率或徐缓。',
      '指脉血氧 (SpO2): 连接指脉血氧仪，目标是将血氧水平维持在 94-98% 或更高。',
      '血压评估 (NIBP): 选用适合年龄的袖带，注意收缩压不得低于对应年龄限制线值。',
      '核心体温 (Temp): 采用体温计连续测量观察有无发热、低体温等代谢紊乱征。'
    ]
  }
};
