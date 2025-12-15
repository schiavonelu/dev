/* eslint-disable react-refresh/only-export-components */
// src/theme/ThemeProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext({ theme:"light", toggle:()=>{} });

export function ThemeProvider({ children }){
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark':'light')
  );

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const api = useMemo(()=>({
    theme, toggle: ()=> setTheme(t => t==='dark'?'light':'dark')
  }), [theme]);

  return <ThemeCtx.Provider value={api}>{children}</ThemeCtx.Provider>;
}
export function useTheme(){ return useContext(ThemeCtx); }
