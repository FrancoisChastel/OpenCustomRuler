export type ConditionOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_or_equal' | 'less_or_equal' | 'contains' | 'in' | 'not_in';
export type LogicalOperator = 'AND' | 'OR';
export type RiskLevel = 'V' | 'J' | 'R'; // Vert, Jaune, Rouge
export type RuleStatus = 'active' | 'inactive' | 'testing';

export interface Condition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string | number | string[];
  logicalOperator?: LogicalOperator; // Pour connecter avec la condition suivante
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  priority: number;
  status: RuleStatus;
  conditions: Condition[];
  action: {
    riskLevel: RiskLevel;
    scoreAdjustment: number; // +/- points to add to the score
    forceControl?: boolean;
  };
  metadata: {
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date;
    triggeredCount: number;
    detectionRate: number;
    falsePositiveRate: number;
    avgProcessingTime: number; // en ms
    lastTriggered?: Date;
    expirationDate?: Date;
  };
  performance: {
    trend: 'improving' | 'stable' | 'declining';
    efficiency: number; // 0-1
    coverage: number; // % des cas couverts
    accuracy: number; // % de vrais positifs
  };
}

export interface CustomsOffice {
  id: string;
  code: string;
  name: string;
  location: string;
  capacity: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  currentLoad: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  staffCount: number;
  specializations: string[];
  status: 'operational' | 'limited' | 'overloaded';
}

export interface SystemComponent {
  id: string;
  name: string;
  type: 'ai' | 'rules' | 'random' | 'unsupervised';
  enabled: boolean;
  weight: number; // Poids dans le score final (total doit être 100%)
  config: Record<string, any>;
}
