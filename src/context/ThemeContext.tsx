import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const defaultContext: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('match-theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
        }
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Save to localStorage and update DOM when theme changes
  useEffect(() => {
    try {
      localStorage.setItem('match-theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch {
      // Ignore errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
