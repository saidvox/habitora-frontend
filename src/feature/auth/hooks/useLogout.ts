// src/feature/auth/hooks/useLogout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutRequest } from "../api/auth";
import type { AuthMessageResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";

type UseLogoutOptions = {
  onSuccess?: (data: AuthMessageResponse | null) => void;
  onError?: (error: unknown) => void;
};

export const useLogout = (options?: UseLogoutOptions) => {
  const clearAuth = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const performCleanup = () => {
    clearAuth();
    // remove Authorization header and token
    try {
      delete axiosInstance.defaults.headers.common["Authorization"];
    } catch (e) {
      // ignore
    }
    useAuthStore.getState().setToken(null);

    queryClient.removeQueries({
      queryKey: ["usuario-propiedades-simple"],
      exact: true,
    });
  };

  return useMutation<AuthMessageResponse, unknown, void>({
    mutationFn: logoutRequest,
    onMutate: () => {
      // Opcional: Podríamos limpiar aquí si quisiéramos ser optimistas,
      // pero onSettled es más seguro para esperar a que termine la petición (aunque falle).
    },
    onSettled: (data, error) => {
      // Se ejecuta SIEMPRE, haya éxito o error
      performCleanup();

      if (error) {
        // Si hubo error, notificamos pero ya limpiamos la sesión
        options?.onError?.(error);
      } else {
        // Si hubo éxito, notificamos
        options?.onSuccess?.(data as AuthMessageResponse);
      }
    },
  });
};
