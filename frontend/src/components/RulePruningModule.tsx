import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Scissors, AlertTriangle, CheckCircle, TrendingDown, Network, Sparkles, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

interface RedundantRuleGroup {
  id: string;
  rules: Array<{
    id: string;
    name: string;
    triggeredCount: number;
    detectionRate: number;
    overlap: number;
  }>;
  overlapPercentage: number;
  suggestion: 'merge' | 'keep_strongest' | 'review';
  estimatedGain: {
    performance: number;
    maintenance: number;
  };
}

interface UnderperformingRule {
  id: string;
  name: string;
  triggeredCount: number;
  detectionRate: number;
  falsePositiveRate: number;
  lastTriggered: string;
  reason: string;
  suggestion: 'disable' | 'modify' | 'remove';
}

const mockRedundantGroups: RedundantRuleGroup[] = [
  {
    id: 'group-1',
    rules: [
      { id: 'r1', name: 'Pays Haut Risque - Valeur Élevée', triggeredCount: 847, detectionRate: 0.23, overlap: 0.78 },
      { id: 'r2', name: 'Importation Chine > 50k€', triggeredCount: 623, detectionRate: 0.19, overlap: 0.78 },
      { id: 'r3', name: 'Électronique Asie Haute Valeur', triggeredCount: 534, detectionRate: 0.21, overlap: 0.62 },
    ],
    overlapPercentage: 78,
    suggestion: 'merge',
    estimatedGain: {
      performance: 15,
      maintenance: 33,
    },
  },
  {
    id: 'group-2',
    rules: [
      { id: 'r4', name: 'Opérateur Nouveau', triggeredCount: 234, detectionRate: 0.18, overlap: 0.92 },
      { id: 'r5', name: 'Opérateur < 6 mois', triggeredCount: 267, detectionRate: 0.17, overlap: 0.92 },
    ],
    overlapPercentage: 92,
    suggestion: 'keep_strongest',
    estimatedGain: {
      performance: 8,
      maintenance: 50,
    },
  },
];

const mockUnderperforming: UnderperformingRule[] = [
  {
    id: 'r6',
    name: 'Code SH Textile Spécifique',
    triggeredCount: 12,
    detectionRate: 0.03,
    falsePositiveRate: 0.67,
    lastTriggered: '2024-12-15',
    reason: 'Très peu de déclenchements et taux de faux positifs élevé',
    suggestion: 'remove',
  },
  {
    id: 'r7',
    name: 'Marchandise Périssable Délai',
    triggeredCount: 89,
    detectionRate: 0.09,
    falsePositiveRate: 0.42,
    lastTriggered: '2025-01-10',
    reason: 'Détection faible avec beaucoup de faux positifs',
    suggestion: 'modify',
  },
  {
    id: 'r8',
    name: 'Transport Maritime Retard',
    triggeredCount: 0,
    detectionRate: 0,
    falsePositiveRate: 0,
    lastTriggered: '2024-09-22',
    reason: 'Aucun déclenchement depuis 4 mois',
    suggestion: 'disable',
  },
];

