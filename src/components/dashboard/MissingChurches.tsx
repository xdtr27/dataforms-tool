"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";

type MissingChurchesProps = {
  churches: string[];
};

export function MissingChurches({ churches }: MissingChurchesProps) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack spacing={0.25}>
            <Typography variant="h6">Igrejas sem inscrições</Typography>
            <Typography color="text.secondary" variant="body2">
              {churches.length.toLocaleString("pt-BR")} igrejas ainda sem respostas
            </Typography>
          </Stack>

          {churches.length === 0 ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleRoundedIcon color="success" fontSize="small" />
              <Typography color="text.secondary">
                Todas as igrejas possuem pelo menos uma inscricao.
              </Typography>
            </Stack>
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {churches.map((church) => (
                <Chip key={church} label={church} variant="outlined" />
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
