import { Injectable } from '@nestjs/common';
import { IExtractionStrategy } from '../../domain/interfaces/extraction-strategy.interface';
import { IStrategyConfig } from '../../domain/interfaces/strategy-config.interface';

/**
 * Registro centralizado de estrategias de extracción OCR.
 * Permite registrar y resolver estrategias por su tipo,
 * siguiendo el patrón Strategy + Registry para desacoplar
 * la selección de la estrategia concreta del servicio.
 */
@Injectable()
export class StrategyRegistry {
  /** Mapa de estrategias registradas, indexadas por su tipo */
  private readonly strategies = new Map<string, IExtractionStrategy>();

  /**
   * Registra una nueva estrategia en el registry.
   * @param strategy - Estrategia a registrar
   */
  register(strategy: IExtractionStrategy<IStrategyConfig>): void {
    this.strategies.set(strategy.strategyType, strategy);
  }

  /**
   * Resuelve una estrategia por su tipo.
   * @param strategyType - Tipo de estrategia a buscar (ej: "FI_DEO")
   * @returns La estrategia correspondiente
   * @throws Error si no existe una estrategia registrada para el tipo dado
   */
  resolve(strategyType: string): IExtractionStrategy {
    const strategy = this.strategies.get(strategyType);
    if (!strategy) {
      throw new Error(
        `Estrategia de extracción no encontrada: "${strategyType}". ` +
          `Estrategias disponibles: ${this.getAvailableTypes().join(', ')}`,
      );
    }
    return strategy;
  }

  /**
   * Obtiene la lista de tipos de estrategia disponibles.
   * @returns Array con los identificadores de las estrategias registradas
   */
  getAvailableTypes(): string[] {
    return Array.from(this.strategies.keys());
  }
}
