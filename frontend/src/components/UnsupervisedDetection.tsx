import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';
import { Play, Sparkles, Download, Settings, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

// Données mockées pour les clusters
const clusterData = [
  // Cluster 0 - Normal, faible risque
  { x: 15000, y: 12, z: 0, cluster: 0, label: 'Normal' },
  { x: 18000, y: 15, z: 0, cluster: 0, label: 'Normal' },
  { x: 22000, y: 18, z: 0, cluster: 0, label: 'Normal' },
  { x: 12000, y: 10, z: 0, cluster: 0, label: 'Normal' },
  { x: 25000, y: 20, z: 0, cluster: 0, label: 'Normal' },
  
  // Cluster 1 - Valeur élevée, risque moyen
  { x: 65000, y: 45, z: 1, cluster: 1, label: 'Valeur élevée' },
  { x: 72000, y: 48, z: 1, cluster: 1, label: 'Valeur élevée' },
  { x: 58000, y: 42, z: 1, cluster: 1, label: 'Valeur élevée' },
  { x: 81000, y: 52, z: 1, cluster: 1, label: 'Valeur élevée' },
  
  // Cluster 2 - Anomalies (valeur faible, risque élevé)
  { x: 8000, y: 78, z: 2, cluster: 2, label: 'Anomalie' },
  { x: 12000, y: 82, z: 2, cluster: 2, label: 'Anomalie' },
  { x: 6500, y: 75, z: 2, cluster: 2, label: 'Anomalie' },
  { x: 10000, y: 85, z: 2, cluster: 2, label: 'Anomalie' },
  
  // Cluster 3 - Très haut risque
  { x: 125000, y: 92, z: 3, cluster: 3, label: 'Haut risque' },
  { x: 150000, y: 88, z: 3, cluster: 3, label: 'Haut risque' },
  { x: 135000, y: 95, z: 3, cluster: 3, label: 'Haut risque' },
];

const clusterColors = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#ef4444'];

const suggestedRules = [
  {
    id: 'rule-1',
    cluster: 2,
    name: 'Détection Sous-évaluation Suspecte',
    description: 'Marchandises avec valeur faible mais risque élevé (cluster anomalie)',
    conditions: [
      'valeur_declaree < 15000',
      'score_risque > 70',
      'pays_origine IN [CN, TR, AE]'
    ],
    coverage: 156,
    precision: 0.87,
    confidence: 0.92,
    impact: 'high'
  },
  {
    id: 'rule-2',
    cluster: 3,
    name: 'Contrôle Systématique Très Haute Valeur',
    description: 'Déclarations de très haute valeur avec score de risque critique',
    conditions: [
      'valeur_declaree > 100000',
      'score_risque > 85',
    ],
    coverage: 89,
    precision: 0.94,
    confidence: 0.88,
    impact: 'high'
  },
  {
    id: 'rule-3',
    cluster: 1,
    name: 'Surveillance Valeurs Moyennes-Élevées',
    description: 'Marchandises de valeur moyenne-élevée avec risque modéré',
    conditions: [
      'valeur_declaree BETWEEN 50000 AND 90000',
      'score_risque BETWEEN 40 AND 55',
    ],
    coverage: 234,
    precision: 0.76,
    confidence: 0.81,
    impact: 'medium'
  },
];

const algorithmOptions = [
  { value: 'kmeans', label: 'K-Means Clustering', description: 'Partitionnement en clusters distincts' },
  { value: 'dbscan', label: 'DBSCAN', description: 'Détection de densité et outliers' },
  { value: 'isolation_forest', label: 'Isolation Forest', description: 'Détection d\'anomalies' },
  { value: 'lof', label: 'Local Outlier Factor', description: 'Anomalies basées sur la densité locale' },
];

export function UnsupervisedDetection() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('kmeans');
  const [numClusters, setNumClusters] = useState(4);
  const [sensitivity, setSensitivity] = useState([0.7]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<typeof suggestedRules[0] | null>(null);

  const handleRunAnalysis = () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulation de l'analyse
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setHasResults(true);
          toast.success('Analyse terminée - 4 clusters détectés');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleGenerateRule = (rule: typeof suggestedRules[0]) => {
    setSelectedRule(rule);
    setShowRuleDialog(true);
  };

  const handleConfirmRule = () => {
    toast.success(`Règle "${selectedRule?.name}" créée avec succès`);
    setShowRuleDialog(false);
  };

  const handleExport = () => {
    toast.success('Clusters exportés (voir console)');
    console.log('Export clusters:', { algorithm: selectedAlgorithm, clusters: clusterData });
  };

  return (
    <div className="space-y-6">
      {/* Configuration de l'analyse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Détection Non-Supervisée de Patterns
          </CardTitle>
          <CardDescription>
            Utilisez des algorithmes de machine learning pour identifier automatiquement des groupes et anomalies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Algorithme</Label>
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {algorithmOptions.map((algo) => (
                    <SelectItem key={algo.value} value={algo.value}>
                      <div>
                        <div>{algo.label}</div>
                        <div className="text-xs text-muted-foreground">{algo.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nombre de clusters: {numClusters}</Label>
              <Slider
                value={[numClusters]}
                onValueChange={(value) => setNumClusters(value[0])}
                min={2}
                max={10}
                step={1}
                disabled={selectedAlgorithm === 'dbscan'}
              />
              <p className="text-xs text-muted-foreground">
                {selectedAlgorithm === 'dbscan' ? 'Déterminé automatiquement' : 'Ajustez selon vos besoins'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Sensibilité: {(sensitivity[0] * 100).toFixed(0)}%</Label>
              <Slider
                value={sensitivity}
                onValueChange={setSensitivity}
                min={0.3}
                max={1}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">
                Plus élevé = plus de clusters détectés
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleRunAnalysis} 
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Lancer l'Analyse
                </>
              )}
            </Button>

            {hasResults && (
              <>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Dernière analyse: il y a 2 minutes
                </div>
              </>
            )}
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Traitement des données...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {hasResults && (
        <>
          {/* Résultats de l'analyse */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Clusters Détectés</CardDescription>
                <CardTitle className="text-3xl">4</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Algorithme: K-Means
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Anomalies Identifiées</CardDescription>
                <CardTitle className="text-3xl text-orange-600">156</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Cluster 2 (sous-évaluation)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Règles Suggérées</CardDescription>
                <CardTitle className="text-3xl text-blue-600">3</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Prêtes à être générées
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Score de Séparation</CardDescription>
                <CardTitle className="text-3xl">0.84</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Qualité excellente
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualisations et suggestions */}
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visualization">Visualisation</TabsTrigger>
              <TabsTrigger value="clusters">Clusters Détails</TabsTrigger>
              <TabsTrigger value="rules">Règles Suggérées</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des Clusters</CardTitle>
                  <CardDescription>
                    Valeur déclarée (x) vs Score de risque (y) - Chaque couleur représente un cluster
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Valeur déclarée" 
                        unit="€"
                        label={{ value: 'Valeur déclarée (€)', position: 'bottom' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Score de risque"
                        label={{ value: 'Score de risque', angle: -90, position: 'left' }}
                      />
                      <ZAxis type="number" dataKey="z" range={[100, 400]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Déclarations" data={clusterData}>
                        {clusterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster]} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 flex items-center gap-6 justify-center">
                    {['Normal', 'Valeur élevée', 'Anomalie', 'Haut risque'].map((label, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: clusterColors[i] }}
                        />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clusters" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 0, name: 'Cluster 0: Normal', size: 5, avgValue: 18400, avgRisk: 15, color: clusterColors[0], desc: 'Déclarations standards sans anomalie' },
                  { id: 1, name: 'Cluster 1: Valeur élevée', size: 4, avgValue: 69000, avgRisk: 46.75, color: clusterColors[1], desc: 'Marchandises de valeur importante' },
                  { id: 2, name: 'Cluster 2: Anomalie', size: 4, avgValue: 9125, avgRisk: 80, color: clusterColors[2], desc: 'Sous-évaluation probable' },
                  { id: 3, name: 'Cluster 3: Haut risque', size: 3, avgValue: 136666, avgRisk: 91.67, color: clusterColors[3], desc: 'Risque critique nécessitant attention' },
                ].map((cluster) => (
                  <Card key={cluster.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: cluster.color }}
                          />
                          {cluster.name}
                        </CardTitle>
                        <Badge>{cluster.size} éléments</Badge>
                      </div>
                      <CardDescription>{cluster.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Valeur moyenne:</dt>
                          <dd className="font-medium">{cluster.avgValue.toLocaleString()}€</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Risque moyen:</dt>
                          <dd className="font-medium">{cluster.avgRisk.toFixed(1)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Part du total:</dt>
                          <dd className="font-medium">{((cluster.size / 16) * 100).toFixed(1)}%</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  L'IA a identifié {suggestedRules.length} opportunités de règles basées sur les patterns détectés.
                  Examinez et générez les règles qui correspondent à vos besoins.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {suggestedRules.map((rule) => (
                  <Card key={rule.id} className="border-l-4" style={{ borderLeftColor: clusterColors[rule.cluster] }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{rule.name}</CardTitle>
                          <CardDescription className="mt-1">{rule.description}</CardDescription>
                        </div>
                        <Badge variant={rule.impact === 'high' ? 'destructive' : 'default'}>
                          Impact {rule.impact === 'high' ? 'Élevé' : 'Moyen'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm">Conditions suggérées:</Label>
                        <div className="mt-2 space-y-1">
                          {rule.conditions.map((condition, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Badge variant="outline" className="font-mono text-xs">
                                {idx > 0 ? 'AND' : 'IF'}
                              </Badge>
                              <code className="text-xs bg-muted px-2 py-1 rounded">{condition}</code>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Couverture</div>
                          <div className="font-medium">{rule.coverage} cas</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Précision estimée</div>
                          <div className="font-medium">{(rule.precision * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Confiance</div>
                          <div className="font-medium">{(rule.confidence * 100).toFixed(0)}%</div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleGenerateRule(rule)}
                        className="w-full gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Générer cette règle
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Dialog de confirmation de règle */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirmer la génération de règle</DialogTitle>
            <DialogDescription>
              Une nouvelle règle va être créée dans le système de gestion des règles
            </DialogDescription>
          </DialogHeader>
          
          {selectedRule && (
            <div className="space-y-4">
              <div>
                <Label>Nom de la règle</Label>
                <Input value={selectedRule.name} readOnly className="mt-1" />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={selectedRule.description} readOnly className="mt-1" />
              </div>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="font-medium text-sm">Conditions:</div>
                {selectedRule.conditions.map((condition, idx) => (
                  <div key={idx} className="text-sm font-mono">{condition}</div>
                ))}
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Cette règle sera créée en mode "test" et pourra être activée après validation.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRuleDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmRule}>
              <Sparkles className="h-4 w-4 mr-2" />
              Générer la règle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}