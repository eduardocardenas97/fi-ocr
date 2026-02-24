import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { ValidationRule } from "../../domain/enums/validation-rule.enum";

/**
 * DTO para validaciones de campo en actualización (todos los campos opcionales).
 */
export class UpdateFieldValidationDto {
  @IsOptional()
  @IsEnum(ValidationRule)
  rule?: ValidationRule;

  @IsOptional()
  @IsString()
  params?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}

/**
 * DTO para esquema de campo en actualización (todos los campos opcionales).
 */
export class UpdateFieldSchemaDto {
  @IsOptional()
  @IsString()
  fieldName?: string;

  @IsOptional()
  @IsString()
  fieldType?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFieldValidationDto)
  validations?: UpdateFieldValidationDto[];
}

/**
 * DTO para configuración de estrategia en actualización.
 */
export class UpdateStrategyConfigDto {
  @IsOptional()
  @IsString()
  strategyType?: string;

  @IsOptional()
  @IsString()
  endpoint?: string;

  @IsOptional()
  @IsString()
  apiKey?: string;
}

/**
 * DTO para la actualización parcial de un extractor existente.
 * Todos los campos son opcionales, permitiendo actualizaciones parciales.
 */
export class UpdateExtractorDto {
  /** Nombre descriptivo del extractor */
  @IsOptional()
  @IsString()
  name?: string;

  /** Descripción del propósito del extractor */
  @IsOptional()
  @IsString()
  description?: string;

  /** Esquema de campos a extraer */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFieldSchemaDto)
  schema?: UpdateFieldSchemaDto[];

  /** Configuración de la estrategia de extracción */
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStrategyConfigDto)
  strategyConfig?: UpdateStrategyConfigDto;
}
