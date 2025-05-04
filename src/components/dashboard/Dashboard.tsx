
import { useEffect, useState } from "react";
import { useReports } from "@/contexts/ReportContext";
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "./StatCard";
import UserProgress from "./UserProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportList from "../reports/ReportList";
import MapView from "../reports/MapView";
import ReportDialog from "../reports/ReportDialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Plus, ListChecks } from "lucide-react";

const Dashboard = () => {
  const { reports, isLoading } = useReports();
  const { isAuthenticated } = useAuth();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  const totalReports = reports.length;
  const recentReports = reports.filter(report => {
    const reportDate = new Date(report.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reportDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Painel</h2>
        
        <Button 
          onClick={() => setIsReportDialogOpen(true)}
          className="gap-2"
          disabled={!isAuthenticated}
        >
          <Plus className="h-4 w-4" />
          Denunciar Foco
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          title="Total de Denúncias"
          value={totalReports}
          description="Desde o início"
          icon={<ListChecks className="h-4 w-4" />}
        />
        <StatCard 
          title="Denúncias Recentes"
          value={recentReports}
          description="Últimos 30 dias"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard 
          title="Localizações"
          value={reports.length}
          description="Áreas monitoradas"
          icon={<MapPin className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="map">
            <TabsList className="grid grid-cols-2 w-[200px] mb-4">
              <TabsTrigger value="map">Mapa</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="h-[500px]">
              <MapView reports={reports} />
            </TabsContent>
            <TabsContent value="list">
              <ReportList 
                reports={reports}
                emptyMessage="Ainda não há denúncias de focos. Seja o primeiro a reportar!"
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <UserProgress />
        </div>
      </div>
      
      <ReportDialog 
        isOpen={isReportDialogOpen} 
        onClose={() => setIsReportDialogOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
