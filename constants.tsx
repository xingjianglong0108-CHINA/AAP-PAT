
import { PATCategory, Symptom, AssessmentResult } from './types';

export const SYMPTOMS: Symptom[] = [
  // Appearance (TICLS)
  { id: 'tone', label: '肌张力异常 (Tone)', category: PATCategory.APPEARANCE },
  { id: 'interact', label: '反应性差 (Interactiveness)', category: PATCategory.APPEARANCE },
  { id: 'consolability', label: '无法安抚 (Consolability)', category: PATCategory.APPEARANCE },
  { id: 'look', label: '眼神呆滞 (Look/Gaze)', category: PATCategory.APPEARANCE },
  { id: 'speech', label: '言语/哭声异常 (Speech/Cry)', category: PATCategory.APPEARANCE },
  
  // Work of Breathing
  { id: 'sounds', label: '异常呼吸音 (气喘/呻吟)', category: PATCategory.BREATHING },
  { id: 'position', label: '异常体位 (三脚架位)', category: PATCategory.BREATHING },
  { id: 'retractions', label: '三凹征 (吸气性胸廓塌陷)', category: PATCategory.BREATHING },
  { id: 'flaring', label: '鼻翼扇动', category: PATCategory.BREATHING },
  
  // Circulation to Skin
  { id: 'pallor', label: '苍白 (Pallor)', category: PATCategory.CIRCULATION },
  { id: 'mottling', label: '花斑 (Mottling)', category: PATCategory.CIRCULATION },
  { id: 'cyanosis', label: '发绀 (Cyanosis)', category: PATCategory.CIRCULATION },
];

export const SECONDARY_SYMPTOMS: Symptom[] = [
  // Airway
  { id: 'airway_obstructed', label: '气道梗阻 (Obstructed)', category: 'Airway' },
  { id: 'airway_stridor', label: '吸气性喉鸣 (Stridor)', category: 'Airway' },
  // Breathing
  { id: 'breathing_tachypnea', label: '呼吸急促 (Tachypnea)', category: 'Breathing' },
  { id: 'breathing_low_spo2', label: '低氧血症 (SpO2 < 94%)', category: 'Breathing' },
  // Circulation
  { id: 'circ_tachycardia', label: '心动过速 (Tachycardia)', category: 'Circulation' },
  { id: 'circ_weak_pulse', label: '脉搏细弱 (Weak Pulse)', category: 'Circulation' },
  { id: 'circ_cap_refill', label: '毛细血管充盈时间 > 2s', category: 'Circulation' },
  // Disability
  { id: 'dis_avpu', label: '意识水平下降 (AVPU < A)', category: 'Disability' },
  { id: 'dis_pupils', label: '瞳孔对光反射异常', category: 'Disability' },
  { id: 'dis_glucose', label: '低血糖 (< 60 mg/dL)', category: 'Disability' },
  // SAMPLE History
  { id: 'sample_allergies', label: '有过敏史', category: 'SAMPLE' },
  { id: 'sample_meds', label: '正在服用药物', category: 'SAMPLE' },
  { id: 'sample_fever', label: '近期发热', category: 'SAMPLE' },
];

export const CATEGORY_LABELS = {
  [PATCategory.APPEARANCE]: '外观 (Appearance)',
  [PATCategory.BREATHING]: '呼吸功 (Breathing)',
  [PATCategory.CIRCULATION]: '皮肤循环 (Circulation)',
};

export const SECONDARY_CATEGORY_LABELS = {
  'Airway': '气道 (A)',
  'Breathing': '呼吸 (B)',
  'Circulation': '循环 (C)',
  'Disability': '神经 (D)',
  'SAMPLE': '病史 (S)',
};

