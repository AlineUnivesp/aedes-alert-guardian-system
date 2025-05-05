import { formatDate } from "@/lib/utils";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User } from "lucide-react";
import type { Report } from "@/types/report.types";

interface ReportDetailProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReportDetail = ({ report, isOpen, onClose }: ReportDetailProps) => {
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{report.title}</DialogTitle>
          <DialogDescription>
            Reported on {formatDate(report.createdAt)}
          </DialogDescription>
        </DialogHeader>

        {report.imageUrl && (
          <div className="relative w-full h-56 sm:h-64 mb-4">
            <img 
              src={report.imageUrl} 
              alt={report.title} 
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-gray-700">{report.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Location</h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm text-gray-700">{report.location.address}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Coordinates: {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {report.userName}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(report.createdAt)}
            </Badge>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetail;
