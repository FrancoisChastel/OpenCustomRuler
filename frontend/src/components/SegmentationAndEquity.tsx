import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { SegmentMetric } from "../types/dashboard";
import { useState } from "react";

interface SegmentationAndEquityProps {
  segmentData: SegmentMetric[];
}

export function SegmentationAndEquity({ segmentData }: SegmentationAndEquityProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  
  // Heatmap data - Matrice segment x métrique
  const heatmapData = [
    { segment: 'Port Autonome Dakar', fpr: 0.12, tpr: 0.83, precision: 0.76, adoption: 0.85 },
    { segment: 'Port de Ziguinchor', fpr: 0.08, tpr: 0.71, precision: 0.82, adoption: 0.79 },
    { segment: 'Aéroport LSS', fpr: 0.15, tpr: 0.89, precision: 0.68, adoption: 0.91 },
    { segment: 'Bureau Kaolack', fpr: 0.10, tpr: 0.77, precision: 0.73, adoption: 0.76 },
    { segment: 'Bureau Kidira', fpr: 0.13, tpr: 0.74, precision: 0.71, adoption: 0.82 },
    { segment: 'Bureau Rosso', fpr: 0.09, tpr: 0.69, precision: 0.79, adoption: 0.77 }
  ];

  const metrics = [
    { key: 'fpr', name: 'Taux Faux Positifs', format: 'percentage', invert: true },
    { key: 'tpr', name: 'Taux Vrais Positifs', format: 'percentage', invert: false },
    { key: 'precision', name: 'Précision', format: 'percentage', invert: false },
    { key: 'adoption', name: 'Taux d\'Adoption', format: 'percentage', invert: false }
  ];

  const getHeatmapColor = (value: number, invert: boolean) => {
    const intensity = invert ? 1 - value : value;
    if (intensity > 0.8) return 'bg-green-600 text-white';
    if (intensity > 0.6) return 'bg-green-400 text-white';
    if (intensity > 0.4) return 'bg-yellow-400 text-black';
    if (intensity > 0.2) return 'bg-orange-400 text-white';
    return 'bg-red-500 text-white';
  };

  // Données détaillées pour le drill-down
  const drillDownData = {
    'Port Autonome Dakar': {
      commissionnaires: [
        { name: 'GETMA', volume: 2340, auc: 0.84, adoption: 0.89 },
        { name: 'SOCOPAO', volume: 1890, auc: 0.81, adoption: 0.83 },
        { name: 'MAERSK', volume: 1560, auc: 0.87, adoption: 0.91 }
      ],
      hsCategories: [
        { code: '8471', description: 'Machines informatiques', risk: 0.23 },
        { code: '8703', description: 'Véhicules automobiles', risk: 0.31 },
        { code: '6204', description: 'Vêtements pour femmes', risk: 0.18 }
      ]
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Heatmap Performance par Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 font-medium">Segment</th>
                  {metrics.map((metric) => (
                    <th key={metric.key} className="text-center p-2 font-medium text-sm">
                      {metric.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.segment} className="border-t">
                    <td className="p-2 font-medium text-sm">{row.segment}</td>
                    {metrics.map((metric) => {
                      const value = row[metric.key as keyof typeof row] as number;
                      return (
                        <td key={metric.key} className="p-2 text-center">
                          <div 
                            className={`rounded px-2 py-1 text-sm font-medium ${getHeatmapColor(value, metric.invert)}`}
                          >
                            {(value * 100).toFixed(0)}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">Légende:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>Moyen</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Faible</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedSegment(selectedSegment ? null : 'Port Autonome Dakar')}
            >
              Drill-down <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedSegment && drillDownData[selectedSegment as keyof typeof drillDownData] && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance par Commissionnaire - {selectedSegment}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drillDownData[selectedSegment as keyof typeof drillDownData].commissionnaires.map((comm) => (
                  <div key={comm.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{comm.name}</div>
                      <div className="text-sm text-muted-foreground">{comm.volume.toLocaleString()} déclarations</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">AUC: {comm.auc.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Adoption: {(comm.adoption * 100).toFixed(0)}%</div>
                      </div>
                      <Badge variant={comm.auc > 0.85 ? 'default' : comm.auc > 0.8 ? 'secondary' : 'destructive'}>
                        {comm.auc > 0.85 ? 'Excellent' : comm.auc > 0.8 ? 'Bon' : 'À améliorer'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Catégories HS à Risque - {selectedSegment}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drillDownData[selectedSegment as keyof typeof drillDownData].hsCategories.map((hs) => (
                  <div key={hs.code} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">HS {hs.code}</div>
                      <div className="text-sm text-muted-foreground">{hs.description}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">Risque: {(hs.risk * 100).toFixed(0)}%</div>
                      </div>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(hs.risk * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}