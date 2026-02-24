import { Injectable } from '@nestjs/common';
import { FieldSchema } from '../../domain/value-objects';
import { ValidationRule } from '../../domain/enums';

/**
 * Representa un error de validación para un campo extraído.
 */
export interface FieldValidationError {
  /** Nombre del campo que falló la validación */
  fieldName: string;
  /** Regla de validación que falló */
  rule: string;
  /** Valor extraído que causó el fallo (undefined si el campo estaba ausente) */
  extractedValue?: string;
  /** Mensaje de error definido en el schema */
  message: string;
}

/**
 * Servicio que aplica las validaciones definidas en el schema de un extractor
 * contra los valores extraídos por el OCR.
 *
 * Las validaciones se ejecutan campo por campo y regla por regla.
 * Los errores se acumulan como advertencias en el resultado de la extracción.
 */
@Injectable()
export class FieldValidatorService {
  /**
   * Valida los campos extraídos contra el schema del extractor.
   * @param schema - Definición de campos y sus validaciones
   * @param fields - Valores extraídos por la estrategia OCR
   * @returns Lista de errores de validación encontrados
   */
  validate(schema: FieldSchema[], fields: Record<string, any>): FieldValidationError[] {
    const errors: FieldValidationError[] = [];

    for (const fieldDef of schema) {
      const rawValue = fields[fieldDef.fieldName];
      const isEmpty =
        rawValue === null || rawValue === undefined || rawValue === '';

      // Verificar campos requeridos
      if (fieldDef.required && isEmpty) {
        errors.push({
          fieldName: fieldDef.fieldName,
          rule: 'REQUIRED',
          extractedValue: undefined,
          message: `El campo "${fieldDef.fieldName}" es requerido pero no fue extraído.`,
        });
        continue; // No aplica más reglas si el valor está ausente
      }

      // Si el campo no es requerido y no tiene valor, omitir validaciones
      if (isEmpty) continue;

      const value = String(rawValue);

      for (const validation of fieldDef.validations) {
        const passed = this.applyRule(validation.rule, value, validation.params);
        if (!passed) {
          errors.push({
            fieldName: fieldDef.fieldName,
            rule: validation.rule,
            extractedValue: value,
            message:
              validation.errorMessage ??
              `Validación "${validation.rule}" falló para el campo "${fieldDef.fieldName}".`,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Aplica una regla de validación individual al valor dado.
   * @param rule - Regla a aplicar
   * @param value - Valor (convertido a string) a validar
   * @param params - Parámetros de la regla (patron regex, longitud, formato, etc.)
   * @returns true si la validación pasa, false si falla
   */
  private applyRule(rule: ValidationRule, value: string, params: string | any): boolean {
    switch (rule) {
      case ValidationRule.REGEX: {
        try {
          const regex = new RegExp(params);
          return regex.test(value);
        } catch {
          return false; // Patrón inválido → falla la validación
        }
      }

      case ValidationRule.MIN_LENGTH: {
        const min = parseInt(String(params).trim(), 10);
        return !isNaN(min) && value.length >= min;
      }

      case ValidationRule.MAX_LENGTH: {
        const max = parseInt(String(params).trim(), 10);
        return !isNaN(max) && value.length <= max;
      }

      case ValidationRule.DATE_FORMAT: {
        return this.validateDateFormat(value, String(params).trim());
      }

      case ValidationRule.NUMERIC_RANGE: {
        return this.validateNumericRange(value, params);
      }

      case ValidationRule.CUSTOM: {
        // Las reglas personalizadas no se evalúan en este motor
        return true;
      }

      default:
        return true;
    }
  }

  /**
   * Valida que el valor cumpla con el formato de fecha indicado.
   * Soporta: DD/MM/YYYY, YYYY-MM-DD, MM/DD/YYYY, DD-MM-YYYY, YYYY/MM/DD.
   */
  private validateDateFormat(value: string, format: string): boolean {
    const formatPatterns: Record<string, RegExp> = {
      'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
      'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
      'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
      'DD-MM-YYYY': /^\d{2}-\d{2}-\d{4}$/,
      'YYYY/MM/DD': /^\d{4}\/\d{2}\/\d{2}$/,
    };

    const regex = formatPatterns[format.toUpperCase()];
    if (!regex) return true; // Formato desconocido → no se valida

    return regex.test(value);
  }

  /**
   * Valida que el valor numérico esté dentro del rango permitido.
   * params puede ser:
   *   - string: "min,max"  (ej: "0,100")
   *   - object: { min?: number; max?: number }
   */
  private validateNumericRange(value: string, params: string | any): boolean {
    const num = parseFloat(value);
    if (isNaN(num)) return false;

    let min: number | undefined;
    let max: number | undefined;

    if (typeof params === 'string') {
      const parts = params.split(',');
      if (parts[0]?.trim()) min = parseFloat(parts[0].trim());
      if (parts[1]?.trim()) max = parseFloat(parts[1].trim());
    } else if (typeof params === 'object' && params !== null) {
      min = params.min !== undefined ? parseFloat(params.min) : undefined;
      max = params.max !== undefined ? parseFloat(params.max) : undefined;
    }

    if (min !== undefined && !isNaN(min) && num < min) return false;
    if (max !== undefined && !isNaN(max) && num > max) return false;
    return true;
  }
}
