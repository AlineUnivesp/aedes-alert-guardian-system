
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface RegisterFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

const RegisterForm = ({ onSuccess, onLoginClick }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { register } = useAuth();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password);
      onSuccess();
    } catch (error) {
      // Erro é tratado no AuthContext
      console.error("Erro de registro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          disabled={isSubmitting}
        />
      </div>
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
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isSubmitting}
          aria-invalid={passwordError ? "true" : "false"}
        />
        {passwordError && (
          <p className="text-destructive text-sm">{passwordError}</p>
        )}
      </div>
      <Button 
        className="w-full" 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-b-transparent animate-spin"></span>
            Registrando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Cadastrar
          </span>
        )}
      </Button>
      <div className="mt-4 text-center text-sm">
        <p>
          Já tem uma conta?{" "}
          <button
            type="button"
            className="text-primary-600 hover:text-primary-800 font-medium"
            onClick={onLoginClick}
          >
            Faça login
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
