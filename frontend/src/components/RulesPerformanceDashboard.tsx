import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Clock, Zap, Target, Calendar } from 'lucide-react';
import { Rule } from '../types/rules';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Alert, AlertDescription } from './ui/alert';

// Données mockées avec historique de performance
const mockRulesWithHistory: Rule[] = [
  {
    id: '1',
    name: 'Pays à Haut Risque - Valeur Élevée',
    description: 'Déclarations en provenance de pays à risque avec valeur > 50k€',
    priority: 1,
    status: 'active',
    conditions: [
      { id: 'c1', field: 'pays_origine', operator: 'in', value: ['CN', 'AE', 'TR'], logicalOperator: 'AND' },
      { id: 'c2', field: 'valeur_declaree', operator: 'greater_than', value: 50000 }
    ],
    action: {
      riskLevel: 'R',
      scoreAdjustment: 30,
      forceControl: false
    },
    metadata: {
      createdBy: 'M. Dupont',
      createdAt: new Date('2024-01-15'),
      modifiedBy: 'M. Dupont',
      modifiedAt: new Date('2024-02-20'),
      triggeredCount: 847,
      detectionRate: 0.23,
      falsePositiveRate: 0.12,
      avgProcessingTime: 8.5,
      lastTriggered: new Date('2025-10-08'),
      expirationDate: new Date('2025-12-31')
    },
    performance: {
      trend: 'stable',
      efficiency: 0.85,
      coverage: 0.34,
      accuracy: 0.88
    }
  },
  {
    id: '2',
    name: 'Opérateur Nouveau Sans Garantie',
    description: 'Opérateurs créés depuis moins de 6 mois sans caution bancaire',
    priority: 2,
    status: 'active',
    conditions: [
      { id: 'c3', field: 'operateur_anciennete_mois', operator: 'less_than', value: 6, logicalOperator: 'AND' },
      { id: 'c4', field: 'garantie_bancaire', operator: 'equals', value: 'non' }
    ],
    action: {
      riskLevel: 'J',
      scoreAdjustment: 15,
      forceControl: false
    },
    metadata: {
      createdBy: 'Mme Martin',
      createdAt: new Date('2024-03-01'),
      modifiedBy: 'Mme Martin',
      modifiedAt: new Date('2024-03-01'),
      triggeredCount: 234,
      detectionRate: 0.18,
      falsePositiveRate: 0.35,
      avgProcessingTime: 5.2,
      lastTriggered: new Date('2025-10-07'),
      expirationDate: new Date('2025-11-30')
    },
    performance: {
      trend: 'declining',
      efficiency: 0.52,
      coverage: 0.12,
      accuracy: 0.65
    }
  },
  {
    id: '3',
    name: 'Marchandises Sensibles - Électronique',
    description: 'Produits électroniques à risque de contrefaçon',
    priority: 3,
    status: 'testing',
    conditions: [
      { id: 'c6', field: 'code_sh', operator: 'contains', value: '8517', logicalOperator: 'AND' },
      { id: 'c7', field: 'marque_connue', operator: 'equals', value: 'oui' }
    ],
    action: {
      riskLevel: 'J',
      scoreAdjustment: 20,
      forceControl: false
    },
    metadata: {
      createdBy: 'M. Bernard',
      createdAt: new Date('2025-01-05'),
      modifiedBy: 'M. Bernard',
      modifiedAt: new Date('2025-01-05'),
      triggeredCount: 89,
      detectionRate: 0.31,
      falsePositiveRate: 0.08,
      avgProcessingTime: 6.1,
      lastTriggered: new Date('2025-10-09'),
      expirationDate: new Date('2026-01-31')
    },
    performance: {
      trend: 'improving',
      efficiency: 0.92,
      coverage: 0.08,
      accuracy: 0.92
    }
  },
  {
    id: '4',
    name: 'Valeur Anormalement Basse',
    description: 'Marchandises avec ratio poids/valeur suspect',
    priority: 5,
    status: 'active',
    conditions: [
      { id: 'c9', field: 'valeur_declaree', operator: 'less_than', value: 1000, logicalOperator: 'AND' },
      { id: 'c10', field: 'poids_kg', operator: 'greater_than', value: 500 }
    ],
    action: {
      riskLevel: 'R',
      scoreAdjustment: 25,
      forceControl: false
    },
    metadata: {
      createdBy: 'IA Assistant',
      createdAt: new Date('2024-06-10'),
      modifiedBy: 'IA Assistant',
      modifiedAt: new Date('2024-06-10'),
      triggeredCount: 12,
      detectionRate: 0.04,
      falsePositiveRate: 0.78,
      avgProcessingTime: 4.8,
      lastTriggered: new Date('2025-08-15'),
      expirationDate: new Date('2025-10-31')
    },
    performance: {
      trend: 'declining',
      efficiency: 0.12,
      coverage: 0.02,
      accuracy: 0.22
    }
  },
  {
    id: '5',
    name: 'Transit Multiple Pays Sensibles',
    description: 'Marchandises ayant transité par plusieurs pays à risque',
    priority: 4,
    status: 'inactive',
    conditions: [
      { id: 'c11', field: 'nb_pays_transit', operator: 'greater_than', value: 2 }
    ],
    action: {
      riskLevel: 'J',
      scoreAdjustment: 18,
      forceControl: false
    },
    metadata: {
      createdBy: 'M. Dubois',
      createdAt: new Date('2023-11-20'),
      modifiedBy: 'M. Dubois',
      modifiedAt: new Date('2024-05-10'),
      triggeredCount: 3,
      detectionRate: 0.01,
      falsePositiveRate: 0.92,
      avgProcessingTime: 7.3,
      lastTriggered: new Date('2025-02-28'),
      expirationDate: new Date('2025-10-20')
    },
    performance: {
      trend: 'declining',
      efficiency: 0.05,
      coverage: 0.01,
      accuracy: 0.08
    }
  }
];

