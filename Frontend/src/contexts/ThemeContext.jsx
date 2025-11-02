import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { lightTheme, darkTheme } from '../config/antd.config';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage, default to 'light'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create Ant Design theme configuration
  const themeConfig = useMemo(
    () => ({
      ...(mode === 'light' ? lightTheme : darkTheme),
      algorithm: mode === 'light' ? antdTheme.defaultAlgorithm : antdTheme.darkAlgorithm,
    }),
    [mode]
  );

  const value = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
