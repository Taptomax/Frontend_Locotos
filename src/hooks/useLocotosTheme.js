import { useState } from 'react';

export const useLocotosTheme = (defaultDark = true) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('catalog-theme');
    if (saved) return saved === 'dark';
    return defaultDark;
  });

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('catalog-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return {
    darkMode,
    toggleTheme,
    wrapperClass: `catalog-theme-wrapper ${darkMode ? 'dark-mode' : ''}`
  };
};
