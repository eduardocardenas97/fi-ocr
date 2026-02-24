import { Injectable, Inject } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Extractor } from '../../domain/entities/extractor.entity';
import { ExtractionInput } from '../../domain/types/extraction-input.type';
import { ExtractionResult } from '../../domain/types/extraction-result.type';
import {
  IExtractorRepository,
  EXTRACTOR_REPOSITORY,
} from '../../domain/interfaces/extractor-repository.interface';
import { IStrategyConfig } from '../../domain/interfaces/strategy-config.interface';
import { StrategyRegistry } from '../registry/strategy.registry';
import { CreateExtractorDto } from '../dto/create-extractor.dto';
import { UpdateExtractorDto } from '../dto/update-extractor.dto';
import { FilterExtractorDto } from '../dto/filter-extractor.dto';
import { GeneralError } from '../../../utils/classes';
import { FieldValidatorService } from './field-validator.service';
import { ExtractionWarning } from '../../domain/types';

/**
 * Servicio de aplicación para la gestión de extractores OCR.
 * Orquesta las operaciones CRUD y la ejecución de extracciones,
 * delegando la persistencia al repositorio y la extracción
 * a la estrategia correspondiente a través del registry.
 */
@Injectable({ scope: 2 }) // Scope.REQUEST
export class ExtractorService {
  private log;

  constructor(
    @Inject(EXTRACTOR_REPOSITORY)
    private readonly repository: IExtractorRepository,
    private readonly strategyRegistry: StrategyRegistry,
    private readonly fieldValidator: FieldValidatorService,
    @Inject(CONTEXT) private readonly context: any,
  ) {
    this.log = this.context.log;
  }

  /**
   * Crea un nuevo extractor en el sistema.
   * Valida la configuración de la estrategia antes de persistir.
   * @param dto - Datos del extractor a crear
   * @returns El extractor creado con su ID asignado
   */
  async createExtractor(dto: CreateExtractorDto): Promise<Extractor> {
    try {
      this.log.debug(`Creando extractor: ${dto.name}`);

      // Verificar si ya existe un extractor con el mismo nombre
      const existingExtractor = await this.repository.findByName(dto.name);
      if (existingExtractor) {
        throw new GeneralError(`Ya existe un extractor con el nombre: ${dto.name}`, { code: 'CONFLICT', idReq: this.log?.id?.value });
      }

      // Validar que la estrategia exista y la configuración sea válida
      this.validateStrategyConfig(dto.strategyConfig);

      const extractor = await this.repository.save({
        name: dto.name,
        description: dto.description,
        schema: dto.schema as any,
        strategyConfig: dto.strategyConfig as IStrategyConfig,
      });

      this.log.debug(`Extractor creado exitosamente: ${extractor.id}`);
      return extractor;
    } catch (error) {
      this.log.error(`Error al crear extractor: ${error.message}`);
      throw error instanceof GeneralError ? error : new GeneralError(error.message, { code: 'INTERNAL_SERVER_ERROR', idReq: this.log?.id?.value });
    }
  }

  /**
   * Ejecuta una extracción OCR usando el extractor y la estrategia configurada.
   * @param extractorId - ID del extractor a utilizar
   * @param input - Datos del archivo a procesar
   * @returns Resultado de la extracción con campos, confianza y advertencias
   */
  async runExtraction(extractorId: string, input: ExtractionInput): Promise<ExtractionResult> {
    try {
      this.log.debug(`Ejecutando extracción con extractor: ${extractorId}`);

      const extractor = await this.repository.findById(extractorId);

      this.log.debug(`Extractor encontrado: ${extractor ? extractor.name : 'No encontrado'}`);

      if (!extractor) {
        throw new GeneralError(`Extractor no encontrado: ${extractorId}`, { code: 'NOT_FOUND', idReq: this.log?.id?.value });
      }

      // Pasar el nombre del extractor y el schema en los metadatos para que la estrategia lo use
      const enrichedInput = new ExtractionInput({
        ...input,
        metadata: {
          ...input.metadata,
          extractorName: extractor.name,
          fieldSchemas: extractor.schema,
        },
      });

      this.log.debug(`Estrategia a utilizar: ${extractor.strategyConfig.strategyType}`);

      const strategy = this.strategyRegistry.resolve(extractor.strategyConfig.strategyType);

      this.log.debug(`Estrategia encontrada: ${strategy ? strategy.strategyType : 'No encontrada'}`);

      const result = await strategy.extract(enrichedInput, extractor.strategyConfig);

      // Aplicar validaciones del schema contra los valores extraídos
      const validationErrors = this.fieldValidator.validate(extractor.schema, result.fields);
      if (validationErrors.length > 0) {
        const warnings: ExtractionWarning[] = validationErrors.map(
          (e) => new ExtractionWarning({
            field: e.fieldName,
            rule: e.rule,
            extractedValue: e.extractedValue,
            message: e.message,
          }),
        );
        result.warnings.push(...warnings);
        this.log.warn(
          `Extracción con ${validationErrors.length} advertencia(s) de validación: ${JSON.stringify(warnings)}`,
        );
      }

      this.log.debug(
        `Extracción completada. Confianza: ${result.confidence}, Campos: ${Object.keys(result.fields).length}, Advertencias: ${result.warnings.length}`,
      );
      return result;
    } catch (error) {
      this.log.error(`Error en la extracción: ${error.message}`);
      throw error instanceof GeneralError ? error : new GeneralError(error.message, { code: 'INTERNAL_SERVER_ERROR', idReq: this.log?.id?.value });
    }
  }

