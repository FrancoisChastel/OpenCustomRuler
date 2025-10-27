import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Download, RefreshCw } from "lucide-react";
import { ModelVersion, TimeWindow, HealthStatus } from "../types/dashboard";

interface DashboardHeaderProps {
  selectedVersion: ModelVersion;
  onVersionChange: (version: ModelVersion) => void;
  selectedWindow: TimeWindow;
  onWindowChange: (window: TimeWindow) => void;
  healthStatus: HealthStatus;
  driftLevel: string;
  latency: number;
  uptime: number;
  onExport: () => void;
  onRefresh: () => void;
}

export function DashboardHeader({
  selectedVersion,
  onVersionChange,
  selectedWindow,
  onWindowChange,
  healthStatus,
  driftLevel,
  latency,
  uptime,
  onExport,
  onRefresh
}: DashboardHeaderProps) {
  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Suivi Modèle d'Analyse de Risque</h1>
          <p className="text-muted-foreground">Surveillance et optimisation du système de scoring douanier</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Version Modèle:</label>
            <Select value={selectedVersion} onValueChange={onVersionChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="champion">Champion</SelectItem>
                <SelectItem value="challenger">Challenger</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Période:</label>
            <Select value={selectedWindow} onValueChange={onWindowChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7j">7 jours</SelectItem>
                <SelectItem value="30j">30 jours</SelectItem>
                <SelectItem value="90j">90 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Segment:</label>
            <Select defaultValue="tous">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous ports</SelectItem>
                <SelectItem value="dakar">Port Autonome Dakar</SelectItem>
                <SelectItem value="ziguinchor">Port de Ziguinchor</SelectItem>
                <SelectItem value="aeroport">Aéroport LSS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Santé:</span>
            <Badge variant={healthStatus === 'OK' ? 'default' : 'destructive'}>
              {healthStatus}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Drift:</span>
            <Badge variant={driftLevel === 'faible' ? 'default' : driftLevel === 'moyen' ? 'secondary' : 'destructive'}>
              {driftLevel}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Latence P95:</span>
            <Badge variant="outline">{latency}ms</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Uptime:</span>
            <Badge variant="outline">{(uptime * 100).toFixed(2)}%</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}