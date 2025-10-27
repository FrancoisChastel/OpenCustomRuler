import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Plus, Trash2, Edit, Copy, AlertCircle, Check, Play, Sparkles, Loader2 } from 'lucide-react';
import { Rule, Condition, LogicalOperator, ConditionOperator, RiskLevel, RuleStatus } from '../types/rules';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RuleImpactEstimator } from './RuleImpactEstimator';

const mockRules: Rule[] = [
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
      detectionRate: 0.23
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
      { id: 'c4', field: 'garantie_bancaire', operator: 'equals', value: 'non', logicalOperator: 'OR' },
      { id: 'c5', field: 'historique_incidents', operator: 'greater_than', value: 0 }
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
      detectionRate: 0.18
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
      { id: 'c7', field: 'marque_connue', operator: 'equals', value: 'oui', logicalOperator: 'AND' },
      { id: 'c8', field: 'prix_unitaire', operator: 'less_than', value: 100 }
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
      detectionRate: 0.31
    }
  }
];

const availableFields = [
  { value: 'pays_origine', label: 'Pays d\'origine' },
  { value: 'pays_provenance', label: 'Pays de provenance' },
  { value: 'valeur_declaree', label: 'Valeur déclarée (€)' },
  { value: 'code_sh', label: 'Code SH' },
  { value: 'poids_kg', label: 'Poids (kg)' },
  { value: 'operateur_anciennete_mois', label: 'Ancienneté opérateur (mois)' },
  { value: 'garantie_bancaire', label: 'Garantie bancaire' },
  { value: 'historique_incidents', label: 'Historique incidents' },
  { value: 'marque_connue', label: 'Marque connue' },
  { value: 'prix_unitaire', label: 'Prix unitaire (€)' },
  { value: 'type_transport', label: 'Type de transport' },
  { value: 'incoterm', label: 'Incoterm' }
];

const operators: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: 'Égal à' },
  { value: 'not_equals', label: 'Différent de' },
  { value: 'greater_than', label: 'Supérieur à' },
  { value: 'less_than', label: 'Inférieur à' },
  { value: 'greater_or_equal', label: 'Supérieur ou égal' },
  { value: 'less_or_equal', label: 'Inférieur ou égal' },
  { value: 'contains', label: 'Contient' },
  { value: 'in', label: 'Dans la liste' },
  { value: 'not_in', label: 'Pas dans la liste' }
];

