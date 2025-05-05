
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

export interface ReportContextType {
  reports: Report[];
  userReports: Report[];
  isLoading: boolean;
  addReport: (report: Omit<Report, "id" | "createdAt" | "userId" | "userName">) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReport: (id: string) => Report | undefined;
  fetchAllReports: () => Promise<void>;
  exportReports: (format: "json" | "csv") => void;
}