  /**
   * Obtiene un extractor por su ID.
   * @param id - ID del extractor
   * @returns El extractor encontrado
   */
  async findById(id: string): Promise<Extractor> {
    try {
      this.log.debug(`Buscando extractor: ${id}`);
      const extractor = await this.repository.findById(id);
      if (!extractor) {
        throw new GeneralError(`Extractor no encontrado: ${id}`, { code: 'NOT_FOUND', idReq: this.log?.id?.value });
      }
      this.log.debug(`Extractor encontrado: ${extractor.name}`);
      return extractor;
    } catch (error) {
      this.log.error(`Error al buscar extractor: ${error.message}`);
      throw error instanceof GeneralError ? error : new GeneralError(error.message, { code: 'INTERNAL_SERVER_ERROR', idReq: this.log?.id?.value });
    }
  }

  /**
   * Obtiene todos los extractores, opcionalmente filtrados.
   * @param filter - Filtros opcionales (nombre, tipo de estrategia)
   * @returns Lista de extractores
   */
  async findAll(filter?: FilterExtractorDto): Promise<Extractor[]> {
    try {
      this.log.debug(`Obteniendo extractores con filtros: ${JSON.stringify(filter ?? {})}`);
      const extractors = await this.repository.findAll(filter);
      this.log.debug(`Extractores encontrados: ${extractors.length}`);
      return extractors;
    } catch (error) {
      this.log.error(`Error al obtener extractores: ${error.message}`);
      throw new GeneralError(error.message, { code: 'INTERNAL_SERVER_ERROR', idReq: this.log?.id?.value });
    }
  }

  /**
   * Actualiza parcialmente un extractor existente.
   * Si se actualiza la estrategia, valida la nueva configuración.
   * @param id - ID del extractor a actualizar
   * @param dto - Campos a actualizar
   * @returns El extractor actualizado
   */
  async updateExtractor(id: string, dto: UpdateExtractorDto): Promise<Extractor> {
    try {
      this.log.debug(`Actualizando extractor: ${id}`);

      // Si se actualiza el nombre, verificar que no exista otro con el mismo nombre
      if (dto.name) {
        const existingExtractor = await this.repository.findByName(dto.name);
        if (existingExtractor && existingExtractor.id !== id) {
          throw new GeneralError(`Ya existe un extractor con el nombre: ${dto.name}`, { code: 'CONFLICT', idReq: this.log?.id?.value });
        }
      }

      // Si se actualiza la configuración de estrategia, validarla
      if (dto.strategyConfig?.strategyType) {
        this.validateStrategyConfig(dto.strategyConfig as any);
      }

      const extractor = await this.repository.update(id, dto as Partial<Extractor>);
      if (!extractor) {
        throw new GeneralError(`Extractor no encontrado: ${id}`, { code: 'NOT_FOUND', idReq: this.log?.id?.value });
      }

      this.log.debug(`Extractor actualizado exitosamente: ${id}`);
      return extractor;
    } catch (error) {
      this.log.error(`Error al actualizar extractor: ${error.message}`);
      throw error instanceof GeneralError ? error : new GeneralError(error.message, { code: 'INTERNAL_SERVER_ERROR', idReq: this.log?.id?.value });
    }
  }

  /**
   * Elimina un extractor del sistema.
   * @param id - ID del extractor a eliminar
   * @returns true si fue eliminado exitosamente
   */
  async deleteExtractor(id: string): Promise<boolean> {
    try {
      this.log.debug(`Eliminando extractor: ${id}`);
      const deleted = await this.repository.delete(id);
      if (!deleted) {
        throw new GeneralError(`Extractor no encontrado: ${id}`, { code: 'NOT_FOUND', idReq: this.log?.id?.value });
      }
      this.log.debug(`Extractor eliminado exitosamente: ${id}`);
      return true;
    } catch (error) {
      this.log.error(`Error al eliminar extractor: ${error.message}`);
      throw error instanceof GeneralError ? error : new GeneralError(error.message, { code: 'INTERNAL_SERVER_ERROR', idReq: this.log?.id?.value });
    }
  }

  /**
   * Valida que la configuración de estrategia sea correcta.
   * Verifica que el tipo de estrategia exista en el registry
   * y que la configuración sea válida según la estrategia.
   */
  private validateStrategyConfig(config: { strategyType: string; [key: string]: any }): void {
    const strategy = this.strategyRegistry.resolve(config.strategyType);
    const isValid = strategy.validateConfig(config as IStrategyConfig);
    if (!isValid) {
      throw new GeneralError(
        `Configuración inválida para la estrategia: ${config.strategyType}`,
        { code: 'BAD_USER_INPUT', idReq: this.log?.id?.value },
      );
    }
  }
}
