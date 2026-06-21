import type { FormResponse } from "@/types/response";
import { normalizeChurchName, normalizeMoveLeader } from "./churches";

const fieldAliases = {
  timestamp: ["timestamp", "carimbo de data/hora", "data", "data de inscricao", "criado em"],
  name: ["nome", "name", "nome completo"],
  email: ["email", "e-mail", "mail"],
  phone: ["telefone", "whatsapp", "celular", "phone"],
  church: ["3. de qual igreja voce e?", "3. de qual igreja você é?", "igreja"],
  moveLeader: [
    "voce e lider da rede move em sua igreja?",
    "você é líder da rede move em sua igreja?",
    "lider da rede move",
  ],
};

function normalizeKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function pick(raw: Record<string, string>, aliases: string[]): string {
  const normalizedEntries = Object.entries(raw).map(([key, value]) => [
    normalizeKey(key),
    value,
  ]);

  for (const alias of aliases) {
    const match = normalizedEntries.find(([key]) => key.includes(normalizeKey(alias)));
    if (match?.[1]) {
      return String(match[1]).trim();
    }
  }

  return "";
}

export function normalizeRows(headers: string[], rows: string[][]): FormResponse[] {
  const normalizedHeaders = headers.map((header) => String(header).trim());

  return rows
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row, index) => {
      const raw = normalizedHeaders.reduce<Record<string, string>>((acc, header, columnIndex) => {
        acc[header] = String(row[columnIndex] ?? "").trim();
        return acc;
      }, {});

      return {
        id: `${pick(raw, fieldAliases.timestamp) || index}-${index}`,
        timestamp: pick(raw, fieldAliases.timestamp),
        name: pick(raw, fieldAliases.name) || "Sem nome",
        email: pick(raw, fieldAliases.email),
        phone: pick(raw, fieldAliases.phone),
        church: normalizeChurchName(pick(raw, fieldAliases.church)),
        moveLeader: normalizeMoveLeader(pick(raw, fieldAliases.moveLeader)),
        raw,
      };
    });
}
