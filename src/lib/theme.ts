import { createTheme, alpha } from "@mui/material/styles";
import type { ThemeMode } from "@/types/response";

export function createAppTheme(mode: ThemeMode) {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? "#1a73e8" : "#8ab4f8",
        dark: "#1557b0",
        light: "#d2e3fc",
      },
      secondary: {
        main: isLight ? "#6750a4" : "#d0bcff",
      },
      background: {
        default: isLight ? "#f8fafc" : "#101418",
        paper: isLight ? "#ffffff" : "#171c22",
      },
      text: {
        primary: isLight ? "#1f2937" : "#f3f6fb",
        secondary: isLight ? "#5f6b7a" : "#bac3cf",
      },
      divider: isLight ? alpha("#1f2937", 0.1) : alpha("#ffffff", 0.12),
    },
    typography: {
      fontFamily:
        'Inter, Roboto, "Helvetica Neue", Arial, system-ui, -apple-system, sans-serif',
      h1: {
        fontWeight: 760,
        letterSpacing: 0,
      },
      h2: {
        fontWeight: 740,
        letterSpacing: 0,
      },
      h3: {
        fontWeight: 720,
        letterSpacing: 0,
      },
      h4: {
        fontWeight: 700,
        letterSpacing: 0,
      },
      h5: {
        fontWeight: 680,
        letterSpacing: 0,
      },
      h6: {
        fontWeight: 680,
        letterSpacing: 0,
      },
      button: {
        textTransform: "none",
        fontWeight: 650,
        letterSpacing: 0,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 180ms ease, color 180ms ease",
          },
          "*": {
            boxSizing: "border-box",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${isLight ? alpha("#1f2937", 0.08) : alpha("#ffffff", 0.1)}`,
            boxShadow: isLight
              ? "0 12px 32px rgba(31, 41, 55, 0.06)"
              : "0 18px 42px rgba(0, 0, 0, 0.24)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 650,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });
}
