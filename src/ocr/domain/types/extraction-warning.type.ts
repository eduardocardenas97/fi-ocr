/**
 * Representa una advertencia de validación estructurada
 * generada al comparar los valores extraídos contra el schema
 * del extractor.
 */
export class ExtractionWarning {
  /** Nombre del campo que no superó la validación */
  field: string;

  /** Regla de validación que falló (ej: REGEX, MIN_LENGTH, REQUIRED) */
  rule: string;

  /** Valor extraído que causó el fallo (undefined si el campo estaba ausente) */
  extractedValue?: string;

  /** Mensaje de error definido en el schema del extractor */
  message: string;

  constructor(partial: ExtractionWarning) {
    Object.assign(this, partial);
  }
}
