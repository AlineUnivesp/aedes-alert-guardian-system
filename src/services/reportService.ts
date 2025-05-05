
import { supabase } from "@/integrations/supabase/client";
import { Report } from "@/types/report.types";
import { v4 as uuidv4 } from "uuid";

// Convert database report to Report type
export const mapDbReportToReport = async (dbReport: any): Promise<Report> => {
  // Fetch user profile information
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", dbReport.user_id)
    .single();
  
  if (profileError) {
    console.error("Erro ao buscar nome do usuário:", profileError);
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
    userName: profileData?.name || "Usuário",
  };
};

// Fetch all reports from the database
export const fetchReports = async (): Promise<Report[]> => {
  const { data: dbReports, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  if (!dbReports) {
    return [];
  }

  const reportPromises = dbReports.map(mapDbReportToReport);
  return await Promise.all(reportPromises);
};

// Upload image to Supabase storage
export const uploadReportImage = async (
  imageUrl: string,
  userId: string
): Promise<string | undefined> => {
  if (!imageUrl || !imageUrl.startsWith('data:image')) {
    return imageUrl;
  }

  const fileExt = imageUrl.split(';')[0].split('/')[1];
  const fileName = `${userId}/${uuidv4()}.${fileExt}`;
  const filePath = `${fileName}`;
  
  // Convert base64 to Blob (browser compatible)
  const fetchResponse = await fetch(imageUrl);
  const blob = await fetchResponse.blob();
  
  // Upload image using Blob
  const { data: storageData, error: storageError } = await supabase.storage
    .from('reports')
    .upload(filePath, blob, {
      contentType: `image/${fileExt}`,
      upsert: true
    });
    
  if (storageError) {
    throw storageError;
  }
  
  // Get public URL of the image
  const { data: { publicUrl } } = supabase.storage
    .from('reports')
    .getPublicUrl(filePath);
    
  return publicUrl;
};

// Create a new report
export const createReport = async (
  reportData: {
    title: string;
    description: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    imageUrl?: string;
  },
  userId: string
): Promise<any> => {
  // Process and upload image if needed
  let imageUrl = reportData.imageUrl;
  if (imageUrl && imageUrl.startsWith('data:image')) {
    imageUrl = await uploadReportImage(imageUrl, userId);
  }
  
  // Save report to database
  const { data, error } = await supabase
    .from("reports")
    .insert({
      title: reportData.title,
      description: reportData.description,
      latitude: reportData.location.latitude,
      longitude: reportData.location.longitude,
      address: reportData.location.address,
      image_url: imageUrl,
      user_id: userId
    })
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Delete a report
export const deleteReportById = async (reportId: string, userId: string): Promise<void> => {
  // Fetch report details to get image information
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .eq("user_id", userId)
    .single();
    
  if (fetchError) {
    throw fetchError;
  }
  
  // Delete image if it exists
  if (report?.image_url) {
    try {
      const urlParts = report.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${userId}/${fileName}`;
      
      await supabase.storage
        .from('reports')
        .remove([filePath]);
    } catch (storageError) {
      console.error("Erro ao excluir imagem:", storageError);
    }
  }
  
  // Delete report from database
  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", reportId);
    
  if (error) {
    throw error;
  }
};

// Update user points
export const updateUserPoints = async (userId: string, pointsToAdd: number, currentPoints: number): Promise<number> => {
  const newPoints = currentPoints + pointsToAdd;
  
  const { error } = await supabase
    .from("profiles")
    .update({ points: newPoints })
    .eq("id", userId);
    
  if (error) {
    throw error;
  }
  
  return newPoints;
};

// Generate export formats
export const generateExportData = (reports: Report[], format: "json" | "csv"): { content: string, filename: string, type: string } => {
  // Remove user data for privacy
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
    // Convert to CSV
    const headers = "id,titulo,descricao,latitude,longitude,endereco,imagem,data_criacao\n";
    const rows = publicReports.map(r => 
      `${r.id},"${r.title}","${r.description}",${r.location.latitude},${r.location.longitude},"${r.location.address}","${r.imageUrl || ""}","${r.createdAt}"`
    ).join("\n");
    content = headers + rows;
    filename = `aedes-reports-${new Date().toISOString().split('T')[0]}.csv`;
    type = "text/csv";
  }

  return { content, filename, type };
};
