
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
      setPasswordError("Passwords don't match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
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
      // Error is handled in AuthContext
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
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
        <Label htmlFor="password">Password</Label>
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
        <Label htmlFor="confirmPassword">Confirm Password</Label>
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
            Registering...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Register
          </span>
        )}
      </Button>
      <div className="mt-4 text-center text-sm">
        <p>
          Already have an account?{" "}
          <button
            type="button"
            className="text-primary-600 hover:text-primary-800 font-medium"
            onClick={onLoginClick}
          >
            Login instead
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
