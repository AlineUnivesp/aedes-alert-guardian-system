import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/sonner";
import { calculatePoints, getUserTitle } from "@/lib/gamification";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export type Report = {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  imageUrl?: string;
  createdAt: string;
  userId: string;
  userName: string;
};

interface ReportContextType {
  reports: Report[];
  userReports: Report[];
  isLoading: boolean;
  addReport: (report: Omit<Report, "id" | "createdAt" | "userId" | "userName">) => Promise<void>;
  updateReport: (id: string, report: Omit<Report, "id" | "createdAt" | "userId" | "userName">) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReport: (id: string) => Report | undefined;
  fetchAllReports: () => Promise<void>;
  exportReports: (format: "json" | "csv") => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Filtrar relatórios do usuário atual
  const userReports = reports.filter(report => report.userId === user?.id);

  // Carregar todos os relatórios ao iniciar
  useEffect(() => {
    fetchAllReports();
  }, []);

  // Converter dados do Supabase para o formato Report
  const mapDbReportToReport = async (dbReport: any): Promise<Report> => {
    // Buscar informações do usuário que criou o relatório
    let userName = "Usuário";
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", dbReport.user_id)
        .single();
      
      if (!profileError && profileData) {
        userName = profileData.name;
      }
    } catch (error) {
      console.error("Erro ao buscar nome do usuário:", error);
    }

