import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vinyl Oreo Fusion",
  description: "Génération visuelle d'un concept mi-vinyle mi-Oreo"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
