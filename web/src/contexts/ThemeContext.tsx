import { createContext, useContext, useState, ReactNode } from 'react';
import { TRANSITIONS, SPACING, TYPOGRAPHY, SHADOWS, BORDERS, ZINDEX, OPACITY, BREAKPOINTS, CONTAINER } from '../config/designTokens';

interface ThemeContextType {
  isFireflyMode: boolean;
  toggleFireflyMode: () => void;
  tokens: {
    transitions: typeof TRANSITIONS;
    spacing: typeof SPACING;
    typography: typeof TYPOGRAPHY;
    shadows: typeof SHADOWS;
    borders: typeof BORDERS;
    zIndex: typeof ZINDEX;
    opacity: typeof OPACITY;
    breakpoints: typeof BREAKPOINTS;
    container: typeof CONTAINER;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isFireflyMode, setIsFireflyMode] = useState(false);

  const toggleFireflyMode = () => {
    setIsFireflyMode(!isFireflyMode);
  };

  const tokens = {
    transitions: TRANSITIONS,
    spacing: SPACING,
    typography: TYPOGRAPHY,
    shadows: SHADOWS,
    borders: BORDERS,
    zIndex: ZINDEX,
    opacity: OPACITY,
    breakpoints: BREAKPOINTS,
    container: CONTAINER,
  };

  return (
    <ThemeContext.Provider value={{ isFireflyMode, toggleFireflyMode, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
