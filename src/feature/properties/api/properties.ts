// src/feature/properties/api/properties.ts

import axios from "@/lib/axios";
import type { Propiedad } from "../types";


export async function getPropiedadById(id: number): Promise<Propiedad> {
  const { data } = await axios.get<Propiedad>(`/api/propiedades/${id}`);
  return data;
}
