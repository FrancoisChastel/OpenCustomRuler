import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { TrendingUp, TrendingDown, Users, Building2, Euro, AlertTriangle, CheckCircle2, Target, Zap } from 'lucide-react';
import { Rule } from '../types/rules';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RuleImpactEstimatorProps {
  rule: Rule;
}

interface ImpactEstimate {
  declarations: {
    total: number;
    controlled: number;
    percentageIncrease: number;
  };
  revenue: {
    expected: number;
    confidence: 'low' | 'medium' | 'high';
    roi: number;
  };
  offices: {
    mostImpacted: Array<{ name: string; additionalLoad: number; currentCapacity: number }>;
    totalAdditionalLoad: number;
  };
  performance: {
    estimatedPrecision: number;
    estimatedRecall: number;
    riskOfFalsePositives: number;
  };
  costs: {
    controlCost: number;
    staffHours: number;
    netBenefit: number;
  };
}

// Fonction pour estimer l'impact basé sur les conditions de la règle
function estimateRuleImpact(rule: Rule): ImpactEstimate {
  // Base de données simulée pour l'estimation
  const totalDeclarations = 12400;
  const avgDeclarationValue = 15000;
  const controlCostPerDeclaration = 45;
  const avgRecoveryRate = 0.18;
  
  // Estimation du nombre de déclarations touchées
  let impactRate = 0.05; // 5% par défaut
  let precisionEstimate = 0.65;
  let recallEstimate = 0.50;
  
  rule.conditions.forEach(condition => {
    // Ajuster l'impact selon les conditions
    if (condition.field === 'pays_origine') {
      if (Array.isArray(condition.value)) {
        impactRate += condition.value.length * 0.08;
      } else {
        impactRate += 0.08;
      }
      precisionEstimate += 0.05;
    }
    
    if (condition.field === 'valeur_declaree') {
      const value = typeof condition.value === 'number' ? condition.value : 0;
      if (condition.operator === 'greater_than' && value > 20000) {
        impactRate += 0.15;
        precisionEstimate += 0.15;
        recallEstimate -= 0.10;
      } else if (condition.operator === 'less_than' && value < 5000) {
        impactRate += 0.25;
        precisionEstimate -= 0.10;
        recallEstimate += 0.15;
      }
    }
    
    if (condition.field === 'operateur_anciennete_mois') {
      impactRate += 0.12;
      precisionEstimate += 0.08;
    }
    
    if (condition.field === 'poids_kg') {
      impactRate += 0.06;
    }
    
    if (condition.field === 'code_sh') {
      impactRate += 0.10;
      precisionEstimate += 0.10;
    }
  });
  
  // Limiter les valeurs
  impactRate = Math.min(impactRate, 0.45);
  precisionEstimate = Math.min(Math.max(precisionEstimate, 0.15), 0.95);
  recallEstimate = Math.min(Math.max(recallEstimate, 0.20), 0.90);
  
  const declarationsControlled = Math.floor(totalDeclarations * impactRate);
  const previouslyControlled = Math.floor(totalDeclarations * 0.28); // 28% actuellement
  const percentageIncrease = ((declarationsControlled / previouslyControlled) - 1) * 100;
  
  // Estimation du revenu
  const truePositives = declarationsControlled * precisionEstimate;
  const expectedRevenue = truePositives * avgDeclarationValue * avgRecoveryRate;
  const confidence: 'low' | 'medium' | 'high' = 
    rule.conditions.length >= 3 ? 'high' : 
    rule.conditions.length >= 2 ? 'medium' : 'low';
  
  // Coûts
  const controlCost = declarationsControlled * controlCostPerDeclaration;
  const staffHours = declarationsControlled * 0.75; // 45 min par déclaration
  const netBenefit = expectedRevenue - controlCost;
  const roi = controlCost > 0 ? (netBenefit / controlCost) * 100 : 0;
  
  // Impact sur les bureaux (simulation basée sur les pays)
  const offices = [
    { name: 'Roissy CDG', additionalLoad: 0, currentCapacity: 0.93 },
    { name: 'Marseille-Fos', additionalLoad: 0, currentCapacity: 1.07 },
    { name: 'Le Havre', additionalLoad: 0, currentCapacity: 0.80 },
    { name: 'Lyon', additionalLoad: 0, currentCapacity: 0.95 },
  ];
  
  // Répartir la charge
  const loadPerOffice = declarationsControlled / offices.length;
  offices.forEach(office => {
    office.additionalLoad = Math.floor(loadPerOffice + (Math.random() * 40 - 20));
  });
  
  // Trier par impact
  offices.sort((a, b) => b.additionalLoad - a.additionalLoad);
  
  return {
    declarations: {
      total: totalDeclarations,
      controlled: declarationsControlled,
      percentageIncrease
    },
    revenue: {
      expected: expectedRevenue,
      confidence,
      roi
    },
    offices: {
      mostImpacted: offices,
      totalAdditionalLoad: declarationsControlled
    },
    performance: {
      estimatedPrecision: precisionEstimate,
      estimatedRecall: recallEstimate,
      riskOfFalsePositives: 1 - precisionEstimate
    },
    costs: {
      controlCost,
      staffHours,
      netBenefit
    }
  };
}

