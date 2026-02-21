import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExtractorService } from '../application/services/extractor.service';

/**
 * Resolver de GraphQL para el módulo de extractores OCR.
 * Expone las operaciones de consulta y mutación definidas
 * en el schema GraphQL (ocr.graphql) en español.
 */
@Resolver('Extractor')
export class ExtractorResolver {
  constructor(private readonly extractorService: ExtractorService) {}

  // ────────────────────────────────
  // Queries
  // ────────────────────────────────

  /**
   * Query: extractor(id) — Obtiene un extractor por su ID
   */
  @Query('extractor')
  async extractor(@Args('id') id: string) {
    const result = await this.extractorService.findById(id);
    return this.mapExtractorToGql(result);
  }

  /**
   * Query: extractores(filtro) — Obtiene la lista de extractores
   */
  @Query('extractores')
  async extractores(@Args('filtro') filtro?: any) {
    const filter = filtro
      ? {
          name: filtro.nombre,
          strategyType: filtro.tipoEstrategia,
        }
      : undefined;

    const results = await this.extractorService.findAll(filter);
    return results.map((e) => this.mapExtractorToGql(e));
  }

  // ────────────────────────────────
  // Mutations
  // ────────────────────────────────

  /**
   * Mutation: crearExtractor(input) — Crea un nuevo extractor
   */
  @Mutation('crearExtractor')
  async crearExtractor(@Args('input') input: any) {
    const dto = {
      name: input.nombre,
      description: input.descripcion,
      schema: (input.esquemaCampos ?? []).map((campo: any) => ({
        fieldName: campo.nombreCampo,
        fieldType: campo.tipoCampo,
        required: campo.requerido,
        description: campo.descripcion,
        validations: (campo.validaciones ?? []).map((v: any) => ({
          rule: this.mapReglaToRule(v.regla),
          params: v.parametros,
          errorMessage: v.mensajeError,
        })),
      })),
      strategyConfig: {
        strategyType: input.configuracionEstrategia.tipoEstrategia,
      },
    };

    const result = await this.extractorService.createExtractor(dto);
    return this.mapExtractorToGql(result);
  }

  /**
   * Mutation: actualizarExtractor(id, input) — Actualiza un extractor existente
   */
  @Mutation('actualizarExtractor')
  async actualizarExtractor(@Args('id') id: string, @Args('input') input: any) {
    const dto: any = {};

    if (input.nombre !== undefined) dto.name = input.nombre;
    if (input.descripcion !== undefined) dto.description = input.descripcion;
    if (input.esquemaCampos !== undefined) {
      dto.schema = input.esquemaCampos.map((campo: any) => ({
        fieldName: campo.nombreCampo,
        fieldType: campo.tipoCampo,
        required: campo.requerido,
        description: campo.descripcion,
        validations: (campo.validaciones ?? []).map((v: any) => ({
          rule: this.mapReglaToRule(v.regla),
          params: v.parametros,
          errorMessage: v.mensajeError,
        })),
      }));
    }
    if (input.configuracionEstrategia !== undefined) {
      dto.strategyConfig = {
        strategyType: input.configuracionEstrategia.tipoEstrategia,
      };
    }

    const result = await this.extractorService.updateExtractor(id, dto);
    return this.mapExtractorToGql(result);
  }

  /**
   * Mutation: eliminarExtractor(id) — Elimina un extractor
   */
  @Mutation('eliminarExtractor')
  async eliminarExtractor(@Args('id') id: string): Promise<boolean> {
    return this.extractorService.deleteExtractor(id);
  }

  /**
   * Mutation: ejecutarExtraccion(id, input) — Ejecuta una extracción OCR
   */
  @Mutation('ejecutarExtraccion')
  async ejecutarExtraccion(@Args('id') id: string, @Args('input') input: any) {
    const extractionInput = {
      fileUrl: input.urlArchivo,
      mimeType: input.tipoMime,
      metadata: input.metadatos ?? {},
    };

    const result = await this.extractorService.runExtraction(id, extractionInput);

    return {
      campos: result.fields,
      confianza: result.confidence,
      advertencias: result.warnings,
    };
  }

  // ────────────────────────────────
  // Mappers privados
  // ────────────────────────────────

  /**
   * Mapea una entidad Extractor del dominio al tipo GraphQL en español.
   */
  private mapExtractorToGql(extractor: any) {
    return {
      id: extractor.id,
      nombre: extractor.name,
      descripcion: extractor.description,
      esquemaCampos: (extractor.schema ?? []).map((s: any) => ({
        nombreCampo: s.fieldName,
        tipoCampo: s.fieldType,
        requerido: s.required,
        descripcion: s.description,
        validaciones: (s.validations ?? []).map((v: any) => ({
          regla: this.mapRuleToRegla(v.rule),
          parametros: v.params,
          mensajeError: v.errorMessage,
        })),
      })),
      configuracionEstrategia: {
        tipoEstrategia: extractor.strategyConfig?.strategyType,
      },
      creadoEn: extractor.createdAt?.toISOString?.() ?? extractor.createdAt,
      actualizadoEn: extractor.updatedAt?.toISOString?.() ?? extractor.updatedAt,
    };
  }

  /**
   * Mapea las reglas de validación del enum GraphQL (español) al dominio (inglés).
   */
  private mapReglaToRule(regla: string): string {
    const map: Record<string, string> = {
      REGEX: 'REGEX',
      LONGITUD_MINIMA: 'MIN_LENGTH',
      LONGITUD_MAXIMA: 'MAX_LENGTH',
      FORMATO_FECHA: 'DATE_FORMAT',
      RANGO_NUMERICO: 'NUMERIC_RANGE',
      PERSONALIZADO: 'CUSTOM',
    };
    return map[regla] ?? regla;
  }

  /**
   * Mapea las reglas de validación del dominio (inglés) al enum GraphQL (español).
   */
  private mapRuleToRegla(rule: string): string {
    const map: Record<string, string> = {
      REGEX: 'REGEX',
      MIN_LENGTH: 'LONGITUD_MINIMA',
      MAX_LENGTH: 'LONGITUD_MAXIMA',
      DATE_FORMAT: 'FORMATO_FECHA',
      NUMERIC_RANGE: 'RANGO_NUMERICO',
      CUSTOM: 'PERSONALIZADO',
    };
    return map[rule] ?? rule;
  }
}