// Données d'évolution temporelle pour chaque règle
const generateTimelineData = (ruleId: string) => {
  const baseData = [
    { week: 'S12', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S11', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S10', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S9', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S8', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S7', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S6', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S5', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S4', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S3', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S2', detections: 0, accuracy: 0, efficiency: 0 },
    { week: 'S1', detections: 0, accuracy: 0, efficiency: 0 },
  ];

  // Patterns différents selon la règle
  if (ruleId === '1') {
    return baseData.map((d, i) => ({
      ...d,
      detections: 65 + Math.random() * 15,
      accuracy: 0.85 + Math.random() * 0.08,
      efficiency: 0.82 + Math.random() * 0.06
    }));
  } else if (ruleId === '2') {
    return baseData.map((d, i) => ({
      ...d,
      detections: 25 - i * 1.5 + Math.random() * 8,
      accuracy: 0.70 - i * 0.015,
      efficiency: 0.65 - i * 0.02
    }));
  } else if (ruleId === '3') {
    return baseData.map((d, i) => ({
      ...d,
      detections: 5 + i * 0.8,
      accuracy: 0.75 + i * 0.015,
      efficiency: 0.70 + i * 0.02
    }));
  } else if (ruleId === '4') {
    return baseData.map((d, i) => ({
      ...d,
      detections: Math.max(0, 8 - i * 0.9),
      accuracy: Math.max(0.15, 0.35 - i * 0.02),
      efficiency: Math.max(0.10, 0.25 - i * 0.015)
    }));
  } else {
    return baseData.map((d, i) => ({
      ...d,
      detections: i < 8 ? 2 : 0,
      accuracy: i < 8 ? 0.15 - i * 0.01 : 0,
      efficiency: i < 8 ? 0.10 - i * 0.008 : 0
    }));
  }
};

