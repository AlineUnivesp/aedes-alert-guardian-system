
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
      {/* Hero section */}
      <section className="hero-gradient py-16 text-white">
        <div className="container-content">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                Aedes Alert Guardian System
              </h1>
              <p className="text-lg opacity-90">
                Join the community effort to monitor and combat Aedes aegypti mosquito breeding sites in your region.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Button 
                    size="lg"
                    variant="secondary"
                    asChild
                  >
                    <a href="#dashboard">View Dashboard</a>
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    variant="secondary"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Join Now
                  </Button>
                )}
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md aspect-square bg-white/10 rounded-full flex items-center justify-center animate-pulse-slow">
                <img 
                  src="https://via.placeholder.com/800x800.png?text=Aedes+Guardian" 
                  alt="Aedes Guardian" 
                  className="w-3/4 h-3/4 object-contain" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-muted/30">
        <div className="container-content">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Report Breeding Sites</h3>
              <p className="text-muted-foreground">
                Easily report mosquito breeding sites with GPS location and optional photos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Monitor Progress</h3>
              <p className="text-muted-foreground">
                Track all reported sites on an interactive map and see community efforts.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Earn Recognition</h3>
              <p className="text-muted-foreground">
                Gain points and titles as you contribute to the community health initiative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard section */}
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
