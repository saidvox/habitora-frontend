// src/feature/start/components/OnboardingForm.tsx
import { useState, type FormEvent, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import BuildingAnimation from "./BuildingAnimation";

import { useOnboarding } from "../hooks/useOnboarding";
import { useTheme } from "@/components/theme-provider";
import { ArrowLeft } from "lucide-react";

const MIN_PISOS = 1;
const MAX_PISOS = 10;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

export default function OnboardingForm() {
  const [step, setStep] = useState<1 | 2>(1);

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pisos, setPisos] = useState<number>(1);
  const [pisoResidencia, setPisoResidencia] = useState<number | null>(null);
  const [habitacionesPorPiso, setHabitacionesPorPiso] = useState<number[]>([1]);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { mutate: completarOnboarding, isPending } = useOnboarding({
    onSuccess: () => {
      toast.success("Propiedad y habitaciones creadas correctamente ✨");
      navigate("/start");
    },
    onError: () => {
      toast.error("No se pudo completar el registro de la propiedad.");
    },
  });

  // ========= Handlers =========

  const handlePisosChange = useCallback((rawValue: number) => {
    const parsed = Number.isNaN(rawValue) ? MIN_PISOS : rawValue;
    const cantidad = Math.max(MIN_PISOS, Math.min(parsed, MAX_PISOS));

    setPisos(cantidad);
    setHabitacionesPorPiso((prev) =>
      Array.from({ length: cantidad }, (_, i) => prev[i] || MIN_ROOMS)
    );
    setPisoResidencia((prev) => (prev && prev > cantidad ? null : prev));
  }, []);

  const handleHabitacionChange = useCallback((index: number, rawValue: number) => {
    const parsed = Number.isNaN(rawValue) ? MIN_ROOMS : rawValue;
    const clamped = Math.max(MIN_ROOMS, Math.min(parsed, MAX_ROOMS));

    setHabitacionesPorPiso((prev) => {
      const next = [...prev];
      next[index] = clamped;
      return next;
    });
  }, []);

  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    completarOnboarding({
      propiedad: {
        nombre,
        direccion,
        cantidadPisos: pisos,
        pisoResidenciaDueno: pisoResidencia ?? 0,
      },
      habitacionesPorPiso,
    });
  };

  const handleBackToStart = () => navigate("/start");

  // ========= Clases dependientes del tema (memo) =========

  const {
    headingClass,
    subHeadingClass,
    labelClass,
    inputClass,
    selectTriggerClass,
    selectContentClass,
    separatorClass,
    rightTitleClass,
    rightTextClass,
    backChipClass,
    backButtonClass,
  } = useMemo(() => {
    const heading = isDark ? "text-white" : "text-slate-900";
    const subHeading = isDark ? "text-white/70" : "text-slate-600";
    const labelBase = "text-xs uppercase tracking-wide font-medium";
    const labelColor = isDark ? "text-white/70" : "text-black";

    const inputBase =
      "rounded-xl border text-sm transition-colors duration-150 " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
      "focus-visible:ring-slate-300 focus-visible:ring-offset-transparent";

    const inputColors = isDark
      ? "bg-black/40 border-white/20 text-white placeholder:text-white/40"
      : "bg-white/90 border-slate-300 text-slate-900 placeholder:text-slate-400 " +
        "shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md";

    const selectTriggerColors = isDark
      ? "bg-black/40 border-white/20 text-white"
      : "bg-white/90 border-slate-300 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)]";

    const selectContentColors = isDark
      ? "bg-black/90 border-white/15 text-white"
      : "bg-white border-slate-200 text-slate-900 shadow-lg";

    const separatorColor = isDark ? "bg-white/10" : "bg-slate-200/80";

    const rightTitle = isDark ? "text-white" : "text-slate-900";
    const rightText = isDark ? "text-white/70" : "text-slate-600";

    const backChip = isDark
      ? "border-white/15 bg-black/40 text-white/80 hover:bg-black/70"
      : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white";

    const backBtn = isDark
      ? "border-white/30 text-white hover:bg-white/10"
      : "border-slate-300 text-slate-800 hover:bg-slate-100";

    return {
      headingClass: heading,
      subHeadingClass: subHeading,
      labelClass: `${labelBase} ${labelColor}`,
      inputClass: `${inputBase} ${inputColors}`,
      selectTriggerClass: `${inputBase} ${selectTriggerColors}`,
      selectContentClass: selectContentColors,
      separatorClass: separatorColor,
      rightTitleClass: rightTitle,
      rightTextClass: rightText,
      backChipClass: backChip,
      backButtonClass: backBtn,
    };
  }, [isDark]);

  // ========= Render =========

  return (
    <div
      className="
        w-full max-w-6xl mx-auto
        grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]
        gap-10 lg:gap-16
        items-start lg:items-center
        px-4 py-6 sm:px-8 sm:py-8
      "
    >
      {/* Columna izquierda: formularios */}
      <div className="flex flex-col justify-start">
        {/* Flecha para volver a Start */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBackToStart}
            className={`
              inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
              border backdrop-blur-sm transition-colors
              ${backChipClass}
            `}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a tus propiedades
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-8">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${headingClass}`}>
                Registro de Propiedad
              </h1>
              <p className={`text-sm mt-1 ${subHeadingClass}`}>
                Completa los datos principales de tu inmueble.
              </p>
            </div>

            <Separator className={`hidden sm:block ${separatorClass}`} />

            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <Label className={labelClass}>Nombre de la propiedad</Label>
                <Input
                  className={inputClass}
                  placeholder="Ejemplo: Casa Los Rosales"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className={labelClass}>Dirección o referencia</Label>
                <Input
                  className={inputClass}
                  placeholder="Ejemplo: Av. San Martín 123, Ica"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className={labelClass}>
                  Cantidad de pisos{" "}
                  <span className={isDark ? "text-white/40" : "text-dark"}>
                    ({MIN_PISOS}–{MAX_PISOS})
                  </span>
                </Label>
                <Input
                  type="number"
                  min={MIN_PISOS}
                  max={MAX_PISOS}
                  value={pisos}
                  onChange={(e) => handlePisosChange(Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className={labelClass}>Piso donde resides (dueño)</Label>
                <Select
                  onValueChange={(v) =>
                    v === "none"
                      ? setPisoResidencia(null)
                      : setPisoResidencia(Number(v))
                  }
                  value={
                    pisoResidencia === null ? "none" : pisoResidencia.toString()
                  }
                >
                  <SelectTrigger className={`w-full ${selectTriggerClass}`}>
                    <SelectValue placeholder="Selecciona un piso" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="none">
                      No resido en esta propiedad
                    </SelectItem>
                    {Array.from({ length: pisos }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        Piso {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4 sm:mt-8">
              Siguiente →
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${headingClass}`}>
                Habitaciones por piso
              </h1>
              <p className={`text-sm mt-1 ${subHeadingClass}`}>
                Configura las habitaciones para{" "}
                <strong className={headingClass}>{nombre}</strong>{" "}
                <span className={isDark ? "text-white/40" : "text-slate-400"}>
                  ({MIN_ROOMS}–{MAX_ROOMS} por piso)
                </span>
              </p>
            </div>

            <Separator className={`hidden sm:block ${separatorClass}`} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {Array.from({ length: pisos }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Label
                    className={`w-24 text-sm font-medium ${
                      isDark ? "text-white/80" : "text-slate-700"
                    }`}
                  >
                    Piso {i + 1}
                  </Label>
                  <Input
                    type="number"
                    min={MIN_ROOMS}
                    max={MAX_ROOMS}
                    value={habitacionesPorPiso[i]}
                    onChange={(e) =>
                      handleHabitacionChange(i, Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className={`w-full sm:w-auto ${backButtonClass}`}
                disabled={isPending}
              >
                ← Volver
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isPending}
              >
                {isPending ? "Guardando..." : "Finalizar"}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Columna derecha: building preview */}
      <div className="flex items-center justify-center pt-6 lg:pt-0 mt-6 lg:mt-0">
        <div className="px-2 sm:px-4 py-2 sm:py-6 w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[620px] flex flex-col gap-4">
            <div className="text-center lg:text-right">
              <h2
                className={`text-xl sm:text-2xl font-semibold ${rightTitleClass}`}
              >
                Tu propiedad
              </h2>
              <p className={`text-sm mt-1 ${rightTextClass}`}>
                Vista previa de la estructura del edificio.
              </p>
            </div>

            <div className="w-full overflow-x-auto md:overflow-visible pb-4">
              <div className="min-w-[560px] flex justify-center lg:justify-end">
                <BuildingAnimation
                  pisos={pisos}
                  habitacionesPorPiso={habitacionesPorPiso}
                  highlightFloor={pisoResidencia}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* fin grid */}
    </div>
  );
}
