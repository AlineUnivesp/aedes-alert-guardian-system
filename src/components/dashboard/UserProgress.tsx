
import { useAuth } from "@/contexts/AuthContext";
import { getNextTitleProgress } from "@/lib/gamification";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Star, Trophy } from "lucide-react";

const UserProgress = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Entre para acompanhar seu progresso</p>
        </CardContent>
      </Card>
    );
  }
  
  const progress = getNextTitleProgress(user.points);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Seu Progresso</CardTitle>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-amber-500" />
            <span className="font-bold">{user.points} pontos</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{progress.currentTitle}</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso para o próximo título</span>
            <span className="font-medium">{Math.round(progress.progress)}%</span>
          </div>
          <Progress value={progress.progress} />
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <div>
            <span className="text-sm text-muted-foreground">Próximo Título:</span>
            <h4 className="font-medium">{progress.nextTitle}</h4>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {progress.pointsToNext > 0 ? `${progress.pointsToNext} pontos necessários` : "Nível máximo alcançado!"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default UserProgress;
