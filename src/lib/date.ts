const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const numericDateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function parseBrazilianDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  const match = trimmedValue.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );

  if (!match) {
    return null;
  }

  const [, day, month, year, hour = "0", minute = "0", second = "0"] = match;
  const normalizedYear = year.length === 2 ? `20${year}` : year;
  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(normalizedYear);
  const parsed = new Date(
    yearNumber,
    monthNumber - 1,
    dayNumber,
    Number(hour),
    Number(minute),
    Number(second),
  );

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== yearNumber ||
    parsed.getMonth() !== monthNumber - 1 ||
    parsed.getDate() !== dayNumber
  ) {
    return null;
  }

  return parsed;
}

export function parseFormDate(value: string): Date | null {
  const brazilianDate = parseBrazilianDate(value);

  if (brazilianDate) {
    return brazilianDate;
  }

  const trimmedValue = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmedValue)) {
    return null;
  }

  const nativeDate = new Date(trimmedValue);
  return Number.isNaN(nativeDate.getTime()) ? null : nativeDate;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysAgo(days: number, from = new Date()): Date {
  const date = startOfDay(from);
  date.setDate(date.getDate() - days);
  return date;
}

export function isSameDay(first: Date, second: Date): boolean {
  return startOfDay(first).getTime() === startOfDay(second).getTime();
}

export function formatShortDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatFullDate(date: Date): string {
  return fullDateFormatter.format(date).replace(".", "");
}

export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date).replace(".", "");
}

export function formatNumericDateTime(date: Date): string {
  return numericDateTimeFormatter.format(date).replace(",", ",");
}

export function getWeekdayName(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(date)
    .replace(".", "");
}
