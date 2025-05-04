
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

  // Redirect if not authenticated
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
            <h1 className="text-3xl font-bold">My Reports</h1>
            <p className="text-muted-foreground mt-2">Manage all your Aedes breeding site reports</p>
          </div>
          
          <Button 
            onClick={() => setIsReportDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Report
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
                emptyMessage="You haven't reported any breeding sites yet. Start contributing now!"
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
