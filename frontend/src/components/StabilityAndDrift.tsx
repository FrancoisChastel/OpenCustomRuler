import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface StabilityAndDriftProps {
  psiGlobal: number;
  driftLevel: string;
}

export function StabilityAndDrift({ psiGlobal, driftLevel }: StabilityAndDriftProps) {
  const psiData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    psi: 0.1 + Math.sin(i / 7) * 0.05 + Math.random() * 0.03,
    threshold: 0.2
  }));

  const featureDrift = [
    { feature: 'valeur_declaree', psi: 0.31, status: 'high' },
    { feature: 'pays_origine', psi: 0.23, status: 'high' },
    { feature: 'hs_code', psi: 0.18, status: 'medium' },
    { feature: 'declarant_historique', psi: 0.14, status: 'low' },
    { feature: 'poids_volume_ratio', psi: 0.12, status: 'low' }
  ];

  const conceptDriftData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    auc: 0.85 + Math.sin(i / 10) * 0.03 + (Math.random() - 0.5) * 0.02,
    detection_rate: 0.74 + Math.sin(i / 8) * 0.04 + (Math.random() - 0.5) * 0.03
  }));

  const dataQualityMetrics = [
    { metric: 'Complétude', current: 97.8, target: 98.0, status: 'warning' },
    { metric: 'Valeurs aberrantes', current: 2.1, target: 2.0, status: 'error' },
    { metric: 'Erreurs de schéma', current: 0.3, target: 0.5, status: 'ok' },
    { metric: 'Délai d\'ingestion', current: 3.2, target: 5.0, status: 'ok' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getPSIBadgeVariant = (psi: number) => {
    if (psi > 0.2) return 'destructive';
    if (psi > 0.1) return 'secondary';
    return 'outline';
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle className="text-base">Population Stability Index (PSI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={psiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 0.4]} />
                <Tooltip 
                  formatter={(value, name) => [
                    Number(value).toFixed(3),
                    name === 'psi' ? 'PSI' : 'Seuil'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="psi" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="PSI Global"
                />
                <Line 
                  type="monotone" 
                  dataKey="threshold" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Seuil Critique"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <Alert className={`mt-4 ${psiGlobal > 0.2 ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950' : ''}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              PSI Global: <strong>{psiGlobal.toFixed(3)}</strong> 
              {psiGlobal > 0.2 ? ' - Drift significatif détecté' : ' - Population stable'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Drift par Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {featureDrift.map((feature) => (
              <div key={feature.feature} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{feature.feature.replace('_', ' ')}</span>
                    <Badge variant={getPSIBadgeVariant(feature.psi)}>
                      {feature.psi.toFixed(3)}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        feature.psi > 0.2 ? 'bg-red-500' : 
                        feature.psi > 0.1 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (feature.psi / 0.4) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="text-base">Concept Drift - Performance dans le Temps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conceptDriftData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" />
                <YAxis domain={[0.6, 0.9]} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${(Number(value) * 100).toFixed(1)}%`,
                    name === 'auc' ? 'AUC' : 'Taux de Détection'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="auc" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="AUC"
                />
                <Line 
                  type="monotone" 
                  dataKey="detection_rate" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Taux de Détection"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="text-base">Qualité des Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataQualityMetrics.map((metric) => (
              <div key={metric.metric} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(metric.status)}
                  <div>
                    <div className="font-medium text-sm">{metric.metric}</div>
                    <div className="text-xs text-muted-foreground">
                      Cible: {metric.target}{metric.metric.includes('Délai') ? ' min' : '%'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    metric.status === 'ok' ? 'text-green-600' : 
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.current}{metric.metric.includes('Délai') ? ' min' : '%'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.current > metric.target ? 'Au-dessus' : 'En-dessous'} cible
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}