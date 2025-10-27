import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, Cell } from "recharts";
import { ROCPoint, PRPoint, CalibrationBin, FeatureImportance } from "../types/dashboard";
import { Badge } from "./ui/badge";

interface PerformanceChartsProps {
  rocData: ROCPoint[];
  prData: PRPoint[];
  calibrationData: CalibrationBin[];
  featureImportance: FeatureImportance[];
  currentThreshold: number;
}

export function PerformanceCharts({ 
  rocData, 
  prData, 
  calibrationData, 
  featureImportance,
  currentThreshold 
}: PerformanceChartsProps) {
  
  const confusionMatrix = {
    tp: 1847,
    fp: 423,
    tn: 8934,
    fn: 267
  };

  const calibrationPoints = calibrationData.map(bin => ({
    predicted: bin.mean_predicted_prob,
    observed: bin.fraction_of_positives,
    count: bin.count,
    perfect: bin.mean_predicted_prob
  }));

  const scoreDistribution = Array.from({ length: 20 }, (_, i) => ({
    bin: i * 0.05,
    binEnd: (i + 1) * 0.05,
    count: Math.floor(Math.random() * 500) + 50,
    label: `${(i * 5).toFixed(0)}-${((i + 1) * 5).toFixed(0)}%`
  }));

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="text-base">Courbes de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roc" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roc">ROC</TabsTrigger>
              <TabsTrigger value="pr">Precision-Recall</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roc" className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="fpr" 
                    type="number" 
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <YAxis 
                    dataKey="tpr" 
                    type="number" 
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${(Number(value) * 100).toFixed(1)}%`, 
                      name === 'tpr' ? 'Taux Vrais Positifs' : 'Taux Faux Positifs'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tpr" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    data={[{fpr: 0, tpr: 0}, {fpr: 1, tpr: 1}]}
                    dataKey="tpr"
                    stroke="#94a3b8" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pr" className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="recall" 
                    type="number" 
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <YAxis 
                    dataKey="precision" 
                    type="number" 
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${(Number(value) * 100).toFixed(1)}%`, 
                      name === 'precision' ? 'Précision' : 'Rappel'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="precision" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="text-base">Calibration et Distribution des Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calibration" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calibration">Calibration</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calibration" className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={calibrationPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="predicted" 
                    type="number" 
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <YAxis 
                    dataKey="observed" 
                    type="number" 
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${(Number(value) * 100).toFixed(1)}%`, 
                      name === 'observed' ? 'Fraction Observée' : 'Probabilité Prédite'
                    ]}
                  />
                  <Scatter dataKey="observed" fill="#2563eb" />
                  <Line 
                    type="monotone" 
                    dataKey="perfect" 
                    stroke="#94a3b8" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="distribution" className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="text-base">Matrice de Confusion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 h-48">
            <div className="flex items-end justify-end">
              <span className="text-sm font-medium">Prédiction</span>
            </div>
            <div className="flex items-end justify-center">
              <span className="text-sm font-medium">Négatif</span>
            </div>
            <div className="flex items-end justify-center">
              <span className="text-sm font-medium">Positif</span>
            </div>
            
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium transform -rotate-90">Réalité</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 border rounded p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-medium">{confusionMatrix.tn.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Vrais Négatifs</span>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 border rounded p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-medium">{confusionMatrix.fp.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Faux Positifs</span>
            </div>
            
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">Positif</span>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 border rounded p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-medium">{confusionMatrix.fn.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Faux Négatifs</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 border rounded p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-medium">{confusionMatrix.tp.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Vrais Positifs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="text-base">Importance des Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {featureImportance.slice(0, 8).map((feature, index) => (
              <div key={feature.feature} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium w-4 text-center">{index + 1}</span>
                  <span className="text-sm">{feature.feature.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(feature.importance * 100).toFixed(0)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {(feature.importance * 100).toFixed(0)}%
                  </span>
                  <Badge 
                    variant={Math.abs(feature.drift) > 0.1 ? 'destructive' : Math.abs(feature.drift) > 0.05 ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {feature.drift > 0 ? '+' : ''}{(feature.drift * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}