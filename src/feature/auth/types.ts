// src/feature/auth/types.ts

// >>> Coincide con tu RegisterRequest de Spring Boot
export type RegisterRequest = {
  nombreCompleto: string;
  email: string;
  telefonoWhatsapp: string;
  password: string;
};

// >>> Coincide con tu LoginRequest de Spring Boot
export type LoginRequest = {
  email: string;
  password: string;
};

// Por ahora el backend devuelve solo un String ("Registro exitoso", "Login exitoso")
// Backend now devuelve un objeto con el accessToken
// Puede ser un mensaje (string) o el objeto con accessToken que devuelve el backend
export type AuthMessageResponse = string | { accessToken: string };

// Usuario autenticado básico que guardaremos en el store
export type AuthUser = {
  id?: number; // 👈 se completa luego con /tiene-propiedades
  nombreCompleto: string;
  email: string;
  telefonoWhatsapp?: string;
};

export type TienePropiedadesResponse = {
  usuarioId: number;
  tienePropiedades: boolean;
};
export type UsuarioResponse = {
  id: number;
  nombreCompleto: string;
  email: string;
  telefonoWhatsapp: string;
};
