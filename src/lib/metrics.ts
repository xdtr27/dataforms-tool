import type { DashboardMetrics, PeriodChartPoint } from "@/types/metrics";
import type { FormResponse } from "@/types/response";
import { parseFormDate, startOfDay } from "./date";
import { getMissingChurches, getLeaderFilter } from "./churches";

type ResponseWithMaybeDate = FormResponse & { parsedDate: Date | null };

function withDates(responses: FormResponse[]): ResponseWithMaybeDate[] {
  return responses
    .map((response) => ({
      ...response,
      parsedDate: getResponseDate(response),
    }))
    .sort((a, b) => {
      const firstTime = a.parsedDate?.getTime() ?? 0;
      const secondTime = b.parsedDate?.getTime() ?? 0;
      return secondTime - firstTime;
    });
}

function countBy(items: string[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = item.trim() || "Nao informado";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function toChartData(counts: Record<string, number>) {
  return Object.entries(counts)
    .sort(([, first], [, second]) => second - first)
    .map(([name, value]) => ({ name, value }));
}

function getResponseDate(response: FormResponse): Date | null {
  return parseFormDate(response.timestamp || response.raw["Carimbo de data/hora"] || "");
}

function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const weekStart = startOfDay(date);
  weekStart.setDate(weekStart.getDate() + diff);
  return weekStart;
}

function toDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDayMonth(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

const weekdayLabels = [
  { label: "Seg", fullLabel: "Segunda-feira" },
  { label: "Ter", fullLabel: "Terca-feira" },
  { label: "Qua", fullLabel: "Quarta-feira" },
  { label: "Qui", fullLabel: "Quinta-feira" },
  { label: "Sex", fullLabel: "Sexta-feira" },
  { label: "Sab", fullLabel: "Sabado" },
  { label: "Dom", fullLabel: "Domingo" },
];

export function getCurrentWeekDailyChartData(responses: FormResponse[]): PeriodChartPoint[] {
  const weekStart = startOfWeek(new Date());
  const points = weekdayLabels.map((weekday, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    return {
      label: weekday.label,
      fullLabel: weekday.fullLabel,
      date: toDateKey(date),
      count: 0,
    };
  });
  const indexByDate = new Map(points.map((point, index) => [point.date, index]));

  for (const response of responses) {
    const parsedDate = getResponseDate(response);
    if (!parsedDate) {
      continue;
    }

    const pointIndex = indexByDate.get(toDateKey(parsedDate));
    if (pointIndex !== undefined) {
      points[pointIndex].count += 1;
    }
  }

  return points;
}

export function getCurrentMonthWeeklyChartData(responses: FormResponse[]): PeriodChartPoint[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const points: PeriodChartPoint[] = [];

  for (let startDay = 1; startDay <= lastDay; startDay += 7) {
    const endDay = Math.min(startDay + 6, lastDay);
    const weekNumber = Math.ceil(startDay / 7);
    const startDate = new Date(year, month, startDay);
    const endDate = new Date(year, month, endDay);

    points.push({
      label: `Semana ${weekNumber}`,
      start: formatDayMonth(startDate),
      end: formatDayMonth(endDate),
      count: 0,
    });
  }

  for (const response of responses) {
    const parsedDate = getResponseDate(response);
    if (!parsedDate || parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month) {
      continue;
    }

    const weekIndex = Math.floor((parsedDate.getDate() - 1) / 7);
    if (points[weekIndex]) {
      points[weekIndex].count += 1;
    }
  }

  return points;
}

export function sortResponsesByDate(responses: FormResponse[]): FormResponse[] {
  return withDates(responses).map((response) => ({
    id: response.id,
    timestamp: response.timestamp,
    name: response.name,
    email: response.email,
    phone: response.phone,
    church: response.church,
    moveLeader: response.moveLeader,
    raw: response.raw,
  }));
}

export function buildMetrics(responses: FormResponse[]): DashboardMetrics {
  const sortedResponses = withDates(responses);
  const byChurch = toChartData(countBy(responses.map((item) => item.church)));
  const byMoveLeader = toChartData(countBy(responses.map((item) => item.moveLeader)));
  const moveLeaderCount = responses.filter((item) => getLeaderFilter(item.moveLeader) === "leaders").length;
  const lastResponse = sortedResponses[0] ?? null;

  return {
    total: responses.length,
    topChurch: byChurch[0]?.name ?? "Sem dados",
    representedChurches: byChurch.filter((item) => item.name !== "Nao informado").length,
    moveLeaderCount,
    moveLeaderPercent:
      responses.length === 0 ? 0 : Math.round((moveLeaderCount / responses.length) * 100),
    lastResponse,
    missingChurches: getMissingChurches(responses.map((item) => item.church)),
    byDay: getCurrentWeekDailyChartData(responses),
    byWeek: getCurrentMonthWeeklyChartData(responses),
    byChurch,
    byMoveLeader,
  };
}
