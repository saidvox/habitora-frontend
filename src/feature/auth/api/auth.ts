// src/feature/auth/api/auth.ts
import axiosInstance from "@/lib/axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthMessageResponse,
  TienePropiedadesResponse,
  UsuarioResponse,
} from "../types";

export const registerRequest = async (
  data: RegisterRequest,
): Promise<AuthMessageResponse> => {
  const res = await axiosInstance.post<AuthMessageResponse>(
    "/api/auth/register",
    data,
  );
  return res.data;
};

export const loginRequest = async (
  data: LoginRequest,
): Promise<AuthMessageResponse> => {
  const res = await axiosInstance.post<AuthMessageResponse>(
    "/api/auth/login",
    data,
  );
  return res.data;
};

export const logoutRequest = async (): Promise<AuthMessageResponse> => {
  const res = await axiosInstance.post<AuthMessageResponse>(
    "/api/auth/logout",
  );
  return res.data;
};

export const checkTienePropiedades = async (): Promise<TienePropiedadesResponse> => {
  const res = await axiosInstance.get<TienePropiedadesResponse>(
    "/api/usuarios/tiene-propiedades",
  );
  return res.data;
};

export const getUsuarioById = async (id: number): Promise<UsuarioResponse> => {
  const res = await axiosInstance.get<UsuarioResponse>(
    `/api/usuarios/${id}`,
  );
  return res.data;
};