    return {
      id: dbReport.id,
      title: dbReport.title,
      description: dbReport.description,
      location: {
        latitude: dbReport.latitude,
        longitude: dbReport.longitude,
        address: dbReport.address,
      },
      imageUrl: dbReport.image_url,
      createdAt: dbReport.created_at,
      userId: dbReport.user_id,
      userName: userName,
    };
  };

  const fetchAllReports = async () => {
    setIsLoading(true);
    try {
      const { data: dbReports, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (dbReports) {
        const reportPromises = dbReports.map(mapDbReportToReport);
        const mappedReports = await Promise.all(reportPromises);
        setReports(mappedReports);
      }
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
      let imageUrl = reportData.imageUrl;
      
      // Se houver uma imagem, fazer upload para o Storage
      if (imageUrl && imageUrl.startsWith('data:image')) {
        const fileExt = imageUrl.split(';')[0].split('/')[1];
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Converter base64 para formato aceito pelo Supabase
        const base64Data = imageUrl.split(',')[1];
        
        // Realizar o upload direto com a string base64
        const { data: storageData, error: storageError } = await supabase.storage
          .from('reports')
          .upload(filePath, decode(base64Data), {
            contentType: `image/${fileExt}`,
            upsert: true
          });
          
        if (storageError) {
          throw storageError;
        }
        
        // Obter URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('reports')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      // Salvar relatório no banco de dados
      const { data, error } = await supabase
        .from("reports")
        .insert({
          title: reportData.title,
          description: reportData.description,
          latitude: reportData.location.latitude,
          longitude: reportData.location.longitude,
          address: reportData.location.address,
          image_url: imageUrl,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error("Erro ao criar denúncia");
      }
      
      // Atualizar pontos do usuário
      if (user.id) {
        const newPoints = user.points + 1;
        const bonusPoints = calculatePoints(newPoints) - newPoints;
        const totalNewPoints = newPoints + bonusPoints;
        
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ points: totalNewPoints })
          .eq("id", user.id);
          
        if (updateError) {
          console.error("Erro ao atualizar pontos:", updateError);
        } else {
          // Atualizar usuário local
          if (user) {
            user.points = totalNewPoints;
          }
          
          // Mostrar mensagem de sucesso
          if (bonusPoints > 0) {
            toast.success(`Denúncia adicionada! +1 ponto. Bônus: +${bonusPoints} pontos!`);
          } else {
            toast.success("Denúncia adicionada com sucesso! +1 ponto");
          }
        }
      }
      
      // Recarregar relatórios para atualizar a lista
      await fetchAllReports();
      
    } catch (error: any) {
      toast.error("Erro ao adicionar denúncia: " + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para decodificar strings base64 para Blob
  const decode = (base64: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: 'application/octet-stream' });
  };

  const updateReport = async (id: string, reportData: Omit<Report, "id" | "createdAt" | "userId" | "userName">) => {
    if (!user) {
      toast.error("Você precisa estar logado para atualizar uma denúncia");
      throw new Error("Usuário não autenticado");
    }
    
    setIsLoading(true);
    try {
      // Verificar se o relatório existe e pertence ao usuário
      const report = reports.find(r => r.id === id);
      
      if (!report) {
        throw new Error("Denúncia não encontrada");
      }
      
      if (report.userId !== user.id) {
        throw new Error("Você só pode editar suas próprias denúncias");
      }
      
      let imageUrl = reportData.imageUrl;
      
      // Se houver uma nova imagem, fazer upload para o Storage
      if (imageUrl && imageUrl.startsWith('data:image')) {
        const fileExt = imageUrl.split(';')[0].split('/')[1];
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Converter base64 para formato aceito pelo Supabase
        const base64Data = imageUrl.split(',')[1];
        
        // Realizar o upload direto com a string base64
        const { data: storageData, error: storageError } = await supabase.storage
          .from('reports')
          .upload(filePath, decode(base64Data), {
            contentType: `image/${fileExt}`,
            upsert: true
          });
          
        if (storageError) {
          throw storageError;
        }
        
        // Obter URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('reports')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
        
        // Se havia uma imagem anterior, excluir do Storage
        if (report.imageUrl && report.imageUrl !== imageUrl) {
          try {
            const urlParts = report.imageUrl.split('/');
            const oldFileName = urlParts[urlParts.length - 1];
            const oldFilePath = `${user.id}/${oldFileName}`;
            
            await supabase.storage
              .from('reports')
              .remove([oldFilePath]);
          } catch (storageError) {
            console.error("Erro ao excluir imagem anterior:", storageError);
          }
        }
      }
      
      // Atualizar relatório no banco de dados
      const { data, error } = await supabase
        .from("reports")
        .update({
          title: reportData.title,
          description: reportData.description,
          latitude: reportData.location.latitude,
          longitude: reportData.location.longitude,
          address: reportData.location.address,
          image_url: imageUrl || report.imageUrl,
        })
        .eq("id", id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Recarregar relatórios para atualizar a lista
      await fetchAllReports();
      
    } catch (error: any) {
      toast.error("Erro ao atualizar denúncia: " + error.message);
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
      // Verificar se o relatório existe e pertence ao usuário
      const report = reports.find(r => r.id === id);
      
      if (!report) {
        throw new Error("Denúncia não encontrada");
      }
      
      if (report.userId !== user.id) {
        throw new Error("Você só pode excluir suas próprias denúncias");
      }
      
      // Se houver imagem, excluir do Storage
      if (report.imageUrl) {
        try {
          const urlParts = report.imageUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const filePath = `${user.id}/${fileName}`;
          
          await supabase.storage
            .from('reports')
            .remove([filePath]);
        } catch (storageError) {
          console.error("Erro ao excluir imagem:", storageError);
        }
      }
      
      // Excluir relatório do banco de dados
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar estado local
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
    // Remover dados de usuário para exportações públicas
    const publicReports = reports.map(({ userId, userName, ...report }) => ({
      ...report,
    }));

    let content: string;
    let filename: string;
    let type: string;

    if (format === "json") {
      content = JSON.stringify(publicReports, null, 2);
      filename = `aedes-reports-${new Date().toISOString().split('T')[0]}.json`;
      type = "application/json";
    } else {
      // Converter para CSV
      const headers = "id,titulo,descricao,latitude,longitude,endereco,imagem,data_criacao\n";
      const rows = publicReports.map(r => 
        `${r.id},"${r.title}","${r.description}",${r.location.latitude},${r.location.longitude},"${r.location.address}","${r.imageUrl || ""}","${r.createdAt}"`
      ).join("\n");
      content = headers + rows;
      filename = `aedes-reports-${new Date().toISOString().split('T')[0]}.csv`;
      type = "text/csv";
    }

    // Criar e acionar download
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
      updateReport,
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
