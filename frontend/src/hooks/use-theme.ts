import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Evita hidratação desnecessária
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Verifica se o tema atual é escuro
  const isDark = resolvedTheme === 'dark';

  // Alterna entre os temas claro e escuro
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Define o tema do sistema
  const setSystemTheme = () => {
    setTheme('system');
  };

  return {
    theme: theme as Theme,
    systemTheme,
    resolvedTheme: resolvedTheme as Theme,
    isDark,
    isMounted,
    setTheme: (theme: Theme) => setTheme(theme),
    toggleTheme,
    setSystemTheme,
  };
}
