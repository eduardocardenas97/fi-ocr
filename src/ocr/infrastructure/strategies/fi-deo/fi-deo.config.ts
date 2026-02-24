import { IStrategyConfig } from "../../../domain/interfaces/strategy-config.interface";

/**
 * Configuración específica para la estrategia de extracción FiDeo.
 * El endpoint y API key se leen desde variables de entorno por seguridad.
 */
export class FiDeoConfig implements IStrategyConfig {
  /** Tipo de estrategia — siempre "FI_DEO" */
  readonly strategyType = "FI_DEO";

  constructor(partial?: Partial<FiDeoConfig>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
