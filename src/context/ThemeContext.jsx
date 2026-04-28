import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

/**
 * Utility to determine theme based on UTC time.
 * Morning (Light): 06:00 UTC - 18:00 UTC
 * Evening/Night (Dark): 18:00 UTC - 06:00 UTC
 */
const getThemeByUTCTime = () => {
  const utcHour = new Date().getUTCHours();
  // 6 AM to 6 PM UTC is Light Mode, otherwise Dark Mode
  return utcHour >= 6 && utcHour < 18 ? "light" : "dark";
};

/**
 * ThemeProvider — manages dark/light mode.
 * Automatically switches based on International Time (UTC).
 * Persists preference to localStorage but allows automatic override if needed.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Priority: Saved preference -> UTC Time logic
    const saved = localStorage.getItem("eduadmin_theme");
    if (saved) return saved;
    return getThemeByUTCTime();
  });

  // Effect to apply theme and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("eduadmin_theme", theme);
  }, [theme]);

  // Effect to handle automatic time-based switching
  useEffect(() => {
    const checkTimeAndSwitch = () => {
      const saved = localStorage.getItem("eduadmin_theme_auto_override");
      // Only auto-switch if user hasn't manually overridden for this session
      // Or we can just strictly follow time as requested.
      // Given "it should turn automaticaly", we'll implement a recurring check.
      const timeBasedTheme = getThemeByUTCTime();
      if (theme !== timeBasedTheme && !localStorage.getItem("eduadmin_theme_manual")) {
        setTheme(timeBasedTheme);
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeAndSwitch, 60000);
    return () => clearInterval(interval);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Mark as manual change so auto-switch doesn't immediately revert it
    localStorage.setItem("eduadmin_theme_manual", "true");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

