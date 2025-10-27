import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Send, Loader2, CheckCircle, AlertCircle, Lightbulb, Code, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';

const examplePrompts = [
  "Je veux détecter les déclarations de produits électroniques en provenance de Chine dont la valeur unitaire est anormalement basse",
  "Créer une règle pour identifier les opérateurs nouveaux (moins de 6 mois) avec des importations de haute valeur",
  "Détecter les marchandises textiles sous-évaluées avec des écarts de prix importants par rapport aux références",
  "Identifier les déclarations suspectes de bijoux avec poids/valeur incohérents",
];

interface GeneratedRule {
  name: string;
  description: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: string | number;
    logicalOperator?: string;
  }>;
  action: {
    riskLevel: string;
    scoreAdjustment: number;
  };
  naturalLanguage: string;
  technicalCode: string;
  confidence: number;
  estimatedImpact: {
    coverage: number;
    precision: number;
    falsePositiveRate: number;
  };
}

export function AIRuleAssistant() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRule, setGeneratedRule] = useState<GeneratedRule | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez décrire la règle que vous souhaitez créer');
      return;
    }

    setIsGenerating(true);
    setConversationHistory([...conversationHistory, { role: 'user', content: prompt }]);

    // Simulation de génération IA
    setTimeout(() => {
      const mockRule: GeneratedRule = {
        name: 'Détection Électronique Sous-évaluée Chine',
        description: 'Identifie les produits électroniques en provenance de Chine avec des prix unitaires anormalement bas pouvant indiquer une sous-évaluation',
        conditions: [
          { field: 'pays_origine', operator: 'equals', value: 'CN', logicalOperator: 'AND' },
          { field: 'code_sh', operator: 'starts_with', value: '85', logicalOperator: 'AND' },
          { field: 'prix_unitaire', operator: 'less_than', value: 50, logicalOperator: 'AND' },
          { field: 'valeur_declaree', operator: 'greater_than', value: 10000 },
        ],
        action: {
          riskLevel: 'R',
          scoreAdjustment: 25,
        },
        naturalLanguage: 'SI le pays d\'origine est la Chine ET le code SH commence par 85 (électronique) ET le prix unitaire est inférieur à 50€ ET la valeur déclarée dépasse 10000€ ALORS assigner un niveau de risque ROUGE et ajouter 25 points au score',
        technicalCode: `IF pays_origine = 'CN' 
  AND code_sh LIKE '85%' 
  AND prix_unitaire < 50 
  AND valeur_declaree > 10000
THEN 
  SET risk_level = 'R'
  ADD score_adjustment = 25`,
        confidence: 0.89,
        estimatedImpact: {
          coverage: 234,
          precision: 0.82,
          falsePositiveRate: 0.18,
        },
      };

      setGeneratedRule(mockRule);
      setConversationHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `J'ai généré une règle basée sur votre description. Elle cible les produits électroniques (code SH commençant par 85) importés de Chine avec un prix unitaire suspect (< 50€) et une valeur totale significative (> 10000€). Cette règle devrait couvrir environ 234 déclarations avec une précision estimée de 82%.`
      }]);
      setIsGenerating(false);
      toast.success('Règle générée avec succès');
    }, 2000);
  };

  const handleRefine = (refinement: string) => {
    setPrompt(refinement);
    toast.info('Affinez la règle en modifiant le prompt');
  };

  const handleApprove = () => {
    toast.success('Règle approuvée et ajoutée au système en mode test');
    setGeneratedRule(null);
    setPrompt('');
  };

  const useExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Assistant IA - Génération de Règles
          </CardTitle>
          <CardDescription>
            Décrivez en langage naturel la règle que vous souhaitez créer. L'IA la traduira en règle technique.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exemples de prompts */}
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Exemples de descriptions
            </Label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => useExamplePrompt(example)}
                  className="text-xs h-auto py-2 text-left whitespace-normal"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Zone de saisie */}
          <div className="space-y-2">
            <Label>Décrivez la règle que vous souhaitez créer</Label>
            <Textarea
              placeholder="Ex: Je veux détecter les déclarations de produits électroniques en provenance de Chine dont la valeur unitaire est anormalement basse..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer la règle avec l'IA
              </>
            )}
          </Button>

          {/* Historique de conversation */}
          {conversationHistory.length > 0 && (
            <div className="mt-6 space-y-3">
              <Label className="text-sm">Conversation</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {conversationHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-50 dark:bg-blue-950 ml-8' 
                        : 'bg-purple-50 dark:bg-purple-950 mr-8'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 text-muted-foreground">
                      {msg.role === 'user' ? 'Vous' : 'Assistant IA'}
                    </div>
                    <div className="text-sm">{msg.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Règle générée */}
      {generatedRule && (
        <Card className="border-2 border-purple-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Règle Générée par l'IA
              </CardTitle>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Confiance: {(generatedRule.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Nom de la règle</Label>
                <div className="mt-1 font-medium">{generatedRule.name}</div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <div className="mt-1 text-sm">{generatedRule.description}</div>
              </div>
            </div>

            <Separator />

            {/* Vue en onglets */}
            <Tabs defaultValue="natural" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="natural">
                  <Eye className="h-4 w-4 mr-2" />
                  Langage Naturel
                </TabsTrigger>
                <TabsTrigger value="technical">
                  <Code className="h-4 w-4 mr-2" />
                  Code Technique
                </TabsTrigger>
                <TabsTrigger value="impact">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Impact Estimé
                </TabsTrigger>
              </TabsList>

              <TabsContent value="natural" className="space-y-3">
                <Alert>
                  <AlertDescription className="text-sm">
                    {generatedRule.naturalLanguage}
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label>Conditions structurées:</Label>
                  {generatedRule.conditions.map((condition, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                      <Badge variant="outline" className="font-mono text-xs">
                        {idx === 0 ? 'IF' : condition.logicalOperator || 'THEN'}
                      </Badge>
                      <span className="font-medium">{condition.field}</span>
                      <span className="text-muted-foreground">{condition.operator}</span>
                      <span className="font-mono">{condition.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                    <Badge variant="outline" className="font-mono text-xs">THEN</Badge>
                    <span>Niveau de risque: <Badge variant="destructive">{generatedRule.action.riskLevel}</Badge></span>
                    <span>• Ajustement score: <strong>+{generatedRule.action.scoreAdjustment}</strong></span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-3">
                <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{generatedRule.technicalCode}</pre>
                </div>
                
                <Alert>
                  <Code className="h-4 w-4" />
                  <AlertDescription>
                    Ce code peut être directement intégré dans le système expert de règles métier
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="impact" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Couverture Estimée</CardDescription>
                      <CardTitle className="text-2xl">{generatedRule.estimatedImpact.coverage}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        Déclarations concernées sur 30j
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Précision Estimée</CardDescription>
                      <CardTitle className="text-2xl text-green-600">
                        {(generatedRule.estimatedImpact.precision * 100).toFixed(0)}%
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        Taux de vrais positifs
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Faux Positifs</CardDescription>
                      <CardTitle className="text-2xl text-orange-600">
                        {(generatedRule.estimatedImpact.falsePositiveRate * 100).toFixed(0)}%
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        À surveiller lors des tests
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ces estimations sont basées sur l'analyse des données historiques. 
                    La règle sera créée en mode "test" pour validation avant activation complète.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <Label className="text-sm">Affiner la règle (optionnel)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRefine('Rendre la règle plus stricte en ajoutant une condition sur le poids')}
                >
                  Ajouter condition poids
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRefine('Élargir aux pays d\'Asie du Sud-Est')}
                >
                  Élargir aux pays SEA
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRefine('Augmenter le seuil de valeur à 20000€')}
                >
                  Modifier seuil valeur
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRefine('Réduire le niveau de risque à Jaune')}
                >
                  Niveau risque Jaune
                </Button>
              </div>

              <div className="flex gap-3 pt-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setGeneratedRule(null)}
                >
                  Annuler
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={handleApprove}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approuver et Créer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guide d'utilisation */}
      {!generatedRule && conversationHistory.length === 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle className="text-base">Comment utiliser l'assistant IA ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="font-medium min-w-6">1.</div>
              <div>Décrivez en français ce que vous voulez détecter (pays, produits, valeurs, comportements...)</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="font-medium min-w-6">2.</div>
              <div>L'IA analyse votre demande et génère une règle technique correspondante</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="font-medium min-w-6">3.</div>
              <div>Examinez la règle en langage naturel, code technique et impact estimé</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="font-medium min-w-6">4.</div>
              <div>Affinez si nécessaire ou approuvez pour créer la règle en mode test</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
