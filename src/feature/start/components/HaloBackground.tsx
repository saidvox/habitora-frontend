// src/feature/start/components/HaloBackground.tsx
import { useEffect, useRef } from "react";
import * as motion from "motion/react-client";
import { useTheme } from "@/components/theme-provider";

type Halo = {
  color: string;
  size: number;
  speed: number;
  offset: number;
};

export default function HaloBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme(); // "light" | "dark" | "system"

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let t = 0;
    let driftTimer = 0;
    let frameId: number;
    let bgGradient: CanvasGradient | null = null;

    const isDark = theme === "dark";

    // Halos según tema (mismos valores que tú usabas)
    const halos: Halo[] = isDark
      ? [
          { color: "rgba(80, 80, 80, 0.25)", size: 0, speed: 0.01, offset: Math.random() * 1000 },
          { color: "rgba(60, 60, 60, 0.20)", size: 0, speed: 0.012, offset: Math.random() * 1000 },
          { color: "rgba(30, 30, 30, 0.15)", size: 0, speed: 0.008, offset: Math.random() * 1000 },
        ]
      : [
          { color: "rgba(0, 0, 0, 0.20)", size: 0, speed: 0.01, offset: Math.random() * 1000 },
          { color: "rgba(0, 0, 0, 0.12)", size: 0, speed: 0.012, offset: Math.random() * 1000 },
          { color: "rgba(0, 0, 0, 0.07)", size: 0, speed: 0.008, offset: Math.random() * 1000 },
        ];

    let directionX = 0.25;
    let directionY = 0.15;

    const buildBackgroundGradient = () => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      if (isDark) {
        g.addColorStop(0, "#0a0a0a");
        g.addColorStop(1, "#1a1a1a");
      } else {
        g.addColorStop(0, "#ffffff");
        g.addColorStop(1, "#f3f4f6");
      }
      bgGradient = g;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      w = window.innerWidth;
      h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;

      // Dibujamos en coordenadas de “CSS pixels” pero con alta resolución
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildBackgroundGradient();
    };

    const render = () => {
      frameId = requestAnimationFrame(render);
      t += 0.01;
      driftTimer += 0.001;

      // Ajustar tamaños de halos a ancho actual
      halos[0].size = w * 0.9;
      halos[1].size = w * 1.1;
      halos[2].size = w * 1.3;

      if (driftTimer > 10) {
        directionX = (Math.random() - 0.5) * 0.6;
        directionY = (Math.random() - 0.5) * 0.6;
        driftTimer = 0;
      }

      if (!bgGradient) buildBackgroundGradient();
      ctx.fillStyle = bgGradient!;
      ctx.fillRect(0, 0, w, h);

      const baseX = w / 2 + Math.sin(t * 0.1) * 100 * directionX;
      const baseY = h / 2 + Math.cos(t * 0.1) * 100 * directionY;

      halos.forEach((halo, i) => {
        ctx.save();
        ctx.translate(baseX, baseY);
        ctx.rotate(Math.sin(t * 0.15 + i) * 0.4);

        const gradient = ctx.createRadialGradient(0, 0, 200, 0, 0, halo.size);

        if (isDark) {
          gradient.addColorStop(0, halo.color);
          // mismo truco de reemplazar la opacidad que tenías
          gradient.addColorStop(0.3, halo.color.replace("0.25", "0.08"));
          gradient.addColorStop(1, "rgba(255,255,255,0)");
        } else {
          gradient.addColorStop(0, halo.color);
          gradient.addColorStop(0.35, "rgba(0, 0, 0, 0.04)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        }

        ctx.fillStyle = gradient;

        ctx.beginPath();
        const amplitude = 140 + Math.sin(t * halo.speed + halo.offset) * 60;
        const offsetY = Math.sin(t * halo.speed * 0.8 + halo.offset) * 50;

        ctx.moveTo(-w * 1.2, offsetY);
        for (let x = -w * 1.2; x < w * 1.2; x += 40) {
          const y =
            Math.sin(x * 0.002 + t * halo.speed + halo.offset) * amplitude +
            Math.sin(x * 0.001 + t * halo.speed * 1.3 + halo.offset) *
              amplitude *
              0.3 +
            offsetY;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w * 1.2, h);
        ctx.lineTo(-w * 1.2, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    };

    window.addEventListener("resize", resize);
    resize();
    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, [theme]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
}
