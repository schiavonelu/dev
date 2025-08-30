import { useTheme } from "../theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle(){
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="btn btn-ghost text-sm" title="Cambia tema" aria-label="Cambia tema">
      {theme === 'dark' ? <Moon size={18}/> : <Sun size={18}/>}
    </button>
  );
}


