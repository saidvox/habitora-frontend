import { useEffect, useRef, memo } from "react";
import { useTheme } from "@/components/theme-provider";
import { useHaloMotionStore } from "@/store/useHaloMotionStore";

// =========================================================
// VARIABLES GLOBALES (Solución Nuclear)
// =========================================================
let globalFlow = 0;      // Controla el desplazamiento horizontal (EL ÚNICO QUE ACELERA)
let globalBreath = 0;    // Controla la respiración suave (SIEMPRE CONSTANTE)
let globalDrift = 0;     // Dirección aleatoria
let gDirectionX = 0.25;
let gDirectionY = 0.15;

type Halo = {
  color: string;
  size: number;
  speed: number;
  offset: number;
};

function HaloBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  const speedRef = useRef(1);

  useEffect(() => {
    const unsub = useHaloMotionStore.subscribe((s) => {
      speedRef.current = s.speedFactor;
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let frameId: number;
    let bgGradient: CanvasGradient | null = null;

    const isDark = theme === "dark";

    const halos: Halo[] = isDark
      ? [
        { color: "rgba(80, 80, 80, 0.25)", size: 0, speed: 0.02, offset: Math.random() * 1000 },
        { color: "rgba(60, 60, 60, 0.20)", size: 0, speed: 0.025, offset: Math.random() * 1000 },
        { color: "rgba(30, 30, 30, 0.15)", size: 0, speed: 0.015, offset: Math.random() * 1000 },
      ]
      : [
        { color: "rgba(0, 0, 0, 0.20)", size: 0, speed: 0.02, offset: Math.random() * 1000 },
        { color: "rgba(0, 0, 0, 0.12)", size: 0, speed: 0.025, offset: Math.random() * 1000 },
        { color: "rgba(0, 0, 0, 0.07)", size: 0, speed: 0.015, offset: Math.random() * 1000 },
      ];

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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildBackgroundGradient();
    };

    const render = () => {
      frameId = requestAnimationFrame(render);
      const currentSpeed = speedRef.current;

      // -----------------------------------------------------------
      // CORRECCIÓN FINAL:
      // 1. globalFlow: Acelera, pero con un factor pequeño (0.01) para que sea suave.
      globalFlow += 0.01 * currentSpeed;

      // 2. globalBreath: TOTALMENTE CONSTANTE.
      // Eliminamos cualquier suma de 'currentSpeed'. 
      // La altura de la onda NUNCA cambiará por la velocidad.
      globalBreath += 0.003;
      // -----------------------------------------------------------

      globalDrift += 0.001;
      if (globalDrift > 10) {
        gDirectionX = (Math.random() - 0.5) * 0.6;
        gDirectionY = (Math.random() - 0.5) * 0.6;
        globalDrift = 0;
      }

      halos[0].size = w * 0.9;
      halos[1].size = w * 1.1;
      halos[2].size = w * 1.3;

      if (!bgGradient) buildBackgroundGradient();
      ctx.fillStyle = bgGradient!;
      ctx.fillRect(0, 0, w, h);

      const baseX = w / 2 + Math.sin(globalBreath * 0.1) * 100 * gDirectionX;
      const baseY = h / 2 + Math.cos(globalBreath * 0.1) * 100 * gDirectionY;

      halos.forEach((halo, i) => {
        ctx.save();
        ctx.translate(baseX, baseY);

        // Rotación constante y lenta
        ctx.rotate(Math.sin(globalBreath * 0.15 + i) * 0.4);

        const gradient = ctx.createRadialGradient(0, 0, 200, 0, 0, halo.size);

        if (isDark) {
          gradient.addColorStop(0, halo.color);
          gradient.addColorStop(0.3, halo.color.replace("0.25", "0.08"));
          gradient.addColorStop(1, "rgba(255,255,255,0)");
        } else {
          gradient.addColorStop(0, halo.color);
          gradient.addColorStop(0.35, "rgba(0, 0, 0, 0.04)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();

        // -----------------------------------------------------------
        // ZONA DE SEGURIDAD VISUAL
        // Eliminamos la variable 'travelBoost'. No existe.
        // La amplitud es fija, basada solo en la respiración lenta.
        // -----------------------------------------------------------
        const amplitude = (140 + Math.sin(globalBreath + halo.offset) * 60);

        // El offset vertical también es fijo.
        const offsetY = Math.sin(globalBreath * 0.8 + halo.offset) * 50;

        ctx.moveTo(-w * 1.2, offsetY);
        for (let x = -w * 1.2; x < w * 1.2; x += 40) {
          // Solo 'globalFlow' (que tiene la velocidad) afecta la posición X.
          // Esto crea el efecto de "corriente rápida" sin inflar la onda.
          const y =
            Math.sin(x * 0.002 + globalFlow * halo.speed + halo.offset) * amplitude +
            Math.sin(x * 0.001 + globalFlow * halo.speed * 1.3 + halo.offset) * amplitude * 0.3 +
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
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default memo(HaloBackground);