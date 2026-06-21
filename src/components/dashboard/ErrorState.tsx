"use client";

import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Alert, Button, Card, CardContent, Stack, Typography } from "@mui/material";

type ErrorStateProps = {
  message: string;
  missingEnv?: string[];
  onRetry: () => void;
};

export function ErrorState({ message, missingEnv, onRetry }: ErrorStateProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5}>
            <ErrorOutlineRoundedIcon color="error" />
            <Stack spacing={0.5}>
              <Typography variant="h6">Nao foi possivel carregar os dados</Typography>
              <Typography color="text.secondary">{message}</Typography>
            </Stack>
          </Stack>
          {missingEnv?.length ? (
            <Alert severity="warning">
              Configure no arquivo .env.local: {missingEnv.join(", ")}
            </Alert>
          ) : null}
          <Button onClick={onRetry} variant="contained" sx={{ alignSelf: "flex-start" }}>
            Tentar novamente
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