export function RulesPerformanceDashboard() {
  const [sortBy, setSortBy] = useState<'efficiency' | 'detections' | 'accuracy' | 'expiration'>('efficiency');
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');

  // Classifier les règles par santé
  const classifyRule = (rule: Rule): 'healthy' | 'warning' | 'critical' => {
    if (rule.performance.efficiency >= 0.7 && rule.performance.accuracy >= 0.75) return 'healthy';
    if (rule.performance.efficiency >= 0.4 || rule.performance.accuracy >= 0.50) return 'warning';
    return 'critical';
  };

  // Vérifier si la règle expire bientôt
  const isExpiringSoon = (rule: Rule): boolean => {
    if (!rule.metadata.expirationDate) return false;
    const daysUntilExpiration = Math.floor((rule.metadata.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30 && daysUntilExpiration >= 0;
  };

  const isExpired = (rule: Rule): boolean => {
    if (!rule.metadata.expirationDate) return false;
    return rule.metadata.expirationDate.getTime() < Date.now();
  };

  // Filtrer et trier
  let filteredRules = mockRulesWithHistory;
  if (filterStatus !== 'all') {
    filteredRules = filteredRules.filter(r => classifyRule(r) === filterStatus);
  }

  const sortedRules = [...filteredRules].sort((a, b) => {
    if (sortBy === 'efficiency') return b.performance.efficiency - a.performance.efficiency;
    if (sortBy === 'accuracy') return b.performance.accuracy - a.performance.accuracy;
    if (sortBy === 'detections') return b.metadata.triggeredCount - a.metadata.triggeredCount;
    if (sortBy === 'expiration') {
      if (!a.metadata.expirationDate) return 1;
      if (!b.metadata.expirationDate) return -1;
      return a.metadata.expirationDate.getTime() - b.metadata.expirationDate.getTime();
    }
    return 0;
  });

  // Stats globales
  const healthyCount = mockRulesWithHistory.filter(r => classifyRule(r) === 'healthy').length;
  const warningCount = mockRulesWithHistory.filter(r => classifyRule(r) === 'warning').length;
  const criticalCount = mockRulesWithHistory.filter(r => classifyRule(r) === 'critical').length;
  const expiringCount = mockRulesWithHistory.filter(isExpiringSoon).length;
  const expiredCount = mockRulesWithHistory.filter(isExpired).length;

  // Données pour scatter plot (efficacité vs couverture)
  const scatterData = mockRulesWithHistory.map(rule => ({
    name: rule.name,
    efficiency: rule.performance.efficiency * 100,
    coverage: rule.performance.coverage * 100,
    detections: rule.metadata.triggeredCount,
    health: classifyRule(rule)
  }));

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-blue-600" />;
  };

  const getHealthColor = (health: string) => {
    if (health === 'healthy') return { bg: 'bg-green-500/10', text: 'text-green-700', border: 'border-green-500' };
    if (health === 'warning') return { bg: 'bg-yellow-500/10', text: 'text-yellow-700', border: 'border-yellow-500' };
    return { bg: 'bg-red-500/10', text: 'text-red-700', border: 'border-red-500' };
  };

  return (
    <div className="space-y-6">
      {/* Alertes */}
      {(expiredCount > 0 || expiringCount > 0 || criticalCount > 0) && (
        <div className="space-y-2">
          {expiredCount > 0 && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>{expiredCount}</strong> règle{expiredCount > 1 ? 's ont' : ' a'} expiré et {expiredCount > 1 ? 'doivent' : 'doit'} être renouvelée{expiredCount > 1 ? 's' : ''} ou désactivée{expiredCount > 1 ? 's' : ''}.
              </AlertDescription>
            </Alert>
          )}
          {expiringCount > 0 && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <strong>{expiringCount}</strong> règle{expiringCount > 1 ? 's' : ''} expire{expiringCount > 1 ? 'nt' : ''} dans moins de 30 jours.
              </AlertDescription>
            </Alert>
          )}
          {criticalCount > 0 && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <Target className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>{criticalCount}</strong> règle{criticalCount > 1 ? 's ont' : ' a'} une performance critique et {criticalCount > 1 ? 'devraient' : 'devrait'} être revue{criticalCount > 1 ? 's' : ''}.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Règles Saines</div>
            <div className="text-2xl mb-2">{healthyCount}</div>
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 border">
              Performance optimale
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">À Surveiller</div>
            <div className="text-2xl mb-2">{warningCount}</div>
            <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 border">
              Performance moyenne
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Critiques</div>
            <div className="text-2xl mb-2">{criticalCount}</div>
            <Badge className="bg-red-500/10 text-red-700 border-red-500/20 border">
              Action requise
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Expirent Bientôt</div>
            <div className="text-2xl mb-2">{expiringCount}</div>
            <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20 border">
              &lt; 30 jours
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Expirées</div>
            <div className="text-2xl mb-2">{expiredCount}</div>
            <Badge className="bg-red-500/10 text-red-700 border-red-500/20 border">
              À renouveler
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de positionnement */}
      <Card>
        <CardHeader>
          <CardTitle>Matrice Efficacité vs Couverture</CardTitle>
          <CardDescription>Positionnement des règles (taille = nombre de détections)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="coverage" name="Couverture" unit="%" domain={[0, 40]} />
              <YAxis type="number" dataKey="efficiency" name="Efficacité" unit="%" domain={[0, 100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Règles" data={scatterData}>
                {scatterData.map((entry, index) => {
                  const colors = { healthy: '#22c55e', warning: '#eab308', critical: '#ef4444' };
                  return <Cell key={`cell-${index}`} fill={colors[entry.health as keyof typeof colors]} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contrôles de tri et filtrage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance des Règles</CardTitle>
              <CardDescription>Suivi détaillé et évolution dans le temps</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="healthy">Saines</SelectItem>
                  <SelectItem value="warning">À surveiller</SelectItem>
                  <SelectItem value="critical">Critiques</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efficiency">Par efficacité</SelectItem>
                  <SelectItem value="accuracy">Par précision</SelectItem>
                  <SelectItem value="detections">Par détections</SelectItem>
                  <SelectItem value="expiration">Par expiration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedRules.map((rule) => {
              const health = classifyRule(rule);
              const healthStyle = getHealthColor(health);
              const timelineData = generateTimelineData(rule.id);
              const expired = isExpired(rule);
              const expiringSoon = isExpiringSoon(rule);

              return (
                <Card key={rule.id} className={`border-l-4 ${healthStyle.border}`}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* En-tête */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4>{rule.name}</h4>
                            <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                              {rule.status}
                            </Badge>
                            <Badge className={`${healthStyle.bg} ${healthStyle.text} border-0`}>
                              {health === 'healthy' ? 'Saine' : health === 'warning' ? 'Moyenne' : 'Critique'}
                            </Badge>
                            {expired && (
                              <Badge className="bg-red-500/10 text-red-700 border-red-500/20 border">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Expirée
                              </Badge>
                            )}
                            {!expired && expiringSoon && (
                              <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20 border">
                                <Clock className="w-3 h-3 mr-1" />
                                Expire bientôt
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(rule.performance.trend)}
                        </div>
                      </div>

                      {/* Métriques clés */}
                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">Efficacité</div>
                          <div className="flex items-center gap-2">
                            <Zap className={`w-4 h-4 ${rule.performance.efficiency >= 0.7 ? 'text-green-600' : rule.performance.efficiency >= 0.4 ? 'text-yellow-600' : 'text-red-600'}`} />
                            <span className="font-medium">{(rule.performance.efficiency * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Précision</div>
                          <div className="font-medium">{(rule.performance.accuracy * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Détections</div>
                          <div className="font-medium">{rule.metadata.triggeredCount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Faux Positifs</div>
                          <div className="font-medium text-orange-600">{(rule.metadata.falsePositiveRate * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Expiration</div>
                          <div className="font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {rule.metadata.expirationDate ? rule.metadata.expirationDate.toLocaleDateString('fr-FR') : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Graphique d'évolution */}
                      <div>
                        <div className="text-sm mb-2">Évolution sur 12 semaines</div>
                        <ResponsiveContainer width="100%" height={120}>
                          <LineChart data={timelineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                            <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Line yAxisId="left" type="monotone" dataKey="detections" stroke="#3b82f6" strokeWidth={2} name="Détections" />
                            <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficacité" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
