import { Pantalla } from "./jwt-payload.interface";

export interface UserContext {
  idUsuario: number;
  pantallas: Pantalla[];
}
