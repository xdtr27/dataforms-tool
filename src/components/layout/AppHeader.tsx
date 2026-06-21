"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type AppHeaderProps = {
  isRefreshing: boolean;
  onRefresh: () => void;
};

export function AppHeader({ isRefreshing, onRefresh }: AppHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        py: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 760 }}>
          Dados Formulário
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Acompanhe seus inscritos em tempo real
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        <ThemeToggle />
        <Button
          aria-label="Atualizar dados"
          disabled={isRefreshing}
          onClick={onRefresh}
          startIcon={<RefreshRoundedIcon />}
          variant="contained"
          sx={{
            minHeight: 44,
            px: { xs: 1.5, sm: 2 },
            "& .MuiButton-startIcon": { mr: { xs: 0, sm: 0.75 } },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Atualizar
          </Box>
        </Button>
      </Stack>
    </Box>
  );
}
