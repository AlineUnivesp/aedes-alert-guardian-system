
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReports } from "@/contexts/ReportContext";
import { format, isToday, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, CalendarDays, BarChart2, Trophy } from "lucide-react";

const UserReportStats = () => {
  const { userReports } = useReports();
  
  // Total de denúncias
  const totalReports = userReports.length;
  
  // Denúncias de hoje
  const todayReports = userReports.filter(report => {
    const reportDate = new Date(report.createdAt);
    return isToday(reportDate);
  }).length;
  
  // Calcular médias
  const oldestReportDate = userReports.length > 0 
    ? new Date(Math.min(...userReports.map(r => new Date(r.createdAt).getTime())))
    : new Date();
  
  const daysSinceFirstReport = Math.max(
    1, 
    Math.ceil((new Date().getTime() - oldestReportDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  
  const dailyAverage = (totalReports / daysSinceFirstReport).toFixed(1);
  
  const weeksSinceFirstReport = Math.max(1, Math.ceil(daysSinceFirstReport / 7));
  const weeklyAverage = (totalReports / weeksSinceFirstReport).toFixed(1);
  
  const monthsSinceFirstReport = Math.max(1, Math.ceil(daysSinceFirstReport / 30));
  const monthlyAverage = (totalReports / monthsSinceFirstReport).toFixed(1);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Denúncias</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReports}</div>
          <p className="text-xs text-muted-foreground mt-1">Desde o início</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Denúncias Hoje</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayReports}</div>
          <p className="text-xs text-muted-foreground mt-1">{format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dailyAverage}</div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-muted-foreground">Semanal: {weeklyAverage}</p>
            <p className="text-xs text-muted-foreground">Mensal: {monthlyAverage}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tendência</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{
            todayReports > parseFloat(dailyAverage) 
              ? "↑" 
              : todayReports < parseFloat(dailyAverage) 
                ? "↓" 
                : "→"
          }</div>
          <p className="text-xs text-muted-foreground mt-1">
            {todayReports > parseFloat(dailyAverage) 
              ? "Acima da média diária" 
              : todayReports < parseFloat(dailyAverage) 
                ? "Abaixo da média diária" 
                : "Na média diária"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReportStats;
