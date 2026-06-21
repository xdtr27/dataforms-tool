"use client";

import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { Card, CardContent, Stack, Typography } from "@mui/material";

export function EmptyState() {
  return (
    <Card>
      <CardContent sx={{ p: 4, textAlign: "center" }}>
        <Stack alignItems="center" spacing={1.5}>
          <InboxRoundedIcon color="primary" sx={{ fontSize: 44 }} />
          <Typography variant="h6">Nenhuma resposta encontrada</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
            Assim que o Google Forms enviar respostas para a planilha, os numeros e graficos
            aparecem aqui.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
