// src/feature/start/pages/StartPage.tsx

import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import HaloBackground from "../components/HaloBackground";
import { useUsuarioPropiedades } from "../hooks/useUsuarioPropiedades";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

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

  const setCurrentProperty = useCurrentPropertyStore(
    (state) => state.setCurrentProperty
  );
  const clearCurrentProperty = useCurrentPropertyStore(
    (state) => state.clearCurrentProperty
  );

  useEffect(() => {
    // Al entrar a /start limpiamos la propiedad actual
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
      setSelected(propiedad.id);

      setTimeout(() => {
        if (propiedad.nueva) {
          navigate("/onboarding");
          return;
        }

        // Guardamos la propiedad en el store
        setCurrentProperty(propiedad.id, propiedad.nombre);

        // Navegamos a /app/:propertyId
        navigate(`/app/${propiedad.id}`);
      }, 250);
    },
    [navigate, setCurrentProperty]
  );

  // -----------------------------------------
  // ⭐ ANIMACIÓN SUAVE AL VOLVER A INICIO
  // -----------------------------------------
  const goHomeSmooth = () => {
    document.body.style.transition = "opacity 0.25s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      navigate("/");

      setTimeout(() => {
        document.body.style.opacity = "1";
      }, 50);
    }, 250);
  };
  // -----------------------------------------

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center text-white">
        <HaloBackground />
        <Spinner />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center text-white">
        <HaloBackground />
        <p className="text-sm text-red-300">
          No se pudieron cargar tus propiedades. Intenta nuevamente.
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center text-white">
      <HaloBackground />

      <h2 className="text-4xl md:text-3xl font-bold mb-12 drop-shadow-[0_3px_15px_rgba(0,0,0,0.6)]">
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
              }`}
            >
              <div
                className={`
                  relative w-44 h-44 rounded-full overflow-hidden
                  border bg-neutral-900/70
                  shadow-[0_0_14px_rgba(0,0,0,0.85)]
                  transition-shadow duration-150 ease-out
                  ${
                    isSelected
                      ? "border-neutral-200/80 shadow-[0_0_26px_rgba(220,220,220,0.9)]"
                      : "border-white/15 group-hover:shadow-[0_0_22px_rgba(220,220,220,0.8)]"
                  }
                `}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  {isNew ? (
                    <Plus className="w-10 h-10" />
                  ) : (
                    <Building2 className="w-10 h-10" />
                  )}
                </div>
              </div>

              <div className="mt-5 text-center space-y-1">
                <p className="text-sm font-semibold leading-tight">
                  {propiedad.nombre}
                </p>
                <p className="text-xs text-white/70 leading-tight">
                  {propiedad.direccion}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-16 text-sm text-white/70">
        Pulsa una propiedad para administrar o registra una nueva.
      </p>

      <div className="mt-6">
        <Button
          variant="secondary"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-2 rounded-full shadow-lg transform-gpu hover:-translate-y-0.5"
          onClick={goHomeSmooth}
        >
          Ir a Inicio
        </Button>
      </div>
    </main>
  );
}