export const INTERVENTION_GUIDANCE: Record<string, { title: string, details: string[] }> = {
  '进行二次评估 (ABCDE)': {
    title: 'ABCDE 评估要点',
    details: [
      'A (Airway): 检查气道是否开放且可维持',
      'B (Breathing): 听诊双肺音，评估呼吸深度',
      'C (Circulation): 测量脉搏速度、强度及皮肤温度',
      'D (Disability): 意识状态 (AVPU)、瞳孔大小及反应',
      'E (Exposure): 暴露皮肤寻找皮疹或外伤，注意保暖'
    ]
  },
  '获取详细病史 (SAMPLE)': {
    title: 'SAMPLE 病史采集',
    details: [
      'S (Signs/Symptoms): 症状及伴随体征',
      'A (Allergies): 药物、食物、环境过敏史',
      'M (Medications): 正在服用的处方或非处方药',
      'P (Past History): 既往疾病史或手术史',
      'L (Last Meal): 最后进食时间及内容',
      'E (Events): 导致当前急症的诱发事件'
    ]
  },
  '常规生命体征监测': {
    title: '关键监测指标',
    details: [
      '心率 (HR): 根据年龄段评估是否异常',
      '呼吸频率 (RR): 观察一分钟计数',
      '血压 (BP): 使用合适袖带，重点看平均动脉压',
      '体温 (T): 核心温度测量',
      '血氧饱和度 (SpO2): 目标维持在 94-98% 以上'
    ]
  }
};

export const ASSESSMENT_LOGIC: Record<string, AssessmentResult> = {
  '000': {
    status: 'STABLE',
    title: '病情稳定',
    description: '患儿评估三角的三个部分均显示正常，目前情况相对稳定。',
    priority: '低',
    interventions: ['进行二次评估 (ABCDE)', '获取详细病史 (SAMPLE)', '常规生命体征监测']
  },
  '010': {
    status: 'RESPIRATORY_DISTRESS',
    title: '呼吸窘迫',
    description: '仅呼吸功异常。患儿正努力维持气体交换。',
    priority: '中',
    interventions: ['保持舒适体位', '根据需要给予氧疗', '准备雾化治疗或吸引']
  },
  '110': {
    status: 'RESPIRATORY_FAILURE',
    title: '呼吸衰竭',
    description: '外观与呼吸功均异常。患儿已无法维持足够的气体交换。',
    priority: '高',
    interventions: ['开放气道', '高流量氧疗/辅助通气', '准备气管插管']
  },
  '001': {
    status: 'COMPENSATED_SHOCK',
    title: '代偿性休克',
    description: '仅循环异常。患儿正通过外周血管收缩维持核心血压。',
    priority: '高',
    interventions: ['建立静脉/骨髓通路', '液体复苏 (20ml/kg)', '监测血压及灌注']
  },
  '101': {
    status: 'DECOMPENSATED_SHOCK',
    title: '失代偿性休克',
    description: '外观与循环均异常。心输出量已无法维持脑灌注。',
    priority: '极高',
    interventions: ['紧急液体复苏', '考虑血管活性药物', '气道支持']
  },
  '100': {
    status: 'CNS_METABOLIC',
    title: '中枢神经/代谢功能障碍',
    description: '仅外观异常。可能由于中毒、低血糖或原发性脑损伤。',
    priority: '中',
    interventions: ['测血糖 (D-Stick)', '考虑中毒筛查', '评估瞳孔及神经征象']
  },
  '111': {
    status: 'CARDIOPULMONARY_FAILURE',
    title: '心肺功能衰竭',
    description: '三角的三个维度均出现异常，这是即将发生心跳骤停的信号。',
    priority: '极高',
    interventions: ['BLS/PALS 流程启动', '积极气道管理与通气', '心电监护与建立循环']
  },
  '011': { 
    status: 'RESPIRATORY_FAILURE',
    title: '休克合并呼吸窘迫',
    description: '呼吸与循环同时异常。',
    priority: '极高',
    interventions: ['同步处理气道与循环', '高度警惕状态恶化']
  }
};
