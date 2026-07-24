import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pill.it",
    template: "%s | Pill.it",
  },
  description:
    "Acompanhamento simples e compartilhado de rotinas de pílulas.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#4b8df6",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
