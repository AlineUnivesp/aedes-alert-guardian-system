
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Toggle } from "@/components/ui/toggle";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  
  return (
    <>
      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
          className="h-9 w-9"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      ) : (
        <Toggle
          pressed={theme === "dark"}
          onPressedChange={() => toggleTheme()}
          aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
          className="gap-1 px-2"
        >
          {theme === "light" ? (
            <>
              <Moon className="h-4 w-4" />
              <span className="text-xs">Escuro</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span className="text-xs">Claro</span>
            </>
          )}
        </Toggle>
      )}
    </>
  );
}
