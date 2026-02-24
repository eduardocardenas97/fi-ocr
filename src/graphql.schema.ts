/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ReglaValidacion {
  REGEX = "REGEX",
  LONGITUD_MINIMA = "LONGITUD_MINIMA",
  LONGITUD_MAXIMA = "LONGITUD_MAXIMA",
  FORMATO_FECHA = "FORMATO_FECHA",
  RANGO_NUMERICO = "RANGO_NUMERICO",
  PERSONALIZADO = "PERSONALIZADO",
}

export enum CacheControlScope {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export class ValidacionCampoInput {
  regla: ReglaValidacion;
  parametros?: Nullable<string>;
  mensajeError?: Nullable<string>;
}

export class EsquemaCampoInput {
  nombreCampo: string;
  tipoCampo: string;
  requerido: boolean;
  descripcion?: Nullable<string>;
  validaciones?: Nullable<ValidacionCampoInput[]>;
}

export class ConfiguracionEstrategiaInput {
  tipoEstrategia: string;
}

export class CrearExtractorInput {
  nombre: string;
  descripcion?: Nullable<string>;
  esquemaCampos: EsquemaCampoInput[];
  configuracionEstrategia: ConfiguracionEstrategiaInput;
}

export class ActualizarExtractorInput {
  nombre?: Nullable<string>;
  descripcion?: Nullable<string>;
  esquemaCampos?: Nullable<EsquemaCampoInput[]>;
  configuracionEstrategia?: Nullable<ConfiguracionEstrategiaInput>;
}

export class ArchivoExtraccionInput {
  urlArchivo: string;
  tipoMime: string;
  metadatos?: Nullable<JSON>;
}

export class FiltroExtractorInput {
  nombre?: Nullable<string>;
  tipoEstrategia?: Nullable<string>;
}

export interface MutationResponse {
  code: number;
  success: boolean;
  message: string;
}

export class Demo {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

export abstract class IQuery {
  abstract demos(): Demo[] | Promise<Demo[]>;

  abstract demo(id: string): Nullable<Demo> | Promise<Nullable<Demo>>;

  abstract extractor(
    id: string,
  ): Nullable<Extractor> | Promise<Nullable<Extractor>>;

  abstract extractores(
    filtro?: Nullable<FiltroExtractorInput>,
  ): Extractor[] | Promise<Extractor[]>;
}

export class ValidacionCampo {
  regla: ReglaValidacion;
  parametros?: Nullable<string>;
  mensajeError?: Nullable<string>;
}

export class EsquemaCampo {
  nombreCampo: string;
  tipoCampo: string;
  requerido: boolean;
  descripcion?: Nullable<string>;
  validaciones?: Nullable<ValidacionCampo[]>;
}

export class ConfiguracionEstrategia {
  tipoEstrategia: string;
}

export class Extractor {
  id: string;
  nombre: string;
  descripcion?: Nullable<string>;
  esquemaCampos: EsquemaCampo[];
  configuracionEstrategia: ConfiguracionEstrategia;
  creadoEn: string;
  actualizadoEn: string;
}

export class AdvertenciaValidacion {
  campo: string;
  regla: string;
  valorExtraido?: Nullable<string>;
  mensaje: string;
}

export class ResultadoExtraccion {
  campos: JSON;
  confianza: number;
  advertencias?: Nullable<AdvertenciaValidacion[]>;
}

export abstract class IMutation {
  abstract crearExtractor(
    input: CrearExtractorInput,
  ): Extractor | Promise<Extractor>;

  abstract actualizarExtractor(
    id: string,
    input: ActualizarExtractorInput,
  ): Extractor | Promise<Extractor>;

  abstract eliminarExtractor(id: string): boolean | Promise<boolean>;

  abstract ejecutarExtraccion(
    id: string,
    input: ArchivoExtraccionInput,
  ): ResultadoExtraccion | Promise<ResultadoExtraccion>;
}

export type JSON = any;
type Nullable<T> = T | null;
