
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/sonner";
import { calculatePoints, getUserTitle } from "@/lib/gamification";

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
  deleteReport: (id: string) => Promise<void>;
  getReport: (id: string) => Report | undefined;
  fetchAllReports: () => Promise<void>;
  exportReports: (format: "json" | "csv") => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

// Mock data for reports
const initialReports: Report[] = [
  {
    id: "1",
    title: "Water container in abandoned lot",
    description: "Found multiple containers collecting rainwater in abandoned construction site",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      address: "Av. Paulista, 1000, São Paulo - SP"
    },
    imageUrl: "https://via.placeholder.com/300x200.png?text=Breeding+Site",
    createdAt: "2025-04-28T15:30:45Z",
    userId: "1",
    userName: "Demo User"
  },
  {
    id: "2",
    title: "Clogged gutter",
    description: "Clogged rain gutter with standing water on residential building",
    location: {
      latitude: -23.5605,
      longitude: -46.6433,
      address: "Rua Augusta, 500, São Paulo - SP"
    },
    createdAt: "2025-04-27T10:15:30Z",
    userId: "1",
    userName: "Demo User"
  },
  {
    id: "3",
    title: "Discarded tires collecting water",
    description: "Several old tires collecting rainwater behind auto repair shop",
    location: {
      latitude: -23.5305,
      longitude: -46.6233,
      address: "Av. Rebouças, 750, São Paulo - SP"
    },
    imageUrl: "https://via.placeholder.com/300x200.png?text=Tire+Breeding+Site",
    createdAt: "2025-04-26T08:45:20Z",
    userId: "1",
    userName: "Demo User"
  }
];

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Filter reports for the current user
  const userReports = reports.filter(report => report.userId === user?.id);

  useEffect(() => {
    // Load reports from localStorage if available
    const savedReports = localStorage.getItem("reports");
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
    setIsLoading(false);
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("reports", JSON.stringify(reports));
  }, [reports]);

  const fetchAllReports = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll just use our state since it's already loaded
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
      return reports;
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to load reports");
      setIsLoading(false);
      throw error;
    }
  };

  const addReport = async (reportData: Omit<Report, "id" | "createdAt" | "userId" | "userName">) => {
    if (!user) {
      toast.error("You must be logged in to report a breeding site");
      throw new Error("User not authenticated");
    }
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReport: Report = {
        ...reportData,
        id: (reports.length + 1).toString(),
        createdAt: new Date().toISOString(),
        userId: user.id,
        userName: user.name
      };
      
      setReports(prevReports => [...prevReports, newReport]);
      
      // Update user points
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const newPoints = userData.points + 1;
      
      // Calculate bonus points
      const bonusPoints = calculatePoints(newPoints) - newPoints;
      const totalNewPoints = newPoints + bonusPoints;
      
      // Update localStorage
      userData.points = totalNewPoints;
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Show success message
      if (bonusPoints > 0) {
        toast.success(`Report added! +1 point. Bonus: +${bonusPoints} points!`);
      } else {
        toast.success("Report added successfully! +1 point");
      }
      
      // If user object is from context, we need to update it there
      if (user && "points" in user) {
        // @ts-ignore - This is a hack for our demo
        user.points = totalNewPoints;
      }
      
    } catch (error) {
      toast.error("Failed to add report: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a report");
      throw new Error("User not authenticated");
    }
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if report exists and belongs to user
      const reportToDelete = reports.find(r => r.id === id);
      
      if (!reportToDelete) {
        throw new Error("Report not found");
      }
      
      if (reportToDelete.userId !== user.id) {
        throw new Error("You can only delete your own reports");
      }
      
      setReports(prevReports => prevReports.filter(report => report.id !== id));
      toast.success("Report deleted successfully");
    } catch (error) {
      toast.error("Failed to delete report: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getReport = (id: string) => {
    return reports.find(report => report.id === id);
  };

  const exportReports = (format: "json" | "csv") => {
    // Strip out user data for public exports
    const publicReports = reports.map(({ userId, userName, ...report }) => ({
      ...report,
      // Include everything except user data
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
      const headers = "id,title,description,latitude,longitude,address,imageUrl,createdAt\n";
      const rows = publicReports.map(r => 
        `${r.id},"${r.title}","${r.description}",${r.location.latitude},${r.location.longitude},"${r.location.address}","${r.imageUrl || ""}","${r.createdAt}"`
      ).join("\n");
      content = headers + rows;
      filename = `aedes-reports-${new Date().toISOString().split('T')[0]}.csv`;
      type = "text/csv";
    }

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
    
    toast.success(`Reports exported as ${format.toUpperCase()}`);
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
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};
