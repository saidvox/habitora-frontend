// src/feature/start/components/WelcomeNewUser.tsx

import { useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import HaloBackground from "./HaloBackground";
import { useTheme } from "@/components/theme-provider";

// 👇 clave: tupla de 4 números, no number[]
const EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      ease: EASING,
      duration: 1.4,
      delayChildren: 0.25,
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ease: EASING,
      duration: 1.1,
    },
  },
};

export default function WelcomeNewUser() {
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  // clases derivadas del tema (memo para no recalcular en cada render)
  const { titleClass, textClass } = useMemo(() => {
    const titleColor = isDark ? "text-white" : "text-slate-900";
    const textColor = isDark ? "text-white/85" : "text-slate-700";

    const shadow =
      isDark
        ? "drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]"
        : "drop-shadow-[0_2px_10px_rgba(148,163,184,0.45)]";

    return {
      titleClass: `${titleColor} ${shadow}`,
      textClass: textColor,
    };
  }, [isDark]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (timeoutRef.current !== null) return;

    timeoutRef.current = setTimeout(() => {
      navigate("/onboarding");
    }, 3400); // 3.4s después de terminar la animación
  }, [navigate]);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden text-center">
      <HaloBackground />

      <motion.div
        className="relative z-10 px-4 max-w-2xl space-y-6"
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
      </motion.div>
    </main>
  );
}
