
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { calculatePoints, getUserTitle } from "@/lib/gamification";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Award, Trophy, Medal, Star, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Tipo para usuário do ranking
type RankUser = {
  id: string;
  name: string;
  points: number;
  reportCount: number;
  title: string;
};

// Componente para exibir regras da gamificação
const GamificationRules = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Como Funciona a Gamificação
          </CardTitle>
          <CardDescription>
            Entenda como você pode acumular pontos e subir de nível no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Pontos e Denúncias</h3>
            <p className="text-muted-foreground">
              Cada denúncia realizada vale 1 ponto base. Quanto mais denúncias você fizer,
              mais pontos acumula e mais alto será seu título de reconhecimento.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Bônus Especiais</h3>
            <div className="space-y-2 pl-4">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-1">+2 pontos</Badge>
                <p>Por cada 5ª denúncia (5, 15, 25...)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-1">+3 pontos</Badge>
                <p>Por cada 10ª denúncia (10, 20, 30...)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-1">+5 pontos</Badge>
                <p>Por cada 50ª denúncia (50, 100, 150...)</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Títulos de Reconhecimento</h3>
            <p className="text-muted-foreground mb-2">
              À medida que acumula pontos, você desbloqueará títulos cada vez mais prestigiosos:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-slate-400" />
                    <p className="font-medium">Iniciante da Vigilância</p>
                  </div>
                  <p className="text-xs text-muted-foreground">0 pontos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-zinc-400" />
                    <p className="font-medium">Caçador de Larvas</p>
                  </div>
                  <p className="text-xs text-muted-foreground">10 pontos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-amber-400" />
                    <p className="font-medium">Guardião da Comunidade</p>
                  </div>
                  <p className="text-xs text-muted-foreground">200 pontos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-orange-400" />
                    <p className="font-medium">Comandante Anti-Aedes</p>
                  </div>
                  <p className="text-xs text-muted-foreground">250 pontos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <p className="font-medium">Lenda do Combate Tropical</p>
                  </div>
                  <p className="text-xs text-muted-foreground">1000 pontos</p>
                </CardContent>
              </Card>
            </div>
            
            <p className="text-sm text-muted-foreground mt-3">
              E muitos outros títulos para você desbloquear durante sua jornada de combate ao Aedes!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para exibir ranking de usuários
const UsersRanking = ({ rankUsers }: { rankUsers: RankUser[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Ranking de Usuários
        </CardTitle>
        <CardDescription>
          Os usuários mais ativos no combate ao mosquito Aedes aegypti
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">Pos.</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="text-right">Denúncias</TableHead>
              <TableHead className="text-right">Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {index === 0 && <Trophy className="h-4 w-4 text-amber-500 fill-amber-500" />}
                    {index === 1 && <Medal className="h-4 w-4 text-slate-400" />}
                    {index === 2 && <Medal className="h-4 w-4 text-amber-700" />}
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{user.title}</TableCell>
                <TableCell className="text-right">{user.reportCount}</TableCell>
                <TableCell className="text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    {user.points}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rankUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhum usuário encontrado no ranking
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const Gamification = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rankUsers, setRankUsers] = useState<RankUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados do ranking
  const fetchRanking = async () => {
    try {
      setIsLoading(true);
      console.log("Buscando dados de ranking...");
      
      // Buscar todos os perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, points")
        .order("points", { ascending: false })
        .limit(20);

      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        toast.error("Erro ao carregar usuários do ranking");
        throw profilesError;
      }

      console.log("Perfis obtidos:", profiles?.length || 0);

      // Obter contagens de denúncias para cada usuário
      if (profiles && profiles.length > 0) {
        // Buscar contagem de denúncias para cada usuário
        const reportCountPromises = profiles.map(async (profile) => {
          const { count, error } = await supabase
            .from("reports")
            .select("id", { count: "exact", head: true })
            .eq("user_id", profile.id);
            
          if (error) {
            console.error(`Erro ao buscar contagem para usuário ${profile.id}:`, error);
          }
            
          return {
            id: profile.id,
            reportCount: count || 0,
            error
          };
        });

        const reportCounts = await Promise.all(reportCountPromises);
        console.log("Contagens de denúncias obtidas");
        
        // Combinar perfis com contagens de denúncias
        const usersWithCounts: RankUser[] = profiles.map((profile) => {
          const reportData = reportCounts.find(r => r.id === profile.id);
          const reportCount = reportData?.reportCount || 0;
          return {
            id: profile.id,
            name: profile.name,
            points: profile.points,
            reportCount: reportCount,
            title: getUserTitle(profile.points)
          };
        });

        // Ordenar por pontos (decrescente)
        usersWithCounts.sort((a, b) => b.points - a.points);
        console.log("Ranking final de usuários:", usersWithCounts.length);
        
        setRankUsers(usersWithCounts);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do ranking:", error);
      toast.error("Erro ao carregar ranking de usuários");
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar dados do ranking quando o componente montar
  useEffect(() => {
    if (isAuthenticated) {
      fetchRanking();
    }
  }, [isAuthenticated]);

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container-content py-16">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-content py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Gamificação e Ranking</h1>
          <p className="text-muted-foreground mt-2">
            Entenda o sistema de pontuação e veja os usuários mais engajados no combate ao mosquito
          </p>
        </div>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="rules">Como Funciona</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="rules">
            <GamificationRules />
          </TabsContent>

          <TabsContent value="ranking">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <UsersRanking rankUsers={rankUsers} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Gamification;
