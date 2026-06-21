import type { FormResponse } from "./response";

export type ChartData = {
  name: string;
  value: number;
};

export type PeriodChartPoint = {
  label: string;
  count: number;
  date?: string;
  start?: string;
  end?: string;
  fullLabel?: string;
};

export type DashboardMetrics = {
  total: number;
  topChurch: string;
  representedChurches: number;
  moveLeaderCount: number;
  moveLeaderPercent: number;
  lastResponse: FormResponse | null;
  missingChurches: string[];
  byDay: PeriodChartPoint[];
  byWeek: PeriodChartPoint[];
  byChurch: ChartData[];
  byMoveLeader: ChartData[];
};
