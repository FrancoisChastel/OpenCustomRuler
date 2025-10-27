import { useState, useEffect } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { KPIBanner } from "./components/KPIBanner";
import { PerformanceCharts } from "./components/PerformanceCharts";
import { AdoptionAndImpact } from "./components/AdoptionAndImpact";
import { StabilityAndDrift } from "./components/StabilityAndDrift";
import { EconomicEfficiency } from "./components/EconomicEfficiency";
import { SegmentationAndEquity } from "./components/SegmentationAndEquity";
import { RulesManager } from "./components/RulesManager";
import { CustomsOfficeLoad } from "./components/CustomsOfficeLoad";
import { SystemConfiguration } from "./components/SystemConfiguration";
import { ComponentsMonitoring } from "./components/ComponentsMonitoring";
import { RulesPerformanceDashboard } from "./components/RulesPerformanceDashboard";
import { DataExplorationModule } from "./components/DataExplorationModule";
import { UnsupervisedDetection } from "./components/UnsupervisedDetection";
import { AIRuleAssistant } from "./components/AIRuleAssistant";
import { RulePruningModule } from "./components/RulePruningModule";
import { 
  generateMockMetrics,
  generateROCData,
  generatePRData,
  generateCalibrationData,
  generateFeatureImportanceData,
  generateTimeSeriesData,
  generateSegmentData,
  generateOverrideData
} from "./services/mockData";
import { ModelVersion, TimeWindow, HealthStatus } from "./types/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { toast } from "sonner@2.0.3";

