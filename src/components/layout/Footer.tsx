
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t mt-auto py-6 bg-muted/30">
      <div className="container-content">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} Aedes Guardian</span>
            <span className="hidden sm:inline">|</span>
            <span>Univesp - PI3 - 1º Semestre 2025</span>
          </div>
          
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/public-data" className="hover:text-primary transition-colors">Public Data</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
