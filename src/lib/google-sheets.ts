import { google } from "googleapis";
import { normalizeRows } from "./normalize-responses";

const requiredEnv = [
  "GOOGLE_SHEET_ID",
  "GOOGLE_SHEET_RANGE",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
] as const;

type GoogleEnvKey = (typeof requiredEnv)[number];

function getEnvValue(key: GoogleEnvKey): string | undefined {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    return undefined;
  }

  return value.trim();
}

export function getMissingGoogleEnv(): string[] {
  return requiredEnv.filter((key) => !getEnvValue(key));
}

function getGooglePrivateKey(): string {
  const privateKey = getEnvValue("GOOGLE_PRIVATE_KEY");

  if (!privateKey) {
    throw new Error("GOOGLE_PRIVATE_KEY não configurada.");
  }

  return privateKey
    .replace(/^"|"$/g, "")
    .replace(/^'|'$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();
}

function getGoogleServiceAccountEmail(): string {
  const email = getEnvValue("GOOGLE_SERVICE_ACCOUNT_EMAIL");

  if (!email) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL não configurado.");
  }

  return email.replace(/^"|"$/g, "").replace(/^'|'$/g, "").trim();
}

function getGoogleSheetId(): string {
  const sheetId = getEnvValue("GOOGLE_SHEET_ID");

  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID não configurado.");
  }

  return sheetId.replace(/^"|"$/g, "").replace(/^'|'$/g, "").trim();
}

function getGoogleSheetRange(): string {
  const range = getEnvValue("GOOGLE_SHEET_RANGE");

  if (!range) {
    throw new Error("GOOGLE_SHEET_RANGE não configurado.");
  }

  return range.trim();
}

export async function fetchSheetResponses() {
  const missingEnv = getMissingGoogleEnv();

  if (missingEnv.length > 0) {
    throw new Error(`Variáveis ausentes: ${missingEnv.join(", ")}`);
  }

  const auth = new google.auth.JWT({
    email: getGoogleServiceAccountEmail(),
    key: getGooglePrivateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: getGoogleSheetId(),
    range: getGoogleSheetRange(),
  });

  const values = result.data.values ?? [];
  const [headers = [], ...rows] = values;

  const normalizedHeaders = headers.map((header) => String(header ?? "").trim());

  const normalizedRows = rows
    .filter((row) =>
      row.some((cell) => String(cell ?? "").trim() !== "")
    )
    .map((row) => row.map((cell) => String(cell ?? "").trim()));

  return normalizeRows(normalizedHeaders, normalizedRows);
}