/**
 * Interfaz base para la configuración de una estrategia de extracción.
 * Cada estrategia concreta (ej: FiDeo, PaddleOCR, MistralOCR)
 * implementa esta interfaz con sus propios campos de configuración.
 *
 * El campo `strategyType` actúa como discriminador para identificar
 * qué tipo de configuración se está usando. En MongoDB se persiste
 * como un discriminated union usando `strategyType` como discriminador.
 */
export interface IStrategyConfig {
  /** Identificador del tipo de estrategia (ej: "FI_DEO", "PADDLE_OCR") */
  strategyType: string;
}
