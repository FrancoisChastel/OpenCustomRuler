import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Brain, GitBranch, Shuffle, Eye, AlertCircle, Save } from 'lucide-react';
import { SystemComponent } from '../types/rules';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function SystemConfiguration() {
  const [components, setComponents] = useState<SystemComponent[]>([
    {
      id: 'ai',
      name: 'Modèle IA',
      type: 'ai',
      enabled: true,
      weight: 60,
      config: {
        model_type: 'gradient_boosting',
        retrain_frequency: 'weekly',
        min_training_samples: 10000,
        feature_selection: 'auto',
        hyperparameters: {
          learning_rate: 0.1,
          max_depth: 6,
          n_estimators: 100
        }
      }
    },
    {
      id: 'rules',
      name: 'Système expert (Règles)',
      type: 'rules',
      enabled: true,
      weight: 25,
      config: {
        active_rules_count: 12,
        priority_mode: 'sequential',
        conflict_resolution: 'highest_priority',
        allow_rule_chaining: true
      }
    },
    {
      id: 'random',
      name: 'Échantillonnage aléatoire',
      type: 'random',
      enabled: true,
      weight: 10,
      config: {
        sample_rate: 0.05,
        stratified: true,
        seed: 42,
        min_confidence_gap: 0.1
      }
    },
    {
      id: 'unsupervised',
      name: 'Détection non-supervisée',
      type: 'unsupervised',
      enabled: true,
      weight: 5,
      config: {
        algorithm: 'isolation_forest',
        contamination: 0.01,
        anomaly_threshold: 0.8,
        features_used: ['valeur', 'poids', 'quantite']
      }
    }
  ]);

  const totalWeight = components.reduce((sum, c) => sum + (c.enabled ? c.weight : 0), 0);
  const isWeightValid = totalWeight === 100;

  const updateComponent = (id: string, updates: Partial<SystemComponent>) => {
    setComponents(components.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updateConfig = (id: string, configUpdates: Record<string, any>) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, config: { ...c.config, ...configUpdates } } : c
    ));
  };

  const handleSave = () => {
    if (!isWeightValid) {
      toast.error('La somme des poids doit être égale à 100%');
      return;
    }
    toast.success('Configuration enregistrée');
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'ai': return Brain;
      case 'rules': return GitBranch;
      case 'random': return Shuffle;
      case 'unsupervised': return Eye;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Le système de scoring est composé de 4 composants complémentaires. 
          Ajustez les poids pour équilibrer entre prédiction IA, règles métier, aléatoire et détection d'anomalies.
        </AlertDescription>
      </Alert>

      {/* Vue d'ensemble des poids */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pondération des composants</CardTitle>
              <CardDescription>
                Total: {totalWeight}% 
                {!isWeightValid && <span className="text-destructive ml-2">(doit être 100%)</span>}
              </CardDescription>
            </div>
            <Button onClick={handleSave} disabled={!isWeightValid}>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {components.map((component) => {
              const Icon = getComponentIcon(component.type);
              return (
                <div key={component.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-64">
                    <Icon className="w-4 h-4" />
                    <span>{component.name}</span>
                    <Switch
                      checked={component.enabled}
                      onCheckedChange={(checked) => updateComponent(component.id, { enabled: checked })}
                    />
                  </div>
                  <div className="flex-1">
                    <Slider
                      value={[component.weight]}
                      onValueChange={([value]) => updateComponent(component.id, { weight: value })}
                      max={100}
                      step={5}
                      disabled={!component.enabled}
                    />
                  </div>
                  <div className="w-20 text-right">
                    <Badge variant={component.enabled ? 'default' : 'secondary'}>
                      {component.weight}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barre de visualisation */}
          <div className="mt-6">
            <div className="h-8 flex rounded-lg overflow-hidden border">
              {components.filter(c => c.enabled).map((component, idx) => (
                <div
                  key={component.id}
                  className="flex items-center justify-center text-xs text-white transition-all"
                  style={{
                    width: `${component.weight}%`,
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'][idx]
                  }}
                >
                  {component.weight > 10 && `${component.weight}%`}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration détaillée par composant */}
      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai">
            <Brain className="w-4 h-4 mr-2" />
            Modèle IA
          </TabsTrigger>
          <TabsTrigger value="rules">
            <GitBranch className="w-4 h-4 mr-2" />
            Règles
          </TabsTrigger>
          <TabsTrigger value="random">
            <Shuffle className="w-4 h-4 mr-2" />
            Aléatoire
          </TabsTrigger>
          <TabsTrigger value="unsupervised">
            <Eye className="w-4 h-4 mr-2" />
            Non-supervisé
          </TabsTrigger>
        </TabsList>

        {/* Configuration IA */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du Modèle IA</CardTitle>
              <CardDescription>
                Modèle basé sur l'apprentissage automatique à partir des données historiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Type de modèle</Label>
                  <Select
                    value={components.find(c => c.id === 'ai')?.config.model_type}
                    onValueChange={(v) => updateConfig('ai', { model_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient_boosting">Gradient Boosting (XGBoost)</SelectItem>
                      <SelectItem value="random_forest">Random Forest</SelectItem>
                      <SelectItem value="neural_network">Réseau de neurones</SelectItem>
                      <SelectItem value="logistic_regression">Régression logistique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fréquence de réentraînement</Label>
                  <Select
                    value={components.find(c => c.id === 'ai')?.config.retrain_frequency}
                    onValueChange={(v) => updateConfig('ai', { retrain_frequency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="manual">Manuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Échantillons minimum pour entraînement</Label>
                  <Input
                    type="number"
                    value={components.find(c => c.id === 'ai')?.config.min_training_samples}
                    onChange={(e) => updateConfig('ai', { min_training_samples: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sélection des features</Label>
                  <Select
                    value={components.find(c => c.id === 'ai')?.config.feature_selection}
                    onValueChange={(v) => updateConfig('ai', { feature_selection: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatique</SelectItem>
                      <SelectItem value="manual">Manuel</SelectItem>
                      <SelectItem value="importance">Par importance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4>Hyperparamètres</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Learning rate</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={components.find(c => c.id === 'ai')?.config.hyperparameters.learning_rate}
                      onChange={(e) => updateConfig('ai', { 
                        hyperparameters: { 
                          ...components.find(c => c.id === 'ai')?.config.hyperparameters,
                          learning_rate: parseFloat(e.target.value) 
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max depth</Label>
                    <Input
                      type="number"
                      value={components.find(c => c.id === 'ai')?.config.hyperparameters.max_depth}
                      onChange={(e) => updateConfig('ai', { 
                        hyperparameters: { 
                          ...components.find(c => c.id === 'ai')?.config.hyperparameters,
                          max_depth: parseInt(e.target.value) 
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>N estimators</Label>
                    <Input
                      type="number"
                      value={components.find(c => c.id === 'ai')?.config.hyperparameters.n_estimators}
                      onChange={(e) => updateConfig('ai', { 
                        hyperparameters: { 
                          ...components.find(c => c.id === 'ai')?.config.hyperparameters,
                          n_estimators: parseInt(e.target.value) 
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Règles */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du Système Expert</CardTitle>
              <CardDescription>
                Règles métier créées par des experts humains avec logique conditionnelle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Règles actives</Label>
                  <Input
                    type="number"
                    value={components.find(c => c.id === 'rules')?.config.active_rules_count}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Géré via l'onglet "Gestion des Règles"
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Mode de priorité</Label>
                  <Select
                    value={components.find(c => c.id === 'rules')?.config.priority_mode}
                    onValueChange={(v) => updateConfig('rules', { priority_mode: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">Séquentiel</SelectItem>
                      <SelectItem value="parallel">Parallèle</SelectItem>
                      <SelectItem value="weighted">Pondéré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Résolution des conflits</Label>
                  <Select
                    value={components.find(c => c.id === 'rules')?.config.conflict_resolution}
                    onValueChange={(v) => updateConfig('rules', { conflict_resolution: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highest_priority">Priorité la plus haute</SelectItem>
                      <SelectItem value="most_specific">Plus spécifique</SelectItem>
                      <SelectItem value="aggregate">Agrégation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chaînage de règles</Label>
                  <div className="flex items-center h-10">
                    <Switch
                      checked={components.find(c => c.id === 'rules')?.config.allow_rule_chaining}
                      onCheckedChange={(checked) => updateConfig('rules', { allow_rule_chaining: checked })}
                    />
                    <span className="ml-2 text-sm">
                      {components.find(c => c.id === 'rules')?.config.allow_rule_chaining ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Aléatoire */}
        <TabsContent value="random">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'Échantillonnage Aléatoire</CardTitle>
              <CardDescription>
                Contrôles aléatoires pour maintenir un effet dissuasif et détecter des patterns inconnus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Taux d'échantillonnage (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[components.find(c => c.id === 'random')?.config.sample_rate * 100]}
                      onValueChange={([value]) => updateConfig('random', { sample_rate: value / 100 })}
                      max={20}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-16 text-right">
                      {(components.find(c => c.id === 'random')?.config.sample_rate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Échantillonnage stratifié</Label>
                  <div className="flex items-center h-10">
                    <Switch
                      checked={components.find(c => c.id === 'random')?.config.stratified}
                      onCheckedChange={(checked) => updateConfig('random', { stratified: checked })}
                    />
                    <span className="ml-2 text-sm">
                      {components.find(c => c.id === 'random')?.config.stratified ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maintient la distribution des catégories
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Seed aléatoire</Label>
                  <Input
                    type="number"
                    value={components.find(c => c.id === 'random')?.config.seed}
                    onChange={(e) => updateConfig('random', { seed: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pour la reproductibilité
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Écart de confiance minimum</Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={components.find(c => c.id === 'random')?.config.min_confidence_gap}
                    onChange={(e) => updateConfig('random', { min_confidence_gap: parseFloat(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Seuil pour appliquer l'aléatoire
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Non-supervisé */}
        <TabsContent value="unsupervised">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de la Détection Non-Supervisée</CardTitle>
              <CardDescription>
                Détection d'anomalies et de patterns inhabituels sans labels préexistants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Algorithme</Label>
                  <Select
                    value={components.find(c => c.id === 'unsupervised')?.config.algorithm}
                    onValueChange={(v) => updateConfig('unsupervised', { algorithm: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="isolation_forest">Isolation Forest</SelectItem>
                      <SelectItem value="one_class_svm">One-Class SVM</SelectItem>
                      <SelectItem value="lof">Local Outlier Factor</SelectItem>
                      <SelectItem value="autoencoder">Autoencoder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Taux de contamination (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[components.find(c => c.id === 'unsupervised')?.config.contamination * 100]}
                      onValueChange={([value]) => updateConfig('unsupervised', { contamination: value / 100 })}
                      max={10}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="w-16 text-right">
                      {(components.find(c => c.id === 'unsupervised')?.config.contamination * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Proportion attendue d'anomalies
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Seuil d'anomalie</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[components.find(c => c.id === 'unsupervised')?.config.anomaly_threshold * 100]}
                      onValueChange={([value]) => updateConfig('unsupervised', { anomaly_threshold: value / 100 })}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-16 text-right">
                      {(components.find(c => c.id === 'unsupervised')?.config.anomaly_threshold * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Features utilisées</Label>
                  <Input
                    value={components.find(c => c.id === 'unsupervised')?.config.features_used.join(', ')}
                    onChange={(e) => updateConfig('unsupervised', { 
                      features_used: e.target.value.split(',').map(f => f.trim()) 
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Séparées par des virgules
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
