
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
          <CardTitle>User Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Login to track your progress</p>
        </CardContent>
      </Card>
    );
  }
  
  const progress = getNextTitleProgress(user.points);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Your Progress</CardTitle>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-amber-500" />
            <span className="font-bold">{user.points} points</span>
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
            <span className="text-muted-foreground">Progress to next title</span>
            <span className="font-medium">{Math.round(progress.progress)}%</span>
          </div>
          <Progress value={progress.progress} />
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <div>
            <span className="text-sm text-muted-foreground">Next Title:</span>
            <h4 className="font-medium">{progress.nextTitle}</h4>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {progress.pointsToNext > 0 ? `${progress.pointsToNext} more points needed` : "Maximum level achieved!"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default UserProgress;
