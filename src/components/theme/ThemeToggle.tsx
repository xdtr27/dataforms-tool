"use client";

import { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { ThemeModeContext } from "@/components/layout/AppShell";

export function ThemeToggle() {
  const { mode, toggleMode } = useContext(ThemeModeContext);
  const label = mode === "light" ? "Ativar modo escuro" : "Ativar modo claro";

  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} color="inherit" onClick={toggleMode}>
        {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}
