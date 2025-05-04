
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, defaultView = "login" }: AuthModalProps) => {
  const [view, setView] = useState<"login" | "register">(defaultView);

  const handleViewChange = (newView: "login" | "register") => {
    setView(newView);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {view === "login" ? "Login" : "Criar uma Conta"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {view === "login"
              ? "Digite suas credenciais para acessar sua conta"
              : "Cadastre-se para se juntar ao combate ao Aedes aegypti"}
          </DialogDescription>
        </DialogHeader>

        {view === "login" ? (
          <LoginForm onSuccess={onClose} onRegisterClick={() => handleViewChange("register")} />
        ) : (
          <RegisterForm onSuccess={onClose} onLoginClick={() => handleViewChange("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
