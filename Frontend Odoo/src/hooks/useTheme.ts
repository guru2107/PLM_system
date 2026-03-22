import { useState, useEffect } from 'react';
import { toggleTheme, initializeTheme, getCurrentTheme } from '../utils/theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    initializeTheme();
    setTheme(getCurrentTheme());
  }, []);

  const switchTheme = () => {
    toggleTheme();
    setTheme(getCurrentTheme());
  };

  return { theme, switchTheme };
};
