// src/feature/start/components/WelcomeNewUser.tsx

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import HaloBackground from "./HaloBackground";
import { useTheme } from "@/components/theme-provider";
import { useHaloMotionStore } from "@/store/useHaloMotionStore";

const EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { ease: EASING, duration: 1.4, delayChildren: 0.25, staggerChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ease: EASING, duration: 1.1 },
  },
};

export default function WelcomeNewUser() {
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);

  const { theme } = useTheme();
  const isDark = useMemo(() => {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    // theme === 'system'
    if (typeof window !== "undefined") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }, [theme]);

  const { titleClass, textClass, btnBase, btnTheme, ringBorder } = useMemo(() => {
    const titleColor = isDark ? "text-white" : "text-slate-900";
    const textColor = isDark ? "text-white/85" : "text-slate-700";
    const shadow = isDark
      ? "drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]"
      : "drop-shadow-[0_2px_10px_rgba(148,163,184,0.45)]";
    const btnBase = "relative group px-10 py-4 rounded-full font-semibold text-sm sm:text-base tracking-wide transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
    const btnTheme = isDark
      ? "bg-white/10 hover:bg-white/16 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.28)] focus-visible:ring-white/60"
      : "bg-white/95 backdrop-blur-sm hover:bg-white text-slate-900 shadow-md border border-slate-300/70 focus-visible:ring-slate-400";
    const ringBorder = isDark ? "border border-white/25" : "border border-slate-300";
    return { titleClass: `${titleColor} ${shadow}`, textClass: textColor, btnBase, btnTheme, ringBorder };
  }, [isDark]);

  // Fondo animado continuo con transición suave (tween)
  useEffect(() => {
    const store = useHaloMotionStore.getState();
    // Si ya hay animación previa, la cancelamos
    if (store._animId) {
      cancelAnimationFrame(store._animId);
      useHaloMotionStore.setState({ _animId: undefined });
    }
    // Tween suave hacia velocidad rápida
    let running = true;
    const start = performance.now();
    const initial = store.speedFactor ?? 1;
    const target = 1.8;
    const duration = 1200; // ms

    function animate(now: number) {
      if (!running) return;
      const elapsed = Math.min(now - start, duration);
      const t = elapsed / duration;
      // easeInOutCubic
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const value = initial + (target - initial) * ease;
      useHaloMotionStore.setState({ speedFactor: value });
      if (elapsed < duration) {
        const id = requestAnimationFrame(animate);
        useHaloMotionStore.setState({ _animId: id });
      } else {
        useHaloMotionStore.setState({ speedFactor: target, _animId: undefined });
      }
    }
    const id = requestAnimationFrame(animate);
    useHaloMotionStore.setState({ _animId: id });

    // Al desmontar, restaurar suavemente a 1
    return () => {
      running = false;
      const animId = useHaloMotionStore.getState()._animId;
      if (typeof animId === "number") {
        cancelAnimationFrame(animId);
        useHaloMotionStore.setState({ _animId: undefined });
      }
      const restoreStart = performance.now();
      const from = useHaloMotionStore.getState().speedFactor ?? target;
      const restoreDuration = 900;
      function restore(now: number) {
        const elapsed = Math.min(now - restoreStart, restoreDuration);
        const t = elapsed / restoreDuration;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const value = from + (1 - from) * ease;
        useHaloMotionStore.setState({ speedFactor: value });
        if (elapsed < restoreDuration) {
          const id = requestAnimationFrame(restore);
          useHaloMotionStore.setState({ _animId: id });
        } else {
          useHaloMotionStore.setState({ speedFactor: 1, _animId: undefined });
        }
      }
      requestAnimationFrame(restore);
    };
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (timeoutRef.current) return;
    timeoutRef.current = setTimeout(() => setReady(true), 800);
  }, []);

  // Fallback por si no dispara onAnimationComplete
  useEffect(() => {
    const fallback = setTimeout(() => setReady((r) => r || true), 3500);
    return () => clearTimeout(fallback);
  }, []);

  const handleContinue = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    navigate("/onboarding");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden text-center">
      <HaloBackground />
      <motion.div
        className="relative z-10 px-4 max-w-2xl space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={handleAnimationComplete}
      >
        <motion.h1
          variants={itemVariants}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${titleClass}`}
        >
          ¡Bienvenido a Habitora!
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className={`text-base sm:text-lg leading-relaxed ${textClass}`}
        >
          Hemos creado tu cuenta. Ahora vamos a configurar tu primera propiedad
          para que puedas empezar a gestionar alquileres, inquilinos y pagos
          desde un solo lugar.
        </motion.p>
        <div className="flex justify-center min-h-[88px]">
          <AnimatePresence>
            {ready && (
              <motion.button
                key="continue-btn"
                initial={{ opacity: 0, scale: 0.85, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.85, y: 10, filter: "blur(6px)" }}
                transition={{ duration: 0.9, ease: EASING }}
                onClick={handleContinue}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className={`${btnBase} ${btnTheme}`}
              >
                <span className="relative z-10 flex items-center gap-2">Continuar</span>
                <motion.div
                  className={`absolute inset-0 rounded-full pointer-events-none ${ringBorder}`}
                  initial={{ opacity: 0.45 }}
                  animate={{ opacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
