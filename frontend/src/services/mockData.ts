import { ModelMetrics, TimeSeriesPoint, ROCPoint, PRPoint, CalibrationBin, FeatureImportance, SegmentMetric, OverrideReason } from '../types/dashboard';

export const generateMockMetrics = (version: 'champion' | 'challenger'): ModelMetrics => {
  const isChampion = version === 'champion';
  const baseVariation = isChampion ? 0 : Math.random() * 0.1 - 0.05;
  
  return {
    auc_roc: Math.max(0.7, Math.min(0.95, 0.85 + baseVariation)),
    pr_auc: Math.max(0.6, Math.min(0.9, 0.78 + baseVariation)),
    brier_score: Math.max(0.1, Math.min(0.3, 0.18 - baseVariation)),
    calibration_score: Math.max(0.8, Math.min(1, 0.92 + baseVariation)),
    precision_at_k: {
      k1: Math.max(0.6, Math.min(0.95, 0.82 + baseVariation)),
      k5: Math.max(0.5, Math.min(0.85, 0.71 + baseVariation)),
      k10: Math.max(0.4, Math.min(0.75, 0.62 + baseVariation))
    },
    recall_at_k: {
      k1: Math.max(0.1, Math.min(0.3, 0.18 + baseVariation)),
      k5: Math.max(0.3, Math.min(0.6, 0.45 + baseVariation)),
      k10: Math.max(0.5, Math.min(0.8, 0.68 + baseVariation))
    },
    lift_at_k: {
      k1: Math.max(3, Math.min(8, 5.2 + baseVariation * 10)),
      k5: Math.max(2, Math.min(6, 3.8 + baseVariation * 10)),
      k10: Math.max(1.5, Math.min(4, 2.9 + baseVariation * 10))
    },
    detection_rate: Math.max(0.65, Math.min(0.85, 0.74 + baseVariation)),
    redressements_amount: Math.max(800000, Math.min(1500000, 1200000 + baseVariation * 200000)),
    adoption_rate: Math.max(0.7, Math.min(0.9, 0.82 + baseVariation)),
    override_rate: Math.max(0.1, Math.min(0.25, 0.16 - baseVariation)),
    latency_p50: Math.max(80, Math.min(150, 110 + baseVariation * 50)),
    latency_p95: Math.max(200, Math.min(400, 285 + baseVariation * 100)),
    error_rate: Math.max(0.001, Math.min(0.02, 0.008 - baseVariation)),
    psi_global: Math.max(0.05, Math.min(0.35, 0.15 + Math.abs(baseVariation))),
    drift_level: Math.abs(baseVariation) > 0.03 ? 'élevé' : Math.abs(baseVariation) > 0.015 ? 'moyen' : 'faible',
    uptime: Math.max(0.98, Math.min(1, 0.997 + baseVariation * 0.1))
  };
};

export const generateROCData = (): ROCPoint[] => {
  const points: ROCPoint[] = [];
  for (let i = 0; i <= 100; i++) {
    const fpr = i / 100;
    const tpr = Math.pow(fpr, 0.7) + Math.random() * 0.1;
    points.push({
      fpr: Math.min(1, Math.max(0, fpr)),
      tpr: Math.min(1, Math.max(0, tpr)),
      threshold: 1 - (i / 100)
    });
  }
  return points.sort((a, b) => a.fpr - b.fpr);
};

export const generatePRData = (): PRPoint[] => {
  const points: PRPoint[] = [];
  for (let i = 0; i <= 100; i++) {
    const recall = i / 100;
    const precision = Math.max(0.1, 0.8 - Math.pow(recall, 1.5) * 0.6 + Math.random() * 0.1);
    points.push({
      recall: Math.min(1, Math.max(0, recall)),
      precision: Math.min(1, Math.max(0, precision)),
      threshold: 1 - (i / 100)
    });
  }
  return points.sort((a, b) => a.recall - b.recall);
};

export const generateCalibrationData = (): CalibrationBin[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    mean_predicted_prob: (i + 0.5) / 10,
    fraction_of_positives: (i + 0.5) / 10 + (Math.random() - 0.5) * 0.15,
    count: Math.floor(Math.random() * 1000) + 100
  }));
};

export const generateFeatureImportanceData = (): FeatureImportance[] => {
  const features = [
    'valeur_declaree', 'pays_origine', 'hs_code', 'declarant_historique',
    'poids_volume_ratio', 'nombre_lignes', 'delai_depot', 'commissionnaire_risk',
    'transport_mode', 'port_entree'
  ];
  
  return features.map(feature => ({
    feature,
    importance: Math.random() * 0.3,
    drift: (Math.random() - 0.5) * 0.2
  })).sort((a, b) => b.importance - a.importance);
};

export const generateTimeSeriesData = (days: number): TimeSeriesPoint[] => {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - i - 1));
    return {
      timestamp: date.toISOString().split('T')[0],
      value: 0.8 + Math.sin(i / 5) * 0.1 + (Math.random() - 0.5) * 0.05
    };
  });
};

export const generateSegmentData = (): SegmentMetric[] => {
  const ports = ['Port Autonome Dakar', 'Port de Ziguinchor', 'Aéroport LSS', 'Bureau Kaolack'];
  return ports.map(port => ({
    segment: port,
    fpr: Math.random() * 0.15 + 0.05,
    tpr: Math.random() * 0.2 + 0.7,
    precision: Math.random() * 0.3 + 0.6,
    adoption: Math.random() * 0.2 + 0.75
  }));
};

export const generateOverrideData = (): OverrideReason[] => {
  const reasons = [
    { reason: 'Expérience terrain', count: 142 },
    { reason: 'Information manquante', count: 89 },
    { reason: 'Urgence opérationnelle', count: 67 },
    { reason: 'Contexte spécial', count: 43 },
    { reason: 'Autres', count: 28 }
  ];
  
  const total = reasons.reduce((sum, r) => sum + r.count, 0);
  return reasons.map(r => ({
    ...r,
    percentage: (r.count / total) * 100
  }));
};