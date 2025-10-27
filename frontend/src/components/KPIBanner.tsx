import { KPICard } from "./KPICard";
import { ModelMetrics, TimeSeriesPoint } from "../types/dashboard";

interface KPIBannerProps {
  metrics: ModelMetrics;
  sparklineData: TimeSeriesPoint[];
}

export function KPIBanner({ metrics, sparklineData }: KPIBannerProps) {
  const kpiData = [
    {
      title: "AUC ROC",
      value: (metrics.auc_roc * 100).toFixed(1),
      change: Math.random() * 4 - 2,
      format: 'percentage' as const,
      sparklineData: sparklineData.map(d => ({ value: parseFloat(d.value.toFixed(3)), timestamp: d.timestamp }))
    },
    {
      title: "PR-AUC",
      value: (metrics.pr_auc * 100).toFixed(1),
      change: Math.random() * 3 - 1.5,
      format: 'percentage' as const
    },
    {
      title: "Brier Score",
      value: metrics.brier_score.toFixed(3),
      change: Math.random() * 2 - 1
    },
    {
      title: "Precision@5%", 
      value: (metrics.precision_at_k.k5 * 100).toFixed(1),
      change: Math.random() * 5 - 2.5,
      format: 'percentage' as const
    },
    {
      title: "Taux Détection",
      value: (metrics.detection_rate * 100).toFixed(1),
      change: Math.random() * 3 - 1,
      format: 'percentage' as const
    },
    {
      title: "Redressements",
      value: (metrics.redressements_amount / 1000000).toFixed(1),
      change: Math.random() * 15 - 5,
      suffix: "M FCFA"
    },
    {
      title: "Adoption",
      value: (metrics.adoption_rate * 100).toFixed(1),
      change: Math.random() * 2 - 1,
      format: 'percentage' as const
    },
    {
      title: "Override Rate",
      value: (metrics.override_rate * 100).toFixed(1),
      change: Math.random() * 3 - 1.5,
      format: 'percentage' as const
    },
    {
      title: "Latence P95",
      value: metrics.latency_p95.toFixed(0),
      change: Math.random() * 10 - 5,
      format: 'ms' as const
    },
    {
      title: "Taux d'Erreur",
      value: (metrics.error_rate * 100).toFixed(2),
      change: Math.random() * 2 - 1,
      format: 'percentage' as const
    }
  ];

  return (
    <div className="bg-muted/30 border-b border-border p-4">
      <div className="grid grid-cols-5 gap-3">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            format={kpi.format}
            suffix={kpi.suffix}
            sparklineData={kpi.sparklineData}
          />
        ))}
      </div>
    </div>
  );
}