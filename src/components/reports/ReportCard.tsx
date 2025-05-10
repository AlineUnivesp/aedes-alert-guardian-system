
import { formatDate } from "@/lib/utils";
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Trash2, Edit } from "lucide-react";
import type { Report } from "@/contexts/ReportContext";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useReports } from "@/contexts/ReportContext";
import { useAuth } from "@/contexts/AuthContext";
import ReportEditDialog from "./ReportEditDialog";

interface ReportCardProps {
  report: Report;
  showActions?: boolean;
  onClick?: () => void;
}

const ReportCard = ({ report, showActions = false, onClick }: ReportCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { deleteReport } = useReports();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const canModify = user?.id === report.userId;
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteReport(report.id);
    } catch (error) {
      console.error("Failed to delete report:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card className={`overflow-hidden ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`} onClick={onClick}>
        <div className="relative">
          {report.imageUrl ? (
            <img 
              src={report.imageUrl} 
              alt={report.title} 
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-24 bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="text-primary-700">No Image</span>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{report.title}</CardTitle>
          <CardDescription className="flex items-center text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {report.location.address.length > 50 
              ? `${report.location.address.substring(0, 50)}...` 
              : report.location.address}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm line-clamp-2">{report.description}</p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(report.createdAt)}
          </Badge>
          
          {showActions && canModify && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-blue-500 hover:text-blue-500 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação excluirá permanentemente esta denúncia. Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReportEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        report={report}
      />
    </>
  );
};

export default ReportCard;
