import { google } from "googleapis";
import { normalizeRows } from "./normalize-responses";

const requiredEnv = [
  "GOOGLE_SHEET_ID",
  "GOOGLE_SHEET_RANGE",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
] as const;

export function getMissingGoogleEnv(): string[] {
  return requiredEnv.filter((key) => !process.env[key]);
}

export async function fetchSheetResponses() {
  const missingEnv = getMissingGoogleEnv();

  if (missingEnv.length > 0) {
    throw new Error(`Variaveis ausentes: ${missingEnv.join(", ")}`);
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: process.env.GOOGLE_SHEET_RANGE,
  });

  const values = result.data.values ?? [];
  const [headers = [], ...rows] = values;

  return normalizeRows(headers.map(String), rows.map((row) => row.map(String)));
}
