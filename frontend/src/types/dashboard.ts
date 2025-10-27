export interface ModelMetrics {
  auc_roc: number;
  pr_auc: number;
  brier_score: number;
  calibration_score: number;
  precision_at_k: { k1: number; k5: number; k10: number };
  recall_at_k: { k1: number; k5: number; k10: number };
  lift_at_k: { k1: number; k5: number; k10: number };
  detection_rate: number;
  redressements_amount: number;
  adoption_rate: number;
  override_rate: number;
  latency_p50: number;
  latency_p95: number;
  error_rate: number;
  psi_global: number;
  drift_level: 'faible' | 'moyen' | 'élevé';
  uptime: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface ROCPoint {
  fpr: number;
  tpr: number;
  threshold: number;
}

export interface PRPoint {
  recall: number;
  precision: number;
  threshold: number;
}

export interface CalibrationBin {
  mean_predicted_prob: number;
  fraction_of_positives: number;
  count: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  drift: number;
}

export interface SegmentMetric {
  segment: string;
  fpr: number;
  tpr: number;
  precision: number;
  adoption: number;
}

export interface OverrideReason {
  reason: string;
  count: number;
  percentage: number;
}

export type ModelVersion = 'champion' | 'challenger';
export type TimeWindow = '7j' | '30j' | '90j';
export type HealthStatus = 'OK' | 'Alerte';