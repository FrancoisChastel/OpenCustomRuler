import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Filter, Download, RefreshCw, TrendingUp, AlertTriangle, Search, Database } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';

// Données mockées pour l'exploration
const mockDeclarationData = [
  { id: 'DCL001', pays: 'Chine', valeur: 45000, code_sh: '8517', operateur: 'OPR123', risque_score: 72, circuit: 'R', anomalie: true },
  { id: 'DCL002', pays: 'France', valeur: 12000, code_sh: '6203', operateur: 'OPR045', risque_score: 23, circuit: 'V', anomalie: false },
  { id: 'DCL003', pays: 'Turquie', valeur: 89000, code_sh: '8517', operateur: 'OPR167', risque_score: 85, circuit: 'R', anomalie: true },
  { id: 'DCL004', pays: 'Allemagne', valeur: 34000, code_sh: '8703', operateur: 'OPR089', risque_score: 15, circuit: 'V', anomalie: false },
  { id: 'DCL005', pays: 'Chine', valeur: 156000, code_sh: '8517', operateur: 'OPR123', risque_score: 91, circuit: 'R', anomalie: true },
  { id: 'DCL006', pays: 'Italie', valeur: 23000, code_sh: '6110', operateur: 'OPR201', risque_score: 38, circuit: 'J', anomalie: false },
  { id: 'DCL007', pays: 'EAU', valeur: 67000, code_sh: '7113', operateur: 'OPR145', risque_score: 68, circuit: 'R', anomalie: true },
  { id: 'DCL008', pays: 'Espagne', valeur: 19000, code_sh: '2204', operateur: 'OPR078', risque_score: 12, circuit: 'V', anomalie: false },
];

const distributionParPays = [
  { pays: 'Chine', count: 847, valeur_moyenne: 52000, taux_anomalie: 0.34 },
  { pays: 'France', count: 523, valeur_moyenne: 23000, taux_anomalie: 0.08 },
  { pays: 'Turquie', count: 412, valeur_moyenne: 45000, taux_anomalie: 0.28 },
  { pays: 'Allemagne', count: 389, valeur_moyenne: 31000, taux_anomalie: 0.06 },
  { pays: 'EAU', count: 234, valeur_moyenne: 67000, taux_anomalie: 0.41 },
  { pays: 'Italie', count: 198, valeur_moyenne: 28000, taux_anomalie: 0.11 },
];

const distributionParValeur = [
  { range: '0-10k', count: 1234, anomalies: 45 },
  { range: '10k-25k', count: 987, anomalies: 89 },
  { range: '25k-50k', count: 654, anomalies: 156 },
  { range: '50k-100k', count: 423, anomalies: 198 },
  { range: '100k+', count: 287, anomalies: 234 },
];

const anomaliesDetectees = [
  { type: 'Valeur sous-évaluée', count: 342, severite: 'high' },
  { type: 'Opérateur à risque', count: 267, severite: 'high' },
  { type: 'Code SH incohérent', count: 189, severite: 'medium' },
  { type: 'Pays à risque', count: 156, severite: 'high' },
  { type: 'Volume inhabituel', count: 123, severite: 'medium' },
  { type: 'Fréquence élevée', count: 98, severite: 'low' },
];

const correlationData = [
  { x: 'valeur', y: 'risque_score', correlation: 0.72 },
  { x: 'operateur_historique', y: 'risque_score', correlation: -0.58 },
  { x: 'pays_risque', y: 'risque_score', correlation: 0.64 },
  { x: 'delai_depot', y: 'risque_score', correlation: 0.41 },
];

