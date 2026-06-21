"use client";

import { Stack, Typography } from "@mui/material";
import type { FormResponse } from "@/types/response";
import { MobileResponseCard } from "./MobileResponseCard";

type RecentResponsesProps = {
  responses: FormResponse[];
};

export function RecentResponses({ responses }: RecentResponsesProps) {
  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.25}>
        <Typography variant="h6">Ultimos inscritos</Typography>
        <Typography color="text.secondary" variant="body2">
          Respostas mais recentes do formulario
        </Typography>
      </Stack>
      <Stack spacing={1}>
        {responses.slice(0, 8).map((response) => (
          <MobileResponseCard key={response.id} response={response} />
        ))}
      </Stack>
    </Stack>
  );
}
