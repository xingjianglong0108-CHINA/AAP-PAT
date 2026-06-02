
export enum PATCategory {
  APPEARANCE = 'APPEARANCE',
  BREATHING = 'BREATHING',
  CIRCULATION = 'CIRCULATION'
}

export type AssessmentView = 'PAT' | 'INITIAL_ASSESSMENT' | 'CLINICAL_TOOLS';

export interface Symptom {
  id: string;
  label: string;
  category: PATCategory | string;
}

export type PATStatus = 
  | 'STABLE' 
  | 'RESPIRATORY_DISTRESS' 
  | 'RESPIRATORY_FAILURE' 
  | 'COMPENSATED_SHOCK' 
  | 'DECOMPENSATED_SHOCK' 
  | 'CNS_METABOLIC' 
  | 'CARDIOPULMONARY_FAILURE'
  | 'SHOCK_RESPIRATORY_DISTRESS';

export interface AssessmentResult {
  status: PATStatus;
  title: string;
  description: string;
  priority: '低' | '中' | '高' | '极高';
  interventions: string[];
}

export type AgeGroup = 'INFANT' | 'TODDLER' | 'PRESCHOOLER' | 'SCHOOL_AGE' | 'ADOLESCENT';
