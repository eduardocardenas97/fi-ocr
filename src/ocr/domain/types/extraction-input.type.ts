/**
 * Representa los datos de entrada para una extracción OCR.
 * Contiene la información del archivo a procesar y metadatos
 * adicionales que pueden ser requeridos por la estrategia.
 */
export class ExtractionInput {
  /** URL del archivo a procesar */
  fileUrl: string;

  /** Tipo MIME del archivo (ej: "application/pdf", "image/png") */
  mimeType: string;

  /** Metadatos adicionales para la extracción */
  metadata: Record<string, any>;

  constructor(partial?: Partial<ExtractionInput>) {
    if (partial) {
      Object.assign(this, partial);
    }
    this.metadata = this.metadata ?? {};
  }
}
