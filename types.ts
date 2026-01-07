
export enum PATCategory {
  APPEARANCE = 'APPEARANCE',
  BREATHING = 'BREATHING',
  CIRCULATION = 'CIRCULATION'
}

export type AssessmentView = 'INITIAL' | 'SECONDARY';

export interface Symptom {
  id: string;
  label: string;
  category: PATCategory | string; // Can be PATCategory or ABCDE/SAMPLE
}

export type PATStatus = 
  | 'STABLE' 
  | 'RESPIRATORY_DISTRESS' 
  | 'RESPIRATORY_FAILURE' 
  | 'COMPENSATED_SHOCK' 
  | 'DECOMPENSATED_SHOCK' 
  | 'CNS_METABOLIC' 
  | 'CARDIOPULMONARY_FAILURE';

export interface AssessmentResult {
  status: PATStatus;
  title: string;
  description: string;
  priority: '低' | '中' | '高' | '极高';
  interventions: string[];
}
