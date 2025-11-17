"use client";

import FusionArtwork from "@/components/FusionArtwork";

export default function Page() {
  return (
    <main className="page">
      <header className="hero">
        <span className="hero__eyebrow">Concept visuel</span>
        <h1 className="hero__title">Vinyle x Oreo</h1>
        <p className="hero__subtitle">
          Une illustration fusionnée qui marie la texture d&apos;un disque vinyle
          avec la gourmandise d&apos;un biscuit Oreo. Téléchargez-la en pleine
          résolution pour la partager ou l&apos;imprimer.
        </p>
      </header>
      <FusionArtwork />
    </main>
  );
}