export function RuleImpactEstimator({ rule }: RuleImpactEstimatorProps) {
  const impact = useMemo(() => estimateRuleImpact(rule), [rule]);
  
  const getConfidenceColor = (confidence: string) => {
    if (confidence === 'high') return 'bg-green-500/10 text-green-700 border-green-500/20';
    if (confidence === 'medium') return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    return 'bg-red-500/10 text-red-700 border-red-500/20';
  };
  
  const isPositiveImpact = impact.costs.netBenefit > 0 && impact.performance.estimatedPrecision > 0.50;
  const needsReview = impact.performance.riskOfFalsePositives > 0.40 || 
                      impact.offices.mostImpacted.some(o => o.currentCapacity + (o.additionalLoad / 500) > 1.15);
  
  const officeImpactData = impact.offices.mostImpacted.map(office => ({
    name: office.name,
    'Charge actuelle': Math.floor(office.currentCapacity * 100),
    'Charge projetée': Math.floor((office.currentCapacity + (office.additionalLoad / 500)) * 100),
  }));
  
  const performanceData = [
    { name: 'Précision estimée', value: impact.performance.estimatedPrecision * 100, color: '#22c55e' },
    { name: 'Rappel estimé', value: impact.performance.estimatedRecall * 100, color: '#3b82f6' },
    { name: 'Risque faux positifs', value: impact.performance.riskOfFalsePositives * 100, color: '#ef4444' },
  ];
  
  return (
    <div className="space-y-3">
      {/* Alerte globale */}
      {needsReview && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10 py-2">
          <AlertTriangle className="h-3 h-3 text-yellow-600" />
          <AlertDescription className="text-xs">
            <strong>Attention:</strong> Taux élevé de faux positifs ou surcharge de bureaux.
          </AlertDescription>
        </Alert>
      )}
      
      {isPositiveImpact && !needsReview && (
        <Alert className="border-green-500/50 bg-green-500/10 py-2">
          <CheckCircle2 className="h-3 h-3 text-green-600" />
          <AlertDescription className="text-xs">
            <strong>Impact positif:</strong> +{(impact.costs.netBenefit / 1000).toFixed(0)}k€ avec bonne précision.
          </AlertDescription>
        </Alert>
      )}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground uppercase">Déclarations</div>
              <Users className="w-3 h-3 text-blue-600" />
            </div>
            <div className="text-lg mb-0.5">{impact.declarations.controlled.toLocaleString()}</div>
            <div className="flex items-center gap-1">
              {impact.declarations.percentageIncrease > 0 ? (
                <TrendingUp className="w-2.5 h-2.5 text-green-600" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 text-red-600" />
              )}
              <span className={`text-[10px] ${impact.declarations.percentageIncrease > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {impact.declarations.percentageIncrease > 0 ? '+' : ''}{impact.declarations.percentageIncrease.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground uppercase">Revenu</div>
              <Euro className="w-3 h-3 text-green-600" />
            </div>
            <div className="text-lg mb-0.5">{(impact.revenue.expected / 1000).toFixed(0)}k€</div>
            <Badge className={`${getConfidenceColor(impact.revenue.confidence)} border text-[9px] px-1 py-0`}>
              {impact.revenue.confidence === 'high' ? 'Élevée' : impact.revenue.confidence === 'medium' ? 'Moyenne' : 'Faible'}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground uppercase">ROI</div>
              <Target className="w-3 h-3 text-purple-600" />
            </div>
            <div className="text-lg mb-0.5">{impact.revenue.roi.toFixed(0)}%</div>
            <div className="text-[10px] text-muted-foreground">
              Net: {(impact.costs.netBenefit / 1000).toFixed(0)}k€
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground uppercase">Précision</div>
              <Zap className="w-3 h-3 text-orange-600" />
            </div>
            <div className="text-lg mb-0.5">{(impact.performance.estimatedPrecision * 100).toFixed(0)}%</div>
            <div className="text-[10px] text-muted-foreground">
              Rappel: {(impact.performance.estimatedRecall * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphique des bureaux */}
      <Card>
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-xs">Impact sur les Bureaux</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={officeImpactData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} domain={[0, 120]} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Bar dataKey="Charge actuelle" fill="#94a3b8" />
              <Bar dataKey="Charge projetée" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Alertes bureaux surchargés */}
          {impact.offices.mostImpacted.filter(o => o.currentCapacity + (o.additionalLoad / 500) > 1.10).length > 0 && (
            <div className="mt-2 space-y-0.5">
              {impact.offices.mostImpacted
                .filter(o => o.currentCapacity + (o.additionalLoad / 500) > 1.10)
                .slice(0, 2)
                .map(office => (
                  <div key={office.name} className="flex items-center gap-1 text-[10px]">
                    <AlertTriangle className="w-2.5 h-2.5 text-orange-600 flex-shrink-0" />
                    <span className="text-muted-foreground truncate">
                      {office.name}: <strong className="text-orange-600">
                        {((office.currentCapacity + (office.additionalLoad / 500)) * 100).toFixed(0)}%
                      </strong>
                    </span>
                  </div>
                ))
              }
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Performance métriques */}
      <Card>
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-xs">Performance Attendue</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="space-y-2">
            {performanceData.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value.toFixed(0)}%</span>
                </div>
                <Progress value={item.value} className="h-1.5" />
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Vrais positifs</span>
              <span className="font-medium text-green-600">
                {Math.floor(impact.declarations.controlled * impact.performance.estimatedPrecision).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Faux positifs</span>
              <span className="font-medium text-orange-600">
                {Math.floor(impact.declarations.controlled * impact.performance.riskOfFalsePositives).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Détails des coûts */}
      <Card>
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-xs">Coûts / Bénéfices</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Coût contrôles</span>
              <span className="font-medium">{(impact.costs.controlCost / 1000).toFixed(1)}k€</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Revenu attendu</span>
              <span className="font-medium text-green-600">{(impact.revenue.expected / 1000).toFixed(1)}k€</span>
            </div>
            <div className="flex justify-between text-[10px] pt-1 border-t">
              <span className="text-muted-foreground font-medium">Bénéfice net</span>
              <span className={`font-medium ${impact.costs.netBenefit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {impact.costs.netBenefit > 0 ? '+' : ''}{(impact.costs.netBenefit / 1000).toFixed(1)}k€
              </span>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">Rentabilité</span>
              <span className={`font-medium ${impact.revenue.roi > 100 ? 'text-green-600' : 'text-orange-600'}`}>
                {impact.revenue.roi.toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={Math.min((impact.revenue.roi / 500) * 100, 100)} 
              className="h-1.5" 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Recommandations */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-xs flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 text-[10px] space-y-1.5">
          {impact.performance.riskOfFalsePositives > 0.40 && (
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="w-2.5 h-2.5 text-orange-600 mt-0.5 flex-shrink-0" />
              <span>
                Taux de faux positifs élevé ({(impact.performance.riskOfFalsePositives * 100).toFixed(0)}%). 
                Ajoutez des conditions restrictives.
              </span>
            </div>
          )}
          
          {impact.revenue.roi < 100 && (
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="w-2.5 h-2.5 text-orange-600 mt-0.5 flex-shrink-0" />
              <span>
                ROI &lt; 100%. Affinez les conditions.
              </span>
            </div>
          )}
          
          {impact.offices.mostImpacted.some(o => o.currentCapacity + (o.additionalLoad / 500) > 1.15) && (
            <div className="flex items-start gap-1.5">
              <Building2 className="w-2.5 h-2.5 text-orange-600 mt-0.5 flex-shrink-0" />
              <span>
                Bureaux surchargés. Considérez une expiration courte.
              </span>
            </div>
          )}
          
          {isPositiveImpact && impact.performance.estimatedPrecision > 0.75 && (
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                Bon équilibre précision ({(impact.performance.estimatedPrecision * 100).toFixed(0)}%) 
                et ROI ({impact.revenue.roi.toFixed(0)}%). Activation recommandée.
              </span>
            </div>
          )}
          
          {rule.conditions.length === 1 && (
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="w-2.5 h-2.5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>
                Une seule condition → plus de faux positifs. Ajoutez des conditions.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
