import { Extractor } from '../entities/extractor.entity';

/**
 * Interfaz del repositorio para la entidad Extractor.
 * Define las operaciones de persistencia disponibles para
 * gestionar extractores en el almacenamiento de datos.
 *
 * Las implementaciones concretas (ej: MongoExtractorRepository)
 * se encargan de mapear entre la entidad de dominio y el
 * esquema de persistencia correspondiente.
 */
export interface IExtractorRepository {
  /**
   * Guarda un nuevo extractor en el almacenamiento.
   * @param extractor - Entidad extractor a persistir
   * @returns El extractor creado con su ID asignado
   */
  save(extractor: Partial<Extractor>): Promise<Extractor>;

  /**
   * Busca un extractor por su identificador único.
   * @param id - ID del extractor
   * @returns El extractor encontrado o null si no existe
   */
  findById(id: string): Promise<Extractor | null>;

  /**
   * Obtiene una lista de extractores según los filtros proporcionados.
   * @param filter - Criterios de filtrado opcionales
   * @returns Lista de extractores que cumplen con los filtros
   */
  findAll(filter?: Record<string, any>): Promise<Extractor[]>;

  /**
   * Actualiza parcialmente un extractor existente.
   * @param id - ID del extractor a actualizar
   * @param data - Campos a actualizar
   * @returns El extractor actualizado o null si no se encontró
   */
  update(id: string, data: Partial<Extractor>): Promise<Extractor | null>;

  /**
   * Elimina un extractor del almacenamiento.
   * @param id - ID del extractor a eliminar
   * @returns true si fue eliminado exitosamente, false si no se encontró
   */
  delete(id: string): Promise<boolean>;
}

/** Token de inyección para el repositorio de extractores */
export const EXTRACTOR_REPOSITORY = Symbol('IExtractorRepository');
