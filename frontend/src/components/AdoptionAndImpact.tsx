import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { OverrideReason } from "../types/dashboard";
import { Badge } from "./ui/badge";

interface AdoptionAndImpactProps {
  overrideData: OverrideReason[];
  adoptionRate: number;
}

export function AdoptionAndImpact({ overrideData, adoptionRate }: AdoptionAndImpactProps) {
  const funnelData = [
    { stage: 'Déclarations', value: 12400, percentage: 100 },
    { stage: 'Reco Modèle', value: 11680, percentage: 94 },
    { stage: 'Décision Agent', value: 10240, percentage: 83 },
    { stage: 'Contrôle Effectué', value: 8950, percentage: 72 }
  ];

  const circuitTimes = [
    { circuit: 'Circuit Vert', avant: 2.5, apres: 1.8, delta: -28 },
    { circuit: 'Circuit Jaune', avant: 8.3, apres: 6.1, delta: -27 },
    { circuit: 'Circuit Rouge', avant: 24.7, apres: 18.2, delta: -26 }
  ];

  const capacityData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    capacite: 850 + Math.sin(i / 5) * 50,
    volume: 720 + Math.sin(i / 3) * 80 + Math.random() * 40,
    backlog: Math.max(0, (720 + Math.sin(i / 3) * 80 + Math.random() * 40) - (850 + Math.sin(i / 5) * 50))
  }));

  const COLORS = ['#2563eb', '#dc2626', '#f59e0b', '#10b981', '#6b7280'];

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Funnel d'Adoption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{stage.stage}</span>
                  <Badge variant="outline">{stage.percentage}%</Badge>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full" 
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                  <span className="absolute right-2 top-0 text-xs text-muted-foreground">
                    {stage.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Raisons d'Override</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overrideData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ percentage }) => `${percentage.toFixed(0)}%`}
                  labelLine={false}
                >
                  {overrideData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  `${value} (${props.payload.percentage.toFixed(1)}%)`,
                  props.payload.reason
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {overrideData.slice(0, 3).map((reason, index) => (
              <div key={reason.reason} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span>{reason.reason}</span>
                </div>
                <span className="font-medium">{reason.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-5">
        <CardHeader>
          <CardTitle className="text-base">Temps de Mainlevée par Circuit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {circuitTimes.map((circuit) => (
              <div key={circuit.circuit} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{circuit.circuit}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={circuit.delta < 0 ? 'default' : 'destructive'}>
                      {circuit.delta > 0 ? '+' : ''}{circuit.delta}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Avant: {circuit.avant}h</span>
                      <span>Après: {circuit.apres}h</span>
                    </div>
                    <div className="relative w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-red-400 h-2 rounded-full absolute" 
                        style={{ width: `${(circuit.avant / 30) * 100}%` }}
                      />
                      <div 
                        className="bg-green-500 h-2 rounded-full absolute" 
                        style={{ width: `${(circuit.apres / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle className="text-base">Capacité et Backlog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={capacityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} contrôles/jour`,
                    name === 'capacite' ? 'Capacité' : name === 'volume' ? 'Volume à traiter' : 'Backlog'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="capacite" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Capacité"
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Volume"
                />
                <Line 
                  type="monotone" 
                  dataKey="backlog" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  name="Backlog"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}