// src/feature/start/pages/StartPage.tsx

import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useUsuarioPropiedades } from "../hooks/useUsuarioPropiedades";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { useHaloMotionStore } from "@/store/useHaloMotionStore";
import OnboardingForm from "../components/OnboardingForm";

type PropiedadCard = {
  id: number;
  nombre: string;
  direccion: string;
  cantidadPisos?: number;
  nueva?: boolean;
};

export default function StartPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setCurrentProperty = useCurrentPropertyStore(
    (state) => state.setCurrentProperty
  );
  const clearCurrentProperty = useCurrentPropertyStore(
    (state) => state.clearCurrentProperty
  );

  // Al entrar a /start limpiamos la propiedad actual
  useEffect(() => {
    clearCurrentProperty();
  }, [clearCurrentProperty]);

  const { data, isLoading, isError } = useUsuarioPropiedades();

  const propiedades: PropiedadCard[] = useMemo(() => {
    const base =
      data?.propiedades.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        direccion: p.direccion,
      })) ?? [];

    return [
      ...base,
      {
        id: -1,
        nombre: "Agregar propiedad",
        direccion: "Registrar nueva propiedad",
        nueva: true,
      },
    ];
  }, [data]);

  const handleClick = useCallback(
    (propiedad: PropiedadCard) => {
      if (isTransitioning) return; // Evitar clicks múltiples durante transición
      
      setSelected(propiedad.id);
      if (propiedad.nueva) {
        // Acelerar SOLO durante la transición, luego volver a velocidad normal
        setIsTransitioning(true);
        const store = useHaloMotionStore.getState();
        // Cancelar animación activa si existe
        if (store._animId) {
          cancelAnimationFrame(store._animId);
          useHaloMotionStore.setState({ _animId: undefined, speedFactor: 1 });
        }
        // Acelerar temporalmente: sube, mantiene brevemente, baja a normal
        // Total: 1200ms (400 subida + 400 hold + 400 bajada)
        setTimeout(() => {
          store.accelerate(2, 1200, 400);
        }, 50);
        setShowOnboarding(true);
        setTimeout(() => setIsTransitioning(false), 400);
        return;
      }
      setTimeout(() => {
        setCurrentProperty(propiedad.id, propiedad.nombre);
        navigate(`/app/${propiedad.id}`);
      }, 250);
    },
    [navigate, setCurrentProperty, isTransitioning]
  );

  const handleOnboardingComplete = useCallback(() => {
    // También resetear velocidad al completar
    const store = useHaloMotionStore.getState();
    if (store._animId) {
      cancelAnimationFrame(store._animId);
    }
    useHaloMotionStore.setState({ _animId: undefined, speedFactor: 1 });
    setShowOnboarding(false);
    setIsTransitioning(false);
    navigate("/start");
  }, [navigate]);

  const handleOnboardingBack = useCallback(() => {
    // Reset simple a velocidad normal
    const store = useHaloMotionStore.getState();
    if (store._animId) {
      cancelAnimationFrame(store._animId);
      useHaloMotionStore.setState({ _animId: undefined });
    }
    useHaloMotionStore.setState({ speedFactor: 1 });
    setShowOnboarding(false);
    setIsTransitioning(false);
  }, []);

  // -----------------------------------------
  // ⭐ ANIMACIÓN SUAVE AL VOLVER A INICIO
  // -----------------------------------------
  const goHomeSmooth = useCallback(() => {
    document.body.style.transition = "opacity 0.25s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      navigate("/");

      setTimeout(() => {
        document.body.style.opacity = "1";
      }, 50);
    }, 250);
  }, [navigate]);
  // -----------------------------------------

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center text-slate-900 dark:text-white">
        <Spinner />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center text-slate-900 dark:text-white">
        <p className="text-sm text-red-500 dark:text-red-300">
          No se pudieron cargar tus propiedades. Intenta nuevamente.
        </p>
      </main>
    );
  }

  const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <AnimatePresence mode="wait">
      {showOnboarding ? (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0, x: 120, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 120 }}
          transition={{ duration: 0.36, ease: easing }}
          className="w-full"
        >
          <OnboardingForm onComplete={handleOnboardingComplete} onBack={handleOnboardingBack} />
        </motion.div>
      ) : (
        <motion.main
          key="selector"
          initial={{ opacity: 0, x: -120 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -120 }}
          transition={{ duration: 0.36, ease: easing }}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center text-slate-900 dark:text-white"
        >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 drop-shadow-[0_3px_12px_rgba(0,0,0,0.25)]">
        Elige una propiedad para gestionar
      </h2>

      <div className="flex flex-wrap justify-center gap-16 px-4">
        {propiedades.map((propiedad) => {
          const isSelected = selected === propiedad.id;
          const isNew = Boolean(propiedad.nueva);

          return (
            <button
              key={propiedad.id}
              type="button"
              onClick={() => handleClick(propiedad)}
              className={`group flex flex-col items-center cursor-pointer outline-none transform-gpu ${
                isSelected ? "-translate-y-1" : "hover:-translate-y-1"
              } transition-transform duration-150`}
            >
              <div
                className={`
                  relative w-44 h-44 rounded-full overflow-hidden
                  border transition-shadow duration-150 ease-out
                  bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                  ${
                    isSelected
                      ? "border-slate-300 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
                      : "border-slate-200 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
                  }
                  dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-950 dark:text-white dark:border-white/15
                  dark:shadow-[0_18px_40px_rgba(0,0,0,0.5)]
                  ${
                    isSelected
                      ? "dark:shadow-[0_22px_55px_rgba(0,0,0,0.7)]"
                      : "dark:group-hover:shadow-[0_22px_55px_rgba(0,0,0,0.6)]"
                  }
                `}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {isNew ? (
                    <Plus className="w-10 h-10" />
                  ) : (
                    <Building2 className="w-10 h-10" />
                  )}
                </div>
              </div>

              <div className="mt-5 text-center space-y-1">
                <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
                  {propiedad.nombre}
                </p>
                <p className="text-xs leading-tight text-slate-500 dark:text-white/70">
                  {propiedad.direccion}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-16 text-sm text-slate-600 dark:text-white/70">
        Pulsa una propiedad para administrar o registra una nueva.
      </p>

      <div className="mt-6">
        <Button
          variant="outline"
          className="
            px-6 py-2 rounded-full shadow-sm transform-gpu hover:-translate-y-0.5
            bg-white/80 hover:bg-white text-slate-900 border-slate-200
            dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/30
          "
          onClick={goHomeSmooth}
        >
          Ir a Inicio
        </Button>
      </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
