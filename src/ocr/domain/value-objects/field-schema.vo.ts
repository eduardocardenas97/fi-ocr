import { FieldValidation } from './field-validation.vo';

/**
 * Representa el esquema de un campo dentro de un extractor.
 * Define la estructura esperada de cada campo que será extraído
 * desde un documento, incluyendo su nombre, tipo, si es requerido
 * y las validaciones que debe cumplir.
 */
export class FieldSchema {
  /** Nombre identificador del campo (ej: "numero_documento", "fecha_emision") */
  fieldName: string;

  /** Tipo de dato esperado del campo (ej: "string", "number", "date") */
  fieldType: string;

  /** Indica si el campo es obligatorio en la extracción */
  required: boolean;

  /** Descripción del campo (útil para LLMs y documentación) */
  description?: string;

  /** Lista de validaciones que se aplicarán al valor extraído */
  validations: FieldValidation[];

  constructor(partial?: Partial<FieldSchema>) {
    if (partial) {
      Object.assign(this, partial);
    }
    this.validations = this.validations ?? [];
  }
}
