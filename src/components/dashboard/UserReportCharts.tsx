
import { useReports } from "@/contexts/ReportContext";
import { addDays, format, isWithinInterval, startOfDay, startOfMonth, startOfYear, startOfWeek, subDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserReportCharts = () => {
  const { userReports } = useReports();
  
  // Dados para o gráfico dos últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const startOfTheDay = startOfDay(date);
    const count = userReports.filter(report => {
      const reportDate = new Date(report.createdAt);
      return isWithinInterval(reportDate, {
        start: startOfTheDay,
        end: addDays(startOfTheDay, 1)
      });
    }).length;
    
    return {
      date: format(date, "EEE", { locale: ptBR }),
      count,
      fullDate: format(date, "dd/MM", { locale: ptBR }),
    };
  });
  
  // Dados para o gráfico dos meses do ano atual
  const currentYear = new Date().getFullYear();
  const monthsData = Array.from({ length: 12 }, (_, i) => {
    const month = startOfMonth(new Date(currentYear, i, 1));
    const nextMonth = i === 11 
      ? new Date(currentYear + 1, 0, 1) 
      : new Date(currentYear, i + 1, 1);
    
    const count = userReports.filter(report => {
      const reportDate = new Date(report.createdAt);
      return reportDate >= month && reportDate < nextMonth;
    }).length;
    
    return {
      month: format(month, "MMM", { locale: ptBR }),
      count,
      fullMonth: format(month, "MMMM", { locale: ptBR }),
    };
  });
  
  // Fixed chart config to match the expected ChartConfig type
  const chartConfig = {
    primary: {
      color: "var(--primary)"
    },
    secondary: {
      color: "var(--secondary)"
    },
    success: {
      color: "var(--green)"
    },
    warning: {
      color: "var(--amber)"
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Denúncias nos últimos 7 dias</CardTitle>
          <CardDescription>Atividade diária de denúncias na semana</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer config={chartConfig} className="aspect-[4/3]">
            <BarChart data={last7Days}>
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => value === 0 ? '0' : value}
              />
              <CartesianGrid vertical={false} className="stroke-muted" />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]} 
                className="fill-primary"
              />
              <ChartTooltip
                content={({
                  active,
                  payload,
                }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }
                  
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">{data.fullDate}</span>
                          <span className="font-semibold tabular-nums">{data.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Denúncias por mês em {currentYear}</CardTitle>
          <CardDescription>Distribuição mensal de denúncias</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer config={chartConfig} className="aspect-[4/3]">
            <AreaChart data={monthsData}>
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => value === 0 ? '0' : value}
              />
              <CartesianGrid vertical={false} className="stroke-muted" />
              <Area 
                type="monotone"
                dataKey="count" 
                className="fill-primary/20 stroke-primary"
              />
              <ChartTooltip
                content={({
                  active,
                  payload,
                }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }
                  
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">{data.fullMonth}</span>
                          <span className="font-semibold tabular-nums">{data.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReportCharts;
