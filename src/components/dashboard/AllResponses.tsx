"use client";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { FormResponse } from "@/types/response";
import {
  getAllChurchOptions,
  getLeaderFilter,
  LeaderFilter,
  normalizeText,
} from "@/lib/churches";
import { ResponseDetails } from "./ResponseDetails";

type AllResponsesProps = {
  responses: FormResponse[];
};

function normalizeSearch(value: string): string {
  return normalizeText(value);
}

function getSearchText(response: FormResponse): string {
  return normalizeSearch(
    [
      response.name,
      response.email,
      response.phone,
      response.church,
      response.moveLeader,
      ...Object.values(response.raw),
    ].join(" "),
  );
}

function isPositiveLeader(value: string): boolean {
  return getLeaderFilter(value) === "leaders";
}

function ResponseListCard({
  response,
  onClick,
}: {
  response: FormResponse;
  onClick: () => void;
}) {
  const contact = response.phone || response.email || "Contato nao informado";

  return (
    <Card variant="outlined" sx={{ boxShadow: "none", height: "100%" }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="flex-start">
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 760, overflowWrap: "anywhere" }}>
                  {response.name}
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ overflowWrap: "anywhere" }}>
                  {response.church || "Igreja nao informada"}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={response.moveLeader || "Nao informado"}
                color={isPositiveLeader(response.moveLeader) ? "success" : "default"}
                variant={isPositiveLeader(response.moveLeader) ? "filled" : "outlined"}
                sx={{ flexShrink: 0 }}
              />
            </Stack>
            <Typography color="text.secondary" variant="body2" sx={{ overflowWrap: "anywhere" }}>
              {contact}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function AllResponses({ responses }: AllResponsesProps) {
  const [query, setQuery] = useState("");
  const [selectedChurch, setSelectedChurch] = useState("all");
  const [leaderFilter, setLeaderFilter] = useState<LeaderFilter>("all");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const normalizedQuery = normalizeSearch(query.trim());
  const churchOptions = useMemo(
    () => getAllChurchOptions(responses.map((response) => response.church)),
    [responses],
  );

  const filteredResponses = useMemo(() => {
    return responses.filter((response) => {
      const matchesQuery =
        !normalizedQuery || getSearchText(response).includes(normalizedQuery);
      const matchesChurch =
        selectedChurch === "all" ||
        normalizeText(response.church) === normalizeText(selectedChurch);
      const matchesLeader =
        leaderFilter === "all" || getLeaderFilter(response.moveLeader) === leaderFilter;

      return matchesQuery && matchesChurch && matchesLeader;
    });
  }, [leaderFilter, normalizedQuery, responses, selectedChurch]);

  function handleLeaderFilterChange(event: SelectChangeEvent) {
    setLeaderFilter(event.target.value as LeaderFilter);
  }

  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.25}>
        <Typography variant="h6">Todos os inscritos</Typography>
        <Typography color="text.secondary" variant="body2">
          {filteredResponses.length.toLocaleString("pt-BR")} de {responses.length.toLocaleString("pt-BR")} inscritos
        </Typography>
      </Stack>

      <TextField
        fullWidth
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nome, email, telefone, igreja ou resposta"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Box
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: { xs: "1fr", md: "1fr 220px" },
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel id="church-filter-label">Igreja</InputLabel>
          <Select
            labelId="church-filter-label"
            label="Igreja"
            value={selectedChurch}
            onChange={(event) => setSelectedChurch(event.target.value)}
          >
            <MenuItem value="all">Todas as igrejas</MenuItem>
            {churchOptions.map((church) => (
              <MenuItem key={church} value={church}>
                {church}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel id="leader-filter-label">Rede Move</InputLabel>
          <Select
            labelId="leader-filter-label"
            label="Rede Move"
            value={leaderFilter}
            onChange={handleLeaderFilterChange}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="leaders">Lideres</MenuItem>
            <MenuItem value="nonLeaders">Nao lideres</MenuItem>
            <MenuItem value="notInformed">Nao informado</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredResponses.length === 0 ? (
        <Card variant="outlined" sx={{ boxShadow: "none" }}>
          <CardContent>
            <Typography color="text.secondary" textAlign="center">
              Nenhum inscrito encontrado para essa busca.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          {filteredResponses.map((response) => (
            <ResponseListCard
              key={response.id}
              response={response}
              onClick={() => setSelectedResponse(response)}
            />
          ))}
        </Box>
      )}

      <ResponseDetails response={selectedResponse} onClose={() => setSelectedResponse(null)} />
    </Stack>
  );
}
