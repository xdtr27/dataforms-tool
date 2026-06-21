"use client";

import { Box, Card, CardContent, Chip, Stack, Typography, alpha, useTheme } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

type HeroMetricCardProps = {
  total: number;
  dataUpdatedAt: string;
};

export function HeroMetricCard({ total, dataUpdatedAt }: HeroMetricCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        overflow: "hidden",
        position: "relative",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%)"
            : "background.paper",
        animation: "fadeIn 220ms ease",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "@media (hover: hover)": {
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Box>
              <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 700 }}>
                Total de inscritos
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: "text.primary",
                  fontSize: { xs: "4rem", sm: "5.5rem" },
                  fontWeight: 800,
                  lineHeight: 0.95,
                  mt: 1,
                }}
              >
                {total.toLocaleString("pt-BR")}
              </Typography>
            </Box>
            <Box
              sx={{
                alignItems: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                borderRadius: 2,
                color: "primary.main",
                display: "flex",
                height: 48,
                justifyContent: "center",
                width: 48,
              }}
            >
              <TrendingUpRoundedIcon />
            </Box>
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Chip color="primary" label="inscrições recebidas" />
            <Chip variant="outlined" label={`Dados atualizados em: ${dataUpdatedAt}`} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
