import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidationRule } from '../../domain/enums/validation-rule.enum';

/**
 * DTO para las validaciones de un campo dentro del input de creación.
 */
export class FieldValidationDto {
  /** Regla de validación a aplicar */
  @IsEnum(ValidationRule)
  rule: ValidationRule;

  /** Parámetros de la regla */
  @IsOptional()
  @IsString()
  params?: string;

  /** Mensaje de error personalizado */
  @IsOptional()
  @IsString()
  errorMessage?: string;
}

/**
 * DTO para el esquema de un campo dentro del input de creación.
 */
export class FieldSchemaDto {
  /** Nombre del campo a extraer */
  @IsString()
  fieldName: string;

  /** Tipo de dato esperado */
  @IsString()
  fieldType: string;

  /** Si el campo es obligatorio */
  @IsBoolean()
  required: boolean;

  /** Validaciones del campo */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldValidationDto)
  validations?: FieldValidationDto[];
}

/**
 * DTO para la configuración de la estrategia de extracción.
 */
export class StrategyConfigDto {
  /** Tipo de estrategia (ej: "FI_DEO") */
  @IsString()
  strategyType: string;

  /** URL del endpoint del servicio */
  @IsOptional()
  @IsString()
  endpoint?: string;

  /** Clave de API para autenticación */
  @IsOptional()
  @IsString()
  apiKey?: string;
}

/**
 * DTO para la creación de un nuevo extractor.
 * Valida los datos recibidos desde el resolver de GraphQL
 * antes de pasarlos al servicio de dominio.
 */
export class CreateExtractorDto {
  /** Nombre descriptivo del extractor */
  @IsString()
  name: string;

  /** Descripción del propósito del extractor */
  @IsOptional()
  @IsString()
  description?: string;

  /** Esquema de campos a extraer */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldSchemaDto)
  schema: FieldSchemaDto[];

  /** Configuración de la estrategia de extracción */
  @ValidateNested()
  @Type(() => StrategyConfigDto)
  strategyConfig: StrategyConfigDto;
}
