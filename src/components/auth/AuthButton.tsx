
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import { LogIn, LogOut, User, Menu, Award } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserTitle } from "@/lib/gamification";
import { Link } from "react-router-dom";

const AuthButton = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative">
            <User className="h-5 w-5 mr-2" />
            <span className="hidden md:inline">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start">
            <span className="font-medium">{getUserTitle(user.points)}</span>
            <span className="text-xs text-muted-foreground">{user.points} pontos</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/my-reports" className="cursor-pointer">Minhas Denúncias</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/gamification" className="cursor-pointer flex items-center gap-1">
              <Award className="h-4 w-4 mr-1" />
              Gamificação e Ranking
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button onClick={() => setIsAuthModalOpen(true)} variant="default">
        <LogIn className="mr-2 h-4 w-4" />
        <span>Entrar</span>
      </Button>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default AuthButton;
