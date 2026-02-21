/**
 * Reglas de validación disponibles para los campos de un extractor.
 * Cada regla define un tipo de validación que se puede aplicar
 * a los valores extraídos por el OCR.
 */
export enum ValidationRule {
  /** Validación mediante expresión regular */
  REGEX = 'REGEX',
  /** Longitud mínima del valor */
  MIN_LENGTH = 'MIN_LENGTH',
  /** Longitud máxima del valor */
  MAX_LENGTH = 'MAX_LENGTH',
  /** Formato de fecha esperado */
  DATE_FORMAT = 'DATE_FORMAT',
  /** Rango numérico permitido */
  NUMERIC_RANGE = 'NUMERIC_RANGE',
  /** Validación personalizada */
  CUSTOM = 'CUSTOM',
}
