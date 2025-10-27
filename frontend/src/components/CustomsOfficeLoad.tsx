import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Edit, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CustomsOffice } from '../types/rules';
import { toast } from 'sonner@2.0.3';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const mockOffices: CustomsOffice[] = [
  {
    id: '1',
    code: 'FR-CDG',
    name: 'Roissy Charles-de-Gaulle',
    location: 'Île-de-France',
    capacity: { daily: 500, weekly: 3500, monthly: 15000 },
    currentLoad: { daily: 465, weekly: 3255, monthly: 13980 },
    staffCount: 42,
    specializations: ['Fret aérien', 'Express', 'Produits sensibles'],
    status: 'operational'
  },
  {
    id: '2',
    code: 'FR-ORY',
    name: 'Orly',
    location: 'Île-de-France',
    capacity: { daily: 200, weekly: 1400, monthly: 6000 },
    currentLoad: { daily: 185, weekly: 1295, monthly: 5550 },
    staffCount: 18,
    specializations: ['Fret aérien', 'Bagages'],
    status: 'operational'
  },
  {
    id: '3',
    code: 'FR-MRS',
    name: 'Marseille-Fos',
    location: 'Provence-Alpes-Côte d\'Azur',
    capacity: { daily: 800, weekly: 5600, monthly: 24000 },
    currentLoad: { daily: 856, weekly: 5992, monthly: 25704 },
    staffCount: 65,
    specializations: ['Fret maritime', 'Conteneurs', 'Vrac'],
    status: 'overloaded'
  },
  {
    id: '4',
    code: 'FR-LYS',
    name: 'Lyon Saint-Exupéry',
    location: 'Auvergne-Rhône-Alpes',
    capacity: { daily: 150, weekly: 1050, monthly: 4500 },
    currentLoad: { daily: 142, weekly: 994, monthly: 4266 },
    staffCount: 15,
    specializations: ['Fret aérien', 'Logistique'],
    status: 'operational'
  },
  {
    id: '5',
    code: 'FR-HAV',
    name: 'Le Havre',
    location: 'Normandie',
    capacity: { daily: 600, weekly: 4200, monthly: 18000 },
    currentLoad: { daily: 483, weekly: 3381, monthly: 14508 },
    staffCount: 52,
    specializations: ['Fret maritime', 'Conteneurs', 'Roulier'],
    status: 'operational'
  },
  {
    id: '6',
    code: 'FR-BOD',
    name: 'Bordeaux',
    location: 'Nouvelle-Aquitaine',
    capacity: { daily: 120, weekly: 840, monthly: 3600 },
    currentLoad: { daily: 132, weekly: 924, monthly: 3960 },
    staffCount: 12,
    specializations: ['Fret mixte', 'Vins et alcools'],
    status: 'limited'
  }
];

