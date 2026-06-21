import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Forms Dashboard",
  description: "Dashboard pessoal para respostas do Google Forms",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
