// Generado en https://quicktype.io

export interface JwtPayload {
  id_usuario: number;
  nombre: string;
  apellido: string;
  type: string;
  iat?: number;
  exp?: number;
  rol: Rol;
  pantallas: Pantalla[];
  jti?: string;
}

export interface Rol {
  codigo: string;
  nombre: string;
}

export interface Pantalla {
  codigo: string;
  estado?: string;
  permisos: Permiso[];
}

export interface Permiso {
  codigo: string;
  estado?: string;
}