export function CustomsOfficeLoad() {
  const [offices, setOffices] = useState<CustomsOffice[]>(mockOffices);
  const [selectedOffice, setSelectedOffice] = useState<CustomsOffice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusInfo = (office: CustomsOffice) => {
    const loadRate = (office.currentLoad.monthly / office.capacity.monthly) * 100;
    
    if (loadRate >= 100) {
      return {
        status: 'overloaded',
        label: 'Surchargé',
        color: 'bg-red-500',
        textColor: 'text-red-700',
        bgColor: 'bg-red-500/10',
        icon: AlertTriangle
      };
    } else if (loadRate >= 90) {
      return {
        status: 'limited',
        label: 'Capacité limitée',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-700',
        bgColor: 'bg-yellow-500/10',
        icon: TrendingUp
      };
    } else {
      return {
        status: 'operational',
        label: 'Opérationnel',
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgColor: 'bg-green-500/10',
        icon: Minus
      };
    }
  };

  const handleEditOffice = (office: CustomsOffice) => {
    setSelectedOffice({ ...office });
    setIsDialogOpen(true);
  };

  const handleSaveOffice = () => {
    if (!selectedOffice) return;
    
    setOffices(offices.map(o => o.id === selectedOffice.id ? selectedOffice : o));
    toast.success('Bureau mis à jour');
    setIsDialogOpen(false);
    setSelectedOffice(null);
  };

  const chartData = offices.map(office => {
    const loadRate = (office.currentLoad.monthly / office.capacity.monthly) * 100;
    return {
      name: office.code,
      'Charge actuelle': office.currentLoad.monthly,
      'Capacité': office.capacity.monthly,
      'Taux': loadRate
    };
  });

  const getBarColor = (value: number, capacity: number) => {
    const rate = (value / capacity) * 100;
    if (rate >= 100) return '#ef4444';
    if (rate >= 90) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Bureaux opérationnels</div>
            <div className="text-2xl mb-2">
              {offices.filter(o => o.status === 'operational').length}
              <span className="text-sm text-muted-foreground ml-2">/ {offices.length}</span>
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 border">
              {((offices.filter(o => o.status === 'operational').length / offices.length) * 100).toFixed(0)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Charge moyenne</div>
            <div className="text-2xl mb-2">
              {(offices.reduce((sum, o) => sum + (o.currentLoad.monthly / o.capacity.monthly), 0) / offices.length * 100).toFixed(1)}%
            </div>
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20 border">
              Mensuelle
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Effectifs totaux</div>
            <div className="text-2xl mb-2">
              {offices.reduce((sum, o) => sum + o.staffCount, 0)}
            </div>
            <Badge className="bg-purple-500/10 text-purple-700 border-purple-500/20 border">
              Agents
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de charge */}
      <Card>
        <CardHeader>
          <CardTitle>Charge mensuelle par bureau</CardTitle>
          <CardDescription>Comparaison charge actuelle vs capacité maximale</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Capacité" fill="#94a3b8" />
              <Bar dataKey="Charge actuelle">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry['Charge actuelle'], entry['Capacité'])} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Liste des bureaux */}
      <Card>
        <CardHeader>
          <CardTitle>Bureaux de douane ({offices.length})</CardTitle>
          <CardDescription>Gestion de la capacité et de la charge de travail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offices.map((office) => {
              const statusInfo = getStatusInfo(office);
              const dailyRate = (office.currentLoad.daily / office.capacity.daily) * 100;
              const weeklyRate = (office.currentLoad.weekly / office.capacity.weekly) * 100;
              const monthlyRate = (office.currentLoad.monthly / office.capacity.monthly) * 100;
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={office.id} className="border-l-4" style={{ borderLeftColor: statusInfo.color.replace('bg-', '') }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4>{office.name}</h4>
                          <Badge variant="outline" className="font-mono">{office.code}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{office.location}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`${statusInfo.bgColor} ${statusInfo.textColor} border-0`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline">
                            {office.staffCount} agents
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOffice(office)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* Charge journalière */}
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="text-muted-foreground">Charge journalière</span>
                          <span>
                            {office.currentLoad.daily.toLocaleString()} / {office.capacity.daily.toLocaleString()}
                            <span className="ml-2 font-medium">{dailyRate.toFixed(1)}%</span>
                          </span>
                        </div>
                        <Progress value={Math.min(dailyRate, 100)} className="h-2" />
                      </div>

                      {/* Charge hebdomadaire */}
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="text-muted-foreground">Charge hebdomadaire</span>
                          <span>
                            {office.currentLoad.weekly.toLocaleString()} / {office.capacity.weekly.toLocaleString()}
                            <span className="ml-2 font-medium">{weeklyRate.toFixed(1)}%</span>
                          </span>
                        </div>
                        <Progress value={Math.min(weeklyRate, 100)} className="h-2" />
                      </div>

                      {/* Charge mensuelle */}
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="text-muted-foreground">Charge mensuelle</span>
                          <span>
                            {office.currentLoad.monthly.toLocaleString()} / {office.capacity.monthly.toLocaleString()}
                            <span className="ml-2 font-medium">{monthlyRate.toFixed(1)}%</span>
                          </span>
                        </div>
                        <Progress value={Math.min(monthlyRate, 100)} className="h-2" />
                      </div>

                      {/* Spécialisations */}
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm text-muted-foreground">Spécialisations:</span>
                        <div className="flex gap-1 flex-wrap">
                          {office.specializations.map((spec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour éditer un bureau */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le bureau de douane</DialogTitle>
            <DialogDescription>
              Ajustez les capacités et les effectifs du bureau
            </DialogDescription>
          </DialogHeader>

          {selectedOffice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code bureau</Label>
                  <Input
                    value={selectedOffice.code}
                    onChange={(e) => setSelectedOffice({ ...selectedOffice, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={selectedOffice.name}
                    onChange={(e) => setSelectedOffice({ ...selectedOffice, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <Input
                    value={selectedOffice.location}
                    onChange={(e) => setSelectedOffice({ ...selectedOffice, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Effectifs (agents)</Label>
                  <Input
                    type="number"
                    value={selectedOffice.staffCount}
                    onChange={(e) => setSelectedOffice({ ...selectedOffice, staffCount: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Capacité de traitement</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Journalière</Label>
                    <Input
                      type="number"
                      value={selectedOffice.capacity.daily}
                      onChange={(e) => setSelectedOffice({
                        ...selectedOffice,
                        capacity: { ...selectedOffice.capacity, daily: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Hebdomadaire</Label>
                    <Input
                      type="number"
                      value={selectedOffice.capacity.weekly}
                      onChange={(e) => setSelectedOffice({
                        ...selectedOffice,
                        capacity: { ...selectedOffice.capacity, weekly: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Mensuelle</Label>
                    <Input
                      type="number"
                      value={selectedOffice.capacity.monthly}
                      onChange={(e) => setSelectedOffice({
                        ...selectedOffice,
                        capacity: { ...selectedOffice.capacity, monthly: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Charge actuelle</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Journalière</Label>
                    <Input
                      type="number"
                      value={selectedOffice.currentLoad.daily}
                      onChange={(e) => setSelectedOffice({
                        ...selectedOffice,
                        currentLoad: { ...selectedOffice.currentLoad, daily: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Hebdomadaire</Label>
                    <Input
                      type="number"
                      value={selectedOffice.currentLoad.weekly}
                      onChange={(e) => setSelectedOffice({
                        ...selectedOffice,
                        currentLoad: { ...selectedOffice.currentLoad, weekly: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Mensuelle</Label>
                    <Input
                      type="number"
                      value={selectedOffice.currentLoad.monthly}
                      onChange={(e) => setSelectedOffice({
                        ...selectedOffice,
                        currentLoad: { ...selectedOffice.currentLoad, monthly: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveOffice}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
