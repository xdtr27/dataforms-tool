export const KNOWN_CHURCHES = [
  "IMW 1 de Austin",
  "IMW Cacuia",
  "IMW Central de Austin",
  "IMW Cobrex",
  "IMW Coqueiros",
  "IMW Getsemani",
  "IMW Jardim Excelsior",
  "IMW Jardim Iguacu",
  "IMW Japeri",
  "IMW Pedra Lisa",
  "IMW Ponto Chic",
  "IMW Queimados",
  "IMW Valdariosa",
];

export type LeaderFilter = "all" | "leaders" | "nonLeaders" | "notInformed";

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function normalizeChurchName(value: string): string {
  return value.trim().replace(/\s+/g, " ") || "Nao informado";
}

export function normalizeMoveLeader(value: string | null | undefined): string {
  const original = String(value ?? "").trim().replace(/\s+/g, " ");
  const normalized = normalizeText(original);

  if (!normalized) {
    return "Não informado";
  }

  if (normalized === "sim" || normalized.startsWith("sim ") || normalized === "sou") {
    return "Sim";
  }

  if (
    normalized === "nao" ||
    normalized === "não" ||
    normalized.startsWith("nao ") ||
    normalized.startsWith("não ")
  ) {
    return "Não";
  }

  return original;
}

export function getLeaderFilter(value: string): Exclude<LeaderFilter, "all"> {
  const normalized = normalizeText(normalizeMoveLeader(value));

  if (normalized === "sim") {
    return "leaders";
  }

  if (normalized === "nao informado") {
    return "notInformed";
  }

  return "nonLeaders";
}

export function getAllChurchOptions(responseChurches: string[]): string[] {
  const options = [...KNOWN_CHURCHES, ...responseChurches]
    .map(normalizeChurchName)
    .filter((church) => church !== "Nao informado");
  const unique = new Map<string, string>();

  for (const church of options) {
    unique.set(normalizeText(church), church);
  }

  return Array.from(unique.values()).sort((first, second) =>
    first.localeCompare(second, "pt-BR"),
  );
}

export function getMissingChurches(responseChurches: string[]): string[] {
  const responseSet = new Set(
    responseChurches
      .map(normalizeChurchName)
      .filter((church) => church !== "Nao informado")
      .map(normalizeText),
  );

  return KNOWN_CHURCHES.filter((church) => !responseSet.has(normalizeText(church)));
}
