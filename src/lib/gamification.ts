
// Function to calculate total points including bonuses
export function calculatePoints(reportCount: number): number {
  let totalPoints = reportCount;
  
  // For milestone points ending in 5 (5, 15, 25...)
  if (reportCount % 10 === 5) {
    totalPoints += 2;
  }
  
  // For milestone points ending in 0 (10, 20, 30...)
  if (reportCount % 10 === 0 && reportCount > 0) {
    totalPoints += 3;
  }
  
  // For milestone points divisible by 50 (50, 100, 150...)
  if (reportCount % 50 === 0 && reportCount > 0) {
    totalPoints += 5;
  }
  
  return totalPoints;
}

// User titles based on points
export function getUserTitle(points: number): string {
  if (points >= 1000) return "Lenda Eterna do Combate Tropical";
  if (points >= 900) return "Campeão Regional da Resistência";
  if (points >= 800) return "Grão-Vigilante dos Céus Limpos";
  if (points >= 700) return "Lenda Urbana da Prevenção";
  if (points >= 600) return "Domador de Águas Paradas";
  if (points >= 500) return "Embaixador da Dengue Zero";
  if (points >= 450) return "Cavaleiro da Saúde Pública";
  if (points >= 400) return "Sentinela dos Telhados";
  if (points >= 350) return "Mestre Mosquicida";
  if (points >= 300) return "Espadachim do Fumacê";
  if (points >= 250) return "Comandante Anti-Aedes";
  if (points >= 200) return "Guardião da Comunidade";
  if (points >= 160) return "Vigia das Sombras Tropicais";
  if (points >= 130) return "Desbravador de Calhas";
  if (points >= 100) return "Analista do Bem";
  if (points >= 80) return "Herói do Borrifador";
  if (points >= 60) return "Patrulheiro do Bairro";
  if (points >= 40) return "Observador de Focos";
  if (points >= 25) return "Escudeiro da Saúde";
  if (points >= 10) return "Caçador de Larvas";
  return "Iniciante da Vigilância";
}

// Function to calculate progress to next title
export function getNextTitleProgress(points: number): { 
  currentTitle: string;
  nextTitle: string;
  progress: number;
  pointsToNext: number;
} {
  const thresholds = [0, 10, 25, 40, 60, 80, 100, 130, 160, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000];
  const titles = [
    "Iniciante da Vigilância",
    "Caçador de Larvas",
    "Escudeiro da Saúde",
    "Observador de Focos",
    "Patrulheiro do Bairro",
    "Herói do Borrifador",
    "Analista do Bem",
    "Desbravador de Calhas",
    "Vigia das Sombras Tropicais",
    "Guardião da Comunidade",
    "Comandante Anti-Aedes",
    "Espadachim do Fumacê",
    "Mestre Mosquicida",
    "Sentinela dos Telhados",
    "Cavaleiro da Saúde Pública",
    "Embaixador da Dengue Zero",
    "Domador de Águas Paradas",
    "Lenda Urbana da Prevenção",
    "Grão-Vigilante dos Céus Limpos",
    "Campeão Regional da Resistência",
    "Lenda Eterna do Combate Tropical"
  ];
  
  // Find current level
  let currentLevel = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (points >= thresholds[i]) {
      currentLevel = i;
    } else {
      break;
    }
  }
  
  // At max level
  if (currentLevel === thresholds.length - 1) {
    return {
      currentTitle: titles[currentLevel],
      nextTitle: "Máximo Nível Alcançado",
      progress: 100,
      pointsToNext: 0
    };
  }
  
  // Calculate progress to next level
  const currentThreshold = thresholds[currentLevel];
  const nextThreshold = thresholds[currentLevel + 1];
  const pointsToNext = nextThreshold - points;
  const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  
  return {
    currentTitle: titles[currentLevel],
    nextTitle: titles[currentLevel + 1],
    progress: progress,
    pointsToNext: pointsToNext
  };
}
