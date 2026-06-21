"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppHeader } from "@/components/layout/AppHeader";
import { AllResponses } from "@/components/dashboard/AllResponses";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { HeroMetricCard } from "@/components/dashboard/HeroMetricCard";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { MetricGrid } from "@/components/dashboard/MetricGrid";
import { MissingChurches } from "@/components/dashboard/MissingChurches";
import { formatNumericDateTime } from "@/lib/date";
import { buildMetrics, sortResponsesByDate } from "@/lib/metrics";
import type { PeriodChartPoint } from "@/types/metrics";
import type { FormResponse } from "@/types/response";

type ApiResponse = {
  responses?: FormResponse[];
  fetchedAt?: string;
  message?: string;
  missingEnv?: string[];
};

type LoadState = {
  loading: boolean;
  error: string | null;
  missingEnv?: string[];
};

type ChartClickState = {
  activePayload?: Array<{
    payload?: PeriodChartPoint;
  }>;
};

const chartHeight = 260;
const donutColors = ["#1a73e8", "#34a853", "#fbbc04", "#a142f4", "#00acc1", "#ff7043"];
type PeriodMode = "day" | "week";

export default function Home() {
  const theme = useTheme();
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [periodMode, setPeriodMode] = useState<PeriodMode>("day");
  const [selectedPoint, setSelectedPoint] = useState<PeriodChartPoint | null>(null);
  const [state, setState] = useState<LoadState>({ loading: true, error: null });

  const loadResponses = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null, missingEnv: undefined }));

    try {
      const result = await fetch("/api/responses", { cache: "no-store" });
      const data = (await result.json()) as ApiResponse;

      if (!result.ok) {
        throw Object.assign(new Error(data.message ?? "Erro ao carregar respostas."), {
          missingEnv: data.missingEnv,
        });
      }

      setResponses(data.responses ?? []);
      setFetchedAt(data.fetchedAt ?? new Date().toISOString());
      setState({ loading: false, error: null });
    } catch (error) {
      const missingEnv =
        typeof error === "object" && error && "missingEnv" in error
          ? (error.missingEnv as string[] | undefined)
          : undefined;
      const message = error instanceof Error ? error.message : "Erro inesperado.";
      setState({ loading: false, error: message, missingEnv });
    }
  }, []);

  useEffect(() => {
    void loadResponses();
  }, [loadResponses]);

  useEffect(() => {
    setSelectedPoint(null);
  }, [periodMode, responses]);

  const sortedResponses = useMemo(() => sortResponsesByDate(responses), [responses]);
  const metrics = useMemo(() => buildMetrics(responses), [responses]);
  const periodData = periodMode === "day" ? metrics.byDay : metrics.byWeek;
  const dataUpdatedAt = fetchedAt ? formatNumericDateTime(new Date(fetchedAt)) : "agora";
  const moveLeaderTotal = metrics.byMoveLeader.reduce((sum, item) => sum + item.value, 0);
  const axisColor = theme.palette.text.secondary;
  const gridColor = alpha(theme.palette.text.primary, theme.palette.mode === "light" ? 0.08 : 0.14);

  function handlePeriodPointSelect(state: ChartClickState) {
    const payload = state.activePayload?.[0]?.payload;

    if (payload) {
      setSelectedPoint(payload);
    }
  }

  const selectedPointText = selectedPoint
    ? periodMode === "day"
      ? `${selectedPoint.fullLabel ?? selectedPoint.label}: ${selectedPoint.count.toLocaleString("pt-BR")} inscritos`
      : `${selectedPoint.label}: ${selectedPoint.count.toLocaleString("pt-BR")} inscritos entre ${selectedPoint.start} e ${selectedPoint.end}`
    : "Toque em um ponto do grafico para ver os detalhes.";

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <AppHeader isRefreshing={state.loading} onRefresh={loadResponses} />

        {state.loading ? (
          <LoadingState />
        ) : state.error ? (
          <ErrorState
            message={state.error}
            missingEnv={state.missingEnv}
            onRetry={loadResponses}
          />
        ) : responses.length === 0 ? (
          <EmptyState />
        ) : (
          <Stack spacing={2}>
            <HeroMetricCard
              total={metrics.total}
              dataUpdatedAt={dataUpdatedAt}
            />

            <MetricGrid metrics={metrics} />

            <ChartCard
              title="Inscricoes por periodo"
              subtitle="Acompanhe as inscricoes da semana atual ou por semanas do mes"
            >
              <ToggleButtonGroup
                exclusive
                value={periodMode}
                onChange={(_, value: PeriodMode | null) => {
                  if (value) {
                    setPeriodMode(value);
                  }
                }}
                size="small"
                sx={{ alignSelf: "flex-start" }}
              >
                <ToggleButton value="day">Dia</ToggleButton>
                <ToggleButton value="week">Semana</ToggleButton>
              </ToggleButtonGroup>
              <Box sx={{ height: { xs: 260, sm: 300 }, minWidth: 0, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={periodData}
                    margin={{ top: 8, right: 12, left: -18, bottom: 0 }}
                    onClick={handlePeriodPointSelect}
                    onMouseDown={handlePeriodPointSelect}
                  >
                    <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="label" stroke={axisColor} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} stroke={axisColor} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toLocaleString("pt-BR")} inscritos`,
                        "Total",
                      ]}
                      labelFormatter={(label) => String(label)}
                      contentStyle={{
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      dot={{ r: 5, strokeWidth: 2 }}
                      activeDot={{ r: 8, strokeWidth: 2 }}
                      name="Inscricoes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Typography color="text.secondary" variant="body2">
                {selectedPointText}
              </Typography>
            </ChartCard>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
              }}
            >
              <ChartCard title="Inscritos por igreja" subtitle="Quantidade de inscritos por igreja">
                <Box sx={{ height: Math.max(chartHeight, metrics.byChurch.length * 42) }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics.byChurch}
                      layout="vertical"
                      margin={{ top: 8, right: 12, left: 56, bottom: 0 }}
                    >
                      <CartesianGrid stroke={gridColor} strokeDasharray="4 4" horizontal={false} />
                      <XAxis allowDecimals={false} type="number" stroke={axisColor} tickLine={false} axisLine={false} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke={axisColor}
                        tickLine={false}
                        axisLine={false}
                        width={112}
                      />
                      <Tooltip
                        contentStyle={{
                          background: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="value" name="Inscritos" fill={theme.palette.primary.main} radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>

              <ChartCard title="Lideres da Rede Move" subtitle="Distribuicao dos inscritos por lideranca">
                <Box sx={{ height: chartHeight }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.byMoveLeader}
                        dataKey="value"
                        outerRadius={92}
                        paddingAngle={3}
                        nameKey="name"
                      >
                        {metrics.byMoveLeader.map((entry, index) => (
                          <Cell key={entry.name} fill={donutColors[index % donutColors.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        formatter={(value, name) => {
                          const percent =
                            moveLeaderTotal === 0
                              ? 0
                              : Math.round((Number(value) / moveLeaderTotal) * 100);
                          return [
                            `${Number(value).toLocaleString("pt-BR")} inscritos (${percent}%)`,
                            name,
                          ];
                        }}
                        contentStyle={{
                          background: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Box>

            <MissingChurches churches={metrics.missingChurches} />

            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <AllResponses responses={sortedResponses} />
              </CardContent>
            </Card>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