type Page = 'dashboard' | 'components-monitoring' | 'rules-performance' | 'system-config' | 'rules' | 'offices' | 'data-analysis';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedVersion, setSelectedVersion] = useState<ModelVersion>('champion');
  const [selectedWindow, setSelectedWindow] = useState<TimeWindow>('30j');
  const [championMetrics, setChampionMetrics] = useState(generateMockMetrics('champion'));
  const [challengerMetrics, setChallengerMetrics] = useState(generateMockMetrics('challenger'));
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const currentMetrics = selectedVersion === 'champion' ? championMetrics : challengerMetrics;
  const healthStatus: HealthStatus = currentMetrics.error_rate < 0.01 && currentMetrics.uptime > 0.995 ? 'OK' : 'Alerte';
  
  // Données générées
  const rocData = generateROCData();
  const prData = generatePRData();
  const calibrationData = generateCalibrationData();
  const featureImportance = generateFeatureImportanceData();
  const timeSeriesData = generateTimeSeriesData(30);
  const segmentData = generateSegmentData();
  const overrideData = generateOverrideData();

  const handleVersionChange = (version: ModelVersion) => {
    setSelectedVersion(version);
    toast.success(`Basculé vers le modèle ${version}`);
  };

  const handleWindowChange = (window: TimeWindow) => {
    setSelectedWindow(window);
    toast.success(`Période changée vers ${window}`);
  };

  const handleRefresh = () => {
    setChampionMetrics(generateMockMetrics('champion'));
    setChallengerMetrics(generateMockMetrics('challenger'));
    setLastRefresh(new Date());
    toast.success('Données actualisées');
  };

  const handleExport = () => {
    const exportData = {
      version: selectedVersion,
      window: selectedWindow,
      metrics: currentMetrics,
      exportDate: new Date().toISOString(),
      filters: {
        segment: 'Tous ports',
        threshold: 0.5
      }
    };
    
    console.log('Export data:', exportData);
    toast.success('Export généré (voir console pour les données)');
  };

  // Comparaison Champion vs Challenger
  const getMetricDelta = (metricKey: keyof typeof championMetrics): string => {
    const championValue = championMetrics[metricKey] as number;
    const challengerValue = challengerMetrics[metricKey] as number;
    const delta = ((challengerValue - championValue) / championValue) * 100;
    return `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
  };

  useEffect(() => {
    // Simulation de rafraîchissement automatique toutes les 5 minutes
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% de chance de rafraîchir
        handleRefresh();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Navigation
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    const pageNames = {
      'dashboard': 'Dashboard',
      'components-monitoring': 'Monitoring des Composants',
      'rules-performance': 'Performance des Règles',
      'system-config': 'Configuration Système',
      'rules': 'Règles Métier',
      'offices': 'Bureaux de Douane',
      'data-analysis': 'Analyse des Données'
    };
    toast.success(`Navigué vers ${pageNames[page]}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation principale */}
      <div className="border-b bg-card">
        <div className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'dashboard' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            📊 Dashboard Global
          </button>
          <button
            onClick={() => handleNavigate('components-monitoring')}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'components-monitoring' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            📈 Monitoring Composants
          </button>
          <button
            onClick={() => handleNavigate('rules-performance')}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'rules-performance' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            🎯 Performance Règles
          </button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <button
            onClick={() => handleNavigate('system-config')}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'system-config' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            ⚙️ Configuration
          </button>
          <button
            onClick={() => handleNavigate('rules')}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'rules' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            📋 Gestion Règles
          </button>
          <button
            onClick={() => handleNavigate('offices')}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'offices' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            🏢 Bureaux
          </button>
          <button
            onClick={() => handleNavigate('data-analysis')}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'data-analysis' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            🔍 Analyse des Données
          </button>
        </div>
      </div>

      {currentPage === 'dashboard' && (
        <>
          <DashboardHeader
            selectedVersion={selectedVersion}
            onVersionChange={handleVersionChange}
            selectedWindow={selectedWindow}
            onWindowChange={handleWindowChange}
            healthStatus={healthStatus}
            driftLevel={currentMetrics.drift_level}
            latency={currentMetrics.latency_p95}
            uptime={currentMetrics.uptime}
            onExport={handleExport}
            onRefresh={handleRefresh}
          />

          <KPIBanner 
            metrics={currentMetrics}
            sparklineData={timeSeriesData}
          />

          <div className="p-6 space-y-6">
            {/* Section Performance Prédictive */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Performance Prédictive</h2>
                {selectedVersion === 'challenger' && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">vs Champion:</span>
                    <span className="font-medium">AUC {getMetricDelta('auc_roc')}</span>
                    <span className="font-medium">Précision@5% {getMetricDelta('precision_at_k')}</span>
                  </div>
                )}
              </div>
              <PerformanceCharts
                rocData={rocData}
                prData={prData}
                calibrationData={calibrationData}
                featureImportance={featureImportance}
                currentThreshold={0.5}
              />
            </div>

            <Separator />

            {/* Section Adoption & Impact Opérationnel */}
            <div>
              <h2 className="text-lg font-medium mb-4">Adoption & Impact Opérationnel</h2>
              <AdoptionAndImpact
                overrideData={overrideData}
                adoptionRate={currentMetrics.adoption_rate}
              />
            </div>

            <Separator />

            {/* Analyses Avancées */}
            <div>
              <h2 className="text-lg font-medium mb-4">Analyses Avancées</h2>
              <Tabs defaultValue="stability" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="stability">Stabilité & Drift</TabsTrigger>
                  <TabsTrigger value="economics">Efficacité Économique</TabsTrigger>
                  <TabsTrigger value="segments">Segmentation</TabsTrigger>
                </TabsList>

                <TabsContent value="stability" className="mt-6">
                  <StabilityAndDrift
                    psiGlobal={currentMetrics.psi_global}
                    driftLevel={currentMetrics.drift_level}
                  />
                </TabsContent>

                <TabsContent value="economics" className="mt-6">
                  <EconomicEfficiency
                    redressmentsAmount={currentMetrics.redressements_amount}
                  />
                </TabsContent>

                <TabsContent value="segments" className="mt-6">
                  <SegmentationAndEquity
                    segmentData={segmentData}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer avec informations sur les données */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Dernière actualisation: {lastRefresh.toLocaleString('fr-FR')} • 
                    Période d'analyse: {selectedWindow} • 
                    Version: {selectedVersion}
                  </div>
                  <div>
                    Données: {(12400).toLocaleString()} déclarations • 
                    Contrôles: {(8950).toLocaleString()} • 
                    Latence API: {currentMetrics.latency_p95}ms
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {currentPage === 'components-monitoring' && (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2">Monitoring des Composants</h1>
            <p className="text-muted-foreground">
              Suivi détaillé de la performance de chaque composant du système de scoring
            </p>
          </div>
          <ComponentsMonitoring />
        </div>
      )}

      {currentPage === 'rules-performance' && (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2">Performance des Règles Métier</h1>
            <p className="text-muted-foreground">
              Analyse temporelle et identification des règles inefficaces
            </p>
          </div>
          <RulesPerformanceDashboard />
        </div>
      )}

      {currentPage === 'system-config' && (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2">Configuration du Système de Scoring</h1>
            <p className="text-muted-foreground">
              Gérez les 4 composants du système : IA, Règles, Aléatoire et Non-supervisé
            </p>
          </div>
          <SystemConfiguration />
        </div>
      )}

      {currentPage === 'rules' && (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2">Gestion des Règles Métier</h1>
            <p className="text-muted-foreground">
              Système expert de détection basé sur des règles conditionnelles IF-THEN-OR
            </p>
          </div>
          <RulesManager />
        </div>
      )}

      {currentPage === 'offices' && (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2">Bureaux de Douane</h1>
            <p className="text-muted-foreground">
              Gestion de la charge de travail et des capacités par bureau douanier
            </p>
          </div>
          <CustomsOfficeLoad />
        </div>
      )}

      {currentPage === 'data-analysis' && (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2">Analyse des Données & Optimisation IA</h1>
            <p className="text-muted-foreground">
              Exploration des données, détection non-supervisée, génération de règles par IA et optimisation automatique
            </p>
          </div>
          <Tabs defaultValue="exploration" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="exploration">📊 Exploration Données</TabsTrigger>
              <TabsTrigger value="unsupervised">🎯 Détection Non-supervisée</TabsTrigger>
              <TabsTrigger value="ai-assistant">✨ Assistant IA</TabsTrigger>
              <TabsTrigger value="pruning">✂️ Pruning Automatique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exploration">
              <DataExplorationModule />
            </TabsContent>
            
            <TabsContent value="unsupervised">
              <UnsupervisedDetection />
            </TabsContent>
            
            <TabsContent value="ai-assistant">
              <AIRuleAssistant />
            </TabsContent>
            
            <TabsContent value="pruning">
              <RulePruningModule />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}