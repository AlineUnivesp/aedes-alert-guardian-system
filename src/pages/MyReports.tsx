
import { useEffect, useState } from "react";
import { useReports } from "@/contexts/ReportContext";
import { useAuth } from "@/contexts/AuthContext";
import ReportList from "@/components/reports/ReportList";
import ReportDialog from "@/components/reports/ReportDialog";
import UserProgress from "@/components/dashboard/UserProgress";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyReports = () => {
  const { userReports, isLoading } = useReports();
  const { user, isAuthenticated } = useAuth();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="container-content py-16">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-content py-16">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Minhas Denúncias</h1>
            <p className="text-muted-foreground mt-2">Gerencie todas as suas denúncias de focos do Aedes</p>
          </div>
          
          <Button 
            onClick={() => setIsReportDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Denúncia
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ReportList 
                reports={userReports}
                showActions
                emptyMessage="Você ainda não denunciou nenhum foco. Comece a contribuir agora!"
              />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <UserProgress />
          </div>
        </div>
      </div>
      
      <ReportDialog 
        isOpen={isReportDialogOpen} 
        onClose={() => setIsReportDialogOpen(false)} 
      />
    </div>
  );
};

export default MyReports;
