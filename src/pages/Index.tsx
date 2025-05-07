
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import Dashboard from "@/components/dashboard/Dashboard";
import { MapPin, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div>
      {/* Seção hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 py-16 text-white relative overflow-hidden">
        <div className="container-content relative z-10">
          <div className="flex flex-col items-center text-center md:text-left md:items-start gap-8 max-w-3xl">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                Sistema Guardião de Monitoramento e Combate ao Aedes aegypti
              </h1>
              <p className="text-lg opacity-90">
                Junte-se ao esforço comunitário para monitorar e combater focos do mosquito Aedes aegypti em sua região.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                {isAuthenticated ? (
                  <Button 
                    size="lg"
                    className="bg-white text-primary-700 hover:bg-white/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                    asChild
                  >
                    <a href="#dashboard">Ver Painel</a>
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    className="bg-white text-primary-700 hover:bg-white/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Participar Agora
                  </Button>
                )}
                <Button 
                  size="lg" 
                  className="bg-[#38f] text-white hover:bg-[#38f]/90 dark:border-white dark:border dark:bg-transparent dark:hover:bg-white/10" 
                  asChild
                >
                  <Link to="/about">Saiba Mais</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 dark:from-transparent dark:to-black/30"></div>
      </section>

      {/* Seção de recursos */}
      <section className="py-16 bg-muted/30 dark:bg-transparent">
        <div className="container-content">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-sidebar-accent p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Denuncie Focos</h3>
              <p className="text-muted-foreground dark:text-sidebar-foreground/80">
                Denuncie facilmente focos do mosquito com localização GPS e fotos opcionais.
              </p>
            </div>
            
            <div className="bg-white dark:bg-sidebar-accent p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Monitore Progresso</h3>
              <p className="text-muted-foreground dark:text-sidebar-foreground/80">
                Acompanhe todos os focos denunciados em um mapa interativo e veja os esforços da comunidade.
              </p>
            </div>
            
            <div className="bg-white dark:bg-sidebar-accent p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ganhe Reconhecimento</h3>
              <p className="text-muted-foreground dark:text-sidebar-foreground/80">
                Acumule pontos e títulos conforme você contribui para a iniciativa de saúde comunitária.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção do dashboard */}
      <section id="dashboard" className="py-16">
        <div className="container-content">
          <Dashboard />
        </div>
      </section>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
