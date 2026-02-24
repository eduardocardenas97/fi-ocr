import { FieldSchema } from "../value-objects";
import { IStrategyConfig } from "../interfaces";

/**
 * Entidad principal (Aggregate Root) que representa un extractor OCR.
 * Un extractor define qué campos se deben extraer de un documento,
 * cómo se validan los valores extraídos y qué estrategia de
 * extracción se utiliza para procesarlos.
 */
export class Extractor {
  /** Identificador único del extractor */
  id: string;

  /** Nombre descriptivo del extractor */
  name: string;

  /** Descripción detallada del propósito del extractor */
  description: string;

  /** Esquema de campos que define qué datos se extraerán */
  schema: FieldSchema[];

  /** Configuración de la estrategia de extracción a utilizar */
  strategyConfig: IStrategyConfig;

  /** Fecha de creación del extractor */
  createdAt: Date;

  /** Fecha de última actualización del extractor */
  updatedAt: Date;

  constructor(partial?: Partial<Extractor>) {
    if (partial) {
      Object.assign(this, partial);
    }
    this.schema = this.schema ?? [];
    this.createdAt = this.createdAt ?? new Date();
    this.updatedAt = this.updatedAt ?? new Date();
  }
}
