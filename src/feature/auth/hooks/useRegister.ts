// src/feature/auth/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api/auth";
import type { RegisterRequest, AuthMessageResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";

type UseRegisterOptions = {
  onSuccess?: (data: AuthMessageResponse) => void;
  onError?: (error: unknown) => void;
};

export const useRegister = (options?: UseRegisterOptions) => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<AuthMessageResponse, unknown, RegisterRequest>({
    mutationFn: registerRequest,
    onSuccess: (data, payload) => {
      const { nombreCompleto, email, telefonoWhatsapp } = payload;

      setUser({
        nombreCompleto,
        email,
        telefonoWhatsapp,
      });

      // store access token if returned and set header
      if (data && typeof data === "object" && "accessToken" in data) {
        const token = data.accessToken;
        useAuthStore.getState().setToken(token);
        useAuthStore.getState().setAuthenticated(true);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
