import { ExtractionInput } from "../types/extraction-input.type";
import { ExtractionResult } from "../types/extraction-result.type";
import { IStrategyConfig } from "./strategy-config.interface";

/**
 * Interfaz que define el contrato para una estrategia de extracción OCR.
 * Cada estrategia concreta implementa esta interfaz con su propio tipo
 * de configuración (genérico C) que extiende de IStrategyConfig.
 *
 * Permite agregar nuevas estrategias de extracción sin modificar
 * el código existente (principio Open/Closed).
 *
 * @template C - Tipo de configuración específica de la estrategia
 */
export interface IExtractionStrategy<
  C extends IStrategyConfig = IStrategyConfig,
> {
  /** Identificador del tipo de estrategia */
  readonly strategyType: string;

  /**
   * Ejecuta la extracción de datos desde un archivo usando esta estrategia.
   * @param input - Datos del archivo a procesar (URL, tipo MIME, metadatos)
   * @param config - Configuración específica de esta estrategia
   * @returns Resultado de la extracción con campos, confianza y advertencias
   */
  extract(input: ExtractionInput, config: C): Promise<ExtractionResult>;

  /**
   * Valida que la configuración proporcionada sea correcta para esta estrategia.
   * @param config - Configuración a validar
   * @returns true si la configuración es válida
   */
  validateConfig(config: C): boolean;
}
