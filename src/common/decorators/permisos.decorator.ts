import { SetMetadata } from "@nestjs/common";
import { Pantalla } from "src/interfaces/jwt-payload.interface";

export const PERMISOS_KEY = "permisos";
export const Permisos = (permisos: Pantalla) =>
  SetMetadata(PERMISOS_KEY, permisos);
