"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { FormResponse } from "@/types/response";
import { formatDateTime, parseFormDate } from "@/lib/date";

type MobileResponseCardProps = {
  response: FormResponse;
};

export function MobileResponseCard({ response }: MobileResponseCardProps) {
  const parsedDate = parseFormDate(response.timestamp);

  return (
    <Card variant="outlined" sx={{ boxShadow: "none" }}>
      <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 760, overflowWrap: "anywhere" }}>
              {response.name}
            </Typography>
            <Typography color="text.secondary" variant="caption" sx={{ flexShrink: 0 }}>
              {parsedDate ? formatDateTime(parsedDate) : response.timestamp}
            </Typography>
          </Stack>
          <Stack spacing={0.25}>
            <Typography color="text.secondary" variant="body2" sx={{ overflowWrap: "anywhere" }}>
              {response.email || "Email nao informado"}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {response.phone || "Telefone nao informado"}
            </Typography>
          </Stack>
          <Typography color="text.secondary" variant="caption">
            {response.church} • Líder Rede Move: {response.moveLeader}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
