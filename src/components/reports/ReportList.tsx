
import { useState } from "react";
import { Report } from "@/contexts/ReportContext";
import ReportCard from "./ReportCard";
import ReportDetail from "./ReportDetail";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ReportListProps {
  reports: Report[];
  showActions?: boolean;
  emptyMessage?: string;
}

const ReportList = ({ 
  reports, 
  showActions = false,
  emptyMessage = "No reports found" 
}: ReportListProps) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  };

  const filteredReports = searchTerm 
    ? reports.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : reports;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search reports..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredReports.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              showActions={showActions}
              onClick={() => handleReportClick(report)}
            />
          ))}
        </div>
      )}
      
      <ReportDetail
        report={selectedReport}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default ReportList;
