import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Brain, GitBranch, Shuffle, Eye, TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ComponentMetrics {
  id: string;
  name: string;
  type: 'ai' | 'rules' | 'random' | 'unsupervised';
  enabled: boolean;
  weight: number;
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
  };
  operationalMetrics: {
    avgLatency: number;
    throughput: number;
    errorRate: number;
    uptime: number;
  };
  businessImpact: {
    detections: number;
    falsePositives: number;
    recoveredAmount: number;
    costSavings: number;
  };
  trend: 'up' | 'down' | 'stable';
}

const mockComponentsData: ComponentMetrics[] = [
  {
    id: 'ai',
    name: 'Modèle IA',
    type: 'ai',
    enabled: true,
    weight: 60,
    performance: {
      accuracy: 0.89,
      precision: 0.82,
      recall: 0.76,
      f1Score: 0.79,
      auc: 0.91
    },
    operationalMetrics: {
      avgLatency: 45,
      throughput: 1250,
      errorRate: 0.002,
      uptime: 0.998
    },
    businessImpact: {
      detections: 2847,
      falsePositives: 284,
      recoveredAmount: 4250000,
      costSavings: 185000
    },
    trend: 'up'
  },
  {
    id: 'rules',
    name: 'Système Expert',
    type: 'rules',
    enabled: true,
    weight: 25,
    performance: {
      accuracy: 0.85,
      precision: 0.91,
      recall: 0.62,
      f1Score: 0.74,
      auc: 0.84
    },
    operationalMetrics: {
      avgLatency: 8,
      throughput: 3200,
      errorRate: 0.001,
      uptime: 0.999
    },
    businessImpact: {
      detections: 1523,
      falsePositives: 91,
      recoveredAmount: 2850000,
      costSavings: 98000
    },
    trend: 'stable'
  },
  {
    id: 'random',
    name: 'Échantillonnage Aléatoire',
    type: 'random',
    enabled: true,
    weight: 10,
    performance: {
      accuracy: 0.52,
      precision: 0.18,
      recall: 0.95,
      f1Score: 0.30,
      auc: 0.51
    },
    operationalMetrics: {
      avgLatency: 2,
      throughput: 5000,
      errorRate: 0,
      uptime: 1
    },
    businessImpact: {
      detections: 234,
      falsePositives: 1066,
      recoveredAmount: 425000,
      costSavings: 15000
    },
    trend: 'stable'
  },
  {
    id: 'unsupervised',
    name: 'Détection Non-supervisée',
    type: 'unsupervised',
    enabled: true,
    weight: 5,
    performance: {
      accuracy: 0.71,
      precision: 0.68,
      recall: 0.42,
      f1Score: 0.52,
      auc: 0.72
    },
    operationalMetrics: {
      avgLatency: 125,
      throughput: 450,
      errorRate: 0.005,
      uptime: 0.995
    },
    businessImpact: {
      detections: 187,
      falsePositives: 88,
      recoveredAmount: 685000,
      costSavings: 42000
    },
    trend: 'up'
  }
];

const timeSeriesData = [
  { date: '01/10', ai: 0.89, rules: 0.85, random: 0.52, unsupervised: 0.71, global: 0.84 },
  { date: '08/10', ai: 0.88, rules: 0.86, random: 0.51, unsupervised: 0.69, global: 0.83 },
  { date: '15/10', ai: 0.90, rules: 0.84, random: 0.53, unsupervised: 0.72, global: 0.85 },
  { date: '22/10', ai: 0.91, rules: 0.85, random: 0.52, unsupervised: 0.74, global: 0.86 },
  { date: '29/10', ai: 0.89, rules: 0.85, random: 0.52, unsupervised: 0.71, global: 0.84 },
  { date: '05/11', ai: 0.92, rules: 0.86, random: 0.51, unsupervised: 0.73, global: 0.87 },
  { date: '12/11', ai: 0.89, rules: 0.85, random: 0.52, unsupervised: 0.71, global: 0.84 },
];

const contributionData = mockComponentsData.map(comp => ({
  name: comp.name,
  value: comp.businessImpact.recoveredAmount,
  weight: comp.weight
}));