export function DataExplorationModule() {
  const [selectedPeriod, setSelectedPeriod] = useState('30j');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [valueRange, setValueRange] = useState([0, 200000]);
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = () => {
    toast.success('Données exportées (voir console)');
    console.log('Export:', { selectedPeriod, selectedCountries, valueRange });
  };

  const handleRefresh = () => {
    toast.success('Données actualisées');
  };

  const filteredData = mockDeclarationData.filter(item => {
    if (showAnomaliesOnly && !item.anomalie) return false;
    if (selectedCountries.length > 0 && !selectedCountries.includes(item.pays)) return false;
    if (item.valeur < valueRange[0] || item.valeur > valueRange[1]) return false;
    if (searchTerm && !item.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* En-tête et Filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Exploration des Données Douanières
              </CardTitle>
              <CardDescription>
                Analysez et visualisez les patterns dans vos données pour identifier des opportunités de règles
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Période</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7j">7 derniers jours</SelectItem>
                  <SelectItem value="30j">30 derniers jours</SelectItem>
                  <SelectItem value="90j">90 derniers jours</SelectItem>
                  <SelectItem value="1an">1 an</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ID déclaration..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="col-span-2">
              <Label>Plage de valeur (€): {valueRange[0].toLocaleString()} - {valueRange[1].toLocaleString()}</Label>
              <Slider
                value={valueRange}
                onValueChange={setValueRange}
                min={0}
                max={200000}
                step={5000}
                className="mt-2"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="anomalies"
                checked={showAnomaliesOnly}
                onCheckedChange={(checked) => setShowAnomaliesOnly(checked as boolean)}
              />
              <label htmlFor="anomalies" className="text-sm cursor-pointer">
                Anomalies uniquement
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Déclarations</CardDescription>
            <CardTitle className="text-3xl">3,585</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +12.3% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Anomalies Détectées</CardDescription>
            <CardTitle className="text-3xl text-orange-600">722</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              20.1% du total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Valeur Moyenne</CardDescription>
            <CardTitle className="text-3xl">42,340€</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Médiane: 28,500€
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Patterns Détectés</CardDescription>
            <CardTitle className="text-3xl text-blue-600">27</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Prêt pour génération de règles
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualisations */}
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="correlation">Corrélations</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribution par Pays</CardTitle>
                <CardDescription>Volume et taux d'anomalie par pays d'origine</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={distributionParPays}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pays" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill="hsl(var(--primary))" name="Nombre" />
                    <Bar yAxisId="right" dataKey="taux_anomalie" fill="hsl(var(--destructive))" name="Taux anomalie" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution par Valeur</CardTitle>
                <CardDescription>Répartition des déclarations et anomalies par tranche</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={distributionParValeur}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Total" />
                    <Bar dataKey="anomalies" fill="hsl(var(--destructive))" name="Anomalies" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Types d'Anomalies Détectées</CardTitle>
              <CardDescription>Classification automatique des patterns suspects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomaliesDetectees.map((anomalie) => (
                  <div key={anomalie.type} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        anomalie.severite === 'high' ? 'text-red-500' :
                        anomalie.severite === 'medium' ? 'text-orange-500' :
                        'text-yellow-500'
                      }`} />
                      <div>
                        <div className="font-medium">{anomalie.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {anomalie.count} occurrences détectées
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        anomalie.severite === 'high' ? 'destructive' :
                        anomalie.severite === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {anomalie.severite === 'high' ? 'Haute' :
                         anomalie.severite === 'medium' ? 'Moyenne' : 'Faible'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Créer règle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matrice de Corrélation</CardTitle>
              <CardDescription>Corrélations entre variables et score de risque</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correlationData.map((item) => (
                  <div key={`${item.x}-${item.y}`} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {item.x} → {item.y}
                      </span>
                      <Badge variant={Math.abs(item.correlation) > 0.6 ? 'default' : 'secondary'}>
                        {item.correlation > 0 ? '+' : ''}{item.correlation.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${Math.abs(item.correlation) > 0.6 ? 'bg-primary' : 'bg-muted-foreground/50'}`}
                        style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Corrélation forte détectée</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      La valeur déclarée et le score de risque montrent une corrélation de 0.72. 
                      Une règle basée sur la valeur pourrait être efficace.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Données Filtrées ({filteredData.length} déclarations)</CardTitle>
              <CardDescription>Vue détaillée des déclarations selon vos critères</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Code SH</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Circuit</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.id}</TableCell>
                        <TableCell>{item.pays}</TableCell>
                        <TableCell>{item.valeur.toLocaleString()}€</TableCell>
                        <TableCell className="font-mono">{item.code_sh}</TableCell>
                        <TableCell>
                          <Badge variant={item.risque_score > 70 ? 'destructive' : item.risque_score > 40 ? 'default' : 'secondary'}>
                            {item.risque_score}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.circuit === 'R' ? 'destructive' : item.circuit === 'J' ? 'default' : 'secondary'}>
                            {item.circuit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.anomalie && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Anomalie
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
