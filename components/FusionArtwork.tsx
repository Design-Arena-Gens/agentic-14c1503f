"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CANVAS_SIZE = 720;

type RenderContext = {
  ctx: CanvasRenderingContext2D;
  size: number;
  center: number;
  radius: number;
};

export default function FusionArtwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(true);

  const devicePixelRatioValue = useMemo(() => {
    if (typeof window === "undefined") {
      return 1;
    }
    return Math.min(window.devicePixelRatio ?? 1, 2);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const scale = devicePixelRatioValue;
    canvas.width = CANVAS_SIZE * scale;
    canvas.height = CANVAS_SIZE * scale;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    resetTransform(context, scale);
    renderArtwork(context);
    setIsRendering(false);

    const handleResize = () => {
      const newScale = Math.min(window.devicePixelRatio, 2);
      canvas.width = CANVAS_SIZE * newScale;
      canvas.height = CANVAS_SIZE * newScale;
      resetTransform(context, newScale);
      renderArtwork(context);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [devicePixelRatioValue]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const link = document.createElement("a");
    link.download = "vinyle-oreo-fusion.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="fusion">
      <div className="fusion__canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="fusion__canvas"
          aria-label="Illustration fusionnée d'un vinyle et d'un biscuit Oreo"
          role="img"
        />
      </div>
      <div className="fusion__actions">
        <button
          type="button"
          className="fusion__button"
          onClick={handleDownload}
          disabled={isRendering}
        >
          Télécharger l&apos;image
        </button>
        <p className="fusion__note">
          Fichier PNG 720×720 px généré localement pour préserver la qualité.
        </p>
      </div>
    </section>
  );
}

function renderArtwork(ctx: CanvasRenderingContext2D) {
  const size = CANVAS_SIZE;
  const center = size / 2;
  const radius = size * 0.36;
  const renderContext: RenderContext = { ctx, size, center, radius };

  paintBackground(renderContext);
  paintShadow(renderContext);
  paintVinylHalf(renderContext);
  paintOreoHalf(renderContext);
  paintSpecularHighlight(renderContext);
  paintLabelText(renderContext);
}

function resetTransform(ctx: CanvasRenderingContext2D, scale: number) {
  if (typeof ctx.resetTransform === "function") {
    ctx.resetTransform();
  } else {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  ctx.scale(scale, scale);
}

function paintBackground({ ctx, size, center }: RenderContext) {
  const gradient = ctx.createRadialGradient(
    center,
    center,
    size * 0.15,
    center,
    center,
    size * 0.6
  );
  gradient.addColorStop(0, "#1b2233");
  gradient.addColorStop(1, "#05070d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const rand = createSeededRandom(0xdecafbad);
  for (let i = 0; i < 120; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const r = rand() * 2.2 + 0.4;
    const alpha = 0.08 + rand() * 0.08;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintShadow({ ctx, center, radius }: RenderContext) {
  ctx.save();
  ctx.translate(center, center + radius * 0.35);
  ctx.scale(1, 0.3);
  const grad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius * 1.1);
  grad.addColorStop(0, "rgba(8, 12, 18, 0.4)");
  grad.addColorStop(1, "rgba(8, 12, 18, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintVinylHalf({ ctx, center, radius, size }: RenderContext) {
  const vinylGradient = ctx.createLinearGradient(center - radius, 0, center, 0);
  vinylGradient.addColorStop(0, "#080a10");
  vinylGradient.addColorStop(0.45, "#0d1018");
  vinylGradient.addColorStop(1, "#1c2436");

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(center, center - radius);
  ctx.arc(center, center, radius, -Math.PI / 2, Math.PI / 2, true);
  ctx.closePath();
  ctx.fillStyle = vinylGradient;
  ctx.fill();

  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  for (let i = 0; i < 16; i += 1) {
    const grooveRadius = radius * (1 - i * 0.05);
    if (grooveRadius < radius * 0.2) {
      break;
    }
    ctx.beginPath();
    ctx.arc(center, center, grooveRadius, -Math.PI / 2, Math.PI / 2, true);
    const grooveAlpha = 0.25 - i * 0.01;
    ctx.strokeStyle = `rgba(60, 82, 120, ${grooveAlpha})`;
    ctx.stroke();
  }

  const stickerRadius = radius * 0.36;
  const stickerGradient = ctx.createRadialGradient(
    center - radius * 0.4,
    center - stickerRadius * 0.3,
    stickerRadius * 0.2,
    center - radius * 0.45,
    center,
    stickerRadius * 1.4
  );
  stickerGradient.addColorStop(0, "#f4f4f4");
  stickerGradient.addColorStop(1, "#d1d5db");
  ctx.beginPath();
  ctx.arc(center - radius * 0.35, center, stickerRadius, 0, Math.PI * 2);
  ctx.fillStyle = stickerGradient;
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#2b3140";
  ctx.arc(center - radius * 0.35, center, radius * 0.08, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 22; i += 1) {
    const angle = (-Math.PI / 2 + (Math.PI * (i + 0.5)) / 22) * 1.05;
    const length = radius * 0.15;
    const inner = radius * 0.55;
    ctx.beginPath();
    ctx.moveTo(
      center + Math.cos(angle) * inner,
      center + Math.sin(angle) * inner
    );
    ctx.lineTo(
      center + Math.cos(angle) * (inner - length),
      center + Math.sin(angle) * (inner - length)
    );
    ctx.strokeStyle = "rgba(160, 180, 220, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function paintOreoHalf({ ctx, center, radius }: RenderContext) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(center, center - radius);
  ctx.arc(center, center, radius, -Math.PI / 2, Math.PI / 2, false);
  ctx.closePath();

  const cookieGradient = ctx.createLinearGradient(center, 0, center + radius, 0);
  cookieGradient.addColorStop(0, "#2d1408");
  cookieGradient.addColorStop(0.4, "#3a1d10");
  cookieGradient.addColorStop(1, "#1b0904");

  ctx.fillStyle = cookieGradient;
  ctx.fill();

  const rand = createSeededRandom(0x0ddc0ff3);

  for (let i = 0; i < 80; i += 1) {
    const angle = rand() * Math.PI - Math.PI / 2;
    const distance = radius * (0.2 + rand() * 0.7);
    const x = center + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance;
    const dotRadius = 2.2 + rand() * 1.6;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 248, 230, ${0.1 + rand() * 0.1})`;
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  const ridgeCount = 32;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2.6;
  for (let i = 0; i < ridgeCount; i += 1) {
    const angle = (-Math.PI / 2 + (Math.PI * i) / ridgeCount) * 0.98;
    const outer = radius * 0.98;
    const inner = radius * 0.72;
    ctx.beginPath();
    ctx.moveTo(
      center + Math.cos(angle) * inner,
      center + Math.sin(angle) * inner
    );
    ctx.lineTo(
      center + Math.cos(angle) * outer,
      center + Math.sin(angle) * outer
    );
    ctx.stroke();
  }

  const creamRadius = radius * 0.52;
  const creamGradient = ctx.createRadialGradient(
    center + radius * 0.28,
    center - radius * 0.22,
    creamRadius * 0.35,
    center + radius * 0.15,
    center,
    creamRadius * 1.2
  );
  creamGradient.addColorStop(0, "#ffffff");
  creamGradient.addColorStop(1, "#f5f0e6");

  ctx.beginPath();
  ctx.arc(center + radius * 0.25, center, creamRadius, 0, Math.PI * 2);
  ctx.fillStyle = creamGradient;
  ctx.fill();

  const embossRand = createSeededRandom(0xabcddcba);
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = "rgba(35, 18, 11, 0.7)";
  for (let i = 0; i < 3; i += 1) {
    const tRadius = creamRadius * (0.45 + i * 0.15);
    ctx.beginPath();
    ctx.arc(center + radius * 0.25, center, tRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 240, 220, 0.22)";
  for (let i = 0; i < 40; i += 1) {
    const angle = embossRand() * Math.PI * 2;
    const distance = creamRadius * (0.3 + embossRand() * 0.7);
    const x = center + radius * 0.25 + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance;
    const r = 2 + embossRand() * 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const crumbRand = createSeededRandom(0xfeedface);
  for (let i = 0; i < 50; i += 1) {
    const angle = crumbRand() * Math.PI - Math.PI / 2;
    const distance = radius * (1.0 + crumbRand() * 0.25);
    const x = center + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance;
    const size = 2 + crumbRand() * 4;
    const rotation = crumbRand() * Math.PI;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(1, 0.6 + crumbRand() * 0.4);
    const crumbGradient = ctx.createLinearGradient(-size, 0, size, 0);
    crumbGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    crumbGradient.addColorStop(0.5, `rgba(248, 205, 140, ${0.15 + crumbRand() * 0.15})`);
    crumbGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = crumbGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function paintSpecularHighlight({ ctx, center, radius }: RenderContext) {
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(-Math.PI / 8);
  const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.45, "rgba(255, 255, 255, 0.04)");
  gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.12)");
  gradient.addColorStop(0.75, "rgba(255, 255, 255, 0.02)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.05, radius * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintLabelText({ ctx, center, radius }: RenderContext) {
  ctx.save();
  ctx.translate(center - radius * 0.35, center);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#1f2937";
  ctx.font = `500 ${radius * 0.12}px "Futura", "Avenir", "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("SIDE O", 0, radius * 0.05);
  ctx.font = `600 ${radius * 0.18}px "Futura", "Avenir", "Inter", sans-serif`;
  ctx.fillText("O•VINYL", 0, radius * -0.18);
  ctx.restore();

  ctx.save();
  ctx.translate(center + radius * 0.25, center);
  ctx.fillStyle = "rgba(255, 248, 230, 0.85)";
  ctx.font = `700 ${radius * 0.12}px "Avenir", "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("OREO", 0, -radius * 0.05);
  ctx.font = `500 ${radius * 0.09}px "Avenir", "Inter", sans-serif`;
  ctx.fillText("CRÈME EDITION", 0, radius * 0.1);
  ctx.restore();
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
