"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, helper, icon }: MetricCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        animation: "fadeIn 220ms ease",
        transition: "transform 160ms ease",
        "@media (hover: hover)": {
          "&:hover": { transform: "translateY(-2px)" },
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 700 }}>
              {label}
            </Typography>
            {icon}
          </Stack>
          <Typography
            component="p"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              fontWeight: 780,
              lineHeight: 1.05,
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </Typography>
          {helper ? (
            <Typography color="text.secondary" variant="caption">
              {helper}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
