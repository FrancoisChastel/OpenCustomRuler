import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface EconomicEfficiencyProps {
  redressmentsAmount: number;
}

export function EconomicEfficiency({ redressmentsAmount }: EconomicEfficiencyProps) {
  const [threshold, setThreshold] = useState([50]);
  
  const costBenefitData = Array.from({ length: 100 }, (_, i) => {
    const controlPercentage = i + 1;
    const controlCost = controlPercentage * 1000; // 1000 FCFA par contrôle
    const detectionRate = Math.min(0.85, controlPercentage * 0.008);
    const benefit = detectionRate * 1500000; // Redressements moyens
    const roi = (benefit - controlCost) / controlCost;
    
    return {
      percentage: controlPercentage,
      cost: controlCost,
      benefit,
      roi,
      netBenefit: benefit - controlCost
    };
  });

  const currentThreshold = threshold[0];
  const currentPoint = costBenefitData[currentThreshold - 1];
  
  const redressmentsHistory = Array.from({ length: 30 }, (_, i) => {
    const baseline = 800000;
    const withModel = redressmentsAmount + Math.sin(i / 5) * 50000 + (Math.random() - 0.5) * 30000;
    return {
      day: i + 1,
      baseline,
      withModel: Math.max(baseline * 0.8, withModel),
      upperBound: withModel * 1.1,
      lowerBound: withModel * 0.9
    };
  });

  const simulationData = [
    { metric: 'Contrôles prévus/jour', value: Math.floor(currentThreshold * 12.4) },
    { metric: 'Détections estimées', value: Math.floor(currentPoint?.roi * 100 * 0.15) || 0 },
    { metric: 'Charge équipes (%)', value: Math.floor((currentThreshold * 12.4) / 850 * 100) },
    { metric: 'ROI mensuel', value: `${((currentPoint?.roi || 0) * 100).toFixed(1)}%` }
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle className="text-base">
            Courbe Coût-Bénéfice 
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (Contrôler les {currentThreshold}% plus risqués)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="px-3">
              <label className="text-sm font-medium">Seuil de contrôle: {currentThreshold}%</label>
              <Slider
                value={threshold}
                onValueChange={setThreshold}
                max={100}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costBenefitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="percentage" 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    yAxisId="roi"
                    orientation="left"
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <YAxis 
                    yAxisId="amount"
                    orientation="right"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'roi') return [`${(Number(value) * 100).toFixed(1)}%`, 'ROI'];
                      return [`${(Number(value) / 1000000).toFixed(1)}M FCFA`, name === 'cost' ? 'Coût' : 'Bénéfice'];
                    }}
                  />
                  <Line 
                    yAxisId="roi"
                    type="monotone" 
                    dataKey="roi" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    name="ROI"
                  />
                  <Line 
                    yAxisId="amount"
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Coût"
                  />
                  <Line 
                    yAxisId="amount"
                    type="monotone" 
                    dataKey="benefit" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Bénéfice"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Simulation Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {simulationData.map((item) => (
              <div key={item.metric} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="text-sm font-medium">{item.metric}</div>
                </div>
                <Badge variant="outline" className="text-base font-medium">
                  {item.value}
                </Badge>
              </div>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <div className="text-sm text-muted-foreground mb-2">Recommandation</div>
              <div className="text-sm">
                {currentPoint?.roi > 0.5 ? (
                  <span className="text-green-600 font-medium">
                    Seuil optimal - ROI élevé
                  </span>
                ) : currentPoint?.roi > 0.2 ? (
                  <span className="text-yellow-600 font-medium">
                    Seuil acceptable - ROI modéré
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Seuil trop élevé - ROI faible
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle className="text-base">Redressements Cumulés vs Baseline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={redressmentsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${(Number(value) / 1000000).toFixed(2)}M FCFA`,
                    name === 'baseline' ? 'Baseline' : name === 'withModel' ? 'Avec Modèle' : 'Intervalle'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stackId="1"
                  stroke="none"
                  fill="transparent"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stackId="1"
                  stroke="none"
                  fill="#2563eb"
                  fillOpacity={0.1}
                />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Baseline"
                />
                <Line 
                  type="monotone" 
                  dataKey="withModel" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  name="Avec Modèle"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-gray-400 rounded"></div>
              <span>Baseline ({(800000 / 1000000).toFixed(1)}M FCFA/mois)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-600 rounded"></div>
              <span>Avec Modèle ({(redressmentsAmount / 1000000).toFixed(1)}M FCFA/mois)</span>
            </div>
            <Badge variant="default" className="ml-4">
              +{(((redressmentsAmount - 800000) / 800000) * 100).toFixed(1)}% vs baseline
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}