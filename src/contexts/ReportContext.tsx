
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/sonner";
import { Report, ReportContextType } from "@/types/report.types";
import { usePoints } from "@/hooks/usePoints";
import { 
  fetchReports, 
  createReport, 
  deleteReportById, 
  generateExportData 
} from "@/services/reportService";

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { updateUserPoints } = usePoints();
  
  // Filter reports for current user
  const userReports = reports.filter(report => report.userId === user?.id);

  // Load all reports on init
  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    setIsLoading(true);
    try {
      const fetchedReports = await fetchReports();
      setReports(fetchedReports);
    } catch (error: any) {
      console.error("Erro ao buscar relatórios:", error);
      toast.error("Erro ao carregar relatórios: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addReport = async (reportData: Omit<Report, "id" | "createdAt" | "userId" | "userName">) => {
    if (!user) {
      toast.error("Você precisa estar logado para denunciar um foco de mosquito");
      throw new Error("Usuário não autenticado");
    }
    
    setIsLoading(true);
    try {
      // Create report in database
      await createReport(reportData, user.id);
      
      // Update user points
      if (user.id) {
        try {
          const { totalNewPoints, bonusPoints } = await updateUserPoints(user.id, user.points);
          
          // Update local user object
          if (user) {
            user.points = totalNewPoints;
          }
          
          // Show success message
          if (bonusPoints > 0) {
            toast.success(`Denúncia adicionada! +1 ponto. Bônus: +${bonusPoints} pontos!`);
          } else {
            toast.success("Denúncia adicionada com sucesso! +1 ponto");
          }
        } catch (pointsError) {
          console.error("Erro ao atualizar pontos:", pointsError);
          toast.success("Denúncia adicionada com sucesso!");
        }
      }
      
      // Reload reports list
      await fetchAllReports();
      
    } catch (error: any) {
      toast.error("Erro ao adicionar denúncia: " + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para excluir uma denúncia");
      throw new Error("Usuário não autenticado");
    }
    
    setIsLoading(true);
    try {
      // Check if report exists and belongs to user
      const report = reports.find(r => r.id === id);
      
      if (!report) {
        throw new Error("Denúncia não encontrada");
      }
      
      if (report.userId !== user.id) {
        throw new Error("Você só pode excluir suas próprias denúncias");
      }
      
      // Delete report
      await deleteReportById(id, user.id);
      
      // Update local state
      setReports(prevReports => prevReports.filter(report => report.id !== id));
      toast.success("Denúncia excluída com sucesso");
    } catch (error: any) {
      toast.error("Erro ao excluir denúncia: " + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getReport = (id: string) => {
    return reports.find(report => report.id === id);
  };

  const exportReports = (format: "json" | "csv") => {
    const { content, filename, type } = generateExportData(reports, format);

    // Create and trigger download
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Relatórios exportados como ${format.toUpperCase()}`);
  };

  return (
    <ReportContext.Provider value={{
      reports,
      userReports,
      isLoading,
      addReport,
      deleteReport,
      getReport,
      fetchAllReports,
      exportReports
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReports deve ser usado dentro de um ReportProvider");
  }
  return context;
};

// Re-export the Report type for convenience
export type { Report } from "@/types/report.types";
