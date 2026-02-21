/**
 * Representa el resultado de una extracción OCR.
 * Contiene los campos extraídos, el nivel de confianza
 * de la extracción y cualquier advertencia generada
 * durante el proceso.
 */
export class ExtractionResult {
  /** Campos extraídos del documento (clave: nombre del campo, valor: dato extraído) */
  fields: Record<string, any>;

  /** Nivel de confianza de la extracción (0.0 a 1.0) */
  confidence: number;

  /** Advertencias generadas durante la extracción */
  warnings: string[];

  /** Metadatos adicionales del resultado de la extracción */
  metadata?: Record<string, any>;

  constructor(partial?: Partial<ExtractionResult>) {
    if (partial) {
      Object.assign(this, partial);
    }
    this.fields = this.fields ?? {};
    this.warnings = this.warnings ?? [];
    this.confidence = this.confidence ?? 0;
    this.metadata = this.metadata ?? {};
  }
}
