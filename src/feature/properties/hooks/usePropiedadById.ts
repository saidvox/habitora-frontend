// src/feature/properties/hooks/usePropiedadById.ts

import { useQuery } from "@tanstack/react-query";
import { getPropiedadById } from "../api/properties";
import type { Propiedad } from "../types";

/**
 * Hook para obtener una propiedad por ID.
 * - Usa React Query.
 * - No reintenta automáticamente si da error (ej. 404).
 */
export function usePropiedadById(id: number | null) {
  return useQuery<Propiedad, unknown>({
    queryKey: ["propiedad", id],
    queryFn: () => getPropiedadById(id as number),
    enabled: id !== null, // solo se ejecuta si tenemos un id válido
    retry: false, // para que un 404 no haga reintentos en bucle
  });
}
