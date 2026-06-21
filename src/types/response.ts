export type PeriodFilter = "today" | "7d" | "30d" | "all";

export type ThemeMode = "light" | "dark";

export type FormResponse = {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  church: string;
  moveLeader: string;
  raw: Record<string, string>;
};
