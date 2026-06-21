"use client";

import { ReactNode, createContext, useMemo, useState, useEffect } from "react";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { createAppTheme } from "@/lib/theme";
import type { ThemeMode } from "@/types/response";

type ThemeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
};

export const ThemeModeContext = createContext<ThemeContextValue>({
  mode: "light",
  toggleMode: () => undefined,
});

export function AppShell({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const storedMode = window.localStorage.getItem("forms-dashboard-theme");
    if (storedMode === "light" || storedMode === "dark") {
      setMode(storedMode);
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => {
        setMode((currentMode) => {
          const nextMode = currentMode === "light" ? "dark" : "light";
          window.localStorage.setItem("forms-dashboard-theme", nextMode);
          return nextMode;
        });
      },
    }),
    [mode],
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            "::selection": {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            },
            "@keyframes fadeIn": {
              from: {
                opacity: 0,
                transform: "translateY(4px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
