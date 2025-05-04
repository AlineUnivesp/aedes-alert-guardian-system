
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

interface LoginFormProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
}

const LoginForm = ({ onSuccess, onRegisterClick }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      onSuccess();
    } catch (error) {
      // Erro é tratado no AuthContext
      console.error("Erro de login:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button 
        className="w-full" 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-b-transparent animate-spin"></span>
            Entrando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Entrar
          </span>
        )}
      </Button>
      <div className="mt-4 text-center text-sm">
        <p>
          Não tem uma conta?{" "}
          <button
            type="button"
            className="text-primary-600 hover:text-primary-800 font-medium"
            onClick={onRegisterClick}
          >
            Cadastre-se agora
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