export function RulesManager() {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<RuleStatus | 'all'>('all');
  const [creationMode, setCreationMode] = useState<'manual' | 'ai'>('manual');
  const [aiDescription, setAiDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredRules = filterStatus === 'all' 
    ? rules 
    : rules.filter(r => r.status === filterStatus);

  const handleCreateRule = () => {
    const newRule: Rule = {
      id: `rule_${Date.now()}`,
      name: 'Nouvelle Règle',
      description: '',
      priority: rules.length + 1,
      status: 'inactive',
      conditions: [
        {
          id: `cond_${Date.now()}`,
          field: 'pays_origine',
          operator: 'equals',
          value: '',
        }
      ],
      action: {
        riskLevel: 'J',
        scoreAdjustment: 10,
        forceControl: false
      },
      metadata: {
        createdBy: 'Utilisateur actuel',
        createdAt: new Date(),
        modifiedBy: 'Utilisateur actuel',
        modifiedAt: new Date(),
        triggeredCount: 0,
        detectionRate: 0
      }
    };
    setSelectedRule(newRule);
    setCreationMode('manual');
    setAiDescription('');
    setIsDialogOpen(true);
  };

  const generateRuleFromAI = async () => {
    if (!aiDescription.trim()) {
      toast.error('Veuillez décrire la règle');
      return;
    }

    setIsGenerating(true);
    
    // Simulation de l'appel à l'IA avec délai
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Analyse simple de la description (simulation d'IA)
    const desc = aiDescription.toLowerCase();
    const conditions: Condition[] = [];
    let riskLevel: RiskLevel = 'J';
    let scoreAdjustment = 15;
    let ruleName = 'Règle générée par IA';
    
    // Détection du pays
    if (desc.includes('chine') || desc.includes('cn')) {
      conditions.push({
        id: `cond_${Date.now()}_1`,
        field: 'pays_origine',
        operator: 'in',
        value: ['CN'],
        logicalOperator: 'AND'
      });
      ruleName = 'Importations depuis la Chine';
    } else if (desc.includes('émirats') || desc.includes('ae') || desc.includes('dubai')) {
      conditions.push({
        id: `cond_${Date.now()}_1`,
        field: 'pays_origine',
        operator: 'in',
        value: ['AE'],
        logicalOperator: 'AND'
      });
      ruleName = 'Importations depuis les Émirats';
    } else if (desc.includes('turquie') || desc.includes('tr')) {
      conditions.push({
        id: `cond_${Date.now()}_1`,
        field: 'pays_origine',
        operator: 'in',
        value: ['TR'],
        logicalOperator: 'AND'
      });
      ruleName = 'Importations depuis la Turquie';
    }
    
    // Détection de la valeur
    const valeurMatch = desc.match(/(\d+)\s*(k|mille|milliers)?\s*(€|euro)/i);
    if (valeurMatch) {
      const valeur = parseInt(valeurMatch[1]) * (valeurMatch[2] ? 1000 : 1);
      const operator = desc.includes('supérieur') || desc.includes('plus de') ? 'greater_than' : 
                       desc.includes('inférieur') || desc.includes('moins de') ? 'less_than' : 'greater_than';
      conditions.push({
        id: `cond_${Date.now()}_2`,
        field: 'valeur_declaree',
        operator: operator as ConditionOperator,
        value: valeur,
        logicalOperator: 'AND'
      });
      if (ruleName === 'Règle générée par IA') {
        ruleName = `Valeur ${operator === 'greater_than' ? 'élevée' : 'faible'}`;
      }
    }
    
    // Détection du poids
    const poidsMatch = desc.match(/(\d+)\s*(kg|kilo|kilogrammes?)/i);
    if (poidsMatch) {
      const poids = parseInt(poidsMatch[1]);
      const operator = desc.includes('supérieur') || desc.includes('plus de') ? 'greater_than' : 
                       desc.includes('inférieur') || desc.includes('moins de') ? 'less_than' : 'greater_than';
      conditions.push({
        id: `cond_${Date.now()}_3`,
        field: 'poids_kg',
        operator: operator as ConditionOperator,
        value: poids,
        logicalOperator: 'AND'
      });
    }
    
    // Détection opérateur nouveau
    if (desc.includes('nouveau') || desc.includes('récent') || desc.includes('moins de')) {
      const moisMatch = desc.match(/(\d+)\s*mois/i);
      if (moisMatch) {
        conditions.push({
          id: `cond_${Date.now()}_4`,
          field: 'operateur_anciennete_mois',
          operator: 'less_than',
          value: parseInt(moisMatch[1]),
          logicalOperator: 'AND'
        });
        if (ruleName === 'Règle générée par IA') {
          ruleName = 'Opérateur récent';
        }
      }
    }
    
    // Détection du niveau de risque
    if (desc.includes('rouge') || desc.includes('haut risque') || desc.includes('contrôle systématique')) {
      riskLevel = 'R';
      scoreAdjustment = 30;
    } else if (desc.includes('vert') || desc.includes('bas risque') || desc.includes('faible risque')) {
      riskLevel = 'V';
      scoreAdjustment = -10;
    } else {
      riskLevel = 'J';
      scoreAdjustment = 15;
    }
    
    // Si aucune condition détectée, créer une condition par défaut
    if (conditions.length === 0) {
      conditions.push({
        id: `cond_${Date.now()}`,
        field: 'pays_origine',
        operator: 'equals',
        value: '',
      });
    }
    
    const generatedRule: Rule = {
      id: `rule_${Date.now()}`,
      name: ruleName,
      description: aiDescription,
      priority: rules.length + 1,
      status: 'inactive',
      conditions: conditions,
      action: {
        riskLevel: riskLevel,
        scoreAdjustment: scoreAdjustment,
        forceControl: false
      },
      metadata: {
        createdBy: 'IA Assistant',
        createdAt: new Date(),
        modifiedBy: 'IA Assistant',
        modifiedAt: new Date(),
        triggeredCount: 0,
        detectionRate: 0
      }
    };
    
    setSelectedRule(generatedRule);
    setIsGenerating(false);
    setCreationMode('manual'); // Basculer vers le mode manuel pour permettre l'édition
    toast.success('Règle générée avec succès ! Vous pouvez l\'ajuster avant de l\'enregistrer.');
  };

  const handleEditRule = (rule: Rule) => {
    setSelectedRule({ ...rule });
    setIsDialogOpen(true);
  };

  const handleDuplicateRule = (rule: Rule) => {
    const duplicated: Rule = {
      ...rule,
      id: `rule_${Date.now()}`,
      name: `${rule.name} (Copie)`,
      status: 'inactive',
      metadata: {
        ...rule.metadata,
        createdAt: new Date(),
        modifiedAt: new Date(),
        triggeredCount: 0
      }
    };
    setRules([...rules, duplicated]);
    toast.success('Règle dupliquée');
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId));
    toast.success('Règle supprimée');
  };

  const handleToggleStatus = (ruleId: string) => {
    setRules(rules.map(r => {
      if (r.id === ruleId) {
        const newStatus = r.status === 'active' ? 'inactive' : 'active';
        toast.success(`Règle ${newStatus === 'active' ? 'activée' : 'désactivée'}`);
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  const handleSaveRule = () => {
    if (!selectedRule) return;
    
    const existingIndex = rules.findIndex(r => r.id === selectedRule.id);
    if (existingIndex >= 0) {
      const updated = [...rules];
      updated[existingIndex] = {
        ...selectedRule,
        metadata: {
          ...selectedRule.metadata,
          modifiedAt: new Date()
        }
      };
      setRules(updated);
      toast.success('Règle mise à jour');
    } else {
      setRules([...rules, selectedRule]);
      toast.success('Règle créée');
    }
    setIsDialogOpen(false);
    setSelectedRule(null);
  };

  const addCondition = () => {
    if (!selectedRule) return;
    const newCondition: Condition = {
      id: `cond_${Date.now()}`,
      field: 'pays_origine',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    };
    setSelectedRule({
      ...selectedRule,
      conditions: [...selectedRule.conditions, newCondition]
    });
  };

  const removeCondition = (conditionId: string) => {
    if (!selectedRule) return;
    setSelectedRule({
      ...selectedRule,
      conditions: selectedRule.conditions.filter(c => c.id !== conditionId)
    });
  };

  const updateCondition = (conditionId: string, updates: Partial<Condition>) => {
    if (!selectedRule) return;
    setSelectedRule({
      ...selectedRule,
      conditions: selectedRule.conditions.map(c => 
        c.id === conditionId ? { ...c, ...updates } : c
      )
    });
  };

  const getStatusBadge = (status: RuleStatus) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      testing: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status === 'active' && <Check className="w-3 h-3 mr-1" />}
        {status === 'testing' && <Play className="w-3 h-3 mr-1" />}
        {status === 'active' ? 'Active' : status === 'testing' ? 'Test' : 'Inactive'}
      </Badge>
    );
  };

  const getRiskBadge = (level: RiskLevel) => {
    const colors = {
      V: 'bg-green-500/10 text-green-700 border-green-500/20',
      J: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      R: 'bg-red-500/10 text-red-700 border-red-500/20'
    };
    
    return (
      <Badge className={`${colors[level]} border`}>
        Circuit {level}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Le système expert permet de créer des règles métier avec logique conditionnelle IF-THEN-OR. 
          Ces règles ajustent le score de risque et peuvent forcer un circuit de contrôle.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Règles Métier ({rules.length})</CardTitle>
              <CardDescription>
                Gestion du système expert de détection basé sur les règles
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as RuleStatus | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les règles</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="testing">En test</SelectItem>
                  <SelectItem value="inactive">Inactives</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreateRule}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Règle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredRules.map((rule) => (
              <Card key={rule.id} className="border-l-4" style={{
                borderLeftColor: rule.status === 'active' ? 'rgb(34 197 94)' : 
                                rule.status === 'testing' ? 'rgb(234 179 8)' : 
                                'rgb(156 163 175)'
              }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-muted px-2 py-0.5 rounded text-xs">
                          Priorité {rule.priority}
                        </span>
                        {getStatusBadge(rule.status)}
                        {getRiskBadge(rule.action.riskLevel)}
                      </div>
                      <h4 className="mb-1">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                      
                      <div className="bg-muted/50 p-3 rounded-md space-y-1 mb-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">IF</span>
                          {rule.conditions.map((cond, idx) => (
                            <div key={cond.id} className="ml-4">
                              <span className="font-mono">
                                {availableFields.find(f => f.value === cond.field)?.label || cond.field}{' '}
                                {operators.find(o => o.value === cond.operator)?.label}{' '}
                                <span className="text-primary">
                                  {Array.isArray(cond.value) ? cond.value.join(', ') : cond.value}
                                </span>
                              </span>
                              {idx < rule.conditions.length - 1 && (
                                <span className="ml-2 text-muted-foreground font-medium">
                                  {cond.logicalOperator}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">THEN</span>
                          <span className="ml-2">
                            Score {rule.action.scoreAdjustment > 0 ? '+' : ''}{rule.action.scoreAdjustment} → 
                            Circuit {rule.action.riskLevel}
                            {rule.action.forceControl && ' (Contrôle forcé)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Déclenchée: {rule.metadata.triggeredCount.toLocaleString()}×</span>
                        <span>Taux détection: {(rule.metadata.detectionRate * 100).toFixed(1)}%</span>
                        <span>Modifiée: {rule.metadata.modifiedAt.toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-4">
                      <Switch
                        checked={rule.status === 'active'}
                        onCheckedChange={() => handleToggleStatus(rule.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicateRule(rule)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour créer/éditer une règle */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[98vw] w-[98vw] max-h-[95vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedRule?.metadata.triggeredCount === 0 ? 'Créer' : 'Modifier'} une règle
            </DialogTitle>
            <DialogDescription>
              Choisissez le mode de création : manuel ou assisté par IA
            </DialogDescription>
          </DialogHeader>

          {/* Onglets pour choisir le mode */}
          {selectedRule?.metadata.triggeredCount === 0 && (
            <Tabs value={creationMode} onValueChange={(v) => setCreationMode(v as 'manual' | 'ai')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">
                  ✍️ Mode Manuel
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Assistant IA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="space-y-4 mt-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    Décrivez la règle en langage naturel et l'IA la générera automatiquement pour vous.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Description de la règle</Label>
                    <Textarea
                      value={aiDescription}
                      onChange={(e) => setAiDescription(e.target.value)}
                      placeholder="Exemple : Je veux créer une règle pour les importations depuis la Chine avec une valeur supérieure à 50 000 euros qui doivent passer en circuit rouge..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <h4 className="text-sm">💡 Exemples de descriptions</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>• "Importations depuis la Chine de plus de 50k€ en circuit rouge"</p>
                      <p>• "Opérateurs nouveaux de moins de 6 mois sans garantie bancaire"</p>
                      <p>• "Produits électroniques à bas prix depuis les Émirats"</p>
                      <p>• "Marchandises de plus de 500 kg depuis la Turquie"</p>
                    </div>
                  </div>

                  <Button 
                    onClick={generateRuleFromAI} 
                    disabled={isGenerating || !aiDescription.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Générer la règle avec l'IA
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-4">
                {/* Contenu du mode manuel (existant) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {selectedRule && (
                      <RuleManualEditor
                        rule={selectedRule}
                        onUpdate={setSelectedRule}
                        availableFields={availableFields}
                        operators={operators}
                      />
                    )}
                  </div>
                  
                  {/* Estimateur d'impact en temps réel */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-4">
                      <h4 className="text-sm mb-3">💡 Estimation d'Impact</h4>
                      {selectedRule && <RuleImpactEstimator rule={selectedRule} />}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Pour les règles en édition, afficher directement le mode manuel */}
          {selectedRule && selectedRule.metadata.triggeredCount > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RuleManualEditor
                  rule={selectedRule}
                  onUpdate={setSelectedRule}
                  availableFields={availableFields}
                  operators={operators}
                />
              </div>
              
              {/* Estimateur d'impact en temps réel */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <h4 className="text-sm mb-3">💡 Estimation d'Impact</h4>
                  <RuleImpactEstimator rule={selectedRule} />
                </div>
              </div>
            </div>
          )}



          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setAiDescription('');
              setCreationMode('manual');
            }}>
              Annuler
            </Button>
            <Button onClick={handleSaveRule} disabled={!selectedRule}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant séparé pour l'éditeur manuel de règles
interface RuleManualEditorProps {
  rule: Rule;
  onUpdate: (rule: Rule) => void;
  availableFields: { value: string; label: string }[];
  operators: { value: ConditionOperator; label: string }[];
}

function RuleManualEditor({ rule, onUpdate, availableFields, operators }: RuleManualEditorProps) {
  const addCondition = () => {
    const newCondition: Condition = {
      id: `cond_${Date.now()}`,
      field: 'pays_origine',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    };
    onUpdate({
      ...rule,
      conditions: [...rule.conditions, newCondition]
    });
  };

  const removeCondition = (conditionId: string) => {
    onUpdate({
      ...rule,
      conditions: rule.conditions.filter(c => c.id !== conditionId)
    });
  };

  const updateCondition = (conditionId: string, updates: Partial<Condition>) => {
    onUpdate({
      ...rule,
      conditions: rule.conditions.map(c => 
        c.id === conditionId ? { ...c, ...updates } : c
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nom de la règle</Label>
          <Input
            value={rule.name}
            onChange={(e) => onUpdate({ ...rule, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Priorité</Label>
          <Input
            type="number"
            value={rule.priority}
            onChange={(e) => onUpdate({ ...rule, priority: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={rule.description}
          onChange={(e) => onUpdate({ ...rule, description: e.target.value })}
          rows={2}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Conditions (IF)</Label>
          <Button variant="outline" size="sm" onClick={addCondition}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une condition
          </Button>
        </div>

        {rule.conditions.map((condition, idx) => (
          <div key={condition.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Champ</Label>
                  <Select
                    value={condition.field}
                    onValueChange={(v) => updateCondition(condition.id, { field: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map(f => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Opérateur</Label>
                  <Select
                    value={condition.operator}
                    onValueChange={(v) => updateCondition(condition.id, { operator: v as ConditionOperator })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Valeur</Label>
                  <Input
                    value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                    onChange={(e) => {
                      const val = condition.operator === 'in' || condition.operator === 'not_in'
                        ? e.target.value.split(',').map(v => v.trim())
                        : e.target.value;
                      updateCondition(condition.id, { value: val });
                    }}
                    placeholder={condition.operator === 'in' ? 'Val1, Val2, Val3' : 'Valeur'}
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCondition(condition.id)}
                disabled={rule.conditions.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {idx < rule.conditions.length - 1 && (
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Lien logique:</Label>
                <Select
                  value={condition.logicalOperator || 'AND'}
                  onValueChange={(v) => updateCondition(condition.id, { logicalOperator: v as LogicalOperator })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">ET (AND)</SelectItem>
                    <SelectItem value="OR">OU (OR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Action (THEN)</Label>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Circuit de contrôle</Label>
            <Select
              value={rule.action.riskLevel}
              onValueChange={(v) => onUpdate({
                ...rule,
                action: { ...rule.action, riskLevel: v as RiskLevel }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="V">Circuit Vert (V)</SelectItem>
                <SelectItem value="J">Circuit Jaune (J)</SelectItem>
                <SelectItem value="R">Circuit Rouge (R)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Ajustement du score</Label>
            <Input
              type="number"
              value={rule.action.scoreAdjustment}
              onChange={(e) => onUpdate({
                ...rule,
                action: { ...rule.action, scoreAdjustment: parseInt(e.target.value) }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Contrôle forcé</Label>
            <div className="flex items-center h-10">
              <Switch
                checked={rule.action.forceControl}
                onCheckedChange={(checked) => onUpdate({
                  ...rule,
                  action: { ...rule.action, forceControl: checked }
                })}
              />
              <span className="ml-2 text-sm">
                {rule.action.forceControl ? 'Oui' : 'Non'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
