"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card sx={{ height: "100%", animation: "fadeIn 220ms ease" }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Stack spacing={0.25}>
            <Typography variant="h6">{title}</Typography>
            {subtitle ? (
              <Typography color="text.secondary" variant="body2">
                {subtitle}
              </Typography>
            ) : null}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
