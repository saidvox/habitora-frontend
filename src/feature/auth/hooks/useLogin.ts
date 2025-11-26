// src/feature/auth/hooks/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "../api/auth";
import type { LoginRequest, AuthMessageResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";

type UseLoginOptions = {
  onSuccess?: (data: AuthMessageResponse) => void;
  onError?: (error: unknown) => void;
};

export const useLogin = (options?: UseLoginOptions) => {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const queryClient = useQueryClient();

  return useMutation<AuthMessageResponse, unknown, LoginRequest>({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setAuthenticated(true);
      // store token and set Authorization header for future requests
      if (data && typeof data === "object" && "accessToken" in data) {
        const token = data.accessToken;
        // persist in store (which also persists to localStorage)
        useAuthStore.getState().setToken(token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      queryClient.removeQueries({
        queryKey: ["usuario-propiedades-simple"],
        exact: true,
      });

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      setAuthenticated(false);
      options?.onError?.(error);
    },
  });
};
