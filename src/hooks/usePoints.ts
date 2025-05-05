
import { calculatePoints } from "@/lib/gamification";
import { supabase } from "@/integrations/supabase/client";

export const usePoints = () => {
  const calculatePointsWithBonus = (currentPoints: number, pointsToAdd: number = 1) => {
    const newPoints = currentPoints + pointsToAdd;
    const bonusPoints = calculatePoints(newPoints) - newPoints;
    const totalNewPoints = newPoints + bonusPoints;
    
    return {
      newPoints,
      bonusPoints,
      totalNewPoints
    };
  };

  const updateUserPoints = async (userId: string, currentPoints: number, pointsToAdd: number = 1) => {
    const { totalNewPoints, bonusPoints } = calculatePointsWithBonus(currentPoints, pointsToAdd);
    
    const { error } = await supabase
      .from("profiles")
      .update({ points: totalNewPoints })
      .eq("id", userId);
      
    if (error) {
      throw error;
    }
    
    return { totalNewPoints, bonusPoints };
  };

  return { calculatePointsWithBonus, updateUserPoints };
};
