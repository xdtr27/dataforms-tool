"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { FormResponse } from "@/types/response";
import { formatDateTime, parseFormDate } from "@/lib/date";

type ResponseDetailsProps = {
  response: FormResponse | null;
  onClose: () => void;
};

function normalizeKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isCoreField(key: string): boolean {
  const normalized = normalizeKey(key);

  return (
    normalized.includes("timestamp") ||
    normalized.includes("carimbo de data/hora") ||
    normalized.includes("nome") ||
    normalized.includes("email") ||
    normalized.includes("e-mail") ||
    normalized.includes("telefone") ||
    normalized.includes("whatsapp") ||
    normalized.includes("3. de qual igreja") ||
    normalized.includes("voce e lider da rede move")
  );
}

function isPositiveLeader(value: string): boolean {
  const normalized = normalizeKey(value);
  return normalized === "sim" || normalized.startsWith("sim ");
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography sx={{ overflowWrap: "anywhere" }}>{value || "Nao informado"}</Typography>
    </Stack>
  );
}

function DetailsContent({ response, onClose }: { response: FormResponse; onClose: () => void }) {
  const parsedDate = parseFormDate(response.timestamp);
  const otherEntries = Object.entries(response.raw).filter(
    ([key, value]) => !isCoreField(key) && String(value).trim() !== "",
  );

  return (
    <Stack spacing={2.25}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
            {response.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Dados completos do inscrito
          </Typography>
        </Box>
        <IconButton aria-label="Fechar detalhes" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip label={response.church || "Igreja nao informada"} color="primary" />
        <Chip
          label={`Líder Move: ${response.moveLeader || "Nao informado"}`}
          color={isPositiveLeader(response.moveLeader) ? "success" : "default"}
          variant={isPositiveLeader(response.moveLeader) ? "filled" : "outlined"}
        />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
        <DetailRow label="Nome" value={response.name} />
        <DetailRow label="Email" value={response.email} />
        <DetailRow label="Telefone/WhatsApp" value={response.phone} />
        <DetailRow label="Igreja" value={response.church} />
        <DetailRow label="Lider Rede Move" value={response.moveLeader} />
        <DetailRow
          label="Data/hora da inscricao"
          value={parsedDate ? formatDateTime(parsedDate) : response.timestamp}
        />
      </Box>

      <Divider />

      <Stack spacing={1.25}>
        <Typography variant="subtitle2" sx={{ fontWeight: 760 }}>
          Outras informacoes
        </Typography>
        {otherEntries.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Nenhuma informacao extra preenchida.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {otherEntries.map(([key, value]) => (
              <DetailRow key={key} label={key} value={String(value)} />
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export function ResponseDetails({ response, onClose }: ResponseDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!response) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "88vh",
            p: 2,
          },
        }}
      >
        <DetailsContent response={response} onClose={onClose} />
      </Drawer>
    );
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={onClose}>
      <DialogTitle sx={{ display: "none" }}>Detalhes do inscrito</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <DetailsContent response={response} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