export function RulePruningModule() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [hasResults, setHasResults] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedUnderperforming, setSelectedUnderperforming] = useState<string[]>([]);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setHasResults(true);
          toast.success('Analyse terminée - Opportunités d\'optimisation détectées');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleOptimize = () => {
    const totalSelected = selectedGroups.length + selectedUnderperforming.length;
    if (totalSelected === 0) {
      toast.error('Veuillez sélectionner au moins une règle à optimiser');
      return;
    }
    setShowOptimizationDialog(true);
  };

  const handleConfirmOptimization = () => {
    toast.success(`${selectedGroups.length + selectedUnderperforming.length} règles optimisées avec succès`);
    setShowOptimizationDialog(false);
    setSelectedGroups([]);
    setSelectedUnderperforming([]);
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleUnderperformingSelection = (ruleId: string) => {
    setSelectedUnderperforming(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const totalRulesImpacted = hasResults 
    ? mockRedundantGroups.reduce((sum, group) => sum + group.rules.length, 0) + mockUnderperforming.length
    : 0;

  const estimatedPerformanceGain = hasResults
    ? selectedGroups.reduce((sum, groupId) => {
        const group = mockRedundantGroups.find(g => g.id === groupId);
        return sum + (group?.estimatedGain.performance || 0);
      }, 0)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5 text-blue-600" />
                Pruning Automatique des Règles
              </CardTitle>
              <CardDescription>
                Identifiez et éliminez les règles redondantes ou sous-performantes pour optimiser votre système
              </CardDescription>
            </div>
            {hasResults && (
              <Button variant="outline" size="sm" onClick={() => toast.success('Rapport exporté')}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              L'analyse utilise des algorithmes de clustering et de détection de patterns pour identifier automatiquement 
              les opportunités d'optimisation dans votre ensemble de règles.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full gap-2"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Network className="h-5 w-5" />
                Lancer l'Analyse de Pruning
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyse des redondances et performances...</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {hasResults && (
        <>
          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Règles Analysées</CardDescription>
                <CardTitle className="text-3xl">42</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Actives dans le système
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Opportunités Détectées</CardDescription>
                <CardTitle className="text-3xl text-orange-600">{totalRulesImpacted}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  À optimiser ou supprimer
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Gain Performance Estimé</CardDescription>
                <CardTitle className="text-3xl text-green-600">+23%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Après optimisation
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Réduction Maintenance</CardDescription>
                <CardTitle className="text-3xl text-blue-600">-35%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Effort de gestion
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résultats détaillés */}
          <Tabs defaultValue="redundant" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="redundant">
                Règles Redondantes
                <Badge variant="secondary" className="ml-2">{mockRedundantGroups.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="underperforming">
                Sous-performantes
                <Badge variant="secondary" className="ml-2">{mockUnderperforming.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="graph">
                Graphe de Dépendances
              </TabsTrigger>
            </TabsList>

            <TabsContent value="redundant" className="space-y-4">
              <Alert>
                <Network className="h-4 w-4" />
                <AlertDescription>
                  {mockRedundantGroups.length} groupes de règles avec chevauchement significatif détectés
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {mockRedundantGroups.map((group) => (
                  <Card key={group.id} className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={selectedGroups.includes(group.id)}
                            onCheckedChange={() => toggleGroupSelection(group.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-base">
                              Groupe de règles redondantes ({group.rules.length} règles)
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Chevauchement de {group.overlapPercentage}% détecté
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={
                          group.suggestion === 'merge' ? 'default' :
                          group.suggestion === 'keep_strongest' ? 'secondary' :
                          'outline'
                        }>
                          {group.suggestion === 'merge' ? 'Fusionner' :
                           group.suggestion === 'keep_strongest' ? 'Garder la meilleure' :
                           'À réviser'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Règle</TableHead>
                              <TableHead>Déclenchements</TableHead>
                              <TableHead>Taux détection</TableHead>
                              <TableHead>Chevauchement</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.rules.map((rule) => (
                              <TableRow key={rule.id}>
                                <TableCell className="font-medium">{rule.name}</TableCell>
                                <TableCell>{rule.triggeredCount}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {(rule.detectionRate * 100).toFixed(0)}%
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-orange-500"
                                        style={{ width: `${rule.overlap * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-sm">{(rule.overlap * 100).toFixed(0)}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                        <div>
                          <div className="text-sm text-muted-foreground">Gain performance estimé</div>
                          <div className="text-xl font-medium text-green-600">
                            +{group.estimatedGain.performance}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Réduction maintenance</div>
                          <div className="text-xl font-medium text-blue-600">
                            -{group.estimatedGain.maintenance}%
                          </div>
                        </div>
                      </div>

                      {group.suggestion === 'merge' && (
                        <Alert>
                          <Sparkles className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Suggestion:</strong> Fusionner ces règles en une seule règle optimisée qui combine 
                            leurs conditions tout en éliminant les redondances.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="underperforming" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {mockUnderperforming.length} règles sous-performantes nécessitant une action
                </AlertDescription>
              </Alert>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Règle</TableHead>
                      <TableHead>Déclenchements</TableHead>
                      <TableHead>Détection</TableHead>
                      <TableHead>Faux positifs</TableHead>
                      <TableHead>Dernier usage</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead>Suggestion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUnderperforming.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUnderperforming.includes(rule.id)}
                            onCheckedChange={() => toggleUnderperformingSelection(rule.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.triggeredCount}</TableCell>
                        <TableCell>
                          <Badge variant={rule.detectionRate < 0.05 ? 'destructive' : 'secondary'}>
                            {(rule.detectionRate * 100).toFixed(0)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.falsePositiveRate > 0.5 ? 'destructive' : 'outline'}>
                            {(rule.falsePositiveRate * 100).toFixed(0)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {rule.lastTriggered}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs">{rule.reason}</TableCell>
                        <TableCell>
                          <Badge variant={
                            rule.suggestion === 'remove' ? 'destructive' :
                            rule.suggestion === 'modify' ? 'default' :
                            'secondary'
                          }>
                            {rule.suggestion === 'remove' ? 'Supprimer' :
                             rule.suggestion === 'modify' ? 'Modifier' :
                             'Désactiver'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="graph" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Graphe de Dépendances des Règles</CardTitle>
                  <CardDescription>
                    Visualisation des relations et chevauchements entre vos règles
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-muted-foreground space-y-3">
                    <Network className="h-16 w-16 mx-auto opacity-20" />
                    <div>Visualisation du graphe de dépendances</div>
                    <div className="text-sm">
                      Les nœuds représentent les règles, les liens représentent les chevauchements
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions d'optimisation */}
          {(selectedGroups.length > 0 || selectedUnderperforming.length > 0) && (
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {selectedGroups.length + selectedUnderperforming.length} règle(s) sélectionnée(s) pour optimisation
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Gain de performance estimé: +{estimatedPerformanceGain}%
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedGroups([]);
                        setSelectedUnderperforming([]);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button onClick={handleOptimize} className="gap-2">
                      <Scissors className="h-4 w-4" />
                      Appliquer les Optimisations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Dialog de confirmation */}
      <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer les Optimisations</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point d'appliquer les optimisations suivantes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedGroups.length > 0 && (
              <div>
                <div className="font-medium mb-2">Groupes de règles redondantes:</div>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {selectedGroups.map(groupId => {
                    const group = mockRedundantGroups.find(g => g.id === groupId);
                    return (
                      <li key={groupId}>
                        {group?.rules.length} règles seront fusionnées ou optimisées
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {selectedUnderperforming.length > 0 && (
              <div>
                <div className="font-medium mb-2">Règles sous-performantes:</div>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {selectedUnderperforming.map(ruleId => {
                    const rule = mockUnderperforming.find(r => r.id === ruleId);
                    return (
                      <li key={ruleId}>
                        {rule?.name} - {
                          rule?.suggestion === 'remove' ? 'Sera supprimée' :
                          rule?.suggestion === 'modify' ? 'Sera modifiée' :
                          'Sera désactivée'
                        }
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Les règles seront sauvegardées avant modification. Vous pourrez annuler ces changements si nécessaire.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptimizationDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmOptimization}>
              <Scissors className="h-4 w-4 mr-2" />
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}