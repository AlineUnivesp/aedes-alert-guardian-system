
import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import { format, parseISO, startOfWeek, addDays, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth, isSameDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Report } from "@/contexts/ReportContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Loader2, CalendarDays, BarChart2, TrendingUp } from "lucide-react";

interface UserDashboardProps {
  reports: Report[];
  isLoading: boolean;
}

const UserDashboard = ({ reports, isLoading }: UserDashboardProps) => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    dailyAvg: 0,
    weeklyAvg: 0,
    monthlyAvg: 0
  });

  useEffect(() => {
    if (!reports.length) return;

    // Estatísticas gerais
    const today = new Date();
    const todayReports = reports.filter(report => 
      isSameDay(parseISO(report.createdAt), today)
    ).length;

    // Média diária (baseada nos últimos 30 dias)
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i));
    const reportsLast30Days = last30Days.map(day => {
      return reports.filter(report => isSameDay(parseISO(report.createdAt), day)).length;
    });
    const dailyAvg = reportsLast30Days.reduce((sum, count) => sum + count, 0) / 30;

    // Média semanal (baseada nas últimas 4 semanas)
    const weeklyAvg = dailyAvg * 7;

    // Média mensal (baseada no ano atual)
    const monthlyAvg = reports.length / 12; // Simplificação

    setStats({
      total: reports.length,
      today: todayReports,
      dailyAvg: parseFloat(dailyAvg.toFixed(1)),
      weeklyAvg: parseFloat(weeklyAvg.toFixed(1)),
      monthlyAvg: parseFloat(monthlyAvg.toFixed(1))
    });

    // Dados da última semana por dia
    const lastWeekStart = startOfWeek(today, { locale: ptBR });
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(lastWeekStart, i);
      return {
        name: format(day, 'EEE', { locale: ptBR }),
        date: day,
        count: reports.filter(report => 
          isSameDay(parseISO(report.createdAt), day)
        ).length
      };
    });
    setWeeklyData(weekDays);

    // Dados dos meses do ano atual
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
    
    const monthsData = months.map(month => {
      return {
        name: format(month, 'MMM', { locale: ptBR }),
        count: reports.filter(report => 
          isSameMonth(parseISO(report.createdAt), month)
        ).length
      };
    });
    setMonthlyData(monthsData);

  }, [reports]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Seu Dashboard</h2>
      
      {/* Indicadores principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Denúncias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.total}</div>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Denúncias Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.today}</div>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média Diária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.dailyAvg}</div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.weeklyAvg}</div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Denúncias nos Últimos 7 dias</CardTitle>
            <CardDescription>
              Quantidade de denúncias por dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer 
              config={{
                weekday: {
                  theme: { 
                    light: "#3b82f6",
                    dark: "#60a5fa" 
                  }
                }
              }} 
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" name="Denúncias" fill="var(--color-weekday)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Denúncias por Mês</CardTitle>
            <CardDescription>
              Quantidade de denúncias por mês no ano atual
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer 
              config={{
                month: {
                  theme: { 
                    light: "#8b5cf6",
                    dark: "#a78bfa" 
                  }
                }
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Denúncias" 
                    stroke="var(--color-month)" 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
