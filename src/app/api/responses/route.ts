import { NextResponse } from "next/server";
import { fetchSheetResponses, getMissingGoogleEnv } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const missingEnv = getMissingGoogleEnv();

  if (missingEnv.length > 0) {
    return NextResponse.json(
      {
        error: "GOOGLE_ENV_MISSING",
        message: "Variaveis do Google Sheets nao configuradas.",
        missingEnv,
      },
      { status: 500 },
    );
  }

  try {
    const responses = await fetchSheetResponses();
    return NextResponse.json({ responses, fetchedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json(
      {
        error: "GOOGLE_SHEETS_ERROR",
        message,
      },
      { status: 500 },
    );
  }
}
