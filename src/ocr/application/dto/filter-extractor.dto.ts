import { IsString, IsOptional } from "class-validator";

/**
 * DTO para filtrar la lista de extractores.
 * Permite buscar por nombre y/o tipo de estrategia.
 */
export class FilterExtractorDto {
  /** Filtrar por nombre (búsqueda parcial, insensible a mayúsculas) */
  @IsOptional()
  @IsString()
  name?: string;

  /** Filtrar por tipo de estrategia (ej: "FI_DEO") */
  @IsOptional()
  @IsString()
  strategyType?: string;
}