export function ComponentsMonitoring() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'ai': return Brain;
      case 'rules': return GitBranch;
      case 'random': return Shuffle;
      case 'unsupervised': return Eye;
      default: return Activity;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getHealthStatus = (metrics: ComponentMetrics) => {
    const avgPerformance = (metrics.performance.accuracy + metrics.performance.precision + metrics.performance.recall) / 3;
    const isHealthy = avgPerformance >= 0.7 && metrics.operationalMetrics.uptime >= 0.99 && metrics.operationalMetrics.errorRate < 0.01;
    
    if (isHealthy) return { status: 'healthy', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-500/10' };
    if (avgPerformance >= 0.5) return { status: 'warning', icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
    return { status: 'critical', icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' };
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

  // Calcul des métriques globales
  const globalMetrics = {
    totalDetections: mockComponentsData.reduce((sum, c) => sum + c.businessImpact.detections, 0),
    totalRecovered: mockComponentsData.reduce((sum, c) => sum + c.businessImpact.recoveredAmount, 0),
    totalFalsePositives: mockComponentsData.reduce((sum, c) => sum + c.businessImpact.falsePositives, 0),
    avgAccuracy: mockComponentsData.reduce((sum, c) => sum + c.performance.accuracy * c.weight, 0) / 100,
    avgLatency: mockComponentsData.reduce((sum, c) => sum + c.operationalMetrics.avgLatency * c.weight, 0) / 100,
  };

  // Données pour le radar chart
  const radarData = [
    {
      metric: 'Précision',
      IA: mockComponentsData[0].performance.precision * 100,
      Règles: mockComponentsData[1].performance.precision * 100,
      Aléatoire: mockComponentsData[2].performance.precision * 100,
      NonSupervisé: mockComponentsData[3].performance.precision * 100,
    },
    {
      metric: 'Rappel',
      IA: mockComponentsData[0].performance.recall * 100,
      Règles: mockComponentsData[1].performance.recall * 100,
      Aléatoire: mockComponentsData[2].performance.recall * 100,
      NonSupervisé: mockComponentsData[3].performance.recall * 100,
    },
    {
      metric: 'F1Score',
      IA: mockComponentsData[0].performance.f1Score * 100,
      Règles: mockComponentsData[1].performance.f1Score * 100,
      Aléatoire: mockComponentsData[2].performance.f1Score * 100,
      NonSupervisé: mockComponentsData[3].performance.f1Score * 100,
    },
    {
      metric: 'AUC',
      IA: mockComponentsData[0].performance.auc * 100,
      Règles: mockComponentsData[1].performance.auc * 100,
      Aléatoire: mockComponentsData[2].performance.auc * 100,
      NonSupervisé: mockComponentsData[3].performance.auc * 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Vue globale */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Détections Totales</div>
            <div className="text-2xl mb-2">{globalMetrics.totalDetections.toLocaleString()}</div>
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20 border">
              {mockComponentsData.length} composants actifs
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Montant Récupéré</div>
            <div className="text-2xl mb-2">{(globalMetrics.totalRecovered / 1000000).toFixed(1)}M€</div>
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 border">
              +12% vs mois dernier
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Précision Globale</div>
            <div className="text-2xl mb-2">{(globalMetrics.avgAccuracy * 100).toFixed(1)}%</div>
            <Badge className="bg-purple-500/10 text-purple-700 border-purple-500/20 border">
              Pondéré par poids
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Latence Moyenne</div>
            <div className="text-2xl mb-2">{globalMetrics.avgLatency.toFixed(0)}ms</div>
            <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20 border">
              SLA: &lt;100ms
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Évolution temporelle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution de la Performance (Accuracy)</CardTitle>
            <CardDescription>Tendance des 7 dernières semaines</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                <Legend />
                <Line type="monotone" dataKey="global" stroke="#000" strokeWidth={3} name="Global" />
                <Line type="monotone" dataKey="ai" stroke="#3b82f6" strokeWidth={2} name="IA" />
                <Line type="monotone" dataKey="rules" stroke="#8b5cf6" strokeWidth={2} name="Règles" />
                <Line type="monotone" dataKey="unsupervised" stroke="#10b981" strokeWidth={2} name="Non-supervisé" />
                <Line type="monotone" dataKey="random" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" name="Aléatoire" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparaison des Métriques</CardTitle>
            <CardDescription>Performance relative par composant</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="IA" dataKey="IA" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Règles" dataKey="Règles" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Radar name="Non-supervisé" dataKey="NonSupervisé" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contribution par composant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contribution aux Détections</CardTitle>
            <CardDescription>Répartition du montant récupéré</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(2)}M€`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficacité Opérationnelle</CardTitle>
            <CardDescription>Détections vs Faux Positifs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockComponentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="businessImpact.detections" fill="#22c55e" name="Détections" />
                <Bar dataKey="businessImpact.falsePositives" fill="#ef4444" name="Faux Positifs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Détail par composant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockComponentsData.map((component, idx) => {
          const Icon = getIcon(component.type);
          const health = getHealthStatus(component);
          const HealthIcon = health.icon;

          return (
            <Card key={component.id} className="border-l-4" style={{ borderLeftColor: COLORS[idx] }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <div>
                      <CardTitle>{component.name}</CardTitle>
                      <CardDescription>Poids: {component.weight}%</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(component.trend)}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded ${health.bg}`}>
                      <HealthIcon className={`w-4 h-4 ${health.color}`} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Métriques de performance */}
                <div>
                  <h4 className="text-sm mb-3">Performance Prédictive</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Précision</span>
                        <span>{(component.performance.precision * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={component.performance.precision * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Rappel</span>
                        <span>{(component.performance.recall * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={component.performance.recall * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">F1-Score</span>
                        <span>{(component.performance.f1Score * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={component.performance.f1Score * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">AUC</span>
                        <span>{(component.performance.auc * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={component.performance.auc * 100} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Métriques opérationnelles */}
                <div>
                  <h4 className="text-sm mb-2">Métriques Opérationnelles</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latence</span>
                      <span>{component.operationalMetrics.avgLatency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Throughput</span>
                      <span>{component.operationalMetrics.throughput}/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uptime</span>
                      <span>{(component.operationalMetrics.uptime * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Erreurs</span>
                      <span>{(component.operationalMetrics.errorRate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                {/* Impact business */}
                <div>
                  <h4 className="text-sm mb-2">Impact Business</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Détections</span>
                      <span className="font-medium">{component.businessImpact.detections.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Faux Positifs</span>
                      <span className="font-medium text-orange-600">{component.businessImpact.falsePositives.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Récupéré</span>
                      <span className="font-medium text-green-600">{(component.businessImpact.recoveredAmount / 1000000).toFixed(2)}M€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Économies</span>
                      <span className="font-medium">{(component.businessImpact.costSavings / 1000).toFixed(0)}k€</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
